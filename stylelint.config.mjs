export default {
  extends: ['stylelint-config-standard-scss'],
  rules: {
    'selector-max-compound-selectors': [4, { severity: 'warning' }],
    'scss/percent-placeholder-pattern': null,
  },
};
