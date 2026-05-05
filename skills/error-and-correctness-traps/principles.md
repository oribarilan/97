# error-and-correctness-traps — principles

Long-form per-principle distillations. The summary in `SKILL.md` is what the
agent loads on trigger; this file is the on-demand reference for when a
deeper cut is needed on a specific principle.

All nine principles come from *97 Things Every Programmer Should Know*
(O'Reilly, ed. Kevlin Henney, 2010). Originals are CC-BY-3.0 at the canonical
mirror: https://github.com/97-things/97-things-every-programmer-should-know.

Distillations below are original commentary in our own words. No verbatim
quotes longer than ~25 words. If a contributor objects to a particular
distillation, file an issue and the file will be revised or removed.

A note on attribution: the canonical mirror byline for 97/29 reads
"AlanGriffiths" without a space; we use "Alan Griffiths" for readability.
For 97/89 the mirror reads "JC van Winkel"; we use the longer form
"Jan Christiaan \"JC\" van Winkel" used in the project's source-tracking docs.

---

## 97/21 — Distinguish Business Exceptions from Technical

**Author:** Dan Bergh Johnsson
**Source:** https://github.com/97-things/97-things-every-programmer-should-know/blob/master/en/thing_21/README.md
**License:** CC-BY-3.0

**Distillation.** Two reasons code throws at runtime: a *technical* problem
prevents the system from continuing (bad arguments to a library, an
unresponsive database, a programmer error like indexing past the end of an
array), or a *business* rule prevents a request from being honored
(insufficient funds for a withdrawal, a slot already booked). Modern
languages signal both with the same exception machinery, but the situations
are different in kind. Technical exceptions can't be resolved by the
caller — they belong to a top-level handler that puts the system in a safe
state, logs, alerts, and returns a polite message to the user. Business
exceptions are part of the API contract — an alternative return path the
caller is *expected* to handle on its own terms. Mixing the two into one
hierarchy blurs both contracts: the caller doesn't know what to validate
beforehand or what to recover from afterward. Give them separate types,
ideally separate hierarchies, so a generic catch can route them differently.

**Agent application.** Source for checklist step 1 ("distinguish business
exceptions from technical ones") and the matching Red Flag. The skill
applies Bergh Johnsson's split as the first decision when the agent writes
or modifies an exception type or a `throw`.

---

## 97/26 — Don't Ignore That Error!

**Author:** Pete Goodliffe
**Source:** https://github.com/97-things/97-things-every-programmer-should-know/blob/master/en/thing_26/README.md
**License:** CC-BY-3.0

**Distillation.** Goodliffe opens with a leg injury he ignored to keep his
plans — turned out to be a fractured shin. The same impulse, applied to
code, costs more than a limp. Errors arrive in three flavors. *Return
codes* are easy to ignore — almost nobody checks `printf`'s return value.
*`errno`-style globals* are easy to ignore, hard to use correctly, and
break under multi-threading. *Exceptions* can't be ignored — except they
can: `try { ... } catch (...) {}` is the canonical sin, at least loud
enough to spot in review. The downstream costs: brittle code with bugs
that can't be reproduced because the original failure was swallowed;
insecure code that attackers exploit through the gap between "the error
happened" and "anything responded to it"; and APIs that grow worse over
time, because every consumer who finds error handling tedious adds
another layer of swallowing. Goodliffe's prescription: expose every
potentially-erroneous condition in your interfaces, so callers can't
forget; and if handling errors feels onerous, the interface is wrong —
fix the interface, don't bury the error.

**Agent application.** Source for checklist step 2 ("never write the
empty catch") and two Red Flags ("empty catch is fine" and the implicit
swallowing pattern). The skill turns Goodliffe's prescription into a
non-negotiable: no swallowed exceptions, no unchecked return codes on
calls that can fail.

---

## 97/29 — Don't Rely on "Magic Happens Here"

**Author:** Alan Griffiths
**Source:** https://github.com/97-things/97-things-every-programmer-should-know/blob/master/en/thing_29/README.md
**License:** CC-BY-3.0
"Alan Griffiths."

**Distillation.** From far enough away, any complex activity looks simple.
Managers without programming experience think programming is simple;
programmers without management experience think management is simple. The
hard part of programming — thinking — is invisible from outside, so its
absence isn't noticed until something breaks. People periodically try to
remove the need for skilled thinking from software (COBOL was supposed to
make programmers redundant; instead it created a new specialty). When
you aren't actively involved in some part of a system, you tend to assume
it works "by magic." That assumption is fine while the magic continues.
When (not if) the magic stops, the project is in trouble. Griffiths
gives examples: weeks lost because no one understood that the build
relied on a particular DLL load order; a department that fired its
project manager because everything was running smoothly, and collapsed
six months later. You don't need to understand every piece of magic in
your stack — but you should understand *some* of it, know who understands
the rest, and at minimum know how to restart the magic when it stops.

**Agent application.** Source for checklist step 3 ("don't rely on magic")
and the "nobody knows how this build step works" Red Flag. In agent
context, the equivalent magic is the unverified assumption — the build
script that "just works," the env var that "must be set somewhere,"
the framework behavior the agent has not actually confirmed.

---

## 97/33 — Floating-Point Numbers Aren't Real

**Author:** Chuck Allison
**Source:** https://github.com/97-things/97-things-every-programmer-should-know/blob/master/en/thing_33/README.md
**License:** CC-BY-3.0

**Distillation.** Floats are not the real numbers — they are finite,
unevenly-spaced rationals that approximate reals only inside narrow
windows. Allison's demonstration: assign 2,147,483,647 (max signed int32)
to a 32-bit `float`. Print it back: 2,147,483,648 — already off by one,
because the spacing in that range is 128. Subtract 64 and the value
doesn't change at all. IEEE 754 floats represent numbers as
`1.d1d2…dp-1 × 2^e` with precision *p* (24 for `float`, 53 for `double`),
and the spacing at value *x* is approximately ε|x| where ε is machine
epsilon. Two practical consequences. First, never ask an iterative
root-finder for a tolerance tighter than the local spacing — it will
loop forever. Second, watch for *catastrophic cancellation*: subtracting
nearly-equal floats promotes roundoff error into the most significant
digits. The classic example is the quadratic formula on
`x² - 100000x + 1 = 0` — `-b + sqrt(b² - 4)` cancels badly for the
small root; compute one root and derive the other from `r1 r2 = c/a`.
The same shape of failure shows up in series with alternating signs
(e.g. `e^x` for large negative *x* — compute `1 / e^|x|` instead).
And: don't use float for money. Floats trade accuracy for efficiency;
in financial code, efficiency without accuracy is worth nothing.

**Agent application.** Source for the Numerics sub-section (checklist
steps 4–6) and three Red Flags. The skill carries Allison's three
practical rules — no `==` for floats, watch for cancellation, decimal
for money — straight into the agent's per-domain checklist.

---

## 97/41 — Inter-Process Communication Affects Application Response Time

**Author:** Randy Stafford
**Source:** https://github.com/97-things/97-things-every-programmer-should-know/blob/master/en/thing_41/README.md
**License:** CC-BY-3.0

**Distillation.** Performance literature still focuses on data structures
and algorithms — but in modern multi-tier applications, response time is
dominated by the number of remote inter-process communications per user
stimulus. Each remote call is non-trivial latency; sequential calls add
up. The canonical example is ORM lazy-loading: a page that triggers
1,000 sequential 10ms database round-trips has at least a 10-second
response time before any rendering work begins. The same shape applies
to chained REST calls, RPC, request-reply messaging, and data-grid
interactions. Stafford prescribes three strategies. *Parsimony* — design
each round-trip to carry exactly the data needed, no more, no less, with
the minimum interaction count. *Parallelism* — issue independent calls
concurrently so overall latency is bounded by the longest call rather
than the sum. *Caching* — keep previous results so future stimuli avoid
the IPC entirely. In poorly-performing applications, IPC-to-stimulus
ratios in the thousands are common; reducing that ratio pays off more
than tweaking algorithms.

**Agent application.** Source for checklist step 8 ("count IPCs per user
stimulus") and step 9's retry-without-backoff Red Flag. The skill turns
Stafford's framing into a write-time check: when the agent adds a remote
call, count how many round-trips one user action will produce, and
batch / parallelize / cache before the count grows.

---

## 97/46 — Know Your Limits

**Author:** Greg Colvin
**Source:** https://github.com/97-things/97-things-every-programmer-should-know/blob/master/en/thing_46/README.md
**License:** CC-BY-3.0

**Distillation.** Resources — time, money, attention, hardware — are
limited; design has to respect that. Colvin invokes Sean Parent's
collapse of big-O classes for any feasible *n* into "near-constant,
near-linear, or near-infinite" — useful as a first cut, but complexity
analysis assumes an abstract machine. Real machines have orders of
magnitude variation across the cache hierarchy: register access well
under a nanosecond, L1 ~1ns, L2 ~4ns, RAM ~20ns, disk ~10ms, LAN ~20ms,
internet ~100ms. Caching and lookahead hide this variation only when
access is predictable; cache-miss-heavy access patterns thrash and
collapse to disk speed. The practical lesson: an algorithm with worse
big-O complexity but a friendlier access pattern can beat a "better"
algorithm that thrashes. Linear search beats binary search for small
arrays because it streams through cache; a van Emde Boas tree beats a
binary tree at scale because its layout is cache-oblivious. The only
reliable arbiter is measurement, on the actual data, on the actual
hardware.

**Agent application.** Source for checklist step 12 ("respect the cache
hierarchy when it dominates") and the data-structure Red Flag in
combination with 97/89. The skill applies Colvin's argument as a brake
on perf-by-reasoning: when performance matters, measurement is the
arbiter, not big-O on its own.

---

## 97/57 — Message Passing Leads to Better Scalability in Parallel Systems

**Author:** Russel Winder
**Source:** https://github.com/97-things/97-things-every-programmer-should-know/blob/master/en/thing_57/README.md
**License:** CC-BY-3.0

**Distillation.** Concurrency has a reputation for being hard, and most of
that hardness traces to one root cause: shared mutable memory. Race
conditions, deadlocks, and livelocks are all symptoms of multiple threads
mutating the same state. Two ways out: forgo concurrency, or eschew
shared memory. The first is no longer an option — clock speeds aren't
climbing, and parallelism is the only path to further performance — so
the practical answer is the second. Replace threads-on-shared-memory
with processes (independent state with executing code, not necessarily
OS processes) communicating by message passing. Erlang and occam show
this works in production. The formal model is Communicating Sequential
Processes; the modern incarnations are actor frameworks, Go-style
channels, and dataflow systems where evaluation is driven by data
readiness rather than synchronization primitives. Mainstream languages
(C/C++/Java/Python) present concurrency as shared-memory threading;
prefer libraries that give you a process model and message passing on
top of those threads.

**Agent application.** Source for checklist step 7 ("default to message
passing over shared mutable state") and the lock-around-shared-map Red
Flag. The skill turns Winder's framing into a write-time default:
reach for shared state + locks only when you've measured and understood
the need.

---

## 97/73 — Resist the Temptation of the Singleton

**Author:** Sam Saariste
**Source:** https://github.com/97-things/97-things-every-programmer-should-know/blob/master/en/thing_73/README.md
**License:** CC-BY-3.0

**Distillation.** Singletons are tempting — only one instance is needed,
the instance is guaranteed initialized, and there's a single global
access point. Experience shows the costs outweigh the benefits in most
cases. The single-instance assumption is often premature, and once
broadcast across the design it becomes painful to back out. The global
access point introduces hidden coupling between conceptually independent
units, which makes unit tests hard to write because you can't substitute
mock implementations. Singletons hold implicit persistent state, which
breaks test independence and is hard to reason about in multi-threaded
contexts. Naive locking around a singleton is slow; the famous
double-checked locking pattern is broken in many languages without
explicit memory-model support. Singletons have no defined cleanup order
at shutdown, which fails badly when several singletons depend on each
other or on a plug-in lifecycle. Saariste's prescription: restrict
singletons to classes that genuinely cannot be instantiated more than
once, and even then don't use the global access point from arbitrary
code. Access the singleton from a few well-defined construction sites,
and pass the dependency to other code through an interface — the other
code is then unaware whether a singleton or any other class implements
the interface, which restores both substitutability and testability.

**Agent application.** Source for checklist steps 13 and 14 (the
Globals & Singletons sub-section) and the matching Red Flag. The skill
turns Saariste's prescription into a write-time gate: a new singleton
must be justified, narrowly scoped, and fronted by an interface so tests
can substitute it.

---

## 97/89 — Use the Right Algorithm and Data Structure

**Author:** Jan Christiaan "JC" van Winkel
**Source:** https://github.com/97-things/97-things-every-programmer-should-know/blob/master/en/thing_89/README.md
**License:** CC-BY-3.0
the principles table.

**Distillation.** A bank's tellers were threatening to drop the contract
because their computers were too slow. Profiling found one program
consuming nearly all CPU; the offender was
`for (i = 0; i < strlen(s); ++i) { ... s[i] ... }`, where `s` was
thousands of characters and `strlen` ran every iteration, scanning the
string each time — turning O(n) work into O(n²). Hoisting `n = strlen(s)`
out of the loop made the tellers happy. The adage "first make it work,
then make it work fast" too often becomes "first make it work slowly."
Beyond loop invariants: data-structure choice has user-perception
consequences at scale. Linked list vs. hash vs. balanced tree on a
million items is the difference between snappy and unusable. Don't
reinvent algorithms — use the libraries — but knowing which library to
reach for, when, requires algorithm and data-structure literacy. The
exception that proves the rule: sometimes the "bad" algorithm is right
for the input. Sorting the five Yahtzee dice with bubble sort is fine —
n is bounded and tiny — and the simpler code wins.

**Agent application.** Source for checklist steps 10 and 11 (data
structure choice and loop-invariant hoisting) and two Red Flags. The
skill carries van Winkel's two stories — pick the structure for the
access pattern, and never recompute invariants in a hot loop — into the
agent's per-domain checks.

---

## Beyond *97 Things* — Release It! stability patterns

The five principles below come from Michael Nygard's *Release It!*
(2nd ed., Pragmatic Bookshelf, 2018), ch. 5 ("Stability Patterns").
They sit naturally in this skill because the trigger is the same —
*the call can fail* — but Nygard's lens is the one that fires hardest
when a remote call will run under load in production. Stakes
calibration in the skill's Overview and Non-triggers applies: in
MVPs, prototypes, internal dev tools, and one-off scripts, prefer
the simplest thing that works.

`RI/CircuitBreaker` is the canonical home for the circuit-breaker
pattern; `observability` cross-references it because open-circuit
events should be observable.

---

## RI/Timeout — Always Set a Timeout

**Author:** Michael Nygard
**Source:** Release It!, 2nd ed., Pragmatic Bookshelf 2018, ch. 5
**License:** fair-use commentary

**Distillation.** Library defaults for HTTP / DB / RPC clients are
frequently `None`, "infinity", or "minutes-to-hours" — wrong defaults
for any production caller. A request with no timeout becomes a
thread, connection, and queue slot held forever once the downstream
hangs; saturate enough of those and the local service stops accepting
work. Set an explicit per-call timeout based on the downstream's
realistic latency budget plus a margin; cap retries inside that
budget. The timeout is not a polite suggestion — it is a contract
with the caller about how long they will wait before getting an
error.

**Agent application.** Surfaces in `SKILL.md` Red Flags as "HTTP
call with no explicit timeout" and reinforces checklist step 9 (the
retry rule). Pairs with `RI/CircuitBreaker` — circuit breakers need
timeouts to recognize "this is taking too long" before opening.

---

## RI/CircuitBreaker — Circuit Breaker

**Author:** Michael Nygard
**Source:** Release It!, 2nd ed., Pragmatic Bookshelf 2018, ch. 5
**License:** fair-use commentary

**Distillation.** When a downstream is failing, calling it harder
makes both services worse. A circuit breaker tracks recent failures
per downstream; once failures cross a threshold, it *opens* and
short-circuits subsequent calls (instant failure with a clear error)
for a window. After the window, it allows a probe call; success
closes the circuit. The pattern decouples the caller's health from
the callee's by giving the caller a fast local "no" instead of a
long blocking failure. Distinct from retry/backoff (which is the
"how long to wait between attempts" axis); the circuit breaker is
"should we attempt at all right now."

**Agent application.** Surfaces in `SKILL.md` Red Flags as "retrying
a failing downstream in a tight loop" / "no breaker on a critical
external call." Cross-referenced from `observability` — open-circuit
events should be observable so operators know when a downstream is
out.

---

## RI/Bulkhead — Bulkhead

**Author:** Michael Nygard
**Source:** Release It!, 2nd ed., Pragmatic Bookshelf 2018, ch. 5
**License:** fair-use commentary

**Distillation.** Isolate resources per downstream so a single failing
dependency cannot exhaust capacity for the healthy ones. Concretely:
separate thread pools, connection pools, queues, or even processes
for different downstreams; a 50-slot pool for the slow third-party
API does not share with the 200-slot pool for the local DB. When the
third-party stalls, the third-party pool fills and rejects further
calls; the DB pool keeps serving requests that don't depend on the
third-party. Without bulkheads, one stalled downstream consumes every
free thread and the whole service goes dark.

**Agent application.** Surfaces in `SKILL.md` Red Flags as "all
downstreams share one connection / thread pool" / "one slow third
party blocks the whole service." Pairs with `RI/Timeout` and
`RI/CircuitBreaker` — bulkheads contain the blast radius the other
two patterns reduce.

---

## RI/Backpressure — Backpressure / Bounded Queues

**Author:** Michael Nygard
**Source:** Release It!, 2nd ed., Pragmatic Bookshelf 2018, ch. 5
**License:** fair-use commentary

**Distillation.** An unbounded queue is an OOM in slow motion. When
producers outrun consumers, every additional item buffers in memory
forever; the system reports healthy throughput right up to the
moment it falls over. Use bounded queues with an explicit reject
policy (drop oldest, drop newest, reject with backpressure to the
caller). Backpressure is the only way the system tells callers
"slow down" instead of accumulating until it dies. Concrete trap:
a metrics-collection background queue with no upper bound that
accumulates entries during a brief downstream outage and never
drains.

**Agent application.** Surfaces in `SKILL.md` Red Flags as
"unbounded queue / channel / list grows on retry." Pairs with
`RI/Timeout` — bounded waits at every layer.

---

## RI/FailFast — Fail Fast

**Author:** Michael Nygard
**Source:** Release It!, 2nd ed., Pragmatic Bookshelf 2018, ch. 5
**License:** fair-use commentary

**Distillation.** When a request cannot succeed, fail it now; do not
hold resources hoping the situation improves. Concrete patterns:
validate inputs at the entry point (return 400 before reaching the
DB); check feature flags and dependency health before doing
expensive setup; if a circuit is open, return immediately with the
appropriate error rather than queuing. Late failure burns the
resources the request held — DB connections, locks, downstream
quota — and amplifies cascading collapse. Fast failure is an act
of mercy toward the rest of the system.

**Agent application.** Surfaces in `SKILL.md` Red Flags as "request
validation happens after expensive work" and "no early-return on a
known-impossible request." Pairs with `RI/Timeout` (don't hang) and
`RI/CircuitBreaker` (when open, fail fast locally).
