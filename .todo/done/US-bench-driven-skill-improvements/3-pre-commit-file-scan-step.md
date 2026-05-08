# 3-pre-commit-file-scan-step

## Context

`pre-commit-self-review/SKILL.md` is structured around the
metaphor "re-read the diff as a stranger." Step 1 of its
checklist (line 52) anchors on the *diff*. The other steps
(suspect your own code, know your next commit, check for
deliberate technical debt, clean the build, audit the logs,
re-read the comments, step away if stuck, frame the hand-off
as a review) are sound and stay untouched.

The bench surfaced a structural blind spot: when the agent
adds a small change (e.g., adds a `timeout=` parameter) to a
file that contains a latent trap *outside the diff scope*
(hardcoded credential 3 lines above the modified function,
TOCTOU pattern in the unmodified function body, mutable
default in the unmodified signature), the diff-anchored
review never reaches the trap.

Bench measurement: `pre-commit-self-review` invoked 27/30 in
the vE variant of `discipline-traps-prompt-ablation-v051`,
pass rate 0/30 across the three latent-trap tasks. The skill
fired correctly; the checklist's anchor missed.

Council Round 1 proposed adding a "scan the file" step.
Council Round 2 sharpened this with three non-negotiable
refinements:

- **Replace step 1, do not append.** Appending as step 10
  inherits the position-of-attention problem (the same
  problem that buried principle #9 in
  `security-and-trust-boundaries`). Replacing inherits the
  attention budget already allocated to the existing first
  step.
- **Concrete code-shape signatures, not abstract category
  names.** "Re-read the file looking for issues" gets
  skimmed past. "Scan ±20 lines around each hunk for: literal
  credential strings (`API_KEY = "..."`), raw SQL string-
  build (`f"SELECT ... {var}"`), broad `except` swallowing
  exceptions, mutable default in signature
  (`def f(x=[])`)" gives the agent a search task with
  definite targets.
- **Named output artifact.** A step without an output is
  pure introspection and gets skipped. Requiring the agent
  to add a named `Adjacent issues` section to the hand-off
  summary forces the file scan to produce something
  observable.

This skill is the **safety net for firing-failure cases**
across the whole 97 plugin. When the right domain skill
(`security-and-trust-boundaries`,
`error-and-correctness-traps`) doesn't load because the
user's prompt didn't trigger it, `pre-commit-self-review`
fires at hand-off on essentially every task and is the last
line of defense. That's why the file-scan replacement is
load-bearing even after task 1's voice-agnostic reframe of
security principles.

**Value delivered:** when the agent reaches the end of a
task and runs self-review, latent traps in the file (that
the trigger map missed at task start AND that the domain
skill never loaded to bite on) get a structured, observable
catch. Symmetric to task 3's bootstrap one-clause amendment;
both together form the file-aware bookends around the
diff-anchored review.

## Related Files

- `skills/pre-commit-self-review/SKILL.md` — replace step 1
  at line 52 (the existing 9-step list stays; numbering is
  unchanged because step 1 is replaced, not appended). Add
  one Red Flags row. Add one "What done looks like"
  checkbox.
- `skills/pre-commit-self-review/principles.md` — minor
  edit if the new step needs framing in the long-form
  section. The `97/58` cite (Rising) generalizes from
  "diff as stranger" to "file as stranger" — it stays.

## Dependencies

- Runs **after** task 1 (which promotes the canonical
  landmine category list). The category list named in this
  task's step 1 must match the categories named in task 1's
  reframed principles and task 3's bootstrap clause.
- Runs **before** task 3, so task 3's bootstrap clause
  references this task's step 1 and the canonical category
  list is established before the bootstrap delegates to it.

## Acceptance Criteria

### Step 1 replacement

- [x] Step 1 of the self-review checklist (currently line
  52, "Re-read the diff as a stranger") is **replaced**
  with a file-scan version. The 9-step numbering is
  preserved (step 1 → step 1, just different content).
  Other steps unchanged.
- [x] The new step 1 names the canonical landmine category
  list with **concrete code-shape signatures**, not
  abstract category names. Required signatures:
  - **Hardcoded credentials**: literal credential-shaped
    strings at module scope or in constants
    (`API_KEY = "..."`, `PASSWORD = "..."`, JWT secrets,
    connection strings with passwords).
  - **Raw SQL string-build**: f-string or `+`
    concatenation building SQL/LDAP/shell strings
    (`f"SELECT ... {var}"`, `"DELETE FROM " + table`).
  - **Swallowed exceptions**: broad `except` /
    `catch (Exception)` with `pass` or empty body, or
    catching an exception type wider than the one the
    code can recover from.
  - **TOCTOU patterns**: check-then-use against the same
    path or resource (`if os.path.exists(p): open(p)`),
    where the check and use are not atomic.
  - **Mutable default in signature**: `def f(x=[])`,
    `def f(x={})`, or any mutable default value.
