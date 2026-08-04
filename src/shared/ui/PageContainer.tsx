import React from 'react';
import styles from './PageContainer.module.scss';
import { classNames } from './class-names';

export type PageContainerElement =
  'div' | 'section' | 'article' | 'header' | 'footer' | 'main' | 'nav';

export type PageContainerWidth = 'content' | 'text';

export interface PageContainerProps extends Omit<React.HTMLAttributes<HTMLElement>, 'style'> {
  as?: PageContainerElement;
  width?: PageContainerWidth;
}

export function PageContainer({
  as: Component = 'div',
  width = 'content',
  className,
  children,
  ...rest
}: PageContainerProps): React.ReactElement {
  return (
    <Component
      className={classNames(styles['page-container'], styles[`width-${width}`], className)}
      {...rest}
    >
      {children}
    </Component>
  );
}
