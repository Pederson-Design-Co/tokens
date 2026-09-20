# BACKLOG.md — ordered work, open questions, parked decisions

Work items are ordered so earlier ones unblock later ones. When an item ships, **delete it**
and update whatever doc it changed. Never mark an item done and leave it here.

Items state the problem, not the solution; the *how* is decided when the item is picked up.
Each carries an ID so a gate can name it, a `Why`, and a `Ref` naming the evidence.

An open question that needs Sam is asked at the gate that needs it, not stored here.

---

## The order of work

| # | What | Blocked by | State |
|---|---|---|---|
| T-01 | The package name `@pedersondesignco/tokens` is not reserved on npm | — | parked |
| T-03 | A ratio written in a comment is not checked against the hex beside it | — | open |

**T-01: the package name `@pedersondesignco/tokens` is not reserved on npm.**
- Why: consumers install from GitHub, so npm is not needed today. But the scope
  `@pedersondesignco` on npm belongs to whoever creates an organization by that name first.
  If a package here ever has to be public for people outside Pederson Design Co, the name
  should already be Sam's.
- Decisions: parked, not scheduled (Sam, 2026-09-19). When picked up: create an npm account,
  create the free organization `pedersondesignco`, enable two-factor auth, and publish with
  `--access public`. When picked up, the version scheme is decided with it; the starting
  proposal, from the rule this replaced: renaming or removing a token is a major version,
  changing a value or adding a token is a minor version.
- Ref: npm's docs on scoped public packages and organizations, read 2026-09-19.

**T-03: a ratio written in a comment is not checked against the hex beside it.**
- Why: RULES.md §4 says each color records its measured ratio, and `src/color.ts` does. The
  tests measure the real pairings from the hex, which is the substantive bar, but nothing
  compares the *comment* to the computation. Two of the first four comments were wrong when
  written (2026-09-19) and only a manual run caught them.
- Decisions: the ed2go design system solved this by recomputing every comment on each run and
  failing on a mismatch; that approach ports, and the arithmetic already exists in
  `src/contrast.ts`.
- Ref: `src/color.ts` comments versus the measured values, 2026-09-19.
