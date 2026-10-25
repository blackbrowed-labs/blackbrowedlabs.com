/**
 * POST /api/contact handler — Phase B.1 contact form.
 *
 * Order of operations on every submission:
 *   1. Parse form data. Malformed body → ?error=validation.
 *   2. Honeypot drop — if the `website` field is non-empty, return
 *      303 success silently. Never tip the bot.
 *   3. Workers Rate Limit binding — 5 submissions per 60s per IP.
 *      Exceeded → 303 ?error=rate_limit.
 *   4. Turnstile siteverify against challenges.cloudflare.com.
 *      Mandatory: a missing, empty, or siteverify-rejected token →
 *      303 ?error=turnstile. The earlier "graceful degradation for
 *      the no-JS path" was closed in G B.1.3 after sustained
 *      direct-POST spam exploited exactly that branch.
 *   5. Validate name / email / message presence + email shape,
 *      and run heuristic content filters (length bounds, URL-count
 *      ceiling, URL-in-name guard). Failed → 303 ?error=validation.
 *      Heuristic rejections intentionally fold into the same visible
 *      code as shape rejections — a specific message would help a
 *      spammer tune.
 *   6. Build a MIME message with mimetext, send via env.EMAIL
 *      (cloudflare:email's send_email binding from the .com Worker
 *      out via .de Email Routing → IONOS lars@blackbrowedlabs.com).
 *      Caller's email goes in the Reply-To header so a reply
 *      addresses them. Send failure → 303 ?error=server.
 *   7. Success → 303 ?ok=1.
 *
 * Locale-aware redirects use the hidden `_returnTo` form field
 * rendered by the contact page per locale (`/kontakt` for DE,
 * `/en/contact` for EN). _returnTo is validated against an
 * allowlist so it cannot be used as an open-redirect vector.
 */

import { EmailMessage } from 'cloudflare:email';
import { createMimeMessage, Mailbox } from 'mimetext';

const ALLOWED_RETURN_TO = new Set(['/kontakt', '/en/contact']);
const DEFAULT_RETURN_TO = '/kontakt';

const TURNSTILE_VERIFY_ENDPOINT =
  'https://challenges.cloudflare.com/turnstile/v0/siteverify';

const FROM_ADDRESS = 'noreply@blackbrowedlabs.de';
const TO_ADDRESS = 'lars@blackbrowedlabs.com';

