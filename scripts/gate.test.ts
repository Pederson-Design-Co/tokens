// The gate tests itself: every project runs the same four checks, and a project that quietly
// loses one would otherwise look exactly like a project that passes. Shared with the template
// byte for byte (check-docs.ts rule 9): change the template copy and every project's together.

import assert from 'node:assert/strict';
import { test } from 'node:test';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const CHECKS = ['typecheck', 'lint', 'test', 'check'];

function json(path: string): Record<string, unknown> {
  return JSON.parse(readFileSync(join(ROOT, path), 'utf8')) as Record<string, unknown>;
}

test('package.json runs all four gate checks', () => {
  const scripts = json('package.json')['scripts'] as Record<string, string> | undefined;
  for (const name of CHECKS) {
    assert.ok(scripts?.[name], `package.json is missing the "${name}" script`);
  }
});

test('the doorman runs all four before a commit', () => {
  const doorman = readFileSync(join(ROOT, 'lefthook.yml'), 'utf8');
  for (const name of CHECKS) {
    assert.ok(doorman.includes(`npm run ${name}`), `lefthook.yml does not run "${name}"`);
  }
});

test('GitHub runs all four on every push', () => {
  const workflow = readFileSync(join(ROOT, '.github', 'workflows', 'check.yml'), 'utf8');
  for (const name of CHECKS) {
    assert.ok(workflow.includes(`npm run ${name}`), `the workflow does not run "${name}"`);
  }
});

test('the tools the checks depend on are present', () => {
  assert.ok(existsSync(join(ROOT, 'scripts', 'check-docs.ts')), 'the docs checker is missing');
  assert.ok(existsSync(join(ROOT, '.nvmrc')), 'the pinned Node version is missing');
});
