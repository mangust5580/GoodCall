import { describe, it, expect } from 'vitest';
import { BUILD_CONFIG } from '../build-config.mjs';

describe('Vite Config Base Path Selection', () => {
  it('dev server uses development base /', () => {
    const base = BUILD_CONFIG.getBase('serve', 'development');
    expect(base).toBe('/');
  });

  it('build uses production base /GoodCall/', () => {
    const base = BUILD_CONFIG.getBase('build', 'production');
    expect(base).toBe('/GoodCall/');
  });

  it('preview server uses production base /GoodCall/', () => {
    const base = BUILD_CONFIG.getBase('serve', 'production');
    expect(base).toBe('/GoodCall/');
  });
});
