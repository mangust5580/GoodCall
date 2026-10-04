import type { ReactNode } from 'react';

import { STOREFRONT_SUPPORT } from '../../commerce/storefront';
import { Icon } from '../../components/ui';
import type { InfoLinks } from './infoLinks';
import { LegalDocumentPage } from './LegalParts';
import type { LegalSection } from './legalSection';

interface OfferStatusRow {
  readonly label: string;
  readonly value: ReactNode;
}

interface OfferPageProps {
  readonly links: InfoLinks;
}

export function OfferPage({ links }: OfferPageProps) {
  const sections: readonly LegalSection[] = [
    {
      id: 'offer-general',
      title: 'Общие положения',
      icon: 'info',
      content: (
        <p>
          Публичная оферта — это предложение продавца заключить договор с любым покупателем на
          опубликованных условиях. Демонстрационная версия GoodCall такого предложения не делает.
        </p>
      ),
    },
    {
      id: 'offer-status',
      title: 'Статус демонстрационного магазина',
      icon: 'store',
      content: (
        <p>
          GoodCall — демонстрационный проект интернет-магазина. У сайта нет продавца, который
          принимает заказы, и нет реквизитов для заключения договора.
        </p>
      ),
    },
    {
      id: 'offer-prices',
      title: 'Товары и цены',
      icon: 'package',
      content: (
        <p>
          Цены, скидки и характеристики показаны для демонстрации и не являются предложением о
          продаже. Цена на сайте не закрепляется за покупателем.
        </p>
      ),
    },
    {
      id: 'offer-order',
      title: 'Оформление заказа',
      icon: 'cart',
      content: (
        <p>
          Оформление создаёт демонстрационный заказ только в вашем браузере. Заказ не передаётся
          продавцу и не считается принятым.
        </p>
      ),
    },
    {
      id: 'offer-payment',
      title: 'Оплата',
      icon: 'credit-card',
      content: (
        <p>
          Оплата не проводится: деньги не списываются, данные банковской карты не запрашиваются.
          Способы оплаты при оформлении — часть демонстрации.
        </p>
      ),
    },
    {
      id: 'offer-delivery',
      title: 'Доставка и самовывоз',
      icon: 'map-pin',
      content: (
        <p>
          Курьерская доставка, интервалы и самовывоз из магазинов показаны для демонстрации. Товары
          не доставляются и не резервируются. Как это устроено — на странице{' '}
          <a className="legal-text__link" href={links.delivery}>
            «Доставка и оплата»
          </a>
          .
        </p>
      ),
    },
    {
      id: 'offer-warranty',
      title: 'Гарантия и возврат',
      icon: 'return',
      content: (
        <p>
          Покупка не совершается, поэтому гарантийные обязательства и право на возврат по
          демонстрационным заказам не возникают. Пример условий — на странице{' '}
          <a className="legal-text__link" href={links.warranty}>
            «Гарантия и возврат»
          </a>
          .
        </p>
      ),
    },
    {
      id: 'offer-limits',
      title: 'Ограничения',
      icon: 'shield',
      content: (
        <p>
          Не принимайте решение о покупке на основе демонстрационных цен и условий. Порядок работы
          сайта описан в{' '}
          <a className="legal-text__link" href={links.terms}>
            Пользовательском соглашении
          </a>
          .
        </p>
      ),
    },
    {
      id: 'offer-contacts',
      title: 'Контакты',
      icon: 'mail',
      content: (
        <p>
          Вопросы можно задать в поддержке GoodCall по телефону{' '}
          <a className="legal-text__link" href={STOREFRONT_SUPPORT.phoneHref}>
            {STOREFRONT_SUPPORT.phone}
          </a>{' '}
          или по e-mail{' '}
          <a className="legal-text__link" href={STOREFRONT_SUPPORT.emailHref}>
            {STOREFRONT_SUPPORT.email}
          </a>
          .
        </p>
      ),
    },
  ];
  const statusRows: readonly OfferStatusRow[] = [
    { label: 'Проект', value: 'Демонстрационный интернет-магазин GoodCall' },
    { label: 'Продавец', value: 'Нет — товары не продаются' },
    { label: 'Договор', value: 'Не заключается' },
    { label: 'Оплата', value: 'Не проводится' },
    { label: 'Заказы', value: 'Хранятся только в вашем браузере' },
    {
      label: 'Телефон',
      value: (
        <a className="legal-text__link" href={STOREFRONT_SUPPORT.phoneHref}>
          {STOREFRONT_SUPPORT.phone}
        </a>
      ),
    },
    {
      label: 'E-mail',
      value: (
        <a className="legal-text__link" href={STOREFRONT_SUPPORT.emailHref}>
          {STOREFRONT_SUPPORT.email}
        </a>
      ),
    },
    { label: 'Поддержка', value: STOREFRONT_SUPPORT.hours },
  ];

  return (
    <LegalDocumentPage
      className="offer-page"
      contentsIcon="folder"
      homeHref={links.home}
      intro={
        <div className="offer-callout">
          <Icon className="offer-callout__icon" name="info" />
          <div className="offer-callout__body">
            <p className="offer-callout__text">
              Текущая демонстрационная версия GoodCall не является публичной офертой и не заключает
              реальный договор купли-продажи.
            </p>
            <p className="offer-callout__note">
              Оформление заказа на сайте не является акцептом оферты: заказ сохраняется только в
              вашем браузере, не передаётся продавцу и не оплачивается.
            </p>
          </div>
        </div>
      }
      lead="Почему демонстрационная версия GoodCall не предлагает заключить договор и как в ней устроены заказ, оплата и доставка."
      outro={
        <section aria-labelledby="offer-project-title" className="offer-project">
          <h2 className="offer-project__title" id="offer-project-title">
            Статус демонстрационного проекта
          </h2>
          <dl className="offer-project__facts">
            {statusRows.map((row) => (
              <div className="offer-project__fact" key={row.label}>
                <dt className="offer-project__label">{row.label}</dt>
                <dd className="offer-project__value">{row.value}</dd>
              </div>
            ))}
          </dl>
          <ul aria-label="Связанные страницы" className="offer-project__links">
            <li>
              <a className="legal-text__link" href={links.delivery}>
                Доставка и оплата
              </a>
            </li>
            <li>
              <a className="legal-text__link" href={links.warranty}>
                Гарантия и возврат
              </a>
            </li>
            <li>
              <a className="legal-text__link" href={links.contacts}>
                Контакты
              </a>
            </li>
          </ul>
        </section>
      }
      sections={sections}
      title="Публичная оферта"
    />
  );
}
