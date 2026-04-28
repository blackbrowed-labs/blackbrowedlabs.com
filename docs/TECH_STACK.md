# Blackbrowed Labs — Website Tech Stack & Architecture

> **Purpose of this document**
> Handoff brief for the Blackbrowed Labs marketing website (blackbrowedlabs.com). Documents the technical decisions already made, the rationale behind each, and the conventions the implementation should follow. Written to be consumed by Claude Code alongside the design system bundle exported from Claude Design.
>
> **Companion documents:**
> - `CLAUDE_DESIGN_BRIEF.md` — brand, visual identity, and design system brief used to drive Claude Design. Source of truth for all visual decisions.
> - `BASELINE_COPY.md` — drafted editorial content (tagline, About, Impressum, Datenschutz, Products placeholder). Source of truth for initial copy.

---

## 1. Project Overview

A marketing website for **Blackbrowed Labs**, an educational software studio founded by Lars Weiser and based in Reinbek, Schleswig-Holstein. The site presents the studio and its products. Each product page surfaces versions and release notes pulled automatically from the product's own GitHub repository, with a short description and a link to the product's own dedicated website.

**This is a greenfield deployment.** Nothing exists yet — no prior Pages project, no existing Worker, no live site. The only pre-existing elements are DNS registrations and the IONOS email setup (see §9).

### 1.1 Legal identity

- **Full legal name:** Lars Weiser
- **Trading as (Geschäftsbezeichnung):** Blackbrowed Labs
- **Legal form:** Sole proprietorship (Einzelunternehmen)
- **Registered address:** Schröders Stieg 8a, 21465 Reinbek, Germany
- **Contact email:** `lars@blackbrowedlabs.com`
- **VAT status:** Kleinunternehmer nach § 19 UStG — no VAT charged
- **USt-IdNr. (§ 27a UStG):** `DE461658750`

### 1.2 Product strategy

Blackbrowed Labs builds tools for classroom management. Two areas are in active development:

- An **iPadOS app** for classroom management (grades, student work, observations, without paperwork). Will launch as the first product on its own domain with an independent website and design system.
- A **Claude Cowork plugin** that helps teachers plan units and lessons.

**Product names are deliberately not referenced on this website** until each product formally launches. The website blackbrowedlabs.com acts as the **studio's home page**, not as marketing surface for individual products. When products launch, they get a **minimal presence** here: name, short description, current version, recent release notes (auto-pulled from GitHub), and a prominent link to the product's own site. The marketing depth lives on each product's own website.

### 1.3 Editorial profile

- Single author/editor (the owner).
- Lars is a software developer, not a teacher — he builds for teachers based on close working relationships with them. This positioning is reflected in the copy; **do not write copy that implies classroom experience the founder doesn't have**.
- Content changes are infrequent.
- Occasional edits may need to be made from a mobile device.
- No non-technical editors in scope.

### 1.4 Language strategy

- Primary audience: German. Default site language: **de-DE**.
- Secondary audience: international. English (`en`) mirror built from day one via Astro's i18n routing (`de` as the unprefixed default; English under `/en/*`).
- All routing, legal pages, and navigation are i18n-aware from the start.
- Implementation details in §4.5.

### 1.5 Non-goals

- Multi-author workflows, roles, or approval flows.
- E-commerce, paid subscriptions, or gated content.
- Server-rendered user-specific content.
- A dedicated CMS admin UI (see §6 for the deferred decision).
- Host the full product marketing on this site. Products live on their own domains.

---

## 2. Tech Stack Summary

| Layer | Choice | Notes |
|---|---|---|
| Hosting | **Cloudflare Workers** (static assets + optional compute) | Greenfield deploy — nothing exists yet. |
| Framework | **Astro** | Content-first, minimal JS, first-class Markdown, native i18n. |
| Styling | **Tailwind CSS** | Theme extended with Tussock Ridge tokens. See §4. |
| Content | **Markdown files in the site repo** | Stored under `src/content/`, managed via Astro content collections. |
| Editing UI | **GitHub web editor / GitHub mobile app** | No CMS in v1. |
| Dynamic data | **GitHub REST API** at build time | Fetches releases from each product repo. |
| Rebuild trigger | `repository_dispatch` webhook from each product repo on `release: published` | Plus a nightly scheduled rebuild as a safety net. |
| DNS / TLS | Cloudflare (`.com`) + INWX (`.de`) → Cloudflare nameservers | Custom domain bound directly to the Worker. |
| Email | IONOS Mail Basic on `blackbrowedlabs.com` | MX/SPF/DKIM already configured at Cloudflare; preserve. |
| Design source | **Claude Design** (claude.ai/design) | Brief: `CLAUDE_DESIGN_BRIEF.md`. Handoff bundle will live under `design/`. |
| Implementation quality | **Claude `frontend-design` skill** | Invoked by Claude Code during component build-out. |

### 2.1 Repository

- **GitHub organisation:** `blackbrowed-labs` *(note the hyphen — the org name differs from the domain/brand, which have no hyphen: `blackbrowedlabs`)*
- **Website repo:** `blackbrowed-labs/blackbrowedlabs.com`
- **Visibility:** Public (signal of craftsmanship and openness; content is not commercially sensitive). Full pre-flip secret-scan procedure and branch-protection ruleset details in §8.4.

