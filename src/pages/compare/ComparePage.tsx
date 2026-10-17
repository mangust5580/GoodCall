import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';

import { CartLineMedia } from '../../commerce/cart';
import { COMPARE_LIMIT } from '../../commerce/compare';
import type { CompareItem } from '../../commerce/compare';
import { formatMemorySize, formatPrice } from '../../commerce/format';
import { ConfirmationDialog, EmptyState } from '../../components/feedback';
import { Breadcrumbs, Container } from '../../components/layout';
import { ProductRating } from '../../components/product';
import { Icon } from '../../components/ui';

export interface CompareFactRow {
  readonly label: string;
  readonly value: (slug: string) => string | undefined;
}

export interface CompareFacts {
  readonly rows: readonly CompareFactRow[];
  readonly replacesStorage: boolean;
  readonly mixedCategories: boolean;
}

export interface ComparePageProps {
  readonly items: readonly CompareItem[];
  readonly facts: CompareFacts;
  readonly onRemove: (item: CompareItem) => void;
  readonly onClear: () => void;
  readonly onAddToCart: (item: CompareItem) => number;
  readonly productHref: (slug: string) => string | undefined;
  readonly homeHref: string;
  readonly catalogHref: string;
}

interface CompareRow {
  readonly label: string;
  readonly value: (item: CompareItem) => ReactNode;
}

type FocusRequest =
  { readonly kind: 'column'; readonly index: number } | { readonly kind: 'empty' };

const EMPTY_TITLE_ID = 'compare-empty-title';
const STORAGE_ROW_LABEL = 'Встроенная память';
const MEDIA_SIZES = '120px';
const MISSING = '—';

const COMPARE_ROWS: readonly CompareRow[] = [
  { label: 'Цена', value: (item) => formatPrice(item.price) },
  {
    label: 'Выгода',
    value: (item) =>
      item.oldPrice !== undefined && item.oldPrice > item.price
        ? formatPrice(item.oldPrice - item.price)
        : MISSING,
  },
  {
    label: 'Рейтинг',
    value: (item) =>
      item.rating === undefined ? (
        MISSING
      ) : (
        <ProductRating rating={item.rating} reviewCount={item.reviewCount} />
      ),
  },
  { label: 'Бренд', value: (item) => item.brand ?? MISSING },
  {
    label: STORAGE_ROW_LABEL,
    value: (item) => (item.storage === undefined ? MISSING : formatMemorySize(item.storage)),
  },
  { label: 'Цвет', value: (item) => item.colour ?? MISSING },
];

function compareRows(facts: CompareFacts): readonly CompareRow[] {
  const sharedRows = facts.replacesStorage
    ? COMPARE_ROWS.filter((row) => row.label !== STORAGE_ROW_LABEL)
    : COMPARE_ROWS;

  return [
    ...sharedRows,
    ...facts.rows.map((row) => ({
      label: row.label,
      value: (item: CompareItem) => row.value(item.slug) ?? MISSING,
    })),
  ];
}

