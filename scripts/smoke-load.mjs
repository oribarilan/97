#!/usr/bin/env node
/**
 * smoke-load.mjs — verifies plugin loads and v0.2.0 invariants hold.
 *
 * Checks:
 *   - .opencode/plugins/97.js loads, exports NinetySevenPlugin, registers skills/
 *   - .claude-plugin/plugin.json and marketplace.json JSON-parse
 *   - marketplace.json names the marketplace `97-marketplace` and lists plugin `97`
 *   - Versions match across package.json, plugin.json, marketplace.json[plugins[0]]
 *   - AGENTS.md and CLAUDE.md are byte-identical
 *   - hooks/hooks.json JSON-parses and references run-hook.cmd session-start
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
// 3. AGENTS.md and CLAUDE.md byte-identical
// ---------------------------------------------------------------------------
const agentsPath = path.join(root, 'AGENTS.md');
const claudePath = path.join(root, 'CLAUDE.md');
if (!fs.existsSync(agentsPath)) die('AGENTS.md missing');
if (!fs.existsSync(claudePath)) die('CLAUDE.md missing');
const agentsBytes = fs.readFileSync(agentsPath);
const claudeBytes = fs.readFileSync(claudePath);
if (!agentsBytes.equals(claudeBytes)) {
  die('AGENTS.md and CLAUDE.md must be byte-identical (no symlink — both real files)');
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
for (const f of ['session-start', 'run-hook.cmd']) {
  const p = path.join(root, 'hooks', f);
  if (!fs.existsSync(p)) die(`hooks/${f} missing`);
}

console.log(`smoke-load OK
  skills path:      ${skillsPath}
  plugin version:   ${pkg.version}
  marketplace:      ${marketplace.name}
  AGENTS=CLAUDE:    byte-identical (${agentsBytes.length} bytes)
  hooks:            session-start, run-hook.cmd present`);
