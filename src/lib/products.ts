/**
 * Product visibility filter.
 *
 * Wraps `getCollection('products')` with the env-aware draft + releaseDate
 * gates:
 * - On dev / staging (anything that is not `isProduction()`), every product
 *   is visible — drafts and scheduled entries included. Lets Lars test
 *   in-progress products on `dev.blackbrowedlabs.com` before flipping
 *   `draft` or before the `releaseDate` is reached.
 * - On production, products are hidden if `draft: true` OR if `releaseDate`
 *   is in the future (compared to build time).
 *
 * Three call sites use this helper: `src/pages/produkte/index.astro`,
 * `src/pages/en/products/index.astro`, and the [slug].astro
 * `getStaticPaths()` in both locales.
 */

import { getCollection } from 'astro:content';
import { isProduction } from './env';

export async function getVisibleProducts(lang: 'de' | 'en') {
  const all = await getCollection('products', (e) => e.data.lang === lang);
  if (!isProduction()) return all;
  const now = new Date();
  return all.filter((e) => {
    if (e.data.draft === true) return false;
    if (e.data.releaseDate && e.data.releaseDate > now) return false;
    return true;
  });
}
