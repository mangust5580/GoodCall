import { useEffect, useRef, useState } from 'react';

import { productThumbnail } from '../../assets/media/product-details/productThumbnailMedia';
import productPhone from '../../assets/products/product-phone.svg';
import { formatUnitCount } from '../../commerce/cart';
import type { FavoriteItem } from '../../commerce/favorites';
import { formatPrice } from '../../commerce/format';
import { EmptyState } from '../../components/feedback';
import { Breadcrumbs, Container } from '../../components/layout';
import { ProductCard } from '../../components/product';
import { Chip } from '../../components/ui';

export interface FavoritesCartSeam {
  readonly quantityOf: (item: FavoriteItem) => number | undefined;
  readonly add: (item: FavoriteItem) => number;
  readonly setQuantity: (item: FavoriteItem, quantity: number) => void;
}

export interface FavoritesPageProps {
  readonly items: readonly FavoriteItem[];
  readonly cart: FavoritesCartSeam;
  readonly onRemove: (item: FavoriteItem) => void;
  readonly productHref: (slug: string) => string | undefined;
  readonly homeHref: string;
  readonly catalogHref: string;
}

const TITLE_ID = 'favorites-title';
const PRODUCT_MEDIA_SIZES = '240px';

export function FavoritesPage({
  items,
  cart,
  onRemove,
  productHref,
  homeHref,
  catalogHref,
}: FavoritesPageProps) {
  const [announcement, setAnnouncement] = useState('');
  const itemCount = items.length;
  const previousItemCount = useRef(itemCount);

  useEffect(() => {
    if (itemCount < previousItemCount.current && document.activeElement === document.body) {
      document.getElementById(TITLE_ID)?.focus();
    }

    previousItemCount.current = itemCount;
  }, [itemCount]);

  return (
    <main className="favorites-page">
      <Container>
        <Breadcrumbs
          className="favorites-page__breadcrumbs"
          items={[{ label: 'Главная', href: homeHref }, { label: 'Избранное' }]}
        />

        <header className="favorites-page__heading">
          <div className="favorites-page__title-row">
            <h1 className="favorites-page__title" id={TITLE_ID} tabIndex={-1}>
              Избранное
            </h1>
            {itemCount === 0 ? null : <Chip>{formatUnitCount(itemCount)}</Chip>}
          </div>
          {itemCount === 0 ? null : (
            <p className="favorites-page__lead">Товары, которые вы добавили в избранное.</p>
          )}
        </header>

        {itemCount === 0 ? (
          <EmptyState
            action={{ label: 'Перейти к смартфонам', href: catalogHref }}
            className="favorites-empty"
            headingLevel="h2"
            icon="heart"
            message="Нажимайте ♥ на карточках товаров, чтобы сохранить их здесь."
            secondaryAction={{ label: 'На главную', href: homeHref }}
            title="В избранном пока пусто"
            variant="page"
          />
        ) : (
          <>
            <h2 className="ui-visually-hidden">Товары в избранном</h2>
            <ul aria-label="Товары в избранном" className="favorites-grid">
              {items.map((item) => {
                const quantity = cart.quantityOf(item);

                return (
                  <li key={item.slug}>
                    <ProductCard
                      favoritePressed
                      href={productHref(item.slug)}
                      image={
                        item.image.kind === 'catalog-fallback'
                          ? productThumbnail(item.slug)
                          : undefined
                      }
                      imageAlt=""
                      imageSizes={PRODUCT_MEDIA_SIZES}
                      imageSrc={item.image.kind === 'url' ? item.image.src : productPhone}
                      oldPrice={
                        item.oldPrice === undefined ? undefined : formatPrice(item.oldPrice)
                      }
                      onAddToCart={() => {
                        const lineQuantity = cart.add(item);
                        setAnnouncement(
                          `Товар добавлен в корзину: ${item.title}. В корзине: ${String(lineQuantity)} шт.`,
                        );
                      }}
                      onFavoriteToggle={(pressed) => {
                        if (!pressed) {
                          onRemove(item);
                          setAnnouncement(`Товар удалён из избранного: ${item.title}`);
                        }
                      }}
                      allowZeroQuantity
                      onQuantityChange={
                        quantity === undefined
                          ? undefined
                          : (value) => {
                              cart.setQuantity(item, value);

                              if (value === 0) {
                                setAnnouncement(`Товар удалён из корзины: ${item.title}`);
                              }
                            }
                      }
                      price={formatPrice(item.price)}
                      quantity={quantity}
                      title={item.title}
                    />
                  </li>
                );
              })}
            </ul>
          </>
        )}
      </Container>
      <p className="ui-visually-hidden" role="status">
        {announcement}
      </p>
    </main>
  );
}
