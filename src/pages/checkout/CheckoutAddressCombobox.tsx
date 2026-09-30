import { useEffect, useState } from 'react';
import type { KeyboardEvent } from 'react';

import { TextField } from '../../components/ui';

export type CheckoutAddressFieldMode = 'provider' | 'manual';

interface CheckoutAddressComboboxProps<T> {
  readonly id: string;
  readonly label: string;
  readonly value: string;
  readonly selected: boolean;
  readonly mode: CheckoutAddressFieldMode;
  readonly error?: string;
  readonly hint?: string;
  readonly disabled?: boolean;
  readonly maxLength: number;
  readonly minQueryLength: number;
  readonly notFoundMessage: string;
  readonly manualAutoComplete?: string;
  readonly search: (query: string, signal: AbortSignal) => Promise<readonly T[]>;
  readonly getKey: (option: T) => string;
  readonly getLabel: (option: T) => string;
  readonly getCaption?: (option: T) => string;
  readonly onInput: (value: string) => void;
  readonly onSelect: (option: T) => void;
  readonly onManual: () => void;
  readonly onLookupFailure: () => void;
}

interface AddressSearchResult<T> {
  readonly query: string;
  readonly options: readonly T[];
}

const SEARCH_DEBOUNCE_MS = 280;
const LOOKUP_TIMEOUT_MS = 6000;
const MANUAL_OPTION_LABEL = 'Не нашли? Указать вручную';
const LOADING_MESSAGE = 'Идёт поиск…';

function searchKey(value: string): string {
  return value.trim().replace(/\s+/gu, ' ');
}

