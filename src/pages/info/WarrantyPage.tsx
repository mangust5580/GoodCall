import { STOREFRONT_SUPPORT, STOREFRONT_TRUST } from '../../commerce/storefront';
import type { BenefitItem } from '../../components/content';
import { Container } from '../../components/layout';
import { Icon } from '../../components/ui';
import type { IconName } from '../../components/ui';
import { InfoPageHeader } from './InfoPageHeader';
import {
  InfoCheckList,
  InfoFacts,
  InfoHighlights,
  InfoIllustration,
  InfoNotice,
  InfoSectionHeading,
  InfoSteps,
} from './InfoParts';
import type { InfoFact, InfoStep } from './InfoParts';
import { InfoSupport } from './InfoSupport';
import type { InfoLinks } from './infoLinks';

interface WarrantySectionLink {
  readonly headingId: string;
  readonly label: string;
  readonly icon: IconName;
}

const SECTIONS: readonly WarrantySectionLink[] = [
  { headingId: 'warranty-returns-title', label: 'Возврат и обмен', icon: 'return' },
  { headingId: 'warranty-guarantee-title', label: 'Гарантия', icon: 'shield' },
  { headingId: 'warranty-repair-title', label: 'Ремонт и сервис', icon: 'tools' },
];

const HIGHLIGHTS: readonly BenefitItem[] = [
  ...STOREFRONT_TRUST.map((item) => ({ title: item.title, note: item.text, icon: item.icon })),
  { title: 'Поддержка', note: STOREFRONT_SUPPORT.hours, icon: 'headset' },
];

const RETURN_STEPS: readonly InfoStep[] = [
  { icon: 'headset', text: 'Свяжитесь с поддержкой по телефону или почте' },
  { icon: 'package', text: 'Подготовьте товар, комплектацию и документ о покупке' },
  { icon: 'info', text: 'Поддержка уточнит условия для категории товара' },
  { icon: 'return', text: 'Возврат или обмен — по закону о защите прав потребителей' },
];

const RETURN_PREPARE: readonly string[] = [
  'Товар и его полная комплектация',
  'Номер заказа или документ о покупке',
  'Гарантийный талон, если он был в комплекте',
  'Описание причины обращения',
];

const RETURN_CONSIDER: readonly string[] = [
  'Для товара надлежащего качества законом предусмотрены ограничения — для части категорий техники возврат и обмен недоступны',
  'Если в товаре есть недостаток, решение принимается после проверки качества',
  'Демо-заказы не выполняются, поэтому возврат по ним не оформляется',
];

const WARRANTY_FACTS: readonly InfoFact[] = [
  {
    icon: 'shield',
    title: 'Кто даёт гарантию',
    text: 'Производитель товара. GoodCall продаёт технику официальных поставок.',
  },
  {
    icon: 'clock',
    title: 'Срок гарантии',
    text: 'Указан для конкретного товара — на его странице рядом с ценой и в разделе «Гарантия».',
  },
  {
    icon: 'check',
    title: 'Что обычно покрывает',
    text: 'Заводские дефекты и неисправности, возникшие не по вине покупателя.',
  },
  {
    icon: 'close',
    title: 'Что обычно не покрывает',
    text: 'Механические повреждения, следы влаги, нарушение правил эксплуатации и вскрытие устройства.',
  },
];

const WARRANTY_SOURCES: readonly InfoFact[] = [
  {
    icon: 'smartphone',
    title: 'Страница товара',
    text: 'Срок гарантии — в блоке с ценой и в разделе «Гарантия»',
  },
  {
    icon: 'folder',
    title: 'Документы производителя',
    text: 'Гарантийный талон и условия обслуживания в комплекте',
  },
  {
    icon: 'headset',
    title: 'Поддержка GoodCall',
    text: 'Подскажет, куда обратиться по вашему товару',
  },
];

const REPAIR_STEPS: readonly InfoStep[] = [
  { icon: 'headset', text: 'Свяжитесь с поддержкой GoodCall' },
  { icon: 'message', text: 'Опишите неисправность и подготовьте документ о покупке' },
  { icon: 'map-pin', text: 'Получите контакты сервиса производителя' },
  { icon: 'tools', text: 'Сервис проведёт диагностику и примет решение' },
];

function focusSection(headingId: string) {
  const heading = document.getElementById(headingId);

  if (heading === null) {
    return;
  }

  heading.closest('section')?.scrollIntoView({ block: 'start' });
  heading.focus({ preventScroll: true });
}

interface WarrantyPageProps {
  readonly links: InfoLinks;
}

