/**
 * Locale-aware long-form date formatter (build-time only).
 *
 * Used by the privacy pages (Cloudflare-fact `verified_at` rendering) and
 * by the product detail templates (release `publishedAt` rendering).
 *
 * Output:
 * - DE: `29. April 2026`
 * - EN: `April 29, 2026`
 *
 * Accepts either a bare date (`YYYY-MM-DD`) or a full ISO datetime
 * (`YYYY-MM-DDTHH:MM:SSZ`). Internally formats with `timeZone: 'UTC'` so
 * the calendar date renders deterministically regardless of the build
 * machine's timezone — matching the previous `formatVerifiedDate` semantics
 * that constructed dates via `Date.UTC(...)`.
 *
 * Throws on empty / non-string / unparseable input (per G D.7's hardening
 * stance: no silent failures on data issues).
 */

export function formatLocaleDate(iso: string, locale: 'de' | 'en'): string {
  if (!iso || typeof iso !== 'string') {
    throw new Error(`formatLocaleDate: invalid input ${JSON.stringify(iso)}`);
  }
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) {
    throw new Error(`formatLocaleDate: unparseable ${iso}`);
  }
  return new Intl.DateTimeFormat(locale === 'de' ? 'de-DE' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  }).format(date);
}
