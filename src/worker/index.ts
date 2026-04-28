/**
 * Cloudflare Worker entrypoint for blackbrowedlabs.com.
 *
 * Single purpose: route POST /api/contact to the contact-form
 * handler in src/worker/contact.ts; everything else falls through
 * to env.ASSETS.fetch(request) so the static site (Astro build
 * output in ./dist) serves as it did pre-Phase-B.1.
 *
 * The handler is dynamically imported so the cold-start cost of
 * mimetext + cloudflare:email is paid only on submissions, not on
 * the static-asset traffic that dominates this site.
 */

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    if (request.method === 'POST' && url.pathname === '/api/contact') {
      const { handleContactSubmission } = await import('./contact');
      return handleContactSubmission(request, env, ctx);
    }

    return env.ASSETS.fetch(request);
  },
} satisfies ExportedHandler<Env>;
