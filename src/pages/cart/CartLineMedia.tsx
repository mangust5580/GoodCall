import productPhone from '../../assets/products/product-phone.svg';
import { Picture } from '../../components/media';
import { PRODUCT_DETAILS_FIXTURE } from '../product-details/productDetailsFixtures';
import type { CartLineImage } from './cartStore';

interface CartLineMediaProps {
  readonly image: CartLineImage;
  readonly className: string;
  readonly sizes: string;
}

export function CartLineMedia({ image, className, sizes }: CartLineMediaProps) {
  if (image.kind === 'product-details') {
    const source = PRODUCT_DETAILS_FIXTURE.galleryByColour[image.colourId][0]?.source;

    if (source !== undefined) {
      return <Picture alt="" className={className} sizes={sizes} source={source} />;
    }
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
