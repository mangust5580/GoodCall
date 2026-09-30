import { useState } from 'react';
import type { ReactNode } from 'react';

import { Button, Checkbox, Icon, RangeSlider } from '../../components/ui';
import { SEARCH_PRICE_STEP, toggleFilterValue } from './searchFacets';
import type { SearchFacetOption, SearchFacetOptions, SearchFilterState } from './searchFacets';

interface SearchFiltersBaseProps {
  readonly options: SearchFacetOptions;
  readonly draft: SearchFilterState;
  readonly onDraftChange: (draft: SearchFilterState) => void;
}

interface SearchFiltersPanelProps extends SearchFiltersBaseProps {
  readonly layout?: 'panel';
  readonly onApply: () => void;
  readonly onReset: () => void;
  readonly applyDisabled: boolean;
  readonly resetDisabled: boolean;
}

interface SearchFiltersDialogProps extends SearchFiltersBaseProps {
  readonly layout: 'dialog';
}

type SearchFiltersProps = SearchFiltersPanelProps | SearchFiltersDialogProps;

const COLLAPSED_OPTION_COUNT = 6;

const countFormatter = new Intl.NumberFormat('ru-RU');

const SWATCH_FILLS: Readonly<Record<string, string>> = {
  'Натуральный титан': '#b8b2a7',
  Фиолетовый: '#7c5cbf',
  Чёрный: '#1f2024',
  Обсидиан: '#2b2d33',
  Сланец: '#5b6470',
  Серебристый: '#c9ccd1',
  Лиловый: '#b89ad8',
  Золотой: '#d4b26a',
  Изумрудный: '#2f8f6b',
  Зелёный: '#4f9a5e',
  Розовый: '#f2b8c0',
  Синий: '#3a6fd8',
};

function OptionLabel({ label, count }: { readonly label: string; readonly count: number }) {
  return (
    <span className="search-filters__option">
      <span className="search-filters__option-label">{label}</span>{' '}
      <span className="search-filters__count">{count}</span>
    </span>
  );
}

function visibleOptions<Value extends string | number>(
  options: readonly SearchFacetOption<Value>[],
  selected: readonly Value[],
  expanded: boolean,
): readonly SearchFacetOption<Value>[] {
  return expanded
    ? options
    : options.filter(
        (option, index) => index < COLLAPSED_OPTION_COUNT || selected.includes(option.value),
      );
}

interface DisclosureListProps {
  readonly id: string;
  readonly className: string;
  readonly total: number;
  readonly shown: number;
  readonly expanded: boolean;
  readonly onToggle: () => void;
  readonly children: ReactNode;
}

function DisclosureList({
  id,
  className,
  total,
  shown,
  expanded,
  onToggle,
  children,
}: DisclosureListProps) {
  const hidden = total - shown;

  return (
    <>
      <ul className={className} id={id}>
        {children}
      </ul>
      {expanded || hidden > 0 ? (
        <button
          aria-controls={id}
          aria-expanded={expanded}
          className="search-filters__more"
          onClick={onToggle}
          type="button"
        >
          {expanded ? 'Скрыть' : `Показать ещё ${hidden}`}
          <Icon
            className={
              expanded
                ? 'search-filters__more-icon search-filters__more-icon--expanded'
                : 'search-filters__more-icon'
            }
            name="chevron-down"
          />
        </button>
      ) : null}
    </>
  );
}

