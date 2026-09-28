import { useRef } from 'react';

import { BLOG_HERO_MEDIA } from '../../assets/media/blog/blogMedia';
import { Container } from '../../components/layout';
import { Picture } from '../../components/media';
import { Button, Icon, Pagination } from '../../components/ui';
import { BlogArticleCard } from './BlogArticleCard';
import { BLOG_LATEST_ARTICLES, BLOG_POPULAR_ARTICLES } from './blogArticles';
import type { BlogArticle, BlogCategoryId } from './blogArticles';
import {
  blogPageCount,
  blogPageSlice,
  filterBlogArticles,
  formatArticleCount,
} from './blogListing';
import {
  BlogCategoriesPanel,
  BlogLatestPanel,
  BlogPopularPanel,
  BlogSearchPanel,
} from './BlogSidebar';

export interface BlogPageProps {
  readonly articles: readonly BlogArticle[];
  readonly category: BlogCategoryId | undefined;
  readonly query: string;
  readonly page: number;
  readonly onCategoryChange: (category: BlogCategoryId | undefined) => void;
  readonly onQueryChange: (query: string) => void;
  readonly onPageChange: (page: number) => void;
  readonly onReset: () => void;
  readonly homeHref: string;
  readonly articleHref: (slug: string) => string | undefined;
}

const HERO_MEDIA_SIZES = '(max-width: 899px) calc(100vw - 32px), 760px';
const PRIORITY_CARD_COUNT = 2;

export function BlogPage({
  articles,
  category,
  query,
  page,
  onCategoryChange,
  onQueryChange,
  onPageChange,
  onReset,
  homeHref,
  articleHref,
}: BlogPageProps) {
  const articlesRef = useRef<HTMLElement>(null);
  const matches = filterBlogArticles(articles, category, query);
  const pageCount = blogPageCount(matches.length);
  const currentPage = Math.min(page, pageCount);
  const visibleArticles = blogPageSlice(matches, currentPage);
  const filtered = category !== undefined || query !== '';

  const changePage = (nextPage: number) => {
    onPageChange(nextPage);
    articlesRef.current?.scrollIntoView({ block: 'start' });
  };

  return (
    <main className="blog-page">
      <Container>
        <nav aria-label="Хлебные крошки" className="blog-page__breadcrumbs">
          <ol className="blog-page__crumbs">
            <li className="blog-page__crumb">
              <a className="blog-page__crumb-link" href={homeHref}>
                Главная
              </a>
            </li>
            <li aria-current="page" className="blog-page__crumb">
              Блог
            </li>
          </ol>
        </nav>

        <section aria-labelledby="blog-title" className="blog-hero">
          <div className="blog-hero__content">
            <h1 className="blog-hero__title" id="blog-title">
              <span className="blog-hero__accent">Блог</span> GOODCALL
            </h1>
            <p className="blog-hero__lead">
              Новости, обзоры, советы по выбору техники и аксессуаров. Мы помогаем вам быть в курсе
              и делать правильный выбор.
            </p>
          </div>
          <Picture
            alt=""
            className="blog-hero__art"
            fetchPriority="high"
            loading="eager"
            sizes={HERO_MEDIA_SIZES}
            source={BLOG_HERO_MEDIA}
          />
        </section>

        <div className="blog-workspace">
          <BlogSearchPanel
            className="blog-workspace__search"
            onQueryChange={onQueryChange}
            query={query}
          />

          <BlogCategoriesPanel
            category={category}
            className="blog-workspace__categories"
            onCategoryChange={onCategoryChange}
          />

          <section
            aria-labelledby="blog-articles-title"
            className="blog-workspace__articles"
            ref={articlesRef}
          >
            <h2 className="ui-visually-hidden" id="blog-articles-title">
              Статьи
            </h2>

            <div className={filtered ? 'blog-results blog-results--active' : 'blog-results'}>
              <p className="blog-results__count" role="status">
                {filtered
                  ? `${matches.length === 1 ? 'Найдена' : 'Найдено'} ${formatArticleCount(matches.length)}`
                  : ''}
              </p>
              {filtered && matches.length > 0 ? (
                <Button className="blog-results__reset" onClick={onReset} variant="text">
                  Сбросить фильтры
                </Button>
              ) : null}
            </div>

            {matches.length > 0 ? (
              <>
                <ul className="blog-grid">
                  {visibleArticles.map((article, index) => (
                    <li key={article.slug}>
                      <BlogArticleCard
                        article={article}
                        href={articleHref(article.slug)}
                        priority={index < PRIORITY_CARD_COUNT}
                      />
                    </li>
                  ))}
                </ul>

                {pageCount > 1 ? (
                  <div className="blog-workspace__pagination">
                    <Pagination
                      label="Страницы блога"
                      onChange={changePage}
                      page={currentPage}
                      pageCount={pageCount}
                    />
                  </div>
                ) : null}
              </>
            ) : (
              <div className="blog-empty">
                <span className="blog-empty__visual">
                  <Icon className="blog-empty__icon" name="search" />
                </span>
                <h3 className="blog-empty__title">Статьи не найдены</h3>
                <p className="blog-empty__message">
                  По выбранной категории и запросу статей нет. Измените запрос или выберите другую
                  категорию.
                </p>
                <Button onClick={onReset} variant="secondary">
                  Показать все статьи
                </Button>
              </div>
            )}
          </section>

          <BlogPopularPanel articles={BLOG_POPULAR_ARTICLES} className="blog-workspace__popular" />

          <BlogLatestPanel
            articleHref={articleHref}
            articles={BLOG_LATEST_ARTICLES}
            className="blog-workspace__latest"
          />
        </div>
      </Container>
    </main>
  );
}
