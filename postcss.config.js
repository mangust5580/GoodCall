/**
 * The single px -> rem authoring boundary.
 *
 * Layout and design measurements are authored in px (matching raster evidence)
 * and converted here once. Semantic relative units (rem, em, %, viewport and
 * container units) are never touched, because this plugin only matches `px`.
 */
export default {
  plugins: {
    'postcss-pxtorem': {
      // 1rem === 16px.
      rootValue: 16,
      unitPrecision: 5,
      propList: ['*'],
      // Keep 1px hairlines as real device pixels; only 2px and above converts.
      minPixelValue: 2,
      mediaQuery: false,
      replace: true,
    },
    autoprefixer: {},
  },
};
