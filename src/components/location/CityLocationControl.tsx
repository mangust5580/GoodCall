import { Popover } from 'radix-ui';
import { useEffect, useMemo, useRef, useState } from 'react';

import { Button, Icon } from '../ui';
import { CityPickerDialog } from './CityPickerDialog';
import { readStoredCity, writeStoredCity } from './cityStorage';
import { createDaDataCityClient, isAbortError, isCityLookupConfigured } from './dadataCityClient';
import type { CityLookupClient, CityOption } from './types';

const FALLBACK_LABEL = 'Выберите город';

export interface CityLocationControlProps {
  readonly client?: CityLookupClient;
  readonly configured?: boolean;
}

export function CityLocationControl({ client, configured }: CityLocationControlProps) {
  const lookup = useMemo(() => client ?? createDaDataCityClient(), [client]);
  const lookupConfigured = configured ?? (client !== undefined || isCityLookupConfigured());
  const [city, setCity] = useState<CityOption | null>(() => readStoredCity());
  const [candidate, setCandidate] = useState<CityOption | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (city !== null || !lookupConfigured) {
      return;
    }

    const controller = new AbortController();

    lookup
      .detectCityByIp(controller.signal)
      .then((detected) => {
        if (!controller.signal.aborted && detected !== null) {
          setCandidate(detected);
        }
      })
      .catch((error: unknown) => {
        if (!controller.signal.aborted && !isAbortError(error)) {
          setCandidate(null);
        }
      });

    return () => {
      controller.abort();
    };
  }, [city, lookupConfigured, lookup]);

  const selectCity = (selected: CityOption): void => {
    writeStoredCity(selected);
    setCity(selected);
    setCandidate(null);
    setPickerOpen(false);
  };

  const label = city?.name ?? candidate?.name ?? FALLBACK_LABEL;
  const accessibleName =
    city === null && candidate === null
      ? FALLBACK_LABEL
      : `Ваш город: ${label}. Выбрать другой город`;
  const confirmationOpen = city === null && candidate !== null && !pickerOpen;

  return (
    <>
      <Popover.Root
        onOpenChange={(next) => {
          if (!next) {
            setCandidate(null);
          }
        }}
        open={confirmationOpen}
      >
        <Popover.Anchor asChild>
          <button
            aria-label={accessibleName}
            className="city-location__trigger"
            onClick={() => {
              setPickerOpen(true);
            }}
            ref={triggerRef}
            type="button"
          >
            <Icon name="map-pin" />
            <span className="city-location__label">{label}</span>
          </button>
        </Popover.Anchor>

        {candidate === null ? null : (
          <Popover.Content
            align="start"
            className="ui-floating-surface city-confirmation"
            collisionPadding={16}
            onFocusOutside={(event) => {
              if (event.detail.originalEvent.target === triggerRef.current) {
                event.preventDefault();
              }
            }}
            onOpenAutoFocus={(event) => {
              event.preventDefault();
            }}
            sideOffset={8}
          >
            <p className="city-confirmation__question">{`Ваш город — ${candidate.name}?`}</p>
            <div className="city-confirmation__actions">
              <Button
                onClick={() => {
                  selectCity(candidate);
                }}
                variant="primary"
              >
                Да
              </Button>
              <Button
                onClick={() => {
                  setCandidate(null);
                  setPickerOpen(true);
                }}
                variant="secondary"
              >
                Выбрать другой
              </Button>
            </div>
          </Popover.Content>
        )}
      </Popover.Root>

      <CityPickerDialog
        client={lookup}
        configured={lookupConfigured}
        onOpenChange={setPickerOpen}
        onSelect={selectCity}
        open={pickerOpen}
        returnFocusRef={triggerRef}
      />
    </>
  );
}
