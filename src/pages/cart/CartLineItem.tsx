import productPhone from '../../assets/products/product-phone.svg';
import { Picture } from '../../components/media';
import { Button, Checkbox, Chip, Icon, QuantityStepper } from '../../components/ui';
import { PRODUCT_DETAILS_FIXTURE } from '../product-details/productDetailsFixtures';
import type { CartLine, CartLineImage } from './cartStore';
import { formatPrice, lineDiscountPercent, lineListTotal, lineTotal } from './cartPricing';

interface CartLineItemProps {
  readonly line: CartLine;
  readonly onToggle: (selected: boolean) => void;
  readonly onQuantityChange: (quantity: number) => void;
  readonly onRemove: () => void;
}

const LINE_MEDIA_SIZES = '(max-width: 559px) 72px, 96px';

function CartLineMedia({ image }: { readonly image: CartLineImage }) {
  if (image.kind === 'product-details') {
    const source = PRODUCT_DETAILS_FIXTURE.galleryByColour[image.colourId][0]?.source;

    if (source !== undefined) {
      return (
        <Picture alt="" className="cart-line__image" sizes={LINE_MEDIA_SIZES} source={source} />
      );
    }
  }

  return (
    <img
      alt=""
      className="cart-line__image"
      decoding="async"
      loading="lazy"
      src={image.kind === 'url' ? image.src : productPhone}
    />
  );
}

export function CartLineItem({ line, onToggle, onQuantityChange, onRemove }: CartLineItemProps) {
  const listTotal = lineListTotal(line);
  const discountPercent = lineDiscountPercent(line);

  return (
    <li className="cart-line">
      <div className="cart-line__check">
        <Checkbox
          checked={line.selected}
          label={<span className="ui-visually-hidden">{`Выбрать: ${line.title}`}</span>}
          onChange={onToggle}
        />
      </div>

      <div className="cart-line__media">
        <CartLineMedia image={line.image} />
      </div>

      <div className="cart-line__info">
        <p className="cart-line__title">{line.title}</p>
        {line.variant === undefined ? null : <p className="cart-line__variant">{line.variant}</p>}
      </div>

      <div className="cart-line__controls">
        <QuantityStepper
          decreaseLabel={`Уменьшить количество: ${line.title}`}
          increaseLabel={`Увеличить количество: ${line.title}`}
          label={`Количество: ${line.title}`}
          onChange={onQuantityChange}
          value={line.quantity}
        />
        <Button
          aria-label={`Удалить из корзины: ${line.title}`}
          className="cart-line__remove"
          onClick={onRemove}
          variant="text"
        >
          <Icon name="close" />
          Удалить
        </Button>
      </div>

      <div className="cart-line__price">
        <strong className="cart-line__total">{formatPrice(lineTotal(line))}</strong>
        {listTotal === undefined || discountPercent === undefined ? null : (
          <span className="cart-line__discount">
            <del className="cart-line__old">{formatPrice(listTotal)}</del>
            <Chip variant="danger">{`-${discountPercent}%`}</Chip>
          </span>
        )}
        {line.quantity > 1 ? (
          <span className="cart-line__unit">{`${formatPrice(line.price)} за шт.`}</span>
        ) : null}
      </div>
    </li>
  );
}
