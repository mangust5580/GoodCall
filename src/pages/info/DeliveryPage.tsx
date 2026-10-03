import { useState } from 'react';

import { DEMO_STORES } from '../../commerce/shops';
import {
  STOREFRONT_DELIVERY_SLOTS,
  STOREFRONT_PAYMENT_METHODS,
  STOREFRONT_PAYMENT_OPTIONS,
  STOREFRONT_SUPPORT,
  WARRANTY_TERM_NOTE,
} from '../../commerce/storefront';
import type { StorefrontPaymentMethodId, StorefrontPaymentTiming } from '../../commerce/storefront';
import type { BenefitItem } from '../../components/content';
import { Container } from '../../components/layout';
import { Icon, Tabs, tabId, tabPanelId } from '../../components/ui';
import type { IconName, TabItem } from '../../components/ui';
import { InfoPageHeader } from './InfoPageHeader';
import {
  InfoCheckList,
  InfoFacts,
  InfoHighlights,
  InfoIllustration,
  InfoNotice,
  InfoSectionHeading,
} from './InfoParts';
import type { InfoFact } from './InfoParts';
import { InfoSupport } from './InfoSupport';
import type { InfoLinks } from './infoLinks';

type DeliveryMethodId = 'courier' | 'pickup';

const TABS_ID = 'delivery-methods';

const DELIVERY_TABS: readonly (TabItem & { readonly id: DeliveryMethodId })[] = [
  { id: 'courier', label: 'Курьером' },
  { id: 'pickup', label: 'Самовывоз' },
];

const HIGHLIGHTS: readonly BenefitItem[] = [
  { title: 'Курьер или самовывоз', note: 'Способ получения — при оформлении', icon: 'package' },
  { title: 'Оплата на выбор', note: 'Онлайн или при получении', icon: 'credit-card' },
  { title: 'Официальная гарантия', note: WARRANTY_TERM_NOTE, icon: 'shield' },
  { title: 'Поддержка', note: STOREFRONT_SUPPORT.hours, icon: 'headset' },
];

const SLOT_LABELS = STOREFRONT_DELIVERY_SLOTS.map((slot) => slot.label).join(' · ');

const COURIER_FACTS: readonly InfoFact[] = [
  {
    icon: 'calendar',
    title: 'Дата доставки',
    text: 'Любой из ближайших 7 дней, начиная с завтрашнего',
  },
  { icon: 'clock', title: 'Интервал', text: SLOT_LABELS },
  { icon: 'map-pin', title: 'До двери', text: 'По адресу, указанному при оформлении' },
  {
    icon: 'message',
    title: 'Комментарий курьеру',
    text: 'Подъезд, этаж или код домофона — по желанию',
  },
];

const COURIER_NEEDS: readonly { readonly icon: IconName; readonly text: string }[] = [
  { icon: 'person', text: 'Имя и телефон получателя' },
  { icon: 'map-pin', text: 'Город, улица и дом' },
  { icon: 'calendar', text: 'Дата и интервал доставки' },
  { icon: 'credit-card', text: 'Способ оплаты' },
];

const storePluralRules = new Intl.PluralRules('ru-RU');

const STORE_WORDS: Readonly<Record<Intl.LDMLPluralRule, string>> = {
  zero: 'магазинов',
  one: 'магазин',
  two: 'магазина',
  few: 'магазина',
  many: 'магазинов',
  other: 'магазина',
};

const STORE_COUNT = `${String(DEMO_STORES.length)} ${STORE_WORDS[storePluralRules.select(DEMO_STORES.length)]}`;
const STORE_CITIES = [...new Set(DEMO_STORES.map((store) => store.city))].join(', ');
const STORE_HOURS = [...new Set(DEMO_STORES.map((store) => store.hours))];

const PICKUP_FACTS: readonly InfoFact[] = [
  { icon: 'store', title: 'Магазины', text: `${STORE_COUNT} GoodCall: ${STORE_CITIES}` },
  {
    icon: 'clock',
    title: 'Часы работы',
    text: STORE_HOURS.length === 1 ? STORE_HOURS[0] : 'Указаны у каждого магазина',
  },
  { icon: 'map-pin', title: 'Выбор магазина', text: 'Из списка при оформлении заказа' },
  { icon: 'credit-card', title: 'Оплата', text: 'Онлайн или при получении в магазине' },
];

const TIMING_LABELS: Readonly<Record<StorefrontPaymentTiming, string>> = {
  online: 'Онлайн',
  'on-receipt': 'При получении',
};

function paymentOptions(method: StorefrontPaymentMethodId) {
  const options = STOREFRONT_PAYMENT_OPTIONS.filter((option) => option.method === method);

  return {
    timings: [...new Set(options.map((option) => option.timing))],
    labels: options.map((option) => `«${option.label}»`).join(', '),
  };
}

const SECURITY_POINTS: readonly string[] = [
  'Данные банковской карты не запрашиваются',
  'Деньги не списываются',
  'Контакты нужны только для оформления',
];

interface DeliveryPageProps {
  readonly links: InfoLinks;
}

