import productPhone from '../../assets/products/product-phone.svg';
import { formatPrice } from '../../commerce/format';
import { ProductBadge, ProductCard } from '../../components/product';
import type { CatalogProduct } from './catalogProduct';

export interface CatalogCartSeam {
  readonly quantityOf: (product: CatalogProduct) => number | undefined;
  readonly add: (product: CatalogProduct) => number;
  readonly setQuantity: (product: CatalogProduct, quantity: number) => void;
}

export interface CatalogFavoritesSeam {
  readonly isFavorite: (product: CatalogProduct) => boolean;
  readonly toggle: (product: CatalogProduct, pressed: boolean) => void;
}

export interface CatalogCompareSeam {
  readonly isCompared: (product: CatalogProduct) => boolean;
  readonly full: boolean;
  readonly fullLabel: (product: CatalogProduct) => string;
  readonly toggle: (product: CatalogProduct, pressed: boolean) => void;
}

interface CatalogProductCardProps {
  readonly product: CatalogProduct;
  readonly productHref?: (slug: string) => string | undefined;
  readonly cart?: CatalogCartSeam;
  readonly favorites?: CatalogFavoritesSeam;
  readonly compare?: CatalogCompareSeam;
  readonly onAnnounce: (message: string) => void;
}

export function CatalogProductCard({
  cart,
  compare,
  favorites,
  onAnnounce,
  product,
  productHref,
}: CatalogProductCardProps) {
  const quantity = cart?.quantityOf(product);
  const compared = compare?.isCompared(product) ?? false;
  const compareFull = compare !== undefined && compare.full && !compared;

  return (
    <ProductCard
      badge={
        product.badge === undefined ? undefined : (
          <ProductBadge tone={product.discounted === true ? 'sale' : 'new'}>
            {product.badge}
          </ProductBadge>
        )
      }
      compareDisabled={compare === undefined || compareFull}
      compareLabel={compareFull ? compare.fullLabel(product) : undefined}
      comparePressed={compared}
      disabled={cart === undefined}
      favoritePressed={favorites?.isFavorite(product) ?? false}
      href={productHref?.(product.id)}
      imageAlt={product.imageAlt}
      image={product.image}
      imageSrc={product.imageSrc ?? productPhone}
      oldPrice={
        product.oldPriceValue === undefined ? undefined : formatPrice(product.oldPriceValue)
      }
      onAddToCart={() => {
        if (cart === undefined) {
          return;
        }

        const lineQuantity = cart.add(product);
        onAnnounce(
          `Товар добавлен в корзину: ${product.title}. В корзине: ${String(lineQuantity)} шт.`,
        );
      }}
      onCompareToggle={(pressed) => {
        compare?.toggle(product, pressed);
      }}
      onFavoriteToggle={(pressed) => {
        favorites?.toggle(product, pressed);
      }}
      allowZeroQuantity
      onQuantityChange={
        cart === undefined || quantity === undefined
          ? undefined
          : (value) => {
              cart.setQuantity(product, value);

              if (value === 0) {
                onAnnounce(`Товар удалён из корзины: ${product.title}`);
              }
            }
      }
      price={formatPrice(product.priceValue)}
      quantity={quantity}
      rating={product.rating}
      reviewCount={product.reviewCount}
      title={product.title}
    />
  );
}
