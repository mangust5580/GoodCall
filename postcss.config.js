export default {
  plugins: {
    'postcss-pxtorem': {
      rootValue: 16,
      unitPrecision: 5,
      propList: ['*'],
      minPixelValue: 2,
      mediaQuery: false,
      replace: true,
    },
    autoprefixer: {},
  },
};
