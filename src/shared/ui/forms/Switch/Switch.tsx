import React from 'react';
import styles from './Switch.module.scss';
import { FieldShell } from '../internal/FieldShell';
import {
  mergeDescribedBy,
  optionalText,
  requireNonBlank,
  useFieldIds,
} from '../internal/field-association';
import { withoutChoiceConflicts, type ChoiceForbiddenProp } from '../internal/field-props';

export interface SwitchProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  ChoiceForbiddenProp | 'children'
> {
  label: string;
  description?: string;
  error?: string;
  ref?: React.Ref<HTMLInputElement>;
}

export function Switch({
  label,
  description,
  error,
  id,
  required = false,
  disabled = false,
  className,
  ref,
  'aria-describedby': consumerDescribedBy,
  ...rest
}: SwitchProps): React.ReactElement {
  requireNonBlank(
    label,
    'Switch requires a non-empty label: it is the visible and accessible name'
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
      layout="choice"
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
        {...withoutChoiceConflicts(rest)}
        ref={ref}
        id={controlId}
        type="checkbox"
        role="switch"
        required={required}
        disabled={disabled}
        aria-describedby={describedBy}
        aria-invalid={resolvedError === undefined ? undefined : true}
        className={styles['control']}
      />
    </FieldShell>
  );
}