export function SearchFilters(props: SearchFiltersProps) {
  const { options, draft, onDraftChange } = props;
  const [brandsExpanded, setBrandsExpanded] = useState(false);
  const [coloursExpanded, setColoursExpanded] = useState(false);
  const bounds = options.priceBounds;
  const brands = visibleOptions(options.brands, draft.brands, brandsExpanded);
  const colours = visibleOptions(options.colours, draft.colours, coloursExpanded);

  const fields = (
    <>
      {bounds === undefined ? null : (
        <fieldset className="search-filters__group">
          <legend className="search-filters__legend">Цена, ₽</legend>
          <RangeSlider
            formatValue={(price) => countFormatter.format(price)}
            max={bounds[1]}
            maxLabel="Цена до"
            min={bounds[0]}
            minLabel="Цена от"
            onChange={(price) => {
              onDraftChange({ ...draft, price });
            }}
            step={SEARCH_PRICE_STEP}
            values={draft.price ?? bounds}
          />
        </fieldset>
      )}

      {options.brands.length === 0 ? null : (
        <fieldset className="search-filters__group">
          <legend className="search-filters__legend">Бренд</legend>
          <DisclosureList
            className="search-filters__list"
            expanded={brandsExpanded}
            id="search-filters-brands"
            onToggle={() => {
              setBrandsExpanded((current) => !current);
            }}
            shown={brands.length}
            total={options.brands.length}
          >
            {brands.map((brand) => (
              <li className="search-filters__row" key={brand.value}>
                <Checkbox
                  checked={draft.brands.includes(brand.value)}
                  label={<OptionLabel count={brand.count} label={brand.value} />}
                  onChange={(checked) => {
                    onDraftChange({
                      ...draft,
                      brands: toggleFilterValue(draft.brands, brand.value, checked),
                    });
                  }}
                />
              </li>
            ))}
          </DisclosureList>
        </fieldset>
      )}

      {options.colours.length === 0 ? null : (
        <fieldset className="search-filters__group">
          <legend className="search-filters__legend">Цвет</legend>
          <DisclosureList
            className="search-filters__swatches"
            expanded={coloursExpanded}
            id="search-filters-colours"
            onToggle={() => {
              setColoursExpanded((current) => !current);
            }}
            shown={colours.length}
            total={options.colours.length}
          >
            {colours.map((colour) => (
              <li key={colour.value}>
                <label className="search-filters__swatch">
                  <input
                    checked={draft.colours.includes(colour.value)}
                    className="search-filters__swatch-input"
                    onChange={(event) => {
                      onDraftChange({
                        ...draft,
                        colours: toggleFilterValue(
                          draft.colours,
                          colour.value,
                          event.target.checked,
                        ),
                      });
                    }}
                    type="checkbox"
                  />
                  <span
                    className="search-filters__swatch-dot"
                    style={{ backgroundColor: SWATCH_FILLS[colour.value] }}
                  >
                    <Icon className="search-filters__swatch-mark" name="check" />
                  </span>
                  <OptionLabel count={colour.count} label={colour.value} />
                </label>
              </li>
            ))}
          </DisclosureList>
        </fieldset>
      )}

      {options.storages.length === 0 ? null : (
        <fieldset className="search-filters__group">
          <legend className="search-filters__legend">Встроенная память</legend>
          <ul className="search-filters__list">
            {options.storages.map((storage) => (
              <li className="search-filters__row" key={storage.value}>
                <Checkbox
                  checked={draft.storages.includes(storage.value)}
                  label={<OptionLabel count={storage.count} label={`${storage.value} ГБ`} />}
                  onChange={(checked) => {
                    onDraftChange({
                      ...draft,
                      storages: toggleFilterValue(draft.storages, storage.value, checked),
                    });
                  }}
                />
              </li>
            ))}
          </ul>
        </fieldset>
      )}
    </>
  );

  if (props.layout === 'dialog') {
    return <div className="search-filters search-filters--plain">{fields}</div>;
  }

  return (
    <aside aria-labelledby="search-filters-title" className="search-filters">
      <h2 className="search-filters__title" id="search-filters-title">
        Фильтры
      </h2>

      {fields}

      <div className="search-filters__actions">
        <Button disabled={props.applyDisabled} onClick={props.onApply} variant="primary">
          Применить
        </Button>
        <Button disabled={props.resetDisabled} onClick={props.onReset} variant="secondary">
          Сбросить
        </Button>
      </div>
    </aside>
  );
}
