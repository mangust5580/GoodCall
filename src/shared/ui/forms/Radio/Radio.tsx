import React from 'react';
import styles from './Radio.module.scss';
import { FieldShell } from '../internal/FieldShell';
import {
  mergeDescribedBy,
  optionalText,
  requireNonBlank,
  useFieldIds,
} from '../internal/field-association';
import { withoutChoiceConflicts, type ChoiceForbiddenProp } from '../internal/field-props';

export interface RadioProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  ChoiceForbiddenProp | 'children' | 'name' | 'value'
> {
  label: string;
  name: string;
  value: string;
  description?: string;
  error?: string;
  ref?: React.Ref<HTMLInputElement>;
}

export function Radio({
  label,
  name,
  value,
  description,
  error,
  id,
  required = false,
  disabled = false,
  className,
  ref,
  'aria-describedby': consumerDescribedBy,
  ...rest
}: RadioProps): React.ReactElement {
  requireNonBlank(label, 'Radio requires a non-empty label: it is the visible and accessible name');
  requireNonBlank(name, 'Radio requires a non-empty name: it is what groups the choices');
  requireNonBlank(value, 'Radio requires a non-empty value: it is what the choice submits');

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
        type="radio"
        name={name}
        value={value}
        required={required}
        disabled={disabled}
        aria-describedby={describedBy}
        className={styles['control']}
      />
    </FieldShell>
  );
}
