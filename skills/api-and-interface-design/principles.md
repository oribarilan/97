# api-and-interface-design — principles

Long-form per-principle distillations. The summary in `SKILL.md` is what the
agent loads on trigger; this file is the on-demand reference for when a
deeper cut is needed on a specific principle.

All ten principles come from *97 Things Every Programmer Should Know*
(O'Reilly, ed. Kevlin Henney, 2010). Originals are CC-BY-3.0 at the canonical
mirror: https://github.com/97-things/97-things-every-programmer-should-know.

Distillations below are original commentary in our own words. No verbatim
quotes longer than ~25 words. If a contributor objects to a particular
distillation, file an issue and the file will be revised or removed.

---

## 97/7 — Beware the Share

**Author:** Udi Dahan
**Source:** https://github.com/97-things/97-things-every-programmer-should-know/blob/master/en/thing_07/README.md
**License:** CC-BY-3.0

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
encapsulation pressure from 97/32 — encapsulate within a context, don't
universalize across them.

---

## 97/19 — Convenience Is not an -ility

**Author:** Gregor Hohpe
**Source:** https://github.com/97-things/97-things-every-programmer-should-know/blob/master/en/thing_19/README.md
**License:** CC-BY-3.0

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
Pairs with 97/55 — flag-driven overloads are the canonical example of an
interface that is *easy to use incorrectly*.

---

## 97/32 — Encapsulate Behavior, Not Just State

**Author:** Einar Landre
**Source:** https://github.com/97-things/97-things-every-programmer-should-know/blob/master/en/thing_32/README.md
**License:** CC-BY-3.0

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

## 97/35 — The Golden Rule of API Design

**Author:** Michael Feathers
**Source:** https://github.com/97-things/97-things-every-programmer-should-know/blob/master/en/thing_35/README.md
**License:** CC-BY-3.0

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

## 97/55 — Make Interfaces Easy to Use Correctly and Hard to Use Incorrectly

**Author:** Scott Meyers
**Source:** https://github.com/97-things/97-things-every-programmer-should-know/blob/master/en/thing_55/README.md
**License:** CC-BY-3.0

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
Red Flags cite 97/55 directly because most of the bad-API thoughts ("I'll
document the right way," "internal API, rules don't apply") are this
principle being violated.

---

## 97/59 — Missing Opportunities for Polymorphism

**Author:** Kirk Pepperdine
**Source:** https://github.com/97-things/97-things-every-programmer-should-know/blob/master/en/thing_59/README.md
**License:** CC-BY-3.0

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
cases that will become thirty. Bounds the type-system advice in 97/84 —
once you have explicit state types, polymorphism is how operations dispatch
on them without callers re-checking the tag.

---

## 97/65 — Prefer Domain-Specific Types to Primitive Types

**Author:** Einar Landre
**Source:** https://github.com/97-things/97-things-every-programmer-should-know/blob/master/en/thing_65/README.md
**License:** CC-BY-3.0

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
"can pass whatever." Companion to 97/84 — domain types model values; 97/84
models *valid sequences* of operations on them.

---

## 97/66 — Prevent Errors

**Author:** Giles Colborne
**Source:** https://github.com/97-things/97-things-every-programmer-should-know/blob/master/en/thing_66/README.md
**License:** CC-BY-3.0

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
messages standing in for a better signature. Reinforces 97/55 by giving
concrete tactics — eliminate, parse leniently, cue, default — for making
incorrect use hard.

---

## 97/76 — The Single Responsibility Principle (at the boundary)

**Author:** Robert C. Martin
**Source:** https://github.com/97-things/97-things-every-programmer-should-know/blob/master/en/thing_76/README.md
**License:** CC-BY-3.0

**Distillation.** The 97-Things essay frames SRP at unit scope: gather things that change for the same reason, separate things that change for different reasons. The same axis-of-change test applies at the module boundary. An exported `Repository` with fourteen methods serving three callers, each of whom uses two, has handed out one surface where it should have handed out three. The cohesion failure is not the implementation's — it is the contract's. The fix is the dual of decision 3's "encapsulate behavior on the type that owns the state": the exported surface should bundle one coherent reason for callers to depend on it. ISP ("clients shouldn't depend on methods they don't use") is one consequence of running this check at the API boundary, not a synonym; ISP also covers role-based interface segregation (`Customer` vs `Auditor` views of the same object), which decision 6 (state types) and decision 7 (vocabulary) gesture at separately. Adjacency with `Ousterhout/DeepModules`: deep modules is about *interface/implementation ratio* — a small surface hiding a lot. SRP-at-boundary is about *cohesion of the exported surface* — whatever its size, one reason for callers to depend on it. Different observations, both worth keeping.

**Agent application.** Source for the boundary-level cohesion bullet in decision 3 ("encapsulate behavior, not just state") and the Red Flag about wedging a second concern onto a class because "it's already imported here." Reuses `97/76` from `writing-clean-code`, where the unit-level discipline lives — citation reuse across skills is precedented (`97/30` appears in both `writing-clean-code` and `before-you-refactor`). The unit-level form fires while writing the function; this boundary-level form fires while designing the export.

---

## 97/84 — Thinking in States

**Author:** Niclas Nilsson
**Source:** https://github.com/97-things/97-things-every-programmer-should-know/blob/master/en/thing_84/README.md
**License:** CC-BY-3.0

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
implicit ordering of method calls. Pairs with 97/65 (types for values) and
97/59 (polymorphism for dispatch) to form the type-system tactics that cash
out the headline rule from 97/55.

---

## Beyond *97 Things* — Ousterhout, Liskov, King

The four principles below sharpen the headline rule (`97/55`) with
three additional sources: Ousterhout on module depth and
designing errors out of existence; Liskov on substitutability; and
Alexis King on parsing untrusted input at the boundary. This skill
is the canonical home for `King/ParseDontValidate`;
`domain-modeling` cross-references it for the related
make-invalid-states-unrepresentable principle.

Hyrum's Law is registered as a Red Flag reference (`Hyrum/Law`) but
not as a principle row — see the file-level note below the four
principles.

---

## Ousterhout/DeepModules — Deep Modules

**Author:** John Ousterhout
**Source:** A Philosophy of Software Design, 2nd ed., Yaknyam Press 2021, ch. 4
**License:** fair-use commentary

**Distillation.** A *deep* module hides a lot of implementation
behind a small interface; a *shallow* module exposes most of its
implementation through its interface and gives the caller little
benefit. The cost of an interface is the complexity it forces every
caller to learn; the value is the complexity it hides. When designing
an interface, prefer fewer / more-powerful methods that hide
complexity over many / thin methods that expose it. A class with
twelve public methods that each forward to one private method is
shallow — the abstraction did not pay for itself.

**Agent application.** Surfaces in `SKILL.md` Red Flags as "interface
with twelve methods that mostly forward to internals" and as a
checklist step at design time. Sharpens the headline rule (`97/55`):
deep modules make wrong code hard to write because the surface area
is small.

---

## Ousterhout/DefineErrorsOutOfExistence — Define Errors Out of Existence

**Author:** John Ousterhout
**Source:** A Philosophy of Software Design, 2nd ed., Yaknyam Press 2021, ch. 10
**License:** fair-use commentary

**Distillation.** Design APIs so error conditions cannot arise rather
than building handlers for them. Concrete patterns: a
`substring(start, end)` that clamps out-of-range indices instead of
throwing; a `delete(file)` that is idempotent so "file does not
exist" is not an error; a `lookup` that returns `Option`/`Maybe`
rather than throwing `NotFound`. The principle is not "swallow
errors"; it is "redefine the operation so the case the caller would
have to handle is no longer exceptional." Fewer error paths to test;
fewer caller-side `if (err != nil)` branches; fewer ways for the
caller to forget to handle the case.

**Agent application.** Surfaces in `SKILL.md` Red Flags as "an API
that throws on a case the caller commonly faces" and pairs with
`97/66` (Prevent Errors). Pairs with `King/ParseDontValidate` —
parsing turns "is this a valid email?" from a runtime check into a
type the caller cannot construct from invalid input.

---

## Liskov/LSP — Liskov Substitution Principle

**Author:** Barbara Liskov
**Source:** "Data Abstraction and Hierarchy", CACM 1987
**License:** fair-use commentary

**Distillation.** A subtype must be substitutable for its supertype
without breaking caller assumptions. If overriding a method
strengthens preconditions ("only accepts non-empty input now"),
weakens postconditions ("now returns `null` sometimes"), or throws
on inputs the parent accepts, the hierarchy is wrong. Concrete
trap: `Square extends Rectangle` and overrides `setWidth` to also
set height — caller code written against `Rectangle` breaks. The
principle fires when designing inheritance hierarchies, not as a
general-purpose API rule.

**Agent application.** Surfaces in `SKILL.md` Red Flags as "subclass
overriding to throw `NotImplementedError`" and as a check before
introducing inheritance. The pragmatic version: prefer composition
over inheritance unless the substitutability test passes for every
caller of the supertype.

---

## King/ParseDontValidate — Parse, Don't Validate

**Author:** Alexis King
**Source:** https://lexi-lambda.github.io/blog/2019/11/05/parse-don-t-validate/
**License:** fair-use commentary

**Distillation.** At a public API boundary, parse untrusted input
into a domain type that proves its shape; do not "validate and pass
through" a primitive. The parser returns `Result<T, E>` (or in
dynamic languages: a parsed domain object or a structured error,
with no path that returns the raw input). After the boundary, the
rest of the code works in domain types — `EmailAddress`, not
`string`; `NonEmpty<User>`, not `List<User>` plus a runtime check.
The contract is encoded once at the parser; downstream code stops
re-checking. **This skill is the canonical home for parse-don't-
validate**; `domain-modeling` cross-references it for the internal-
invariant counterpart `Wlaschin/InvalidStatesUnrepresentable`, and
`security-and-trust-boundaries` cross-references it for the
trust-boundary case.

**Agent application.** Surfaces in `SKILL.md` Red Flags as "boundary
handler returns the raw input type with `validated = true` flag"
and as a checklist step. Pairs with `Ousterhout/DefineErrorsOutOfExistence`
— a parsed type defines "invalid input" out of existence after the
parser.

---

## Hyrum's Law — failure-mode reference (no principle row)

`Hyrum/Law` (https://www.hyrumslaw.com/) is the failure mode for any
long-lived public API: **any observable behavior of an API will be
depended on by someone**. The implication is that the de facto
contract is broader than the documented one. We do not give Hyrum's
Law a principle row of its own — it is the reason the principles
above matter rather than a separate principle. It surfaces in
`SKILL.md` Red Flags as a single row reminding the agent to reason
about the new API as if its current observable behavior were
private.
