// Motion. Three speeds, three curves, two springs and one press scale: everything that moves
// in any project is built from these, which is what makes a sheet and a button feel related.
// Values chosen 2026-09-19 (standard iOS feel); the names are permanent, the numbers are not.

/** Cubic bezier control points, in the order every platform states them. */
export type Curve = readonly [number, number, number, number];

/** A spring stated as a settling time and how much it overshoots (1 = none). */
export type Spring = { readonly duration: number; readonly dampingRatio: number };

export const motion = {
  /** Milliseconds. */
  duration: {
    /** Immediate feedback: a press, a small state change. */
    fast: 150,
    /** Most things: something appearing, a fade, a color change. */
    base: 250,
    /** Large surfaces: a sheet, a full-screen transition. */
    slow: 400,
  },

  easing: {
    /** Anything moving within the screen. */
    standard: [0.2, 0, 0, 1] as Curve,
    /** Something arriving: decelerates into place. */
    enter: [0, 0, 0.2, 1] as Curve,
    /** Something leaving: accelerates away. */
    exit: [0.4, 0, 1, 1] as Curve,
  },

  spring: {
    /** Going down under a finger: no overshoot, the finger is the authority. */
    press: { duration: 150, dampingRatio: 1 } as Spring,
    /** Coming back when the finger leaves: a little life. */
    release: { duration: 350, dampingRatio: 0.65 } as Spring,
  },

  scale: {
    /** How far a control shrinks while pressed. */
    pressed: 0.96,
  },
} as const;