export async function handleContactSubmission(
  request: Request,
  env: Env,
  _ctx: ExecutionContext,
): Promise<Response> {
  // 1. Parse form data.
  const formData = await request.formData().catch(() => null);
  if (!formData) {
    return redirectTo(DEFAULT_RETURN_TO, '?error=validation');
  }

  const returnTo = pickReturnTo(formData.get('_returnTo'));

  // 2. Honeypot drop (silent success).
  const honeypot = readField(formData, 'website');
  if (honeypot) {
    return redirectTo(returnTo, '?ok=1');
  }

  // 3. Rate limit by visitor IP.
  const cfConnectingIp = request.headers.get('CF-Connecting-IP') ?? 'unknown';
  const limited = await env.CONTACT_RATELIMIT.limit({ key: cfConnectingIp });
  if (!limited.success) {
    return redirectTo(returnTo, '?error=rate_limit');
  }

  // 4. Turnstile siteverify (mandatory — see docstring step 4).
  const turnstileToken = readField(formData, 'cf-turnstile-response');
  const turnstileVerified =
    turnstileToken.length > 0 &&
    (await verifyTurnstile(
      turnstileToken,
      env.TURNSTILE_SECRET_KEY,
      cfConnectingIp,
    ));
  if (!turnstileVerified) {
    return redirectTo(returnTo, '?error=turnstile');
  }

  // 5. Validate user-facing fields + heuristic content filters.
  const name = readField(formData, 'name');
  const email = readField(formData, 'email');
  const message = readField(formData, 'message');
  if (!name || !email || !message || !isLikelyEmail(email)) {
    return redirectTo(returnTo, '?error=validation');
  }
  if (looksLikeSpam(name, email, message)) {
    return redirectTo(returnTo, '?error=validation');
  }

  // 6. Build + send.
  if (!env.EMAIL) {
    // Should be impossible at runtime since the binding is required
    // per env, but the wrangler-typed shape is `SendEmail | undefined`.
    // Fail loud and visible if a misconfigured env reaches here.
    console.error('contact-form: EMAIL binding missing on env');
    return redirectTo(returnTo, '?error=server');
  }

  try {
    const mime = createMimeMessage();
    mime.setSender({ name: 'Blackbrowed Labs', addr: FROM_ADDRESS });
    mime.setRecipient(TO_ADDRESS);
    mime.setSubject(`[blackbrowedlabs.com] Kontaktformular — ${name}`);
    // mimetext requires Reply-To as a Mailbox instance (not a bare
    // string). Omit the visitor's display name from the header to
    // sidestep header-injection risk; the name is in the body.
    mime.setHeader('Reply-To', new Mailbox({ addr: email }));
    mime.addMessage({
      contentType: 'text/plain',
      data: [
        `Name: ${name}`,
        `E-Mail: ${email}`,
        '',
        message,
        '',
        '—',
        `IP: ${cfConnectingIp}`,
        `Submitted via: ${returnTo}`,
      ].join('\n'),
    });

    const emailMessage = new EmailMessage(FROM_ADDRESS, TO_ADDRESS, mime.asRaw());
    await env.EMAIL.send(emailMessage);
  } catch (err) {
    console.error('contact-form: send_email failed', err);
    return redirectTo(returnTo, '?error=server');
  }

  // 7. Success.
  return redirectTo(returnTo, '?ok=1');
}

function redirectTo(path: string, query: string): Response {
  return new Response(null, {
    status: 303,
    headers: { Location: `${path}${query}` },
  });
}

function pickReturnTo(raw: FormDataEntryValue | null): string {
  if (typeof raw !== 'string') return DEFAULT_RETURN_TO;
  return ALLOWED_RETURN_TO.has(raw) ? raw : DEFAULT_RETURN_TO;
}

function readField(formData: FormData, key: string): string {
  const value = formData.get(key);
  if (typeof value !== 'string') return '';
  return value.trim();
}

async function verifyTurnstile(
  token: string,
  secret: string,
  remoteIp: string,
): Promise<boolean> {
  const body = new FormData();
  body.set('secret', secret);
  body.set('response', token);
  body.set('remoteip', remoteIp);

  try {
    const res = await fetch(TURNSTILE_VERIFY_ENDPOINT, {
      method: 'POST',
      body,
    });
    if (!res.ok) return false;
    const data = (await res.json()) as { success?: boolean };
    return data.success === true;
  } catch (err) {
    console.error('contact-form: Turnstile siteverify request failed', err);
    return false;
  }
}

function isLikelyEmail(value: string): boolean {
  // Loose RFC-5322-shaped check. Server-side validation is intentionally
  // permissive — Cloudflare Email Routing (which IONOS-side delivers)
  // rejects malformed addresses with more authority than a regex. We
  // just guard against obvious junk that wouldn't be deliverable.
  return /^\S+@\S+\.\S+$/.test(value);
}

function looksLikeSpam(name: string, email: string, message: string): boolean {
  // Heuristics: cheap, server-only, no deps, and shaped so a real
  // human writing in DE or EN does not hit them. On the first match
  // the submission is dropped into ?error=validation — same visible
  // code as a shape rejection, to avoid giving a spammer feedback
  // that would help them tune. Added G B.1.3.
  if (message.length < 10) return true;
  if (message.length > 5000) return true;
  if (name.length > 100) return true;
  if (email.length > 254) return true; // RFC 5321 §4.5.3.1.3 cap.
  if (/https?:\/\//i.test(name)) return true;
  const urlMatches = message.match(/https?:\/\//gi);
  if (urlMatches && urlMatches.length > 2) return true;
  return false;
}
