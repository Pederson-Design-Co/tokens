// The motion family holds together only while its members stay in order and in range.

import assert from 'node:assert/strict';
import { test } from 'node:test';
import { motion } from './motion.ts';

test('the three speeds are ordered and stay inside human range', () => {
  const { fast, base, slow } = motion.duration;
  assert.ok(fast < base && base < slow, 'fast, base and slow must increase in that order');
  assert.ok(fast >= 80, 'anything under 80ms reads as a jump cut, not a motion');
  assert.ok(slow <= 600, 'anything over 600ms reads as lag');
});

test('every curve is four control points inside the unit square on its time axis', () => {
  for (const [name, curve] of Object.entries(motion.easing)) {
    assert.equal(curve.length, 4, `${name} must be four numbers`);
    assert.ok((curve[0] ?? -1) >= 0 && (curve[0] ?? 2) <= 1, `${name} starts outside 0 to 1 in time`);
    assert.ok((curve[2] ?? -1) >= 0 && (curve[2] ?? 2) <= 1, `${name} ends outside 0 to 1 in time`);
  }
});

test('the press spring does not overshoot and the release spring does', () => {
  assert.equal(motion.spring.press.dampingRatio, 1, 'a press must not bounce under the finger');
  assert.ok(motion.spring.release.dampingRatio < 1, 'a release should carry a little life');
});

test('the pressed scale is a visible shrink, not a collapse', () => {
  assert.ok(motion.scale.pressed < 1, 'a press must shrink');
  assert.ok(motion.scale.pressed >= 0.9, 'below 0.9 the control reads as a toy');
});
