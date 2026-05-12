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
 * - Per-fact `verified_at` is updated only when a value change forces a
 *   JSON commit (the verifier-bot PR). For the silent-when-healthy
 *   weekly cron path, JSON stays untouched and the displayed dates flow
 *   from GitHub Actions repo variables instead — see below.
 * - Per-fact `last_known_good_at` mirrors `verified_at` on success and is
 *   left untouched on failure — useful for "stale" detection.
 *
 * G D.11 + G D.12 display-date sourcing — all three rendered "verified
 * at" surfaces on the privacy pages flow through
 * `getEffectiveVerifiedDate()` with a `source` argument, preferring
 * GitHub Actions repo variables (set by the verifier's clean-run path)
 * over JSON:
 * - top-level `<meta name="bbl-verified-at">` + visible "zuletzt geprüft
 *   am ..." prose → source `'top'` → env `VERIFIED_AT` ← variable
 *   `VERIFIER_LAST_OK_AT` (advances on all-ok runs).
 * - `<meta name="bbl-verified-at-dpf">` → source `'dpf'` → env
 *   `VERIFIED_AT_DPF` ← variable `VERIFIER_DPF_VERIFIED_AT` (advances
 *   whenever the DPF check returns ok, independent of CWA).
 * - `<meta name="bbl-verified-at-cwa">` → source `'cwa'` → env
 *   `VERIFIED_AT_CWA` ← variable `VERIFIER_CWA_VERIFIED_AT` (advances
 *   whenever the CWA check returns ok, independent of DPF).
 * JSON's per-fact `verified_at` is the fallback if any env var is
 * unset or unparseable (local dev, first deploy, reset scenarios).
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
 * Source selector for `getEffectiveVerifiedDate`.
 * - `'top'` (default): unified display date for the headline "zuletzt
 *   geprüft am ..." prose + `<meta name="bbl-verified-at">`. Sourced
 *   from `VERIFIED_AT` env (← repo var `VERIFIER_LAST_OK_AT`); JSON
 *   fallback is the older of the two per-fact dates.
 * - `'dpf'`: per-fact diagnostic marker for the DPF claim. Sourced from
 *   `VERIFIED_AT_DPF` env (← repo var `VERIFIER_DPF_VERIFIED_AT`); JSON
 *   fallback is `facts.dpf.verified_at`.
 * - `'cwa'`: per-fact diagnostic marker for the CWA retention claim.
 *   Sourced from `VERIFIED_AT_CWA` env (← repo var
 *   `VERIFIER_CWA_VERIFIED_AT`); JSON fallback is
 *   `facts.cwa_retention.verified_at`.
 */
export type VerifiedAtSource = 'top' | 'dpf' | 'cwa';

/**
 * Effective verified-date for the privacy pages.
 *
 * Resolution order (G D.11 + G D.12): env var matching `source` wins
 * when present and parseable so prod/staging refresh the displayed date
 * from the verifier's last clean run without any git operations. Otherwise
 * fall back to JSON's per-fact `verified_at` (per-fact sources) or the
 * older of the two (top-level — worst-case freshness signal).
 *
 * Vite replaces `import.meta.env.X` at build time only when `X` is a
 * literal property access — computed property access wouldn't be
 * replaced — so the three sources branch explicitly. The `Date.parse()`
 * guard ensures malformed env input falls through to JSON rather than
 * rendering a literal "Invalid Date" string.
 */
export function getEffectiveVerifiedDate(
  facts: CloudflareFacts,
  source: VerifiedAtSource = 'top',
): string {
  let envValue: string | undefined;
  if (source === 'dpf') {
    envValue = import.meta.env.VERIFIED_AT_DPF as string | undefined;
  } else if (source === 'cwa') {
    envValue = import.meta.env.VERIFIED_AT_CWA as string | undefined;
  } else {
    envValue = import.meta.env.VERIFIED_AT as string | undefined;
  }
  if (envValue && !Number.isNaN(Date.parse(envValue))) {
    return envValue;
  }
  if (source === 'dpf') return facts.dpf.verified_at;
  if (source === 'cwa') return facts.cwa_retention.verified_at;
  const a = facts.dpf.verified_at;
  const b = facts.cwa_retention.verified_at;
  return a < b ? a : b;
}

// `formatVerifiedDate` removed in G D.9: locale-formatting is now a single
// shared helper at `src/lib/date.ts` (`formatLocaleDate`). The privacy
// pages and the product detail templates both import it directly.
