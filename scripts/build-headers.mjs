#!/usr/bin/env node
/**
 * Emits public/_headers for Cloudflare Workers Static Assets based on
 * the PUBLIC_ENVIRONMENT environment variable. Runs before `astro build`
 * via the "build" npm script.
 *
 * - production: long-lived caching for static assets; no robots tag.
 * - staging (or anything else): same caching + X-Robots-Tag: noindex,
 *   nofollow on every path. Triad member 2 of 3 (meta tag + robots.txt
 *   endpoint being the other two).
 */

import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';

const env = process.env.PUBLIC_ENVIRONMENT ?? 'development';
const isProduction = env === 'production';

const cacheRules = [
  '/fonts/*',
  '  Cache-Control: public, max-age=31536000, immutable',
  '',
  '/favicon.svg',
  '  Cache-Control: public, max-age=86400',
  '',
  '/favicon-*.png',
  '  Cache-Control: public, max-age=86400',
  '',
  '/apple-touch-icon.png',
  '  Cache-Control: public, max-age=86400',
  '',
  '/og/*',
  '  Cache-Control: public, max-age=86400',
].join('\n');

const robotsBlock = [
  '',
  '',
  '/*',
  '  X-Robots-Tag: noindex, nofollow',
].join('\n');

const body = isProduction
  ? cacheRules + '\n'
  : cacheRules + robotsBlock + '\n';

const outPath = 'public/_headers';
mkdirSync(dirname(outPath), { recursive: true });
writeFileSync(outPath, body, 'utf8');

console.log(
  `[build-headers] wrote ${outPath} for PUBLIC_ENVIRONMENT=${env} ` +
  `(isProduction=${isProduction})`,
);
