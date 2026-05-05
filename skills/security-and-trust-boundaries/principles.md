# security-and-trust-boundaries — principles

Long-form per-principle distillations. The summary in `SKILL.md` is what
the agent loads on trigger; this file is the on-demand reference.

This skill is the project's **one acknowledged "97-inspired plus
extension"** — the book has thin direct coverage of modern security
practice. Two principles from the book generalize cleanly to
trust-boundary discipline, but per `CITATION-SCHEME.md`'s ID-uniqueness
rule their canonical home is `error-and-correctness-traps`. They are
surfaced in this skill's `SKILL.md` as Red Flags and cross-references
only; the canonical entries live one skill over. The rest of the skill
content (concrete trap domains, worked examples, language-specific code
patterns) is original commentary written for this plugin under the
project's MIT license.

See `CONTENT-LICENSE.md` for the licensing posture.

---

## (cross-reference) 97/26 — Don't Ignore That Error!

Canonical entry in `error-and-correctness-traps/principles.md`.
Surfaced here in `SKILL.md` because untrusted-input handling routinely
produces ignored errors at the boundary: the missing `validate(...)` is
the security analog of the swallowed exception. Don't ignore the trust
boundary — validate at the line where the data crosses, expose the
boundary in the interface (typed wrappers like `ValidatedFilename`,
`SanitizedURL`), and refuse to write the empty `validate(...)` that
returns the input unchanged.

---

## (cross-reference) 97/29 — Don't Rely on "Magic Happens Here"

Canonical entry in `error-and-correctness-traps/principles.md`.
Surfaced here in `SKILL.md` because security controls are exactly the
kind of code that "just works" without scrutiny — until it doesn't.
The default-secure framework decorator, the WAF rule, the
auto-included CSRF middleware, the platform-managed TLS termination —
each is magic for someone on the team. Don't rely on a security
control no one on the team understands.

---

## Original commentary (MIT-licensed plugin code)

The trap domains in `SKILL.md` — injection, untrusted-input
boundaries, secrets, crypto misuse, and authentication/authorization —
are written for this plugin and are not distilled from the book. They
draw on standard industry practice (OWASP Top 10, language-specific
secure coding guides, CWE references) and on agent-specific failure
modes observed in production code review. Sources for individual
checks:

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
