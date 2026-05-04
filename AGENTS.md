# AGENTS.md

Conventions for AI coding agents (Claude Code, Copilot CLI, OpenCode subagents,
etc.) working in this repo. The same rules apply to humans, but they are
written here in the imperative because agents need explicit instruction.

For the full contributor + release docs, see [`CONTRIBUTE.md`](./CONTRIBUTE.md).
This file is the short list.

## What this repo is

`97` is an OpenCode plugin that ships behavior-shaping skills distilled from
*97 Things Every Programmer Should Know* (O'Reilly, ed. Kevlin Henney). The
skills live under `skills/`, the loader under `.opencode/plugins/`, and the
tooling under `scripts/` and `bin/`.

## The five rules

1. **Test before you say done.** Run `npm test` (lint + smoke). Both must pass.
2. **Update the changelog.** Any user-facing change goes in the `[Unreleased]`
   section of `CHANGELOG.md` in the same PR as the change. See "Changelog
   discipline" below.
3. **Don't bump versions yourself.** `package.json` `version` and git tags are
   release activities, not feature activities. The release happens in a
   separate, deliberate commit.
4. **Don't touch shared files in parallel work.** When dispatching multiple
   subagents, forbid each from editing `README.md`, `package.json`,
   `skills/using-97/SKILL.md`, or `.opencode/plugins/97.js`. Those updates
   land in the integration step.
5. **Voice rules apply to skill content.** No AI tells (testament, pivotal,
   landscape, "serves as", trailing -ing clauses, etc.). The
   `humanizer` skill is the source of truth for voice. The imperative voice
   in checklists and Red Flags tables is intentional — keep it terse.
6. **Cross-platform is non-negotiable.** This plugin must work on Linux,
   macOS, and Windows. See "Cross-platform discipline" below.

## Cross-platform discipline

CI runs `npm test` on Ubuntu, macOS, and Windows across Node 18, 20, and 22.
A red Windows job blocks merge just like a red Ubuntu job. Anything you
write that touches the filesystem, the environment, or a shell command must
work on all three.

### The four traps

1. **Hardcoded paths.** Never assume `~/.config/...` or `~/.cache/...` —
   those don't exist on Windows. Always use `os.homedir()`, `path.join()`,
   and a platform branch when the convention differs:

   ```js
   // wrong
   const cache = path.join(os.homedir(), '.cache', '97');

   // right
   const cache = process.platform === 'win32'
     ? path.join(process.env.LOCALAPPDATA || process.env.APPDATA, '97', 'Cache')
     : process.platform === 'darwin'
       ? path.join(os.homedir(), 'Library', 'Caches', '97')
       : path.join(process.env.XDG_CACHE_HOME || path.join(os.homedir(), '.cache'), '97');
   ```

2. **Environment-variable syntax in docs and error messages.** When you
   tell a user how to set an env var, give all three forms:

   ```
   bash/zsh:    export FOO=1
   Windows cmd: set FOO=1
   PowerShell:  $env:FOO = "1"
   ```

3. **Shell built-ins in scripts.** `bin/update.mjs` is pure Node, no shell
   calls. Keep it that way. If you need to invoke a shell command, branch
   on `process.platform` and provide a Windows variant, or rewrite in pure
   Node. Never assume `bash`, `awk`, `sed`, `grep`, `chmod`, or `curl` are
   available.

4. **Shebangs and executable bits.** `#!/usr/bin/env node` is ignored on
   Windows. Don't rely on it for direct invocation. The `bin` field in
   `package.json` is what makes `npx` work cross-platform — npm
   auto-generates a `.cmd` shim on Windows. Never tell users to run
   `./bin/update.mjs` directly; always tell them `npx github:oribarilan/97 update`.

### Platform-aware locations (cheat sheet)

| What | Linux | macOS | Windows |
|---|---|---|---|
| OpenCode config | `~/.config/opencode/opencode.jsonc` | `~/.config/opencode/opencode.jsonc` | `%APPDATA%\opencode\opencode.jsonc` |
| Plugin cache | `~/.cache/97/` | `~/Library/Caches/97/` | `%LOCALAPPDATA%\97\Cache\` |
| Path separator | `/` | `/` | `\` (but Node accepts `/` too) |
| Line endings | `\n` | `\n` | `\r\n` (read with care) |

When in doubt, look at how `bin/update.mjs` and `.opencode/plugins/97.js`
already handle these — they're the reference implementations.

## Changelog discipline (Keep a Changelog)

`CHANGELOG.md` follows the Keep a Changelog format. The top section is always
`## [Unreleased]`. When you make a change worth a user noticing, add a bullet
to the relevant subsection of `[Unreleased]`:

- `### Added` — new skills, new principles, new tooling
- `### Changed` — behavior changes to existing skills or plugin
- `### Deprecated` — features still present but scheduled for removal
- `### Removed` — features removed in this release
- `### Fixed` — bug fixes
- `### Security` — vulnerability fixes
- `### Documentation` — README/CONTRIBUTE/AGENTS edits worth flagging

Bullets are written in past tense, focused on the reader's perspective, and
end with a period. If a bullet relates to a specific skill, name it in
backticks. Example:

```markdown
### Added
- `error-and-correctness-traps` now covers `0.1 + 0.2 != 0.3` as a worked
  example for the Numerics sub-section.
```

If your change is a pure internal refactor with no user-visible effect, you
do not need to add a changelog entry. When in doubt, add one.

## Adding a new skill

There is currently no plan to add skills beyond the v0.1.0 set, but if the
need arises:

1. Read an existing skill end-to-end as a template — `domain-modeling` is
   the smallest, `writing-clean-code` is the largest.
2. Each skill has two files: `SKILL.md` (loaded into agent context on
   trigger) and `principles.md` (long-form reference, loaded only when the
   agent needs the deep cut).
3. Add the skill's metadata to `SKILL_RULES` in `scripts/lint-skills.mjs`:
   max line count, required section headers, required principle numbers.
4. Update the trigger map in `skills/using-97/SKILL.md` AND the `What's
   inside` table in `README.md`.
5. Add a `### Added` entry under `[Unreleased]` in `CHANGELOG.md`.
6. Run `npm test` until lint and smoke both pass.

## Editing existing skills

1. Preserve voice and structure. The proven section structure is Overview →
   When to invoke → Non-triggers → Precedence → Numbered checklist/decisions
   → Red Flags → What "done" looks like → Principles table.
2. Cross-references between skills must stay bidirectionally consistent — if
   skill A says "B precedes me on X", skill B's text must agree on the
   boundary. Audit with `rg 'superpowers/|97/' skills/*/SKILL.md`.
3. Add a `### Changed` entry under `[Unreleased]` in `CHANGELOG.md`.

## Releases (orchestrator-only)

Releases are NOT something an agent should perform autonomously. The release
process is documented in `CONTRIBUTE.md` and requires a human partner to
review the changelog, decide the semver bump, tag the commit, and push.
Agents should propose a release in a comment or message, not execute one.

## Auto-update mechanism (briefly)

The plugin checks GitHub Releases on session start (cached 24h) and prints a
one-line notice in the bootstrap when a newer release is available. The
notice points at `npx github:oribarilan/97 update`, which bumps the pinned
version tag in the user's `opencode.jsonc`.

For agents working on the auto-update code itself: never make the plugin
modify the user's `opencode.jsonc` silently. The check is informational
only; the user runs the update command when they choose to.

## Where the deeper rules live

- Voice and writing style: `humanizer` skill (in superpowers)
- Skill template structure: `skills/before-you-refactor/SKILL.md` (the
  original) and `skills/domain-modeling/SKILL.md` (the cleanest follow-on)
- Lint constraints: `scripts/lint-skills.mjs` (`SKILL_RULES` constant)
- Distribution and release: `CONTRIBUTE.md`
- Source-essay attribution policy: `CONTENT-LICENSE.md`
