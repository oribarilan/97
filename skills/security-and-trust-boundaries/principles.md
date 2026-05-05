# security-and-trust-boundaries — principles

Long-form per-principle distillations. The summary in `SKILL.md` is what
the agent loads on trigger; this file is the on-demand reference.

This skill is the project's **one acknowledged "97-inspired plus
extension"** — the book has thin direct coverage of modern security
practice. Two principles from the book generalize cleanly to
trust-boundary discipline and are kept here under their CC-BY-3.0
attributions. The rest of the skill content (concrete trap domains,
worked examples, language-specific code patterns) is original
commentary written for this plugin under the project's MIT license.

See `CONTENT-LICENSE.md` for the licensing posture.

---

## #26 — Don't Ignore That Error! (generalized)

**Author (book essay):** Pete Goodliffe
**Source (primary):** https://github.com/97-things/97-things-every-programmer-should-know/blob/master/en/thing_26/README.md
**License:** CC-BY-3.0
**Access date:** 2026-05-05
**Gaps:** None.

**Distillation.** Goodliffe's essay says: when an operation can fail —
ignored return code, swallowed exception, missing check — the failure
becomes a silent corruption that surfaces somewhere downstream as a bug
nobody can trace. The cure is to surface erroneous conditions in
interfaces, never write the empty `catch`, and treat error handling as
part of the contract.

**Generalization for this skill.** The same shape applies to **trust
boundaries**. An untrusted input that reaches code expecting validated
data is the security analog of an unhandled error: the failure is
silent at the line of the missed check and surfaces as a vulnerability
when an attacker arrives. Don't ignore the trust boundary. Validate at
the line where the data crosses, expose the boundary in the interface
(typed wrappers like `ValidatedFilename`, `SanitizedURL`), and refuse
to write the empty `validate(...)` that returns the input unchanged.

**Agent action.** When code reads from a network socket, request body,
file, environment variable, queue message, or another process, ask:
"is there a `validate` call between the read and the use?" If not, add
one — concrete enough to fail loudly when the data is wrong, and typed
enough that downstream code can rely on it.

---

## #29 — Don't Rely on "Magic Happens Here" (generalized)

**Author (book essay):** Alan Griffiths
**Source (primary):** https://github.com/97-things/97-things-every-programmer-should-know/blob/master/en/thing_29/README.md
**License:** CC-BY-3.0
**Access date:** 2026-05-05
**Gaps:** None.

**Distillation.** Griffiths' essay says: code that "just works" without
anyone understanding why is a fault waiting to surface. If part of the
system is opaque to you (a build picking up a specific DLL by load
order; a deployment script reading an undocumented env var), at minimum
know who *does* understand it and how to restart the magic when it
stops.

**Generalization for this skill.** Security controls are exactly the
kind of code that "just works" without scrutiny — until it doesn't.
The default-secure framework decorator, the WAF rule, the
auto-included CSRF middleware, the platform-managed TLS termination —
each is magic for someone on the team. When the default flips (a
framework upgrade changes the auth-by-default posture; a WAF rule is
silently removed; a load-balancer SSL config drifts), the magic stops
and there is no error message. Don't rely on a security control no one
on the team understands.

**Agent action.** When you ship code that depends on a security
control you didn't write (auth middleware, escape filter, framework
default), name the control inline (a comment with the file path and
line, or a test that fails if the control is missing). When you change
a config that gates such a control, explicitly call out the inversion
in the PR.

---

## Original commentary (MIT-licensed plugin code)

The trap domains in `SKILL.md` — injection (#1–3), untrusted-input
boundaries (#4–7), secrets (#8–10), crypto misuse (#11–13), and
authentication/authorization (#14–16) — are written for this plugin
and are not distilled from the book. They draw on standard industry
practice (OWASP Top 10, language-specific secure coding guides,
CWE references) and on agent-specific failure modes observed in
production code review. Sources for individual checks:

- Injection / shell / parameterization patterns: standard SQL/NoSQL/LDAP
  driver documentation; OWASP Injection Prevention.
- Path traversal and SSRF: OWASP A01/A10 (2021) categories.
- Deserialization: language vendor security advisories
  (`pickle`, `yaml`, `BinaryFormatter`).
- Password hashing: PHC (Password Hashing Competition) winners and
  current cost-tuning guidance.
- Crypto misuse: standard library cryptography documentation; libsodium
  rationale.
- Authn/authz: OWASP API Security Top 10; common IDOR pattern catalog.

If a contributor or rightsholder believes a specific paragraph crosses
into derivative-work territory of a CC-BY or other-licensed source,
file an issue and the file will be revised or removed.
