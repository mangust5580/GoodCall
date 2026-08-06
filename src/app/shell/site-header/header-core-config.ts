import { generatePath } from 'react-router-dom';
import { categorySlugSchema, getRouteMetadata, type RouteKey } from '@/app/routing/registry';

export const PRIMARY_NAV_LABEL = 'Основная навигация';
export const SEARCH_LANDMARK_LABEL = 'Поиск по каталогу';
export const SEARCH_FIELD_LABEL = 'Поиск по каталогу';
export const SEARCH_SUBMIT_LABEL = 'Найти';
export const SEARCH_EMPTY_ERROR = 'Введите поисковый запрос.';
export const SEARCH_QUERY_PARAM = 'q';
export const CATALOG_LABEL = 'Каталог';
export const CATALOG_REPRESENTATIVE_SLUG = 'laptops';

function assertAppRelative(path: string, key: RouteKey): void {
  if (path === '*') {
    throw new Error(`Header core cannot target the catch-all route: ${key}`);
  }

  if (!path.startsWith('/') || path.includes('GoodCall')) {
    throw new Error(`Header core destination must be an app-relative path: ${path}`);
  }
}

function resolveStaticPath(key: RouteKey): string {
  const metadata = getRouteMetadata(key);

  if (metadata === undefined) {
    throw new Error(`Header core references an unregistered route key: ${key}`);
  }

  assertAppRelative(metadata.path, key);

  if (metadata.path.includes(':')) {
    throw new Error(`Header core expected a static route for ${key}, received ${metadata.path}`);
  }

  return metadata.path;
}

function resolveCatalogPath(): string {
  const key: RouteKey = 'catalog.category';
  const metadata = getRouteMetadata(key);

  if (metadata === undefined) {
    throw new Error(`Header core references an unregistered route key: ${key}`);
  }

  assertAppRelative(metadata.path, key);

  if (!metadata.path.includes(':categorySlug')) {
    throw new Error(`Header core expected a dynamic category route, received ${metadata.path}`);
  }

  const slug = categorySlugSchema.parse(CATALOG_REPRESENTATIVE_SLUG);
  const generated = generatePath(metadata.path, { categorySlug: slug });

  if (generated.includes(':') || generated.includes('GoodCall') || !generated.startsWith('/')) {
    throw new Error(`Header core generated an unusable catalog destination: ${generated}`);
  }

  return generated;
}

export const searchPath = resolveStaticPath('search');
export const catalogPath = resolveCatalogPath();

export function buildSearchLocation(query: string): { pathname: string; search: string } {
  const params = new URLSearchParams();
  params.set(SEARCH_QUERY_PARAM, query);

  return { pathname: searchPath, search: `?${params.toString()}` };
}

export function readSearchQuery(pathname: string, search: string): string | null {
  if (pathname !== searchPath) {
    return null;
  }

  return new URLSearchParams(search).get(SEARCH_QUERY_PARAM) ?? '';
}