---

## 3. Hosting — Cloudflare Workers

### 3.1 Decision

Deploy as a Cloudflare Worker with static assets.

**Rationale**
- Cloudflare is consolidating its developer platform onto Workers. Pages is in maintenance mode; new feature investment is Workers-only.
- Static asset requests on Workers are free.
- A single Worker can serve the static site and any future dynamic endpoints from one deployment.
- Will become the template for future sites under the same org.

### 3.2 Environments & branching

| Environment | Branch | Domain | Protection |
|---|---|---|---|
| Production | `main` | `blackbrowedlabs.com` | Public |
| Staging | `dev` | `dev.blackbrowedlabs.com` | Public but `noindex, nofollow` meta + `X-Robots-Tag` header + `robots.txt` disallow |

**Workflow:** push/commit to `dev` → auto-deploy to staging → test → merge `dev` into `main` via PR → auto-deploy to production.

**No PR preview URLs** — only the two named branches deploy.

### 3.3 Staging protection

Three redundant mechanisms prevent accidental indexing:

- Global `<meta name="robots" content="noindex, nofollow" />` when `import.meta.env.PUBLIC_ENVIRONMENT === 'staging'`.
- `X-Robots-Tag: noindex, nofollow` response header from the Worker for the staging environment.
- Per-environment `robots.txt`:
  - Staging: `User-agent: *` / `Disallow: /`
  - Production: normal allow rules.

### 3.4 Cron Trigger (safety net)

One scheduled trigger on the production Worker, daily at 03:00 UTC, dispatches a rebuild. Only there to catch missed webhooks from product repos.

### 3.5 Implementation requirements

- `wrangler.jsonc` at the repo root with named environments.
- `compatibility_date` set to today's date at initial deploy.
- `assets.directory` points at Astro's build output (`./dist/`).
- `not_found_handling` = `"404-page"` (this is a content site, not an SPA).
- **GitHub Actions deploys** on push to `dev` (→ staging) and `main` (→ production). Workflows run `wrangler deploy --env <staging|production>` authenticated via the `CLOUDFLARE_API_TOKEN` GitHub Actions secret (§10.2). Cloudflare's native Workers Builds is intentionally **not** connected to this repo — one deploy mechanism at a time, no duplicate deploys or race conditions.
- **Node 24** (Active LTS) on the CI runners and the declared `engines.node` in `package.json`. Chosen for longest active-support runway: Node 20 reaches EOL in April 2026, Node 22 is already on maintenance-only security updates, Node 24 gets active support (bug fixes + targeted enhancements) through April 2028. Revisit before Node 24 EOL.
- **Observability** is enabled on both Worker environments (`observability.enabled: true` in `wrangler.jsonc`) so runtime logs and Trace Events are captured from first deploy. No additional cost.
- Custom Domains on the Worker, not CNAME records. `blackbrowedlabs.com` bound to production, `dev.blackbrowedlabs.com` bound to staging.

### 3.6 Cloudflare managed robots.txt (zone-level)

Cloudflare's zone-level "Manage robots.txt" is deliberately enabled on the `blackbrowedlabs.com` zone. When enabled, Cloudflare prepends a managed block to the `robots.txt` our Worker serves.

- **Production:** the managed block names known AI-training crawlers (the current list is visible in the Cloudflare dashboard and updated over time) with `Disallow: /` lines plus Cloudflare's Content Signals Policy preamble. Cloudflare maintains the list over time, so new crawlers enter the block without manual maintenance.
- **Staging:** the managed block prepends `User-agent: *` / `Allow: /` ahead of the Worker-served `Disallow: /`, which a crawler may read as an override. The additional `X-Robots-Tag` response header and the `<meta name="robots">` tag injected on staging (§3.3) remain the authoritative noindex signals — any crawler that respects either will not index staging regardless of the merged `robots.txt`.

Toggle off at Cloudflare dashboard → Bots / Scrape Shield → Manage robots.txt if the managed content ever becomes undesirable.

---

## 4. Framework & Styling — Astro + Tailwind

### 4.1 Astro

TypeScript throughout. Content collections + custom content loaders for the releases pipeline (§5.3). Static output target. Native i18n routing (see §4.5). Fully responsive layouts (see §4.4).

### 4.2 Tailwind — Design Tokens

Tailwind 4 is integrated via `@tailwindcss/vite` (a Vite plugin configured in `astro.config.mjs` under `vite.plugins`, not an Astro integration — `@astrojs/tailwind` is not used). Tailwind 4 is CSS-first: there is no `tailwind.config.ts` / `tailwind.config.js`. All design tokens live in `src/styles/tokens.css` declared via the `@theme` directive. The Tussock Ridge palette (full spec in `CLAUDE_DESIGN_BRIEF.md` §4) is authoritative; the values below are what `tokens.css` declares.

**Light mode**

