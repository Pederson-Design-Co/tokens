# STATUS.md — where we are

Overwritten each session, never appended. The phase list below is the record of what is done
and what is next; chat scrollback is not a record (WORKFLOW.md §1).

## What this is

What tokens is: [CLAUDE.md](CLAUDE.md). Rules: [RULES.md](RULES.md). Law: `../_Playbook/`.
Scaffolded 2026-09-19 from `_Playbook/setup/code-project/` as the template's first use after
studio.

## Current phase: Phase 1, the first tokens

- [x] **0a** Scaffolded from the template; the four machinery docs written; gate green on the empty package
- [x] **1a** The first tokens, only what studio's first button needs: `motion` (three speeds, three curves, two springs, the pressed scale), `haptic` (tap, select, success, warning, error, as platform-neutral names), `color` (surface, action, four text tiers, each with a light and a dark value and a measured ratio), `space`, `radius`, `size`, `text`; `src/contrast.ts` measures; 7 tests recompute every readable pairing from the hex and hold the motion family in order
- [x] **1b** The two fades studio's first button needs: `opacity.pressed`, which replaces the shrink when the reader has Reduce Motion on, and `opacity.disabled`, Sam's fifty percent fade with the control staying in place; 2 tests keep the two apart. Both are judged on the phone in studio's 3d part 3, not here

## Where things stand

- The gate runs four checks now (typecheck, lint, test, check) before every commit and on
  every push, with `_Playbook` checked out beside the repo on GitHub.
- `text.tertiary` on `surface` measures **4.54:1** in light mode, just over the 4.5 floor.
  Any future change to either value has to be re-measured, and the test will say so.
- Nothing is published to npm. studio installs this package from GitHub (RULES.md §6).

## Active constraints

- Consumers install from GitHub, not npm (RULES.md §6, BACKLOG T-01).
- A value change here reaches studio only after a commit, a push, and an update there
  (studio's backlog carries the item about that loop).
