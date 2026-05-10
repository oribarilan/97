#!/usr/bin/env node
/**
 * test-trigger-force.mjs — guards against using-97 bootstrap losing imperative force.
 *
 * Run manually:   npm run test:trigger-force
 *
 * NOT part of `npm test` by default. This is a content-shape regression test:
 * it asserts that skills/using-97/SKILL.md (the bootstrap injected into every
 * session by .opencode/plugins/97.js and hooks/session-start.mjs) carries the
 * language patterns that make agents reliably invoke the `Skill` tool when a
 * trigger word is used.
 *
 * Pair with `test:trigger-e2e` for live agent behavior verification.
 *
 * Each check is intentionally semantic rather than exact-phrase, so legitimate
 * rewording passes while a softening regression fails. If a check feels wrong
 * for a given edit, change the check deliberately — don't dilute the language
 * to fit the old check.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const skillPath = path.join(root, 'skills/using-97/SKILL.md');

if (!fs.existsSync(skillPath)) {
  console.error(`test-trigger-force FAIL: missing ${skillPath}`);
  process.exit(1);
}

const raw = fs.readFileSync(skillPath, 'utf8');
const fmMatch = raw.match(/^---\r?\n[\s\S]*?\r?\n---\r?\n([\s\S]*)$/);
const body = fmMatch ? fmMatch[1] : raw;
const lower = body.toLowerCase();

const triggerMapIdx = body.indexOf('## Trigger Map');
if (triggerMapIdx === -1) {
  console.error('test-trigger-force FAIL: "## Trigger Map" header missing');
  process.exit(1);
}
const preTriggerMap = body.slice(0, triggerMapIdx);

const checks = [
  {
    name: 'imperative banner before trigger map',
    test: () =>
      /important|critical|mandatory|do not skip|read first/i.test(preTriggerMap) &&
      /\*\*[^*]*(important|critical|mandatory|must)[^*]*\*\*/i.test(preTriggerMap),
    hint: 'Add a bolded imperative banner (e.g. **IMPORTANT** or **CRITICAL**) above ## Trigger Map.',
  },
  {
    name: 'MUST appears as directive at least twice',
    test: () => (body.match(/\bMUST\b/g) || []).length >= 2,
    hint: 'Use uppercase MUST in at least two directive sentences (e.g. "you MUST invoke the skill before responding").',
  },
  {
    name: 'explicit "before any response/action" rule',
    test: () =>
      /before\s+(any\s+)?(response|reply|answer|action|acting|you\s+(act|respond|reply|answer))/i.test(
        body
      ),
    hint: 'State explicitly: "Invoke the matching skill BEFORE any response or action."',
  },
  {
    name: 'trigger keyword bridge present',
    test: () => ['refactor', 'clean', 'test', 'commit'].every((kw) => lower.includes(kw)),
    hint: 'List the literal user-words that map to skills (refactor → before-you-refactor, clean code → clean-code, test → testing-discipline, commit → self-review).',
  },
  {
    name: 'red flags catch pre-action rationalization',
    test: () => {
      if (!/red\s*flags?/i.test(body)) return false;
      return /just\s+(do|write|fix|edit)|small\s+enough|too\s+(simple|small|trivial)|skip\s+(the\s+)?skill|don'?t\s+need/i.test(
        body
      );
    },
    hint: 'Add a Red Flags row that catches "this change is too small to invoke a skill" / "I\'ll just do it" rationalizations.',
  },
  {
    name: 'invocation mechanics appear early',
    test: () => {
      const earlyHalf = body.slice(0, triggerMapIdx + Math.floor(body.length * 0.4));
      return /skill\s+tool|invoke[^.]{0,40}(skill|tool)|bare\s+(skill\s+)?name/i.test(earlyHalf);
    },
    hint: 'State "Use the Skill tool with the bare skill name" within the first ~40% of the file, not only in the appendix.',
  },
  {
    name: 'no excessive softening in action section',
    test: () => {
      const actionSection = preTriggerMap + body.slice(triggerMapIdx, triggerMapIdx + 800);
      const hedges =
        actionSection.match(
          /\b(maybe|perhaps|consider|might want to|if you feel|optionally)\b/gi
        ) || [];
      return hedges.length <= 1;
    },
    hint: 'Remove hedge words (maybe, perhaps, consider, might want to, optionally) from the imperative and trigger-map sections.',
  },
];

const failures = checks.filter((c) => !c.test());

if (failures.length > 0) {
  console.error('test-trigger-force FAIL — using-97 SKILL.md lacks imperative force:\n');
  for (const { name, hint } of failures) {
    console.error(`  ✗ ${name}`);
    console.error(`      → ${hint}\n`);
  }
  console.error(
    `${failures.length} of ${checks.length} checks failed. Strengthen skills/using-97/SKILL.md and re-run.\n`
  );
  process.exit(1);
}

console.log(
  `test-trigger-force OK — using-97 bootstrap carries imperative force (${checks.length}/${checks.length}).`
);
