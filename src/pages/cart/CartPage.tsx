import cartEmptyArtwork from '../../assets/marketing/cart-empty.svg';
import { BenefitsStrip } from '../../components/content';
import { Container } from '../../components/layout';
import { ProductCard } from '../../components/product';
import { Chip, Icon } from '../../components/ui';
import { CART_BENEFITS, CART_CATEGORIES, CART_RECOMMENDATIONS } from './cartFixtures';

export interface CartPageProps {
  readonly homeHref: string;
  readonly catalogHref: string;
}

const RECOMMENDATION_MEDIA_SIZES = '(max-width: 520px) 240px, 220px';

export function CartPage({ homeHref, catalogHref }: CartPageProps) {
  return (
    <main className="cart-page">
      <Container>
        <nav aria-label="Хлебные крошки" className="cart-page__breadcrumbs">
          <ol className="cart-page__crumbs">
            <li className="cart-page__crumb">
              <a className="cart-page__crumb-link" href={homeHref}>
                Главная
              </a>
            </li>
            <li aria-current="page" className="cart-page__crumb">
              Корзина
            </li>
          </ol>
        </nav>

        <section aria-labelledby="cart-empty-title" className="cart-empty">
          <img
            alt=""
            className="cart-empty__artwork"
            height={300}
            src={cartEmptyArtwork}
            width={360}
          />
          <h1 className="cart-empty__title" id="cart-empty-title">
            Корзина пуста
          </h1>
          <p className="cart-empty__message">
            Похоже, вы ещё не добавили товары. Загляните в каталог и найдите то, что вам нужно.
          </p>
          <div className="cart-empty__actions">
            <a className="ui-button ui-button--primary cart-empty__action" href={catalogHref}>
              Перейти в каталог
            </a>
            <a className="ui-button ui-button--secondary cart-empty__action" href={homeHref}>
              На главную
            </a>
          </div>
        </section>

        <section aria-labelledby="cart-categories-title" className="cart-categories">
          <h2 className="cart-categories__title" id="cart-categories-title">
            Популярные категории
          </h2>
          <ul className="cart-categories__list">
            {CART_CATEGORIES.map((category) => (
              <li key={category.label}>
                {category.linksToCatalog ? (
                  <a
                    className="cart-categories__item cart-categories__item--link"
                    href={catalogHref}
                  >
                    <Icon className="cart-categories__icon" name={category.icon} />
                    {category.label}
                  </a>
                ) : (
                  <span className="cart-categories__item">
                    <Icon className="cart-categories__icon" name={category.icon} />
                    {category.label}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </section>

        <div className="cart-page__benefits">
          <BenefitsStrip items={CART_BENEFITS} label="Преимущества GoodCall" />
        </div>

        <section aria-labelledby="cart-recommendations-title" className="cart-recommendations">
          <h2 className="cart-recommendations__title" id="cart-recommendations-title">
            Вам может понравиться
          </h2>
          <div className="cart-recommendations__grid">
            {CART_RECOMMENDATIONS.map((product) => (
              <ProductCard
                badge={
                  product.badge === undefined ? undefined : (
                    <Chip variant={product.badge.tone === 'sale' ? 'danger' : 'brand'}>
                      {product.badge.label}
                    </Chip>
                  )
                }
                image={product.image}
                imageAlt={product.imageAlt}
                imageSizes={RECOMMENDATION_MEDIA_SIZES}
                key={product.id}
                oldPrice={product.oldPrice}
                price={product.price}
                rating={product.rating}
                reviewCount={product.reviewCount}
                title={product.title}
              />
            ))}
          </div>
        </section>
      </Container>
    </main>
  );
}
