import { useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';
import { Slider } from 'radix-ui';

type RangeField = 'lower' | 'upper';

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
  const [activeField, setActiveField] = useState<RangeField | null>(null);
  const [draft, setDraft] = useState('');
  const skipBlurCommitRef = useRef(false);
  const safeStep = Number.isFinite(step) && step > 0 ? step : 1;

  const formatDraftValue = (value: number): string => String(value);

  const getNumberPrecision = (value: number): number => {
    const valueText = String(value);
    const exponentialMatch = valueText.match(/e-(\d+)$/u);

    if (exponentialMatch) {
      return Number(exponentialMatch[1]);
    }

    return valueText.includes('.') ? (valueText.split('.')[1]?.length ?? 0) : 0;
  };

  const clamp = (value: number): number => Math.min(Math.max(value, min), max);

  const normalizeToStep = (value: number): number => {
    const precision = Math.max(getNumberPrecision(min), getNumberPrecision(safeStep));
    const stepped = Math.round((value - min) / safeStep) * safeStep + min;

    return clamp(Number(stepped.toFixed(precision)));
  };

  const parseDraft = (): number | null => {
    const trimmed = draft.trim().replace(',', '.');

    if (!trimmed) {
      return null;
    }

    const parsed = Number(trimmed);

    return Number.isFinite(parsed) ? parsed : null;
  };

  const commitField = (field: RangeField): void => {
    const parsed = parseDraft();

    if (parsed !== null) {
      const normalized = normalizeToStep(parsed);

      onChange(
        field === 'lower'
          ? [Math.min(normalized, upper), upper]
          : [lower, Math.max(normalized, lower)],
      );
    }

    setActiveField(null);
    setDraft('');
  };

  const cancelField = (): void => {
    setActiveField(null);
    setDraft('');
  };

  const handleSliderChange = (nextValues: number[]): void => {
    if (nextValues.length >= 2) {
      onChange([nextValues[0] ?? lower, nextValues[1] ?? upper]);
    }
  };

  const handleFieldFocus = (field: RangeField, value: number): void => {
    setActiveField(field);
    setDraft(formatDraftValue(value));
  };

  const handleFieldBlur = (field: RangeField): void => {
    if (skipBlurCommitRef.current) {
      skipBlurCommitRef.current = false;
      return;
    }

    if (activeField === field) {
      commitField(field);
    }
  };

  const handleFieldKeyDown = (event: KeyboardEvent<HTMLInputElement>, field: RangeField): void => {
    if (event.key === 'Enter') {
      event.preventDefault();
      skipBlurCommitRef.current = true;
      commitField(field);
      event.currentTarget.blur();
    }

    if (event.key === 'Escape') {
      event.preventDefault();
      skipBlurCommitRef.current = true;
      cancelField();
      event.currentTarget.blur();
    }
  };

  return (
    <div className="ui-range">
      <div className="ui-range__values">
        <input
          aria-label={`${minLabel}: значение`}
          className="ui-range__value"
          inputMode="decimal"
          onBlur={() => handleFieldBlur('lower')}
          onChange={(event) => setDraft(event.target.value)}
          onFocus={() => handleFieldFocus('lower', lower)}
          onKeyDown={(event) => handleFieldKeyDown(event, 'lower')}
          type="text"
          value={activeField === 'lower' ? draft : formatValue(lower)}
        />
        <input
          aria-label={`${maxLabel}: значение`}
          className="ui-range__value"
          inputMode="decimal"
          onBlur={() => handleFieldBlur('upper')}
          onChange={(event) => setDraft(event.target.value)}
          onFocus={() => handleFieldFocus('upper', upper)}
          onKeyDown={(event) => handleFieldKeyDown(event, 'upper')}
          type="text"
          value={activeField === 'upper' ? draft : formatValue(upper)}
        />
      </div>
      <Slider.Root
        className="ui-range__slider"
        max={max}
        min={min}
        minStepsBetweenThumbs={0}
        onValueChange={handleSliderChange}
        step={safeStep}
        value={[lower, upper]}
      >
        <Slider.Track className="ui-range__track">
          <Slider.Range className="ui-range__fill" />
        </Slider.Track>
        <Slider.Thumb
          aria-label={minLabel}
          aria-valuetext={formatValue(lower)}
          className="ui-range__thumb"
        />
        <Slider.Thumb
          aria-label={maxLabel}
          aria-valuetext={formatValue(upper)}
          className="ui-range__thumb"
        />
      </Slider.Root>
    </div>
  );
}
