import type { ComponentType } from 'react';

import type { BlogArticle } from './blogArticles';
import {
  BLOG_ARTICLE_DETAIL_METADATA,
  findBlogArticle,
  isBlogArticleDetailSlug,
} from './blogArticleRegistry';
import type { BlogArticleDetailSlug } from './blogArticleRegistry';
import { BestSmartphonesUnder30000Body } from './BestSmartphonesUnder30000Body';
import { ExtendSmartphoneBatteryLifeBody } from './ExtendSmartphoneBatteryLifeBody';
import { GoodcallSpringSaleBody } from './GoodcallSpringSaleBody';
import { HowToChooseSmartphone2024Body } from './HowToChooseSmartphone2024Body';
import { HowToChooseWirelessEarbudsBody } from './HowToChooseWirelessEarbudsBody';
import { IphoneVsSamsung2024Body } from './IphoneVsSamsung2024Body';
import { MacbookAirM3Body } from './MacbookAirM3Body';
import { NewAppleWatchChangesBody } from './NewAppleWatchChangesBody';
import { TabletForWorkAndStudyBody } from './TabletForWorkAndStudyBody';

export interface BlogArticleDetail {
  readonly article: BlogArticle;
  readonly readingMinutes: number;
  readonly relatedArticles: readonly BlogArticle[];
  readonly Body: ComponentType;
}

const BLOG_ARTICLE_BODIES: Readonly<Record<BlogArticleDetailSlug, ComponentType>> = {
  'how-to-choose-smartphone-2024': HowToChooseSmartphone2024Body,
  'extend-smartphone-battery-life': ExtendSmartphoneBatteryLifeBody,
  'how-to-choose-wireless-earbuds': HowToChooseWirelessEarbudsBody,
  'tablet-for-work-and-study': TabletForWorkAndStudyBody,
  'iphone-vs-samsung-2024': IphoneVsSamsung2024Body,
  'macbook-air-m3-review': MacbookAirM3Body,
  'best-smartphones-under-30000': BestSmartphonesUnder30000Body,
  'goodcall-spring-sale': GoodcallSpringSaleBody,
  'new-apple-watch-changes': NewAppleWatchChangesBody,
};

export function blogArticleDetail(slug: string): BlogArticleDetail | undefined {
  if (!isBlogArticleDetailSlug(slug)) {
    return undefined;
  }

  const article = findBlogArticle(slug);

  if (article === undefined) {
    return undefined;
  }

  const metadata = BLOG_ARTICLE_DETAIL_METADATA[slug];

  return {
    article,
    readingMinutes: metadata.readingMinutes,
    relatedArticles: metadata.relatedSlugs.flatMap(
      (relatedSlug) => findBlogArticle(relatedSlug) ?? [],
    ),
    Body: BLOG_ARTICLE_BODIES[slug],
  };
}
