---
name: using-97
description: Use when starting any coding task — establishes the 97 trigger map so principles fire when relevant
---

## Overview

**97** distills principles from *97 Things Every Programmer Should Know* (O'Reilly, ed. Kevlin Henney; CC-BY-3.0 originals at https://github.com/97-things/97-things-every-programmer-should-know) into trigger-based skills. You have nine themed skills plus this bootstrap. Each one activates on a specific situation — refactoring, writing tests, designing an API, committing — and brings the relevant principles to bear. Unofficial companion, not affiliated with O'Reilly or any contributor.

## Trigger Map

When the situation matches, invoke the named skill **before** you act. Use the `Skill` tool with the **bare skill name** (e.g., `before-you-refactor`). When in doubt, invoke.
| Skill | Trigger |
|---|---|
| `writing-clean-code` | Adding a new function/class, naming a new entity, or modifying ≥3 lines of non-trivial logic (NOT typos, config, or test code) |
| `before-you-refactor` | About to refactor, restructure, rename across files, or "clean up" existing code |
| `testing-discipline` | Writing tests, designing test data, naming a test, choosing what to assert, or writing test helpers/mocks/fixtures |
| `api-and-interface-design` | Designing a public API, exported function signature, module boundary, exported type, or any contract other code depends on |
| `pre-commit-self-review` | About to commit, finish a task, open a PR, summarize work, or when asked for a review or hand-off |
| `error-and-correctness-traps` | Writing error handling, comparing/calculating with floats, writing concurrent code, calling a remote process, adding a singleton/global, choosing a data structure for a hot path, or adding/changing log statements |
| `security-and-trust-boundaries` | Parsing user input, writing/executing SQL or shell commands, handling secrets/tokens/credentials, hashing passwords, adding/changing an auth check, deserializing untrusted data, or constructing file paths/URLs from input |
| `build-deploy-and-tooling` | Authoring/changing build scripts, CI config, deploy pipelines, repo setup, or evaluating a new tool/dependency for adoption |
| `domain-modeling` | Introducing a new top-level type/table/domain concept, renaming a domain concept, or deciding where state lives |
| `working-with-users-and-team` | Gathering or interpreting requirements, estimating effort, or communicating with stakeholders about what to build |

## Priority

1. Your human partner's instructions (CLAUDE.md, GEMINI.md, AGENTS.md, direct prompts) override everything below.
2. **Process skills (superpowers) run before content skills (97).** `superpowers/test-driven-development` decides *whether* to write a test; `97/testing-discipline` decides *what makes it good*. `superpowers/verification-before-completion` decides *did it work*; `97/pre-commit-self-review` decides *is it well-considered*.
3. **More specific 97 skill > broader 97 skill.** `before-you-refactor` wins over `writing-clean-code` when both could apply. `testing-discipline` wins over `writing-clean-code` for test code.
4. **Before editing a file you haven't read this session, read it first.** No skill load — just the cheap reminder. Editing without reading is the most common avoidable failure mode.
5. **When debugging, defer to `superpowers/systematic-debugging` if available.** Otherwise fall back to `error-and-correctness-traps` for trap-shaped bugs and `pre-commit-self-review` step 2 (suspect your own code first) for general debugging.

## Red Flags

| Thought | Reality |
|---|---|
| "The trigger almost matches but not quite." | Almost-matches are the easiest to rationalize past. Invoke and let the skill tell you it doesn't apply. |
| "Two skills could fit; I'll just pick one." | Priority §3 — more specific wins. Invoke that one. |
| "I read this skill last session, I remember it." | Skills evolve. Invoke and read the current version. |

Principles are distilled in our own words from CC-BY-3.0 originals. Plugin code is MIT; see `CONTENT-LICENSE.md` for attribution and takedown policy.
