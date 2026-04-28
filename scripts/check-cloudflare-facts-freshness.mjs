#!/usr/bin/env node
/**
 * Build-time freshness guard for src/data/cloudflare-facts.json.
 *
 * Manual-era "no silent failures" mechanism per backlog item #8.
 * Fails the build if `verifiedDate` is older than MAX_AGE_DAYS, forcing
 * either a fresh hand-verification or the Phase D automated verifier
 * before another deploy can ship.
 *
 * MAX_AGE_DAYS=90 matches the future verifier's verification cadence.
 * Tighter than the post-verifier 120-day threshold (which factors in a
 * grace window on top of the cadence) — manual processes need stronger
 * forcing functions than automated ones.
 *
 * Exit codes:
 *   0 — verifiedDate is at most MAX_AGE_DAYS old.
 *   1 — verifiedDate is missing, malformed, or older than MAX_AGE_DAYS.
 */

import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const MAX_AGE_DAYS = 90;
const DATA_PATH = resolve('src/data/cloudflare-facts.json');

function fail(message) {
  process.stderr.write(`[cloudflare-facts] ${message}\n`);
  process.exit(1);
}

const raw = await readFile(DATA_PATH, 'utf8').catch((err) =>
  fail(`cannot read ${DATA_PATH}: ${err.message}`),
);

let data;
try {
  data = JSON.parse(raw);
} catch (err) {
  fail(`invalid JSON in ${DATA_PATH}: ${err.message}`);
}

const verifiedDate = data?.verifiedDate;
if (typeof verifiedDate !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(verifiedDate)) {
  fail(`verifiedDate missing or not ISO YYYY-MM-DD: ${JSON.stringify(verifiedDate)}`);
}

const verifiedMs = Date.parse(`${verifiedDate}T00:00:00Z`);
if (Number.isNaN(verifiedMs)) {
  fail(`verifiedDate not a parseable date: ${verifiedDate}`);
}

const ageDays = Math.floor((Date.now() - verifiedMs) / (24 * 60 * 60 * 1000));
if (ageDays > MAX_AGE_DAYS) {
  fail(
    `verifiedDate ${verifiedDate} is ${ageDays} days old (max ${MAX_AGE_DAYS}). ` +
    `Re-verify Cloudflare facts at ${data.dpf?.sourceUrl ?? '<dpf source>'} ` +
    `and ${data.cwa?.sourceUrl ?? '<cwa source>'}, then update src/data/cloudflare-facts.json. ` +
    `Or land Phase D Cloudflare-fact-verifier (backlog #8).`,
  );
}

process.stdout.write(`[cloudflare-facts] verifiedDate ${verifiedDate} OK (${ageDays} days old)\n`);
