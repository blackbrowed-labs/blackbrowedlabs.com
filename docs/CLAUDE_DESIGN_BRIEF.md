# Blackbrowed Labs — Claude Design Brief

> **Use this document as the onboarding brief for a new Claude Design project.**
> It contains everything Claude Design needs to build a consistent design system and page set for the Blackbrowed Labs marketing website: brand story, logo direction, color palette, typography, voice, deliverables, and accessibility requirements. Pair it with `TECH_STACK.md` for implementation context and `BASELINE_COPY.md` for initial copy.
>
> **Status of decisions in this brief:** the logo direction (A1 "The Soaring Line"), the color palette (Tussock Ridge), and the typography choice (Inter) are **finalized**, not open for exploration. Claude Design's job is to apply them to layouts and components, not to re-propose alternatives.

---

## 1. Project Overview

Design a marketing website for **Blackbrowed Labs**, a one-person educational software studio. The site introduces the studio and acts as a light presence for its products — each product will live primarily on its own dedicated website, with only a brief reference here. Single editor; low update frequency; strong preference for timeless over trendy.

**Deliverables expected from Claude Design:**

1. **A coherent design system** derived from the inputs in this brief (see §4–§8).
2. **Page designs** for: Homepage, Product Detail (minimal presence pattern), Product Index (with an empty "coming soon" state for v1), About, Contact, Legal (Impressum + Datenschutz), 404.
3. **Component library:** navigation, footer, hero, content blocks, product reference card, release-notes card, form elements, buttons, tags, callouts.
4. **Light and dark mode** for every screen.
5. **German (primary) and English (secondary)** content examples. Keep German line lengths in mind — they run longer than English.
6. **Identity assets:**
   - Favicon SVG (scales cleanly 16 / 32 / 48)
   - Apple touch icon 180×180
   - Open Graph image 1200×630 (localised DE + EN)
   - Social preview variations if needed
7. **A handoff bundle** for Claude Code including design tokens (colors, type scale, spacing) and component states (default, hover, focus, active, disabled, error) in both modes.

---

## 2. About Blackbrowed Labs

Blackbrowed Labs is a one-person software studio based in Reinbek, Schleswig-Holstein (near Hamburg, Germany). It makes software for **classroom management** — tools that help teachers with the practical work of running their classes.

**Founder positioning — important for copy and tone:**
The founder, Lars Weiser, is a **software developer**, not a teacher. He builds for teachers through close working relationships with them: friends, family, long conversations with working educators about what actually helps in the classroom. The products are shaped by these conversations, not by generic "edtech" assumptions.

**Do not write copy implying Lars teaches or has classroom experience he doesn't have.** The honest positioning — a developer who listens carefully to teachers and builds what they actually need — is the right one, and it's genuinely distinctive in edtech (most edtech founders are either former teachers with opinions or VCs with none).

**Current areas of development**
- An iPadOS app for classroom management (grades, student work, observations, without paperwork). Launches on its own domain with its own website.
- A Claude Cowork plugin that helps teachers plan units and lessons.

**Do not mention specific product names or working titles** in the website copy. Products are introduced by name only when they formally launch. Until then, they're referenced by area of focus.

**What the studio is**
- Small, independent, founder-led.
- Built on craftsmanship, not venture growth.
- German roots with international reach; English is first-class from day one.

**What the studio is not**
- Not a platform. Not a marketplace. Not a SaaS with enterprise sales motions.
- Not chasing AI hype for its own sake, though AI is used where it genuinely helps.
- Not aimed at students directly — teachers are the user.

**Audience**
- Primary: German secondary-school teachers (Gymnasium, ages 11–19), technologically curious, iPad/Mac users.
- Secondary: international educators following from Bluesky/GitHub/Apple platforms.
- Tertiary: fellow indie developers and educators discovering the studio through its products and writing.

---

## 3. Brand Narrative

The name **Blackbrowed Labs** comes from the **Black-browed Albatross** (*Thalassarche melanophris*) — the most widespread albatross of the southern hemisphere, recognizable by the dark stripe above its eye. Albatrosses are the long-distance gliders of the sea: a single bird can travel thousands of kilometers with almost no flapping, riding the energy of the wind through a technique called dynamic soaring.

