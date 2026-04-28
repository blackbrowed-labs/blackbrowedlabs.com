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
 *      Graceful degradation per A12 §7.2: a submission with no
 *      Turnstile token (no-JS path) is allowed through; the
 *      rate-limit + honeypot checks above already protect that
 *      path. Failed verify → 303 ?error=turnstile.
 *   5. Validate name / email / message presence + email shape.
 *      Failed → 303 ?error=validation.
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
import { createMimeMessage } from 'mimetext';

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

  // 4. Turnstile siteverify (graceful degradation if no token).
  const turnstileToken = readField(formData, 'cf-turnstile-response');
  if (turnstileToken) {
    const verified = await verifyTurnstile(
      turnstileToken,
      env.TURNSTILE_SECRET_KEY,
      cfConnectingIp,
    );
    if (!verified) {
      return redirectTo(returnTo, '?error=turnstile');
    }
  }
  // No-JS path: rate-limit + honeypot already protect this submission.

  // 5. Validate user-facing fields.
  const name = readField(formData, 'name');
  const email = readField(formData, 'email');
  const message = readField(formData, 'message');
  if (!name || !email || !message || !isLikelyEmail(email)) {
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
    mime.setHeader('Reply-To', email);
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
