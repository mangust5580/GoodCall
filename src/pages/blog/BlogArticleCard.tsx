import { Picture } from '../../components/media';
import { Chip, Icon } from '../../components/ui';
import type { BlogArticle } from './blogArticles';
import { blogCategory, formatBlogDate } from './blogListing';

const COVER_SIZES =
  '(max-width: 620px) calc(100vw - 48px), (max-width: 1023px) calc((100vw - 76px) / 2), (max-width: 1440px) calc((100vw - 488px) / 2), 470px';

interface BlogArticleCardProps {
  readonly article: BlogArticle;
  readonly priority?: boolean;
  readonly href?: string;
}

export function BlogArticleCard({ article, priority = false, href }: BlogArticleCardProps) {
  const category = blogCategory(article.category);
  const cover = (
    <Picture
      alt=""
      className="blog-card__image"
      loading={priority ? 'eager' : 'lazy'}
      sizes={COVER_SIZES}
      source={article.cover}
    />
  );

  return (
    <article className="blog-card">
      <div className="blog-card__media">
        {href === undefined ? (
          cover
        ) : (
          <a aria-hidden="true" className="blog-card__cover-link" href={href} tabIndex={-1}>
            {cover}
          </a>
        )}
        {category === undefined ? null : (
          <span className="blog-card__badge">
            <Chip>{category.label}</Chip>
          </span>
        )}
      </div>
      <div className="blog-card__body">
        <h3 className="blog-card__title">
          {href === undefined ? (
            article.title
          ) : (
            <a className="blog-card__link" href={href}>
              {article.title}
            </a>
          )}
        </h3>
        <p className="blog-card__excerpt">{article.excerpt}</p>
        <p className="blog-card__date">
          <Icon className="blog-card__date-icon" name="calendar" />
          <time dateTime={article.publishedAt}>{formatBlogDate(article.publishedAt)}</time>
        </p>
      </div>
    </article>
  );
}
