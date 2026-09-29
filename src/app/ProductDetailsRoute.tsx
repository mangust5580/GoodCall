import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import { Container } from '../components/layout';
import { addCartLine, cartLineId } from '../pages/cart/cartStore';
import { ProductDetailsPage } from '../pages/product-details';
import type { ProductDetailsCartSelection } from '../pages/product-details/ProductPurchasePanel';
import { fetchProductDetails } from '../pages/product-details/productDetailsData';
import type { ProductDetailsDataResult } from '../pages/product-details/productDetailsData';
import {
  isProductDetailsSpecimenSlug,
  productDetailsSpecimenFromLive,
  productDetailsTitle,
} from '../pages/product-details/productDetailsFixtures';
import type { ProductDetailsFixture } from '../pages/product-details/productDetailsFixtures';
import { ProductionShell } from './ProductionShell';
import { CATALOG_SMARTPHONES_PATH, HOME_PATH, hashHref } from './routes';

import './ProductDetailsRoute.scss';

type ProductDetailsRouteView =
  | { readonly status: 'loading' }
  | { readonly status: 'ready'; readonly product: ProductDetailsFixture }
  | { readonly status: 'not-found' }
  | { readonly status: 'error' };

interface SettledProductRead {
  readonly slug: string;
  readonly view: ProductDetailsRouteView;
}

const LOADING_VIEW: ProductDetailsRouteView = { status: 'loading' };
const NOT_FOUND_VIEW: ProductDetailsRouteView = { status: 'not-found' };
const ERROR_VIEW: ProductDetailsRouteView = { status: 'error' };

function viewFromResult(result: ProductDetailsDataResult): ProductDetailsRouteView {
  if (result.status === 'ready') {
    const product = productDetailsSpecimenFromLive(result.product);

    return product === undefined ? NOT_FOUND_VIEW : { status: 'ready', product };
  }

  return result.status === 'not-found' ? NOT_FOUND_VIEW : ERROR_VIEW;
}

function addProductDetailsLine(
  slug: string,
  product: ProductDetailsFixture,
  { colourId, memoryId, quantity }: ProductDetailsCartSelection,
): number {
  const colour = product.colours.find((entry) => entry.id === colourId);
  const memory = product.memories.find((entry) => entry.id === memoryId);
  const variant = [colour?.label, memory?.label]
    .filter((part): part is string => part !== undefined)
    .join(' · ');

  return addCartLine(
    {
      id: cartLineId(slug, [colourId, memoryId]),
      productSlug: slug,
      title: productDetailsTitle(product, colourId),
      variant: variant === '' ? undefined : variant,
      image: { kind: 'product-details', colourId },
      price: product.priceValue,
      oldPrice: product.oldPriceValue,
    },
    quantity,
  );
}

function ProductRouteLoading() {
  return (
    <main aria-busy="true" className="product-route-state">
      <Container className="product-route-state__inner">
        <p className="product-route-state__message" role="status">
          Загружаем товар…
        </p>
      </Container>
    </main>
  );
}

function ProductRouteNotFound() {
  return (
    <main className="product-route-state">
      <Container className="product-route-state__inner">
        <h1 className="product-route-state__title">Товар не найден</h1>
        <p className="product-route-state__message">
          Такого товара нет или его страница пока недоступна.
        </p>
        <div className="product-route-state__actions">
          <Link className="ui-button ui-button--primary" to={CATALOG_SMARTPHONES_PATH}>
            В каталог
          </Link>
          <Link className="ui-button ui-button--secondary" to={HOME_PATH}>
            На главную
          </Link>
        </div>
      </Container>
    </main>
  );
}

function ProductRouteError() {
  return (
    <main className="product-route-state">
      <Container className="product-route-state__inner">
        <h1 className="product-route-state__title">Не удалось загрузить товар</h1>
        <p className="product-route-state__message">
          Сервис временно недоступен. Попробуйте обновить страницу позже.
        </p>
        <div className="product-route-state__actions">
          <Link className="ui-button ui-button--primary" to={CATALOG_SMARTPHONES_PATH}>
            В каталог
          </Link>
        </div>
      </Container>
    </main>
  );
}

export function ProductDetailsRoute() {
  const { slug } = useParams();
  const supported = slug !== undefined && isProductDetailsSpecimenSlug(slug);
  const [settled, setSettled] = useState<SettledProductRead>();

  useEffect(() => {
    if (slug === undefined || !isProductDetailsSpecimenSlug(slug)) {
      return;
    }

    let mounted = true;

    void fetchProductDetails(slug).then((result) => {
      if (!mounted) {
        return;
      }

      if ((result.status === 'failure' || result.status === 'unavailable') && import.meta.env.DEV) {
        console.warn('Product Details Supabase read failed', result.reason);
      }

      setSettled({ slug, view: viewFromResult(result) });
    });

    return () => {
      mounted = false;
    };
  }, [slug]);

  const view = !supported ? NOT_FOUND_VIEW : settled?.slug === slug ? settled.view : LOADING_VIEW;

  return (
    <ProductionShell>
      {view.status === 'loading' ? <ProductRouteLoading /> : null}
      {view.status === 'not-found' ? <ProductRouteNotFound /> : null}
      {view.status === 'error' ? <ProductRouteError /> : null}
      {view.status === 'ready' && slug !== undefined ? (
        <ProductDetailsPage
          categoryHref={hashHref(CATALOG_SMARTPHONES_PATH)}
          homeHref={hashHref(HOME_PATH)}
          onAddToCart={(selection) => addProductDetailsLine(slug, view.product, selection)}
          product={view.product}
        />
      ) : null}
    </ProductionShell>
  );
}
