# US-v1.0-canon-expansion

## Goal

Reposition `97` from a single-book derivative to a **trigger-based
distillation of the modern programming canon**. Keep the name as a brand
(decoupled from a literal essay count). Keep the trigger taxonomy (it is
the product). Broaden the input set from one book to a curated canon:
*97 Things*, *Refactoring* (Fowler), *Pragmatic Programmer*, *Clean Code*,
SOLID, 12-factor, *Continuous Delivery*, *Accelerate*/DORA, *Release It!*
(Nygard), Wlaschin (DDD made functional / parse-don't-validate), *Growing
Object-Oriented Software Guided by Tests* (GOOS), *xUnit Test Patterns*,
*SRE* / Honeycomb-era observability, Cagan *Inspired*.

This is the **v1.0 identity shift**. The 0.x line was "97 Things companion".
The 1.x line is "trigger-based agent skills distilled from the canon."

This story does **not** include the v1.0.0 release commit itself — version
bumps, tagging, and marketplace push follow `CONTRIBUTE.md`'s manual
release process and happen in a separate session by the release author
after every task here is in `done/`.

## Hard dependencies

**v0.3 (`US-v0.3-council-feedback`) must ship first.** v0.3 prunes
bootstrap, drops the once-per-file rule, prunes
`working-with-users-and-team`, adds `security-and-trust-boundaries`,
and tightens `writing-clean-code`. v1.0 work assumes that baseline.
Starting v1.0 enrichment against an unpruned v0.2 baseline will create
merge conflicts on every shared file in `using-97/SKILL.md`,
`scripts/lint-skills.mjs`, `README.md`, and `CHANGELOG.md`.

**Within this story, the citation/lint scheme must ship before
anything else.** `0a-citation-scheme-spec.md` (writes
`CITATION-SCHEME.md`) and `0b-citation-scheme-migration.md` (migrates
`#NN` → `<source-key>/<principle-key>` IDs throughout the codebase)
land before `1-reposition-framing.md` and before any enrichment task.
Reason: the existing lint and `principles.md` heading format are
integer-keyed on *97 Things* essay numbers, so the moment a Fowler
smell or 12-factor item is added the scheme breaks. Settling the
scheme up front prevents every enrichment task from inventing it
ad-hoc and prevents the lint guardrail going silent on canon content.

## Definition of Done

The story is complete when **all** of the following hold:

- [ ] Every task file in this story is in `.todo/done/US-v1.0-canon-expansion/`
      with all acceptance criteria checked.
- [ ] `npm test` (lint + format-check + smoke) passes on a clean checkout.
- [ ] `CITATION-SCHEME.md` exists at repo root and matches the ID
      format used by every `principles.md` heading and every
      `SKILL_RULES.principles` entry. `scripts/lint-skills.mjs`
      enforces the new format.
- [ ] `README.md` "What this is" section reframes the project around the
      canon, not just *97 Things*. Credits section lists the multi-source
      canon. Total skill count and skill table reflect any new skills.
      No count-coupled headline phrases (e.g. "78 of 97") survive.
- [ ] `skills/using-97/SKILL.md` Overview reframed: *97 Things* is the
      seed; the canon is the source set. Trigger map updated with any new
      trigger rows.
- [ ] `CONTENT-LICENSE.md` updated to document the multi-source attribution
      model: own-words commentary across many sources, with per-principle
      source citations in each `principles.md`. CC-BY-3.0 attributions for
      *97 Things* derivatives remain explicit. Includes the principle-ID
      paragraph added in `0b-citation-scheme-migration.md`.
- [ ] At least 3 existing skills have `principles.md` enriched with at
      least 3 new canonical principles each, surfaced in `SKILL.md`
      checklist or Red Flags where they change agent behavior.
- [ ] Every enriched `principles.md` cites its non–*97 Things* sources
      using IDs registered in `CITATION-SCHEME.md` (book + author +
      chapter where relevant) so the attribution chain is traceable.
- [ ] One new themed skill exists: `observability-and-operations`,
      structured in the `error-and-correctness-traps` template.
- [ ] `scripts/lint-skills.mjs` `SKILL_RULES` entries reflect new
      principle counts and the new skill, all in
      `<source-key>/<principle-key>` string-ID format.
- [ ] `CHANGELOG.md` `[Unreleased]` reflects every user-visible change,
      flagged as the v1.0 identity shift.
- [ ] Release process for v1.0.0 follows the manual procedure in
      `CONTRIBUTE.md` — version bump in lockstep across the three
      manifests, tagged commit, etc. (Out of scope for this story; flagged
      for the release author.)

## Cross-Cutting Concerns

### The trigger taxonomy is the moat — sources are commodity

Every added principle must be **trigger-actionable**: a one-line rule the
agent can fire at a specific moment in a specific situation. If a principle
can only be expressed as a paragraph of philosophy, it does not belong in
`SKILL.md`. It may live in `principles.md` as background, but the bar to
surface it in a skill checklist or Red Flags row is "would this rule change
what the agent writes in the next 60 seconds?" If no, drop it.

### Voice rules unchanged

Imperative, terse, concrete. No AI tells. The `humanizer` rules apply.
**Special caution for Clean Code (Martin) and Pragmatic Programmer
sources:** their original voice is dogmatic and homiletic. Re-voice into
97's situational, humble register. Cite the source for attribution; do not
quote.

### Per-principle source citations

Per-principle citation format is decided in `0a-citation-scheme-spec.md`
and recorded in `CITATION-SCHEME.md`. Every principle gets a stable
string ID of the form `<source-key>/<principle-key>` (e.g. `97/74`,
`Fowler/LongMethod`, `RI/CircuitBreaker`, `12F/III`). The full registry
of accepted source keys lives in the Sources table of
`CITATION-SCHEME.md`; new sources require an edit to that table in the
same PR as the first enrichment that uses them.

Heading + unified 5-field metadata block in `principles.md`:

```markdown
## <full-id> — <Title>

**Author:** <Name>
**Source:** <URL for CC-BY sources, book+chapter for copyrighted books, URL for online essays>
**License:** <CC-BY-3.0, fair-use commentary, Apache-2.0, etc.>

**Distillation.** <own words; no quoted strings>

**Agent application.** <how it's wired into SKILL.md>
```

Five fields, calibrated to CC-BY-3.0 obligations (attribute author,
identify license, link original, indicate modification) plus the
agent-application field that ties the principle into `SKILL.md`. The
file-level top matter in each `principles.md` carries the canonical
attribution + takedown commitment paragraph; the per-row `License:`
field is a per-principle repeat for clarity. Commentary is original
(MIT plugin code license applies to original text). `0b-citation-scheme-migration.md`
trims existing `principles.md` files from their earlier 7-field shape
to this unified template; no distillation text changes in the migration.

### Surgical, not exhaustive

Each enrichment task adds **3–6** trigger-actionable principles, not
20. Better to ship 4 tight rules than 15 mushy ones. The
`error-and-correctness-traps` density is the target shape; pick the
best principles per source and stop.

### Lint rules per skill

Each enrichment increases a skill's principle count. Update
`scripts/lint-skills.mjs` `SKILL_RULES` entry in the same task. If the
new principle count pushes `SKILL.md` past the line ceiling, decide per
the policy that landed in v0.3 (`decide-lint-budget-policy`). Do not
exceed 250 lines for `SKILL.md` without an explicit `maxLines` override.

### Shared-files ledger (Rule 4 compliance)

Multiple tasks edit the same shared files. Serialize through a single
integrator. Do not dispatch tasks to parallel agents without checking
this ledger first.

| Shared file | Tasks that edit it |
|---|---|
| `CITATION-SCHEME.md` | `0a-citation-scheme-spec` (creates), every later task references it |
| `AGENTS.md` | `0a-citation-scheme-spec` (one-line pointer) |
| `skills/using-97/SKILL.md` | `1-reposition-framing`, `add-observability-and-operations-skill` |
| `scripts/lint-skills.mjs` | `0b-citation-scheme-migration` (schema/regex), every enrichment task (append IDs), `add-observability-and-operations-skill` (new entry) |
| `README.md` | `0b-citation-scheme-migration` (drops "78 of 97"), `1-reposition-framing` (full rewrite), `add-observability-and-operations-skill` (skill-table row + count) |
| `CHANGELOG.md` | every task |
| `CONTENT-LICENSE.md` | `0b-citation-scheme-migration` (principle-ID paragraph), `1-reposition-framing` (multi-source attribution model), every enrichment task (per-source attribution lines) |
| Every `skills/*/principles.md` | `0b-citation-scheme-migration` (mechanical heading rewrite once), then its own enrichment task |

**Integration discipline:** when a task is ready to merge, the integrator
pulls the latest, applies the task's edits, runs `npm test`, and commits.
Two tasks editing the same shared file in flight at once is a merge-conflict
bug.

### Identity shift framing

The reframing is **not** "we left the book behind." It is "the book is
the seed; the canon is the soil." The book's voice — humble, situational,
multi-author — is the voice of `97`. New sources are filtered through that
voice. Frame credits accordingly: lead with the book, list the canon, do
not subordinate the book to the canon.

## Task Priority

Two pre-tasks must land first, then `1-reposition-framing`, then
enrichments:

1. `0a-citation-scheme-spec.md` — **must be first.** Writes
   `CITATION-SCHEME.md`. Spec only; no code or content changes.
2. `0b-citation-scheme-migration.md` — **must be second.** Mechanical
   migration of existing `#NN` IDs to `97/NN` strings; updates lint;
   removes "78 of 97" headline. Pure refactor.
3. `1-reposition-framing.md` — foundation under which every enrichment's
   framing makes sense. References the now-settled ID scheme.

After those, enrichment tasks are independent in principle but share
the files in the ledger above — pick one at a time.

Recommended order after the foundation:

1. `0a-citation-scheme-spec.md` — **must be first**
2. `0b-citation-scheme-migration.md` — **must be second**
3. `1-reposition-framing.md`
4. `enrich-before-you-refactor-fowler.md` — best fit in the canon, lowest risk
5. `enrich-domain-modeling-wlaschin.md` — high ROI for typed languages
6. `enrich-build-deploy-twelve-factor-accelerate.md` — cloud-native canonical
7. `enrich-error-and-correctness-release-it.md` — production-resilience patterns
8. `enrich-api-design-solid.md` — SOLID + parse-don't-validate
9. `enrich-testing-discipline-goos.md` — GOOS + xUnit Patterns
10. `enrich-writing-clean-code-pragmatic.md` — heaviest voice work; do late
11. `add-observability-and-operations-skill.md` — new skill; biggest net-add
12. `enrich-working-with-users-team-accelerate.md` — modest gains; do last
