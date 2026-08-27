import type { CityLookupClient, CityOption } from './types';

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
