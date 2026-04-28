/**
 * Manual augmentation of the wrangler-generated `Env` interface.
 *
 * Two bindings live here that `wrangler types` does not yet emit
 * automatically:
 *
 *   - `CONTACT_RATELIMIT`: declared in wrangler.jsonc under
 *     `ratelimit[]`. The wrangler-types generator (as of wrangler
 *     4.84.1) does not yet enumerate top-level `ratelimit` bindings
 *     into the Env interface, even though the runtime `RateLimit`
 *     type is shipped in worker-configuration.d.ts. Re-check on each
 *     wrangler bump; this declaration becomes redundant the moment
 *     the generator catches up.
 *
 *   - `TURNSTILE_SECRET_KEY`: a Worker secret set via
 *     `wrangler secret put TURNSTILE_SECRET_KEY --env <env>`. Wrangler
 *     types only enumerates secrets that are CURRENTLY SET on a
 *     deployed Worker; we declare it here so the Worker code
 *     compiles before the secret has been applied to either env.
 *     The secret value never enters the repo.
 *
 * Both fields are required at runtime; the form Worker is a hard
 * dependency on each.
 */

declare global {
  interface Env {
    CONTACT_RATELIMIT: RateLimit;
    TURNSTILE_SECRET_KEY: string;
  }
}

export {};
