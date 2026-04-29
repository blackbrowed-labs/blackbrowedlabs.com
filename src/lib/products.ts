/**
 * Product visibility helpers.
 *
 * Two exports:
 *
 * - `getVisibleProducts(lang)` — wraps `getCollection('products')` with the
 *   env-aware draft + releaseDate gates:
 *   - On dev / staging (anything that is not `isProduction()`), every
 *     product is visible — drafts and scheduled entries included. Lets
 *     Lars test in-progress products on `dev.blackbrowedlabs.com` before
 *     flipping `draft` or before the `releaseDate` is reached.
 *   - On production, products are hidden if `draft: true` OR if
 *     `releaseDate` is in the future (compared to build time).
 *
 *   Three call sites: `src/pages/produkte/index.astro`,
 *   `src/pages/en/products/index.astro`, and the [slug].astro
 *   `getStaticPaths()` in both locales.
 *
 * - `getProductVisibility(repo)` — Phase D, G D.4. Fetches repo metadata
 *   from GitHub (`GET /repos/{owner}/{repo}`) to determine whether the
 *   repo is public or private. Drives the GitHub fallback CTA on the
 *   detail templates: CTA renders only when the repo is publicly visible.
 *
 *   Per-build cache (module-level Map) avoids duplicate API calls when
 *   both DE and EN detail pages render the same product. Astro spawns a
 *   fresh module instance per build, so the cache is naturally bounded.
 *
 *   Conservative defaults: PAT unset → returns `null` (visibility unknown
 *   → CTA suppressed). 404 → `notFound: true` (also suppressed). 403 →
 *   throws inside `fetchRepoMeta` (config error, fail loud).
 */

import { getCollection } from 'astro:content';
import { isProduction } from './env';
import { fetchRepoMeta, type RepoMeta } from './github-api';

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

// Cache visibility per build to avoid duplicate API calls when both DE
// and EN product detail pages render the same product.
const visibilityCache = new Map<string, RepoMeta | null>();

export async function getProductVisibility(
  repo: string | undefined,
): Promise<RepoMeta | null> {
  if (!repo) return null;
  if (visibilityCache.has(repo)) return visibilityCache.get(repo)!;
  if (!import.meta.env.PRODUCT_REPOS_PAT) {
    visibilityCache.set(repo, null);
    return null;
  }
  const meta = await fetchRepoMeta(repo);
  visibilityCache.set(repo, meta);
  return meta;
}
