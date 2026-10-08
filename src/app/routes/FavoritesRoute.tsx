import {
  addCartLine,
  cartLineId,
  removeCartLine,
  setCartLineQuantity,
  useCartLineList,
} from '../../commerce/cart';
import { removeFavorite, useFavoriteItems } from '../../commerce/favorites';
import { FavoritesPage } from '../../pages/favorites';
import type { FavoritesCartSeam } from '../../pages/favorites';
import { ProductionShell } from '../ProductionShell';
import { CATALOG_SMARTPHONES_PATH, HOME_PATH, hashHref, productDetailsHref } from '../routePaths';
import { useDocumentTitle } from '../useDocumentTitle';

export function FavoritesRoute() {
  const items = useFavoriteItems();
  const cartLines = useCartLineList();
  useDocumentTitle('Избранное');

  const cart: FavoritesCartSeam = {
    quantityOf: (item) => cartLines.find((line) => line.id === cartLineId(item.slug))?.quantity,
    add: (item) =>
      addCartLine(
        {
          id: cartLineId(item.slug),
          productSlug: item.slug,
          title: item.title,
          image: item.image,
          price: item.price,
          oldPrice: item.oldPrice,
        },
        1,
      ),
    setQuantity: (item, quantity) => {
      if (quantity <= 0) {
        removeCartLine(cartLineId(item.slug));
      } else {
        setCartLineQuantity(cartLineId(item.slug), quantity);
      }
    },
  };

  return (
    <ProductionShell>
      <FavoritesPage
        cart={cart}
        catalogHref={hashHref(CATALOG_SMARTPHONES_PATH)}
        homeHref={hashHref(HOME_PATH)}
        items={items}
        onRemove={(item) => {
          removeFavorite(item.slug);
        }}
        productHref={productDetailsHref}
      />
    </ProductionShell>
  );
}
