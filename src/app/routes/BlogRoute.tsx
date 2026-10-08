import { useSearchParams } from 'react-router-dom';

import {
  BLOG_ARTICLES,
  BlogPage,
  normalizeBlogQuery,
  parseBlogCategory,
  parseBlogPage,
} from '../../pages/blog';
import type { BlogCategoryId } from '../../pages/blog';
import { ProductionShell } from '../ProductionShell';
import { HOME_PATH, blogArticleHref, hashHref } from '../routePaths';
import { useDocumentTitle } from '../useDocumentTitle';

const CATEGORY_PARAM = 'category';
const QUERY_PARAM = 'q';
const PAGE_PARAM = 'page';

export function BlogRoute() {
  const [searchParams, setSearchParams] = useSearchParams();
  const category = parseBlogCategory(searchParams.get(CATEGORY_PARAM));
  const query = normalizeBlogQuery(searchParams.get(QUERY_PARAM) ?? '');
  const page = parseBlogPage(searchParams.get(PAGE_PARAM));
  useDocumentTitle('Блог');

  const updateParam = (name: string, value: string | undefined) => {
    setSearchParams((current) => {
      const next = new URLSearchParams(current);

      if (value === undefined || value === '') {
        next.delete(name);
      } else {
        next.set(name, value);
      }

      next.delete(PAGE_PARAM);

      return next;
    });
  };

  const handleCategoryChange = (nextCategory: BlogCategoryId | undefined) => {
    updateParam(CATEGORY_PARAM, nextCategory);
  };

  const handleQueryChange = (nextQuery: string) => {
    updateParam(QUERY_PARAM, normalizeBlogQuery(nextQuery));
  };

  const handlePageChange = (nextPage: number) => {
    setSearchParams((current) => {
      const next = new URLSearchParams(current);

      if (nextPage <= 1) {
        next.delete(PAGE_PARAM);
      } else {
        next.set(PAGE_PARAM, String(nextPage));
      }

      return next;
    });
  };

  const handleReset = () => {
    setSearchParams(new URLSearchParams());
  };

  return (
    <ProductionShell>
      <BlogPage
        articleHref={blogArticleHref}
        articles={BLOG_ARTICLES}
        category={category}
        homeHref={hashHref(HOME_PATH)}
        onCategoryChange={handleCategoryChange}
        onPageChange={handlePageChange}
        onQueryChange={handleQueryChange}
        onReset={handleReset}
        page={page}
        query={query}
      />
    </ProductionShell>
  );
}
