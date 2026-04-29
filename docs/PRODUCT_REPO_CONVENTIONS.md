# Product repo conventions

> Canonical release-process convention for every product repo under
> `blackbrowed-labs/*`. Adopting it gives a product repo automated GitHub
> Releases creation from `CHANGELOG.md`, version-data feed to the
> website's release loader, and event-driven website rebuilds on each
> release.

## 1. Overview

This document defines the release process every `blackbrowed-labs/*`
product repo follows. The process is intentionally narrow: a single
GitHub Actions workflow (`release.yml`) triggers on a semver tag push,
extracts the matching `CHANGELOG.md` section as the GitHub Release body,
creates the Release, then dispatches a `repository_dispatch` event to
the website repo so the website rebuilds with the new release data.

Adopting these conventions is what allows a product to appear on
`blackbrowedlabs.com/produkte/<slug>/` and `/en/products/<slug>/` with
real, current release data. Repos that do not follow them are not
surfaced by the website's release loader.

The reference implementation lives at
`blackbrowed-labs/pipeline-test-fixture` — a synthetic test fixture
created during Phase D's verification gate. Use it as a paste-this-and-
done starting point for new product repos.

## 2. Tag format

- Semantic Versioning, lowercase `v` prefix: `vX.Y.Z`. Examples:
  `v1.0.0`, `v0.4.2`, `v2.13.7`.
- Pre-release marking: prefer GitHub's `isPrerelease` flag (set when
  publishing the Release on github.com or via `gh release create
  --prerelease`) over a tag suffix.
- Exception: during the v0/v1 era a suffix is acceptable for clarity
  (`v0.1.0-pre`, `v0.1.0-rc.1`). Both forms parse as valid semver and
  both work with the workflow's CHANGELOG extractor. Once the project
  reaches a stable `v1.0.0` and beyond, drop suffixes and use the
  `isPrerelease` flag exclusively.
- Tags are immutable. Do not delete and force-push the same tag at a
  different SHA — see §8 "Idempotency and re-tagging".

## 3. CHANGELOG.md

`CHANGELOG.md` lives at the repo root and is the single source of
truth for release notes. The `release.yml` workflow extracts the
section matching the pushed tag and uses it verbatim as the GitHub
Release body.

Format: [Keep a Changelog 1.1](https://keepachangelog.com/en/1.1.0/).

### 3.1 Per-version section structure

```markdown
## [vX.Y.Z] — YYYY-MM-DD

### Added
- ...

### Changed
- ...

### Deprecated
- ...

### Removed
- ...

### Fixed
- ...

### Security
- ...
```

Subsections that are empty for a given release are omitted. The
extractor preserves whitespace and Markdown inside the section but
trims leading/trailing blank lines.

The `## [vX.Y.Z] — YYYY-MM-DD` heading is matched against the pushed
tag. The extractor accepts both `## [v0.1.0]` and `## [0.1.0]` heading
styles for forward compatibility — but pick one and stick with it for
a given repo to keep diffs clean.

### 3.2 Initial CHANGELOG.md template

For fresh product repos, drop this in at repo root before the first
tag:

```markdown
# Changelog

All notable changes to this project documented per
[Keep a Changelog 1.1](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]

### Added
- (entries accumulate here until released; move to a versioned heading on release)
```

The `## [Unreleased]` section is a working buffer. When you cut a
release, rename it to `## [vX.Y.Z] — YYYY-MM-DD` and start a fresh
`## [Unreleased]` above it.

## 4. Release workflow

Drop this verbatim into `.github/workflows/release.yml`. Do not modify
without coordinating with the website's release loader (the workflow
shape is part of the cross-repo contract):

