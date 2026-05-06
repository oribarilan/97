#!/usr/bin/env node
/**
 * smoke-load.mjs — verifies plugin loads and v0.2.0 invariants hold.
 *
 * Checks:
 *   - .opencode/plugins/97.js loads, exports NinetySevenPlugin, registers skills/
 *   - .claude-plugin/plugin.json and marketplace.json JSON-parse
 *   - marketplace.json names the marketplace `97-marketplace` and lists plugin `97`
 *   - Versions match across package.json, plugin.json, marketplace.json[plugins[0]]
 *   - AGENTS.md exists (single source of truth for contributor docs)
 *   - hooks/hooks.json JSON-parses and invokes hooks/session-start.mjs via node
 *   - hooks/session-start.mjs runs and emits valid JSON with the using-97
 *     bootstrap embedded in the expected harness-shaped envelope
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const pluginPath = path.join(root, '.opencode/plugins/97.js');

// =============================================================================
// Error handling & Validation
// =============================================================================

function die(msg) {
  console.error('smoke-load FAIL:', msg);
  process.exit(1);
}

/**
 * Validator bundles file I/O, existence checks, and assertions.
 * Each method either succeeds (returns data) or calls die().
 */
class Validator {
  loadJSON(filePath, description) {
    try {
      return JSON.parse(fs.readFileSync(filePath, 'utf8'));
    } catch (e) {
      die(`${description} does not parse: ${e.message}`);
    }
  }

  fileExists(filePath, description) {
    if (!fs.existsSync(filePath)) {
      die(`${description} missing`);
    }
  }

  directory(dirPath, description) {
    if (!fs.existsSync(dirPath) || !fs.statSync(dirPath).isDirectory()) {
      die(`${description} does not exist or is not a directory: ${dirPath}`);
    }
  }

  fieldEquals(obj, field, expected, context) {
    const actual = obj[field];
    if (actual !== expected) {
      die(`${context} field must be "${expected}", got "${actual}"`);
    }
  }

  isFunction(obj, field, context) {
    if (typeof obj[field] !== 'function') {
      die(`${context} ${field} is not a function`);
    }
  }

  versionsMatch(versions) {
    const distinctVersions = new Set(Object.values(versions));
    if (distinctVersions.size !== 1) {
      const lines = Object.entries(versions)
        .map(([k, v]) => `    ${k} = ${v}`)
        .join('\n');
      die(`manifest versions disagree:\n${lines}`);
    }
  }

  bootstrapInjected(userMsg, marker) {
    if (!Array.isArray(userMsg.parts) || userMsg.parts.length !== 2) {
      die(
        `bootstrap transform did not prepend a part: expected 2 parts, got ${userMsg.parts?.length}`
      );
    }
    const injected = userMsg.parts[0];
    if (injected.type !== 'text') {
      die(`injected part has wrong type: expected "text", got "${injected.type}"`);
    }
    if (!injected.text || !injected.text.includes(marker)) {
      die(`injected bootstrap missing stable marker "${marker}"`);
    }
    if (!injected.text.includes('OpenCode equivalents')) {
      die('injected bootstrap missing OpenCode tool-mapping appendix');
    }
  }

  transformIdempotent(userMsg, expectedPartCount) {
    if (userMsg.parts.length !== expectedPartCount) {
      die(
        `bootstrap transform is not idempotent: a second call grew parts to ${userMsg.parts.length}`
      );
    }
  }
}

const v = new Validator();

// =============================================================================
// PHASE 1: OpenCode plugin loads and registers skills/
// =============================================================================

async function validatePluginLoading() {
  const mod = await import(pathToFileURL(pluginPath).href);
  const factory = mod.NinetySevenPlugin;
  if (typeof factory !== 'function') {
    die('NinetySevenPlugin named export is not a function');
  }

  const hooks = await factory({ client: {}, directory: root });
  if (!hooks || typeof hooks !== 'object') {
    die('plugin factory did not return a hooks object');
  }
  v.isFunction(hooks, 'config', 'plugin');
  v.isFunction(hooks, 'experimental.chat.messages.transform', 'plugin');

  return hooks;
}

