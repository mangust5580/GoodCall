import { addCartLine, cartLineId } from '../../commerce/cart';
import { clearCompareItems, removeCompareItem, useCompareItems } from '../../commerce/compare';
import type { CompareItem } from '../../commerce/compare';
import { formatMemorySize } from '../../commerce/format';
import {
  LAPTOP_GPU_LABELS,
  LAPTOP_OS_LABELS,
  formatLaptopDiagonal,
  laptopFacts,
} from '../../pages/catalog';
import { ComparePage } from '../../pages/compare';
import type { ComparePageProps } from '../../pages/compare';
import { getProductDetailsContent } from '../../pages/product-details';
import { ProductionShell } from '../ProductionShell';
import { CATALOG_SMARTPHONES_PATH, HOME_PATH, hashHref, productDetailsHref } from '../routePaths';
import { useDocumentTitle } from '../useDocumentTitle';

type CompareFacts = ComparePageProps['facts'];
type CompareFactRow = CompareFacts['rows'][number];
type CompareCategory = 'smartphones' | 'laptops';
type LaptopFacts = NonNullable<ReturnType<typeof laptopFacts>>;

const SMARTPHONE_SPEC_LABELS: readonly string[] = [
  'Диагональ экрана',
  'Тип экрана',
  'Процессор',
  'Основная камера',
  'Фронтальная камера',
  'Оперативная память',
  'Операционная система',
];

const SMARTPHONE_ROWS: readonly CompareFactRow[] = SMARTPHONE_SPEC_LABELS.map((label) => ({
  label,
  value: (slug) =>
    getProductDetailsContent(slug)
      ?.specificationGroups.flatMap((group) => group.rows)
      .find((row) => row.label === label)?.value,
}));

function laptopRow(label: string, format: (facts: LaptopFacts) => string): CompareFactRow {
  return {
    label,
    value: (slug) => {
      const facts = laptopFacts(slug);

      return facts === undefined ? undefined : format(facts);
    },
  };
}

const LAPTOP_ROWS: readonly CompareFactRow[] = [
  laptopRow('Диагональ', (facts) => formatLaptopDiagonal(facts.diagonal)),
  laptopRow('Процессор', (facts) => facts.cpuModel),
  laptopRow('Оперативная память', (facts) => formatMemorySize(facts.ram)),
  laptopRow('SSD', (facts) => formatMemorySize(facts.ssd)),
  laptopRow('Видеокарта', (facts) => LAPTOP_GPU_LABELS[facts.gpu]),
  laptopRow('ОС', (facts) => LAPTOP_OS_LABELS[facts.os]),
];

const SHARED_FACTS: CompareFacts = { rows: [], replacesStorage: false, mixedCategories: false };

function compareCategory(slug: string): CompareCategory | undefined {
  if (laptopFacts(slug) !== undefined) {
    return 'laptops';
  }

  return getProductDetailsContent(slug)?.category === 'smartphones' ? 'smartphones' : undefined;
}

function compareFacts(items: readonly CompareItem[]): CompareFacts {
  const categories = items.map((item) => compareCategory(item.slug));

  if (categories.length > 0 && categories.every((category) => category === 'laptops')) {
    return { rows: LAPTOP_ROWS, replacesStorage: true, mixedCategories: false };
  }

  if (categories.length > 0 && categories.every((category) => category === 'smartphones')) {
    return { rows: SMARTPHONE_ROWS, replacesStorage: false, mixedCategories: false };
  }

  if (categories.includes('laptops') && categories.includes('smartphones')) {
    return { ...SHARED_FACTS, mixedCategories: true };
  }

  return SHARED_FACTS;
}

export function CompareRoute() {
  const items = useCompareItems();
  useDocumentTitle('Сравнение товаров');

  return (
    <ProductionShell>
      <ComparePage
        catalogHref={hashHref(CATALOG_SMARTPHONES_PATH)}
        facts={compareFacts(items)}
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
