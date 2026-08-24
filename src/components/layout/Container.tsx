import type { HTMLAttributes } from 'react';

export type ContainerProps = HTMLAttributes<HTMLDivElement>;

export function Container({ className, ...rest }: ContainerProps) {
  return (
    <div className={className ? `layout-container ${className}` : 'layout-container'} {...rest} />
  );
}
