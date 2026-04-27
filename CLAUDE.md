# Claude Code instructions — blackbrowedlabs.com

## Priority reading before any action

Read these in order:

1. `docs/TECH_STACK.md` — architecture and tech decisions. These are fixed; do
   not re-litigate them unless explicitly asked.
2. `docs/CLAUDE_DESIGN_BRIEF.md` — the visual system, brand narrative, and
   design principles. Source of truth for all visual decisions.
3. `docs/BASELINE_COPY.md` — editorial content for every page. Use verbatim.
4. `design/handoff-bundle/README.md` — the Claude Design export, if present.

## Workspace bootstrap

After the docs above, orient against the working state:

1. `plans/BOOTSTRAP.md` — current project state, in-flight topics, recent
   decisions. The slow-moving entry point.
2. `plans/INDEX.md` — table of contents for the workspace. Claude-maintained
   via propose-then-validate; never hand-edited.
3. `plans/HANDOFFS/` — if a file dated within the last week exists, read the
   most recent one before acting; it carries the previous session's tail
   state.

Working artefacts (plans, sub-agent reports, drafts, decision logs) live
under `plans/active/<topic>/`; closed work lives under `plans/_archive/`.
Naming, write-path, and INDEX-maintenance conventions: `plans/meta/conventions.md`.
Sub-agents dispatch on Opus by default; Sonnet only for mechanical tasks (justification in prompt frontmatter).

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

## Gate-based handoff pattern

Pass 1 shipped a working production system on the first production deploy
despite three failed staging attempts. The discipline below is what made that
possible; Pass 2 should follow it.

- For implementation work involving multiple decision points (token
  conversions, multi-step deploys, significant architecture changes), produce
  a plan document first and surface it for review before starting. Don't
  begin implementation until explicit approval.
- For each significant commit or deploy, pause at named gates (e.g., after
  `wrangler.jsonc` is written, before first deploy) and wait for confirmation.
- For diagnostic work, report findings before making changes. Don't edit
  based on an assumed fix until the diagnostic has been reviewed.
- Surface uncertainty as explicit open questions in plans, not resolved
  silently.

## Process rules from Pass 1

Specific technical lessons worth codifying:

- **Token conversion verification.** When translating design tokens between
  framework versions, diff against **both** the source preset **and** any
  companion CSS-custom-property file in the handoff bundle. Presets may omit
  aliases that the companion file declares for readability. The Pass 1
  missing-`--color-bg` bug slipped through because verification compared the
  converted file against the preset only.
- **Wrangler environment inheritance.** `wrangler.jsonc` top-level config does
  **not** inherit into named environments for several keys: `observability`,
  `vars`, `routes`, `name`, `main`, `compatibility_flags` (and more). Declare
  these inside each `env.*` block when using `--env` in `wrangler deploy`.
- **Primary-source verification for API / namespace questions.** When a task
  depends on version-specific API behavior (framework routing, build-tool
  namespaces, CLI permissions), verify against primary sources — the
  framework's own source code, official docs, maintainer statements in
  issues/discussions — before assuming. A targeted sub-agent with web search
  is a valid escalation pattern and was used three times in Pass 1.

## Skills

When writing or modifying UI components, invoke the `frontend-design` skill.

## Scope boundaries

- The `design/handoff-bundle/` directory is reference material. Read it;
  do not modify it.
- `docs/*.md` files are the canonical project documentation. Read them; do
  not modify them without explicit instruction.