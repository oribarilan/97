# Changelog

All notable changes to **97** are documented here.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and
the project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

> **For contributors:** add your change to the `[Unreleased]` section as part
> of the same PR that introduces it. **Bullets are tight: one change per
> bullet, past tense, reader's perspective, ≤6–7 lines. No task IDs,
> deliberation history, or file-touched lists — those belong in the commit
> body.** See `CONTRIBUTE.md` section 4 for the full rules and `AGENTS.md`
> "Changelog discipline" for the agent-facing imperative version with
> bad/good examples. The release process moves Unreleased entries into a
> new versioned section.

## [Unreleased]

## [0.5.1] — 2026-05-06

Strengthens the `using-97` bootstrap so 97 skills trigger reliably on
action-target prompts. Earlier prose was too hedged and agents skipped
skill invocation when the user's request had a concrete target.

### Changed

- Strengthened `using-97` bootstrap with imperative-force language so 97
  skills trigger reliably on action-target prompts ("refactor file X",
  "clean up function Y"). Adds a CRITICAL banner above the trigger map,
  uppercase MUST directives, an explicit "before any response or action"
  rule, and red flags catching pre-action rationalization. Earlier prose
  was too hedged, so agents skipped invocation when the user's request
  had a concrete target.
- Tightened the umbrella framing phrase from "the classics of
  programming practice" to "the hard-won lessons of world-renowned
  programmers" across the README, AGENTS.md, CONTRIBUTE.md, the
  bootstrap, and all plugin manifests. More concrete, less academic.
  No skill content changes.

## [0.5.0] — 2026-05-06

Reframes 97 as skills distilled from the classics of programming practice,
in the spirit of *97 Things*, rather than a *97 Things* companion. Adds a
per-source attribution list and a FAQ section to the README. No skill
content changes.

### Changed

- Reframed user-visible copy: 97 is described as skills distilled from
  the classics of programming practice, in the spirit of *97 Things
  Every Programmer Should Know*, rather than as a *97 Things*
  companion. No skill content changes.
- Tightened `AGENTS.md` "Changelog discipline" with a length cap, a
  no-internal-references rule, and a bad/good example pair. The
  `CHANGELOG.md` "For contributors" note repeats the imperative rules
  in-place.

### Documentation

- `README.md` gains a centered tagline header and a `FAQ` section
  comparing 97 to `superpowers` and `BMAD`.
- `README.md` adds a `Giants` section naming each source the project
  cites, and explains how to ask the agent for the author and
  reasoning behind any principle.
- `AGENTS.md` adds an `Adding or removing a source` workflow so the
  source list stays in sync with `principles.md`.

## [0.4.0] — 2026-05-06

Six themed skills get new principles from sources outside *97 Things* — Fowler,
Wlaschin, Nygard, 12-factor, *Continuous Delivery*, Ousterhout, Liskov, King,
GOOS, Meszaros. A new `observability` skill closes the "operable in dev, inert
in prod" gap. A new `CITATION-SCHEME.md` gives every principle a stable string
ID so the lint can check the new entries the same way it checked the book
essays.

### Added

- New themed skill: `observability`. Agents reach for production
  diagnosability by default in dev and forget it in prod — no tracing,
  no metrics, unstructured logs. Four principles, structured in the
  `error-and-correctness-traps` template: `OTel/StructuredLogs`
  (key/value with stable event names; request id on every line),
  `OTel/TraceContext` (W3C Trace Context across every cross-process
  call), `SRE/GoldenSignals` (latency, traffic, errors, saturation as
  a coverage check for service code), and `OE/CardinalityDiscipline`
  (high-cardinality fields belong in logs and traces, not metric
  labels — per-user metric labels are the canonical metrics-system
  outage). Stakes calibration applied from creation. Skill count
  moves from 11 to 12.
- `CITATION-SCHEME.md` defines the `<source-key>/<principle-key>` ID
  format used by every `principles.md` heading and the structural
  lint. Replaces the implicit `#NN` convention with stable string IDs
  and lists the source keys this release imports from.

### Changed

- Migrated principle IDs from `#NN` to `<source-key>/<principle-key>`
  (e.g. `#74` → `97/74`) and trimmed per-principle metadata blocks
  to five fields: Author, Source, License, Distillation, Agent
  application. The dropped fields (Source reading aid, Source used,
  Access date, Gaps) were contributor hygiene with no license
  obligation behind them; provenance is recoverable from `git log`.
  The Birat Rai Medium walkthrough URLs that lived in `Source
  (reading aid)` are gone from `principles.md` files; the README
  credit to Birat Rai's 97-day walkthrough stays. Distillation and
  agent-application paragraphs are byte-identical to pre-migration.
  The v0.3 cross-listing of `97/26` and `97/29` in
  `security-and-trust-boundaries` is resolved per the new
  ID-uniqueness rule: canonical home is
  `error-and-correctness-traps`; the security skill cross-references
  by ID. **External GitHub anchor links to old `## #NN — …` headings
  break** — the renamed `## 97/NN — …` headings own the new anchor
  URLs.
