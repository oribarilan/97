# enrich-writing-clean-code-pragmatic

## Context

The current `writing-clean-code` skill is the **largest in the bundle
(142/394 lines)** and has already been tightened in v0.3
(`tighten-writing-clean-code`). Adding more is high-risk — both for
voice (Martin's *Clean Code* and Hunt/Thomas's *Pragmatic Programmer*
have strong, opinionated tones that clash with 97's humble register)
and for skill bloat (it is already at the line-count ceiling).

**Approach:** **modest additions only.** Pull the 2–3 principles from
*Pragmatic Programmer* and *Clean Code* that are **not already covered
by 97 essays**, re-voice them, and either fold them into existing
checklist items or add a single Red Flags row each. This task is the
**heaviest voice work in the story**; do it after the lower-risk
enrichments have shipped and the v1.0 voice norms are well-established.

**Value delivered:** named coverage for DRY, the broken windows
metaphor, and the boy-scout rule — three principles agents reach for
by name even when *97 Things* essays cover them obliquely.

## Related Files

- `skills/writing-clean-code/SKILL.md`
- `skills/writing-clean-code/principles.md`
- `scripts/lint-skills.mjs`
- `CHANGELOG.md`
- `CONTENT-LICENSE.md` (if not already)

## Dependencies

- `0a-citation-scheme-spec.md` in `done/` — `Pragmatic/DRY`,
  `Pragmatic/BrokenWindows`, `Martin/BoyScoutRule` IDs follow the
  format in `CITATION-SCHEME.md`. Source-key registry must include
  `Pragmatic` and `Martin` before this task lands; if absent, add them
  in this PR.
- `0b-citation-scheme-migration.md` in `done/`.
- `1-reposition-framing.md` in `done/`.
- v0.3 `tighten-writing-clean-code.md` in `done/` (so we are tightening
  the right baseline).
- **Lower-risk enrichments should land first** so the v1.0 voice norm
  is set by easier sources before we re-voice Martin/Hunt/Thomas.

## Acceptance Criteria

- [ ] Add **2–3** principles to `principles.md`. Suggested set:
  - **DRY (Don't Repeat Yourself)** — every piece of knowledge has a
    single, authoritative representation in the system. Knowledge,
    not text — coincidental code duplication is not a DRY violation.
    Source: Hunt & Thomas, *Pragmatic Programmer*, 2nd ed. (Addison-
    Wesley, 2019), ch. 2.
  - **The Broken Windows metaphor** — small disorder begets larger
    disorder; do not let "we'll fix it later" debt visibly accumulate.
    The agent's response is to fix the small thing in passing, not to
    halt feature work. Source: *Pragmatic Programmer*, ch. 1.
  - **The Boy-Scout Rule** — leave the campsite cleaner than you
    found it. When you touch a function, leave it slightly better
    than you found it. Source: Martin, *Clean Code* (Prentice Hall,
    2008), ch. 1.
- [ ] At most **1** new principle is surfaced in `SKILL.md` directly.
      The skill is at its ceiling; the rest live in `principles.md`
      as named reference. The surfaced principle is the one that most
      changes agent behavior in a moment (likely DRY-as-knowledge,
      because agents over-extract on textual duplication).
- [ ] `principles.md` re-voices each principle in 97's situational
      register. **No quoted source text.** No "as Uncle Bob says"
      framing. Cite source for attribution; speak in our voice.
- [ ] If `SKILL.md` line count exceeds the policy ceiling after this
      task, prune existing content rather than expand the budget. The
      ceiling is a forcing function for editorial discipline.
- [ ] `scripts/lint-skills.mjs` `SKILL_RULES.writing-clean-code`
      `principles` count updated.
- [ ] `CHANGELOG.md` `### Changed` entry written.
- [ ] `npm test` passes.

## Verification

**Automated:** `npm test`.

**Ad-hoc:**
- Read the enriched skill aloud. The voice is one continuous register
  with the rest of `97`. If a sentence sounds like it came from
  *Clean Code*, re-voice it.
- Spot-check: ask the agent to "extract a helper for two pieces of
  code that look the same but represent different decisions." Verify
  it does **not** extract — DRY-as-knowledge says coincidental
  similarity is not a violation.

## Notes

- **Hardest voice task in the story.** Both source books are
  homiletic. The 97 voice is humble and situational. If a principle
  cannot be re-voiced into our register, drop it.
- **Do not add SRP, OCP, or any other SOLID material here.** SRP
  belongs in `api-and-interface-design` (per
  `enrich-api-design-solid.md` notes) and `before-you-refactor`
  (smells); duplicating it here is exactly the cargo-cult content
  v0.3 pruned.
- **Do not add "code is read more than written" or other 97-adjacent
  bromides** that the existing skill already implies. The bar is
  "would this principle change agent behavior in a moment that the
  current skill does not already cover?" If no, drop it.
- **If at the end of the task the skill is the same length or shorter
  than before** (because an addition forced a prune), that is a
  success, not a failure.
