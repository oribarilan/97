# US-v1.0-canon-expansion

## Goal

Enrich the existing 9 themed skills with **trigger-actionable
principles from the modern programming canon** where the trigger
demanded it, and add **one new themed skill** for observability.

The story enriches:

- `before-you-refactor` with Fowler's *Refactoring* smell catalog
- `domain-modeling` with Wlaschin's "make invalid states unrepresentable"
  + smart constructors + types-for-effects
- `build-deploy-and-tooling` with 12-factor + *Continuous Delivery*
  pipeline-as-code
- `error-and-correctness-traps` with Nygard's *Release It!* stability
  patterns (timeouts, circuit breakers, bulkheads, backpressure,
  fail fast)
- `api-and-interface-design` with Ousterhout (deep modules, define
  errors out of existence), Liskov, and King's parse-don't-validate
- `testing-discipline` with GOOS test-listening + Meszaros test smells

And adds:

- `observability` — net-new skill in the `error-and-correctness-traps`
  template, drawn from the SRE book, OpenTelemetry semantic
  conventions, and *Observability Engineering*

**Framing.** v1.0 ships under the existing *97 Things* companion
framing. The repositioning to "trigger-based distillation of the
modern programming canon" is **deferred to v2.0**, where it can be
debated on its own merits with v1.0's content gains visible. v1.0 is
content enrichment plus one new skill, not a brand pivot. Per-skill
`principles.md` files cite each canon source explicitly via
`CITATION-SCHEME.md` IDs; the README and bootstrap continue to lead
with the book.

This story does **not** include the v1.0.0 release commit itself —
version bumps, tagging, and marketplace push follow `CONTRIBUTE.md`'s
manual release process and happen in a separate session by the release
author after every task here is in `done/`. (The release author also
decides whether this content milestone deserves v1.0 or a 0.x
increment; that is not a feature-work decision.)

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
`#NN` → `<source-key>/<principle-key>` IDs throughout the codebase,
trims metadata blocks, adds the silent-application Priority rule to
the bootstrap) land before any enrichment task. Reason: the existing
lint and `principles.md` heading format are integer-keyed on
*97 Things* essay numbers, so the moment a Fowler smell or 12-factor
item is added the scheme breaks. Settling the scheme up front prevents
every enrichment task from inventing it ad-hoc and prevents the lint
guardrail going silent on canon content.

## Definition of Done

The story is complete when **all** of the following hold:

- [ ] Every task file in this story is in `.todo/done/US-v1.0-canon-expansion/`
      with all acceptance criteria checked.
- [ ] `npm test` (lint + format-check + smoke) passes on a clean checkout.
- [ ] `CITATION-SCHEME.md` exists at repo root and matches the ID
      format used by every `principles.md` heading and every
      `SKILL_RULES.principles` entry. `scripts/lint-skills.mjs`
      enforces the new format.
- [ ] `using-97/SKILL.md` Priority section includes the
      silent-application rule from `0b-citation-scheme-migration.md`.
- [ ] At least 6 existing skills have `principles.md` enriched with
      new canonical principles, surfaced in `SKILL.md` checklist or
      Red Flags where they change agent behavior.
- [ ] One new themed skill exists: `observability`, structured in the
      `error-and-correctness-traps` template, with the new trigger
      row added to `using-97/SKILL.md`.
- [ ] Every enriched `principles.md` cites its non–*97 Things* sources
      using IDs registered in `CITATION-SCHEME.md` (book + author +
      chapter where relevant) so the attribution chain is traceable.
- [ ] `CONTENT-LICENSE.md` includes the principle-ID paragraph from
      `0b-citation-scheme-migration.md` and per-skill source-attribution
      paragraphs from each enrichment task. CC-BY-3.0 attributions for
      *97 Things* derivatives remain explicit. **No "What this is"
      reframing in this story** — that is deferred to v2.0.
- [ ] `README.md` "What's inside" table updates to include the new
      `observability` skill row; total skill count reflects the new
      addition. **No "What this is" reframing.**
- [ ] `scripts/lint-skills.mjs` `SKILL_RULES` entries reflect new
      principle IDs and the new skill, all in
      `<source-key>/<principle-key>` string-ID format.
- [ ] **Closing audits both passed:** the `99a-overlap-matrix-audit.md`
      task identifies and resolves cross-skill duplications, and the
      `99b-voice-review-pass.md` task confirms voice consistency
      across all enriched skills.
