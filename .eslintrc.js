module.exports = {
  parser: '@typescript-eslint/parser',
  extends: [
    'plugin:@typescript-eslint/recommended',
  ],
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  rules: {
    semi: 'error',
    'comma-dangle': ['error', 'always-multiline'],
    indent: ['error', 2],
    '@typescript-eslint/indent': ['error', 2],
    'no-shadow': ['error', { 'hoist': 'functions' }],
    'arrow-parens': ['error', 'always'],
  },
};