```css
/* src/styles/tokens.css — @theme block (excerpt, indicative naming) */
@theme {
  --color-bg:         #FFFFFF;
  --color-bg-warm:    #FBF7F2;
  --color-bg-card:    #F5F0E9;
  --color-border:     #D6CDBE;

  --color-primary:    #7D4912;  /* Tussock Gold   (31°, 75%, 28%) */
  --color-accent:     #1C5E66;  /* Ridge Teal     (186°, 57%, 25%) */
  --color-neutral:    #2C2622;  /* Volcanic Stone (24°, 13%, 15%) */
  --color-error:      #882218;  /* Peat Ember     (5°, 70%, 31%) */

  --color-primary-hover: #6A3D0F;
  --color-accent-hover:  #174E55;
  --color-error-hover:   #751E15;
}
```

**Dark mode** — applied via the `[data-theme="dark"]` attribute on `<html>`. Tokens swap automatically, so Tailwind's `dark:` variant prefix is **not needed for colors**. For any future non-color utility that needs per-mode behavior, `src/styles/global.css` defines `@custom-variant dark (&:where([data-theme="dark"], [data-theme="dark"] *));` so the attribute drives the variant uniformly.

```css
/* src/styles/tokens.css — dark override (excerpt) */
[data-theme="dark"] {
  --color-bg:         #1C1C1E;
  --color-bg-warm:    #24221F;
  --color-bg-card:    #2E2A26;
  --color-border:     #4A443E;

  --color-primary:    #D4A45C;
  --color-accent:     #7CB3BC;
  --color-neutral:    #E0D8CE;
  --color-error:      #EC9C8C;

  --color-primary-hover: #DFB26E;
  --color-accent-hover:  #8EC1C9;
  --color-error-hover:   #F0A494;
}
```

Semantic aliases (e.g. `--color-heading`, `--color-link`), high-contrast variants, and forced-colors handling: full spec in `CLAUDE_DESIGN_BRIEF.md` §4. Authoritative source: `src/styles/tokens.css` (produced via the Tailwind 3→4 migration — see `docs/tailwind-4-conversion-notes.md`).

### 4.3 Typography

- **Primary typeface:** **Inter**, self-hosted via four static `.woff2` files (weights 300 / 400 / 500 / 600) shipped in `design/handoff-bundle/assets/fonts/`, copied to `public/fonts/` at scaffold time and declared via `@font-face` in `src/styles/global.css`. No Google Fonts CDN (GDPR). The variable-axis build (`@fontsource-variable/inter`) is intentionally **not** used: only four fixed weights are needed, and the bundle's static files are lighter overall and keep the handoff bundle as the single source of truth for typography assets.
- **Fallback stack:** `Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Helvetica, Arial, sans-serif`.
- **Weights used:** 300, 400, 500, 600. No bold 700+.
- **Scale:** fluid, clamp-based. Full table in `CLAUDE_DESIGN_BRIEF.md` §5.

### 4.4 Responsive behaviour

The site is **fully responsive** from mobile (360px) to large desktop (≥1440px). No horizontal scrolling, no content overflow, no desktop-only interactions. This is a baseline requirement, not a nice-to-have.

**Breakpoints** follow Tailwind defaults exactly:

| Tailwind prefix | Width | Role |
|---|---|---|
| (none) | <640px | Mobile — single column, hamburger nav |
| `sm:` | ≥640px | Small tablet / large phone |
| `md:` | ≥768px | Tablet — two-column layouts allowed where appropriate |
| `lg:` | ≥1024px | Desktop — full layout |
| `xl:` | ≥1280px | Large desktop |

**Content max-width:** 1200px, centered, with fluid side padding.

**Responsive typography** is handled by the fluid `clamp()` scale defined in `CLAUDE_DESIGN_BRIEF.md` §5.3. No fixed `font-size` on `html` or `body`. Inherit from root.

**Responsive images:** use Astro's `<Image />` and `<Picture />` components, which generate `srcset` and `sizes` automatically. Formats: AVIF primary, WebP fallback. No JPEG hero images.

**Touch-friendly controls:** no hover-only interactions. Any menu, tooltip, or disclosure that reveals content on hover must also respond to tap/focus. Minimum tap target 44×44 CSS pixels.

**Testing requirement:** before merging to `main`, every page must be verified at 360, 768, 1024, and 1440 CSS pixel widths, in both light and dark mode.

### 4.5 Internationalisation (Astro native i18n)

Astro has built-in i18n as of v3+. Configuration lives in `astro.config.mjs`:

```ts
export default defineConfig({
  i18n: {
    defaultLocale: 'de',
    locales: ['de', 'en'],
    routing: {
      prefixDefaultLocale: false,  // German URLs are unprefixed
    },
  },
});
```

With this config:
- German is the default and lives at unprefixed URLs: `/`, `/ueber`, `/kontakt`, `/impressum`, `/datenschutz`, `/produkte`.
- English lives under `/en/*`: `/en/`, `/en/about`, `/en/contact`, `/en/legal`, `/en/privacy`, `/en/products`.
- `astro:i18n` utilities (`getRelativeLocaleUrl`, `getLocaleByPath`) are used for the language switcher and for generating canonical/hreflang tags.

**Route file structure:**

```
src/pages/
  index.astro                  → /           (German homepage)
  ueber.astro                  → /ueber
  kontakt.astro                → /kontakt
  impressum.astro              → /impressum
  datenschutz.astro            → /datenschutz
  produkte/
    index.astro                → /produkte
    [slug].astro               → /produkte/<slug>
  en/
    index.astro                → /en/
    about.astro                → /en/about
    contact.astro              → /en/contact
    legal.astro                → /en/legal
    privacy.astro              → /en/privacy
    products/
      index.astro              → /en/products
      [slug].astro             → /en/products/<slug>
```

