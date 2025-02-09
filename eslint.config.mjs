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

/** @type {import('eslint').Linter.Config} */
const eslintConfig = [
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  perfectionist.configs['recommended-alphabetical'],
  {
    ...unicorn.configs['flat/recommended'],
    ignores: ['src/shared/shadcn/**/*', 'index.d.ts'],
    rules: { 'unicorn/no-nested-ternary': 'off' },
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
]

export default eslintConfig
