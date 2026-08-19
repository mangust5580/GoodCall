interface ToggleProps {
  readonly checked: boolean;
  readonly onChange: (checked: boolean) => void;
  readonly label: string;
  readonly hideLabel?: boolean;
  readonly disabled?: boolean;
}

export function Toggle({
  checked,
  onChange,
  label,
  hideLabel = false,
  disabled = false,
}: ToggleProps) {
  return (
    <label className="ui-toggle">
      <input
        checked={checked}
        className="ui-toggle__input"
        disabled={disabled}
        onChange={(event) => {
          onChange(event.target.checked);
        }}
        role="switch"
        type="checkbox"
      />
      <span className="ui-toggle__track">
        <span className="ui-toggle__thumb" />
      </span>
      <span className={hideLabel ? 'ui-visually-hidden' : 'ui-toggle__label'}>{label}</span>
    </label>
  );
}
