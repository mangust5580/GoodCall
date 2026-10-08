import { useState } from 'react';

import { Checkbox, Icon } from '../../components/ui';
import { catalogColourSwatch } from './catalogColourPalette';
import {
  CatalogBrandGroup,
  CatalogCheckboxGroup,
  CatalogColourGroup,
  CatalogFilterPanel,
  CatalogPriceGroup,
} from './CatalogFilterGroups';
import type {
  CatalogColourOption,
  CatalogFilterLayout,
  CatalogFilterOption,
} from './CatalogFilterGroups';
import {
  CATALOG_RATING_VALUES,
  DEFAULT_CATALOG_FILTER_STATE,
  toggleCatalogFilterValue,
} from './catalogFilterState';
import type { CatalogFilterListKey, CatalogFilterState } from './catalogFilterState';
import type { CatalogLiveFacets } from './catalogFacets';

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

const RATING_OPTIONS: readonly CatalogRatingOption[] = CATALOG_RATING_VALUES.map((value) => ({
  value,
  label: value.replace('.', ','),
}));

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

const MEMORY_LABELS: Readonly<Partial<Record<string, string>>> = Object.fromEntries(
  MEMORY_OPTIONS.map((option) => [option.value, option.label]),
);

const BRAND_SEARCH_LABEL = 'Поиск бренда';

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

export interface CatalogFiltersProps {
  readonly value: CatalogFilterState;
  readonly onChange: (next: CatalogFilterState) => void;
  readonly totalCount: number;
  readonly layout?: CatalogFilterLayout;
  readonly liveFacets?: CatalogLiveFacets;
  readonly onReset?: () => void;
}

interface CatalogFilterOptionSets {
  readonly brands: readonly CatalogFilterOption[];
  readonly extraBrands: readonly CatalogFilterOption[];
  readonly memory: readonly CatalogFilterOption[];
  readonly colours: readonly CatalogColourOption[];
  readonly extraColours: readonly CatalogColourOption[];
}

const SPECIMEN_OPTION_SETS: CatalogFilterOptionSets = {
  brands: BRAND_OPTIONS,
  extraBrands: BRAND_EXTRA_OPTIONS,
  memory: MEMORY_OPTIONS,
  colours: COLOUR_OPTIONS.map((option) => ({ ...option, swatch: option.value })),
  extraColours: COLOUR_EXTRA_OPTIONS.map((option) => ({ ...option, swatch: option.value })),
};

function liveOptionSets(facets: CatalogLiveFacets): CatalogFilterOptionSets {
  const brands = facets.brands.map((brand) => ({
    value: brand.value,
    label: brand.value,
    count: brand.count,
  }));
  const colours = facets.colours.map((colour) => ({
    value: colour.value,
    label: colour.value,
    swatch: catalogColourSwatch(colour.value),
    count: colour.count,
  }));

  return {
    brands: brands.slice(0, BRAND_OPTIONS.length),
    extraBrands: brands.slice(BRAND_OPTIONS.length),
    memory: facets.storages.map((storage) => ({
      value: String(storage.value),
      label: MEMORY_LABELS[String(storage.value)] ?? `${String(storage.value)} ГБ`,
      count: storage.count,
    })),
    colours: colours.slice(0, COLOUR_OPTIONS.length),
    extraColours: colours.slice(COLOUR_OPTIONS.length),
  };
}

export function CatalogFilters({
  value,
  onChange,
  totalCount,
  layout = 'sidebar',
  liveFacets,
  onReset,
}: CatalogFiltersProps) {
  const live = liveFacets !== undefined;
  const options = live ? liveOptionSets(liveFacets) : SPECIMEN_OPTION_SETS;
  const [brandQuery, setBrandQuery] = useState('');

  const setList = (key: CatalogFilterListKey, next: readonly string[]): void => {
    onChange({ ...value, [key]: next });
  };

  return (
    <CatalogFilterPanel
      layout={layout}
      onReset={() => {
        setBrandQuery('');

        if (onReset === undefined) {
          onChange(DEFAULT_CATALOG_FILTER_STATE);
        } else {
          onReset();
        }
      }}
    >
      <CatalogBrandGroup
        brands={options.brands}
        extraBrands={options.extraBrands}
        legend="Бренд"
        onChange={(next) => {
          setList('brands', next);
        }}
        onQueryChange={setBrandQuery}
        query={brandQuery}
        searchLabel={BRAND_SEARCH_LABEL}
        selected={value.brands}
        totalCount={totalCount}
      />

      {live ? null : (
        <>
          <CatalogCheckboxGroup
            legend="Серия"
            onChange={(next) => {
              setList('series', next);
            }}
            options={SERIES_OPTIONS}
            selected={value.series}
          />

          <CatalogCheckboxGroup
            legend="Диагональ"
            onChange={(next) => {
              setList('diagonal', next);
            }}
            options={DIAGONAL_OPTIONS}
            selected={value.diagonal}
          />
        </>
      )}

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

      <CatalogPriceGroup
        onChange={(price) => {
          onChange({ ...value, price });
        }}
        value={value.price}
      />

      <CatalogCheckboxGroup
        legend="Память"
        onChange={(next) => {
          setList('memory', next);
        }}
        options={options.memory}
        selected={value.memory}
      />

      <CatalogColourGroup
        colours={options.colours}
        extraColours={options.extraColours}
        onChange={(next) => {
          setList('colours', next);
        }}
        selected={value.colours}
      />
    </CatalogFilterPanel>
  );
}
