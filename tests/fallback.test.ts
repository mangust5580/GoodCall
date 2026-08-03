import { describe, it, expect } from 'vitest';
import { validateRedirectPayload, restoreURLFromPayload } from '../src/app/fallback';

const TEST_BASE = '/GoodCall/';

describe('Fallback Redirect/Restore Algorithm', () => {
  it('accepts valid redirect payload', () => {
    const payload = {
      pathname: '/GoodCall/catalog/laptops',
      search: '',
      hash: '',
      timestamp: Date.now(),
    };

    const validation = validateRedirectPayload(payload, TEST_BASE);
    expect(validation.valid).toBe(true);
  });

  it('restores URL with pathname, query, and hash', () => {
    const payload = {
      pathname: '/GoodCall/products/test-product',
      search: '?ref=promo',
      hash: '#details',
      timestamp: Date.now(),
    };

    const restoredURL = restoreURLFromPayload(payload, TEST_BASE);
    expect(restoredURL).toBe('/GoodCall/products/test-product?ref=promo#details');
  });

  it('rejects payload with external pathname', () => {
    const payload = {
      pathname: '/admin/hack',
      search: '',
      hash: '',
      timestamp: Date.now(),
    };

    const validation = validateRedirectPayload(payload, TEST_BASE);
    expect(validation.valid).toBe(false);
    expect(validation.error).toContain('app base');
  });

  it('rejects payload with protocol-relative URL', () => {
    const payload = {
      pathname: '//evil.com/attack',
      search: '',
      hash: '',
      timestamp: Date.now(),
    };

    const validation = validateRedirectPayload(payload, TEST_BASE);
    expect(validation.valid).toBe(false);
  });

  it('rejects expired timestamp', () => {
    const payload = {
      pathname: '/GoodCall/test',
      search: '',
      hash: '',
      timestamp: Date.now() - 6000, // 6 seconds ago
    };

    const validation = validateRedirectPayload(payload, TEST_BASE);
    expect(validation.valid).toBe(false);
    expect(validation.error).toContain('expired');
  });

  it('rejects future timestamp', () => {
    const payload = {
      pathname: '/GoodCall/test',
      search: '',
      hash: '',
      timestamp: Date.now() + 1000, // 1 second in future
    };

    const validation = validateRedirectPayload(payload, TEST_BASE);
    expect(validation.valid).toBe(false);
    expect(validation.error).toContain('future');
  });

  it('rejects malformed JSON payload', () => {
    const validation = validateRedirectPayload('not json', TEST_BASE);
    expect(validation.valid).toBe(false);
  });

  it('rejects null payload', () => {
    const validation = validateRedirectPayload(null, TEST_BASE);
    expect(validation.valid).toBe(false);
  });

  it('preserves query string in restoration', () => {
    const payload = {
      pathname: '/GoodCall/search',
      search: '?q=laptop&sort=price',
      hash: '',
      timestamp: Date.now(),
    };

    const restoredURL = restoreURLFromPayload(payload, TEST_BASE);
    expect(restoredURL).toContain('q=laptop');
    expect(restoredURL).toContain('sort=price');
  });

  it('preserves hash/fragment in restoration', () => {
    const payload = {
      pathname: '/GoodCall/docs',
      search: '',
      hash: '#section-api',
      timestamp: Date.now(),
    };

    const restoredURL = restoreURLFromPayload(payload, TEST_BASE);
    expect(restoredURL).toContain('#section-api');
  });

  it('rejects missing pathname', () => {
    const payload = {
      search: '',
      hash: '',
      timestamp: Date.now(),
    };

    const validation = validateRedirectPayload(payload, TEST_BASE);
    expect(validation.valid).toBe(false);
  });

  it('rejects missing timestamp', () => {
    const payload = {
      pathname: '/GoodCall/test',
      search: '',
      hash: '',
    };

    const validation = validateRedirectPayload(payload, TEST_BASE);
    expect(validation.valid).toBe(false);
  });

  it('rejects non-finite timestamp', () => {
    const payload = {
      pathname: '/GoodCall/test',
      search: '',
      hash: '',
      timestamp: Infinity,
    };

    const validation = validateRedirectPayload(payload, TEST_BASE);
    expect(validation.valid).toBe(false);
  });

  it('allows empty search and hash', () => {
    const payload = {
      pathname: '/GoodCall/home',
      search: '',
      hash: '',
      timestamp: Date.now(),
    };

    const validation = validateRedirectPayload(payload, TEST_BASE);
    expect(validation.valid).toBe(true);

    const restoredURL = restoreURLFromPayload(payload, TEST_BASE);
    expect(restoredURL).toBe('/GoodCall/home');
  });

  it('accepts valid payload removal', () => {
    const validation = validateRedirectPayload(null, TEST_BASE);
    expect(validation.valid).toBe(false);
  });

  it('rejects alternative base path', () => {
    const payload = {
      pathname: '/other-app/test',
      search: '',
      hash: '',
      timestamp: Date.now(),
    };

    const validation = validateRedirectPayload(payload, TEST_BASE);
    expect(validation.valid).toBe(false);
  });

  it('restores with multiple query params', () => {
    const payload = {
      pathname: '/GoodCall/search',
      search: '?q=test&page=2&sort=asc',
      hash: '',
      timestamp: Date.now(),
    };

    const restoredURL = restoreURLFromPayload(payload, TEST_BASE);
    expect(restoredURL).toBe('/GoodCall/search?q=test&page=2&sort=asc');
  });

  it('restores with both query and hash', () => {
    const payload = {
      pathname: '/GoodCall/docs',
      search: '?lang=en',
      hash: '#api-section',
      timestamp: Date.now(),
    };

    const restoredURL = restoreURLFromPayload(payload, TEST_BASE);
    expect(restoredURL).toBe('/GoodCall/docs?lang=en#api-section');
  });
});