async function validatePluginConfig(hooks) {
  const fakeConfig = {};
  await hooks.config(fakeConfig);
  const paths = fakeConfig.skills?.paths;
  if (!Array.isArray(paths) || paths.length === 0) {
    die('config hook did not register any skills paths');
  }
  const skillsPath = paths[paths.length - 1];
  v.directory(skillsPath, 'registered skills path');

  // Idempotency: run the hook again, length must not grow.
  await hooks.config(fakeConfig);
  if (fakeConfig.skills.paths.length !== paths.length) {
    die('config hook is not idempotent');
  }

  return skillsPath;
}

async function validateBootstrapTransform(hooks) {
  // Bootstrap transform: must be a no-op when no first user message exists.
  await hooks['experimental.chat.messages.transform']({}, { messages: [] });

  // Bootstrap transform: must actually inject bootstrap content into the
  // first user message. The empty-messages path above only proves "doesn't
  // crash"; this proves "the most consequential thing the plugin does
  // actually happens." Stable marker: the literal "Trigger Map" heading
  // from skills/using-97/SKILL.md, which survives wrapper changes.
  const STABLE_MARKER = 'Trigger Map';
  const fakeMsgs = {
    messages: [
      {
        info: { role: 'user' },
        parts: [{ type: 'text', text: 'hello' }],
      },
    ],
  };
  await hooks['experimental.chat.messages.transform']({}, fakeMsgs);
  const userMsg = fakeMsgs.messages[0];
  v.bootstrapInjected(userMsg, STABLE_MARKER);

  // Idempotency: a second transform call must not add a third part.
  await hooks['experimental.chat.messages.transform']({}, fakeMsgs);
  v.transformIdempotent(userMsg, 2);
}

const hooks = await validatePluginLoading();
const skillsPath = await validatePluginConfig(hooks);
await validateBootstrapTransform(hooks);

// =============================================================================
// PHASE 2: Manifest files parse and versions match
// =============================================================================

async function validateManifests() {
  const pkgPath = path.join(root, 'package.json');
  const pluginManifestPath = path.join(root, '.claude-plugin/plugin.json');
  const marketplacePath = path.join(root, '.claude-plugin/marketplace.json');

  v.fileExists(pkgPath, 'package.json');
  v.fileExists(pluginManifestPath, '.claude-plugin/plugin.json');
  v.fileExists(marketplacePath, '.claude-plugin/marketplace.json');

  const pkg = v.loadJSON(pkgPath, 'package.json');
  const pluginManifest = v.loadJSON(pluginManifestPath, '.claude-plugin/plugin.json');
  const marketplace = v.loadJSON(marketplacePath, '.claude-plugin/marketplace.json');

  // Validate marketplace shape.
  v.fieldEquals(marketplace, 'name', '97-marketplace', 'marketplace.json');
  if (!Array.isArray(marketplace.plugins) || marketplace.plugins.length === 0) {
    die('marketplace.json must list at least one plugin in plugins[]');
  }
  const marketplacePluginEntry = marketplace.plugins[0];

  // Validate plugin names match.
  v.fieldEquals(marketplacePluginEntry, 'name', '97', 'marketplace.plugins[0]');
  v.fieldEquals(pluginManifest, 'name', '97', 'plugin.json');

  // Validate versions match across all manifests.
  const versions = {
    'package.json': pkg.version,
    '.claude-plugin/plugin.json': pluginManifest.version,
    '.claude-plugin/marketplace.json plugins[0]': marketplacePluginEntry.version,
  };
  v.versionsMatch(versions);

  return pkg.version;
}

const pluginVersion = await validateManifests();

// =============================================================================
// PHASE 3: AGENTS.md is the single source of truth for contributor docs
// =============================================================================

function validateAgentsDocs() {
  const agentsPath = path.join(root, 'AGENTS.md');
  v.fileExists(agentsPath, 'AGENTS.md');
  const agentsBytes = fs.readFileSync(agentsPath);
  const claudePath = path.join(root, 'CLAUDE.md');
  if (fs.existsSync(claudePath)) {
    die(
      'CLAUDE.md should not exist — AGENTS.md is the single source of truth for ' +
        'contributor docs (decided in v0.3, see .todo/done/US-v0.3-council-feedback/' +
        'decide-agents-claude-md-strategy.md). Delete CLAUDE.md.'
    );
  }

  return agentsBytes;
}

