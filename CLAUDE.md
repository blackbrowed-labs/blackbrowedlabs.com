# Claude Code instructions — blackbrowedlabs.com

## Priority reading before any action

Read these in order:

1. `docs/TECH_STACK.md` — architecture and tech decisions. These are fixed; do
   not re-litigate them unless explicitly asked.
2. `docs/CLAUDE_DESIGN_BRIEF.md` — the visual system, brand narrative, and
   design principles. Source of truth for all visual decisions.
3. `docs/BASELINE_COPY.md` — editorial content for every page. Use verbatim.
4. `design/handoff-bundle/README.md` — the Claude Design export, if present.

## Core principles

- This is a **content website**, not an application. Prioritize performance,
  accessibility, and long-term maintainability over feature complexity.
- **Do not install a CMS.** v1 is Git-only editing.
- **Do not invent content.** Company copy, product names, the Impressum, and
  the Datenschutzerklärung are all specified in `BASELINE_COPY.md`. Use them
  verbatim. Do not paraphrase.
- **Do not swap the palette or typography.** If the design bundle contradicts
  the brief, stop and surface the conflict rather than improvising.
- **Do not imply Lars is a teacher.** He is a software developer who builds
  for teachers. Copy, alt text, and meta descriptions must reflect this
  accurately.
- **Accessibility is a hard requirement.** AAA on brand colors against page
  backgrounds. Preserve hover/high-contrast/forced-colors values from the
  brief exactly.
- **Preserve IONOS email DNS records** during any DNS work. The MX, SPF,
  DKIM, DMARC, and autodiscover records must survive any Cloudflare
  configuration changes.

## Implementation phasing

v1 ships in two passes:

**Pass 1 — vertical slice.** Scaffold the Astro project with the design system
wired up. Implement Homepage and About in both languages and both modes (light,
dark, mobile). Deploy to `dev.blackbrowedlabs.com` for real-browser validation
of the language switcher, theme toggle, responsive breakpoints, and overall
feel.

**Pass 2 — remaining pages.** After Pass 1 is validated in real deployment,
implement Products (with empty state), Contact, Impressum, Datenschutz, and 404.

## Skills

When writing or modifying UI components, invoke the `frontend-design` skill.

## Scope boundaries

- The `design/handoff-bundle/` directory is reference material. Read it;
  do not modify it.
- `docs/*.md` files are the canonical project documentation. Read them; do
  not modify them without explicit instruction.