- [ ] `CHANGELOG.md` `[Unreleased]` reflects every user-visible
      change.
- [ ] Release process for the next version follows the manual procedure
      in `CONTRIBUTE.md` — version bump in lockstep across the three
      manifests, tagged commit, etc. (Out of scope for this story;
      flagged for the release author.)

## Cross-Cutting Concerns

### The trigger taxonomy is the moat — sources are commodity

Every added principle must be **trigger-actionable**: a one-line rule
the agent can fire at a specific moment in a specific situation. If a
principle can only be expressed as a paragraph of philosophy, it does
not belong in `SKILL.md`. It may live in `principles.md` as background,
but the bar to surface it in a skill checklist or Red Flags row is
"would this rule change what the agent writes in the next 60 seconds?"
If no, drop it.

This bar was applied during planning. Several earlier candidates were
cut as leaks:
- "DORA 4 keys as a lens" (Task 4) — philosophy not action.
- "Trunk-based development" (Task 4) — org policy not write-time.
- "Wire format as intentional choice" (Task 6) — design-meeting topic.
- "Listen to the tests" as a disposition (Task 7) — operationalized
  to "if test setup exceeds the test body, reshape the production
  code; do not mock harder."
- "SLOs over per-error alerts" (Task 9) — fires when designing
  alerting policy, not at code-write time.
- "Observability at code time" (Task 9) — meta-premise of the skill,
  not a separate principle.

Future enrichment proposals should expect the same scrutiny.

### Voice rules unchanged

Imperative, terse, concrete. No AI tells. The `humanizer` rules apply.
v1.0 sources (Fowler, Nygard, Wlaschin, GOOS, Meszaros, Ousterhout,
SRE, OE) are mostly calm and observational — voice work is lighter
than the original plan anticipated.

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
to this unified template; no distillation text changes in the
migration.

### Agent output policy: silent application

Per `0a-citation-scheme-spec.md`, the agent applies principles
**silently** in user-facing responses. No author names, book titles,
or principle IDs leak into output. Citations exist for repo provenance
and CC-BY-3.0 compliance, not for user-facing authority. The
implementation lands as a Priority rule in `using-97/SKILL.md` as
part of `0b-citation-scheme-migration.md`.

### Surgical, not exhaustive

Each enrichment task adds **3–5** trigger-actionable principles. The
`error-and-correctness-traps` density is the target shape; pick the
best principles per source and stop. Tasks 8 (`enrich-writing-clean-code-pragmatic`)
and 10 (`enrich-working-with-users-team-accelerate`) from earlier
plan drafts were cut because their additions were either already
covered by existing 97 Things essays or were not trigger-actionable.

### Source list locked

v1.0 imports from this set: `97`, `Fowler`, `RI`, `Wlaschin`, `King`,
`12F`, `CD`, `GOOS`, `xUnit`, `SRE`, `OE`, `OTel`, `Liskov`, `Hyrum`,
`Ousterhout`. **Not imported in v1.0** (deferred to v1.x or v2.x):
Martin's *Clean Code*, Hunt/Thomas's *Pragmatic Programmer*, Cagan's
*Inspired*, *The Phoenix Project*, *Accelerate*/DORA, Hickey's "Simple
Made Easy", Kleppmann's *DDIA*, Beck's *Tidy First?*. Each was
considered and decided against — see the v1.0 council review
discussion for reasoning.

### Stakes calibration: production layer fires by context

