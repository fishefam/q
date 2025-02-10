import { FlatCompat } from '@eslint/eslintrc'
import imports from 'eslint-plugin-import'
import perfectionist from 'eslint-plugin-perfectionist'
import unicorn from 'eslint-plugin-unicorn'
import unusedImports from 'eslint-plugin-unused-imports'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const compat = new FlatCompat({ baseDirectory: __dirname })
const unicornConfig = unicorn.configs['flat/recommended']

/** @type {import('eslint').Linter.Config} */
const eslintConfig = [
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  perfectionist.configs['recommended-alphabetical'],
  {
    ...unicornConfig,
    ignores: ['src/shared/shadcn/**/*', 'index.d.ts', 'db.ts'],
    rules: {
      ...unicornConfig.rules,
      'unicorn/no-nested-ternary': 'off',
    },
  },
  {
    ignores: [
      '*.config.*',
      'modules.d.ts',
      'src/app/**/*',
      'src/shared/resizable-panels/**/*',
      'src/shared/shadcn/**/*',
    ],
    plugins: { imports },
    rules: {
      ...imports.configs.recommended.rules,
      'imports/no-default-export': 'error',
    },
  },
  {
    plugins: { 'unused-imports': unusedImports },
    rules: {
      '@typescript-eslint/no-unused-vars': 'off',
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'error',
        {
          args: 'after-used',
          argsIgnorePattern: '^_',
          vars: 'all',
          varsIgnorePattern: '^_',
        },
      ],
    },
  },
  {
    rules: {
      '@typescript-eslint/consistent-type-imports': 'error',
      'react/self-closing-comp': 'error',
    },
  },
  {
    ignores: ['src/**/actions.ts', 'src/**/actions.tsx'],
    rules: { 'require-await': 'error' },
  },
  {
    files: ['migrations/**/*'],
    rules: { 'perfectionist/sort-objects': 'off' },
  },
  {
    files: [
      'src/shared/shadcn/**/*',
      'src/shared/resizable-panels/**/*',
      'migrations/**/*',
    ],
    rules: { 'unicorn/filename-case': 'off' },
  },
]

export default eslintConfig
