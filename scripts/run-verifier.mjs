#!/usr/bin/env node
/**
 * Verifier orchestrator. Runs every registered check, aggregates the
 * results, and surfaces three independent flags (`all_ok`,
 * `has_value_diff`, `has_failure`) so the workflow can route to the
 * matching notification channel (silent variable refresh, PR, or Issue).
 *
 * Run from the project root (as the verify-cloudflare-facts.yml
 * workflow does); paths resolve against `process.cwd()`.
 *
 * Source-of-truth: plans/active/pass-2/g-d-2/spec.md (original design) +
 * plans/active/pass-2/g-d-10/plan.md G D.11.1 (alert-model rewrite).
 *
 * Usage:
 *   node scripts/run-verifier.mjs                 # production: maybe writes JSON
 *   node scripts/run-verifier.mjs --dry-run       # no writes; logs would-be flags
 *   MOCK_SCENARIO=dpf-absent node scripts/run-verifier.mjs --dry-run
 *
 * Exit codes:
 *   0 — orchestrator completed; per-fact outcomes are surfaced via the
 *       three flags below rather than via exit code, so a single run can
 *       drive >1 channel (e.g. CWA changed AND DPF unreachable → both PR
 *       and Issue fire independently).
 *   2 — orchestrator threw (config error / validation failure / I/O error).
 *
 * GITHUB_OUTPUT flags (only when GITHUB_OUTPUT is set):
 *   all_ok          — true if every check returned 'ok'. Drives the
 *                     workflow's variable-refresh step (silent channel).
 *   has_value_diff  — true if any check returned 'changed' or 'absent'.
 *                     Drives the workflow's auto-PR step.
 *   has_failure     — true if any check returned 'parser-broken' or
 *                     'unreachable'. Drives the workflow's Issue step.
 *
 * JSON disk write is gated on `has_value_diff`. Clean runs leave the
 * JSON untouched in the runner workspace; the displayed `verified_at`
 * is refreshed via the VERIFIER_LAST_OK_AT repo variable instead.
 *
 * ⚠ Status-enum rename (per spec §6.2): CheckResult `'ok'` → JSON
 * `'active'` when persisted. The privacy-page banner logic depends on
 * the JSON enum being `'active'` for the green-path state.
 *
 * ⚠ Per-fact field-update semantics (per spec §1.3 + §2.6 / §3.6 / §4.6):
 *   - status === 'ok'      : advance verified_at AND last_known_good_at;
 *                            update value fields to current observed.
 *   - status === 'changed' : advance verified_at + value fields (so the
 *                            companion auto-PR ships the new value);
 *                            leave last_known_good_at pinned (the "good"
 *                            value is still the previous one until Lars
 *                            approves the change in BASELINE_COPY).
 *   - other failures       : leave verified_at, last_known_good_at, and
 *                            value fields all pinned (we did not
 *                            successfully verify anything new).
 */

