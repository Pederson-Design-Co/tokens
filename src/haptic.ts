// Haptics, named for what they mean rather than how a platform produces them. The kit maps
// each name to its platform effect; nothing here imports a platform (RULES.md section 3).
//
// A haptic is never the only signal, and it is unchanged by Reduce Motion: that setting is
// about on-screen movement, and iOS has its own System Haptics switch.

export const haptic = {
  /** A completed tap. Fires on release, never on a press dragged off and cancelled. */
  tap: 'impact-light',
  /** Moving between options: a segment, a picker, a row. */
  select: 'selection',
  /** Something finished and worked. */
  success: 'notification-success',
  /** Something needs attention before it can finish. */
  warning: 'notification-warning',
  /** Something failed. */
  error: 'notification-error',
} as const;

/** The names a component may ask for. */
export type HapticName = keyof typeof haptic;

/** The platform-neutral effects those names resolve to. */
export type HapticEffect = (typeof haptic)[HapticName];