- Stakes calibration added to the bundle. The production-shaped
  skills (`error-and-correctness-traps`, `build-deploy-and-tooling`,
  `security-and-trust-boundaries`, and the new `observability`) carry
  an explicit calibration sentence in their Overview and explicit
  exclusions in their Non-triggers for MVPs, prototypes, internal
  dev tools, and one-off scripts. A new `using-97` Priority rule
  tells the agent to match principle weight to stage and stakes.
- `using-97/SKILL.md` Overview now reads "ten themed skills" (the
  v0.3 baseline; the security skill was missed in that pass) and
  reframes the source aperture to "*97 Things* and adjacent
  canonical sources." A new Priority rule tells the agent to apply
  principles silently — no surfacing source author names, book
  titles, or principle IDs in user-facing responses.
- `before-you-refactor` adds four Fowler smells from *Refactoring*
  (2nd ed.) ch. 3: `Fowler/LongMethod` → Extract Function,
  `Fowler/FeatureEnvy` → Move Method, `Fowler/ShotgunSurgery` →
  Move Field / Inline Class, `Fowler/DataClumps` → Extract Class /
  Introduce Parameter Object. Three of the four surface in the Red
  Flags table. `Fowler/PrimitiveObsession` is owned by
  `domain-modeling` per the Canonical-home table; this skill
  cross-references it.
- `domain-modeling` adds three Wlaschin principles from *Domain
  Modeling Made Functional* (`Wlaschin/InvalidStatesUnrepresentable`,
  `Wlaschin/SmartConstructors`, `Wlaschin/TypesForEffects`) plus
  `Fowler/PrimitiveObsession` as the canonical home. New Red Flags
  surface boolean flags carrying state, "valid only in some states"
  nullable fields, string-typed identifiers swapped at call sites,
  and "validate on input" without a typed wrapper. A language guard
  in Precedence keeps the typed-domain principles from being
  dogmatic in dynamic languages — `dataclass(frozen=True)`,
  `pydantic`, `attrs`, and `TypedDict` are the dynamic-language
  reaches.
- `build-deploy-and-tooling` adds four 12-factor principles
  (`12F/III` config in environment, `12F/V` strict build/release/run
  separation, `12F/VI` stateless share-nothing processes, `12F/XI`
  logs as event streams) and `CD/PipelineAsCode` from *Continuous
  Delivery* ch. 5. New Red Flags surface hardcoded credentials in
  source, in-place patches to running production, local-filesystem
  state on disposable processes, in-process log files, and
  out-of-band pipeline edits. `12F/XI` is the canonical home for
  log *transport*; `error-and-correctness-traps` keeps log *content
  limits* (no secrets, no PII).
- `error-and-correctness-traps` adds Nygard's stability patterns
  from *Release It!* ch. 5: `RI/Timeout` (always set a timeout),
  `RI/CircuitBreaker` (open the breaker; fail fast locally),
  `RI/Bulkhead` (isolate resource pools per downstream),
  `RI/Backpressure` (bounded queues with explicit reject policy),
  `RI/FailFast` (fail before holding resources). A new
  Production-resilience sub-section and six new Red Flags surface
  the patterns at write time. `RI/CircuitBreaker` is the canonical
  home; `observability` cross-references it for open-circuit
  visibility.
