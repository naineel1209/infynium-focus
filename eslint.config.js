import js from '@eslint/js';
import prettier from 'eslint-plugin-prettier';
import pluginReact from 'eslint-plugin-react';
import { defineConfig } from 'eslint/config';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default defineConfig([
  {
    ignores: ['**/dist/**', '**/node_modules/**'],
  },
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    plugins: { js, prettier },
    extends: ['js/recommended'],
  },
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    languageOptions: { globals: globals.browser },
  },
  {
    files: ['**/*.{ts,mts,cts,tsx}'],
    languageOptions: { globals: globals.node },
  },
  tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  {
    plugins: { prettier },
    rules: {
      'prettier/prettier': 'error',
    },
  },
]);
