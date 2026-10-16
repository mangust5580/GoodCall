import productPhone from '../../assets/products/product-phone.svg';
import { formatPrice } from '../../commerce/format';
import { Picture } from '../../components/media';
import {
  AddToCartButton,
  CompareButton,
  FavoriteButton,
  ProductBadge,
  ProductRating,
} from '../../components/product';
import { QuantityStepper } from '../../components/ui';
import type { CatalogProduct } from '../catalog';
import { productColour, productRam, productStorage } from './searchFacets';
import { searchSavings } from './searchResults';

const ROW_IMAGE_SIZES = '136px';

const CART_ACTION_TEXT = 'В корзину';

interface SearchResultRowProps {
  readonly product: CatalogProduct;
  readonly href?: string;
  readonly quantity?: number;
  readonly onAddToCart: () => void;
  readonly onQuantityChange: (value: number) => void;
  readonly disabled: boolean;
  readonly favoritePressed?: boolean;
  readonly onFavoriteToggle?: (pressed: boolean) => void;
  readonly comparePressed?: boolean;
  readonly compareDisabled?: boolean;
  readonly compareLabel?: string;
  readonly onCompareToggle?: (pressed: boolean) => void;
}

export function SearchResultRow({
  product,
  href,
  quantity,
  onAddToCart,
  onQuantityChange,
  disabled,
  favoritePressed = false,
  onFavoriteToggle,
  comparePressed = false,
  compareDisabled = false,
  compareLabel,
  onCompareToggle,
}: SearchResultRowProps) {
  const ram = productRam(product);
  const storage = productStorage(product);
  const meta = [
    ram === undefined ? undefined : `${ram} ГБ ОЗУ`,
    storage === undefined ? undefined : `${storage} ГБ`,
    productColour(product),
  ]
    .filter((part) => part !== undefined)
    .join(' · ');
  const savings = searchSavings(product.priceValue, product.oldPriceValue);

  return (
    <article className="search-row">
      <div className="search-row__media">
        {product.badge === undefined ? null : (
          <div className="search-row__badge">
            <ProductBadge tone={product.discounted === true ? 'sale' : 'new'}>
              {product.badge}
            </ProductBadge>
          </div>
        )}
        {product.image === undefined ? (
          <img
            alt={product.imageAlt}
            className="search-row__image"
            src={product.imageSrc ?? productPhone}
          />
        ) : (
          <Picture
            alt={product.imageAlt}
            className="search-row__image"
            sizes={ROW_IMAGE_SIZES}
            source={product.image}
          />
        )}
        {onFavoriteToggle === undefined ? null : (
          <FavoriteButton
            className="search-row__favorite"
            label={
              favoritePressed
                ? `Убрать из избранного: ${product.title}`
                : `Добавить в избранное: ${product.title}`
            }
            onToggle={onFavoriteToggle}
            pressed={favoritePressed}
          />
        )}
        {onCompareToggle === undefined ? null : (
          <CompareButton
            className="search-row__compare"
            disabled={compareDisabled}
            label={
              compareLabel ??
              (comparePressed
                ? `Убрать из сравнения: ${product.title}`
                : `Добавить к сравнению: ${product.title}`)
            }
            onToggle={onCompareToggle}
            pressed={comparePressed}
          />
        )}
      </div>

      <div className="search-row__info">
        <h3 className="search-row__title">
          {href === undefined ? (
            product.title
          ) : (
            <a className="search-row__link" href={href}>
              {product.title}
            </a>
          )}
        </h3>
        {meta === '' ? null : <p className="search-row__meta">{meta}</p>}
        {product.rating === undefined ? null : (
          <ProductRating rating={product.rating} reviewCount={product.reviewCount} />
        )}
      </div>

      <div className="search-row__aside">
        <p className="search-row__prices">
          <strong className="product-price search-row__price">
            {formatPrice(product.priceValue)}
          </strong>
          {product.oldPriceValue === undefined ? null : (
            <del className="product-price-old">{formatPrice(product.oldPriceValue)}</del>
          )}
          {savings === undefined ? null : (
            <span className="search-row__savings">{`Выгода ${formatPrice(savings)}`}</span>
          )}
        </p>
        <div className="search-row__actions">
          {quantity === undefined ? null : (
            <QuantityStepper
              label={`Количество: ${product.title}`}
              onChange={onQuantityChange}
              value={quantity}
            />
          )}
          <AddToCartButton
            disabled={disabled}
            label={`${CART_ACTION_TEXT}: ${product.title}`}
            onClick={onAddToCart}
          >
            {CART_ACTION_TEXT}
          </AddToCartButton>
        </div>
      </div>
    </article>
  );
}
