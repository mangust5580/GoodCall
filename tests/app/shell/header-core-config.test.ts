import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  CATALOG_LABEL,
  CATALOG_REPRESENTATIVE_SLUG,
  PRIMARY_NAV_LABEL,
  SEARCH_EMPTY_ERROR,
  SEARCH_FIELD_LABEL,
  SEARCH_LANDMARK_LABEL,
  SEARCH_QUERY_PARAM,
  SEARCH_SUBMIT_LABEL,
  buildSearchLocation,
  catalogPath,
  readSearchQuery,
  searchPath,
} from '@/app/shell/site-header/header-core-config';
import { categorySlugSchema, getRouteMetadata, routeRegistry } from '@/app/routing/registry';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');

describe('Header core configuration', () => {
  describe('canonical labels', () => {
    it('uses the exact canonical names', () => {
      expect(PRIMARY_NAV_LABEL).toBe('Основная навигация');
      expect(SEARCH_LANDMARK_LABEL).toBe('Поиск по каталогу');
      expect(SEARCH_FIELD_LABEL).toBe('Поиск по каталогу');
      expect(SEARCH_SUBMIT_LABEL).toBe('Найти');
      expect(CATALOG_LABEL).toBe('Каталог');
      expect(SEARCH_EMPTY_ERROR).toBe('Введите поисковый запрос.');
      expect(SEARCH_QUERY_PARAM).toBe('q');
    });
  });

  describe('search destination', () => {
    it('resolves the static search route from the registry', () => {
      expect(searchPath).toBe('/search');
      expect(getRouteMetadata('search')?.path).toBe('/search');
    });

    it('is static, app-relative and free of the repository literal', () => {
      expect(searchPath).not.toContain(':');
      expect(searchPath).not.toBe('*');
      expect(searchPath.startsWith('/')).toBe(true);
      expect(searchPath).not.toContain('GoodCall');
    });
  });

  describe('catalog destination', () => {
    it('derives from the dynamic category route with the representative slug', () => {
      expect(CATALOG_REPRESENTATIVE_SLUG).toBe('laptops');
      expect(getRouteMetadata('catalog.category')?.path).toBe('/catalog/:categorySlug');
      expect(catalogPath).toBe('/catalog/laptops');
    });

    it('validates the representative slug through the existing schema', () => {
      const result = categorySlugSchema.safeParse(CATALOG_REPRESENTATIVE_SLUG);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe('laptops');
      }
    });

    it('produces no unresolved parameter, catch-all or repository literal', () => {
      expect(catalogPath).not.toContain(':');
      expect(catalogPath).not.toBe('*');
      expect(catalogPath).not.toContain('GoodCall');
      expect(catalogPath.startsWith('/')).toBe(true);
    });

    it('does not introduce a catalog root destination', () => {
      expect(catalogPath).not.toBe('/catalog');
      expect(routeRegistry.some((route) => route.path === '/catalog')).toBe(false);
    });
  });

  describe('search query helpers', () => {
    it('builds an encoded search location', () => {
      const location = buildSearchLocation('ноутбук');

      expect(location.pathname).toBe('/search');
      expect(location.search).toBe('?q=%D0%BD%D0%BE%D1%83%D1%82%D0%B1%D1%83%D0%BA');
      expect(new URLSearchParams(location.search).get('q')).toBe('ноутбук');
    });

    it('preserves internal spacing when building a location', () => {
      const location = buildSearchLocation('игровой ноутбук');

      expect(new URLSearchParams(location.search).get('q')).toBe('игровой ноутбук');
    });

    it('reads the query only on the search route', () => {
      expect(readSearchQuery('/search', '?q=ноутбук')).toBe('ноутбук');
      expect(readSearchQuery('/search', '')).toBe('');
      expect(readSearchQuery('/search', '?other=1')).toBe('');
      expect(readSearchQuery('/', '?q=ноутбук')).toBeNull();
      expect(readSearchQuery('/catalog/laptops', '?q=ноутбук')).toBeNull();
    });
  });

  describe('source contract', () => {
    it('derives destinations from the route registry rather than literals', () => {
      const source = fs.readFileSync(
        path.join(repoRoot, 'src', 'app', 'shell', 'site-header', 'header-core-config.ts'),
        'utf-8'
      );

      expect(source).toContain("from '@/app/routing/registry'");
      expect(source).toContain('generatePath');
      expect(source).not.toContain("'/search'");
      expect(source).not.toContain("'/catalog/laptops'");
      expect(source).not.toContain('GoodCall/');
    });
  });

  describe('public boundary', () => {
    it('exports only the SiteHeader component', async () => {
      const barrel = await import('@/app/shell/site-header');

      expect(Object.keys(barrel)).toEqual(['SiteHeader']);
    });
  });
});
