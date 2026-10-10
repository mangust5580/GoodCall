import useEmblaCarousel from 'embla-carousel-react';
import { useSyncExternalStore } from 'react';
import type { ReactNode } from 'react';

import { BrandLogo } from '../brand';
import { Container } from '../layout';
import { CityLocationControl } from '../location';
import type { CityLookupClient } from '../location';
import { Icon, SearchField } from '../ui';
import type { IconName } from '../ui';
import { shellActionName, shellActions } from './shellActions';
import type { ShellAction, ShellActionInput } from './shellActions';

export interface SiteHeaderCategory {
  readonly label: string;
  readonly href?: string;
  readonly icon?: IconName;
}

export interface SiteHeaderProps extends Omit<ShellActionInput, 'fallbackHref'> {
  readonly homeHref?: string;
  readonly catalogHref?: string;
  readonly smartphonesHref?: string;
  readonly laptopsHref?: string;
  readonly storesHref?: string;
  readonly supportHref?: string;
  readonly supportLabel?: string;
  readonly cityLookupClient?: CityLookupClient;
  readonly cityLookupConfigured?: boolean;
  readonly categories?: readonly SiteHeaderCategory[];
  readonly searchPlaceholder?: string;
  readonly onSearchSubmit?: (value: string) => void;
  readonly onScanRequest?: () => void;
}

interface MediaQueryStore {
  readonly subscribe: (onChange: () => void) => () => void;
  readonly read: () => boolean;
}

function mediaQueryStore(query: string): MediaQueryStore {
  return {
    subscribe: (onChange) => {
      const list = window.matchMedia(query);

      list.addEventListener('change', onChange);

      return () => {
        list.removeEventListener('change', onChange);
      };
    },
    read: () => window.matchMedia(query).matches,
  };
}

const narrowViewport = mediaQueryStore('(max-width: 767.98px)');
const compactHeader = mediaQueryStore('(max-width: 1079.98px)');

function readServerMediaQuery(): boolean {
  return false;
}

const CATEGORY_CAROUSEL_OPTIONS = {
  align: 'start',
  containScroll: 'trimSnaps',
  loop: false,
  dragFree: false,
  skipSnaps: false,
  breakpoints: {
    '(min-width: 768px)': { active: false },
  },
} as const;

const SMARTPHONES_LABEL = 'Смартфоны';
const LAPTOPS_LABEL = 'Ноутбуки';

const CANONICAL_CATEGORIES: readonly { readonly label: string; readonly icon: IconName }[] = [
  { label: SMARTPHONES_LABEL, icon: 'smartphone' },
  { label: 'Планшеты', icon: 'tablet' },
  { label: LAPTOPS_LABEL, icon: 'laptop' },
  { label: 'Аксессуары', icon: 'accessories' },
  { label: 'Наушники', icon: 'headphones' },
  { label: 'Умные часы', icon: 'watch' },
  { label: 'ТВ и аудио', icon: 'tv' },
  { label: 'Игры и консоли', icon: 'gamepad' },
  { label: 'Бытовая техника', icon: 'appliance' },
];

interface HeaderEntryProps {
  readonly className: string;
  readonly href?: string;
  readonly children: ReactNode;
}

function HeaderEntry({ className, href, children }: HeaderEntryProps) {
  return href === undefined ? (
    <span className={className}>{children}</span>
  ) : (
    <a className={className} href={href}>
      {children}
    </a>
  );
}

function ActionLink(action: ShellAction) {
  const { label, icon, href, count } = action;

  return (
    <li className="site-header__action-item">
      <a aria-label={shellActionName(action)} className="site-header__action" href={href}>
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
  smartphonesHref,
  laptopsHref,
  storesHref,
  supportHref,
  supportLabel = 'Поддержка 24/7',
  cityLookupClient,
  cityLookupConfigured,
  categories,
  searchPlaceholder,
  onSearchSubmit,
  onScanRequest,
  ...actionInput
}: SiteHeaderProps) {
  const base = import.meta.env.BASE_URL;
  const narrow = useSyncExternalStore(
    narrowViewport.subscribe,
    narrowViewport.read,
    readServerMediaQuery,
  );
  const compact = useSyncExternalStore(
    compactHeader.subscribe,
    compactHeader.read,
    readServerMediaQuery,
  );
  const [categoryViewportRef] = useEmblaCarousel(CATEGORY_CAROUSEL_OPTIONS);
  const home = homeHref ?? base;
  const categoryItems =
    categories ??
    CANONICAL_CATEGORIES.map((category) => ({
      ...category,
      href:
        category.label === SMARTPHONES_LABEL
          ? (smartphonesHref ?? catalogHref)
          : category.label === LAPTOPS_LABEL
            ? (laptopsHref ?? catalogHref)
            : catalogHref,
    }));
  const actions = shellActions({ fallbackHref: base, ...actionInput });

  return (
    <>
      <div className="site-header__utility">
        <Container className="site-header__utility-inner">
          <CityLocationControl client={cityLookupClient} configured={cityLookupConfigured} />
          <p className="site-header__service">Доставка по всей России</p>
          <a className="site-header__utility-link site-header__stores" href={storesHref ?? base}>
            <Icon name="store" />
            Магазины
          </a>
          <a className="site-header__utility-link site-header__support" href={supportHref ?? base}>
            <Icon name="headset" />
            {supportLabel}
          </a>
        </Container>
      </div>

      <header className="site-header">
        <Container className="site-header__main-inner">
          <a className="site-header__brand" href={home}>
            <BrandLogo />
          </a>

          <HeaderEntry className="site-header__catalog" href={catalogHref}>
            <Icon name="menu" />
            <span className="site-header__catalog-label">Каталог товаров</span>
            <span className="site-header__catalog-label-short">Каталог</span>
          </HeaderEntry>

          <div className="site-header__search">
            <SearchField
              label="Поиск по каталогу"
              labelVisuallyHidden
              name="q"
              onSubmit={onSearchSubmit}
              placeholder={
                searchPlaceholder ?? (compact ? 'Поиск товаров' : 'Поиск среди 50 000+ товаров')
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
      </header>

      <nav aria-label="Категории товаров" className="site-header__categories">
        <Container className="site-header__categories-inner">
          <div className="site-header__category-viewport" ref={categoryViewportRef}>
            <ul className="site-header__category-list">
              {categoryItems.map((category) => (
                <li className="site-header__category-item" key={category.label}>
                  <HeaderEntry className="site-header__category" href={category.href}>
                    {category.icon ? <Icon name={category.icon} /> : null}
                    <span className="site-header__category-label">{category.label}</span>
                  </HeaderEntry>
                </li>
              ))}
              <li className="site-header__category-item">
                <HeaderEntry
                  className="site-header__category site-header__category--all"
                  href={catalogHref}
                >
                  <Icon name="menu" />
                  <span className="site-header__category-label">Ещё</span>
                </HeaderEntry>
              </li>
            </ul>
          </div>
        </Container>
      </nav>
    </>
  );
}