The metaphor for the studio is precise, not decorative:
- **Endurance over velocity.** Teachers' work is the long flight. The tools should last.
- **Efficiency.** Minimum energy, maximum distance. Software that respects a teacher's time.
- **Wide view.** The albatross sees the whole ocean. Products that take the whole classroom into account, not just one lesson or one feature.
- **Precision.** The "black brow" is a single dark stroke on an otherwise white face — the defining feature is a small, deliberate mark. Good design is the same.

**The amber eye**
The Black-browed Albatross has a warm amber-gold eye set against the dark brow stripe. That gaze — the intelligent attention of a bird that navigates thousands of kilometres of featureless ocean — is the brand's primary color (Tussock Gold). The palette's "gold" references both the tussock grass of the bird's breeding grounds *and* the amber of its own eye. The two sources reinforce each other.

**Landscape**
The albatross breeds on the Falkland Islands and South Georgia: windswept volcanic ridges covered in golden tussock grass, cold ocean below, cold light above. This landscape is the source of the color palette (§4). The brand is grounded in this specific place — not "nature" in the abstract, but the Falklands specifically. Warm earth, cold sea, low sun.

**What this brand sounds like**
- Calm. Exact. Kind.
- Not corporate, not cute, not breathless.
- A tone closer to Panic's or Ghostly's or Craft's writing than to most edtech marketing.

---

## 4. Color System — "Tussock Ridge"

A four-role, warm-dominant palette in both light and dark modes. All eight brand values meet **WCAG AAA** (≥7:1) against the page background. Verified with programmatic WCAG 2.x contrast calculations.

### 4.1 Role assignment

| Role | Purpose |
|---|---|
| **Primary — Tussock Gold** | Hero, CTAs, headings, the brand signature |
| **Accent — Ridge Teal** | Secondary interactive elements, links, depth contrast |
| **Neutral — Volcanic Stone** | Text, borders, structural elements with warm undertone |
| **Error — Peat Ember** | Form errors, destructive actions, critical alerts |

### 4.2 Light mode

| Role | Name | Hex | HSL | vs `#FFFFFF` |
|---|---|---|---|---|
| Primary | Tussock Gold | `#7D4912` | (31°, 75%, 28%) | **7.41 : 1 AAA** |
| Accent | Ridge Teal | `#1C5E66` | (186°, 57%, 25%) | **7.39 : 1 AAA** |
| Neutral | Volcanic Stone | `#2C2622` | (24°, 13%, 15%) | **14.92 : 1 AAA** |
| Error | Peat Ember | `#882218` | (5°, 70%, 31%) | **9.17 : 1 AAA** |

**Surfaces:** bg `#FFFFFF`, bg-warm `#FBF7F2`, bg-card `#F5F0E9`, border `#D6CDBE`

**Hover states:** primary `#6A3D0F`, accent `#174E55`, error `#751E15` (all AAA)

**High-contrast mode:** primary `#5C360D`, accent `#134B52`, neutral `#1A1614`, error `#6A1C14`

### 4.3 Dark mode

| Role | Name | Hex | HSL | vs `#1C1C1E` |
|---|---|---|---|---|
| Primary | Tussock Gold | `#D4A45C` | (36°, 58%, 60%) | **7.51 : 1 AAA** |
| Accent | Ridge Teal | `#7CB3BC` | (188°, 32%, 61%) | **7.32 : 1 AAA** |
| Neutral | Volcanic Stone | `#E0D8CE` | (33°, 22%, 84%) | **12.06 : 1 AAA** |
| Error | Peat Ember | `#EC9C8C` | (10°, 72%, 74%) | **7.86 : 1 AAA** |

**Surfaces:** bg `#1C1C1E`, bg-warm `#24221F`, bg-card `#2E2A26`, border `#4A443E`

**Hover states:** primary `#DFB26E`, accent `#8EC1C9`, error `#F0A494`

