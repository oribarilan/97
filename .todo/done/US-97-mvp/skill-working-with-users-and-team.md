# skill-working-with-users-and-team

## Context

Build the `working-with-users-and-team` themed skill. Triggers when designing UX, gathering requirements, communicating with stakeholders, or collaborating on a task.

**Value delivered**: Agents push back on "the user said X, so I'll build X" thinking, ask better requirements questions, and treat collaboration as a design tool (not a tax).

**Use `3-skill-before-you-refactor` as the template.**

## Related Files

- `skills/before-you-refactor/SKILL.md` — proven template
- `.todo/US-97-mvp/main.md` — cross-cutting rules

## Dependencies

- `3-skill-before-you-refactor.md`

## Source principles to distill

Per `main.md` source-material policy: GitHub mirror first, Medium as reading aid only.

1. **#3 Ask, "What Would the User Do?" (You Are Not the User)** — Giles Colborne
2. **#36 The Guru Myth** — Ryan Brush
3. **#50 Learn to Estimate** — Giovanni Asproni
4. **#64 Pair Program and Feel the Flow** — Gudny Hauknes, Kari Røssland, Ann Katrin Gagnat
5. **#77 Start from Yes** — Alex Miller
6. **#85 Two Heads Are Often Better Than One** — Adrian Wible
7. **#86 Two Wrongs Can Make a Right (and Are Difficult to Fix)** — Allan Kelly
8. **#87 Ubuntu Coding for Your Friends** — Aslam Khan
9. **#96 You Gotta Care About the Code** — Pete Goodliffe
10. **#97 Your Customers Do Not Mean What They Say** — Nate Jackson

## Acceptance Criteria

- [ ] All 10 sources fetched from GitHub mirror first; provenance recorded in `principles.md`
- [ ] `skills/working-with-users-and-team/SKILL.md` exists with frontmatter:
  - [ ] `name: working-with-users-and-team`
  - [ ] **Trigger** (situation-based): `description: Use when designing UX, gathering or interpreting requirements, estimating effort, or communicating with stakeholders/customers about what to build`
- [ ] Body matches template structure with sub-sections: **Users** / **Requirements** / **Estimation** / **Collaboration**
- [ ] **Non-triggers** subsection lists ≥3 prompts that should NOT fire this skill (e.g., "fix this bug", "rename this variable", "add a unit test")
- [ ] **Brainstorming cross-reference is an AC, not a note**: `SKILL.md` contains an explicit cross-reference to `superpowers:brainstorming` and states the precedence — *if the request is ambiguous or product-facing, `superpowers:brainstorming` runs first to explore intent; THEN `97/working-with-users-and-team` applies user/customer/collaboration principles to the explored space*
- [ ] **Concrete-action requirement**: each principle in `principles.md` MUST be followed by a concrete agent action in the form "Before/When X, do Y" — no principle stops at a slogan. Example for #3: "Before adding a UI affordance, list 2 alternative paths a non-power-user might take and check the design accommodates them."
- [ ] `principles.md` has long-form distillations in your own words (no verbatim quotes >25 words)
- [ ] `SKILL.md` under 220 lines
- [ ] `scripts/lint-skills.mjs` passes
- [ ] **Positive trigger test**: "the user wants a settings page with everything on it" → invokes skill, pushes back per #3 and #97
- [ ] **Negative trigger test**: "fix this off-by-one bug" → does NOT invoke

## Verification

- **Automated**: `npm run lint` exits 0
- **Ad-hoc**:
  - Positive: "the user said they want a dashboard with every metric on one screen — build it" → expect invocation, expect agent to ask clarifying questions and push back BEFORE building
  - Positive: "estimate how long this feature will take" → expect invocation citing #50
  - Negative: "fix this typo" → must NOT invoke
  - Negative: "rename this function" → must NOT invoke

## Notes

- This is the most "soft skills" of the bundle. Be especially rigorous about turning each principle into a concrete agent behavior, not a vibe. The "Concrete-action requirement" AC above is the single most important constraint on this skill — without it, the whole skill devolves into platitudes.
- Many sources unlinked on Medium — budget extra time. GitHub mirror is the canonical source per `main.md` policy.
- Coordinates with `superpowers:brainstorming` (which handles "explore intent before building"). This skill is the layered domain wisdom; superpowers' skill is the process. Cross-reference, don't duplicate — and the precedence is fixed: brainstorming first, then this skill.
