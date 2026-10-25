import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import { unified } from '@astrojs/markdown-remark';

// https://astro.build/config
export default defineConfig({
  output: 'static',
  site: process.env.PUBLIC_SITE_URL ?? 'https://dev.blackbrowedlabs.com',
  trailingSlash: 'always',
  // v6 default; v7 flips to 'jsx'. Pinned to keep output parity with the
  // 6.4.8 baseline. Adopting 'jsx' is tracked as a follow-up (plan §6).
  compressHTML: true,
  i18n: {
    defaultLocale: 'de',
    locales: ['de', 'en'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
  // Keep the Astro 6 unified/remark Markdown pipeline instead of the v7
  // default. Disable smartypants so Markdown body content preserves the
  // ASCII apostrophes ('), straight quotes, and `--` from BASELINE_COPY.md
  // verbatim. The default (enabled) silently rewrites them to typographic
  // forms, violating the "use copy verbatim" project rule.
  markdown: {
    processor: unified(),
    smartypants: false,
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
