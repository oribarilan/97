#!/usr/bin/env node
/**
 * SessionStart hook for 97 plugin.
 *
 * Reads skills/using-97/SKILL.md, strips frontmatter (matching the OpenCode
 * adapter for cross-harness consistency), and emits the platform-appropriate
 * context-injection JSON on stdout.
 *
 * Output shape:
 *   - Claude Code (default):
 *       { hookSpecificOutput: { hookEventName: "SessionStart",
 *                                additionalContext: "..." } }
 *   - Copilot CLI (when COPILOT_CLI env var is set, any non-empty value):
 *       { additionalContext: "..." }
 *
 * Cursor is intentionally not supported — see CONTRIBUTE.md harness
 * scope policy. Add a new harness adapter only after content evidence
 * justifies the scope expansion.
 *
 * Zero deps, Node built-ins only. Invoked directly via `node` from
 * hooks/hooks.json so it works on Linux, macOS, and Windows without
 * relying on a POSIX shell.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const skillPath = path.resolve(__dirname, '..', 'skills', 'using-97', 'SKILL.md');

// Strip frontmatter to mirror .opencode/plugins/97.js behavior. CRLF-tolerant
// for Windows checkouts.
function stripFrontmatter(content) {
  const m = content.match(/^---\r?\n[\s\S]*?\r?\n---\r?\n([\s\S]*)$/);
  return m ? m[1] : content;
}

let body = '';
try {
  const raw = fs.readFileSync(skillPath, 'utf8');
  body = stripFrontmatter(raw);
} catch (err) {
  // Fail loud on stderr; emit empty-context JSON so the harness still
  // gets a parseable object rather than a crash.
  process.stderr.write(`97 session-start: failed to read ${skillPath}: ${err.message}\n`);
}

const sessionContext = `<bootstrap name="using-97">
${body}
</bootstrap>`;

const isCopilot = !!process.env.COPILOT_CLI;
const payload = isCopilot
  ? { additionalContext: sessionContext }
  : {
      hookSpecificOutput: {
        hookEventName: 'SessionStart',
        additionalContext: sessionContext,
      },
    };

process.stdout.write(JSON.stringify(payload, null, 2) + '\n');
