# Changelog

All notable changes to **97** are documented here.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and
the project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

> **For contributors:** add your change to the `[Unreleased]` section as part
> of the same PR that introduces it. The release process moves Unreleased
> entries into a new versioned section. See `CONTRIBUTE.md` for details.

## [Unreleased]

## [0.3.0] — 2026-05-05

Council-feedback release. Sharpens content over breadth: prunes urgency
theater from the bootstrap, tightens `writing-clean-code` and
`working-with-users-and-team` toward the `error-and-correctness-traps`
density, replaces the bash+cmd polyglot SessionStart hook with a
pure-Node port, asserts bootstrap injection in smoke, freezes harness
scope through v1.0, and adds the project's first
`security-and-trust-boundaries` skill. Net: more is removed than added.

### Added

- **Harness scope policy** documented in `CONTRIBUTE.md` (and cross-
  referenced from `AGENTS.md` rule 8): supported harnesses through
  v1.0 are Claude Code, Copilot CLI, and OpenCode. Adding a new
  harness adapter requires both demonstrated user demand and
  behavioral evidence that existing skills change agent output. PRs
  adding a fourth harness without meeting both bars will be deferred.
- `security-and-trust-boundaries` skill — closes the largest behavioral
  gap in the v0.2 bundle (council consensus). Modeled on the
  `error-and-correctness-traps` template: five trap domains
  (injection, untrusted-input boundaries, secrets, crypto misuse, and
  authentication/authorization) with concrete worked examples. The
  skill is the project's one acknowledged "97-inspired plus extension":
  #26 and #29 generalize cleanly to trust-boundary discipline; the
  rest is original commentary drawing on standard industry references.
  See `CONTENT-LICENSE.md` for the licensing posture.

### Removed

- The unused Cursor adapter branch from `hooks/session-start` (carried
  forward as a no-op into the Node port via deletion). Cursor was never
  a documented supported harness; engineering investment in adapter
  logic for harnesses without users is the wrong investment for v0.3.
  See "Harness scope policy" in `CONTRIBUTE.md`.
- `hooks/run-hook.cmd` and the bash `hooks/session-start` script. The
  bash+cmd polyglot silently no-op'd on Windows hosts without Git Bash;
  the SessionStart bootstrap was never injected and users had no
  warning. Replaced by a pure-Node port (see Changed).
- `CLAUDE.md` — `AGENTS.md` is now the single source of truth for
  contributor docs. The repo previously kept the two files
  byte-identical with a smoke-test enforcement; that was reframed in
  v0.3 (`decide-agents-claude-md-strategy`, revised) — these are
  contributor-facing docs, the maintenance tax exceeded the value of
  automatic Claude Code priming, and most modern agents (OpenCode,
  Copilot CLI, Cursor, Codex) read `AGENTS.md` directly. Claude Code
  contributors can manually load `AGENTS.md` at session start.

### Changed

