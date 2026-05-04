# Changelog

All notable changes to **97** are documented here.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and
the project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

> **For contributors:** add your change to the `[Unreleased]` section as part
> of the same PR that introduces it. The release process moves Unreleased
> entries into a new versioned section. See `CONTRIBUTE.md` for details.

## [Unreleased]

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

[Unreleased]: https://github.com/oribarilan/97/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/oribarilan/97/releases/tag/v0.1.0
