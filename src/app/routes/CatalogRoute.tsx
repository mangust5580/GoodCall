import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

import { RouteStatus } from '../../components/feedback';
import {
  CatalogPage,
  buildCatalogLiveFacets,
  fetchCatalogProducts,
  parseCatalogUrlState,
  serializeCatalogUrlState,
} from '../../pages/catalog';
import type { CatalogAppliedState, CatalogHistoryMode, CatalogProduct } from '../../pages/catalog';
import { ProductionShell } from '../ProductionShell';
import { HOME_PATH, hashHref, productDetailsHref } from '../routePaths';
import { useDocumentTitle } from '../useDocumentTitle';
import { useCatalogCartSeam } from './useCatalogCartSeam';
import { useCatalogCompareSeam } from './useCatalogCompareSeam';
import { useCatalogFavoritesSeam } from './useCatalogFavoritesSeam';

type SmartphonesRead =
  | { readonly status: 'loading' }
  | { readonly status: 'ready'; readonly products: readonly CatalogProduct[] }
  | { readonly status: 'failure' };

function SmartphonesLoading() {
  return <RouteStatus kind="loading" message="Загружаем товары…" />;
}

function SmartphonesFailure({ onRetry }: { readonly onRetry: () => void }) {
  return (
    <RouteStatus
      actions={
        <>
          <button className="ui-button ui-button--primary" onClick={onRetry} type="button">
            Повторить
          </button>
          <Link className="ui-button ui-button--secondary" to={HOME_PATH}>
            На главную
          </Link>
        </>
      }
      kind="failure"
      message="Не удалось загрузить смартфоны. Попробуйте ещё раз."
      title="Товары временно недоступны"
    />
  );
}

export function CatalogRoute() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [read, setRead] = useState<SmartphonesRead>({ status: 'loading' });
  const [attempt, setAttempt] = useState(0);
  const products = read.status === 'ready' ? read.products : undefined;
  const facets = useMemo(
    () => (products === undefined ? undefined : buildCatalogLiveFacets(products)),
    [products],
  );
  const applied = facets === undefined ? undefined : parseCatalogUrlState(searchParams, facets);
  const cart = useCatalogCartSeam(products !== undefined);
  const favorites = useCatalogFavoritesSeam(products !== undefined);
  const compare = useCatalogCompareSeam(products !== undefined);
  useDocumentTitle(read.status === 'failure' ? 'Товары временно недоступны' : 'Смартфоны');

  useEffect(() => {
    let mounted = true;

    void fetchCatalogProducts('smartphones').then((result) => {
      if (!mounted) {
        return;
      }

      if (result.status === 'ready') {
        setRead({ status: 'ready', products: result.products });
        return;
      }

      if (import.meta.env.DEV) {
        console.warn('Smartphones catalog read failed', result.reason);
      }

      setRead({ status: 'failure' });
    });

    return () => {
      mounted = false;
    };
  }, [attempt]);

  const handleRetry = () => {
    setRead({ status: 'loading' });
    setAttempt((current) => current + 1);
  };

  const handleAppliedChange = (next: CatalogAppliedState, history: CatalogHistoryMode) => {
    const serialized = serializeCatalogUrlState(next, searchParams);

    if (serialized.toString() === searchParams.toString()) {
      return;
    }

    setSearchParams(serialized, { replace: history === 'replace' });
  };

  return (
    <ProductionShell>
      {read.status === 'loading' ? <SmartphonesLoading /> : null}
      {read.status === 'failure' ? <SmartphonesFailure onRetry={handleRetry} /> : null}
      {products !== undefined && applied !== undefined ? (
        <CatalogPage
          applied={applied}
          cart={cart}
          compare={compare}
          favorites={favorites}
          homeHref={hashHref(HOME_PATH)}
          mode="live"
          onAppliedChange={handleAppliedChange}
          productHref={productDetailsHref}
          products={products}
        />
      ) : null}
    </ProductionShell>
  );
}
