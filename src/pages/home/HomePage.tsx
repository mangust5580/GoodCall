import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

import brandTech from '../../assets/marketing/brand-tech.svg';
import promoSaleBags from '../../assets/marketing/promo-sale-bags.svg';
import productEarbuds from '../../assets/products/product-earbuds.svg';
import productLaptop from '../../assets/products/product-laptop.svg';
import productPhone from '../../assets/products/product-phone.svg';
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
import type { HomeArtwork } from './homeFixtures';

export interface HomePageProps {
  readonly smartphonesPath?: string;
}

const SMARTPHONES_LABEL = 'Смартфоны';

const ARTWORK: Readonly<Record<HomeArtwork, string>> = {
  phone: productPhone,
  laptop: productLaptop,
  earbuds: productEarbuds,
};

export function HomePage({ smartphonesPath }: HomePageProps) {
  const categoryLink = (label: string, content: ReactNode, className: string) => {
    if (label === SMARTPHONES_LABEL && smartphonesPath !== undefined) {
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
            <div className="home-banner__content">
              <h1 className="home-banner__title">
                Большие скидки <span className="home-banner__accent">до 50%</span>
              </h1>
              <p className="home-banner__lead">На смартфоны и аксессуары</p>
            </div>
            <img alt="" className="home-banner__art" src={productPhone} />
          </div>

          <ul className="home-hero__offers">
            {HOME_HERO_OFFERS.map((offer) => (
              <li key={offer.id}>
                <article aria-label={offer.title} className="home-offer">
                  <img
                    alt={offer.imageAlt}
                    className="home-offer__art"
                    src={ARTWORK[offer.image]}
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
            <div className="home-promo__content">
              <h2 className="home-promo__title">
                Новинки
                <span className="home-promo__title-line">от GOODCALL</span>
              </h2>
              <p className="home-promo__description">
                Откройте для себя последние модели смартфонов и гаджетов
              </p>
            </div>
            <img alt="" className="home-promo__art" src={brandTech} />
          </section>

          <section className="home-promo home-promo--dark">
            <div className="home-promo__content">
              <h2 className="home-promo__title">Чёрная пятница</h2>
              <p className="home-promo__description">
                Самые выгодные предложения только один раз в году
              </p>
            </div>
            <img alt="" className="home-promo__art" src={promoSaleBags} />
          </section>
        </div>

        <div className="home-category-promos">
          {HOME_CATEGORY_PROMOS.map((promo) => (
            <section className="home-category-promo" key={promo.id}>
              <div className="home-category-promo__content">
                <h2 className="home-category-promo__title">{promo.title}</h2>
                <p className="home-category-promo__description">{promo.description}</p>
              </div>
              <img alt="" className="home-category-promo__art" src={ARTWORK[promo.image]} />
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
            {HOME_CATEGORY_TILES.map((tile) => (
              <li key={tile.label}>
                {categoryLink(
                  tile.label,
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
            {HOME_PRODUCTS.map((product) => (
              <ProductCard
                badge={
                  product.badge === undefined ? undefined : (
                    <span className={`home-badge home-badge--${product.badgeTone ?? 'new'}`}>
                      {product.badge}
                    </span>
                  )
                }
                imageAlt={product.imageAlt}
                imageSrc={ARTWORK[product.image]}
                key={product.id}
                oldPrice={product.oldPrice}
                price={product.price}
                title={product.title}
              />
            ))}
          </div>
        </section>

        <section className="home-cinema">
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
                  <span className="home-article__media" />
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
