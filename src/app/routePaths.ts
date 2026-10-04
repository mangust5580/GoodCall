import { hasBlogArticleDetail } from '../pages/blog';
import { hasProductDetailsContent } from '../pages/product-details';

export const HOME_PATH = '/';
export const CATALOG_SMARTPHONES_PATH = '/catalog/smartphones';
export const PRODUCT_PATH = '/product/:slug';
export const CART_PATH = '/cart';
export const CHECKOUT_PATH = '/checkout';
export const ORDER_CONFIRMATION_PATH = '/order-confirmation';
export const FAVORITES_PATH = '/favorites';
export const COMPARE_PATH = '/compare';
export const SHOPS_PATH = '/shops';
export const DELIVERY_PATH = '/delivery';
export const WARRANTY_PATH = '/warranty';
export const FAQ_PATH = '/faq';
export const CONTACTS_PATH = '/contacts';
export const ABOUT_PATH = '/about';
export const PRIVACY_PATH = '/privacy';
export const TERMS_PATH = '/terms';
export const OFFER_PATH = '/offer';
export const SEARCH_PATH = '/search';
export const SEARCH_QUERY_PARAM = 'q';
export const BLOG_PATH = '/blog';
export const BLOG_ARTICLE_PATH = '/blog/:slug';

export function searchPath(query: string): string {
  return `${SEARCH_PATH}?${new URLSearchParams({ [SEARCH_QUERY_PARAM]: query }).toString()}`;
}

export function hashHref(path: string): string {
  return `#${path}`;
}

export function productPath(slug: string): string {
  return `/product/${encodeURIComponent(slug)}`;
}

export function productDetailsHref(slug: string): string | undefined {
  return hasProductDetailsContent(slug) ? hashHref(productPath(slug)) : undefined;
}

export function blogPath(params: Readonly<Record<string, string>> = {}): string {
  const query = new URLSearchParams(params).toString();

  return query === '' ? BLOG_PATH : `${BLOG_PATH}?${query}`;
}

export function blogArticlePath(slug: string): string {
  return `${BLOG_PATH}/${encodeURIComponent(slug)}`;
}

export function blogArticleHref(slug: string): string | undefined {
  return hasBlogArticleDetail(slug) ? hashHref(blogArticlePath(slug)) : undefined;
}
