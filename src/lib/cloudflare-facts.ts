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
 * Worst-case freshness signal: the older of the two per-fact `verified_at`
 * values. The privacy pages render ONE date (matching the
 * Phase-B.3.2.a single-date contract), and the older fact is the
 * conservative choice — "the data is at most this stale".
 */
export function getEffectiveVerifiedDate(facts: CloudflareFacts): string {
  const a = facts.dpf.verified_at;
  const b = facts.cwa_retention.verified_at;
  return a < b ? a : b;
}

// `formatVerifiedDate` removed in G D.9: locale-formatting is now a single
// shared helper at `src/lib/date.ts` (`formatLocaleDate`). The privacy
// pages and the product detail templates both import it directly.
