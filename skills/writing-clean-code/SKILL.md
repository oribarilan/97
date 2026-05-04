---
name: writing-clean-code
description: Use when adding a new function/class, naming a new entity, or modifying ≥3 lines of non-trivial logic — at most once per file per session
---

# Writing Clean Code

## Overview

Most "clean code" advice is taste dressed up as principle. The twelve contributors here converge on something narrower and more useful: **code is read far more often than it is written, so optimize the artifact for the next reader.** That reader is usually you, six months on, debugging at 2 a.m. This skill enforces a small set of decisions to apply when you write a new function, name a new entity, or touch a non-trivial block of logic. It draws on twelve contributors to *97 Things Every Programmer Should Know* (CC-BY-3.0; see `principles.md` for citations and links).

This is a **rigid** skill for the decisions in order, but a **flexible** one for how aggressively you apply each principle — context decides. If you can't satisfy a decision, stop and tell your human partner what's blocking you.

**Once per file per session.** This skill is the most-fired in the bundle, which makes habituation the biggest risk. Fire it the first time you cross the trigger threshold in a given file in a session; do not re-fire on subsequent edits to the same file. If the file changes shape enough that the prior decisions no longer hold, that is a refactor — invoke `before-you-refactor` instead.

## When to invoke

Invoke when, in a file you have not already invoked this skill on this session, you're about to:

- Add a new function, method, class, struct, or module
- Name a new entity that other code will reference (variable, function, type, file)
- Modify ≥3 lines of non-trivial logic — branching, loops, conditional dispatch, or anything that reads as "behavior" rather than "wiring"
- Add or replace a comment block of more than one line
- Copy-paste a block of logic from elsewhere in the codebase

If you're unsure whether the change is non-trivial, ask: *would a reviewer pause on this hunk to think about it?* If yes, invoke.

### Non-triggers — do NOT invoke for

- Typo fixes or one-line bug fixes where the change is obvious
- Config edits — JSON, YAML, TOML, dotfiles, lock files, env files
- Test code (use `testing-discipline` instead)
- Refactoring existing code (use `before-you-refactor` instead)
- Mechanical edits — running a formatter, sorting imports, renaming a single local variable in one function
- Generated code — anything emitted by a codegen tool, schema compiler, or build step
- A file in which this skill has already fired in the current session

## Precedence

- `97/before-you-refactor` precedes this skill when the change restructures existing working code rather than writes new code. If both apply, defer to `before-you-refactor` and skip this skill for the same edit.
- `97/testing-discipline` precedes this skill for any change inside a test file, fixture, mock, or test helper.
- `97/api-and-interface-design` precedes this skill when the entity you're naming or the function you're adding crosses a module/package/service boundary. That skill governs the public surface; this one governs the implementation behind it.
- `97/domain-modeling` governs whether a *type* should exist and what it should be called. This skill governs the methods on that type once it does. If you're introducing a new top-level domain concept, do `domain-modeling` first.

## The clean-code decisions

Run the decisions in the order below, but apply them with judgement — context decides how aggressive each one needs to be.

### Simplicity

