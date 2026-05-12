# CSS conventions — Blackbrowed Labs site

Codified during Phase J of Pass 3 (2026-05-12) as the first
multi-extraction CSS work crossed the threshold where conventions
needed to be explicit. Treat this doc as the authority for any
future CSS-sharing decision; deviate only with an explicit
rationale recorded in the deviating plan.

## 1. Module location

CSS shared across more than one page template or component lives at
`src/styles/<topic>.css`, where `<topic>` names the subtree
(`products.css`, `forms.css`, etc.). Each module is imported
exactly once via `@import` at the top of `src/styles/global.css`.
The whole site loads `global.css` (via `src/layouts/BaseLayout.astro`),
so the shared modules cascade everywhere.

Per-component or per-page CSS that is genuinely local — rules that
do not appear elsewhere in the codebase — stays in the
component's scoped `<style>` block. Astro 6's per-component
`<style>` scoping is intentional; do not retire it for rules that
have a single consumer.

## 2. Class naming

Class names use BEM-style namespacing: `block__element--modifier`,
where `block` corresponds to the high-level component or page
section (e.g. `products-index`, `product-detail`, `contact-form`).
Shared CSS modules in `src/styles/` declare each block's rules side
by side, without collapsing distinct blocks under a single generic
class.

The design bundle's `.btn` / `.field` global vocabulary
(`design/handoff-bundle/dev/components.html`) is reference-only.
Components do NOT consume those names as runtime classes; instead
each block re-implements the visual treatment under its own BEM
scope (`.contact-form__submit`, `.contact-form__field`, etc.). This
keeps markup stable across CSS reorganizations and avoids
fragile cross-component class coupling.

## 3. Scope of extraction

Extraction is full-block: a duplicate-across-files `<style>` block
moves to `src/styles/<topic>.css` in its entirety, including
layout-affecting rules (max-width, margin, padding, grid / flex
containers). Page-private rules — rules that genuinely differ
between consumers — stay in the page's residual scoped block. If a
page has zero page-private rules after extraction, the scoped
`<style>` block is removed entirely.

The trigger for extraction is the appearance of a third byte-
identical scoped block. Two consumers (a single DE/EN sibling pair)
is review discipline territory — co-locate the styles and review the
two scoped blocks together. Three or more is shared-module territory.

## 4. Specificity discipline

Shared modules contain only single-class or single-element
selectors — no `:where()`, no `!important`, no descendant chains
deeper than two levels. Where a page genuinely needs to override a
shared rule, the override lives in the page's residual scoped
`<style>` block (which Astro automatically scopes higher than
global module CSS via its scoped-class suffix). Global modules
should never need to "win" over scoped pages.

## 5. Module-import order in `global.css`

```css
@import "tailwindcss";
@import "./tokens.css";
@import "./<topic-1>.css";
@import "./<topic-2>.css";
/* ... base element styles below */
```

Order: tokens always first (every other module depends on the
custom properties); shared modules in alphabetical order after.
Tailwind's `@import "tailwindcss"` stays first because Tailwind 4's
`@theme` directives must register before `@theme` consumers.
