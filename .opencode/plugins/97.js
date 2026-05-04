/**
 * 97 plugin for OpenCode.ai
 *
 * Mirrors the `superpowers` plugin layout (v5.0.7) so behavior is predictable.
 * Auto-registers the bundled `skills/` directory and injects the `using-97`
 * bootstrap into the first user message of every session.
 *
 * ----------------------------------------------------------------------------
 * OpenCode plugin API surface (verified against superpowers v5.0.7)
 * ----------------------------------------------------------------------------
 * - Plugin entry: NAMED export (`NinetySevenPlugin`), discovered via
 *   `package.json` `main`. Not a default export.
 * - Skill registration: `config` hook pushes the absolute `skills/` path into
 *   `config.skills.paths`. OpenCode lazily discovers SKILL.md files from those
 *   paths. Skill names are FLAT — agents invoke by bare frontmatter `name:`,
 *   not prefixed by plugin (e.g. `before-you-refactor`, NOT `97/before-you-refactor`).
 * - Bootstrap injection: `'experimental.chat.messages.transform'` hook
 *   prepends bootstrap to the first user message. Using a user message rather
 *   than a system message avoids per-turn token bloat (#750) and Qwen
 *   multi-system-message issues (#894). Idempotent via substring marker.
 * - Bootstrap content: built dynamically from `skills/using-97/SKILL.md` body
 *   (frontmatter stripped) wrapped in <EXTREMELY_IMPORTANT>...</EXTREMELY_IMPORTANT>
 *   plus a tool-mapping block. If the file does not exist, returns null and
 *   the hook becomes a graceful no-op (supports incremental development).
 * - Auto-update notice: cached 24h check against GitHub Releases. If a newer
 *   release exists than `package.json` `version`, a one-line notice is
 *   appended to the bootstrap pointing at `npx github:oribarilan/97 update`.
 *   Disable with NINETYSEVEN_DISABLE_VERSION_CHECK=1. See CONTRIBUTE.md §9.
 * - Zero runtime deps: Node built-ins only (`path`, `fs`, `os`, `url`, `https`).
 * ----------------------------------------------------------------------------
 */

