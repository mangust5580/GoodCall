import type { CatalogCompareSeam } from '../pages/catalog/CatalogProductGrid';
import type { CatalogProduct } from '../pages/catalog/catalogProductFixtures';
import { COMPARE_LIMIT, toggleCompareItem } from '../pages/compare/compareStore';
import type { CompareItem } from '../pages/compare/compareStore';
import { useCompareItems } from '../pages/compare/useCompare';
import { productBrand, productColour, productStorage } from '../pages/search/searchFacets';

function catalogCompareItem(product: CatalogProduct): CompareItem {
  const brand = productBrand(product);
  const storage = productStorage(product);
  const colour = productColour(product);

  return {
    slug: product.id,
    title: product.title,
    image:
      product.imageSrc === undefined
        ? { kind: 'catalog-fallback' }
        : { kind: 'url', src: product.imageSrc },
    price: product.priceValue,
    ...(product.oldPriceValue === undefined ? {} : { oldPrice: product.oldPriceValue }),
    ...(product.rating === undefined ? {} : { rating: product.rating }),
    reviewCount: product.reviewCount,
    ...(brand === undefined ? {} : { brand }),
    ...(storage === undefined ? {} : { storage }),
    ...(colour === undefined ? {} : { colour }),
  };
}

export function useCatalogCompareSeam(liveProducts: boolean): CatalogCompareSeam | undefined {
  const compareItems = useCompareItems();

  if (!liveProducts) {
    return undefined;
  }

  return {
    isCompared: (product) => compareItems.some((item) => item.slug === product.id),
    full: compareItems.length >= COMPARE_LIMIT,
    fullLabel: (product) =>
      `Сравнение заполнено (${String(COMPARE_LIMIT)} из ${String(COMPARE_LIMIT)}): ${product.title}`,
    toggle: (product, pressed) => {
      toggleCompareItem(catalogCompareItem(product), pressed);
    },
  };
}
