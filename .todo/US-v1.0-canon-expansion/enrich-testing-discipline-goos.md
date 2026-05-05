# enrich-testing-discipline-goos

## Context

The current `testing-discipline` skill (98/262 lines) covers what
makes a good test. The canonical extensions are *Growing Object-
Oriented Software, Guided by Tests* (Freeman & Pryce, Addison-Wesley,
2009) — the source for **outside-in TDD**, listening to test pain,
and the test-as-design-pressure school — and *xUnit Test Patterns*
(Meszaros, Addison-Wesley, 2007) for the catalog of test smells and
fixture patterns.

Note: per the v0.3 priority order, `superpowers/test-driven-development`
decides *whether* to write a test; this skill decides *what makes the
test good*. Do not duplicate TDD process here.

**Value delivered:** brings the GOOS test-listening lens (test pain
points to a design problem) and Meszaros's named test smells
(Obscure Test, Fragile Test, Mystery Guest, Conditional Test Logic)
into the agent's vocabulary.

## Related Files

- `skills/testing-discipline/SKILL.md`
- `skills/testing-discipline/principles.md`
- `scripts/lint-skills.mjs`
- `CHANGELOG.md`
- `CONTENT-LICENSE.md` (if not already)

## Dependencies

- `0a-citation-scheme-spec.md` in `done/` — `GOOS/ListenToTests`,
  `xUnit/ObscureTest`, `xUnit/FragileTest`, `xUnit/MysteryGuest`,
  `xUnit/ConditionalTestLogic` IDs follow the format in
  `CITATION-SCHEME.md`.
- `0b-citation-scheme-migration.md` in `done/`.
- `1-reposition-framing.md` in `done/`.

## Acceptance Criteria

- [ ] Add **3–5** principles to `principles.md`:
  - **Listen to the tests** — when a test is hard to write, the design
    is wrong. Hard-to-mock collaborators, sprawling setup, brittle
    assertions are signals to change the production code, not the
    test. Source: Freeman & Pryce, *GOOS*, ch. 20.
  - **Test smells: Obscure Test** — too much in one test; reader
    cannot tell what is asserted. Fix: extract setup, name the
    behavior. Source: Meszaros, *xUnit Test Patterns*, ch. 16.
  - **Test smells: Fragile Test** — test breaks on changes unrelated
    to its intent (interface, behavior, data, context sensitivity).
    Fix: assert on behavior, not internals. Source: Meszaros, ch. 18.
  - **Test smells: Mystery Guest** — test depends on data not visible
    in the test (file on disk, shared DB row, env var). Fix: in-test
    fixtures or named factory. Source: Meszaros, ch. 16.
  - **No conditional logic in tests** — `if`/`for`/`switch` in a test
    is a smell; the test is multiple tests in disguise or a fixture
    is missing. Source: Meszaros, "Conditional Test Logic," ch. 18.
- [ ] At least **2** principles surfaced in `SKILL.md` — likely as
      Red Flags rows ("`if` inside a test body", "test setup longer
      than the test", "test reads from a file at a magic path").
- [ ] `principles.md` cites Freeman & Pryce, *Growing Object-Oriented
      Software, Guided by Tests* (Addison-Wesley, 2009) and Meszaros,
      *xUnit Test Patterns* (Addison-Wesley, 2007).
- [ ] `SKILL.md` Precedence section confirms the boundary with
      `superpowers/test-driven-development`: TDD decides *whether*;
      this skill decides *what makes the test good*. Add a
      cross-reference if missing.
- [ ] `scripts/lint-skills.mjs` `SKILL_RULES.testing-discipline`
      `principles` count updated.
- [ ] `CHANGELOG.md` `### Changed` entry written.
- [ ] `npm test` passes.

## Verification

**Automated:** `npm test`.

**Ad-hoc:**
- Spot-check: ask the agent to "write a test for a function that
  takes 4 collaborators and computes a discount." If the test setup
  is painful, verify the agent reaches for "the design is wrong"
  rather than "let's mock harder."
- Spot-check: review a test the agent generated for `if`/`for` in
  the body. Verify it gets called out and split.

## Notes

- **Do not add the full xUnit test smell catalog.** Pick 3–4 smells
  with clear, frequent agent failure modes. Reference more in
  `principles.md` only as background.
- **Outside-in TDD** is GOOS's signature method but is process, not
  content. Cite GOOS but defer the *whether/how* of TDD to
  `superpowers/test-driven-development`.
- **Voice:** Freeman & Pryce are calm and pedagogical; Meszaros is
  encyclopedic. Both re-voice cleanly into 97's register.
