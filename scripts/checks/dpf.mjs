#!/usr/bin/env node
/**
 * DPF active-list check. Verifies Cloudflare, Inc. is in the active
 * EU-U.S. Data Privacy Framework participant list at
 * https://www.dataprivacyframework.gov/list.
 *
 * Source-of-truth: plans/active/pass-2/g-d-2/spec.md §6.3 (worked example)
 * and §3.2/§3.4 (mode #2 / mode #4 detection). Runs as a registered check
 * inside scripts/run-verifier.mjs.
 *
 * Failure-mode coverage:
 *   - Mode #2 (parser-broken):    source HTML lacks expected structural
 *                                 markers ("Active Participant" section).
 *   - Mode #3 (unreachable):      fetch failed/timed out after 3 retries
 *                                 (1/5/15 min backoff per spec §7.3).
 *   - Mode #4 (absent):           source parsed cleanly but Cloudflare
 *                                 not present in the active list.
 *   - Otherwise:                  status 'ok', value = canonical org name.
 *
 * Error-handling style: status-return (per spec §9.3). Throws are caught
 * inside the module and converted to CheckResult with the appropriate
 * non-ok status. The orchestrator never sees a thrown exception.
 */

import { readFile } from 'node:fs/promises';

export const factName = 'dpf';
export const sourceUrl = 'https://www.dataprivacyframework.gov/list';
export const expectedValue = 'Cloudflare, Inc.';

// Retry backoff per spec §7.3: 1 / 5 / 15 minutes. Total retry budget
// is 21 minutes, fitting comfortably inside the 30-minute workflow
// timeout (§7.5). All three retries always fire on a real outage.
const RETRY_DELAYS_MS = [1 * 60_000, 5 * 60_000, 15 * 60_000];
const FETCH_TIMEOUT_MS = 30_000;

async function fetchWithRetry(url) {
  for (let attempt = 0; attempt <= RETRY_DELAYS_MS.length; attempt++) {
    try {
      console.log(
        `[verifier:${factName}] attempt ${attempt + 1}/${RETRY_DELAYS_MS.length + 1}: GET ${url}`,
      );
      const res = await fetch(url, {
        signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
        headers: {
          accept: 'text/html',
          'user-agent': 'blackbrowedlabs-verifier/1.0',
        },
      });
      if (res.ok) return await res.text();
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
 * Heuristic structural-marker check. The DPF list page must contain at
 * least one of the expected anchor strings. If neither is present, the
 * page has been restructured (mode #2) and the parser is broken.
 */
function hasStructuralMarkers(html) {
  return html.includes('Active Participant') || html.includes('Participant Name');
}

/**
 * Parse organisation names from the active participants section. Regex-
 * based per spec §9.1: zero new dependencies, fails loudly on structure
 * change. Returns string[] of names (lowercased for matching).
 */
function parseActiveOrgs(html) {
  const names = [];

  // Strategy 1: rows with "active" in their class attribute (per the
  // worked example in §6.3). Matches the synthetic fixtures.
  const activeRowMatches = html.matchAll(
    /<tr[^>]*class="[^"]*active[^"]*"[^>]*>[\s\S]*?<\/tr>/gi,
  );
  for (const row of activeRowMatches) {
    const tdMatch = row[0].match(/<td[^>]*>\s*([^<]+?)\s*<\/td>/);
    if (tdMatch) names.push(tdMatch[1].trim().toLowerCase());
  }

  // Strategy 2 fallback: if strategy 1 found nothing but the page DOES
  // contain structural markers (so it's not parser-broken), try a
  // looser scan for org names adjacent to "Active" status text. This
  // makes the parser slightly more tolerant of upstream HTML drift.
  if (names.length === 0 && html.includes('Active Participant')) {
    const looseRowMatches = html.matchAll(
      /<tr[^>]*>\s*<td[^>]*>\s*([^<]+?)\s*<\/td>[\s\S]*?Active[\s\S]*?<\/tr>/gi,
    );
    for (const row of looseRowMatches) {
      names.push(row[1].trim().toLowerCase());
    }
  }

  return names;
}

/**
 * @param {{ fixture?: string }} opts
 * @returns {Promise<import('./types.mjs').CheckResult>}
 */
export async function check({ fixture } = {}) {
  const checked_at = new Date().toISOString();

  let html;
  try {
    html = fixture
      ? await readFile(fixture, 'utf8')
      : await fetchWithRetry(sourceUrl);
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

  if (!hasStructuralMarkers(html)) {
    return {
      status: 'parser-broken',
      value: null,
      expected: expectedValue,
      source_url: sourceUrl,
      checked_at,
      error:
        'Expected structural markers ("Active Participant" / "Participant Name") absent from DPF list page; upstream may have been restructured.',
    };
  }

  let orgs;
  try {
    orgs = parseActiveOrgs(html);
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
      error: `parser found 0 active rows in ${html.length}-byte response`,
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
