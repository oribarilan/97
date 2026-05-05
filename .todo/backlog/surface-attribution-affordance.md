# surface-attribution-affordance

## Context

Attribution already exists at three levels in the repo:

1. `README.md` Credits + Licensing — names the book, editor, CC-BY-3.0
   mirror, and points to `CONTENT-LICENSE.md`.
2. `README.md` "What's inside" (line ~92) — one sentence: *"Per-skill
   contributor attributions live in each skill's `principles.md`."*
3. Each skill's `principles.md` — per-principle author, primary source
   URL, reading-aid URL, access date, gaps note, distillation, and
   "agent application."

What's **not** surfaced today: that the user can prompt the agent
themselves with *"who said this principle and why?"* and the agent will
read the relevant `principles.md` and answer with author, link, and
reasoning. That turns a passive licensing footnote into a discoverable
feature: 97 is a guided reading list into the source book as much as a
behavior plugin.

**Value delivered:** users learn that every principle is attributed and
that they can interrogate the agent for source + reasoning at any time.
Reframes the project as a guided reading list, not just behavior
modification. Single-file change, low risk, high signal.

## Related Files

- `README.md` — the only file edited
- `CHANGELOG.md` — `### Documentation` bullet under `[Unreleased]`

## Dependencies

- None.

## Acceptance Criteria

- [ ] `README.md` has a new `### Attribution & sources` subsection
      between the existing "11 skills total..." line and the `## Credits`
      header.
- [ ] The subsection (a) names what attribution exists per principle
      (contributor, CC-BY-3.0 link, distillation, agent application);
      (b) tells the user they can ask the agent who wrote a principle
      and why; (c) shows **one** italicized example prompt covering
      both who and why; (d) reframes 97 as a guided reading list into
      the source book.
- [ ] The existing one-liner about per-skill attributions in the
      "What's inside" section is removed (replaced by the new
      subsection) — no duplicate statement.
- [ ] The existing `security-and-trust-boundaries` carve-out sentence
      is preserved (it's honest attribution and still belongs).
- [ ] No edits to any `SKILL.md`, `principles.md`,
      `CONTENT-LICENSE.md`, or any adapter (`.opencode/plugins/97.js`,
      `hooks/`).
- [ ] `CHANGELOG.md` has a new bullet under `[Unreleased]` →
      `### Documentation` describing the change in user-facing terms.
- [ ] `npm test` (lint + format-check + smoke) passes.

## Verification

**Automated:**
- `npm test` — lint catches malformed markdown / stale references; smoke
  verifies the README still parses.

**Ad-hoc:**
- `wc -l README.md` shows roughly +12 to +16 lines vs current 142.
- Visual: rendered README has a scannable `### Attribution & sources`
  heading appearing in the outline between "What's inside" and
  "Credits."
- Open a fresh agent session, ask: *"Who wrote the principle behind
  `before-you-refactor`'s 'don't rewrite from scratch' rule, and why
  does it say that?"* — verify the agent reads
  `skills/before-you-refactor/principles.md` and returns Rajith
  Attapattu with the CC-BY-3.0 link and a paraphrased rationale.

## Notes

- Decision rationale (from the planning conversation):
  - **README only**, not `using-97/SKILL.md` — bootstrap loads on every
    coding task; per-session context cost. The agent already reads
    `principles.md` on demand when asked, so no priming is needed.
  - **One example prompt**, not three — covers who + why in a single
    line, lower noise.
  - **Feature framing** ("guided reading list"), not defensive
    licensing tone — that material already lives in `CONTENT-LICENSE.md`
    for rightsholders.
- If a future eval shows users *don't* discover the affordance, then
  consider adding a single line to `using-97/SKILL.md` about
  surfacing attribution when relevant. Don't pre-optimize.
- Suggested CHANGELOG bullet:
  > `README.md` now explains that every principle is attributed and
  > shows users how to ask the agent for the author, source link, and
  > reasoning behind any principle it applies. Reframes 97 as a guided
  > reading list into the source book in addition to a behavior plugin.
- Suggested README subsection text (final wording at author's discretion):

  ```markdown
  ### Attribution & sources

  Every principle the agent applies is attributed to the original essay
  author. Each skill ships a `principles.md` next to its `SKILL.md` with,
  per principle: the contributor's name, a link to the CC-BY-3.0 source
  essay, our distillation in our own words, and how the agent applies it.

  You can ask the agent at any time: *"Who wrote the principle you just
  applied, and why does it say what it says?"* — the agent will read the
  relevant `principles.md` and answer with author, link, and reasoning.
  Treat 97 as a guided reading list into the source book as much as a
  behavior plugin.

  The `security-and-trust-boundaries` skill is mostly original commentary
  extending two book principles; see `CONTENT-LICENSE.md`.
  ```
