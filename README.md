# Blackbrowed Labs website

The marketing website for Blackbrowed Labs, a small software studio in Reinbek
(near Hamburg), Germany. Lives at [blackbrowedlabs.com](https://blackbrowedlabs.com).

## Stack

- **Framework:** Astro 6, mostly static output. One narrow Cloudflare Worker
  endpoint backs `/api/contact` (the contact form); every other path is
  served from `dist/` via Workers Static Assets.
- **Styling:** Tailwind 4 (CSS-first via `@tailwindcss/vite`), with the
  Tussock Ridge token set in `src/styles/tokens.css`. Inter is self-hosted
  in four static weights.
- **Hosting:** Cloudflare Workers, two environments — production
  (`blackbrowedlabs.com`) deploys from `main`, staging
  (`dev.blackbrowedlabs.com`) deploys from `dev`. DNS at Cloudflare,
  email on IONOS (preserved in DNS).
- **i18n:** Astro's native i18n. German is the default at unprefixed
  routes; English mirrors live under `/en/*`. Counterpart map and
  hreflang are hand-maintained in `src/lib/i18n.ts`.
- **Content:** Markdown content collections (`src/content/editorial/`) for
  the home, about, and contact pages; legal pages (Impressum, Datenschutz)
  inline in their `.astro` files for stable legal-text implementation.
- **Analytics:** Cloudflare Web Analytics (cookieless beacon), production
  only.
- **CI/CD:** GitHub Actions deploys on push to `dev` (staging) and `main`
  (production), authenticated via a scoped `CLOUDFLARE_API_TOKEN`.
- **Node:** 24 (active LTS) on CI runners and locally.

## Documentation

- **Architecture & tech decisions:** [`docs/TECH_STACK.md`](docs/TECH_STACK.md)
- **Brand & visual system:** [`docs/CLAUDE_DESIGN_BRIEF.md`](docs/CLAUDE_DESIGN_BRIEF.md)
- **Editorial content:** [`docs/BASELINE_COPY.md`](docs/BASELINE_COPY.md)
- **Design system handoff bundle:** [`design/handoff-bundle/`](design/handoff-bundle/)
- **Working instructions for Claude Code:** [`CLAUDE.md`](CLAUDE.md) — gate-based
  handoff pattern, process rules, and skill-driven workflow integrations.

## Local development

Requires Node.js 24 (active LTS) and npm. From the repo root:

```bash
npm install
npm run dev    # http://localhost:4321
npm run build  # production build to ./dist
npm run check  # astro check (TypeScript + content collections)
```

`npm run dev` serves the site without the production build chain — local
edits show immediately and stale build-time data does not block the
workflow.

`npm run build` runs three scripts in order:

1. `scripts/check-cloudflare-facts-freshness.mjs` — fails the build if
   `src/data/cloudflare-facts.json`'s `verifiedDate` is older than 90
   days. Refresh the file by re-checking the listed source URLs (DPF
   participant page + Cloudflare Web Analytics FAQ) and updating the
   date.
2. `scripts/build-headers.mjs` — emits `public/_headers` for Cloudflare
   Workers Static Assets.
3. `astro build` followed by `scripts/extract-tokens.mjs` — produces
   `dist/` plus a tokens-only CSS asset for the static fallback HTML.

Editing prose: most legal text lives in `docs/BASELINE_COPY.md` and is
rendered verbatim by page templates. Editorial Markdown for the home,
about, and contact pages lives under `src/content/editorial/`.

## License

© 2026 Blackbrowed Labs. All rights reserved.