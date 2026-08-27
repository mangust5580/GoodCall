import { Dialog } from 'radix-ui';
import { useEffect, useRef, useState } from 'react';
import type { RefObject } from 'react';

import { Button, Icon, SearchField } from '../ui';
import { isAbortError } from './dadataCityClient';
import type { CityLookupClient, CityOption } from './types';

const POPULAR_CITY_NAMES: readonly string[] = [
  'Москва',
  'Санкт-Петербург',
  'Казань',
  'Екатеринбург',
  'Новосибирск',
  'Нижний Новгород',
];

const MIN_QUERY_LENGTH = 2;
const SEARCH_DEBOUNCE_MS = 280;
const FEDERAL_CITY_PREFIX = 'г ';

const LOOKUP_UNAVAILABLE_MESSAGE = 'Поиск города временно недоступен';
const GEOLOCATION_FAILURE_MESSAGE = 'Не удалось определить город. Найдите его вручную.';

const GEOLOCATION_OPTIONS: PositionOptions = {
  enableHighAccuracy: false,
  timeout: 8000,
  maximumAge: 300000,
};

type SearchState =
  | { readonly kind: 'idle' }
  | { readonly kind: 'loading' }
  | { readonly kind: 'results'; readonly cities: readonly CityOption[] }
  | { readonly kind: 'error'; readonly message: string };

const IDLE_STATE: SearchState = { kind: 'idle' };
const LOADING_STATE: SearchState = { kind: 'loading' };
const UNAVAILABLE_STATE: SearchState = { kind: 'error', message: LOOKUP_UNAVAILABLE_MESSAGE };

interface SearchSnapshot {
  readonly query: string;
  readonly state: SearchState;
}

const EMPTY_SNAPSHOT: SearchSnapshot = { query: '', state: IDLE_STATE };

interface CityPickerContentProps {
  readonly client: CityLookupClient;
  readonly configured: boolean;
  readonly onSelect: (city: CityOption) => void;
}

interface CityPickerDialogProps extends CityPickerContentProps {
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly returnFocusRef: RefObject<HTMLButtonElement | null>;
}

function regionCaption(city: CityOption): string {
  const region = city.region.trim();

  if (
    region.startsWith(FEDERAL_CITY_PREFIX) &&
    region.slice(FEDERAL_CITY_PREFIX.length).trim() === city.name.trim()
  ) {
    return '';
  }

  return region;
}

function matchPopularCity(cities: readonly CityOption[], name: string): CityOption | null {
  const wanted = name.toLowerCase();

  return cities.find((city) => city.name.toLowerCase() === wanted) ?? cities[0] ?? null;
}

function searchStatusMessage(search: SearchState): string {
  if (search.kind === 'loading') {
    return 'Идёт поиск городов';
  }

  if (search.kind === 'error') {
    return search.message;
  }

  if (search.kind === 'results' && search.cities.length === 0) {
    return 'Город не найден. Проверьте написание.';
  }

  return '';
}

