# 5-before-you-refactor

## Context

Lighter cleanup. `mid-refactor`, "rename is theater", "dirty code bombs",
surgeon-cut metaphor.

## Related Files
- `skills/before-you-refactor/SKILL.md`

## Dependencies
- Task 1 (calibration)

## Acceptance Criteria

- [x] **Agent-first cuts**: deleted entire "The Boy Scout Rule (during the refactor)" section (literary quote wrapper; actionable rule already in Red Flag row 78). Deleted entire "Don't be afraid to break things — temporarily" section (surgeon quote; actionable rule already in done-checklist criterion 4).
- [x] **Precedence cleanup**: deleted entire Precedence section (3 generic process bullets — TDD, debugging, "this skill governs..."). All redundant with `using-97` rule 2.
- [x] `mid-refactor` removed; "you are not done — you are mid-refactor" → "you are not done."
- [x] "rename is theater" → "renaming alone won't help"
- [x] "dirty code bombs that will balloon a 4-hour refactor into a 4-week one" → "tangled spots that turn a small refactor into a big one"
- [x] "dirty code bombs detonate" Red Flag → "the worst tangles hide"
- [x] "dirty code bombs" outside your scope → "tangled spots outside your scope"
- [x] `human partner` → `the user` (5 instances: rigid-skill line, item 3, item 4, item 6, two done-list lines)
- [x] Principles table entry "97/8 | The Boy Scout Rule" preserved (book's actual principle name, citation provenance)
- [x] Templated rule-of-five imperative opener preserved (it's the agent's primary action sequence; agent-actionable, not atmospheric)
- [x] `npm test` passes

## Verification

- `rg 'mid-refactor|rename is theater|dirty code bomb' skills/before-you-refactor/SKILL.md` returns 0 hits
- `npm test` exits 0
