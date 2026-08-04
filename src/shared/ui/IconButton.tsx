import React from 'react';
import styles from './IconButton.module.scss';
import { classNames } from './class-names';
import { withoutOwnedAttributes } from './forwarded-props';
import type { ActionVariant } from './action-variant';

export interface IconButtonProps extends Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  | 'style'
  | 'role'
  | 'tabIndex'
  | 'hidden'
  | 'inert'
  | 'dangerouslySetInnerHTML'
  | 'aria-disabled'
  | 'aria-label'
  | 'aria-labelledby'
  | 'aria-busy'
  | 'aria-hidden'
  | 'children'
> {
  label: string;
  children: React.ReactNode;
  variant?: ActionVariant;
  isLoading?: boolean;
}

export function IconButton({
  label,
  children,
  variant = 'tertiary',
  isLoading = false,
  disabled = false,
  type = 'button',
  className,
  ...rest
}: IconButtonProps): React.ReactElement {
  if (label.trim().length === 0) {
    throw new Error('IconButton requires a non-empty label: it is the only accessible name source');
  }

  return (
    <button
      {...withoutOwnedAttributes(rest)}
      type={type}
      aria-label={label}
      disabled={disabled || isLoading}
      aria-busy={isLoading || undefined}
      className={classNames(styles['icon-button'], styles[`variant-${variant}`], className)}
    >
      {isLoading ? (
        <span className={styles['indicator']} aria-hidden="true" />
      ) : (
        <span className={styles['visual']} aria-hidden="true">
          {children}
        </span>
      )}
    </button>
  );
}
