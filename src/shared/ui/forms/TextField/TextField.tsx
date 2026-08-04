import React from 'react';
import styles from './TextField.module.scss';
import { FieldShell } from '../internal/FieldShell';
import {
  mergeDescribedBy,
  optionalText,
  requireNonBlank,
  useFieldIds,
} from '../internal/field-association';
import { withoutFieldConflicts, type FieldForbiddenProp } from '../internal/field-props';

export type TextFieldType = 'text' | 'email' | 'password' | 'search' | 'tel' | 'url';

const TEXT_FIELD_TYPES: readonly string[] = ['text', 'email', 'password', 'search', 'tel', 'url'];

export interface TextFieldProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  FieldForbiddenProp | 'type' | 'children'
> {
  label: string;
  description?: string;
  error?: string;
  type?: TextFieldType;
  ref?: React.Ref<HTMLInputElement>;
}

export function TextField({
  label,
  description,
  error,
  type = 'text',
  id,
  required = false,
  disabled = false,
  readOnly = false,
  className,
  ref,
  'aria-describedby': consumerDescribedBy,
  ...rest
}: TextFieldProps): React.ReactElement {
  requireNonBlank(
    label,
    'TextField requires a non-empty label: it is the visible and accessible name'
  );

  if (!TEXT_FIELD_TYPES.includes(type)) {
    throw new Error(
      `TextField supports only ${TEXT_FIELD_TYPES.join(', ')}; received "${String(type)}"`
    );
  }

  const { controlId, descriptionId, errorId } = useFieldIds(id);
  const resolvedDescription = optionalText(description);
  const resolvedError = optionalText(error);

  const describedBy = mergeDescribedBy([
    resolvedDescription === undefined ? undefined : descriptionId,
    consumerDescribedBy,
    resolvedError === undefined ? undefined : errorId,
  ]);

  return (
    <FieldShell
      layout="stacked"
      controlId={controlId}
      label={label}
      required={required}
      description={resolvedDescription}
      descriptionId={descriptionId}
      error={resolvedError}
      errorId={errorId}
      className={className}
    >
      <input
        {...withoutFieldConflicts(rest)}
        ref={ref}
        id={controlId}
        type={type}
        required={required}
        disabled={disabled}
        readOnly={readOnly}
        aria-describedby={describedBy}
        aria-invalid={resolvedError === undefined ? undefined : true}
        className={styles['control']}
      />
    </FieldShell>
  );
}
