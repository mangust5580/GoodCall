import { useEffect, useState } from 'react';

import { addCartLine, cartLineId, setCartLineQuantity } from '../pages/cart/cartStore';
import { useCartLineList } from '../pages/cart/useCartLines';
import { CatalogPage } from '../pages/catalog';
import type { CatalogCartSeam } from '../pages/catalog/CatalogProductGrid';
import type { CatalogProduct } from '../pages/catalog/catalogProductFixtures';
import { fetchCatalogProducts } from '../pages/catalog/catalogProductData';
import { ProductionShell } from './ProductionShell';
import { HOME_PATH, hashHref, productDetailsHref } from './routes';

function catalogCartLineId(product: CatalogProduct): string {
  return cartLineId(product.id);
}

export function CatalogRoute() {
  const [products, setProducts] = useState<readonly CatalogProduct[]>();
  const cartLines = useCartLineList();

  useEffect(() => {
    let mounted = true;

    void fetchCatalogProducts().then((result) => {
      if (!mounted) {
        return;
      }

      if (result.status === 'ready') {
        setProducts(result.products);
      } else if (result.status === 'failure' && import.meta.env.DEV) {
        console.warn('Catalog Supabase fallback', result.reason);
      }
    });

    return () => {
      mounted = false;
    };
  }, []);

  const cart: CatalogCartSeam | undefined =
    products === undefined
      ? undefined
      : {
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

  return (
    <ProductionShell>
      <CatalogPage
        cart={cart}
        homeHref={hashHref(HOME_PATH)}
        productHref={products === undefined ? undefined : productDetailsHref}
        products={products}
      />
    </ProductionShell>
  );
}
