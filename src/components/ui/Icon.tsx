export type IconName =
  | 'search'
  | 'calendar'
  | 'chevron-down'
  | 'chevron-left'
  | 'chevron-right'
  | 'heart'
  | 'cart'
  | 'star'
  | 'plus'
  | 'minus'
  | 'check'
  | 'close';

interface IconProps {
  readonly name: IconName;
  readonly className?: string;
}

export function Icon({ name, className }: IconProps) {
  const classes = ['ui-icon', `ui-icon--${name}`];

  if (className) {
    classes.push(className);
  }

  return <span aria-hidden="true" className={classes.join(' ')} />;
}
