import type { ButtonHTMLAttributes } from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'text' | 'danger';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  readonly variant?: ButtonVariant;
}

export function Button({ variant = 'primary', className, type = 'button', ...rest }: ButtonProps) {
  const classes = ['ui-button', `ui-button--${variant}`];

  if (className) {
    classes.push(className);
  }

  return <button className={classes.join(' ')} type={type} {...rest} />;
}
