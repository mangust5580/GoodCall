import { Breadcrumbs, Container } from '../../components/layout';
import { Picture } from '../../components/media';
import { Icon } from '../../components/ui';
import { BlogArticleCard } from './BlogArticleCard';
import type { BlogArticleDetail } from './blogArticleDetails';
import { BLOG_LATEST_ARTICLES, BLOG_POPULAR_ARTICLES } from './blogArticles';
import type { BlogCategoryId } from './blogArticles';
import { BlogArticleShare } from './BlogArticleShare';
import { blogCategory, formatBlogDate } from './blogListing';
import {
  BlogCategoryLinksPanel,
  BlogLatestPanel,
  BlogPopularPanel,
  BlogSearchPanel,
} from './BlogSidebar';

export interface BlogArticlePageProps {
  readonly detail: BlogArticleDetail;
  readonly homeHref: string;
  readonly blogHref: string;
  readonly shareUrl: string;
  readonly articleHref: (slug: string) => string | undefined;
  readonly categoryHref: (category: BlogCategoryId | undefined) => string;
  readonly onSearchSubmit: (query: string) => void;
}

const COVER_SIZES =
  '(max-width: 1023px) calc(100vw - 32px), (max-width: 1440px) calc(100vw - 460px), 980px';

export function BlogArticlePage({
  detail,
  homeHref,
  blogHref,
  shareUrl,
  articleHref,
  categoryHref,
  onSearchSubmit,
}: BlogArticlePageProps) {
  const { article, readingMinutes, relatedArticles, Body } = detail;
  const category = blogCategory(article.category);
  const otherArticleHref = (slug: string) =>
    slug === article.slug ? undefined : articleHref(slug);

  return (
    <main className="blog-page">
      <Container>
        <Breadcrumbs
          className="blog-page__breadcrumbs"
          items={[
            { label: 'Главная', href: homeHref },
            { label: 'Блог', href: blogHref },
            { label: article.title },
          ]}
        />

        <div className="blog-detail">
          <article aria-labelledby="blog-article-title" className="blog-detail__article">
            <header className="blog-article__header">
              <h1 className="blog-article__title" id="blog-article-title">
                {article.title}
              </h1>
              <ul className="blog-article__meta">
                <li className="blog-article__meta-item">
                  <Icon className="blog-article__meta-icon" name="calendar" />
                  <time dateTime={article.publishedAt}>{formatBlogDate(article.publishedAt)}</time>
                </li>
                {category === undefined ? null : (
                  <li className="blog-article__meta-item">
                    <Icon className="blog-article__meta-icon" name="folder" />
                    {category.label}
                  </li>
                )}
                <li className="blog-article__meta-item">
                  <Icon className="blog-article__meta-icon" name="clock" />
                  {`${String(readingMinutes)} мин на чтение`}
                </li>
              </ul>
            </header>

            <Picture
              alt=""
              className="blog-article__cover"
              fetchPriority="high"
              loading="eager"
              sizes={COVER_SIZES}
              source={article.cover}
            />

            <Body />

            <BlogArticleShare title={article.title} url={shareUrl} />
          </article>

          <section aria-labelledby="blog-related-title" className="blog-detail__related">
            <div className="blog-related__header">
              <h2 className="blog-related__title" id="blog-related-title">
                Похожие статьи
              </h2>
              <a className="blog-related__all" href={blogHref}>
                Смотреть все
              </a>
            </div>
            <ul className="blog-related__grid">
              {relatedArticles.map((related) => (
                <li key={related.slug}>
                  <BlogArticleCard article={related} href={articleHref(related.slug)} />
                </li>
              ))}
            </ul>
          </section>

          <aside aria-label="Блог" className="blog-detail__sidebar">
            <BlogSearchPanel
              className="blog-detail__panel"
              onQueryChange={onSearchSubmit}
              query=""
            />
            <BlogPopularPanel articles={BLOG_POPULAR_ARTICLES} className="blog-detail__panel" />
            <BlogLatestPanel
              articleHref={otherArticleHref}
              articles={BLOG_LATEST_ARTICLES}
              className="blog-detail__panel"
            />
            <BlogCategoryLinksPanel categoryHref={categoryHref} className="blog-detail__panel" />
          </aside>
        </div>
      </Container>
    </main>
  );
}
