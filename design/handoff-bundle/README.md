# Blackbrowed Labs — Handoff Bundle (v1)

Design-phase output for the Blackbrowed Labs website v1 — an eight-page bilingual (DE/EN) marketing site with a calm, warm, paper-before-screen aesthetic. This bundle is targeted at **Claude Code** implementing in **Astro + Tailwind**.

---

## About the design files

The files in this bundle are **design references authored in HTML**. They are not production code. They are prototypes that show intended look, typography, spacing, layout, states, and behavior. Your task is to **recreate these designs in Astro + Tailwind** using the tokens and components defined here — not to copy the HTML verbatim. The HTML uses hand-written CSS and a small React prototype layer (Babel-in-browser) purely so the designer could iterate fast in a single file per page.

When in doubt about a visual detail, the HTML pages in `design/pages/` are the source of truth; the token files describe *what* a value is called, the HTML shows *how it ends up on screen*.

## Fidelity

**High-fidelity.** Every color, every type step, every spacing value, every component state is final. No layout is approximate. Match pixel values, weights, tracking, line-heights, and hairline rules exactly. If a spec in the token file and a pixel value in the HTML disagree, the token file wins — but flag it, it's a bug.

---

## What's in this bundle

```
design_handoff/
├── README.md                         ← this file
│
├── design/
│   ├── tokens/
│   │   └── colors_and_type.css       ← CSS custom properties (runtime source of truth)
│   ├── styles/                       ← per-page stylesheets (reference for Tailwind conversion)
│   │   ├── homepage.css
│   │   ├── about.css
│   │   ├── contact.css
│   │   ├── products.css
│   │   ├── impressum.css
│   │   ├── datenschutz.css
│   │   └── notfound.css
│   ├── pages/                        ← final approved designs, 8 pages × 2 langs × 2 modes
│   │   ├── 01-homepage-de.html       (also contains: light/dark/mobile as artboards)
│   │   ├── 02-homepage-en.html
│   │   ├── 03-products.html          (DE + EN inside; each with light/dark/mobile)
│   │   ├── 04-about.html
│   │   ├── 05-contact.html
│   │   ├── 06-impressum.html
│   │   ├── 07-datenschutz.html
│   │   └── 08-404.html
│   └── jsx/                          ← React prototype source (for inspecting structure)
│       ├── design-canvas.jsx         ← presentation wrapper — ignore in production
│       ├── hero-compositions.jsx
│       ├── about.jsx
│       ├── contact.jsx
│       ├── products.jsx
│       ├── impressum.jsx
│       ├── datenschutz.jsx
│       └── notfound.jsx
│
├── dev/
│   ├── blackbrowed-preset.js         ← Tailwind preset — drop into tailwind.config.ts
│   ├── tokens.ts                     ← TS tokens for non-CSS consumers
│   └── components.html               ← every component + state, single-page reference
│
├── assets/
│   ├── fonts/                        ← Inter 300/400/500/600 (self-hosted, .woff2)
│   ├── logos/
│   │   ├── logo-horizontal.svg           ← primary — arc in gold + wordmark in neutral
│   │   ├── logo-horizontal-mono-positive.svg    ← dark on light
│   │   ├── logo-horizontal-mono-negative.svg    ← white on dark
│   │   ├── logo-stacked.svg              ← mark above wordmark (square-ish usage)
│   │   ├── logo-mark.svg                 ← arc only, Tussock Gold
│   │   ├── logo-mark-mono-positive.svg
│   │   └── logo-mark-mono-negative.svg
│   ├── favicon/
│   │   ├── favicon.svg                   ← primary (vector)
│   │   ├── favicon-16x16.png
│   │   ├── favicon-32x32.png
│   │   ├── favicon-48x48.png
│   │   └── apple-touch-icon-180x180.png
│   └── og/
│       ├── og-image-de.png               ← 1200×630 · Open Graph · German
│       └── og-image-en.png               ← 1200×630 · Open Graph · English
│
└── docs/
    └── BASELINE_COPY.md              ← all copy, DE + EN, used verbatim in the mocks
```

