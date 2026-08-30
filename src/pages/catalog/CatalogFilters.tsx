import { useState } from 'react';
import type { ReactNode } from 'react';

import { Checkbox, Icon, RangeSlider, SearchField } from '../../components/ui';
import {
  CATALOG_PRICE_MAX,
  CATALOG_PRICE_MIN,
  CATALOG_PRICE_STEP,
  DEFAULT_CATALOG_FILTER_STATE,
  toggleCatalogFilterValue,
} from './catalogFilterState';
import type { CatalogFilterListKey, CatalogFilterState } from './catalogFilterState';

interface CatalogFilterOption {
  readonly value: string;
  readonly label: string;
  readonly count?: number;
}

interface CatalogColourOption {
  readonly value: string;
  readonly label: string;
}

interface CatalogRatingOption {
  readonly value: string;
  readonly label: string;
}

const BRAND_OPTIONS: readonly CatalogFilterOption[] = [
  { value: 'apple', label: 'Apple', count: 256 },
  { value: 'samsung', label: 'Samsung', count: 380 },
  { value: 'xiaomi', label: 'Xiaomi', count: 830 },
  { value: 'honor', label: 'Honor', count: 110 },
  { value: 'realme', label: 'realme', count: 165 },
  { value: 'google', label: 'Google', count: 95 },
  { value: 'oneplus', label: 'OnePlus', count: 60 },
];

const BRAND_EXTRA_OPTIONS: readonly CatalogFilterOption[] = [
  { value: 'vivo', label: 'vivo', count: 148 },
  { value: 'oppo', label: 'OPPO', count: 132 },
  { value: 'tecno', label: 'Tecno', count: 86 },
  { value: 'nothing', label: 'Nothing', count: 24 },
];

const SERIES_OPTIONS: readonly CatalogFilterOption[] = [
  { value: 'discount-only', label: 'Только со скидкой' },
  { value: 'from-one-percent', label: 'Сначала от 1%' },
];

const DIAGONAL_OPTIONS: readonly CatalogFilterOption[] = [
  { value: 'fast-delivery', label: 'Быстрая доставка' },
  { value: 'delivery-today', label: 'Доставка сегодня' },
];

const RATING_OPTIONS: readonly CatalogRatingOption[] = [
  { value: '4.5', label: '4,5' },
  { value: '4', label: '4' },
  { value: '3', label: '3' },
  { value: '2', label: '2' },
  { value: '1', label: '1' },
];

const MEMORY_OPTIONS: readonly CatalogFilterOption[] = [
  { value: '128', label: '128 ГБ' },
  { value: '256', label: '256 ГБ' },
  { value: '512', label: '512 ГБ' },
  { value: '1024', label: '1 ТБ и больше' },
];

const COLOUR_OPTIONS: readonly CatalogColourOption[] = [
  { value: 'black', label: 'Чёрный' },
  { value: 'gray', label: 'Серый' },
  { value: 'white', label: 'Белый' },
  { value: 'violet', label: 'Фиолетовый' },
  { value: 'blue', label: 'Синий' },
  { value: 'green', label: 'Зелёный' },
  { value: 'pink', label: 'Розовый' },
];

const COLOUR_EXTRA_OPTIONS: readonly CatalogColourOption[] = [
  { value: 'red', label: 'Красный' },
  { value: 'gold', label: 'Золотой' },
  { value: 'yellow', label: 'Жёлтый' },
  { value: 'teal', label: 'Бирюзовый' },
];

const ALL_BRAND_OPTIONS: readonly CatalogFilterOption[] = [
  ...BRAND_OPTIONS,
  ...BRAND_EXTRA_OPTIONS,
];

const SHOW_MORE_LABEL = 'Показать ещё';
const SHOW_LESS_LABEL = 'Свернуть';
const BRAND_SEARCH_LABEL = 'Поиск бренда';
const BRAND_SEARCH_EMPTY_LABEL = 'Бренды не найдены';

const countFormatter = new Intl.NumberFormat('ru-RU');

