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

export interface StreetOption {
  readonly fiasId: string;
  readonly label: string;
}

export interface HouseOption {
  readonly fiasId: string;
  readonly label: string;
}

export interface AddressLookupClient {
  searchStreets(
    city: CityOption,
    query: string,
    signal?: AbortSignal,
  ): Promise<readonly StreetOption[]>;
  searchHouses(
    street: StreetOption,
    query: string,
    signal?: AbortSignal,
  ): Promise<readonly HouseOption[]>;
}
