import { BLOG_ARTICLES } from './blogArticles';
import type { BlogArticle } from './blogArticles';

interface BlogArticleDetailMetadata {
  readonly readingMinutes: number;
  readonly relatedSlugs: readonly string[];
}

export const BLOG_ARTICLE_DETAIL_METADATA = {
  'how-to-choose-smartphone-2024': {
    readingMinutes: 8,
    relatedSlugs: [
      'how-to-choose-wireless-earbuds',
      'new-apple-watch-changes',
      'extend-smartphone-battery-life',
    ],
  },
  'extend-smartphone-battery-life': {
    readingMinutes: 6,
    relatedSlugs: [
      'how-to-choose-smartphone-2024',
      'best-smartphones-under-30000',
      'how-to-choose-wireless-earbuds',
    ],
  },
  'how-to-choose-wireless-earbuds': {
    readingMinutes: 6,
    relatedSlugs: [
      'how-to-choose-smartphone-2024',
      'extend-smartphone-battery-life',
      'tablet-for-work-and-study',
    ],
  },
  'tablet-for-work-and-study': {
    readingMinutes: 6,
    relatedSlugs: [
      'how-to-choose-smartphone-2024',
      'how-to-choose-wireless-earbuds',
      'macbook-air-m3-review',
    ],
  },
  'iphone-vs-samsung-2024': {
    readingMinutes: 6,
    relatedSlugs: [
      'how-to-choose-smartphone-2024',
      'extend-smartphone-battery-life',
      'how-to-choose-wireless-earbuds',
    ],
  },
  'macbook-air-m3-review': {
    readingMinutes: 5,
    relatedSlugs: [
      'tablet-for-work-and-study',
      'how-to-choose-smartphone-2024',
      'how-to-choose-wireless-earbuds',
    ],
  },
  'best-smartphones-under-30000': {
    readingMinutes: 6,
    relatedSlugs: [
      'how-to-choose-smartphone-2024',
      'extend-smartphone-battery-life',
      'iphone-vs-samsung-2024',
    ],
  },
  'goodcall-spring-sale': {
    readingMinutes: 6,
    relatedSlugs: [
      'best-smartphones-under-30000',
      'how-to-choose-smartphone-2024',
      'iphone-vs-samsung-2024',
    ],
  },
  'new-apple-watch-changes': {
    readingMinutes: 6,
    relatedSlugs: [
      'iphone-vs-samsung-2024',
      'how-to-choose-wireless-earbuds',
      'extend-smartphone-battery-life',
    ],
  },
} satisfies Record<string, BlogArticleDetailMetadata>;

export type BlogArticleDetailSlug = keyof typeof BLOG_ARTICLE_DETAIL_METADATA;

export function isBlogArticleDetailSlug(slug: string): slug is BlogArticleDetailSlug {
  return Object.hasOwn(BLOG_ARTICLE_DETAIL_METADATA, slug);
}

export function findBlogArticle(slug: string): BlogArticle | undefined {
  return BLOG_ARTICLES.find((article) => article.slug === slug);
}

export function hasBlogArticleDetail(slug: string): boolean {
  return isBlogArticleDetailSlug(slug) && findBlogArticle(slug) !== undefined;
}
