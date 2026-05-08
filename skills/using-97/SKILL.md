---
name: using-97
description: Use when starting any coding task — establishes the 97 trigger map so principles fire when relevant
---

## Overview

**97** distills established programming practice into trigger-based skills, in the spirit of *97 Things Every Programmer Should Know* (O'Reilly, ed. Kevlin Henney; CC-BY-3.0 originals at https://github.com/97-things/97-things-every-programmer-should-know). You have eleven themed skills plus this bootstrap. Each one activates on a specific situation — refactoring, writing tests, designing an API, committing — and brings the relevant principles to bear. Per-skill `principles.md` files list every source. Unofficial companion, not affiliated with O'Reilly or any contributor.

## **CRITICAL: invoke matching skills BEFORE any response or action**

When a user message matches a row in the Trigger Map, you MUST invoke the named skill before taking any other tool action and before writing your reply. Use the `Skill` tool with the **bare skill name** (e.g. `before-you-refactor`). This rule is not negotiable: even a 1% match means invoke. The skill carries the checklist; skipping it means doing the work the default way and losing the point of having 97 installed.

The trigger fires on user words, not on file size or task complexity. If the user says "refactor", invoke `before-you-refactor` — even for a one-line change. If the user says "clean", "test", or "commit", invoke the matching skill. Action-target prompts ("refactor file X", "clean up function Y", "write tests for Z") are the most common trigger and MUST NOT be treated as "just do it" requests.

## Trigger Map

| Skill | Trigger |
|---|---|
| `writing-clean-code` | Adding a new function/class, naming a new entity, or modifying ≥3 lines of non-trivial logic (NOT typos, config, or test code) |
| `before-you-refactor` | About to refactor, restructure, rename across files, or "clean up" existing code |
| `testing-discipline` | Writing tests, designing test data, naming a test, choosing what to assert, or writing test helpers/mocks/fixtures |
| `api-and-interface-design` | Designing a public API, exported function signature, module boundary, exported type, or any contract other code depends on |
| `pre-commit-self-review` | About to commit, finish a task, open a PR, summarize work, or when asked for a review or hand-off |
| `error-and-correctness-traps` | Writing error handling, comparing/calculating with floats, writing concurrent code, calling a remote process, adding a singleton/global, choosing a data structure for a hot path, or adding/changing log statements |
| `security-and-trust-boundaries` | Parsing user input, writing/executing SQL or shell commands, handling secrets/tokens/credentials, hashing passwords, adding/changing an auth check, deserializing untrusted data, or constructing file paths/URLs from input |
| `observability` | Adding a request handler, RPC, or background job that will run in production; adding tracing, metrics, or structured-log calls; or making cross-process diagnosability decisions |
| `build-deploy-and-tooling` | Authoring/changing build scripts, CI config, deploy pipelines, repo setup, or evaluating a new tool/dependency for adoption |
| `domain-modeling` | Introducing a new top-level type/table/domain concept, renaming a domain concept, or deciding where state lives |
| `working-with-users-and-team` | Gathering or interpreting requirements, estimating effort, or communicating with stakeholders about what to build |

## Priority

1. Your human partner's instructions (CLAUDE.md, GEMINI.md, AGENTS.md, direct prompts) override everything below.
2. **Process and methodology skills run before content skills.** Whatever they live under (`superpowers/`, custom local skills, etc.), skills that decide *whether* and *how to approach* — debugging, verification, planning, TDD, brainstorming — run before 97. 97 skills decide *what makes the code good* once you're writing it. Example: a TDD skill decides whether to write a test; `97/testing-discipline` decides what makes it good. A verification skill decides whether the work is done; `97/pre-commit-self-review` decides whether it was well-considered.
3. **More specific 97 skill > broader 97 skill.** `before-you-refactor` wins over `writing-clean-code` when both could apply. `testing-discipline` wins over `writing-clean-code` for test code.
4. **Before editing a file you haven't read this session, read it first — and as you read, scan for unsafe code adjacent to your edit** (hardcoded credentials, string-built SQL/shell, unsafe deserialization on untrusted input, swallowed exceptions). If you find one, surface it in your summary to the user; do not silently rewrite outside scope. Editing without reading is the most common avoidable failure mode; reading without scanning is how unsafe code next to your edit ships under your name.
5. **When debugging, defer to a systematic-debugging skill if one is available.** Otherwise fall back to `error-and-correctness-traps` for domain-specific bugs and `pre-commit-self-review` step 2 (suspect your own code first) for general debugging.
6. **Apply principles silently.** Do not surface source author names, book titles, or principle IDs (e.g. `97/74`, `Fowler/LongMethod`) in user-facing responses. Citations exist for repo provenance, not for user-facing authority.
7. **Match principle weight to stage and stakes.** Production discipline — resilience patterns, observability, deploy hygiene, security boundaries — matters most when code reaches real users. In MVPs, prototypes, internal dev tools, and one-off scripts, prefer the simplest thing that works. Don't retrofit production discipline onto code whose architecture isn't settled.

## Red Flags

These thoughts mean STOP — invoke the matching skill instead of acting:

| Thought | Reality |
|---|---|
| "This change is small enough that I'll just do it." | Small changes are exactly where the discipline pays off. Invoke. |
| "The user gave me a concrete file or function — I should just go edit it." | Action-target prompts are the most common trigger, not an excuse to skip. Invoke first, then act. |
| "I don't need the skill — I already know this one." | Skills evolve and the checklist matters. Invoke and read the current version. |
| "The trigger almost matches but not quite." | Almost-matches are the easiest to rationalize past. Invoke; the skill will tell you if it doesn't apply. |
| "Two skills could fit; I'll just pick one." | Priority rule 3 — more specific wins. Invoke that one. |

Principles are distilled in our own words from CC-BY-3.0 originals. Plugin code is MIT; see `CONTENT-LICENSE.md` for attribution and takedown policy.
