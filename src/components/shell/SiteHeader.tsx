import brandMark from '../../assets/shell/brand-mark.svg';
import { Container } from '../layout';
import { Icon, SearchField } from '../ui';
import type { IconName } from '../ui';

export interface SiteHeaderCategory {
  readonly label: string;
  readonly href: string;
}

export interface SiteHeaderProps {
  readonly homeHref?: string;
  readonly catalogHref?: string;
  readonly comparisonHref?: string;
  readonly favoritesHref?: string;
  readonly cartHref?: string;
  readonly accountHref?: string;
  readonly storesHref?: string;
  readonly supportHref?: string;
  readonly locationLabel?: string;
  readonly comparisonCount?: number;
  readonly favoritesCount?: number;
  readonly cartCount?: number;
  readonly categories?: readonly SiteHeaderCategory[];
  readonly searchPlaceholder?: string;
  readonly onSearchSubmit?: (value: string) => void;
}

const CATEGORY_LABELS = [
  'Смартфоны',
  'Планшеты',
  'Ноутбуки',
  'Аксессуары',
  'Наушники',
  'Умные часы',
  'ТВ и аудио',
  'Игры и консоли',
  'Бытовая техника',
] as const;

interface HeaderAction {
  readonly label: string;
  readonly icon: IconName;
  readonly href: string;
  readonly count?: number;
}

function ActionLink({ label, icon, href, count }: HeaderAction) {
  return (
    <li className="site-header__action-item">
      <a className="site-header__action" href={href}>
        <span className="site-header__action-glyph">
          <Icon name={icon} />
          {count === undefined ? null : <span className="site-header__badge">{count}</span>}
        </span>
        <span className="site-header__action-label">{label}</span>
      </a>
    </li>
  );
}

export function SiteHeader({
  homeHref,
  catalogHref,
  comparisonHref,
  favoritesHref,
  cartHref,
  accountHref,
  storesHref,
  supportHref,
  locationLabel = 'Москва',
  comparisonCount,
  favoritesCount,
  cartCount,
  categories,
  searchPlaceholder = 'Поиск среди 50 000+ товаров',
  onSearchSubmit,
}: SiteHeaderProps) {
  const base = import.meta.env.BASE_URL;
  const home = homeHref ?? base;
  const catalog = catalogHref ?? base;
  const categoryItems = categories ?? CATEGORY_LABELS.map((label) => ({ label, href: catalog }));

  const actions: readonly HeaderAction[] = [
    {
      label: 'Сравнение',
      icon: 'compare',
      href: comparisonHref ?? base,
      count: comparisonCount,
    },
    { label: 'Избранное', icon: 'heart', href: favoritesHref ?? base, count: favoritesCount },
    { label: 'Корзина', icon: 'cart', href: cartHref ?? base, count: cartCount },
    { label: 'Войти', icon: 'person', href: accountHref ?? base },
  ];

  return (
    <header className="site-header">
      <div className="site-header__utility">
        <Container className="site-header__utility-inner">
          <p className="site-header__location">
            <Icon name="map-pin" />
            {locationLabel}
          </p>
          <p className="site-header__service">Доставка по всей России</p>
          <a className="site-header__utility-link" href={storesHref ?? base}>
            Магазины
          </a>
          <a className="site-header__utility-link" href={supportHref ?? base}>
            <Icon name="headset" />
            Поддержка 24/7
          </a>
        </Container>
      </div>

      <div className="site-header__main">
        <Container className="site-header__main-inner">
          <a className="site-header__brand" href={home}>
            <img alt="" className="site-header__brand-mark" src={brandMark} />
            <span className="site-header__brand-name">GOODCALL</span>
          </a>

          <a className="site-header__catalog" href={catalog}>
            <Icon name="menu" />
            Каталог товаров
          </a>

          <div className="site-header__search">
            <SearchField
              label="Поиск по каталогу"
              labelVisuallyHidden
              name="q"
              onSubmit={onSearchSubmit}
              placeholder={searchPlaceholder}
            />
          </div>

          <ul className="site-header__actions">
            {actions.map((action) => (
              <ActionLink
                count={action.count}
                href={action.href}
                icon={action.icon}
                key={action.label}
                label={action.label}
              />
            ))}
          </ul>
        </Container>
      </div>

      <nav aria-label="Категории товаров" className="site-header__categories">
        <Container className="site-header__categories-inner">
          <ul className="site-header__category-list">
            {categoryItems.map((category) => (
              <li key={category.label}>
                <a className="site-header__category" href={category.href}>
                  {category.label}
                </a>
              </li>
            ))}
            <li>
              <a className="site-header__category site-header__category--all" href={catalog}>
                Ещё
              </a>
            </li>
          </ul>
        </Container>
      </nav>
    </header>
  );
}
