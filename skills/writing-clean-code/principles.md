# writing-clean-code — principles

Long-form per-principle distillations. The summary in `SKILL.md` is what the
agent loads on trigger; this file is the on-demand reference for when a
deeper cut is needed on a specific principle.

All twelve principles come from *97 Things Every Programmer Should Know*
(O'Reilly, ed. Kevlin Henney, 2010). Originals are CC-BY-3.0 at the canonical
mirror: https://github.com/97-things/97-things-every-programmer-should-know.

Distillations below are original commentary in our own words. No verbatim
quotes longer than ~25 words. If a contributor objects to a particular
distillation, file an issue and the file will be revised or removed.

---

## 97/5 — Beauty Is in Simplicity

**Author:** Jørn Ølmheim
**Source:** https://github.com/97-things/97-things-every-programmer-should-know/blob/master/en/thing_05/README.md
**License:** CC-BY-3.0

**Distillation.** The qualities programmers say they value in code —
readability, maintainability, speed of development, even the subjective sense
of "beautiful code" — all reduce to the same property: simplicity. Beautiful
code shares small, single-purpose objects; methods short enough to hold in
your head (five to ten lines, even when that feels extreme); and parts whose
relationships to each other are also simple. Complexity in the parts is
recoverable; complexity in the wiring between the parts is what kills a
codebase over its lifetime. The aim isn't austerity for its own sake — it's
that simplicity is the only design property that compounds in the right
direction as the system grows.

**Agent application.** Source for decision 1 ("default to the simplest thing
that works"). Companion to 97/75, which gives the *technique* (removal); this
principle gives the *target* (simplicity as the unifying quality).

---

## 97/13 — Code Layout Matters

**Author:** Steve Freeman
**Source:** https://github.com/97-things/97-things-every-programmer-should-know/blob/master/en/thing_13/README.md
**License:** CC-BY-3.0

**Distillation.** The cautionary tale is a Cobol shop that forbade indentation
changes unless the code was also being changed, because someone once broke a
build by slipping a line into a special column. The team paid for that rule
forever in programmer drag — layout couldn't be trusted, so layout couldn't
help. The lesson generalizes: programmers spend more time navigating and
reading code than typing it, so the artifact should be optimized for scanning.
Three guidelines follow. Code should be easy to scan, with accidental
complexity standardized so domain content stands out (humans evolved for
visual pattern matching). Layout should be expressive — a formatter handles
the basics, but line breaks afterward should reflect intention, not just
syntax. And the format should be compact, because more on screen means less
scrolling and less context juggling. The era of line printers and 8-character
names is over; in modern IDEs the limiting resource is pixels, and ceremony
that wastes them is a tax on every reader.

**Agent application.** Source for decision 6 ("treat layout as a tool for the
reader, not for the parser"). Pairs with 97/62 — names and layout together are
how the code communicates without help from comments or docs.

---

## 97/15 — Coding with Reason

**Author:** Yechiel Kimchi
**Source:** https://github.com/97-things/97-things-every-programmer-should-know/blob/master/en/thing_15/README.md
**License:** CC-BY-3.0

**Distillation.** Formal proofs of program correctness are usually longer and
more error-prone than the code itself. The middle path is to reason
*semi-formally* about correctness in short sections — a single line up to
under ten — arguing each section's correctness convincingly enough for a
sceptical peer. Section endpoints should satisfy easily-described state
properties (a generalization of pre/postconditions, loop invariants, and
class invariants). The act of intending to reason about your code reshapes
it: the practical rules that make code reasonable are the same rules that
make it cleaner. No `goto`. No modifiable globals. Smallest possible scope
for each variable. Immutability where it fits. Readable spacing. Descriptive
but short names. Nest by extracting functions rather than indenting more.
Keep functions short and focused — the 24-line cognitive limit hasn't moved
because human cognition hasn't moved. Keep parameter lists short (≤4).
Narrow interfaces over wide ones. Treat getters that leak internal state as
a liability — *ask the object to do work, not for information*. Discourage
setters that let callers break invariants. Most of these are checkable by
static analysis.

**Agent application.** Source for decision 3 ("reason about each block in
short sections"). The "ask, don't tell" / "tell, don't ask" undercurrent
also feeds decision 5 (single responsibility) and the broader bias toward
encapsulation that 97/76 makes explicit.

---

## 97/17 — Comment Only What the Code Cannot Say

**Author:** Kevlin Henney
**Source:** https://github.com/97-things/97-things-every-programmer-should-know/blob/master/en/thing_17/README.md
**License:** CC-BY-3.0

**Distillation.** Comments sound helpful in theory; in practice they're often
a blight. Bad code is caught by compilers, by tests, by production traffic.
Bad comments survive forever, because nothing executes them. Kernighan and
Plauger put it bluntly: a wrong comment has zero or negative value. Noisy
comments — the ones that parrot what the code already says — add nothing,
because saying something twice doesn't make it more true. Commented-out code
goes stale fast and isn't executable. Version-history annotations duplicate
what version control already knows. Programmers cope with comment noise by
ignoring all comments (folding them, recoloring them, filtering them), which
means useful comments get ignored along with the rest. Treat each comment
the way you treat a line of code: it earns its place by adding value the
code itself cannot. When you find yourself writing a comment to compensate
for a poor name or a long function, the comment is telling you to rename or
extract instead. The legitimate space for a comment is the gap between what
the code can express and what the next reader needs to know.

**Agent application.** Source for decision 8 ("comment only what the code
cannot say") and the Red Flags about restating the code in prose, leaving
old blocks commented out, and treating comments as a sign of professionalism.
Reinforces 97/62 — code is the only artifact guaranteed to tell the truth.

---

## 97/30 — Don't Repeat Yourself

**Author:** Steve Smith
**Source:** https://github.com/97-things/97-things-every-programmer-should-know/blob/master/en/thing_30/README.md
**License:** CC-BY-3.0

**Distillation.** DRY (Hunt and Thomas, *The Pragmatic Programmer*) is one of
the most-cited principles in the craft for good reason: every piece of
knowledge should have a single, unambiguous, authoritative representation
within a system. The rule applies on three surfaces. *Duplication is waste*
— it bloats the codebase, multiplies the bug surface, and makes parallel
changes uncertain. *Repetition in process calls for automation* — manual
testing is slow and unreliable (use automated suites); manual integration
hurts (build on every check-in); painful repeated processes should be
standardized so there's only one way to do them. *Repetition in logic calls
for abstraction* — copy-pasted `if` and `switch` chains are the easiest
violation to spot, design patterns like Factory and Strategy often exist
specifically to remove logic duplication, and database normalization is DRY
for data structure. Once and Only Once (functional behavior), Open/Closed,
and Single Responsibility all depend on DRY. The exception that proves the
rule: occasional duplication for measured performance reasons (denormalization)
is fine when it solves a real problem rather than an imagined one.

**Agent application.** Source for decision 10 ("each piece of knowledge has
one authoritative representation") and the Red Flags about extraction-feels-
premature and slightly-different-helpers. Companion to 97/91, which makes the
performance argument for DRY explicit.

---

## 97/39 — Improve Code by Removing It

**Author:** Pete Goodliffe
**Source:** https://github.com/97-things/97-things-every-programmer-should-know/blob/master/en/thing_39/README.md
**License:** CC-BY-3.0

**Distillation.** A war story: a codebase improved meaningfully when chunks
of it were deleted. The team thought they were following YAGNI, but pieces
had been over-implemented with extras "that seemed like a good idea at the
time." Removing those features simplified the code, sped up the product on
common tasks, and lowered global entropy; the unit tests confirmed nothing
else broke. Why does unnecessary code accumulate? Four common reasons. The
programmer wrote the extra because it was fun — but code earns its place by
adding value, not by amusing the author. Someone speculated it might be
needed in the future — that's not YAGNI, that's predicting the future
poorly. The "extra" felt smaller than going back to the customer to ask —
but small extras snowball into large maintenance, and customers are
approachable. The programmer invented unstated requirements to justify a
feature — but programmers don't set requirements; customers do. The
counterintuitive move that follows: the most productive edit you can make
in a session is sometimes deletion.

**Agent application.** Source for decision 9 ("improve code by removing it")
and the Red Flag about adding speculative knobs. Resolves the apparent
tension with 97/93 — long-term support is about clarity, not about predicting
which extras a future maintainer will want.

---

## 97/62 — Only the Code Tells the Truth

**Author:** Peter Sommerlad
**Source:** https://github.com/97-things/97-things-every-programmer-should-know/blob/master/en/thing_62/README.md
**License:** CC-BY-3.0

**Distillation.** The semantics of a program is the running code; everything
else is a hope or a memory. Requirements documents capture intent, not
implementation. Design documents capture planned design, not what was
actually built. Both can be lost or fall out of sync, and the source code
is sometimes the only artifact left. The question that follows is uncomfortable:
how clearly is your code telling its reader what it does? Comments aren't
running code — they can be wrong like any other documentation, and the folk
tradition of "more comments means better code" leads to restating trivia.
If your code needs comments to be understood, refactor so it doesn't.
Lengthy comments clutter screen space; some IDEs hide them by default for
exactly this reason. Explain a *change* in the version control message, not
in the code. To make code tell the truth: choose good names; structure code
by cohesive functionality (which makes naming easier); decouple for
orthogonality; write automated tests that document intended behavior;
refactor without ceremony when you see a simpler shape. Treat code the way
you'd treat any composition meant to outlive you — a poem, an essay, an
important email — and craft it so it does what it should *and* communicates
what it does once you're not around to explain.

**Agent application.** Source for decision 7 ("choose names that let the
code speak for itself") and the Red Flag about short names that "rely on
context." Pairs with 97/17 — both principles converge on the same conclusion:
the code is the document, and comments are at best a supplement.

---

## 97/75 — Simplicity Comes from Reduction

**Author:** Paul W. Homer
**Source:** https://github.com/97-things/97-things-every-programmer-should-know/blob/master/en/thing_75/README.md
**License:** CC-BY-3.0

**Distillation.** The story: an early boss "Stefan" sat down at the author's
machine and pressed delete one line at a time until the bad code was gone,
then made him write it again. The lesson was about reflexes. The author's
default move when code misbehaved was to add another variable, another
branch, another line — the bad code grew larger and farther from working.
Most programmers preserve bad code out of fear that rewriting will take
longer than salvaging, but that's only true when the code is close to
working; for code that's beyond all help, salvaging wastes more time than
starting over. Once a piece of code becomes a resource sink, discard it
quickly. The technique for fixing bad code: switch into ruthless
refactor / shift / delete mode. Simple code uses the minimum number of
variables, functions, declarations, and syntactic ceremony — extra anything
is unwanted noise that hides the flow (the substance commonly labeled KISS).
The extreme version, when reduction
hits a wall: delete the code entirely and retype it from memory. The act of
drawing from memory cuts through clutter that's invisible while you're
inside the file.

**Agent application.** Source for decision 2 ("reach simplicity by removing,
not by adding") and the Red Flag about the reflex to add another flag.
Companion to 97/5 (the target) and 97/39 (the user-visible justification for
deletion).

---

## 97/76 — The Single Responsibility Principle

**Author:** Robert C. Martin
**Source:** https://github.com/97-things/97-things-every-programmer-should-know/blob/master/en/thing_76/README.md
**License:** CC-BY-3.0

**Distillation.** SRP, stated precisely: gather together the things that
change for the same reason, and separate the things that change for
different reasons. A subsystem, module, class, or function should have no
more than one reason to change. The classic anti-example is an `Employee`
class that holds `calculatePay` (changes when business rules change),
`reportHours` (changes when report format changes), and `save` (changes when
the database schema changes). Three reasons to change make the class
volatile, and every dependent suffers for each. The fix is to split along
the axes of change: `Employee` keeps the business rules, `EmployeeReporter`
owns the report format, `EmployeeRepository` owns persistence. Each can be
deployed independently. Some residual coupling on `Employee` itself remains
— the report and repository still reference it — but the volatile pieces
are no longer entangled, and Dependency Inversion can break the residual
coupling when needed. SRP is what makes a system into independently
deployable components rather than a single monolithic mass.

**Agent application.** Source for decision 5 ("one reason to change per
unit") and the Red Flags about long-but-cohesive functions and "every method
shares a noun." The principle's force is in the *axis-of-change* test —
sharing a noun isn't a single responsibility.

---

## 97/91 — WET Dilutes Performance Bottlenecks

**Author:** Kirk Pepperdine
**Source:** https://github.com/97-things/97-things-every-programmer-should-know/blob/master/en/thing_91/README.md
**License:** CC-BY-3.0

**Distillation.** WET — Write Every Time — is the antithesis of DRY, named
to make the cost obvious. The performance angle: imagine a feature that
consumes 30% of CPU. Under DRY, that 30% concentrates in one
implementation, where it shows up clearly in a profile and is fixable in
one place. Under WET, the same logic is spread across ten copies, each
showing as 3% of CPU — below the threshold most performance engineers use
for a quick win, easy to miss in a profile, and requiring ten separate fixes
even when found. A common DRY violation is exposing raw collections to
clients, which forces every client to re-implement the same query. Wrapping
the collection in a domain-specific type — `CustomerList` rather than a raw
`ArrayList<Customer>` — moves the queries to one place, hides the
representation, and lets you swap in alternative indexing (e.g., a sorted
list keyed on spending level) without touching client code. DRY makes
bottlenecks both findable and fixable.

**Agent application.** Source for decision 11 ("duplication hides the
bottlenecks"). Companion to 97/30 — the same rule, justified twice: once on
correctness grounds, once on performance grounds.

---

## 97/93 — Write Code As If You Had to Support It for the Rest of Your Life

**Author:** Yuriy Zubarev
**Source:** https://github.com/97-things/97-things-every-programmer-should-know/blob/master/en/thing_93/README.md
**License:** CC-BY-3.0

**Distillation.** Faced with 97 pieces of advice from 73 contributors, the
question is where to start and how to integrate any of it. The answer is
*attitude*. If you don't care about your fellow developers, testers,
managers, sales and marketing colleagues, and end users, you won't be
driven to test-drive, write clear comments, or refactor. A single rule
drives the rest: write code as if you'd have to support it for the rest of
your life. Imagine any past or current employer can call you in the middle
of the night to explain a method you wrote — you'd naturally pick better
names, avoid hundred-line blocks, learn and apply patterns where they fit,
write the comments that earn their place, and write the tests. The code
you wrote years ago still influences your career, because people form
opinions of you from it. Writing for long-term support is the discipline
that makes you better.

**Agent application.** Source for decision 12 ("write code as if you'll
have to support it for years"). Carries the explicit tension with 97/39
(YAGNI) that the SKILL.md resolves: long-term thinking is about clarity for
the next reader, not about adding speculative complexity for hypothetical
future needs.

---

## 97/94 — Write Small Functions Using Examples

**Author:** Keith Braithwaite
**Source:** https://github.com/97-things/97-things-every-programmer-should-know/blob/master/en/thing_94/README.md
**License:** CC-BY-3.0

**Distillation.** A function has two sizes. The first is lines of code, which
is what most people mean by "small." The second, more interesting one, is
the *mathematical* size — the cardinality of the function's input/output
relation. Consider, in the game of Go, `boolean atari(int libertyCount)
{ return libertyCount < 2; }`. It looks small. But the Cartesian product of
`int` and `boolean` is roughly 8.6 billion members, and complete evidence
of correctness would require checking about 4.3 billion examples. This is
why tests can never prove the absence of bugs when functions take native
types. The domain helps, though: in Go, liberty count is in `{1,2,3,4}`. If
you retype the parameter as `LibertyCount = {1,2,3,4}`, the function has at
most 8 members in its input/output relation, and 4 example checks now
constitute complete certainty. The lesson is that domain-inspired types,
not native ones, are what shrink functions in the mathematical sense. The
discipline that follows: find the examples to check in domain terms before
writing the function, and let those examples drive the type choices.

**Agent application.** Source for decision 4 ("find the examples in domain
terms before writing the function") and the Red Flag about using native
`int`/`string` for now. Bridges to `domain-modeling` (97/65 in that skill) and
`api-and-interface-design` — domain-specific types are the shared answer to
multiple distinct questions.
