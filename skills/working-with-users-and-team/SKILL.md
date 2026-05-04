---
name: working-with-users-and-team
description: Use when designing UX, gathering or interpreting requirements, estimating effort, or communicating with stakeholders/customers about what to build
---

# Working With Users and Team

## Overview

The hardest bugs in software are not in the code — they are in the gap between what the user said, what the user meant, what you heard, and what you built. This skill is about closing those gaps with concrete behaviors: watch users instead of imagining them, restate requests in different words and test reactions, separate estimates from targets from commitments, and treat collaboration as joint work rather than meetings about work. It draws on ten contributors to *97 Things Every Programmer Should Know* (CC-BY-3.0; see `principles.md` for citations and links).

This is a **rigid** skill on the mechanics (the restate-and-probe pattern, the estimate/target/commitment distinction, the "watch one user" rule). It is **flexible** on team practices (pairing cadence, rotation rules) which depend on team context.

## When to invoke

Invoke when you're about to:

- Design or change a UI affordance, workflow, error message, or any user-facing surface
- Write down or interpret a requirement from a customer, PM, designer, or stakeholder
- Give a number ("how long will this take?", "when can we ship?", "how many users can it handle?")
- Push back on, accept, or reshape a feature request
- Pair, mob, or hand off work to another engineer; review a colleague's PR with substantive feedback
- Talk to a customer, demo a feature, or write a release note that frames the change to non-developers

### Non-triggers — do NOT invoke for

- Fixing an isolated bug whose reproducer is already in a failing test
- Renaming a single local variable, formatting changes, or import reordering
- Adding a unit test that pins down already-agreed-on behavior
- Internal refactor with no user-visible change (use `before-you-refactor`)
- Routine dependency bump or config tweak

## Precedence

- **`superpowers/brainstorming` runs FIRST when the request is ambiguous or product-facing.** Brainstorming is the *process* for exploring intent — what problem is being solved, who for, what alternatives exist. THIS skill applies AFTER, layering user, requirement, estimation, and collaboration discipline onto the explored space. Do not skip brainstorming and jump straight to "restate the request" — you may end up restating a question that should not have been asked in this form.
- `superpowers/test-driven-development` governs how committed work gets built; this skill governs how the commitment was formed.
- `97/api-and-interface-design` and `97/domain-modeling` follow once requirements are agreed; this skill governs the requirements conversation itself.

## Checklist

Run the relevant sub-section. If a request crosses areas (a UX change with an estimate attached), run each.

### Users (#3, #97)