export function WarrantyPage({ links }: WarrantyPageProps) {
  return (
    <main className="info-page warranty-page">
      <Container>
        <InfoPageHeader
          homeHref={links.home}
          lead="Как устроены возврат, обмен, гарантия и обращение в сервис для товаров GoodCall."
          title="Гарантия и возврат"
        />

        <InfoHighlights items={HIGHLIGHTS} label="Коротко о гарантии и возврате" />

        <nav aria-label="Разделы страницы" className="info-jump">
          {SECTIONS.map((section) => (
            <button
              className="info-jump__item"
              key={section.headingId}
              onClick={() => {
                focusSection(section.headingId);
              }}
              type="button"
            >
              <Icon className="info-jump__icon" name={section.icon} />
              <span>{section.label}</span>
            </button>
          ))}
        </nav>

        <section aria-labelledby="warranty-returns-title" className="info-section">
          <InfoSectionHeading
            focusable
            id="warranty-returns-title"
            lead="Возврат и обмен проводятся по Закону РФ «О защите прав потребителей». Условия зависят от категории товара и от того, есть ли в нём недостаток."
            title="Возврат и обмен"
          />

          <div className="info-panel warranty-block">
            <InfoIllustration icon="return" />
            <div className="warranty-block__body">
              <h3 className="info-panel__title">Как оформить возврат или обмен</h3>
              <InfoSteps items={RETURN_STEPS} label="Порядок возврата и обмена" />
              <div className="warranty-block__columns">
                <div className="warranty-block__column">
                  <h4 className="warranty-block__column-title">
                    <Icon className="warranty-block__column-icon" name="package" />
                    Что подготовить
                  </h4>
                  <InfoCheckList items={RETURN_PREPARE} />
                </div>
                <div className="warranty-block__column">
                  <h4 className="warranty-block__column-title">
                    <Icon className="warranty-block__column-icon" name="info" />
                    Важно учесть
                  </h4>
                  <ul className="warranty-block__notes">
                    {RETURN_CONSIDER.map((item) => (
                      <li className="warranty-block__note" key={item}>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            <div className="warranty-block__notice">
              <InfoNotice>
                Чтобы начать возврат или обмен, позвоните в поддержку: {STOREFRONT_SUPPORT.phone},{' '}
                {STOREFRONT_SUPPORT.hours.toLowerCase()}, или напишите на {STOREFRONT_SUPPORT.email}
                .
              </InfoNotice>
            </div>
          </div>
        </section>

        <section aria-labelledby="warranty-guarantee-title" className="info-section">
          <InfoSectionHeading
            focusable
            id="warranty-guarantee-title"
            lead="На товары распространяется официальная гарантия производителя. Ниже — общие ориентиры; точные условия устанавливает производитель."
            title="Гарантия"
          />

          <div className="info-panel info-panel--tinted warranty-block">
            <InfoIllustration icon="shield" />
            <div className="warranty-block__body">
              <h3 className="info-panel__title">Гарантия на товары</h3>
              <InfoFacts items={WARRANTY_FACTS} label="Условия гарантии" />
            </div>
            <div className="warranty-block__sources">
              <h4 className="warranty-block__sources-title">Где найти точные условия</h4>
              <InfoFacts items={WARRANTY_SOURCES} label="Где найти условия гарантии" />
            </div>
            <div className="warranty-block__notice">
              <InfoNotice>
                Решение о гарантийном случае принимает сервис производителя после диагностики.
              </InfoNotice>
            </div>
          </div>
        </section>

        <section aria-labelledby="warranty-repair-title" className="info-section">
          <InfoSectionHeading
            focusable
            id="warranty-repair-title"
            lead="Гарантийный ремонт выполняют авторизованные сервисные центры производителей."
            title="Ремонт и сервисное обслуживание"
          />

          <div className="info-panel warranty-block">
            <InfoIllustration icon="tools" />
            <div className="warranty-block__body">
              <h3 className="info-panel__title">Как обратиться в сервис</h3>
              <p className="info-panel__text">
                GoodCall не управляет собственными сервисными центрами — поддержка подскажет, куда
                обратиться. Срок ремонта зависит от сложности и наличия запчастей.
              </p>
              <InfoSteps items={REPAIR_STEPS} label="Порядок обращения в сервис" />
            </div>
            <div className="warranty-block__notice">
              <InfoNotice>
                Статус ремонта уточняйте в сервисном центре, который принял устройство.
              </InfoNotice>
            </div>
          </div>
        </section>

        <InfoSupport
          links={[
            { label: 'Частые вопросы', href: links.faq },
            { label: 'Доставка и оплата', href: links.delivery },
          ]}
          text="Служба поддержки GoodCall поможет с возвратом, обменом и гарантийным обращением."
          title="Остались вопросы?"
          titleId="warranty-support-title"
        />
      </Container>
    </main>
  );
}
