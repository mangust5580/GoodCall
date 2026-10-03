import type { StorePoint } from '../../commerce/shops';
import { Container } from '../../components/layout';
import { Icon } from '../../components/ui';

export interface StoresPageProps {
  readonly homeHref: string;
  readonly stores: readonly StorePoint[];
}

const countFormatter = new Intl.NumberFormat('ru-RU');
const pluralRules = new Intl.PluralRules('ru-RU');

const STORE_WORDS: Readonly<Record<Intl.LDMLPluralRule, string>> = {
  zero: 'магазинов',
  one: 'магазин',
  two: 'магазина',
  few: 'магазина',
  many: 'магазинов',
  other: 'магазина',
};

function formatStoreCount(value: number): string {
  const verb = pluralRules.select(value) === 'one' ? 'Найден' : 'Найдено';

  return `${verb} ${countFormatter.format(value)} ${STORE_WORDS[pluralRules.select(value)]}`;
}

function storeTitleId(store: StorePoint): string {
  return `store-${store.id}-title`;
}

export function StoresPage({ homeHref, stores }: StoresPageProps) {
  const cities = [...new Set(stores.map((store) => store.city))];
  const singleCity = cities.length === 1 ? cities[0] : undefined;

  return (
    <main className="stores-page">
      <Container>
        <nav aria-label="Хлебные крошки" className="stores-page__breadcrumbs">
          <ol className="stores-page__crumbs">
            <li className="stores-page__crumb">
              <a className="stores-page__crumb-link" href={homeHref}>
                Главная
              </a>
            </li>
            <li aria-current="page" className="stores-page__crumb">
              Магазины
            </li>
          </ol>
        </nav>

        <header className="stores-page__heading">
          <h1 className="stores-page__title">Магазины</h1>
          <p className="stores-page__lead">
            Список фирменных магазинов GoodCall. Приходите, чтобы увидеть и протестировать технику
            вживую.
          </p>
        </header>

        <div className="stores-page__meta">
          {singleCity === undefined ? null : (
            <p className="stores-page__city">
              <Icon className="stores-page__city-icon" name="map-pin" />
              <span>
                <span className="ui-visually-hidden">Город: </span>
                {singleCity}
              </span>
            </p>
          )}
          <p className="stores-page__count">{formatStoreCount(stores.length)}</p>
        </div>

        <ul
          aria-label={singleCity === undefined ? 'Магазины' : `Магазины в городе ${singleCity}`}
          className="stores-list"
        >
          {stores.map((store) => (
            <li className="stores-list__item" key={store.id}>
              <article aria-labelledby={storeTitleId(store)} className="store-card">
                <span className="store-card__visual">
                  <Icon className="store-card__visual-icon" name="store" />
                </span>
                <div className="store-card__body">
                  <h2 className="store-card__title" id={storeTitleId(store)}>
                    {store.name}
                  </h2>
                  <ul className="store-card__rows">
                    <li className="store-card__row">
                      <Icon className="store-card__icon" name="map-pin" />
                      <span>
                        <span className="ui-visually-hidden">Адрес: </span>
                        {store.address}
                      </span>
                    </li>
                    {store.metro === undefined ? null : (
                      <li className="store-card__row">
                        <span aria-hidden="true" className="store-card__metro-mark">
                          М
                        </span>
                        <span>
                          <span className="ui-visually-hidden">Метро: </span>
                          {store.metro}
                        </span>
                      </li>
                    )}
                    <li className="store-card__row">
                      <Icon className="store-card__icon" name="clock" />
                      <span>
                        <span className="ui-visually-hidden">Часы работы: </span>
                        {store.hours}
                      </span>
                    </li>
                  </ul>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </Container>
    </main>
  );
}