const agentsBytes = validateAgentsDocs();

// =============================================================================
// PHASE 4: hooks/hooks.json parses and is well-formed
// =============================================================================

function validateHooksManifest() {
  const hooksJsonPath = path.join(root, 'hooks/hooks.json');
  v.fileExists(hooksJsonPath, 'hooks/hooks.json');
  const hooksJson = v.loadJSON(hooksJsonPath, 'hooks/hooks.json');

  const sessionStartArr = hooksJson?.hooks?.SessionStart;
  if (!Array.isArray(sessionStartArr) || sessionStartArr.length === 0) {
    die('hooks/hooks.json missing hooks.SessionStart entry');
  }

  for (const f of ['session-start.mjs']) {
    v.fileExists(path.join(root, 'hooks', f), `hooks/${f}`);
  }

  for (const stale of ['session-start', 'run-hook.cmd']) {
    const p = path.join(root, 'hooks', stale);
    if (fs.existsSync(p)) {
      die(
        `hooks/${stale} should be removed in v0.3 (Node port replaced the bash+cmd polyglot — see node-rewrite-session-start)`
      );
    }
  }

  const hooksCommand = sessionStartArr[0]?.hooks?.[0]?.command;
  if (typeof hooksCommand !== 'string' || !hooksCommand.includes('session-start.mjs')) {
    die(`hooks/hooks.json command field must invoke session-start.mjs, got: ${hooksCommand}`);
  }
}

validateHooksManifest();

// =============================================================================
// PHASE 5: hooks/session-start.mjs runs and emits the expected envelope
// =============================================================================

async function validateHookExecution() {
  const { spawnSync } = await import('child_process');
  const hookScript = path.join(root, 'hooks', 'session-start.mjs');

  function runHook(env) {
    const res = spawnSync(process.execPath, [hookScript], {
      encoding: 'utf8',
      env: { ...process.env, ...env },
    });
    if (res.status !== 0) {
      die(`session-start.mjs exited ${res.status}: ${res.stderr || res.stdout}`);
    }
    try {
      return JSON.parse(res.stdout);
    } catch (e) {
      die(`session-start.mjs stdout is not valid JSON: ${e.message}\n${res.stdout}`);
    }
  }

  const STABLE_MARKER = 'Trigger Map';

  // Default (Claude Code) shape: nested hookSpecificOutput.additionalContext.
  const claudePayload = runHook({ COPILOT_CLI: '' });
  const claudeCtx = claudePayload?.hookSpecificOutput?.additionalContext;
  if (typeof claudeCtx !== 'string') {
    die('session-start.mjs default output missing hookSpecificOutput.additionalContext');
  }
  if (claudePayload.hookSpecificOutput.hookEventName !== 'SessionStart') {
    die('session-start.mjs default output missing hookEventName="SessionStart"');
  }
  if (!claudeCtx.includes(STABLE_MARKER)) {
    die(`session-start.mjs default output missing stable marker "${STABLE_MARKER}"`);
  }

  // Copilot shape: top-level additionalContext.
  const copilotPayload = runHook({ COPILOT_CLI: '1' });
  if (typeof copilotPayload?.additionalContext !== 'string') {
    die('session-start.mjs COPILOT_CLI=1 output missing top-level additionalContext');
  }
  if (copilotPayload.hookSpecificOutput) {
    die('session-start.mjs COPILOT_CLI=1 output should not contain hookSpecificOutput');
  }
  if (!copilotPayload.additionalContext.includes(STABLE_MARKER)) {
    die(`session-start.mjs COPILOT_CLI=1 output missing stable marker "${STABLE_MARKER}"`);
  }
}

await validateHookExecution();

// =============================================================================
// Success
// =============================================================================

console.log(`smoke-load OK
  skills path:      ${skillsPath}
  plugin version:   ${pluginVersion}
  marketplace:      97-marketplace
  AGENTS.md:        single source (${agentsBytes.length} bytes)
  hooks:            session-start.mjs present`);
