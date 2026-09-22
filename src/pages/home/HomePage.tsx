import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

import {
  HOME_ARTICLE_MEDIA,
  HOME_DEVICE_MEDIA,
  HOME_MARKETING_MEDIA,
} from '../../assets/media/home/homeMarketingMedia';
import type { HomeMarketingAsset } from '../../assets/media/home/homeMarketingMedia';
import { Picture } from '../../components/media';
import type { PictureSource } from '../../components/media';
import { Container } from '../../components/layout';
import { ProductCard } from '../../components/product';
import { Icon } from '../../components/ui';
import {
  HOME_ARTICLES,
  HOME_BENEFITS,
  HOME_CATEGORY_PROMOS,
  HOME_CATEGORY_TILES,
  HOME_CINEMA_POINTS,
  HOME_HERO_OFFERS,
  HOME_PRODUCTS,
} from './homeFixtures';
import type { HomeArtwork, HomeCategoryTile, HomeProduct } from './homeFixtures';

export interface HomePageProps {
  readonly smartphonesPath?: string;
  readonly categories?: readonly HomeCategoryTile[];
  readonly products?: readonly HomeProduct[];
}

const SMARTPHONES_SLUG = 'smartphones';

const ARTWORK: Readonly<Record<HomeArtwork, PictureSource>> = {
  smartphone: HOME_DEVICE_MEDIA.smartphone,
  earbuds: HOME_DEVICE_MEDIA.earbuds,
  watch: HOME_DEVICE_MEDIA.watch,
  headphones: HOME_DEVICE_MEDIA.headphones,
  laptop: HOME_DEVICE_MEDIA.laptop,
  tablet: HOME_DEVICE_MEDIA.tablet,
};

const HERO_MEDIA_SIZES = '(max-width: 560px) 100vw, (max-width: 900px) calc(100vw - 32px), 1076px';
const PROMO_MEDIA_SIZES = '(max-width: 760px) calc(100vw - 32px), 678px';
const CATEGORY_PROMO_MEDIA_SIZES =
  '(max-width: 680px) calc(100vw - 32px), (max-width: 1024px) calc((100vw - 64px) / 2), 432px';
const CINEMA_MEDIA_SIZES = '(max-width: 1440px) calc(100vw - 32px), 1376px';
const OFFER_MEDIA_SIZES = '(max-width: 760px) 72px, 56px';
const PRODUCT_MEDIA_SIZES = '(max-width: 520px) 240px, 220px';
const ARTICLE_MEDIA_SIZES =
  '(max-width: 620px) calc(100vw - 32px), (max-width: 900px) calc((100vw - 52px) / 2), 432px';

const ARTICLE_MEDIA: Readonly<Record<string, PictureSource>> = {
  'iphone-15-review': HOME_ARTICLE_MEDIA.smartphoneReview,
  'galaxy-s24-first-look': HOME_ARTICLE_MEDIA.flagshipPreview,
  'how-to-pick-a-watch': HOME_ARTICLE_MEDIA.watchGuide,
};

interface HomeMarketingPictureProps {
  readonly asset: HomeMarketingAsset;
  readonly alt: string;
  readonly className: string;
  readonly sizes: string;
  readonly loading?: 'eager' | 'lazy';
  readonly fetchPriority?: 'high' | 'low' | 'auto';
}

function HomeMarketingPicture({
  asset,
  alt,
  className,
  sizes,
  loading = 'lazy',
  fetchPriority,
}: HomeMarketingPictureProps) {
  return (
    <picture>
      {Object.entries(asset.mobile.sources).map(([format, srcSet]) => (
        <source
          key={`mobile-${format}`}
          media="(max-width: 560px)"
          sizes={sizes}
          srcSet={srcSet}
          type={`image/${format}`}
        />
      ))}
      {Object.entries(asset.desktop.sources).map(([format, srcSet]) => (
        <source key={`desktop-${format}`} sizes={sizes} srcSet={srcSet} type={`image/${format}`} />
      ))}
      <img
        alt={alt}
        className={className}
        decoding="async"
        fetchPriority={fetchPriority}
        height={asset.desktop.img.h}
        loading={loading}
        sizes={sizes}
        src={asset.desktop.img.src}
        width={asset.desktop.img.w}
      />
    </picture>
  );
}

