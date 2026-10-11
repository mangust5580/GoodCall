import { Component, Suspense, lazy } from 'react';
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

import { RouteStatus } from '../../components/feedback';
import { Button } from '../../components/ui';
import { ProductionShell } from '../ProductionShell';
import { HOME_PATH } from '../routePaths';
import { useDocumentTitle } from '../useDocumentTitle';
import type { InfoRouteName } from './InfoRoutes';

class InfoChunkLoadError extends Error {
  constructor(cause: unknown) {
    super('Info route chunk failed to load', { cause });
    this.name = 'InfoChunkLoadError';
  }
}

const InfoRoute = lazy(() =>
  import('./InfoRoutes').catch((cause: unknown) => {
    throw new InfoChunkLoadError(cause);
  }),
);

const FAILURE_TITLE = 'Страница временно недоступна';

function reloadPage() {
  window.location.reload();
}

function InfoRouteLoading() {
  return (
    <ProductionShell>
      <RouteStatus kind="loading" message="Загружаем страницу…" />
    </ProductionShell>
  );
}

function InfoRouteFailure() {
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

interface InfoChunkBoundaryProps {
  readonly children: ReactNode;
}

interface InfoChunkBoundaryState {
  readonly error: Error | null;
}

class InfoChunkBoundary extends Component<InfoChunkBoundaryProps, InfoChunkBoundaryState> {
  state: InfoChunkBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): InfoChunkBoundaryState {
    return { error };
  }

  render() {
    const { error } = this.state;

    if (error === null) {
      return this.props.children;
    }

    if (error instanceof InfoChunkLoadError) {
      return <InfoRouteFailure />;
    }

    throw error;
  }
}

interface LazyInfoRouteProps {
  readonly name: InfoRouteName;
}

export function LazyInfoRoute({ name }: LazyInfoRouteProps) {
  return (
    <InfoChunkBoundary>
      <Suspense fallback={<InfoRouteLoading />}>
        <InfoRoute name={name} />
      </Suspense>
    </InfoChunkBoundary>
  );
}