export function ComparePage({
  items,
  facts,
  onRemove,
  onClear,
  onAddToCart,
  productHref,
  homeHref,
  catalogHref,
}: ComparePageProps) {
  const [announcement, setAnnouncement] = useState('');
  const [scrollable, setScrollable] = useState(false);
  const tableRef = useRef<HTMLTableElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const focusRequest = useRef<FocusRequest>(undefined);
  const itemCount = items.length;
  const rows = compareRows(facts);
  const [confirmingClear, setConfirmingClear] = useState(false);

  if (confirmingClear && itemCount === 0) {
    setConfirmingClear(false);
  }

  useEffect(() => {
    const scroller = scrollRef.current;

    if (scroller === null) {
      return undefined;
    }

    const measure = () => {
      setScrollable(scroller.scrollWidth > scroller.clientWidth);
    };
    const observer = new ResizeObserver(measure);

    observer.observe(scroller);
    measure();

    return () => {
      observer.disconnect();
    };
  }, [itemCount]);

  useEffect(() => {
    const request = focusRequest.current;

    if (request === undefined) {
      return;
    }

    focusRequest.current = undefined;

    if (request.kind === 'empty' || itemCount === 0) {
      document.getElementById(EMPTY_TITLE_ID)?.focus();
    } else {
      const buttons = tableRef.current?.querySelectorAll<HTMLButtonElement>(
        '.compare-product__remove',
      );
      buttons?.[Math.min(request.index, itemCount - 1)]?.focus();
    }
  }, [itemCount]);

  return (
    <main className="compare-page">
      <Container>
        <Breadcrumbs
          className="compare-page__breadcrumbs"
          items={[{ label: 'Главная', href: homeHref }, { label: 'Сравнение товаров' }]}
        />

        {itemCount === 0 ? (
          <EmptyState
            action={{ label: 'Перейти к смартфонам', href: catalogHref }}
            className="compare-empty"
            headingLevel="h1"
            icon="compare"
            message={`Добавляйте товары к сравнению в каталоге — до ${String(COMPARE_LIMIT)} товаров одновременно.`}
            title="Сравнение пусто"
            titleId={EMPTY_TITLE_ID}
            variant="page"
          />
        ) : (
          <section aria-labelledby="compare-title" className="compare">
            <header className="compare__header">
              <div className="compare__heading">
                <div className="compare__title-row">
                  <h1 className="compare__title" id="compare-title">
                    Сравнение товаров
                  </h1>
                  <p className="compare__count">{`${String(itemCount)} из ${String(COMPARE_LIMIT)}`}</p>
                </div>
                <p className="compare__lead">
                  Сравните характеристики товаров и выберите лучший вариант
                </p>
              </div>
              <button
                className="ui-button ui-button--secondary compare__clear"
                onClick={(event) => {
                  event.currentTarget.focus();
                  setConfirmingClear(true);
                }}
                type="button"
              >
                Очистить все
              </button>
            </header>

            {facts.mixedCategories ? (
              <p className="compare__note">
                Характеристики по категориям показываются, когда в сравнении товары одной категории.
              </p>
            ) : null}

            <div
              aria-label={
                scrollable ? 'Таблица сравнения, прокручивается по горизонтали' : undefined
              }
              className="compare__scroll"
              ref={scrollRef}
              role={scrollable ? 'region' : undefined}
              tabIndex={scrollable ? 0 : undefined}
            >
              <table
                className={`compare-table compare-table--columns-${String(itemCount)}`}
                ref={tableRef}
              >
                <caption className="ui-visually-hidden">
                  Сравнение характеристик выбранных товаров
                </caption>
                <thead>
                  <tr>
                    <td className="compare-table__corner" />
                    {items.map((item, index) => {
                      const href = productHref(item.slug);

                      return (
                        <th className="compare-product" key={item.slug} scope="col">
                          <button
                            aria-label={`Убрать из сравнения: ${item.title}`}
                            className="compare-product__remove"
                            onClick={() => {
                              onRemove(item);
                              setAnnouncement(`Товар убран из сравнения: ${item.title}`);
                              focusRequest.current = { kind: 'column', index };
                            }}
                            type="button"
                          >
                            <Icon name="close" />
                          </button>
                          <span className="compare-product__media">
                            <CartLineMedia
                              className="compare-product__image"
                              image={item.image}
                              productSlug={item.slug}
                              sizes={MEDIA_SIZES}
                            />
                          </span>
                          <span className="compare-product__title">
                            {href === undefined ? (
                              item.title
                            ) : (
                              <a className="compare-product__link" href={href}>
                                {item.title}
                              </a>
                            )}
                          </span>
                          <span className="compare-product__prices">
                            <strong className="compare-product__price">
                              {formatPrice(item.price)}
                            </strong>
                            {item.oldPrice === undefined ? null : (
                              <del className="compare-product__old-price">
                                {formatPrice(item.oldPrice)}
                              </del>
                            )}
                          </span>
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <tr className="compare-table__row" key={row.label}>
                      <th className="compare-table__label" scope="row">
                        {row.label}
                      </th>
                      {items.map((item) => (
                        <td className="compare-table__value" key={item.slug}>
                          {row.value(item)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td className="compare-table__corner" />
                    {items.map((item) => (
                      <td className="compare-table__action" key={item.slug}>
                        <button
                          aria-label={`В корзину: ${item.title}`}
                          className="ui-button ui-button--primary compare-table__cart"
                          onClick={() => {
                            const quantity = onAddToCart(item);
                            setAnnouncement(
                              `Товар добавлен в корзину: ${item.title}. В корзине: ${String(quantity)} шт.`,
                            );
                          }}
                          type="button"
                        >
                          В корзину
                        </button>
                      </td>
                    ))}
                  </tr>
                </tfoot>
              </table>
            </div>
          </section>
        )}
      </Container>
      <p className="ui-visually-hidden" role="status">
        {announcement}
      </p>
      <ConfirmationDialog
        cancelLabel="Отмена"
        confirmLabel="Очистить"
        message={`Из сравнения будут убраны все товары: ${String(itemCount)}.`}
        onConfirm={() => {
          onClear();
          setAnnouncement('Сравнение очищено');
          focusRequest.current = { kind: 'empty' };
        }}
        onOpenChange={setConfirmingClear}
        open={confirmingClear && itemCount > 0}
        title="Очистить сравнение?"
      />
    </main>
  );
}
