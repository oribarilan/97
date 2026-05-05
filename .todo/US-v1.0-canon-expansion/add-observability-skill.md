# add-observability-skill

## Context

The current bundle has **no skill for observability**. The 2010s+
canon (Google's *Site Reliability Engineering*, Honeycomb-era
distributed tracing, structured-logging best practices, the
OpenTelemetry project) has produced a body of agent-actionable
practice that is currently squeezed into `error-and-correctness-traps`
(logging only) and the operational shape implied by 12-factor logs
(in `build-deploy-and-tooling`).

This task adds **one new themed skill: `observability`**, structured
in the `error-and-correctness-traps` template. Like
`security-and-trust-boundaries` from v0.3, this is a **net-add skill**
in the new-canon spirit: the principles come from the modern
observability canon, not from *97 Things*.

**Skill name and scope.** `observability` (not
`observability-and-operations`). The earlier "and-operations" suffix
invited scope creep into runbooks, on-call hygiene, post-mortems —
all valuable but human-shaped, not agent-actionable in a coding
session. Tightening to `observability` keeps the skill focused on
diagnosability decisions the agent makes at code-write time.

**Value delivered:** closes the largest behavioral gap in v1.0 after
v0.3 closed security. Agents currently produce code that is operable
in dev and inert in prod (no tracing, no metrics, unstructured logs).

## Related Files (to create or edit)

- `skills/observability/SKILL.md` — new
- `skills/observability/principles.md` — new
- `skills/using-97/SKILL.md` — add trigger row
- `scripts/lint-skills.mjs` — `SKILL_RULES` entry
- `README.md` — "What's inside" table row; total skill count
- `CONTENT-LICENSE.md` — paragraph for this skill (predominantly
  original commentary, no *97 Things* CC-BY-3.0 derivations)
- `CHANGELOG.md` — `### Added` entry

## Dependencies

- `0a-citation-scheme-spec.md` in `done/` — `SRE/GoldenSignals`,
  `OE/CardinalityDiscipline`, `OTel/TraceContext`,
  `OTel/StructuredLogs` IDs follow the format in `CITATION-SCHEME.md`.
  Source-key registry already includes `SRE`, `OE`, `OTel` per the
  spec's Sources table.
- `0b-citation-scheme-migration.md` in `done/`.
- `add-stakes-calibration.md` in `done/` — establishes the
  calibration pattern (bootstrap Priority rule + per-skill Overview
  sentence + Non-triggers exclusions). The new `observability` skill
  follows the pattern from creation.
- v0.3 `prune-bootstrap-urgency` and `add-security-traps-skill`
  in `done/` — so the bootstrap and trigger map are at their v0.3
  baseline before adding another row.

## Acceptance Criteria

- [ ] New skill directory `skills/observability/` exists with
      `SKILL.md` and `principles.md`.
- [ ] `SKILL.md` follows the **`error-and-correctness-traps` template
      exactly:** Overview → When to invoke → Non-triggers → Precedence →
      numbered checklist or trap-domains → Red Flags table → What "done"
      looks like → Principles in this skill table.
