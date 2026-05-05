# add-code-review-skill

## Context

`patch-trigger-coverage-gaps` (US-v0.3-council-feedback) decided in v0.3
to **defer** carving a dedicated code-review skill. Reviewing someone
else's PR is a real agent situation — increasingly common as agents
participate in PR workflows — but `pre-commit-self-review` is self-only
and `working-with-users-and-team` (post-prune) keeps PR review at most
as a passing reference.

A focused `code-review` skill (~80 lines, modeled on the
`error-and-correctness-traps` template) would close the gap. v0.3 was
intentionally deletion-heavy plus one new skill (security); a second
new skill would have inflated scope past what the release wanted.

**Value delivered:** the agent has explicit guidance for reviewing
someone else's diff — what to look for, what to comment on, what to
let go — instead of falling back on `pre-commit-self-review`'s self-only
checklist or improvising.

## Related Files (to create)

- `skills/code-review/SKILL.md`
- `skills/code-review/principles.md`
- `skills/using-97/SKILL.md` — add trigger row
- `scripts/lint-skills.mjs` — add `SKILL_RULES` entry
- `README.md` — add row to "What's inside" table
- `CHANGELOG.md` — `### Added` entry

## Dependencies

- None (standalone follow-up).

## Acceptance Criteria

- [ ] `skills/code-review/SKILL.md` exists, follows the
      `error-and-correctness-traps` template (Overview → When to invoke
      → Non-triggers → Precedence → checks-by-category → Red Flags →
      What "done" looks like → Principles).
- [ ] Trigger covers reviewing someone else's PR, code snippet, or
      diff — distinct from self-review.
- [ ] Precedence section spells out the boundary with
      `pre-commit-self-review` (self-only) and
      `working-with-users-and-team` (estimation/requirements).
- [ ] Skill fits in ≤ 200 lines (`error-and-correctness-traps` density).
- [ ] `using-97/SKILL.md` trigger map row added.
- [ ] `scripts/lint-skills.mjs` entry added.
- [ ] `README.md` "What's inside" table updated.
- [ ] `CHANGELOG.md` `### Added` entry written.
- [ ] `npm test` passes.

## Verification

**Automated:** `npm test`.

**Ad-hoc:** ask the agent to review a real PR diff; verify the skill
fires and the comments are concrete (line citations, not vibes).

## Notes

- Provenance: deferred from v0.3
  `.todo/done/US-v0.3-council-feedback/patch-trigger-coverage-gaps.md`
  decision §3.
- Could draw on book principles #58 (Goodliffe — pre-review before
  pushing) and #69 (Hindsight trap), but most content is original.
- Don't pad to match `working-with-users-and-team` length. 80–150 lines
  is the target range.
