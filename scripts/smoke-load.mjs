#!/usr/bin/env node
/**
 * smoke-load.mjs — verifies the plugin loads and registers its skills dir.
 *
 * Imports .opencode/plugins/97.js, asserts NinetySevenPlugin is a function,
 * invokes it with a minimal stub OpenCode API, runs the `config` hook against
 * a fake config object and asserts the skills/ path is registered and resolves
 * to a real directory on disk.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const pluginPath = path.join(root, '.opencode/plugins/97.js');

function die(msg) { console.error('smoke-load FAIL:', msg); process.exit(1); }

const mod = await import(pathToFileURL(pluginPath).href);
const factory = mod.NinetySevenPlugin;
if (typeof factory !== 'function') die('NinetySevenPlugin named export is not a function');

const hooks = await factory({ client: {}, directory: root });
if (!hooks || typeof hooks !== 'object') die('plugin factory did not return a hooks object');
if (typeof hooks.config !== 'function') die('plugin missing `config` hook');
if (typeof hooks['experimental.chat.messages.transform'] !== 'function') die('plugin missing `experimental.chat.messages.transform` hook');

const fakeConfig = {};
await hooks.config(fakeConfig);
const paths = fakeConfig.skills?.paths;
if (!Array.isArray(paths) || paths.length === 0) die('config hook did not register any skills paths');
const skillsPath = paths[paths.length - 1];
if (!fs.existsSync(skillsPath) || !fs.statSync(skillsPath).isDirectory()) {
  die(`registered skills path does not exist or is not a directory: ${skillsPath}`);
}

// Idempotency: run the hook again, length must not grow.
await hooks.config(fakeConfig);
if (fakeConfig.skills.paths.length !== paths.length) die('config hook is not idempotent');

// Bootstrap transform: must be a no-op when no first user message exists.
await hooks['experimental.chat.messages.transform']({}, { messages: [] });

console.log(`smoke-load OK (skills path: ${skillsPath})`);
