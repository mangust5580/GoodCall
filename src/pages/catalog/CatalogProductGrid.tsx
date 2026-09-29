import { Fragment, useState } from 'react';

import productPhone from '../../assets/products/product-phone.svg';
import { PromoBanner } from '../../components/content';
import { ProductCard } from '../../components/product';
import type { CatalogProduct } from './catalogProductFixtures';

export interface CatalogCartSeam {
  readonly quantityOf: (product: CatalogProduct) => number | undefined;
  readonly add: (product: CatalogProduct) => number;
  readonly setQuantity: (product: CatalogProduct, quantity: number) => void;
}

interface CatalogProductGridProps {
  readonly products: readonly CatalogProduct[];
  readonly productHref?: (slug: string) => string | undefined;
  readonly cart?: CatalogCartSeam;
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

export function CatalogProductGrid({ cart, productHref, products }: CatalogProductGridProps) {
  const [favorites, setFavorites] = useState<readonly string[]>([]);
  const [announcement, setAnnouncement] = useState('');

  const toggleFavorite = (id: string, pressed: boolean): void => {
    setFavorites((current) =>
      pressed ? [...current, id] : current.filter((entry) => entry !== id),
    );
  };

  return (
    <>
      <div className="catalog-grid">
        {products.map((product, index) => {
          const quantity = cart?.quantityOf(product);

          return (
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
                disabled={cart === undefined}
                favoritePressed={favorites.includes(product.id)}
                href={productHref?.(product.id)}
                imageAlt={product.imageAlt}
                imageSrc={product.imageSrc ?? productPhone}
                oldPrice={
                  product.oldPriceValue === undefined
                    ? undefined
                    : formatPrice(product.oldPriceValue)
                }
                onAddToCart={() => {
                  if (cart === undefined) {
                    return;
                  }

                  const lineQuantity = cart.add(product);
                  setAnnouncement(
                    `Товар добавлен в корзину: ${product.title}. В корзине: ${String(lineQuantity)} шт.`,
                  );
                }}
                onFavoriteToggle={(pressed) => {
                  toggleFavorite(product.id, pressed);
                }}
                onQuantityChange={
                  cart === undefined || quantity === undefined
                    ? undefined
                    : (value) => {
                        cart.setQuantity(product, value);
                      }
                }
                price={formatPrice(product.priceValue)}
                quantity={quantity}
                rating={product.rating}
                reviewCount={product.reviewCount}
                title={product.title}
              />
            </Fragment>
          );
        })}
      </div>
      <p className="ui-visually-hidden" role="status">
        {announcement}
      </p>
    </>
  );
}