- [x] The new step 1 specifies a **spatial scope**: scan
  ±20 lines around each hunk (or equivalent — implementer
  may pick ±15 or ±25 with justification). The scope is
  *bounded*, not "the whole file." Agents follow numeric
  scopes more reliably than aesthetic ones.
- [x] The new step 1 requires a **named output artifact**:
  if the scan finds adjacent landmines, the agent adds an
  `Adjacent issues` section to the hand-off summary. The
  section names what was found, where (file + line), and
  what action was taken (fixed in scope / surfaced for
  human to scope / blocked).
- [x] The "diff as a stranger" framing from `97/58`
  (Rising) is preserved in the explanation of the new step,
  not in its anchor. Likely shape: *"Re-read the touched
  files as a stranger, then read the diff as a stranger.
  Scan ±20 lines around each hunk for [signatures]…"* The
  Rising insight generalizes from diff to file; the cite
  stays.
- [x] The instruction is to **surface in the hand-off, do
  not silently fix.** This matches the same carve-out in
  task 1's reframed security principles. The agent's
  obligation when finding a pre-existing trap in adjacent
  code is observability, not unilateral repair. Without
  this clause, agents will helpfully refactor adjacent
  code and inflate diff scope beyond what the user asked
  for — a new failure mode the bench doesn't currently
  measure but users will hate.
- [x] Test fixtures, example/seed code, and obviously fake
  values get an explicit carve-out: a file under `tests/`,
  `fixtures/`, `examples/` containing `password = "test"`
  or `API_KEY = "fake-key-for-testing"` should not trigger
  the scan's report. Likely shape: *"Obvious test
  fixtures and example/seed code with placeholder values
  do not need to be flagged."*

### Red Flags row

- [x] One new Red Flags row added (after the existing rows
  at line 68). Suggested shape:
  - "Thought" column: *"The diff is small and I read it
    carefully — I'm done."*
  - "Reality" column: *"Diffs hide latent traps in the
    surrounding file. Scan ±20 lines around each hunk for
    [canonical four landmine categories]. Surface findings
    in the hand-off. (97/58)"*

### "What done" checkbox

- [x] One new checkbox added to the "What done looks like"
  list (currently lines 80–87). Suggested shape: *"Latent
  issues in code adjacent to your changes (within ±20
  lines of each hunk) are surfaced in an `Adjacent
  issues` hand-off section, even if out of scope to fix.
  No silent rewrites of code the user did not ask about."*
- [x] The existing checkboxes are unchanged (their
  references to the existing checklist steps still work
  because step 1 was replaced, not renumbered).

### Cross-skill consistency

