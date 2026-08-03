/**
 * Single source of truth for build and deployment configuration.
 * Used by: vite.config.ts, prepare-pages-artifact.mjs, validate-build.mjs
 */

export const BUILD_CONFIG = {
  // Development base - SPA runs at root during dev
  dev: {
    base: '/',
  },

  // Production base - GitHub Pages project site at /GoodCall/
  production: {
    base: '/GoodCall/',
  },

  // Browser targets for build
  browserTargets: ['chrome111', 'edge111', 'firefox114', 'safari16.4', 'ios16.4'],

  // Fallback mechanism configuration
  fallback: {
    storageKey: '__goodcall_redirect',
    timeoutMs: 5000,
  },

  // Get production base
  getProductionBase() {
    return this.production.base;
  },

  // Get development base
  getDevelopmentBase() {
    return this.dev.base;
  },

  // Validate base path
  isValidBase(base) {
    return base === '/' || base === '/GoodCall/' || base.match(/^\/[a-z0-9-]+\/$/i);
  },

  // Normalize base with trailing slash
  normalizeBase(base) {
    if (!base) return '/';
    const normalized = base.endsWith('/') ? base : `${base}/`;
    return normalized;
  },
};
