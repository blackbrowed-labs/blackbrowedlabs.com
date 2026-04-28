/**
 * Read-only access to src/data/cloudflare-facts.json.
 *
 * Astro imports JSON statically at build time — the verifier in Phase
 * D writes the same shape, so this typed view stays valid across the
 * manual-data → automated-data transition.
 */

import facts from '../data/cloudflare-facts.json';

export interface CloudflareFacts {
  readonly verifiedDate: string;
  readonly dpf: {
    readonly status: 'active' | 'pending' | 'withdrawn' | 'inactive';
    readonly sourceUrl: string;
    readonly originalCertificationDate: string;
    readonly nextCertificationDue: string;
  };
  readonly cwa: {
    readonly retentionAggregatesMonths: number;
    readonly sourceUrl: string;
  };
}

export const cloudflareFacts: CloudflareFacts = facts as CloudflareFacts;

/**
 * Format an ISO 8601 date (YYYY-MM-DD) as a long-form locale-specific
 * string for legal-prose rendering. German uses "28. April 2026"; English
 * uses "April 28, 2026". Run at build time only.
 */
export function formatVerifiedDate(isoDate: string, locale: 'de' | 'en'): string {
  const [year, month, day] = isoDate.split('-').map(Number);
  return new Intl.DateTimeFormat(locale === 'de' ? 'de-DE' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(Date.UTC(year, month - 1, day)));
}
