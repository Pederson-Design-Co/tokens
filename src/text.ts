// Type. Sizes are points at the system's default text size; every platform scales them with
// the reader's own setting, so a layout must survive the largest one rather than pin a height.
//
// Carried from Kestrel: a button's label is ALL CAPS, bold, and tracked wider, which is what
// separates a label or an action from a sentence.

export type TextStyle = {
  readonly size: number;
  readonly lineHeight: number;
  readonly weight: '400' | '600' | '700';
  readonly letterSpacing: number;
  readonly uppercase: boolean;
};

export const text = {
  /** A control's label: a button, a tab, a field's name. */
  label: { size: 14, lineHeight: 18, weight: '700', letterSpacing: 0.7, uppercase: true } as TextStyle,
  /** Sentences a person reads. */
  body: { size: 16, lineHeight: 22, weight: '400', letterSpacing: 0, uppercase: false } as TextStyle,
} as const;
