import { useState } from 'react';
import type { ReactNode } from 'react';

import productEarbuds from '../assets/products/product-earbuds.svg';
import productLaptop from '../assets/products/product-laptop.svg';
import productPhone from '../assets/products/product-phone.svg';
import { MiniProductCard, PriceBlock, ProductCard } from '../components/product';
import {
  Button,
  Checkbox,
  Chip,
  DateField,
  Pagination,
  PhoneField,
  QuantityStepper,
  Radio,
  RangeSlider,
  SearchField,
  SelectField,
  Tabs,
  TextField,
  TextareaField,
  Toggle,
  tabId,
  tabPanelId,
} from '../components/ui';
import type { TabItem } from '../components/ui';

import './ComponentsReference.scss';

const TAB_ITEMS: readonly TabItem[] = [
  { id: 'regular', label: 'Обычная' },
  { id: 'cart', label: 'Корзина магазина' },
  { id: 'reviews', label: 'Отзывы (24)' },
];

const SELECT_OPTIONS = [
  { value: 'popular', label: 'Сначала популярные' },
  { value: 'cheap', label: 'Сначала дешёвые' },
  { value: 'expensive', label: 'Сначала дорогие' },
];

const BRAND_FILTERS = [
  { id: 'apple', label: 'Apple', count: 123 },
  { id: 'samsung', label: 'Samsung', count: 98 },
  { id: 'xiaomi', label: 'Xiaomi', count: 64 },
  { id: 'premium', label: 'Премиум', count: 31 },
  { id: 'budget', label: 'Недорогие', count: 56 },
];

const BRAND_FILTERS_INITIAL_COUNT = 3;

const PRODUCT_TABS = 'product-sections';

const PHONE = {
  id: 'phone',
  title: 'Apple iPhone 15 128 ГБ, чёрный',
  imageAlt: 'Смартфон Apple iPhone 15 в чёрном корпусе, вид спереди и сзади',
};

const LAPTOP = {
  id: 'laptop',
  title: 'Ноутбук Apple MacBook Air 13" M2, 8/256 ГБ, серый',
  imageAlt: 'Открытый ноутбук Apple MacBook Air 13 дюймов в сером корпусе',
};

const EARBUDS = {
  id: 'earbuds',
  title: 'Наушники Apple AirPods Pro 2',
  imageAlt: 'Беспроводные наушники Apple AirPods Pro 2 в открытом зарядном футляре',
};

const priceFormatter = new Intl.NumberFormat('ru-RU');

const formatPrice = (value: number): string => `${priceFormatter.format(value)} ₽`;

interface GroupProps {
  readonly title: string;
  readonly children: ReactNode;
  readonly wide?: boolean;
  readonly className?: string;
}

function Group({ title, children, wide = false, className }: GroupProps) {
  const classes = ['cmp-group'];

  if (wide) {
    classes.push('cmp-group--wide');
  }

  if (className) {
    classes.push(className);
  }

  return (
    <div className={classes.join(' ')}>
      <h3 className="cmp-group__title">{title}</h3>
      <div className="cmp-group__body">{children}</div>
    </div>
  );
}

interface SectionProps {
  readonly index: string;
  readonly title: string;
  readonly children: ReactNode;
}

function Section({ index, title, children }: SectionProps) {
  return (
    <section className="cmp-section">
      <header className="cmp-section__head">
        <span className="cmp-section__index">{index}</span>
        <h2 className="cmp-section__title">{title}</h2>
      </header>
      <div className="cmp-section__body">{children}</div>
    </section>
  );
}

