import storeAviapark from '../../assets/media/contacts/store-moscow-aviapark.webp';
import storeColumbus from '../../assets/media/contacts/store-moscow-columbus.webp';
import storeEvropeisky from '../../assets/media/contacts/store-moscow-evropeisky.webp';
import storeMegapolis from '../../assets/media/contacts/store-moscow-megapolis.webp';
import storeMetropolis from '../../assets/media/contacts/store-moscow-metropolis.webp';
import storeRioDmitrovka from '../../assets/media/contacts/store-moscow-rio-dmitrovka.webp';

export interface StoreThumbnail {
  readonly src: string;
  readonly width: number;
  readonly height: number;
}

export interface StorePoint {
  readonly id: string;
  readonly name: string;
  readonly city: string;
  readonly address: string;
  readonly hours: string;
  readonly metro?: string;
  readonly thumbnail?: StoreThumbnail;
}

const DEMO_STORE_HOURS = 'Ежедневно 10:00 – 22:00';
const STORE_THUMBNAIL_SIZE = 512;

function storeThumbnail(src: string): StoreThumbnail {
  return { src, width: STORE_THUMBNAIL_SIZE, height: STORE_THUMBNAIL_SIZE };
}

export const DEMO_STORES: readonly StorePoint[] = [
  {
    id: 'moscow-aviapark',
    name: 'ТЦ «Авиапарк»',
    city: 'Москва',
    address: 'Ходынский бульвар, 4',
    hours: DEMO_STORE_HOURS,
    metro: 'ЦСКА',
    thumbnail: storeThumbnail(storeAviapark),
  },
  {
    id: 'moscow-evropeisky',
    name: 'ТЦ «Европейский»',
    city: 'Москва',
    address: 'пл. Киевского вокзала, 2',
    hours: DEMO_STORE_HOURS,
    metro: 'Киевская',
    thumbnail: storeThumbnail(storeEvropeisky),
  },
  {
    id: 'moscow-metropolis',
    name: 'ТЦ «Метрополис»',
    city: 'Москва',
    address: 'Ленинградское ш., 16А, стр. 4',
    hours: DEMO_STORE_HOURS,
    metro: 'Войковская',
    thumbnail: storeThumbnail(storeMetropolis),
  },
  {
    id: 'moscow-rio-dmitrovka',
    name: 'ТЦ «РИО Дмитровка»',
    city: 'Москва',
    address: 'ул. Дмитровка, 163А',
    hours: DEMO_STORE_HOURS,
    metro: 'Алтуфьево',
    thumbnail: storeThumbnail(storeRioDmitrovka),
  },
  {
    id: 'moscow-columbus',
    name: 'ТЦ «Колумбус»',
    city: 'Москва',
    address: 'Кировоградская ул., 13А',
    hours: DEMO_STORE_HOURS,
    metro: 'Пражская',
    thumbnail: storeThumbnail(storeColumbus),
  },
  {
    id: 'moscow-megapolis',
    name: 'ТЦ «Мегаполис»',
    city: 'Москва',
    address: 'Андропова проспект, 8',
    hours: DEMO_STORE_HOURS,
    metro: 'Технопарк',
    thumbnail: storeThumbnail(storeMegapolis),
  },
];

export function findStore(id: string | null): StorePoint | undefined {
  return id === null ? undefined : DEMO_STORES.find((store) => store.id === id);
}
