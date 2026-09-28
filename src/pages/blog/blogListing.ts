import { BLOG_CATEGORIES } from './blogArticles';
import type { BlogArticle, BlogCategory, BlogCategoryId } from './blogArticles';

export const BLOG_ARTICLES_PER_PAGE = 8;

const LOCALE = 'ru-RU';
const dateFormatter = new Intl.DateTimeFormat(LOCALE, {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'UTC',
});
const pluralRules = new Intl.PluralRules(LOCALE);

const ARTICLE_WORDS: Readonly<Record<Intl.LDMLPluralRule, string>> = {
  zero: 'статей',
  one: 'статья',
  two: 'статьи',
  few: 'статьи',
  many: 'статей',
  other: 'статьи',
};

export function parseBlogCategory(value: string | null): BlogCategoryId | undefined {
  return BLOG_CATEGORIES.find((category) => category.id === value)?.id;
}

export function blogCategory(id: BlogCategoryId): BlogCategory | undefined {
  return BLOG_CATEGORIES.find((category) => category.id === id);
}

export function parseBlogPage(value: string | null): number {
  const page = value === null ? Number.NaN : Number(value);

  return Number.isInteger(page) && page > 0 ? page : 1;
}

export function normalizeBlogQuery(value: string): string {
  return value.trim().replace(/\s+/g, ' ');
}

export function filterBlogArticles(
  articles: readonly BlogArticle[],
  category: BlogCategoryId | undefined,
  query: string,
): readonly BlogArticle[] {
  const needle = normalizeBlogQuery(query).toLocaleLowerCase(LOCALE);

  return articles.filter(
    (article) =>
      (category === undefined || article.category === category) &&
      (needle === '' ||
        `${article.title} ${article.excerpt}`.toLocaleLowerCase(LOCALE).includes(needle)),
  );
}

export function blogPageCount(articleCount: number): number {
  return Math.max(1, Math.ceil(articleCount / BLOG_ARTICLES_PER_PAGE));
}

export function blogPageSlice(
  articles: readonly BlogArticle[],
  page: number,
): readonly BlogArticle[] {
  const start = (page - 1) * BLOG_ARTICLES_PER_PAGE;

  return articles.slice(start, start + BLOG_ARTICLES_PER_PAGE);
}

export function formatBlogDate(isoDate: string): string {
  const parts = dateFormatter.formatToParts(new Date(`${isoDate}T00:00:00Z`));
  const part = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((item) => item.type === type)?.value ?? '';

  return `${part('day')} ${part('month')} ${part('year')}`;
}

export function formatArticleCount(value: number): string {
  return `${String(value)} ${ARTICLE_WORDS[pluralRules.select(value)]}`;
}
