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
        `/plugin install 97@97`)
  - [ ] GitHub Copilot CLI (via `copilot plugin marketplace add oribarilan/97`
        then `copilot plugin install 97@97`)
  - [ ] OpenCode (via `97@git+https://github.com/oribarilan/97.git` — note
        no `#vX.Y.Z` pin, floating on `main`)
- [ ] In each of the three harnesses, asking the agent "what is 97?" returns
      a response that names the bundle and at least 5 of the 9 themed skills.
- [ ] In each of the three harnesses, asking the agent to "refactor this
      function" causes it to invoke the `before-you-refactor` skill before
      writing code.
- [ ] `using-97/SKILL.md` is rewritten to use Claude Code-native tool names
      (`Read`, `Write`, `Edit`, `Bash`, `Task`, `TodoWrite`, `Skill`). The
      OpenCode plugin's tool-mapping appendix translates these to OpenCode
      equivalents at injection time. Result: one source-of-truth bootstrap.
- [ ] All v0.1.0 pin/notice/auto-update infrastructure is **deleted**:
      `bin/update.mjs`, the version-check code in `.opencode/plugins/97.js`,
      the `~/.cache/97/` cache, the `npx github:oribarilan/97 update`
      documentation, the `bin/` directory itself if empty.
- [ ] `AGENTS.md` is canonical; `CLAUDE.md` is a symlink to `AGENTS.md`.
- [ ] `.claude-plugin/plugin.json` and `.claude-plugin/marketplace.json`
      exist with the correct schema (verified against superpowers' versions).
- [ ] `README.md` documents three install paths (Claude Code, Copilot CLI,
      OpenCode) clearly, with the OpenCode default switched to floating.
- [ ] `CHANGELOG.md` has a populated `[0.2.0]` section listing every
      user-visible change. `[Unreleased]` returns to empty.
- [ ] `CONTRIBUTE.md` updated: §1 mentions the three supported harnesses,
      §8 documents the per-harness install paths and the floating-update
      model, §9 (auto-update) is rewritten or removed, the multi-harness
      adapter pattern is documented for future contributors.
- [ ] `AGENTS.md` updated: the rule about "don't hardcode OpenCode-isms
      outside `.opencode/`" is now real, not aspirational. Add it to the
      rules list.
- [ ] All `npm test` checks (lint + smoke) pass on Linux, macOS, and Windows
      (CI matrix already covers this).
- [ ] `package.json` `version` is `0.2.0`. Git tag `v0.2.0` exists and the
      `release.yml` workflow has fired successfully on push.

## Cross-Cutting Concerns

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
├── scripts/                         # unchanged — lint + smoke
├── .opencode/
│   ├── INSTALL.md                   # NEW (extracted from README; mirrors superpowers)
│   └── plugins/
│       └── 97.js                    # SIMPLIFIED — version-check code removed
├── .claude-plugin/                  # NEW
│   ├── plugin.json                  #   manifest used by BOTH Claude Code AND Copilot CLI
│   └── marketplace.json             #   marketplace metadata; lists this plugin pointing at "./"
├── docs/
│   ├── README.opencode.md           # NEW (full install/usage details for OpenCode)
│   ├── README.claude-code.md        # NEW
│   └── README.copilot-cli.md        # NEW
├── AGENTS.md                        # canonical (unchanged content; symlink target)
├── CLAUDE.md                        # NEW symlink → AGENTS.md
├── CHANGELOG.md                     # [0.2.0] populated
├── CONTRIBUTE.md                    # updated §1, §8, §9
├── CONTENT-LICENSE.md               # unchanged
├── README.md                        # rewritten install section: 3 paths
├── LICENSE                          # unchanged
├── package.json                     # version 0.2.0, no `bin` field anymore
└── .github/workflows/               # unchanged (test.yml, release.yml)
```

### Why Copilot CLI is "free" with Claude Code

GitHub Copilot CLI uses Claude Code's plugin format directly — both consume
`.claude-plugin/plugin.json` and the marketplace pattern is identical. One
manifest, two harnesses. Verified against superpowers, which uses this
exact pattern (a single `.claude-plugin/` for both).

### Update model: float on `main` everywhere

OpenCode default install changes from `97@git+https://github.com/oribarilan/97.git#v0.1.0`
to `97@git+https://github.com/oribarilan/97.git`. OpenCode pulls the latest
commit on each restart. Users who want reproducibility can still pin
manually (`#vX.Y.Z`), and we document this as an advanced option in
`README.opencode.md` — but the v0.1.0 helper script and version-check code
are removed.

For Claude Code and Copilot CLI: marketplaces handle updates natively. No
work for us.

Trade-off accepted: a bad release ships immediately to all OpenCode users
on next restart. Mitigation: CI gates merges to `main`; we don't merge
unless lint+smoke is green on Ubuntu/macOS/Windows × Node 18/20/22.

### Bootstrap rewrite (using-97/SKILL.md)

Today `using-97/SKILL.md` was written OpenCode-first. It references
`todowrite`, `@mention`, OpenCode's `skill` tool. With Claude Code and
Copilot CLI as primary targets, this gets inverted: rewrite to use Claude
Code tool names (`Read`, `Write`, `Edit`, `Bash`, `Task`, `TodoWrite`,
`Skill`). The OpenCode plugin already has a `toolMapping` appendix that
translates Claude Code names to OpenCode equivalents — keep it. Net result:
one bootstrap source-of-truth, harness-specific glue stays in the OpenCode
plugin.

The 9 themed skills' SKILL.md and principles.md files are unchanged. They
are already harness-agnostic — they describe principles, not tool calls.

### Marketplace strategy: self-contained in main repo

`.claude-plugin/marketplace.json` lives in this repo and lists this repo
as the marketplace source. Users do:

```bash
# Claude Code
/plugin marketplace add oribarilan/97
/plugin install 97@97

# GitHub Copilot CLI
copilot plugin marketplace add oribarilan/97
copilot plugin install 97@97
```

We do NOT create a sibling `oribarilan/97-marketplace` repo. Decision
recorded: simpler maintenance, single source of truth, fewer repos to
keep in sync. Superpowers uses a sibling repo because they need to list
multiple plugins; we have one.

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
- **Cross-platform polyglot hooks** — superpowers' `hooks/run-hook.cmd`
  is clever but we don't have hooks. Add when we add hooks.
- **Migration helper for v0.1.0 users** — anyone who installed `#v0.1.0`
  will continue to work (the tag still exists). Future-mode is
  documented; no migration script needed.

## Task Priority

Numeric prefixes used because tasks have real sequential dependencies —
the bootstrap rewrite must happen before the marketplace install can be
tested, and the v0.1.0 cleanup must happen before the simplified plugin
ships.

1. `1-rewrite-bootstrap-claude-native.md` — Rewrite `using-97/SKILL.md` to
   use Claude Code-native tool names. OpenCode plugin keeps tool-mapping
   appendix. **Highest risk task** — the bootstrap is what every session
   sees, and getting tool names wrong breaks the agent immediately on the
   non-OpenCode harnesses. Verify locally before moving on.

2. `2-add-claude-plugin-manifests.md` — Create `.claude-plugin/plugin.json`
   and `.claude-plugin/marketplace.json`. Add `CLAUDE.md` as symlink to
   `AGENTS.md`. Verify schema against superpowers' versions.

3. `3-remove-v0.1-update-infra.md` — Delete `bin/update.mjs`. Strip the
   version-check / cache / `checkForUpdate` code from `.opencode/plugins/97.js`.
   Remove the `bin` field from `package.json`. Update `CONTRIBUTE.md` §9.

4. `4-add-opencode-install-doc.md` — Extract OpenCode-specific install
   instructions into `docs/README.opencode.md` and `.opencode/INSTALL.md`,
   mirroring superpowers' layout. Keep README short and split installs by
   harness.

5. `5-add-claude-code-install-doc.md` — Write `docs/README.claude-code.md`
   with marketplace install instructions. Reference Anthropic's plugin
   docs for any nuances.

6. `6-add-copilot-cli-install-doc.md` — Write `docs/README.copilot-cli.md`.
   Confirm the install commands work with current Copilot CLI version.
   This task is small if Copilot truly uses Claude format unchanged; flag
   if any Copilot-specific quirks surface.

7. `7-rewrite-readme-three-install-paths.md` — Rewrite README install
   section to show all three harnesses up front. Drop the v0.1.0 update
   section. Update "What's inside" if needed. Point each harness at its
   detailed `docs/README.*.md`.

8. `8-update-contribute-and-agents.md` — CONTRIBUTE.md updates: §1 lists
   3 harnesses, §8 shows per-harness install paths, §9 rewritten for
   floating model. AGENTS.md adds the "don't hardcode OpenCode-isms" rule
   to the main list. Document the multi-harness adapter pattern.

9. `9-changelog-and-release-prep.md` — Move `[Unreleased]` content to
   `[0.2.0]` section. Add link references at bottom. Bump
   `package.json` version to `0.2.0`. Run `npm test`. Commit, tag, push
   per `CONTRIBUTE.md §6`.

10. `10-verify-installs-on-three-harnesses.md` — Manual end-to-end:
    install in fresh Claude Code, Copilot CLI, and OpenCode environments
    (or sandboxes). Run the trigger tests from the Definition of Done.
    File issues for anything that misbehaves.

### Parallelism

Tasks 4, 5, 6 (the install docs) are independent and can be parallelized
once tasks 1–3 land. Other tasks are sequential.

If dispatching subagents:
- Tasks 4/5/6 → fixer in parallel after task 2 completes
- All other tasks orchestrator-driven (small, integrated)

### Verification

Each task has its own acceptance criteria and verification steps in its
file. Story-level verification = the Definition of Done checklist above,
which boils down to: "install works in all three harnesses, the agent
recognizes 97, the agent invokes skills on relevant prompts."

### Reference

- `obra/superpowers` repo at `upstream/main` is the architectural reference.
  Local checkout at `~/repos/opensource/superpowers/` (already cloned).
  Specifically:
  - `.claude-plugin/plugin.json` and `marketplace.json` — manifest schema
  - `.opencode/plugins/superpowers.js` — confirms our plugin already
    matches their pattern
  - `README.md` — reference for per-harness install commands (lines 30–110)
  - `docs/README.opencode.md`, `.opencode/INSTALL.md`, `.codex/INSTALL.md` —
    per-harness install doc templates
- `oh-my-opencode-slim` was considered as a distribution model and
  rejected for 97 in v0.1.0. Decision unchanged in v0.2.0 — git URL +
  marketplace beats npm-published installer for our use case.

## Notes

- This story is a structural pivot but not a content pivot. The 9 themed
  skills' SKILL.md and principles.md files are NOT touched. Only:
  - `using-97/SKILL.md` (rewritten to Claude-native)
  - `.opencode/plugins/97.js` (version-check stripped)
  - `package.json` (version bump, `bin` removed)
  - `bin/`, `.cache/`-related code (deleted)
  - Docs (README, CONTRIBUTE, CHANGELOG, AGENTS)
  - NEW: `.claude-plugin/`, `docs/README.*.md`, `CLAUDE.md` symlink
- v0.1.0 install paths (`#v0.1.0` pin) continue to work for the lifetime
  of that tag. We don't break existing users; we change the recommended
  install for new ones.
- Open question to revisit during work: does Copilot CLI actually accept
  the same `.claude-plugin/plugin.json` schema unchanged, or does it have
  quirks? Task 6 will surface this.
