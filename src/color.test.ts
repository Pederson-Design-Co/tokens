// RULES.md section 4, enforced: every color carries both modes, and every readable pairing is
// measured from the hex rather than trusted. A comment that drifts is cosmetic; this is the bar.

import assert from 'node:assert/strict';
import { test } from 'node:test';
import { color, READABLE_PAIRS, resolve } from './color.ts';
import { contrast } from './contrast.ts';
import type { Color, Mode } from './color.ts';

const MODES: readonly Mode[] = ['light', 'dark'];
const HEX = /^#[0-9a-f]{6}$/;

function every(group: unknown, path: string, visit: (token: Color, path: string) => void): void {
  if (group !== null && typeof group === 'object' && 'light' in group && 'dark' in group) {
    visit(group as Color, path);
    return;
  }
  for (const [key, value] of Object.entries(group as Record<string, unknown>)) {
    every(value, path ? `${path}.${key}` : key, visit);
  }
}

test('every color has a light and a dark value, both six-digit lowercase hex', () => {
  let counted = 0;
  every(color, '', (token, path) => {
    counted += 1;
    for (const mode of MODES) {
      assert.match(resolve(token, mode), HEX, `${path}.${mode} is not a #rrggbb value`);
    }
  });
  assert.ok(counted >= 7, `expected the whole set to be walked, saw ${counted} colors`);
});

test('every readable pairing clears 4.5:1 in both modes', () => {
  for (const pair of READABLE_PAIRS) {
    for (const mode of MODES) {
      const measured = contrast(resolve(pair.use, mode), resolve(pair.on, mode));
      assert.ok(
        measured >= 4.5,
        `${pair.name} in ${mode} is ${measured.toFixed(2)}:1, under the 4.5:1 floor`,
      );
    }
  }
});

test('the contrast tool agrees with the two ends of the scale', () => {
  assert.equal(Number(contrast('#000000', '#ffffff').toFixed(0)), 21);
  assert.equal(contrast('#123456', '#123456'), 1);
});
