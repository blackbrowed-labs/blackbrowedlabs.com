/**
 * Locale + counterpart-URL helpers.
 *
 * Counterpart URLs are resolved via an explicit hand-maintained map
 * because German slugs are not mechanical translations of English slugs
 * (see docs/BASELINE_COPY.md §12).
 */

import type { Locale } from '../i18n';

/**
 * Canonical path form: leading slash, no trailing slash, except the
 * root path which is just "/".
 */
function canonicalise(path: string): string {
  if (path === '' || path === '/') return '/';
  return path.endsWith('/') ? path.slice(0, -1) : path;
}

/**
 * DE <-> EN counterpart map. Keys and values are in canonical form.
 * Missing entries indicate the page has no translation — the language
 * switcher renders the missing side as aria-disabled.
 */
const counterparts: Record<string, string> = {
  '/': '/en',
  '/en': '/',
  '/ueber': '/en/about',
  '/en/about': '/ueber',
  '/kontakt': '/en/contact',
  '/en/contact': '/kontakt',
  '/impressum': '/en/legal',
  '/en/legal': '/impressum',
  '/datenschutz': '/en/privacy',
  '/en/privacy': '/datenschutz',
  '/produkte': '/en/products',
  '/en/products': '/produkte',
  '/404': '/en/404',
  '/en/404': '/404',
};

export function getLocaleFromPath(path: string): Locale {
  const canonical = canonicalise(path);
  return canonical === '/en' || canonical.startsWith('/en/') ? 'en' : 'de';
}

export function getCounterpartUrl(path: string): string | null {
  return counterparts[canonicalise(path)] ?? null;
}

/**
 * Hreflang alternates for the current path. Always returns both
 * locales; `x-default` points to the German version. If a counterpart
 * is missing, that locale is omitted from the alternates set.
 */
export function getHreflangAlternates(
  path: string,
  siteUrl: string,
): Array<{ hreflang: 'de' | 'en' | 'x-default'; href: string }> {
  const currentLocale = getLocaleFromPath(path);
  const canonical = canonicalise(path);
  const counterpart = counterparts[canonical];

  const dePath = currentLocale === 'de' ? canonical : counterpart;
  const enPath = currentLocale === 'en' ? canonical : counterpart;

  const out: Array<{ hreflang: 'de' | 'en' | 'x-default'; href: string }> = [];
  if (dePath) {
    out.push({ hreflang: 'de', href: `${siteUrl}${dePath}` });
    out.push({ hreflang: 'x-default', href: `${siteUrl}${dePath}` });
  }
  if (enPath) {
    out.push({ hreflang: 'en', href: `${siteUrl}${enPath}` });
  }
  return out;
}
