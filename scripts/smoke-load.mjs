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

function die(msg) {
  console.error('smoke-load FAIL:', msg);
  process.exit(1);
}

// ---------------------------------------------------------------------------
// 1. OpenCode plugin loads and registers skills/
// ---------------------------------------------------------------------------
const mod = await import(pathToFileURL(pluginPath).href);
const factory = mod.NinetySevenPlugin;
if (typeof factory !== 'function') die('NinetySevenPlugin named export is not a function');

const hooks = await factory({ client: {}, directory: root });
if (!hooks || typeof hooks !== 'object') die('plugin factory did not return a hooks object');
if (typeof hooks.config !== 'function') die('plugin missing `config` hook');
if (typeof hooks['experimental.chat.messages.transform'] !== 'function')
  die('plugin missing `experimental.chat.messages.transform` hook');

const fakeConfig = {};
await hooks.config(fakeConfig);
const paths = fakeConfig.skills?.paths;
if (!Array.isArray(paths) || paths.length === 0)
  die('config hook did not register any skills paths');
const skillsPath = paths[paths.length - 1];
if (!fs.existsSync(skillsPath) || !fs.statSync(skillsPath).isDirectory()) {
  die(`registered skills path does not exist or is not a directory: ${skillsPath}`);
}

// Idempotency: run the hook again, length must not grow.
await hooks.config(fakeConfig);
if (fakeConfig.skills.paths.length !== paths.length) die('config hook is not idempotent');

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
if (!Array.isArray(userMsg.parts) || userMsg.parts.length !== 2)
  die(`bootstrap transform did not prepend a part: expected 2 parts, got ${userMsg.parts?.length}`);
const injected = userMsg.parts[0];
if (injected.type !== 'text')
  die(`injected part has wrong type: expected "text", got "${injected.type}"`);
if (!injected.text || !injected.text.includes(STABLE_MARKER))
  die(`injected bootstrap missing stable marker "${STABLE_MARKER}"`);
if (!injected.text.includes('OpenCode equivalents'))
  die('injected bootstrap missing OpenCode tool-mapping appendix');

// Idempotency: a second transform call must not add a third part.
await hooks['experimental.chat.messages.transform']({}, fakeMsgs);
if (userMsg.parts.length !== 2)
  die(`bootstrap transform is not idempotent: a second call grew parts to ${userMsg.parts.length}`);

// ---------------------------------------------------------------------------
// 2. .claude-plugin/ manifests parse and version equality holds
// ---------------------------------------------------------------------------
const pkgPath = path.join(root, 'package.json');
const pluginManifestPath = path.join(root, '.claude-plugin/plugin.json');
const marketplacePath = path.join(root, '.claude-plugin/marketplace.json');

for (const p of [pkgPath, pluginManifestPath, marketplacePath]) {
  if (!fs.existsSync(p)) die(`missing manifest: ${path.relative(root, p)}`);
}

let pkg, pluginManifest, marketplace;
try {
  pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
} catch (e) {
  die(`package.json does not parse: ${e.message}`);
}
try {
  pluginManifest = JSON.parse(fs.readFileSync(pluginManifestPath, 'utf8'));
} catch (e) {
  die(`.claude-plugin/plugin.json does not parse: ${e.message}`);
}
try {
  marketplace = JSON.parse(fs.readFileSync(marketplacePath, 'utf8'));
} catch (e) {
  die(`.claude-plugin/marketplace.json does not parse: ${e.message}`);
}

if (marketplace.name !== '97-marketplace') {
  die(`marketplace.json name must be "97-marketplace", got "${marketplace.name}"`);
}
if (!Array.isArray(marketplace.plugins) || marketplace.plugins.length === 0) {
  die('marketplace.json must list at least one plugin in plugins[]');
}
const marketplacePluginEntry = marketplace.plugins[0];
if (marketplacePluginEntry.name !== '97') {
  die(`marketplace.plugins[0].name must be "97", got "${marketplacePluginEntry.name}"`);
}
if (pluginManifest.name !== '97') {
  die(`plugin.json name must be "97", got "${pluginManifest.name}"`);
}

const versions = {
  'package.json': pkg.version,
  '.claude-plugin/plugin.json': pluginManifest.version,
  '.claude-plugin/marketplace.json plugins[0]': marketplacePluginEntry.version,
};
const distinctVersions = new Set(Object.values(versions));
if (distinctVersions.size !== 1) {
  const lines = Object.entries(versions)
    .map(([k, v]) => `    ${k} = ${v}`)
    .join('\n');
  die(`manifest versions disagree:\n${lines}`);
}