**High-contrast mode:** primary `#E2B87A`, accent `#92C6CE`, neutral `#F0EAE2`, error `#F0AC9C`

### 4.4 Functional aliases

```
--color-text          → neutral
--color-text-muted    → neutral @ 70% opacity
--color-link          → accent
--color-link-hover    → accent-hover
--color-focus-ring    → primary
--color-error-text    → error
--color-error-bg      → error @ 10% opacity
--color-surface       → bg
--color-surface-warm  → bg-warm
--color-surface-card  → bg-card
--color-border        → border
```

### 4.5 Button text contrast (verified AAA)

White text on light-mode color chips; dark (`#1C1C1E`) text on dark-mode color chips. Never white on pure black (halation).

### 4.6 Color-blindness considerations

Primary–Accent pair (Gold + Teal) sits on different color channels; maximally safe under red-green CVD. Error (Peat Ember) shifts toward dark olive-brown under protanopia/deuteranopia, so error states must always be communicated with **icon + text + color**, never color alone.

### 4.7 Where each surface is used

- `bg`: default page background.
- `bg-warm`: full-bleed hero sections, section dividers, quote blocks — anywhere the page wants to feel like paper more than screen.
- `bg-card`: cards (product tiles, release-notes entries, callouts).
- Border-only cards preferred over shadowed cards — this is a flat, paper-like aesthetic.

### 4.8 Practical contrast note for warm surfaces

On warm surfaces (`bg-warm` and `bg-card`), Tussock Gold and Ridge Teal drop from AAA to AA (6.52–6.95:1). This is intentional and acceptable because:

- At heading sizes (≥18pt regular, or ≥14pt bold), the AAA threshold is only **4.5:1** — so gold headings on warm cards comfortably exceed AAA for large text.
- Body text always uses Volcanic Stone, which remains AAA on every surface (10.09:1 or higher).
- Only **small body text** in Tussock Gold or Ridge Teal on cards is ever below AAA. That combination should be avoided; use regular-weight gold/teal only at heading scale, or on pure `bg` white instead.
- Error text (Peat Ember) is always AAA on every surface.

---

## 5. Typography

### 5.1 Typeface

**Inter** (variable), self-hosted. One typeface for the entire site; no secondary display face.

Fallback stack: `Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Helvetica, Arial, sans-serif`.

### 5.2 Weights

- 300 Light — display, large headings, wordmark
- 400 Regular — body
- 500 Medium — UI labels, nav, small headings
- 600 Semibold — emphasis inside body, strong button text

No 700+ weight. The brand reads light and precise, not heavy.

### 5.3 Scale (fluid)

| Role | Size (min → max) | Weight | Line | Tracking |
|---|---|---|---|---|
| Display (hero) | `clamp(2.75rem, 6vw, 4.5rem)` | 300 | 1.05 | -0.02em |
| H1 | `clamp(2rem, 4vw, 3rem)` | 300 | 1.1 | -0.015em |
| H2 | `clamp(1.5rem, 3vw, 2.25rem)` | 400 | 1.2 | -0.01em |
| H3 | `1.375rem` | 500 | 1.3 | -0.005em |
| H4 | `1.125rem` | 500 | 1.4 | 0 |
| Body (lead) | `1.1875rem` | 400 | 1.6 | 0 |
| Body | `1.0625rem` | 400 | 1.65 | 0 |
| Small | `0.9375rem` | 400 | 1.55 | 0 |
| Caption / meta | `0.8125rem` | 500 | 1.45 | +0.02em |
| Wordmark | fixed per use | 300 | — | +0.10em |

Body text measure capped at `70ch`. Never full-width prose on desktop — the reading experience falls apart past ~75 characters, and this is a reading-first site.

### 5.4 Headings

Light-weight (300/400), not bold. Visual hierarchy comes from size, color contrast, and space — not weight. This pairs with the "precision" theme of the brand and matches the A1 logo's own light feeling.

---

## 6. Logo — A1 "The Soaring Line"

**Finalized direction.** Not open for re-exploration; execute it.

### 6.1 Icon

