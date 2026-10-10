import { COMPARE_LIMIT } from '../../commerce/compare';
import { DEMO_STORES } from '../../commerce/shops';
import {
  STOREFRONT_DELIVERY_SLOTS,
  STOREFRONT_PAYMENT_OPTIONS,
  STOREFRONT_SUPPORT,
} from '../../commerce/storefront';
import type { IconName } from '../../components/ui';
import type { InfoLinkKey } from './infoLinks';

export type FaqCategoryId = 'orders' | 'payment' | 'delivery' | 'returns' | 'products';

export interface FaqCategory {
  readonly id: FaqCategoryId;
  readonly label: string;
  readonly icon: IconName;
}

export interface FaqLink {
  readonly label: string;
  readonly to: InfoLinkKey;
}

export interface FaqEntry {
  readonly id: string;
  readonly category: FaqCategoryId;
  readonly question: string;
  readonly answer: readonly string[];
  readonly steps?: readonly string[];
  readonly link?: FaqLink;
}

export const FAQ_CATEGORIES: readonly FaqCategory[] = [
  { id: 'orders', label: 'Заказы', icon: 'cart' },
  { id: 'payment', label: 'Оплата', icon: 'credit-card' },
  { id: 'delivery', label: 'Доставка', icon: 'package' },
  { id: 'returns', label: 'Возврат и гарантия', icon: 'shield' },
  { id: 'products', label: 'Товары', icon: 'smartphone' },
];

const slotList = STOREFRONT_DELIVERY_SLOTS.map((slot) => slot.label).join(', ');
const paymentList = STOREFRONT_PAYMENT_OPTIONS.map((option) => option.label.toLowerCase()).join(
  ', ',
);
const storeCities = [...new Set(DEMO_STORES.map((store) => store.city))].join(', ');

