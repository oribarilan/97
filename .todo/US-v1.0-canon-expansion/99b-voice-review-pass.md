# 99b-voice-review-pass

## Context

Closing voice review. After every enrichment + the new `observability`
skill is in `done/` and `99a-overlap-matrix-audit.md` has resolved
overlaps, one reviewer reads every `SKILL.md` and `principles.md`
end-to-end in one sitting. Per-task voice work catches local drift;
**cumulative voice drift across 7+ enrichments is only visible
end-to-end**.

The `humanizer` skill defines voice. v1.0 imports from sources whose
prose styles vary widely:
- *97 Things* contributors — the canonical voice; the rest are
  calibrated against this register.
- Fowler — calm, observational. Low drift risk.
- Nygard — direct, vivid. Low drift risk.
- Wlaschin — pedagogical, precise. Low drift risk.
- King — academic, precise. Low drift risk.
- Ousterhout — observational, principled. Low drift risk.
- Liskov — academic. Low drift risk in distilled form.
- Freeman & Pryce (GOOS) — calm, pedagogical. Low drift risk.
- Meszaros — encyclopedic. Watch for catalog-tone seepage.
- SRE / *Observability Engineering* — opinionated. Watch for
  authority-tone seepage.
- 12-factor — terse. Compatible.

**Value delivered:** v1.0 ships with one continuous register. A reader
moving from `before-you-refactor` to `domain-modeling` to
`observability` does not feel a tonal break.

## Related Files

- Every `skills/*/SKILL.md`
- Every `skills/*/principles.md`
- `skills/using-97/SKILL.md` (bootstrap voice — should be unchanged
  but verify)

## Dependencies

- `99a-overlap-matrix-audit.md` in `.todo/done/US-v1.0-canon-expansion/`.
- All enrichment + observability tasks in `done/`.

## Acceptance Criteria

### Read-pass

- [ ] One reviewer reads the **enriched + new files** end-to-end in
      one sitting. The single-sitting constraint is load-bearing —
      voice drift is only visible across files in close temporal
      sequence. Splitting across days defeats the purpose.
- [ ] **Scope (what counts as "the read-pass")** — reading every file
      end-to-end is unrealistic in one sitting (24 files × ~12 min ≈
      5 hours focused). The honest scope:
  - **Full read (mandatory):** every `SKILL.md` + `principles.md`
    touched by an enrichment task or the new `observability` skill —
    7 enriched skills + 1 new skill = ~16 files.
  - **Sampling read (mandatory):** for each non-enriched skill,
    read its `SKILL.md` Overview + Red Flags table + one randomly-
    chosen `principles.md` entry. Drift surfaces fastest in those
    surfaces. If sampling flags drift, escalate that skill to a full
    read.
  - **Bootstrap read (mandatory):** `skills/using-97/SKILL.md` end-
    to-end (it's short and load-bearing).
- [ ] Reviewer is familiar with both the `humanizer` skill and the
      existing v0.x voice. (If the reviewer is also the author of
      most enrichments, suggest a fresh pair of eyes.)

### Per-file checks

For each `SKILL.md`:
- [ ] Imperative, terse voice maintained throughout (per `humanizer`).
- [ ] No AI tells. The patterns the `humanizer` skill catches:
      inflated symbolism, promotional language, superficial -ing
      analyses, vague attributions, em-dash overuse, rule-of-three,
      "AI vocabulary words", passive voice in instruction prose,
      negative parallelisms, filler phrases.
- [ ] Red Flags table entries are concrete patterns, not abstract
      concerns. Each entry passes "would the agent recognize this in
      a diff?"
- [ ] Cross-references between skills use the ID format from
      `CITATION-SCHEME.md` (e.g. `Fowler/LongMethod`), not file paths
      or prose mentions like "the long method essay."

For each `principles.md`:
- [ ] The unified 5-field metadata block (Author / Source / License /
      Distillation / Agent application) is consistent across all
      principles in the file.
- [ ] Distillation paragraphs are 97's register: humble, situational,
      concrete, in our own words. No quoted source text. No
      "as Uncle Bob says" framing. No homiletic seepage from Martin /
      *Pragmatic Programmer* (those sources were cut, but the v0.x
      attribution to Martin via 97/8 (Boy Scout) and 97/76 (SRP)
      remains — verify those entries still read in 97's voice and
      were not inadvertently edited toward Clean-Code register).
- [ ] Cross-references use principle IDs.

### Cross-file checks (the point of doing it in one sitting)

- [ ] Tonal continuity from one skill to the next. Reading `before-you-
      refactor` then `writing-clean-code` does not feel like switching
      authors. Reading `error-and-correctness-traps` then the new
      `observability` does not feel like a tonal break — the SRE
      book's calm authority tone has been re-voiced.
- [ ] No skill reads more authoritative or more pedagogical than
      others. The voice is one register across all skills.
- [ ] Vocabulary consistency: pick one term per concept and use it
      everywhere. (Common drift: "downstream" vs "remote" vs
      "third-party"; "boundary" vs "edge" vs "interface"; "diagnose"
      vs "debug" vs "observe"; the v1.0 audit picks one per concept
      and applies it.)

### Fix inline

- [ ] Voice violations are fixed inline as they're found. This task
      is not "produce a list of issues for someone else to fix" — the
      reviewer fixes what they flag.
- [ ] Edits stay surgical. Do not rewrite distillations during this
      pass; tweak phrasing, replace AI-tell words, fix passive voice,
      remove inflated symbolism.
- [ ] If a violation requires a substantive content rewrite, file a
      follow-up issue rather than expanding scope.

### Output

- [ ] `CHANGELOG.md` `### Changed` entry summarizing the voice pass:
      number of files reviewed, scope of edits applied, follow-up
      issues filed (if any).
- [ ] `npm test` passes.

## Verification

**Automated:**
- `npm test` (lint + format-check + smoke). Lint catches structural
  drift; this task catches voice drift, which lint cannot enforce.

**Ad-hoc:**
- Read three random `principles.md` files end-to-end. The voice
  feels like one author wrote them all.
- Pick one Red Flag from each of three different skills. Each is a
  concrete pattern an agent could recognize, phrased in the same
  imperative register.
- The bundle reads as a coherent product, not as a stitched-together
  compilation of book summaries.

## Notes

- **Single-sitting rule is load-bearing.** Voice drift is invisible
  in isolation; it appears at the seams between files. Splitting the
  review across days defeats the audit. If the reviewer cannot do it
  in one sitting, defer the task until they can.
- **The reviewer is not necessarily the author.** A fresh pair of
  eyes is more likely to spot drift the author has acclimated to.
- **Voice fixes only.** No new principles, no removed principles, no
  reorganization. The overlap-matrix audit already happened in
  `99a`. This is a polish pass.
- **Time budget.** Honest estimate: full reads at ~12 min/file ×
  16 files ≈ 3.2 hours; sampling reads at ~5 min/skill × ~5 non-
  enriched skills ≈ 25 min; bootstrap ~10 min; inline edits ~30–60
  min. **Total: 4–5 hours focused.** Plan a single block, take one
  break midway. If the reviewer cannot do it in one sitting, defer.
  The 1.5–2.5 hour estimate from earlier drafts assumed a much
  smaller bundle and underestimates the per-file load.
- **Voice baseline is the v0.x bundle.** Pre-v1.0 skills are the
  reference. New canon material must read continuous with that
  baseline; if a fix would break the baseline's voice, the baseline
  wins.
