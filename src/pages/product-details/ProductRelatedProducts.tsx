import { useCallback, useEffect, useRef, useState } from 'react';

import { Icon } from '../../components/ui';
import { CatalogProductCard } from '../catalog';
import type {
  CatalogCartSeam,
  CatalogCompareSeam,
  CatalogFavoritesSeam,
  CatalogProduct,
} from '../catalog';

export interface ProductRelatedProductsBinding {
  readonly products: readonly CatalogProduct[];
  readonly allHref: string;
  readonly productHref?: (slug: string) => string | undefined;
  readonly cart?: CatalogCartSeam;
  readonly favorites?: CatalogFavoritesSeam;
  readonly compare?: CatalogCompareSeam;
}

interface RailScrollState {
  readonly canPrevious: boolean;
  readonly canNext: boolean;
}

const RAIL_EDGE_TOLERANCE = 2;
const INITIAL_RAIL_STATE: RailScrollState = { canPrevious: false, canNext: false };

function readRailState(rail: HTMLElement): RailScrollState {
  const maxScroll = rail.scrollWidth - rail.clientWidth;

  return {
    canPrevious: rail.scrollLeft > RAIL_EDGE_TOLERANCE,
    canNext: rail.scrollLeft < maxScroll - RAIL_EDGE_TOLERANCE,
  };
}

export function ProductRelatedProducts({
  products,
  allHref,
  productHref,
  cart,
  favorites,
  compare,
}: ProductRelatedProductsBinding) {
  const railRef = useRef<HTMLUListElement>(null);
  const [railState, setRailState] = useState<RailScrollState>(INITIAL_RAIL_STATE);
  const [announcement, setAnnouncement] = useState('');

  const syncRailState = useCallback(() => {
    const rail = railRef.current;

    if (rail === null) {
      return;
    }

    const next = readRailState(rail);

    setRailState((current) =>
      current.canPrevious === next.canPrevious && current.canNext === next.canNext ? current : next,
    );
  }, []);

  useEffect(() => {
    const rail = railRef.current;

    if (rail === null) {
      return;
    }

    const observer = new ResizeObserver(syncRailState);

    observer.observe(rail);
    rail.addEventListener('scroll', syncRailState, { passive: true });

    return () => {
      observer.disconnect();
      rail.removeEventListener('scroll', syncRailState);
    };
  }, [syncRailState]);

  const scrollRail = (direction: 1 | -1) => {
    const rail = railRef.current;

    rail?.scrollBy({ left: direction * rail.clientWidth });
  };

  const overflowing = railState.canPrevious || railState.canNext;

  return (
    <section aria-labelledby="product-related-title" className="product-related">
      <div className="product-related__head">
        <h2 className="product-related__title" id="product-related-title">
          Другие смартфоны
        </h2>
        <a className="product-related__all" href={allHref}>
          Смотреть все
          <Icon className="product-related__all-icon" name="chevron-right" />
        </a>
      </div>
      <div className="product-related__viewport">
        <ul aria-label="Другие смартфоны" className="product-related__rail" ref={railRef}>
          {products.map((product) => (
            <li className="product-related__item" key={product.id}>
              <CatalogProductCard
                cart={cart}
                compare={compare}
                favorites={favorites}
                onAnnounce={setAnnouncement}
                product={product}
                productHref={productHref}
              />
            </li>
          ))}
        </ul>
        {overflowing ? (
          <>
            <button
              aria-label="Предыдущие смартфоны"
              className="product-related__nav product-related__nav--previous"
              disabled={!railState.canPrevious}
              onClick={() => {
                scrollRail(-1);
              }}
              type="button"
            >
              <Icon name="chevron-left" />
            </button>
            <button
              aria-label="Следующие смартфоны"
              className="product-related__nav product-related__nav--next"
              disabled={!railState.canNext}
              onClick={() => {
                scrollRail(1);
              }}
              type="button"
            >
              <Icon name="chevron-right" />
            </button>
          </>
        ) : null}
      </div>
      <p className="ui-visually-hidden" role="status">
        {announcement}
      </p>
    </section>
  );
}