A single unbroken line tracing the arc of a black-browed albatross in dynamic soaring. Characteristics:
- Starts medium-thin, **thickens** through the main arc (representing lift / momentum), then **tapers to a hairline** at the trailing end (precision / finesse).
- At the apex of the arc there is a **subtle angle change** — the "brow." Small, deliberate, not decorative.
- Horizontal proportion ≈ 3:2 within its bounding box.
- Primary color in the given mode.

### 6.2 Wordmark

- Typeface: **Inter Light (300)**.
- Text: "Blackbrowed Labs" (one word "Blackbrowed", no hyphen, no camel case).
- Tracking: **+0.10em**. The wider tracking turns the wordmark into a logotype rather than a heading — the eye reads the full word as a shape, not as letters being decoded.
- Color: the wordmark is set in the **neutral**, not the primary. Light mode: `#2C2622` (Volcanic Stone). Dark mode: `#E0D8CE` (Volcanic Stone dark). This creates hierarchy with the mark — the arc leads in Tussock Gold, the wordmark supports in Volcanic Stone. Never set the wordmark in Tussock Gold; two gold elements of similar weight compete.
- Placed to the right of the icon with a small optical gap, or stacked with the icon above on narrow layouts.

### 6.3 Lockups

Produce, at minimum:
1. Horizontal lockup (icon + wordmark, default use).
2. Stacked lockup (icon over wordmark, square footprint).
3. Icon-only mark (avatar, favicon, app icon).
4. Wordmark-only (very small footer contexts where the icon would muddy).

### 6.4 Favicon / app icon behavior at small sizes

- At 48px and above: render the full arc with its taper.
- At 32px: simplify to a uniform-stroke arc with the brow kink still visible.
- At 16px: consider a further simplified two-line glyph (the brow kink only) if the full arc becomes muddy. Whichever resolves most clearly at 16px wins.

### 6.5 Clear space

Minimum padding around the lockup = the x-height of the wordmark on all sides.

### 6.6 Misuse

Do not: add a container, tilt, outline, gradient, color-fill with anything outside the four brand colors, or animate on hover in a way that breaks the single-line integrity. The arc is never closed into a shape.

---

## 7. Voice & Tone

- **First person singular, never plural.** "We" implies a team; this is one person. "I" on authored content; brand name everywhere else.
- **Lars is not a teacher.** Copy should position him as a developer who builds for teachers, based on listening to them. Do not fabricate classroom experience. The honest framing is more distinctive than the faked one.
- **No product names** in the production website's editorial copy until products formally launch. (Dev may carry drafted/scheduled named entries for in-progress verification.) Reference products by area of focus in editorial text.
- **German copy:** clear Hochdeutsch, no buzzwords, no Anglizismen unless the English term is genuinely the term of art (e.g., "Release Notes" is acceptable; "Solution Provider" is not).
- **English copy:** plain English. Short sentences. British or American are both fine; be consistent per page.
- **Never call teachers "users."** Call them "teachers" or "Lehrkräfte" or address them directly.
- **Avoid:** "empowering," "revolutionary," "seamless," "unlock," "game-changer," and the entire word-set of generic edtech marketing.
- **Okay, even good:** specific, concrete claims. Names of actual subjects when relevant. The word "Unterricht." Screenshots over stock photos. Long-form writing over bullet lists.

Draft copy reflecting this voice is in `BASELINE_COPY.md`.

---

## 8. The Four Rules

These are the hard rules. They are enforceable on every page and every component. If something breaks one, it's wrong.

1. **Gold headings, stone body, teal links.** This hierarchy never changes. Consistency trains the eye.
2. **Warm surfaces, not grey — grey is banned.** This is a Falklands palette, not a corporate-grey palette. Every background surface carries a faint warm tint. No `#666`, no `#888`, no `#ccc`. Even dividers use `--color-border` (warm sand).
3. **Error is warm red, not cold crimson.** Peat Ember belongs to the palette's warm family. It signals urgency without breaking temperature coherence.
4. **Use semantic aliases, not raw variables.** Code references `--color-link`, not `--bbl-accent`. The alias layer lets roles change without find-and-replace.

## 8a. Design Principles

