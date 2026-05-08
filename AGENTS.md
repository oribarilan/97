# AGENTS.md

Conventions for AI coding agents (Claude Code, Copilot CLI, OpenCode subagents,
etc.) working in this repo. The same rules apply to humans, but they are
written here in the imperative because agents need explicit instruction.

For the full contributor + release docs, see [`CONTRIBUTE.md`](./CONTRIBUTE.md).
This file is the short list.

## What this repo is
`97` is a multi-harness plugin that ships skills distilled from established
programming practice, in the spirit of *97 Things Every Programmer Should
Know* (O'Reilly, ed. Kevlin Henney). The same `skills/` directory is loaded
by three coding-agent harnesses: **Claude Code**, **GitHub Copilot CLI**,
and **OpenCode**.

Layout: skills under `skills/`, OpenCode loader under `.opencode/plugins/`,
Claude Code / Copilot CLI manifests under `.claude-plugin/`, session-start
bootstrap hooks under `hooks/`, tooling under `scripts/`.

## The seven rules

1. **Test before you say done.** Run `just check` (lint + format-check + smoke). All three must pass. (`npm test` is the same thing — CI uses it; `just` is the local convenience.)
2. **Update the changelog.** Any user-facing change goes in the `[Unreleased]`
   section of `CHANGELOG.md` in the same PR as the change. See "Changelog
   discipline" below.
3. **Don't bump versions yourself.** `package.json` `version`,
   `.claude-plugin/plugin.json` `version`,
   `.claude-plugin/marketplace.json` `plugins[0].version`, and git tags are
   release activities, not feature activities. The release happens in a
   separate, deliberate commit. All three version fields stay in sync; lint
   enforces equality.
4. **Don't touch shared files in parallel work.** When dispatching multiple
   subagents, forbid each from editing `README.md`, `package.json`,
   `skills/using-97/SKILL.md`, `.opencode/plugins/97.js`, `AGENTS.md`,
   or anything under `.claude-plugin/` or `hooks/`. Those updates land
   in the integration step.
5. **Voice rules apply to skill content.** No AI tells (testament, pivotal,
   landscape, "serves as", trailing -ing clauses, etc.). The
   `humanizer` skill is the source of truth for voice. The imperative voice
   in checklists and Red Flags tables is intentional — keep it terse.
   Two cleanup-pass rules apply:
   - **Subtract before substitute.** When tightening prose, prefer cutting
     the offending phrase to replacing it. Substituting a vivid coined word
     with a generic one is a regression even if the result is shorter.
   - **Agent-first prose in skill files.** Skills are loaded into agent
     context at trigger time. Cut subsection lead-ins, atmospheric Overview
     openers, vivid metaphors that don't change agent behavior, and
     Precedence sections that only restate `using-97`'s trigger map.
     Reframe vague rules into actions an agent can take.
6. **Cross-platform is non-negotiable.** This plugin must work on Linux,
   macOS, and Windows. See "Cross-platform discipline" below.
7. **No OpenCode-isms outside `.opencode/`.** The `skills/` directory and
   `using-97/SKILL.md` in particular are harness-neutral and use
   Claude Code-native tool names (`Read`, `Write`, `Edit`, `Bash`, `Task`,
   `TodoWrite`, `Skill`). Harness-specific glue lives in adapters:
   `.opencode/plugins/97.js` for OpenCode, `hooks/session-start.mjs` for
   Claude Code and Copilot CLI. Don't push OpenCode tool names, OpenCode
   config paths, or OpenCode-only behavior into shared content.
8. **Harness scope is frozen through v1.0.** Supported: Claude Code,
   Copilot CLI, OpenCode. Adding a new harness adapter requires both
   demonstrated user demand and behavioral evidence that the existing
   skills change agent output. PRs that add a fourth harness without
   meeting both bars will be deferred. See "Harness scope policy" in
   `CONTRIBUTE.md`.

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

3. **Shell built-ins in scripts.** If you need to invoke a shell command,
   branch on `process.platform` and provide a Windows variant, or rewrite
   in pure Node. Never assume `bash`, `awk`, `sed`, `grep`, `chmod`, or
   `curl` are available. The `hooks/run-hook.cmd` polyglot wrapper is the
   reference pattern when bash is genuinely required — it locates Git for
   Windows bash on Windows hosts and exits silently if none is available.

4. **Shebangs and executable bits.** `#!/usr/bin/env node` is ignored on
   Windows. Don't rely on it for direct invocation. Hook scripts use
   extensionless filenames (e.g. `session-start`, not `session-start.sh`)
   so Claude Code's Windows auto-detection — which prepends `bash` to any
   command containing `.sh` — doesn't interfere.

### Platform-aware locations (cheat sheet)

| What | Linux | macOS | Windows |
|---|---|---|---|
| OpenCode config | `~/.config/opencode/opencode.jsonc` | `~/.config/opencode/opencode.jsonc` | `%APPDATA%\opencode\opencode.jsonc` |
| Path separator | `/` | `/` | `\` (but Node accepts `/` too) |
| Line endings | `\n` | `\n` | `\r\n` (read with care) |

When in doubt, look at how `.opencode/plugins/97.js` and `hooks/run-hook.cmd`
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

**Bullets are tight.** Past tense, reader's perspective, period at
the end. One change per bullet. Skills and files in backticks.

**Describe the change, not the deliberation.** No task IDs, story
slugs, council names, `.todo/` paths, or file-touched lists in the
bullet. Those belong in the commit body. The changelog is what users
read.

**Length: target 3–5 source lines. 6–7 is the ceiling, not the
target.** If your draft sits at the ceiling, you are restating the
commit body. Past 7, you are explaining yourself. Cut. The most
common failure: writing a 13-line bullet, "tightening" to 7, and
calling it tight. 7 is not tight; 4 is tight.

**Before writing, read the latest 2–3 entries in `CHANGELOG.md` and
match their density.** If your draft is twice as long as the most
recent peer entry of the same shape (e.g. a multi-skill behavior
change), cut it before committing. Recent entries are the working
definition of "tight" for this project.

Bad — wall of prose, file list, AI-ish phrasing ("namesake exemplar"):

```markdown
- Repositioned 97's user-visible identity from "a multi-harness
  companion to *97 Things*" to "skills distilled from the classics
  of programming practice…" *97 Things* moves from being framed as
  the primary content source to being framed as the namesake
  exemplar — the project inherits its form from the book while its
  content draws from a wider set of established practitioner works.
  Touches `README.md`, `AGENTS.md`, `CONTRIBUTE.md`, `package.json`,
  `.claude-plugin/plugin.json`, …
```

Good — one bullet, one change, reader's perspective:

```markdown
- Reframed user-visible copy: 97 is described as skills distilled
  from established programming practice, in the spirit of *97 Things
  Every Programmer Should Know*, rather than as a *97 Things*
  companion. No skill content changes.
```

Voice rules from `superpowers/humanizer` apply: no AI vocabulary
("namesake exemplar," "pivotal," "underscore," "crucial"), no copula
avoidance ("serves as," "stands as"), no rule-of-three padding, em
dashes in moderation.

If your change is a pure internal refactor with no user-visible effect, you
do not need to add a changelog entry. When in doubt, add one.

## Adding a new skill

If the need arises:

1. Read an existing skill end-to-end as a template — `domain-modeling` is
   the smallest, `writing-clean-code` is the largest.
2. Each skill has two files: `SKILL.md` (loaded into agent context on
   trigger) and `principles.md` (long-form reference, loaded only when the
   agent needs the deep cut).
3. Add the skill's metadata to `SKILL_RULES` in `scripts/lint-skills.mjs`:
   max line count, required section headers, required principle numbers.
4. Update the trigger map in `skills/using-97/SKILL.md` AND the `What's
   inside` table in `README.md`.
5. If the new skill cites a source not already listed in the
   `### Giants` bullets in `README.md`, add it there
   (author/work + one-line topic). See "Adding or removing a source"
   below.
6. Add a `### Added` entry under `[Unreleased]` in `CHANGELOG.md`.
7. Run `npm test` until lint and smoke both pass.

## Editing existing skills

1. Preserve voice and structure. The proven section structure is Overview →
   When to invoke → Non-triggers → Precedence → Numbered checklist/decisions
   → Red Flags → What "done" looks like → Principles table.
2. Cross-references between skills must stay bidirectionally consistent — if
   skill A says "B precedes me on X", skill B's text must agree on the
   boundary. Audit with `rg 'superpowers/|97/' skills/*/SKILL.md`.
3. If a principle is added from a source not already listed in the
   `### Giants` bullets in `README.md`, update that list.
   If a source is removed (no remaining principles cite it), remove it.
   See "Adding or removing a source" below.
4. Add a `### Changed` entry under `[Unreleased]` in `CHANGELOG.md`.

## Adding or removing a source

The `### Giants` bullets in `README.md` are the canonical
public-facing list of every source the project cites. The list must
match what's actually in `principles.md` files. When sources change:

1. **Adding a source.** Append a bullet in the form
   `Author — *Work*. One-line topic.` Use the same register as the
   existing entries: name the author, italicize the work title, give a
   one-line topic that describes what principles the source contributes.
   Specific principle names in parentheses are illustrative, not
   exhaustive — name one or two when they're recognizable, otherwise
   keep the topic generic. Hyperlink only when the source is a freely
   available essay or specification (books are not linked).
2. **Removing a source.** Remove the bullet only when no `principles.md`
   still cites the source. Verify with
   `rg '<source-key>/' skills/*/principles.md` before removing.
3. **Renaming a source.** If a source's citation key changes
   (per `CITATION-SCHEME.md`), the README bullet's wording stays the
   same; the key change is internal.
4. **Order.** Bullets follow the rough order: namesake (*97 Things*) first,
   then sources by the trigger they primarily serve (refactoring →
   modeling → resilience → API → testing → ops/observability). Insert new
   sources where the topic fits, not at the end.

This list is user-facing copy. Apply `humanizer` discipline: no
promotional language, no rule-of-three padding, no AI-vocabulary
words. The bullets exist to credit authors and orient curious readers,
not to market the project.

## Multi-harness adapter pattern

Adding a new harness (Cursor, Codex, Gemini) is gated by the harness
scope policy (Rule 8 above; see `CONTRIBUTE.md` for the full policy).
When a future harness *does* clear the bar, it adds its own adapter, not
edits to `skills/`:

- **OpenCode** loads via `.opencode/plugins/97.js`. The plugin registers
  the `skills/` directory and injects `using-97/SKILL.md` (with a tool-name
  translation appendix) into the first user message.
- **Claude Code** and **Copilot CLI** load via `.claude-plugin/plugin.json`
  and the `hooks/session-start.mjs` SessionStart hook. The hook injects
  the same `using-97/SKILL.md` content as session context. Copilot CLI
  uses Claude Code's plugin format directly — no separate manifest.
- **Future harnesses** (post-bar) would add their own manifest (e.g.
  `.cursor-plugin/`, `gemini-extension.json`) and their own
  bootstrap-injection mechanism. The harness-neutral `skills/` directory
  is the single source of truth and never changes per-harness.

The bootstrap (`using-97/SKILL.md`) uses Claude Code-native tool names
because that's the largest target audience. OpenCode's adapter translates
them at injection time. New harnesses do the same translation in their
adapter if their tool names differ.

## AGENTS.md is the single source of truth

This file is the contributor-conventions document for AI agents working
on the 97 codebase. It is **not** shipped to plugin users — end users
get skill content through the plugin loader (`skills/`,
`.claude-plugin/`, `hooks/`, `.opencode/`).

Most modern coding agents (OpenCode, Copilot CLI, Cursor, Codex) read
`AGENTS.md` automatically. **Claude Code** does not — it reads
`CLAUDE.md`. If you contribute to 97 using Claude Code, manually load
this file at session start (e.g., paste it, `@AGENTS.md`, or
"read AGENTS.md before making changes").

The repo previously kept `AGENTS.md` and `CLAUDE.md` byte-identical
with a smoke-test enforcement. That was dropped in v0.3
(`decide-agents-claude-md-strategy`, revised) — these are
contributor-facing docs and the maintenance tax of two files exceeded
the value of automatic Claude Code priming. Smoke now actively rejects
a re-introduced `CLAUDE.md` to prevent drift.

**Revisit when** Anthropic adopts `AGENTS.md`, the ecosystem
standardizes on a single name, or a real contributor-flow problem
emerges from Claude Code users not getting these conventions.

## Releases (manual only)

Releases are NOT automatic. The release process is documented in
`CONTRIBUTE.md` and must be carried out manually — either by a human
following the steps, or by an agent explicitly instructed to perform a
release using those steps. The release commit reviews the changelog,
decides the semver bump, bumps all three manifest versions in lockstep,
tags the commit, and pushes. Don't take any of those steps as part of
unrelated feature work.

## Where the deeper rules live

- Voice and writing style: `humanizer` skill (in superpowers)
- Skill template structure: `skills/before-you-refactor/SKILL.md` (the
  original) and `skills/domain-modeling/SKILL.md` (the cleanest follow-on)
- Lint constraints: `scripts/lint-skills.mjs` (`SKILL_RULES` constant)
- Citation/principle-ID scheme: `CITATION-SCHEME.md`
- Distribution and release: `CONTRIBUTE.md`
- Source-essay attribution policy: `CONTENT-LICENSE.md`
