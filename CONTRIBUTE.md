# Contributing to 97

This document covers everything past the README: how the repo is laid out,
how to develop locally, the changelog discipline, the release process, the
CI/CD pipeline, and how the auto-update mechanism works for end users.

If you're an AI agent (Claude Code, Copilot CLI, OpenCode subagent, etc.),
read [`AGENTS.md`](./AGENTS.md) first — it's the short imperative version of
the rules in this document.

---

## 1. What this repo is

`97` is an **OpenCode plugin** that ships behavior-shaping skills distilled
from *97 Things Every Programmer Should Know* (O'Reilly, ed. Kevlin Henney).
It is not an installer or configurator — it is loaded by OpenCode at runtime
from a git URL pin in the user's `opencode.jsonc`.

This is a deliberate design choice. The reference distribution model
([`oh-my-opencode-slim`](https://github.com/alvinunreal/oh-my-opencode-slim))
takes a different shape — it publishes to npm and runs an imperative
installer that mutates `opencode.json` and `tui.json`. We chose the plugin
model instead because it follows the
[`superpowers`](https://github.com/obra/superpowers) pattern: declarative,
loaded at runtime, no config-file mutation. Both models are valid; ours is
lighter-weight for a content-only plugin that ships skills rather than agent
configuration.

---

## 2. Repo layout

```
97/
├── .github/
│   └── workflows/
│       ├── test.yml       # CI: lint + smoke on push/PR
│       └── release.yml    # CI: GitHub Release on v* tag
├── .opencode/
│   └── plugins/
│       └── 97.js          # OpenCode plugin entry; ~150 lines, zero deps
├── bin/
│   └── update.mjs         # npx-runnable update script for end users
├── scripts/
│   ├── lint-skills.mjs    # Structural lint for skills/*
│   └── smoke-load.mjs     # Imports the plugin, exercises hooks
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
├── AGENTS.md
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

---

## 3. Local development

```sh
npm test          # lint + smoke
npm run lint      # structural lint of skills/
npm run smoke     # imports the plugin and exercises hooks
```

Zero runtime dependencies. Both scripts use Node built-ins only. Node ≥ 18.

### Cross-platform support

CI runs the test suite on Ubuntu, macOS, and Windows across Node 18, 20, and
22 (matrix in `.github/workflows/test.yml`). Code paths that touch the
filesystem use platform-aware resolution:

- The plugin's version-check cache lives at `$XDG_CACHE_HOME/97/`,
  `~/Library/Caches/97/`, or `%LOCALAPPDATA%\97\Cache\` depending on platform.
- `bin/update.mjs` searches platform-appropriate locations for
  `opencode.jsonc` (see §9).
- `npx github:oribarilan/97 update` works on all three platforms — npm's
  `bin` field generates a `.cmd` shim on Windows so the missing shebang
  isn't an issue.

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
hook registers the skills directory.

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

```markdown
### Added
- `error-and-correctness-traps` now covers `0.1 + 0.2 != 0.3` as a worked
  example for the Numerics sub-section.

### Changed
- `writing-clean-code` trigger description now includes "naming a new entity"
  to fire on rename-across-files of a public symbol.
```

### When you don't need a changelog entry

Pure internal refactors, dependency-free reorganizations, and CI tweaks that
don't change behavior do not need entries. When in doubt, add one.

---

## 5. Versioning (SemVer)

`package.json` `version` is the source of truth. Git tags are `v` + the
package version (e.g., `v0.1.0`).

We follow [Semantic Versioning](https://semver.org/spec/v2.0.0.html):

- **PATCH** (`0.1.0` → `0.1.1`): Bug fixes, doc-only changes, internal
  refactors that don't affect a user observing the plugin from outside.
- **MINOR** (`0.1.0` → `0.2.0`): New skills, new principles within an
  existing skill, new triggers, new opt-in features. Backward compatible.
- **MAJOR** (`0.1.0` → `1.0.0`): Removed skills, renamed skills, changed
  trigger descriptions in ways that break existing user expectations,
  loader API changes, breaking config changes.

A skill that ships fewer principles than before is a **MAJOR** bump. A
skill whose trigger fires in fewer situations than before is a **MAJOR**
bump. We err on the side of MAJOR for anything user-visible that an
existing pin would notice.

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
   Update the link references at the bottom of the file:

   ```markdown
   [Unreleased]: https://github.com/oribarilan/97/compare/vX.Y.Z...HEAD
   [X.Y.Z]: https://github.com/oribarilan/97/releases/tag/vX.Y.Z
   [previous]: ...unchanged...
   ```

4. **Bump `package.json` version.**

   ```sh
   npm version X.Y.Z --no-git-tag-version
   ```

   `--no-git-tag-version` is important — we tag manually after committing
   the changelog so both land in the same commit.

5. **Run the full test suite.**

   ```sh
   npm test
   ```

6. **Commit, tag, push.**

   ```sh
   git add CHANGELOG.md package.json package-lock.json
   git commit -m "release: vX.Y.Z"
   git tag vX.Y.Z
   git push origin main vX.Y.Z
   ```

7. **CI takes over.** The `release.yml` workflow triggers on the tag push,
   runs the test suite once more for safety, and creates a GitHub Release
   with notes pulled from the matching `CHANGELOG.md` section.

8. **Verify the release.** Visit
   `https://github.com/oribarilan/97/releases` and confirm the `vX.Y.Z`
   release exists with the correct notes.

### Hotfix releases

For an urgent bug fix that should ship without waiting for unreleased
features:

1. Branch from the latest tag (`git checkout -b hotfix/X.Y.Z+1 vX.Y.Z`).
2. Cherry-pick or write the fix.
3. Bump PATCH version.
4. Add a `### Fixed` entry directly under a new `## [X.Y.Z+1]` heading
   (skip Unreleased for hotfixes — they're surgical).
5. Commit, tag, push as above.
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
- `npm test` (lint + smoke)

A red CI job blocks merge to `main`.

### `.github/workflows/release.yml` — runs on `v*` tag push

Triggers: push of any tag matching `v*` (e.g., `v0.1.0`, `v1.2.3`).
Jobs:
- Checkout (with full history so the changelog parser can read old tags)
- Run `npm test` once more as a safety gate
- Extract the matching section from `CHANGELOG.md` (the section whose
  heading matches the tag, e.g., `## [0.1.0]`)
- Create a GitHub Release with that text as the body, marking it as the
  latest release

### What CI does NOT do

- **No publish to npm.** We distribute via git tag only (see §8). If we
  ever publish to npm, that becomes a third workflow with manual
  `workflow_dispatch` trigger, NPM_TOKEN secret, and explicit `npm publish`.
- **No auto-tagging.** Tags are created by humans during the release
  process. CI never bumps versions on its own.
- **No auto-merging.** Dependabot or similar bots are not enabled. There
  are zero runtime dependencies to update.

---

## 8. Distribution

We distribute via **git tag only**. Users add this to their OpenCode config
file (`~/.config/opencode/opencode.jsonc` on Linux/macOS,
`%APPDATA%\opencode\opencode.jsonc` on Windows):

```jsonc
{
  "plugin": [
    "97@git+https://github.com/oribarilan/97.git#v0.1.0"
  ]
}
```

OpenCode resolves the URL, fetches the repo at the pinned tag, and loads
`.opencode/plugins/97.js`. The pin (`#v0.1.0`) is what makes behavior
reproducible across sessions — without it, OpenCode would float on `main`
and any commit could ship to users immediately.

### Why not npm?

`oh-my-opencode-slim` distributes via npm and runs an imperative installer.
That model fits a configurator that owns parts of `opencode.json`. It
doesn't fit a plugin that's loaded declaratively by OpenCode itself. Going
to npm would also add publish friction (account, 2FA, namespace) without
giving users a meaningfully better experience. We can revisit if a real
need appears.

### Pinning recommendations for users

| Pin style | Use when |
|---|---|
| `#v0.1.0` (specific tag) | Default. Reproducible. **Recommended.** |
| `#main` | Active local development of the plugin itself. Not for production use. |
| No `#` (floating) | Don't. OpenCode's behavior depends on the latest commit, which makes session behavior unpredictable. |

---

## 9. Auto-update mechanism

The plugin checks GitHub Releases on session start (cached for 24 hours)
and prints a one-line notice when a newer release is available. The notice
points users at the update command. **The plugin never modifies the user's
`opencode.jsonc` on its own** — auto-update is opt-in, manual, one command.

This is structurally similar to `oh-my-opencode-slim`'s "re-run the
installer" UX, adapted for our plugin model. omo-slim users update by
re-running `bunx oh-my-opencode-slim@latest install`. Our users update by
running `npx github:oribarilan/97 update`.

### How the version check works

1. On the first user message of a session, the plugin's
   `experimental.chat.messages.transform` hook runs.
2. After injecting the bootstrap, the hook calls a `checkForUpdate()`
   helper that:
   - Reads `~/.cache/97/version-check.json` if it exists.
   - If the cache is younger than 24 hours, uses its `latestVersion` value.
   - Otherwise, makes one HTTPS GET to
     `https://api.github.com/repos/oribarilan/97/releases/latest`,
     extracts `tag_name`, writes the cache file, and uses that value.
3. If `latestVersion` is greater than `package.json` `version` (semver
   comparison), the bootstrap text gains one extra line:

   ```
   📦 97 v0.2.0 is available (you're on v0.1.0). Run
   `npx github:oribarilan/97 update` to upgrade.
   ```

### Failure modes — all silent

- **Offline.** Fetch fails. No notice, no error. Cache file isn't updated.
  Next session retries.
- **GitHub API rate-limited.** Fetch returns 403. Same as offline.
- **Cache file unreadable.** Treated as cache miss; fetch as normal.
- **`package.json` unreadable.** Skip the check entirely.

### How to disable the version check

Set the environment variable `NINETYSEVEN_DISABLE_VERSION_CHECK=1`. The
plugin still loads normally; only the network call and the notice are
skipped. Per-shell syntax:

| Shell | Command |
|---|---|
| bash / zsh | `export NINETYSEVEN_DISABLE_VERSION_CHECK=1` |
| Windows cmd | `set NINETYSEVEN_DISABLE_VERSION_CHECK=1` |
| PowerShell | `$env:NINETYSEVEN_DISABLE_VERSION_CHECK = "1"` |

### Cache file location

The 24-hour cache is platform-aware:

| Platform | Cache path |
|---|---|
| Linux | `$XDG_CACHE_HOME/97/version-check.json` or `~/.cache/97/version-check.json` |
| macOS | `~/Library/Caches/97/version-check.json` |
| Windows | `%LOCALAPPDATA%\97\Cache\version-check.json` (falls back to `%APPDATA%\97\Cache\` if `LOCALAPPDATA` is unset) |

Delete the cache file to force a fresh check on the next session.

### How the update command works

`npx github:oribarilan/97 update` runs `bin/update.mjs`, which:

1. Locates the user's `opencode.jsonc`. Searches in order:
   - `$OPENCODE_CONFIG_DIR/opencode.jsonc`
   - `$XDG_CONFIG_HOME/opencode/opencode.jsonc`
   - `~/.config/opencode/opencode.jsonc` (Linux/macOS default)
   - `~/.opencode/opencode.jsonc`
   - macOS: `~/Library/Application Support/opencode/opencode.jsonc`
   - Windows: `%APPDATA%\opencode\opencode.jsonc`
   - Or `--config <path>` if specified.
2. Finds the line matching `97@git+https://github.com/oribarilan/97.git#...`
   using a regex (the file is JSONC, so we don't try to JSON.parse — that
   would strip comments).
3. Fetches the latest release tag via the GitHub API.
4. If the pinned tag matches the latest, exits with "Already up to date."
5. Otherwise, replaces the pinned tag with the new one, writes the file
   back, and prints a diff plus "Restart OpenCode to apply."

### Update command flags

```
--config <path>   Override the opencode.jsonc location.
--dry-run         Show what would change, don't write anything.
--version <tag>   Pin to a specific version (e.g., --version v0.1.0).
                  Useful for downgrades or specific-version testing.
--help            Print usage.
```

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
| Run tests | `npm test` |
| Lint only | `npm run lint` |
| Smoke only | `npm run smoke` |
| Bump version (no tag) | `npm version X.Y.Z --no-git-tag-version` |
| Tag a release | `git tag vX.Y.Z && git push origin vX.Y.Z` |
| Update an installed plugin | `npx github:oribarilan/97 update` |
| Disable version check (bash/zsh) | `export NINETYSEVEN_DISABLE_VERSION_CHECK=1` |
| Disable version check (PowerShell) | `$env:NINETYSEVEN_DISABLE_VERSION_CHECK = "1"` |

For agent-specific conventions, see [`AGENTS.md`](./AGENTS.md).
For licensing and attribution, see [`CONTENT-LICENSE.md`](./CONTENT-LICENSE.md).
