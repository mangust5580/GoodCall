import React from 'react';
import { Link as RouterLink, type LinkProps as RouterLinkProps } from 'react-router-dom';
import styles from './Link.module.scss';
import { classNames } from './class-names';

export type LinkVariant = 'primary' | 'secondary' | 'tertiary';

export interface LinkProps extends Omit<
  RouterLinkProps,
  'style' | 'role' | 'aria-disabled' | 'aria-label' | 'aria-labelledby' | 'href' | 'children'
> {
  children: React.ReactNode;
  variant?: LinkVariant;
}

export function Link({
  children,
  variant = 'tertiary',
  className,
  ...rest
}: LinkProps): React.ReactElement {
  return (
    <RouterLink
      className={classNames(styles['link'], styles[`variant-${variant}`], className)}
      {...rest}
    >
      {children}
    </RouterLink>
  );
}
