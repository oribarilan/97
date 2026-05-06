#!/usr/bin/env node
/**
 * test-trigger-e2e.mjs — live behavioral test of the using-97 bootstrap
 * across all supported harnesses (OpenCode, Claude Code, Copilot CLI).
 *
 * Run manually:
 *   npm run test:trigger-e2e            # all harnesses
 *   npm run test:trigger-e2e:opencode   # one harness
 *   npm run test:trigger-e2e:claude
 *   npm run test:trigger-e2e:copilot
 *
 * Or directly:
 *   node scripts/test-trigger-e2e.mjs --harness=opencode,copilot
 *
 * What it does
 * ------------
 * For each (harness × case) pair, spawns the harness CLI with the trigger
 * phrase and asserts the agent's first tool call is `skill(<expectedSkill>)`.
 * The bootstrap is loaded from the local working tree (Claude/Copilot via
 * `--plugin-dir`) or from the user's installed plugin (OpenCode), and the
 * model is pinned to Haiku.
 *
 * If a harness is not authenticated (e.g. Claude Code without `/login`),
 * the cases for that harness are SKIPPED with a warning, not failed.
 *
 * Pass criteria
 * -------------
 * The first tool the agent invokes must be `skill` (case-insensitive),
 * with the matching expected skill name. Anything else is a failure —
 * including invoking a different skill, hitting timeout, or going
 * straight to read/edit/bash before the skill.
 *
 * Cost
 * ----
 * ~6 cases × ~3 harnesses × ~20s ≈ 6 minutes. Manually triggered, not in CI.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import { HARNESSES, isPass } from './lib/run-harness.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const fixturesPath = path.join(__dirname, 'trigger-fixtures.json');

if (!fs.existsSync(fixturesPath)) {
  console.error(`test-trigger-e2e FAIL: missing ${fixturesPath}`);
  process.exit(1);
}

const fixtures = JSON.parse(fs.readFileSync(fixturesPath, 'utf8'));
const { cases } = fixtures;
if (!Array.isArray(cases) || cases.length === 0) {
  console.error('test-trigger-e2e FAIL: fixtures missing `cases`');
  process.exit(1);
}

// --------------------------------------------------------------------------
// Argument parsing: --harness=a,b or env HARNESS=a,b. Default = all.
// --------------------------------------------------------------------------
function parseHarnessArg() {
  const argv = process.argv.slice(2);
  const flag = argv.find((a) => a.startsWith('--harness='));
  const raw = flag ? flag.split('=')[1] : process.env.HARNESS;
  if (!raw) return Object.keys(HARNESSES);
  const requested = raw
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  const unknown = requested.filter((h) => !HARNESSES[h]);
  if (unknown.length) {
    console.error(`test-trigger-e2e FAIL: unknown harness(es): ${unknown.join(', ')}`);
    console.error(`Valid: ${Object.keys(HARNESSES).join(', ')}`);
    process.exit(1);
  }
  return requested;
}

const selected = parseHarnessArg();

console.log(
  `test-trigger-e2e — ${cases.length} cases × ${selected.length} harness(es): ${selected.join(', ')}\n`
);

// --------------------------------------------------------------------------
// Run.
// --------------------------------------------------------------------------
const summary = { pass: 0, fail: 0, skip: 0 };
const failures = [];
const skips = []; // [{ harness, reason }]

for (const harnessKey of selected) {
  const { label, run } = HARNESSES[harnessKey];
  console.log(`── ${label} (${harnessKey}) ──`);

  let harnessSkippedReason = null;

  for (let i = 0; i < cases.length; i++) {
    const c = cases[i];

    // If a previous case in this harness reported "skipped" (e.g. auth
    // missing), don't bother running the rest — they will all fail the
    // same way. Mark them as skipped and move on.
    if (harnessSkippedReason) {
      summary.skip++;
      console.log(`  [${i + 1}/${cases.length}] ⊘ skipped (${harnessSkippedReason})`);
      continue;
    }

    const started = Date.now();
    process.stdout.write(`  [${i + 1}/${cases.length}] "${c.phrase.slice(0, 56)}..." `);
    const result = await run({ phrase: c.phrase, repoRoot: root, idx: i });
    const elapsed = ((Date.now() - started) / 1000).toFixed(1);

    if (result.skipped) {
      // First skip in this harness: latch the reason and mark this case
      // skipped. All subsequent cases for the same harness will skip too.
      harnessSkippedReason = result.error;
      skips.push({ harness: harnessKey, reason: result.error });
      summary.skip++;
      console.log(`⊘ (${elapsed}s, ${result.error})`);
      continue;
    }

    if (isPass(result, c.expectedSkill)) {
      summary.pass++;
      console.log(`✓ (${elapsed}s)`);
    } else {
      summary.fail++;
      const detail = result.error
        ? result.error
        : `first=${result.firstTool ?? 'none'}${result.firstSkillName ? `(${result.firstSkillName})` : ''}`;
      console.log(`✗ (${elapsed}s, ${detail})`);
      failures.push({ harness: harnessKey, case: c, result });
    }
  }
  console.log('');
}

// --------------------------------------------------------------------------
// Report.
// --------------------------------------------------------------------------
const total = summary.pass + summary.fail + summary.skip;
console.log(
  `Summary: ${summary.pass}/${total} passed, ${summary.fail} failed, ${summary.skip} skipped\n`
);

if (skips.length > 0) {
  // Deduplicate by harness — only show one warning per skipped harness.
  const seen = new Set();
  console.log('Skipped harnesses:');
  for (const s of skips) {
    if (seen.has(s.harness)) continue;
    seen.add(s.harness);
    console.log(`  ⊘ ${s.harness}: ${s.reason}`);
  }
  console.log('');
}

if (failures.length > 0) {
  console.error('Failures:');
  for (const f of failures) {
    console.error(`  ✗ [${f.harness}] expected skill: ${f.case.expectedSkill}`);
    console.error(`      phrase:        "${f.case.phrase}"`);
    if (f.result.error) {
      console.error(`      error:         ${f.result.error}`);
    } else {
      console.error(`      first tool:    ${f.result.firstTool ?? '(none)'}`);
      console.error(`      first skill:   ${f.result.firstSkillName ?? '(n/a)'}`);
      const toolSummary = f.result.allTools
        .slice(0, 5)
        .map((t) => (t.tool === 'skill' || t.tool === 'Skill' ? `skill(${t.skillName})` : t.tool))
        .join(' → ');
      console.error(`      tool sequence: ${toolSummary || '(no tool calls)'}`);
    }
    console.error('');
  }
  process.exit(1);
}

console.log(
  `test-trigger-e2e OK — every selected harness invoked the correct skill first on every case.`
);
