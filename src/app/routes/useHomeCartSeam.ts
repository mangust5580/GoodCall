import {
  addCartLine,
  cartLineId,
  removeCartLine,
  setCartLineQuantity,
  useCartLineList,
} from '../../commerce/cart';
import type { HomeCartSeam, HomeProduct } from '../../pages/home';

export function useHomeCartSeam(liveProducts: boolean): HomeCartSeam | undefined {
  const cartLines = useCartLineList();

  if (!liveProducts) {
    return undefined;
  }

  return {
    quantityOf: (product: HomeProduct) =>
      cartLines.find((line) => line.id === cartLineId(product.id))?.quantity,
    add: (product) =>
      addCartLine(
        {
          id: cartLineId(product.id),
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
        removeCartLine(cartLineId(product.id));
      } else {
        setCartLineQuantity(cartLineId(product.id), quantity);
      }
    },
  };
}
