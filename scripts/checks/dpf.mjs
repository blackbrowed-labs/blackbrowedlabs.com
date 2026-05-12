#!/usr/bin/env node
/**
 * DPF active-list check. Verifies Cloudflare, Inc. is in the active
 * EU-U.S. Data Privacy Framework participant list. The user-facing
 * citation remains https://www.dataprivacyframework.gov/list (a React
 * SPA that the verifier cannot statically parse); the verifier itself
 * queries the SPA's backing JSON API at dpfapi.azurewebsites.net.
 *
 * Source-of-truth: plans/active/pass-2/g-d-10/g-d-10-2/dpf-investigation.md
 * (endpoint, method, body, JSON field paths) and plans/active/pass-2/g-d-2/
 * spec.md §3.2 / §3.4 / §9.1 / §9.3 (mode #2 / mode #4 detection contract,
 * error-handling style, parser-shape constraints).
 * Runs as a registered check inside scripts/run-verifier.mjs.
 *
 * Failure-mode coverage:
 *   - Mode #2 (parser-broken):    API response lacks expected structural
 *                                 markers (SumCount/Items shape).
 *   - Mode #3 (unreachable):      fetch failed/timed out after 3 retries
 *                                 (1/5/15 min backoff per spec §7.3).
 *   - Mode #4 (absent):           response parsed cleanly but Cloudflare
 *                                 not present in the active list.
 *   - Otherwise:                  status 'ok', value = canonical org name.
 *
 * Error-handling style: status-return (per spec §9.3). Throws are caught
 * inside the module and converted to CheckResult with the appropriate
 * non-ok status. The orchestrator never sees a thrown exception.
 *
 * Fixture format: JSON (fixtureExtension = 'json'). Per-check extension
 * support landed in G D.10.0; this module opts into it because the
 * upstream now serves JSON, not HTML.
 */

import { readFile } from 'node:fs/promises';

export const factName = 'dpf';
// User-facing citation surfaced via cloudflare-facts.json. The privacy
// pages link readers here; it remains the SPA URL even though the
// verifier itself talks to the JSON API below.
export const sourceUrl = 'https://www.dataprivacyframework.gov/list';
export const expectedValue = 'Cloudflare, Inc.';
export const fixtureExtension = 'json';

// Verifier-only endpoint. Anonymous, no cookies, no Origin/Referer
// gating today (verified in g-d-10-2/dpf-investigation.md). Phase G.3
// widened the filter from `Search: "Cloudflare"` + `RowsPerPage: 10`
// to `Search: ""` + `RowsPerPage: 5000` (one request that returns the
// full active list, currently ~3,600 rows / ~1.8 MB / ~2.7 s) plus an
// in-process substring filter on 'cloudflare' inside parseActiveOrgs.
// This survives a Cloudflare rebrand or any upstream change in
// `Search` semantics — provided the new name still contains the
// substring 'cloudflare'. Trade: ~5 KB payload + ~0.8 s becomes
// ~1.8 MB + ~2.7 s per weekly cron run, in exchange for rebrand
// robustness. Pagination is supported but not used — the API returns
// the whole active list in one response. See
// plans/active/pass-3/g/dpf-pagination-investigation.md for the
// probe-by-probe evidence and the EUCert.PublicStatus distribution
// (Active=2,960; Active-Re-cert=638 — the verifier still treats only
// strict "Active" as live).
const API_ENDPOINT = 'https://dpfapi.azurewebsites.net/api/participants';
// Investigation: plans/active/pass-3/g/dpf-pagination-investigation.md
// confirms RowsPerPage values >= SumCount return the complete active
// list in a single ~2.7 s request (SumCount ~3,600 at probe time).
// 5000 gives ~40% headroom for active-list growth before the verifier
// would need to revisit. Search:'' returns the unfiltered list; the
// substring match for 'cloudflare' happens in parseActiveOrgs()
// below — rebrand-robust within the constraint that the new name
// still contains the substring 'cloudflare'.
const REQUEST_BODY = {
  DataCovered: [],
  Frameworks: [],
  Industries: [],
  PageNumber: 0,
  RecourseMechanisms: [],
  StatutoryBody: [],
  RowsPerPage: 5000,
  Search: '',
  StartLetter: '',
  Status: 'Active',
  States: [],
  VerificationMethod: '',
};

// Retry backoff per spec §7.3: 1 / 5 / 15 minutes. Total retry budget
// is 21 minutes, fitting comfortably inside the 30-minute workflow
// timeout (§7.5). All three retries always fire on a real outage.
const RETRY_DELAYS_MS = [1 * 60_000, 5 * 60_000, 15 * 60_000];
const FETCH_TIMEOUT_MS = 30_000;

