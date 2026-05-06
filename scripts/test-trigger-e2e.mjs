#!/usr/bin/env node
/**
 * test-trigger-e2e.mjs — live behavioral test of the using-97 bootstrap.
 *
 * Run manually:   npm run test:trigger-e2e
 *
 * What it does
 * ------------
 * For each case in scripts/trigger-fixtures.json, spawns `opencode run` with
 * the trigger phrase and the configured model (Haiku by default). Parses the
 * streamed JSON events, finds the agent's first `tool_use`, and asserts:
 *
 *   1. The first tool call is `skill` (not `read`, `edit`, `bash`, etc.).
 *   2. The skill invoked is exactly `expectedSkill`.
 *
 * If the bootstrap is doing its job, Haiku reliably invokes the matching 97
 * skill before taking any other action. If the bootstrap is too soft, Haiku
 * skips the skill and starts editing/reading instead — which is precisely
 * the regression this test catches.
 *
 * Why Haiku
 * ---------
 * Cheapest model. If Haiku triggers correctly, stronger models almost
 * certainly will. If Haiku skips, that's a bootstrap problem worth fixing,
 * not a model-capacity problem.
 *
 * Why first-tool-call strictness
 * ------------------------------
 * The behavioral failure mode is "agent acts before invoking skill". A
 * permissive check (e.g. "skill is invoked anywhere in the session") would
 * mask exactly that failure: an agent that edits a file, then invokes the
 * skill afterward as an afterthought, has already done the wrong thing.
 *
 * Isolation
 * ---------
 * Each case runs in a fresh tmp directory via `--dir`. Even if the agent
 * skips the skill and tries to edit something, there is nothing in that
 * directory to edit, so the real repo is safe.
 *
 * Cost
 * -----
 * ~5 cases × Haiku ≈ a few cents per run. Manually triggered, not in CI.
 */

import fs from 'fs';
import os from 'os';
import path from 'path';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const fixturesPath = path.join(__dirname, 'trigger-fixtures.json');

if (!fs.existsSync(fixturesPath)) {
  console.error(`test-trigger-e2e FAIL: missing ${fixturesPath}`);
  process.exit(1);
}

const fixtures = JSON.parse(fs.readFileSync(fixturesPath, 'utf8'));
const { model, cases } = fixtures;

if (!model || !Array.isArray(cases) || cases.length === 0) {
  console.error('test-trigger-e2e FAIL: fixtures missing `model` or `cases`');
  process.exit(1);
}

// Per-case timeout. Haiku's interaction is usually <10s, but each `opencode
// run` has ~5–10s of process/server startup overhead, and slow networks add
// more. 120s is conservative — a real regression (agent hanging or
// over-thinking) will still trip it.
const CASE_TIMEOUT_MS = 120_000;

/**
 * Run one trigger phrase through `opencode run` and capture the first
 * tool_use event. Returns { firstTool, firstSkillName, allTools, raw, error }.
 */
