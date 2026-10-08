import { Fragment, useState } from 'react';

import productPhone from '../../assets/products/product-phone.svg';
import { PromoBanner } from '../../components/content';
import type { CatalogProduct } from './catalogProduct';
import { CatalogProductCard } from './CatalogProductCard';
import type {
  CatalogCartSeam,
  CatalogCompareSeam,
  CatalogFavoritesSeam,
} from './CatalogProductCard';

interface CatalogProductGridProps {
  readonly products: readonly CatalogProduct[];
  readonly productHref?: (slug: string) => string | undefined;
  readonly cart?: CatalogCartSeam;
  readonly favorites?: CatalogFavoritesSeam;
  readonly compare?: CatalogCompareSeam;
  readonly promo?: boolean;
}

const PROMO_AFTER_INDEX = 8;
const PROMO_TITLE = 'Флагманы по выгоде';
const PROMO_DESCRIPTION = 'Техника премиум-класса со скидками до 50%';

export function CatalogProductGrid({
  cart,
  compare,
  favorites,
  productHref,
  products,
  promo = true,
}: CatalogProductGridProps) {
  const [announcement, setAnnouncement] = useState('');

  return (
    <>
      <div className="catalog-grid">
        {products.map((product, index) => (
          <Fragment key={product.id}>
            {promo && index === PROMO_AFTER_INDEX ? (
              <div className="catalog-grid__promo">
                <PromoBanner
                  description={PROMO_DESCRIPTION}
                  imageAlt=""
                  imageSrc={productPhone}
                  title={PROMO_TITLE}
                />
              </div>
            ) : null}
            <CatalogProductCard
              cart={cart}
              compare={compare}
              favorites={favorites}
              onAnnounce={setAnnouncement}
              product={product}
              productHref={productHref}
            />
          </Fragment>
        ))}
      </div>
      <p className="ui-visually-hidden" role="status">
        {announcement}
      </p>
    </>
  );
}
