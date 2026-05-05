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

- `0a-citation-scheme-spec.md` in `done/` — Wlaschin/King IDs follow
  the format defined in `CITATION-SCHEME.md`.
- `0b-citation-scheme-migration.md` in `done/` — `principles.md` is
  already in the new heading format.
- `1-reposition-framing.md` in `done/`.

## Acceptance Criteria

- [ ] Add **3–5** principles to `principles.md`:
  - **Make invalid states unrepresentable** — encode constraints into
    types (sum types / discriminated unions / branded primitives) so
    illegal combinations cannot be constructed. Source: Wlaschin,
    *Domain Modeling Made Functional*, ch. 6.
  - **Parse, don't validate** — at the boundary, *parse* untrusted
    input into a domain type that proves its shape; do not "validate
    and pass through" a primitive. Source: Alexis King, "Parse, don't
    validate" (2019).
  - **Use the type system to track effects/state** — `Result<T, E>`,
    `Option<T>`, `Maybe<T>`, branded types (`UserId` not `string`).
    Cite Wlaschin (Result/Either) and the broader functional canon.
  - **Smart constructors** — domain types are constructed only through
    a function that enforces the invariant (`EmailAddress.parse(...)`
    returns `Result<EmailAddress, InvalidEmail>`).
  - **Total functions over partial functions** — a function that
    accepts every value of its input type and returns every value of
    its output type, no exceptions for "this case is impossible." If a
    function is partial, its input type is wrong.
- [ ] At least **2** principles surfaced in `SKILL.md` — either as
      checklist steps in the type-design flow or as Red Flags rows
      ("string for an ID", "boolean flags carrying state").
- [ ] Add a **language guard** in `SKILL.md` Precedence or
      Non-triggers: these principles fire hardest in languages with
      sum types and pattern matching (TS, Rust, F#, Haskell, Scala,
      Kotlin); they degrade gracefully in dynamic languages (Python,
      JS, Ruby) where the agent should still prefer typed wrappers /
      `dataclass(frozen=True)` / `pydantic` / `attrs`.
- [ ] `principles.md` cites Wlaschin (publisher: Pragmatic Bookshelf,
      2018) and Alexis King's "Parse, don't validate" essay (2019,
      lexi-lambda.github.io).
- [ ] `scripts/lint-skills.mjs` `SKILL_RULES.domain-modeling`
      `principles` count updated.
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
