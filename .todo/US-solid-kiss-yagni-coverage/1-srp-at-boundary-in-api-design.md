# 1-srp-at-boundary-in-api-design

## Context

`api-and-interface-design` already covers LSP by name and "narrow
interfaces" in substance, but **SRP at module boundaries** — the idea
that an exported surface should have one reason for callers to depend
on it — is not called out. This is the boundary-level twin of
`writing-clean-code`'s unit-level SRP (decision 4, `97/76`).

The same framing also captures *part* of ISP ("clients shouldn't
depend on methods they don't use") — specifically the fat-interface
half. ISP also includes role-based interface segregation (`Customer`
vs `Auditor` views of the same object), which is gestured at by
decision 6 (state types) and decision 7 (vocabulary). The
`principles.md` framing must be precise: SRP-at-boundary is *one
consequence* of ISP, not a synonym.

**Value delivered:** an exported `Repository` with 14 methods where every
caller uses 2 gets caught by a Red Flag the agent can quote, instead of
slipping past because LSP is the only SOLID letter the skill currently
names.

## Related Files

- `skills/api-and-interface-design/SKILL.md` — add Red Flag row + a
  bullet inside **decision 3** ("Encapsulate behavior, not just
  state"). See "Host decision" in Notes for why this decision and not
  a new one.
- `skills/api-and-interface-design/principles.md` — short note on the
  SRP-at-boundary framing and the ISP overlap (precise wording: "one
  consequence of, not equivalent to"). Reuse `97/76`.
- `skills/api-and-interface-design/SKILL.md` Principles table — add
  `97/76` row. The principle is also cited in `writing-clean-code`;
  cross-skill citation reuse is fine and already precedented for
  `97/30`.

## Dependencies

- None. The citation key is locked at `97/76` in `main.md`. This task
  can run in parallel with tasks 2 and 3.

## Acceptance Criteria

- [ ] `api-and-interface-design/SKILL.md` has a Red Flag row whose
      "Thought" column captures the fat-interface pattern (e.g., "this
      class is the right home for it — it's already imported here") and
      the "Reality" column points the reader at SRP-at-boundary, citing
      `97/76`.
- [ ] Decision 3 ("Encapsulate behavior, not just state") gains one
      additional bullet or sentence framing the boundary-level SRP
      check ("encapsulate *one* coherent behavior — a class with 14
      methods of which any caller uses 2 has the same problem in
      reverse"), citing `97/76`.
- [ ] Citation: `97/76` reused (per `main.md` locked decision).
      No new citation key introduced.
- [ ] `principles.md` distillation explains the SRP-at-boundary framing
      in 2–4 sentences. ISP is acknowledged in prose as "one
      consequence" of the SRP-at-boundary check, not as a synonym; no
      acronym promotion. The adjacency with `Ousterhout/DeepModules`
      is called out: deep modules is about *interface/implementation
      ratio*; SRP-at-boundary is about *cohesion of the exported
      surface*. Different observations, both worth keeping.
- [ ] Principles table in `SKILL.md` includes the `97/76` row.
- [ ] Voice check passes: no "stands as", no rule-of-three padding, no
      "Single Responsibility Principle" as a banner — it's a check, not
      a billboard. The Red Flag "Thought" column does not contain the
      acronym SRP (per `main.md` forbidden list).
- [ ] `npm test` passes. If the line cap on
      `api-and-interface-design/SKILL.md` (currently 128 lines vs cap)
      is approached, trim a low-value Red Flag row before raising the
      cap (per `main.md` cross-cutting concerns).

## Verification

**Automated:** `npm test`.

**Ad-hoc:** grep `skills/api-and-interface-design/` for `97/76` — must
appear in `SKILL.md` (Red Flag row + decision 3 bullet + principles
table) and `principles.md` (long-form). Read the new Red Flag row
aloud — it should sound like the existing rows, not like a SOLID
lecture. Confirm the proposed Red Flag "Thought" column is something a
tired engineer would actually think while writing a fat repository
(not "this violates SRP-at-boundary").

## Notes

- **Citation locked: `97/76`.** Do not introduce `Martin/SRP`. See
  `main.md` locked scope decisions.
- **Host decision: decision 3.** There is no decision titled "narrow
  interfaces" in the current `SKILL.md`. The closest hosts are
  decision 3 ("Encapsulate behavior, not just state") and decision 7
  ("Design vocabulary, not conveniences"). Decision 3 wins because
  SRP-at-boundary is fundamentally a *cohesion of exported surface*
  question, which is the dual of decision 3's "encapsulate behavior on
  the type that owns the state." Decision 7 is about flag arguments
  flipping operation meaning — different concern.
- **Do not invent a new numbered decision** purely for SRP. The
  existing decision 3 absorbs the new bullet cleanly.
- **Adjacency with `Ousterhout/DeepModules`** (already in Red Flags
  at `SKILL.md:88`): call this out explicitly in `principles.md` so
  the executor distinguishes the two rather than restating Ousterhout
  under a Martin citation. Deep modules: hide a lot of implementation
  behind a small interface. SRP-at-boundary: the small interface
  should have one reason for callers to depend on it. Both true,
  neither replaces the other.
- **Forbidden in this task:** Red Flag rows or principles for OCP,
  ISP, or DIP. ISP can be acknowledged as "one consequence of the
  SRP-at-boundary check" in `principles.md` prose — not promoted, not
  treated as a synonym.
