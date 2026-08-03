import { describe, it, expect } from 'vitest';
import {
  routeRegistry,
  validateRouteRegistry,
  categorySlugSchema,
  productSlugSchema,
} from '@/app/routing/registry';

describe('Route Registry', () => {
  it('has unique route keys', () => {
    const keys = routeRegistry.map((r) => r.key);
    const uniqueKeys = new Set(keys);
    expect(keys.length).toBe(uniqueKeys.size);
  });

  it('has unique route IDs', () => {
    const ids = routeRegistry.map((r) => r.id);
    const uniqueIds = new Set(ids);
    expect(ids.length).toBe(uniqueIds.size);
  });

  it('has app-relative paths', () => {
    routeRegistry.forEach((route) => {
      if (route.path !== '*') {
        expect(route.path).toMatch(/^\/|^\*/);
      }
    });
  });

  it('paths do not contain repository literal', () => {
    routeRegistry.forEach((route) => {
      expect(route.path).not.toContain('GoodCall');
    });
  });

  it('catch-all is last', () => {
    const catchAllIndex = routeRegistry.findIndex((r) => r.path === '*');
    expect(catchAllIndex).toBe(routeRegistry.length - 1);
  });

  it('has all representative routes', () => {
    const keys = new Set(routeRegistry.map((r) => r.key));
    expect(keys.has('home')).toBe(true);
    expect(keys.has('catalog.category')).toBe(true);
    expect(keys.has('catalog.product')).toBe(true);
    expect(keys.has('cart')).toBe(true);
    expect(keys.has('error.notFound')).toBe(true);
  });

  it('validation passes', () => {
    const errors = validateRouteRegistry();
    expect(errors).toHaveLength(0);
  });

  describe('slug validation', () => {
    it('accepts valid category slug', () => {
      const result = categorySlugSchema.safeParse('laptops');
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe('laptops');
      }
    });

    it('accepts category slug with digits', () => {
      const result = categorySlugSchema.safeParse('laptop-2024');
      expect(result.success).toBe(true);
    });

    it('accepts category slug with hyphens', () => {
      const result = categorySlugSchema.safeParse('gaming-laptops');
      expect(result.success).toBe(true);
    });

    it('rejects category slug with uppercase', () => {
      const result = categorySlugSchema.safeParse('Laptops');
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe('laptops');
      }
    });

    it('rejects empty category slug', () => {
      const result = categorySlugSchema.safeParse('');
      expect(result.success).toBe(false);
    });

    it('rejects category slug with invalid characters', () => {
      const result = categorySlugSchema.safeParse('laptop@2024');
      expect(result.success).toBe(false);
    });

    it('accepts valid product slug', () => {
      const result = productSlugSchema.safeParse('demo-product');
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe('demo-product');
      }
    });

    it('rejects empty product slug', () => {
      const result = productSlugSchema.safeParse('');
      expect(result.success).toBe(false);
    });
  });
});
