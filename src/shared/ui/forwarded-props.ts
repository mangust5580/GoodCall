type OwnedActionAttributes = {
  role?: unknown;
  tabIndex?: unknown;
  style?: unknown;
  href?: unknown;
  hidden?: unknown;
  inert?: unknown;
  dangerouslySetInnerHTML?: unknown;
  'aria-label'?: unknown;
  'aria-labelledby'?: unknown;
  'aria-disabled'?: unknown;
  'aria-busy'?: unknown;
  'aria-hidden'?: unknown;
};

export function withoutOwnedAttributes<TProps extends object>(
  props: TProps & OwnedActionAttributes
): Omit<TProps, keyof OwnedActionAttributes> {
  const {
    role,
    tabIndex,
    style,
    href,
    hidden,
    inert,
    dangerouslySetInnerHTML,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledby,
    'aria-disabled': ariaDisabled,
    'aria-busy': ariaBusy,
    'aria-hidden': ariaHidden,
    ...forwarded
  } = props;

  void [
    role,
    tabIndex,
    style,
    href,
    hidden,
    inert,
    dangerouslySetInnerHTML,
    ariaLabel,
    ariaLabelledby,
    ariaDisabled,
    ariaBusy,
    ariaHidden,
  ];

  return forwarded;
}
