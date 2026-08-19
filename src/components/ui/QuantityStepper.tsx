import { Icon } from './Icon';

interface QuantityStepperProps {
  readonly value: number;
  readonly onChange: (value: number) => void;
  readonly min?: number;
  readonly max?: number;
  readonly step?: number;
  readonly label: string;
  readonly decreaseLabel?: string;
  readonly increaseLabel?: string;
}

export function QuantityStepper({
  value,
  onChange,
  min = 1,
  max = 99,
  step = 1,
  label,
  decreaseLabel = 'Уменьшить количество',
  increaseLabel = 'Увеличить количество',
}: QuantityStepperProps) {
  const clamp = (next: number): number => Math.min(max, Math.max(min, next));

  return (
    <div aria-label={label} className="ui-stepper" role="group">
      <button
        aria-label={decreaseLabel}
        className="ui-stepper__button"
        disabled={value <= min}
        onClick={() => {
          onChange(clamp(value - step));
        }}
        type="button"
      >
        <Icon name="minus" />
      </button>
      <output className="ui-stepper__value">{value}</output>
      <button
        aria-label={increaseLabel}
        className="ui-stepper__button"
        disabled={value >= max}
        onClick={() => {
          onChange(clamp(value + step));
        }}
        type="button"
      >
        <Icon name="plus" />
      </button>
    </div>
  );
}
