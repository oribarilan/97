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

## #6 — Before You Refactor

**Author:** Rajith Attapattu
**Source (primary):** https://github.com/97-things/97-things-every-programmer-should-know/blob/master/en/thing_06/README.md
**Source (reading aid):** https://medium.com/@biratkirat/step-6-before-you-refactor-rajith-attapattu-386e525222e1
**Source used:** GitHub mirror (CC-BY-3.0). Medium consulted as reading aid only.
**Access date:** 2026-05-04
**Gaps:** None — chapter present on the mirror, complete, attributed.

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

## #8 — The Boy Scout Rule

**Author:** Robert C. Martin (Uncle Bob)
**Source (primary):** https://github.com/97-things/97-things-every-programmer-should-know/blob/master/en/thing_08/README.md
**Source (reading aid):** https://medium.com/@biratkirat/step-8-the-boy-scout-rule-robert-c-martin-uncle-bob-9ac839778385
**Source used:** GitHub mirror (CC-BY-3.0). Medium consulted as reading aid only.
**Access date:** 2026-05-04
**Gaps:** None.

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

## #24 — Don't Be Afraid to Break Things

**Author:** Mike Lewis
**Source (primary):** https://github.com/97-things/97-things-every-programmer-should-know/blob/master/en/thing_24/README.md
**Source (reading aid):** https://medium.com/@biratkirat/step-24-dont-be-afraid-to-break-things-mike-lewis-96fb42119888
**Source used:** GitHub mirror (CC-BY-3.0). Medium consulted as reading aid only.
**Access date:** 2026-05-04
**Gaps:** None.

**Distillation.** Codebases get sick when fear of breaking them prevents
needed structural change. Inside a branch protected by a test suite, breaking
things temporarily is how restructuring gets done — like a surgeon making
necessary cuts. Restructure incrementally rather than attempting a single
heroic rewrite, redefine internal interfaces, restructure modules, refactor
duplicated code, and reduce coupling. The fear of change is the disease; the
willingness to make small, reversible cuts is the cure.

**Agent application.** Pairs with #6 and #8: gives the agent permission to
*actually start cutting* once the checklist is satisfied, while constraining
cuts to be small and incremental. Source for the "do it all at once" Red Flag.

---

## #31 — Don't Touch That Code!

**Author:** Cal Evans
**Source (primary):** https://github.com/97-things/97-things-every-programmer-should-know/blob/master/en/thing_31/README.md
**Source (reading aid):** https://medium.com/@biratkirat/step-31-dont-touch-that-code-cal-evans-bf70fc41e155
**Source used:** GitHub mirror (CC-BY-3.0). Medium consulted as reading aid only.
**Access date:** 2026-05-04
**Gaps:** None.

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

## #74 — The Road to Performance Is Littered with Dirty Code Bombs

**Author:** Kirk Pepperdine
**Source (primary):** https://github.com/97-things/97-things-every-programmer-should-know/blob/master/en/thing_74/README.md
**Source (reading aid):** https://medium.com/@biratkirat/step-74-the-road-to-performance-is-littered-with-dirty-code-bombs-kirk-pepperdine-727a334bfce6
**Source used:** GitHub mirror (CC-BY-3.0). Medium consulted as reading aid only.
**Access date:** 2026-05-04
**Gaps:** None.

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
