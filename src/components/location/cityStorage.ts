import type { CityOption } from './types';

export const CITY_STORAGE_KEY = 'goodcall.city.v1';

function readRaw(): string | null {
  try {
    return window.localStorage.getItem(CITY_STORAGE_KEY);
  } catch {
    return null;
  }
}

function writeRaw(value: string): void {
  try {
    window.localStorage.setItem(CITY_STORAGE_KEY, value);
  } catch {
    return;
  }
}

function removeRaw(): void {
  try {
    window.localStorage.removeItem(CITY_STORAGE_KEY);
  } catch {
    return;
  }
}

function toStoredCity(value: unknown): CityOption | null {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return null;
  }

  const { fiasId, name, region } = value as Record<string, unknown>;

  if (
    typeof fiasId !== 'string' ||
    typeof name !== 'string' ||
    typeof region !== 'string' ||
    fiasId.trim() === '' ||
    name.trim() === '' ||
    region.trim() === ''
  ) {
    return null;
  }

  return { fiasId, name, region };
}

export function readStoredCity(): CityOption | null {
  const raw = readRaw();

  if (raw === null) {
    return null;
  }

  let parsed: unknown;

  try {
    parsed = JSON.parse(raw) as unknown;
  } catch {
    removeRaw();

    return null;
  }

  const city = toStoredCity(parsed);

  if (city === null) {
    removeRaw();

    return null;
  }

  return city;
}

export function writeStoredCity(city: CityOption): void {
  writeRaw(JSON.stringify(city));
}

export function clearStoredCity(): void {
  removeRaw();
}
