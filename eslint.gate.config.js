import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

// Focused lint gate: fails the build only on "undefined variable" errors.
//
// Those are the ones that crash the running app (e.g. the production
// "BRAND is not defined" error on the Team page), so they are worth blocking
// while the rest of the lint backlog is paid down separately.
//
// Mirrors the language options of the main eslint.config.js so the two agree.
export default defineConfig([
  globalIgnores(['dist']),
  {
    // This focused config only checks no-undef, so the repo's many disable
    // directives for other rules look "unused"; don't report that as noise.
    linterOptions: { reportUnusedDisableDirectives: 'off' },
  },
  {
    // Backend is a CommonJS Node service.
    files: ['backend_node/**/*.js'],
    languageOptions: {
      sourceType: 'commonjs',
      globals: { ...globals.node },
    },
  },
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: { ...globals.browser, __SSF_BUILD_ID__: 'readonly' },
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    // Register the react plugins so the repo's existing eslint-disable
    // directives for their rules resolve (their rules themselves stay off).
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      'no-undef': 'error',
    },
  },
])
