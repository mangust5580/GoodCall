export default {
  extends: ['stylelint-config-standard-scss'],
  rules: {
    'selector-max-compound-selectors': [4, { severity: 'warning' }],
    'scss/percent-placeholder-pattern': null,
    'scss/dollar-variable-empty-line-before': [
      'always',
      { except: ['first-nested', 'after-comment', 'after-dollar-variable'] },
    ],
    'custom-property-empty-line-before': [
      'always',
      { except: ['first-nested', 'after-custom-property'] },
    ],
    'value-keyword-case': [
      'lower',
      {
        ignoreKeywords: [
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'Oxygen',
          'Ubuntu',
          'Cantarell',
          'Fira Sans',
          'Droid Sans',
          'Helvetica Neue',
        ],
      },
    ],
    'at-rule-disallowed-list': ['import'],
  },
};
