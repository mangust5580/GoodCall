import productPhone from '../../assets/products/product-phone.svg';
import { ProductRating } from '../../components/product';
import { Chip } from '../../components/ui';
import type { CatalogProduct } from '../catalog/catalogProductFixtures';
import { productColour, productRam, productStorage } from './searchFacets';
import { formatSearchPrice, searchSavings } from './searchResults';

interface SearchResultRowProps {
  readonly product: CatalogProduct;
  readonly href?: string;
}

export function SearchResultRow({ product, href }: SearchResultRowProps) {
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
        <img
          alt={product.imageAlt}
          className="search-row__image"
          src={product.imageSrc ?? productPhone}
        />
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

      <p className="search-row__prices">
        <strong className="product-price search-row__price">
          {formatSearchPrice(product.priceValue)}
        </strong>
        {product.oldPriceValue === undefined ? null : (
          <del className="product-price-old">{formatSearchPrice(product.oldPriceValue)}</del>
        )}
        {savings === undefined ? null : (
          <span className="search-row__savings">{`Выгода ${formatSearchPrice(savings)}`}</span>
        )}
      </p>
    </article>
  );
}