1. **Default to the simplest thing that works.** *(Ølmheim, #5.)* Readability, maintainability, and speed of development all rest on simplicity. The parts should be simple in isolation, and the relationships between them should be simple as well. If the design pulls you toward something elaborate, stop and ask whether you've understood the problem.
2. **Reach simplicity by removing, not by adding.** *(Homer, #75.)* The reflex when code misbehaves is to add another variable, another branch, another comment. Try the opposite — delete a line and see what breaks. Bad code that is close to working is worth saving; bad code that is far from working should be discarded and retyped from memory, because the act of retyping cuts through the clutter.

### Function shape

3. **Reason about each block in short sections.** *(Kimchi, #15.)* Write code in chunks — a single line up to under ten — that you could defend to a sceptical peer. The endpoints of each section should be describable as state properties (a generalized pre/postcondition or invariant). When you intend to reason about the code, the structure improves on its own: smaller scopes, fewer mutable globals, narrower interfaces, getters that don't leak internal state.
4. **Find the examples in domain terms before writing the function.** *(Braithwaite, #94.)* A function with an `int` parameter has billions of input cases; a function with a `LibertyCount = {1,2,3,4}` parameter has four. The function's mathematical size — the cardinality of its input/output relation — collapses when domain-specific types replace native ones. Pick the types that make the function checkable by example, then write it.
5. **One reason to change per unit.** *(Martin, #76.)* The Single Responsibility Principle: a function, class, or module should have one reason to change. An `Employee` class with `calculatePay`, `reportHours`, and `save` has three reasons to change and three sets of dependents who suffer for each. Split along the axes of change, not along the axes of "things that share a noun."

### Layout and names

6. **Treat layout as a tool for the reader, not for the parser.** *(Freeman, #13.)* Most of the time spent on code is reading and navigating it; layout should make that fast. Standardize the accidental complexity (formatter handles the basics) so domain content stands out. Use line breaks to express intention, not just to satisfy syntax. Compact, scannable code beats sparse ceremonial code on every metric the reader cares about.
7. **Choose names that let the code speak for itself.** *(Sommerlad, #62.)* The running code is the only artifact guaranteed to be true; requirements and design docs drift, and comments lie. The code's job is to communicate intent without external scaffolding. Strive for names that match the domain, structure code by cohesive functionality (which makes naming easier), and leave change explanations in version control rather than in the code.

### Comments

8. **Comment only what the code cannot say.** *(Henney, #17.)* A comment that restates what the code does adds nothing. A comment that contradicts the code is worse than nothing — wrong comments mislead, and wrong comments survive forever because no compiler catches them. A comment that compensates for a poor name or a long function is an invitation to rename or extract. The legitimate space for a comment is the gap between what the code can express and what the next reader needs to know — *why this approach, not what it does*.

### Removal as a verb

9. **Improve code by removing it.** *(Goodliffe, #39.)* When code does too much, the first move is to delete the extra. Bells and whistles get added because they were fun to write, because someone speculated they "might be needed," because asking the customer felt heavier than coding around. None of those are valid reasons. Trust the test suite to tell you what actually matters and remove the rest.

### Don't repeat yourself

10. **Each piece of knowledge has one authoritative representation.** *(Smith, #30.)* DRY applies to data (normalization), to logic (extraction, design patterns), and to process (automation of anything done repeatedly by hand). Copy-paste duplication is the easy case to spot; the harder case is parallel implementations of the same business rule that drift apart over time. Occasional duplication for a measured performance reason is fine; speculative duplication is not.
11. **Duplication hides the bottlenecks.** *(Pepperdine, #91.)* Performance angle on DRY: a hot path concentrated in one place shows up clearly in a profile. Spread it across ten copies and each copy looks like noise. WET (Write Every Time) code makes bottlenecks both harder to find and harder to fix once found. Wrapping raw collections in domain-specific types is a common move — the queries live in one place, and the underlying representation can change without breaking callers.

### Long-term mindset

12. **Write code as if you'll have to support it for years.** *(Zubarev, #93.)* Imagine you'll be the one called at 2 a.m. to explain this method. You'd pick better names, keep functions short, leave honest comments, write tests. The driver isn't predictive feature engineering — it's the reader's experience when the code resurfaces.

### Long-term mindset vs YAGNI — the tension

Decision 12 says "write for long-term support." Decision 9 says "remove anything you don't need." These look contradictory and aren't. The resolution: **long-term thinking is about clarity, not about predictive feature engineering.**

- *Do* invest in good names, small functions, honest comments, removed dead code, tests that pin behavior. These pay for themselves the next time anyone — including you — opens the file.
- *Don't* add speculative parameters, configuration knobs, abstraction layers, or "extension points" for hypothetical future maintainers. That's the kind of "extra" #39 tells you to delete on sight.

The test: would I want to read this code in two years? — *that* is long-term thinking. Would I want to *have already written* this extra layer of indirection in two years? — that's speculation; cut it.

## Red Flags

These thoughts mean STOP — restart the decisions:

| Thought | Reality |
|---|---|
| "I'll add another flag/variable to make it work." | The reflex to add is what produced the mess. Try removing instead — delete a line and see what breaks. (#75) |
| "It's a long function, but splitting it would be artificial." | A function with multiple reasons to change is not one function. Split along the axes of change, not along the axes of "looks tidy." (#76) |
| "I'll comment what the code is doing so the reader follows along." | Restating the code in prose adds noise without value. Rename, extract, or simplify until the code says what the comment was going to. (#17) |
| "I'll leave the old block commented out in case we need it." | Commented-out code goes stale immediately and isn't executable. Version control remembers; the file shouldn't. (#17, #62) |
| "It's only duplicated twice — extracting feels premature." | Two copies become five. The cost of extracting now is small; the cost of finding all copies of a buggy rule later is not. (#30, #91) |
| "I'll keep the helper here too — it's slightly different." | Slightly different today, drifted tomorrow. Either it's the same knowledge (one home) or it's a new concept (a new name). Pick. (#30) |
| "I'll use `int`/`string` for now — we can wrap it later." | The native type opens billions of input cases that no test will ever cover. A domain type collapses the function to something checkable. (#94) |
| "The variable name is short — the context makes it obvious." | Context evaporates the moment the reader is somewhere else in the file. Names carry their meaning with them; the local context doesn't. (#62) |
| "I'll add this knob now — someone might want it." | Speculative configuration is the canonical YAGNI violation. Add it when a real caller needs it; delete it otherwise. (#39, #93) |
| "Every function on this class belongs together — they all touch `Order`." | Sharing a noun isn't a single responsibility. Ask what changes for what reason; if the answers differ, split. (#76) |
| "Comments make code more professional." | Comments are code that the compiler doesn't check. Each one earns its place by saying what the code cannot. (#17) |

## What "done" looks like

You are done when **all** of the following are true:

- [ ] Each function or method has one reason to change, expressible in one sentence.
- [ ] Names match the domain; no name relies on local context to be understood.
- [ ] No dead code, no commented-out blocks, no speculative parameters or configuration knobs.
- [ ] Every comment says something the code cannot say (and nothing the code already says).
- [ ] No primitive parameter where a domain-specific type would shrink the function's input space to something checkable.
- [ ] No knowledge is duplicated across two locations — or, if it is, you can name the performance reason and you accept the cost.
- [ ] You tried deleting at least one line you initially wrote, and the code is better for what survived.
- [ ] You can describe what each non-trivial block does to your human partner without reading the code aloud.
- [ ] Long-term-support investments are about clarity (names, structure, tests); none are speculative future-proofing.

If any box is unchecked, you are not done — finish, or revert and re-plan.

## Principles in this skill

| # | Principle | Author |
|---|---|---|
| #5 | Beauty Is in Simplicity | Jørn Ølmheim |
| #13 | Code Layout Matters | Steve Freeman |
| #15 | Coding with Reason | Yechiel Kimchi |
| #17 | Comment Only What the Code Cannot Say | Kevlin Henney |
| #30 | Don't Repeat Yourself | Steve Smith |
| #39 | Improve Code by Removing It | Pete Goodliffe |
| #62 | Only the Code Tells the Truth | Peter Sommerlad |
| #75 | Simplicity Comes from Reduction | Paul W. Homer |
| #76 | The Single Responsibility Principle | Robert C. Martin |
| #91 | WET Dilutes Performance Bottlenecks | Kirk Pepperdine |
| #93 | Write Code As If You Had to Support It for the Rest of Your Life | Yuriy Zubarev |
| #94 | Write Small Functions Using Examples | Keith Braithwaite |

See `principles.md` for the long-form distillations, citations, and source links.
