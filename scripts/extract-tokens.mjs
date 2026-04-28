#!/usr/bin/env node
/**
 * Extracts the brand color tokens from src/styles/tokens.css into a
 * standalone dist/styles/tokens.css usable by static HTML files under
 * public/ (e.g. public/en/404.html, which Astro copies verbatim and
 * therefore never reaches the Tailwind/CSS pipeline).
 *
 * Light-mode :root block is copied verbatim. The dark-mode
 * [data-theme="dark"] block is rewrapped under
 * @media (prefers-color-scheme: dark) since static files carry no JS
 * theme toggle. The @theme block (Tailwind utility-class registration)
 * is skipped — every value we need already lives in :root via the
 * --color-* aliases.
 *
 * Runs after `astro build` in the npm "build" script so the file lands
 * only in the build artefact (dist/) and is not committed.
 */

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';

const SRC = 'src/styles/tokens.css';
const OUT = 'dist/styles/tokens.css';

const src = readFileSync(SRC, 'utf8');

const rootMatch = src.match(/:root\s*\{([\s\S]*?)\n\}/);
if (!rootMatch) {
  throw new Error(`[extract-tokens] could not locate :root block in ${SRC}`);
}
const rootBody = rootMatch[1];

const darkMatch = src.match(/\.dark,\s*\[data-theme="dark"\]\s*\{([\s\S]*?)\n\}/);
if (!darkMatch) {
  throw new Error(`[extract-tokens] could not locate dark-mode block in ${SRC}`);
}
const darkBody = darkMatch[1];

const out = `/* Auto-generated from src/styles/tokens.css. Do NOT edit.
 * Regenerate via \`npm run build\` (or \`node scripts/extract-tokens.mjs\`
 * after a build). Used by static HTML under public/ that lives outside
 * Astro's CSS pipeline (currently public/en/404.html).
 *
 * Light/dark switching uses prefers-color-scheme; static files have
 * no JS theme toggle.
 */

:root {${rootBody}
}

@media (prefers-color-scheme: dark) {
  :root {${darkBody}
  }
}
`;

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, out, 'utf8');

console.log(
  `[extract-tokens] wrote ${OUT} (${out.length} bytes; ` +
  `${rootBody.split('\n').length} :root lines, ${darkBody.split('\n').length} dark lines)`,
);