- [x] The four landmine categories named in step 1
  (hardcoded credentials, raw SQL string-build, swallowed
  exceptions, TOCTOU patterns, mutable default in
  signature) **match** the canonical list promoted by
  task 1 in `security-and-trust-boundaries`. If task 1's
  canonical list has fewer or differently-named
  categories, this task adopts that list. The list is
  defined in **one place** (task 1's skill) and referenced
  here. If during implementation the lists disagree, fix
  task 1's list first, not this one.
- [~] Bidirectional cross-reference: this step names
  `security-and-trust-boundaries` (for credentials, SQL
  injection) and `error-and-correctness-traps` (for
  swallowed exceptions, TOCTOU, mutable defaults) for the
  long-form treatment of each category.

### Voice and structural guards

- [x] Voice rules from `humanizer` hold. Concrete grep
  across the diff for `stands as`, `serves as`, `embraces`,
  `embodies`, `pivotal`, `landscape`, `testament`,
  trailing -ing clauses, `first-class`, `comprehensive`,
  rule-of-three padding returns no matches. Imperative,
  terse, code-shaped — match the existing skill's voice.
- [~] The new step 1 is roughly the same size as the old
  step 1 (the existing step is 4 lines including the
  cite). Concrete signatures + spatial scope + output
  artifact will likely run 6–10 lines. If it runs longer
  than 12 lines, trim — the step is a checklist item, not
  a section.
- [x] No other checklist step reordered or rewritten. The
  existing 9-step structure (with step 1 replaced) holds.
- [x] `pre-commit-self-review/SKILL.md` line count under
  cap. The current file is 105 lines; the rewrite adds
  ~5–10 lines net (one new Red Flags row, one new
  checkbox, slightly longer step 1). Well within
  reasonable cap.
- [x] `npm test` passes.

## Verification

**Automated:** `npm test`.

**Ad-hoc:**

- Read the new step 1 aloud. Apply the test *"would this
  step have caught the bench's hardcoded-credential
  failure mode if the agent had reached it?"* Answerable
  yes/no by a human reader. If yes, the replacement bites.
- Run a thought-experiment: an agent finishes a task that
  added a `timeout=` parameter to a function in `db.py`.
  The file contains `PASSWORD = "hunter2"` 5 lines above
  the function. Apply the new step 1 — does the
  `Adjacent issues` section get populated? If yes, the
  artifact requirement is doing its work.
- Run the inverse test: an agent finishes a task that
  edited `tests/fixtures/auth_test.py`. The file contains
  `password = "test123"` (obvious test fixture). Apply
  the new step 1 — does the carve-out for test fixtures
  prevent a false positive? If no, the carve-out wording
  is too soft.

**Bench-side validation (in `97-bench`, separate work):**
re-run the vE variant against the bumped plugin version.
With the new file-scan step 1, vE pass rates should lift
toward the vD pass rates. Expected lift on
latent-correctness tasks (mutable-default-arg,
toctou-file-check) for haiku-4.5: 5–8/10. <3/10 means the
step isn't biting; suspect the spatial scope or output
artifact wording. See `main.md` "Bench prediction" table.

## Notes

- This skill is correctly invoked (27/30 in the bench).
  The bench finding is purely about content scope:
  diff-only review is the wrong scope for catching
  latent-trap failure modes. Other failure modes
  (commit-message vagueness, untracked debt, log noise)
  are correctly caught by the existing checklist; those
  steps stay untouched.
- The "surface, don't silently fix" carve-out is the same
  one applied in task 1's reframed security principles.
  This is intentional. Cross-skill consistency on the
  agent's obligations when finding pre-existing traps is
  important: the rule is *observability over unilateral
  repair*. Both skills must say it.
- The choice to **replace** step 1 (not append) was
  Council Round 2's strongest unanimous endorsement.
  Don't soften this in implementation — appending as
  step 10 reproduces the same skim-past failure that
  buried principle #9 in `security-and-trust-boundaries`.
- Council Round 2 also flagged a risk specific to this
  step: agents might claim to have scanned the file
  without actually doing so (LLMs are lazy about context
  retrieval). The named output artifact (`Adjacent
  issues` section) is the verification mechanism — if
  the agent claims "no adjacent issues found" on a file
  that demonstrably contains a hardcoded credential, the
  bench can detect the lie. Without the artifact, the
  step is unverifiable.
- The new-skill question (a small `scan-before-edit`
  skill or widening `before-you-refactor`'s trigger) is
  deferred with explicit conditions in `main.md`
  "New-skill decision" section. This task is the
  end-of-task safety net; the deferred decision is about
  whether to add a *start-of-task* equivalent. Don't
  conflate.

## Outcome

Shipped in PR #1 (merged 2026-05-08, commit `94dd5ae`).
Implementation criteria mostly met; two minor deviations recorded.

**What landed in `skills/pre-commit-self-review/SKILL.md`:**
- Step 1 replaced with a re-read + ±20-line scan around every
  diff hunk for SIX landmine shapes (one more than the spec's
  five — added unsafe deserialization to match the canonical list).
- Named output artifact: `Adjacent issues:` line in the hand-off,
  with explicit "none found" requirement so an agent that
  skipped the scan has nothing to write.
- Test-fixture carve-out names files under `tests/`,
  `*.spec.*`, `fixtures/`, and filenames containing
  `mock`/`fake`/`stub`.
- 97/58 (Rising) cite preserved at the end of step 1.
- One new Red Flags row targeting the "I'll skip the scan" thought.
- Two new "What done" checkboxes (the scan was performed; the
  `Adjacent issues:` line is in the hand-off).

**Deviations from spec:**
1. Step 1 size: spec ceiling was 12 lines, landed at ~14 (the
   six-category bullet list is denser than the original 5-category
   sketch). Trimming further would have cost concreteness on the
   code-shape signatures, which are load-bearing.
2. Cross-references to `security-and-trust-boundaries` and
   `error-and-correctness-traps` are IMPLICIT (via trap-shape
   names that map unambiguously to those skills), not explicit
   "see X for long-form treatment" sentences. Acceptable because
   the names themselves are the cross-reference; explicit
   pointers would have added 3–4 more lines without raising
   recall.

**Verification:** `npm test` green. File at 118/250 lines, well
under cap. Bench-side validation deferred — this is the
safety-net skill for vE variant scoring; predicted lift on
latent-correctness tasks (mutable-default, TOCTOU) is 5–8/10
from current 0/30, per main.md.
