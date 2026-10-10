import { ABOUT_MEDIA } from '../../assets/media/about/aboutMedia';
import contactsStoreInterior from '../../assets/media/contacts/contacts-store-interior.webp';
import { COMPARE_LIMIT } from '../../commerce/compare';
import { DEMO_STORES } from '../../commerce/shops';
import { STOREFRONT_SUPPORT } from '../../commerce/storefront';
import { Breadcrumbs, Container } from '../../components/layout';
import { Picture } from '../../components/media';
import { Icon } from '../../components/ui';
import type { IconName } from '../../components/ui';
import type { InfoLinks } from './infoLinks';

const HERO_SIZES = '(min-width: 1280px) 1232px, 100vw';
const BLOCK_SIZES = '(min-width: 1024px) 600px, 100vw';
const MISSION_SIZES = '(min-width: 1024px) 480px, 100vw';

const compareWords = new Intl.PluralRules('ru-RU');

const MODEL_WORDS: Readonly<Record<Intl.LDMLPluralRule, string>> = {
  zero: 'моделей',
  one: 'модели',
  two: 'моделей',
  few: 'моделей',
  many: 'моделей',
  other: 'моделей',
};

const COMPARE_TEXT = `Сравнение до ${String(COMPARE_LIMIT)} ${MODEL_WORDS[compareWords.select(COMPARE_LIMIT)]} по ключевым характеристикам на одной странице.`;

interface AboutCapability {
  readonly icon: IconName;
  readonly title: string;
  readonly text: string;
}

const CAPABILITIES: readonly AboutCapability[] = [
  {
    icon: 'search',
    title: 'Каталог и поиск',
    text: 'Каталог смартфонов с фильтрами и сортировкой и поиск по товарам магазина.',
  },
  { icon: 'compare', title: 'Сравнение товаров', text: COMPARE_TEXT },
  {
    icon: 'heart',
    title: 'Избранное',
    text: 'Понравившиеся товары сохраняются в браузере и собраны на отдельной странице.',
  },
  {
    icon: 'cart',
    title: 'Корзина и демо-заказ',
    text: 'Оформление заказа без реальной оплаты: заказ сохраняется только в вашем браузере.',
  },
  {
    icon: 'store',
    title: 'Магазины и самовывоз',
    text: `Демонстрационных магазинов: ${String(DEMO_STORES.length)}. Любой из них можно выбрать пунктом самовывоза при оформлении.`,
  },
  {
    icon: 'headset',
    title: 'Поддержка',
    text: `Телефон и e-mail поддержки — ${STOREFRONT_SUPPORT.hours.toLowerCase()}.`,
  },
];

interface AboutPageProps {
  readonly links: InfoLinks;
}

