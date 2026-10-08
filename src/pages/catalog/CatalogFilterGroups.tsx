import { useState } from 'react';
import type { ReactNode } from 'react';

import { Checkbox, Icon, RangeSlider, SearchField } from '../../components/ui';
import { CATALOG_PRICE_MAX, CATALOG_PRICE_MIN, CATALOG_PRICE_STEP } from './catalogFilterState';
import { toggleCatalogFilterValue } from './catalogFilterState';

export interface CatalogFilterOption {
  readonly value: string;
  readonly label: string;
  readonly count?: number;
}

export interface CatalogColourOption extends CatalogFilterOption {
  readonly swatch?: string;
}

export type CatalogFilterLayout = 'sidebar' | 'dialog';

const SHOW_MORE_LABEL = 'Показать ещё';
const SHOW_LESS_LABEL = 'Свернуть';
const BRAND_SEARCH_EMPTY_LABEL = 'Бренды не найдены';

const catalogCountFormatter = new Intl.NumberFormat('ru-RU');

export function OptionLabel({ label, count }: { readonly label: string; readonly count?: number }) {
  return (
    <span className="catalog-filters__option">
      <span className="catalog-filters__option-name">{label}</span>
      {count === undefined ? null : (
        <span className="catalog-filters__option-count">{catalogCountFormatter.format(count)}</span>
      )}
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

interface CatalogCheckboxRowsProps {
  readonly options: readonly CatalogFilterOption[];
  readonly selected: readonly string[];
  readonly onChange: (next: string[]) => void;
}

export function CatalogCheckboxRows({ options, selected, onChange }: CatalogCheckboxRowsProps) {
  return options.map((option) => (
    <div className="catalog-filters__row" key={option.value}>
      <Checkbox
        checked={selected.includes(option.value)}
        label={<OptionLabel count={option.count} label={option.label} />}
        onChange={(checked) => {
          onChange(toggleCatalogFilterValue(selected, option.value, checked));
        }}
      />
    </div>
  ));
}

interface CatalogCheckboxGroupProps extends CatalogCheckboxRowsProps {
  readonly legend: string;
}

export function CatalogCheckboxGroup({
  legend,
  options,
  selected,
  onChange,
}: CatalogCheckboxGroupProps) {
  return (
    <fieldset className="catalog-filters__group">
      <legend className="catalog-filters__legend">{legend}</legend>
      <CatalogCheckboxRows onChange={onChange} options={options} selected={selected} />
    </fieldset>
  );
}

interface CatalogBrandGroupProps {
  readonly legend: string;
  readonly legendVisible?: boolean;
  readonly searchLabel: string;
  readonly allLabel?: string;
  readonly totalCount: number;
  readonly brands: readonly CatalogFilterOption[];
  readonly extraBrands: readonly CatalogFilterOption[];
  readonly selected: readonly string[];
  readonly onChange: (next: readonly string[]) => void;
  readonly query: string;
  readonly onQueryChange: (query: string) => void;
}

export function CatalogBrandGroup({
  legend,
  legendVisible = false,
  searchLabel,
  allLabel = 'Все бренды',
  totalCount,
  brands,
  extraBrands,
  selected,
  onChange,
  query,
  onQueryChange,
}: CatalogBrandGroupProps) {
  const [expanded, setExpanded] = useState(false);
  const normalizedQuery = query.trim().toLowerCase();
  const searchActive = normalizedQuery.length > 0;
  const matchingBrands = [...brands, ...extraBrands].filter((option) =>
    option.label.toLowerCase().includes(normalizedQuery),
  );

  return (
    <fieldset className="catalog-filters__group">
      <legend className={legendVisible ? 'catalog-filters__legend' : 'ui-visually-hidden'}>
        {legend}
      </legend>
      <div className="catalog-filters__brand-search">
        <SearchField
          label={searchLabel}
          labelVisuallyHidden
          onValueChange={onQueryChange}
          placeholder={searchLabel}
          value={query}
        />
      </div>
      <div className="catalog-filters__row">
        <Checkbox
          checked={selected.length === 0}
          label={<OptionLabel count={totalCount} label={allLabel} />}
          onChange={(checked) => {
            if (checked) {
              onChange([]);
            }
          }}
        />
      </div>
      {searchActive ? (
        matchingBrands.length === 0 ? (
          <p className="catalog-filters__empty">{BRAND_SEARCH_EMPTY_LABEL}</p>
        ) : (
          <CatalogCheckboxRows onChange={onChange} options={matchingBrands} selected={selected} />
        )
      ) : (
        <>
          <CatalogCheckboxRows onChange={onChange} options={brands} selected={selected} />
          {expanded ? (
            <CatalogCheckboxRows onChange={onChange} options={extraBrands} selected={selected} />
          ) : null}
          {extraBrands.length > 0 ? (
            <ShowMoreButton
              expanded={expanded}
              groupLabel="бренды"
              onToggle={() => {
                setExpanded(!expanded);
              }}
            />
          ) : null}
        </>
      )}
    </fieldset>
  );
}

interface CatalogPriceGroupProps {
  readonly value: readonly [number, number];
  readonly onChange: (next: readonly [number, number]) => void;
}

export function CatalogPriceGroup({ value, onChange }: CatalogPriceGroupProps) {
  return (
    <div className="catalog-filters__group">
      <h3 className="catalog-filters__legend">Цена, ₽</h3>
      <div className="catalog-filters__price">
        <RangeSlider
          formatValue={(price) => catalogCountFormatter.format(price)}
          max={CATALOG_PRICE_MAX}
          maxLabel="Цена до"
          min={CATALOG_PRICE_MIN}
          minLabel="Цена от"
          onChange={onChange}
          step={CATALOG_PRICE_STEP}
          values={value}
        />
      </div>
    </div>
  );
}

interface CatalogColourGroupProps {
  readonly colours: readonly CatalogColourOption[];
  readonly extraColours: readonly CatalogColourOption[];
  readonly selected: readonly string[];
  readonly onChange: (next: readonly string[]) => void;
}

export function CatalogColourGroup({
  colours,
  extraColours,
  selected,
  onChange,
}: CatalogColourGroupProps) {
  const [expanded, setExpanded] = useState(false);
  const shown = expanded ? [...colours, ...extraColours] : colours;
  const swatches = shown.filter((option) => option.swatch !== undefined);
  const rows = shown.filter((option) => option.swatch === undefined);

  return (
    <fieldset className="catalog-filters__group">
      <legend className="catalog-filters__legend">Цвет</legend>
      {swatches.length > 0 ? (
        <div className="catalog-filters__swatches">
          {swatches.map((option) => (
            <label className="catalog-filters__swatch" key={option.value}>
              <input
                checked={selected.includes(option.value)}
                className="catalog-filters__swatch-input"
                onChange={(event) => {
                  onChange(toggleCatalogFilterValue(selected, option.value, event.target.checked));
                }}
                type="checkbox"
              />
              <span
                className={`catalog-filters__swatch-dot catalog-filters__swatch-dot--${option.swatch ?? ''}`}
              >
                <Icon className="catalog-filters__swatch-mark" name="check" />
              </span>
              <span className="ui-visually-hidden">
                {option.count === undefined
                  ? option.label
                  : `${option.label} (${catalogCountFormatter.format(option.count)})`}
              </span>
            </label>
          ))}
        </div>
      ) : null}
      {rows.length > 0 ? (
        <div className="catalog-filters__colour-rows">
          <CatalogCheckboxRows onChange={onChange} options={rows} selected={selected} />
        </div>
      ) : null}
      {extraColours.length > 0 ? (
        <ShowMoreButton
          expanded={expanded}
          groupLabel="цвета"
          onToggle={() => {
            setExpanded(!expanded);
          }}
        />
      ) : null}
    </fieldset>
  );
}

interface CatalogFilterPanelProps {
  readonly layout: CatalogFilterLayout;
  readonly onReset: () => void;
  readonly children: ReactNode;
}

export function CatalogFilterPanel({ layout, onReset, children }: CatalogFilterPanelProps) {
  const panelClass =
    layout === 'dialog' ? 'catalog-filters catalog-filters--plain' : 'catalog-filters';

  return (
    <div className={panelClass}>
      {layout === 'sidebar' ? <h2 className="catalog-filters__title">Фильтры</h2> : null}
      {children}
      {layout === 'sidebar' ? (
        <div className="catalog-filters__group">
          <button className="catalog-filters__reset" onClick={onReset} type="button">
            <Icon name="return" />
            Сбросить фильтры
          </button>
        </div>
      ) : null}
    </div>
  );
}
