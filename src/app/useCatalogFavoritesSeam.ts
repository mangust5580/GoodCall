import type { CatalogFavoritesSeam } from '../pages/catalog/CatalogProductGrid';
import type { CatalogProduct } from '../pages/catalog/catalogProductFixtures';
import { toggleFavorite } from '../pages/favorites/favoritesStore';
import type { FavoriteItem } from '../pages/favorites/favoritesStore';
import { useFavoriteItems } from '../pages/favorites/useFavorites';

function catalogFavoriteItem(product: CatalogProduct): FavoriteItem {
  return {
    slug: product.id,
    title: product.title,
    image:
      product.imageSrc === undefined
        ? { kind: 'catalog-fallback' }
        : { kind: 'url', src: product.imageSrc },
    price: product.priceValue,
    oldPrice: product.oldPriceValue,
  };
}

export function useCatalogFavoritesSeam(liveProducts: boolean): CatalogFavoritesSeam | undefined {
  const favoriteItems = useFavoriteItems();

  if (!liveProducts) {
    return undefined;
  }

  return {
    isFavorite: (product) => favoriteItems.some((item) => item.slug === product.id),
    toggle: (product, pressed) => {
      toggleFavorite(catalogFavoriteItem(product), pressed);
    },
  };
}
