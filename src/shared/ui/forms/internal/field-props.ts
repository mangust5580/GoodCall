type FieldConflictAttributes = {
  children?: unknown;
  style?: unknown;
  role?: unknown;
  tabIndex?: unknown;
  hidden?: unknown;
  inert?: unknown;
  contentEditable?: unknown;
  dangerouslySetInnerHTML?: unknown;
  autoFocus?: unknown;
  'aria-label'?: unknown;
  'aria-labelledby'?: unknown;
  'aria-invalid'?: unknown;
  'aria-errormessage'?: unknown;
  'aria-disabled'?: unknown;
  'aria-readonly'?: unknown;
  'aria-required'?: unknown;
  'aria-busy'?: unknown;
  'aria-hidden'?: unknown;
  'aria-checked'?: unknown;
};

type SelectConflictAttributes = {
  multiple?: unknown;
  size?: unknown;
  readOnly?: unknown;
};

type ChoiceConflictAttributes = {
  type?: unknown;
  readOnly?: unknown;
  indeterminate?: unknown;
};

export type FieldForbiddenProp = keyof FieldConflictAttributes;

export type SelectForbiddenProp = FieldForbiddenProp | keyof SelectConflictAttributes;

export type ChoiceForbiddenProp = FieldForbiddenProp | keyof ChoiceConflictAttributes;

export function withoutFieldConflicts<TProps extends object>(
  props: TProps & FieldConflictAttributes
): Omit<TProps, FieldForbiddenProp> {
  const {
    children,
    style,
    role,
    tabIndex,
    hidden,
    inert,
    contentEditable,
    dangerouslySetInnerHTML,
    autoFocus,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledby,
    'aria-invalid': ariaInvalid,
    'aria-errormessage': ariaErrormessage,
    'aria-disabled': ariaDisabled,
    'aria-readonly': ariaReadonly,
    'aria-required': ariaRequired,
    'aria-busy': ariaBusy,
    'aria-hidden': ariaHidden,
    'aria-checked': ariaChecked,
    ...forwarded
  } = props;

  void [
    children,
    style,
    role,
    tabIndex,
    hidden,
    inert,
    contentEditable,
    dangerouslySetInnerHTML,
    autoFocus,
    ariaLabel,
    ariaLabelledby,
    ariaInvalid,
    ariaErrormessage,
    ariaDisabled,
    ariaReadonly,
    ariaRequired,
    ariaBusy,
    ariaHidden,
    ariaChecked,
  ];

  return forwarded;
}

export function withoutSelectConflicts<TProps extends object>(
  props: TProps & FieldConflictAttributes & SelectConflictAttributes
): Omit<TProps, SelectForbiddenProp> {
  const {
    children,
    style,
    role,
    tabIndex,
    hidden,
    inert,
    contentEditable,
    dangerouslySetInnerHTML,
    autoFocus,
    multiple,
    size,
    readOnly,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledby,
    'aria-invalid': ariaInvalid,
    'aria-errormessage': ariaErrormessage,
    'aria-disabled': ariaDisabled,
    'aria-readonly': ariaReadonly,
    'aria-required': ariaRequired,
    'aria-busy': ariaBusy,
    'aria-hidden': ariaHidden,
    'aria-checked': ariaChecked,
    ...forwarded
  } = props;

  void [
    children,
    style,
    role,
    tabIndex,
    hidden,
    inert,
    contentEditable,
    dangerouslySetInnerHTML,
    autoFocus,
    multiple,
    size,
    readOnly,
    ariaLabel,
    ariaLabelledby,
    ariaInvalid,
    ariaErrormessage,
    ariaDisabled,
    ariaReadonly,
    ariaRequired,
    ariaBusy,
    ariaHidden,
    ariaChecked,
  ];

  return forwarded;
}

export function withoutChoiceConflicts<TProps extends object>(
  props: TProps & FieldConflictAttributes & ChoiceConflictAttributes
): Omit<TProps, ChoiceForbiddenProp> {
  const {
    children,
    style,
    role,
    tabIndex,
    hidden,
    inert,
    contentEditable,
    dangerouslySetInnerHTML,
    autoFocus,
    type,
    readOnly,
    indeterminate,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledby,
    'aria-invalid': ariaInvalid,
    'aria-errormessage': ariaErrormessage,
    'aria-disabled': ariaDisabled,
    'aria-readonly': ariaReadonly,
    'aria-required': ariaRequired,
    'aria-busy': ariaBusy,
    'aria-hidden': ariaHidden,
    'aria-checked': ariaChecked,
    ...forwarded
  } = props;

  void [
    children,
    style,
    role,
    tabIndex,
    hidden,
    inert,
    contentEditable,
    dangerouslySetInnerHTML,
    autoFocus,
    type,
    readOnly,
    indeterminate,
    ariaLabel,
    ariaLabelledby,
    ariaInvalid,
    ariaErrormessage,
    ariaDisabled,
    ariaReadonly,
    ariaRequired,
    ariaBusy,
    ariaHidden,
    ariaChecked,
  ];

  return forwarded;
}
