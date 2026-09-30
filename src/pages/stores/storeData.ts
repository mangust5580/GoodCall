export interface StorePoint {
  readonly id: string;
  readonly name: string;
  readonly city: string;
  readonly address: string;
  readonly hours: string;
  readonly metro?: string;
}

const DEMO_STORE_HOURS = 'Ежедневно 10:00 – 22:00';

export const DEMO_STORES: readonly StorePoint[] = [
  {
    id: 'moscow-aviapark',
    name: 'ТЦ «Авиапарк»',
    city: 'Москва',
    address: 'Ходынский бульвар, 4',
    hours: DEMO_STORE_HOURS,
    metro: 'ЦСКА',
  },
  {
    id: 'moscow-evropeisky',
    name: 'ТЦ «Европейский»',
    city: 'Москва',
    address: 'пл. Киевского вокзала, 2',
    hours: DEMO_STORE_HOURS,
    metro: 'Киевская',
  },
  {
    id: 'moscow-metropolis',
    name: 'ТЦ «Метрополис»',
    city: 'Москва',
    address: 'Ленинградское ш., 16А, стр. 4',
    hours: DEMO_STORE_HOURS,
    metro: 'Войковская',
  },
  {
    id: 'moscow-rio-dmitrovka',
    name: 'ТЦ «РИО Дмитровка»',
    city: 'Москва',
    address: 'ул. Дмитровка, 163А',
    hours: DEMO_STORE_HOURS,
    metro: 'Алтуфьево',
  },
  {
    id: 'moscow-columbus',
    name: 'ТЦ «Колумбус»',
    city: 'Москва',
    address: 'Кировоградская ул., 13А',
    hours: DEMO_STORE_HOURS,
    metro: 'Пражская',
  },
  {
    id: 'moscow-megapolis',
    name: 'ТЦ «Мегаполис»',
    city: 'Москва',
    address: 'Андропова проспект, 8',
    hours: DEMO_STORE_HOURS,
    metro: 'Технопарк',
  },
];
