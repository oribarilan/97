/**
 * run-harness.mjs — adapters that run a trigger phrase through each
 * supported harness and return a normalized result.
 *
 * Each adapter:
 *   1. Spawns the harness CLI with the phrase, model = Haiku, output =
 *      machine-readable, and the local repo loaded as a plugin (so the
 *      bootstrap and skills come from the working tree, not a cached
 *      install).
 *   2. Runs in a fresh tmp directory so the agent cannot damage the repo
 *      if it skips the skill and goes straight to acting.
 *   3. Closes stdin (`stdio: ['ignore', 'pipe', 'pipe']`) — without this,
 *      `opencode run` and Claude/Copilot all hang waiting on stdin.
 *   4. Parses harness-specific JSONL into a normalized
 *      `{ firstTool, firstSkillName, allTools, error, raw }`.
 *
 * Authentication failures are surfaced as `{ error, skipped: true }` so
 * the runner can skip a harness with a clear warning instead of failing.
 */

import fs from 'fs';
import os from 'os';
import path from 'path';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const TIMEOUT_MS = 120_000;

/**
 * Optional per-harness env overrides loaded from
 * `scripts/test-env.local.json` (gitignored). Shape:
 *
 *   { "claude": { "ANTHROPIC_BASE_URL": "...", "ANTHROPIC_API_KEY": "..." },
 *     "copilot": { "FOO": "bar" } }
 *
 * Use cases: routing a harness through a local proxy, supplying dummy
 * credentials for offline testing, pinning a specific endpoint. The file
 * is read once at module load; missing or malformed → silently treated as
 * empty (no overrides). Vars set here override the ambient environment
 * for the spawned child only.
 */
function loadEnvOverrides() {
  const p = path.resolve(__dirname, '..', 'test-env.local.json');
  try {
    if (!fs.existsSync(p)) return {};
    const parsed = JSON.parse(fs.readFileSync(p, 'utf8'));
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}
const ENV_OVERRIDES = loadEnvOverrides();

/**
 * Generic spawn helper. Returns { stdout, stderr, exitCode, timedOut }.
 */
function runChild({ cmd, args, cwd, envOverrides = {}, timeoutMs = TIMEOUT_MS }) {
  return new Promise((resolve) => {
    const child = spawn(cmd, args, {
      cwd,
      env: { ...process.env, ...envOverrides },
      stdio: ['ignore', 'pipe', 'pipe'],
    });

    let stdout = '';
    let stderr = '';
    let timedOut = false;

    const timer = setTimeout(() => {
      timedOut = true;
      try {
        child.kill('SIGKILL');
      } catch {
        /* already dead */
      }
    }, timeoutMs);

    child.stdout.on('data', (c) => {
      stdout += c.toString();
    });
    child.stderr.on('data', (c) => {
      stderr += c.toString();
    });
    child.on('error', (err) => {
      clearTimeout(timer);
      resolve({
        stdout,
        stderr: stderr + `\n[spawn error] ${err.message}`,
        exitCode: -1,
        timedOut,
      });
    });
    child.on('close', (code) => {
      clearTimeout(timer);
      resolve({ stdout, stderr, exitCode: code ?? -1, timedOut });
    });
  });
}

/** Parse newline-delimited JSON, ignoring blank/non-JSON lines. */
function parseJsonl(stdout) {
  return stdout
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
}

/**
 * Make a fresh tmp workspace. Returns { dir, cleanup }. The runner is
 * responsible for calling cleanup() in a finally block.
 */
function makeWorkspace(label) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), `97-e2e-${label}-`));
  return {
    dir,
    cleanup: () => {
      try {
        fs.rmSync(dir, { recursive: true, force: true });
      } catch {
        /* best effort */
      }
    },
  };
}

