# prune-working-with-users-and-team

**Council confidence:** [Consensus] — all 5 councillors named this skill
as the weakest fit for an agent. Most of the content is human-to-human
collaboration advice.

## Context

`skills/working-with-users-and-team/SKILL.md` includes:

- Estimation / requirements interpretation — **agent-relevant**
- Reviewing a colleague's PR with substantive feedback — **agent-relevant**
- Pairing rotation, knowledge-gradient pairing, watching real users,
  rotating before task is finished, restating in different words —
  **largely human-to-human**, doesn't translate to an agent

Agents don't pair, don't rotate mid-task, don't watch users. The
collaboration material is filler in agent context.

**Value delivered:** smaller skill that fires more usefully when it
fires; less ceremony; honest scope.

## Related Files

- `skills/working-with-users-and-team/SKILL.md` — main edit
- `skills/working-with-users-and-team/principles.md` — destination for
  demoted content
- `skills/using-97/SKILL.md` — trigger row may need rewording
- `scripts/lint-skills.mjs:69-73` — required principle list for this
  skill (re-evaluate after pruning)
- `README.md:99` — "What's inside" table description

## Dependencies

- **`patch-trigger-coverage-gaps.md` is a hard prerequisite.** That
  task decides the fate of "reviewing others' code" content (extend
  this skill, carve a new one, or defer). This task can't decide
  whether to keep PR-review material here without that decision; if
  both ran in parallel, two agents would collide on the same content
  call. Wait for `patch-trigger-coverage-gaps` to ship its decision
  before starting this task.

## Acceptance Criteria

- [x] `SKILL.md` decisions covering pairing, rotation, real-user
      observation, and other strictly human-to-human advice are removed
      from `SKILL.md`. They may be retained in `principles.md` for
      attribution but no longer load into agent context on trigger.
- [x] Estimation/requirements/interpretation content **stays** in
      `SKILL.md` and is the new spine of the skill.
- [x] Reviewing-others'-PRs content is handled per the
      `patch-trigger-coverage-gaps.md` decision (extend this skill,
      carve a new one, or defer). Apply that decision; do not re-open
      it here.
- [x] `SKILL.md` line count drops by at least 30% from its current ~125
      lines.
- [x] Bootstrap trigger row in `using-97/SKILL.md` updated to reflect
      the narrower scope (drop pairing/UX-watching language; keep
      "estimating effort, gathering or interpreting requirements,
      communicating with stakeholders about what to build").
- [x] `scripts/lint-skills.mjs` `principles` array for this skill is
      updated to match what's actually cited in the new `SKILL.md`.
      Removed principles still appear in `principles.md` for attribution
      but the lint no longer requires them in `SKILL.md`.
- [x] `README.md` "What's inside" row updated to match new trigger.
- [x] `npm test` passes.

## Verification

**Automated:**
- `npm test` — lint will catch principle-list mismatches
- Smoke test still passes

**Ad-hoc:**
- Read the new `SKILL.md` end-to-end. Every decision in it should be
  something a coding agent can actually do (estimate, ask for missing
  requirements, summarize a stakeholder ask, review a PR diff). No
  decision should be "rotate pairing partners" or "watch a real user
  use the system."

## Notes

- **Open question:** rename the skill? "Working with users and team"
  no longer matches if collaboration content is gone. Candidates:
  - `requirements-and-estimation` — narrowest, accurate
  - `requirements-estimation-and-review` — if PR review stays here
  Decide during the task.
- If renamed, the cascade is: directory name, frontmatter `name:`,
  frontmatter `description:` (must still start with "Use when" per
  lint), `SKILL_RULES` key in `lint-skills.mjs`, `principles.md`
  heading if any, trigger map row in `using-97/SKILL.md`, README
  "What's inside" table, and any cross-references in other skills'
  Precedence sections (grep `working-with-users-and-team` across
  `skills/**/*.md`). Also coordinate with
  `fix-smoke-test-bootstrap-injection.md` if its marker assertion
  references this skill name.
- Some councillors suggested splitting (`giving-estimates` as its own
  small skill). This is fine if the rename + prune naturally factor that
  way, but **don't manufacture splits** for the sake of it.
