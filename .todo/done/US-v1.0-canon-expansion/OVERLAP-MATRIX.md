# OVERLAP-MATRIX.md — v1.0 audit artifact

**Internal reference**, not user-facing. Snapshot of the bundle's
coverage map at v1.0 release time. Lives with the story
(`.todo/done/US-v1.0-canon-expansion/`), not at repo root.

This is the **closing verification audit** for `US-v1.0-canon-expansion`.
The Canonical-home table in `CITATION-SCHEME.md` settled cross-cutting
ownership before any enrichment ran; this document confirms the
discipline held.

## Audit results

- **Heading-uniqueness:** every principle ID has a `## <id> — Title`
  heading in exactly one `principles.md` file. Verified by:
  ```
  grep -h -E "^##\s+[A-Za-z0-9]+/[A-Za-z0-9]+\s+—" skills/*/principles.md \
    | sort | uniq -c | awk '$1 > 1'
  ```
  Output: empty. **Pass.**
- **`SKILL_RULES.principles` uniqueness:** every principle ID
  appears in exactly one skill's `SKILL_RULES.principles` array.
  Total registered IDs: 100. No duplicates. **Pass.**
- **Cross-references in `principles.md`:** non-canonical homes use
  `## (cross-reference) <id>` form
  (`security-and-trust-boundaries/principles.md` for `97/26` and
  `97/29`). Verified by inspection. **Pass.**
- **Canonical-home table coverage:** every cross-cutting principle
  surfaced during enrichment has a row in
  `CITATION-SCHEME.md`'s Canonical-home table. New cross-cutting
  principles surfaced mid-enrichment: none beyond what the table
  already anticipated. **Pass.**
- **Cross-references in `SKILL.md`:** Red Flags rows and checklist
  items that mention a principle owned by another skill use the
  bare ID in backticks (per `CITATION-SCHEME.md`'s cross-reference
  convention). Spot-checked across all enriched skills.
  **Pass.**

The audit is a **nominal pass**: no remediation required. The
up-front discipline in `0a-citation-scheme-spec.md`'s Canonical-home
table and `0b`'s ID-uniqueness migration held through six enrichment
tasks plus the new `observability` skill.

## Coverage matrix

One row per principle ID. `Canonical home` is the skill that owns
the `## <id>` heading and the entry in `SKILL_RULES.principles`.
`Cross-references` lists skills that surface the principle in
`SKILL.md` Red Flags or checklists without owning it.

### `before-you-refactor` (9 owned)

| Principle ID | Cross-references | Summary |
|---|---|---|
| `97/6` | — | Take stock of existing code before refactoring |
| `97/8` | — | Boy Scout rule — bounded improvement |
| `97/24` | — | Don't fear breaking things temporarily |
| `97/31` | — | Don't refactor where you can't safely revert |
| `97/74` | — | Coupling makes refactor estimates lie |
| `Fowler/LongMethod` | `writing-clean-code` (overlap on long-function pressure) | Long Method → Extract Function |
| `Fowler/FeatureEnvy` | — | Feature Envy → Move Method |
| `Fowler/ShotgunSurgery` | — | Shotgun Surgery → Move Field / Inline Class |
| `Fowler/DataClumps` | `domain-modeling` (PrimitiveObsession parent concept) | Data Clumps → Extract Class / Introduce Parameter Object |

### `writing-clean-code` (8 owned)

| Principle ID | Cross-references | Summary |
|---|---|---|
| `97/13`, `97/15`, `97/17`, `97/30`, `97/75`, `97/76`, `97/91`, `97/94` | — | DRY, single purpose, naming, etc. |

### `testing-discipline` (13 owned)

| Principle ID | Cross-references | Summary |
|---|---|---|
| `97/25`, `97/60`, `97/80`, `97/81`, `97/82`, `97/83`, `97/92`, `97/95` | — | Test-quality essays from the book |
| `GOOS/ListenToTestPain` | `superpowers/test-driven-development` (process boundary) | Test pain is design pressure; reshape production code |
| `xUnit/ObscureTest` | — | One behavior per test |
| `xUnit/FragileTest` | — | Assert on observable contract, not internals |
| `xUnit/MysteryGuest` | — | No fixtures invisible to the test reader |
| `xUnit/ConditionalTestLogic` | — | No branching that changes what the test asserts |

### `api-and-interface-design` (13 owned)

| Principle ID | Cross-references | Summary |
|---|---|---|
| `97/7`, `97/19`, `97/32`, `97/35`, `97/55`, `97/59`, `97/65`, `97/66`, `97/84` | — | Headline + tactics from the book |
| `Ousterhout/DeepModules` | — | Small interface, large implementation |
| `Ousterhout/DefineErrorsOutOfExistence` | `error-and-correctness-traps` (overlap on error contracts) | Idempotent / clamping / Option-returning APIs |
| `Liskov/LSP` | — | Subtype substitutability |
| `King/ParseDontValidate` | `domain-modeling`, `security-and-trust-boundaries` | Parse untrusted input at boundary into domain type |

### `pre-commit-self-review` (9 owned)

