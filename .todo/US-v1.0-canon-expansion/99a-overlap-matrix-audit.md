# 99a-overlap-matrix-audit

## Context

Closing audit task. After every enrichment is in `done/` and the new
`observability` skill has shipped, walk every pair of skills to
identify and resolve duplicate coverage. With ~25 new principles
distributed across 7 skills, principle overlap is inevitable. This
task makes overlap visible and forces a canonical-home decision for
each duplicate so the agent does not see the same rule three times
under three different names.

Without this audit, known duplications will leak into v1.0:
- **Primitive Obsession** appears in `writing-clean-code` (97/94),
  `api-and-interface-design` (97/65), `domain-modeling`
  (97/2 territory), and now `before-you-refactor` if any Fowler
  Primitive-Obsession smell was added — that is **four** locations
  for one rule.
- **Logs** are touched by `error-and-correctness-traps` (what to log /
  what not to), `build-deploy-and-tooling` (12F XI transport), and
  the new `observability` skill (content shape) — three skills, three
  framings.
- **Parse-don't-validate** vs **make-invalid-states-unrepresentable**
  resolved in plan to api-design vs domain-modeling respectively;
  this audit confirms the resolution stuck.
- **Boundary handling** appears in `api-and-interface-design`,
  `security-and-trust-boundaries` (v0.3), and via parse-don't-validate.

**Value delivered:** the bundle reads as one coherent product instead
of as a stitched-together compilation. Each principle has one
canonical home; cross-references replace duplications.

## Related Files (read-only inputs)

- Every `skills/*/SKILL.md`
- Every `skills/*/principles.md`
- `scripts/lint-skills.mjs` `SKILL_RULES`

## Related Files (edited)

- `skills/*/principles.md` — for any duplicate principle: keep
  canonical entry; replace duplicates with cross-reference lines.
- `skills/*/SKILL.md` — for any duplicate Red Flag or checklist item:
  keep canonical surface; cross-reference from secondary skills.
- `scripts/lint-skills.mjs` `SKILL_RULES.principles` arrays update
  to remove principle IDs from non-canonical homes.
- New file `OVERLAP-MATRIX.md` at repo root — the artifact this task
  produces. (See acceptance criteria.)
- `CHANGELOG.md` — `### Changed` entry summarizing the resolutions.

## Dependencies

- All enrichment tasks in `.todo/done/US-v1.0-canon-expansion/`:
  - `0a-citation-scheme-spec.md`
  - `0b-citation-scheme-migration.md`
  - `enrich-before-you-refactor-fowler.md`
  - `enrich-domain-modeling-wlaschin.md`
  - `enrich-build-deploy-twelve-factor.md`
  - `enrich-error-and-correctness-release-it.md`
  - `enrich-api-design-ousterhout-liskov-king.md`
  - `enrich-testing-discipline-goos.md`
  - `add-observability-skill.md`

## Acceptance Criteria

### Produce the overlap matrix

- [ ] Create `OVERLAP-MATRIX.md` at repo root. The doc is **internal
      reference**, not user-facing. It is a snapshot of the bundle's
      coverage map at v1.0 release time.
- [ ] The doc contains a table with one row per principle ID and
      columns for: principle ID, canonical-home skill, cross-referenced
      skills (skills that mention the principle but do not own it),
      brief one-line summary.
- [ ] The doc contains a section listing every principle ID that
      appears in more than one skill's `SKILL_RULES.principles`
      before this audit, and the resolution applied to each (which
      skill kept it; which skills now cross-reference).

### Apply resolutions

For each duplicate identified:

- [ ] **Pick a canonical home** based on the trigger that fires the
      principle most directly. Decision rule of thumb:
  - Trigger fires when *designing a contract* → `api-and-interface-design`.
  - Trigger fires when *modeling a new type or invariant* → `domain-modeling`.
  - Trigger fires when *changing existing code* → `before-you-refactor`.
  - Trigger fires when *adding new code* → `writing-clean-code`.
  - Trigger fires when *the call can fail* → `error-and-correctness-traps`.
  - Trigger fires when *parsing untrusted input* →
    `security-and-trust-boundaries` (v0.3) **then**
    `api-and-interface-design`.
  - Trigger fires when *adding diagnosability* → `observability`.
