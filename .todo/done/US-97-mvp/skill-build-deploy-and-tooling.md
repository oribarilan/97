# skill-build-deploy-and-tooling

## Context

Build the `build-deploy-and-tooling` themed skill. Triggers when working on build scripts, CI configuration, deployment, repo setup, or choosing tools for a project.

**Value delivered**: Agents apply hard-won wisdom about builds, automation, version control, and tooling choices instead of re-deriving it from first principles every time.

**Use `3-skill-before-you-refactor` as the template.**

## Related Files

- `skills/before-you-refactor/SKILL.md` — proven template
- `.todo/US-97-mvp/main.md` — cross-cutting rules

## Dependencies

- `3-skill-before-you-refactor.md`

## Source principles to distill

Per `main.md` source-material policy: GitHub mirror first, Medium as reading aid only.

1. **#4 Automate Your Coding Standard** — Filip van Laenen
2. **#10 Choose Your Tools with Care** — Giovanni Asproni
3. **#20 Deploy Early and Often** — Steve Berczuk
4. **#38 How to Use a Bug Tracker** — Matt Doar
5. **#40 Install Me** — Marcus Baker
6. **#61 One Binary** — Steve Freeman
7. **#63 Own (and Refactor) the Build** — Steve Berczuk
8. **#68 Put Everything Under Version Control** — Diomidis Spinellis
9. **#78 Step Back and Automate, Automate, Automate** — Cay Horstmann
10. **#79 Take Advantage of Code Analysis Tools** — Sarah Mount
11. **#88 The Unix Tools Are Your Friends** — Diomidis Spinellis

## Acceptance Criteria

- [ ] All 11 sources fetched from GitHub mirror first; provenance recorded in `principles.md`
- [ ] `skills/build-deploy-and-tooling/SKILL.md` exists with frontmatter:
  - [ ] `name: build-deploy-and-tooling`
  - [ ] **Trigger** (situation-based, NOT topic-based): `description: Use when authoring or changing build scripts, CI workflows, deploy pipelines, repo setup files, or evaluating a new tool/dependency for adoption into the project`
- [ ] Body matches template structure with sub-sections per concern: **Builds** / **Deploy** / **Tooling choice** / **Automation** / **Version control**
- [ ] **Non-triggers** subsection lists ≥4 prompts that should NOT fire this skill:
  - "run the existing test suite" / running an established command → no
  - "tail this log file" / reading logs → no
  - "what does this Makefile target do?" / one-off shell exploration → no
  - "use the project's existing linter" / using a tool already mandated by the repo → no
- [ ] Body explicitly states: tool choice (#10) must respect existing project conventions before recommending new tools
- [ ] `principles.md` has long-form distillations in your own words (no verbatim quotes >25 words)
- [ ] `SKILL.md` under 240 lines
- [ ] `scripts/lint-skills.mjs` passes
- [ ] **Positive trigger test**: "add a CI workflow that lints and tests this repo" → invokes skill
- [ ] **Negative trigger test**: "run `npm test`" → does NOT invoke

## Verification

- **Automated**: `npm run lint` exits 0
- **Ad-hoc**:
  - Positive: "add a CI workflow that lints and tests this repo" → expect invocation
  - Positive: "set up a Dockerfile for this Python service" → expect invocation
  - Negative: "run the existing tests" → must NOT invoke
  - Negative: "what does this CI step do?" (informational) → must NOT invoke

## Notes

- The trigger must NOT fire on every shell command. The situation list above is what the agent pattern-matches against — if it doesn't include a situation, the skill doesn't fire.
- #61 "One Binary" is a deployable-immutable principle — frame it in the modern container/image context, not just the 2010 binary context.
- **Open question for v0.2**: if testing shows the skill rarely fires (because most coding tasks don't touch CI/build/deploy), consider whether to keep it as a single skill or merge into a broader "operational hygiene" v0.2 skill. For v0.1.0, ship as is.