1. **Watch one real user attempt the task.** Set them a goal in their words ("file your expense report for last month"), not a leading instruction ("click here, then enter SUM"). Do not interrupt or coach. Note where they hesitate, where they invent a workaround, where they give up. Asking users what they want is unreliable; watching them is the data. *(Colborne, #3.)*
2. **Before adding a UI affordance, list two alternative paths a non-power-user might take and confirm the design accommodates both.** If only the power-user path works, the affordance is wrong.
3. **Design for the muddle-through path.** Users narrow focus when stuck — help text on the other side of the screen will not be seen. Put guidance at the point of action (inline hint, tooltip on the control, contextual error). One obvious path beats two clever shortcuts.

### Requirements (#3, #36, #77, #97)

4. **Restate the request in different words, then ask one clarifying question that distinguishes two competing interpretations.** Do not parrot the user's words back — they did not mean what they told you. Example: user says "I want a customer dashboard." Restate: "So an at-a-glance view a salesperson opens once a day to spot accounts that need attention?" Then ask: "Is this for the salesperson, or for the customer themselves to log into?" *(Jackson, #97.)*
5. **Probe context with vocabulary swaps.** When the user says "client" or "user" or "customer," substitute the other terms in your reply and watch the reaction. Mismatch in the casual term is the cheapest way to surface a definitional gap. *(Jackson, #97.)*
6. **Discuss the same topic in two separate conversations with two different stakeholders.** Compare what they each said. Resolve contradictions before writing the spec, not after writing the code. *(Jackson, #97.)*
7. **When you receive a request, start from yes — ask "why?" before you object.** Find the underlying need; often the request is achievable as stated, and sometimes voicing the reason makes the original objection look wrong. If after the why the request still cannot work, escalate to the decision-maker — do not silently refuse. *(Miller, #77.)*
8. **When you ask a senior engineer or domain expert for help, deliver context with the question.** Stack trace, what you tried, what you expected. Treating them as a "guru" who divines answers from thin air wastes their time and stunts your own learning. *(Brush, #36.)*
9. **Use a visual aid for any non-trivial requirements conversation.** Whiteboard, mockup, or prototype. Verbal descriptions of layout, color, or workflow are how the "I said black, I meant white" demo happens. *(Jackson, #97.)*

### Estimation (#50)

10. **Before giving a number, name which of three things is being asked for.** *(Asproni, #50.)*
    - **Estimate** — an approximate calculation from data and prior experience. Wishes excluded. Approximate, never spuriously precise.
    - **Target** — a desired business outcome ("must support 400 concurrent users").
    - **Commitment** — a promise to deliver specified scope at specified quality by a specified date.
    These are independent. A target is not an estimate. A commitment should be *based on* an estimate, not negotiated against one.
11. **When asked "how long?" — answer "estimate, target, or commitment?" before giving a number.** If the asker says "estimate," give a range from prior data. If "commitment," give the smallest scope you will commit to and surface what is being deferred.
12. **Refuse to compress an estimate by negotiation.** If you said three weeks and the PM says "I can give you two," that is a target, not a new estimate. Either reduce scope, change the team, or accept that the target will miss — do not relabel two weeks as your estimate.

### Collaboration (#64, #85, #86, #87, #96)

13. **Before starting a non-trivial task alone, ask whether it should be paired.** If it touches code only one person knows, or you are new to the area, or the design is unclear — pair. Pairing distributes knowledge so the truck factor is not one. *(Hauknes/Gagnat/Røssland, #64; Wible, #85.)*
14. **When pairing, rotate before the task is finished.** Bring in a third person while the work is still in progress. The next pair will revisit the design with fresh eyes; that revisit is a feature of the practice, not waste. *(Hauknes/Gagnat/Røssland, #64.)*
15. **When two pairs solo, choose the pairing that maximizes a knowledge gradient.** Newer engineer + experienced engineer with coaching skill; or domain-naive engineer + domain expert. Pairing two equal experts on familiar ground is the weakest configuration. *(Wible, #85.)*
16. **When a bug fix makes a different test fail, suspect a compensating defect before suspecting your fix.** Two wrongs that have been quietly making a right will surface as soon as you correct one of them. Before reverting your fix, write down both the original symptom and the new symptom and look for a shared cause. *(Kelly, #86.)*
17. **When you find a workaround that users have learned (e.g., "the app says left, but it means right"), do not silently fix it.** A silent fix retrains every user who relied on the workaround. Surface the discrepancy, plan the migration, then fix. *(Kelly, #86.)*
18. **Before committing, ask: will the next person who touches this file be a better developer for having read it?** If not, improve naming, split a long function, add the missing test. The code is shared; your name on the blame is not the point. *(Khan, #87; Goodliffe, #96.)*
19. **When you catch yourself writing code that "works but is ugly," stop and rewrite the small piece now.** Caring about the code is the only thing that separates adequate output from good output, and it shows up in small decisions made under deadline pressure, not in grand statements made in retros. *(Goodliffe, #96.)*

## Red Flags

These thoughts mean STOP — go back to the relevant checklist item:

| Thought | Reality |
|---|---|
| "The user said they want X — I'll just build X." | What users say and what they do diverge. Restate in different words and ask one question that distinguishes interpretations. (#97) |
| "I know how a user will use this — I designed it." | You are not the user. Watch one real user attempt the task before shipping the affordance. (#3) |
| "I'll add a help link in the sidebar — they'll find it." | Stuck users narrow focus. Guidance off the action point will not be seen. Put it at the control. (#3) |
| "Two weeks is fine — I'll just commit to it." | A target accepted under pressure is not an estimate. Name what is being asked for: estimate, target, or commitment. (#50) |
| "I'll give a precise number so it sounds credible." | Spurious precision (4.2 days) signals a target dressed as an estimate. Give a range from data, or say you do not have data yet. (#50) |
| "The request is dumb — I'll push back and explain why." | Start from yes. Ask why first. The reason often reveals a real constraint, and sometimes the objection collapses. (#77) |
| "I'll just ask the senior engineer — they'll know." | Without stack trace, repro, or what-you-tried, you are asking for magic. Deliver context with the question. (#36) |
| "I fixed the bug — that other test must be flaky." | Two wrongs may have been making a right. The new failure is evidence, not noise. Investigate the shared cause. (#86) |
| "I'll just code it solo — pairing is slower." | Solo on unfamiliar code concentrates knowledge in one head. If the area has a truck factor of one, pair. (#64, #85) |
| "It works. Cleanup is a nice-to-have for later." | Caring about the code is decided in the small commit, not the retro. The next reader is the metric. (#87, #96) |
| "I'll restate the requirement back word-for-word so they know I heard them." | Verbatim restatement confirms the words, not the meaning. Restate in *different* words to surface the gap. (#97) |

## What "done" looks like

You are done with the user/team work when **all** of the following are true:

- [ ] If the change is user-facing, you watched (or specified how someone will watch) one real user attempt the task.
- [ ] You restated each interpreted requirement in different words and got confirmation, not just nods.
- [ ] Any number you gave is labeled as estimate, target, or commitment.
- [ ] You started from yes on the request, asked why, and either accepted, reshaped with the asker's agreement, or escalated — you did not silently refuse.
- [ ] If the work concentrated knowledge in one person, you flagged it and proposed a pairing or knowledge-share.
- [ ] If you fixed a bug, you checked for a compensating defect before declaring done.
- [ ] The next person to read your code will be a better developer for it.

If any box is unchecked, you are not done — you are mid-conversation. Either finish, or write down what is unresolved before you ship.

## Principles in this skill

| # | Principle | Author |
|---|---|---|
| #3 | You Are Not the User | Giles Colborne |
| #36 | The Guru Myth | Ryan Brush |
| #50 | Learn to Estimate | Giovanni Asproni |
| #64 | Pair Program and Feel the Flow | Gudny Hauknes, Ann Katrin Gagnat, Kari Røssland |
| #77 | Start from Yes | Alex Miller |
| #85 | Two Heads Are Often Better Than One | Adrian Wible |
| #86 | Two Wrongs Can Make a Right (and Are Difficult to Fix) | Allan Kelly |
| #87 | Ubuntu Coding for Your Friends | Aslam Khan |
| #96 | You Gotta Care About the Code | Pete Goodliffe |
| #97 | Your Customers Do Not Mean What They Say | Nate Jackson |

See `principles.md` for the long-form distillations, citations, and source links.
