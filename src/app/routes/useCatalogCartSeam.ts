import {
  addCartLine,
  cartLineId,
  removeCartLine,
  setCartLineQuantity,
  useCartLineList,
} from '../../commerce/cart';
import type { CatalogCartSeam, CatalogProduct } from '../../pages/catalog';

function catalogCartLineId(product: CatalogProduct): string {
  return cartLineId(product.id);
}

export function useCatalogCartSeam(liveProducts: boolean): CatalogCartSeam | undefined {
  const cartLines = useCartLineList();

  if (!liveProducts) {
    return undefined;
  }

  return {
    quantityOf: (product) =>
      cartLines.find((line) => line.id === catalogCartLineId(product))?.quantity,
    add: (product) =>
      addCartLine(
        {
          id: catalogCartLineId(product),
          productSlug: product.id,
          title: product.title,
          image:
            product.imageSrc === undefined
              ? { kind: 'catalog-fallback' }
              : { kind: 'url', src: product.imageSrc },
          price: product.priceValue,
          oldPrice: product.oldPriceValue,
        },
        1,
      ),
    setQuantity: (product, quantity) => {
      if (quantity <= 0) {
        removeCartLine(catalogCartLineId(product));
      } else {
        setCartLineQuantity(catalogCartLineId(product), quantity);
      }
    },
  };
}
