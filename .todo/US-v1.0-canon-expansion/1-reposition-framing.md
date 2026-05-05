# 1-reposition-framing

## Context

Foundational task for v1.0. Reframe `97` from a *97 Things* derivative
to a trigger-based distillation of the **modern programming canon**.
Keep the name. Decouple it from the literal essay count. Update the
project's framing in three surface areas (README, bootstrap, content
license) so every subsequent enrichment task lands inside the new
framing rather than against it.

This task does **not** edit any themed `SKILL.md` or `principles.md`.
Those land in their own enrichment tasks. This task changes only the
project-level framing.

**Value delivered:** unblocks every other v1.0 task; positions `97` as
the canon-distillation product the trigger taxonomy already implies.

## Related Files

- `README.md` — "What this is", "What's inside" intro paragraph, Credits
- `skills/using-97/SKILL.md` — Overview paragraph (trigger map untouched)
- `CONTENT-LICENSE.md` — multi-source attribution model
- `CHANGELOG.md` — `### Changed` entry under `[Unreleased]` flagged as
  the v1.0 identity shift

## Dependencies

- v0.3 must have shipped (story-level dependency, see `main.md`).
- `0a-citation-scheme-spec.md` in `done/` — `CONTENT-LICENSE.md`
  multi-source paragraph here references the principle-ID scheme it
  defines.
- `0b-citation-scheme-migration.md` in `done/` — README's "78 of 97"
  sentence is already gone; this task's full README rewrite layers on
  top of the migrated state.

## Acceptance Criteria

- [ ] `README.md` "What this is" rewritten so the project is described
      as **trigger-based skills distilled from the canon of programming
      wisdom**, with *97 Things* as the seed and additional sources
      (Refactoring, Pragmatic Programmer, SOLID, 12-factor, Continuous
      Delivery, Accelerate/DORA, Release It!, Wlaschin/DDD, GOOS,
      xUnit Test Patterns, SRE-era observability, Cagan *Inspired*) as
      the canon. Voice stays humble; the book leads, the canon follows.
- [ ] The "Credits" section lists the canon, with *97 Things* first
      (the seed) and the remaining sources grouped (e.g. "Refactoring &
      clean code", "Cloud-native & ops", "Functional & typed",
      "Testing", "Product & teams"). Each source cites
      author + publisher + license posture (CC-BY-3.0 / fair-use
      commentary).
- [ ] `skills/using-97/SKILL.md` Overview paragraph reframed in one or
      two sentences: *97 Things* is the seed; the canon is the source
      set. Trigger map and the rest of the bootstrap are **not** edited
      in this task.
- [ ] `CONTENT-LICENSE.md` updated with a new section documenting the
      multi-source attribution model:
  - Per-skill `principles.md` cite the source (book + author +
    chapter/page) inline for each principle, using the
    `<source-key>/<principle-key>` IDs registered in
    `CITATION-SCHEME.md`.
  - Commentary is original, written for this plugin (MIT plugin code
    license applies to original text).
  - *97 Things* derivatives keep their explicit CC-BY-3.0 attribution
    with author credit.
  - Other sources are cited under fair-use commentary; no source text
    is reproduced verbatim.
  - Takedown commitment unchanged.
  - The principle-ID paragraph added by `0b-citation-scheme-migration.md`
    stays; this task adds the surrounding multi-source context, it does
    not replace it.
- [ ] `CHANGELOG.md` `[Unreleased]` `### Changed` entry written in past
      tense, flagged as the v1.0 identity shift. Example:
      *"Repositioned the project from a *97 Things Every Programmer
      Should Know* companion to a trigger-based distillation of the
      modern programming canon. The book remains the seed; additional
      sources have been added to the canon."*
- [ ] No themed `SKILL.md` or `principles.md` edited in this task.
- [ ] `npm test` passes.

## Verification

**Automated:**
- `npm test` passes (lint + format-check + smoke).

**Ad-hoc:**
- Read `README.md` top-to-bottom. The new framing is consistent across
  "What this is", "What's inside", and "Credits". The brand "97" is
  used as a name, not a count.
- Read `skills/using-97/SKILL.md` top-to-bottom. The Overview no longer
  positions the plugin as a single-book companion. Trigger map intact.
- Read `CONTENT-LICENSE.md`. The multi-source attribution model is clear
  and the takedown commitment is preserved.

## Notes

- **Do not bump versions in this task.** Per AGENTS.md rule 3, version
  bumps happen in a dedicated release commit, not as part of feature
  work. This task is feature work for v1.0; the bump is the release
  author's job.
- The reframing is **not** "we left the book behind." Lead with the
  book in every framing surface; the canon follows. Subordinating the
  book to the canon would misrepresent the project's lineage.
- **No new trigger rows** in this task. Adding the
  `observability-and-operations` skill's trigger row happens in its
  own task. This task touches only Overview paragraphs and project-
  level framing.
- If the reframing surfaces ambiguity in CC-BY-3.0 vs fair-use
  attribution policy, defer the policy decision to its own follow-up
  task; do not block this task on policy refinement.
