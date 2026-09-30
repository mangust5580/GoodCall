import type {
  AddressLookupClient,
  CityLookupClient,
  CityOption,
  HouseOption,
  StreetOption,
} from './types';

const SUGGESTIONS_ROOT = 'https://suggestions.dadata.ru/suggestions/api/4_1/rs';
const IPLOCATE_URL = `${SUGGESTIONS_ROOT}/iplocate/address`;
const SUGGEST_URL = `${SUGGESTIONS_ROOT}/suggest/address`;
const GEOLOCATE_URL = `${SUGGESTIONS_ROOT}/geolocate/address`;

const RESULT_LIMIT = 10;
const RUSSIA_ISO_CODE = 'RU';
const FEDERAL_CITY_REGION_TYPE = 'г';

function asRecord(value: unknown): Record<string, unknown> | null {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return null;
  }

  return value as Record<string, unknown>;
}

function asText(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

function readToken(): string {
  const token = import.meta.env.VITE_DADATA_TOKEN;

  return typeof token === 'string' ? token.trim() : '';
}

export function isCityLookupConfigured(): boolean {
  return readToken().length > 0;
}

export function isAbortError(error: unknown): boolean {
  return error instanceof DOMException && error.name === 'AbortError';
}

function toCityOption(value: unknown): CityOption | null {
  const data = asRecord(value);

  if (data === null || asText(data.country_iso_code) !== RUSSIA_ISO_CODE) {
    return null;
  }

  const regionLabel = asText(data.region_with_type) || asText(data.region);

  if (regionLabel === '') {
    return null;
  }

  const city = asText(data.city);
  const cityFiasId = asText(data.city_fias_id);

  if (city !== '' && cityFiasId !== '') {
    return { fiasId: cityFiasId, name: city, region: regionLabel };
  }

  const region = asText(data.region);
  const regionFiasId = asText(data.region_fias_id);

  if (
    asText(data.region_type) === FEDERAL_CITY_REGION_TYPE &&
    region !== '' &&
    regionFiasId !== ''
  ) {
    return { fiasId: regionFiasId, name: region, region: regionLabel };
  }

  return null;
}

function isCityGranularity(value: unknown): boolean {
  const data = asRecord(value);

  if (data === null) {
    return false;
  }

  return asText(data.street) === '' && asText(data.house) === '' && asText(data.settlement) === '';
}

function toCityOptions(payload: unknown, cityGranularityOnly: boolean): readonly CityOption[] {
  const body = asRecord(payload);

  if (body === null || !Array.isArray(body.suggestions)) {
    return [];
  }

  const suggestions = body.suggestions as readonly unknown[];
  const seen = new Set<string>();
  const cities: CityOption[] = [];

  for (const suggestion of suggestions) {
    const entry = asRecord(suggestion);

    if (entry === null || (cityGranularityOnly && !isCityGranularity(entry.data))) {
      continue;
    }

    const city = toCityOption(entry.data);

    if (city === null || seen.has(city.fiasId)) {
      continue;
    }

    seen.add(city.fiasId);
    cities.push(city);
  }

  return cities;
}

async function requestJson(
  url: string,
  init: RequestInit,
  signal: AbortSignal | undefined,
): Promise<unknown> {
  const token = readToken();

  if (token === '') {
    throw new Error('City lookup is not configured');
  }

  const headers: Record<string, string> = {
    Accept: 'application/json',
    Authorization: `Token ${token}`,
  };

  if (init.body !== undefined) {
    headers['Content-Type'] = 'application/json';
  }

  const response = await fetch(url, { ...init, headers, signal });

  if (!response.ok) {
    throw new Error('City lookup request failed');
  }

  return (await response.json()) as unknown;
}

export function createDaDataCityClient(): CityLookupClient {
  return {
    async detectCityByIp(signal) {
      const payload = await requestJson(IPLOCATE_URL, { method: 'GET' }, signal);
      const body = asRecord(payload);
      const location = body === null ? null : asRecord(body.location);

      return location === null ? null : toCityOption(location.data);
    },

    async searchCities(query, signal) {
      const payload = await requestJson(
        SUGGEST_URL,
        {
          method: 'POST',
          body: JSON.stringify({
            query,
            count: RESULT_LIMIT,
            from_bound: { value: 'city' },
            to_bound: { value: 'city' },
          }),
        },
        signal,
      );

      return toCityOptions(payload, true);
    },

    async geolocateCity(latitude, longitude, signal) {
      const payload = await requestJson(
        GEOLOCATE_URL,
        {
          method: 'POST',
          body: JSON.stringify({ lat: latitude, lon: longitude, count: RESULT_LIMIT }),
        },
        signal,
      );

      return toCityOptions(payload, false)[0] ?? null;
    },
  };
}

const FEDERAL_CITY_PREFIX = 'г ';

function isFederalCity(city: CityOption): boolean {
  return city.region.trim() === `${FEDERAL_CITY_PREFIX}${city.name.trim()}`;
}

function cityRestriction(city: CityOption): Record<string, string> {
  return isFederalCity(city) ? { region_fias_id: city.fiasId } : { city_fias_id: city.fiasId };
}

function suggestionData(payload: unknown): readonly Record<string, unknown>[] {
  const body = asRecord(payload);

  if (body === null || !Array.isArray(body.suggestions)) {
    throw new Error('Address lookup response is malformed');
  }

  return (body.suggestions as readonly unknown[])
    .map((suggestion) => asRecord(asRecord(suggestion)?.data))
    .filter((data): data is Record<string, unknown> => data !== null);
}

function uniqueByFiasId<T extends { readonly fiasId: string }>(
  options: readonly T[],
): readonly T[] {
  const seen = new Set<string>();

  return options.filter((option) => {
    if (seen.has(option.fiasId)) {
      return false;
    }

    seen.add(option.fiasId);

    return true;
  });
}

function toStreetOption(data: Record<string, unknown>): StreetOption | null {
  const fiasId = asText(data.street_fias_id);
  const label = asText(data.street_with_type);

  if (fiasId === '' || label === '' || asText(data.house) !== '') {
    return null;
  }

  return { fiasId, label };
}

function toHouseOption(data: Record<string, unknown>): HouseOption | null {
  const fiasId = asText(data.house_fias_id);
  const house = asText(data.house);

  if (fiasId === '' || house === '') {
    return null;
  }

  const label = [
    asText(data.house_type),
    house,
    asText(data.block_type),
    asText(data.block),
    asText(data.building_type),
    asText(data.building),
  ]
    .filter((part) => part !== '')
    .join(' ');

  return { fiasId, label };
}

function suggestAddressBody(
  query: string,
  level: 'street' | 'house',
  location: Record<string, string>,
): string {
  return JSON.stringify({
    query,
    count: RESULT_LIMIT,
    from_bound: { value: level },
    to_bound: { value: level },
    locations: [location],
  });
}

export function createDaDataAddressClient(): AddressLookupClient {
  return {
    async searchStreets(city, query, signal) {
      const payload = await requestJson(
        SUGGEST_URL,
        { method: 'POST', body: suggestAddressBody(query, 'street', cityRestriction(city)) },
        signal,
      );

      return uniqueByFiasId(
        suggestionData(payload)
          .map(toStreetOption)
          .filter((option) => option !== null),
      );
    },

    async searchHouses(street, query, signal) {
      const payload = await requestJson(
        SUGGEST_URL,
        {
          method: 'POST',
          body: suggestAddressBody(query, 'house', { street_fias_id: street.fiasId }),
        },
        signal,
      );

      return uniqueByFiasId(
        suggestionData(payload)
          .map(toHouseOption)
          .filter((option) => option !== null),
      );
    },
  };
}
