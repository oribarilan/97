# enrich-build-deploy-twelve-factor-accelerate

## Context

The current `build-deploy-and-tooling` skill (126/362 lines) leans on
*97 Things* essays about CI, automation, and tooling. The cloud-native
canon — **12-factor app** (Adam Wiggins / Heroku, 2011), *Continuous
Delivery* (Humble & Farley, 2010), and **Accelerate / DORA** (Forsgren,
Humble, Kim, 2018) — is the canonical source for build/deploy/tooling
decisions in modern projects. This task adds the trigger-actionable
slice of those sources.

**Value delivered:** brings the skill into alignment with how cloud-
native projects are actually built, with measurable practices (DORA's
four key metrics) backing the agent's choices.

## Related Files

- `skills/build-deploy-and-tooling/SKILL.md`
- `skills/build-deploy-and-tooling/principles.md`
- `scripts/lint-skills.mjs`
- `CHANGELOG.md`
- `CONTENT-LICENSE.md` (if not already)

## Dependencies

- `0a-citation-scheme-spec.md` in `done/` — `12F/III`, `12F/V`,
  `CD/...`, `DORA/...` IDs follow the format in `CITATION-SCHEME.md`.
  Roman numerals on 12-factor IDs are preserved per the spec.
- `0b-citation-scheme-migration.md` in `done/`.
- `1-reposition-framing.md` in `done/`.

## Acceptance Criteria

- [ ] Add **4–6** principles to `principles.md`:
  - **Config in environment, not in code** (12-factor III). Secrets,
    URLs, feature flags read from env vars / a secrets manager; never
    committed.
  - **Strict separation of build, release, run** (12-factor V). The
    build stage produces a versioned artifact; release combines build
    + config; run executes the release. No mutation across stages.
  - **Logs as event streams** (12-factor XI). Write to stdout/stderr;
    let the platform aggregate. Do not write to files or rotate logs
    in-process. (Cross-references `error-and-correctness-traps`
    logging principles — cite the overlap.)
  - **Stateless processes; share-nothing** (12-factor VI/VIII). State
    in backing services (DB, cache, object store); processes are
    disposable and horizontally scalable.
  - **Trunk-based development with short-lived branches**
    (*Continuous Delivery*, *Accelerate*). Long-lived feature branches
    increase merge cost and reduce deploy frequency.
  - **Optimize for the four DORA keys** — deploy frequency, lead time,
    change failure rate, MTTR (*Accelerate*, ch. 2). When a tooling
    or CI choice is on the table, the question is "does this improve
    one of the four without harming the others?"
  - **Build the pipeline like production code** (*Continuous
    Delivery*). Pipeline-as-code, versioned, reviewed, tested. No
    hand-edited Jenkins jobs.
- [ ] At least **3** principles surfaced in `SKILL.md` — either in the
      checklist or as Red Flags rows ("config string in source",
      "long-lived feature branch", "log file written from app code").
- [ ] `principles.md` cites:
  - 12-factor: 12factor.net (Adam Wiggins / Heroku, 2011)
  - *Continuous Delivery*: Jez Humble & David Farley, Addison-Wesley,
    2010
  - *Accelerate*: Forsgren, Humble, Kim, IT Revolution Press, 2018
- [ ] `scripts/lint-skills.mjs` `SKILL_RULES.build-deploy-and-tooling`
      `principles` count updated.
- [ ] `CHANGELOG.md` `### Changed` entry written.
- [ ] `npm test` passes.

## Verification

**Automated:** `npm test`.

**Ad-hoc:**
- Spot-check: ask the agent to "set up a Node service deploy on Fly.io".
  Verify it pulls config from env, writes logs to stdout, and proposes
  a build → release → run pipeline. The DORA-keys lens shows up at
  least once in any non-trivial CI/CD discussion.

## Notes

- **Do not** include all 12 factors. Factors II (dependencies),
  IV (backing services), VII (port binding), IX (disposability),
  X (dev/prod parity), XII (admin processes) are valuable as
  reference but not all are agent-actionable in a single skill.
  Pick III, V, VI, VIII, XI as the highest-leverage set; the rest
  live in `principles.md` as background.
- **DORA metrics are the framing, not a checklist.** The agent should
  not propose measuring DORA on every PR; it should use the four keys
  as a lens when a tooling choice is on the table.
- **Overlap with `error-and-correctness-traps` (logging)** is real.
  Cite the overlap in both skills' `principles.md`. This skill owns
  the *operational shape* of logs (stdout, structured, aggregated);
  the trap skill owns *what to log and what not to* (no secrets, no
  PII, no raw stack traces in prod).