export function DeliveryPage({ links }: DeliveryPageProps) {
  const [method, setMethod] = useState<DeliveryMethodId>('courier');

  return (
    <main className="info-page delivery-page">
      <Container>
        <InfoPageHeader
          homeHref={links.home}
          lead="Как получить заказ в GoodCall и какие способы оплаты доступны при оформлении."
          title="Доставка и оплата"
        />

        <InfoHighlights items={HIGHLIGHTS} label="Коротко о доставке и оплате" />

        <section aria-labelledby="delivery-title" className="info-section">
          <InfoSectionHeading
            id="delivery-title"
            lead="Два способа получения — выбираются на странице оформления заказа."
            title="Доставка"
          />

          <div className="info-tabs">
            <Tabs
              activeId={method}
              idBase={TABS_ID}
              items={DELIVERY_TABS}
              label="Способ получения"
              onChange={(id) => {
                setMethod(id === 'pickup' ? 'pickup' : 'courier');
              }}
            />
          </div>

          <div
            aria-labelledby={tabId(TABS_ID, 'courier')}
            className="info-panel delivery-method"
            hidden={method !== 'courier'}
            id={tabPanelId(TABS_ID, 'courier')}
            role="tabpanel"
            tabIndex={0}
          >
            <InfoIllustration icon="package" />
            <div className="delivery-method__body">
              <h3 className="info-panel__title">Доставка курьером</h3>
              <p className="info-panel__text">
                Курьер привезёт заказ по указанному адресу в выбранный день и интервал.
              </p>
              <InfoFacts items={COURIER_FACTS} label="Условия доставки курьером" />
            </div>
            <div className="delivery-method__aside">
              <h4 className="delivery-method__aside-title">Что понадобится при оформлении</h4>
              <ul className="delivery-method__needs">
                {COURIER_NEEDS.map((need) => (
                  <li className="delivery-method__need" key={need.text}>
                    <Icon className="delivery-method__need-icon" name={need.icon} />
                    <span>{need.text}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="delivery-method__notice">
              <InfoNotice>
                Стоимость доставки в демонстрационном магазине не начисляется: итог заказа при
                оформлении — сумма выбранных товаров.
              </InfoNotice>
            </div>
          </div>

          <div
            aria-labelledby={tabId(TABS_ID, 'pickup')}
            className="info-panel delivery-method"
            hidden={method !== 'pickup'}
            id={tabPanelId(TABS_ID, 'pickup')}
            role="tabpanel"
            tabIndex={0}
          >
            <InfoIllustration icon="store" />
            <div className="delivery-method__body">
              <h3 className="info-panel__title">Самовывоз из магазина</h3>
              <p className="info-panel__text">
                Заберите заказ в удобном магазине GoodCall — его можно выбрать из списка при
                оформлении.
              </p>
              <InfoFacts items={PICKUP_FACTS} label="Условия самовывоза" />
            </div>
            <div className="delivery-method__aside">
              <h4 className="delivery-method__aside-title">Магазины для самовывоза</h4>
              <ul className="delivery-method__stores">
                {DEMO_STORES.map((store) => (
                  <li className="delivery-method__store" key={store.id}>
                    <span className="delivery-method__store-name">{store.name}</span>
                    <span className="delivery-method__store-address">
                      {store.address}
                      {store.metro === undefined ? null : `, м. ${store.metro}`}
                    </span>
                  </li>
                ))}
              </ul>
              <a className="delivery-method__aside-link" href={links.shops}>
                Все магазины
                <Icon name="chevron-right" />
              </a>
            </div>
            <div className="delivery-method__notice">
              <InfoNotice>
                Самовывоз в демонстрационном магазине не резервирует товар: наличие в магазине для
                демо-заказа не проверяется.
              </InfoNotice>
            </div>
          </div>
        </section>

        <section aria-labelledby="payment-title" className="info-section">
          <InfoSectionHeading
            id="payment-title"
            lead="Способ оплаты выбирается на последнем шаге оформления заказа."
            title="Оплата"
          />

          <ul aria-label="Способы оплаты" className="payment-methods">
            {STOREFRONT_PAYMENT_METHODS.map((item) => {
              const options = paymentOptions(item.id);

              return (
                <li className="payment-methods__item" key={item.id}>
                  <article className="payment-method">
                    <div className="payment-method__head">
                      <span className="payment-method__glyph">
                        <Icon name={item.icon} />
                      </span>
                      {item.mark === undefined ? null : (
                        <span className="payment-method__mark-frame">
                          <img
                            alt={item.mark.alt === item.label ? '' : item.mark.alt}
                            className={`payment-method__mark payment-method__mark--${item.mark.modifier}`}
                            src={item.mark.src}
                          />
                        </span>
                      )}
                    </div>
                    <h3 className="payment-method__title">{item.label}</h3>
                    <p className="payment-method__text">{item.description}</p>
                    <ul aria-label="Когда оплатить" className="payment-method__timings">
                      {options.timings.map((timing) => (
                        <li className="payment-method__timing" key={timing}>
                          {TIMING_LABELS[timing]}
                        </li>
                      ))}
                    </ul>
                    <p className="payment-method__options">
                      <span className="payment-method__options-label">При оформлении:</span>{' '}
                      {options.labels}
                    </p>
                  </article>
                </li>
              );
            })}
          </ul>

          <div className="payment-security">
            <span className="payment-security__glyph">
              <Icon name="shield" />
            </span>
            <div className="payment-security__body">
              <h3 className="payment-security__title">Данные карты не запрашиваются</h3>
              <p className="payment-security__text">
                GoodCall — демонстрационный магазин: выбранный способ оплаты только сохраняется в
                демо-заказе, деньги не списываются. Контактные данные используются только для
                оформления заказа.
              </p>
              <InfoCheckList items={SECURITY_POINTS} label="Как устроена оплата в демо-магазине" />
            </div>
            <InfoIllustration icon="shield" size="md" />
          </div>
        </section>

        <InfoSupport
          links={[
            { label: 'Частые вопросы', href: links.faq },
            { label: 'Гарантия и возврат', href: links.warranty },
          ]}
          text="Служба поддержки GoodCall поможет с оформлением заказа, доставкой и оплатой."
          title="Остались вопросы?"
          titleId="delivery-support-title"
        />
      </Container>
    </main>
  );
}
