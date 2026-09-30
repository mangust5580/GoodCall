import { Picture } from '../../components/media';
import { FavoriteButton } from '../../components/product';
import { Icon } from '../../components/ui';
import type { ProductDetailsGalleryImage } from './productDetailsFixtures';

interface ProductGalleryProps {
  readonly images: readonly ProductDetailsGalleryImage[];
  readonly activeIndex: number;
  readonly onActiveIndexChange: (index: number) => void;
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
  discount,
  favorite,
  images,
  onActiveIndexChange,
}: ProductGalleryProps) {
  const activeImage = images[activeIndex];

  const showImage = (index: number) => {
    onActiveIndexChange((index + images.length) % images.length);
  };

  return (
    <section aria-label="Фотографии товара" className="product-gallery">
      <div className="product-gallery__stage">
        {discount === undefined ? null : (
          <span className="product-details-badge product-gallery__badge">{discount}</span>
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
            alt={`${activeImage.alt}, фото ${String(activeIndex + 1)} из ${String(images.length)}`}
            className="product-gallery__image"
            decoding="async"
            fetchPriority="high"
            key={activeImage.id}
            loading="eager"
            sizes={GALLERY_IMAGE_SIZES}
            source={activeImage.source}
          />
        )}
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
      </div>

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
    </section>
  );
}