v1.0 introduces a production-shaped layer of skills (Nygard's
stability patterns in `error-and-correctness-traps`, 12-factor in
`build-deploy-and-tooling`, the new `observability` skill, plus
v0.3's `security-and-trust-boundaries`). The trigger taxonomy is
situation-keyed but not project-context-keyed; without calibration
these skills can over-fire on MVPs, prototypes, and dev tools where
production discipline is genuinely the wrong shape of advice.

`add-stakes-calibration.md` establishes a three-layer pattern that
every production-shaped skill in the bundle follows:

- **Bootstrap Priority rule** in `using-97/SKILL.md`: production
  guidance fires hardest when code reaches users; in MVPs / dev tools
  / prototypes, prefer the simplest thing that works.
- **One Overview calibration sentence per production-shaped skill**
  describing when the skill fires hardest, lightly, or not at all.
- **Strengthened Non-triggers** in each production-shaped skill
  explicitly excluding MVP / dev tool / prototype / one-off-script
  contexts.

Future production-shaped skills (v1.x and beyond) follow the same
pattern. Code-craft skills (writing-clean-code, before-you-refactor,
domain-modeling, api-and-interface-design, testing-discipline,
pre-commit-self-review, working-with-users-and-team) do not need
this calibration — they fire on the same triggers regardless of
project stage.

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
| `CITATION-SCHEME.md` | `0a-citation-scheme-spec` (creates); every later task references it |
| `AGENTS.md` | `0a-citation-scheme-spec` (one-line pointer) |
| `skills/using-97/SKILL.md` | `0b-citation-scheme-migration` (silent-application Priority rule), `add-stakes-calibration` (stakes-calibration Priority rule), `add-observability-skill` (new trigger row) |
| `skills/error-and-correctness-traps/SKILL.md` | `add-stakes-calibration` (Overview + Non-triggers), `enrich-error-and-correctness-release-it` (new principles) |
| `skills/build-deploy-and-tooling/SKILL.md` | `add-stakes-calibration` (Overview + Non-triggers), `enrich-build-deploy-twelve-factor` (new principles) |
| `skills/security-and-trust-boundaries/SKILL.md` | `add-stakes-calibration` (Overview + Non-triggers); no enrichment in this story |
| `scripts/lint-skills.mjs` | `0b-citation-scheme-migration` (schema/regex), every enrichment task (append IDs), `add-observability-skill` (new entry) |
| `README.md` | `0b-citation-scheme-migration` (drops "78 of 97" sentence), `add-observability-skill` (skill-table row + count) |
| `CHANGELOG.md` | every task |
| `CONTENT-LICENSE.md` | `0b-citation-scheme-migration` (principle-ID paragraph), every enrichment task (per-source attribution lines), `add-observability-skill` (new-skill paragraph) |
| Every `skills/*/principles.md` | `0b-citation-scheme-migration` (mechanical heading rewrite + metadata trim once), then its own enrichment task |

**Integration discipline:** when a task is ready to merge, the
integrator pulls the latest, applies the task's edits, runs `npm test`,
and commits. Two tasks editing the same shared file in flight at once
is a merge-conflict bug.

## Task Priority

Two pre-tasks land first, then stakes-calibration, then enrichments,
then the new skill, then closing audits:

1. `0a-citation-scheme-spec.md` — **must be first.** Writes
   `CITATION-SCHEME.md`. Spec only; no code or content changes.
2. `0b-citation-scheme-migration.md` — **must be second.** Mechanical
   migration of existing `#NN` IDs to `97/NN` strings; trims metadata
   blocks; adds silent-application Priority rule to the bootstrap;
   updates lint; removes "78 of 97" headline.
3. `add-stakes-calibration.md` — **must run before production-shaped
   enrichments.** Establishes the calibration pattern (bootstrap rule
   + per-skill Overview sentence + Non-triggers exclusions) so the
   production-shaped skills carry it before being enriched.
4. Enrichment tasks (any order; share files in the ledger above so
   serialize through one integrator).
5. `add-observability-skill.md` — net-new skill; the largest single
   addition; do after enrichments since it cross-references several.
   Applies the calibration pattern at creation time.
6. `99a-overlap-matrix-audit.md` — closing audit; runs only after all
   enrichments + the new skill are in `done/`.
7. `99b-voice-review-pass.md` — closing voice review; runs after the
   overlap audit.

Recommended order:

1. `0a-citation-scheme-spec.md` — **must be first**
2. `0b-citation-scheme-migration.md` — **must be second**
3. `add-stakes-calibration.md` — **must precede production enrichments**
4. `enrich-before-you-refactor-fowler.md` — best fit; lowest risk
5. `enrich-domain-modeling-wlaschin.md` — high ROI for typed languages
6. `enrich-build-deploy-twelve-factor.md` — cloud-native canonical
7. `enrich-error-and-correctness-release-it.md` — production-resilience patterns
8. `enrich-api-design-ousterhout-liskov-king.md` — Ousterhout + Liskov + King
9. `enrich-testing-discipline-goos.md` — GOOS + xUnit Patterns
10. `add-observability-skill.md` — new skill; biggest net-add
11. `99a-overlap-matrix-audit.md` — closing audit
12. `99b-voice-review-pass.md` — closing voice review