```yaml
# .github/workflows/release.yml
# Triggers on tag push (vX.Y.Z); extracts CHANGELOG.md section as release body;
# dispatches product-release-published to blackbrowed-labs/blackbrowedlabs.com.

name: release

on:
  push:
    tags:
      - 'v*'

env:
  # Forward-defense for GitHub's Node 20 deprecation (default flip 2026-06-02,
  # removal 2026-09-16). Per blackbrowedlabs.com's PRODUCT_REPO_CONVENTIONS.md.
  FORCE_JAVASCRIPT_ACTIONS_TO_NODE24: "true"

jobs:
  release:
    name: Create GitHub Release + dispatch website rebuild
    runs-on: ubuntu-latest
    permissions:
      contents: write
    steps:
      - name: Checkout
        uses: actions/checkout@v6
        with:
          fetch-depth: 0

      - name: Extract CHANGELOG section for this version
        id: changelog
        run: |
          set -euo pipefail
          TAG="${GITHUB_REF_NAME}"
          # Match `## [vX.Y.Z]` or `## [X.Y.Z]` heading; capture until next `## [` heading.
          BODY=$(awk -v tag="${TAG#v}" '
            /^## \[/ { if (seen) exit; if ($0 ~ "\\["tag"\\]" || $0 ~ "\\[v"tag"\\]") seen=1; next }
            seen { print }
          ' CHANGELOG.md | sed -e '/./,$!d' | awk 'BEGIN{empty=0} /./{empty=0; print; next} {empty++; if (empty<2) print}')
          if [ -z "$BODY" ]; then
            echo "::error::No CHANGELOG section found for tag $TAG. Add a '## [$TAG]' or '## [${TAG#v}]' section to CHANGELOG.md before tagging."
            exit 1
          fi
          # Multi-line output via heredoc-delimiter pattern for GH Actions.
          {
            echo "body<<EOF"
            echo "$BODY"
            echo "EOF"
          } >> "$GITHUB_OUTPUT"

      - name: Create GitHub Release
        env:
          GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        run: |
          set -euo pipefail
          # Idempotent: skip if release already exists for this tag.
          if gh release view "${GITHUB_REF_NAME}" >/dev/null 2>&1; then
            echo "Release ${GITHUB_REF_NAME} already exists; skipping create."
          else
            cat <<'BODY_EOF' > /tmp/release_body.md
          ${{ steps.changelog.outputs.body }}
          BODY_EOF
            gh release create "${GITHUB_REF_NAME}" \
              --title "${GITHUB_REF_NAME}" \
              --notes-file /tmp/release_body.md
          fi

      - name: Dispatch website rebuild
        env:
          GH_TOKEN: ${{ secrets.WEBSITE_DISPATCH_TOKEN }}
        run: |
          set -euo pipefail
          if [ -z "$GH_TOKEN" ]; then
            echo "::error::WEBSITE_DISPATCH_TOKEN secret is not set on this repo. Ask Lars (or the org admin) to add it. See PRODUCT_REPO_CONVENTIONS.md §5."
            exit 1
          fi
          gh api repos/blackbrowed-labs/blackbrowedlabs.com/dispatches \
            -f event_type=product-release-published \
            -f client_payload[productSlug]="${{ github.event.repository.name }}" \
            -f client_payload[tagName]="${GITHUB_REF_NAME}"
```

Notes on the workflow:

- `actions/checkout@v6` is Node-24-native (released in the Node-20
  deprecation window). The website repo's G D.1 gate pinned this same
  version across all its workflows; product repos match.
- The `FORCE_JAVASCRIPT_ACTIONS_TO_NODE24` env var is forward-defense
  for the Node 20 deprecation timeline (default flip 2026-06-02,
  removal 2026-09-16). It is harmless after Node 24 becomes default.
- The `awk` extractor accepts both `## [v0.1.0]` and `## [0.1.0]`
  heading styles. The `sed -e '/./,$!d'` step trims leading blank
  lines.
- The GitHub Release creation step is idempotent: if a Release already
  exists for the tag, the step logs and continues to the dispatch
  step. This keeps the website rebuild firing even when a tag is
  re-pushed.
- The dispatch step uses `WEBSITE_DISPATCH_TOKEN` — a per-product-repo
  fine-grained PAT scoped to write only the website repo. See §5.

## 5. Required secrets

`WEBSITE_DISPATCH_TOKEN` — a fine-grained Personal Access Token, stored
as a per-product-repo Actions secret:

| Property | Value |
|---|---|
| Resource owner | `blackbrowed-labs` (the org) |
| Repository access | Only `blackbrowed-labs/blackbrowedlabs.com` |
| Permissions | `Contents: Read and write` (the only scope needed for `repository_dispatch`) |
| Expiration | 1 year — Lars sets a calendar reminder for renewal |

The same PAT is reused across all product repos. Each new product repo
gets the secret added to its own Actions secrets store.

### 5.1 Provisioning paths

**UI clickthrough (primary):**

1. github.com → top-right avatar → Settings → Developer settings →
   Personal access tokens → Fine-grained tokens.
2. "Generate new token" → name `blackbrowedlabs-com-dispatch-writer`
   → expiration 1 year → resource owner `blackbrowed-labs`.
3. Repository access: "Only select repositories" → pick
   `blackbrowedlabs.com`.
4. Repository permissions: `Contents: Read and write` only. Leave all
   others as "No access".
5. Click "Generate token" → copy the value into a password manager.
6. For each product repo: Settings → Secrets and variables → Actions
   → New repository secret. Name `WEBSITE_DISPATCH_TOKEN`, paste the
   value.

**CLI alternative:**

```bash
# The fine-grained PAT itself must be created via the UI — `gh` does
# not support fine-grained PAT creation as of this writing (2026-04).
# Once the PAT exists, set it as a repo secret per product repo:
gh secret set WEBSITE_DISPATCH_TOKEN \
  --repo blackbrowed-labs/<product-repo> \
  --body "<PAT-value>"
```

## 6. Setup paths (dual)

For first-time setup of a new product repo, both paths produce the
same result. Pick the one that fits the moment.

### 6.1 UI clickthrough

1. github.com → "+" (top-right) → "New repository".
2. Owner: `blackbrowed-labs`. Name: `<product-slug>`. Add description.
   Visibility: Private (flip to public when ready to launch).
3. Initialize with README. License: `Apache 2.0` (or your choice).
4. Click "Create repository".
5. Add `WEBSITE_DISPATCH_TOKEN` secret per §5.1.
6. On the new repo: "Add file" → "Create new file" →
   `CHANGELOG.md`. Paste the §3.2 template.
7. "Add file" → "Create new file" → `.github/workflows/release.yml`.
   Paste the §4 YAML verbatim.
8. Commit each file directly to `main`.

### 6.2 CLI alternative

```bash
# Create + clone:
gh repo create blackbrowed-labs/<name> \
  --private \
  --add-readme \
  --license apache-2.0
gh repo clone blackbrowed-labs/<name>
cd <name>

# Drop in CHANGELOG.md (from §3.2) and .github/workflows/release.yml (from §4).
# Then commit + push:
git add CHANGELOG.md .github/workflows/release.yml
git commit -m "init: CHANGELOG + release workflow"
git push

# Add the dispatch secret (PAT itself created via UI — see §5.1):
gh secret set WEBSITE_DISPATCH_TOKEN --body "<PAT>"
```

## 7. Cutting a release (dual)

For an existing setup-complete repo. Both paths produce the same
result.

### 7.1 UI

1. Edit `CHANGELOG.md` directly on github.com — move `[Unreleased]`
   entries under a new `## [vX.Y.Z] — YYYY-MM-DD` heading. Commit to
   `main`.
2. Repo home → Releases tab → "Draft a new release".
3. "Choose a tag" → type `vX.Y.Z` → click "Create new tag: vX.Y.Z on
   publish". Target: `main`.
4. Title: `vX.Y.Z`.
5. Description: paste the body of the matching `## [vX.Y.Z]` section
   from `CHANGELOG.md`. (The workflow will also extract this
   automatically; pasting here is for the github.com Release UI in
   case the user lands there before the workflow runs.)
6. Check "Set as a pre-release" if applicable.
7. Click "Publish release".

The `release.yml` workflow runs automatically because it's triggered
by the tag push that publishing the release performs.

### 7.2 CLI

```bash
# After updating CHANGELOG.md and pushing main:
git tag -a vX.Y.Z -m "vX.Y.Z"
git push origin vX.Y.Z
# The workflow auto-creates the GitHub Release from the CHANGELOG
# section. To mark prerelease:
#   gh release edit vX.Y.Z --prerelease
```

The workflow is idempotent — see §9.

## 8. Recovery / failure modes

Each common failure, the exact error message you will see in the
workflow run, and the fix.

### 8.1 `WEBSITE_DISPATCH_TOKEN` missing

**Symptom:** the "Dispatch website rebuild" step fails with the
guard's error:

```
::error::WEBSITE_DISPATCH_TOKEN secret is not set on this repo.
Ask Lars (or the org admin) to add it.
See PRODUCT_REPO_CONVENTIONS.md §5.
```

**Recovery:**
1. Add the secret to this repo per §5.1.
2. Re-trigger the workflow. Note the workflow does not re-run on a
   tag that has already been processed once. To force a re-run for the
   same intended release, either:
   - Bump a patch version (e.g., `vX.Y.Z+1`) and re-tag — preferred,
     leaves a clean audit trail.
   - Or delete the workflow run and re-run from the Actions tab UI
     ("Re-run all jobs"). The `gh release create` step is idempotent
     and skips the existing release.

### 8.2 CHANGELOG section missing for the tag

**Symptom:** the "Extract CHANGELOG section" step fails with:

```
::error::No CHANGELOG section found for tag vX.Y.Z.
Add a '## [vX.Y.Z]' or '## [X.Y.Z]' section to CHANGELOG.md before tagging.
```

**Recovery:**
1. Edit `CHANGELOG.md` and add the missing `## [vX.Y.Z] — YYYY-MM-DD`
   section.
2. Push to `main`.
3. Tag a new version (e.g., bump patch). The workflow does not re-run
   for the same already-pushed tag.

### 8.3 Release dispatch fails with HTTP 401 / 403

**Symptom:** the "Dispatch website rebuild" step fails with a
`gh api` error showing `HTTP 401: Bad credentials` or `HTTP 403:
Resource not accessible by personal access token`.

**Cause:** the `WEBSITE_DISPATCH_TOKEN` PAT was revoked, expired, or
its scope changed.

**Recovery:**
1. Generate a new fine-grained PAT per §5.1 with the required scope.
2. Update the repo secret with the new value.
3. Re-tag (bump patch) so the workflow runs again.

### 8.4 Release already exists for the tag

**Symptom:** the "Create GitHub Release" step logs:

```
Release vX.Y.Z already exists; skipping create.
```

The workflow continues to the dispatch step. The website rebuild
still fires. This is intentional idempotent behaviour — see §9.

### 8.5 Workflow doesn't run at all on tag push

**Cause:** the workflow file's `on.push.tags` filter doesn't match the
pushed tag, or the workflow file has a YAML syntax error and was
disabled.

**Recovery:**
1. Verify the tag matches the `v*` glob (lowercase `v` prefix). A
   tag like `1.0.0` (no `v`) will not match.
2. Open the Actions tab on github.com — disabled workflows show with
   a red banner.
3. Validate the YAML locally (`yq eval . .github/workflows/release.yml`
   or `gh workflow view release.yml`).

## 9. Idempotency and re-tagging

The workflow is idempotent: re-running it for the same tag does
**not** duplicate the GitHub Release. The "Create GitHub Release"
step checks for an existing release with `gh release view` and skips
creation if one exists. The "Dispatch website rebuild" step still
fires, so re-running the workflow always re-triggers the website
rebuild.

To reset a release after a typo in `CHANGELOG.md`:

1. Delete the release on github.com (Releases tab → click the release
   → "Delete release"). Keep the tag — see warning below.
2. Fix `CHANGELOG.md`.
3. Bump a patch version and re-tag. The workflow processes the new
   tag fresh.

**Do not** delete the tag and force-push the same tag at a different
SHA. The dispatch payload uses the tag name (`tagName`) as a stable
reference; a tag that points at a different SHA after force-push will
confuse the website's release loader and may produce stale data on
the website.

If you absolutely must reuse the same tag (e.g., a draft tag pushed
in error), delete the GitHub Release, delete the tag locally and
remotely, then push the tag fresh at the new SHA. Verify the workflow
run on the Actions tab after.