function OptionLabel({ label, count }: { readonly label: string; readonly count?: number }) {
  return (
    <span className="catalog-filters__option">
      <span className="catalog-filters__option-name">{label}</span>
      {count === undefined ? null : (
        <span className="catalog-filters__option-count">{countFormatter.format(count)}</span>
      )}
    </span>
  );
}

function RatingLabel({ option }: { readonly option: CatalogRatingOption }) {
  return (
    <span className="catalog-filters__rating">
      <span aria-hidden="true" className="catalog-filters__rating-marker">
        <Icon className="catalog-filters__rating-star" name="star" />
        {option.label}
      </span>
      <span aria-hidden="true" className="catalog-filters__rating-text">
        и выше
      </span>
      <span className="ui-visually-hidden">{`Рейтинг ${option.label} и выше`}</span>
    </span>
  );
}

interface ShowMoreButtonProps {
  readonly expanded: boolean;
  readonly onToggle: () => void;
  readonly groupLabel: string;
}

function ShowMoreButton({ expanded, onToggle, groupLabel }: ShowMoreButtonProps) {
  return (
    <button
      aria-expanded={expanded}
      className="catalog-filters__more"
      onClick={onToggle}
      type="button"
    >
      {expanded ? SHOW_LESS_LABEL : SHOW_MORE_LABEL}
      <span className="ui-visually-hidden">{groupLabel}</span>
    </button>
  );
}

export interface CatalogFiltersProps {
  readonly value: CatalogFilterState;
  readonly onChange: (next: CatalogFilterState) => void;
  readonly totalCount: number;
  readonly layout?: 'sidebar' | 'dialog';
}

