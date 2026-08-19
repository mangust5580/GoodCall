import type { ReactNode } from 'react';

interface RadioProps {
  readonly checked: boolean;
  readonly onChange: () => void;
  readonly label: ReactNode;
  readonly name: string;
  readonly value: string;
  readonly disabled?: boolean;
}

export function Radio({ checked, onChange, label, name, value, disabled = false }: RadioProps) {
  return (
    <label className="ui-choice ui-choice--radio">
      <input
        checked={checked}
        className="ui-choice__input"
        disabled={disabled}
        name={name}
        onChange={onChange}
        type="radio"
        value={value}
      />
      <span className="ui-choice__box">
        <span className="ui-choice__dot" />
      </span>
      <span className="ui-choice__label">{label}</span>
    </label>
  );
}
