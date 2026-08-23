export type IconName =
  | 'search'
  | 'calendar'
  | 'clock'
  | 'chevron-down'
  | 'chevron-left'
  | 'chevron-right'
  | 'heart'
  | 'headset'
  | 'cart'
  | 'phone'
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
  | 'tools'
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
