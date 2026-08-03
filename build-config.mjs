export const BUILD_CONFIG = {
  dev: {
    base: '/',
  },

  production: {
    base: '/GoodCall/',
  },

  browserTargets: ['chrome111', 'edge111', 'firefox114', 'safari16.4', 'ios16.4'],

  fallback: {
    storageKey: '__goodcall_redirect',
    timeoutMs: 5000,
  },

  getProductionBase() {
    return this.production.base;
  },

  getDevelopmentBase() {
    return this.dev.base;
  },

  isValidBase(base) {
    return base === '/' || base === '/GoodCall/' || base.match(/^\/[a-z0-9-]+\/$/i);
  },

  normalizeBase(base) {
    if (!base) return '/';
    const normalized = base.endsWith('/') ? base : `${base}/`;
    return normalized;
  },

  getBase(command, mode) {
    const isProduction = command === 'build' || (command === 'serve' && mode === 'production');
    return isProduction ? this.getProductionBase() : this.getDevelopmentBase();
  },
};
