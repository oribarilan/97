# US-prose-cleanup

## Goal

Make the repo's prose sound human, use simple words, and avoid being verbose
or overly academic — while keeping it professional. Apply the `humanizer`
skill throughout. Strip in-house metaphors that readers have to decode.

User goal (verbatim): "i want it to sound human (use humanizer as well),
simple words, and not too verbose or overly academic."

## Definition of Done

- [x] No `trap-scan`, `trap shape`, `the trap closes`, `invisible until it bites`, `mid-X`, `landmines`, `wearing a costume`/`wearing a class`, `fires hardest`/`fires lightly` in skill bodies (verified: 0 hits across `skills/*/SKILL.md`)
- [x] No `hard-won lessons of world-renowned programmers` / `behavior-shaping skills` in `AGENTS.md`, `CONTRIBUTE.md`, `README.md`, `skills/using-97/SKILL.md` (the two surviving instances in AGENTS.md are inside Bad-example / AI-vocabulary-to-avoid demonstrations — intentional)
- [x] AGENTS.md changelog "Good" example rewritten to match the new opener (no contradiction)
- [x] `humanizer` rules applied throughout
- [x] "Subtract before substitute" guidance added to AGENTS.md (one sentence, voice-rule neighborhood)
- [x] Agent-first prose rule added to AGENTS.md alongside subtract-before-substitute
- [x] CHANGELOG `### Changed` bullet added under `[Unreleased]`, ≤6 lines
- [x] `npm test` passes (lint + format-check + smoke)
- [x] Cross-skill references stay consistent (verified after each task)
- [x] User reviewed task 1 (calibration checkpoint) and signed off on the new voice before tasks 2+ proceeded

## Task Priority

Numeric prefixes — order matters. Task 1 is a calibration checkpoint; the
user reviews the diff before tasks 2+ run.

1. `1-error-and-correctness-traps.md` — densest jargon, calibration target
2. `2-pre-commit-self-review.md` — second-densest (15 hits), heavy `landmines` / `hand-off` use
3. `3-security-and-trust-boundaries.md` — heavy `trap`-compound use
4. `4-observability.md` — `trap-scan` reuse from template
5. `5-before-you-refactor.md`
6. `6-writing-clean-code.md`
7. `7-api-and-interface-design.md`
8. `8-testing-discipline.md`
9. `9-domain-modeling.md`
10. `10-build-deploy-and-tooling.md`
11. `11-working-with-users-and-team.md`
12. `12-using-97.md` — bootstrap, careful with trigger force (`scripts/test-trigger-force.mjs`)
13. `13-agents-and-contribute.md` — promotional opener + AGENTS.md changelog example
14. `14-readme.md` — last; voice settles upstream first
15. `15-meta-rule-and-changelog.md` — encode "subtract before substitute" + write the `### Changed` bullet

## Cross-Cutting Concerns

- **Audience: agents, not human readers.** Skill files are loaded into agent context at trigger time. Cut prose that is editorial framing for human readers; keep prose that an agent acts on. Specifically:
  - **Cut:** subsection lead-in one-liners that summarize the rules below them, atmospheric Overview openers, duplicate navigation instructions, vivid metaphors that don't change behavior.
  - **Keep:** imperative numbered rules, `Example:` blocks, Red Flags tables, "What done looks like" checklists, trigger lists, precedence sections, citations.
  - **Reframe vague rules into actions an agent can take.** "Know who understands the magic" → "surface unknown dependencies in your summary to the user before shipping." If an agent can't act on the rule as written, rewrite it.
- **Precedence sections: default to deleting them entirely.** `using-97` already carries the universal rules: trigger map (which skill loads), rule 2 (process before content), rule 3 (more specific > broader). Once a 97 skill is loaded, restating "X runs first when..." or "Y runs at the end of the unit of work" adds nothing for the agent — the trigger map already routed, and these notes only help a human reader. **Keep a Precedence section only if it states a 97↔97 ordering that is genuinely non-obvious AND not already implied by the trigger map or `using-97`'s rules 1–3.** When in doubt, cut.
- **Subtract before substitute.** Default: delete the offending phrase. Replace only if deletion breaks the sentence. Vivid coined word → generic word is a regression.
- **Out of scope:** `harness`, skill names (`error-and-correctness-traps` stays), `<bootstrap name="using-97">` literal in `.opencode/plugins/97.js`, `Adjacent issues:` artifact string in `pre-commit-self-review`, `principles.md` files (separate voice rules).
- **Lint risk:** `scripts/lint-skills.mjs` enforces line-count caps and required section headers. Run `npm test` after each task. If a rewrite expands a file past its cap, cut harder.
- **Cross-skill references must stay consistent (AGENTS.md rule).** Before marking a task done, `rg <renamed-term> skills/` to verify no stale references.
- **No new coinages.** If you find yourself inventing a replacement word, prefer deletion or plain English.
- **Keep:** imperative voice in checklists, "Concrete:" / "Example:" examples, Red Flags tables, technical terms with real meaning (cardinality, idempotency, circuit breaker, parameterized query). Vivid one-offs are case-by-case — flag for review, default to cut if they don't change agent behavior.
- **Commit per task.** One commit per file/task with a `prose: <skill> — <summary>` prefix.
- **Out of scope:** `harness`, skill names (`error-and-correctness-traps` stays), `<bootstrap name="using-97">` literal in `.opencode/plugins/97.js`, `Adjacent issues:` artifact string in `pre-commit-self-review`, `principles.md` files (separate voice rules).
- **Lint risk:** `scripts/lint-skills.mjs` enforces line-count caps and required section headers. Run `npm test` after each task. If a rewrite expands a file past its cap, cut harder.
- **Cross-skill references must stay consistent (AGENTS.md rule).** Before marking a task done, `rg <renamed-term> skills/` to verify no stale references.
- **No new coinages.** If you find yourself inventing a replacement word, prefer deletion or plain English.
- **Keep:** imperative voice in checklists, "Concrete:" / "Example:" examples, Red Flags tables, technical terms with real meaning (cardinality, idempotency, circuit breaker, parameterized query). Vivid one-offs are case-by-case — flag for review, default to cut if they don't change agent behavior.
- **Commit per task.** One commit per file/task with a `prose: <skill> — <summary>` prefix.
