# 99a-overlap-matrix-audit

## Context

Closing **verification audit**. After every enrichment is in `done/`
and the new `observability` skill has shipped, walk every pair of
skills to confirm the Canonical-home table in `CITATION-SCHEME.md`
covers every cross-cutting principle that surfaced and that ID
uniqueness holds (each principle ID appears in exactly one
`SKILL_RULES.principles` array).

**Per `0a`, canonical homes are decided up front, not here.** The
Canonical-home table in `CITATION-SCHEME.md` lists known cross-cutting
principles and their owning skills before any enrichment runs.
Enrichment tasks add IDs only to canonical homes; the v0.3
cross-listing of `97/26` and `97/29` is resolved during `0b`. This
audit's job is to **verify the discipline held**, not to make new
canonical-home decisions retroactively.

If a new cross-cutting principle was surfaced mid-enrichment without
the responsible task updating `CITATION-SCHEME.md`'s Canonical-home
table, this audit catches it and either (a) confirms the table needs
a row added (file the row in this audit's PR) or (b) confirms the
duplicate is a content drift to consolidate.

**Value delivered:** the bundle reads as one coherent product. Every
principle has one canonical home; every cross-reference resolves
correctly; the Canonical-home table is complete.

## Related Files (read-only inputs)

- Every `skills/*/SKILL.md`
- Every `skills/*/principles.md`
- `scripts/lint-skills.mjs` `SKILL_RULES`
- `CITATION-SCHEME.md` Canonical-home table

## Related Files (edited)

- `CITATION-SCHEME.md` — add new Canonical-home rows for any
  cross-cutting principle surfaced mid-enrichment that the table did
  not anticipate.
- `skills/*/principles.md` — only if a duplicate `## <id> —` heading
  is found that violates ID uniqueness; replace the non-canonical
  heading with a one-line cross-reference.
- `skills/*/SKILL.md` — only if a Red Flags row or checklist item
  uses a long-form name where a backtick ID cross-reference would be
  clearer.
- `scripts/lint-skills.mjs` `SKILL_RULES.principles` — only if a
  non-canonical `SKILL_RULES.principles` array has the same ID as a
  canonical home (uniqueness violation); remove from non-canonical.
- New file `.todo/done/US-v1.0-canon-expansion/OVERLAP-MATRIX.md` —
  the audit artifact. **Lives under `.todo/done/`, not at repo
  root**, because it is internal reference (not user-facing) and
  belongs with the story it summarizes.
- `CHANGELOG.md` — `### Changed` entry summarizing the audit (likely
  brief if the up-front discipline held; longer if remediation was
  needed).

## Dependencies

- All enrichment tasks in `.todo/done/US-v1.0-canon-expansion/`:
  - `0a-citation-scheme-spec.md` (which carries the Canonical-home table)
  - `0b-citation-scheme-migration.md`
  - `enrich-before-you-refactor-fowler.md`
  - `enrich-domain-modeling-wlaschin.md`
  - `enrich-build-deploy-twelve-factor.md`
  - `enrich-error-and-correctness-release-it.md`
  - `enrich-api-design-ousterhout-liskov-king.md`
  - `enrich-testing-discipline-goos.md`
  - `add-observability-skill.md`

## Acceptance Criteria

### Produce the verification matrix

- [ ] Create `.todo/done/US-v1.0-canon-expansion/OVERLAP-MATRIX.md`.
      The doc is **internal reference**, not user-facing. It is a
      snapshot of the bundle's coverage map at v1.0 release time and
      lives with the story.
- [ ] The doc contains a table with one row per principle ID and
      columns for: principle ID, canonical-home skill, cross-referenced
      skills (skills that mention the principle but do not own it),
      brief one-line summary.
- [ ] The doc contains an "Audit results" section listing:
      - Canonical-home table coverage: every cross-cutting principle
        in the bundle has a row in `CITATION-SCHEME.md`'s table.
      - ID-uniqueness check: every principle ID appears in exactly one
        `SKILL_RULES.principles` array.
      - Heading-uniqueness check: every principle ID has a
        `## <id> —` heading in exactly one `principles.md` file
        (cross-references in other `principles.md` files use the
        `## (cross-reference) <id> —` form per `0b`).
      - Any new cross-cutting principles surfaced mid-enrichment
        whose canonical home was missing from the table — and the
        decision applied (which task should have added the row;
        whether to file as a follow-up or fix here).

### Verification (the audit pass)

For each potential overlap:

- [ ] **Confirm canonical home matches `CITATION-SCHEME.md` Canonical-
      home table.** The decision was made in `0a`; this step verifies
      enrichment tasks honored it.
- [ ] **Confirm ID uniqueness.** Run:
      ```
      git grep -h -E "^##\s+[A-Za-z0-9]+/[A-Za-z0-9]+\s+—" skills/*/principles.md \
        | sort | uniq -c | awk '$1 > 1'
      ```
      Output should be empty (no ID appears as a `##` heading in more
      than one `principles.md`). Cross-reference headings of the form
      `## (cross-reference) <id>` are excluded by the regex.
- [ ] **Confirm `SKILL_RULES` uniqueness.** Run a Node one-liner over
      `scripts/lint-skills.mjs` to flatten every
      `SKILL_RULES.principles` array and count duplicates. Output
      should be empty.
- [ ] **Cross-reference IDs in `SKILL.md`.** For each Red Flags row
      or checklist item that mentions a principle owned by another
      skill, confirm it uses the bare ID in backticks (per
      `CITATION-SCHEME.md`'s cross-reference convention) rather than
      a long-form name or file path.

### Remediation (only if verification fails)

This task is a quality gate. If verification passes — likely if 0a's
discipline held — the audit is largely a nominal pass with the
matrix doc as the deliverable. If verification fails, remediate:

- [ ] **Surfaced cross-cutting principle missing from
      `CITATION-SCHEME.md` table:** add the row in this PR. Decide
      canonical home using the trigger rule of thumb (see "Decision
      rule of thumb" below). Move IDs to canonical home if needed.
- [ ] **Heading-uniqueness violation:** keep the canonical entry in
      the chosen skill's `principles.md`; replace duplicate entries
      with a cross-reference of the form:
      ```markdown
      ## (cross-reference) Fowler/PrimitiveObsession

      Canonical entry in `domain-modeling/principles.md`. Surfaced
      here in `SKILL.md` because [reason].
      ```
- [ ] **`SKILL_RULES` uniqueness violation:** remove the duplicate
      ID from the non-canonical skill's `SKILL_RULES.principles`
      array. Lint will then enforce uniqueness going forward.
- [ ] **Cross-reference IDs in `SKILL.md`** by ID where they are
      mentioned but not owned. Use the format defined in
      `CITATION-SCHEME.md`.

#### Decision rule of thumb (only when adding a new row to the table)

The Canonical-home table covers known overlaps. If a previously-
unanticipated overlap surfaces during enrichment, this rule of thumb
helps choose the home. Several principles validly fire under more
than one trigger; pick the **most specific**:

- Trigger fires when *designing a contract* → `api-and-interface-design`.
- Trigger fires when *modeling a new type or invariant* → `domain-modeling`.
- Trigger fires when *changing existing code* → `before-you-refactor`.
- Trigger fires when *adding new code* → `writing-clean-code`.
- Trigger fires when *the call can fail* → `error-and-correctness-traps`.
- Trigger fires when *parsing untrusted input* →
  `security-and-trust-boundaries` first; otherwise
  `api-and-interface-design`.
- Trigger fires when *adding diagnosability* → `observability`.

If two rules tie, pick the skill that has fewer owned principles in
that area (avoids piling onto already-dense skills) and document the
tie-break in `OVERLAP-MATRIX.md`.

### Verification

- [ ] `npm test` passes after any remediation.
- [ ] `git grep` for each duplicated principle ID returns its canonical
      home as the only `## <id> —` heading; all other appearances are
      `## (cross-reference) <id>` headings or backtick references in
      `SKILL.md`.
- [ ] `OVERLAP-MATRIX.md` is consistent with `SKILL_RULES.principles`
      (every entry in the matrix matches a `SKILL_RULES` entry, and
      vice versa).
- [ ] `CITATION-SCHEME.md` Canonical-home table is consistent with
      `OVERLAP-MATRIX.md` (every cross-cutting principle in the matrix
      has a row in the table).
- [ ] `CHANGELOG.md` `### Changed` entry summarizes the audit:
      verification result (passed / N remediations applied);
      principles whose canonical home changed (if any); cross-references
      added (if any).

## Notes

- **Verification audit, not remediation audit.** If the up-front
  Canonical-home table in `CITATION-SCHEME.md` worked as intended,
  this task is largely a nominal pass with the matrix doc as the
  deliverable. Significant remediation here means an enrichment task
  did not honor the canonical-home discipline; that's a process bug
  to capture as a lesson, not a sign 99a should have been bigger.
- **`OVERLAP-MATRIX.md` placement.** Lives under
  `.todo/done/US-v1.0-canon-expansion/`, not at repo root.
  `CITATION-SCHEME.md` at repo root is the contributor-facing spec
  (referenced from `AGENTS.md`); `OVERLAP-MATRIX.md` is the audit
  artifact and belongs with the story it summarizes.
- **Skip any duplicate that is genuinely intentional.** Some overlap
  is fine if each skill frames the principle differently for its
  trigger. The bar: would the agent benefit from seeing the principle
  surfaced from two different angles, or would it just see the same
  rule twice? If the latter, consolidate.
- **Trigger map updates if needed.** If remediation shifts which
  skill owns a principle that was driving a `using-97/SKILL.md`
  trigger row, update the trigger row to point at the new owner.
- **Time budget.** If verification passes cleanly, single focused
  hour for the matrix doc + checks. If meaningful remediation is
  needed, budget 2–3 hours and be honest about scope creep.
