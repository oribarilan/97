---
name: before-you-refactor
description: Use when about to refactor, restructure, rename across files, or "clean up" existing code
---

# Before You Refactor

## Overview

Refactoring without a plan is how working systems become broken systems. **Stop. Read the code that already exists. Understand the tests that protect it. Take small steps. Keep the tests green.** This skill enforces a pre-flight checklist drawn from five contributors to *97 Things Every Programmer Should Know* (CC-BY-3.0; see `principles.md` for citations and links).

This is a **rigid** skill. Run the checklist. Don't skip steps. If you can't satisfy a step, stop and tell your human partner what's blocking you.

## When to invoke

Invoke when you're about to:

- Refactor existing code (extract function, inline, rename across multiple files, restructure a module)
- "Clean up" code you didn't write
- Rewrite a function or module because the existing one feels ugly, outdated, or wrong
- Replace an existing implementation with a "better" one
- Restructure tests, fixtures, or shared helpers used in more than one place

If you're touching ≥3 lines of existing non-trivial logic to change its **shape** (not its behavior), invoke this skill.

### Non-triggers — do NOT invoke for

- Fixing a one-line bug where the change is obvious and the test exists
- Adding a brand-new function in a brand-new file (use `writing-clean-code` instead)
- Renaming a single local variable inside one function
- Fixing a typo in a comment, string, or doc
- Formatting-only changes (whitespace, import order) handled by a formatter
- Editing config or data files where there's no logic to refactor

If you're not sure whether a change counts as a refactor, **invoke anyway** — the checklist is cheap, the consequence of skipping it is not.

## Precedence

- `superpowers/test-driven-development` decides *whether and how* to write the tests that protect the refactor — defer to it for test-first discipline.
- `superpowers/systematic-debugging` precedes refactoring when the trigger is "this code is broken" rather than "this code is messy."
- This skill governs *the act of restructuring code that already works*. If the code doesn't already work, fix it first under TDD/debugging, then come back.

## The pre-refactor checklist

Run every step in order. Do not start editing until step 5 is satisfied.

1. **Read the existing code.** Read it through once. Then read it again. The code in front of you is the result of decisions, bug fixes, and edge-case handling you don't yet understand. *(Attapattu, #6 — "Take stock of the existing codebase.")*
2. **Find the tests that already cover it.** List them. Run them. Confirm they pass on `main` before you change anything. If there are no tests, **stop and add a characterization test that pins down current behavior** before touching the code. *(Attapattu, #6 — "Ensure existing tests pass after each iteration.")*
3. **State the goal in one sentence.** "I am restructuring X so that Y." If you can't write that sentence, you don't have a refactor — you have a wish. Stop. Talk to your human partner.
4. **Check the goal isn't ego or fashion.** Are you refactoring because the code is genuinely blocking work, or because the style offends you, or because there's a newer framework? *Personal preference, ego, and "new tech is shiny" are not valid reasons.* *(Attapattu, #6.)* If the answer is fashion, stop and propose the change to your human partner explicitly with cost and benefit; do not silently rewrite.
5. **Plan the smallest first step.** Refactor in **many small commits, not one massive change.** Each step must keep the tests green. If your plan starts with "first I'll rip out X and then over the next hour I'll …", you're doing it wrong — restart with a smaller first step. *(Attapattu, #6; Lewis, #24.)*
6. **Identify coupling and complexity hotspots before you cut.** Skim for high fan-in / fan-out classes, long methods, deep inheritance, and hidden globals — these are the "dirty code bombs" that will balloon a 4-hour refactor into a 4-week one. Note them; estimate accordingly; tell your human partner if the cost is now larger than the original ask. *(Pepperdine, #74.)*
7. **Confirm you have access to break it safely.** Are you on a branch? Can you commit incrementally? Can you revert? You should never refactor directly on a shared branch or in production. *(Evans, #31 — generalized: don't touch what you can't safely revert.)*

## The Boy Scout Rule (during the refactor)

> "Always check a module in cleaner than when you checked it out." — Robert C. Martin, #8

Inside the scope of your refactor, leave each file you touch a little better: rename one confusing variable, split one over-long function, remove one dead branch. **Bounded improvement, not unbounded rewrite.** If you find yourself wanting to fix everything you see, write it down for later and stay on the goal from step 3.

## Don't be afraid to break things — *temporarily*

> "A skilled surgeon knows that cuts have to be made … the cuts are temporary and will heal." — Mike Lewis, #24

Fear of breaking the build is what produced the mess in the first place. Inside a branch, with the test suite running, breaking things is **how the work gets done**. Make the cut, run the tests, see what fails, fix it, commit. What you must not do: leave the cut un-healed at the end of the session.

## Red Flags

These thoughts mean STOP — restart the checklist:

| Thought | Reality |
|---|---|
| "I'll just rewrite this from scratch — it'll be faster." | Throwing away tested, battle-hardened code throws away every bug fix and edge case it absorbed. The rewrite will rediscover those bugs the slow way. (#6) |
| "There are no tests, but the change is obvious." | "Obvious" is how production breakages are born. Pin behavior with a characterization test first, then refactor. (#6) |
| "I'll do it all in one big PR — easier to review." | Big PRs hide bugs and frustrate reviewers. Many small commits keep tests green and changes reviewable. (#6, #24) |
| "The old code is ugly and uses outdated patterns — I should modernize it." | Style is not a refactor goal. New framework / new language / personal preference are not valid reasons. State the actual user-visible benefit or stop. (#6) |
| "It's just a small cleanup, no need for a checklist." | The small cleanups are exactly where the dirty code bombs detonate. Run the checklist. (#74) |
| "I'll fix everything I see while I'm in there." | Boy Scout rule says *a little better*, not *perfect*. Bounded improvement only. Write the rest down for later. (#8) |
| "I can patch it directly on the staging/production server, just this once." | No. Refactors flow through your normal commit → test → review → deploy path. "Just this once" is how outages happen. (#31) |
| "The tests are failing but it's just flaky — I'll keep going." | Failing tests during a refactor mean the refactor changed behavior. Stop, investigate, fix or revert. Don't push through. (#6) |
| "Estimating is too hard — I'll figure it out as I go." | Open-ended refactors balloon. Identify the coupling hotspots up front and re-estimate. If it's now bigger than the ask, escalate. (#74) |

## What "done" looks like

You are done when **all** of the following are true:

- [ ] The goal sentence from checklist step 3 is satisfied.
- [ ] All tests that passed before the refactor still pass.
- [ ] Any new behavior or new edge case has a new test (write it under TDD per `superpowers/test-driven-development`).
- [ ] No file you touched is left in a half-refactored state — no dead code, no commented-out blocks, no `TODO: finish this`.
- [ ] Each commit on the branch keeps the tests green (you can revert any single commit and the project still builds).
- [ ] If you found "dirty code bombs" outside your scope, they are written down (issue, todo, note to your human partner) — not silently expanded into the PR.
- [ ] You can describe the change to your human partner in two sentences without saying "and also."

If any box is unchecked, you are not done — you are mid-refactor. Either finish, or revert and re-plan.

## Principles in this skill

| # | Principle | Author |
|---|---|---|
| #6 | Before You Refactor | Rajith Attapattu |
| #8 | The Boy Scout Rule | Robert C. Martin |
| #24 | Don't Be Afraid to Break Things | Mike Lewis |
| #31 | Don't Touch That Code! | Cal Evans |
| #74 | The Road to Performance Is Littered with Dirty Code Bombs | Kirk Pepperdine |

See `principles.md` for the long-form distillations, citations, and source links.