async function fetchWithRetry(url) {
  for (let attempt = 0; attempt <= RETRY_DELAYS_MS.length; attempt++) {
    try {
      console.log(
        `[verifier:${factName}] attempt ${attempt + 1}/${RETRY_DELAYS_MS.length + 1}: POST ${url}`,
      );
      const res = await fetch(url, {
        method: 'POST',
        signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
        headers: {
          accept: 'application/json',
          'content-type': 'application/json',
          'user-agent': 'blackbrowedlabs-verifier/1.0',
        },
        body: JSON.stringify(REQUEST_BODY),
      });
      if (res.ok) return await res.json();
      if (attempt === RETRY_DELAYS_MS.length) {
        throw new Error(`HTTP ${res.status} after ${attempt} retries`);
      }
      console.error(
        `[verifier:${factName}] HTTP ${res.status}; retrying in ${RETRY_DELAYS_MS[attempt] / 60_000}m`,
      );
    } catch (err) {
      if (attempt === RETRY_DELAYS_MS.length) throw err;
      console.error(
        `[verifier:${factName}] fetch error: ${err.message}; retrying in ${RETRY_DELAYS_MS[attempt] / 60_000}m`,
      );
    }
    await new Promise((r) => setTimeout(r, RETRY_DELAYS_MS[attempt]));
  }
  // Unreachable in practice; loop either returns or throws.
  throw new Error('retry loop exited unexpectedly');
}

/**
 * Heuristic structural-marker check. The API response must be the
 * expected `{ RecordCount, Items, SumCount }` envelope. If the shape
 * changes — empty payload, error wrapper, an Items array missing — the
 * upstream has been restructured (mode #2) and the parser is broken.
 *
 * `SumCount > 0` catches the upstream-data-wipe regression separately
 * from a Cloudflare-specific withdrawal: a payload with SumCount===0 is
 * suspect (parser-broken), whereas a non-zero SumCount with Cloudflare
 * absent from Items is the real "Cloudflare withdrew" signal (absent).
 */
function hasStructuralMarkers(payload) {
  return (
    payload &&
    typeof payload === 'object' &&
    typeof payload.SumCount === 'number' &&
    payload.SumCount > 0 &&
    Array.isArray(payload.Items)
  );
}

/**
 * Parse active EU-US-framework organisation names from the API
 * response. Per the investigation doc, the EU-US framework lives in
 * `EUCert` (FrameworkId 1) — SwissCert / UKCert are separate
 * frameworks and shouldn't be conflated for the "is Cloudflare on the
 * EU-US DPF" question this verifier answers. Returns string[] of
 * names (lowercased for matching).
 */
function parseActiveOrgs(payload) {
  return payload.Items.filter(
    (p) => p && p.EUCert && p.EUCert.PublicStatus === 'Active',
  )
    .map((p) => String(p.OrganizationPublicDisplayName ?? '').trim().toLowerCase())
    .filter(Boolean);
}

/**
 * @param {{ fixture?: string }} opts
 * @returns {Promise<import('./types.mjs').CheckResult>}
 */
export async function check({ fixture } = {}) {
  const checked_at = new Date().toISOString();

  let payload;
  try {
    payload = fixture
      ? JSON.parse(await readFile(fixture, 'utf8'))
      : await fetchWithRetry(API_ENDPOINT);
  } catch (err) {
    return {
      status: 'unreachable',
      value: null,
      expected: expectedValue,
      source_url: sourceUrl,
      checked_at,
      error: err.message ?? String(err),
    };
  }

  if (!hasStructuralMarkers(payload)) {
    return {
      status: 'parser-broken',
      value: null,
      expected: expectedValue,
      source_url: sourceUrl,
      checked_at,
      error:
        'Expected structural markers ({RecordCount, Items, SumCount}) absent from DPF API payload; upstream may have been restructured.',
    };
  }

  let orgs;
  try {
    orgs = parseActiveOrgs(payload);
  } catch (err) {
    return {
      status: 'parser-broken',
      value: null,
      expected: expectedValue,
      source_url: sourceUrl,
      checked_at,
      error: `parser threw: ${err.message ?? String(err)}`,
    };
  }

  if (orgs.length === 0) {
    return {
      status: 'parser-broken',
      value: null,
      expected: expectedValue,
      source_url: sourceUrl,
      checked_at,
      error: `parser found 0 active rows in ${payload.Items.length}-record response`,
    };
  }

  const found = orgs.some((name) => name.includes('cloudflare'));
  if (!found) {
    return {
      status: 'absent',
      value: null,
      expected: expectedValue,
      source_url: sourceUrl,
      checked_at,
      error: `Cloudflare not found in ${orgs.length} active participant(s)`,
    };
  }

  console.log(
    `[verifier:${factName}] status=ok found "${expectedValue}" in ${orgs.length} active orgs`,
  );
  return {
    status: 'ok',
    value: expectedValue,
    expected: expectedValue,
    source_url: sourceUrl,
    checked_at,
    error: null,
  };
}
