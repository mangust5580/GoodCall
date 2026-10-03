import notFoundHero from '../../assets/media/not-found/not-found-hero.png?w=360;480;640;800;1000;1200&picture';
import { HOME_DEVICE_MEDIA } from '../../assets/media/home/homeMarketingMedia';
import { Container } from '../../components/layout';
import { Picture } from '../../components/media';
import type { PictureSource } from '../../components/media';
import { ProductCard } from '../../components/product';
import { Chip, Icon, SearchField } from '../../components/ui';
import type { IconName } from '../../components/ui';
import type { HomeProduct } from '../home';

export interface NotFoundShortcutTargets {
  readonly smartphones: string;
  readonly iphoneSearch: string;
  readonly samsungSearch: string;
  readonly cart: string;
}

export interface NotFoundPageProps {
  readonly homeHref: string;
  readonly catalogHref: string;
  readonly shortcutTargets: NotFoundShortcutTargets;
  readonly products: readonly HomeProduct[];
  readonly productHref?: (slug: string) => string | undefined;
  readonly onSearchSubmit: (value: string) => void;
}

interface NotFoundShortcut {
  readonly title: string;
  readonly note: string;
  readonly icon: IconName;
  readonly target: keyof NotFoundShortcutTargets;
}

const SHORTCUTS: readonly NotFoundShortcut[] = [
  { title: 'Смартфоны', note: 'Популярные модели', icon: 'smartphone', target: 'smartphones' },
  { title: 'Apple iPhone', note: 'Найти в каталоге', icon: 'search', target: 'iphoneSearch' },
  { title: 'Samsung Galaxy', note: 'Найти в каталоге', icon: 'search', target: 'samsungSearch' },
  { title: 'Корзина', note: 'Выбранные товары', icon: 'cart', target: 'cart' },
];

const ARTWORK: Readonly<Record<HomeProduct['image'], PictureSource>> = {
  smartphone: HOME_DEVICE_MEDIA.smartphone,
  earbuds: HOME_DEVICE_MEDIA.earbuds,
  watch: HOME_DEVICE_MEDIA.watch,
  headphones: HOME_DEVICE_MEDIA.headphones,
  laptop: HOME_DEVICE_MEDIA.laptop,
  tablet: HOME_DEVICE_MEDIA.tablet,
};

const HERO_MEDIA_SIZES = '(max-width: 899px) 280px, (max-width: 1279px) 400px, 540px';
const PRODUCT_MEDIA_SIZES = '(max-width: 520px) 240px, 220px';

export function NotFoundPage({
  homeHref,
  catalogHref,
  shortcutTargets,
  products,
  productHref,
  onSearchSubmit,
}: NotFoundPageProps) {
  return (
    <main className="not-found-page">
      <Container>
        <nav aria-label="Хлебные крошки" className="not-found-page__breadcrumbs">
          <ol className="not-found-page__crumbs">
            <li className="not-found-page__crumb">
              <a className="not-found-page__crumb-link" href={homeHref}>
                Главная
              </a>
            </li>
            <li aria-current="page" className="not-found-page__crumb">
              404
            </li>
          </ol>
        </nav>

        <section aria-labelledby="not-found-title" className="not-found-hero">
          <div className="not-found-hero__content">
            <p aria-hidden="true" className="not-found-hero__code">
              404
            </p>
            <h1 className="not-found-hero__title" id="not-found-title">
              Страница не найдена
            </h1>
            <p className="not-found-hero__message">
              Возможно, она была удалена, перемещена или вы просто ошиблись адресом. Давайте найдём,
              что вам нужно.
            </p>
            <div className="not-found-hero__actions">
              <a className="ui-button ui-button--primary not-found-hero__action" href={homeHref}>
                На главную
              </a>
              <a
                className="ui-button ui-button--secondary not-found-hero__action"
                href={catalogHref}
              >
                Перейти в каталог
              </a>
            </div>
            <div className="not-found-hero__search">
              <p className="not-found-hero__search-title">
                <Icon className="not-found-hero__search-icon" name="search" />
                Попробуйте поискать нужный товар
              </p>
              <SearchField
                label="Поиск товаров"
                labelVisuallyHidden
                name="q"
                onSubmit={onSearchSubmit}
                placeholder="Например, iPhone 15 или Samsung Galaxy S24"
              />
            </div>
          </div>
          <div className="not-found-hero__art">
            <Picture
              alt=""
              className="not-found-hero__image"
              fetchPriority="high"
              loading="eager"
              sizes={HERO_MEDIA_SIZES}
              source={notFoundHero}
            />
          </div>
        </section>

        <section aria-labelledby="not-found-shortcuts-title" className="not-found-section">
          <h2 className="not-found-section__title" id="not-found-shortcuts-title">
            Возможно, вы ищете
          </h2>
          <ul className="not-found-shortcuts">
            {SHORTCUTS.map((shortcut) => (
              <li key={shortcut.title}>
                <a className="not-found-shortcut" href={shortcutTargets[shortcut.target]}>
                  <span className="not-found-shortcut__glyph">
                    <Icon name={shortcut.icon} />
                  </span>
                  <span className="not-found-shortcut__body">
                    <span className="not-found-shortcut__title">{shortcut.title}</span>
                    <span className="not-found-shortcut__note">{shortcut.note}</span>
                  </span>
                  <Icon className="not-found-shortcut__arrow" name="chevron-right" />
                </a>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="not-found-products-title" className="not-found-section">
          <h2 className="not-found-section__title" id="not-found-products-title">
            Вам может понравиться
          </h2>
          <div className="not-found-products">
            {products.map((product) => (
              <ProductCard
                badge={
                  product.badge === undefined ? undefined : (
                    <Chip variant={product.badgeTone === 'sale' ? 'danger' : 'brand'}>
                      {product.badge}
                    </Chip>
                  )
                }
                href={productHref?.(product.id)}
                image={product.imageSrc === undefined ? ARTWORK[product.image] : undefined}
                imageAlt={product.imageAlt}
                imageSizes={PRODUCT_MEDIA_SIZES}
                imageSrc={product.imageSrc}
                key={product.id}
                oldPrice={product.oldPrice}
                price={product.price}
                title={product.title}
              />
            ))}
          </div>
        </section>
      </Container>
    </main>
  );
}
