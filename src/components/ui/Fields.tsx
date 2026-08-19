import { useId } from 'react';
import type {
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from 'react';

import { Icon } from './Icon';
import type { IconName } from './Icon';

interface FieldShellProps {
  readonly controlId: string;
  readonly label: string;
  readonly hint?: string;
  readonly children: ReactNode;
  readonly icon?: IconName;
}

function FieldShell({ controlId, label, hint, children, icon }: FieldShellProps) {
  return (
    <div className="ui-field">
      <label className="ui-field__label" htmlFor={controlId}>
        {label}
      </label>
      <div className="ui-field__control">
        {children}
        {icon ? <Icon className="ui-field__icon" name={icon} /> : null}
      </div>
      {hint ? (
        <p className="ui-field__hint" id={`${controlId}-hint`}>
          {hint}
        </p>
      ) : null}
    </div>
  );
}

type NativeInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'id' | 'className'>;

interface BaseFieldProps extends NativeInputProps {
  readonly label: string;
  readonly hint?: string;
  readonly id?: string;
}

function useControlId(explicit?: string): string {
  const generated = useId();

  return explicit ?? generated;
}

function InputField({
  label,
  hint,
  id,
  icon,
  ...rest
}: BaseFieldProps & { readonly icon?: IconName }) {
  const controlId = useControlId(id);

  return (
    <FieldShell controlId={controlId} hint={hint} icon={icon} label={label}>
      <input
        aria-describedby={hint ? `${controlId}-hint` : undefined}
        className={icon ? 'ui-input ui-input--with-icon' : 'ui-input'}
        id={controlId}
        {...rest}
      />
    </FieldShell>
  );
}

export function TextField(props: BaseFieldProps) {
  return <InputField type="text" {...props} />;
}

export function SearchField(props: BaseFieldProps) {
  return <InputField icon="search" type="search" {...props} />;
}

export function PhoneField(props: BaseFieldProps) {
  return <InputField inputMode="tel" type="tel" {...props} />;
}

export function DateField(props: BaseFieldProps) {
  return <InputField icon="calendar" type="date" {...props} />;
}

interface SelectFieldProps extends Omit<
  SelectHTMLAttributes<HTMLSelectElement>,
  'id' | 'className'
> {
  readonly label: string;
  readonly hint?: string;
  readonly id?: string;
  readonly placeholder?: string;
  readonly options: readonly { readonly value: string; readonly label: string }[];
}

export function SelectField({ label, hint, id, placeholder, options, ...rest }: SelectFieldProps) {
  const controlId = useControlId(id);

  return (
    <FieldShell controlId={controlId} hint={hint} icon="chevron-down" label={label}>
      <select
        aria-describedby={hint ? `${controlId}-hint` : undefined}
        className="ui-input ui-input--select"
        id={controlId}
        {...rest}
      >
        {placeholder ? <option value="">{placeholder}</option> : null}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </FieldShell>
  );
}

interface TextareaFieldProps extends Omit<
  TextareaHTMLAttributes<HTMLTextAreaElement>,
  'id' | 'className'
> {
  readonly label: string;
  readonly hint?: string;
  readonly id?: string;
}

export function TextareaField({ label, hint, id, rows = 4, ...rest }: TextareaFieldProps) {
  const controlId = useControlId(id);

  return (
    <FieldShell controlId={controlId} hint={hint} label={label}>
      <textarea
        aria-describedby={hint ? `${controlId}-hint` : undefined}
        className="ui-input ui-input--textarea"
        id={controlId}
        rows={rows}
        {...rest}
      />
    </FieldShell>
  );
}
