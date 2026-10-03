import { Picture } from '../../components/media';
import type { PictureSource } from '../../components/media';
import { Icon } from '../../components/ui';
import type { ProductDetailsTrustItem } from './productDetailsView';

interface ProductWarrantyProps {
  readonly items: readonly ProductDetailsTrustItem[];
  readonly image?: PictureSource;
  readonly supportPhone: string;
  readonly supportPhoneHref: string;
  readonly supportHours: string;
}

const WARRANTY_IMAGE_SIZES = '(max-width: 767px) 100vw, (max-width: 1199px) 44vw, 360px';

export function ProductWarranty({
  items,
  image,
  supportPhone,
  supportPhoneHref,
  supportHours,
}: ProductWarrantyProps) {
  return (
    <div className="product-panel product-warranty">
      <div
        className={
          image === undefined
            ? 'product-warranty__intro product-warranty__intro--text'
            : 'product-warranty__intro'
        }
      >
        <div className="product-warranty__copy">
          <h2 className="product-panel__title">Гарантия и возврат</h2>
          <p className="product-warranty__lead">
            Поддержка по гарантии, обмену и возврату доступна ежедневно.
          </p>
        </div>
        {image === undefined ? null : (
          <div className="product-warranty__media">
            <Picture
              alt=""
              className="product-warranty__image"
              decoding="async"
              sizes={WARRANTY_IMAGE_SIZES}
              source={image}
            />
          </div>
        )}
      </div>

      <ul className="product-warranty__list">
        {items.map((item) => (
          <li className="product-warranty__item" key={item.title}>
            <Icon className="product-warranty__icon" name={item.icon} />
            <h3 className="product-warranty__title">{item.title}</h3>
            <p className="product-warranty__text">{item.text}</p>
          </li>
        ))}
      </ul>

      <p className="product-warranty__support">
        <Icon className="product-info-list__icon" name="headset" />
        <span>
          Вопросы по гарантии и обмену:{' '}
          <a className="product-warranty__phone" href={supportPhoneHref}>
            {supportPhone}
          </a>
          , {supportHours.toLowerCase()}
        </span>
      </p>
    </div>
  );
}
