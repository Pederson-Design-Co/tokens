// How far something fades, and what the fade means: feedback while a finger is down, and a
// control that is present but cannot be used. Both are plain numbers between 0 and 1, which is
// what every platform's opacity takes (RULES.md section 3).

export const opacity = {
  /**
   * A control under a finger when it may not shrink, because the reader has Reduce Motion on.
   * The press keeps its meaning without the movement (studio's RULES.md section 4). A starting
   * value, chosen 2026-09-20 to be judged on a phone: the name is permanent, the number is not.
   */
  pressed: 0.8,
  /**
   * A control that stays visible and reachable but cannot be used. Fifty percent, and it never
   * moves or disappears (Sam's ruling, carried from Kestrel in studio's backlog item S-05).
   */
  disabled: 0.5,
} as const;
