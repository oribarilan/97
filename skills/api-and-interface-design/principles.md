# api-and-interface-design — principles

Long-form per-principle distillations. The summary in `SKILL.md` is what the
agent loads on trigger; this file is the on-demand reference for when a
deeper cut is needed on a specific principle.

All nine principles come from *97 Things Every Programmer Should Know*
(O'Reilly, ed. Kevlin Henney, 2010). Originals are CC-BY-3.0 at the canonical
mirror: https://github.com/97-things/97-things-every-programmer-should-know.

Distillations below are original commentary in our own words. No verbatim
quotes longer than ~25 words. If a contributor objects to a particular
distillation, file an issue and the file will be revised or removed.

---

## #7 — Beware the Share

**Author:** Udi Dahan
**Source (primary):** https://github.com/97-things/97-things-every-programmer-should-know/blob/master/en/thing_07/README.md
**Source (reading aid):** n/a (no Medium link in TOC)
**Source used:** GitHub mirror (CC-BY-3.0).
**Access date:** 2026-05-04
**Gaps:** None — chapter present on the mirror, complete, attributed.

**Distillation.** Reuse is taught as an unqualified good, but reuse without
shared *context* trades a small amount of duplication for a large amount of
coupling. Two pieces of code that look the same today may belong to
different business domains that will evolve under different pressures; the
moment you pull the common four lines into a library, every change to either
caller has to clear the other. Maintenance and test cost on the shared
artifact rises sharply, and the dependency graph grows tendrils that aren't
visible from any one file. The rule of thumb: localized similarity is cheap;
cross-domain similarity is a coincidence until proven otherwise. Extract
only when a real shared concept emerges and earns a name in the domain.

**Agent application.** Source for decision 4 ("don't extract a shared API
until the contexts are actually shared") and the Red Flag about extracting
a helper from two call sites that happen to look alike. Bounds the
encapsulation pressure from #32 — encapsulate within a context, don't
universalize across them.

---

## #19 — Convenience Is not an -ility

**Author:** Gregor Hohpe
**Source (primary):** https://github.com/97-things/97-things-every-programmer-should-know/blob/master/en/thing_19/README.md
**Source (reading aid):** n/a (no Medium link in TOC)
**Source used:** GitHub mirror (CC-BY-3.0).
**Access date:** 2026-05-04
**Gaps:** None.

**Distillation.** "Convenience" is the most-cited justification for sloppy
API choices: one method with a boolean switch instead of two methods, a
second parameter that flips the meaning of the first, an operation whose
name only makes sense once you've read the docs. The convenience is for the
implementer, who didn't want to write the second method; the cost lands on
every caller, whose code now reads as `parser.processNodes(text, false)`
with no clue what `false` means. A good API is a vocabulary the next layer
up uses to express domain ideas. Vocabularies prefer many small precise
words over one overloaded one — natural languages don't have a single word
for "make-up-your-room-be-quiet-and-do-your-homework." Composability comes
from precise primitives that callers combine in ways the designer didn't
anticipate; that is the convenience worth optimizing for.

**Agent application.** Source for decision 7 ("design vocabulary, not
conveniences") and the Red Flag about adding a `bool strict` parameter.
Pairs with #55 — flag-driven overloads are the canonical example of an
interface that is *easy to use incorrectly*.

---

## #32 — Encapsulate Behavior, Not Just State

**Author:** Einar Landre
**Source (primary):** https://github.com/97-things/97-things-every-programmer-should-know/blob/master/en/thing_32/README.md
**Source (reading aid):** n/a (no Medium link in TOC)
**Source used:** GitHub mirror (CC-BY-3.0).
**Access date:** 2026-05-04
**Gaps:** None.

**Distillation.** Two failure modes of class design come up again and again:
the 3000-line god class with one entry point, and the record-with-getters
that holds data but no rules. Both miss the point of encapsulation, which
is to put state and the behavior that depends on it in the same place. A
`Door` knows its own open/closed/opening/closing state and how `open()` and
`close()` behave in each; a `Customer` knows its credit limit and the rule
for whether a new `Order` line is allowed. The anti-pattern is the
`OrderManager` or `OrderService` that wraps every rule in one procedural
method while `Order`, `Customer`, and `Item` are reduced to records. When
the rules live outside the type, every caller can re-implement them
inconsistently, and the next change has to find every site.

**Agent application.** Source for decision 3 ("encapsulate behavior, not
just state") and the Red Flag about exposing fields with getters/setters.
Closely linked with `domain-modeling`'s decision on where state lives —
that skill picks the type; this one picks what the type *exposes*.

---

## #35 — The Golden Rule of API Design

**Author:** Michael Feathers
**Source (primary):** https://github.com/97-things/97-things-every-programmer-should-know/blob/master/en/thing_35/README.md
**Source (reading aid):** n/a (no Medium link in TOC)
**Source used:** GitHub mirror (CC-BY-3.0).
**Access date:** 2026-05-04
**Gaps:** None.

**Distillation.** The temptation when shipping an API is to lock everything
down — `final`, `sealed`, singleton, static factory — to preserve the
implementer's freedom to change internals later. The cost is that callers
cannot stub, fake, or mock your types in their own tests, so their code
ends up untestable around your library. Feathers' rule: write tests for
*code that uses* the API, not only for the API itself. Doing so reveals
exactly the seams callers will need, and turns testability into a
first-class design constraint that informs which pieces stay open and which
can safely be locked. An API that is hostile to its callers' test suites
will be replaced.

**Agent application.** Source for decision 8 ("test the code that uses your
API") and the Red Flag about marking everything `final` / `sealed`. Sets up
a test-first checkpoint that backstops the rest of the skill — the caller's
test is where each design choice gets validated.

---

## #55 — Make Interfaces Easy to Use Correctly and Hard to Use Incorrectly

**Author:** Scott Meyers
**Source (primary):** https://github.com/97-things/97-things-every-programmer-should-know/blob/master/en/thing_55/README.md
**Source (reading aid):** n/a (no Medium link in TOC)
**Source used:** GitHub mirror (CC-BY-3.0).
**Access date:** 2026-05-04
**Gaps:** None.

**Distillation.** Interface design happens at every level — UI buttons,
function signatures, library entry points, RPC schemas — and the same two
properties separate the good from the bad. *Easy to use correctly* means
the path of least resistance is the right path: the obvious button does
the obvious thing, the natural call shape produces the natural result.
*Hard to use incorrectly* means the interface anticipates the predictable
mistakes (swapped arguments, wrong sequence, nonsensical combinations) and
makes them awkward or impossible — disabled commands, parameters whose
order can't be confused, types that reject illegal states. The technique
Meyers recommends: walk the interface through real use cases before it
exists (mock it, sketch the calls, write the test), then iterate it after
release based on the misuses you actually observe. Interfaces exist for the
caller's convenience, not the implementer's.

**Agent application.** Headline rule of the entire skill. Source for
decision 1 and the framing under which decisions 2–9 are tactics. Multiple
Red Flags cite #55 directly because most of the bad-API thoughts ("I'll
document the right way," "internal API, rules don't apply") are this
principle being violated.

---

## #59 — Missing Opportunities for Polymorphism

**Author:** Kirk Pepperdine
**Source (primary):** https://github.com/97-things/97-things-every-programmer-should-know/blob/master/en/thing_59/README.md
**Source (reading aid):** n/a (no Medium link in TOC)
**Source used:** GitHub mirror (CC-BY-3.0).
**Access date:** 2026-05-04
**Gaps:** None.

**Distillation.** When a caller has to inspect a type tag or enum to choose
which behavior to invoke, the API has handed a closed-set decision back to
every call site that ever needs to make it. The shopping-cart example: an
`Item` that may ship by surface mail or by email. A flag plus an `if/else`
in the shipping code re-implements the choice everywhere; an `Item`
interface with `ship(shipper)` implementations on `SurfaceItem` and
`DownloadableItem` puts the choice inside the type that already knows the
answer. The Command and Double Dispatch patterns are the formal names for
this rearrangement. Pepperdine's blunt metric: count the `if`/`switch`
statements that branch on type, and that's roughly the number of missed
polymorphism opportunities. Conditionals are sometimes simpler — but
default to the polymorphic shape and justify the conditional when you
keep one.

**Agent application.** Source for decision 9 ("reach for polymorphism
before chains of `if`/`switch` on type tags") and the Red Flag about three
cases that will become thirty. Bounds the type-system advice in #84 —
once you have explicit state types, polymorphism is how operations dispatch
on them without callers re-checking the tag.

---

## #65 — Prefer Domain-Specific Types to Primitive Types

**Author:** Einar Landre
**Source (primary):** https://github.com/97-things/97-things-every-programmer-should-know/blob/master/en/thing_65/README.md
**Source (reading aid):** n/a (no Medium link in TOC)
**Source used:** GitHub mirror (CC-BY-3.0).
**Access date:** 2026-05-04
**Gaps:** None.

**Distillation.** The Mars Climate Orbiter was lost because one piece of
ground software produced thrust values in pounds and the spacecraft expected
newtons — a unit confusion that no amount of careful coding inside a
function would have caught, because the function signature accepted
`double` either way. Domain-specific types (`Newtons`, `Pounds`,
`VelocityInKnots`, `DistanceInNauticalMiles`) make the confusion impossible
at the boundary: in a static language, the wrong call doesn't compile; in
a dynamic language, a small wrapper class plus a unit test gives the same
readability and the same single point to encapsulate domain rules. Custom
types are also more readable, more testable, and more reusable than the
primitives they replace, because they carry domain meaning rather than
just bit patterns.

**Agent application.** Source for decision 5 ("prefer domain-specific types
to primitives") and the Red Flag about taking a `string` because callers
"can pass whatever." Companion to #84 — domain types model values; #84
models *valid sequences* of operations on them.

---

## #66 — Prevent Errors

**Author:** Giles Colborne
**Source (primary):** https://github.com/97-things/97-things-every-programmer-should-know/blob/master/en/thing_66/README.md
**Source (reading aid):** n/a (no Medium link in TOC)
**Source used:** GitHub mirror (CC-BY-3.0).
**Access date:** 2026-05-04
**Gaps:** None.

**Distillation.** Error messages mark a breakdown in communication between
the user and the system — and most caller "mistakes" are predictable, which
means the interface drew them in. Better tactics, in roughly preferred
order: eliminate the possibility of the error (a date picker rather than a
free-text date field); when free input is unavoidable, parse the common
formats leniently rather than rejecting `29 / 07 / 2012` because of the
spaces; offer cues at the point of interaction (a `DD/MM/YYYY` placeholder)
rather than instructions in a separate paragraph that goes unread; provide
smart defaults reflecting the common case; tolerate destructive mistakes
with multi-level undo; and log the undos to find the systematic interface
bugs that lure users into the same wrong action repeatedly. Colborne's
framing is for end-user UIs, but the same logic applies to function
signatures: the "user" is the caller, and the same techniques translate.

**Agent application.** Source for decision 2 ("prevent errors at the call
site, not in the error message") and the Red Flag about clear error
messages standing in for a better signature. Reinforces #55 by giving
concrete tactics — eliminate, parse leniently, cue, default — for making
incorrect use hard.

---

## #84 — Thinking in States

**Author:** Niclas Nilsson
**Source (primary):** https://github.com/97-things/97-things-every-programmer-should-know/blob/master/en/thing_84/README.md
**Source (reading aid):** n/a (no Medium link in TOC)
**Source used:** GitHub mirror (CC-BY-3.0).
**Access date:** 2026-05-04
**Gaps:** None.

**Distillation.** Programmers tend to handle state vaguely, and the bugs
hide in plain sight. An `Order.isComplete()` defined as `isPaid() &&
hasShipped()` looks reasonable until you notice that an order can't ship
before it's paid, so `hasShipped` already implies `isPaid` and the
conjunction is wrong-headed. The real model has named states — in-progress,
paid, shipped — with explicit rules about which operations are legal in
each and which transitions are allowed. Ways to start: extract telling
expressions into named methods; learn finite state machines (drawing them
helps); test-drive the code so invalid transitions surface as failing
tests; study the State pattern and Design by Contract. If the per-method
state checks feel like noise, code generation or aspects can hide them —
but the underlying clarity is the win.

**Agent application.** Source for decision 6 ("model state explicitly;
reject illegal operations by type or guard") and the Red Flag about
implicit ordering of method calls. Pairs with #65 (types for values) and
#59 (polymorphism for dispatch) to form the type-system tactics that cash
out the headline rule from #55.