**Content collections** are language-filtered by the `lang` field in the frontmatter (see §5). Each route file queries its collection for `lang === 'de'` or `lang === 'en'` as appropriate.

**Language switcher:** every page includes a `<link rel="alternate" hreflang="de" href="...">` and `hreflang="en"` tag for its counterpart. The UI switcher uses `astro:i18n` helpers to compute the matching URL in the other language. If a page has no translation, the switcher disables that option rather than linking to a missing page.

**Content negotiation:** none on v1. A first-time visitor lands on the German homepage regardless of `Accept-Language`. If demand appears later, add a one-time redirect at the Worker level based on `Accept-Language` with a cookie to remember the choice.

**Canonical URLs and sitemaps:** one sitemap per language generated by `@astrojs/sitemap` with `i18n` configured. Each canonical URL points to the language-specific version; hreflang tags point to the counterpart.

### 4.6 URL slugs — German vs English

German URLs use German words (`/ueber`, `/produkte`, `/kontakt`). This is standard practice for German-first sites and improves both local SEO and user trust. The mapping is explicit in the route file structure above and in the nav labels in `BASELINE_COPY.md` §12.

---

## 5. Content Model

Two Astro content collections defined with Zod schemas in `src/content.config.ts`:

### 5.1 `pages`
Free-form Markdown pages. One file per language per page. Filename convention: `<slug>.<lang>.md` (e.g. `about.de.md`, `about.en.md`).

Frontmatter:
- `title: string`
- `description: string`
- `slug: string`
- `lang: 'de' | 'en'`
- `order?: number`
- `draft?: boolean`
- `showInNav?: boolean`

### 5.2 `products`

**One Markdown file per product per language adds a product automatically.** No code changes per product.

File location: `src/content/products/<slug>.<lang>.md`, for example:
- `src/content/products/<name>.de.md`
- `src/content/products/<name>.en.md`

Frontmatter:
- `name: string` — display name
- `slug: string` — URL segment (same across languages)
- `lang: 'de' | 'en'`
- `tagline: string` — one line
- `description: string` — short description, rendered on the product page
- `externalUrl: string` — the product's own website; primary CTA
- `repo: string` — GitHub repo in `owner/name` form; drives the releases loader
- `logo?: string` — path to logo asset
- `order?: number`
- `draft?: boolean` — if `true`, not built and not listed

The body of the Markdown file is the long-form description rendered under the product header.

**Auto-generation:** the route file `src/pages/produkte/[slug].astro` (and its English mirror `src/pages/en/products/[slug].astro`) uses `getStaticPaths()` to emit one page per `products` entry matching the file's language. Adding a Markdown file is the only action needed to publish a new product page. No component changes. No config changes.

**Collection is empty in v1.** When the collection is empty, the Products index renders a "coming soon" empty state (copy in `BASELINE_COPY.md` §5).

### 5.3 `releases` (remote collection)

Populated at build time by a custom content loader calling, for each non-draft product:

```
GET https://api.github.com/repos/{owner}/{repo}/releases
```

Each release becomes an entry with: `productSlug`, `tagName`, `name`, `publishedAt`, `bodyMarkdown` (rendered with the same pipeline as local content), `isPrerelease`, `isDraft`, `htmlUrl`.

Authentication: a fine-grained GitHub personal access token, `PRODUCT_REPOS_PAT`, stored as a Worker/Actions secret. Required scopes: `Contents: Read` and `Metadata: Read` on each product repo. See §10.1 for full setup procedure.

Release notes are language-neutral (GitHub releases have one version each). They're rendered on both the DE and EN product pages.

---

## 6. Editing Workflow

**v1 approach:** edit Markdown files directly on GitHub.
- Desktop: pencil icon on github.com, or press `.` to open github.dev.
- Mobile: GitHub mobile app.

**Deferred:** Pages CMS (pagescms.org) bolted on in a later phase without changing the content model. Not in v1.

---

## 7. GitHub Integration — Release Notes Pipeline

**Goal:** releases cut in a product repo appear on the website within ~60 seconds of publication, with no manual intervention.

**Mechanism:** `repository_dispatch`.

1. In every product repo under `blackbrowed-labs`, a GitHub Actions workflow triggers on `release: published`.
2. That workflow sends a `repository_dispatch` event to the website repo with `event_type: product-release-published` and a payload containing the product slug and release tag.
3. In the website repo, a workflow listens for that event type and triggers a production deploy.
4. During the build, the `releases` content loader re-fetches from the GitHub API. New release appears.

Cross-repo PAT with `actions: write` on the website repo lives as a secret in each product repo.

**Fallback:** nightly Cron Trigger in the production Worker (§3.4).

---

## 8. Repository Structure (target)

