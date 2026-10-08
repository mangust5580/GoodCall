import { useState } from 'react';

import { colourSwatch } from '../../../components/product';
import {
  CatalogBrandGroup,
  CatalogCheckboxGroup,
  CatalogColourGroup,
  CatalogFilterPanel,
  CatalogPriceGroup,
} from '../CatalogFilterGroups';
import type { CatalogFilterLayout } from '../CatalogFilterGroups';
import type { LaptopFacets } from './laptopFacets';
import type { LaptopFilterListKey, LaptopFilterState } from './laptopFilterState';

interface LaptopFiltersProps {
  readonly value: LaptopFilterState;
  readonly onChange: (next: LaptopFilterState) => void;
  readonly facets: LaptopFacets;
  readonly totalCount: number;
  readonly layout?: CatalogFilterLayout;
  readonly onReset?: () => void;
}

const BRAND_SEARCH_LABEL = 'Поиск производителя';

const SPEC_GROUPS: readonly (readonly [
  Exclude<LaptopFilterListKey, 'brands' | 'colours'>,
  string,
])[] = [
  ['diagonal', 'Диагональ экрана'],
  ['cpu', 'Процессор'],
  ['ram', 'Оперативная память (RAM)'],
  ['ssd', 'Объём накопителя (SSD)'],
  ['gpu', 'Видеокарта'],
  ['os', 'Операционная система'],
];

export function LaptopFilters({
  value,
  onChange,
  facets,
  totalCount,
  layout = 'sidebar',
  onReset,
}: LaptopFiltersProps) {
  const [brandQuery, setBrandQuery] = useState('');

  const setList = (key: LaptopFilterListKey, next: readonly string[]): void => {
    onChange({ ...value, [key]: next });
  };

  return (
    <CatalogFilterPanel
      layout={layout}
      onReset={() => {
        setBrandQuery('');
        onReset?.();
      }}
    >
      <CatalogPriceGroup
        onChange={(price) => {
          onChange({ ...value, price });
        }}
        value={value.price}
      />

      <CatalogBrandGroup
        allLabel="Все производители"
        brands={facets.brands}
        extraBrands={[]}
        legend="Производитель"
        legendVisible
        onChange={(next) => {
          setList('brands', next);
        }}
        onQueryChange={setBrandQuery}
        query={brandQuery}
        searchLabel={BRAND_SEARCH_LABEL}
        selected={value.brands}
        totalCount={totalCount}
      />

      {SPEC_GROUPS.map(([key, legend]) => (
        <CatalogCheckboxGroup
          key={key}
          legend={legend}
          onChange={(next) => {
            setList(key, next);
          }}
          options={facets[key]}
          selected={value[key]}
        />
      ))}

      <CatalogColourGroup
        colours={facets.colours.map((option) => ({
          ...option,
          swatch: colourSwatch(option.value),
        }))}
        extraColours={[]}
        onChange={(next) => {
          setList('colours', next);
        }}
        selected={value.colours}
      />
    </CatalogFilterPanel>
  );
}
