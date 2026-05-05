# domain-modeling — principles

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

## 97/2 — Apply Functional Programming Principles

**Author:** Edward Garson
**Source:** https://github.com/97-things/97-things-every-programmer-should-know/blob/master/en/thing_02/README.md
**License:** CC-BY-3.0

**Distillation.** Functional programming's central design property is
*referential transparency*: a function returns the same result for the same
input, regardless of when or where it is called, with no hidden dependence on
mutable state. A leading source of defects in imperative code is mutable
variables — tracking down "why is this value not what I expect?" usually
traces back to an unexpected mutation somewhere. Designs that lean on small
functions taking explicit arguments, rather than large objects mutating each
other through method calls, are easier to debug because the place a rogue
value is introduced is local and visible. The discipline applies inside
object-oriented code: domain models specifically benefit from being modeled
as values with pure transformations rather than long-lived mutable graphs.
The recommendation isn't "use Haskell" — it's "internalize the model so your
OO designs resemble it."

**Agent application.** Source for decision 4 ("default to immutable value
types and pure transformations") and the "just a data class with mutable
fields" Red Flag. Garson's framing is broader than domain modeling
specifically; the lesson generalizes here as a default for new domain types.

---

## 97/11 — Code in the Language of the Domain

**Author:** Dan North
**Source:** https://github.com/97-things/97-things-every-programmer-should-know/blob/master/en/thing_11/README.md
**License:** CC-BY-3.0

**Distillation.** Compare two ways of expressing "this trader is allowed to
view this portfolio": a nested map lookup on raw integer IDs, versus a method
call `trader.canView(portfolio)`. The first leaks implementation detail and
forces every reader to reverse-engineer the business rule from a data
structure access. The second names the concept and hides the mechanism.
Once a language has user-defined types, modeling domain concepts as types —
and modeling the *relationships between them* with methods named after the
business meaning — is what separates code that documents its own intent from
code that hides it. Domain-language code also evolves better: when the rule
changes, it changes in one named place rather than across every site that
re-implements the lookup. The next reader of the code is often you, six
months on, and you will not remember what `portfolioIdsByTraderId.get(...)
.containsKey(...)` was for.

**Agent application.** This is the central principle of the skill. Source
for decisions 1, 2, and 7, and for the Red Flags about nested generic
collections, invented programmer terms, recurring `if` statements that
should be domain methods, and parallel competing definitions.

---

## 97/12 — Code Is Design

**Author:** Ryan Brush
**Source:** https://github.com/97-things/97-things-every-programmer-should-know/blob/master/en/thing_12/README.md
**License:** CC-BY-3.0

**Distillation.** Software's "construction" step — compilation, deployment —
is essentially free; the expensive activity is the design itself, which is
the act of writing the code. The often-cited "software crisis" is really a
design crisis: demand for validated designs outstrips capacity to produce
them, so unvalidated designs ship under competitive pressure. Two
implications follow. First, treat tests as the equivalent of physical
simulations — they are how a design is validated before it is relied upon.
Second, since design is a creative act, the only path to better software is
better designers practicing their craft, not better tooling that automates
the typing.

**Agent application.** Source for decision 3 ("treat this as design, not
typing") and the "I'll write the methods first" Red Flag. The skill uses
Brush's framing to argue that the moment of introducing a new domain
concept is a design decision deserving the same care as a type signature in
a public API.

---

## 97/23 — Domain-Specific Languages

**Author:** Michael Hunger
**Source:** https://github.com/97-things/97-things-every-programmer-should-know/blob/master/en/thing_23/README.md
**License:** CC-BY-3.0

**Distillation.** Experts in any field share a constrained vocabulary that
captures their domain efficiently; a domain-specific language brings that
vocabulary into executable code. *Internal* DSLs bend a host language's
syntax to read like the domain (fluent builders, method chaining, expressive
APIs in flexible languages like Ruby or Scala). *External* DSLs are
standalone textual or graphical languages with their own parser and
toolchain. The audience matters: the technical level of the language, the
tooling, the validation, and the visualization should match whether the
readers are developers, business analysts, or end users. The reward when it
fits is that domain experts can read — and sometimes write — the rules
directly, which speeds up both development and validation.

**Agent application.** Source for decision 6 ("consider whether this concept
needs its own little language"). The skill deliberately positions DSLs as
something to *recognize the smell of* rather than reach for first — most
domain modeling tasks don't justify a DSL, but recurring re-encoding of the
same constrained vocabulary across the codebase is the signal that one is
warranted.

---

## 97/48 — Large, Interconnected Data Belongs to a Database

**Author:** Diomidis Spinellis
**Source:** https://github.com/97-things/97-things-every-programmer-should-know/blob/master/en/thing_48/README.md
**License:** CC-BY-3.0

**Distillation.** Modern relational databases are cheap (open source options
like SQLite, PostgreSQL, MySQL), embeddable, and performant — the historical
reasons to avoid them no longer apply. When data is larger than RAM, an
indexed table beats a hand-rolled in-memory map by orders of magnitude.
SQL lets you express both queries and bulk modifications declaratively,
including ad-hoc one-off changes through a direct SQL interface that
sidesteps a full edit-compile-run cycle. Foreign-key constraints and cascade
rules eliminate the dangling-reference bugs that hand-rolled in-memory
relationships are prone to. Multiple applications can safely share the same
data, and the database optimizer handles the algorithmic tuning that would
otherwise dominate your code. The decision rule: if data is large,
persistent, or interconnected with consistency rules, default to a database
from the start rather than retrofitting one later.

**Agent application.** Source for decision 5 ("decide where the state lives
— before sketching methods") and the Red Flags about hand-rolled in-memory
maps for relational data and hand-rolled consistency between collections.
Spinellis's framing is specifically about RDBMSs; we apply it as the default
for size/persistence/interconnectedness, while leaving room for non-relational
stores when the access pattern genuinely doesn't fit.