```
/
├── src/
│   ├── components/
│   ├── layouts/
│   ├── pages/
│   │   ├── index.astro
│   │   ├── ueber.astro
│   │   ├── kontakt.astro
│   │   ├── impressum.astro
│   │   ├── datenschutz.astro
│   │   ├── produkte/
│   │   │   ├── index.astro
│   │   │   └── [slug].astro
│   │   ├── en/
│   │   │   ├── index.astro
│   │   │   ├── about.astro
│   │   │   ├── contact.astro
│   │   │   ├── legal.astro
│   │   │   ├── privacy.astro
│   │   │   └── products/
│   │   │       ├── index.astro
│   │   │       └── [slug].astro
│   │   └── 404.astro
│   ├── content/
│   │   ├── pages/
│   │   └── products/         # empty in v1; one <slug>.<lang>.md per product adds a page
│   ├── content.config.ts
│   ├── i18n/                 # UI strings (nav labels, footer labels, etc.)
│   │   ├── de.ts
│   │   └── en.ts
│   └── styles/
│       ├── tokens.css
│       └── global.css
├── public/
│   ├── robots.txt            # generated per-environment at build
│   └── favicon assets        # from Claude Design bundle
├── design/
│   └── handoff-bundle/       # Claude Design export (palette tokens, component references, identity assets)
├── docs/                     # project documentation (see §8.1)
│   ├── TECH_STACK.md
│   ├── CLAUDE_DESIGN_BRIEF.md
│   └── BASELINE_COPY.md
├── .github/
│   └── workflows/
│       ├── deploy.yml
│       └── rebuild-on-dispatch.yml
├── wrangler.jsonc
├── tailwind.config.ts
├── astro.config.mjs
├── package.json
└── README.md
```

### 8.1 Why keep the handoff documents in the repo?

`TECH_STACK.md`, `CLAUDE_DESIGN_BRIEF.md`, and `BASELINE_COPY.md` live under `/docs/` for three reasons:

1. **Project memory.** Any future structural change (new page type, CMS addition, migration to another host) becomes vastly easier when the original rationale is co-located with the code.
2. **Consistency checks.** Claude Code, when asked to add or modify anything, can re-read these and stay aligned with the original intent rather than drifting toward generic defaults.
3. **Craftsmanship signal.** In a public repo, visible architecture docs communicate that the site was designed, not assembled.

They do not contain secrets. The Impressum and Datenschutz already publicly disclose everything sensitive (address, VAT ID, controller status).

**If privacy concerns change:** move `/docs/` to a separate private repo (e.g. `blackbrowed-labs/website-docs`). The public website repo can remain clean; Claude Code can reference the private docs by being given access at scaffold time. This is a reversible decision.

### 8.2 Source material NOT in this repo

The following documents — which were the strategic and creative inputs to this project — are deliberately **not** stored in the website repo and should not be committed there:

- Name analysis and trademark strategy
- Logo concept explorations
- Full color palette specification (source document)
- Design critic reviews
- Domain / infrastructure planning docs

These belong in your private workspace. `CLAUDE_DESIGN_BRIEF.md` contains everything Claude Code needs (full palette values, contrast data, all tokens, all rationale). The source documents are reference material for you, not deliverables for the site.

### 8.3 `.gitignore`

The repo's `.gitignore` is at the root and covers three categories of files:

**Build artifacts and dependencies** — never committed; regenerated on every build.

- `node_modules/` — installed dependencies
- `dist/` — Astro build output
- `.astro/` — Astro cache
- `.wrangler/` — Cloudflare Worker local state

**Environment and secrets** — never committed. `.env` and `.env.*` are gitignored, with an explicit allow for `.env.example` so future contributors can see which variables are expected without the real values.

**Editor and OS metadata** — ignored to keep the repo portable across machines.

- `.vscode/*` with explicit allow for `extensions.json` and `settings.json` (the two shareable VS Code files; everything else is personal)
- `.idea/` (JetBrains), `*.swp` / `*.swo` (vim)
- macOS: `.DS_Store`, `.AppleDouble`, `.LSOverride`
- Logs: `*.log`, `npm-debug.log*`, `yarn-debug.log*`, `pnpm-debug.log*`
- Caches: `.cache/`, `.parcel-cache/`, `coverage/`, `.nyc_output/`

**Claude Code artifacts** — `.claude/` is ignored because Claude Code stores local session state there.

**Local planning workspace** — `plans/` is ignored. It's Claude Code's scratch space for draft plans (e.g. `pass-1-implementation-plan.md`) that Lars reviews before implementation begins. Canonical project documentation remains under `docs/`; `plans/` is intentionally transient and not authoritative.

**What is deliberately NOT ignored:**

- **Lockfiles** (`package-lock.json`, `pnpm-lock.yaml`, `yarn.lock`) must be committed so builds are reproducible across machines and CI.
- **Source maps** (`.map` files) ship in production builds to aid debugging; no reason to ignore.
- **Handoff documentation** in `docs/` and the Claude Design bundle in `design/handoff-bundle/` are committed — see §8.1 and §8.2 for the rationale.

### 8.4 Repository visibility and branch protection

- **Visibility:** The repository is **public**. Flipped to public on 2026-04-23, after Pass 1 foundation was complete and a secret scan confirmed no sensitive values had been committed. The repo is `blackbrowed-labs/blackbrowedlabs.com`.

