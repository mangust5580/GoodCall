import { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import { addCartLine, cartLineId } from '../../commerce/cart';
import type { CartLineImage } from '../../commerce/cart';
import { toggleFavorite, useFavoriteItems } from '../../commerce/favorites';
import { RouteStatus } from '../../components/feedback';
import { fetchCatalogProducts } from '../../pages/catalog';
import type { CatalogProduct } from '../../pages/catalog';
import {
  PRODUCT_DETAILS_STOREWIDE,
  ProductDetailsPage,
  buildProductDetailsView,
  fetchProductDetails,
  getProductDetailsContent,
} from '../../pages/product-details';
import type {
  ProductDetailsContent,
  ProductDetailsDataResult,
  ProductDetailsView,
} from '../../pages/product-details';
import { ProductionShell } from '../ProductionShell';
import {
  CATALOG_LAPTOPS_PATH,
  CATALOG_SMARTPHONES_PATH,
  HOME_PATH,
  hashHref,
  productDetailsHref,
} from '../routePaths';
import { useDocumentTitle } from '../useDocumentTitle';
import { useCatalogCartSeam } from './useCatalogCartSeam';
import { useCatalogCompareSeam } from './useCatalogCompareSeam';
import { useCatalogFavoritesSeam } from './useCatalogFavoritesSeam';

type ProductDetailsRouteView =
  | { readonly status: 'loading' }
  | {
      readonly status: 'ready';
      readonly product: ProductDetailsView;
      readonly cartImage: CartLineImage;
      readonly categoryHref?: string;
      readonly smartphone: boolean;
    }
  | { readonly status: 'not-found' }
  | { readonly status: 'error' };

interface SettledProductRead {
  readonly slug: string;
  readonly view: ProductDetailsRouteView;
}

const SMARTPHONES_CATEGORY_SLUG = 'smartphones';
const CATEGORY_HREFS: Readonly<Partial<Record<string, string>>> = {
  [SMARTPHONES_CATEGORY_SLUG]: hashHref(CATALOG_SMARTPHONES_PATH),
  laptops: hashHref(CATALOG_LAPTOPS_PATH),
};
const RELATED_PRODUCTS_LIMIT = 8;
const FALLBACK_CART_IMAGE: CartLineImage = { kind: 'catalog-fallback' };
const LOADING_VIEW: ProductDetailsRouteView = { status: 'loading' };
const NOT_FOUND_VIEW: ProductDetailsRouteView = { status: 'not-found' };
const ERROR_VIEW: ProductDetailsRouteView = { status: 'error' };
const STATE_TITLES = {
  loading: 'Загрузка товара',
  'not-found': 'Товар не найден',
  error: 'Не удалось загрузить товар',
} as const;

function viewFromResult(
  result: ProductDetailsDataResult,
  content: ProductDetailsContent,
): ProductDetailsRouteView {
  if (result.status === 'ready') {
    const live = result.product;

    if (live.categorySlug !== content.category) {
      if (import.meta.env.DEV) {
        console.warn('Product Details content category mismatch', live.slug, live.categorySlug);
      }

      return NOT_FOUND_VIEW;
    }

    const smartphone = live.categorySlug === SMARTPHONES_CATEGORY_SLUG;

    return {
      status: 'ready',
      product: buildProductDetailsView(live, content, PRODUCT_DETAILS_STOREWIDE),
      cartImage: content.media?.cartImage ?? FALLBACK_CART_IMAGE,
      categoryHref: CATEGORY_HREFS[live.categorySlug],
      smartphone,
    };
  }

  return result.status === 'not-found' ? NOT_FOUND_VIEW : ERROR_VIEW;
}

function ProductRouteLoading() {
  return <RouteStatus kind="loading" message="Загружаем товар…" />;
}

function ProductRouteNotFound() {
  return (
    <RouteStatus
      actions={
        <>
          <Link className="ui-button ui-button--primary" to={CATALOG_SMARTPHONES_PATH}>
            К смартфонам
          </Link>
          <Link className="ui-button ui-button--secondary" to={HOME_PATH}>
            На главную
          </Link>
        </>
      }
      kind="failure"
      message="Такого товара нет или его страница пока недоступна."
      title="Товар не найден"
    />
  );
}

function ProductRouteError() {
  return (
    <RouteStatus
      actions={
        <Link className="ui-button ui-button--primary" to={CATALOG_SMARTPHONES_PATH}>
          К смартфонам
        </Link>
      }
      kind="failure"
      message="Сервис временно недоступен. Попробуйте обновить страницу позже."
      title="Не удалось загрузить товар"
    />
  );
}

export function ProductDetailsRoute() {
  const { slug } = useParams();
  const content = slug === undefined ? undefined : getProductDetailsContent(slug);
  const [settled, setSettled] = useState<SettledProductRead>();
  const favoriteItems = useFavoriteItems();
  const [smartphoneCatalog, setSmartphoneCatalog] = useState<readonly CatalogProduct[] | null>();
  const smartphoneCatalogRequested = useRef(false);
  const relatedCart = useCatalogCartSeam(true);
  const relatedFavorites = useCatalogFavoritesSeam(true);
  const relatedCompare = useCatalogCompareSeam(true);

  useEffect(() => {
    if (slug === undefined || content === undefined) {
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

      setSettled({ slug, view: viewFromResult(result, content) });
    });

    return () => {
      mounted = false;
    };
  }, [slug, content]);

  const view =
    content === undefined
      ? NOT_FOUND_VIEW
      : settled !== undefined && settled.slug === slug
        ? settled.view
        : LOADING_VIEW;
  const needsSmartphoneCatalog = view.status === 'ready' && view.smartphone;
  useDocumentTitle(view.status === 'ready' ? view.product.title : STATE_TITLES[view.status]);

  useEffect(() => {
    if (!needsSmartphoneCatalog || smartphoneCatalogRequested.current) {
      return;
    }

    smartphoneCatalogRequested.current = true;

    void fetchCatalogProducts('smartphones').then((result) => {
      if (result.status === 'ready') {
        setSmartphoneCatalog(result.products);
        return;
      }

      if (import.meta.env.DEV) {
        console.warn('Product Details related read failed', result.reason);
      }

      setSmartphoneCatalog(null);
    });
  }, [needsSmartphoneCatalog]);

  const relatedProducts =
    needsSmartphoneCatalog && smartphoneCatalog !== undefined && smartphoneCatalog !== null
      ? smartphoneCatalog.filter((product) => product.id !== slug).slice(0, RELATED_PRODUCTS_LIMIT)
      : [];

  return (
    <ProductionShell>
      {view.status === 'loading' ? <ProductRouteLoading /> : null}
      {view.status === 'not-found' ? <ProductRouteNotFound /> : null}
      {view.status === 'error' ? <ProductRouteError /> : null}
      {view.status === 'ready' && slug !== undefined ? (
        <ProductDetailsPage
          categoryHref={view.categoryHref}
          homeHref={hashHref(HOME_PATH)}
          favorite={{
            pressed: favoriteItems.some((item) => item.slug === slug),
            onToggle: (pressed) => {
              toggleFavorite(
                {
                  slug,
                  title: view.product.title,
                  image: { kind: 'catalog-fallback' },
                  price: view.product.priceValue,
                  oldPrice: view.product.oldPriceValue,
                },
                pressed,
              );
            },
          }}
          key={slug}
          onAddToCart={(quantity) =>
            addCartLine(
              {
                id: cartLineId(slug),
                productSlug: slug,
                title: view.product.title,
                image: view.cartImage,
                price: view.product.priceValue,
                oldPrice: view.product.oldPriceValue,
              },
              quantity,
            )
          }
          product={view.product}
          related={
            relatedProducts.length === 0
              ? undefined
              : {
                  products: relatedProducts,
                  allHref: hashHref(CATALOG_SMARTPHONES_PATH),
                  productHref: productDetailsHref,
                  cart: relatedCart,
                  favorites: relatedFavorites,
                  compare: relatedCompare,
                }
          }
        />
      ) : null}
    </ProductionShell>
  );
}
