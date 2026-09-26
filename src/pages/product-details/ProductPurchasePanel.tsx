import { useId, useState } from 'react';

import { Button, Chip, Icon, QuantityStepper } from '../../components/ui';
import { PRODUCT_STAR_COUNT, ProductStars } from './ProductStars';
import { formatPoints, formatPrice, formatRating, formatReviewCount } from './productDetailsFormat';
import type { ProductDetailsColourId, ProductDetailsFixture } from './productDetailsFixtures';

interface ProductPurchasePanelProps {
  readonly product: ProductDetailsFixture;
  readonly selectedColourId: ProductDetailsColourId;
  readonly title: string;
  readonly onColourChange: (colourId: ProductDetailsColourId) => void;
}

export function ProductPurchasePanel({
  onColourChange,
  product,
  selectedColourId,
  title,
}: ProductPurchasePanelProps) {
  const [memoryId, setMemoryId] = useState(product.defaultMemoryId);
  const [quantity, setQuantity] = useState(1);
  const optionName = useId();

  const colour = product.colours.find((entry) => entry.id === selectedColourId);
  const memory = product.memories.find((entry) => entry.id === memoryId);
  const monthlyPayment = Math.ceil(product.priceValue / product.installmentMonths);
  const rating = formatRating(product.rating);

  return (
    <div className="product-purchase">
      {product.labels.length === 0 ? null : (
        <ul className="product-purchase__labels">
          {product.labels.map((label) => (
            <li key={label}>
              <Chip>{label}</Chip>
            </li>
          ))}
        </ul>
      )}

      <h1 className="product-purchase__title">{title}</h1>

      <div className="product-purchase__meta">
        <p className="product-purchase__rating">
          <span className="ui-visually-hidden">{`Рейтинг ${rating} из ${String(PRODUCT_STAR_COUNT)}`}</span>
          <ProductStars rating={product.rating} />
          <span aria-hidden="true" className="product-purchase__rating-value">
            {rating}
          </span>
        </p>
        <p className="product-purchase__reviews">{formatReviewCount(product.reviewCount)}</p>
        <p className="product-purchase__sku">Код товара: {product.sku}</p>
      </div>

      <div className="product-purchase__pricing">
        <p className="product-purchase__prices">
          <strong className="product-purchase__price">{formatPrice(product.priceValue)}</strong>
          {product.oldPriceValue === undefined ? null : (
            <del className="product-purchase__old-price">{formatPrice(product.oldPriceValue)}</del>
          )}
          {product.discount === undefined ? null : (
            <span className="product-details-badge">{product.discount}</span>
          )}
        </p>
        <p className="product-purchase__installment">
          <strong>{formatPrice(monthlyPayment)}</strong> × {product.installmentMonths} мес в
          рассрочку
        </p>
        <p className="product-purchase__stock">
          <span className="product-purchase__stock-status">{product.availability}</span>
          <span className="product-purchase__stock-note">{product.deliveryNote}</span>
        </p>
      </div>

      <fieldset className="product-option">
        <legend className="product-option__legend">
          Цвет: <span className="product-option__value">{colour?.label}</span>
        </legend>
        <div className="product-option__swatches">
          {product.colours.map((entry) => (
            <label className="product-option__swatch" key={entry.id}>
              <input
                checked={entry.id === selectedColourId}
                className="product-option__input"
                name={`${optionName}-colour`}
                onChange={() => {
                  onColourChange(entry.id);
                }}
                type="radio"
                value={entry.id}
              />
              <span
                className={`product-option__swatch-dot product-option__swatch-dot--${entry.swatch}`}
              >
                <Icon className="product-option__swatch-mark" name="check" />
              </span>
              <span className="ui-visually-hidden">{entry.label}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="product-option">
        <legend className="product-option__legend">
          Память: <span className="product-option__value">{memory?.label}</span>
        </legend>
        <div className="product-option__choices">
          {product.memories.map((entry) => (
            <label className="product-option__choice" key={entry.id}>
              <input
                checked={entry.id === memoryId}
                className="product-option__input"
                name={`${optionName}-memory`}
                onChange={() => {
                  setMemoryId(entry.id);
                }}
                type="radio"
                value={entry.id}
              />
              <span className="product-option__choice-label">{entry.label}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <ul className="product-purchase__highlights">
        {product.highlights.map((highlight) => (
          <li className="product-purchase__highlight" key={highlight}>
            <Icon className="product-purchase__highlight-icon" name="check" />
            {highlight}
          </li>
        ))}
      </ul>

      <div className="product-purchase__actions">
        <div className="product-purchase__cart-row">
          <QuantityStepper label="Количество товара" onChange={setQuantity} value={quantity} />
          <Button className="product-purchase__cart">В корзину</Button>
        </div>
        <Button className="product-purchase__one-click" variant="secondary">
          Купить в 1 клик
        </Button>
      </div>

      <p className="product-purchase__bonus">
        <Icon className="product-purchase__bonus-icon" name="bonus" />
        <span>
          <strong>+{formatPoints(product.bonusPoints)} бонусов</strong> на бонусную карту
        </span>
      </p>
    </div>
  );
}
