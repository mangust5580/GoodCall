import type { CSSProperties } from 'react';

interface RangeSliderProps {
  readonly min: number;
  readonly max: number;
  readonly step?: number;
  readonly values: readonly [number, number];
  readonly onChange: (values: [number, number]) => void;
  readonly minLabel: string;
  readonly maxLabel: string;
  readonly formatValue?: (value: number) => string;
}

export function RangeSlider({
  min,
  max,
  step = 1,
  values,
  onChange,
  minLabel,
  maxLabel,
  formatValue = (value) => String(value),
}: RangeSliderProps) {
  const [lower, upper] = values;
  const span = max - min || 1;
  const toPercent = (value: number): number => ((value - min) / span) * 100;

  const trackStyle = {
    '--ui-range-start': `${String(toPercent(lower))}%`,
    '--ui-range-end': `${String(toPercent(upper))}%`,
  } as CSSProperties;

  return (
    <div className="ui-range">
      <div className="ui-range__values">
        <span className="ui-range__value">{formatValue(lower)}</span>
        <span className="ui-range__value">{formatValue(upper)}</span>
      </div>
      <div className="ui-range__track" style={trackStyle}>
        <span className="ui-range__fill" />
        <input
          aria-label={minLabel}
          className="ui-range__input"
          max={max}
          min={min}
          onChange={(event) => {
            onChange([Math.min(Number(event.target.value), upper), upper]);
          }}
          step={step}
          type="range"
          value={lower}
        />
        <input
          aria-label={maxLabel}
          className="ui-range__input"
          max={max}
          min={min}
          onChange={(event) => {
            onChange([lower, Math.max(Number(event.target.value), lower)]);
          }}
          step={step}
          type="range"
          value={upper}
        />
      </div>
    </div>
  );
}
