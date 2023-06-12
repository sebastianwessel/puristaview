/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
  root: true,
  env: {
    es2021: true,
    node: true,
    jest: true,
  },
  extends: [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    'plugin:vue/vue3-recommended',
    '@vue/eslint-config-typescript',
    //    '@vue/eslint-config-prettier/skip-formatting',
    'standard',
    'prettier',
    'plugin:prettier/recommended',
  ],
  plugins: ['@typescript-eslint', 'simple-import-sort', 'import', 'json'],
  parserOptions: {
    ecmaVersion: 'latest',
  },
  rules: {
    'simple-import-sort/imports': 'error',
    'simple-import-sort/exports': 'error',
    'import/first': 'error',
    'import/newline-after-import': 'error',
    'import/no-duplicates': 'error',
    'sort-imports': 'off',
    'import/order': 'off',
    'no-console': 'error',
    camelcase: 'error',
    'no-var': 'error',
    'space-before-function-paren': 'off',
    'dot-notation': 'off',
    'eol-last': 'off',
    '@typescript-eslint/no-var-requires': 'warn',
    '@typescript-eslint/no-this-alias': 'warn',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    'no-unused-vars': 'off',
    curly: ['error', 'all'],
    'brace-style': 'error',
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        caughtErrorsIgnorePattern: '^_',
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
      },
    ],
  },
}
