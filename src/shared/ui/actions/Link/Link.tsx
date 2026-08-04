import React from 'react';
import { Link as RouterLink, type LinkProps as RouterLinkProps } from 'react-router-dom';
import styles from './Link.module.scss';
import { classNames } from '../../internal/class-names';
import { withoutOwnedAttributes } from '../internal/forwarded-props';

export type LinkVariant = 'primary' | 'secondary' | 'tertiary';

export interface LinkProps extends Omit<
  RouterLinkProps,
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
  | 'href'
  | 'children'
> {
  children: React.ReactNode;
  variant?: LinkVariant;
}

export function Link({
  to,
  children,
  variant = 'tertiary',
  className,
  ...rest
}: LinkProps): React.ReactElement {
  return (
    <RouterLink
      {...withoutOwnedAttributes(rest)}
      to={to}
      className={classNames(styles['link'], styles[`variant-${variant}`], className)}
    >
      {children}
    </RouterLink>
  );
}