// ---------------------------------------------------------------------------
// OpenCode adapter
// ---------------------------------------------------------------------------
// Uses the OpenCode plugin from the cache (loaded automatically because the
// 97 plugin is registered globally via `opencode plugin install`). Does NOT
// honor `--plugin-dir` the way Claude/Copilot do; OpenCode loads plugins by
// package, not by directory. So this adapter tests whatever is currently
// installed in the user's OpenCode — usually the latest published version.
//
// Note this is the one harness where the test does *not* exercise the local
// working tree's bootstrap. Acceptable for now; documented in the runner.
async function runOpenCode({ phrase, repoRoot }) {
  const ws = makeWorkspace('opencode');
  try {
    const args = [
      'run',
      '--model',
      'github-copilot/claude-haiku-4.5',
      '--format',
      'json',
      '--dir',
      ws.dir,
      '--dangerously-skip-permissions',
      phrase,
    ];
    const res = await runChild({
      cmd: 'opencode',
      args,
      cwd: repoRoot,
      envOverrides: ENV_OVERRIDES.opencode,
    });

    if (res.timedOut)
      return {
        firstTool: null,
        firstSkillName: null,
        allTools: [],
        error: `timeout after ${TIMEOUT_MS}ms`,
        raw: res.stdout,
      };

    const events = parseJsonl(res.stdout);
    const tools = events
      .filter((e) => e.type === 'tool_use' && e.part?.tool)
      .map((e) => ({
        tool: e.part.tool,
        skillName: e.part.tool === 'skill' ? (e.part.state?.input?.name ?? null) : null,
      }));

    return {
      firstTool: tools[0]?.tool ?? null,
      firstSkillName: tools[0]?.skillName ?? null,
      allTools: tools,
      error:
        res.exitCode !== 0 ? `opencode exited ${res.exitCode}: ${res.stderr.slice(0, 200)}` : null,
      raw: res.stdout,
    };
  } finally {
    ws.cleanup();
  }
}

// ---------------------------------------------------------------------------
// Claude Code adapter
// ---------------------------------------------------------------------------
// `--plugin-dir <repoRoot>` loads the local 97 plugin for this session only;
// `--output-format=stream-json` (with `--verbose`) emits one JSON event per
// line. SessionStart hook fires automatically and delivers the bootstrap.
// Tool calls appear as `assistant` messages whose content array contains
// `tool_use` blocks.
//
// The CLI requires interactive auth; if the user is not logged in we get
// "Not logged in · Please run /login" and we return { skipped: true } so
// the runner can warn instead of failing.
async function runClaudeCode({ phrase, repoRoot }) {
  const ws = makeWorkspace('claude');
  try {
    const args = [
      '--plugin-dir',
      repoRoot,
      '--model',
      'haiku',
      '--output-format',
      'stream-json',
      '--verbose',
      '--dangerously-skip-permissions',
      '-p',
      phrase,
    ];
    const res = await runChild({
      cmd: 'claude',
      args,
      cwd: ws.dir,
      envOverrides: ENV_OVERRIDES.claude,
    });

    if (res.timedOut)
      return {
        firstTool: null,
        firstSkillName: null,
        allTools: [],
        error: `timeout after ${TIMEOUT_MS}ms`,
        raw: res.stdout,
      };

    const events = parseJsonl(res.stdout);

    // Auth check: a synthetic assistant message of "Not logged in · ..."
    // means the CLI accepted everything but couldn't reach the API.
    const authError = events.find(
      (e) => e.type === 'assistant' && e.error === 'authentication_failed'
    );
    if (authError) {
      return {
        firstTool: null,
        firstSkillName: null,
        allTools: [],
        error: 'claude not authenticated — run `claude /login` once interactively',
        skipped: true,
        raw: res.stdout,
      };
    }

    // Upstream/proxy errors (custom ANTHROPIC_BASE_URL, beta-header
    // mismatch, model not available, etc.) surface as a `result` event
    // with `is_error: true`. Treat as skipped with the real reason so
    // users running through a custom endpoint see a helpful message
    // instead of a cryptic exit-code failure.
    const apiError = events.find((e) => e.type === 'result' && e.is_error === true);
    if (apiError) {
      const reason = String(apiError.result || 'unknown API error').slice(0, 200);
      return {
        firstTool: null,
        firstSkillName: null,
        allTools: [],
        error: `claude API error — ${reason}`,
        skipped: true,
        raw: res.stdout,
      };
    }

    // Top-level tool calls appear inside assistant.message.content as
    // `tool_use` blocks. The `name` is the tool name; for the Skill tool
    // the skill's name is in `input.skill`.
    const tools = [];
    for (const e of events) {
      if (e.type !== 'assistant' || !e.message?.content) continue;
      for (const block of e.message.content) {
        if (block.type === 'tool_use') {
          tools.push({
            tool: block.name,
            skillName: block.name === 'Skill' ? (block.input?.skill ?? null) : null,
          });
        }
      }
    }

    return {
      firstTool: tools[0]?.tool ?? null,
      firstSkillName: tools[0]?.skillName ?? null,
      allTools: tools,
      error:
        res.exitCode !== 0 ? `claude exited ${res.exitCode}: ${res.stderr.slice(0, 200)}` : null,
      raw: res.stdout,
    };
  } finally {
    ws.cleanup();
  }
}

