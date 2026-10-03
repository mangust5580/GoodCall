import { PRODUCT_DETAILS_GALLERY_BY_COLOUR_MEDIA } from '../../assets/media/product-details/productDetailsMedia';
import productPhone from '../../assets/products/product-phone.svg';
import { Picture } from '../../components/media';
import type { CartLineImage } from './cartStore';

interface CartLineMediaProps {
  readonly image: CartLineImage;
  readonly className: string;
  readonly sizes: string;
}

export function CartLineMedia({ image, className, sizes }: CartLineMediaProps) {
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
