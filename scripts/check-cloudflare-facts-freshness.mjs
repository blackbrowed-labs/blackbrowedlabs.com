#!/usr/bin/env node
/**
 * Build-time freshness guard for src/data/cloudflare-facts.json.
 *
 * Verifier-era "no silent failures" mechanism per backlog item #8 and the
 * Phase D verifier design at plans/active/pass-2/g-d-2/spec.md.
 *
 * Reads `_meta.last_check_attempt` (the timestamp of the most recent
 * verifier run, success OR failure). Fails the build if it's older than
 * `_meta.freshness_threshold_days` (default 30). The threshold is
 * tightened from the Phase B.3.2.a manual-era 90 days to 30 days now
 * that an automated weekly verifier runs — 30 days is ~4 missed weekly
 * runs, well past "transient cron blip".
 *
 * This is the detection mechanism for failure modes #1 (workflow doesn't
 * run) and #10 (cron silently disabled by GHA inactive-repo policy).
 *
 * Exit codes:
 *   0 — last_check_attempt is at most threshold days old.
 *   1 — _meta block missing/malformed, or last_check_attempt too old.
 */

import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const DATA_PATH = resolve('src/data/cloudflare-facts.json');
const DEFAULT_THRESHOLD_DAYS = 30;

function fail(message) {
  process.stderr.write(`[freshness-gate] ${message}\n`);
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

if (!data || typeof data !== 'object' || !data._meta || typeof data._meta !== 'object') {
  fail(`missing or malformed _meta block in ${DATA_PATH}`);
}

const lastCheckAttempt = data._meta.last_check_attempt;
if (typeof lastCheckAttempt !== 'string') {
  fail(`_meta.last_check_attempt missing or not a string: ${JSON.stringify(lastCheckAttempt)}`);
}

const lastCheckMs = Date.parse(lastCheckAttempt);
if (Number.isNaN(lastCheckMs)) {
  fail(`_meta.last_check_attempt not a parseable ISO datetime: ${lastCheckAttempt}`);
}

const thresholdDays =
  typeof data._meta.freshness_threshold_days === 'number'
    ? data._meta.freshness_threshold_days
    : DEFAULT_THRESHOLD_DAYS;

const ageDays = (Date.now() - lastCheckMs) / (24 * 60 * 60 * 1000);
const ageDaysRounded = Math.floor(ageDays);

if (ageDays > thresholdDays) {
  fail(
    `BLOCKING BUILD: cloudflare-facts.json _meta.last_check_attempt is ${ageDays.toFixed(1)} days old (threshold: ${thresholdDays} days).\n` +
      `  This is verifier failure mode #1 (workflow doesn't run) or #10 (cron silently disabled).\n` +
      `  Fix: trigger verify-cloudflare-facts.yml manually via GitHub Actions UI workflow_dispatch.\n` +
      `  Or: investigate why the weekly cron isn't firing (GHA inactive-repo policy?).`,
  );
}

process.stdout.write(
  `[freshness-gate] OK — _meta.last_check_attempt ${lastCheckAttempt} is ${ageDaysRounded} days old (threshold: ${thresholdDays}).\n`,
);