- [ ] **Four** principles in `principles.md`, each with a concrete
      example:
  - [ ] **`OTel/StructuredLogs`** — JSON / key-value, not free-form
        strings. Include request id, timestamp, level, event name,
        key fields. Source: SRE book; OpenTelemetry semantic
        conventions.
  - [ ] **`OTel/TraceContext`** — every cross-process call propagates
        a trace context (W3C Trace Context). Spans cover meaningful
        units of work, not every function. Source: OpenTelemetry
        semantic conventions; Majors et al., *Observability
        Engineering*.
  - [ ] **`SRE/GoldenSignals`** — the four signals: latency, traffic,
        errors, saturation. Source: *Site Reliability Engineering*,
        ch. 6.
  - [ ] **`OE/CardinalityDiscipline`** — high-cardinality fields
        (user id, request id) belong in traces and logs; not in
        metric labels. Unbounded label cardinality is a
        metrics-system outage in slow motion. Source: Majors et al.,
        *Observability Engineering* (O'Reilly, 2022); cross-reference
        Prometheus best-practice docs as background. **This is the
        highest-leverage single principle in the skill** — agents
        reach for Prometheus-style labels with user ids in them by
        default; this rule prevents the most common observability
        outage pattern.
- [ ] **`SRE/SLOs`-over-per-error-alerts is NOT added in this task.**
      The earlier plan included it. By the trigger-actionable bar,
      SLO design fires when an SRE designs alerting policy, not when
      the agent writes a function. Cut.
- [ ] **"Observability at code time" is NOT added as a separate
      principle.** The earlier plan included it. It is the meta-
      premise of the entire skill (the trigger fires when writing
      production code, not after); promoting it to a principle row
      duplicates the skill's overview.
- [ ] **Stakes calibration applied at creation time per
      `add-stakes-calibration.md` pattern.** Concretely:
  - Skill Overview includes one calibration sentence describing when
    the skill fires hardest, lightly, or not at all (e.g., "Fires
    hardest when adding a request handler, RPC, or background job
    that will run in production with users depending on diagnosability.
    Fires lightly in MVPs, prototypes, internal dev tools, debugging
    endpoints, and one-off scripts where structured-logging, tracing,
    and SLO discipline are premature.").
  - Non-triggers section explicitly excludes: an early-stage MVP
    where the architecture is still in flux; an internal dev tool or
    debugging endpoint; a one-off script or migration; a test;
    throwaway code expected to be replaced before reaching users.
- [ ] Trigger phrasing in `using-97/SKILL.md` is concrete and
      decidable. Suggested: *"Adding a request handler, RPC, or
      background job that will run in production; adding tracing,
      metrics, or structured-log calls; or making cross-process
      diagnosability decisions."* Narrower than the earlier "designing
      for production diagnosability" phrasing.
- [ ] Non-triggers list excludes obvious cases (a script that runs
      once locally; a one-off migration; a test).
- [ ] Precedence section notes overlap with:
  - `error-and-correctness-traps` (logging — what to log and what
    not to: secrets, PII, raw stack traces). That skill owns *content
    forbidden*; this skill owns *content shape* (key-value, request
    id, level).
  - `build-deploy-and-tooling` (12F XI logs as event streams). That
    skill owns *transport* (stdout, aggregated by the platform);
    this skill owns *content shape*.
  - `security-and-trust-boundaries` (v0.3, if shipped): logging /
    tracing routinely touches secrets and PII; the security skill
    has precedence on what fields are safe to emit.
- [ ] Voice passes the humanizer rules (no AI tells, imperative,
      concrete).
- [ ] `scripts/lint-skills.mjs` `SKILL_RULES` entry added for
      `observability` with:
  - `maxLines: 250` (per v0.3 budget policy default)
  - `sections: ['Overview', 'When to invoke', 'Red Flags']`
  - `principles: ['OTel/StructuredLogs', 'OTel/TraceContext', 'SRE/GoldenSignals', 'OE/CardinalityDiscipline']`
- [ ] `CONTENT-LICENSE.md` updated with a paragraph documenting that
      this skill is predominantly original commentary distilled from
      the modern observability canon (SRE book, OpenTelemetry docs,
      *Observability Engineering*); MIT plugin code license applies
      to original text. No verbatim source reproduction.
- [ ] `README.md` "What's inside" table updated; total skill count
      increases by 1 (post-v0.3 baseline of 11 → 12).
- [ ] `CHANGELOG.md` `### Added` entry written.
- [ ] `npm test` passes.

## Verification

**Automated:**
- `npm test` validates structure and presence.
- Smoke test confirms the bundle still loads.

**Ad-hoc:**
- Manual read-through: every principle has a concrete example, not
  just a category name. Compare line-by-line density to
  `error-and-correctness-traps` and `security-and-trust-boundaries`.
- Spot-check in one harness: ask the agent to "write a Python HTTP
  handler that fetches user data and returns JSON." Verify it adds
  a structured log entry with a request id, propagates a trace
  context if a tracer is in scope, and does **not** log the user's
  auth token. (Cross-validates with the security skill.)
- Spot-check the cardinality rule: ask the agent to "add a metric
  for failed login attempts, broken down by user." Verify it pushes
  back: per-user failure counts belong in logs/traces, not metric
  labels. A metric for "failed login attempts" with no per-user
  cardinality is the right answer.

## Notes

- **Skill name decision.** `observability`, not
  `observability-and-operations`. Council critique flagged that
  "operations" invites runbooks, on-call, post-mortem material that
  is human-shaped and dilutes trigger discipline.
- **Do not** turn this into an OpenTelemetry tutorial. The bar is
  trigger-actionable principles. OTel-specific configuration is a
  library/docs concern, not a skill concern.
- **Sources cited in `principles.md`:**
  - *Site Reliability Engineering*, ed. Beyer, Jones, Petoff, Murphy
    (O'Reilly, 2016) — esp. ch. 6 (golden signals)
  - OpenTelemetry semantic conventions (Apache 2.0 / CC-BY-4.0,
    opentelemetry.io)
  - Charity Majors et al., *Observability Engineering* (O'Reilly,
    2022) — for the cardinality discipline framing
  - 12-factor XI (cross-reference to `build-deploy-and-tooling`)
- **Cardinality is the principle agents most often miss.** They
  reach for Prometheus-style metric labels with user ids in them.
  The Red Flag row "high-cardinality field used as a metric label"
  is the highest-leverage single addition in this skill.
- **Voice:** the SRE book is calm and pedagogical, *Observability
  Engineering* is opinionated. Re-voice both into 97's register. As
  always, no quoted source text.
