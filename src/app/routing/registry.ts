import { z } from 'zod';

export const categorySlugSchema = z
  .string()
  .toLowerCase()
  .regex(/^[a-z0-9-]+$/, 'Category slug must be lowercase ASCII with optional digits and hyphens')
  .refine((val) => val.length > 0, 'Category slug cannot be empty');

export const productSlugSchema = z
  .string()
  .toLowerCase()
  .regex(/^[a-z0-9-]+$/, 'Product slug must be lowercase ASCII with optional digits and hyphens')
  .refine((val) => val.length > 0, 'Product slug cannot be empty');

export type RouteKey = 'home' | 'catalog.category' | 'catalog.product' | 'cart' | 'error.notFound';

export interface RouteMetadata {
  key: RouteKey;
  id: string;
  path: string;
  access: 'public';
  title: string | ((params?: Record<string, string>) => string);
  lazy?: boolean;
}

export const routeRegistry: RouteMetadata[] = [
  {
    key: 'home',
    id: 'home',
    path: '/',
    access: 'public',
    title: 'GoodCall',
    lazy: true,
  },
  {
    key: 'catalog.category',
    id: 'catalog-category',
    path: '/catalog/:categorySlug',
    access: 'public',
    title: 'Category — GoodCall',
    lazy: true,
  },
  {
    key: 'catalog.product',
    id: 'catalog-product',
    path: '/products/:productSlug',
    access: 'public',
    title: 'Product — GoodCall',
    lazy: true,
  },
  {
    key: 'cart',
    id: 'cart',
    path: '/cart',
    access: 'public',
    title: 'Cart — GoodCall',
    lazy: true,
  },
  {
    key: 'error.notFound',
    id: 'not-found',
    path: '*',
    access: 'public',
    title: 'Page not found — GoodCall',
  },
];

export function getRouteMetadata(key: RouteKey): RouteMetadata | undefined {
  return routeRegistry.find((r) => r.key === key);
}

export function validateRouteRegistry(): string[] {
  const errors: string[] = [];

  const keys = new Set<RouteKey>();
  const ids = new Set<string>();
  let catchAllCount = 0;

  routeRegistry.forEach((route, index) => {
    if (keys.has(route.key)) {
      errors.push(`Duplicate route key at index ${index}: ${route.key}`);
    }
    keys.add(route.key);

    if (ids.has(route.id)) {
      errors.push(`Duplicate route ID at index ${index}: ${route.id}`);
    }
    ids.add(route.id);

    if (!route.path.startsWith('/') && route.path !== '*') {
      errors.push(`Route path must start with / (index ${index}): ${route.path}`);
    }

    if (route.path.includes('GoodCall')) {
      errors.push(`Route path must not contain repository literal (index ${index}): ${route.path}`);
    }

    if (route.path === '*') {
      catchAllCount++;
    }
  });

  if (catchAllCount > 1) {
    errors.push('Catch-all route (*) must be unique');
  }

  if (catchAllCount === 1) {
    const catchAllIndex = routeRegistry.findIndex((r) => r.path === '*');
    if (catchAllIndex !== routeRegistry.length - 1) {
      errors.push('Catch-all route (*) must be last in registry');
    }
  }

  const hasHome = routeRegistry.some((r) => r.key === 'home');
  if (!hasHome) {
    errors.push('Home route must exist');
  }

  const hasCatalogCategory = routeRegistry.some((r) => r.key === 'catalog.category');
  if (!hasCatalogCategory) {
    errors.push('Catalog category route must exist');
  }

  const hasCatalogProduct = routeRegistry.some((r) => r.key === 'catalog.product');
  if (!hasCatalogProduct) {
    errors.push('Catalog product route must exist');
  }

  const hasCart = routeRegistry.some((r) => r.key === 'cart');
  if (!hasCart) {
    errors.push('Cart route must exist');
  }

  const hasCatchAll = routeRegistry.some((r) => r.key === 'error.notFound');
  if (!hasCatchAll) {
    errors.push('Catch-all not-found route must exist');
  }

  return errors;
}
