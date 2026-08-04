type OwnedActionAttributes = {
  role?: unknown;
  tabIndex?: unknown;
  style?: unknown;
  href?: unknown;
  'aria-label'?: unknown;
  'aria-labelledby'?: unknown;
  'aria-disabled'?: unknown;
  'aria-busy'?: unknown;
};

export function withoutOwnedAttributes<TProps extends object>(
  props: TProps & OwnedActionAttributes
): Omit<TProps, keyof OwnedActionAttributes> {
  const {
    role,
    tabIndex,
    style,
    href,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledby,
    'aria-disabled': ariaDisabled,
    'aria-busy': ariaBusy,
    ...forwarded
  } = props;

  void [role, tabIndex, style, href, ariaLabel, ariaLabelledby, ariaDisabled, ariaBusy];

  return forwarded;
}