- `api-and-interface-design` adds `Ousterhout/DeepModules` (deep
  over shallow), `Ousterhout/DefineErrorsOutOfExistence` (idempotent
  delete, clamping substring, `Option<T>` lookup), `Liskov/LSP`
  (subtype must be substitutable; prefer composition), and
  `King/ParseDontValidate` (parse untrusted input at the boundary
  into a domain type; this skill is the canonical home for
  parse-don't-validate). `Hyrum/Law` appears as a Red Flag reference.
- `testing-discipline` adds `GOOS/ListenToTestPain` (when a test is
  hard to write, the design is wrong; reshape the production code,
  don't mock harder) and four xUnit smells from Meszaros:
  `xUnit/ObscureTest`, `xUnit/FragileTest`, `xUnit/MysteryGuest`,
  `xUnit/ConditionalTestLogic`. The boundary with
  `superpowers/test-driven-development` is reaffirmed: TDD decides
  *whether*; this skill decides *what makes the test good*.

### Documentation

- `README.md` OpenCode install section trimmed: dropped the per-platform
  config-path table and the floating-vs-pinned trade-off paragraph.
  Both were noise for a section that just needs to show the snippet.
- `CONTRIBUTE.md` section 4 (changelog style) and section 6 (release commit message)
  now spell out the plain-prose voice we used for v0.3: open each
  version with a 1–2 sentence framing line, describe the change rather
  than the deliberation, keep internal references (task IDs, council
  names, `.todo/` paths) out of the user-facing notes, and keep release
  commit subjects under ~60 chars after the colon. The `[0.3.0]`
  changelog entry is named as the canonical example.

## [0.3.0] — 2026-05-05

Mostly a trim. Shorter bootstrap, denser skills, no more bash in the
SessionStart hook. One new skill: `security-and-trust-boundaries`.

### Added

- `security-and-trust-boundaries` skill — injection, untrusted input,
  secrets, crypto misuse, authn/authz. Modeled on
  `error-and-correctness-traps` (worked examples per trap). Mostly
  original commentary; #26 and #29 generalize cleanly to trust
  boundaries. See `CONTENT-LICENSE.md`.
- Harness scope policy in `CONTRIBUTE.md` and `AGENTS.md` rule 8:
  supported through v1.0 are Claude Code, Copilot CLI, OpenCode.
  Adding another harness requires both user demand and behavioral
  evidence that the existing skills do real work.

### Removed

- The unused Cursor branch in the SessionStart hook. Cursor was never
  a documented supported harness.
- `hooks/run-hook.cmd` and the bash `hooks/session-start`. The
  bash+cmd polyglot silently no-op'd on Windows without Git Bash;
  users got no warning. Replaced by a Node port.
- `CLAUDE.md`. `AGENTS.md` is the single source of truth for
  contributor docs. Claude Code contributors load it manually at
  session start.

### Changed

- New `hooks/session-start.mjs`: pure-Node SessionStart hook invoked
  directly via `node`. Same behavior on Linux, macOS, and Windows;
  emits the right JSON envelope per harness (Claude Code's nested
  `hookSpecificOutput.additionalContext` by default; top-level
  `additionalContext` when `COPILOT_CLI` is set).
- `using-97/SKILL.md` rewritten for signal, not urgency. The
  `<EXTREMELY_IMPORTANT>` wrapper is gone; body went from 58 to 39
  lines; the eight-row Red Flags table is down to three; the "1%
  chance" framing is replaced with "when in doubt, invoke." Both
  adapters now wrap the bootstrap in a calm
  `<bootstrap name="using-97">` envelope and key idempotency on it.
- Two new lines in the Priority section: read a file before editing
  it, and defer to `superpowers/systematic-debugging` for debugging
  (with `error-and-correctness-traps` and `pre-commit-self-review`
  step 2 as fallbacks). Two further trigger gaps — reviewing others'
  code, and data/schema migrations — are on the v0.4+ backlog.
- `writing-clean-code`: 12 decisions cut to 8, 142 lines down to 107.
  Each retained decision now pairs with a check a reviewer can apply
  from the diff. The "once per file per session" rate limit is gone;
  it was honor-system and didn't actually control firing. Principles
  #5, #39, #62, and #93 moved to `principles.md`; #91 folded into the
  DRY decision.
- `working-with-users-and-team` pruned to requirements interpretation,
  estimation, and "start from yes." Pairing rotation, watching real
  users, leaving the next reader better off, and compensating-defect
  debugging all moved to `principles.md`. Skill body shrank from 125
  to 79 lines.
- "What 'done' looks like" sections swept across skills against an
  observable-property rubric: keep checks a reviewer can verify from
  the diff or CI output, cut self-grading and motivational items.
  Trims in `domain-modeling` and `pre-commit-self-review`;
  `error-and-correctness-traps` stays as the template.
- `scripts/smoke-load.mjs` now asserts the bootstrap actually arrives.
  The OpenCode transform hook is exercised against a fake user
  message and checked for idempotency; the Node hook is spawned as a
  subprocess and both envelope shapes are verified. It also rejects a
  re-introduced `CLAUDE.md`.
- `scripts/lint-skills.mjs` documents the per-skill `maxLines`
  philosophy: caps are a forcing function for density, not a budget
  to spend. Caps unchanged from v0.2.

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

[Unreleased]: https://github.com/oribarilan/97/compare/v0.4.0...HEAD
[0.4.0]: https://github.com/oribarilan/97/releases/tag/v0.4.0
[0.3.0]: https://github.com/oribarilan/97/releases/tag/v0.3.0
[0.2.0]: https://github.com/oribarilan/97/releases/tag/v0.2.0
[0.1.0]: https://github.com/oribarilan/97/releases/tag/v0.1.0
