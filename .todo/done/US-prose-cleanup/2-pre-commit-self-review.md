# 2-pre-commit-self-review

## Context

Second-densest jargon file (15 hits). Heavy use of `landmines`, `hand-off`,
`trap shape`, "as a stranger." Need to keep the `Adjacent issues:` artifact
literal string intact (load-bearing).

**Value delivered:** the most-quoted skill (cited by `using-97`) reads in
plain words.

## Related Files
- `skills/pre-commit-self-review/SKILL.md`

## Dependencies
- Task 1 (calibration sign-off)

## Acceptance Criteria

- [x] **Agent-first cuts**: removed entire "A Message to the Future" section (atmospheric framing; citation already in item 1). Trimmed Overview rule-of-four ("commit, PR, teammate, future self"). Generalized OpenCode-specific commit line to be agent-agnostic.
- [x] **Precedence cleanup**: deleted entire Precedence section (3 bullets, all generic process-first; redundant with `using-97` rule 2).
- [x] `landmines` rewritten as "unsafe code" / "unsafe patterns" throughout (4 instances + Red Flag + done check)
- [x] `Adjacent issues:` literal string preserved exactly (3 instances intact)
- [x] `hand-off` removed throughout (4 instances): description frontmatter, item 4, item 9, Red Flag — all → "summary" / "summary to the user"
- [x] `trap shape(s)` → "unsafe pattern(s)" (3 instances)
- [x] `mid-review` removed; "you are not done — you are mid-review" → "you are not done."
- [x] `npm test` passes
- [x] Cross-skill references checked (no other skill references the cut sections)

## Verification

- `rg 'landmine' skills/pre-commit-self-review/SKILL.md` returns 0 hits
- `rg 'Adjacent issues:' skills/pre-commit-self-review/SKILL.md` still returns the original count (artifact preserved)
- `npm test` exits 0