function CityPickerContent({ client, configured, onSelect }: CityPickerContentProps) {
  const [query, setQuery] = useState('');
  const [snapshot, setSnapshot] = useState<SearchSnapshot>(EMPTY_SNAPSHOT);
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState(false);
  const actionControllerRef = useRef<AbortController | null>(null);
  const popularCacheRef = useRef(new Map<string, CityOption>());

  useEffect(
    () => () => {
      actionControllerRef.current?.abort();
    },
    [],
  );

  useEffect(() => {
    const trimmed = query.trim();

    if (trimmed.length < MIN_QUERY_LENGTH || !configured) {
      return;
    }

    const controller = new AbortController();
    const timer = window.setTimeout(() => {
      client
        .searchCities(trimmed, controller.signal)
        .then((cities) => {
          if (!controller.signal.aborted) {
            setSnapshot({ query: trimmed, state: { kind: 'results', cities } });
          }
        })
        .catch((error: unknown) => {
          if (!controller.signal.aborted && !isAbortError(error)) {
            setSnapshot({ query: trimmed, state: UNAVAILABLE_STATE });
          }
        });
    }, SEARCH_DEBOUNCE_MS);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [query, configured, client]);

  const startAction = (): AbortSignal => {
    actionControllerRef.current?.abort();

    const controller = new AbortController();

    actionControllerRef.current = controller;
    setNotice('');
    setBusy(true);

    return controller.signal;
  };

  const finishAction = (signal: AbortSignal, message: string): void => {
    if (signal.aborted) {
      return;
    }

    setBusy(false);

    if (message !== '') {
      setNotice(message);
    }
  };

  const handlePopularCity = (name: string): void => {
    const cached = popularCacheRef.current.get(name);

    if (cached !== undefined) {
      onSelect(cached);

      return;
    }

    if (!configured) {
      setNotice(LOOKUP_UNAVAILABLE_MESSAGE);

      return;
    }

    const signal = startAction();

    client
      .searchCities(name, signal)
      .then((cities) => {
        if (signal.aborted) {
          return;
        }

        const city = matchPopularCity(cities, name);

        if (city === null) {
          finishAction(signal, LOOKUP_UNAVAILABLE_MESSAGE);

          return;
        }

        popularCacheRef.current.set(name, city);
        finishAction(signal, '');
        onSelect(city);
      })
      .catch((error: unknown) => {
        if (!isAbortError(error)) {
          finishAction(signal, LOOKUP_UNAVAILABLE_MESSAGE);
        }
      });
  };

  const handleAutoDetect = (): void => {
    if (!configured) {
      setNotice(LOOKUP_UNAVAILABLE_MESSAGE);

      return;
    }

    if (!('geolocation' in navigator)) {
      setNotice(GEOLOCATION_FAILURE_MESSAGE);

      return;
    }

    const signal = startAction();

    navigator.geolocation.getCurrentPosition(
      (position) => {
        if (signal.aborted) {
          return;
        }

        client
          .geolocateCity(position.coords.latitude, position.coords.longitude, signal)
          .then((city) => {
            if (signal.aborted) {
              return;
            }

            if (city === null) {
              finishAction(signal, GEOLOCATION_FAILURE_MESSAGE);

              return;
            }

            finishAction(signal, '');
            onSelect(city);
          })
          .catch((error: unknown) => {
            if (!isAbortError(error)) {
              finishAction(signal, GEOLOCATION_FAILURE_MESSAGE);
            }
          });
      },
      () => {
        finishAction(signal, GEOLOCATION_FAILURE_MESSAGE);
      },
      GEOLOCATION_OPTIONS,
    );
  };

  const trimmedQuery = query.trim();
  const search: SearchState =
    trimmedQuery.length < MIN_QUERY_LENGTH
      ? IDLE_STATE
      : !configured
        ? UNAVAILABLE_STATE
        : snapshot.query === trimmedQuery
          ? snapshot.state
          : LOADING_STATE;
  const statusMessage = searchStatusMessage(search);

  return (
    <>
      <div className="city-picker__header">
        <Dialog.Title className="city-picker__title">Выберите город</Dialog.Title>
        <Dialog.Close aria-label="Закрыть" className="city-picker__close">
          <Icon name="close" />
        </Dialog.Close>
      </div>

      <Button
        className="city-picker__detect"
        disabled={busy}
        onClick={handleAutoDetect}
        variant="secondary"
      >
        <Icon name="map-pin" />
        Определить автоматически
      </Button>

      {notice === '' ? null : <p className="city-picker__notice">{notice}</p>}

      <SearchField
        label="Поиск города"
        labelVisuallyHidden
        onValueChange={setQuery}
        placeholder="Поиск города"
        value={query}
      />

      <div className="city-picker__results">
        <p aria-live="polite" className="city-picker__status" role="status">
          {statusMessage}
        </p>

        {search.kind === 'results' && search.cities.length > 0 ? (
          <ul className="city-picker__list">
            {search.cities.map((city) => (
              <li key={city.fiasId}>
                <button
                  className="city-picker__option"
                  onClick={() => {
                    onSelect(city);
                  }}
                  type="button"
                >
                  <span className="city-picker__option-name">{city.name}</span>
                  {regionCaption(city) === '' ? null : (
                    <span className="city-picker__option-region">{regionCaption(city)}</span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        ) : null}

        {search.kind === 'idle' ? (
          <div className="city-picker__popular">
            <h3 className="city-picker__subtitle">Популярные города</h3>
            <ul className="city-picker__list">
              {POPULAR_CITY_NAMES.map((name) => (
                <li key={name}>
                  <button
                    className="city-picker__option"
                    disabled={busy}
                    onClick={() => {
                      handlePopularCity(name);
                    }}
                    type="button"
                  >
                    <span className="city-picker__option-name">{name}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </>
  );
}

export function CityPickerDialog({
  open,
  onOpenChange,
  client,
  configured,
  onSelect,
  returnFocusRef,
}: CityPickerDialogProps) {
  return (
    <Dialog.Root onOpenChange={onOpenChange} open={open}>
      <Dialog.Portal>
        <Dialog.Overlay className="city-picker__overlay" />
        <Dialog.Content
          aria-describedby={undefined}
          className="city-picker"
          onCloseAutoFocus={(event) => {
            const trigger = returnFocusRef.current;

            if (trigger !== null) {
              event.preventDefault();
              trigger.focus();
            }
          }}
        >
          <CityPickerContent client={client} configured={configured} onSelect={onSelect} />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
