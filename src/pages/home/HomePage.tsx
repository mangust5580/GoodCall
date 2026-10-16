import { useState } from 'react';
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

import {
  HOME_ARTICLE_MEDIA,
  HOME_DEVICE_MEDIA,
  HOME_MARKETING_MEDIA,
} from '../../assets/media/home/homeMarketingMedia';
import { Picture } from '../../components/media';
import type { PictureSource } from '../../components/media';
import { BenefitsStrip } from '../../components/content';
import type { BenefitItem } from '../../components/content';
import { Container } from '../../components/layout';
import { ProductBadge, ProductCard } from '../../components/product';
import { Icon } from '../../components/ui';
import {
  HOME_ARTICLES,
  HOME_BENEFITS,
  HOME_CATEGORY_PROMOS,
  HOME_CATEGORY_TILES,
  HOME_CINEMA_POINTS,
  HOME_HERO_OFFERS,
  HOME_HERO_SLIDES,
  HOME_PRODUCTS,
} from './homeFixtures';
import type { HomeCategoryTile } from './homeFixtures';
import type { HomeArtwork, HomeProduct } from './homeProduct';
import { HomeHeroSlider } from './HomeHeroSlider';
import { HomeMarketingPicture } from './HomeMarketingPicture';

export interface HomeCartSeam {
  readonly quantityOf: (product: HomeProduct) => number | undefined;
  readonly add: (product: HomeProduct) => number;
  readonly setQuantity: (product: HomeProduct, quantity: number) => void;
}

export interface HomePageProps {
  readonly smartphonesPath?: string;
  readonly laptopsPath?: string;
  readonly articlesPath?: string;
  readonly categories?: readonly HomeCategoryTile[];
  readonly products?: readonly HomeProduct[];
  readonly productHref?: (slug: string) => string | undefined;
  readonly cart?: HomeCartSeam;
  readonly benefits?: readonly BenefitItem[];
  readonly blogArticles?: readonly HomeBlogArticle[];
}

export interface HomeBlogArticle {
  readonly slug: string;
  readonly title: string;
  readonly excerpt: string;
  readonly publishedAt: string;
  readonly cover: PictureSource;
  readonly href: string;
}

interface HomeArticleCard {
  readonly key: string;
  readonly title: string;
  readonly excerpt: string;
  readonly media: PictureSource;
  readonly date: string;
  readonly dateTime?: string;
  readonly href?: string;
}

const articleDateFormatter = new Intl.DateTimeFormat('ru-RU', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'UTC',
});

function formatArticleDate(isoDate: string): string {
  const parts = articleDateFormatter.formatToParts(new Date(`${isoDate}T00:00:00Z`));
  const part = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((item) => item.type === type)?.value ?? '';

  return `${part('day')} ${part('month')} ${part('year')}`;
}

const SMARTPHONES_SLUG = 'smartphones';
const LAPTOPS_SLUG = 'laptops';

const ARTWORK: Readonly<Record<HomeArtwork, PictureSource>> = {
  smartphone: HOME_DEVICE_MEDIA.smartphone,
  earbuds: HOME_DEVICE_MEDIA.earbuds,
  watch: HOME_DEVICE_MEDIA.watch,
  headphones: HOME_DEVICE_MEDIA.headphones,
  laptop: HOME_DEVICE_MEDIA.laptop,
  tablet: HOME_DEVICE_MEDIA.tablet,
};

const PROMO_MEDIA_SIZES = '(max-width: 760px) calc(100vw - 32px), 678px';
const CATEGORY_PROMO_MEDIA_SIZES =
  '(max-width: 680px) calc(100vw - 32px), (max-width: 1024px) calc((100vw - 64px) / 2), 432px';
const CINEMA_MEDIA_SIZES = '(max-width: 1440px) calc(100vw - 32px), 1376px';
const OFFER_MEDIA_SIZES = '(max-width: 759px) 96px, 128px';
const PRODUCT_MEDIA_SIZES = '(max-width: 520px) 240px, 220px';
const ARTICLE_MEDIA_SIZES =
  '(max-width: 620px) calc(100vw - 32px), (max-width: 900px) calc((100vw - 52px) / 2), 432px';

const ARTICLE_MEDIA: Readonly<Record<string, PictureSource>> = {
  'iphone-15-review': HOME_ARTICLE_MEDIA.smartphoneReview,
  'galaxy-s24-first-look': HOME_ARTICLE_MEDIA.flagshipPreview,
  'how-to-pick-a-watch': HOME_ARTICLE_MEDIA.watchGuide,
};

