import { Fragment, useState } from 'react';

import productPhone from '../../assets/products/product-phone.svg';
import { PromoBanner } from '../../components/content';
import { ProductCard } from '../../components/product';
import type { CatalogProduct } from './catalogProductFixtures';

interface CatalogProductGridProps {
  readonly products: readonly CatalogProduct[];
}

const PROMO_AFTER_INDEX = 8;
const PROMO_TITLE = 'Флагманы по выгоде';
const PROMO_DESCRIPTION = 'Техника премиум-класса со скидками до 50%';

const priceFormatter = new Intl.NumberFormat('ru-RU', {
  style: 'currency',
  currency: 'RUB',
  maximumFractionDigits: 0,
});

function formatPrice(value: number): string {
  return priceFormatter.format(value);
}

export function CatalogProductGrid({ products }: CatalogProductGridProps) {
  const [favorites, setFavorites] = useState<readonly string[]>([]);
  const [cart, setCart] = useState<Readonly<Record<string, number>>>({});

  const toggleFavorite = (id: string, pressed: boolean): void => {
    setFavorites((current) =>
      pressed ? [...current, id] : current.filter((entry) => entry !== id),
    );
  };

  const changeQuantity = (id: string, value: number): void => {
    setCart((current) => {
      const next = { ...current };

      if (value < 1) {
        delete next[id];
      } else {
        next[id] = value;
      }

      return next;
    });
  };

  return (
    <div className="catalog-grid">
      {products.map((product, index) => (
        <Fragment key={product.id}>
          {index === PROMO_AFTER_INDEX ? (
            <div className="catalog-grid__promo">
              <PromoBanner
                description={PROMO_DESCRIPTION}
                imageAlt=""
                imageSrc={productPhone}
                title={PROMO_TITLE}
              />
            </div>
          ) : null}
          <ProductCard
            badge={
              product.badge === undefined ? undefined : (
                <span
                  className={`catalog-badge catalog-badge--${product.discounted === true ? 'sale' : 'new'}`}
                >
                  {product.badge}
                </span>
              )
            }
            favoritePressed={favorites.includes(product.id)}
            imageAlt={product.imageAlt}
            imageSrc={productPhone}
            oldPrice={
              product.oldPriceValue === undefined ? undefined : formatPrice(product.oldPriceValue)
            }
            onAddToCart={() => {
              changeQuantity(product.id, (cart[product.id] ?? 0) + 1);
            }}
            onFavoriteToggle={(pressed) => {
              toggleFavorite(product.id, pressed);
            }}
            onQuantityChange={
              cart[product.id] === undefined
                ? undefined
                : (value) => {
                    changeQuantity(product.id, value);
                  }
            }
            price={formatPrice(product.priceValue)}
            quantity={cart[product.id]}
            rating={product.rating}
            reviewCount={product.reviewCount}
            title={product.title}
          />
        </Fragment>
      ))}
    </div>
  );
}
