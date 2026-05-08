# 4-readme-faq-acronyms

## Context

A reader who knows software-craft acronyms will Ctrl-F the README for
"SOLID", "DRY", "KISS", or "YAGNI" and expect an answer. Today they
get nothing for SOLID/KISS/YAGNI and incidental hits for DRY in
`### Giants`. After tasks 1–3, the substance and labels exist in the
skills; this task tells README readers that, honestly. Task 5 adds
parenthetical anchors to the `What's inside` table for first-impression
discoverability; this FAQ entry is the reference answer for readers
who want to know which skill carries which acronym.

**Value delivered:** users searching the README for the canonical
acronyms find one short, accurate FAQ entry that maps each acronym to
the skill that carries its substance, and explains why OCP/ISP/DIP
are not promoted by name.

## Related Files

- `README.md` — `## FAQ` section (around line 143); add one new `###`
  entry, between the existing entry and `## Credits`

## Dependencies

- **Tasks 1, 2, 3** — the FAQ entry must describe post-edit reality.
  Specifically: where SRP-at-boundary lives (task 1), where SRP
  refactoring trigger lives (task 2), where KISS/YAGNI are named
  (task 3).
- **Task 5** can run before or after this task; the FAQ doesn't depend
  on the table parentheticals.

## Acceptance Criteria

- [ ] `README.md` has a new FAQ entry titled along the lines of
      "Does 97 cover SOLID, DRY, KISS, YAGNI?" (exact wording at
      author's discretion, must be searchable for all four acronyms).
- [ ] Entry explicitly names which skills cover **SRP**, **LSP**,
      **DRY**, **KISS**, and **YAGNI**, with skill names backticked
      the same way other FAQ entries reference skills.
- [ ] Entry distinguishes **OCP**, **ISP**, and **DIP** with **honest
      reasons**, not a single hand-wave:
      - **ISP / DIP:** the substance lives under better-cited framing
        in `api-and-interface-design` (narrow interfaces, abstractions
        at boundaries, Ousterhout's deep modules).
      - **OCP:** intentionally not promoted because speculative
        extension points conflict with YAGNI. Say so directly. (This
        is the contrarian-correctness call from the council review:
        OCP is not actually well-covered by `97/59`; the honest
        framing is that 97 declines to promote it.)
- [ ] Every one of "SOLID", "SRP", "LSP", "OCP", "ISP", "DIP", "DRY",
      "KISS", "YAGNI" appears as a literal string at least once in the
      entry, so Ctrl-F lands.
- [ ] Entry length: ≤ **8** lines of rendered markdown. This is a
      reference, not an essay. (Tightened from 12 in the original
      draft of the US — concision beats coverage in FAQ.)
- [ ] Voice check (`humanizer`): no "embraces", no "champions", no
      "philosophy", no rule-of-three, no "well-known acronyms", no
      "the SOLID principles" as a phrase, no "covers"/"we cover" as
      verbs (per `main.md` forbidden list). Past-tense /
      present-tense indicative, period at the end. Match the existing
      FAQ entry's register.
- [ ] No new bullets in `### Giants` for OCP/ISP/DIP. The README
      sources list is source-driven (per `AGENTS.md` "Adding or
      removing a source"), and we are not adding sources.
- [ ] `npm test` passes.

## Verification

**Automated:** `npm test`.

**Ad-hoc:** in the rendered README, Ctrl-F each of "SOLID", "DRY",
"KISS", "YAGNI", "SRP", "LSP", "OCP", "ISP", "DIP" — every one of
them lands inside the new FAQ entry (in addition to wherever it
already appeared, including the new `What's inside` table anchors
from task 5). Read the entry top-to-bottom: it should sound like the
existing `### How does 97 compare to popular plugins…` entry —
direct, comparative, not promotional.

## Notes

- Honest framing is the whole point: do not write "97 covers SOLID"
  when 97 covers two of its five letters by name. The entry should
  say what's actually there.
- **OCP framing matters.** The earlier draft of this US said
  "OCP/ISP/DIP substance is covered under better framing." The
  contrarian council review pushed back: that's true for ISP/DIP,
  not for OCP — `97/59` is about replacing switch-on-type, not
  designing extension points. The honest reason 97 doesn't promote
  OCP is that speculative extension points conflict with YAGNI. The
  entry must say so.
- Don't restructure the FAQ. One new `###` entry is enough.
- 8-line cap is a hard ceiling. If meta-commentary about the
  source-driven-not-acronym-driven stance won't fit, drop it and keep
  the mapping. The mapping is what readers come for.
- **Resist the rule-of-three temptation.** A balanced "SRP, LSP, DRY
  are named; OCP, ISP, DIP are not; KISS, YAGNI are search keys"
  cadence is exactly the AI-tell `humanizer` flags. Two sentences of
  flat description beats a balanced triad.
