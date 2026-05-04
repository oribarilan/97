# US-v0.2-multi-harness

## Goal

Ship **97 v0.2.0** — multi-harness infrastructure plus working installs on
**Claude Code** and **GitHub Copilot CLI**, while keeping OpenCode behavior
intact for users.

This is the structural pivot the v0.1.0 design intentionally deferred: the
plugin so far has been OpenCode-only. v0.2.0 makes the skill content
portable across coding agents that follow the Claude Code plugin format
(Claude Code itself, Copilot CLI), and lays the groundwork for adding
Cursor / Codex / Gemini in later versions.

The design mirrors the [`obra/superpowers`](https://github.com/obra/superpowers)
multi-harness pattern: per-harness manifest files at the repo root, with a
single shared `skills/` directory as the source of truth. Superpowers
supports six harnesses today using exactly this layout.

## Definition of Done

The story is complete when **all** of the following are true:

- [ ] `oribarilan/97` repo at `v0.2.0` tag has working installs on:
  - [ ] Claude Code (via `/plugin marketplace add oribarilan/97` then
        `/plugin install 97@97-marketplace`)
  - [ ] GitHub Copilot CLI (via `copilot plugin marketplace add oribarilan/97`
        then `copilot plugin install 97@97-marketplace`)
  - [ ] OpenCode (via `97@git+https://github.com/oribarilan/97.git` — note
        no `#vX.Y.Z` pin, floating on `main`)
- [ ] In each of the three harnesses, asking the agent "what is 97?" returns
      a response that names the bundle and at least 5 of the 9 themed skills.
- [ ] In each of the three harnesses, asking the agent to "refactor this
      function" causes it to invoke the `before-you-refactor` skill before
      writing code. On Claude Code and Copilot CLI this is enabled by a
      `hooks/session-start` bootstrap (see Architecture below); on OpenCode
      it continues to be enabled by the existing `chat.messages.transform`
      injection in `.opencode/plugins/97.js`.
- [ ] `using-97/SKILL.md` is rewritten to use Claude Code-native tool names
      (`Read`, `Write`, `Edit`, `Bash`, `Task`, `TodoWrite`, `Skill`). The
      OpenCode plugin's tool-mapping appendix translates these to OpenCode
      equivalents at injection time. Result: one source-of-truth bootstrap.
      The SKILL.md body is audited for any remaining OpenCode-isms (e.g.
      "Use OpenCode's skill tool") — those move to the OpenCode adapter or
      are reworded harness-neutral.
- [ ] All v0.1.0 pin/notice/auto-update infrastructure is **deleted**:
      `bin/update.mjs`, the version-check code in `.opencode/plugins/97.js`,
      the `~/.cache/97/` cache, the `npx github:oribarilan/97 update`
      documentation, the `bin/` directory itself if empty,
      `NINETYSEVEN_DISABLE_VERSION_CHECK` references everywhere.
- [ ] `AGENTS.md` and `CLAUDE.md` are **two real files with byte-identical
      content**. A lint check enforces equality on every `npm test`. (No
      symlinks — Git on Windows defaults to `core.symlinks=false` and would
      check out the symlink as a 9-byte text file containing "AGENTS.md",
      breaking the cross-platform mandate.)
- [ ] `.claude-plugin/plugin.json` and `.claude-plugin/marketplace.json`
      exist with the correct schema (verified against superpowers' versions).
      The marketplace `name` is `97-marketplace`; the plugin `name` is `97`.
- [ ] `hooks/hooks.json`, `hooks/session-start`, and `hooks/run-hook.cmd`
      exist (mirroring superpowers' Windows-polyglot pattern). The
      session-start hook injects the `using-97` bootstrap into Claude Code
      and Copilot CLI sessions. The hook works on Linux, macOS, and Windows.
- [ ] Version equality is enforced across all manifests: `package.json`
      `version`, `.claude-plugin/plugin.json` `version`, and
      `.claude-plugin/marketplace.json` `plugins[0].version` must all match.
      Either `scripts/lint-skills.mjs` or `scripts/smoke-load.mjs` (or a
      new dedicated script wired into `npm test`) parses all three and
      asserts equality.
- [ ] `scripts/smoke-load.mjs` is extended to JSON-parse
      `.claude-plugin/plugin.json` and `.claude-plugin/marketplace.json`
      (today it only loads the OpenCode plugin).
- [ ] `package.json` is fully cleaned up:
      - `version` is `0.2.0`
      - `bin` field removed
      - `bin/` removed from `files` array
      - `description` reworded to mention all three harnesses (currently
        says "OpenCode plugin")
      - `.claude-plugin/`, `hooks/`, `CLAUDE.md`, `AGENTS.md` added to
        `files` array as appropriate
      - `main` continues pointing at the OpenCode plugin (harmless for
        Claude/Copilot — documented so reviewers don't "fix" it)
- [ ] `README.md` is the **single source of truth for install
      instructions**, documenting all three install paths (Claude Code,
      Copilot CLI, OpenCode) inline with the OpenCode default switched to
      floating. No separate `docs/README.*.md` files, no `.opencode/INSTALL.md`.
- [ ] `CHANGELOG.md` has a populated `[0.2.0]` section listing every
      user-visible change. `[Unreleased]` returns to empty.
- [ ] `CONTRIBUTE.md` updated: §1 mentions the three supported harnesses,
      §6 documents the three-place version-bump checklist and the
      `Release vX.Y.Z: <summary>` commit message convention, §8
      documents the per-harness install paths and the asymmetric
      distribution model (continuous on OpenCode vs version-bump-gated
      on Claude/Copilot marketplaces), §9 (auto-update) is rewritten or
      removed, the multi-harness adapter pattern is documented for
      future contributors, the rollback playbook for a bad `main`
      commit is documented (revert + merge; OpenCode users get the fix
      on next restart).
- [ ] `AGENTS.md` updated: the rule about "don't hardcode OpenCode-isms
      outside `.opencode/`" is now real, not aspirational. Add it to the
      rules list.
- [ ] `.github/workflows/release.yml` adds a step asserting version
      equality across the three manifests before tagging.
- [ ] All `npm test` checks (lint + smoke) pass on Linux, macOS, and Windows
      (CI matrix already covers this).
- [ ] `package.json` `version` is `0.2.0`. Git tag `v0.2.0` exists and the
      `release.yml` workflow has fired successfully on push.
- [ ] Greenfield audit: a fresh
      `rg -i 'v0\.1|legacy|deprecat|migrat|backward|update\.mjs|NINETYSEVEN_DISABLE|\.cache/97|version-check'
      README.md CONTRIBUTE.md AGENTS.md CHANGELOG.md skills/using-97/`
      returns nothing except the historical `[0.1.0]` section in
      CHANGELOG.md. No deprecation notices, no migration mentions, no
      "previously" or "old install" references in user-facing docs, no
      stray references to the removed update infrastructure.

## Cross-Cutting Concerns

### No legacy compatibility (greenfield mandate)

**There are zero users of v0.1.0.** The v0.1.0 commit exists in the repo's
git history as a milestone marker, but the tag was never pushed publicly,
no one has installed it, and there is no install base to protect.

This means v0.2.0 is, in practice, the first public release. The repo is
greenfield. We design forward, not for compatibility with a past that
nobody is living in.

**Concrete anti-goals derived from this:**

- **No migration shims.** Don't write code that detects "user is on v0.1.0,
  do the old thing." There are no users on v0.1.0.
- **No deprecation warnings.** Don't print "this is deprecated, please
  upgrade." Just delete the old thing.
- **No "old install path" docs.** README/CONTRIBUTE describe the v0.2.0
  way only. The v0.1.0 way is gone, not "still supported."
- **No compatibility branches in the plugin code.** No `if (version < 0.2.0)`
  paths. Code reflects the current design, period.
- **No vestigial files.** If `bin/update.mjs` is no longer in the design,
  delete the file. Don't leave it as "for users who want the old behavior."
- **Don't reframe v0.1.0 in the changelog as "deprecated."** The `[0.1.0]`
  CHANGELOG section stands as the historical record of what shipped at
  that point. We don't go back and edit it.
- **Future framings.** v0.2.0 release notes should describe what 97 IS,
  not "what changed since v0.1.0." Treat the README, CONTRIBUTE, and
  AGENTS as if a new contributor is reading them for the first time and
  has never seen the v0.1.0 shape.

The v0.1.0 git tag (if it ever gets pushed) and the `[0.1.0]` CHANGELOG
section are the only acknowledgement of v0.1.0's existence in v0.2.0+.
Everything else operates as if v0.2.0 is "how 97 has always worked."

### Architecture: per-harness manifests at root (mirror superpowers)

Single repo, single `skills/` directory, multiple thin adapter manifests at
the repo root. No subdirectory restructure — `skills/`, `scripts/`, and
`.opencode/` stay where they are.

Final layout:

```
97/
├── skills/                          # unchanged — portable source of truth
│                                    # (using-97/SKILL.md is REWRITTEN to be
│                                    #  Claude-native; other 9 skills unchanged)
├── scripts/                         # lint + smoke; extended to verify
│                                    # manifest version equality and CLAUDE.md
│                                    # / AGENTS.md content equality
├── .opencode/
│   └── plugins/
│       └── 97.js                    # SIMPLIFIED — version-check code removed
├── .claude-plugin/                  # NEW
│   ├── plugin.json                  #   manifest used by BOTH Claude Code AND Copilot CLI
│   └── marketplace.json             #   marketplace metadata (name: 97-marketplace);
│                                    #   lists this plugin pointing at "./"
├── hooks/                           # NEW (mirrors superpowers)
│   ├── hooks.json                   #   declares session-start hook
│   ├── session-start                #   POSIX bootstrap injector
│   └── run-hook.cmd                 #   Windows polyglot shim
├── AGENTS.md                        # canonical agent guidance
├── CLAUDE.md                        # NEW — REAL FILE, byte-identical to AGENTS.md
│                                    # (NOT a symlink; see DoD for rationale)
├── CHANGELOG.md                     # [0.2.0] populated
├── CONTRIBUTE.md                    # updated §1, §8, §9; adds rollback playbook
├── CONTENT-LICENSE.md               # unchanged
├── README.md                        # rewritten install section: 3 paths inline
├── LICENSE                          # unchanged
├── package.json                     # version 0.2.0, no `bin` field, three-harness description
└── .github/workflows/               # test.yml unchanged; release.yml adds version-equality assertion
```

### Why Copilot CLI is "free" with Claude Code (PENDING SPIKE)

GitHub Copilot CLI is reported to use Claude Code's plugin format directly
— same `.claude-plugin/plugin.json`, same marketplace pattern. This is a
**load-bearing assumption** for v0.2.0 and is verified by **task 0
(spike)** before any other work begins. If the spike fails or surfaces
non-trivial Copilot-specific quirks, Copilot CLI is descoped to v0.3.0
and DoD adjusts to two harnesses.

### Update model: float on `main` everywhere

OpenCode default install changes from `97@git+https://github.com/oribarilan/97.git#v0.1.0`
to `97@git+https://github.com/oribarilan/97.git`. OpenCode pulls the latest
commit on each restart. Users who want reproducibility can still pin
manually (`#vX.Y.Z`), and we document this as an advanced option in
`README.md` — but the v0.1.0 helper script and version-check code are
removed.

For Claude Code and Copilot CLI: marketplaces handle updates natively. No
work for us.

Trade-off accepted: a bad release ships immediately to all OpenCode users
on next restart. Mitigation: CI gates merges to `main`; we don't merge
unless lint+smoke is green on Ubuntu/macOS/Windows × Node 18/20/22.

**Rollback playbook** (documented in CONTRIBUTE.md §9): if a bad commit
lands on `main`, revert the offending commit and merge the revert. OpenCode
users get the fix on next restart. There is no canary, no release branch,
no staged rollout — recovery is forward-only.

**Release commit = unit of distribution for marketplace harnesses.** Every
commit on `main` is "shipped" to OpenCode users on next restart, but
Claude Code and Copilot CLI users only see an update when
`marketplace.json` `plugins[0].version` changes. In practice this means
a tagged release commit bundles all accumulated changes since the last
tag into one version bump that the marketplaces actually surface as an
update. Mirror superpowers' cadence: weekly-to-monthly releases, each
its own commit that bumps all three versions and updates CHANGELOG in
one shot.

This produces a deliberate asymmetry, accepted as the model:

| Harness | What "an update" means |
|---|---|
| OpenCode | Any commit on `main`. Users get it on next restart. |
| Claude Code | A version bump in `marketplace.json`. Users get it on `/plugin update`. |
| Copilot CLI | Same as Claude Code. |

A typo-fix commit reaches OpenCode users immediately but is invisible
to Claude/Copilot users until the next tagged release. That is fine and
matches superpowers' working model.

**Commit message convention for release commits:** `Release vX.Y.Z:
<one-line summary>` (mirrors superpowers). Documented in CONTRIBUTE.md
§6 alongside the version-bump checklist.

### Bootstrap on Claude Code and Copilot CLI: session-start hook

Today `using-97/SKILL.md` was written OpenCode-first. It references
OpenCode's `skill` tool. With Claude Code and Copilot CLI as primary
targets, this gets inverted: rewrite to use Claude Code tool names
(`Read`, `Write`, `Edit`, `Bash`, `Task`, `TodoWrite`, `Skill`). The
OpenCode plugin already has a hardcoded `toolMapping` appendix
(`.opencode/plugins/97.js:222-229`) that translates Claude Code names to
OpenCode equivalents — keep it. Net result: one bootstrap source-of-truth,
harness-specific glue stays in the OpenCode plugin.

**Critical: Claude Code / Copilot CLI need a session-start hook to fire
the bootstrap.** Without it, `using-97` only loads when the agent
spontaneously decides to use the `Skill` tool, which is unreliable. The
plan therefore includes (mirroring superpowers exactly):

- `hooks/hooks.json` — declares the session-start hook
- `hooks/session-start` — POSIX shell script that injects the `using-97`
  bootstrap content into the session context
- `hooks/run-hook.cmd` — Windows polyglot batch/PowerShell shim that
  invokes the same logic on Windows hosts

This is the equivalent of OpenCode's `experimental.chat.messages.transform`
mechanism, ported to the Claude Code plugin model.

The 9 themed skills' SKILL.md and principles.md files are unchanged. They
are already harness-agnostic — they describe principles, not tool calls.

### Marketplace strategy: self-contained in main repo

`.claude-plugin/marketplace.json` lives in this repo (named
`97-marketplace`) and lists this repo as the marketplace source. Users do:

```bash
# Claude Code
/plugin marketplace add oribarilan/97
/plugin install 97@97-marketplace

# GitHub Copilot CLI
copilot plugin marketplace add oribarilan/97
copilot plugin install 97@97-marketplace
```

We do NOT create a sibling `oribarilan/97-marketplace` repo. Decision
recorded: simpler maintenance, single source of truth, fewer repos to
keep in sync. Superpowers uses both an in-repo dev marketplace
(`superpowers-dev`) and a sibling official marketplace
(`superpowers-marketplace`) because they need to list multiple plugins
and run a release pipeline. We have one plugin and ship from `main`, so
the in-repo marketplace is sufficient — and we name it `97-marketplace`
because it is THE marketplace, not a dev fork of one.

### CLAUDE.md is a real file, not a symlink

Plan v1 proposed `CLAUDE.md` as a symlink to `AGENTS.md`. Rejected:
**Git on Windows defaults to `core.symlinks=false`**, and a Windows clone
would check out `CLAUDE.md` as a 9-byte text file containing the literal
string "AGENTS.md". This silently breaks Claude Code / Copilot CLI on
Windows hosts, violating the cross-platform mandate in `AGENTS.md`.

Solution: two real files with identical content, plus a lint check that
asserts byte-for-byte equality on every `npm test`. Drift becomes a
lint failure, not a runtime bug. Trivial to maintain because both files
are short and rarely edited together.

### Version equality is now load-bearing

v0.2.0 introduces three places that carry the plugin version:

1. `package.json` `version`
2. `.claude-plugin/plugin.json` `version`
3. `.claude-plugin/marketplace.json` `plugins[0].version`

These MUST stay in sync. Drift means Claude Code installs a different
version than the npm metadata claims, breaking the smoke story. A lint
or smoke check parses all three and asserts equality. The
`release.yml` workflow runs the same assertion before tagging.

### What we are NOT doing in v0.2.0

Explicitly out of scope, deferred to later versions:

- **Cursor support** — needs `.cursor-plugin/plugin.json`. Trivial to add
  later; not v0.2.0.
- **Codex CLI / Codex App support** — needs `.codex-plugin/plugin.json`
  AND a sync mechanism to a separate Codex marketplace monorepo
  (`prime-radiant-inc/openai-codex-plugins`-style). Non-trivial. Defer.
- **Gemini CLI support** — needs `gemini-extension.json` and a `GEMINI.md`
  context file. Easy but defer to keep v0.2.0 focused.
- **Testing infrastructure per harness** — superpowers has `tests/opencode/`,
  `tests/claude-code/`, etc. We rely on lint+smoke + manual verification
  in v0.2.0. Per-harness tests come in v0.3.0+.
- **Sibling marketplace repo** (`oribarilan/97-marketplace`) — not needed
  while we ship one plugin from `main`.
- **Telemetry, analytics, install metrics** — none.
- **Per-plugin npm packaging** — git URL install for OpenCode + native
  marketplace install for Claude/Copilot is sufficient.

(Note: there is deliberately no "migration helper for v0.1.0 users" entry
here, because per the greenfield mandate above, there are no v0.1.0 users
to migrate. We delete v0.1.0 paths, we don't preserve them.)

(Note: hooks were originally in this list and have been moved IN-SCOPE
because they are required for the DoD's "agent invokes
`before-you-refactor` on a refactor prompt" criterion to actually hold
on Claude Code and Copilot CLI.)

## Task Priority

Numeric prefixes used because tasks have real sequential dependencies —
the spike must clear before downstream tasks commit to a Copilot install,
the bootstrap rewrite must happen before the manifests can be tested, and
the v0.1.0 cleanup must happen before the simplified plugin ships.

0. `0-spike-claude-code-and-copilot-cli-compat.md` — **Verify the
   load-bearing assumption** that `.claude-plugin/plugin.json` and the
   marketplace flow work unchanged on Copilot CLI. Install superpowers (or
   any `.claude-plugin/`-shaped repo) into a fresh Copilot CLI environment
   and confirm `marketplace add` + `install` succeed. Also confirm Claude
   Code accepts the same shape. If Copilot fails or has quirks, decide
   here whether to descope Copilot to v0.3.0 (and edit DoD accordingly)
   or to expand v0.2.0 scope to handle the quirks. **Blocks all
   Copilot-related downstream work.**

1. `1-rewrite-bootstrap-claude-native.md` — Rewrite `using-97/SKILL.md` to
   use Claude Code-native tool names. Audit the file for OpenCode-isms
   (e.g. the line "Use OpenCode's `skill` tool") and either reword
   harness-neutral or move into the OpenCode adapter. OpenCode plugin
   keeps its `toolMapping` appendix. **Highest content risk** — the
   bootstrap is what every session sees, and getting tool names wrong
   breaks the agent immediately on the non-OpenCode harnesses. Verify
   locally before moving on.

2. `2-add-claude-plugin-manifests.md` — Create `.claude-plugin/plugin.json`
   and `.claude-plugin/marketplace.json` (marketplace name:
   `97-marketplace`; plugin name: `97`). Verify schema against
   superpowers' versions. Add `CLAUDE.md` as a **real file** with
   content byte-identical to `AGENTS.md` (NOT a symlink). Add a lint
   check that asserts equality on every `npm test`.

3. `3-add-claude-code-session-start-hook.md` — Create `hooks/hooks.json`,
   `hooks/session-start`, and `hooks/run-hook.cmd`, mirroring superpowers'
   pattern exactly. The hook injects the `using-97` bootstrap content
   into Claude Code and Copilot CLI sessions on session start. Test on
   Linux, macOS, and Windows (CI matrix). Without this task, DoD lines
   asserting "agent invokes `before-you-refactor` on a refactor prompt"
   on Claude/Copilot are aspirational.

4. `4-remove-v0.1-update-infra.md` — Delete `bin/update.mjs`. Strip the
   version-check / cache / `checkForUpdate` code and the
   `NINETYSEVEN_DISABLE_VERSION_CHECK` references from
   `.opencode/plugins/97.js`. Remove the `bin` field and `bin/` entry
   from `files` array in `package.json`. Reword `package.json`
   `description` to mention all three harnesses. Add `.claude-plugin/`,
   `hooks/`, `CLAUDE.md`, `AGENTS.md` to `files` array. Update
   `CONTRIBUTE.md` §9.

5. `5-rewrite-readme-three-install-paths.md` — Rewrite README install
   section to show all three harnesses inline as the single source of
   truth for install instructions. Drop the v0.1.0 update section.
   Update "What's inside" if needed. No separate `docs/README.*.md`
   files, no `.opencode/INSTALL.md`. Pinned-install advice for OpenCode
   is documented inline as an advanced option.

6. `6-update-contribute-and-agents.md` — CONTRIBUTE.md updates: §1 lists
   three harnesses, §6 documents the release flow (three-place version
   bump checklist + `Release vX.Y.Z: <summary>` commit message
   convention), §8 shows per-harness install paths and the asymmetric
   distribution model (continuous on OpenCode, version-bump-gated on
   Claude/Copilot), §9 rewritten for the floating model and adds the
   rollback playbook. AGENTS.md adds the "don't hardcode OpenCode-isms
   outside `.opencode/`" rule to the main rules list. Document the
   multi-harness adapter pattern for future contributors.

7. `7-extend-lint-and-smoke.md` — Extend tooling to enforce v0.2.0
   invariants:
   - `scripts/smoke-load.mjs` JSON-parses `.claude-plugin/plugin.json`
     and `.claude-plugin/marketplace.json`.
   - A check (existing script or new) asserts version equality across
     `package.json`, `plugin.json`, and `marketplace.json[plugins[0]]`.
   - A check asserts byte-equality of `AGENTS.md` and `CLAUDE.md`.
   - Add a step to `.github/workflows/release.yml` asserting version
     equality before tagging.
   - Verify `scripts/lint-skills.mjs` `SKILL_RULES` for `using-97` still
     passes after the Claude-native rewrite (line budget may need a
     deliberate adjustment).

8. `8-changelog-and-release-prep.md` — Move `[Unreleased]` content to
   `[0.2.0]` section. Add link references at bottom. Bump
   `package.json` version to `0.2.0`. Bump `plugin.json` and
   `marketplace.json` plugin version to `0.2.0`. Run `npm test`. Commit,
   tag, push per `CONTRIBUTE.md §6`.

9. `9-verify-installs-on-three-harnesses.md` — Manual end-to-end:
   install in fresh Claude Code, Copilot CLI, and OpenCode environments
   (or sandboxes). Run the trigger tests from the Definition of Done.
   File issues for anything that misbehaves. If the task 0 spike
   descoped Copilot, verify only two harnesses here and update DoD.

### Parallelism

Strict dependencies:

- Task 0 blocks the Copilot-related portions of every downstream task
  (DoD, manifest schema, README install commands, verification).
- Task 1 (bootstrap rewrite) and task 4 (remove v0.1 infra) are
  independent and can run in parallel after task 0 lands.
- Task 2 (manifests + CLAUDE.md) depends on task 1 only because the
  rewritten bootstrap is what the manifest plugs in.
- Task 3 (hooks) depends on task 1 (it injects the rewritten bootstrap)
  and on task 2 (manifests must exist for hooks to register).
- Task 5 (README) depends on tasks 0 (Copilot fate decided), 2
  (marketplace name finalized), and 4 (no stale v0.1 references).
- Task 6 (CONTRIBUTE / AGENTS) depends on tasks 4 and 5 for accuracy.
- Task 7 (lint/smoke extension) depends on tasks 2 and 4 (manifests
  exist; legacy code removed).
- Task 8 (changelog/release prep) depends on every prior task.
- Task 9 (verify) depends on the tag from task 8.

Practical parallelism: tasks 1 and 4 in parallel. Then tasks 2 and (the
read-only parts of) 6/7 prep. Otherwise sequential.

If dispatching subagents:
- Tasks 1 and 4 → fixer in parallel after task 0 completes
- Other tasks orchestrator-driven (small, integrated, or have hard deps)

### Verification

Each task has its own acceptance criteria and verification steps in its
file. Story-level verification = the Definition of Done checklist above,
which boils down to: "install works in all three harnesses (or two, if
task 0 descoped Copilot), the agent recognizes 97, the agent invokes
skills on relevant prompts on every harness, and version drift is
impossible because lint enforces it."

### Reference

- `obra/superpowers` repo at `upstream/main` is the architectural
  reference. Local checkout at `~/repos/opensource/superpowers/` (already
  cloned). Specifically:
  - `.claude-plugin/plugin.json` and `marketplace.json` — manifest schema
  - `.opencode/plugins/superpowers.js` — confirms our plugin already
    matches their pattern
  - `hooks/hooks.json`, `hooks/session-start`, `hooks/run-hook.cmd` —
    the polyglot hook reference for task 3
  - `README.md` — reference for per-harness install commands
- `oh-my-opencode-slim` was considered as a distribution model and
  rejected for 97 in v0.1.0. Decision unchanged in v0.2.0 — git URL +
  marketplace beats npm-published installer for our use case.

## Notes

- This story is a structural pivot but not a content pivot. The 9 themed
  skills' SKILL.md and principles.md files are NOT touched. Only:
  - `using-97/SKILL.md` (rewritten to Claude-native, OpenCode-isms purged)
  - `.opencode/plugins/97.js` (version-check stripped — code that no
    longer matches the design is deleted, not commented out)
  - `package.json` (version bump, `bin` field removed, description
    reworded, `files` array updated)
  - `bin/`, `~/.cache/97/`-related code (deleted entirely — files removed,
    not just unused)
  - Docs (README, CONTRIBUTE, CHANGELOG, AGENTS)
  - `scripts/` (extended to enforce new invariants)
  - `.github/workflows/release.yml` (adds version-equality step)
  - NEW: `.claude-plugin/`, `hooks/`, `CLAUDE.md` (real file)
- v0.2.0 is, in practice, the first public release of 97. v0.1.0 was a
  local milestone that was never published to a marketplace, never tagged
  on the public remote, and has zero install base. Treat v0.2.0 docs and
  code as if v0.1.0 never existed externally — see "No legacy
  compatibility" in Cross-Cutting Concerns.
- The Copilot CLI compatibility question is no longer "open during work."
  Task 0 resolves it before downstream work begins. If the spike fails,
  the plan and DoD shrink to two harnesses; if it passes, full DoD holds.
