# BACKLOG.md — ordered work, open questions, parked decisions

Work items are ordered so earlier ones unblock later ones. When an item ships, **delete it**
and update whatever doc it changed. Never mark an item done and leave it here.

Items state the problem, not the solution; the *how* is decided when the item is picked up.
Each carries an ID so a gate can name it, a `Why`, and a `Ref` naming the evidence.

---

## The order of work

| # | What | Blocked by | State |
|---|---|---|---|
| T-01 | The package name `@pedersondesignco/tokens` is not reserved on npm | — | parked |
| T-02 | The first tokens: only what studio's first primitive needs | studio Phase 3 | open |

**T-01: the package name `@pedersondesignco/tokens` is not reserved on npm.**
- Why: consumers install from GitHub, so npm is not needed today. But the scope
  `@pedersondesignco` on npm belongs to whoever creates an organization by that name first.
  If a package here ever has to be public for people outside Pederson Design Co, the name
  should already be Sam's.
- Decisions: parked, not scheduled (Sam, 2026-09-19). When picked up: create an npm account,
  create the free organization `pedersondesignco`, enable two-factor auth, and publish with
  `--access public`.
- Ref: npm's docs on scoped public packages and organizations, read 2026-09-19.

**T-02: the first tokens, only what studio's first primitive needs.**
- Why: RULES.md §1 says values live here and nowhere else, so the first `Pressable` in studio
  cannot carry its own press scale, duration, curve or colors. Those arrive here first, each
  with light and dark values and measured ratios (RULES.md §4).
- Ref: studio RULES.md §4 and §5; studio's backlog item on the Kestrel color decisions to port.
