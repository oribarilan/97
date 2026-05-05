# enrich-build-deploy-twelve-factor

## Context

The current `build-deploy-and-tooling` skill (126/362 lines) leans on
*97 Things* essays about CI, automation, and tooling. The cloud-native
canon — **12-factor app** (Adam Wiggins / Heroku, 2011) and
*Continuous Delivery* (Humble & Farley, 2010) — provides the
trigger-actionable patterns missing from the current set. This task
adds the actionable slice.

**Sources we explicitly limit.** *Accelerate* / DORA's four key metrics
are organizational measurement, not code-time behavior. The earlier
plan included "DORA 4 keys as a lens, not a checklist" — by the
trigger-actionable bar's own definition, that fails (a "lens" is
philosophy, not a 60-second action). Same for "trunk-based
development" — that is org policy, not something the agent fires
when writing code. Both are dropped from this task. *Continuous
Delivery* contributes the pipeline-as-code framing only.

**Value delivered:** brings the agent into alignment with how
cloud-native projects are actually built, with concrete rules at the
moment a deploy/CI/config decision is on the table.

## Related Files

- `skills/build-deploy-and-tooling/SKILL.md`
- `skills/build-deploy-and-tooling/principles.md`
- `scripts/lint-skills.mjs`
- `CHANGELOG.md`
- `CONTENT-LICENSE.md` (if not already)

## Dependencies

- `0a-citation-scheme-spec.md` in `done/` — `12F/III`, `12F/V`,
  `12F/VI`, `12F/VIII`, `12F/XI`, `CD/PipelineAsCode` IDs follow the
  format in `CITATION-SCHEME.md`. Roman numerals on 12-factor IDs are
  preserved per the spec.
- `0b-citation-scheme-migration.md` in `done/`.
- `add-stakes-calibration.md` in `done/` — `build-deploy-and-tooling/SKILL.md`
  already carries calibration framing in its Overview + Non-triggers
  before this task starts. New principles authored against the
  calibrated skill; no Overview or Non-triggers calibration edits in
  this task.

## Acceptance Criteria

- [ ] Add **5** principles to `principles.md`:
  - **`12F/III`** — config in environment, not in code. Secrets, URLs,
    feature flags read from env vars or a secrets manager; never
    committed to source.
  - **`12F/V`** — strict separation of build, release, run. The build
    stage produces a versioned artifact; release combines build +
    config; run executes the release. No mutation across stages.
  - **`12F/VI` + `12F/VIII`** (combined into one principle entry —
    they pair) — stateless, share-nothing processes. State in backing
    services (DB, cache, object store); processes are disposable and
    horizontally scalable.
  - **`12F/XI`** — logs as event streams. Write to stdout/stderr; let
    the platform aggregate. Do not write to log files or rotate logs
    in-process. Cross-references `error-and-correctness-traps`
    logging principles and the new `observability` skill (which owns
    log *content*; this skill owns log *transport*).
  - **`CD/PipelineAsCode`** — build the pipeline like production code.
    Pipeline-as-code, versioned, reviewed, tested. No hand-edited
    Jenkins jobs. Source: *Continuous Delivery*, Humble & Farley, ch.
    5 ("Anatomy of the Deployment Pipeline").
- [ ] At least **3** principles surfaced in `SKILL.md` — either in the
      checklist or as Red Flags rows ("config string in source",
      "process writes to a local log file", "pipeline configuration
      committed but not under code review").
- [ ] **DORA / Accelerate is not added in this task.** No
      `DORA/*` IDs are imported. If a cross-cutting trade-off mentions
      deploy frequency or lead time, the language is descriptive
      ("smaller, more frequent deploys reduce blast radius"), not
      cited as a measurement framework.
- [ ] **"Trunk-based development" is not added in this task.** It is
      org policy, not write-time. If branch hygiene matters in a
      Red Flag, it is phrased concretely ("long-lived feature branch
      with merge conflicts in shared files") rather than as a
      methodology name.
- [ ] `principles.md` cites:
  - 12-factor: 12factor.net (Adam Wiggins / Heroku, 2011)
  - *Continuous Delivery*: Jez Humble & David Farley, Addison-Wesley,
    2010
- [ ] `scripts/lint-skills.mjs` `SKILL_RULES.build-deploy-and-tooling`
      `principles` field updated to include the 5 new IDs.
- [ ] `CHANGELOG.md` `### Changed` entry written.
- [ ] `npm test` passes.

## Verification

**Automated:** `npm test`.

**Ad-hoc:**
- Spot-check: ask the agent to "set up a Node service deploy on
  Fly.io". Verify it pulls config from env, writes logs to stdout,
  and proposes a build → release → run pipeline.

## Notes

- **Why DORA was cut.** The earlier plan included "DORA 4 keys as a
  lens, not a checklist." By the trigger-actionable bar (would this
  rule change what the agent writes in the next 60 seconds?), a
  "lens" is philosophy, not action. Reviewers in council unanimously
  flagged this as a leak; cutting is the disciplined response.
- **Why trunk-based dev was cut.** Same reasoning: branch strategy
  is set at the team/org level, not by the agent at the function it
  is currently writing. The agent does not pick a branching model
  per response.
- **Do not** include all 12 factors. Factors II (dependencies),
  IV (backing services), VII (port binding), IX (disposability),
  X (dev/prod parity), XII (admin processes) are valuable as
  reference but not all are agent-actionable in a single skill.
  Pick III, V, VI/VIII, XI as the highest-leverage set.
- **Overlap with `error-and-correctness-traps` (logging)** is real.
  Cite the overlap in both skills' `principles.md`. This skill owns
  the *operational shape* of logs (stdout, structured, aggregated);
  the trap skill owns *what to log and what not to* (no secrets, no
  PII, no raw stack traces in prod). The new `observability` skill
  owns the log *content shape* (key-value, request id, level).
