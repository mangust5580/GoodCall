import React from 'react';
import styles from './Button.module.scss';
import { classNames } from './class-names';
import { withoutOwnedAttributes } from './forwarded-props';
import type { ActionVariant } from './action-variant';

export interface ButtonProps extends Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  | 'style'
  | 'role'
  | 'tabIndex'
  | 'aria-disabled'
  | 'aria-label'
  | 'aria-labelledby'
  | 'aria-busy'
  | 'children'
> {
  children: React.ReactNode;
  variant?: ActionVariant;
  isLoading?: boolean;
}

export function Button({
  children,
  variant = 'primary',
  isLoading = false,
  disabled = false,
  type = 'button',
  className,
  ...rest
}: ButtonProps): React.ReactElement {
  return (
    <button
      {...withoutOwnedAttributes(rest)}
      type={type}
      disabled={disabled || isLoading}
      aria-busy={isLoading || undefined}
      className={classNames(styles['button'], styles[`variant-${variant}`], className)}
    >
      <span className={styles['label']}>{children}</span>
      {isLoading ? <span className={styles['indicator']} aria-hidden="true" /> : null}
    </button>
  );
}