// ---------------------------------------------------------------------------
// 3. AGENTS.md is the single source of truth for contributor docs
// ---------------------------------------------------------------------------
const agentsPath = path.join(root, 'AGENTS.md');
if (!fs.existsSync(agentsPath)) die('AGENTS.md missing');
const agentsBytes = fs.readFileSync(agentsPath);
const claudePath = path.join(root, 'CLAUDE.md');
if (fs.existsSync(claudePath)) {
  die(
    'CLAUDE.md should not exist — AGENTS.md is the single source of truth for ' +
      'contributor docs (decided in v0.3, see .todo/done/US-v0.3-council-feedback/' +
      'decide-agents-claude-md-strategy.md). Delete CLAUDE.md.'
  );
}

// ---------------------------------------------------------------------------
// 4. hooks/hooks.json parses and is well-formed
// ---------------------------------------------------------------------------
const hooksJsonPath = path.join(root, 'hooks/hooks.json');
if (!fs.existsSync(hooksJsonPath)) die('hooks/hooks.json missing');
let hooksJson;
try {
  hooksJson = JSON.parse(fs.readFileSync(hooksJsonPath, 'utf8'));
} catch (e) {
  die(`hooks/hooks.json does not parse: ${e.message}`);
}
const sessionStartArr = hooksJson?.hooks?.SessionStart;
if (!Array.isArray(sessionStartArr) || sessionStartArr.length === 0) {
  die('hooks/hooks.json missing hooks.SessionStart entry');
}
for (const f of ['session-start.mjs']) {
  const p = path.join(root, 'hooks', f);
  if (!fs.existsSync(p)) die(`hooks/${f} missing`);
}
for (const stale of ['session-start', 'run-hook.cmd']) {
  const p = path.join(root, 'hooks', stale);
  if (fs.existsSync(p))
    die(
      `hooks/${stale} should be removed in v0.3 (Node port replaced the bash+cmd polyglot — see node-rewrite-session-start)`
    );
}

const hooksCommand = sessionStartArr[0]?.hooks?.[0]?.command;
if (typeof hooksCommand !== 'string' || !hooksCommand.includes('session-start.mjs')) {
  die(`hooks/hooks.json command field must invoke session-start.mjs, got: ${hooksCommand}`);
}

// ---------------------------------------------------------------------------
// 5. hooks/session-start.mjs runs and emits the expected envelope
// ---------------------------------------------------------------------------
const { spawnSync } = await import('child_process');
const hookScript = path.join(root, 'hooks', 'session-start.mjs');

function runHook(env) {
  const res = spawnSync(process.execPath, [hookScript], {
    encoding: 'utf8',
    env: { ...process.env, ...env },
  });
  if (res.status !== 0) die(`session-start.mjs exited ${res.status}: ${res.stderr || res.stdout}`);
  let parsed;
  try {
    parsed = JSON.parse(res.stdout);
  } catch (e) {
    die(`session-start.mjs stdout is not valid JSON: ${e.message}\n${res.stdout}`);
  }
  return parsed;
}

// Default (Claude Code) shape: nested hookSpecificOutput.additionalContext.
const claudePayload = runHook({ COPILOT_CLI: '' });
const claudeCtx = claudePayload?.hookSpecificOutput?.additionalContext;
if (typeof claudeCtx !== 'string')
  die('session-start.mjs default output missing hookSpecificOutput.additionalContext');
if (claudePayload.hookSpecificOutput.hookEventName !== 'SessionStart')
  die('session-start.mjs default output missing hookEventName="SessionStart"');
if (!claudeCtx.includes(STABLE_MARKER))
  die(`session-start.mjs default output missing stable marker "${STABLE_MARKER}"`);

// Copilot shape: top-level additionalContext.
const copilotPayload = runHook({ COPILOT_CLI: '1' });
if (typeof copilotPayload?.additionalContext !== 'string')
  die('session-start.mjs COPILOT_CLI=1 output missing top-level additionalContext');
if (copilotPayload.hookSpecificOutput)
  die('session-start.mjs COPILOT_CLI=1 output should not contain hookSpecificOutput');
if (!copilotPayload.additionalContext.includes(STABLE_MARKER))
  die(`session-start.mjs COPILOT_CLI=1 output missing stable marker "${STABLE_MARKER}"`);

console.log(`smoke-load OK
  skills path:      ${skillsPath}
  plugin version:   ${pkg.version}
  marketplace:      ${marketplace.name}
  AGENTS.md:        single source (${agentsBytes.length} bytes)
  hooks:            session-start.mjs present`);
