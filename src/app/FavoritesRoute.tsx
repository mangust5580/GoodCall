import {
  addCartLine,
  cartLineId,
  removeCartLine,
  setCartLineQuantity,
} from '../pages/cart/cartStore';
import { useCartLineList } from '../pages/cart/useCartLines';
import { FavoritesPage } from '../pages/favorites';
import type { FavoritesCartSeam } from '../pages/favorites';
import { removeFavorite } from '../pages/favorites/favoritesStore';
import { useFavoriteItems } from '../pages/favorites/useFavorites';
import { ProductionShell } from './ProductionShell';
import { CATALOG_SMARTPHONES_PATH, HOME_PATH, hashHref, productDetailsHref } from './routes';

export function FavoritesRoute() {
  const items = useFavoriteItems();
  const cartLines = useCartLineList();

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