function runCase({ phrase, expectedSkill }, idx) {
  return new Promise((resolve) => {
    // Each case gets its own scratch directory so the agent can't damage
    // anything if it skips the skill and tries to act.
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), `97-trigger-e2e-${idx}-`));

    const args = [
      'run',
      '--model',
      model,
      '--format',
      'json',
      '--dir',
      tmpDir,
      '--dangerously-skip-permissions',
      phrase,
    ];

    const child = spawn('opencode', args, {
      cwd: root,
      env: { ...process.env },
      // Critical: explicitly close stdin. Default spawn() leaves stdin as an
      // open pipe; `opencode run` then appears to wait on it indefinitely
      // (manifests as a hang to timeout). With 'ignore', stdin is /dev/null
      // and the child sees immediate EOF.
      stdio: ['ignore', 'pipe', 'pipe'],
    });

    let stdout = '';
    let stderr = '';
    let resolved = false;

    const finish = (result) => {
      if (resolved) return;
      resolved = true;
      try {
        fs.rmSync(tmpDir, { recursive: true, force: true });
      } catch {
        /* ignore cleanup errors */
      }
      resolve(result);
    };

    const timer = setTimeout(() => {
      try {
        child.kill('SIGKILL');
      } catch {
        /* already dead */
      }
      finish({
        phrase,
        expectedSkill,
        firstTool: null,
        firstSkillName: null,
        allTools: [],
        error: `timeout after ${CASE_TIMEOUT_MS}ms`,
        raw: stdout,
      });
    }, CASE_TIMEOUT_MS);

    child.stdout.on('data', (chunk) => {
      stdout += chunk.toString();
    });
    child.stderr.on('data', (chunk) => {
      stderr += chunk.toString();
    });

    child.on('error', (err) => {
      clearTimeout(timer);
      finish({
        phrase,
        expectedSkill,
        firstTool: null,
        firstSkillName: null,
        allTools: [],
        error: `spawn error: ${err.message}`,
        raw: stdout,
      });
    });

    child.on('close', (code) => {
      clearTimeout(timer);

      // Parse newline-delimited JSON events. opencode-run emits one event
      // per line; tool calls show up as { type: "tool_use", part: { tool, ... } }.
      const events = stdout
        .split('\n')
        .map((line) => line.trim())
        .filter((line) => line.startsWith('{'))
        .map((line) => {
          try {
            return JSON.parse(line);
          } catch {
            return null;
          }
        })
        .filter(Boolean);

      const toolEvents = events.filter((e) => e.type === 'tool_use' && e.part?.tool);
      const allTools = toolEvents.map((e) => ({
        tool: e.part.tool,
        skillName: e.part.tool === 'skill' ? (e.part.state?.input?.name ?? null) : null,
      }));
      const firstTool = allTools[0]?.tool ?? null;
      const firstSkillName = allTools[0]?.skillName ?? null;

      finish({
        phrase,
        expectedSkill,
        firstTool,
        firstSkillName,
        allTools,
        error: code !== 0 ? `opencode exited ${code}: ${stderr.slice(0, 200)}` : null,
        raw: stdout,
      });
    });
  });
}

console.log(`test-trigger-e2e — running ${cases.length} cases against ${model}\n`);

let pass = 0;
let fail = 0;
const failures = [];

for (let i = 0; i < cases.length; i++) {
  const c = cases[i];
  const started = Date.now();
  process.stdout.write(`  [${i + 1}/${cases.length}] "${c.phrase.slice(0, 60)}..." `);
  const result = await runCase(c, i);
  const elapsed = ((Date.now() - started) / 1000).toFixed(1);

  // A pass requires: first tool call was `skill`, AND it invoked the
  // expected skill name. Anything else is a fail — including agent error,
  // timeout, or invoking a different skill.
  const ok =
    !result.error && result.firstTool === 'skill' && result.firstSkillName === c.expectedSkill;

  if (ok) {
    pass++;
    console.log(`✓ (${elapsed}s)`);
  } else {
    fail++;
    const detail = result.error
      ? result.error
      : `first=${result.firstTool ?? 'none'}${result.firstSkillName ? `(${result.firstSkillName})` : ''}`;
    console.log(`✗ (${elapsed}s, ${detail})`);
    failures.push(result);
  }
}

console.log('');

if (fail > 0) {
  console.error(`test-trigger-e2e FAIL — ${fail} of ${cases.length} cases regressed:\n`);
  for (const f of failures) {
    console.error(`  ✗ expected skill: ${f.expectedSkill}`);
    console.error(`      phrase:        "${f.phrase}"`);
    if (f.error) {
      console.error(`      error:         ${f.error}`);
    } else {
      console.error(`      first tool:    ${f.firstTool ?? '(none)'}`);
      console.error(`      first skill:   ${f.firstSkillName ?? '(n/a)'}`);
      const toolSummary = f.allTools
        .slice(0, 5)
        .map((t) => (t.tool === 'skill' ? `skill(${t.skillName})` : t.tool))
        .join(' → ');
      console.error(`      tool sequence: ${toolSummary || '(no tool calls)'}`);
    }
    console.error('');
  }
  process.exit(1);
}

console.log(
  `test-trigger-e2e OK — ${pass}/${cases.length} cases triggered the correct skill first.`
);
