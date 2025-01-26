import { FlatCompat } from '@eslint/eslintrc'
import perfectionist from 'eslint-plugin-perfectionist'
import tailwindcss from 'eslint-plugin-tailwindcss'
import unicorn from 'eslint-plugin-unicorn'
import unusedImports from 'eslint-plugin-unused-imports'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const compat = new FlatCompat({
  baseDirectory: __dirname,
})

/** @type {import('eslint').Linter.Config} */
const config = [
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  ...tailwindcss.configs['flat/recommended'],
  perfectionist.configs['recommended-alphabetical'],
  unicorn.configs['flat/recommended'],
  {
    ignores: ['src/shared/shadcn'],
  },
  {
    rules: {
      '@typescript-eslint/consistent-type-imports': 'error',
      'react/self-closing-comp': 'error',
      'unicorn/no-nested-ternary': 'off',
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
]

export default config
