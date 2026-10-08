import { Picture } from '../../components/media';
import { FavoriteButton, ProductBadge } from '../../components/product';
import { Icon } from '../../components/ui';
import type { ProductDetailsGalleryImage } from './productDetailsView';

interface ProductGalleryProps {
  readonly images: readonly ProductDetailsGalleryImage[];
  readonly activeIndex: number;
  readonly onActiveIndexChange: (index: number) => void;
  readonly decorative?: boolean;
  readonly discount?: string;
  readonly favorite?: ProductFavoriteBinding;
}

export interface ProductFavoriteBinding {
  readonly pressed: boolean;
  readonly onToggle: (pressed: boolean) => void;
}

function ignoreFavoriteToggle(): void {
  return;
}

const GALLERY_IMAGE_SIZES = '(max-width: 767px) 72vw, (max-width: 1199px) 34vw, 420px';
const GALLERY_THUMB_SIZES = '(max-width: 767px) 18vw, 76px';

export function ProductGallery({
  activeIndex,
  decorative = false,
  discount,
  favorite,
  images,
  onActiveIndexChange,
}: ProductGalleryProps) {
  const activeImage = images[activeIndex];
  const browsable = images.length > 1;

  const showImage = (index: number) => {
    onActiveIndexChange((index + images.length) % images.length);
  };

  return (
    <section
      aria-label={decorative ? 'Изображение товара' : 'Фотографии товара'}
      className="product-gallery"
    >
      <div className="product-gallery__stage">
        {discount === undefined ? null : (
          <ProductBadge className="product-gallery__badge" tone="sale">
            {discount}
          </ProductBadge>
        )}
        <FavoriteButton
          className="product-gallery__favorite"
          disabled={favorite === undefined}
          label="Добавить в избранное"
          onToggle={favorite?.onToggle ?? ignoreFavoriteToggle}
          pressed={favorite?.pressed ?? false}
        />
        {activeImage === undefined ? null : (
          <Picture
            alt={
              decorative
                ? ''
                : browsable
                  ? `${activeImage.alt}, фото ${String(activeIndex + 1)} из ${String(images.length)}`
                  : activeImage.alt
            }
            className="product-gallery__image"
            decoding="async"
            fetchPriority="high"
            key={activeImage.id}
            loading="eager"
            sizes={GALLERY_IMAGE_SIZES}
            source={activeImage.source}
          />
        )}
        {browsable ? (
          <>
            <button
              aria-label="Предыдущее фото"
              className="product-gallery__arrow product-gallery__arrow--previous"
              onClick={() => {
                showImage(activeIndex - 1);
              }}
              type="button"
            >
              <Icon name="chevron-left" />
            </button>
            <button
              aria-label="Следующее фото"
              className="product-gallery__arrow product-gallery__arrow--next"
              onClick={() => {
                showImage(activeIndex + 1);
              }}
              type="button"
            >
              <Icon name="chevron-right" />
            </button>
          </>
        ) : null}
      </div>

      {browsable ? (
        <ul className="product-gallery__thumbs">
          {images.map((image, index) => (
            <li key={image.id}>
              <button
                aria-current={index === activeIndex ? 'true' : undefined}
                aria-label={`Показать фото ${String(index + 1)} из ${String(images.length)}`}
                className="product-gallery__thumb"
                onClick={() => {
                  showImage(index);
                }}
                type="button"
              >
                <Picture
                  alt=""
                  className="product-gallery__thumb-image"
                  sizes={GALLERY_THUMB_SIZES}
                  source={image.source}
                />
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}
