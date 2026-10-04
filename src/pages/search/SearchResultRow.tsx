import productPhone from '../../assets/products/product-phone.svg';
import { formatPrice } from '../../commerce/format';
import { Picture } from '../../components/media';
import { AddToCartButton, ProductRating } from '../../components/product';
import { Chip, QuantityStepper } from '../../components/ui';
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
}

export function SearchResultRow({
  product,
  href,
  quantity,
  onAddToCart,
  onQuantityChange,
  disabled,
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
            <Chip variant={product.discounted === true ? 'danger' : 'brand'}>{product.badge}</Chip>
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
