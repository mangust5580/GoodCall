import { STOREFRONT_SUPPORT } from '../../commerce/storefront';
import contactsStoreInterior from '../../assets/media/contacts/contacts-store-interior.webp';
import { DEMO_STORES } from '../../commerce/shops';
import { Container } from '../../components/layout';
import { FallbackImage } from '../../components/media';
import { Icon } from '../../components/ui';
import type { IconName } from '../../components/ui';
import type { InfoLinks } from './infoLinks';
import { InfoPageHeader } from './InfoPageHeader';

const FEATURED_STORE_COUNT = 3;

const storePluralRules = new Intl.PluralRules('ru-RU');

const STORE_WORDS: Readonly<Record<Intl.LDMLPluralRule, string>> = {
  zero: 'магазинов',
  one: 'магазин',
  two: 'магазина',
  few: 'магазина',
  many: 'магазинов',
  other: 'магазина',
};

const STORE_COUNT = `${String(DEMO_STORES.length)} ${STORE_WORDS[storePluralRules.select(DEMO_STORES.length)]} GoodCall`;
const STORE_CITIES = [...new Set(DEMO_STORES.map((store) => store.city))].join(', ');

interface ContactChannel {
  readonly icon: IconName;
  readonly label: string;
  readonly value: string;
  readonly href?: string;
  readonly note: string;
}

interface ContactsPageProps {
  readonly links: InfoLinks;
}

export function ContactsPage({ links }: ContactsPageProps) {
  const channels: readonly ContactChannel[] = [
    {
      icon: 'phone',
      label: 'Телефон',
      value: STOREFRONT_SUPPORT.phone,
      href: STOREFRONT_SUPPORT.phoneHref,
      note: 'Звонок по России бесплатный',
    },
    {
      icon: 'mail',
      label: 'E-mail',
      value: STOREFRONT_SUPPORT.email,
      href: STOREFRONT_SUPPORT.emailHref,
      note: 'Вопросы по заказам, доставке и гарантии',
    },
    {
      icon: 'clock',
      label: 'Часы работы поддержки',
      value: STOREFRONT_SUPPORT.hours,
      note: 'Отвечаем по телефону и e-mail',
    },
    {
      icon: 'store',
      label: 'Магазины',
      value: STORE_COUNT,
      href: links.shops,
      note: `Демо-точки самовывоза · ${STORE_CITIES}`,
    },
  ];
  const featuredStores = DEMO_STORES.slice(0, FEATURED_STORE_COUNT);

  return (
    <main className="info-page contacts-page">
      <Container>
        <InfoPageHeader
          crumb="Контакты"
          homeHref={links.home}
          lead="Служба поддержки GoodCall поможет с выбором техники, заказом, доставкой и гарантией. Свяжитесь с нами по телефону или e-mail."
          title="Контакты"
        />

        <section aria-labelledby="contacts-channels-title" className="contacts-card">
          <div className="contacts-card__visual">
            <img alt="" className="contacts-card__image" src={contactsStoreInterior} />
          </div>
          <div className="contacts-card__body">
            <h2 className="contacts-card__title" id="contacts-channels-title">
              Как с нами связаться
            </h2>
            <ul className="contacts-channels">
              {channels.map((channel) => (
                <li className="contacts-channels__item" key={channel.label}>
                  <span className="contacts-channels__glyph">
                    <Icon name={channel.icon} />
                  </span>
                  <span className="contacts-channels__body">
                    <span className="contacts-channels__label">{channel.label}</span>
                    {channel.href === undefined ? (
                      <span className="contacts-channels__value">{channel.value}</span>
                    ) : (
                      <a className="contacts-channels__value" href={channel.href}>
                        {channel.value}
                      </a>
                    )}
                    <span className="contacts-channels__note">{channel.note}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section aria-labelledby="contacts-stores-title" className="contacts-stores">
          <div className="contacts-stores__head">
            <div className="contacts-stores__intro">
              <h2 className="contacts-stores__title" id="contacts-stores-title">
                Наши магазины
              </h2>
              <p className="contacts-stores__lead">
                Здесь показаны вымышленные магазины GoodCall для демонстрации самовывоза при
                оформлении заказа. Реально посетить эти магазины или получить в них заказ нельзя.
                Адреса и часы работы приведены для примера.
              </p>
            </div>
            <a
              className="ui-button ui-button--secondary contacts-stores__action"
              href={links.shops}
            >
              Все магазины
            </a>
          </div>
          <ul aria-label="Магазины GoodCall" className="contacts-stores__list">
            {featuredStores.map((store) => (
              <li className="contacts-stores__item" key={store.id}>
                <article aria-labelledby={`contacts-store-${store.id}`} className="contacts-store">
                  <span className="contacts-store__visual">
                    <FallbackImage
                      className="contacts-store__image"
                      fallback={<Icon name="store" />}
                      image={store.thumbnail}
                    />
                  </span>
                  <div className="contacts-store__body">
                    <h3 className="contacts-store__title" id={`contacts-store-${store.id}`}>
                      {store.name}
                    </h3>
                    <p className="contacts-store__row">
                      <Icon className="contacts-store__icon" name="map-pin" />
                      <span>
                        {store.city}, {store.address}
                        {store.metro === undefined ? null : `, м. ${store.metro}`}
                      </span>
                    </p>
                    <p className="contacts-store__row">
                      <Icon className="contacts-store__icon" name="clock" />
                      <span>{store.hours}</span>
                    </p>
                  </div>
                </article>
              </li>
            ))}
          </ul>
        </section>
      </Container>
    </main>
  );
}