These are softer design intentions — things that guide judgement calls where the rules don't cover every case.

1. **Paper before screen.** The site should feel like a well-set printed page that happens to be on a screen. Generous margins, quiet typography, hairline borders.
2. **Light, not loud.** Weight 300–500 does most of the work. Dark bold type is rare and reserved.
3. **Space is content.** Whitespace is not empty; it's the frame that lets the material breathe.
4. **One idea per section.** Homepage sections do one thing each. No multi-column mosaics.
5. **The gold is a guest, not the host.** Tussock Gold is used intentionally — primary CTAs, headings that really matter, the logo. Not sprinkled. When gold appears, it should feel earned.
6. **No ornament.** No gradients, no glassmorphism, no decorative illustrations, no generic SVG blobs, no icon sets that don't match Inter's geometry. Line icons only (24px grid, 1.5px stroke, rounded caps).
7. **Accessibility is the design, not a layer on top.** Every decision from palette to scale was made with AAA contrast as a floor.
8. **Two modes, one soul.** Light and dark must feel like the same brand, not two brands.
9. **Left-aligned, never justified.** Justified text creates uneven word spacing, especially problematic with long German compounds.
10. **Measure before ornament.** Body text caps at **70ch**. Beyond that, reading comprehension drops and the page stops feeling designed.

---

## 9. Pages & Components to Design

### 9.1 Pages

1. **Homepage** — Hero (brand statement, no hard CTA since no product yet; primary action is a subtle "see what's being built" link to Products). Short "what Blackbrowed Labs is" paragraph. Optionally a link to About. Footer.
2. **Product Detail** (template, not used in v1) — Minimal-presence pattern: product name, tagline, short description, **prominent CTA to the product's own external website**, current version badge, list of recent releases (auto-populated from GitHub). Not a marketing page — a reference card.
3. **Product Index** — Grid of product tiles. In v1, renders a **"coming soon" empty state**. Same template later holds real products; no special code path.
4. **About** — Long-form. Visual side of the layout is intentionally flexible: gracefully holds any one of (a) a founder portrait, (b) the arc mark at display size, or (c) a pull-quote. Default state uses the arc mark.
5. **Contact** — Email address and the GitHub org link. No contact form in v1.
6. **Impressum** — Legal page, German (English mirror).
7. **Datenschutzerklärung** — Legal page, both languages.
8. **404** — A calm, on-brand not-found page with a link back home and the arc mark at large size.

### 9.2 Components

- **Top navigation:** logo left; nav right (Products, About, Contact); language switcher (DE/EN); theme toggle (Light/Dark/System).
- **Footer:** three columns on desktop (Products, About, Legal), single column on mobile. Copyright + small arc mark + GitHub link.
- **Hero:** variant A (text only, generous padding), variant B (text + product icon), variant C (text + screenshot).
- **Product reference card** — the core repeated component:
  - Product icon
  - Product name as H1
  - Tagline
  - Short description paragraph
  - Current version chip (e.g. `v1.2.0`) with "latest" badge
  - Large CTA button linking to the product's own website
  - Secondary: release history below
- **Release-notes card:** version tag, date, release name, Markdown body, "View on GitHub" link.
- **"Coming soon" state card:** for the Products index in v1. Feels intentional and calm, not apologetic. Uses the arc mark.
- **Callout / aside:** warm surface, hairline border, optional icon.
- **Buttons:** primary (filled gold), accent (filled teal), ghost (text-only accent with underline on hover), destructive (filled ember). All AAA text contrast.
- **Form fields:** text input, textarea, checkbox, radio, select. Focus ring = Tussock Gold outline, 2px, with 2px offset. Error state = Peat Ember border, icon, and helper text.
- **Tag / badge:** small pill for version numbers. Hairline border + bg-warm fill.
- **Inline code + code block:** monospace (JetBrains Mono or SF Mono fallback, self-hosted). Code blocks on `bg-warm`, hairline border.

### 9.3 Identity assets (for Claude Code handoff)

