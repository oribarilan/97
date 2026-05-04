# Contributing to 97

This document covers everything past the README: how the repo is laid out,
how to develop locally, the changelog discipline, the release process, the
CI/CD pipeline, and the multi-harness adapter pattern.

If you're an AI agent (Claude Code, Copilot CLI, OpenCode subagent, etc.),
read [`AGENTS.md`](./AGENTS.md) first — it's the short imperative version of
the rules in this document.

---

## 1. What this repo is

`97` is a multi-harness coding-agent plugin that ships behavior-shaping
skills distilled from *97 Things Every Programmer Should Know* (O'Reilly,
ed. Kevlin Henney). The same `skills/` directory is loaded by three
supported harnesses today:

- **Claude Code** — via the [Claude Code plugin format](https://docs.claude.com/en/docs/claude-code/plugins) (`.claude-plugin/`)
- **GitHub Copilot CLI** — uses Claude Code's plugin format directly
- **OpenCode** — via the OpenCode plugin API (`.opencode/plugins/`)

This is the multi-harness adapter pattern pioneered by
[`superpowers`](https://github.com/obra/superpowers): a single
harness-neutral `skills/` directory at the source of truth, with thin
per-harness adapter manifests at the repo root. Adding a new harness
(Cursor, Codex, Gemini) is an additive change — drop in a new manifest and
bootstrap-injection mechanism, leave `skills/` alone.

---

## 2. Repo layout

```
97/
├── .github/
│   └── workflows/
│       ├── test.yml       # CI: lint + smoke on push/PR (Linux/macOS/Windows × Node 18/20/22)
│       └── release.yml    # CI: GitHub Release on v* tag
├── .claude-plugin/        # Claude Code + Copilot CLI manifests
│   ├── plugin.json
│   └── marketplace.json
├── .opencode/
│   └── plugins/
│       └── 97.js          # OpenCode plugin entry; ~130 lines, zero deps
├── hooks/                 # SessionStart bootstrap injector for Claude Code / Copilot CLI
│   ├── hooks.json
│   ├── session-start      # POSIX bash; emits JSON context injection
│   └── run-hook.cmd       # Windows polyglot shim (cmd.exe ↔ bash)
├── scripts/
│   ├── lint-skills.mjs    # Structural lint for skills/*
│   └── smoke-load.mjs     # Imports the plugin, exercises hooks, parses manifests
├── skills/
│   ├── using-97/          # Bootstrap (always loaded)
│   ├── before-you-refactor/
│   ├── writing-clean-code/
│   ├── domain-modeling/
│   ├── api-and-interface-design/
│   ├── testing-discipline/
│   ├── pre-commit-self-review/
│   ├── error-and-correctness-traps/
│   ├── build-deploy-and-tooling/
│   └── working-with-users-and-team/
├── AGENTS.md              # short imperative rules for agents
├── CLAUDE.md              # byte-identical copy of AGENTS.md (Claude Code reads this name)
├── CHANGELOG.md
├── CONTENT-LICENSE.md
├── CONTRIBUTE.md          # ← you are here
├── LICENSE
├── README.md
└── package.json
```

Each themed skill directory contains two files: `SKILL.md` (loaded into
agent context when the trigger fires) and `principles.md` (long-form
reference, loaded only when the agent needs the deep cut on a specific
principle).

`AGENTS.md` and `CLAUDE.md` are **two real files with byte-identical
content** — not a symlink. Git on Windows defaults to
`core.symlinks=false`, which would check out a symlink as a 9-byte text
file containing the literal string `AGENTS.md` and silently break Claude
Code on Windows. The smoke check enforces byte equality.

---

## 3. Local development

We use [`just`](https://github.com/casey/just) as the local task runner.
Run `just` (no args) to list available recipes:

```sh
just            # list available recipes
just check      # everything CI runs: lint + format-check + smoke
just test       # smoke test only (loads plugin, asserts manifest invariants)
just lint       # structural lint of skills/
just format     # prettier --write on JS/JSON/YAML
just format-check  # prettier --check (non-mutating)
just clean      # remove node_modules and prettier cache
```

CI uses `npm test` directly so it doesn't need `just` installed; the
`justfile` recipes are thin wrappers over the same `npm` scripts. If you
prefer npm:

```sh
npm test                 # same as `just check`
npm run lint             # same as `just lint`
npm run smoke            # same as `just test`
npm run format           # same as `just format`
npm run format:check     # same as `just format-check`
```

One devDependency: `prettier`. Zero runtime dependencies. Both lint and
smoke scripts use Node built-ins only. Node ≥ 18.

### Prettier scope

Prettier formats `**/*.{js,mjs,cjs,json,yml,yaml}`. Markdown is **not**
formatted automatically:

- `skills/**/*.md` have lint-enforced line budgets (`scripts/lint-skills.mjs`)
  and careful prose layout that Prettier would re-flow.
- Root `*.md` files (README, CONTRIBUTE, AGENTS, CLAUDE, CHANGELOG) are
  hand-managed for clarity. `CLAUDE.md` must stay byte-identical to
  `AGENTS.md` (smoke check) — letting Prettier near them adds drift risk.

`.prettierignore` is the source of truth for what's excluded.

### Cross-platform support

CI runs the test suite on Ubuntu, macOS, and Windows across Node 18, 20, and
22 (matrix in `.github/workflows/test.yml`). Code paths that touch the
filesystem use platform-aware resolution. `hooks/run-hook.cmd` is the
reference cross-platform pattern: a polyglot file that's a Windows batch
script in one frame and a bash no-op in the other, locating Git for
Windows bash on Windows hosts and exiting silently if no bash is available.

If you add code that touches the filesystem, an environment variable, or a
shell command, make sure it works on all three platforms or branch on
`process.platform`.

### Lint constraints

`scripts/lint-skills.mjs` enforces, per skill:

- Frontmatter parses and contains `name` and `description`
- `description` starts with `Use when`
- Skill directory name matches frontmatter `name`
- Required section headers are present (varies per skill)
- A markdown table follows the `Red Flags` heading
- Line count ≤ per-skill budget
- If `principles.md` exists, every required principle number appears in it

The `SKILL_RULES` constant at the top of `lint-skills.mjs` is the source of
truth. To add a new skill, add an entry there.

### Smoke test

`scripts/smoke-load.mjs` imports `.opencode/plugins/97.js`, asserts the
named export exists, calls the plugin factory, and verifies the `config`
hook registers the skills directory. It also:

- JSON-parses `.claude-plugin/plugin.json` and `.claude-plugin/marketplace.json`
- Asserts version equality across `package.json`, `plugin.json`, and `marketplace.json[plugins[0]]`
- Asserts byte-equality of `AGENTS.md` and `CLAUDE.md`

These invariants are load-bearing: drift breaks at least one harness
silently. The smoke check turns drift into a CI failure.

---

## 4. Changelog discipline (Keep a Changelog)

We follow the [Keep a Changelog](https://keepachangelog.com/en/1.1.0/)
format. The top section of `CHANGELOG.md` is always `## [Unreleased]`.

### When you add a feature, fix, or doc change

Add an entry to the appropriate `### Subsection` of `[Unreleased]` **in the
same PR** as the change:

| Subsection | Use for |
|---|---|
| `### Added` | New skills, new principles, new tooling |
| `### Changed` | Behavior changes to existing skills or plugin |
| `### Deprecated` | Features still present but scheduled for removal |
| `### Removed` | Features removed in this release |
| `### Fixed` | Bug fixes |
| `### Security` | Vulnerability fixes |
| `### Documentation` | README/CONTRIBUTE/AGENTS edits worth flagging |

### Style for changelog entries

- Past tense, reader's perspective, ends with a period.
- Name skills and files in backticks.
- One bullet per logical change. Don't pad.

### When you don't need a changelog entry

Pure internal refactors, dependency-free reorganizations, and CI tweaks that
don't change behavior do not need entries. When in doubt, add one.

---

## 5. Versioning (SemVer)

Three places carry the plugin version, all of which must stay in sync:

1. `package.json` `version`
2. `.claude-plugin/plugin.json` `version`
3. `.claude-plugin/marketplace.json` `plugins[0].version`

`scripts/smoke-load.mjs` enforces equality on every `npm test`. The
`release.yml` workflow re-asserts equality before tagging. Drift is a CI
failure, not a runtime bug.

Git tags are `v` + the package version (e.g., `v0.2.0`). We follow
[Semantic Versioning](https://semver.org/spec/v2.0.0.html):

- **PATCH** (`0.2.0` → `0.2.1`): Bug fixes, doc-only changes, internal
  refactors that don't affect a user observing the plugin from outside.
- **MINOR** (`0.2.0` → `0.3.0`): New skills, new principles within an
  existing skill, new triggers, new harnesses, new opt-in features.
  Backward compatible.
- **MAJOR** (`0.2.0` → `1.0.0`): Removed skills, renamed skills, changed
  trigger descriptions in ways that break existing user expectations,
  loader API changes, breaking config changes.

A skill that ships fewer principles than before is a **MAJOR** bump. A
skill whose trigger fires in fewer situations than before is a **MAJOR**
bump. We err on the side of MAJOR for anything user-visible.

---

## 6. The release process

Releases are deliberate, human-driven, and never automatic. Agents must not
perform releases.

### Step-by-step

1. **Verify `[Unreleased]` is complete.** Read `CHANGELOG.md` top to bottom.
   Every user-facing change since the previous tag should have an entry.
   Add anything missing.

2. **Decide the version bump.** Use the SemVer rules above. If unsure
   between PATCH and MINOR, go MINOR.

3. **Update the changelog.** Replace the `## [Unreleased]` heading with:

   ```markdown
   ## [Unreleased]

   ## [X.Y.Z] — YYYY-MM-DD
   ```

   Keep `[Unreleased]` empty (it stays at the top, ready for the next round).
   Update the link references at the bottom of the file.

4. **Bump the version in all three places, in lockstep.** They must match
   exactly or `npm test` will fail:

   - `package.json` `version`
   - `.claude-plugin/plugin.json` `version`
   - `.claude-plugin/marketplace.json` `plugins[0].version`

   ```sh
   npm version X.Y.Z --no-git-tag-version    # bumps package.json only
   # then hand-edit the two .claude-plugin/*.json files to match
   ```

5. **Run the full test suite.**

   ```sh
   just check    # or: npm test
   ```

   This asserts version equality across the three manifests, byte-equality
   of `AGENTS.md` / `CLAUDE.md`, structural lint, and Prettier formatting.

6. **Commit, tag, push.** Use the `Release vX.Y.Z: <one-line summary>`
   commit message convention (mirrors superpowers; the commit message is
   how downstream readers spot release commits at a glance):

   ```sh
   git add CHANGELOG.md package.json .claude-plugin/
   git commit -m "Release vX.Y.Z: <one-line summary>"
   git tag vX.Y.Z
   git push origin main vX.Y.Z
   ```

7. **CI takes over.** The `release.yml` workflow triggers on the tag push,
   re-asserts version equality, runs the test suite, and creates a GitHub
   Release with notes pulled from the matching `CHANGELOG.md` section.

8. **Verify the release.** Visit
   `https://github.com/oribarilan/97/releases` and confirm the `vX.Y.Z`
   release exists with the correct notes.

### Hotfix releases

For an urgent bug fix that should ship without waiting for unreleased
features:

1. Branch from the latest tag (`git checkout -b hotfix/X.Y.Z+1 vX.Y.Z`).
2. Cherry-pick or write the fix.
3. Bump PATCH version in all three places.
4. Add a `### Fixed` entry directly under a new `## [X.Y.Z+1]` heading.
5. Commit (using the `Release vX.Y.Z+1: <summary>` convention), tag, push.
6. Merge the hotfix branch back into `main`.

---

## 7. CI/CD pipeline

Two GitHub Actions workflows.

### `.github/workflows/test.yml` — runs on every push and PR

Triggers: push to any branch, pull request to `main`.
Jobs:
- Checkout
- Set up Node (matrix: 18, 20, 22 — the OpenCode-supported range)
- `npm ci` (zero deps, but ensures clean state)
- `npm test` (lint + smoke, including manifest version equality and `AGENTS.md` / `CLAUDE.md` byte equality)

Matrix: Ubuntu, macOS, Windows. A red CI job on any platform blocks merge to
`main`.

### `.github/workflows/release.yml` — runs on `v*` tag push

Triggers: push of any tag matching `v*` (e.g., `v0.2.0`).
Jobs:
- Checkout (with full history so the changelog parser can read old tags)
- Run `npm test` once more as a safety gate
- Verify tag matches `package.json` `version`
- Verify version equality across `package.json`, `.claude-plugin/plugin.json`,
  and `.claude-plugin/marketplace.json[plugins[0]]`
- Extract the matching section from `CHANGELOG.md`
- Create a GitHub Release with that text as the body, marking it as the
  latest release

### What CI does NOT do

- **No publish to npm.** We distribute via git tag (OpenCode) and via the
  in-repo Claude Code marketplace.
- **No auto-tagging.** Tags are created by humans during the release
  process. CI never bumps versions on its own.
- **No auto-merging.** Dependabot is not enabled. Zero runtime dependencies.

---

## 8. Distribution

### Per-harness install paths

| Harness | Install command(s) |
|---|---|
| Claude Code | `/plugin marketplace add oribarilan/97` then `/plugin install 97@97-marketplace` |
| GitHub Copilot CLI | `copilot plugin marketplace add oribarilan/97` then `copilot plugin install 97@97-marketplace` |
| OpenCode | Add `"97@git+https://github.com/oribarilan/97.git"` to `opencode.jsonc` `plugin` array |

### Marketplace strategy

`.claude-plugin/marketplace.json` lives in this repo (named
`97-marketplace`) and lists this repo as the marketplace source. We do
**not** maintain a sibling `oribarilan/97-marketplace` repo. Single source
of truth, single repo to keep in sync. Users `marketplace add oribarilan/97`
and that pulls both the marketplace listing and the plugin from the same
checkout.

### Asymmetric distribution model

This produces a deliberate asymmetry, accepted as the model:

| Harness | What "an update" means |
|---|---|
| OpenCode | Any commit on `main`. Users get it on next restart. |
| Claude Code | A version bump in `marketplace.json`. Users get it on `/plugin update 97`. |
| Copilot CLI | Same as Claude Code. |

A typo-fix commit reaches OpenCode users immediately but is invisible to
Claude/Copilot users until the next tagged release. That's fine — the
release commit is the unit of distribution for the marketplace harnesses,
and we batch accumulated changes into one tagged release commit (cadence
similar to superpowers: weekly to monthly).

The trade-off: a bad commit on `main` ships immediately to all OpenCode
users on next restart. Mitigation: CI gates merges to `main` across
Linux/macOS/Windows × Node 18/20/22, and every release commit
re-runs the full test suite before tagging.

---

## 9. Rollback playbook

If a bad commit lands on `main`:

1. **Revert it on `main`.** `git revert <bad-sha>` and merge. OpenCode
   users get the fix on next restart.
2. **For Claude Code / Copilot CLI users**, the bad commit was only
   visible if it was part of a tagged release. If it was, cut a new
   release (PATCH bump) with the revert included. Marketplace users get
   the fix via `/plugin update 97`.
3. **There is no canary, no release branch, no staged rollout.** Recovery
   is forward-only. Don't try to retroactively un-publish a tagged
   release; cut a new one.

This is the same model superpowers uses, and it works because the test
suite running against three OSes × three Node versions before merge
catches almost everything that would warrant a rollback.

---

## 10. Voice and content rules

Skill content is the user-facing surface of this repo. It must read as
written by a senior engineer giving rules — not a textbook, not an AI
draft.

The full rule set lives in the
[`humanizer`](https://github.com/obra/superpowers/tree/main/skills/humanizer)
skill (in superpowers). The short list:

- **No inflated AI vocabulary**: testament, pivotal, vital, landscape,
  tapestry, vibrant, enduring, crucial, essential, key (as adjective).
- **No copula avoidance**: use `is`/`are`, not `serves as`/`stands as`/
  `marks`/`boasts`.
- **No promotional language**: nestled, breathtaking, groundbreaking,
  seamless, robust, holistic.
- **No trailing -ing participle clauses** (`..., enabling X` /
  `..., highlighting Y`).
- **No rule-of-three padding**. Don't force ideas into groups of three.
- **No vague attributions** (`industry observers`, `experts argue`).
- **No knowledge-cutoff hedging**.
- **Em dashes in moderation** — fine for parenthetical/appositional use,
  not as a "punchy" rhythm trick.
- **The imperative voice in checklists and Red Flags is intentional.**
  Keep it terse and direct.

Source-essay attribution rules live in
[`CONTENT-LICENSE.md`](./CONTENT-LICENSE.md). The short version: paraphrase,
don't quote at length (~25 words is the soft limit), and credit the
original CC-BY-3.0 author with a link to their chapter on the canonical
source mirror.

---

## 11. Quick reference

| Task | Command |
|---|---|
| List recipes | `just` |
| Run all checks | `just check` (= `npm test`) |
| Lint only | `just lint` |
| Smoke only | `just test` |
| Format JS/JSON/YAML | `just format` |
| Check formatting | `just format-check` |
| Bump version (no tag) | `npm version X.Y.Z --no-git-tag-version` then update `.claude-plugin/*.json` |
| Tag a release | `git tag vX.Y.Z && git push origin vX.Y.Z` |

For agent-specific conventions, see [`AGENTS.md`](./AGENTS.md).
For licensing and attribution, see [`CONTENT-LICENSE.md`](./CONTENT-LICENSE.md).
