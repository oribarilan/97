---
name: using-97
description: Use when starting any coding task — establishes the 97 trigger map so principles fire when relevant
---

# 97 — bootstrap

## Overview

**97** distills **selected principles discussed in** *97 Things Every Programmer Should Know* (O'Reilly, ed. Kevlin Henney; CC-BY-3.0 originals at https://github.com/97-things/97-things-every-programmer-should-know) into trigger-based skills. You have nine themed skills plus this bootstrap. Each themed skill activates on a specific situation — refactoring, writing tests, designing an API, committing — and brings the relevant principles to bear in your own work. This plugin curates a subset of the book's principles around its own trigger taxonomy; it does not reproduce the book or its editorial selection. This is an unofficial companion, not affiliated with O'Reilly or any contributor.

## Trigger Map

When the situation matches, invoke the named skill **before** you act:

| Skill | Trigger |
|---|---|
| `writing-clean-code` | Adding a new function/class, naming a new entity, or modifying ≥3 lines of non-trivial logic — at most once per file per session (NOT typos, config, test code, or already-fired-this-file) |
| `before-you-refactor` | About to refactor, restructure, rename across files, or "clean up" existing code |
| `testing-discipline` | Writing tests, designing test data, naming a test, choosing what to assert, or writing test helpers/mocks/fixtures |
| `api-and-interface-design` | Designing a public API, an exported function signature, a module boundary, an exported type, or any contract other code depends on |
| `pre-commit-self-review` | About to commit, finish a task, open a PR, summarize work, or when the human partner asks for a review or hand-off |
| `error-and-correctness-traps` | Writing error handling, comparing/calculating with floats, writing concurrent code, calling a remote process, adding a singleton/global, choosing a data structure for a hot path, or adding/changing log statements |
| `build-deploy-and-tooling` | Authoring/changing build scripts, CI config, deploy pipelines, repo setup, or evaluating a new tool/dependency for adoption |
| `domain-modeling` | Introducing a new top-level type/table/domain concept, renaming a domain concept, or deciding where state lives (in-memory vs persistent) |
| `working-with-users-and-team` | Designing UX, gathering or interpreting requirements, estimating effort, or communicating with stakeholders/customers about what to build |

If even a 1% chance the trigger applies, invoke the skill. Loading is cheap; skipping a relevant principle is not.

## How to invoke

Use OpenCode's `skill` tool with the **bare skill name** — `before-you-refactor`, not `97/before-you-refactor`. Skill names are flat across all installed plugins. The skill's content is then loaded into context; follow it as written.

## Priority

1. **Your human partner's instructions** (CLAUDE.md, GEMINI.md, AGENTS.md, direct prompts) override everything below.
2. **Process skills (superpowers)** run before **content skills (97)**. `superpowers/brainstorming` precedes `97/working-with-users-and-team`. `superpowers/test-driven-development` decides *whether* to write a test; `97/testing-discipline` decides *what makes the test good*. `superpowers/verification-before-completion` decides *did it work*; `97/pre-commit-self-review` decides *is it well-considered*.
3. **More specific 97 skill > broader 97 skill.** `before-you-refactor` wins over `writing-clean-code` when both could apply. `testing-discipline` wins over `writing-clean-code` for test code.
4. **Never duplicate process.** 97 skills cite the relevant superpowers skill and defer; they do not re-implement TDD, brainstorming, or verification.

## Red Flags

These thoughts mean STOP — invoke the skill anyway:

| Thought | Reality |
|---|---|
| "I already know this principle." | Knowing ≠ applying. Invoke the skill so the principle is in front of you when you act. |
| "It's just a small change." | Small changes are exactly where principles get skipped. Invoke. |
| "The trigger almost matches but not quite." | Almost-matches are the easiest to rationalize past. Invoke and let the skill itself tell you it doesn't apply. |
| "Loading the skill costs tokens." | Skipping a principle costs a bug, a regression, or a refactor. Invoke. |
| "I'll invoke it later if it turns out to matter." | "Later" means "after you already wrote the wrong code." Invoke before, not after. |
| "This task is too simple to need wisdom." | The book exists because experienced engineers keep getting bitten by simple tasks. Invoke. |
| "I read this skill last session, I remember it." | Skills evolve. Invoke and read the current version. |
| "Two skills could fit; I'll just pick one." | Use Priority §3 — more specific wins. Don't guess; invoke the more specific one. |

## Source & licensing

Principles are distilled in our own words from CC-BY-3.0 originals at https://github.com/97-things/97-things-every-programmer-should-know. Each themed skill credits its contributors in `principles.md`. Plugin code is MIT; see `CONTENT-LICENSE.md` in the repo for the full attribution and takedown policy.
