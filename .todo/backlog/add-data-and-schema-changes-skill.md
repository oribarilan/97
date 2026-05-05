# add-data-and-schema-changes-skill

## Context

`patch-trigger-coverage-gaps` (US-v0.3-council-feedback) decided in v0.3
to **defer** dedicated coverage of data/schema migrations. `domain-modeling`
covers *where* state lives; it does not cover how persistent state evolves —
rollback, backfill, dual-write/read, deploy ordering, online vs offline
migrations, compatibility windows.

This is a real production-risk gap. Bad migrations cause outages and data
loss. Agents shipping ORM/schema changes routinely miss the deploy-order
issue (deploy schema before code that reads new columns) and the
backfill issue (default values for existing rows, NULL handling).

**Value delivered:** explicit guidance when an agent touches a migration
file, schema definition, or persistent-state evolution, with concrete
checks for the canonical traps.

## Related Files (to create)

- `skills/data-and-schema-changes/SKILL.md`
- `skills/data-and-schema-changes/principles.md`
- `skills/using-97/SKILL.md` — add trigger row
- `scripts/lint-skills.mjs` — add `SKILL_RULES` entry
- `README.md` — add row to "What's inside" table
- `CHANGELOG.md` — `### Added` entry

## Dependencies

- None (standalone follow-up).

## Acceptance Criteria

- [ ] Decide between (a) extending `domain-modeling` with an "evolving
      persistent state" section vs (b) a dedicated skill. Default to (b)
      if the content meaningfully exceeds ~30 lines.
- [ ] If new skill: follows the `error-and-correctness-traps` template.
- [ ] Covers: rollback path; backfill strategy; dual-write/read windows
      for renames; deploy ordering (schema before code that reads new
      columns); online vs offline migrations; compatibility windows
      across deploys.
- [ ] Each check has a concrete failure example — not just a category
      name (e.g., "renamed column without dual-read → readers on the
      old code path 500 during the deploy window").
- [ ] Trigger covers: writing a migration file, changing a schema
      definition, adding/removing a column or index, renaming a
      persistent field, or shipping any change that requires a deploy
      ordering between database and application code.
- [ ] `npm test` passes.

## Verification

**Automated:** `npm test`.

**Ad-hoc:** ask the agent to write a migration that renames a column;
verify it produces a dual-read window or asks about deploy ordering
rather than dropping-and-recreating in one step.

## Notes

- Provenance: deferred from v0.3
  `.todo/done/US-v0.3-council-feedback/patch-trigger-coverage-gaps.md`
  decision §4.
- The book has thin direct coverage. Most content will be original
  commentary modeled on `error-and-correctness-traps`.
- Stay disciplined on scope: 5 trap domains at concrete-example density,
  not a textbook.
