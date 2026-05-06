# before-you-refactor — principles

Long-form per-principle distillations. The summary in `SKILL.md` is what the
agent loads on trigger; this file is the on-demand reference for when a
deeper cut is needed on a specific principle.

All five principles come from *97 Things Every Programmer Should Know*
(O'Reilly, ed. Kevlin Henney, 2010). Originals are CC-BY-3.0 at the canonical
mirror: https://github.com/97-things/97-things-every-programmer-should-know.

Distillations below are original commentary in our own words. No verbatim
quotes longer than ~25 words. If a contributor objects to a particular
distillation, file an issue and the file will be revised or removed.

---

## 97/6 — Before You Refactor

**Author:** Rajith Attapattu
**Source:** https://github.com/97-things/97-things-every-programmer-should-know/blob/master/en/thing_06/README.md
**License:** CC-BY-3.0

**Distillation.** Before changing the shape of working code, take stock of
what's there: read the code, identify the tests that protect it, and respect
the bug fixes and edge cases that were absorbed over time. Reuse what you can
rather than rewriting from scratch — production code carries knowledge you
don't yet have. Make many small changes rather than one large change so each
step is verifiable and revertable, and ensure the existing tests still pass
after each step. Style preference, ego, and the appeal of newer technology
are not valid reasons to refactor; identify a concrete user- or
maintainability-visible benefit before you start.

**Agent application.** This is the primary source for the pre-refactor
checklist (steps 1, 2, 4, 5) and for the "I'll just rewrite from scratch" /
"new tech" / "tests are flaky" Red Flags.

---

## 97/8 — The Boy Scout Rule

**Author:** Robert C. Martin (Uncle Bob)
**Source:** https://github.com/97-things/97-things-every-programmer-should-know/blob/master/en/thing_08/README.md
**License:** CC-BY-3.0

**Distillation.** Every time you check a module out, leave it slightly cleaner
than you found it: improve one variable name, split one long function, break
one circular dependency, decouple one piece of policy from one piece of
detail. The improvement does not need to be large — it needs to be
*consistent*. Compounded across a team, this turns the entropy curve of a
codebase from "always getting worse" into "gradually getting better." Caring
for the team's code, not just your own corner, is what makes the rule work.

**Agent application.** Constrains the refactor: improvement is bounded ("a
little better"), not unbounded rewrite. The Red Flag "I'll fix everything I
see while I'm in there" comes from this principle.

---

## 97/24 — Don't Be Afraid to Break Things

**Author:** Mike Lewis
**Source:** https://github.com/97-things/97-things-every-programmer-should-know/blob/master/en/thing_24/README.md
**License:** CC-BY-3.0

**Distillation.** Codebases get sick when fear of breaking them prevents
needed structural change. Inside a branch protected by a test suite, breaking
things temporarily is how restructuring gets done — like a surgeon making
necessary cuts. Restructure incrementally rather than attempting a single
heroic rewrite, redefine internal interfaces, restructure modules, refactor
duplicated code, and reduce coupling. The fear of change is the disease; the
willingness to make small, reversible cuts is the cure.

**Agent application.** Pairs with 97/6 and 97/8: gives the agent permission to
*actually start cutting* once the checklist is satisfied, while constraining
cuts to be small and incremental. Source for the "do it all at once" Red Flag.

---

## 97/31 — Don't Touch That Code!

**Author:** Cal Evans
**Source:** https://github.com/97-things/97-things-every-programmer-should-know/blob/master/en/thing_31/README.md
**License:** CC-BY-3.0

**Distillation.** Code flows from local development → SCC → integration
server → staging → production through specific human roles, and developers
should not reach past the boundaries of their own role. Refactors and bug
fixes belong on a branch in source control, not as a hot patch on a staging
or production server. The "quick fix in production" feels faster but is the
origin of a disproportionate share of outages — once code lives outside SCC,
the team has lost the ability to reason about what is actually deployed.

**Agent application.** Generalized in the checklist (step 7) and Red Flags as
"don't refactor anywhere you can't safely revert." The original principle is
specifically about deployment-pipeline discipline; we extend it to "your
refactor lives on a branch, never directly on shared mainline or production."
Note this is an extension — the original is more narrowly about who has
shell access to which servers.

---

## 97/74 — The Road to Performance Is Littered with Dirty Code Bombs

**Author:** Kirk Pepperdine
**Source:** https://github.com/97-things/97-things-every-programmer-should-know/blob/master/en/thing_74/README.md
**License:** CC-BY-3.0

**Distillation.** Refactor estimates blow up not because the target change is
hard, but because it triggers cascading breakage in tightly-coupled
neighbours. A 3–4 hour change becomes a 3–4 week change one or two days at a
time. Software metrics — particularly fan-in, fan-out, and the resulting
instability factor *I = f_o / (f_i + f_o)* — give a rule-of-thumb signal for
which code is safe to recode (low *I*, stable) versus which is full of dirty
code bombs (high *I*, unstable). Identify and account for these hotspots
*before* you start cutting; otherwise the refactor's credibility damage will
outlast the technical fix.

**Agent application.** Source for checklist step 6 ("identify coupling and
complexity hotspots before you cut") and the "estimating is too hard" /
"small cleanup" Red Flags. Pepperdine's framing was about performance tuning
specifically; the underlying lesson — coupling makes change estimates lie —
generalizes to any refactor.

---

## 97/76 — The Single Responsibility Principle (refactoring trigger)

**Author:** Robert C. Martin
**Source:** https://github.com/97-things/97-things-every-programmer-should-know/blob/master/en/thing_76/README.md
**License:** CC-BY-3.0

**Distillation.** SRP at unit scope: a function, class, or module should have no more than one reason to change. As a refactoring trigger, the test is verbal — can you state the unit's responsibility in one sentence with no "and also"? "Computes the schedule *and also* logs it *and also* persists it" is three reasons to change wearing one name. Each reason has its own dependents who suffer for the others. The trigger fires before the refactor starts: notice the "and also," decide whether to split, then split along the axes of change rather than along axes of "things that share a noun."

**Agent application.** Source for the SRP Red Flag in `SKILL.md` ("function does X *and also* Y"). Pairs with `writing-clean-code` decision 4: this skill names the trigger to *consider* the split on existing code; that skill names the discipline of *writing* the result. Reuses `97/76` across skills — already precedented for `97/30` (DRY), which lives canonically in `writing-clean-code` and is referenced in this skill's preamble below.

---

## Fowler smells (this skill's "what to look for, what to do")

The principles above govern *whether and when* to refactor. The four
Fowler smells below govern *what to look for in the diff and what
refactoring to apply when you see it*. Each entry pairs a recognizable
pattern with its canonical response. Background: *Refactoring*, Martin
Fowler, 2nd ed., Addison-Wesley, 2018, ch. 3 ("Bad Smells in Code").

The full smell catalog is broader than what this skill surfaces.
Three additional smells live under their canonical homes elsewhere in
the bundle — `Fowler/PrimitiveObsession` is owned by `domain-modeling`
(introducing a domain concept is a stronger trigger than the refactor
itself); duplicated code is covered by the existing `97/30` (DRY) in
`writing-clean-code`; long parameter lists fold into the data-clumps
response below.

---

## Fowler/LongMethod — Long Method

**Author:** Martin Fowler
**Source:** Refactoring, 2nd ed., Addison-Wesley 2018, ch. 3
**License:** fair-use commentary

**Distillation.** A function that has grown past the point a reader
can hold in their head is doing too many things. The signal is not a
strict line count — it is the moment a reader has to scroll, or skim
sub-sections, or invent comments to keep their place. The response is
**Extract Function**: pull each meaningful sub-task into a named
helper whose name explains the *why*. The original body shrinks to a
sequence of named steps; the helpers carry the detail. When not to:
some genuinely linear pipelines (parsers, code generators) are easier
to read as one block — extracting helpers spreads the logic across
files for no reader benefit. Use judgement; default to extract.

**Agent application.** Surfaces in `SKILL.md` Red Flags as "the
function I'm refactoring scrolls; I'll just rename a few variables."
Pairs with checklist step 5 — extract before any larger restructure.

---

## Fowler/FeatureEnvy — Feature Envy

**Author:** Martin Fowler
**Source:** Refactoring, 2nd ed., Addison-Wesley 2018, ch. 3
**License:** fair-use commentary

**Distillation.** A method on `A` that calls `b.x()`, `b.y()`,
`b.z()` and barely touches `A`'s own state is on the wrong type. The
data and the behavior have drifted apart. The response is **Move
Method**: relocate the method onto `B`, where its inputs already live;
`A` calls the new method through a one-line forwarder if any callers
still need it on `A`. When not to: if the method genuinely needs
fields from both types, split it into two — one on each — rather than
forcing it onto whichever has more references.

**Agent application.** Surfaces in `SKILL.md` Red Flags as a method
whose body is mostly `other.foo` calls. Often shows up after a
domain refactor split a god-class — one half takes the data and the
other half kept the methods.

---

## Fowler/ShotgunSurgery — Shotgun Surgery

**Author:** Martin Fowler
**Source:** Refactoring, 2nd ed., Addison-Wesley 2018, ch. 3
**License:** fair-use commentary

**Distillation.** One conceptual change forces edits in many places —
adding a payment method touches eight files, a new role touches every
controller. The behavior is conceptually one thing but is physically
distributed. The response is **Move Method** / **Move Field** /
**Inline Class** until the conceptually-related code lives together;
new instances of the change become single-file edits. When not to: if
the distribution is genuinely orthogonal (a cross-cutting logging
concern, an event-handler fan-out where each handler is independent),
the smell is fake — leave it alone.

**Agent application.** Surfaces in `SKILL.md` Red Flags as "this
change pattern keeps making me edit the same eight files." Reinforces
checklist step 6 (coupling hotspots) — shotgun surgery is what high
fan-out feels like at the diff level.

---

## Fowler/DataClumps — Data Clumps

**Author:** Martin Fowler
**Source:** Refactoring, 2nd ed., Addison-Wesley 2018, ch. 3
**License:** fair-use commentary

**Distillation.** The same group of fields appears together
repeatedly — `(street, city, state, postcode)` in three function
signatures, a record, and a form-validation function; or
`(start, end, timezone)` everywhere a date range is passed. The
clump is a missing type. The response is **Extract Class** (or
**Introduce Parameter Object** in dynamic languages: a frozen
dataclass / `attrs` / `pydantic` model). The new type carries the
fields and the operations that depend on them; long parameter lists
collapse into one parameter. When not to: a clump that appears in
exactly two places, with no behavior depending on the combination, is
not yet a type — wait for the third occurrence.

**Agent application.** Surfaces in `SKILL.md` Red Flags as "this
function takes seven primitives." Pairs with `domain-modeling` —
`Fowler/PrimitiveObsession` (canonical home there) is the parent
concept; data clumps are the diff-level signal. Cross-references
`Wlaschin/InvalidStatesUnrepresentable` for the typed-language
counterpart.
