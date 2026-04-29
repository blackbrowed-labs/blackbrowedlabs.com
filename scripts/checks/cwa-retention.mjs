#!/usr/bin/env node
/**
 * CWA retention check. Verifies that Cloudflare Web Analytics' published
 * data-retention figures still match the cached values in
 * src/data/cloudflare-facts.json (specifically: aggregated retention
 * months, and the absence of a published raw-events retention period).
 *
 * Source: https://developers.cloudflare.com/web-analytics/data-retention/
 *
 * Source-of-truth: plans/active/pass-2/g-d-2/spec.md §6 (interface) and
 * §3.5/§3.6 (mode #5 / mode #6 detection).
 *
 * Failure-mode coverage:
 *   - Mode #3 (unreachable):     fetch failed/timed out after 3 retries.
 *   - Mode #5 (parser-broken):   page returned content but no retention
 *                                figure could be extracted.
 *   - Mode #6 (changed):         retention figure parsed cleanly but
 *                                differs from the cached value.
 *   - Otherwise:                 status 'ok', value = parsed retention
 *                                shape.
 */

import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

export const factName = 'cwa-retention';
export const sourceUrl = 'https://developers.cloudflare.com/web-analytics/data-retention/';

// Same retry budget as DPF (1/5/15 min); see spec §7.3.
const RETRY_DELAYS_MS = [1 * 60_000, 5 * 60_000, 15 * 60_000];
const FETCH_TIMEOUT_MS = 30_000;

const DATA_PATH = resolve(process.cwd(), 'src/data/cloudflare-facts.json');

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
  throw new Error('retry loop exited unexpectedly');
}

/**
 * Strip HTML tags. Regex-based per spec §9.1; the goal is "find the
 * integer adjacent to 'months' or 'aggregated'" and tag-stripping makes
 * the patterns less sensitive to inline markup like
 * `aggregated <strong>6</strong> months`.
 */
function stripTags(html) {
  return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
}

/**
 * Parse retention figures from CWA docs HTML. Returns
 *   { raw_events_retention_months, aggregated_retention_months }
 * or throws if no aggregated figure can be found (parser-broken).
 *
 * Cloudflare deliberately doesn't publish a raw-events retention period
 * (per BASELINE Path-α amendment); we capture `null` in that case. If a
 * number ever appears, that's a mode #6 (changed) signal.
 */
function parseRetention(html) {
  const text = stripTags(html);

  // Aggregated retention. Look near keywords "aggregated" or
  // "page view counts" and pull the adjacent integer + unit.
  const aggregatedPatterns = [
    /aggregat[a-z]*[^.]{0,200}?(\d+)\s*(months?|days?)/i,
    /page\s*view\s*counts?[^.]{0,200}?(\d+)\s*(months?|days?)/i,
    /(\d+)\s*(months?|days?)[^.]{0,80}?aggregat/i,
  ];
  let aggregatedMonths = null;
  for (const re of aggregatedPatterns) {
    const m = text.match(re);
    if (m) {
      const n = Number(m[1]);
      const unit = m[2].toLowerCase();
      aggregatedMonths = unit.startsWith('day') ? Math.round(n / 30) : n;
      break;
    }
  }

  if (aggregatedMonths === null) {
    throw new Error(
      'Could not parse aggregated retention figure; upstream may have been restructured',
    );
  }

  // Raw events retention — explicitly check for absence. If a number
  // adjacent to "raw event" or "event-level" appears, capture it.
  const rawPatterns = [
    /raw\s*event[^.]{0,200}?(\d+)\s*(months?|days?)/i,
    /event[-\s]level[^.]{0,200}?(\d+)\s*(months?|days?)/i,
  ];
  let rawEventsMonths = null;
  for (const re of rawPatterns) {
    const m = text.match(re);
    if (m) {
      const n = Number(m[1]);
      const unit = m[2].toLowerCase();
      rawEventsMonths = unit.startsWith('day') ? Math.round(n / 30) : n;
      break;
    }
  }

  return {
    raw_events_retention_months: rawEventsMonths,
    aggregated_retention_months: aggregatedMonths,
  };
}

/**
 * @param {{ fixture?: string }} opts
 * @returns {Promise<import('./types.mjs').CheckResult>}
 */
export async function check({ fixture } = {}) {
  const checked_at = new Date().toISOString();

  // Read cached/expected values up-front so the orchestrator has them
  // for diff comparison even if fetch fails. Throws here are config
  // errors (missing JSON), not parseable failures — let them propagate.
  const cached = JSON.parse(await readFile(DATA_PATH, 'utf8'));
  const expected = {
    raw_events_retention_months: cached.cwa_retention?.raw_events_retention_months ?? null,
    aggregated_retention_months: cached.cwa_retention?.aggregated_retention_months ?? null,
  };

  let html;
  try {
    html = fixture
      ? await readFile(fixture, 'utf8')
      : await fetchWithRetry(sourceUrl);
  } catch (err) {
    return {
      status: 'unreachable',
      value: null,
      expected,
      source_url: sourceUrl,
      checked_at,
      error: err.message ?? String(err),
    };
  }

  let parsed;
  try {
    parsed = parseRetention(html);
  } catch (err) {
    return {
      status: 'parser-broken',
      value: null,
      expected,
      source_url: sourceUrl,
      checked_at,
      error: err.message ?? String(err),
    };
  }

  const aggregatedMatches =
    parsed.aggregated_retention_months === expected.aggregated_retention_months;
  const rawMatches =
    parsed.raw_events_retention_months === expected.raw_events_retention_months;

  if (!aggregatedMatches || !rawMatches) {
    return {
      status: 'changed',
      value: parsed,
      expected,
      source_url: sourceUrl,
      checked_at,
      error:
        `Retention figure changed (aggregated: ${expected.aggregated_retention_months} → ${parsed.aggregated_retention_months}; ` +
        `raw_events: ${expected.raw_events_retention_months} → ${parsed.raw_events_retention_months})`,
    };
  }

  console.log(
    `[verifier:${factName}] status=ok aggregated=${parsed.aggregated_retention_months}m raw_events=${parsed.raw_events_retention_months}`,
  );
  return {
    status: 'ok',
    value: parsed,
    expected,
    source_url: sourceUrl,
    checked_at,
    error: null,
  };
}
