import type { ReactNode } from 'react';

import { Icon } from '../ui';

interface FavoriteButtonProps {
  readonly label: string;
  readonly pressed: boolean;
  readonly onToggle: (pressed: boolean) => void;
  readonly disabled?: boolean;
  readonly className?: string;
}

export function FavoriteButton({
  label,
  pressed,
  onToggle,
  disabled = false,
  className,
}: FavoriteButtonProps) {
  const classes = ['product-action', 'product-action--favorite'];

  if (className) {
    classes.push(className);
  }

  return (
    <button
      aria-label={label}
      aria-pressed={pressed}
      className={classes.join(' ')}
      disabled={disabled}
      onClick={() => {
        onToggle(!pressed);
      }}
      type="button"
    >
      <Icon name="heart" />
    </button>
  );
}

interface AddToCartButtonProps {
  readonly label: string;
  readonly onClick: () => void;
  readonly children?: ReactNode;
  readonly disabled?: boolean;
  readonly className?: string;
}

export function AddToCartButton({
  label,
  onClick,
  children,
  disabled = false,
  className,
}: AddToCartButtonProps) {
  const classes = ['product-action', 'product-action--cart'];

  if (children !== undefined) {
    classes.push('product-action--cart-labelled');
  }

  if (className) {
    classes.push(className);
  }

  return (
    <button
      aria-label={label}
      className={classes.join(' ')}
      disabled={disabled}
      onClick={onClick}
      type="button"
    >
      <Icon name="cart" />
      {children}
    </button>
  );
}
