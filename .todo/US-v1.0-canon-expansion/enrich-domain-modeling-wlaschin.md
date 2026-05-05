# enrich-domain-modeling-wlaschin

## Context

Scott Wlaschin's *Domain Modeling Made Functional* (Pragmatic, 2018)
and the broader "make invalid states unrepresentable" / "parse, don't
validate" school (Wlaschin, Alexis King) is the **highest-ROI source
for typed languages** in the canon. The current `domain-modeling`
skill is the smallest in the bundle (94/163 lines). It has room to
grow, and the trigger surface — introducing types, choosing where
state lives — is exactly where this material pays.

**Value delivered:** turns `domain-modeling` from "name your concept"
into "encode the domain so wrong states won't compile." Highest single
behavior change in this story for projects in TypeScript, Rust, F#,
Haskell, Scala, Kotlin.

## Related Files

- `skills/domain-modeling/SKILL.md`
- `skills/domain-modeling/principles.md`
- `scripts/lint-skills.mjs`
- `CHANGELOG.md`
- `CONTENT-LICENSE.md` (if not already)

## Dependencies

- `0a-citation-scheme-spec.md` in `done/` — `Wlaschin/InvalidStatesUnrepresentable`,
  `Wlaschin/SmartConstructors`, `Wlaschin/TypesForEffects` IDs follow
  the format in `CITATION-SCHEME.md`.
- `0b-citation-scheme-migration.md` in `done/`.

## Acceptance Criteria

- [ ] Add **3** principles to `principles.md`:
  - **`Wlaschin/InvalidStatesUnrepresentable`** — encode constraints
    into types (sum types / discriminated unions / branded primitives)
    so illegal combinations cannot be constructed. This is the
    canonical home for the principle; `api-and-interface-design`
    cross-references it from its `King/ParseDontValidate` entry.
    Source: Wlaschin, *Domain Modeling Made Functional*, ch. 6.
  - **`Wlaschin/SmartConstructors`** — domain types are constructed
    only through a function that enforces the invariant
    (`EmailAddress.parse(...)` returns `Result<EmailAddress, InvalidEmail>`,
    or in dynamic languages a parsed object or `None`). The raw
    constructor is private; the smart constructor is the only entry
    point. Pairs with `King/ParseDontValidate` (which fires at the
    *boundary*); smart constructors are the *internal* counterpart.
    Source: Wlaschin, ch. 6.
  - **`Wlaschin/TypesForEffects`** — use the type system to track
    effects and state: `Result<T, E>`, `Option<T>`, `Maybe<T>`,
    branded types (`UserId` not `string`). In typed languages, this
    is non-negotiable; in dynamic languages, the agent reaches for
    typed wrappers, `dataclass(frozen=True)`, `pydantic`, `attrs`,
    or `TypedDict` as available. Source: Wlaschin, *DMMF*; broader
    functional canon.
- [ ] **Parse, don't validate is NOT added in this task.** It lives
      in `enrich-api-design-ousterhout-liskov-king.md` as
      `King/ParseDontValidate`. This skill cross-references it.
      Decision rule: parse-don't-validate fires when designing a
      *boundary* (untrusted input crossing in); make-invalid-states-
      unrepresentable fires when designing *internal* invariants.
- [ ] **Total functions over partial functions is NOT added** as a
      standalone principle. The `Wlaschin/TypesForEffects` entry
      covers the practical implementation (`Result`/`Option`); a
      separate "totality" principle would be abstract restating.
- [ ] At least **2** principles surfaced in `SKILL.md` — either as
      checklist steps in the type-design flow or as Red Flags rows
      ("string for an ID where a branded type would catch swaps",
      "boolean flags carrying state", "constructor that does not
      validate then private setters that do").
- [ ] Add a **language guard** in `SKILL.md` Precedence or
      Non-triggers: these principles fire hardest in languages with
      sum types and pattern matching (TS, Rust, F#, Haskell, Scala,
      Kotlin); they degrade gracefully in dynamic languages (Python,
      JS, Ruby) where the agent should still prefer typed wrappers /
      `dataclass(frozen=True)` / `pydantic` / `attrs`. **Do not be
      type-system-evangelical:** in a small Python script, a `dict`
      is the right answer.
- [ ] `principles.md` cites Wlaschin (publisher: Pragmatic Bookshelf,
      2018).
- [ ] `scripts/lint-skills.mjs` `SKILL_RULES.domain-modeling`
      `principles` field updated to include the 3 new IDs.
- [ ] `CHANGELOG.md` `### Changed` entry written.
- [ ] `npm test` passes.

## Verification

**Automated:** `npm test`.

**Ad-hoc:**
- Spot-check in a TS project: ask the agent to model a "User can be
  pending, active, or banned, with banned having a reason." Verify it
  reaches for a discriminated union, not a flag-laden interface.
- Spot-check in a Python project: verify the agent reaches for a
  `dataclass` / `pydantic` model with a parser, not a dict + validator.

## Notes

- **Do not** make this skill type-system-evangelical. The 97 voice is
  situational. The principles fire hardest in typed languages; the
  language guard above keeps them from being dogmatic in dynamic
  languages.
- **Overlap with `api-and-interface-design`:** branded types and smart
  constructors also matter at API boundaries. The boundary: this skill
  fires when **introducing a new domain concept**; the API skill fires
  when **exporting a contract**. The same value-object idea may appear
  in both with different framing.
- **Overlap with `writing-clean-code`:** Primitive Obsession (Fowler
  smell). See `enrich-before-you-refactor-fowler.md` notes — pick which
  skill owns the trigger and cross-reference.