- **Favicon SVG** (primary), plus rasterised 16/32/48 PNGs as fallbacks.
- **Apple touch icon** 180×180 PNG.
- **Open Graph image** 1200×630 — one DE variant, one EN variant. Uses the arc mark + wordmark on a `bg-warm` background with the tagline.
- **Social banner variations** as needed (optional).

### 9.4 Imagery

- Founder portrait: real photograph if provided later; neutral background, warm light if possible. Not confirmed for v1 — layout must work without one.
- Product screenshots: actual product UI, framed with a subtle rounded corner and a hairline border.
- No stock photography. No generic "business people" imagery. No AI-generated decorative imagery.

---

## 10. Accessibility Requirements

Non-negotiable:

- **WCAG AAA** for all brand-color text/background combinations against page backgrounds.
- **WCAG AA minimum** for text on `bg-card` surfaces (see §4.8 for the practical carve-out).
- **Skip link first:** a "Skip to main content" link must be the first focusable element on every page. Visible on keyboard focus, hidden otherwise.
- **Focus visible:** every interactive element has a visible focus ring using `--color-focus-ring`, never `outline: none` without a replacement.
- **Minimum target size:** 44×44 CSS pixels for all interactive elements on touch surfaces.
- **Color is never the only signal:** errors, success, warnings all use icon + text + color.
- **Reduced motion:** honor `prefers-reduced-motion` — disable any non-essential animation entirely.
- **Forced colors:** remain usable under Windows High Contrast mode.
- **Keyboard-complete:** every page fully operable with keyboard only, logical tab order.
- **Semantic HTML:** no div-soup. `<nav>`, `<main>`, `<article>`, `<aside>`, `<footer>` correctly. Headings in correct outline (no skipped levels).

---

## 11. Technical Constraints (Handoff Context)

The design will be implemented in Astro + Tailwind, deployed on Cloudflare Workers. Design should translate cleanly.

### 11.1 Fully responsive — required

Every page, every component, every image must work from **360px to ≥1440px** without horizontal scrolling, without content overflow, and without desktop-only interactions. Responsiveness isn't an afterthought — it's a baseline requirement.

**Breakpoints (Tailwind defaults):**

| Tailwind prefix | Width | Role |
|---|---|---|
| (none) | <640px | Mobile, single column, stacked navigation (hamburger) |
| `sm:` | ≥640px | Small tablet / large phone |
| `md:` | ≥768px | Tablet, two-column layouts allowed where appropriate |
| `lg:` | ≥1024px | Desktop, full layout |
| `xl:` | ≥1280px | Large desktop |

**Content max-width:** 1200px, centered, with fluid side padding.

**Responsive typography:** already handled by the fluid `clamp()` scale in §5.3. No fixed `font-size` on `html` or `body`. Inherit from the root.

**Responsive images:** use Astro's `<Image />` or `<Picture />` components to generate `srcset` and `sizes` automatically. Modern formats (AVIF primary, WebP fallback). No JPEG heroes.

**Touch-friendly controls:** no hover-only interactions. Any menu, tooltip, or disclosure that reveals content on hover must also respond to tap/focus. Tap targets minimum 44×44 CSS px.

### 11.2 Other constraints

- **No heavy frontend JS.** Hover states fine; scroll-jacking, complex parallax, WebGL backgrounds are not.
- **Dark mode:** `.dark` class on `<html>`, set via a tri-state toggle (Light / Dark / System).
- **Fonts are self-hosted.** No Google Fonts CDN link in any mockup.
- **No third-party embeds** without a GDPR review.

Handoff bundle should include: design tokens (colors, type scale, spacing) in a format Claude Code can translate into `tailwind.config.ts`; all component states (default, hover, focus, active, disabled, error); both modes for every screen; identity assets; and a short per-component note on intent.

---

## 12. What Success Looks Like

When the Claude Design project is done, the handoff bundle should make a Claude Code engineer's job nearly mechanical: translate tokens to Tailwind, build the components, wire the content. There should be no open questions about color, type, hierarchy, or component behavior.

Claude Design should resist the urge to "improve" the palette, add a secondary typeface, or introduce a mascot illustration of an albatross. The restraint is the brand.

— End of brief —
