import js from '@eslint/js'
import prettier from 'eslint-config-prettier'
import typescript from '@typescript-eslint/eslint-plugin'
import tsParser from '@typescript-eslint/parser'

const tsGlobals = {
  console: true,
  fetch: true,
  localStorage: true,
  window: true,
  document: true,
  navigator: true,
  speechSynthesis: true,
  JSX: true,
  process: true,
  __dirname: true,
  setTimeout: true,
  clearTimeout: true,
  setInterval: true,
  clearInterval: true,
}

const tsRules = {
  ...js.configs.recommended.rules,
  ...typescript.configs.recommended.rules,
}

const tsLanguageOptions = {
  parser: tsParser,
  parserOptions: {
    project: './tsconfig.eslint.json',
    sourceType: 'module',
  },
  globals: tsGlobals,
}

/** @type {import("eslint").Linter.FlatConfig[]} */
export default [
  {
    ignores: ['**/*.test.*'],
  },
  {
    plugins: { '@typescript-eslint': typescript },
    files: ['packages/ui/**/*.{ts,tsx,js,jsx}'],
    languageOptions: tsLanguageOptions,
    rules: tsRules,
  },
  {
    plugins: { '@typescript-eslint': typescript },
    files: ['packages/kernel/**/*.{ts,tsx,js,jsx}'],
    languageOptions: tsLanguageOptions,
    rules: tsRules,
  },
  {
    files: ['packages/ui/vite.config.js'],
    languageOptions: {
      globals: {
        __dirname: true,
      },
    },
  },
  {
    plugins: { '@typescript-eslint': typescript },
    files: ['packages/server/**/*.{ts,js}'],
    languageOptions: tsLanguageOptions,
    rules: tsRules,
  },
  {
    plugins: { '@typescript-eslint': typescript },
    files: ['shared/**/*.{ts,tsx,js,jsx}'],
    languageOptions: tsLanguageOptions,
    rules: tsRules,
  },
  prettier,
]
