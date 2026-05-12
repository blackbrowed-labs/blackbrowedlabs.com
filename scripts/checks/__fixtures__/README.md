# Verifier fixture test matrix

Each fixture under this directory exercises a specific branch in a
check module. Run any single scenario via:

```bash
MOCK_SCENARIO=<fixture-stem> node scripts/run-verifier.mjs --dry-run
```

The orchestrator routes the named fact to its matching fixture and
uses the default `*-active` fixture for the sibling fact (so every run
exercises both checks, but only one is the scenario under test).

## DPF (`scripts/checks/dpf.mjs`)

| Fixture | Branch triggered | Expected `dpf.status` | Notes |
|---|---|---|---|
| `dpf-active.json` | Happy path | `ok` | Cloudflare present in active EU-cert rows |
| `dpf-absent.json` | Mode #4 (org missing) | `absent` | Structural markers OK; Cloudflare not in active rows |
| `dpf-parser-broken.json` | Branch A — missing structural markers | `parser-broken` | Tiny `{"error": "deprecated"}` shape |
| `dpf-parser-broken-empty.json` | Branch C — `orgs.length === 0` | `parser-broken` | Structural markers OK; zero rows pass the EU-cert filter |
| (no fixture) | Branch B — `parseActiveOrgs` throws | `parser-broken` | **JSON-fixture-unreachable by construction.** The throw branch is only reachable via a JS-runtime mutation that JSON cannot encode. If a future refactor adds an explicit throw inside `parseActiveOrgs` on a malformed-but-encodable input, add a `dpf-parser-broken-malformed.json` fixture then. |

> **Load-bearing coercion (do not silently remove).** The
> `String(p.OrganizationPublicDisplayName ?? '')` coercion at
> `scripts/checks/dpf.mjs:170` is what makes Branch B unreachable from
> any JSON-encodable input — every JSON shape (string, number, boolean,
> null, undefined, missing key) is coerced to a string before
> `.trim().toLowerCase()` runs, so the `.map` step cannot throw on
> JSON data. Any future implementer who edits that line MUST update
> this matrix: the Branch B "JSON-fixture-unreachable" classification
> depends on the coercion staying in place.

## CWA retention (`scripts/checks/cwa-retention.mjs`)

| Fixture | Branch triggered | Expected `cwa_retention.status` | Notes |
|---|---|---|---|
| `cwa-active.html` | Happy path | `ok` | Aggregated retention parses to the cached value |
| `cwa-changed-figure.html` | Mode #6 — figure shift | `changed` | Aggregated retention parses to a different number |
| `cwa-parser-broken.html` | Mode #5 — pattern miss | `parser-broken` | Page content present but no retention figure findable |

## Live-network mode

Run without `MOCK_SCENARIO` to fetch the live DPF API and the live CWA
docs page. Done in CI only (the weekly cron). Not generally exercised
in local development.

## Notes on adding new fixtures

- DPF fixture extension: `.json`. CWA fixture extension: `.html`. The
  check module declares its `fixtureExtension` export; the orchestrator
  reads it.
- Fixture stem must start with the check module's `scenarioPrefix`
  (`dpf-` or `cwa-`) for the orchestrator to route correctly.
- Sibling fact uses the check module's `defaultFixture` (`dpf-active`
  or `cwa-active`) when the scenario-under-test names the other fact.
