import cartEmptyArtwork from '../../assets/marketing/cart-empty.svg';
import { Icon } from '../../components/ui';
import { CART_CATEGORIES } from './cartFixtures';

interface CartEmptyStateProps {
  readonly homeHref: string;
  readonly catalogHref: string;
}

export function CartEmptyState({ homeHref, catalogHref }: CartEmptyStateProps) {
  return (
    <>
      <section aria-labelledby="cart-empty-title" className="cart-empty">
        <img
          alt=""
          className="cart-empty__artwork"
          height={300}
          src={cartEmptyArtwork}
          width={360}
        />
        <h1 className="cart-empty__title" id="cart-empty-title" tabIndex={-1}>
          Корзина пуста
        </h1>
        <p className="cart-empty__message">
          Похоже, вы ещё не добавили товары. Загляните в каталог и найдите то, что вам нужно.
        </p>
        <div className="cart-empty__actions">
          <a className="ui-button ui-button--primary cart-empty__action" href={catalogHref}>
            Перейти к смартфонам
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
                <a className="cart-categories__item cart-categories__item--link" href={catalogHref}>
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
    </>
  );
}
