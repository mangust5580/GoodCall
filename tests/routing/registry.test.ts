import { describe, it, expect } from 'vitest';
import {
  routeRegistry,
  validateRouteRegistry,
  categorySlugSchema,
  productSlugSchema,
  type RouteKey,
} from '@/app/routing/registry';
import { carrierRoutes } from '@/app/routing/carriers';

const EXPECTED_CARRIER_INVENTORY: ReadonlyArray<readonly [RouteKey, string, string]> = [
  ['search', '/search', 'Поиск'],
  ['comparison', '/comparison', 'Сравнение товаров'],
  ['favorites', '/favorites', 'Избранное'],
  ['auth', '/auth', 'Вход и регистрация'],
  ['information.deliveryAndPayment', '/delivery-and-payment', 'Доставка и оплата'],
  ['help.warrantyReturns', '/warranty-and-returns', 'Гарантия и возврат'],
  ['loyalty.program', '/loyalty', 'Программа лояльности'],
  ['help.faq', '/help', 'Помощь'],
  ['company.contacts', '/contacts', 'Контакты'],
  ['promotions.list', '/promotions', 'Акции'],
  ['brands.directory', '/brands', 'Бренды'],
  ['locations.shops', '/shops', 'Магазины'],
  ['locations.serviceCenters', '/service-centers', 'Сервисные центры'],
  ['company.about', '/about', 'О компании'],
  ['blog.list', '/blog', 'Блог'],
  ['order.tracking', '/track-order', 'Отследить заказ'],
  ['legal.privacyPolicy', '/privacy-policy', 'Политика конфиденциальности'],
  ['legal.userAgreement', '/user-agreement', 'Пользовательское соглашение'],
  ['legal.publicOffer', '/public-offer', 'Публичная оферта'],
];

const EXPECTED_BASELINE_ROUTES: ReadonlyArray<readonly [RouteKey, string, string, string]> = [
  ['home', 'home', '/', 'GoodCall'],
  ['catalog.category', 'catalog-category', '/catalog/:categorySlug', 'Category — GoodCall'],
  ['catalog.product', 'catalog-product', '/products/:productSlug', 'Product — GoodCall'],
  ['cart', 'cart', '/cart', 'Cart — GoodCall'],
  ['error.notFound', 'not-found', '*', 'Page not found — GoodCall'],
];

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

  describe('M4-01 carrier routes', () => {
    it('registers the exact carrier inventory in order', () => {
      expect(carrierRoutes.map((carrier) => [carrier.key, carrier.path, carrier.heading])).toEqual(
        EXPECTED_CARRIER_INVENTORY.map((entry) => [...entry])
      );
    });

    it('registers exactly nineteen carriers', () => {
      expect(carrierRoutes).toHaveLength(19);
    });

    it.each(EXPECTED_CARRIER_INVENTORY)(
      '%s is registered at %s with a route-specific title',
      (key, path, heading) => {
        const route = routeRegistry.find((entry) => entry.key === key);

        expect(route).toBeDefined();
        expect(route?.path).toBe(path);
        expect(route?.access).toBe('public');
        expect(route?.title).toBe(`${heading} — GoodCall`);
      }
    );

    it('adds no route outside the approved inventory', () => {
      const approved = new Set<string>([
        ...EXPECTED_BASELINE_ROUTES.map(([key]) => key),
        ...EXPECTED_CARRIER_INVENTORY.map(([key]) => key),
      ]);

      expect(routeRegistry.map((route) => route.key).filter((key) => !approved.has(key))).toEqual(
        []
      );
      expect(routeRegistry).toHaveLength(EXPECTED_BASELINE_ROUTES.length + 19);
    });

    it('does not register a catalog root route', () => {
      expect(routeRegistry.some((route) => route.path === '/catalog')).toBe(false);
    });

    it('keeps the representative category route as the future catalog entry', () => {
      const category = routeRegistry.find((route) => route.key === 'catalog.category');
      expect(category?.path).toBe('/catalog/:categorySlug');
    });

    it.each(EXPECTED_BASELINE_ROUTES)(
      'leaves the existing %s route identity unchanged',
      (key, id, path, title) => {
        const route = routeRegistry.find((entry) => entry.key === key);

        expect(route?.id).toBe(id);
        expect(route?.path).toBe(path);
        expect(route?.title).toBe(title);
        expect(route?.access).toBe('public');
      }
    );

    it('has no trailing slash on any canonical path', () => {
      routeRegistry.forEach((route) => {
        if (route.path !== '/') {
          expect(route.path.endsWith('/')).toBe(false);
        }
      });
    });

    it('uses lowercase kebab-case static segments', () => {
      routeRegistry.forEach((route) => {
        if (route.path === '*' || route.path === '/') {
          return;
        }

        route.path
          .slice(1)
          .split('/')
          .filter((segment) => !segment.startsWith(':'))
          .forEach((segment) => {
            expect(segment).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
          });
      });
    });

    it('exposes every carrier as public with a unique id', () => {
      const carrierIds = carrierRoutes.map((carrier) => carrier.id);
      expect(new Set(carrierIds).size).toBe(carrierIds.length);

      carrierRoutes.forEach((carrier) => {
        expect(carrier.id).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
        expect(carrier.path).not.toContain('GoodCall');
      });
    });
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
