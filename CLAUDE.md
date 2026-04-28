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
- **Hybrid Workers + Static Assets posture (since Phase B.1).** The deploy
  is mostly Workers Static Assets (the `./dist` build is served directly
  via `env.ASSETS.fetch`), with one narrow Worker entry at
  `src/worker/index.ts` for `POST /api/contact` only. Every other path
  falls through to the assets binding. This is the exception, not a new
  norm: future surfaces should default to "assets-only" and earn a Worker
  carve-out only when a static page genuinely cannot serve the use case.
  The `wrangler.jsonc` comment block carries the same posture statement
  alongside its env-inheritance gotcha.

## Skills

### `frontend-design`

When writing or modifying UI components, invoke the `frontend-design` skill.

### `superpowers:writing-plans` — planning

Use this skill when you have a spec or requirements for a multi-step task,
before touching code. It produces a bite-sized-task implementation plan that
the agentic-implementation skill below can execute.

**Project-specific overrides** (these supersede the skill's defaults):

- **File location.** Save plans to `plans/active/<topic>/<gate>/plan.md`
  (project workspace convention), NOT to the skill's default
  `docs/superpowers/plans/`. Example from this Pass 2: Phase B.3
  implementation plan lives at `plans/active/pass-2/g-b-3-2/plan.md`.
- **Gate overlay.** Layer this project's named gates on top of the skill's
  task list. A gate (G B.3.2.a, G B.3.2.b, G B.3.3, G B.3.4) is a
  controller-managed checkpoint; the tasks within a gate map to one
  commit. Use the gate boundaries to pause for Lars to validate before
  the next set of tasks runs.
- **Test discipline.** This is a static-content site with no unit-test
  framework. Apply TDD where it fits (build scripts, helpers); for Astro
  pages use `astro check` + `astro build` + curl/grep on built HTML +
  visual walk on staging as the test substitute. Don't add Vitest just
  for one helper.
- **Skip planning for trivial single-file changes.** Typo fix, one-line
  CSS adjust, a single docstring correction — controller edits inline,
  brief mention in the commit message, no plan needed.

### `superpowers:subagent-driven-development` — agentic implementation

After writing the plan, use this skill to dispatch a fresh subagent per
task with two-stage review (spec compliance, then code quality).

**Project-specific overrides:**

- **No worktree.** The skill recommends an isolated git worktree. Skip it:
  the `dev` branch IS the integration isolation from `main` (per the
  `protect-main` ruleset and the merge-commit workflow at §8.4 of
  `docs/TECH_STACK.md`). Subagents run sequentially per the skill, so
  worktree isolation buys nothing here. Add to that the friction of
  merging a worktree branch back into `dev`, and the call is to commit
  directly on `dev`.
- **Bundle tasks per commit boundary, not per numbered step.** When the
  plan groups N numbered tasks under one named gate (one commit), dispatch
  one implementer for the whole gate, not N. Splitting fragments context
  across subagents (e.g., subagent for Task 1 writes a JSON file, subagent
  for Task 2 needs to know its shape) and breaks the one-commit-per-gate
  intent.
- **Controller handles operational gates.** `git push`, `gh pr create`,
  `gh run watch`, production smoke greps, `BOOTSTRAP.md` / `INDEX.md`
  housekeeping — all controller-side, NOT subagent-dispatched. Reserve
  subagents for the implementation + review work.
- **Final integration review** runs against the full PR-bound diff
  (`git diff <base>..<head>`) before opening the PR. Per-task reviews
  catch local concerns; the final review catches cross-file integration
  risks (data-shape ↔ type-contract drift, page-pattern divergence
  between DE/EN siblings, CSS duplication thresholds).
- **Implementer commits its own work** per the skill template. If a Bash
  permission boundary blocks the commit (it has happened), the controller
  verifies the staged state via `git status` + `npm run build` + smoke
  greps, then commits on the implementer's behalf with the verbatim plan
  message — same artifact, just a controller-mediated final step. Note
  this as a known pattern, not a workflow break.
- **Reviewer minors: defer or fix-up, depending on cost.** If a review
  flags Minor items below the blocking threshold, surface them to Lars
  with three options: (a) fix-up commit now, (b) defer to a backlog row,
  (c) ignore. The reviewer's own verdict ("approved" / "approved with
  notes" / "needs fixes") is the primary signal. Don't break a gate's
  one-commit-per-gate intent for purely cosmetic fixes; defer to backlog.

### Standing-rule precedence when skills conflict with project rules

1. **User instructions** (CLAUDE.md, direct Lars requests) — highest.
2. **Project rules** (gate-based handoff, no mid-flight retrofit, secrets
   discipline, design bundle as layout source of truth, BASELINE as
   content source of truth).
3. **Skill defaults** — apply where they don't conflict with the above.

## Scope boundaries

- The `design/handoff-bundle/` directory is reference material. Read it;
  do not modify it.
- `docs/*.md` files are the canonical project documentation. Read them; do
  not modify them without explicit instruction.