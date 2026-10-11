import type { MaskitoOptions } from '@maskito/core';
import { useMaskito } from '@maskito/react';
import { useState } from 'react';
import type { FormEvent } from 'react';

import { describedBy, useControlId } from './fieldParts';
import { FieldShell } from './Fields';

interface PhoneFieldProps {
  readonly label: string;
  readonly hint?: string;
  readonly error?: string;
  readonly id?: string;
  readonly name?: string;
  readonly placeholder?: string;
  readonly value?: string;
  readonly defaultValue?: string;
  readonly onValueChange?: (value: string) => void;
  readonly disabled?: boolean;
  readonly required?: boolean;
  readonly autoComplete?: string;
}

const phoneMaskOptions: MaskitoOptions = {
  mask: [
    '+',
    '7',
    ' ',
    '(',
    /\d/,
    /\d/,
    /\d/,
    ')',
    ' ',
    /\d/,
    /\d/,
    /\d/,
    '-',
    /\d/,
    /\d/,
    '-',
    /\d/,
    /\d/,
  ],
};

export function PhoneField({
  label,
  hint,
  error,
  id,
  name,
  placeholder = '+7 (___) ___-__-__',
  value,
  defaultValue = '',
  onValueChange,
  disabled = false,
  required = false,
  autoComplete,
}: PhoneFieldProps) {
  const controlId = useControlId(id);
  const maskRef = useMaskito({ options: phoneMaskOptions });
  const [internalValue, setInternalValue] = useState(defaultValue);
  const currentValue = value ?? internalValue;

  const updateValue = (nextValue: string) => {
    if (value === undefined) {
      setInternalValue(nextValue);
    }

    onValueChange?.(nextValue);
  };

  const handleInput = (event: FormEvent<HTMLInputElement>) => {
    updateValue(event.currentTarget.value);
  };

  return (
    <FieldShell controlId={controlId} error={error} hint={hint} label={label}>
      <input
        aria-describedby={describedBy(controlId, hint, error)}
        aria-invalid={error ? true : undefined}
        autoComplete={autoComplete}
        className="ui-input"
        disabled={disabled}
        id={controlId}
        inputMode="tel"
        name={name}
        onInput={handleInput}
        placeholder={placeholder}
        ref={maskRef}
        required={required}
        type="tel"
        value={currentValue}
      />
    </FieldShell>
  );
}
