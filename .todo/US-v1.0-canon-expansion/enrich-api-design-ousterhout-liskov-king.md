# enrich-api-design-ousterhout-liskov-king

## Context

The current `api-and-interface-design` skill (119/277 lines) draws
from *97 Things* essays on contracts and interface design. Three
canonical extensions sharpen the trigger:

- **Ousterhout's *A Philosophy of Software Design*** for "deep modules"
  (small interface hiding a lot of implementation) and "define errors
  out of existence" (designing APIs so error conditions can't arise).
- **Liskov's substitution principle (LSP)** for inheritance/subtyping
  decisions.
- **Alexis King's "Parse, don't validate"** for boundary parsing —
  this skill is the canonical home for that principle (domain-modeling
  cross-references it without restating).

**Sources we explicitly do not enrich from.** Martin's SOLID is not
imported under his name — ISP is already partly implicit in the skill
(`#19` Convenience Is not an -ility, `#59` polymorphism), DIP risks
encouraging cargo-cult abstraction layers, and Martin's voice clashes
with 97's situational register. Ousterhout covers the same agent-
behavior surface (small interfaces, hiding complexity) without the
homiletic baggage. SRP and OCP are owned by `writing-clean-code` and
`before-you-refactor` respectively.

**Value delivered:** brings the modern API-design vocabulary (deep
modules, define errors out of existence, parse-don't-validate) into
the agent's reach at the moment a public contract is being designed.

## Related Files

- `skills/api-and-interface-design/SKILL.md`
- `skills/api-and-interface-design/principles.md`
- `scripts/lint-skills.mjs`
- `CHANGELOG.md`
- `CONTENT-LICENSE.md` (if not already)

## Dependencies

- `0a-citation-scheme-spec.md` in `done/` — `Ousterhout/DeepModules`,
  `Ousterhout/DefineErrorsOutOfExistence`, `Liskov/LSP`,
  `King/ParseDontValidate`, `Hyrum/Law` (as Red-Flag reference) IDs
  follow the format in `CITATION-SCHEME.md`. Source-key registry
  already includes `Ousterhout`, `Liskov`, `King`, `Hyrum` per the
  spec's Sources table.
- `0b-citation-scheme-migration.md` in `done/`.

## Acceptance Criteria

- [ ] Add **4** principles to `principles.md`:
  - **`Ousterhout/DeepModules`** — deep modules hide a lot of
    implementation behind a small interface; shallow modules expose
    most of their implementation through their interface, providing
    little benefit. When designing an interface, prefer fewer / more-
    powerful methods that hide complexity over many / thin methods
    that expose it. Source: Ousterhout, *A Philosophy of Software
    Design*, ch. 4 ("Modules Should Be Deep").
  - **`Ousterhout/DefineErrorsOutOfExistence`** — design APIs so that
    error conditions cannot arise rather than building handlers for
    them. Concrete patterns: a `substring(start, end)` that clamps
    out-of-range indices instead of throwing; a `delete(file)` that
    is idempotent so "file does not exist" is not an error; a
    `lookup` that returns `Option`/`Maybe` rather than throwing
    `NotFound`. Reduces caller-side error-handling code paths.
    Source: Ousterhout, *APoSD*, ch. 10 ("Define Errors Out of
    Existence").
  - **`Liskov/LSP`** — a subtype must be substitutable for its
    supertype without breaking caller assumptions. If overriding a
    method strengthens preconditions, weakens postconditions, or
    throws on inputs the parent accepts, the hierarchy is wrong.
    Fires when designing inheritance hierarchies; not a
    general-purpose API rule. Source: Liskov, "Data Abstraction and
    Hierarchy", CACM 1987.
  - **`King/ParseDontValidate`** — at the public API boundary, parse
    untrusted input into a domain type that proves its shape; do not
    "validate and pass through" a primitive. The parser returns a
    `Result<T, E>` (or equivalent in dynamic languages: a parsed
    domain object or a structured error). After the boundary, the
    rest of the code works in domain types. **This skill is the
    canonical home for parse-don't-validate**; `domain-modeling`
    cross-references it for the related "make invalid states
    unrepresentable" principle. Source: Alexis King, "Parse, don't
    validate" (2019, lexi-lambda.github.io); cross-reference
    `Wlaschin/InvalidStatesUnrepresentable` in `domain-modeling`.
- [ ] At least **2** principles surfaced in `SKILL.md` — likely as
      Red Flags rows ("interface with 12 methods that mostly forward
      to internals", "subclass overriding to throw
      `NotImplementedError`", "boundary handler returns the raw input
      type with `validated = true` flag") or in the API-design
      checklist.
- [ ] **Hyrum's Law** appears as a Red Flag row, not as a principle.
      Suggested wording: "Reasoned about the new API as if its current
      observable behavior is private. Hyrum's Law: any observable
      behavior of an API will be depended on by someone." Cite
      `Hyrum/Law` in the Red Flag row; no separate `## Hyrum/Law —`
      heading in `principles.md`.
- [ ] `principles.md` cites Ousterhout (Yaknyam Press, 2nd ed. 2021,
      chapters 4 and 10), Liskov (CACM, 1987), and King (2019).
- [ ] `scripts/lint-skills.mjs`
      `SKILL_RULES.api-and-interface-design` `principles` field
      updated to include the 4 new IDs.
- [ ] `CHANGELOG.md` `### Changed` entry written, naming Ousterhout +
      Liskov + King as the new sources.
- [ ] `npm test` passes.

## Verification

**Automated:** `npm test`.

**Ad-hoc:**
- Spot-check: ask the agent to "design a service interface for a
  user-management module that supports auth, profile, and admin
  ops." Verify it reaches for fewer / more-powerful methods (deep
  modules) and considers what error conditions can be designed out
  of the API, not just handled.
- Spot-check: ask the agent to "write a function that takes a
  user-supplied date string and looks up records for that day."
  Verify it parses the string into a date type at the boundary and
  works with the date type internally, rather than passing the
  string through with a `validated` flag.

## Notes

- **No Martin in this task.** Per the v1.0 source decision, Clean
  Code / SOLID-as-Martin is not imported. ISP and DIP are partly
  covered by existing 97 Things essays in this skill (`#19`, `#59`)
  and by `Ousterhout/DeepModules` (which covers the "small focused
  interface" surface without naming ISP). Cargo-cult dependency
  inversion is a real failure mode at API boundaries; this skill
  does not encourage it.
- **SRP and OCP are not added in this task.** SRP overlaps with
  `writing-clean-code` (single-purpose functions); OCP overlaps with
  `before-you-refactor` (open for extension via refactor). Cite the
  overlap in `principles.md` if mentioned in passing; do not import
  the principle here.
- **Parse-don't-validate is owned here, not in domain-modeling.**
  The decision rule: parse-don't-validate fires when designing a
  boundary (untrusted input crossing into the system); make-invalid-
  states-unrepresentable fires when designing internal domain
  invariants (no untrusted input involved). Both `principles.md`
  files cross-reference each other.
- **Voice:** Ousterhout's prose is calm and observational; Liskov's
  is academic; King's is precise and pedagogical. All three
  re-voice cleanly into 97's register.
- **Hyrum's Law caveat:** Hyrum's Law is the failure mode for *all*
  long-lived APIs. Citing it in the Red Flag row is enough; it does
  not deserve a principle entry of its own.
