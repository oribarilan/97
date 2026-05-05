# enrich-api-design-solid

## Context

The current `api-and-interface-design` skill (119/277 lines) draws
from *97 Things* essays on contracts and interface design. **SOLID**
(Robert C. Martin, 2000) and the broader OO-design canon plus
Wlaschin's "parse, don't validate" boundary discipline are the
canonical extension. Of the five SOLID principles, **ISP** (Interface
Segregation) and **DIP** (Dependency Inversion) are the most
trigger-actionable for API design; **LSP** (Liskov Substitution) is
relevant when designing inheritance hierarchies; **SRP** and **OCP**
overlap heavily with `writing-clean-code` and `before-you-refactor`
respectively, so cite the overlap rather than duplicate.

**Value delivered:** brings the SOLID names into the agent's
vocabulary at API boundaries, so it can recognize ISP/DIP violations
when designing a contract.

## Related Files

- `skills/api-and-interface-design/SKILL.md`
- `skills/api-and-interface-design/principles.md`
- `scripts/lint-skills.mjs`
- `CHANGELOG.md`
- `CONTENT-LICENSE.md` (if not already)

## Dependencies

- `0a-citation-scheme-spec.md` in `done/` — `Martin/ISP`, `Martin/DIP`,
  `Liskov/LSP`, `King/ParseDontValidate`, `Hyrum/Law` (as Red-Flag
  reference) IDs follow the format in `CITATION-SCHEME.md`. Source-key
  registry must include `Martin`, `Liskov`, `King`, `Hyrum` before this
  task lands; if absent, add them in this PR.
- `0b-citation-scheme-migration.md` in `done/`.
- `1-reposition-framing.md` in `done/`.

## Acceptance Criteria

- [ ] Add **3–5** principles to `principles.md`:
  - **Interface Segregation Principle (ISP)** — clients should not be
    forced to depend on methods they do not use. Many small focused
    interfaces beat one large interface. Source: Martin, "The
    Interface Segregation Principle" (1996); *Agile Software
    Development*, 2003.
  - **Dependency Inversion Principle (DIP)** — depend on abstractions,
    not concretions. The high-level module owns the abstraction; the
    low-level module conforms. Source: Martin, "The Dependency
    Inversion Principle" (1996).
  - **Liskov Substitution Principle (LSP)** — a subtype must be
    substitutable for its supertype without breaking caller
    assumptions. If overriding a method strengthens preconditions or
    weakens postconditions, the hierarchy is wrong. Source: Liskov,
    "Data Abstraction and Hierarchy" (1987).
  - **Parse, don't validate (at the boundary)** — the public API
    accepts a primitive, parses it into a domain type, and returns
    `Result<T, E>`. After the boundary, the rest of the code works
    in domain types. Source: Alexis King (2019); Wlaschin
    (cross-reference `domain-modeling`).
  - **Make the wire format an intentional choice** — the wire shape
    of a public API (JSON, protobuf, function signature) is a
    long-lived contract. Decisions about field naming, optionality,
    and versioning are deliberate, not incidental. Source:
    *Pragmatic Programmer* on "design by contract"; cite Hyrum's Law
    as background.
- [ ] At least **2** principles surfaced in `SKILL.md` — likely as
      Red Flags rows ("interface with 12 methods", "concrete class as
      function parameter type", "subclass overriding to throw
      `NotImplementedError`") or in the API-design checklist.
- [ ] `principles.md` cites Martin (SOLID essays + *Agile Software
      Development*, Prentice Hall, 2003), Liskov (CACM, 1987), and
      King (2019).
- [ ] `scripts/lint-skills.mjs`
      `SKILL_RULES.api-and-interface-design` `principles` count
      updated.
- [ ] `CHANGELOG.md` `### Changed` entry written.
- [ ] `npm test` passes.

## Verification

**Automated:** `npm test`.

**Ad-hoc:**
- Spot-check: ask the agent to "design a service interface for a
  user-management module that supports auth, profile, and admin
  ops." Verify it splits the interface (ISP) rather than producing
  one mega-interface. Verify dependencies on collaborators are
  expressed as abstractions (DIP).

## Notes

- **SRP and OCP are not added in this task.** SRP overlaps too
  heavily with `writing-clean-code` (single-purpose functions);
  OCP overlaps with `before-you-refactor`. Cite the overlap in
  `principles.md` and let the existing skills own those triggers.
  The agent should not see SRP twice.
- **Voice:** Martin's tone is dogmatic. Re-voice into 97's situational
  register. The principles are useful; the homiletic framing is not.
- **Hyrum's Law caveat:** when surfacing "the wire format is a long-
  lived contract," cite Hyrum's Law as the failure mode (any
  observable behavior of an API will be depended on by someone), not
  as the principle.
