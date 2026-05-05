# add-stakes-calibration

## Context

The trigger taxonomy is situation-keyed ("calling a remote process",
"adding a request handler") but not project-context-keyed. The same
trigger can fire on:

- a production service handling user traffic, where a missing timeout
  is an outage waiting to happen, OR
- a CLI dev tool's `--check` subcommand that calls a local Docker
  daemon, where a circuit breaker is comically over-engineered.

v1.0 adds a layer of production-shaped principles (Nygard's stability
patterns, 12-factor, observability) on top of v0.x's predominantly
code-craft skills. Without explicit calibration, an agent following
the bundle could wire OTel trace context propagation around an MVP's
internal CLI, surround every HTTP call with a circuit breaker in a
prototype, and demand build/release/run separation for a one-off
script. That's the bundle doing exactly the wrong thing for the same
reason it's the right thing in production.

This task adds **stakes calibration** in three layers:

- **(C) One bootstrap Priority rule** in `using-97/SKILL.md` telling
  the agent to match principle weight to project stage/stakes.
- **(B) One Overview calibration sentence** in each production-shaped
  skill: when this skill fires hardest, when it fires lightly, when
  it doesn't fire at all.
- **(A) Strengthened Non-triggers** in each production-shaped skill
  explicitly excluding MVP / dev tool / prototype / one-off-script
  contexts.

**Production-shaped skills calibrated in this task:**
- `error-and-correctness-traps`
- `build-deploy-and-tooling`
- `security-and-trust-boundaries` (from v0.3)
- `observability` does **not** exist yet at the time this task runs;
  the calibration pattern established here is **applied to the new
  skill at creation time** by `add-observability-skill.md`.

**Out of scope.** Other axes of calibration that exist but are not
this task:
- Language-shape calibration (typed vs dynamic) — handled in
  `enrich-domain-modeling-wlaschin.md` as a language guard.
- Domain-concept reach (does this type cross module boundaries?) —
  could land later; v1.0 keeps stakes calibration focused on the
  production-runtime axis.

**Value delivered:** the production layer of v1.0 lands with explicit
calibration so agents stop applying production-grade discipline to
non-production contexts. Single highest-impact safety addition in v1.0.

## Related Files

- `skills/using-97/SKILL.md` — add one Priority rule (C)
- `skills/error-and-correctness-traps/SKILL.md` — Overview + Non-triggers (B + A)
- `skills/build-deploy-and-tooling/SKILL.md` — Overview + Non-triggers (B + A)
- `skills/security-and-trust-boundaries/SKILL.md` — Overview + Non-triggers (B + A); assumes v0.3 in `done/`
- `CHANGELOG.md` — `### Changed` entry
- `main.md` of this story — Cross-cutting Concerns gains a "Stakes
  calibration" section so future contributors maintain the pattern

## Dependencies

- `0a-citation-scheme-spec.md` in `done/`.
- `0b-citation-scheme-migration.md` in `done/`.
- v0.3 in `done/` (so `security-and-trust-boundaries/SKILL.md` exists
  and can be edited).
- **Must run before any production-shaped enrichment task** (`enrich-error-and-correctness-release-it`,
  `enrich-build-deploy-twelve-factor`, `add-observability-skill`) so
  those tasks add new principles to skills already carrying
  calibration framing.

## Acceptance Criteria

### (C) Bootstrap Priority rule

- [ ] `skills/using-97/SKILL.md` Priority section gains one rule.
      Suggested wording (place after the silent-application rule from
      `0b`):
      > **Match principle weight to stage and stakes.** Production-
      > shaped guidance — resilience patterns (timeouts, circuit
      > breakers, bulkheads), observability instrumentation, deploy
      > hygiene, security boundaries — fires hardest when code is
      > reaching real users in production. In MVPs, prototypes,
      > internal dev tools, debugging endpoints, and one-off scripts,
      > prefer the simplest thing that works. Do not retrofit
      > production discipline onto code whose architecture is not yet
      > settled.
- [ ] No other Priority-section edits.

### (B + A) Per-skill calibration in 3 production-shaped skills

For each of `error-and-correctness-traps`, `build-deploy-and-tooling`,
and `security-and-trust-boundaries`:

- [ ] **(B) Overview gains one calibration sentence.** The sentence
      tells the agent how to weight the skill across project contexts.
      Pattern (skill-specific wording):
      > Fires hardest when [code is reaching production users / a
      > release artifact is being shaped / untrusted input is
      > crossing into the system]. Fires lightly in MVPs, prototypes,
      > internal dev tools, and one-off scripts where the architecture
      > is not yet settled.
