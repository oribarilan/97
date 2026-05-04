#!/usr/bin/env node
/**
 * 97 update script — bumps the pinned `97@git+...#vX.Y.Z` tag in the user's
 * opencode.jsonc to the latest GitHub Release.
 *
 * Invoked via `npx github:oribarilan/97 update`.
 *
 * Zero runtime deps (Node built-ins only). Tested on Node 18+.
 *
 * Usage:
 *   update [--config <path>] [--version <tag>] [--dry-run] [--help]
 */

import fs from 'fs';
import os from 'os';
import path from 'path';
import https from 'https';

const REPO_OWNER = 'oribarilan';
const REPO_NAME = '97';
const RELEASES_API = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/releases/latest`;

// ----------------------------------------------------------------------------
// CLI parsing (zero-dep)
// ----------------------------------------------------------------------------
const args = process.argv.slice(2);
const flags = { config: null, version: null, dryRun: false, help: false };

// Drop the leading "update" subcommand if present (npx invocation pattern)
if (args[0] === 'update') args.shift();

for (let i = 0; i < args.length; i++) {
  const a = args[i];
  if (a === '--help' || a === '-h') flags.help = true;
  else if (a === '--dry-run') flags.dryRun = true;
  else if (a === '--config') flags.config = args[++i];
  else if (a === '--version') flags.version = args[++i];
  else if (a.startsWith('--config=')) flags.config = a.slice('--config='.length);
  else if (a.startsWith('--version=')) flags.version = a.slice('--version='.length);
  else {
    console.error(`unknown argument: ${a}`);
    flags.help = true;
  }
}

if (flags.help) {
  console.log(`97 update — bump the pinned 97 plugin tag in opencode.jsonc

Usage: npx github:oribarilan/97 update [options]

Options:
  --config <path>     Override the opencode.jsonc location.
  --version <tag>     Pin to a specific tag (e.g., v0.1.0). Default: latest.
  --dry-run           Show the change without writing.
  --help              Print this help.
`);
  process.exit(0);
}

// ----------------------------------------------------------------------------
// Locate opencode.jsonc
// ----------------------------------------------------------------------------
function findConfigFile() {
  if (flags.config) {
    const p = path.resolve(flags.config);
    if (!fs.existsSync(p)) die(`config file not found: ${p}`);
    return p;
  }

  const home = os.homedir();
  const candidates = [
    process.env.OPENCODE_CONFIG_DIR && path.join(process.env.OPENCODE_CONFIG_DIR, 'opencode.jsonc'),
    process.env.XDG_CONFIG_HOME && path.join(process.env.XDG_CONFIG_HOME, 'opencode', 'opencode.jsonc'),
    path.join(home, '.config', 'opencode', 'opencode.jsonc'),
    path.join(home, '.opencode', 'opencode.jsonc'),
    process.platform === 'darwin' && path.join(home, 'Library', 'Application Support', 'opencode', 'opencode.jsonc'),
    process.platform === 'win32' && process.env.APPDATA && path.join(process.env.APPDATA, 'opencode', 'opencode.jsonc'),
  ].filter(Boolean);

  for (const p of candidates) {
    if (fs.existsSync(p)) return p;
  }

  die(`could not find opencode.jsonc. Searched:
${candidates.map(p => '  ' + p).join('\n')}

Pass --config <path> to specify the file location.`);
}

// ----------------------------------------------------------------------------
// Fetch latest release tag from GitHub
// ----------------------------------------------------------------------------
function fetchLatestTag() {
  return new Promise((resolve, reject) => {
    const req = https.get(RELEASES_API, {
      headers: {
        'User-Agent': '97-update-script',
        'Accept': 'application/vnd.github+json',
      },
      timeout: 10000,
    }, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        if (res.statusCode === 404) {
          return reject(new Error(`no releases found at ${REPO_OWNER}/${REPO_NAME}`));
        }
        if (res.statusCode !== 200) {
          return reject(new Error(`GitHub API returned ${res.statusCode}`));
        }
        try {
          const data = JSON.parse(body);
          if (!data.tag_name) return reject(new Error('GitHub API response missing tag_name'));
          resolve(data.tag_name);
        } catch (err) {
          reject(new Error(`failed to parse GitHub API response: ${err.message}`));
        }
      });
    });
    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('GitHub API request timed out after 10s'));
    });
  });
}

// ----------------------------------------------------------------------------
// Locate and replace the 97 plugin pin in JSONC content (regex; preserves comments)
// ----------------------------------------------------------------------------
const PIN_REGEX = new RegExp(
  `(["'])(${REPO_NAME}@git\\+https://github\\.com/${REPO_OWNER}/${REPO_NAME}\\.git)#([^"']+)\\1`,
  'g'
);

function findPin(content) {
  const matches = [...content.matchAll(PIN_REGEX)];
  if (matches.length === 0) return null;
  if (matches.length > 1) {
    die(`found ${matches.length} occurrences of the 97 pin. Resolve manually.`);
  }
  return { match: matches[0], currentTag: matches[0][3] };
}

function replacePin(content, newTag) {
  return content.replace(PIN_REGEX, (_match, q, base) => `${q}${base}#${newTag}${q}`);
}

// ----------------------------------------------------------------------------
// Main
// ----------------------------------------------------------------------------
async function main() {
  const configPath = findConfigFile();
  console.log(`config: ${configPath}`);

  const content = fs.readFileSync(configPath, 'utf8');
  const pin = findPin(content);
  if (!pin) {
    die(`97 plugin pin not found in ${configPath}.

Expected an entry like:
  "${REPO_NAME}@git+https://github.com/${REPO_OWNER}/${REPO_NAME}.git#vX.Y.Z"

in the "plugin" array. Add it manually first; see the README install section.`);
  }
  console.log(`current: #${pin.currentTag}`);

  let targetTag;
  if (flags.version) {
    targetTag = flags.version.startsWith('v') ? flags.version : `v${flags.version}`;
    console.log(`target:  #${targetTag} (--version)`);
  } else {
    process.stdout.write('checking GitHub for latest release... ');
    try {
      targetTag = await fetchLatestTag();
      console.log(`#${targetTag}`);
    } catch (err) {
      console.log('FAILED');
      die(`could not fetch latest release: ${err.message}`);
    }
  }

  if (pin.currentTag === targetTag) {
    console.log(`\n✓ already on ${targetTag}, nothing to do.`);
    return;
  }

  const updated = replacePin(content, targetTag);
  if (updated === content) {
    die('replacement produced no change. This is a bug — please report.');
  }

  if (flags.dryRun) {
    console.log(`\n[dry-run] would update ${pin.currentTag} → ${targetTag} in:\n  ${configPath}`);
    return;
  }

  fs.writeFileSync(configPath, updated, 'utf8');
  console.log(`\n✓ updated ${pin.currentTag} → ${targetTag}`);
  console.log(`  in ${configPath}`);
  console.log(`\nRestart OpenCode to load the new version.`);
}

function die(msg) {
  console.error(`error: ${msg}`);
  process.exit(1);
}

main().catch((err) => {
  console.error(`error: ${err.message}`);
  process.exit(1);
});
