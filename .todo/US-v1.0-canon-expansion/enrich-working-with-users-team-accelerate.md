# enrich-working-with-users-team-accelerate

## Context

The current `working-with-users-and-team` skill has been **pruned in
v0.3** (`prune-working-with-users-and-team`) — pairing/rotation content
demoted to `principles.md`, agent-irrelevant material removed from
`SKILL.md`. This task adds **modest** canonical content from
*Accelerate* (Forsgren/Humble/Kim, 2018), *The Phoenix Project* (Kim,
Behr, Spafford, 2013), and Cagan's *Inspired* (2017) — only where
those sources change agent behavior in a UX/requirements/team
communication moment.

This skill is the **lowest-priority enrichment** in the story.
Estimation, requirements, and stakeholder communication are inherently
human-shaped; the agent's role is narrow. Do not pad. If at the end
this task adds only 1–2 principles, that is correct.

**Value delivered:** named coverage for *Accelerate*'s deploy-frequency
framing (overlaps with `build-deploy-and-tooling`) and Cagan's product-
discovery framing — both useful when the agent is asked to estimate
or scope work.

## Related Files

- `skills/working-with-users-and-team/SKILL.md`
- `skills/working-with-users-and-team/principles.md`
- `scripts/lint-skills.mjs`
- `CHANGELOG.md`
- `CONTENT-LICENSE.md` (if not already)

## Dependencies

- `0a-citation-scheme-spec.md` in `done/` — `DORA/SmallerDeliveries`,
  `Cagan/DiscoveryDelivery`, `Pragmatic/EstimatesAreRanges`,
  `Phoenix/LocalOptimization` IDs follow the format in
  `CITATION-SCHEME.md`. Source-key registry must include `Cagan`,
  `Pragmatic`, `Phoenix` before this task lands.
- `0b-citation-scheme-migration.md` in `done/`.
- `1-reposition-framing.md` in `done/`.
- v0.3 `prune-working-with-users-and-team.md` in `done/` — must
  enrich the pruned baseline, not the pre-prune one.

## Acceptance Criteria

- [ ] Add **2–4** principles to `principles.md`. Suggested set
      (pick at most 3):
  - **Smaller, more frequent deliveries beat larger, rarer ones.**
    Cycle time is a leading indicator of team health (DORA). When
    asked to scope work, the agent prefers slicing into deliverable
    increments over a single big-bang plan. Source: *Accelerate*,
    Forsgren/Humble/Kim, IT Revolution Press, 2018, ch. 2 + 3.
  - **Discovery vs delivery** — assumptions about user need are
    distinct from implementation work. Before estimating, the agent
    asks what is already validated and what is still hypothesis.
    Source: Cagan, *Inspired* (Wiley, 2nd ed. 2017), ch. 13–17.
  - **Estimates are uncertainty ranges, not point predictions.**
    Single-number estimates with no range are anti-patterns; either
    give a range with assumptions or refuse to estimate without
    decomposition. Source: *Pragmatic Programmer*, ch. 1, "Estimation."
  - **Local optimization is a system smell** — when one team's
    metrics improve at the cost of another team's, the system is
    poorly aligned. The agent should flag cross-team impact when
    asked to optimize for one team. Source: *The Phoenix Project*,
    Kim/Behr/Spafford, IT Revolution Press, 2013.
- [ ] At most **1** new principle is surfaced in `SKILL.md` directly.
      The skill is narrow; do not bloat it. Likely surface: "estimates
      are ranges with assumptions" as a Red Flags row.
- [ ] `principles.md` cites *Accelerate*, *Inspired*, *Pragmatic
      Programmer*, *The Phoenix Project* with publishers and years.
- [ ] Voice re-voiced into 97's register. *Phoenix Project* is a
      novel and reads as such; do not import its tone.
- [ ] `scripts/lint-skills.mjs`
      `SKILL_RULES.working-with-users-and-team` `principles` count
      updated.
- [ ] `CHANGELOG.md` `### Changed` entry written.
- [ ] `npm test` passes.

## Verification

**Automated:** `npm test`.

**Ad-hoc:**
- Spot-check: ask the agent to "estimate how long it would take to add
  a multi-tenant billing module." Verify it returns a range with
  explicit assumptions, asks what is validated vs assumed (Cagan
  framing), and proposes slicing if the range is too wide.

## Notes

- **Lowest-priority task in the story.** Land it last. If by the time
  this is reached the rest of v1.0 has shipped and the skill is
  serving its agents well, it is fine to defer this task to v1.x and
  remove it from the story. Document the deferral in `main.md` if so.
- **Do not** import *Accelerate*'s organizational-survey methodology.
  That is a leadership concern, not an agent concern. The DORA-keys
  framing already lives in `build-deploy-and-tooling`; this skill
  references it for *scoping* discussions.
- **Do not** add a "psychological safety" or "blameless postmortem"
  principle. Those are valuable but human-shaped, not agent-actionable
  in a moment.
- **If the lint-budget-policy decision in v0.3 went toward stricter
  caps**, this task may need to surface 0 new principles in `SKILL.md`
  and rely entirely on `principles.md`. That is fine. Naming the
  principles in `principles.md` for cross-reference is enough.
