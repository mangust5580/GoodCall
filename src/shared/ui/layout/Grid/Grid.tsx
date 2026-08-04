import React from 'react';
import styles from './Grid.module.scss';
import { classNames } from '../../internal/class-names';
import type { SpacingScale } from '../internal/spacing';

export type GridElement = 'div' | 'section';

export type GridMinItemWidth = 'sm' | 'md' | 'lg';

export interface GridProps extends Omit<React.HTMLAttributes<HTMLElement>, 'style'> {
  as?: GridElement;
  gap?: SpacingScale;
  minItemWidth?: GridMinItemWidth;
}

export function Grid({
  as: Component = 'div',
  gap = 'md',
  minItemWidth = 'md',
  className,
  children,
  ...rest
}: GridProps): React.ReactElement {
  return (
    <Component
      className={classNames(
        styles['grid'],
        styles[`min-item-${minItemWidth}`],
        styles[`gap-${gap}`],
        className
      )}
      {...rest}
    >
      {children}
    </Component>
  );
}
