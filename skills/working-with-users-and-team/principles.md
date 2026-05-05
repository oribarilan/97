# working-with-users-and-team — principles

Long-form per-principle distillations. The summary in `SKILL.md` is what the
agent loads on trigger; this file is the on-demand reference for when a
deeper cut is needed on a specific principle.

All ten principles come from *97 Things Every Programmer Should Know*
(O'Reilly, ed. Kevlin Henney, 2010). Originals are CC-BY-3.0 at the canonical
mirror: https://github.com/97-things/97-things-every-programmer-should-know.

Distillations below are original commentary in our own words. No verbatim
quotes longer than ~25 words. Every distillation is followed by an explicit
"Before/When X, do Y" agent action — if a principle reads as a slogan without
a behavior attached, the agent has been given nothing useful.

If a contributor objects to a particular distillation, file an issue and the
file will be revised or removed.

---

## 97/3 — You Are Not the User (Ask "What Would the User Do?")

**Author:** Giles Colborne
**Source:** https://github.com/97-things/97-things-every-programmer-should-know/blob/master/en/thing_03/README.md
**License:** CC-BY-3.0

**Distillation.** Programmers assume other people think like programmers, and
unconsciously treat users who don't as defective. Users spend less time at
computers, do not care how software is built, and reach for none of the
mental models a developer takes for granted. Asking users what they want
produces unreliable answers; watching users attempt a real task produces
data. When users get stuck, they narrow attention to the immediate area —
guidance placed elsewhere on the screen will not be seen. Users muddle
through with whatever works and stick to it; one obvious path beats two
clever shortcuts.

**Agent action.** Before adding a UI affordance, list two alternative paths
a non-power-user might take and check the design accommodates both. When
writing user-facing help, place it at the point of action (inline, on the
control), not in a sidebar or modal the user must navigate to.

---

## 97/36 — The Guru Myth

**Author:** Ryan Brush
**Source:** https://github.com/97-things/97-things-every-programmer-should-know/blob/master/en/thing_36/README.md
**License:** CC-BY-3.0

**Distillation.** "I'm getting exception XYZ — do you know what's wrong?"
asked without stack trace, log, or context, treats the answerer as a guru
who divines solutions without analysis. The same pattern shows up in design
questions where the asker has the requirements and the docs but expects an
intelligent answer with no context handed over. Real experts apply ordinary
logic and systematic analysis; their advantage is years of refined process,
not magic. The guru myth harms both sides: the asker stops growing because
they expect answers without legwork, and propagating the myth (out of ego or
to inflate your value) makes you less useful, not more, because you stop
producing peers.

**Agent action.** When asking a senior engineer or domain expert for help,
deliver a bundle: the exact error or stack trace, what you tried, what you
expected, the smallest reproducer you can produce. When *being* asked, model
the analysis out loud rather than producing the answer — the goal is the
asker's next problem, not this one.

---

## 97/50 — Learn to Estimate

**Author:** Giovanni Asproni
**Source:** https://github.com/97-things/97-things-every-programmer-should-know/blob/master/en/thing_50/README.md
**License:** CC-BY-3.0

**Distillation.** Most "estimation" disagreements are vocabulary
disagreements. Three concepts are conflated. An **estimate** is an
approximate calculation from prior data and experience, with hopes and
wishes excluded; it is approximate by nature, never spuriously precise. A
**target** is a desired business outcome ("must support 400 concurrent
users", "must ship before the trade show"). A **commitment** is a promise to
deliver a specified scope at a specified quality by a specified date. The
three are independent. A target is not an estimate; a commitment should be
*based on* an estimate rather than negotiated against one. Steve McConnell's
framing: estimation's purpose is not predicting the outcome — it is checking
whether a target is realistic enough that the project can be controlled to
meet it.

**Agent action.** Before giving any number, name which of the three is being
asked for: estimate, target, or commitment. When pressure pushes for a
smaller number than your estimate supports, refuse to relabel — instead
reduce scope, change the team, or surface that the target will likely miss.

---

## 97/64 — Pair Program and Feel the Flow

**Authors:** Gudny Hauknes, Ann Katrin Gagnat, Kari Røssland
**Source:** https://github.com/97-things/97-things-every-programmer-should-know/blob/master/en/thing_64/README.md
**License:** CC-BY-3.0

**Distillation.** Flow — total absorption in the work, time disappearing —
is fragile in a team setting because of interruptions and context switches.
Pair programming protects flow in several ways: knowledge spreads so the
truck factor is not one; problems become dialog so an early suboptimal
solution gets revisited by the next pair; one partner can absorb an
interruption while the other keeps coding; new team members come up to
speed faster. Success requires patience with less experienced developers
and willingness to be vulnerable around more skilled ones. Rotate pairs and
tasks frequently — agree on a rotation rule, and do not require finishing a
task before rotating; the revisit is a feature.

**Agent action.** Before starting a non-trivial task on code only one person
knows, ask whether it should be paired. When pairing, set a rotation
trigger up front (every N hours, every test-green commit, every fresh
sub-task) rather than "until we are done."

---

## 97/77 — Start from Yes

**Author:** Alex Miller
**Source:** https://github.com/97-things/97-things-every-programmer-should-know/blob/master/en/thing_77/README.md
**License:** CC-BY-3.0

**Distillation.** Tech leads who view their job as protecting the codebase
from a stream of demands default to "no" and become a bottleneck. The
shift is to default to "yes" and treat the request as data. Many requests
that sound silly turn out to have a real driver — a customer with a
standards-committee mandate, a regulation, an integration deadline.
Asking why opens paths: sometimes the request is already achievable with
existing capability the asker did not know about; sometimes voicing the
reason makes the original "no" look wrong; sometimes the request really is
incompatible with the product, and then it gets escalated cleanly to the
right decision-maker rather than being silently refused.

**Agent action.** When a request lands, ask "what is this for?" before any
objection. If after the answer the request still cannot work as stated,
propose the closest thing that does work, or escalate to the decision-maker
with both the ask and the constraint laid out — never silently refuse.

---

## 97/85 — Two Heads Are Often Better Than One

**Author:** Adrian Wible
**Source:** https://github.com/97-things/97-things-every-programmer-should-know/blob/master/en/thing_85/README.md
**License:** CC-BY-3.0

**Distillation.** Collaboration is rolling up sleeves on the work jointly,
not asking and answering questions or sitting in meetings. Pair programming
is the extreme form. Both partners bring something: the weaker learns the
material, the stronger learns about their own knowledge by being forced to
articulate it. The "are we paying two people to do one's work?" objection
ignores quality, faster onboarding, technique transfer (IDE tricks, library
idioms), and risk distribution. Effects are hard to measure; one Nosek
study found a ~40% improvement in effectiveness and speed. Pair
configuration matters: a newer person paired with a knowledgeable engineer
who also has coaching skill, or a domain-naive engineer paired with a
domain expert, are the highest-yield combinations.

**Agent action.** When choosing a pair, prefer the configuration with the
strongest knowledge gradient. When unconvinced pairing is worth it, run
one timeboxed experiment (one task, two engineers, fixed pairing) and
compare against your usual solo baseline before deciding.

---

## 97/86 — Two Wrongs Can Make a Right (and Are Difficult to Fix)

**Author:** Allan Kelly
**Source:** https://github.com/97-things/97-things-every-programmer-should-know/blob/master/en/thing_86/README.md
**License:** CC-BY-3.0

**Distillation.** Two defects that compensate for each other present as zero
visible faults — until one of them is corrected. Apollo 11's lunar-module
software shipped this way and again on Apollo 12 before either bug was
found. A function returns the wrong value; a caller forgets to check the
return; the system works until someone adds the missing check. An XML node
is misnamed `TimeToLive` instead of `TimeToDie`; the writer and reader share
the bug, so it works until a third reader joins. Methodical debugging
breaks down: fix one defect, the symptom stays; revert; fix another,
symptom stays; the engineer dismisses two correct fixes. The damage spreads
into requirements docs and into users' learned workarounds — so a later
"correct" fix retrains every user.

**Agent action.** When a bug fix causes a previously-passing test to fail,
suspect a compensating defect before suspecting your fix. When you find a
documented or learned-by-users workaround that contradicts the design,
flag it and plan the migration before silently fixing it.

---

## 97/87 — Ubuntu Coding for Your Friends

**Author:** Aslam Khan
**Source:** https://github.com/97-things/97-things-every-programmer-should-know/blob/master/en/thing_87/README.md
**License:** CC-BY-3.0

**Distillation.** Software is technical work mixed with social work. Code
gets written in apparent isolation but is read, used, extended, and relied
on by other people. The Zulu philosophy of Ubuntu — "a person is a person
through other persons" — translates: "a developer is a developer through
other developers," and at the smallest scale, "code is code through other
code." Even clean code written carefully degrades to the level of the
neighbour code it has to call. The artifact is not the point; the act of
making it is — and the act includes leaving the next person who touches it
better off.

**Agent action.** Before opening a PR, ask: will the next engineer who
reads this file be a better developer for having read it? If not, improve
naming, split a long function, add the test that would have explained
intent, or write the comment that explains the non-obvious choice.

---

## 97/96 — You Gotta Care About the Code

**Author:** Pete Goodliffe
**Source:** https://github.com/97-things/97-things-every-programmer-should-know/blob/master/en/thing_96/README.md
**License:** CC-BY-3.0

**Distillation.** Good code is not produced by accident, intelligence, or
language mastery alone — highly intellectual programmers can produce
unreadable, unmaintainable code, and humble programmers who keep things
simple often produce elegant systems. The differentiator between adequate
and great is attitude: refusing to ship code that only seems to work,
choosing elegance and demonstrable correctness, prioritizing the team's
output over personal cleverness, leaving each touched file better than it
was found, and continuing to learn new techniques while applying them only
when appropriate.

**Agent action.** When you catch yourself thinking "it works but it is
ugly," stop and rewrite the small piece now — caring shows up in the small
decision under deadline, not in the retrospective. When choosing between a
clever construct and a plainer one that the team will read more easily,
default to the plainer one.

---

## 97/97 — Your Customers Do Not Mean What They Say

**Author:** Nate Jackson
**Source:** https://github.com/97-things/97-things-every-programmer-should-know/blob/master/en/thing_97/README.md
**License:** CC-BY-3.0
Nate Jackson.

**Distillation.** Customers describe what they want in detail but rarely
the whole truth. They speak in their own context, leave out detail they
assume you share, and use words ("client," "customer," "user") whose
meanings they slide between. Some customers do not know what they want,
only what they don't want, or only the broad outline. The defense is
repeated interaction: discuss the same topic across multiple conversations,
restate the problem in *different* words rather than parroting the
customer's words back, swap related terms in your reply to test reactions,
and have multiple stakeholders describe the same topic separately so
contradictions surface before they become code. Visual aids — whiteboard,
mockup, prototype — beat verbal descriptions of layout, color, and
workflow. The cautionary war story: a client described a black-background
scheme in detail across many design meetings; at the demo they said "when
I said black, I meant white."

**Agent action.** When a user states a requirement, restate it back in
different words, then ask exactly one clarifying question that would
distinguish two competing interpretations. For any requirement involving
visual layout, color, or workflow ordering, produce a sketch or mockup
before writing code and confirm it against the user's reaction, not their
words.
