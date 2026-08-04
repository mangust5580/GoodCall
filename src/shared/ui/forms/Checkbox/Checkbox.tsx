import React from 'react';
import styles from './Checkbox.module.scss';
import { FieldShell } from '../internal/FieldShell';
import {
  mergeDescribedBy,
  optionalText,
  requireNonBlank,
  useFieldIds,
} from '../internal/field-association';
import { withoutChoiceConflicts, type ChoiceForbiddenProp } from '../internal/field-props';

export interface CheckboxProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  ChoiceForbiddenProp | 'children'
> {
  label: string;
  description?: string;
  error?: string;
  indeterminate?: boolean;
  ref?: React.Ref<HTMLInputElement>;
}

export function Checkbox({
  label,
  description,
  error,
  indeterminate = false,
  id,
  required = false,
  disabled = false,
  className,
  ref,
  'aria-describedby': consumerDescribedBy,
  ...rest
}: CheckboxProps): React.ReactElement {
  requireNonBlank(
    label,
    'Checkbox requires a non-empty label: it is the visible and accessible name'
  );

  const { controlId, descriptionId, errorId } = useFieldIds(id);
  const controlRef = React.useRef<HTMLInputElement | null>(null);
  const resolvedDescription = optionalText(description);
  const resolvedError = optionalText(error);

  const describedBy = mergeDescribedBy([
    resolvedDescription === undefined ? undefined : descriptionId,
    consumerDescribedBy,
    resolvedError === undefined ? undefined : errorId,
  ]);

  const attachControl = React.useCallback(
    (node: HTMLInputElement | null) => {
      controlRef.current = node;

      if (typeof ref === 'function') {
        ref(node);
      } else if (ref !== null && ref !== undefined) {
        ref.current = node;
      }
    },
    [ref]
  );

  React.useEffect(() => {
    const node = controlRef.current;

    if (node !== null) {
      node.indeterminate = indeterminate;
    }
  }, [indeterminate]);

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
        ref={attachControl}
        id={controlId}
        type="checkbox"
        required={required}
        disabled={disabled}
        aria-describedby={describedBy}
        aria-invalid={resolvedError === undefined ? undefined : true}
        className={styles['control']}
      />
    </FieldShell>
  );
}