import path from 'path';
import fs from 'fs';
import os from 'os';
import https from 'https';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Simple frontmatter extraction (zero-dep, mirror of superpowers).
const extractAndStripFrontmatter = (content) => {
  const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return { frontmatter: {}, content };

  const frontmatterStr = match[1];
  const body = match[2];
  const frontmatter = {};

  for (const line of frontmatterStr.split('\n')) {
    const colonIdx = line.indexOf(':');
    if (colonIdx > 0) {
      const key = line.slice(0, colonIdx).trim();
      const value = line.slice(colonIdx + 1).trim().replace(/^["']|["']$/g, '');
      frontmatter[key] = value;
    }
  }

  return { frontmatter, content: body };
};

const normalizePath = (p, homeDir) => {
  if (!p || typeof p !== 'string') return null;
  let normalized = p.trim();
  if (!normalized) return null;
  if (normalized.startsWith('~/')) {
    normalized = path.join(homeDir, normalized.slice(2));
  } else if (normalized === '~') {
    normalized = homeDir;
  }
  return path.resolve(normalized);
};

// ----------------------------------------------------------------------------
// Auto-update version check (zero-dep, cached, silent on failure)
// ----------------------------------------------------------------------------

const REPO_OWNER = 'oribarilan';
const REPO_NAME = '97';
const RELEASES_API = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/releases/latest`;
const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

// Read this plugin's installed version from its own package.json.
const readLocalVersion = () => {
  try {
    const pkgPath = path.resolve(__dirname, '../../package.json');
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
    return pkg.version || null;
  } catch {
    return null;
  }
};

const cacheDir = () => {
  // Cache dir resolution per platform conventions:
  //   Linux:   $XDG_CACHE_HOME/97 or ~/.cache/97
  //   macOS:   ~/Library/Caches/97
  //   Windows: %LOCALAPPDATA%\97\Cache or %APPDATA%\97\Cache
  const xdg = process.env.XDG_CACHE_HOME;
  if (xdg) return path.join(xdg, REPO_NAME);
  if (process.platform === 'win32') {
    const base = process.env.LOCALAPPDATA || process.env.APPDATA;
    if (base) return path.join(base, REPO_NAME, 'Cache');
  }
  if (process.platform === 'darwin') {
    return path.join(os.homedir(), 'Library', 'Caches', REPO_NAME);
  }
  return path.join(os.homedir(), '.cache', REPO_NAME);
};
const cachePath = () => path.join(cacheDir(), 'version-check.json');

const readCache = () => {
  try {
    const raw = fs.readFileSync(cachePath(), 'utf8');
    const data = JSON.parse(raw);
    if (typeof data.fetchedAt !== 'number' || typeof data.latestVersion !== 'string') return null;
    if (Date.now() - data.fetchedAt > CACHE_TTL_MS) return null;
    return data;
  } catch {
    return null;
  }
};

const writeCache = (latestVersion) => {
  try {
    fs.mkdirSync(cacheDir(), { recursive: true });
    fs.writeFileSync(cachePath(), JSON.stringify({ fetchedAt: Date.now(), latestVersion }), 'utf8');
  } catch {
    // Cache write failure is non-fatal; we just won't cache.
  }
};

const fetchLatestVersion = () => new Promise((resolve) => {
  // Strict 3-second budget; if GitHub is slow, skip the check.
  const req = https.get(RELEASES_API, {
    headers: {
      'User-Agent': '97-plugin-version-check',
      'Accept': 'application/vnd.github+json',
    },
    timeout: 3000,
  }, (res) => {
    if (res.statusCode !== 200) {
      res.resume();
      return resolve(null);
    }
    let body = '';
    res.on('data', (chunk) => body += chunk);
    res.on('end', () => {
      try {
        const data = JSON.parse(body);
        const tag = typeof data.tag_name === 'string' ? data.tag_name.replace(/^v/, '') : null;
        resolve(tag);
      } catch {
        resolve(null);
      }
    });
  });
  req.on('error', () => resolve(null));
  req.on('timeout', () => { req.destroy(); resolve(null); });
});

// SemVer comparison: returns true iff a > b. Both expected as `X.Y.Z`.
// Pre-release suffixes (`-alpha.1` etc) are treated as less-than the same
// version without suffix; that's good enough for our purposes.
const isNewer = (a, b) => {
  if (!a || !b) return false;
  const parse = (v) => {
    const [main = '', pre = ''] = v.split('-');
    const parts = main.split('.').map((n) => parseInt(n, 10));
    return { parts, hasPre: pre.length > 0 };
  };
  const A = parse(a);
  const B = parse(b);
  for (let i = 0; i < 3; i++) {
    const an = A.parts[i] || 0;
    const bn = B.parts[i] || 0;
    if (an !== bn) return an > bn;
  }
  // Equal core versions: a > b only if b has prerelease and a doesn't.
  return B.hasPre && !A.hasPre;
};

const buildUpdateNotice = (currentVersion, latestVersion) => {
  return `\n\n📦 **97 v${latestVersion} is available** (you're on v${currentVersion}). Run \`npx github:oribarilan/97 update\` to upgrade. See https://github.com/${REPO_OWNER}/${REPO_NAME}/releases for notes.`;
};

const checkForUpdate = async () => {
  if (process.env.NINETYSEVEN_DISABLE_VERSION_CHECK === '1') return null;
  const currentVersion = readLocalVersion();
  if (!currentVersion) return null;

  let latestVersion = null;
  const cached = readCache();
  if (cached) {
    latestVersion = cached.latestVersion;
  } else {
    latestVersion = await fetchLatestVersion();
    if (latestVersion) writeCache(latestVersion);
  }

  if (!latestVersion) return null;
  if (!isNewer(latestVersion, currentVersion)) return null;
  return buildUpdateNotice(currentVersion, latestVersion);
};

// ----------------------------------------------------------------------------

export const NinetySevenPlugin = async ({ client, directory } = {}) => {
  const homeDir = os.homedir();
  const skillsDir = path.resolve(__dirname, '../../skills');
  const envConfigDir = normalizePath(process.env.OPENCODE_CONFIG_DIR, homeDir);
  // (Reserved for future use; mirrors superpowers' computed paths.)
  void envConfigDir;

  const getBootstrapContent = () => {
    const skillPath = path.join(skillsDir, 'using-97', 'SKILL.md');
    if (!fs.existsSync(skillPath)) return null;

    const fullContent = fs.readFileSync(skillPath, 'utf8');
    const { content } = extractAndStripFrontmatter(fullContent);

    const toolMapping = `**Tool Mapping for OpenCode:**
When skills reference tools you don't have, substitute OpenCode equivalents:
- \`TodoWrite\` → \`todowrite\`
- \`Task\` tool with subagents → Use OpenCode's subagent system (@mention)
- \`Skill\` tool → OpenCode's native \`skill\` tool
- \`Read\`, \`Write\`, \`Edit\`, \`Bash\` → Your native tools

Use OpenCode's native \`skill\` tool to list and load skills.`;

    return `<EXTREMELY_IMPORTANT>
You have 97.

**IMPORTANT: The using-97 skill content is included below. It is ALREADY LOADED — you are currently following it. Do NOT use the skill tool to load "using-97" again — that would be redundant.**

${content}

${toolMapping}
</EXTREMELY_IMPORTANT>`;
  };

  return {
    // Inject the bundled skills path into live config so OpenCode discovers
    // 97 skills without symlinks or manual config edits. Idempotent.
    config: async (config) => {
      config.skills = config.skills || {};
      config.skills.paths = config.skills.paths || [];
      if (!config.skills.paths.includes(skillsDir)) {
        config.skills.paths.push(skillsDir);
      }
    },

    // Inject bootstrap into the first user message of each session.
    // Idempotent via substring marker (`EXTREMELY_IMPORTANT`).
    // Also runs the cached version check; if a newer release exists, a
    // one-line update notice is appended to the bootstrap.
    'experimental.chat.messages.transform': async (_input, output) => {
      const bootstrap = getBootstrapContent();
      if (!bootstrap || !output?.messages?.length) return;
      const firstUser = output.messages.find(m => m.info?.role === 'user');
      if (!firstUser || !firstUser.parts?.length) return;
      if (firstUser.parts.some(p => p.type === 'text' && p.text?.includes('EXTREMELY_IMPORTANT'))) return;

      // Update notice is best-effort: failures (offline, rate-limited, slow)
      // resolve to null, and the bootstrap goes out unchanged.
      let notice = null;
      try {
        notice = await checkForUpdate();
      } catch {
        notice = null;
      }

      const ref = firstUser.parts[0];
      firstUser.parts.unshift({ ...ref, type: 'text', text: bootstrap + (notice || '') });
    }
  };
};
