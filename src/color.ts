// Color. Every token carries a light and a dark value (RULES.md section 4); the ratio in each
// comment is measured against the surface it sits on and re-derived by color.test.ts.
//
// Carried from Kestrel: near-black and near-white, never pure black or white, for content;
// the four text tiers chosen by importance, with the dark tier lighter than its light twin
// because gray-500 fails on a near-black surface.

export type Mode = 'light' | 'dark';

/** One decision, in both modes. */
export type Color = { readonly light: string; readonly dark: string };

export const color = {
  /** The page behind everything. */
  surface: { light: '#fafafa', dark: '#111111' },

  action: {
    /** The primary action's fill. Carries visible text, so it owes no ratio of its own. */
    primary: { light: '#111111', dark: '#fafafa' },
  },

  text: {
    /** On an action fill. light 18.09:1 · dark 18.09:1 */
    onAction: { light: '#fafafa', dark: '#111111' },
    /** Headings, values, emphasis. light 18.09:1 · dark 18.09:1 */
    primary: { light: '#111111', dark: '#fafafa' },
    /** Supporting prose. light 9.93:1 · dark 14.99:1 */
    secondary: { light: '#404040', dark: '#e5e5e5' },
    /** Hints and timestamps, the readable floor. light 4.54:1 · dark 7.49:1 */
    tertiary: { light: '#737373', dark: '#a3a3a3' },
    /** Inactive and decoration only, never readable text. Exempt from contrast (WCAG 1.4.3). */
    disabled: { light: '#d4d4d4', dark: '#525252' },
  },
} as const;

/** Read one decision in one mode. */
export function resolve(token: Color, mode: Mode): string {
  return token[mode];
}

/**
 * Every foreground that must be readable, and the background it sits on. The tests measure
 * exactly these; a new readable pairing is added here or it is unmeasured.
 */
export const READABLE_PAIRS: ReadonlyArray<{ name: string; on: Color; use: Color }> = [
  { name: 'text.primary on surface', on: color.surface, use: color.text.primary },
  { name: 'text.secondary on surface', on: color.surface, use: color.text.secondary },
  { name: 'text.tertiary on surface', on: color.surface, use: color.text.tertiary },
  { name: 'text.onAction on action.primary', on: color.action.primary, use: color.text.onAction },
];