import { appendFile, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

import * as dpf from './checks/dpf.mjs';
import * as cwaRetention from './checks/cwa-retention.mjs';

const DRY_RUN = process.argv.includes('--dry-run');
const MOCK_SCENARIO = process.env.MOCK_SCENARIO ?? '';

const DATA_PATH = resolve(process.cwd(), 'src/data/cloudflare-facts.json');
const FIXTURES_DIR = resolve(process.cwd(), 'scripts/checks/__fixtures__');

/**
 * Single explicit registry per spec §9.6. Each entry maps a JSON-side
 * fact key to its check module + the fixture-prefix used to route
 * MOCK_SCENARIO values to the right module + the default "active"
 * fixture used for sibling facts when ONE fact is being scenario-tested.
 */
const CHECKS = [
  { factKey: 'dpf', mod: dpf, scenarioPrefix: 'dpf-', defaultFixture: 'dpf-active' },
  { factKey: 'cwa_retention', mod: cwaRetention, scenarioPrefix: 'cwa-', defaultFixture: 'cwa-active' },
];

function fixturePathFor(scenario, ext = 'html') {
  return resolve(FIXTURES_DIR, `${scenario}.${ext}`);
}

/**
 * Hand-written shape validator per spec §9.7. Runs at write time on the
 * outgoing JSON to catch any field-shape regression before the file
 * lands. Throws on missing/malformed fields — the orchestrator surfaces
 * this as exit code 2.
 */
function validateCloudflareFacts(data) {
  if (!data || typeof data !== 'object') throw new Error('not an object');
  if (!data._meta || typeof data._meta !== 'object') throw new Error('missing _meta');
  if (data._meta.schema_version !== 1) {
    throw new Error(`unknown schema_version: ${data._meta.schema_version}`);
  }
  if (typeof data._meta.last_check_attempt !== 'string') {
    throw new Error('missing _meta.last_check_attempt');
  }
  if (typeof data._meta.freshness_threshold_days !== 'number') {
    throw new Error('missing _meta.freshness_threshold_days');
  }
  for (const factKey of ['dpf', 'cwa_retention']) {
    const f = data[factKey];
    if (!f || typeof f !== 'object') throw new Error(`missing ${factKey}`);
    if (typeof f.status !== 'string') throw new Error(`${factKey}.status not a string`);
    if (typeof f.source_url !== 'string') throw new Error(`${factKey}.source_url not a string`);
    if (typeof f.verified_at !== 'string') throw new Error(`${factKey}.verified_at not a string`);
    if (typeof f.last_known_good_at !== 'string') {
      throw new Error(`${factKey}.last_known_good_at not a string`);
    }
  }
  if (typeof data.dpf.organization_name !== 'string') {
    throw new Error('dpf.organization_name not a string');
  }
  if (
    data.cwa_retention.raw_events_retention_months !== null &&
    typeof data.cwa_retention.raw_events_retention_months !== 'number'
  ) {
    throw new Error('cwa_retention.raw_events_retention_months neither null nor number');
  }
  if (typeof data.cwa_retention.aggregated_retention_months !== 'number') {
    throw new Error('cwa_retention.aggregated_retention_months not a number');
  }
}

async function main() {
  console.log(
    `[verifier:orchestrator] starting (dry_run=${DRY_RUN}, mock_scenario=${MOCK_SCENARIO || '<none>'})`,
  );

  const data = JSON.parse(await readFile(DATA_PATH, 'utf8'));
  /** @type {Record<string, import('./checks/types.mjs').CheckResult>} */
  const results = {};

  // Mock-scenario routing semantics (per spec §6.5): when MOCK_SCENARIO
  // is set, EVERY check runs in fixture mode — the matching fact uses
  // the named scenario; sibling facts use their default "active"
  // fixture. This keeps synthetic runs hermetic (no live network) so
  // the test matrix can be exercised offline.
  const mockActive = Boolean(MOCK_SCENARIO);

  for (const { factKey, mod, scenarioPrefix, defaultFixture } of CHECKS) {
    let opts = {};
    if (mockActive) {
      const fixtureName = MOCK_SCENARIO.startsWith(scenarioPrefix)
        ? MOCK_SCENARIO
        : defaultFixture;
      const ext = mod.fixtureExtension ?? 'html';
      opts = { fixture: fixturePathFor(fixtureName, ext) };
      console.log(
        `[verifier:orchestrator] ${mod.factName}: routing to fixture ${fixtureName}.${ext}`,
      );
    }

    const result = await mod.check(opts);
    results[factKey] = result;
    console.log(
      `[verifier:orchestrator] ${mod.factName}: status=${result.status}` +
        (result.error ? ` error="${result.error}"` : ''),
    );
  }

  // _meta.last_check_attempt is updated regardless of outcome. This is
  // the field the build-time freshness gate watches; updating it on
  // non-ok outcomes is what allows the verifier to keep alerting via
  // Issue rather than via build-fail.
  const nowIso = new Date().toISOString();
  data._meta.last_check_attempt = nowIso;

  // Per-fact updates per spec §1.3 + §2.6 / §3.6 / §4.6. Status enum
  // rename: 'ok' (CheckResult) → 'active' (JSON).
  //
  // - 'ok':      advance verified_at + last_known_good_at; refresh value fields.
  // - 'changed': advance verified_at + value fields (so the auto-PR ships
  //              the new value to Lars); leave last_known_good_at pinned.
  // - other:     leave verified_at, last_known_good_at, and value fields
  //              alone — we did not successfully verify anything new.
  //              Only `status` is persisted, so consumers (privacy pages)
  //              keep showing the last successful date alongside the new
  //              status enum and can render their warning banner.
  for (const { factKey } of CHECKS) {
    const r = results[factKey];
    data[factKey].status = r.status === 'ok' ? 'active' : r.status;

    if (r.status === 'ok' || r.status === 'changed') {
      data[factKey].verified_at = r.checked_at;
      if (r.status === 'ok') {
        data[factKey].last_known_good_at = r.checked_at;
      }

      if (factKey === 'dpf' && typeof r.value === 'string') {
        data[factKey].organization_name = r.value;
      }
      if (factKey === 'cwa_retention' && r.value && typeof r.value === 'object') {
        data[factKey].raw_events_retention_months = r.value.raw_events_retention_months;
        data[factKey].aggregated_retention_months = r.value.aggregated_retention_months;
      }
    }
  }

  validateCloudflareFacts(data);

  // G D.11 three-channel model:
  //   all_ok          — every check returned 'ok'; updates the
  //                     VERIFIER_LAST_OK_AT repo variable. No PR, no Issue.
  //   has_value_diff  — at least one check returned 'changed' or 'absent';
  //                     drives the PR step.
  //   has_failure     — at least one check returned 'parser-broken' or
  //                     'unreachable'; drives the Issue step.
  // has_value_diff and has_failure can both be true on the same run
  // (e.g. CWA changed AND DPF unreachable). The two channels fire
  // independently.
  const statuses = Object.values(results).map((r) => r.status);
  const allOk = statuses.every((s) => s === 'ok');
  const hasValueDiff = statuses.some((s) => s === 'changed' || s === 'absent');
  const hasFailure = statuses.some((s) => s === 'parser-broken' || s === 'unreachable');
  const previousJson = await readFile(DATA_PATH, 'utf8');
  const nextJson = JSON.stringify(data, null, 2) + '\n';

  // Per-fact ok flags for independent per-fact variable updates
  // (G D.12). Allows VERIFIER_DPF_VERIFIED_AT / VERIFIER_CWA_VERIFIED_AT
  // to advance whenever the corresponding fact returned 'ok', even on
  // mixed-status runs where one fact is changed/failing and the other
  // is fine. Independent of the top-level `all_ok` gate.
  const dpfOk = results.dpf.status === 'ok';
  const cwaRetentionOk = results.cwa_retention.status === 'ok';

  // Emit GH outputs only on real (non-dry-run) execution. Dry-run is the
  // synthetic / dispatch path; the workflow explicitly pins flags to
  // false in that branch so live PR / Issue / variable steps stay quiet.
  if (!DRY_RUN) {
    await emitGithubOutput('all_ok', allOk);
    await emitGithubOutput('has_value_diff', hasValueDiff);
    await emitGithubOutput('has_failure', hasFailure);
    await emitGithubOutput('dpf_ok', dpfOk);
    await emitGithubOutput('cwa_retention_ok', cwaRetentionOk);
  }

  console.log(
    `[verifier:orchestrator] summary: all_ok=${allOk} has_value_diff=${hasValueDiff} has_failure=${hasFailure} dpf_ok=${dpfOk} cwa_retention_ok=${cwaRetentionOk}`,
  );

  if (DRY_RUN) {
    console.log('\n[verifier:orchestrator] [DRY-RUN] would write src/data/cloudflare-facts.json:');
    console.log(nextJson);
    const wouldDo = [];
    if (allOk) wouldDo.push('update VERIFIER_LAST_OK_AT variable');
    if (dpfOk) wouldDo.push('update VERIFIER_DPF_VERIFIED_AT variable');
    if (cwaRetentionOk) wouldDo.push('update VERIFIER_CWA_VERIFIED_AT variable');
    if (hasValueDiff) wouldDo.push('open auto-PR');
    if (hasFailure) wouldDo.push('open verifier-alert Issue');
    console.log(
      `\n[verifier:orchestrator] [DRY-RUN] would ${wouldDo.length ? wouldDo.join(' AND ') : 'do nothing'}`,
    );
    return; // exit 0
  }

  // JSON disk write is gated on has_value_diff. On clean runs (all_ok)
  // there's nothing to persist beyond _meta.last_check_attempt, and the
  // variable channel carries the freshness signal — leaving a mutated
  // JSON file in the runner workspace would be noise. On failure-only
  // runs there's nothing meaningful to write either (value fields stay
  // pinned per the per-fact update rules above).
  if (hasValueDiff) {
    await writeFile(DATA_PATH, nextJson);
    console.log(
      `[verifier:orchestrator] wrote ${DATA_PATH} (${Object.keys(results).length} fact(s) updated)`,
    );
  } else {
    console.log(
      `[verifier:orchestrator] no value diff; skipping JSON write (variable refresh handled by workflow)`,
    );
  }

  if (hasFailure) {
    console.error(
      '[verifier:orchestrator] at least one check returned parser-broken/unreachable; workflow will open an Issue',
    );
  }
  if (hasValueDiff) {
    console.log(
      '[verifier:orchestrator] at least one value changed/absent; workflow will open an auto-PR',
    );
  }
  if (allOk) {
    console.log('[verifier:orchestrator] all checks ok — workflow will refresh VERIFIER_LAST_OK_AT variable');
  }
}

/**
 * Append a single key=value line to $GITHUB_OUTPUT so the workflow can
 * gate steps off it. No-op when GITHUB_OUTPUT is not set (local runs).
 */
async function emitGithubOutput(key, value) {
  const outPath = process.env.GITHUB_OUTPUT;
  if (!outPath) return;
  await appendFile(outPath, `${key}=${value ? 'true' : 'false'}\n`);
}

main().catch((err) => {
  console.error(`[verifier:orchestrator] fatal: ${err.stack ?? err}`);
  process.exit(2);
});
