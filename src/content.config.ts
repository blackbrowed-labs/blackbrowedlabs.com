/**
 * Astro content collections.
 *
 * Three collections per Pass 2 plan A.3:
 * - editorial — Markdown for Home + About + Contact (frequently-edited
 *   copy that benefits from Markdown + mobile GitHub editing).
 * - products — Markdown per product per language, keyed by slug + lang.
 * - releases — remote, populated by a custom loader that hits the GitHub
 *   API at build time (Phase D, G D.4). Two short-circuit guards keep
 *   the v1 / unconfigured cases sane.
 *
 * Legal pages (Impressum, Datenschutz), 404, and the Products index
 * are intentionally NOT in `editorial` — they live as `.astro` files
 * with inline copy because they're rarely-edited or template-shaped
 * (per OQ-1/D16).
 */

import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'zod';
import { fetchReleases, type ReleaseEntry } from './lib/github-api';

// Minimal ambient typing for the Node APIs the releases loader uses at
// build time. `@types/node` is intentionally not a project dependency
// (the codebase keeps Node-using helpers in `scripts/*.mjs` outside the
// strict-TS surface); spelling out just what we use here keeps strict-TS
// happy without pulling in 50 MB of types — and avoids `any`-propagation
// that would otherwise leak through dynamic imports.
type FsPromisesShim = {
  readdir(path: string): Promise<string[]>;
  readFile(path: string, encoding: 'utf-8'): Promise<string>;
};
type PathShim = {
  resolve(...segments: string[]): string;
  join(...segments: string[]): string;
};
declare const process: { cwd(): string };

type ProductMatter = { slug: string; repo: string };

// Glob's default `generateId` strips dots from the filename, so
// `about.de.md` becomes `aboutde`. Override to preserve the dotted form
// (`about.de`), which matches the natural slug.lang convention used by
// editorial pages and read sites like `getEntry('editorial', 'about.de')`.
const editorial = defineCollection({
  loader: glob({
    pattern: '**/*.md',
    base: './src/content/editorial',
    generateId: ({ entry }) => entry.replace(/\.md$/, ''),
  }),
  schema: z.object({
    lang: z.enum(['de', 'en']),
    title: z.string().optional(),
    tagline: z.string().optional(),
    heroLead: z.string().optional(),
    intro: z.array(z.string()).optional(),
    secondaryLink: z
      .object({
        label: z.string(),
        href: z.string(),
      })
      .optional(),
    description: z.string().optional(),
    closing: z
      .object({
        aphorism: z.string(),
        signature: z.string(),
      })
      .optional(),
  }),
});

const products = defineCollection({
  loader: glob({
    pattern: '**/*.md',
    base: './src/content/products',
    generateId: ({ entry }) => entry.replace(/\.md$/, ''),
  }),
  schema: z.object({
    name: z.string(),
    slug: z.string(),
    lang: z.enum(['de', 'en']),
    tagline: z.string(),
    description: z.string(),
    externalUrl: z.url().optional(),
    repo: z.string().optional(),
    logo: z.string().optional(),
    order: z.number().optional(),
    draft: z.boolean().optional(),
    releaseDate: z.coerce.date().optional(),
  }).refine(
    (data) => Boolean(data.externalUrl || data.repo),
    {
      message: 'Either externalUrl or repo must be set on a product',
      path: ['externalUrl'],
    },
  ),
});

// Releases loader — Phase D, G D.4. For every non-draft product (with a
// `repo` field), fetch GitHub Releases via PRODUCT_REPOS_PAT and surface
// them as collection entries.
//
// Two short-circuit guards keep the loader sane in v1 / unconfigured cases:
//   1. `PRODUCT_REPOS_PAT` unset → warn + return []. Local builds without
//      the PAT (and CI without the secret) still succeed.
//   2. No non-draft products with a `repo` → return []. The empty-state
//      products index keeps rendering.
//
// Note: this loader manually enumerates `src/content/products/*.md` via
// the filesystem because Astro's content layer does not allow loaders to
// import each other. We dedupe per slug by reading only the DE entry
// (slug + lang + repo are duplicated across the DE/EN sibling files;
// fetching twice would be wasteful and noisy in API logs).
const releases = defineCollection({
  loader: async () => {
    // Guard 1: no PAT → no fetches.
    if (!import.meta.env.PRODUCT_REPOS_PAT) {
      console.warn(
        '[releases-loader] PRODUCT_REPOS_PAT unset; returning empty releases collection. Set it in .env (local) or Actions secrets (CI).',
      );
      return [];
    }

    // Node-API imports inlined via dynamic import. The minimal shim
    // typings declared at the top of this file cover the exact surface
    // we use here (readdir/readFile/resolve/join/process.cwd) so TS
    // strict mode stays clean without pulling in `@types/node`.
    // @ts-ignore — node:fs/promises is unknown to TS without @types/node, but always present at build time
    const fs = (await import('node:fs/promises')) as FsPromisesShim;
    // @ts-ignore — node:path is unknown to TS without @types/node, but always present at build time
    const path = (await import('node:path')) as PathShim;
    const productsDir = path.resolve(process.cwd(), 'src/content/products');
    const files = await fs.readdir(productsDir);
    const productMatter: Array<ProductMatter | null> = await Promise.all(
      files
        .filter((f) => f.endsWith('.md'))
        .map(async (f): Promise<ProductMatter | null> => {
          const raw = await fs.readFile(path.join(productsDir, f), 'utf-8');
          const m = raw.match(/^---\n([\s\S]*?)\n---/);
          if (!m) return null;
          const fm = m[1];
          const slugMatch = fm.match(/^slug:\s*"?([^"\n]+)"?/m);
          const repoMatch = fm.match(/^repo:\s*"?([^"\n]+)"?/m);
          const langMatch = fm.match(/^lang:\s*"?([a-z]{2})"?/m);
          const draftMatch = fm.match(/^draft:\s*(true|false)/m);
          // Dedupe per slug: only DE entries drive a fetch (slug/lang/repo
          // are identical across DE/EN siblings).
          if (!slugMatch || !repoMatch || langMatch?.[1] !== 'de') return null;
          // Skip drafts: no point fetching releases for products that
          // won't render on prod and don't need release data on dev either.
          if (draftMatch?.[1] === 'true') return null;
          return { slug: slugMatch[1], repo: repoMatch[1] };
        }),
    );
    const productSlugs: ProductMatter[] = productMatter.filter(
      (x): x is ProductMatter => x !== null,
    );

    // Guard 2: no eligible products → no fetches.
    if (productSlugs.length === 0) {
      return [];
    }

    // Failures bubble up loudly (403 throws; 404 returns []).
    const allReleases: ReleaseEntry[] = (
      await Promise.all(
        productSlugs.map((p) => fetchReleases(p.repo, p.slug)),
      )
    ).flat();

    return allReleases.map((r) => ({
      id: `${r.productSlug}-${r.tagName}`,
      ...r,
    }));
  },
  schema: z.object({
    productSlug: z.string(),
    tagName: z.string(),
    name: z.string(),
    publishedAt: z.string(),
    bodyMarkdown: z.string(),
    isPrerelease: z.boolean(),
    isDraft: z.boolean(),
    htmlUrl: z.url(),
  }),
});

export const collections = { editorial, products, releases };
