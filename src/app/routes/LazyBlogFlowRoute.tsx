import { Component, Suspense, lazy } from 'react';
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

import { RouteStatus } from '../../components/feedback';
import { Button } from '../../components/ui';
import { ProductionShell } from '../ProductionShell';
import { HOME_PATH } from '../routePaths';
import { useDocumentTitle } from '../useDocumentTitle';
import type { BlogFlowRouteName } from './BlogFlowRoutes';

class BlogFlowChunkLoadError extends Error {
  constructor(cause: unknown) {
    super('Blog flow chunk failed to load', { cause });
    this.name = 'BlogFlowChunkLoadError';
  }
}

const BlogFlowRoute = lazy(() =>
  import('./BlogFlowRoutes').catch((cause: unknown) => {
    throw new BlogFlowChunkLoadError(cause);
  }),
);

const FAILURE_TITLE = 'Страница временно недоступна';

function reloadPage() {
  window.location.reload();
}

function BlogFlowLoading() {
  return (
    <ProductionShell>
      <RouteStatus kind="loading" message="Загружаем страницу…" />
    </ProductionShell>
  );
}

function BlogFlowFailure() {
  useDocumentTitle(FAILURE_TITLE);

  return (
    <ProductionShell>
      <RouteStatus
        actions={
          <>
            <Button onClick={reloadPage}>Обновить страницу</Button>
            <Link className="ui-button ui-button--secondary" to={HOME_PATH}>
              На главную
            </Link>
          </>
        }
        kind="failure"
        message="Не удалось загрузить страницу. Проверьте соединение и обновите страницу."
        title={FAILURE_TITLE}
      />
    </ProductionShell>
  );
}

interface BlogFlowChunkBoundaryProps {
  readonly children: ReactNode;
}

interface BlogFlowChunkBoundaryState {
  readonly error: Error | null;
}

class BlogFlowChunkBoundary extends Component<
  BlogFlowChunkBoundaryProps,
  BlogFlowChunkBoundaryState
> {
  state: BlogFlowChunkBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): BlogFlowChunkBoundaryState {
    return { error };
  }

  render() {
    const { error } = this.state;

    if (error === null) {
      return this.props.children;
    }

    if (error instanceof BlogFlowChunkLoadError) {
      return <BlogFlowFailure />;
    }

    throw error;
  }
}

interface LazyBlogFlowRouteProps {
  readonly name: BlogFlowRouteName;
  readonly notFound: ReactNode;
}

export function LazyBlogFlowRoute({ name, notFound }: LazyBlogFlowRouteProps) {
  return (
    <BlogFlowChunkBoundary>
      <Suspense fallback={<BlogFlowLoading />}>
        <BlogFlowRoute name={name} notFound={notFound} />
      </Suspense>
    </BlogFlowChunkBoundary>
  );
}
