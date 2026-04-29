/**
 * JSDoc type definitions for the CheckResult shape used by every
 * verifier check (scripts/checks/<fact>.mjs). The orchestrator
 * (scripts/run-verifier.mjs) consumes these results and aggregates them
 * into src/data/cloudflare-facts.json.
 *
 * Status enum semantics (per g-d-2/spec.md §6.2):
 *
 *   'ok'             — fact verified successfully; the parsed value
 *                      matches expectation. Orchestrator renames to
 *                      'active' when persisting to JSON.
 *   'changed'        — fact reachable + parseable, but the parsed value
 *                      differs from expectation. Triggers an Issue +
 *                      auto-PR with the diff.
 *   'unreachable'    — source URL did not respond after retries (1/5/15
 *                      min backoff). Triggers an Issue.
 *   'parser-broken'  — source returned content but the parser couldn't
 *                      extract the expected structure (failure mode #2
 *                      or #5). Triggers an Issue.
 *   'absent'         — source returned content, parser worked, but the
 *                      expected entity wasn't found (failure mode #4 —
 *                      Cloudflare drops off the DPF list). HIGH-PRIORITY.
 *
 * @typedef {'ok' | 'changed' | 'unreachable' | 'parser-broken' | 'absent'} CheckStatus
 */

/**
 * @typedef {Object} CheckResult
 * @property {CheckStatus} status
 * @property {string|number|null|object} value     — current parsed value
 *           (string for dpf, object for cwa-retention, null on failure).
 * @property {string|number|null|object} expected  — previous-known value,
 *           shaped per fact.
 * @property {string} source_url                   — copy of the module's
 *           sourceUrl, for log clarity.
 * @property {string} checked_at                   — ISO 8601 UTC.
 * @property {string|null} error                   — diagnostic string when
 *           status !== 'ok'; null on success.
 */

export {};
