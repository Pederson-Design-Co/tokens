// Geometry, in points. Every step has a job; a step with no consumer is deleted rather than
// kept for later, so this list grows one real need at a time.

export const space = {
  /** Between a control's edge and its own content. */
  inside: 12,
  /** The one inset from a surface's edge, shared by every surface so they line up. */
  edge: 16,
  /** Between two separate things in a stack. */
  between: 24,
} as const;

export const radius = {
  /** Buttons, inputs, and anything else the finger treats as one control. */
  control: 12,
} as const;

export const size = {
  /** The smallest a tappable thing may be, in points. Apple's floor, stricter than WCAG's. */
  tapTarget: 44,
} as const;
