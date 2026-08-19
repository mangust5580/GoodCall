import type { ReactNode } from 'react';

import { Icon } from './Icon';

interface CheckboxProps {
  readonly checked: boolean;
  readonly onChange: (checked: boolean) => void;
  readonly label: ReactNode;
  readonly disabled?: boolean;
}

export function Checkbox({ checked, onChange, label, disabled = false }: CheckboxProps) {
  return (
    <label className="ui-choice">
      <input
        checked={checked}
        className="ui-choice__input"
        disabled={disabled}
        onChange={(event) => {
          onChange(event.target.checked);
        }}
        type="checkbox"
      />
      <span className="ui-choice__box">
        <Icon className="ui-choice__mark" name="check" />
      </span>
      <span className="ui-choice__label">{label}</span>
    </label>
  );
}
