import React from 'react';
import styles from './Select.module.scss';
import { FieldShell } from './FieldShell';
import { mergeDescribedBy, optionalText, requireNonBlank, useFieldIds } from './field-association';
import { withoutSelectConflicts, type SelectForbiddenProp } from './field-props';

export interface SelectProps extends Omit<
  React.SelectHTMLAttributes<HTMLSelectElement>,
  SelectForbiddenProp | 'children'
> {
  label: string;
  children: React.ReactNode;
  description?: string;
  error?: string;
  ref?: React.Ref<HTMLSelectElement>;
}

export function Select({
  label,
  children,
  description,
  error,
  id,
  required = false,
  disabled = false,
  className,
  ref,
  'aria-describedby': consumerDescribedBy,
  ...rest
}: SelectProps): React.ReactElement {
  requireNonBlank(
    label,
    'Select requires a non-empty label: it is the visible and accessible name'
  );

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
      <select
        {...withoutSelectConflicts(rest)}
        ref={ref}
        id={controlId}
        required={required}
        disabled={disabled}
        aria-describedby={describedBy}
        aria-invalid={resolvedError === undefined ? undefined : true}
        className={styles['control']}
      >
        {children}
      </select>
    </FieldShell>
  );
}
