import { BLOG_COVER_MEDIA } from '../../assets/media/blog/blogMedia';
import type { PictureSource } from '../../components/media';

export type BlogCategoryId =
  'comparisons' | 'guides' | 'selections' | 'news' | 'tips' | 'promotions' | 'reviews';

export interface BlogCategory {
  readonly id: BlogCategoryId;
  readonly label: string;
}

export interface BlogArticle {
  readonly slug: string;
  readonly title: string;
  readonly excerpt: string;
  readonly category: BlogCategoryId;
  readonly publishedAt: string;
  readonly cover: PictureSource;
}

export const BLOG_CATEGORIES: readonly BlogCategory[] = [
  { id: 'comparisons', label: 'Сравнения' },
  { id: 'guides', label: 'Гайды' },
  { id: 'selections', label: 'Подборки' },
  { id: 'news', label: 'Новости' },
  { id: 'tips', label: 'Советы' },
  { id: 'promotions', label: 'Акции' },
  { id: 'reviews', label: 'Обзоры' },
];

const CORPUS: readonly BlogArticle[] = [
  {
    slug: 'iphone-vs-samsung-2024',
    title: 'Что выбрать: iPhone или Samsung в 2024 году',
    excerpt:
      'Сравниваем ключевые флагманы по камерам, производительности, автономности и цене, чтобы помочь вам сделать правильный выбор.',
    category: 'comparisons',
    publishedAt: '2024-05-12',
    cover: BLOG_COVER_MEDIA.iphoneVsSamsung2024,
  },
  {
    slug: 'how-to-choose-wireless-earbuds',
    title: 'Как выбрать беспроводные наушники',
    excerpt:
      'Разбираем важные характеристики, на которые стоит обратить внимание при выборе идеальных наушников.',
    category: 'guides',
    publishedAt: '2024-05-10',
    cover: BLOG_COVER_MEDIA.howToChooseWirelessEarbuds,
  },
  {
    slug: 'best-smartphones-under-30000',
    title: 'Лучшие смартфоны до 30\u00a0000\u00a0₽',
    excerpt:
      'Подборка оптимальных смартфонов в среднем бюджете с отличной камерой и производительностью.',
    category: 'selections',
    publishedAt: '2024-05-08',
    cover: BLOG_COVER_MEDIA.bestSmartphonesUnder30000,
  },
  {
    slug: 'new-apple-watch-changes',
    title: 'Новый Apple Watch: что изменилось',
    excerpt: 'Обзор обновлённой модели: новые функции, улучшения и стоит ли обновляться.',
    category: 'news',
    publishedAt: '2024-05-06',
    cover: BLOG_COVER_MEDIA.newAppleWatchChanges,
  },
  {
    slug: 'tablet-for-work-and-study',
    title: 'Гид по выбору планшета для работы и учебы',
    excerpt: 'Как выбрать планшет для учёбы, работы и развлечений: советы и рекомендации.',
    category: 'guides',
    publishedAt: '2024-05-04',
    cover: BLOG_COVER_MEDIA.tabletForWorkAndStudy,
  },
  {
    slug: 'extend-smartphone-battery-life',
    title: 'Как продлить срок службы аккумулятора смартфона',
    excerpt: 'Простые и эффективные советы для увеличения времени работы вашего устройства.',
    category: 'tips',
    publishedAt: '2024-05-02',
    cover: BLOG_COVER_MEDIA.extendSmartphoneBatteryLife,
  },
  {
    slug: 'goodcall-spring-sale',
    title: 'Весенние скидки в GOODCALL',
    excerpt:
      'Собрали для вас лучшие предложения этой недели. Успейте выгодно обновить свою технику!',
    category: 'promotions',
    publishedAt: '2024-04-30',
    cover: BLOG_COVER_MEDIA.goodcallSpringSale,
  },
  {
    slug: 'how-to-choose-smartphone-2024',
    title: 'Как выбрать смартфон в 2024 году',
    excerpt:
      'Разбираемся, как не запутаться в характеристиках и выбрать устройство, которое действительно подойдет именно вам.',
    category: 'guides',
    publishedAt: '2024-04-30',
    cover: BLOG_COVER_MEDIA.howToChooseSmartphone2024,
  },
  {
    slug: 'macbook-air-m3-review',
    title: 'Обзор MacBook Air M3: лёгкость и мощность',
    excerpt: 'Тестируем новинку от Apple и рассказываем, кому подойдёт новый MacBook Air.',
    category: 'reviews',
    publishedAt: '2024-04-28',
    cover: BLOG_COVER_MEDIA.macbookAirM3Review,
  },
];

export const BLOG_ARTICLES: readonly BlogArticle[] = CORPUS.map((article, index) => ({
  article,
  index,
}))
  .sort((a, b) => b.article.publishedAt.localeCompare(a.article.publishedAt) || a.index - b.index)
  .map(({ article }) => article);

const BLOG_POPULAR_SLUGS: readonly string[] = [
  'iphone-vs-samsung-2024',
  'how-to-choose-wireless-earbuds',
  'best-smartphones-under-30000',
  'new-apple-watch-changes',
  'tablet-for-work-and-study',
];

export const BLOG_POPULAR_ARTICLES: readonly BlogArticle[] = BLOG_POPULAR_SLUGS.flatMap((slug) =>
  BLOG_ARTICLES.filter((article) => article.slug === slug),
);

const BLOG_LATEST_LIMIT = 5;

export const BLOG_LATEST_ARTICLES: readonly BlogArticle[] = BLOG_ARTICLES.filter(
  (article) => !BLOG_POPULAR_ARTICLES.includes(article),
).slice(0, BLOG_LATEST_LIMIT);
