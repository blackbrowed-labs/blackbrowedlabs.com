import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  output: 'static',
  site: process.env.PUBLIC_SITE_URL ?? 'https://dev.blackbrowedlabs.com',
  trailingSlash: 'never',
  i18n: {
    defaultLocale: 'de',
    locales: ['de', 'en'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
  // Disable smartypants so Markdown body content preserves the ASCII
  // apostrophes ('), straight quotes, and `--` from BASELINE_COPY.md
  // verbatim. The default (enabled) silently rewrites them to typographic
  // forms, violating the "use copy verbatim" project rule.
  markdown: {
    smartypants: false,
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
