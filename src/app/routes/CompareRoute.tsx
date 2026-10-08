import { addCartLine, cartLineId } from '../../commerce/cart';
import { clearCompareItems, removeCompareItem, useCompareItems } from '../../commerce/compare';
import { ComparePage } from '../../pages/compare';
import { ProductionShell } from '../ProductionShell';
import { CATALOG_SMARTPHONES_PATH, HOME_PATH, hashHref, productDetailsHref } from '../routePaths';
import { useDocumentTitle } from '../useDocumentTitle';

export function CompareRoute() {
  const items = useCompareItems();
  useDocumentTitle('Сравнение товаров');

  return (
    <ProductionShell>
      <ComparePage
        catalogHref={hashHref(CATALOG_SMARTPHONES_PATH)}
        homeHref={hashHref(HOME_PATH)}
        items={items}
        onAddToCart={(item) =>
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
          )
        }
        onClear={clearCompareItems}
        onRemove={(item) => {
          removeCompareItem(item.slug);
        }}
        productHref={productDetailsHref}
      />
    </ProductionShell>
  );
}
