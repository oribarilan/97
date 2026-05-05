# patch-trigger-coverage-gaps

**Council confidence:** [Majority] — 4/5 councillors named specific
real-world agent situations no skill currently fires on. (One councillor,
contrarian, focused on the taxonomy axis problem rather than gap-filling;
overlap is partial.)

**Task type: decision-heavy.** This task contains 1 implementation
(debugging fallback — pre-decided below) plus 3 decisions (reading
existing code, PR review, data/schema migrations). It is acceptable
for the implementation work on the 3 decisions to be deferred to
follow-up tasks in `.todo/`. The decisions themselves must land in
v0.3 because other tasks (notably `prune-working-with-users-and-team`)
depend on them.

## Context

The 9 themed skills have observable holes for situations agents hit
daily:

1. **Reading / understanding existing code before changing it.** The
   single most common failure mode is slamming edits without reading the
   surrounding file. `before-you-refactor` only fires when the agent has
   *already decided* to refactor — too late.
2. **Debugging an existing failure.** Delegated to
   `superpowers/systematic-debugging`. If superpowers isn't installed,
   no skill fires. If it is, the bootstrap doesn't *tell* the agent to
   defer; the agent may try to handle it without the systematic skill.
3. **Reviewing someone else's PR / code snippet.** `pre-commit-self-review`
   is self-only. `working-with-users-and-team` mentions PR review but
   the bootstrap doesn't surface it.
4. **Data / schema migrations.** `domain-modeling` covers where state
   lives; not how persistent state evolves (rollback, backfill,
   compatibility, deploy ordering, dual-write/read).

**Value delivered:** the bootstrap's trigger map covers situations
agents actually hit, not just the ones the book had essays for.

## Related Files

- `skills/using-97/SKILL.md` — trigger map updates
- `skills/before-you-refactor/SKILL.md` — possibly extended scope
- `skills/pre-commit-self-review/SKILL.md` — possibly extended scope or
  cross-reference
- `skills/working-with-users-and-team/SKILL.md` (or successor — see
  `prune-working-with-users-and-team.md`) — PR-review surfacing
- Possibly new skill: `data-and-schema-changes`

## Dependencies

- Should land **after** `prune-bootstrap-urgency.md` so additions land
  in the slimmed bootstrap, not the bloated one.
- Coordinates with `prune-working-with-users-and-team.md` (PR review
  may move there or out).

## Acceptance Criteria

For each of the 4 gaps, **make and document a decision**: extend an
existing skill, create a new skill, or explicitly defer to v0.4+. Record
the decision in this task file as it ships.

- [x] **Reading existing code before changing it:** decide whether to
  - (a) extend `before-you-refactor` to cover "before changing existing
    code" (broader trigger). **Scope-creep warning:** this would turn
    a refactor-specific skill into a "before-you-edit" skill, hurting
    the existing skill's precision. Most agents already read enough
    before refactoring; the gap is *editing without reading*, which
    is a different mental model. Prefer (b) unless the refactor skill
    is being substantially restructured anyway.
  - (b) add a one-line guidance row to `using-97/SKILL.md` that says
    "before editing a file you haven't read this session, read it
    first" (no skill load, just a cheap reminder), or
  - (c) defer.
  Pick one. Document why.
- [x] **Debugging fallback:** add explicit precedence guidance in
      `using-97/SKILL.md` Priority section: "When debugging, defer to
      `superpowers/systematic-debugging` if available; otherwise fall
      back to `error-and-correctness-traps` for trap-shaped bugs and
      `pre-commit-self-review` step 2 ('suspect your own code first')
      for general debugging."
- [x] **Reviewing others' code:**
  - (a) verify `pre-commit-self-review` does or does not cover this;
        decide whether to broaden it or
  - (b) carve out a `code-review` skill (could be small — 80 lines —
        modeled on the trap template), or
  - (c) defer.
  Pick one. Document why.
- [x] **Data / schema migrations:** decide whether to
  - (a) add a section to `domain-modeling` covering "evolving persistent
        state" with concrete checks (rollback path, backfill, dual-write,
        deploy order), or
  - (b) carve out a new `data-and-schema-changes` skill, or
  - (c) defer.
  Pick one. Document why.
- [x] **For each "defer" or "follow-up implementation" decision**, a
      task file exists in `.todo/backlog/` (or in a `US-v0.4-*`
      directory) before this task moves to `done/`. Decisions
      without paper trails evaporate.
- [x] Whatever changes ship are reflected in `using-97/SKILL.md`
      trigger map and `README.md` "What's inside" table.
- [x] `npm test` passes.

## Verification

**Automated:**
- `npm test`

**Ad-hoc:**
- Trace each of the 4 scenarios mentally through the bootstrap. For
  each, can the agent read the trigger map and arrive at a clear next
  action? If not, the gap remains.

## Notes

- **Don't add 4 new skills.** That's the failure mode this task is
  trying to avoid (bloat in service of "coverage"). Default to extending
  existing skills or adding precedence guidance. Only carve a new skill
  if the content genuinely doesn't fit anywhere.
- Security is a separate gap covered by `add-security-traps-skill.md`.
  This task does not duplicate it.
- Documentation, observability, and reading-an-unfamiliar-codebase as
  navigation discipline are *also* gaps council named, but with lower
  agent-relevance. Defer to v0.4+.

## Decisions (recorded as the task shipped)

1. **Reading existing code before changing it →** picked **(b)**: added a
   one-line guidance row in `using-97/SKILL.md` Priority §4: "Before
   editing a file you haven't read this session, read it first. No skill
   load — just the cheap reminder. Editing without reading is the most
   common avoidable failure mode." Rationale: the gap is "edit without
   read," which (a) would address by inflating `before-you-refactor` past
   its precise scope. (b) is one line in the bootstrap, no new skill,
   targets the actual failure mode.

2. **Debugging fallback →** added **explicit precedence guidance** in
   `using-97/SKILL.md` Priority §5: "When debugging, defer to
   `superpowers/systematic-debugging` if available; otherwise fall back
   to `error-and-correctness-traps` for trap-shaped bugs and
   `pre-commit-self-review` step 2 (suspect your own code first) for
   general debugging." Pre-decided in the AC; now shipped.

3. **Reviewing others' code →** picked **(c) defer**. Rationale: a
   useful code-review skill is ~80–150 lines on its own; v0.3 already
   ships one new skill (security). Adding a second new skill would
   inflate the release past its deletion-heavy intent. Pre-commit-self-review
   is self-only and stays self-only. Backlog task created at
   `.todo/backlog/add-code-review-skill.md`.

4. **Data / schema migrations →** picked **(c) defer**. Rationale: the
   content meaningfully exceeds what fits as a `domain-modeling`
   subsection (rollback, backfill, dual-write/read, deploy ordering,
   compatibility windows — each with worked examples). v0.4+ should
   carry this as its own skill, modeled on `error-and-correctness-traps`.
   Backlog task created at
   `.todo/backlog/add-data-and-schema-changes-skill.md`.