export function CatalogFilters({
  value,
  onChange,
  totalCount,
  layout = 'sidebar',
}: CatalogFiltersProps) {
  const [brandsExpanded, setBrandsExpanded] = useState(false);
  const [coloursExpanded, setColoursExpanded] = useState(false);
  const [brandQuery, setBrandQuery] = useState('');

  const normalizedBrandQuery = brandQuery.trim().toLowerCase();
  const brandSearchActive = normalizedBrandQuery.length > 0;
  const matchingBrands = ALL_BRAND_OPTIONS.filter((option) =>
    option.label.toLowerCase().includes(normalizedBrandQuery),
  );

  const setList = (key: CatalogFilterListKey, next: readonly string[]): void => {
    onChange({ ...value, [key]: next });
  };

  const renderCheckboxGroup = (
    key: CatalogFilterListKey,
    options: readonly CatalogFilterOption[],
  ): ReactNode =>
    options.map((option) => (
      <div className="catalog-filters__row" key={option.value}>
        <Checkbox
          checked={value[key].includes(option.value)}
          label={<OptionLabel count={option.count} label={option.label} />}
          onChange={(checked) => {
            setList(key, toggleCatalogFilterValue(value[key], option.value, checked));
          }}
        />
      </div>
    ));

  const renderColourSwatches = (options: readonly CatalogColourOption[]): ReactNode =>
    options.map((option) => (
      <label className="catalog-filters__swatch" key={option.value}>
        <input
          checked={value.colours.includes(option.value)}
          className="catalog-filters__swatch-input"
          onChange={(event) => {
            setList(
              'colours',
              toggleCatalogFilterValue(value.colours, option.value, event.target.checked),
            );
          }}
          type="checkbox"
        />
        <span
          className={`catalog-filters__swatch-dot catalog-filters__swatch-dot--${option.value}`}
        >
          <Icon className="catalog-filters__swatch-mark" name="check" />
        </span>
        <span className="ui-visually-hidden">{option.label}</span>
      </label>
    ));

  const panelClass =
    layout === 'dialog' ? 'catalog-filters catalog-filters--plain' : 'catalog-filters';

  return (
    <div className={panelClass}>
      {layout === 'sidebar' ? <h2 className="catalog-filters__title">Фильтры</h2> : null}

      <fieldset className="catalog-filters__group">
        <legend className="ui-visually-hidden">Бренд</legend>
        <div className="catalog-filters__brand-search">
          <SearchField
            label={BRAND_SEARCH_LABEL}
            labelVisuallyHidden
            onValueChange={setBrandQuery}
            placeholder={BRAND_SEARCH_LABEL}
            value={brandQuery}
          />
        </div>
        <div className="catalog-filters__row">
          <Checkbox
            checked={value.brands.length === 0}
            label={<OptionLabel count={totalCount} label="Все бренды" />}
            onChange={(checked) => {
              if (checked) {
                setList('brands', []);
              }
            }}
          />
        </div>
        {brandSearchActive ? (
          matchingBrands.length === 0 ? (
            <p className="catalog-filters__empty">{BRAND_SEARCH_EMPTY_LABEL}</p>
          ) : (
            renderCheckboxGroup('brands', matchingBrands)
          )
        ) : (
          <>
            {renderCheckboxGroup('brands', BRAND_OPTIONS)}
            {brandsExpanded ? renderCheckboxGroup('brands', BRAND_EXTRA_OPTIONS) : null}
            <ShowMoreButton
              expanded={brandsExpanded}
              groupLabel="бренды"
              onToggle={() => {
                setBrandsExpanded(!brandsExpanded);
              }}
            />
          </>
        )}
      </fieldset>

      <fieldset className="catalog-filters__group">
        <legend className="catalog-filters__legend">Серия</legend>
        {renderCheckboxGroup('series', SERIES_OPTIONS)}
      </fieldset>

      <fieldset className="catalog-filters__group">
        <legend className="catalog-filters__legend">Диагональ</legend>
        {renderCheckboxGroup('diagonal', DIAGONAL_OPTIONS)}
      </fieldset>

      <fieldset className="catalog-filters__group">
        <legend className="catalog-filters__legend">Рейтинг</legend>
        {RATING_OPTIONS.map((option) => (
          <div className="catalog-filters__row" key={option.value}>
            <Checkbox
              checked={value.rating.includes(option.value)}
              label={<RatingLabel option={option} />}
              onChange={(checked) => {
                setList('rating', toggleCatalogFilterValue(value.rating, option.value, checked));
              }}
            />
          </div>
        ))}
      </fieldset>

      <div className="catalog-filters__group">
        <h3 className="catalog-filters__legend">Цена, ₽</h3>
        <div className="catalog-filters__price">
          <RangeSlider
            formatValue={(price) => countFormatter.format(price)}
            max={CATALOG_PRICE_MAX}
            maxLabel="Цена до"
            min={CATALOG_PRICE_MIN}
            minLabel="Цена от"
            onChange={(price) => {
              onChange({ ...value, price });
            }}
            step={CATALOG_PRICE_STEP}
            values={value.price}
          />
        </div>
      </div>

      <fieldset className="catalog-filters__group">
        <legend className="catalog-filters__legend">Память</legend>
        {renderCheckboxGroup('memory', MEMORY_OPTIONS)}
      </fieldset>

      <fieldset className="catalog-filters__group">
        <legend className="catalog-filters__legend">Цвет</legend>
        <div className="catalog-filters__swatches">
          {renderColourSwatches(COLOUR_OPTIONS)}
          {coloursExpanded ? renderColourSwatches(COLOUR_EXTRA_OPTIONS) : null}
        </div>
        <ShowMoreButton
          expanded={coloursExpanded}
          groupLabel="цвета"
          onToggle={() => {
            setColoursExpanded(!coloursExpanded);
          }}
        />
      </fieldset>

      {layout === 'sidebar' ? (
        <div className="catalog-filters__group">
          <button
            className="catalog-filters__reset"
            onClick={() => {
              setBrandQuery('');
              onChange(DEFAULT_CATALOG_FILTER_STATE);
            }}
            type="button"
          >
            <Icon name="return" />
            Сбросить фильтры
          </button>
        </div>
      ) : null}
    </div>
  );
}