export function CheckoutAddressCombobox<T>({
  id,
  label,
  value,
  selected,
  mode,
  error,
  hint,
  disabled = false,
  maxLength,
  minQueryLength,
  notFoundMessage,
  manualAutoComplete,
  search,
  getKey,
  getLabel,
  getCaption,
  onInput,
  onSelect,
  onManual,
  onLookupFailure,
}: CheckoutAddressComboboxProps<T>) {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<AddressSearchResult<T> | undefined>(undefined);
  const [pendingQuery, setPendingQuery] = useState<string | undefined>(undefined);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const listboxId = `${id}-listbox`;
  const current = searchKey(value);
  const searchable = mode === 'provider' && !disabled;

  useEffect(() => {
    const key = searchKey(query);

    if (!searchable || key.length < minQueryLength || key !== searchKey(value)) {
      return;
    }

    const controller = new AbortController();
    let timedOut = false;
    let timeout: number | undefined;
    const timer = window.setTimeout(() => {
      setPendingQuery(key);
      timeout = window.setTimeout(() => {
        timedOut = true;
        controller.abort();
      }, LOOKUP_TIMEOUT_MS);
      search(key, controller.signal)
        .then((options) => {
          window.clearTimeout(timeout);

          if (!controller.signal.aborted) {
            setResult({ query: key, options });
            setActiveIndex(-1);
          }
        })
        .catch(() => {
          window.clearTimeout(timeout);

          if (timedOut || !controller.signal.aborted) {
            onLookupFailure();
          }
        });
    }, SEARCH_DEBOUNCE_MS);

    return () => {
      window.clearTimeout(timer);
      window.clearTimeout(timeout);
      controller.abort();
    };
  }, [minQueryLength, onLookupFailure, query, search, searchable, value]);

  if (mode === 'manual') {
    return (
      <div className="checkout-address">
        <TextField
          autoComplete={manualAutoComplete}
          error={error}
          hint={hint}
          id={id}
          label={label}
          maxLength={maxLength}
          onChange={(event) => {
            onInput(event.currentTarget.value);
          }}
          required
          value={value}
        />
      </div>
    );
  }

  const eligible = searchable && !selected && current.length >= minQueryLength;
  const options =
    eligible && result !== undefined && result.query === current ? result.options : undefined;
  const loading = eligible && options === undefined && pendingQuery === current;
  const popupOpen = open && (loading || options !== undefined);
  const optionCount = options === undefined ? 0 : options.length + 1;
  const manualIndex = options === undefined ? -1 : options.length;
  const optionId = (index: number): string => `${id}-option-${String(index)}`;

  const close = (): void => {
    setOpen(false);
    setActiveIndex(-1);
  };

  const choose = (index: number): void => {
    if (options === undefined) {
      return;
    }

    const option = options[index];

    if (option !== undefined) {
      onSelect(option);
    } else if (index === manualIndex) {
      onManual();
    }

    close();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>): void => {
    if (event.key === 'ArrowDown' && optionCount > 0) {
      event.preventDefault();
      setActiveIndex((index) => (popupOpen ? Math.min(index + 1, optionCount - 1) : 0));
      setOpen(true);

      return;
    }

    if (event.key === 'ArrowUp' && popupOpen && optionCount > 0) {
      event.preventDefault();
      setActiveIndex((index) => Math.max(index - 1, 0));

      return;
    }

    if (event.key === 'Enter' && popupOpen && activeIndex >= 0) {
      event.preventDefault();
      choose(activeIndex);

      return;
    }

    if (event.key === 'Escape' && popupOpen) {
      event.preventDefault();
      close();
    }
  };

  const status = (() => {
    if (!popupOpen) {
      return '';
    }

    if (loading) {
      return LOADING_MESSAGE;
    }

    return options === undefined || options.length === 0
      ? `${notFoundMessage} Можно указать вручную.`
      : `Найдено вариантов: ${String(options.length)}`;
  })();

  return (
    <div className="checkout-address">
      <TextField
        aria-activedescendant={popupOpen && activeIndex >= 0 ? optionId(activeIndex) : undefined}
        aria-autocomplete="list"
        aria-controls={listboxId}
        aria-expanded={popupOpen}
        autoComplete="off"
        disabled={disabled}
        error={error}
        hint={hint}
        id={id}
        label={label}
        maxLength={maxLength}
        onBlur={close}
        onChange={(event) => {
          const next = event.currentTarget.value;

          onInput(next);
          setQuery(next);
          setOpen(true);
          setActiveIndex(-1);
        }}
        onFocus={() => {
          setOpen(true);
        }}
        onKeyDown={handleKeyDown}
        required
        role="combobox"
        value={value}
      />
      <div className="ui-floating-surface checkout-address__popup" hidden={!popupOpen}>
        {loading ? <p className="checkout-address__message">{LOADING_MESSAGE}</p> : null}
        {options !== undefined && options.length === 0 ? (
          <p className="checkout-address__message">{notFoundMessage}</p>
        ) : null}
        <ul
          aria-busy={loading}
          aria-label={label}
          className="checkout-address__listbox"
          id={listboxId}
          role="listbox"
        >
          {options?.map((option, index) => {
            const caption = getCaption?.(option) ?? '';

            return (
              <li
                aria-selected={index === activeIndex}
                className={
                  index === activeIndex
                    ? 'checkout-address__option checkout-address__option--active'
                    : 'checkout-address__option'
                }
                id={optionId(index)}
                key={getKey(option)}
                onMouseDown={(event) => {
                  event.preventDefault();
                  choose(index);
                }}
                role="option"
              >
                <span className="checkout-address__name">{getLabel(option)}</span>
                {caption === '' ? null : (
                  <span className="checkout-address__caption">{caption}</span>
                )}
              </li>
            );
          })}
          {options === undefined ? null : (
            <li
              aria-selected={manualIndex === activeIndex}
              className={
                manualIndex === activeIndex
                  ? 'checkout-address__option checkout-address__option--manual checkout-address__option--active'
                  : 'checkout-address__option checkout-address__option--manual'
              }
              id={optionId(manualIndex)}
              onMouseDown={(event) => {
                event.preventDefault();
                choose(manualIndex);
              }}
              role="option"
            >
              {MANUAL_OPTION_LABEL}
            </li>
          )}
        </ul>
      </div>
      <p className="ui-visually-hidden" role="status">
        {status}
      </p>
    </div>
  );
}
