import { PRODUCT_DETAILS_GALLERY_BY_COLOUR_MEDIA } from '../../assets/media/product-details/productDetailsMedia';
import { productThumbnail } from '../../assets/media/product-details/productThumbnailMedia';
import productPhone from '../../assets/products/product-phone.svg';
import { Picture } from '../../components/media';
import type { CartLineImage } from './cartStore';

interface CartLineMediaProps {
  readonly image: CartLineImage;
  readonly className: string;
  readonly sizes: string;
  readonly productSlug?: string;
}

export function CartLineMedia({ image, className, sizes, productSlug }: CartLineMediaProps) {
  if (image.kind === 'product-details') {
    return (
      <Picture
        alt=""
        className={className}
        sizes={sizes}
        source={PRODUCT_DETAILS_GALLERY_BY_COLOUR_MEDIA[image.colourId].heroFront}
      />
    );
  }

  const thumbnail =
    image.kind === 'catalog-fallback' && productSlug !== undefined
      ? productThumbnail(productSlug)
      : undefined;

  if (thumbnail !== undefined) {
    return <Picture alt="" className={className} sizes={sizes} source={thumbnail} />;
  }

  return (
    <img
      alt=""
      className={className}
      decoding="async"
      loading="lazy"
      src={image.kind === 'url' ? image.src : productPhone}
    />
  );
}
