import js from '@eslint/js';
import { defineConfig, globalIgnores } from 'eslint/config';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import globals from 'globals';
import tseslint from 'typescript-eslint';

const noReference = {
  regex: '^(\\./|(\\.\\./)+)reference(/|$)',
  message: 'Only src/app/App.tsx may import src/reference/ surfaces.',
};
const noApp = {
  regex: '^(\\.\\./)+app(/|$)',
  message: 'src/app/ composes everything else; lower layers must not import it.',
};
const noPages = {
  regex: '^(\\.\\./)+pages(/|$)',
  message: 'This layer must not depend on route families in src/pages/.',
};
const noCommerce = {
  regex: '^(\\.\\./)+commerce(/|$)',
  message: 'Shared components must not depend on src/commerce/ state or facts.',
};
const noDeepCommerce = {
  regex: '^(\\.\\./)+commerce/[^/]+/',
  message: 'Import a commerce module through its index.ts (e.g. commerce/cart).',
};
const noDeepPages = {
  regex: '^(\\.\\./)+pages/[^/]+/',
  message: 'Import a route family through its index.ts (e.g. pages/catalog).',
};

function boundaries(...patterns) {
  return { 'no-restricted-imports': ['error', { patterns }] };
}

export default defineConfig([
  globalIgnores(['dist/**', 'node_modules/**']),

  {
    files: ['src/**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommendedTypeChecked,
      react.configs.flat.recommended,
      react.configs.flat['jsx-runtime'],
      reactHooks.configs.flat['recommended-latest'],
      reactRefresh.configs.vite,
      jsxA11y.flatConfigs.recommended,
    ],
    languageOptions: {
      globals: globals.browser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    settings: {
      react: { version: 'detect' },
    },
    rules: {
      'react/prop-types': 'off',
    },
  },

  {
    files: ['src/**/*.{ts,tsx}'],
    ignores: ['src/app/App.tsx', 'src/reference/**'],
    rules: boundaries(noReference),
  },

  {
    files: ['src/app/**/*.{ts,tsx}'],
    ignores: ['src/app/App.tsx'],
    rules: boundaries(noReference, noDeepPages, noDeepCommerce),
  },

  {
    files: ['src/pages/*/*.{ts,tsx}'],
    rules: boundaries(noReference, noApp, noDeepCommerce, {
      regex: '^\\.\\./[^./][^/]*/',
      message: 'Import another route family through its index.ts, not its internal files.',
    }),
  },

  {
    files: ['src/pages/*/*/**/*.{ts,tsx}'],
    rules: boundaries(noReference, noApp, noDeepCommerce, {
      regex: '^\\.\\./\\.\\./[^./][^/]*/',
      message: 'Import another route family through its index.ts, not its internal files.',
    }),
  },

  {
    files: ['src/commerce/**/*.{ts,tsx}'],
    rules: boundaries(noReference, noApp, noPages),
  },

  {
    files: ['src/components/**/*.{ts,tsx}'],
    rules: boundaries(noReference, noApp, noPages, noCommerce),
  },

  {
    files: ['vite.config.ts'],
    extends: [js.configs.recommended, tseslint.configs.recommendedTypeChecked],
    languageOptions: {
      globals: globals.node,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },

  {
    files: ['*.config.js', 'eslint.config.js'],
    extends: [js.configs.recommended],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: globals.node,
    },
  },
]);
