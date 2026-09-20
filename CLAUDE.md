# tokens

The design decisions every Pederson Design Co project renders: color, spacing, type, radius
and motion as plain values, published as `@pedersondesignco/tokens`.

**Read `../_Playbook/PRINCIPLES.md` first, then `../_Playbook/WORKFLOW.md`.** They govern
every turn. This file holds only what is specific to tokens.

Four rules that catch most mistakes before they happen:

- A proposal is never written as a record (PRINCIPLES.md rule 3).
- A claim is not a fact until it was run and the result pasted back (PRINCIPLES.md rule 4).
- Every reply ends with a numbered gate (WORKFLOW.md §1).
- There is no trivial exception. A one-line fix, a doc update the reply itself proposed, a
  consequential edit in another file: each is a gate option before it happens. Naming a fix
  is a proposal; only the pick is the go (WORKFLOW.md §3).

## Where things go in this project

| Kind of thing | Home |
|---|---|
| Where we are and what is next | STATUS.md |
| Ordered work, open questions, parked decisions | BACKLOG.md |
| How tokens works: what a token is, naming, versioning, what never goes here | RULES.md |
| The values themselves | `src/` (created with the first token) |
| The gate: checks, doorman, workflow | `package.json`, `eslint.config.js`, `lefthook.yml`, `.github/workflows/check.yml`, `scripts/check-docs.ts` |

Anything not listed here routes through `_Playbook/WORKFLOW.md` §6.

## The shape of this folder

tokens is a code library, exempt from the four-folder rule by `_Playbook/setup/PATTERNS.md`,
and carries the gate from `_Playbook/setup/code-project/`. It is consumed by `studio`
(native), `kestrel` (web) and any future project, each rendering the same values its own way.
