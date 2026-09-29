import { addCartLine, cartLineId, setCartLineQuantity } from '../pages/cart/cartStore';
import { useCartLineList } from '../pages/cart/useCartLines';
import type { CatalogCartSeam } from '../pages/catalog/CatalogProductGrid';
import type { CatalogProduct } from '../pages/catalog/catalogProductFixtures';

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
      setCartLineQuantity(catalogCartLineId(product), quantity);
    },
  };
}