- **Rationale for public:** The repo contains only brand-facing documentation (`docs/`), design-system handoff material (`design/handoff-bundle/`), and the Astro source. No secrets (all in `.env`, gitignored per §8.3). Public visibility signals craftsmanship and aligns with the studio's open posture. Also unlocks free branch protection rulesets on the GitHub free plan, which private repos on Team plans don't get.

- **Pre-flip secret scan:** Before flipping, run `gitleaks detect --source . --verbose --redact` from the repo root. Expected output: `no leaks found`. If any leaks are reported: do not flip public until they're resolved (rotate exposed secrets, rewrite history with `git filter-repo` or equivalent, rerun scan).

- **Branch protection rulesets** (GitHub → Settings → Rules):
  - **`protect-main`** (Active):
    - Target: `main`
    - Restrict deletions: enabled
    - Block force pushes: enabled
    - Require pull request before merging: enabled (0 required approvals — solo founder; raise if collaborators join)
    - Require linear history: **disabled** (dropped 2026-04-28). Initially `enabled` at Pass 1 ruleset config; produced SHA-divergence between `dev` and `main` after every rebase-merge (Phase M PR #4, Phase 404 PR #5, Phase B.1 PR #6 each required a manual `dev` re-alignment: temp-disable `protect-dev` force-push → `git reset --hard origin/main` → force-push → re-enable). Allowing merge commits on `main` removes that friction — original SHAs preserved across both branches; no alignment dance. Trade-off: `main`'s git log gains a merge commit per release. Filter via `git log --first-parent main` for the linear release-only view. Squash and rebase merges remain permitted but are not the default — merge commits (the GitHub default once linear-history is off) are the recommended path.
    - Allow bypass: empty (no one bypasses)
  - **`protect-dev`** (Active):
    - Target: `dev`
    - Restrict deletions: enabled
    - Block force pushes: enabled
    - Other toggles intentionally off — `dev` is an integration branch and direct commits are expected

- **Status checks deliberately not required:** "Require status checks to pass" is off on `protect-main` because GitHub requires at least one specific check to be named, and we don't yet have a PR-triggered CI workflow (the deploy workflows are push-triggered, not PR-triggered). Pass 2 backlog item #5: add a PR-triggered CI workflow (`npm ci && npm run build` at minimum) and add it as a required status check on `protect-main`.

- **Default branch:** `main`. Changed from `dev` to `main` at the same time as ruleset configuration. Workflow is now: feature work on `dev` → auto-deploy to staging (`dev.blackbrowedlabs.com`) → PR `dev` → `main` → auto-deploy to production (`blackbrowedlabs.com`).

---

## 9. Deployment & DNS

### 9.1 Domains

- **Canonical:** `blackbrowedlabs.com` (registered at IONOS, DNS at Cloudflare)
- **Staging:** `dev.blackbrowedlabs.com` (public, noindex/nofollow)
- **Redirects (all 301 to `blackbrowedlabs.com`):**
  - `www.blackbrowedlabs.com`
  - `blackbrowedlabs.de` (INWX-registered, DNS at Cloudflare)
  - `blackbrowed.de` (INWX-registered, DNS at Cloudflare)

### 9.2 Email (pre-existing — do not modify)

`lars@blackbrowedlabs.com` is hosted by IONOS Mail Basic. The following DNS records at Cloudflare are **already configured and must be preserved**:

- MX: `mx00.ionos.de`, `mx01.ionos.de`
- SPF TXT: `v=spf1 include:_spf-eu.ionos.com ~all`
- DKIM CNAMEs: `s1-ionos._domainkey` → `s1.dkim.ionos.com`, `s2-ionos._domainkey` → `s2.dkim.ionos.com`
- DMARC CNAME: `_dmarc` → `dmarc.ionos.de`
- Autodiscover CNAME: `autodiscover` → `adsredir.ionos.info`

**Before adding the Worker's Custom Domain bindings, export the current Cloudflare DNS zone as a backup** (`Cloudflare dashboard → DNS → Export`). The Worker bindings replace any conflicting A/CNAME at the root but do not touch MX/TXT/DKIM. Verify post-deploy: send a test email to `lars@blackbrowedlabs.com` and confirm it arrives.

`*@blackbrowedlabs.de` is routed via Cloudflare Email Routing as catch-all → `lars@blackbrowedlabs.com`. Preserve.

### 9.3 TLS

Cloudflare Universal SSL, Full (Strict). Automatic.

---

## 10. Secrets & Configuration

All secrets live outside the repo. Never commit real values. The table below summarises what exists; §10.1–§10.3 give exact setup procedures.

| Name | Where it lives | Purpose |
|---|---|---|
| `PRODUCT_REPOS_PAT` | Worker secret + GH Actions on `blackbrowedlabs.com` repo + local `.env` | Authenticated GitHub API calls for the releases loader (§7). Named `PRODUCT_REPOS_PAT` rather than `GITHUB_TOKEN` because the latter is reserved by GitHub Actions for the workflow's auto-generated token. |
| `CLOUDFLARE_API_TOKEN` | GH Actions on website repo + local `.env` | Used by `wrangler` for deployments when running from CI or locally. |
| `WEBSITE_DISPATCH_TOKEN` | GH Actions on each product repo | Permits `repository_dispatch` to the website repo. Not required in v1 (no product repos yet). |
| `TURNSTILE_SECRET_KEY` | Worker secret per env (set via `wrangler secret put`) | Authenticates the contact-form Worker's Turnstile siteverify call. One secret per env (staging + production); never enters the repo. The matching public site keys live in `wrangler.jsonc` `vars` per env — see "Worker runtime vars" below. |

Environment variables exposed at build time (not secrets):

| Name | Values | Purpose |
|---|---|---|
| `PUBLIC_ENVIRONMENT` | `production` \| `staging` | Drives noindex/nofollow injection and `robots.txt` variant |
| `PUBLIC_SITE_URL` | `https://blackbrowedlabs.com` \| `https://dev.blackbrowedlabs.com` | Canonical URLs, OG tags |

**Worker runtime vars** (declared in `wrangler.jsonc` `env.<env>.vars`; embedded in the deployed Worker's `env` at runtime, not secrets):

| Name | Where | Purpose |
|---|---|---|
| `TURNSTILE_SITE_KEY` | `wrangler.jsonc` `vars` per env | Public site key for the Cloudflare Turnstile widget on the contact form. Different value per env. The matching secret key (`TURNSTILE_SECRET_KEY`) is in the secrets table above. |

### Secrets flow — where each secret lives

```
┌─ Local machine ─────────────┐      ┌─ GitHub Actions ──────────┐      ┌─ Cloudflare Workers ──┐
│  .env  (gitignored)         │      │  Repository secrets       │      │  wrangler secrets     │
│                             │      │                           │      │                       │
│  PRODUCT_REPOS_PAT      ────┼──┬──▶│  PRODUCT_REPOS_PAT    ────┼──┬──▶│  PRODUCT_REPOS_PAT    │
│  CLOUDFLARE_API_TOKEN   ────┼──┤   │  CLOUDFLARE_API_TOKEN ────┼──┘   │  (set via `wrangler   │
│                             │  │   │                           │      │   secret put`)        │
└─────────────────────────────┘  │   └───────────────────────────┘      └───────────────────────┘
                                 │
                                 │        ┌─ Each product repo ──────┐
                                 └───────▶│  WEBSITE_DISPATCH_TOKEN  │
                                          │  (not needed in v1)      │
                                          └──────────────────────────┘
```

### 10.1 `PRODUCT_REPOS_PAT` — fine-grained PAT for the releases loader

**Type:** Fine-grained personal access token (not classic).

**Generated via:** GitHub → Settings → Developer settings → Personal access tokens → Fine-grained tokens → Generate new token.

**Configuration:**

- **Token name:** `blackbrowedlabs-com-releases-reader`
- **Expiration:** 1 year. Add a calendar reminder to rotate before expiry.
- **Resource owner:** `blackbrowed-labs` (the organization, not a personal account).
- **Repository access:** "All repositories" under `blackbrowed-labs`. This automatically includes any future product repos added to the org; the releases loader depends on the token being valid across all of them.
- **Repository permissions (minimum):**
  - `Contents: Read-only`
  - `Metadata: Read-only` (forced by GitHub whenever any other permission is set)
- All other permissions: leave as "No access".

**Where the token lives after generation:**

- **Local `.env`** on your development machine (gitignored) for local `wrangler dev` sessions. Variable name: `PRODUCT_REPOS_PAT`.
- **Cloudflare Worker secret:** `wrangler secret put PRODUCT_REPOS_PAT` under both the production and staging environments.
- **GitHub Actions secret** on `blackbrowed-labs/blackbrowedlabs.com`: Settings → Secrets and variables → Actions → New repository secret. Name: `PRODUCT_REPOS_PAT`.

**Why not name it `GITHUB_TOKEN`?** GitHub Actions auto-generates a secret called `GITHUB_TOKEN` for every workflow run — scoped to that run, with permissions for the current repo only. Using a custom PAT named `GITHUB_TOKEN` would shadow the auto-generated one and cause confusion. Naming the custom PAT `PRODUCT_REPOS_PAT` disambiguates and makes its purpose self-evident.

**Rotation:** Before the token expires, generate a new one with the same permissions, update all three locations above, and revoke the old token.

### 10.2 `CLOUDFLARE_API_TOKEN` — Worker deployment token

**Type:** Cloudflare API token (custom).

**Generated via:** Cloudflare dashboard → Profile (top right) → API Tokens → Create Token → "Custom Token" template.

**Configuration:**

- **Token name:** `blackbrowedlabs-com-workers-deploy`
- **Expiration:** 1 year. Calendar reminder to rotate.
- **Permissions:**
  - Account → **Workers Scripts: Edit**
  - Zone → **Workers Routes: Edit**
  - Zone → **DNS: Edit** (required for Custom Domain binding on the Worker; not for arbitrary DNS changes)
- **Account Resources:** Include specifically the account that owns `blackbrowedlabs.com`. Do not use "All accounts".
- **Zone Resources:** Include specifically `blackbrowedlabs.com`. Do not use "All zones" — restricting by zone limits blast radius if the token is compromised.
- **IP Address Filtering:** Skip for v1. Can be added later if restricting token use to specific CI runner IPs becomes worthwhile.

**Where the token lives:**

- **GitHub Actions secret** on `blackbrowed-labs/blackbrowedlabs.com`: `CLOUDFLARE_API_TOKEN`. Used by the deploy workflow.
- **Local `.env`** for local `wrangler deploy` sessions, if you deploy from your machine outside CI.

**What this token CANNOT do:** It cannot edit DNS records outside of Worker Custom Domain bindings, cannot read or write Zone Settings beyond Worker Routes, cannot access billing, cannot touch account membership. Keeping the scope tight protects against accidental or compromised use.

**Rotation:** Same procedure as the GitHub PAT. Before expiry, generate a new token with identical permissions, update both locations, delete the old token from Cloudflare.

### 10.3 `WEBSITE_DISPATCH_TOKEN` — cross-repo dispatch from product repos

Not needed in v1 — there are no product repos yet. Document here for completeness.

When the first product repo is created (e.g., `blackbrowed-labs/thalura`), generate a fine-grained PAT with `Actions: Write` on `blackbrowed-labs/blackbrowedlabs.com`, and store it as an Actions secret named `WEBSITE_DISPATCH_TOKEN` on the product repo. The workflow uses it to dispatch `repository_dispatch` events back to the website repo on release publication (see §7).

---

## 11. Legal & Compliance (German Context)

Required pages, in German (with English mirrors). Full drafts in `BASELINE_COPY.md`.

### 11.1 Impressum (§ 5 DDG)

Content:
- Full legal name and trading name
- Postal address (Schröders Stieg 8a, 21465 Reinbek)
- Contact email
- Kleinunternehmer clause per § 19 UStG
- USt-IdNr.: `DE461658750`
- Responsible party per § 18 Abs. 2 MStV

### 11.2 Datenschutzerklärung (GDPR Art. 13/14)

Full draft provided in `BASELINE_COPY.md` §9. Covers: controller details, Cloudflare hosting + server logs, IONOS email, Cloudflare Web Analytics (cookieless), no third-party services, data subject rights, supervisory authority.

**Disclaimer:** the Datenschutz draft is a baseline for a strictly-necessary, no-forms, no-tracking static site. It is not legal advice. For public launch, consider a one-off review from IHK zu Lübeck, a service like e-recht24, or a specialist data-protection lawyer.

### 11.3 Cookie / consent banner

**Not required** under the chosen stack profile: no third-party scripts, no cookies beyond strictly-necessary, no fonts from Google CDN, no YouTube/Twitter embeds, Cloudflare Web Analytics is cookieless. If any of these change, revisit.

### 11.4 Self-hosting discipline

All fonts, images, and scripts served from the Worker (same origin). No `fonts.googleapis.com`, no `www.google-analytics.com`, no `platform.twitter.com`, etc. If a library requires a CDN, vendor it into `/public`.

---

## 12. Open Items for the Owner

1. **Favicon / OG image assets** arrive with the Claude Design handoff bundle.
2. **About-page visual element** — the layout holds a photo, the arc mark at display size, or a pull-quote. Can be deferred; default is the arc mark.
3. **First product launch details** — when ready: final tagline, description, external URL, GitHub repo path. Adding one `<slug>.<lang>.md` file under `src/content/products/` (per language) activates the first product page automatically.
4. **Datenschutz legal review** — optional but recommended before public launch.

---

## 13. Handoff Notes to Claude Code

1. **Read all three handoff documents first** (`TECH_STACK.md`, `CLAUDE_DESIGN_BRIEF.md`, `BASELINE_COPY.md`) plus the Claude Design handoff bundle under `design/handoff-bundle/`. Decisions are fixed; do not re-litigate hosting, framework, content model, or visual identity choices unless explicitly asked.
2. **Scaffold in this order:**
   1. Astro project with i18n (see §4.5).
   2. Tailwind + Tussock Ridge tokens from §4.
   3. Typography and global styles.
   4. Content collections and schemas from §5.
   5. Per-environment `robots.txt` and noindex injection from §3.3.
   6. Core layout (header with nav + lang/theme toggles, footer with GitHub link only).
   7. Components — built strictly from the Claude Design bundle.
   8. Pages — Home, Über/About, Kontakt/Contact, Produkte/Products (with empty state from `BASELINE_COPY.md`), Impressum, Datenschutz/Privacy, 404, all with DE + EN versions.
   9. Product detail route (`[slug].astro`) that auto-generates pages from `src/content/products/`.
   10. Releases loader and `repository_dispatch` workflow.
   11. `wrangler.jsonc` with named environments and Custom Domain bindings.
3. **Use the `frontend-design` skill** whenever writing UI components.
4. **Do not invent** company copy, product names, Impressum details, or Datenschutz text. Use exactly what's in `BASELINE_COPY.md`.
5. **Do not reference specific product names** (such as product working titles you may learn from other sources) in any generated copy. The website does not name products until they launch.
6. **Do not install a CMS.** v1 is Git-only editing.
7. **Do not swap the palette or typography.** If the design bundle from Claude Design contradicts the brief, stop and surface the conflict.
8. **Do not imply Lars is a teacher** in any generated copy. He's a developer who builds for teachers.
9. **Accessibility is a hard requirement:** AAA on brand colors against page backgrounds. Preserve hover/high-contrast/forced-colors values from the brief exactly.
10. **Preserve the IONOS email DNS records** during any DNS work (§9.2).
