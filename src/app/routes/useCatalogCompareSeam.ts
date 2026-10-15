import { useState } from 'react';

import {
  COMPARE_LIMIT,
  isCompared,
  toggleCompareItem,
  useCompareItems,
} from '../../commerce/compare';
import type { CompareItem } from '../../commerce/compare';
import { laptopFacts } from '../../pages/catalog';
import type { CatalogCompareSeam, CatalogProduct } from '../../pages/catalog';
import { productBrand, productColour, productStorage } from '../../pages/search';
import { COMPARE_PATH, hashHref } from '../routePaths';

const COMPARE_HREF = hashHref(COMPARE_PATH);
const COMPARE_LIMIT_TEXT = String(COMPARE_LIMIT);

interface CompareAddNotice {
  readonly slug: string;
  readonly announcement: string;
  readonly origin: HTMLElement | null;
}

export interface CompareAddNoticeBinding {
  readonly open: boolean;
  readonly message: string;
  readonly announcement: string;
  readonly actionLabel: string;
  readonly actionHref: string;
  readonly dismissLabel: string;
  readonly onDismiss: (focusedNotice: HTMLElement | null) => void;
}

export interface CatalogCompareBinding {
  readonly seam: CatalogCompareSeam | undefined;
  readonly notice: CompareAddNoticeBinding;
}

function catalogCompareItem(product: CatalogProduct): CompareItem {
  const brand = productBrand(product);
  const storage = laptopFacts(product.id)?.ssd ?? productStorage(product);
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

function focusedElement(): HTMLElement | null {
  const active = document.activeElement;

  return active instanceof HTMLElement && active !== document.body ? active : null;
}

function visibleCompareLink(excluded: HTMLElement): HTMLElement | null {
  return (
    [...document.querySelectorAll<HTMLAnchorElement>(`a[href="${COMPARE_HREF}"]`)].find(
      (link) => !excluded.contains(link) && link.getClientRects().length > 0,
    ) ?? null
  );
}

export function useCatalogCompareSeam(
  liveProducts: boolean,
  resetKey?: string,
): CatalogCompareBinding {
  const compareItems = useCompareItems();
  const [notice, setNotice] = useState<CompareAddNotice>();
  const [noticeResetKey, setNoticeResetKey] = useState(resetKey);

  if (noticeResetKey !== resetKey) {
    setNoticeResetKey(resetKey);
    setNotice(undefined);
  }

  const noticeItemPresent =
    notice !== undefined && compareItems.some((item) => item.slug === notice.slug);

  if (notice !== undefined && !noticeItemPresent) {
    setNotice(undefined);
  }

  const noticeBinding: CompareAddNoticeBinding = {
    open: noticeItemPresent,
    message: `Добавлено к сравнению · ${String(compareItems.length)}\u00a0из\u00a0${COMPARE_LIMIT_TEXT}`,
    announcement: noticeItemPresent ? notice.announcement : '',
    actionLabel: 'Перейти к сравнению',
    actionHref: COMPARE_HREF,
    dismissLabel: 'Закрыть уведомление',
    onDismiss: (focusedNotice) => {
      if (focusedNotice !== null) {
        const origin = notice?.origin;
        const target = origin?.isConnected === true ? origin : visibleCompareLink(focusedNotice);

        target?.focus();
      }

      setNotice(undefined);
    },
  };

  if (!liveProducts) {
    return { seam: undefined, notice: noticeBinding };
  }

  return {
    seam: {
      isCompared: (product) => compareItems.some((item) => item.slug === product.id),
      full: compareItems.length >= COMPARE_LIMIT,
      fullLabel: (product) =>
        `Сравнение заполнено (${COMPARE_LIMIT_TEXT} из ${COMPARE_LIMIT_TEXT}): ${product.title}`,
      toggle: (product, pressed) => {
        if (!pressed) {
          toggleCompareItem(catalogCompareItem(product), false);
          setNotice(undefined);
          return;
        }

        const wasCompared = isCompared(product.id);

        toggleCompareItem(catalogCompareItem(product), true);

        if (wasCompared || !isCompared(product.id)) {
          return;
        }

        setNotice({
          slug: product.id,
          announcement: `Товар добавлен к сравнению: ${product.title}. В сравнении ${String(compareItems.length + 1)} из ${COMPARE_LIMIT_TEXT}.`,
          origin: focusedElement(),
        });
      },
    },
    notice: noticeBinding,
  };
}
