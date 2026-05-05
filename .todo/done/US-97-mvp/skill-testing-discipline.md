# skill-testing-discipline

## Context

Build the `testing-discipline` themed skill. Triggers when writing tests, test data, or test helpers — the place agents most often cut corners.

**Value delivered**: Agents resist the temptation to write trivially-passing tests, cute test data, or tests that lock in incidental behavior.

**Use `3-skill-before-you-refactor` as the template.**

## Related Files

- `skills/before-you-refactor/SKILL.md` — proven template
- `.todo/US-97-mvp/main.md` — cross-cutting rules

## Dependencies

- `3-skill-before-you-refactor.md`

## Source principles to distill

Per `main.md` source-material policy: GitHub mirror first, Medium as reading aid only. Many of these have no direct Medium link in the TOC — the GitHub mirror is the canonical source anyway.

1. **#25 Don't Be Cute with Your Test Data** — Rod Begbie
2. **#60 News of the Weird: Testers Are Your Friends** — Burk Hufnagel
3. **#80 Test for Required Behavior, Not Incidental Behavior** — Kevlin Henney
4. **#81 Test Precisely and Concretely** — Kevlin Henney
5. **#82 Test While You Sleep (and over Weekends)** — Rajith Attapattu
6. **#83 Testing Is the Engineering Rigor of Software Development** — Neal Ford
7. **#92 When Programmers and Testers Collaborate** — Janet Gregory
8. **#95 Write Tests for People** — Gerard Meszaros

## Acceptance Criteria

- [ ] All 8 sources fetched from GitHub mirror first; provenance recorded in `principles.md`
- [ ] `skills/testing-discipline/SKILL.md` exists with frontmatter:
  - [ ] `name: testing-discipline`
  - [ ] **Trigger** (situation-based): `description: Use when writing new tests, designing test data, naming a test, choosing what to assert, or writing test helpers/mocks/fixtures`
- [ ] Body matches template structure
- [ ] **Non-triggers** subsection lists ≥3 prompts that should NOT fire this skill:
  - "run the existing tests" → no
  - "fix this failing assertion" (one-line edit) → no
  - "add a docstring to this test" → no
- [ ] Body explicitly states the boundary with `superpowers:test-driven-development` per `main.md` precedence: TDD decides *whether/when* to write a test (process); this skill decides *what makes the test good* (quality). One sentence in "When to invoke".
- [ ] `principles.md` has long-form per-principle distillations in your own words (no verbatim quotes >25 words), with author + GitHub mirror link + source provenance
- [ ] `SKILL.md` under 200 lines
- [ ] `scripts/lint-skills.mjs` passes
- [ ] **Positive trigger test**: "add tests for the parseCSV function" → invokes skill before writing test code
- [ ] **Negative trigger test**: "run `npm test`" → does NOT invoke

## Verification

- **Automated**: `npm run lint` exits 0
- **Ad-hoc**:
  - Positive: "write tests for `<simple function>`" → expect invocation before test code
  - Negative: "run the test suite" → must NOT invoke
- Cross-check against superpowers' `test-driven-development` skill — 97's testing-discipline must NOT contradict TDD; it should layer on top (TDD = process, this = test quality)

## Notes

- Coordinate with TDD: this skill is about the QUALITY of tests, not whether to write them first. Reference `superpowers:test-driven-development` in the skill for the when, this skill for the what-makes-a-good-test.
- All sources should be available on the GitHub mirror; Medium is supplementary only.