// ---------------------------------------------------------------------------
// Copilot CLI adapter
// ---------------------------------------------------------------------------
// `--plugin-dir <repoRoot>` loads local 97; `--output-format=json` emits
// JSONL. Tool calls appear as `tool.execution_start` events with
// `data.toolName` and `data.arguments`. For the skill tool, the invoked
// skill is in `data.arguments.skill`.
//
// Note nested tool calls (a sub-tool fired inside the skill loader) carry a
// `parentId` pointing at the parent's `toolCallId`. We only count top-level
// tool calls — those whose parentId is NOT a previously seen toolCallId.
async function runCopilotCli({ phrase, repoRoot }) {
  const ws = makeWorkspace('copilot');
  try {
    const args = [
      '--plugin-dir',
      repoRoot,
      '--model',
      'claude-haiku-4.5',
      '--output-format',
      'json',
      '--allow-all-tools',
      '-p',
      phrase,
    ];
    const res = await runChild({
      cmd: 'copilot',
      args,
      cwd: ws.dir,
      envOverrides: ENV_OVERRIDES.copilot,
    });

    if (res.timedOut)
      return {
        firstTool: null,
        firstSkillName: null,
        allTools: [],
        error: `timeout after ${TIMEOUT_MS}ms`,
        raw: res.stdout,
      };

    const events = parseJsonl(res.stdout);

    // Auth check: Copilot signals "not logged in" via a session.error or
    // similar. If we see no tool events at all and no successful turn,
    // treat as a probable auth/setup issue.
    const hasAuthError = events.some(
      (e) =>
        (e.type === 'session.error' || e.type === 'error') &&
        /not logged in|unauthor|authent/i.test(JSON.stringify(e.data ?? e))
    );
    if (hasAuthError) {
      return {
        firstTool: null,
        firstSkillName: null,
        allTools: [],
        error: 'copilot not authenticated — run `copilot login` once interactively',
        skipped: true,
        raw: res.stdout,
      };
    }

    // Walk tool.execution_start events. Track toolCallIds to identify
    // top-level calls (parentId not pointing at a prior tool call).
    const toolStarts = events.filter((e) => e.type === 'tool.execution_start' && e.data?.toolName);
    const seenIds = new Set();
    const tools = [];
    for (const e of toolStarts) {
      const id = e.data.toolCallId;
      const parent = e.parentId;
      const isTopLevel = !seenIds.has(parent);
      seenIds.add(id);
      if (!isTopLevel) continue;
      tools.push({
        tool: e.data.toolName,
        skillName: e.data.toolName === 'skill' ? (e.data.arguments?.skill ?? null) : null,
      });
    }

    return {
      firstTool: tools[0]?.tool ?? null,
      firstSkillName: tools[0]?.skillName ?? null,
      allTools: tools,
      error:
        res.exitCode !== 0 ? `copilot exited ${res.exitCode}: ${res.stderr.slice(0, 200)}` : null,
      raw: res.stdout,
    };
  } finally {
    ws.cleanup();
  }
}

// ---------------------------------------------------------------------------
// Registry — keep names consistent with npm script suffixes.
// ---------------------------------------------------------------------------
export const HARNESSES = {
  opencode: { label: 'OpenCode', run: runOpenCode },
  claude: { label: 'Claude Code', run: runClaudeCode },
  copilot: { label: 'Copilot CLI', run: runCopilotCli },
};

/**
 * Pass criteria: first tool call must be the skill tool, AND the skill
 * invoked must match `expectedSkill`. Anything else (different skill, no
 * tool call, error) is a fail.
 *
 * Each harness names the skill tool slightly differently:
 *   - opencode: `skill`
 *   - claude:   `Skill`
 *   - copilot:  `skill`
 *
 * We accept either casing.
 */
export function isPass(result, expectedSkill) {
  if (result.error || result.skipped) return false;
  if (!result.firstTool) return false;
  if (result.firstTool.toLowerCase() !== 'skill') return false;
  return result.firstSkillName === expectedSkill;
}