export function ComponentsReference() {
  const [activeTab, setActiveTab] = useState('regular');
  const [selectAll, setSelectAll] = useState(true);
  const [compare, setCompare] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [muted, setMuted] = useState(false);
  const [delivery, setDelivery] = useState('courier');
  const [searchQuery, setSearchQuery] = useState('');
  const [submittedSearch, setSubmittedSearch] = useState('');
  const [phone, setPhone] = useState('');
  const [sort, setSort] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [page, setPage] = useState(1);
  const [brands, setBrands] = useState<readonly string[]>(['samsung']);
  const [brandsExpanded, setBrandsExpanded] = useState(false);
  const [price, setPrice] = useState<[number, number]>([10000, 80000]);
  const [favorites, setFavorites] = useState<readonly string[]>([]);
  const [laptopQuantity, setLaptopQuantity] = useState(1);
  const [cartMessage, setCartMessage] = useState('');
  const visibleBrands = brandsExpanded
    ? BRAND_FILTERS
    : BRAND_FILTERS.slice(0, BRAND_FILTERS_INITIAL_COUNT);

  const toggleBrand = (id: string, checked: boolean) => {
    setBrands((current) =>
      checked ? [...current, id] : current.filter((brandId) => brandId !== id),
    );
  };

  const toggleFavorite = (id: string, pressed: boolean) => {
    setFavorites((current) =>
      pressed ? [...current, id] : current.filter((productId) => productId !== id),
    );
  };

  const addToCart = (title: string) => {
    setCartMessage(`Добавлено в корзину: ${title}`);
  };

  return (
    <main className="cmp-reference">
      <header className="cmp-reference__head">
        <span className="cmp-reference__brand">GOODCALL</span>
        <span className="cmp-reference__caption">
          Components A &amp; B — Controls, Forms and Product Components
        </span>
      </header>

      <Section index="02" title="Buttons &amp; Controls">
        <Group title="Кнопки" wide>
          <div className="cmp-row">
            <Button variant="primary">Основная кнопка</Button>
            <Button variant="secondary">Вторичная кнопка</Button>
            <Button variant="text">Текстовая кнопка</Button>
            <Button variant="danger">Кнопка-ошибка</Button>
            <Button disabled variant="primary">
              Недоступна
            </Button>
          </div>
        </Group>

        <Group title="Табы" wide>
          <Tabs
            activeId={activeTab}
            idBase={PRODUCT_TABS}
            items={TAB_ITEMS}
            label="Разделы товара"
            onChange={setActiveTab}
          />
          {TAB_ITEMS.map((item) => (
            <div
              aria-labelledby={tabId(PRODUCT_TABS, item.id)}
              className="cmp-tabpanel"
              hidden={item.id !== activeTab}
              id={tabPanelId(PRODUCT_TABS, item.id)}
              key={item.id}
              role="tabpanel"
              tabIndex={0}
            >
              Содержимое вкладки «{item.label}».
            </div>
          ))}
        </Group>

        <Group title="Чипы" wide>
          <div className="cmp-row">
            <Chip variant="success">Новинка</Chip>
            <Chip variant="brand">Хит</Chip>
            <Chip variant="danger">-25%</Chip>
            <Chip variant="success">В наличии</Chip>
          </div>
        </Group>

        <Group title="Тогглы">
          <div className="cmp-stack">
            <Toggle checked={notifications} label="Уведомления" onChange={setNotifications} />
            <Toggle checked={muted} label="Без звука" onChange={setMuted} />
            <Toggle checked={false} disabled label="Недоступно" onChange={() => undefined} />
          </div>
        </Group>

        <Group title="Чекбоксы">
          <div className="cmp-stack">
            <Checkbox checked={selectAll} label="Выбрать все" onChange={setSelectAll} />
            <Checkbox checked={compare} label="Сравнить товары" onChange={setCompare} />
            <Checkbox checked={false} disabled label="Недоступно" onChange={() => undefined} />
          </div>
        </Group>

        <Group title="Радио">
          <div className="cmp-stack">
            <Radio
              checked={delivery === 'courier'}
              label="Доставка"
              name="delivery"
              onChange={() => {
                setDelivery('courier');
              }}
              value="courier"
            />
            <Radio
              checked={delivery === 'pickup'}
              label="Самовывоз"
              name="delivery"
              onChange={() => {
                setDelivery('pickup');
              }}
              value="pickup"
            />
          </div>
        </Group>

        <Group title="Счётчик">
          <div className="cmp-stepper-specimen">
            <QuantityStepper label="Количество товара" onChange={setQuantity} value={quantity} />
          </div>
        </Group>

        <Group title="Пагинация" wide>
          <Pagination label="Страницы каталога" onChange={setPage} page={page} pageCount={10} />
        </Group>
      </Section>

      <Section index="03" title="Inputs &amp; Forms">
        <div className="cmp-fields">
          <TextField label="Текстовое поле" placeholder="Введите текст" />
          <div className="cmp-search-specimen">
            <SearchField
              label="Поиск товаров"
              onClear={() => {
                setSubmittedSearch('');
              }}
              onSubmit={setSubmittedSearch}
              onValueChange={setSearchQuery}
              placeholder="Поиск товаров"
              value={searchQuery}
            />
            <span className="ui-visually-hidden">{submittedSearch}</span>
          </div>
          <SelectField
            label="Выпадающий список"
            onValueChange={setSort}
            options={SELECT_OPTIONS}
            placeholder="Выберите опцию"
            value={sort}
          />
          <TextareaField label="Текстовая область" placeholder="Введите описание" />
          <PhoneField
            label="Телефон"
            onValueChange={setPhone}
            placeholder="+7 (___) ___-__-__"
            value={phone}
          />
          <div className="cmp-checkbox-group">
            <h4 className="cmp-checkbox-group__title">Предпочтения</h4>
            <div className="cmp-stack">
              {visibleBrands.map((brand) => (
                <Checkbox
                  checked={brands.includes(brand.id)}
                  key={brand.id}
                  label={
                    <>
                      {brand.label} <span className="cmp-count">({brand.count})</span>
                    </>
                  }
                  onChange={(checked) => {
                    toggleBrand(brand.id, checked);
                  }}
                />
              ))}
            </div>
            <Button
              onClick={() => {
                setBrandsExpanded((current) => !current);
              }}
              variant="text"
            >
              {brandsExpanded ? 'Скрыть' : 'Показать ещё'}
            </Button>
          </div>
          <DateField label="Выбор даты" onValueChange={setDeliveryDate} value={deliveryDate} />
          <div className="cmp-fields__wide">
            <span className="cmp-range-label" id="price-range-label">
              Слайдер (диапазон цен)
            </span>
            <div className="cmp-range-specimen">
              <RangeSlider
                formatValue={formatPrice}
                max={150000}
                maxLabel="Максимальная цена"
                min={0}
                minLabel="Минимальная цена"
                onChange={setPrice}
                step={1000}
                values={price}
              />
            </div>
          </div>
        </div>
      </Section>

      <Section index="04" title="Product Components">
        <Group className="cmp-product-group" title="Карточка товара (вертикальная)">
          <ProductCard
            badge={<Chip variant="success">Новинка</Chip>}
            favoritePressed={favorites.includes(PHONE.id)}
            imageAlt={PHONE.imageAlt}
            imageSrc={productPhone}
            layout="vertical"
            oldPrice={formatPrice(79990)}
            onAddToCart={() => {
              addToCart(PHONE.title);
            }}
            onFavoriteToggle={(pressed) => {
              toggleFavorite(PHONE.id, pressed);
            }}
            price={formatPrice(69990)}
            rating={4.8}
            reviewCount={128}
            title={PHONE.title}
          />
        </Group>

        <Group
          className="cmp-product-group cmp-product-group--horizontal"
          title="Карточка товара (горизонтальная)"
        >
          <ProductCard
            availability={<Chip variant="success">В наличии</Chip>}
            favoritePressed={favorites.includes(LAPTOP.id)}
            imageAlt={LAPTOP.imageAlt}
            imageSrc={productLaptop}
            layout="horizontal"
            oldPrice={formatPrice(99990)}
            onAddToCart={() => {
              addToCart(LAPTOP.title);
            }}
            onFavoriteToggle={(pressed) => {
              toggleFavorite(LAPTOP.id, pressed);
            }}
            onQuantityChange={setLaptopQuantity}
            price={formatPrice(89990)}
            quantity={laptopQuantity}
            rating={4.7}
            reviewCount={312}
            title={LAPTOP.title}
          />
        </Group>

        <Group className="cmp-product-group cmp-product-group--mini" title="Мини-карточка товара">
          <MiniProductCard
            favoritePressed={favorites.includes(EARBUDS.id)}
            imageAlt={EARBUDS.imageAlt}
            imageSrc={productEarbuds}
            onAddToCart={() => {
              addToCart(EARBUDS.title);
            }}
            onFavoriteToggle={(pressed) => {
              toggleFavorite(EARBUDS.id, pressed);
            }}
            title={EARBUDS.title}
          />
        </Group>

        <Group className="cmp-product-group cmp-product-group--price" title="Блок цены">
          <PriceBlock
            availability="В наличии"
            discount={<Chip variant="danger">-22%</Chip>}
            oldPrice={formatPrice(89990)}
            price={formatPrice(69990)}
            rating={4.9}
            reviewCount={246}
            savings={`Выгода ${formatPrice(20000)}`}
          />
        </Group>

        <Group className="cmp-product-group cmp-product-group--badges" title="Бейджи">
          <div className="cmp-stack">
            <Chip variant="success">Новинка</Chip>
            <Chip variant="brand">Хит продаж</Chip>
            <Chip variant="danger">-25%</Chip>
            <Chip variant="success">В наличии</Chip>
          </div>
        </Group>

        <p aria-live="polite" className="ui-visually-hidden">
          {cartMessage}
        </p>
      </Section>

      <a className="cmp-reference__back" href={import.meta.env.BASE_URL}>
        Back to reference index
      </a>
    </main>
  );
}
