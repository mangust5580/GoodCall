import { useMemo, useState } from 'react';

import { Container } from '../components/layout';
import { CITY_STORAGE_KEY, clearStoredCity } from '../components/location';
import type { CityLookupClient, CityOption } from '../components/location';
import { MobileActionBar, SiteHeader } from '../components/shell';
import { Button } from '../components/ui';

import './LocationReference.scss';

const FAKE_CITIES: readonly CityOption[] = [
  { fiasId: '0c5b2444-70a0-4932-980c-b4dc0d3f02b5', name: 'Москва', region: 'г Москва' },
  {
    fiasId: 'c2deb16a-0330-4f05-821f-1d09c93331e6',
    name: 'Санкт-Петербург',
    region: 'г Санкт-Петербург',
  },
  { fiasId: '93b3df57-4c89-44df-ac42-96f05e9cd3b9', name: 'Казань', region: 'Респ Татарстан' },
  {
    fiasId: '2763c110-cb8b-416a-9dac-ad28a55b4402',
    name: 'Екатеринбург',
    region: 'Свердловская обл',
  },
  {
    fiasId: '8dea00e3-9aab-4d8e-887c-ef2aaa546456',
    name: 'Новосибирск',
    region: 'Новосибирская обл',
  },
  {
    fiasId: '555e7d61-d9a7-4ba6-9770-6caa8198c483',
    name: 'Нижний Новгород',
    region: 'Нижегородская обл',
  },
  {
    fiasId: 'deb1d05a-71a6-4c93-b1f1-b09ecbf9c8e7',
    name: 'Краснодар',
    region: 'Краснодарский край',
  },
  { fiasId: 'a8b0a45d-c4f5-4b0d-9ac9-e0f4e0a30f9c', name: 'Казанское', region: 'Тюменская обл' },
];

const DETECTED_BY_IP = FAKE_CITIES[0];
const DETECTED_BY_COORDINATES = FAKE_CITIES[2];
const FAKE_LATENCY_MS = 260;

function delay<T>(value: T, signal?: AbortSignal): Promise<T> {
  return new Promise((resolve, reject) => {
    if (signal?.aborted === true) {
      reject(new DOMException('Aborted', 'AbortError'));

      return;
    }

    const timer = window.setTimeout(() => {
      resolve(value);
    }, FAKE_LATENCY_MS);

    signal?.addEventListener('abort', () => {
      window.clearTimeout(timer);
      reject(new DOMException('Aborted', 'AbortError'));
    });
  });
}

function createFakeCityClient(failing: boolean): CityLookupClient {
  const guard = <T,>(value: T, signal?: AbortSignal): Promise<T> => {
    if (failing) {
      return Promise.reject(new Error('City lookup request failed'));
    }

    return delay(value, signal);
  };

  return {
    detectCityByIp(signal) {
      return guard<CityOption | null>(DETECTED_BY_IP, signal);
    },

    searchCities(query, signal) {
      const wanted = query.trim().toLowerCase();
      const cities = FAKE_CITIES.filter((city) => city.name.toLowerCase().startsWith(wanted));

      return guard<readonly CityOption[]>(cities, signal);
    },

    geolocateCity(_latitude, _longitude, signal) {
      return guard<CityOption | null>(DETECTED_BY_COORDINATES, signal);
    },
  };
}

export function LocationReference() {
  const base = import.meta.env.BASE_URL;
  const [failing, setFailing] = useState(false);
  const [configured, setConfigured] = useState(true);
  const [instance, setInstance] = useState(0);
  const client = useMemo(() => createFakeCityClient(failing), [failing]);

  const remountFirstVisit = () => {
    clearStoredCity();
    setInstance((current) => current + 1);
  };

  return (
    <div className="location-reference" key={instance}>
      <SiteHeader
        cartCount={2}
        cityLookupClient={client}
        cityLookupConfigured={configured}
        comparisonCount={3}
        favoritesCount={12}
      />

      <main className="location-reference__body">
        <Container className="location-reference__inner">
          <h1 className="location-reference__title">Location Foundation / CitySelector</h1>
          <p className="location-reference__note">
            Temporary development reference for the GoodCall city control. Everything above this
            block is the real production <code>SiteHeader</code>, and the city control in its purple
            utility row is the real production <code>CityLocationControl</code>. Only the lookup
            client is replaced: this page injects an in-memory fake, so the flow is deterministic
            and needs no DaData token or network access.
          </p>
          <p className="location-reference__note">
            The fake detects <strong>Москва</strong> by IP, searches a small in-memory city list,
            and resolves <strong>Казань</strong> for the explicit{' '}
            <code>Определить автоматически</code> action. Browser geolocation is still requested for
            real by that action and by nothing else; no geolocation or permission call happens on
            page load.
          </p>
          <p className="location-reference__note">
            Type <code>каз</code> to see two matches disambiguated by region, or <code>ека</code>{' '}
            for one. A query with no match shows the empty state. The controls below reset the
            persisted selection in <code>{CITY_STORAGE_KEY}</code> and remount the control in its
            first-visit state.
          </p>

          <div className="location-reference__controls">
            <Button onClick={remountFirstVisit} variant="primary">
              Сбросить город и повторить первый визит
            </Button>
            <Button
              onClick={() => {
                setFailing((current) => !current);
              }}
              variant="secondary"
            >
              {failing ? 'Включить ответы API' : 'Смоделировать сбой API'}
            </Button>
            <Button
              onClick={() => {
                setConfigured((current) => !current);
              }}
              variant="secondary"
            >
              {configured ? 'Смоделировать отсутствие токена' : 'Вернуть токен'}
            </Button>
          </div>

          <p aria-live="polite" className="location-reference__status">
            {`Клиент: ${failing ? 'ошибка API' : 'обычные ответы'}. Токен: ${
              configured ? 'настроен' : 'отсутствует'
            }.`}
          </p>

          <a className="location-reference__back" href={base}>
            Back to reference index
          </a>
        </Container>
      </main>

      <MobileActionBar cartCount={2} comparisonCount={3} favoritesCount={12} />
    </div>
  );
}