export function HomePage({
  smartphonesPath,
  categories = HOME_CATEGORY_TILES,
  products = HOME_PRODUCTS,
}: HomePageProps) {
  const categoryLink = (slug: string, content: ReactNode, className: string) => {
    if (slug === SMARTPHONES_SLUG && smartphonesPath !== undefined) {
      return (
        <Link className={`${className} ${className}--available`} to={smartphonesPath}>
          {content}
        </Link>
      );
    }

    return <span className={className}>{content}</span>;
  };

  return (
    <main className="home-page">
      <Container className="home-page__inner">
        <section className="home-hero">
          <div className="home-banner">
            <HomeMarketingPicture
              alt=""
              asset={HOME_MARKETING_MEDIA.heroMainPromo}
              className="home-banner__media"
              fetchPriority="high"
              loading="eager"
              sizes={HERO_MEDIA_SIZES}
            />
            <div className="home-banner__content">
              <h1 className="home-banner__title">
                Большие скидки <span className="home-banner__accent">до 50%</span>
              </h1>
              <p className="home-banner__lead">На смартфоны и аксессуары</p>
            </div>
          </div>

          <ul className="home-hero__offers">
            {HOME_HERO_OFFERS.map((offer) => (
              <li key={offer.id}>
                <article aria-label={offer.title} className="home-offer">
                  <Picture
                    alt={offer.imageAlt}
                    className="home-offer__art"
                    sizes={OFFER_MEDIA_SIZES}
                    source={ARTWORK[offer.image]}
                  />
                  <div className="home-offer__body">
                    <p className="home-offer__title">{offer.title}</p>
                    <p className="home-offer__spec">{offer.spec}</p>
                    <p className="home-offer__price">{offer.price}</p>
                  </div>
                </article>
              </li>
            ))}
          </ul>
        </section>

        <section aria-label="Преимущества GoodCall" className="home-benefits">
          <ul className="home-benefits__list">
            {HOME_BENEFITS.map((benefit) => (
              <li className="home-benefit" key={benefit.title}>
                <span className="home-benefit__glyph">
                  <Icon name={benefit.icon} />
                </span>
                <span className="home-benefit__body">
                  <span className="home-benefit__title">{benefit.title}</span>
                  <span className="home-benefit__note">{benefit.note}</span>
                </span>
              </li>
            ))}
          </ul>
        </section>

        <div className="home-promos">
          <section className="home-promo home-promo--light">
            <HomeMarketingPicture
              alt=""
              asset={HOME_MARKETING_MEDIA.newArrivals}
              className="home-promo__media"
              sizes={PROMO_MEDIA_SIZES}
            />
            <div className="home-promo__content">
              <h2 className="home-promo__title">
                Новинки
                <span className="home-promo__title-line">от GOODCALL</span>
              </h2>
              <p className="home-promo__description">
                Откройте для себя последние модели смартфонов и гаджетов
              </p>
            </div>
          </section>

          <section className="home-promo home-promo--dark">
            <HomeMarketingPicture
              alt=""
              asset={HOME_MARKETING_MEDIA.blackFriday}
              className="home-promo__media"
              sizes={PROMO_MEDIA_SIZES}
            />
            <div className="home-promo__content">
              <h2 className="home-promo__title">Чёрная пятница</h2>
              <p className="home-promo__description">
                Самые выгодные предложения только один раз в году
              </p>
            </div>
          </section>
        </div>

        <div className="home-category-promos">
          {HOME_CATEGORY_PROMOS.map((promo) => (
            <section className="home-category-promo" key={promo.id}>
              {promo.id === 'watches' ? (
                <HomeMarketingPicture
                  alt=""
                  asset={HOME_MARKETING_MEDIA.wearableTech}
                  className="home-category-promo__media"
                  sizes={CATEGORY_PROMO_MEDIA_SIZES}
                />
              ) : (
                <Picture
                  alt=""
                  className="home-category-promo__media"
                  sizes={CATEGORY_PROMO_MEDIA_SIZES}
                  source={ARTWORK[promo.image]}
                />
              )}
              <div className="home-category-promo__content">
                <h2 className="home-category-promo__title">{promo.title}</h2>
                <p className="home-category-promo__description">{promo.description}</p>
              </div>
            </section>
          ))}
        </div>

        <section className="home-section" aria-labelledby="home-categories-title">
          <header className="home-section__header">
            <h2 className="home-section__title" id="home-categories-title">
              Популярные категории
            </h2>
          </header>
          <ul className="home-tiles">
            {categories.map((tile) => (
              <li key={tile.slug}>
                {categoryLink(
                  tile.slug,
                  <>
                    <span className="home-tile__glyph">
                      <Icon name={tile.icon} />
                    </span>
                    <span className="home-tile__label">{tile.label}</span>
                  </>,
                  'home-tile',
                )}
              </li>
            ))}
          </ul>
        </section>

        <section className="home-section" aria-labelledby="home-products-title">
          <header className="home-section__header">
            <h2 className="home-section__title" id="home-products-title">
              Популярные товары
            </h2>
          </header>
          <div className="home-products">
            {products.map((product) => (
              <ProductCard
                badge={
                  product.badge === undefined ? undefined : (
                    <span className={`home-badge home-badge--${product.badgeTone ?? 'new'}`}>
                      {product.badge}
                    </span>
                  )
                }
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

        <section className="home-cinema">
          <HomeMarketingPicture
            alt=""
            asset={HOME_MARKETING_MEDIA.entertainmentStreaming}
            className="home-cinema__media"
            sizes={CINEMA_MEDIA_SIZES}
          />
          <div className="home-cinema__content">
            <h2 className="home-cinema__title">Ваши любимые фильмы и сериалы всегда с вами</h2>
            <ul className="home-cinema__points">
              {HOME_CINEMA_POINTS.map((point) => (
                <li className="home-cinema__point" key={point}>
                  <Icon className="home-cinema__check" name="check" />
                  {point}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="home-section" aria-labelledby="home-articles-title">
          <header className="home-section__header">
            <h2 className="home-section__title" id="home-articles-title">
              Последние статьи
            </h2>
          </header>
          <ul className="home-articles">
            {HOME_ARTICLES.map((article) => (
              <li key={article.id}>
                <article className="home-article">
                  <Picture
                    alt=""
                    className="home-article__media"
                    sizes={ARTICLE_MEDIA_SIZES}
                    source={ARTICLE_MEDIA[article.id]}
                  />
                  <div className="home-article__body">
                    <h3 className="home-article__title">{article.title}</h3>
                    <p className="home-article__excerpt">{article.excerpt}</p>
                    <p className="home-article__date">{article.date}</p>
                  </div>
                </article>
              </li>
            ))}
          </ul>
        </section>
      </Container>
    </main>
  );
}
