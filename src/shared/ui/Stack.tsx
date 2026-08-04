import React from 'react';
import styles from './Stack.module.scss';
import { classNames } from './class-names';
import type { SpacingScale } from './spacing';

export type StackElement = 'div' | 'section' | 'article' | 'header' | 'footer' | 'nav';

export type StackDirection = 'block' | 'inline';

export type StackAlign = 'start' | 'center' | 'end' | 'stretch';

export interface StackProps extends Omit<React.HTMLAttributes<HTMLElement>, 'style'> {
  as?: StackElement;
  direction?: StackDirection;
  gap?: SpacingScale;
  align?: StackAlign;
}

export function Stack({
  as: Component = 'div',
  direction = 'block',
  gap = 'md',
  align = 'stretch',
  className,
  children,
  ...rest
}: StackProps): React.ReactElement {
  return (
    <Component
      className={classNames(
        styles['stack'],
        styles[`direction-${direction}`],
        styles[`gap-${gap}`],
        styles[`align-${align}`],
        className
      )}
      {...rest}
    >
      {children}
    </Component>
  );
}
