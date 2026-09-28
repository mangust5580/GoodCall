import { useNavigate, useParams } from 'react-router-dom';

import { BlogArticlePage } from '../pages/blog';
import { blogArticleDetail } from '../pages/blog/blogArticleDetails';
import type { BlogCategoryId } from '../pages/blog/blogArticles';
import { normalizeBlogQuery } from '../pages/blog/blogListing';
import { NotFoundRoute } from './NotFoundRoute';
import { ProductionShell } from './ProductionShell';
import {
  BLOG_PATH,
  HOME_PATH,
  blogArticleHref,
  blogArticlePath,
  blogPath,
  hashHref,
} from './routes';

const CATEGORY_PARAM = 'category';
const QUERY_PARAM = 'q';

function categoryHref(category: BlogCategoryId | undefined): string {
  return hashHref(category === undefined ? BLOG_PATH : blogPath({ [CATEGORY_PARAM]: category }));
}

export function BlogArticleRoute() {
  const { slug = '' } = useParams();
  const navigate = useNavigate();
  const detail = blogArticleDetail(slug);

  if (detail === undefined) {
    return <NotFoundRoute />;
  }

  const handleSearchSubmit = (value: string) => {
    const query = normalizeBlogQuery(value);

    if (query !== '') {
      void navigate(blogPath({ [QUERY_PARAM]: query }));
    }
  };

  const shareUrl = `${window.location.origin}${window.location.pathname}${hashHref(blogArticlePath(detail.article.slug))}`;

  return (
    <ProductionShell>
      <BlogArticlePage
        articleHref={blogArticleHref}
        blogHref={hashHref(BLOG_PATH)}
        categoryHref={categoryHref}
        detail={detail}
        homeHref={hashHref(HOME_PATH)}
        onSearchSubmit={handleSearchSubmit}
        shareUrl={shareUrl}
      />
    </ProductionShell>
  );
}
