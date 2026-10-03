import { Picture } from '../../components/media';
import type { PictureSource } from '../../components/media';
import { Icon } from '../../components/ui';
import type { ProductDetailsDescription } from './productDetailsView';

interface ProductDescriptionProps {
  readonly description: ProductDetailsDescription;
  readonly image?: PictureSource;
}

const DESCRIPTION_IMAGE_SIZES = '(max-width: 1023px) 100vw, 520px';

export function ProductDescription({ description, image }: ProductDescriptionProps) {
  return (
    <div className="product-panel product-description">
      <div
        className={
          image === undefined
            ? 'product-description__intro product-description__intro--text'
            : 'product-description__intro'
        }
      >
        <div className="product-description__copy">
          <h2 className="product-panel__title">{description.title}</h2>
          {description.paragraphs.map((paragraph) => (
            <p className="product-description__text" key={paragraph}>
              {paragraph}
            </p>
          ))}
        </div>
        {image === undefined ? null : (
          <div className="product-description__media">
            <Picture
              alt=""
              className="product-description__image"
              decoding="async"
              sizes={DESCRIPTION_IMAGE_SIZES}
              source={image}
            />
          </div>
        )}
      </div>

      <ul className="product-description__features">
        {description.features.map((feature) => (
          <li className="product-description__feature" key={feature.title}>
            <Icon className="product-description__feature-icon" name={feature.icon} />
            <h3 className="product-description__feature-title">{feature.title}</h3>
            <p className="product-description__feature-text">{feature.text}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
