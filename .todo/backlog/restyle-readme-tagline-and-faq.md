# restyle-readme-tagline-and-faq

## Context

Today's README opens with a 60-word blockquote that buries the lede. A
visitor landing on the repo can't tell in three seconds what 97 is or
why they'd want it. The "What this is" paragraph is good, but it's the
*explanation*, not the *hook* — and there's no hook above it.

Two presentation gaps:

1. **No tagline.** No bold one-liner sells the project before the
   reader has to commit to a paragraph. Other agent-skill plugins in
   this neighborhood (e.g. [caveman](https://github.com/JuliusBrussee/caveman)
   with *"why use many token when few do trick"*) demonstrate how much
   a single bold subtitle does for first-impression clarity.
2. **No FAQ.** The single most common question a reader brings to 97
   is *"how is this different from `superpowers`?"* — they sit at
   adjacent layers (process vs craft) and the relationship is non-obvious.
   That answer currently lives nowhere; readers have to infer it from
   the Credits link.

**Value delivered:** the README hooks faster (tagline above the fold)
and answers the most common cross-reference question in one place
(FAQ). Single-file change, low risk, high signal — same shape as the
sibling `surface-attribution-affordance.md` task.

**Framing constraint.** v1.0 (`US-v1.0-canon-expansion/main.md`)
explicitly forbids reframing the "What this is" section in this story
— that repositioning is deferred to v2.0. This task respects that:
it adds a tagline *above* the existing copy and an FAQ *below* it,
without rewriting the section itself.

## Related Files

- `README.md` — the only file edited
- `CHANGELOG.md` — `### Documentation` bullet under `[Unreleased]`

## Dependencies

- None.
- **Coordination note:** `surface-attribution-affordance.md` (also in
  `.todo/backlog/`) inserts an `### Attribution & sources` subsection
  between "What's inside" and "Credits". This task inserts a `## FAQ`
  section in the same neighborhood. If both ship, they're additive
  (attribution as a `###` subsection inside the existing flow, FAQ as
  a new `##` section before Credits) — but whoever ships second should
  re-read the first task's diff to confirm ordering still reads cleanly.

## Acceptance Criteria

- [ ] `README.md` header is restyled in the caveman pattern: centered
      HTML block with `<h1 align="center">97</h1>`, a bold tagline
      `<p align="center"><strong>Your agent, on the shoulders of giants.</strong></p>`,
      the existing CI badge centered, and an inline TOC (`Install ·
      What's inside · FAQ · Credits · Development`), followed by `---`.
- [ ] The existing blockquote-style opener (lines 5–8 today) is removed
      — the tagline replaces its role as the hook. The descriptive
      content from that blockquote may be folded into a single intro
      paragraph above `## What this is`, or absorbed into "What this is"
      itself. Net effect: no information loss, less visual weight at
      the top.
- [ ] The "Status" line ("early beta. Works on Claude Code, GitHub
      Copilot CLI, and OpenCode.") is preserved somewhere sensible —
      either as a centered italic line under the badge, or merged into
      the intro paragraph. It's still useful and shouldn't drop.
- [ ] The `## What this is` section content is **unchanged**. Per
      v1.0's framing rule, no reframing in this task. (Edits limited to
      typos or sentence-level polish are allowed; rewrites are not.)
- [ ] A new `## FAQ` section sits between `## What's inside` and
      `## Credits`, with **one** Q&A entry: *"How does this compare to
      `superpowers`?"* The answer (a) names superpowers as process
      skills (workflow: planning, debugging, verification), (b) names
      97 as content/craft skills (decision-time engineering principles),
      (c) cites the bootstrap precedence rule (superpowers runs before
      97 when both could fire), (d) ends on the one-liner *"superpowers
      is the methodology, 97 is the craftsmanship — they compose."*
- [ ] FAQ answer length: ≤ 12 lines of prose, no tables. Tables can
      come later if more entries land; one entry doesn't earn one.
- [ ] `CHANGELOG.md` has a new bullet under `[Unreleased]` →
      `### Documentation` describing the change in user-facing terms.
- [ ] `npm test` (lint + format-check + smoke) passes.

## Verification

**Automated:**
- `npm test` — lint catches malformed markdown / stale references; smoke
  verifies the README still parses; format-check verifies prettier
  agreement on any HTML blocks introduced.

**Ad-hoc:**
- Render the README on GitHub (push to a branch and view it) — the
  centered header should look like caveman's, with the tagline as the
  visual focal point above the fold.
- A first-time reader landing on the repo should be able to answer
  *"what is this?"* from the tagline + intro paragraph without
  scrolling.
- A reader familiar with `superpowers` should land on the FAQ entry
  and have their cross-reference question answered without leaving the
  README.

## Notes

### Decision rationale (from the planning conversation)

- **Tagline wording: "Your agent, on the shoulders of giants."**
  Earlier candidates tried mechanism-forward framing ("loaded only when
  needed"), persona framing ("started coding in the 90s"), and two-beat
  punch ("Young agent. Ancient wisdom."). A "shoulders of 97 giants"
  variant was considered and dropped: the H1 already shows `97`, the
  intro paragraph names *97 Things* immediately below, and a third
  repetition in the tagline reads as trying too hard. Adding a number
  to a famous quote also always feels like a remix. The unadorned
  Newton phrasing wins because: (1) it's instantly recognized, (2) it
  honors the lineage (the book's contributors are the giants) without
  making a countable claim that would be slightly dishonest (the book
  has 97 essays but 73 contributors), (3) it ages cleanly into v2.0's
  broader-canon expansion where "97 giants" would be an even bigger
  fudge, (4) it reads warm rather than cheeky — which scales as the
  project grows.

- **Caveman-style centered HTML header** specifically chosen as the
  visual reference. See
  [`caveman/README.md`](https://raw.githubusercontent.com/JuliusBrussee/caveman/main/README.md)
  for the exact pattern: centered `<h1>`, centered bold `<strong>`
  tagline, centered badges, centered TOC, `---` divider, then prose.

- **FAQ scope: one question only.** The full set of plausible FAQ
  questions (book required? Anthropic only? affiliated with O'Reilly?
  difference from Cursor rules?) was considered and dropped — only the
  superpowers comparison has demonstrated cross-reference confusion
  (it surfaces in conversations and isn't answerable from the current
  README). One Q earns the section; padding to four would dilute it.
  Add more entries when readers actually ask them.

- **No "What this is" reframing.** Hard rule from v1.0 main spec:
  > *"v1.0 ships under the existing 97 Things companion framing. The
  > repositioning to 'trigger-based distillation of the modern programming
  > canon' is deferred to v2.0… No 'What this is' reframing in this story."*
  >  — `.todo/US-v1.0-canon-expansion/main.md` lines 29–36, 92–93
  This task is presentation, not repositioning. The tagline and FAQ
  are additions; the substantive copy stays.

### Suggested FAQ text (final wording at author's discretion)

```markdown
## FAQ

### How does this compare to [`superpowers`](https://github.com/obra/superpowers)?

Different layers, designed to compose.

**`superpowers`** ships *process* skills — when to plan, how to debug
systematically, when work is verified, how to dispatch parallel agents.
They tell the agent *how to work*.

**`97`** ships *content* skills — what makes a function name good, what
trap to avoid when comparing floats, what API shape to choose. They tell
the agent *what makes the code good* once it's writing.

The 97 bootstrap (`using-97/SKILL.md`) makes the precedence explicit:
*process skills run before content skills.* `superpowers/test-driven-development`
decides *whether* to write a test; `97/testing-discipline` decides *what
makes it good*. `superpowers/verification-before-completion` decides
*did it work*; `97/pre-commit-self-review` decides *is it well-considered*.

Short version: **superpowers is the methodology, 97 is the craftsmanship.**
They compose; install both if you use both styles of guidance.
```

### Suggested CHANGELOG bullet

> `README.md` opens with a tagline ("Your agent, on the shoulders of
> giants.") in a centered, scannable header, and a new `FAQ` section
> answers the most common cross-reference question — how 97 relates
> to `superpowers`. No content in "What this is" changed; this is
> purely a presentation pass.

### Out of scope

- Adding more FAQ entries.
- Restyling sections below "What's inside" (Install, Credits,
  Licensing, Development).
- Logo / image / centered emoji at the top. The caveman repo uses a
  centered rock emoji image; 97 doesn't have a mark yet, and improvising
  one in this task would creep scope. Defer.
- Per-harness install icons or shields beyond the existing CI badge.
- Touching `using-97/SKILL.md`, any `SKILL.md`, or any adapter.