export function HomePage({
  smartphonesPath,
  laptopsPath,
  articlesPath,
  categories = HOME_CATEGORY_TILES,
  products = HOME_PRODUCTS,
  productHref,
  cart,
  benefits = HOME_BENEFITS,
  blogArticles,
}: HomePageProps) {
  const [announcement, setAnnouncement] = useState('');
  const articleCards: readonly HomeArticleCard[] =
    blogArticles === undefined
      ? HOME_ARTICLES.map((article) => ({
          key: article.id,
          title: article.title,
          excerpt: article.excerpt,
          media: ARTICLE_MEDIA[article.id],
          date: article.date,
        }))
      : blogArticles.map((article) => ({
          key: article.slug,
          title: article.title,
          excerpt: article.excerpt,
          media: article.cover,
          date: formatArticleDate(article.publishedAt),
          dateTime: article.publishedAt,
          href: article.href,
        }));
  const categoryLink = (slug: string, content: ReactNode, className: string) => {
    const path =
      slug === SMARTPHONES_SLUG ? smartphonesPath : slug === LAPTOPS_SLUG ? laptopsPath : undefined;

    if (path !== undefined) {
      return (
        <Link className={`${className} ${className}--available`} to={path}>
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
          <HomeHeroSlider slides={HOME_HERO_SLIDES} />

          <ul className="home-hero__offers">
            {HOME_HERO_OFFERS.map((offer) => (
              <li key={offer.id}>
                <article aria-label={offer.title} className={`home-offer home-offer--${offer.id}`}>
                  <span className="home-offer__scene">
                    <Picture
                      alt={offer.imageAlt}
                      className="home-offer__art"
                      sizes={OFFER_MEDIA_SIZES}
                      source={ARTWORK[offer.image]}
                    />
                  </span>
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

        <BenefitsStrip items={benefits} label="Преимущества GoodCall" />

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
            {products.map((product) => {
              const quantity = cart?.quantityOf(product);

              return (
                <ProductCard
                  badge={
                    product.badge === undefined ? undefined : (
                      <ProductBadge tone={product.badgeTone ?? 'new'}>{product.badge}</ProductBadge>
                    )
                  }
                  disabled={cart === undefined}
                  href={productHref?.(product.id)}
                  image={
                    product.imageSrc === undefined
                      ? (product.thumbnail ?? ARTWORK[product.image])
                      : undefined
                  }
                  imageAlt={product.imageAlt}
                  imageSizes={PRODUCT_MEDIA_SIZES}
                  imageSrc={product.imageSrc}
                  key={product.id}
                  oldPrice={product.oldPrice}
                  onAddToCart={() => {
                    if (cart === undefined) {
                      return;
                    }

                    const lineQuantity = cart.add(product);
                    setAnnouncement(
                      `Товар добавлен в корзину: ${product.title}. В корзине: ${String(lineQuantity)} шт.`,
                    );
                  }}
                  allowZeroQuantity
                  onQuantityChange={
                    cart === undefined || quantity === undefined
                      ? undefined
                      : (value) => {
                          cart.setQuantity(product, value);

                          if (value === 0) {
                            setAnnouncement(`Товар удалён из корзины: ${product.title}`);
                          }
                        }
                  }
                  price={product.price}
                  quantity={quantity}
                  title={product.title}
                />
              );
            })}
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
              {blogArticles === undefined ? 'Последние статьи' : 'Из блога'}
            </h2>
            {articlesPath === undefined ? null : (
              <Link className="home-section__link" to={articlesPath}>
                Читать все статьи
              </Link>
            )}
          </header>
          <ul className="home-articles">
            {articleCards.map((article) => (
              <li key={article.key}>
                <article className="home-article">
                  <Picture
                    alt=""
                    className="home-article__media"
                    sizes={ARTICLE_MEDIA_SIZES}
                    source={article.media}
                  />
                  <div className="home-article__body">
                    <h3 className="home-article__title">
                      {article.href === undefined ? (
                        article.title
                      ) : (
                        <a className="home-article__link" href={article.href}>
                          {article.title}
                        </a>
                      )}
                    </h3>
                    <p className="home-article__excerpt">{article.excerpt}</p>
                    <p className="home-article__date">
                      <Icon className="home-article__date-icon" name="calendar" />
                      {article.dateTime === undefined ? (
                        article.date
                      ) : (
                        <time dateTime={article.dateTime}>{article.date}</time>
                      )}
                    </p>
                  </div>
                </article>
              </li>
            ))}
          </ul>
        </section>
      </Container>
      <p className="ui-visually-hidden" role="status">
        {announcement}
      </p>
    </main>
  );
}
