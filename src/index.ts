// The one place every project reads design decisions from. Nothing here knows about React,
// React Native, Tailwind or a browser: values only (RULES.md section 3).

export { color, resolve, READABLE_PAIRS } from './color.ts';
export type { Color, Mode } from './color.ts';

export { motion } from './motion.ts';
export type { Curve, Spring } from './motion.ts';

export { opacity } from './opacity.ts';

export { haptic } from './haptic.ts';
export type { HapticEffect, HapticName } from './haptic.ts';

export { radius, size, space } from './space.ts';

export { text } from './text.ts';
export type { TextStyle } from './text.ts';

export { contrast, luminance } from './contrast.ts';
