import type { ReactNode } from 'react';

import { BlogArticleRoute } from './BlogArticleRoute';
import { BlogRoute } from './BlogRoute';

export type BlogFlowRouteName = 'blog' | 'blog-article';

interface BlogFlowRouteProps {
  readonly name: BlogFlowRouteName;
  readonly notFound: ReactNode;
}

export default function BlogFlowRoute({ name, notFound }: BlogFlowRouteProps) {
  switch (name) {
    case 'blog':
      return <BlogRoute />;
    case 'blog-article':
      return <BlogArticleRoute notFound={notFound} />;
  }
}
