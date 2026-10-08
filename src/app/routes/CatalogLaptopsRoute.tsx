import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

import { Container } from '../../components/layout';
import {
  LaptopCatalogPage,
  buildLaptopFacets,
  fetchCatalogProducts,
  parseLaptopUrlState,
  serializeLaptopUrlState,
} from '../../pages/catalog';
import type { CatalogHistoryMode, CatalogProduct, LaptopAppliedState } from '../../pages/catalog';
import { ProductionShell } from '../ProductionShell';
import { HOME_PATH, hashHref, productDetailsHref } from '../routePaths';
import { useDocumentTitle } from '../useDocumentTitle';
import { useCatalogCartSeam } from './useCatalogCartSeam';
import { useCatalogCompareSeam } from './useCatalogCompareSeam';
import { useCatalogFavoritesSeam } from './useCatalogFavoritesSeam';
import './ProductDetailsRoute.scss';

type LaptopsRead =
  | { readonly status: 'loading' }
  | { readonly status: 'ready'; readonly products: readonly CatalogProduct[] }
  | { readonly status: 'failure' };

function LaptopsLoading() {
  return (
    <main aria-busy="true" className="product-route-state">
      <Container className="product-route-state__inner">
        <p className="product-route-state__message" role="status">
          Загружаем товары…
        </p>
      </Container>
    </main>
  );
}

function LaptopsFailure() {
  return (
    <main className="product-route-state">
      <Container className="product-route-state__inner">
        <h1 className="product-route-state__title">Товары временно недоступны</h1>
        <p className="product-route-state__message">
          Не удалось загрузить ноутбуки. Попробуйте обновить страницу позже.
        </p>
        <div className="product-route-state__actions">
          <Link className="ui-button ui-button--primary" to={HOME_PATH}>
            На главную
          </Link>
        </div>
      </Container>
    </main>
  );
}

export function CatalogLaptopsRoute() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [read, setRead] = useState<LaptopsRead>({ status: 'loading' });
  const products = read.status === 'ready' ? read.products : undefined;
  const facets = useMemo(
    () => (products === undefined ? undefined : buildLaptopFacets(products)),
    [products],
  );
  const cart = useCatalogCartSeam(products !== undefined);
  const favorites = useCatalogFavoritesSeam(products !== undefined);
  const compare = useCatalogCompareSeam(products !== undefined);
  useDocumentTitle(read.status === 'failure' ? 'Товары временно недоступны' : 'Ноутбуки');

  useEffect(() => {
    let mounted = true;

    void fetchCatalogProducts('laptops').then((result) => {
      if (!mounted) {
        return;
      }

      if (result.status === 'ready') {
        setRead({ status: 'ready', products: result.products });
        return;
      }

      if (import.meta.env.DEV) {
        console.warn('Laptops catalog read failed', result.reason);
      }

      setRead({ status: 'failure' });
    });

    return () => {
      mounted = false;
    };
  }, []);

  const handleAppliedChange = (next: LaptopAppliedState, history: CatalogHistoryMode) => {
    const serialized = serializeLaptopUrlState(next, searchParams);

    if (serialized.toString() === searchParams.toString()) {
      return;
    }

    setSearchParams(serialized, { replace: history === 'replace' });
  };

  return (
    <ProductionShell>
      {read.status === 'loading' ? <LaptopsLoading /> : null}
      {read.status === 'failure' ? <LaptopsFailure /> : null}
      {products !== undefined && facets !== undefined ? (
        <LaptopCatalogPage
          applied={parseLaptopUrlState(searchParams, facets)}
          cart={cart}
          compare={compare}
          facets={facets}
          favorites={favorites}
          homeHref={hashHref(HOME_PATH)}
          onAppliedChange={handleAppliedChange}
          productHref={productDetailsHref}
          products={products}
        />
      ) : null}
    </ProductionShell>
  );
}
