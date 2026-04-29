#!/usr/bin/env node
/**
 * Verifier orchestrator. Runs every registered check, aggregates the
 * results, persists them into src/data/cloudflare-facts.json, and
 * decides whether the workflow should open an auto-PR (all-ok) or an
 * Issue (any non-ok status).
 *
 * Source-of-truth: plans/active/pass-2/g-d-2/spec.md (full design) +
 * plans/active/pass-2/g-d/plan.md Task 7 step 8.
 *
 * Usage:
 *   node scripts/run-verifier.mjs                 # production: writes JSON
 *   node scripts/run-verifier.mjs --dry-run       # no writes, no exit-1 on non-ok
 *   MOCK_SCENARIO=dpf-absent node scripts/run-verifier.mjs --dry-run
 *
 * Exit codes:
 *   0 — all checks 'ok' (or any outcome in --dry-run mode).
 *   1 — at least one check returned non-ok status (workflow opens Issue).
 *   2 — orchestrator threw (config error / unhandled exception).
 *
 * ⚠ Status-enum rename (per spec §6.2): CheckResult `'ok'` → JSON
 * `'active'` when persisted. The privacy-page banner logic depends on
 * the JSON enum being `'active'` for the green-path state.
 */

import { readFile, writeFile } from 'node:fs/promises';
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

function fixturePathFor(scenario) {
  return resolve(FIXTURES_DIR, `${scenario}.html`);
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
      opts = { fixture: fixturePathFor(fixtureName) };
      console.log(
        `[verifier:orchestrator] ${mod.factName}: routing to fixture ${fixtureName}.html`,
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

  // Per-fact updates. Status enum rename: 'ok' (CheckResult) → 'active'
  // (JSON). On 'ok', also bump verified_at + last_known_good_at and
  // refresh value fields. On non-ok, status is persisted as-is and the
  // verified_at / last_known_good_at fields are LEFT UNTOUCHED — so
  // consumers (privacy pages) keep showing the last successful date
  // until a fresh run lands.
  for (const { factKey } of CHECKS) {
    const r = results[factKey];
    data[factKey].status = r.status === 'ok' ? 'active' : r.status;

    if (r.status === 'ok') {
      data[factKey].verified_at = r.checked_at;
      data[factKey].last_known_good_at = r.checked_at;

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

  const allOk = Object.values(results).every((r) => r.status === 'ok');

  if (DRY_RUN) {
    console.log('\n[verifier:orchestrator] [DRY-RUN] would write src/data/cloudflare-facts.json:');
    console.log(JSON.stringify(data, null, 2));
    console.log(
      `\n[verifier:orchestrator] [DRY-RUN] would ${allOk ? 'open auto-PR (or no-op if no diff)' : 'open verifier-alert Issue'}`,
    );
    return; // exit 0
  }

  await writeFile(DATA_PATH, JSON.stringify(data, null, 2) + '\n');
  console.log(
    `[verifier:orchestrator] wrote ${DATA_PATH} (${Object.keys(results).length} fact(s) updated)`,
  );

  if (!allOk) {
    console.error(
      '[verifier:orchestrator] at least one check returned non-ok status; workflow will open an Issue',
    );
    process.exit(1);
  }
  console.log('[verifier:orchestrator] all checks ok');
}

main().catch((err) => {
  console.error(`[verifier:orchestrator] fatal: ${err.stack ?? err}`);
  process.exit(2);
});
