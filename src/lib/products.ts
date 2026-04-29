/**
 * Product visibility filter.
 *
 * Wraps `getCollection('products')` with the env-aware draft gate:
 * - On dev / staging (anything that is not `isProduction()`), every product
 *   is visible — drafts and scheduled entries included. Lets Lars test
 *   in-progress products on `dev.blackbrowedlabs.com` before flipping the
 *   `draft` field.
 * - On production, products with `draft: true` are filtered out. The
 *   `releaseDate` branch lands in G C.2.a alongside the schema field.
 *
 * Three call sites use this helper: `src/pages/produkte/index.astro`,
 * `src/pages/en/products/index.astro`, and the [slug].astro `getStaticPaths()`
 * in both locales (when those land in G C.2.a).
 */

import { getCollection } from 'astro:content';
import { isProduction } from './env';

export async function getVisibleProducts(lang: 'de' | 'en') {
  const all = await getCollection('products', (e) => e.data.lang === lang);
  if (!isProduction()) return all;
  return all.filter((e) => e.data.draft !== true);
}
