import { useState } from 'react';
import type { ReactNode } from 'react';

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

const PRODUCT_TABS = 'product-sections';

const priceFormatter = new Intl.NumberFormat('ru-RU');

const formatPrice = (value: number): string => `${priceFormatter.format(value)} ₽`;

interface GroupProps {
  readonly title: string;
  readonly children: ReactNode;
  readonly wide?: boolean;
}

function Group({ title, children, wide = false }: GroupProps) {
  return (
    <div className={wide ? 'cmp-group cmp-group--wide' : 'cmp-group'}>
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
  const [quantity, setQuantity] = useState(1);
  const [page, setPage] = useState(1);
  const [brands, setBrands] = useState<readonly string[]>(['samsung']);
  const [price, setPrice] = useState<[number, number]>([10000, 80000]);

  const toggleBrand = (id: string, checked: boolean) => {
    setBrands((current) =>
      checked ? [...current, id] : current.filter((brandId) => brandId !== id),
    );
  };

  return (
    <main className="cmp-reference">
      <header className="cmp-reference__head">
        <span className="cmp-reference__brand">GOODCALL</span>
        <span className="cmp-reference__caption">Components A — Core Controls &amp; Forms</span>
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
          <QuantityStepper label="Количество товара" onChange={setQuantity} value={quantity} />
        </Group>

        <Group title="Пагинация" wide>
          <Pagination label="Страницы каталога" onChange={setPage} page={page} pageCount={10} />
        </Group>
      </Section>

      <Section index="03" title="Inputs &amp; Forms">
        <div className="cmp-fields">
          <TextField label="Текстовое поле" placeholder="Введите текст" />
          <SearchField label="Поиск товаров" placeholder="Поиск товаров" />
          <SelectField
            label="Выпадающий список"
            options={SELECT_OPTIONS}
            placeholder="Выберите опцию"
          />
          <TextareaField label="Текстовая область" placeholder="Введите описание" />
          <PhoneField label="Телефон" placeholder="+7 (___) ___-__-__" />
          <div className="cmp-checkbox-group">
            <h4 className="cmp-checkbox-group__title">Предпочтения</h4>
            <div className="cmp-stack">
              {BRAND_FILTERS.map((brand) => (
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
            <Button variant="text">Показать ещё</Button>
          </div>
          <DateField label="Выбор даты" />
          <div className="cmp-fields__wide">
            <span className="cmp-range-label" id="price-range-label">
              Слайдер (диапазон цен)
            </span>
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
      </Section>

      <a className="cmp-reference__back" href={import.meta.env.BASE_URL}>
        Back to reference index
      </a>
    </main>
  );
}