The other two handoff docs referenced by BASELINE_COPY — `TECH_STACK.md` and `CLAUDE_DESIGN_BRIEF.md` — live alongside this bundle in the repo (not inside the zip, they're your upstream brief). This bundle implements what those documents describe.

---

## Design system summary

Four brand roles (Tussock Gold primary, Ridge Teal accent, Volcanic Stone neutral, Peat Ember error), warm-dominant surfaces (never grey), Inter 300/400/500/600 only (no 700+), a fluid type scale, a 4-px spacing base, mostly rectangular radii (0/2/4/6 px), and calm motion (120/200ms ease). Light and dark modes are identical compositions with swapped tokens — toggled via `data-theme="dark"` on `<html>`. All accessibility-critical combinations hit WCAG AAA at high-contrast variants. Text is AAA-compliant on all surfaces in both modes.

The visual signature is a single hand-drawn arc ("the albatross") that appears across every page — in the nav, as a wordless mark on About, at display scale on 404, and as the structural motif in hero composition C on the homepage.

## Implementation orientation

**Tokens before components.** Start by wiring `design/tokens/colors_and_type.css` into your Astro global stylesheet and `dev/blackbrowed-preset.js` into `tailwind.config.ts`. Everything else references these.

**Fonts.** Inter weights 300/400/500/600 are included as self-hosted `.woff2` in `assets/fonts/`. The `@font-face` declarations at the top of `colors_and_type.css` show the exact filenames. Do not load Inter from a CDN — Lars explicitly wanted self-hosted.

**Theme toggle.** The site supports Light / Dark / System. On first paint, respect `prefers-color-scheme`; user choice (when set) is persisted in `localStorage` under `bbl-theme`. The actual swap is a single `data-theme="dark"` attribute on `<html>` — no class toggling, no Tailwind `dark:` variants needed because the tokens resolve automatically.

**Language switcher.** German is primary (`/`), English is secondary (`/en/`). Every page has both versions side-by-side in the mocks. The switcher is a two-button DE / EN group in the top nav; the active language is set by route, not by JavaScript state.

**Legal pages.** Impressum and Datenschutz are legally authoritative in German. The English versions carry a one-line courtesy-translation note at the top. Do not translate legal-authority statements away — keep them as drafted in BASELINE_COPY.md.

**Responsive breakpoints.** Each page is designed at three widths: desktop (1440), mobile (360). The design-canvas artboards show exact compositions. For the tablet range in between, scale linearly — the fluid type scale and max-widths do most of the work. There is no separate tablet composition.

**Container.** `--container-max: 1200px` is the reading container on every page. Full-bleed backgrounds extend to the viewport; content stops at 1200.

---

## Page-by-page implementation notes

1. **Homepage (`/`, `/en/`)** — One of two centered pages on the site (the other is 404). Hero composition C is approved; the arc is the structural motif behind the wordmark. Three variants (light desktop, dark desktop, mobile 360) share a composition. Implementation: single Astro page, route-localized copy.

2. **Products (`/produkte`, `/en/products`)** — Empty state in v1. Reading-posture layout, asymmetric, with an atmospheric arc in the right column. When the first product Markdown file appears under `src/content/products/`, this page will render a grid of product reference cards instead (see `dev/components.html` → Product reference card for the template).

3. **About (`/ueber`, `/en/about`)** — Left-anchored reading page. Asymmetric columns; the arc appears unlabeled in the right column as a wordless signature. Do not re-add the caption that was removed in revision — the arc carries its own weight here.

4. **Contact (`/kontakt`, `/en/contact`)** — No contact form. A direct-email composition: large mailto link, a short "what to expect" paragraph, working hours. Stay restrained; the absence of a form is intentional.

5. **Impressum (`/impressum`, `/en/legal`)** — German legal-notice requirement under § 5 TMG. The English version is a courtesy translation with an explicit note at the top.

6. **Datenschutz (`/datenschutz`, `/en/privacy`)** — Long reading page, numbered sections, restrained two-column TOC (single-column on mobile). Same courtesy-translation note on EN.

7. **404 (`*`)** — Centered. Arc at large scale above a display-scale "404" in Tussock Gold. Short lead, short body (one sentence), arrow link back home. No emoji, no search box, no list of popular pages — the copy does the work.

The eight pages are final. They will ship as a vertical-slice in two batches — Homepage + About first to prove the system end-to-end (theme toggle, language switcher, real deployment), then the remaining six. No page is lower-fidelity or lower-priority; the phasing is implementation-side only.

---

## Component inventory

Full visual reference in `dev/components.html`. Short list with state coverage:

- **Top navigation** — desktop (logo left, links center, lang + theme right) and mobile (logo + hamburger). Hairline bottom border.
- **Footer** — three zones (brand / nav / meta). Collapses to a single column on mobile.
- **Buttons** — primary (Tussock Gold), accent (Ridge Teal), ghost (outlined), destructive (Peat Ember). States: default, hover, focus (2-px ring), active, disabled. No icon-only variant in v1.
- **Form inputs** — text, email, textarea, select, checkbox, radio. States: default, focus, error. No contact form on the site in v1; these are for future product forms.
- **Callouts** — default and error variants. Hairline left-border, small body, no icons.
- **Tags / badges** — neutral outline plus primary/accent tints. Uppercase, letter-spaced.
- **Release-notes card** — date + version meta, H3, short body. Stack separated by hairlines.
- **Product reference card** — template for future product pages. Role eyebrow, name H3, one-line description, meta row. Always left-aligned.
- **"Coming soon" empty state block** — used on Products in v1. Centered, warm card, H2 display-weight, muted supporting line.
- **Breadcrumb** — used on About, Contact, Impressum, Datenschutz. Uppercase caption scale.
- **Language switcher** — two-button group, DE / EN, separator slash. `aria-pressed` on the active button.
- **Theme toggle** — simple sun/moon button in the top nav (two-state, System is inferred from OS when unset); three-state group (Light / Dark / System) lives in a future settings menu.
- **Inline code + code block** — JetBrains Mono, warm card background, 1-px border.
- **Arrow link** — text link with `→` glyph; on hover the gap widens from 8px to 12px over 200ms. Used heavily: "Zurück zur Startseite →", "Was hier gerade entsteht →".

---

## Assets

- **Logo.** Primary is the horizontal mark + wordmark. Mono positive/negative variants ship for out-of-brand contexts (e.g. press). The mark alone is the favicon and the 404 flourish. Stacked logo is for square-ish placements (app icon, profile image). Minimum size: 24px for the mark, 120px wide for the horizontal.
- **Favicon.** SVG is the primary. PNG rasters (16/32/48) are provided for older clients. Apple touch icon is 180×180; iOS applies its own mask so do not round the corners.
- **OG images.** 1200×630, DE and EN. Used as `og:image` on all pages in the matching language; individual pages may override with page-specific OG images later.

## Interactions & motion

- **Durations.** `--dur-fast: 120ms` for small hover transitions (link color, border). `--dur-base: 200ms` for larger transitions (arrow-link gap growth, nav mobile panel).
- **Easing.** `--ease: cubic-bezier(0.2, 0, 0, 1)` for everything. No bounces, no overshoot.
- **Reduced motion.** `@media (prefers-reduced-motion: reduce)` already disables all transitions in `colors_and_type.css`. Inherit that in production — do not add motion past the `prefers-reduced-motion` gate.
- **No scroll-driven animation.** Explicitly out of scope for v1.

## Accessibility requirements

- All interactive elements have a visible focus state (2-px ring, 2-px offset, `--color-focus-ring`).
- Language attribute on `<html>` must match the route (`de` or `en`).
- Legal pages must link between languages; the courtesy-translation note on EN must be present and prominent.
- Color contrast: all text on all surfaces passes WCAG AA in both modes; the `-hc` variants (`--bbl-primary-hc`, etc.) are available for stricter AAA contexts (e.g. long body text at small sizes on warm surfaces). Use the `-hc` variants in legal-page body copy.
- No text is image-only. The arc is decorative and carries `aria-hidden="true"` in the nav; on the 404 page it's labeled ("Der Blackbrowed-Labs-Bogen" / "The Blackbrowed Labs arc") because it's the visual anchor.

## Files you'll edit first

If you're implementing the vertical slice (Homepage + About) before the rest:

1. `astro.config.mjs` — wire Inter fonts, set i18n routing.
2. `tailwind.config.ts` — add `presets: [require('./design-system/blackbrowed-preset.js')]`.
3. `src/styles/tokens.css` — copy from `design/tokens/colors_and_type.css`.
4. `src/layouts/BaseLayout.astro` — top nav, footer, theme script, language meta.
5. `src/pages/index.astro` and `src/pages/en/index.astro` — hero composition C.
6. `src/pages/ueber.astro` and `src/pages/en/about.astro`.

Everything else can wait for the second batch.

---

## Questions

Use BASELINE_COPY.md for any copy question. Use the HTML pages for any layout question. If something is genuinely underspecified, the design owner is Lars — open a comment on the relevant mock and it'll be resolved before merge.
