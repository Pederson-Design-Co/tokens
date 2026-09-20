// The lint half of the gate. RULES.md § Never, written as rules ESLint refuses to commit.
// Replace the base (the first two entries) with the framework's own config when the project
// has one (an Expo project uses eslint-config-expo/flat/default.js); keep the Never block.
import { defineConfig } from 'eslint/config';
import js from '@eslint/js';
import tseslint from 'typescript-eslint';

// Every path here is one line of RULES.md § Never. Empty until the project has a Never list.
const NEVER = {
  paths: [
    // { name: 'some-module', importNames: ['Thing'], message: '… (RULES.md §N).' },
  ],
};

export default defineConfig([
  js.configs.recommended,
  tseslint.configs.recommended,
  {
    ignores: ['**/node_modules/', '**/dist/', 'resources/'],
  },
  {
    files: ['**/*.{js,jsx,mjs,cjs,ts,tsx}'],
    rules: {
      'no-restricted-imports': ['error', NEVER],
    },
  },
]);
