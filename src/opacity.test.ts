// Two fades only say two different things while they stay apart: feedback is not a state.

import assert from 'node:assert/strict';
import { test } from 'node:test';
import { opacity } from './opacity.ts';

test('every fade fades something and hides nothing', () => {
  for (const [name, value] of Object.entries(opacity)) {
    assert.ok(value > 0, `${name} must leave the control on screen`);
    assert.ok(value < 1, `${name} must be a visible change`);
  }
});

test('a press is subtler than a disabled state', () => {
  assert.ok(
    opacity.pressed > opacity.disabled,
    'a press is momentary feedback; a disabled control is a lasting state and reads as further away',
  );
});
