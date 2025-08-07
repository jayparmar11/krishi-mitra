// eslint.config.js
import antfu from '@antfu/eslint-config';

export default antfu({
  type: 'app',

  stylistic: {
    indent: 2, // 4, or 'tab'
    quotes: 'single', // or 'double'
    semi: true,
  },
  rules: {
    'ts/ban-ts-comment': ['warn'],
    'ts/ban-tslint-comment': ['warn'],
    'import/extensions': ['error', 'always'],
    'no-console': ['warn'],
    'ts/consistent-type-definitions': ['error', 'type'],
    'antfu/no-top-level-await': ['off'],
    'node/prefer-global/process': ['off'],
    'unicorn/filename-case': 'off',
    'eslint-comments/no-unlimited-disable': 'off',
    'node/no-process-env': ['warn'],
    'perfectionist/sort-imports': ['warn'],
    'no-unused-vars': ['warn', { argsIgnorePattern: '^_[^_].*$|^_$' }],
    'unused-imports/no-unused-vars': ['off'],
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        args: 'all',
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^_',
      },
    ],
  },

  typescript: true,

  ignores: [

  ],
});
