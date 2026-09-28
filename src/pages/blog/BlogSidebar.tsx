import { Picture } from '../../components/media';
import { Icon, SearchField } from '../../components/ui';
import { BLOG_CATEGORIES } from './blogArticles';
import type { BlogArticle, BlogCategoryId } from './blogArticles';
import { formatBlogDate } from './blogListing';

const THUMB_SIZES = '168px';

interface BlogSearchPanelProps {
  readonly className: string;
  readonly query: string;
  readonly onQueryChange: (query: string) => void;
}

export function BlogSearchPanel({ className, query, onQueryChange }: BlogSearchPanelProps) {
  return (
    <section aria-labelledby="blog-search-title" className={`blog-panel ${className}`}>
      <h2 className="blog-panel__title" id="blog-search-title">
        Поиск по блогу
      </h2>
      <div role="search">
        <SearchField
          defaultValue={query}
          key={query}
          label="Ключевое слово для поиска по блогу"
          labelVisuallyHidden
          name="q"
          onClear={() => {
            if (query !== '') {
              onQueryChange('');
            }
          }}
          onSubmit={onQueryChange}
          placeholder="Введите ключевое слово"
        />
      </div>
    </section>
  );
}

interface BlogCategoriesPanelProps {
  readonly className: string;
  readonly category: BlogCategoryId | undefined;
  readonly onCategoryChange: (category: BlogCategoryId | undefined) => void;
}

export function BlogCategoriesPanel({
  className,
  category,
  onCategoryChange,
}: BlogCategoriesPanelProps) {
  return (
    <section aria-labelledby="blog-categories-title" className={`blog-panel ${className}`}>
      <h2 className="blog-panel__title" id="blog-categories-title">
        Категории
      </h2>
      <div aria-labelledby="blog-categories-title" className="blog-categories" role="group">
        <button
          aria-pressed={category === undefined}
          className="blog-categories__item"
          onClick={() => {
            onCategoryChange(undefined);
          }}
          type="button"
        >
          Все статьи
        </button>
        {BLOG_CATEGORIES.map((item) => (
          <button
            aria-pressed={category === item.id}
            className="blog-categories__item"
            key={item.id}
            onClick={() => {
              onCategoryChange(category === item.id ? undefined : item.id);
            }}
            type="button"
          >
            {item.label}
          </button>
        ))}
      </div>
    </section>
  );
}

interface BlogPopularPanelProps {
  readonly className: string;
  readonly articles: readonly BlogArticle[];
}

export function BlogPopularPanel({ className, articles }: BlogPopularPanelProps) {
  return (
    <section aria-labelledby="blog-popular-title" className={`blog-panel ${className}`}>
      <h2 className="blog-panel__title" id="blog-popular-title">
        Популярные статьи
      </h2>
      <ul className="blog-popular">
        {articles.map((article) => (
          <li className="blog-popular__item" key={article.slug}>
            <Picture
              alt=""
              className="blog-popular__thumb"
              sizes={THUMB_SIZES}
              source={article.cover}
            />
            <div className="blog-popular__text">
              <p className="blog-popular__title">{article.title}</p>
              <time className="blog-popular__date" dateTime={article.publishedAt}>
                {formatBlogDate(article.publishedAt)}
              </time>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

interface BlogLatestPanelProps {
  readonly className: string;
  readonly articles: readonly BlogArticle[];
  readonly articleHref: (slug: string) => string | undefined;
}

export function BlogLatestPanel({ className, articles, articleHref }: BlogLatestPanelProps) {
  return (
    <section aria-labelledby="blog-latest-title" className={`blog-panel ${className}`}>
      <h2 className="blog-panel__title" id="blog-latest-title">
        Последние статьи
      </h2>
      <ul className="blog-latest">
        {articles.map((article) => {
          const href = articleHref(article.slug);

          return (
            <li className="blog-latest__item" key={article.slug}>
              <Icon className="blog-latest__icon" name="clock" />
              <div className="blog-latest__text">
                <p className="blog-latest__title">
                  {href === undefined ? (
                    article.title
                  ) : (
                    <a className="blog-latest__link" href={href}>
                      {article.title}
                    </a>
                  )}
                </p>
                <time className="blog-latest__date" dateTime={article.publishedAt}>
                  {formatBlogDate(article.publishedAt)}
                </time>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

interface BlogCategoryLinksPanelProps {
  readonly className: string;
  readonly categoryHref: (category: BlogCategoryId | undefined) => string;
}

export function BlogCategoryLinksPanel({ className, categoryHref }: BlogCategoryLinksPanelProps) {
  return (
    <nav aria-labelledby="blog-categories-title" className={`blog-panel ${className}`}>
      <h2 className="blog-panel__title" id="blog-categories-title">
        Категории
      </h2>
      <ul className="blog-categories">
        <li>
          <a className="blog-categories__item" href={categoryHref(undefined)}>
            Все статьи
          </a>
        </li>
        {BLOG_CATEGORIES.map((item) => (
          <li key={item.id}>
            <a className="blog-categories__item" href={categoryHref(item.id)}>
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