| Principle ID | Cross-references | Summary |
|---|---|---|
| `97/1`, `97/9`, `97/14`, `97/16`, `97/42`, `97/47`, `97/58`, `97/69`, `97/90` | — | Pre-commit checklist essays |

### `error-and-correctness-traps` (14 owned)

| Principle ID | Cross-references | Summary |
|---|---|---|
| `97/21`, `97/33`, `97/41`, `97/46`, `97/57`, `97/73`, `97/89` | — | Per-domain trap essays |
| `97/26` | `security-and-trust-boundaries` (don't ignore the trust boundary) | Don't ignore that error |
| `97/29` | `security-and-trust-boundaries` (don't rely on undocumented security magic) | Don't rely on magic |
| `RI/Timeout` | `observability` (timeouts feed latency signal) | Always set a timeout |
| `RI/CircuitBreaker` | `observability` (open-circuit events should be observable) | Circuit breaker |
| `RI/Bulkhead` | — | Resource-pool isolation per downstream |
| `RI/Backpressure` | `build-deploy-and-tooling` (queue design) | Bounded queues, explicit reject policy |
| `RI/FailFast` | — | Fail fast when request cannot succeed |

### `build-deploy-and-tooling` (16 owned)

| Principle ID | Cross-references | Summary |
|---|---|---|
| `97/4`, `97/10`, `97/20`, `97/38`, `97/40`, `97/61`, `97/63`, `97/68`, `97/78`, `97/79`, `97/88` | — | Tooling/build/deploy essays |
| `12F/III` | `security-and-trust-boundaries` (secret handling) | Config in environment |
| `12F/V` | — | Strict build/release/run separation |
| `12F/VI` | — | Stateless, share-nothing, disposable processes (paired with factor VIII) |
| `12F/XI` | `error-and-correctness-traps` (log content limits), `observability` (log content shape) | Logs as event streams (canonical home for *transport*) |
| `CD/PipelineAsCode` | — | Pipeline ships through code review |

### `domain-modeling` (9 owned)

| Principle ID | Cross-references | Summary |
|---|---|---|
| `97/2`, `97/11`, `97/12`, `97/23`, `97/48` | — | Domain-modeling essays |
| `Wlaschin/InvalidStatesUnrepresentable` | `api-and-interface-design` (boundary counterpart) | Encode constraints into types |
| `Wlaschin/SmartConstructors` | `api-and-interface-design` | Construct domain types only via parser/factory |
| `Wlaschin/TypesForEffects` | — | Result/Option/branded types |
| `Fowler/PrimitiveObsession` | `before-you-refactor`, `api-and-interface-design`, `writing-clean-code` | Replace Primitive with Object |

### `working-with-users-and-team` (5 owned)

| Principle ID | Cross-references | Summary |
|---|---|---|
| `97/3`, `97/36`, `97/50`, `97/77`, `97/97` | — | Requirements / estimation / stakeholder essays |

### `security-and-trust-boundaries` (0 owned)

The skill carries no canonical `<source>/<principle>` IDs. `97/26`
and `97/29` are surfaced via `## (cross-reference)` headings in
`principles.md` and Red Flags rows in `SKILL.md`; canonical homes
are in `error-and-correctness-traps`. The skill is predominantly
original commentary on injection, untrusted-input boundaries,
secrets, crypto misuse, and authn/authz — see `CONTENT-LICENSE.md`.

### `observability` (4 owned, new in v1.0)

| Principle ID | Cross-references | Summary |
|---|---|---|
| `OTel/StructuredLogs` | `build-deploy-and-tooling` (transport via 12F/XI), `error-and-correctness-traps` (content limits) | Structured key/value logs |
| `OTel/TraceContext` | — | W3C Trace Context across cross-process calls |
| `SRE/GoldenSignals` | — | Latency, traffic, errors, saturation |
| `OE/CardinalityDiscipline` | — | High-cardinality data in logs/traces, not metric labels |

## Hyrum's Law — registered, no principle row

`Hyrum/Law` is registered in `CITATION-SCHEME.md`'s Sources table so
cross-references resolve, but has no `## Hyrum/Law — …` heading in
any `principles.md`. It surfaces as one Red Flag row in
`api-and-interface-design/SKILL.md` reminding the agent that any
observable behavior of an API will be depended on. This is the
intended pattern.

## Total principle inventory at v1.0

- 9 `97/*` skills × variable per-skill counts = 67 `97/*` IDs
  (preserves the v0.3 inventory)
- 4 Fowler smells (LongMethod, FeatureEnvy, ShotgunSurgery,
  DataClumps in `before-you-refactor`; PrimitiveObsession in
  `domain-modeling`) — total 5
- 3 Wlaschin principles + 1 Fowler in `domain-modeling` = 4
  beyond-97 in that skill
- 5 12-factor / CD principles in `build-deploy-and-tooling`
- 5 Release It! patterns in `error-and-correctness-traps`
- 4 Ousterhout / Liskov / King principles in
  `api-and-interface-design`
- 5 GOOS / xUnit principles in `testing-discipline`
- 4 OTel / SRE / OE principles in `observability` (net-add)

Total registered IDs: **100** (verified by node count over
`SKILL_RULES.principles` arrays).
