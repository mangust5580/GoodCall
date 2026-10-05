import { CartLineMedia, lineDiscountPercent, lineListTotal, lineTotal } from '../../commerce/cart';
import type { CartLine } from '../../commerce/cart';
import { formatPrice } from '../../commerce/format';
import { Button, Checkbox, Chip, Icon, QuantityStepper } from '../../components/ui';

interface CartLineItemProps {
  readonly line: CartLine;
  readonly onToggle: (selected: boolean) => void;
  readonly onQuantityChange: (quantity: number) => void;
  readonly onRemove: () => void;
}

const LINE_MEDIA_SIZES = '(max-width: 559px) 72px, 96px';

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
        <CartLineMedia
          className="cart-line__image"
          image={line.image}
          productSlug={line.productSlug}
          sizes={LINE_MEDIA_SIZES}
        />
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
