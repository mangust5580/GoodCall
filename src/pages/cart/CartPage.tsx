import { useEffect, useRef } from 'react';

import { HOME_DEVICE_MEDIA } from '../../assets/media/home/homeMarketingMedia';

import { cartTotals, formatUnitCount } from '../../commerce/cart';
import type { CartLinesState } from '../../commerce/cart';
import { BenefitsStrip } from '../../components/content';
import { Breadcrumbs, Container } from '../../components/layout';
import type { PictureSource } from '../../components/media';
import { ProductCard } from '../../components/product';
import { Button, Checkbox, Chip } from '../../components/ui';
import { CartEmptyState } from './CartEmptyState';
import { CartLineItem } from './CartLineItem';
import { CartOrderSummary } from './CartOrderSummary';
import type { HomeProduct } from '../home';
import { CART_BENEFITS } from './cartFixtures';

export interface CartPageProps {
  readonly homeHref: string;
  readonly catalogHref: string;
  readonly checkoutHref: string;
  readonly cart: CartLinesState;
  readonly recommendations: readonly HomeProduct[];
  readonly productHref?: (slug: string) => string | undefined;
}

const RECOMMENDATION_ARTWORK: Readonly<Record<HomeProduct['image'], PictureSource>> = {
  smartphone: HOME_DEVICE_MEDIA.smartphone,
  earbuds: HOME_DEVICE_MEDIA.earbuds,
  watch: HOME_DEVICE_MEDIA.watch,
  headphones: HOME_DEVICE_MEDIA.headphones,
  laptop: HOME_DEVICE_MEDIA.laptop,
  tablet: HOME_DEVICE_MEDIA.tablet,
};

const RECOMMENDATION_MEDIA_SIZES = '(max-width: 520px) 240px, 220px';
const POPULATED_TITLE_ID = 'cart-title';
const EMPTY_TITLE_ID = 'cart-empty-title';

export function CartPage({
  homeHref,
  catalogHref,
  checkoutHref,
  cart,
  recommendations,
  productHref,
}: CartPageProps) {
  const { lines } = cart;
  const totals = cartTotals(lines);
  const selectedLineCount = lines.filter((line) => line.selected).length;
  const allSelected = selectedLineCount === lines.length;
  const lineCount = lines.length;
  const previousLineCount = useRef(lineCount);

  useEffect(() => {
    if (lineCount < previousLineCount.current && document.activeElement === document.body) {
      document.getElementById(lineCount === 0 ? EMPTY_TITLE_ID : POPULATED_TITLE_ID)?.focus();
    }

    previousLineCount.current = lineCount;
  }, [lineCount]);

  return (
    <main className="cart-page">
      <Container>
        <Breadcrumbs
          className="cart-page__breadcrumbs"
          items={[{ label: 'Главная', href: homeHref }, { label: 'Корзина' }]}
        />

        {lineCount === 0 ? (
          <CartEmptyState catalogHref={catalogHref} homeHref={homeHref} />
        ) : (
          <div className="cart-layout">
            <section aria-labelledby={POPULATED_TITLE_ID} className="cart-items">
              <div className="cart-items__header">
                <h1 className="cart-items__title" id={POPULATED_TITLE_ID} tabIndex={-1}>
                  Корзина
                </h1>
                <Chip>{formatUnitCount(totals.unitCount)}</Chip>
              </div>

              <div className="cart-items__toolbar">
                <Checkbox checked={allSelected} label="Выбрать все" onChange={cart.toggleAll} />
                <Button
                  className="cart-items__remove-selected"
                  disabled={selectedLineCount === 0}
                  onClick={cart.removeSelected}
                  variant="text"
                >
                  Удалить выбранные
                </Button>
              </div>

              <ul aria-label="Товары в корзине" className="cart-items__list">
                {lines.map((line) => (
                  <CartLineItem
                    key={line.id}
                    line={line}
                    onQuantityChange={(quantity) => {
                      cart.setQuantity(line.id, quantity);
                    }}
                    onRemove={() => {
                      cart.removeLine(line.id);
                    }}
                    onToggle={(selected) => {
                      cart.toggleLine(line.id, selected);
                    }}
                  />
                ))}
              </ul>
            </section>

            <CartOrderSummary checkoutHref={checkoutHref} totals={totals} />
          </div>
        )}

        <div className="cart-page__benefits">
          <BenefitsStrip items={CART_BENEFITS} label="Преимущества GoodCall" />
        </div>

        <section aria-labelledby="cart-recommendations-title" className="cart-recommendations">
          <h2 className="cart-recommendations__title" id="cart-recommendations-title">
            Вам может понравиться
          </h2>
          <div className="cart-recommendations__grid">
            {recommendations.map((product) => (
              <ProductCard
                badge={
                  product.badge === undefined ? undefined : (
                    <Chip variant={product.badgeTone === 'sale' ? 'danger' : 'brand'}>
                      {product.badge}
                    </Chip>
                  )
                }
                href={productHref?.(product.id)}
                image={
                  product.imageSrc === undefined
                    ? (product.thumbnail ?? RECOMMENDATION_ARTWORK[product.image])
                    : undefined
                }
                imageAlt={product.imageAlt}
                imageSizes={RECOMMENDATION_MEDIA_SIZES}
                imageSrc={product.imageSrc}
                key={product.id}
                oldPrice={product.oldPrice}
                price={product.price}
                title={product.title}
              />
            ))}
          </div>
        </section>
      </Container>
    </main>
  );
}