export const FAQ_ENTRIES: readonly FaqEntry[] = [
  {
    id: 'how-to-order',
    category: 'orders',
    question: 'Как оформить заказ?',
    answer: [
      'Добавьте товары в корзину из каталога, поиска, с главной страницы или со страницы товара. В корзине отметьте нужные позиции и нажмите «Оформить заказ». На странице оформления укажите получателя, способ получения и способ оплаты, затем нажмите «Подтвердить заказ».',
    ],
    steps: [
      'Добавьте товары в корзину',
      'Проверьте состав заказа',
      'Выберите получение и оплату',
      'Подтвердите заказ',
    ],
    link: { label: 'Перейти в корзину', to: 'cart' },
  },
  {
    id: 'after-confirmation',
    category: 'orders',
    question: 'Что происходит после подтверждения заказа?',
    answer: [
      'Откроется страница «Спасибо! Ваш заказ оформлен» с номером демо-заказа и выбранными параметрами. Оформленные позиции убираются из корзины.',
      'GoodCall — демонстрационный магазин: заказ сохраняется только в текущей сессии браузера, оплата и доставка не выполняются.',
    ],
  },
  {
    id: 'change-order',
    category: 'orders',
    question: 'Можно ли изменить или отменить заказ?',
    answer: [
      'Состав и количество товаров можно менять в корзине до подтверждения заказа. Подтверждённый демо-заказ не передаётся в работу, поэтому отменять его не нужно — при необходимости оформите новый.',
    ],
  },
  {
    id: 'order-status',
    category: 'orders',
    question: 'Как узнать статус заказа?',
    answer: [
      'Отслеживание заказов в демонстрационном магазине не предусмотрено. Сведения о последнем демо-заказе доступны на странице подтверждения, пока открыта текущая сессия браузера.',
    ],
  },
  {
    id: 'cart-saved',
    category: 'orders',
    question: 'Сохранится ли корзина, если закрыть сайт?',
    answer: [
      'Да. Корзина хранится в этом браузере на вашем устройстве и восстанавливается при следующем визите. На другом устройстве или в другом браузере она будет пустой.',
    ],
  },
  {
    id: 'payment-methods',
    category: 'payment',
    question: 'Какие способы оплаты доступны?',
    answer: [`При оформлении заказа можно выбрать один из четырёх способов: ${paymentList}.`],
    link: { label: 'Подробнее об оплате', to: 'delivery' },
  },
  {
    id: 'pay-on-receipt',
    category: 'payment',
    question: 'Можно ли оплатить заказ при получении?',
    answer: [
      'Да. При оформлении выберите «При получении картой» или «Наличными» — так можно оплатить и доставку курьером, и самовывоз из магазина.',
    ],
  },
  {
    id: 'payment-charged',
    category: 'payment',
    question: 'Спишутся ли деньги при оформлении?',
    answer: [
      'Нет. В демонстрационном магазине оплата не проводится: выбранный способ только сохраняется в демо-заказе. Данные банковской карты на сайте не запрашиваются.',
    ],
  },
  {
    id: 'delivery-options',
    category: 'delivery',
    question: 'Какие способы получения есть?',
    answer: [
      `Два способа: доставка курьером по указанному адресу или самовывоз из одного из ${String(DEMO_STORES.length)} магазинов GoodCall (${storeCities}). Способ выбирается на странице оформления заказа.`,
    ],
    link: { label: 'Доставка и оплата', to: 'delivery' },
  },
  {
    id: 'delivery-time',
    category: 'delivery',
    question: 'Можно ли выбрать дату и время доставки?',
    answer: [
      `Да. При доставке курьером выберите дату из ближайших 7 дней, начиная с завтрашнего, и удобный интервал: ${slotList}.`,
    ],
  },
  {
    id: 'delivery-cost',
    category: 'delivery',
    question: 'Сколько стоит доставка?',
    answer: [
      'В демонстрационном магазине стоимость доставки не начисляется: итог заказа на странице оформления — это сумма выбранных товаров.',
    ],
  },
  {
    id: 'pickup',
    category: 'delivery',
    question: 'Где можно забрать заказ самостоятельно?',
    answer: [
      'В любом из магазинов GoodCall из списка на странице оформления. Адреса, ближайшие станции метро и часы работы магазинов собраны на странице «Магазины». Наличие товара в магазине для демо-заказа не проверяется.',
    ],
    link: { label: 'Список магазинов', to: 'shops' },
  },
  {
    id: 'warranty-term',
    category: 'returns',
    question: 'Какая гарантия на товары?',
    answer: [
      'На товары распространяется официальная гарантия производителя. Срок указан для конкретного товара — на его странице, рядом с ценой и в разделе «Гарантия». Точные условия приводятся в гарантийных документах производителя.',
    ],
    link: { label: 'Гарантия и возврат', to: 'warranty' },
  },
  {
    id: 'return-item',
    category: 'returns',
    question: 'Как вернуть или обменять товар?',
    answer: [
      'Возврат и обмен проводятся по Закону РФ «О защите прав потребителей». Условия зависят от категории товара и от того, есть ли в нём недостаток, поэтому начните с обращения в поддержку.',
      `Телефон поддержки: ${STOREFRONT_SUPPORT.phone}, ${STOREFRONT_SUPPORT.hours.toLowerCase()}.`,
    ],
    link: { label: 'Условия возврата', to: 'warranty' },
  },
  {
    id: 'broken-item',
    category: 'returns',
    question: 'Что делать, если товар неисправен?',
    answer: [
      'Свяжитесь с поддержкой и опишите неисправность. Гарантийный ремонт выполняют авторизованные сервисные центры производителя — поддержка подскажет, куда обратиться.',
    ],
  },
  {
    id: 'compare-products',
    category: 'products',
    question: 'Как сравнить товары?',
    answer: [
      `Нажмите кнопку сравнения на карточке товара в каталоге. В сравнение можно добавить до ${String(COMPARE_LIMIT)} товаров, а открыть его — через «Сравнение» в шапке сайта.`,
    ],
    link: { label: 'Открыть сравнение', to: 'compare' },
  },
  {
    id: 'favorites',
    category: 'products',
    question: 'Как добавить товар в избранное?',
    answer: [
      'Нажмите на сердечко на карточке товара в каталоге или на странице товара. Избранное хранится в этом браузере и доступно через «Избранное» в шапке сайта.',
    ],
    link: { label: 'Открыть избранное', to: 'favorites' },
  },
  {
    id: 'product-details',
    category: 'products',
    question: 'Где посмотреть характеристики товара?',
    answer: [
      'Откройте страницу товара из каталога или поиска: характеристики, описание, условия гарантии и способы оплаты собраны в разделах под основной информацией.',
    ],
    link: { label: 'Перейти к смартфонам', to: 'catalog' },
  },
];

export const FAQ_DEFAULT_OPEN_ID = 'how-to-order';
