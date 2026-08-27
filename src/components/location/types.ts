export interface CityOption {
  readonly fiasId: string;
  readonly name: string;
  readonly region: string;
}

export interface CityLookupClient {
  detectCityByIp(signal?: AbortSignal): Promise<CityOption | null>;
  searchCities(query: string, signal?: AbortSignal): Promise<readonly CityOption[]>;
  geolocateCity(
    latitude: number,
    longitude: number,
    signal?: AbortSignal,
  ): Promise<CityOption | null>;
}