- "What 'done' looks like" sections swept across skills against an
  observable-property rubric: keep items a reviewer can verify by
  reading the diff/code/CI output; cut self-grading vibes, motivational
  framing, and unfalsifiable judgments. Affected skills:
  `domain-modeling` (cut "describe to your human partner in one
  sentence" — self-grading) and `pre-commit-self-review` (cut "re-read
  as stranger and it explains itself", "comments help next reader, none
  stale", "nothing you'd want to undo after a night's sleep" —
  motivational, agents don't sleep). `error-and-correctness-traps`
  remains the template; its checks were already concrete.
  `working-with-users-and-team` and `writing-clean-code` "done"
  sections were tightened in their own tasks.
- `writing-clean-code` tightened toward `error-and-correctness-traps`
  density. Cut from 12 decisions to 8 (107 lines, was 142). Each
  retained decision now pairs with a concrete *check* a reviewer can
  apply by reading the diff (no more self-graded vibes). #5 (Beauty Is
  in Simplicity), #39 (Improve Code by Removing It — folded into #75),
  #62 (Only the Code Tells the Truth — distilled into decision 6), and
  #93 (Write As If You'll Support It for Years — motivational framing
  cut) are demoted to `principles.md` for attribution. #91 (WET
  Dilutes Bottlenecks) folded into the DRY decision. The "What 'done'
  looks like" checklist drops the unfalsifiable self-grading items
  ("you can describe each block to your human partner without reading
  it aloud") and keeps only checks observable from the diff.
- `working-with-users-and-team` pruned to its agent-relevant spine:
  requirements interpretation, estimation discipline, and "start from
  yes" on incoming requests. Pairing rotation, knowledge-gradient
  pairing, watching real users, leaving the next reader better off,
  and compensating-defect debugging — all genuinely human-to-human or
  duplicative with `error-and-correctness-traps` — were demoted from
  `SKILL.md` to `principles.md` (kept for attribution but no longer
  loaded on trigger). Skill body shrank from ~125 to ~79 lines.
  Trigger description and bootstrap trigger row drop "designing UX"
  language; that was a watching-real-users hook the agent cannot
  satisfy. `lint-skills.mjs` principle list updated to match what's
  actually cited in `SKILL.md`. `README.md` "What's inside" row
  updated.
- `using-97/SKILL.md` Priority section grew two new items addressing
  trigger-coverage gaps council flagged: §4 reminds the agent to read a
  file before editing it (no skill load — a one-line cheap reminder
  for the most common avoidable failure mode), and §5 adds explicit
  debugging fallback precedence (`superpowers/systematic-debugging`
  first; otherwise `error-and-correctness-traps` for trap-shaped bugs
  and `pre-commit-self-review` step 2 for general debugging). Two
  other gaps — reviewing others' code, and data/schema migrations —
  were deferred to v0.4+ with backlog tasks recorded at
  `.todo/backlog/add-code-review-skill.md` and
  `.todo/backlog/add-data-and-schema-changes-skill.md`.
- `writing-clean-code` no longer carries the "at most once per file per
  session" rate limit. The constraint was honor-system: agents have no
  reliable session-scoped ledger of "files I've fired on", so the rule
  appeared to control firing without actually doing so. Removing it
  restores coverage on the second-edit-in-a-file case (often the more
  interesting change, made under more pressure). If `writing-clean-code`
  is too expensive to fire twice in one file, the fix is a denser
  skill, not a fragile rule. Removed from the trigger description, the
  bootstrap trigger row, the skill body, and `README.md`.
- `skills/using-97/SKILL.md` rewritten for signal over urgency. Dropped
  the "If even a 1% chance the trigger applies, invoke" framing, the
  eight-row Red Flags table, and the H1 cosmetic header. The bootstrap
  is now ~33% shorter (58 → 39 lines) with three high-signal Red Flags
  rows: almost-matches, two-skills-could-fit, and stale-memory. Mature
  instruction-tuned models discount shouted urgency and pattern-match
  it to coercive prompting; the trigger map carries the actual signal.
  If a future eval shows invocation rate dropped after this, the fix
  is sharper triggers, not re-adding the urgency theater.
- Bootstrap wrapper across both adapters
  (`.opencode/plugins/97.js`, `hooks/session-start.mjs`) replaced
  `<EXTREMELY_IMPORTANT>...</EXTREMELY_IMPORTANT>` and its "ALREADY
  LOADED" preamble with a calm `<bootstrap name="using-97">...</bootstrap>`
  envelope. Wrapper preamble drops ≥4 lines per adapter; total injected
  bootstrap chars per harness drop well over 30%.
- The OpenCode plugin's bootstrap idempotency check now keys on the
  stable `<bootstrap name="using-97">` substring instead of
  `EXTREMELY_IMPORTANT`.
- `scripts/smoke-load.mjs` now asserts the bootstrap actually arrives in
  agent context: the OpenCode `experimental.chat.messages.transform`
  hook prepends a part containing the stable "Trigger Map" marker and
  the OpenCode tool-mapping appendix, and the second invocation is
  idempotent. It also spawns `hooks/session-start.mjs` as a subprocess
  and verifies both the Claude Code (`hookSpecificOutput.additionalContext`)
  and Copilot CLI (`additionalContext`) envelope shapes. Catches silent
  breakage from transform renames, frontmatter parsing changes, or
  wrapper-string drift — without requiring a real harness in CI.
- `hooks/session-start.mjs` (new) — pure-Node SessionStart hook invoked
  directly via `node`, replacing the bash+cmd polyglot. Reads
  `skills/using-97/SKILL.md`, strips frontmatter to mirror the OpenCode
  adapter, and emits the harness-shaped JSON envelope (Claude Code's
  nested `hookSpecificOutput.additionalContext` by default;
  `additionalContext` at top level when `COPILOT_CLI` is set). One
  language for hooks, no hidden bash dependency, identical behavior on
  Linux, macOS, and Windows.
- `hooks/hooks.json` `command` invokes
  `node "${CLAUDE_PLUGIN_ROOT}/hooks/session-start.mjs"`.
- `scripts/smoke-load.mjs` no longer asserts `AGENTS.md`/`CLAUDE.md`
  byte-equality. It now actively rejects a re-introduced `CLAUDE.md`
  to prevent drift back into the two-file world.
- `scripts/lint-skills.mjs` documents the per-skill `maxLines` budget
  philosophy explicitly: caps are tight by design, the gold-standard
  `error-and-correctness-traps` is the density target for new skills,
  and a single skill bump with a documented reason is preferred over
  a blanket loosening. Caps themselves are unchanged from v0.2.

## [0.2.0] — 2026-05-04

Multi-harness release. The same `skills/` directory now loads in Claude
Code, GitHub Copilot CLI, and OpenCode from one repo. Same adapter pattern
as [`superpowers`](https://github.com/obra/superpowers).

### Added

- Claude Code support via `.claude-plugin/plugin.json` and
  `.claude-plugin/marketplace.json`. Install with
  `/plugin marketplace add oribarilan/97` then `/plugin install 97@97-marketplace`.
- GitHub Copilot CLI support — uses the same `.claude-plugin/` manifests
  Claude Code reads. Install with `copilot plugin marketplace add oribarilan/97`
  then `copilot plugin install 97@97-marketplace`.
- `hooks/hooks.json`, `hooks/session-start`, and `hooks/run-hook.cmd` —
  SessionStart bootstrap injector for Claude Code and Copilot CLI. The
  hook reads `skills/using-97/SKILL.md` and emits the platform-appropriate
  context-injection JSON (Cursor / Claude Code / Copilot CLI / SDK
  standard). `run-hook.cmd` is a polyglot batch/bash shim that locates Git
  for Windows bash on Windows hosts.
- `CLAUDE.md` — a real file (not a symlink) byte-identical to `AGENTS.md`,
  enforced by the smoke check.
- `scripts/smoke-load.mjs` now also: JSON-parses
  `.claude-plugin/plugin.json` and `.claude-plugin/marketplace.json`,
  asserts version equality across `package.json`, `plugin.json`, and
  `marketplace.json[plugins[0]]`, asserts byte-equality of `AGENTS.md`
  and `CLAUDE.md`, and verifies the hooks files are present.
- `.github/workflows/release.yml` now asserts version equality across all
  three manifests before tagging.
- `justfile` — local task runner with `just` (default lists recipes), `just
  check`, `just test`, `just lint`, `just format`, `just format-check`,
  `just clean`. CI continues to use `npm test` so contributors don't need
  `just` installed.
- Prettier as a `devDependency` — formats `**/*.{js,mjs,cjs,json,yml,yaml}`.
  `.prettierrc.json` and `.prettierignore` define the scope. Markdown is
  intentionally excluded (skill files have lint-enforced line budgets;
  root docs are hand-managed; `AGENTS.md` / `CLAUDE.md` must stay
  byte-identical). `npm test` now includes `format:check` so unformatted
  code fails CI.
- AGENTS.md / CLAUDE.md add a seventh rule: "No OpenCode-isms outside
  `.opencode/`" — `skills/` and `using-97/SKILL.md` are harness-neutral
  and use Claude Code-native tool names.
- CONTRIBUTE.md documents the multi-harness adapter pattern, the
  three-place version-bump checklist, the `Release vX.Y.Z: <summary>`
  commit message convention, the asymmetric distribution model
  (continuous on OpenCode vs version-bump-gated on Claude/Copilot), and
  the rollback playbook.

### Changed

- `using-97/SKILL.md` rewritten to be harness-neutral. It uses Claude Code
  tool names (`Read`, `Write`, `Edit`, `Bash`, `Task`, `TodoWrite`,
  `Skill`) directly. The OpenCode plugin's tool-mapping appendix
  (`.opencode/plugins/97.js`) translates them to OpenCode equivalents at
  injection time. One source of truth for the bootstrap.
- README install section now documents three install paths inline (Claude
  Code, Copilot CLI, OpenCode) as the single source of truth for install
  instructions.
- OpenCode default install switched from `97@git+...#v0.1.0` (pinned) to
  `97@git+...` (floating on `main`). Pinning is documented as an advanced
  option for users who want reproducibility. Marketplaces handle update
  cadence for Claude Code and Copilot CLI.
- `package.json` `description` reworded to mention all three harnesses;
  `files` array includes `.claude-plugin/`, `hooks/`, and `CLAUDE.md`.

### Removed

- `bin/update.mjs` and the `bin` field in `package.json`. The `npx
  github:oribarilan/97 update` flow is gone — OpenCode users float on
  `main`, marketplace users update through their harness's native
  `/plugin update` command.
- Auto-update notice infrastructure in `.opencode/plugins/97.js`: the
  cached version check, the `~/.cache/97/` cache, the GitHub Releases
  API call, and the `NINETYSEVEN_DISABLE_VERSION_CHECK` environment
  variable. The plugin no longer makes network calls on session start.

### Documentation

- README, CONTRIBUTE, and AGENTS rewritten end-to-end for the multi-harness
  shape. Treats v0.2.0 as the first public release; no migration notes,
  no "previously" framing, no deprecation references.

## [0.1.0] — 2026-05-04

First public release. The plugin ships nine themed skills plus the `using-97`
bootstrap, distilling 78 of the 97 principles from *97 Things Every Programmer
Should Know* (O'Reilly, ed. Kevlin Henney, 2010) into trigger-based skills
your coding agent invokes automatically.

### Added

- `using-97` bootstrap skill — primes the agent with the 9-skill trigger map
  on every session via the `experimental.chat.messages.transform` hook.
- `before-you-refactor` skill — pre-flight checklist before restructuring
  existing code (5 principles).
- `writing-clean-code` skill — fires once per file per session when adding new
  code (12 principles). The once-per-file constraint is the central guard
  against trigger habituation.
- `domain-modeling` skill — decisions when introducing a new domain concept,
  renaming one, or choosing where state lives (5 principles).
- `api-and-interface-design` skill — designing public APIs, exported
  signatures, and module boundaries with Scott Meyers' "easy to use correctly,
  hard to use incorrectly" as the headline rule (9 principles).
- `testing-discipline` skill — what makes a test good (separate from TDD's
  "whether/when to write a test"); covers data, naming, assertions, helpers
  (8 principles).
- `pre-commit-self-review` skill — last line of defense before code ships;
  includes "A Message to the Future" framing and a self-review checklist
  (9 principles).
- `error-and-correctness-traps` skill — five trap domains (errors, numerics,
  concurrency/IPC, limits/performance, globals/singletons) with concrete
  examples for each (9 principles).
- `build-deploy-and-tooling` skill — design and authoring of build scripts,
  CI, deploy pipelines, and tooling choices (11 principles).
- `working-with-users-and-team` skill — soft-skills genre with a strict
  concrete-action requirement: every principle ends with a "Before/When X,
  do Y" agent action (10 principles).
- Plugin loader (`.opencode/plugins/97.js`) — registers the bundled `skills/`
  directory and injects the bootstrap into the first user message of each
  session. Mirrors the superpowers v5.0.7 plugin layout.
- Structural lint (`scripts/lint-skills.mjs`) — enforces frontmatter,
  required sections, line budgets, and required principle numbers per skill.
- Smoke test (`scripts/smoke-load.mjs`) — imports the plugin and exercises
  hooks.
- Cross-references between skills — every overlap (writing-clean-code ↔
  domain-modeling ↔ api-and-interface-design, testing-discipline ↔
  superpowers/test-driven-development, pre-commit-self-review ↔
  superpowers/verification-before-completion, etc.) is described
  bidirectionally and consistently.
- `CONTENT-LICENSE.md` — dual-licensing policy (plugin code MIT; skill
  content original commentary attributed to CC-BY-3.0 source essays) with
  takedown commitment.

### Documentation

- `README.md` — install instructions, full skill table, credits, licensing.
- Per-skill `principles.md` — long-form distillations with author
  attribution and links to the canonical CC-BY-3.0 source mirror.

[Unreleased]: https://github.com/oribarilan/97/compare/v0.3.0...HEAD
[0.3.0]: https://github.com/oribarilan/97/releases/tag/v0.3.0
[0.2.0]: https://github.com/oribarilan/97/releases/tag/v0.2.0
[0.1.0]: https://github.com/oribarilan/97/releases/tag/v0.1.0
