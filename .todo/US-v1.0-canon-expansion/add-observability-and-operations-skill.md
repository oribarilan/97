# add-observability-and-operations-skill

## Context

The current bundle has **no skill for observability/operations**. The
2010s+ canon (Google's *Site Reliability Engineering*, Honeycomb-era
distributed tracing, structured-logging best practices, the OpenTelemetry
project) has produced a body of agent-actionable practice that is
currently squeezed into `error-and-correctness-traps` (logging only)
and the operational shape implied by 12-factor logs (in
`build-deploy-and-tooling`).

This task adds **one new themed skill: `observability-and-operations`**,
structured in the `error-and-correctness-traps` template. Like
`security-and-trust-boundaries` from v0.3, this is a **net-add skill**
in the new-canon spirit: the principles come from the modern operational
canon, not from *97 Things*.

**Value delivered:** closes the largest behavioral gap in v1.0 after
v0.3 closed security. Agents currently produce code that is operable
in dev and inert in prod (no tracing, no metrics, unstructured logs).

## Related Files (to create or edit)

- `skills/observability-and-operations/SKILL.md` — new
- `skills/observability-and-operations/principles.md` — new
- `skills/using-97/SKILL.md` — add trigger row
- `scripts/lint-skills.mjs` — `SKILL_RULES` entry
- `README.md` — "What's inside" table row; total skill count
- `CONTENT-LICENSE.md` — paragraph for this skill (predominantly
  original commentary, no *97 Things* CC-BY-3.0 derivations)
- `CHANGELOG.md` — `### Added` entry

## Dependencies

- `0a-citation-scheme-spec.md` in `done/` — `SRE/GoldenSignals`,
  `SRE/SLOs`, `OE/CardinalityDiscipline`, `OTel/TraceContext`,
  `OTel/StructuredLogs` IDs follow the format in `CITATION-SCHEME.md`.
  Source-key registry already includes `SRE`, `OE`, `OTel` per the
  spec's Sources table.
- `0b-citation-scheme-migration.md` in `done/`.
- `1-reposition-framing.md` in `done/`.
- v0.3 `prune-bootstrap-urgency` and `add-security-traps-skill`
  in `done/` — so the bootstrap and trigger map are at their v0.3
  baseline before adding another row.

## Acceptance Criteria

- [ ] New skill directory exists with `SKILL.md` and `principles.md`.
- [ ] `SKILL.md` follows the **`error-and-correctness-traps` template
      exactly:** Overview → When to invoke → Non-triggers → Precedence →
      numbered checklist or trap-domains → Red Flags table → What "done"
      looks like → Principles in this skill table.
- [ ] At minimum the following domains are covered, each with at least
      one concrete example:
  - [ ] **Structured logs** — JSON / key-value, not free-form strings.
        Include request id, timestamp, level, event name, key fields.
        Source: SRE book; OpenTelemetry semantic conventions.
  - [ ] **Tracing across boundaries** — every cross-process call
        propagates a trace context (W3C Trace Context). Spans cover
        meaningful units of work, not every function.
  - [ ] **Metrics: the four golden signals** — latency, traffic,
        errors, saturation. Source: SRE book, ch. 6.
  - [ ] **Cardinality discipline** — high-cardinality fields (user
        id, request id) belong in traces and logs; not in metric
        labels. Unbounded label cardinality is a metrics-system
        outage in slow motion.
  - [ ] **SLOs over alerts on every error** — alert on user-visible
        SLO burn, not on every internal error count. Source: SRE
        book, ch. 4 ("Service Level Objectives").
  - [ ] **Observability as a first-class concern at code time** —
        the agent adds tracing/structured-log calls when writing the
        function, not after. Aligned with `error-and-correctness-
        traps` "fail fast" framing.
- [ ] Trigger phrasing in `using-97/SKILL.md` is concrete and decidable.
      Example: "Adding a request handler, RPC, or job that runs in
      production; adding metrics, traces, logs, alerts, or SLOs;
      or designing for production diagnosability."
- [ ] Non-triggers list excludes obvious cases (a script that runs
      once locally; a one-off migration).
- [ ] Precedence section: notes overlap with `error-and-correctness-
      traps` (logging — structured logs are jointly owned; this skill
      owns the *operational shape*, the trap skill owns *what to and
      what not to log*) and `build-deploy-and-tooling` (12-factor logs
      as event streams — that skill owns the *transport*, this one
      owns the *content*).
- [ ] Voice passes the humanizer rules (no AI tells, imperative,
      concrete).
- [ ] `scripts/lint-skills.mjs` `SKILL_RULES` entry added with:
  - `maxLines:` per the policy that landed in v0.3 (default 250
    or whatever the new ceiling is)
  - `sections: ['Overview', 'When to invoke', 'Red Flags']`
  - `principles:` empty array or numeric ids if any *97 Things*
    derivations are cited (probably none — this is original
    commentary against the modern operational canon)
- [ ] `CONTENT-LICENSE.md` updated with a paragraph documenting that
      this skill is predominantly original commentary distilled from
      the modern operational canon (SRE book, OpenTelemetry docs,
      12-factor logs); MIT plugin code license applies to original
      text. No verbatim source reproduction.
- [ ] `README.md` "What's inside" table updated; total skill count
      increases by 1 (10 → 11 if this is on top of v0.2; 11 → 12 if on
      top of v0.3 which adds `security-and-trust-boundaries`).
- [ ] `CHANGELOG.md` `### Added` entry written.
- [ ] `npm test` passes.

## Verification

**Automated:**
- `npm test` validates structure and presence.
- Smoke test confirms the bundle still loads.

**Ad-hoc:**
- Manual read-through: every domain has a concrete example, not just
  a category name. Compare line-by-line density to
  `error-and-correctness-traps` and `security-and-trust-boundaries`.
- Spot-check in one harness: ask the agent to "write a Python HTTP
  handler that fetches user data and returns JSON." Verify it adds
  a structured log entry with a request id, propagates a trace context
  if a tracer is in scope, and does **not** log the user's auth
  token. (Cross-validates with the security skill.)

## Notes

- **Name:** `observability-and-operations`. Decided at story level to
  remove naming-bikeshed risk during implementation. The name covers
  both diagnosability (observability) and operability (ops practices
  like SLOs, runbooks, on-call hygiene).
- **Do not** turn this into an OpenTelemetry tutorial. The bar is
  trigger-actionable principles. OTel-specific configuration is a
  library/docs concern, not a skill concern.
- **Sources cited in `principles.md`:**
  - *Site Reliability Engineering*, ed. Beyer, Jones, Petoff, Murphy
    (O'Reilly, 2016) — esp. ch. 4 (SLOs) and ch. 6 (golden signals)
  - OpenTelemetry semantic conventions (Apache 2.0 / CC-BY-4.0,
    opentelemetry.io)
  - Charity Majors et al., *Observability Engineering* (O'Reilly,
    2022) — for the cardinality discipline framing
  - 12-factor XI (cross-reference to `build-deploy-and-tooling`)
- **Cardinality** is the principle agents most often miss: they reach
  for Prometheus-style metric labels with user ids in them. The
  Red Flags row "high-cardinality field used as a metric label" is
  the highest-leverage single addition.
- **Voice:** the SRE book is calm and pedagogical, *Observability
  Engineering* is opinionated. Re-voice both into 97's register. As
  always, no quoted source text.
