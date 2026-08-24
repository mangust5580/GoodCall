import { useSyncExternalStore } from 'react';

import brandMark from '../../assets/shell/brand-mark.svg';
import { Container } from '../layout';
import { Icon, SearchField } from '../ui';
import type { IconName } from '../ui';
import { shellActions } from './shellActions';
import type { ShellAction, ShellActionInput } from './shellActions';

export interface SiteHeaderCategory {
  readonly label: string;
  readonly href: string;
  readonly icon?: IconName;
}

export interface SiteHeaderProps extends Omit<ShellActionInput, 'fallbackHref'> {
  readonly homeHref?: string;
  readonly catalogHref?: string;
  readonly storesHref?: string;
  readonly supportHref?: string;
  readonly locationLabel?: string;
  readonly categories?: readonly SiteHeaderCategory[];
  readonly searchPlaceholder?: string;
  readonly onSearchSubmit?: (value: string) => void;
  readonly onScanRequest?: () => void;
}

const NARROW_VIEWPORT_QUERY = '(max-width: 767.98px)';

function subscribeToNarrowViewport(onChange: () => void): () => void {
  const query = window.matchMedia(NARROW_VIEWPORT_QUERY);

  query.addEventListener('change', onChange);

  return () => {
    query.removeEventListener('change', onChange);
  };
}

function readNarrowViewport(): boolean {
  return window.matchMedia(NARROW_VIEWPORT_QUERY).matches;
}

const CANONICAL_CATEGORIES: readonly { readonly label: string; readonly icon: IconName }[] = [
  { label: 'Смартфоны', icon: 'smartphone' },
  { label: 'Планшеты', icon: 'tablet' },
  { label: 'Ноутбуки', icon: 'laptop' },
  { label: 'Аксессуары', icon: 'accessories' },
  { label: 'Наушники', icon: 'headphones' },
  { label: 'Умные часы', icon: 'watch' },
  { label: 'ТВ и аудио', icon: 'tv' },
  { label: 'Игры и консоли', icon: 'gamepad' },
  { label: 'Бытовая техника', icon: 'appliance' },
];

function ActionLink({ label, icon, href, count }: ShellAction) {
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
  storesHref,
  supportHref,
  locationLabel = 'Москва',
  categories,
  searchPlaceholder,
  onSearchSubmit,
  onScanRequest,
  ...actionInput
}: SiteHeaderProps) {
  const base = import.meta.env.BASE_URL;
  const narrow = useSyncExternalStore(subscribeToNarrowViewport, readNarrowViewport, () => false);
  const home = homeHref ?? base;
  const catalog = catalogHref ?? base;
  const categoryItems =
    categories ?? CANONICAL_CATEGORIES.map((category) => ({ ...category, href: catalog }));
  const actions = shellActions({ fallbackHref: base, ...actionInput });

  return (
    <header className="site-header">
      <div className="site-header__utility">
        <Container className="site-header__utility-inner">
          <p className="site-header__location">
            <Icon name="map-pin" />
            {locationLabel}
          </p>
          <p className="site-header__service">Доставка по всей России</p>
          <a className="site-header__utility-link site-header__stores" href={storesHref ?? base}>
            <Icon name="store" />
            Магазины
          </a>
          <a className="site-header__utility-link site-header__support" href={supportHref ?? base}>
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
            <span className="site-header__catalog-label">Каталог товаров</span>
            <span className="site-header__catalog-label-short">Каталог</span>
          </a>

          <div className="site-header__search">
            <SearchField
              label="Поиск по каталогу"
              labelVisuallyHidden
              name="q"
              onSubmit={onSearchSubmit}
              placeholder={
                searchPlaceholder ?? (narrow ? 'Поиск товаров' : 'Поиск среди 50 000+ товаров')
              }
              trailingAction={
                narrow && onScanRequest
                  ? { icon: 'scan-qr', label: 'Сканировать QR-код', onClick: onScanRequest }
                  : undefined
              }
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
                  {category.icon ? <Icon name={category.icon} /> : null}
                  <span className="site-header__category-label">{category.label}</span>
                </a>
              </li>
            ))}
            <li>
              <a className="site-header__category site-header__category--all" href={catalog}>
                <Icon name="menu" />
                <span className="site-header__category-label">Ещё</span>
              </a>
            </li>
          </ul>
        </Container>
      </nav>
    </header>
  );
}