- [ ] **(A) Non-triggers gains explicit MVP/dev-tool exclusions.** New
      bullets in the Non-triggers section, e.g.:
  - "An early-stage MVP where the architecture is still in flux."
  - "An internal dev tool, debugging endpoint, or prototype."
  - "A one-off script or migration."
  - "Throwaway code expected to be replaced before reaching users."

  Skill-specific phrasings welcome; the substance is what matters.
- [ ] Each skill's existing Overview + Non-triggers wording is
      preserved. The calibration is *added*, not a replacement.

### Story-level documentation

- [ ] `main.md` of this story gains a "Stakes calibration" section in
      Cross-cutting Concerns documenting the pattern (one sentence in
      Overview + MVP exclusions in Non-triggers + bootstrap rule), so
      `add-observability-skill.md` and any future production-shaped
      skill follows it.

### Cross-task coordination

The calibration pattern is documented in `main.md`'s Cross-cutting
Concerns (per the story-level documentation step above). Downstream
tasks reference `main.md`; this task does **not** edit other task
files in `.todo/`. Editing `add-observability-skill.md`,
`enrich-error-and-correctness-release-it.md`, or
`enrich-build-deploy-twelve-factor.md` from here would create
`.todo/`-merge-conflict bait without adding value the `main.md`
section doesn't already provide.

If a downstream task accidentally adds a duplicate calibration block,
review catches it (the calibration sentence will appear twice in the
same Overview, or Non-triggers will list MVP exclusions twice). Lint
does not enforce this — it's a review-time check.

### Verification

- [ ] `npm test` passes.
- [ ] `git grep` for the calibration pattern (e.g. "fires hardest" or
      "MVPs, prototypes") returns matches in 3 skills + the bootstrap
      Priority rule.
- [ ] `CHANGELOG.md` `### Changed` entry, past tense:
      > Added stakes calibration to the bundle. Production-shaped
      > skills (`error-and-correctness-traps`,
      > `build-deploy-and-tooling`, `security-and-trust-boundaries`)
      > now carry explicit calibration in their Overview and
      > Non-triggers sections. New `using-97` Priority rule:
      > production guidance fires hardest when code is reaching
      > users; in MVPs and dev tools, prefer the simplest thing that
      > works.

### Reviewer notes (not acceptance gates)

The two harness spot-checks below are non-deterministic across
harnesses, model versions, and temperature settings. They are
*reviewer-confidence checks*, not pass/fail acceptance criteria.
Run them and use judgement:

- Ask the agent: *"I'm prototyping a Python script that calls a
  local Ollama instance to summarize text. Should I add a circuit
  breaker?"* Confidence signal: agent does **not** propose Nygard's
  circuit breaker (correctly recognizing MVP / dev-tool context).
- Ask the agent: *"I'm building a production web service that calls
  Stripe's payment API for live customer transactions. Should I add
  a circuit breaker?"* Confidence signal: agent **does** propose one.

If both signals fire, calibration is wired correctly. If neither or
only one fires, investigate — but treat as a follow-up issue, not a
gate on landing this task.

## Notes

- **Why this matters for v1.0 specifically.** v0.x was predominantly
  code-craft (write good code in isolation). v1.0 adds a production-
  discipline layer (Nygard, 12-factor, observability). Without
  calibration, that layer over-fires in non-production contexts. The
  bundle should help an MVP move fast and a production service stay
  resilient — not the other way around.
- **Why not just trust the agent.** Agents are inconsistent about
  cross-cutting context awareness when the explicit signal is absent.
  A trigger that fires "calling a remote process" without a stakes
  qualifier reads as universal advice. Adding the qualifier explicitly
  makes the calibration enforceable.
- **Why a separate task and not folded.** Two reasons. (1) Consistency:
  one author, one set of edits, voice continuous across the 3
  production skills. (2) Sequence: this task lands *before* the
  production-enrichment tasks, so those tasks add principles to skills
  that already have calibration framing — the new principles inherit
  the calibration context.
- **Voice.** The calibration sentences should read in 97's register:
  imperative, terse, no AI tells. The new bootstrap rule is
  bullet-shaped like other Priority rules; do not write a paragraph.
- **Observability skill is calibrated at creation, not by this task.**
  When `add-observability-skill.md` runs, it follows the calibration
  pattern documented here from the start. Lint or review catches if
  the new skill ships without calibration.
- **Future production-shaped skills.** If v1.x adds a fifth
  production-shaped skill (e.g. data-integrity, distributed-systems,
  performance), the calibration pattern is in `main.md` Cross-cutting
  Concerns and the new skill follows it. No retrofitting needed.
