/**
 * Per-environment robots.txt.
 * - staging: disallow everything (staging protection triad member #3).
 * - production / development: allow everything.
 *
 * The other two triad members live elsewhere:
 * - <meta name="robots" content="noindex, nofollow"> in BaseLayout.
 * - X-Robots-Tag response header via scripts/build-headers.mjs → _headers.
 */

import type { APIRoute } from 'astro';
import { isStaging } from '../lib/env';

export const GET: APIRoute = () => {
  const body = isStaging()
    ? 'User-agent: *\nDisallow: /\n'
    : 'User-agent: *\nAllow: /\n';

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
};