- [ ] **Keep the canonical entry** in the chosen skill's
      `principles.md` and `SKILL_RULES.principles`.
- [ ] **Replace duplicate entries** in other skills' `principles.md`
      with a one-line cross-reference, e.g.:
      ```markdown
      ## (cross-reference) Fowler/PrimitiveObsession

      See `Fowler/PrimitiveObsession` in `domain-modeling/principles.md`
      for the canonical entry. This skill cross-references it because
      [reason].
      ```
- [ ] Remove the duplicate principle ID from the non-canonical
      skills' `SKILL_RULES.principles` array. Lint will then enforce
      the principle exists *only* in its canonical home.
- [ ] Cross-reference principles in `SKILL.md` (Red Flags rows or
      checklist) by ID where they are mentioned but not owned. Use
      the format defined in `CITATION-SCHEME.md`.

### Specific known duplications to resolve

The audit is open-ended (every pair of skills); the planner identified
these in advance and the audit must resolve them at minimum:

- [ ] **Primitive Obsession** — canonical home decision documented in
      `OVERLAP-MATRIX.md`. Recommended: `domain-modeling` (closest
      trigger: introducing a domain concept). Other skills
      cross-reference.
- [ ] **Parse, don't validate** vs **Make invalid states
      unrepresentable** — confirm api-design owns
      `King/ParseDontValidate`; domain-modeling owns
      `Wlaschin/InvalidStatesUnrepresentable`; cross-references in
      both.
- [ ] **Logs** (what to log / transport / content shape) — three-way
      split confirmed: `error-and-correctness-traps` owns *what not
      to log*; `build-deploy-and-tooling` owns *transport* (`12F/XI`);
      `observability` owns *content shape* (`OTel/StructuredLogs`).
      Each skill's `principles.md` cross-references the other two.
- [ ] **Boy Scout Rule** — already in `before-you-refactor`. If any
      enrichment surfaced it elsewhere, remove.
- [ ] **DRY** — already in `writing-clean-code`. Confirm no enrichment
      duplicated it.
- [ ] **Retry / backoff** — `error-and-correctness-traps` (existing)
      and the new `RI/CircuitBreaker` need clear precedence. Recommended:
      retry/backoff is the existing 97/9 territory; circuit breaker
      is a separate higher-level pattern. No deletion; cross-reference
      in both directions.

### Verification

- [ ] `npm test` passes after all resolutions.
- [ ] `git grep` for each duplicated principle ID returns its canonical
      home as the only `## <id> —` heading; all other appearances are
      cross-references.
- [ ] `OVERLAP-MATRIX.md` is consistent with `SKILL_RULES.principles`
      (every entry in the matrix matches a SKILL_RULES entry, and
      vice versa).
- [ ] `CHANGELOG.md` `### Changed` entry summarizes the audit:
      number of duplications resolved; principles whose canonical
      home changed; any cross-references added.

## Notes

- **This task is a quality gate, not new content.** No principle is
  added; no distillation is rewritten. Existing distillations may be
  trimmed where one becomes a cross-reference.
- **Audit format is informal.** `OVERLAP-MATRIX.md` is internal
  reference, not user-facing documentation. Aim for readable, not
  beautiful.
- **Skip any duplicate that is genuinely intentional.** Some overlap
  is fine if each skill frames the principle differently for its
  trigger. The bar: would the agent benefit from seeing the principle
  surfaced from two different angles, or would it just see the same
  rule twice? If the latter, consolidate.
- **Trigger map updates if needed.** If the resolution shifts which
  skill owns a principle that was driving a `using-97/SKILL.md`
  trigger row, update the trigger row to point at the new owner.
- **Time budget.** Single-pass audit; aim for one focused session.
  If new duplications surface mid-audit that were not in the planner's
  list, document them in `OVERLAP-MATRIX.md` and resolve them.
