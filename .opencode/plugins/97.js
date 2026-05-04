/**
 * 97 plugin for OpenCode.ai
 *
 * Mirrors the `superpowers` plugin layout so behavior is predictable.
 * Auto-registers the bundled `skills/` directory and injects the `using-97`
 * bootstrap into the first user message of every session.
 *
 * ----------------------------------------------------------------------------
 * OpenCode plugin API surface
 * ----------------------------------------------------------------------------
 * - Plugin entry: NAMED export (`NinetySevenPlugin`), discovered via
 *   `package.json` `main`. Not a default export.
 * - Skill registration: `config` hook pushes the absolute `skills/` path into
 *   `config.skills.paths`. OpenCode lazily discovers SKILL.md files from those
 *   paths. Skill names are FLAT — agents invoke by bare frontmatter `name:`,
 *   not prefixed by plugin (e.g. `before-you-refactor`, NOT `97/before-you-refactor`).
 * - Bootstrap injection: `'experimental.chat.messages.transform'` hook
 *   prepends bootstrap to the first user message. Using a user message rather
 *   than a system message avoids per-turn token bloat and Qwen
 *   multi-system-message issues. Idempotent via substring marker.
 * - Bootstrap content: built dynamically from `skills/using-97/SKILL.md` body
 *   (frontmatter stripped) wrapped in <EXTREMELY_IMPORTANT>...</EXTREMELY_IMPORTANT>
 *   plus a tool-mapping block that translates Claude-native tool names used
 *   in the harness-neutral SKILL.md to OpenCode equivalents.
 * - Zero runtime deps: Node built-ins only (`path`, `fs`, `os`, `url`).
 * ----------------------------------------------------------------------------
 */

import path from 'path';
import fs from 'fs';
import os from 'os';
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
      const value = line
        .slice(colonIdx + 1)
        .trim()
        .replace(/^["']|["']$/g, '');
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

    // The using-97 SKILL.md is harness-neutral and uses Claude Code-native
    // tool names (Read, Write, Edit, Bash, Task, TodoWrite, Skill). This
    // appendix translates them to OpenCode equivalents at injection time.
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
    'experimental.chat.messages.transform': async (_input, output) => {
      const bootstrap = getBootstrapContent();
      if (!bootstrap || !output?.messages?.length) return;
      const firstUser = output.messages.find((m) => m.info?.role === 'user');
      if (!firstUser || !firstUser.parts?.length) return;
      if (firstUser.parts.some((p) => p.type === 'text' && p.text?.includes('EXTREMELY_IMPORTANT')))
        return;

      const ref = firstUser.parts[0];
      firstUser.parts.unshift({ ...ref, type: 'text', text: bootstrap });
    },
  };
};
