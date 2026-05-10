import antfu from '@antfu/eslint-config'

export default antfu(
  {
    type: 'app',
    typescript: true,
    jsonc: false,
    yaml: false,
    toml: false,
    markdown: false,
    stylistic: false,
    formatters: false,
    ignores: ['build'],
  },
  {
    rules: {
      'node/prefer-global/process': 'off',
      'perfectionist/sort-imports': 'off',
      'jsdoc/check-param-names': 'off',
      'jsdoc/check-types': 'off',
      'ts/consistent-type-imports': 'off',
    },
  },
)
