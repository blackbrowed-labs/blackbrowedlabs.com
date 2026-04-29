/**
 * Thin wrapper around the GitHub REST API for build-time data fetching.
 *
 * Used by `src/content.config.ts`'s `releases` collection loader and by
 * `src/lib/products.ts`'s `getProductVisibility` helper. Two endpoints are
 * exposed:
 *
 * - `fetchRepoMeta(repo)` → `GET /repos/{owner}/{repo}`. Returns parsed
 *   `RepoMeta` ({ isPrivate, htmlUrl, notFound }) or throws on 403.
 *   Drives the visibility auto-detect that gates the GitHub fallback CTA.
 * - `fetchReleases(repo, productSlug)` → `GET /repos/{owner}/{repo}/releases`.
 *   Returns typed `ReleaseEntry[]` filtered to non-draft GitHub releases.
 *   Drives the `releases` content collection.
 *
 * Auth: reads `import.meta.env.PRODUCT_REPOS_PAT` and sends it as a Bearer
 * token. Loader-side short-circuit guards handle the unset case before
 * fetch helpers are invoked. The visibility helper degrades gracefully when
 * unset (returns `null`, which the detail templates treat as "visibility
 * unknown → CTA suppressed").
 *
 * Failure-mode discipline (per Phase D's "no silent failures" stance):
 * - 200 → parse and return.
 * - 404 → repo or releases missing; warn + return `notFound`-style sentinel.
 *   The CTA suppresses; release loader returns `[]` for that repo.
 * - 403 → access forbidden. Throw. This is a config error (PAT scope or
 *   org permission) and the build SHOULD fail loudly. Lars fixes the PAT.
 * - Any other non-OK → throw with status code in the message.
 */

const GITHUB_API_BASE = 'https://api.github.com';

export type ReleaseEntry = {
  productSlug: string;
  tagName: string;
  name: string;
  publishedAt: string;
  bodyMarkdown: string;
  isPrerelease: boolean;
  isDraft: boolean;
  htmlUrl: string;
};

export type RepoMeta = {
  isPrivate: boolean;
  htmlUrl: string;
  notFound: boolean;
};

function authHeader(): Record<string, string> {
  const pat = import.meta.env.PRODUCT_REPOS_PAT;
  if (!pat) return {};
  return { Authorization: `Bearer ${pat}` };
}

export async function fetchRepoMeta(repo: string): Promise<RepoMeta | null> {
  const res = await fetch(`${GITHUB_API_BASE}/repos/${repo}`, {
    headers: { Accept: 'application/vnd.github+json', ...authHeader() },
  });
  if (res.status === 404) {
    console.warn(`[github-api] Repo ${repo} not found (404). CTA suppression.`);
    return { isPrivate: true, htmlUrl: `https://github.com/${repo}`, notFound: true };
  }
  if (res.status === 403) {
    throw new Error(
      `[github-api] Repo ${repo} access forbidden (403). Check PRODUCT_REPOS_PAT scope (needs Metadata: Read on this repo).`,
    );
  }
  if (!res.ok) {
    throw new Error(
      `[github-api] Repo ${repo} fetch failed (${res.status}): ${await res.text()}`,
    );
  }
  const data = (await res.json()) as { private?: boolean; html_url?: string };
  return {
    isPrivate: Boolean(data.private),
    htmlUrl: String(data.html_url ?? `https://github.com/${repo}`),
    notFound: false,
  };
}

export async function fetchReleases(
  repo: string,
  productSlug: string,
): Promise<ReleaseEntry[]> {
  const res = await fetch(
    `${GITHUB_API_BASE}/repos/${repo}/releases?per_page=30`,
    {
      headers: { Accept: 'application/vnd.github+json', ...authHeader() },
    },
  );
  if (res.status === 404) {
    console.warn(
      `[github-api] Releases for ${repo} not found (404). Returning empty list.`,
    );
    return [];
  }
  if (res.status === 403) {
    throw new Error(
      `[github-api] Releases for ${repo} forbidden (403). Check PRODUCT_REPOS_PAT scope (needs Contents: Read on this repo).`,
    );
  }
  if (!res.ok) {
    throw new Error(
      `[github-api] Releases for ${repo} fetch failed (${res.status})`,
    );
  }
  const data = (await res.json()) as Array<{
    tag_name: string;
    name?: string | null;
    published_at: string;
    body?: string | null;
    prerelease: boolean;
    draft: boolean;
    html_url: string;
  }>;
  return data
    .filter((r) => !r.draft) // GitHub draft releases are not visible to consumers
    .map((r) => ({
      productSlug,
      tagName: r.tag_name,
      name: r.name ?? r.tag_name,
      publishedAt: r.published_at,
      bodyMarkdown: r.body ?? '',
      isPrerelease: r.prerelease,
      isDraft: r.draft,
      htmlUrl: r.html_url,
    }));
}
