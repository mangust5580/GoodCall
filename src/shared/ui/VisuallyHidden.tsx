import React from 'react';
import styles from './VisuallyHidden.module.scss';
import { classNames } from './class-names';

export type VisuallyHiddenElement = 'span' | 'div';

export interface VisuallyHiddenProps extends Omit<
  React.HTMLAttributes<HTMLElement>,
  'style' | 'hidden' | 'aria-hidden' | 'inert' | 'tabIndex'
> {
  as?: VisuallyHiddenElement;
}

export function VisuallyHidden({
  as: Component = 'span',
  className,
  children,
  ...rest
}: VisuallyHiddenProps): React.ReactElement {
  return (
    <Component className={classNames(styles['visually-hidden'], className)} {...rest}>
      {children}
    </Component>
  );
}
