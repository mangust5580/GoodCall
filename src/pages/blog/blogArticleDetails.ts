import type { ComponentType } from 'react';

import { BLOG_ARTICLES } from './blogArticles';
import type { BlogArticle } from './blogArticles';
import { ExtendSmartphoneBatteryLifeBody } from './ExtendSmartphoneBatteryLifeBody';
import { HowToChooseSmartphone2024Body } from './HowToChooseSmartphone2024Body';
import { HowToChooseWirelessEarbudsBody } from './HowToChooseWirelessEarbudsBody';

export interface BlogArticleDetail {
  readonly article: BlogArticle;
  readonly readingMinutes: number;
  readonly relatedArticles: readonly BlogArticle[];
  readonly Body: ComponentType;
}

interface BlogArticleDetailEntry {
  readonly readingMinutes: number;
  readonly relatedSlugs: readonly string[];
  readonly Body: ComponentType;
}

const BLOG_ARTICLE_DETAILS: Readonly<Record<string, BlogArticleDetailEntry>> = {
  'how-to-choose-smartphone-2024': {
    readingMinutes: 8,
    relatedSlugs: [
      'how-to-choose-wireless-earbuds',
      'new-apple-watch-changes',
      'extend-smartphone-battery-life',
    ],
    Body: HowToChooseSmartphone2024Body,
  },
  'extend-smartphone-battery-life': {
    readingMinutes: 6,
    relatedSlugs: [
      'how-to-choose-smartphone-2024',
      'best-smartphones-under-30000',
      'how-to-choose-wireless-earbuds',
    ],
    Body: ExtendSmartphoneBatteryLifeBody,
  },
  'how-to-choose-wireless-earbuds': {
    readingMinutes: 6,
    relatedSlugs: [
      'how-to-choose-smartphone-2024',
      'extend-smartphone-battery-life',
      'tablet-for-work-and-study',
    ],
    Body: HowToChooseWirelessEarbudsBody,
  },
};

function findArticle(slug: string): BlogArticle | undefined {
  return BLOG_ARTICLES.find((article) => article.slug === slug);
}

export function blogArticleDetail(slug: string): BlogArticleDetail | undefined {
  const entry = Object.hasOwn(BLOG_ARTICLE_DETAILS, slug) ? BLOG_ARTICLE_DETAILS[slug] : undefined;
  const article = findArticle(slug);

  if (entry === undefined || article === undefined) {
    return undefined;
  }

  return {
    article,
    readingMinutes: entry.readingMinutes,
    relatedArticles: entry.relatedSlugs.flatMap((relatedSlug) => findArticle(relatedSlug) ?? []),
    Body: entry.Body,
  };
}

export function hasBlogArticleDetail(slug: string): boolean {
  return blogArticleDetail(slug) !== undefined;
}
