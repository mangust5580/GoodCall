import { Component, Suspense, lazy } from 'react';
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

import { RouteStatus } from '../../components/feedback';
import { Button } from '../../components/ui';
import { ProductionShell } from '../ProductionShell';
import { HOME_PATH } from '../routePaths';
import { useDocumentTitle } from '../useDocumentTitle';
import type { AccountFlowRouteName } from './AccountFlowRoutes';

class AccountFlowChunkLoadError extends Error {
  constructor(cause: unknown) {
    super('Account flow chunk failed to load', { cause });
    this.name = 'AccountFlowChunkLoadError';
  }
}

const AccountFlowRoute = lazy(() =>
  import('./AccountFlowRoutes').catch((cause: unknown) => {
    throw new AccountFlowChunkLoadError(cause);
  }),
);

const FAILURE_TITLE = 'Страница временно недоступна';

function reloadPage() {
  window.location.reload();
}

function AccountFlowLoading() {
  return (
    <ProductionShell>
      <RouteStatus kind="loading" message="Загружаем страницу…" />
    </ProductionShell>
  );
}

function AccountFlowFailure() {
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

interface AccountFlowChunkBoundaryProps {
  readonly children: ReactNode;
}

interface AccountFlowChunkBoundaryState {
  readonly error: Error | null;
}

class AccountFlowChunkBoundary extends Component<
  AccountFlowChunkBoundaryProps,
  AccountFlowChunkBoundaryState
> {
  state: AccountFlowChunkBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): AccountFlowChunkBoundaryState {
    return { error };
  }

  render() {
    const { error } = this.state;

    if (error === null) {
      return this.props.children;
    }

    if (error instanceof AccountFlowChunkLoadError) {
      return <AccountFlowFailure />;
    }

    throw error;
  }
}

interface LazyAccountFlowRouteProps {
  readonly name: AccountFlowRouteName;
}

export function LazyAccountFlowRoute({ name }: LazyAccountFlowRouteProps) {
  return (
    <AccountFlowChunkBoundary>
      <Suspense fallback={<AccountFlowLoading />}>
        <AccountFlowRoute name={name} />
      </Suspense>
    </AccountFlowChunkBoundary>
  );
}
