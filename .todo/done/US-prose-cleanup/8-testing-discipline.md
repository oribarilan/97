# 8-testing-discipline

## Context

Four-clause thesis sentence on line 10 (rule-of-four with `-ing`-style
continuations). Bridge-engineer analogy on line 46 ("bridge engineer
skipping structural analysis") is overworked.

## Related Files
- `skills/testing-discipline/SKILL.md`

## Dependencies
- Task 1 (calibration)

## Acceptance Criteria

- [x] **Agent-first cuts**: tightened thesis sentence (cut "(not the implementation)", "states a concrete example a reader can check by eye", "in the language of the domain", "is safe for the test data to leak in front of a customer" → 4 short clauses). Cut bridge-engineer analogy from item 1.
- [x] **Precedence cleanup**: deleted entire Precedence section (3 bullets — TDD, before-you-refactor, domain-modeling). All redundant with `using-97` rules 2 and 3 and the trigger map. The `GOOS/ListenToTestPain` callout is preserved in Red Flag row "The test setup is fifty lines, then a one-line assert".
- [x] `mid-written` removed; "the test is not done — it is mid-written" → "the test is not done"
- [x] `human partner` → `the user`
- [x] `npm test` passes

## Verification

- Overview line 10 doesn't pattern-match the rule-of-four shape
- `npm test` exits 0
