# skill-api-and-interface-design

## Context

Build the `api-and-interface-design` themed skill. Triggers when designing a public API, function signature, module boundary, exported type, or any contract that other code will depend on.

**Value delivered**: Agents apply Scott Meyers' "easy to use correctly, hard to use incorrectly" rule to every interface they design — preventing whole classes of downstream bugs.

**Use `3-skill-before-you-refactor` as the template.**

## Related Files

- `skills/before-you-refactor/SKILL.md` — proven template
- `.todo/US-97-mvp/main.md` — cross-cutting rules

## Dependencies

- `3-skill-before-you-refactor.md`

## Source principles to distill

Per `main.md` source-material policy: GitHub mirror first, Medium as reading aid only.

1. **#7 Beware the Share** — Udi Dahan
2. **#19 Convenience Is Not an -ility** — Gregor Hohpe
3. **#32 Encapsulate Behavior, Not Just State** — Einar Landre
4. **#35 The Golden Rule of API Design** — Michael Feathers
5. **#55 Make Interfaces Easy to Use Correctly and Hard to Use Incorrectly** — Scott Meyers
6. **#59 Missing Opportunities for Polymorphism** — Kirk Pepperdine
7. **#65 Prefer Domain-Specific Types to Primitive Types** — Einar Landre
8. **#66 Prevent Errors** — Giles Colborne
9. **#84 Thinking in States** — Niclas Nilsson

## Acceptance Criteria

- [ ] All 9 sources fetched from GitHub mirror first; provenance recorded in `principles.md`
- [ ] `skills/api-and-interface-design/SKILL.md` exists with frontmatter:
  - [ ] `name: api-and-interface-design`
  - [ ] **Trigger** (situation-based): `description: Use when designing a public API, an exported function signature, a module boundary, an exported type/interface, or any contract other code will depend on`
- [ ] Body matches template structure
- [ ] **Non-triggers** subsection lists ≥3 prompts that should NOT fire this skill:
  - "rename a private/local function" → no
  - "add a comment to an existing public function" → no
  - "fix a bug inside an existing function without changing its signature" → no
- [ ] `principles.md` has long-form per-principle distillations in your own words (no verbatim quotes >25 words)
- [ ] `SKILL.md` under 220 lines
- [ ] `scripts/lint-skills.mjs` passes
- [ ] **Positive trigger test**: "design a public API for a rate limiter library" → invokes skill before sketching the interface
- [ ] **Negative trigger test**: "rename this private helper function" → does NOT invoke

## Verification

- **Automated**: `npm run lint` exits 0
- **Ad-hoc**:
  - Positive: "design the public interface for a rate limiter library" → expect invocation before signature drafts
  - Negative: "rename this private helper" → must NOT invoke

## Notes

- Make Scott Meyers' principle (#55) the headline — it's the most powerful general rule and good framing for the rest.
- Group thematically in `SKILL.md`: "Make wrong code look wrong" (#55, #66), "Encapsulate" (#7, #32), "Use the type system" (#65, #84), "API ergonomics" (#19, #35), "Polymorphism over conditionals" (#59).
