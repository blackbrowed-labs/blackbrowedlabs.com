/**
 * Read-only access to src/data/cloudflare-facts.json.
 *
 * Astro imports JSON statically at build time. The verifier (Phase D)
 * writes the same shape via `scripts/run-verifier.mjs`, so this typed
 * view stays valid across the manual-data → automated-data transition.
 *
 * Schema (verifier-era, schema_version=1):
 * - `_meta.last_check_attempt` is updated every run (success or failure)
 *   and drives the build-time freshness gate.
 * - Per-fact `verified_at` is updated only on successful checks. This is
 *   the date users see on the privacy pages.
 * - Per-fact `last_known_good_at` mirrors `verified_at` on success and is
 *   left untouched on failure — useful for "stale" detection.
 */

import facts from '../data/cloudflare-facts.json';

export type CloudflareFactStatus =
  | 'active'
  | 'changed'
  | 'unreachable'
  | 'parser-broken'
  | 'absent';

export interface CloudflareFacts {
  readonly _meta: {
    readonly schema_version: number;
    readonly last_check_attempt: string;
    readonly freshness_threshold_days: number;
  };
  readonly dpf: {
    readonly status: CloudflareFactStatus;
    readonly organization_name: string;
    readonly source_url: string;
    readonly verified_at: string;
    readonly last_known_good_at: string;
  };
  readonly cwa_retention: {
    readonly status: CloudflareFactStatus;
    readonly raw_events_retention_months: number | null;
    readonly aggregated_retention_months: number;
    readonly source_url: string;
    readonly verified_at: string;
    readonly last_known_good_at: string;
  };
}

export const cloudflareFacts: CloudflareFacts = facts as CloudflareFacts;

/**
 * Effective verified-date for the privacy pages' single-date contract.
 *
 * Resolution order (G D.11):
 *   1. `import.meta.env.VERIFIED_AT` — set from the `VERIFIER_LAST_OK_AT`
 *      GitHub Actions repo variable by every build workflow. Wins when
 *      present and parseable so prod/staging refresh the displayed date
 *      from the verifier's last clean run without any git operations.
 *      (Astro/Vite exposes non-public env vars at build time through
 *      `import.meta.env`; this is the project-wide pattern — see
 *      `src/lib/github-api.ts`, `src/lib/env.ts`.)
 *   2. Otherwise, the older of the two per-fact `verified_at` values in
 *      `src/data/cloudflare-facts.json` (worst-case freshness signal:
 *      "the data is at most this stale"). This is the local-dev path and
 *      the safe fallback for any first-deploy / reset scenario before
 *      the verifier has run.
 *
 * The `Date.parse()` guard ensures malformed env input falls through to
 * JSON rather than rendering a literal "Invalid Date" string.
 */
export function getEffectiveVerifiedDate(facts: CloudflareFacts): string {
  const envValue = import.meta.env.VERIFIED_AT as string | undefined;
  if (envValue && !Number.isNaN(Date.parse(envValue))) {
    return envValue;
  }
  const a = facts.dpf.verified_at;
  const b = facts.cwa_retention.verified_at;
  return a < b ? a : b;
}

// `formatVerifiedDate` removed in G D.9: locale-formatting is now a single
// shared helper at `src/lib/date.ts` (`formatLocaleDate`). The privacy
// pages and the product detail templates both import it directly.
