export type IconName =
  | 'search'
  | 'calendar'
  | 'chevron-down'
  | 'chevron-left'
  | 'chevron-right'
  | 'heart'
  | 'headset'
  | 'cart'
  | 'star'
  | 'plus'
  | 'minus'
  | 'check'
  | 'close'
  | 'person'
  | 'package'
  | 'compare'
  | 'return'
  | 'bonus'
  | 'map-pin'
  | 'settings'
  | 'log-out'
  | 'edit';

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
