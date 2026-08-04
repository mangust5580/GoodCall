import React from 'react';
import styles from './Textarea.module.scss';
import { FieldShell } from '../internal/FieldShell';
import {
  mergeDescribedBy,
  optionalText,
  requireNonBlank,
  useFieldIds,
} from '../internal/field-association';
import { withoutFieldConflicts, type FieldForbiddenProp } from '../internal/field-props';

export interface TextareaProps extends Omit<
  React.TextareaHTMLAttributes<HTMLTextAreaElement>,
  FieldForbiddenProp | 'children'
> {
  label: string;
  description?: string;
  error?: string;
  ref?: React.Ref<HTMLTextAreaElement>;
}

export function Textarea({
  label,
  description,
  error,
  id,
  required = false,
  disabled = false,
  readOnly = false,
  className,
  ref,
  'aria-describedby': consumerDescribedBy,
  ...rest
}: TextareaProps): React.ReactElement {
  requireNonBlank(
    label,
    'Textarea requires a non-empty label: it is the visible and accessible name'
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
      <textarea
        {...withoutFieldConflicts(rest)}
        ref={ref}
        id={controlId}
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
