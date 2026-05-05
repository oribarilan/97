# testing-discipline — principles

Long-form per-principle distillations. The summary in `SKILL.md` is what the
agent loads on trigger; this file is the on-demand reference for when a
deeper cut is needed on a specific principle.

All eight principles come from *97 Things Every Programmer Should Know*
(O'Reilly, ed. Kevlin Henney, 2010). Originals are CC-BY-3.0 at the canonical
mirror: https://github.com/97-things/97-things-every-programmer-should-know.

Distillations below are original commentary in our own words. No verbatim
quotes longer than ~25 words. If a contributor objects to a particular
distillation, file an issue and the file will be revised or removed.

---

## 97/25 — Don't Be Cute with Your Test Data

**Author:** Rod Begbie
**Source:** https://github.com/97-things/97-things-every-programmer-should-know/blob/master/en/thing_25/README.md
**License:** CC-BY-3.0

**Distillation.** Test data is not private. It surfaces in screenshots taken
for an executive deck, in logs forwarded to support, in error dialogs that
escape into production, and — when a source tree is leaked or open-sourced —
in `grep` output read by strangers. Begbie's confessional examples cover the
range: punk-band names seeded into a user table that a product manager
screenshotted the next morning; a placeholder "don't click that again"
dialog wired into a real button; a Batman-themed log line surfaced verbatim
to a customer; a joke entry on a live store. The asymmetry is unforgiving —
the joke takes a second to write and lives forever. The rule generalizes:
any text you write into code (test data, comments, log messages, dialog
strings, sample database rows) should be evaluated as if it will appear in
front of the most conservative customer you have. Use boring, obviously-fake,
professional data. Save your sense of humor for human conversation.

**Agent application.** Source for checklist step 5 ("choose test data that
is safe in front of a customer") and the "cute test data" Red Flag. Begbie's
examples are illustrative; the underlying rule is the public-surface test
applied to every string a programmer writes.

---

## 97/60 — News of the Weird: Testers Are Your Friends

**Author:** Burk Hufnagel
**Source:** https://github.com/97-things/97-things-every-programmer-should-know/blob/master/en/thing_60/README.md
**License:** CC-BY-3.0

**Distillation.** The dismissive framing ("QA is too picky, they want
everything perfect") misreads what testers do. Hufnagel's example is
Margaret, a company secretary doubling as the first-line tester, who could
break any new build within minutes by trying the things real users would
try. The complaints she filed felt frustrating but were never wrong, and
when a build finally survived her — invoice entered, printed, program shut
down cleanly — it shipped and the customer never hit the issues she had
already burned out. The contrast case: a product whose splash screen
misspells a word, whose configuration screen uses checkboxes where radio
buttons belong, whose keyboard shortcuts are broken. None of those defects
is individually catastrophic, but together they make the user doubt whether
the underlying work is trustworthy. The picky tester is the reason that
chain of small doubts never reaches the user.

**Agent application.** Source for checklist step 6 ("treat testers as
collaborators") and the "QA is too picky" Red Flag. Pairs with 97/92 below;
this one focuses on the *attitude* shift, 97/92 focuses on the *practice*.

---

## 97/80 — Test for Required Behavior, Not Incidental Behavior

**Author:** Kevlin Henney
**Source:** https://github.com/97-things/97-things-every-programmer-should-know/blob/master/en/thing_80/README.md
**License:** CC-BY-3.0

**Distillation.** A test that hardwires the current implementation's
incidental choices to its assertions creates a false-positive trap. Henney's
canonical example is the 3-way comparator: the contract says "negative if
less, positive if greater, zero if equal," but most implementations happen
to return -1, 0, or +1, and many test suites assert exactly those values.
A perfectly valid implementation that returns -2 or +5 then turns the suite
red — and the typical response (rewrite the test to match the new return
value) only re-pins the assertion to the new incidental, treating each false
positive as a true requirement. The deeper cause is whitebox thinking —
deriving test cases from code structure rather than from the contract — which
yields tests that assert the code does what the code does. The fix is to
state the contract in the test, take a blackbox view, and let the
implementation vary as long as the contract holds.

**Agent application.** Source for checklist step 2 ("assert the required
behavior, not an incidental") and the "assert exactly -1" Red Flag. The
principle is the foundation for everything else in the skill — a precisely
stated incidental is still wrong.

---

## 97/81 — Test Precisely and Concretely

**Author:** Kevlin Henney
**Source:** https://github.com/97-things/97-things-every-programmer-should-know/blob/master/en/thing_81/README.md
**License:** CC-BY-3.0

**Distillation.** Aiming at the requirement (per 97/80) is necessary but not
sufficient. Tests must also be *precise*. Henney's sort example shows how
loose postconditions admit wrong answers: "result is sorted, same length as
input" is satisfied by `[3,3,3,3,3,3]` against `[3,1,4,1,5,9]` — and that
exact failure mode (a typo populating the result with the first input
element) showed up in real production code, caught only because someone
checked. The full postcondition is "sorted *and* a permutation of the
input," but coding a permutation-checker is often more code than the
function under test, which trades one verification problem for another
(Hoare: software either obviously has no defects or has no obvious defects).
Concrete examples cut the knot — input `[3,1,4,1,5,9]`, expected
`[1,1,3,4,5,9]`, no other answer satisfies the assertion. Precision applies
to all postconditions: "added to an empty collection" is not "now non-empty"
but "now contains exactly one element, and that element is X."

**Agent application.** Source for checklist step 3 ("be precise and
accurate; use concrete examples") and the "same length, all in range" Red
Flag. Pairs with 97/80: 97/80 picks the right *target*, 97/81 makes the assertion
sharp enough to actually hit it.

---

## 97/82 — Test While You Sleep (and over Weekends)

**Author:** Rajith Attapattu
**Source:** https://github.com/97-things/97-things-every-programmer-should-know/blob/master/en/thing_82/README.md
**License:** CC-BY-3.0

**Distillation.** Build infrastructure spends most of every twenty-four-hour
period idle. Attapattu's recommendation is to put that idle capacity to
work on the categories of tests that don't fit the pre-commit cycle.
Four families benefit. (a) Suites too large to gate every commit on — split
them into a small mandatory pre-commit profile and a heavier nightly profile.
(b) Soak tests that hunt for memory leaks and resource exhaustion need
hours of continuous run; the weekend gives sixty-plus uninterrupted hours.
(c) Performance tests need a quiet machine for clean numbers; nights are
quieter than days. (d) Cross-platform matrices (32/64-bit × OS × protocol)
multiply out to permutations no human will run by hand; automate them and
schedule the run when nobody is competing for the hardware. Standard
schedulers (cron, CI cron triggers, build server queues) suffice; some
organizations pool capacity into a shared grid.

**Agent application.** Source for checklist step 7 ("schedule expensive
tests for the hours nobody is using the build server") and the "skip the
soak test" Red Flag. The principle is operational rather than design-level
but belongs in the same skill because the decision is made at the moment
the slow test is being written.

---

## 97/83 — Testing Is the Engineering Rigor of Software Development

**Author:** Neal Ford
**Source:** https://github.com/97-things/97-things-every-programmer-should-know/blob/master/en/thing_83/README.md
**License:** CC-BY-3.0

**Distillation.** Programmers reach for hard-engineering metaphors
(bridge-building, structural analysis) to legitimize software work to
non-technical audiences, but the metaphors break under load. Hard-engineering
disciplines have built up centuries of mathematical apparatus that lets them
verify a design before construction. Software has nothing equivalent and
may never — Reeves' 1992 essay "What Is Software Design?" argues that the
"build" step in software is the typing itself, not what testing analyzes.
What software has instead, and what bridge engineers would envy, is the
near-zero cost of building the actual artifact and exercising it under
realistic load. Unit tests, harnesses, mocks, and integration suites are
how the discipline does the analysis other engineers can only approximate.
A manager who tells a programmer "no time to test" is asking for the
equivalent of skipping the structural analysis on a bridge — recognizable
as professionally irresponsible the moment you state the analogy.

**Agent application.** Source for checklist step 1 ("treat the test as the
engineering rigor of the change") and the "no time to test" Red Flag. Sets
the framing for the rest of the skill — testing is not optional polish, it
is the verification step the discipline depends on.

---

## 97/92 — When Programmers and Testers Collaborate

**Author:** Janet Gregory
**Source:** https://github.com/97-things/97-things-every-programmer-should-know/blob/master/en/thing_92/README.md
**License:** CC-BY-3.0

**Distillation.** The throw-it-over-the-wall model — programmer commits,
tester finds bugs, defects argued in a tracker — wastes the most expensive
hours of both roles. Gregory's alternative is collaboration before code
exists. Testers, working with the customer, write acceptance tests in
domain language (Fit-style or equivalent) and hand them to programmers as
input to the work; programmers write fixtures, code to make the tests pass,
and the tests join the regression suite. A real example: a tester's Fit
table showed expected results for wildcard search, the programmer had only
intended whole-word search, and the discrepancy surfaced in the customer's
office before any code was written rather than in a defect ticket two weeks
later. The reverse handoff matters too — programmers can help testers
design automation suites that don't fall over (independent tests, focused
scope, robust fixtures). The cultural shift is from "find bugs in the
programmers' code" and "QA is out to get me" to "we are jointly responsible
for testability."

**Agent application.** Source for checklist step 6 ("treat testers as
collaborators") alongside 97/60, and the "throw it over the wall" Red Flag.
97/60 supplies the *attitude* (testers protect users, not adversaries); 97/92
supplies the *practice* (acceptance tests as input, pre-coding handoff,
joint responsibility for automation quality).

---

## 97/95 — Write Tests for People

**Author:** Gerard Meszaros
**Source:** https://github.com/97-things/97-things-every-programmer-should-know/blob/master/en/thing_95/README.md
**License:** CC-BY-3.0

**Distillation.** Meszaros frames test-writing as a question of audience.
Tests written "for me, so I spend less time bug-fixing" or "for the
compiler, so they run" miss the high-leverage reader: the next programmer
who has to understand what the system does. A good test is documentation,
and the structure to make it readable is consistent across testing
traditions — a setup section that names the preconditions, a call into the
system under test, and an assertion section that names the expected
postcondition. Anything that distracts from those three (verbose fixture
construction, inline mock setup, unrelated assertions) belongs behind a
named helper extracted with the editor's refactor support. Test names
should encode the scenario *and* the entry point so that scanning method
names is a first-pass coverage audit. Two practices verify the test rather
than just the code: introduce a deliberate bug into a private copy of the
production code and confirm the test fails with a message a stranger could
diagnose; ask someone unfamiliar with the code to read the test and tell
you what they learned.

**Agent application.** Source for checklist step 4 ("write the test for the
next person who has to read it") and two Red Flags ("I know what this test
means" and "`test17` is a fine name"). Also feeds the "done" checklist's
requirement that the test fail for the right reason on a deliberate bug
injection.

---

## Beyond *97 Things* — GOOS test-listening + xUnit smells

The five principles below come from *Growing Object-Oriented Software,
Guided by Tests* (Freeman & Pryce, Addison-Wesley, 2009) and *xUnit
Test Patterns* (Meszaros, Addison-Wesley, 2007). GOOS supplies the
test-as-design-pressure lens — when a test is hard to write, the
design is wrong; reshape the production code rather than mocking
harder. Meszaros supplies the named smell catalog the agent can
recognize from the test code itself.

Boundary with `superpowers/test-driven-development`: TDD decides
*whether and when* to write a test; this skill decides *what makes
the test good*. The principles below sit on the second axis.

---

## GOOS/ListenToTestPain — Listen to Test Pain

**Author:** Steve Freeman & Nat Pryce
**Source:** Growing Object-Oriented Software, Guided by Tests, Addison-Wesley 2009, ch. 20
**License:** fair-use commentary

**Distillation.** When a test is hard to write, the design is wrong.
Operationalized check: *if the test setup is longer than the test
body, or mocking the collaborators is harder than mocking the system
under test, stop — reshape the production code instead of mocking
harder.* Concrete signals: a constructor that takes seven
collaborators (split the type); a method that depends on a deep
graph the test must hand-build (move the dependency or pass the
already-built thing in); a test that has to set a private field via
reflection (the public API is missing a seam). Test pain is design
pressure surfacing through the only channel that makes it concrete.
The fix is on the production side, not the test side.

**Agent application.** Surfaces in `SKILL.md` Red Flags as "test
setup is longer than the test body" — the highest-leverage single
addition in this skill. Sharpens the boundary with
`superpowers/test-driven-development`: TDD's red/green/refactor
loop is where this signal fires.

---

## xUnit/ObscureTest — Obscure Test

**Author:** Gerard Meszaros
**Source:** xUnit Test Patterns, Addison-Wesley 2007, ch. 16
**License:** fair-use commentary

**Distillation.** Too much in one test; the reader cannot tell what
behavior is being asserted. The test mixes setup, several actions,
and several assertions across unrelated properties; failure
messages identify the test name but not which property failed. The
fix is one of: extract setup into a named fixture or factory
function; split the test into multiple tests, one per behavior; add
named intermediate variables that read like the scenario. The test
should read top-to-bottom as Arrange / Act / Assert, with the Act
section being one line if possible.

**Agent application.** Surfaces in `SKILL.md` Red Flags as "the
test asserts on five unrelated properties" and as a check during
the test-quality checklist.

---

## xUnit/FragileTest — Fragile Test

**Author:** Gerard Meszaros
**Source:** xUnit Test Patterns, Addison-Wesley 2007, ch. 18
**License:** fair-use commentary

**Distillation.** A test breaks on changes unrelated to its intent —
a refactor that preserves behavior, a fixture rebuild that doesn't
affect the assertion, a downstream dependency upgrade. Common causes:
the test asserts on internals (private fields, exact log strings,
exact call counts to mocks) instead of on observable behavior;
over-specified mock interactions (`verify(repo).save(any()) was
called exactly 3 times`) where the contract is "the data was
saved." The fix is to assert on what the caller cares about, not on
what the implementation does.

**Agent application.** Surfaces in `SKILL.md` Red Flags as
"over-specified mock interactions" and "test asserts on private
internals." Sharpens `97/80` (assert required, not incidental).

---

## xUnit/MysteryGuest — Mystery Guest

**Author:** Gerard Meszaros
**Source:** xUnit Test Patterns, Addison-Wesley 2007, ch. 16
**License:** fair-use commentary

**Distillation.** The test depends on data not visible in the test —
a file at a magic path, a shared DB row, an env var, a global state
left over from another test. Reading the test alone, you cannot tell
what input is being exercised; the failure depends on whatever that
external resource happens to be when the test runs. The fix is
in-test fixtures or a named factory function: every input the test
depends on is constructed inside the test or returned by a function
named for what it returns (`a_user_with_no_orders()`).

**Agent application.** Surfaces in `SKILL.md` Red Flags as "test
reads from a file at a magic path" and as a check on shared
fixtures. Pairs with `97/95` (write tests for people) — the
reader-of-the-test-six-months-from-now case.

---

## xUnit/ConditionalTestLogic — Conditional Test Logic

**Author:** Gerard Meszaros
**Source:** xUnit Test Patterns, Addison-Wesley 2007, ch. 18
**License:** fair-use commentary

**Distillation.** No branching that changes *what the test
asserts*. Operationalized: an `if` / `for` / `switch` inside a test
body that affects which assertion runs is a smell — split into
multiple tests or use named parameterized cases. Loops or
conditionals over fixed test *data* (table-driven tests, parameter
matrices) are fine; the rule is about branching over assertion
*logic*. A test that asserts different things depending on the
return value is two tests fighting for one name.

**Agent application.** Surfaces in `SKILL.md` Red Flags as "`if`
inside the test body affects what is asserted." Pairs with
`xUnit/ObscureTest` — the conditional is often the symptom of
several behaviors crammed into one test.
