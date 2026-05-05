# enrich-error-and-correctness-release-it

## Context

Michael Nygard's *Release It!* (2nd ed., Pragmatic, 2018) is the
canonical source on **production-resilience patterns**. The current
`error-and-correctness-traps` skill is the densest in the bundle and
the template for all others. Nygard's stability patterns —
**timeouts, circuit breakers, bulkheads, backpressure, fail fast** —
are perfectly trigger-shaped: each is a named pattern an agent can
apply at the moment it writes a remote call.

**Value delivered:** closes the gap between "this call can fail" and
"this call will fail at scale" — the production-resilience lens the
skill currently lacks.

## Related Files

- `skills/error-and-correctness-traps/SKILL.md`
- `skills/error-and-correctness-traps/principles.md`
- `scripts/lint-skills.mjs`
- `CHANGELOG.md`
- `CONTENT-LICENSE.md` (if not already)

## Dependencies

- `0a-citation-scheme-spec.md` in `done/` — `RI/Timeout`,
  `RI/CircuitBreaker`, `RI/Bulkhead`, `RI/Backpressure`, `RI/FailFast`
  IDs follow the format in `CITATION-SCHEME.md`.
- `0b-citation-scheme-migration.md` in `done/`.
- `1-reposition-framing.md` in `done/`.

## Acceptance Criteria

- [ ] Add **3–5** principles to `principles.md`:
  - **Always set a timeout** on remote calls. Default timeouts (HTTP
    libraries: often `None` or hours) are wrong defaults. Source:
    Nygard, *Release It!*, ch. 5.
  - **Circuit breaker** — when a downstream is failing, stop calling
    it for a window; fail fast locally and let it recover. Source:
    *Release It!*, ch. 5.
  - **Bulkhead** — isolate resources (thread pools, connection pools,
    queues) per downstream so one failing dependency cannot exhaust
    capacity for healthy ones. Source: *Release It!*, ch. 5.
  - **Backpressure / bounded queues** — never use unbounded queues.
    A bounded queue with explicit reject policy is the only way the
    system tells callers "slow down" instead of OOMing. Source:
    *Release It!*, ch. 5.
  - **Fail fast** — when a request cannot succeed, fail immediately.
    Late failure burns resources and amplifies cascading collapse.
    Source: *Release It!*, ch. 5.
- [ ] At least **2** principles surfaced in `SKILL.md` — likely as
      Red Flags rows ("HTTP call with no timeout", "unbounded queue
      / channel / list grows on retry") or as a numbered checklist
      step in the "calling a remote process" section.
- [ ] The `SKILL.md` "When to invoke" trigger for remote-process calls
      is updated (if needed) to make clear that production-resilience
      patterns fire even on first-write, not only on second-pass
      hardening. The principle is "the prod hardening *is* the first
      write."
- [ ] `principles.md` cites Nygard, *Release It!* 2nd ed., Pragmatic
      Bookshelf, 2018, ch. 5 ("Stability Patterns") for all four.
- [ ] `scripts/lint-skills.mjs`
      `SKILL_RULES.error-and-correctness-traps` `principles` count
      updated.
- [ ] `CHANGELOG.md` `### Changed` entry written.
- [ ] `npm test` passes.

## Verification

**Automated:** `npm test`.

**Ad-hoc:**
- Spot-check: ask the agent to "fetch user data from a third-party
  HTTP API." Verify the result includes an explicit timeout value
  (not the library default) and at minimum acknowledges retries with
  bounded backoff. If multiple downstreams are involved, verify
  bulkhead reasoning surfaces.

## Notes

- **Do not** turn this skill into a distributed-systems textbook.
  Nygard has many other patterns (steady state, governor, handshaking,
  decoupling middleware) — they live in `principles.md` as reference
  at most. The five above are the highest-leverage agent-actionable
  set.
- **Overlap with `build-deploy-and-tooling`:** retries-as-self-DDoS is
  a deploy-pipeline concern too (a buggy retry policy can DDoS your
  own backend during a deploy). Cite the overlap.
- **Overlap with the new `observability-and-operations` skill** (if
  it lands first): a circuit breaker without metrics is invisible.
  Note the dependency: open-circuit events should be observable.