export function AboutPage({ links }: AboutPageProps) {
  return (
    <main className="info-page about-page">
      <Container>
        <Breadcrumbs
          className="info-page__breadcrumbs"
          items={[{ label: 'Главная', href: links.home }, { label: 'О нас' }]}
        />

        <div className="about-hero">
          <Picture
            alt=""
            className="about-hero__image"
            fetchPriority="high"
            loading="eager"
            sizes={HERO_SIZES}
            source={ABOUT_MEDIA.hero}
          />
        </div>

        <header className="about-intro">
          <h1 className="about-intro__title">О GoodCall</h1>
          <p className="about-intro__lead">
            GoodCall — демонстрационный интернет-магазин электроники. Здесь можно пройти весь путь
            покупателя: найти смартфон в каталоге или через поиск, открыть карточку товара, сравнить
            модели, сохранить избранное, собрать корзину и оформить демонстрационный заказ с
            доставкой курьером или самовывозом из магазина.
          </p>
          <p className="about-intro__lead">
            Справочные разделы рассказывают о доставке, гарантии, контактах и правилах работы сайта.
          </p>
        </header>

        <section
          aria-labelledby="about-structure-title"
          className="about-block about-block--media-first"
        >
          <div className="about-block__body">
            <h2 className="about-block__title" id="about-structure-title">
              Как устроен GoodCall
            </h2>
            <p className="about-block__text">
              GoodCall объединяет в одной витрине все шаги онлайн-покупки: каталог, карточки
              товаров, сравнение, избранное, корзину, оформление заказа и страницу подтверждения.
            </p>
            <p className="about-block__text">
              Характеристики в карточках товаров сверены с официальными страницами производителей.
              Цены и наличие показаны для примера, оплата не проводится, а заказ сохраняется только
              в вашем браузере — подробнее в{' '}
              <a className="legal-text__link" href={links.terms}>
                Пользовательском соглашении
              </a>
              .
            </p>
          </div>
          <div className="about-block__media">
            <img
              alt=""
              className="about-block__image"
              decoding="async"
              loading="lazy"
              src={contactsStoreInterior}
            />
          </div>
        </section>

        <section aria-labelledby="about-actions-title" className="about-block">
          <div className="about-block__body">
            <h2 className="about-block__title" id="about-actions-title">
              Что можно сделать на сайте
            </h2>
            <p className="about-block__text">
              Выбрать смартфон в{' '}
              <a className="legal-text__link" href={links.catalog}>
                каталоге
              </a>{' '}
              с фильтрами и сортировкой или найти товар через поиск, открыть карточку с
              характеристиками и описанием.
            </p>
            <p className="about-block__text">
              Сравнить модели, сохранить понравившиеся в избранное, собрать корзину и оформить
              демонстрационный заказ — с доставкой курьером или самовывозом из{' '}
              <a className="legal-text__link" href={links.shops}>
                магазинов GoodCall
              </a>
              .
            </p>
            <p className="about-block__text">
              Ответы на частые вопросы собраны в разделе{' '}
              <a className="legal-text__link" href={links.faq}>
                FAQ
              </a>
              .
            </p>
          </div>
          <div className="about-block__media">
            <Picture
              alt=""
              className="about-block__image"
              sizes={BLOCK_SIZES}
              source={ABOUT_MEDIA.products}
            />
          </div>
        </section>

        <section aria-labelledby="about-mission-title" className="about-mission">
          <span aria-hidden="true" className="about-mission__glyph">
            <Icon name="lightbulb" />
          </span>
          <div className="about-mission__body">
            <h2 className="about-mission__title" id="about-mission-title">
              Задача проекта
            </h2>
            <p className="about-mission__text">
              Показать цельный и удобный путь выбора и покупки техники онлайн — от каталога до
              подтверждения заказа — без имитации реальных продаж, оплаты и юридических
              обязательств.
            </p>
          </div>
          <div className="about-mission__media">
            <Picture
              alt=""
              className="about-mission__image"
              sizes={MISSION_SIZES}
              source={ABOUT_MEDIA.project}
            />
          </div>
        </section>

        <section aria-labelledby="about-capabilities-title" className="about-capabilities">
          <h2 className="about-capabilities__title" id="about-capabilities-title">
            Возможности сайта
          </h2>
          <ul className="about-capabilities__list">
            {CAPABILITIES.map((capability) => (
              <li className="about-capability" key={capability.title}>
                <span aria-hidden="true" className="about-capability__glyph">
                  <Icon name={capability.icon} />
                </span>
                <div className="about-capability__body">
                  <h3 className="about-capability__title">{capability.title}</h3>
                  <p className="about-capability__text">{capability.text}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <div className="about-cta">
          <p className="about-cta__text">
            Есть вопросы о GoodCall? Свяжитесь с поддержкой или начните с каталога.
          </p>
          <div className="about-cta__actions">
            <a className="ui-button ui-button--primary about-cta__action" href={links.contacts}>
              Связаться с нами
            </a>
            <a className="ui-button ui-button--secondary about-cta__action" href={links.catalog}>
              Перейти к смартфонам
            </a>
          </div>
        </div>
      </Container>
    </main>
  );
}
