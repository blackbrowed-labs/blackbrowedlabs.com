/**
 * Astro content collections.
 *
 * Three collections per Pass 2 plan A.3:
 * - editorial — Markdown for Home + About + Contact (frequently-edited
 *   copy that benefits from Markdown + mobile GitHub editing).
 * - products — Markdown per product per language, keyed by slug + lang.
 * - releases — remote, populated by a custom loader at build time
 *   (stub now; real GitHub-API fetch lands in Phase D per OQ-6).
 *
 * Legal pages (Impressum, Datenschutz), 404, and the Products index
 * are intentionally NOT in `editorial` — they live as `.astro` files
 * with inline copy because they're rarely-edited or template-shaped
 * (per OQ-1/D16).
 */

import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'zod';

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
    externalUrl: z.url(),
    repo: z.string(),
    logo: z.string().optional(),
    order: z.number().optional(),
    draft: z.boolean().optional(),
  }),
});

// Stub loader — returns no entries. Phase D replaces with a real GitHub-API
// fetch (TECH_STACK §5.3). Landing the stub now means a product Markdown
// added between phases doesn't break the build.
const releases = defineCollection({
  loader: async () => [],
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
