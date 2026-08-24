import { DayFlag, DayPicker, SelectionState, UI } from '@daypicker/react';
import { ru } from '@daypicker/react/locale';
import type { MaskitoOptions } from '@maskito/core';
import { useMaskito } from '@maskito/react';
import { Popover, Select } from 'radix-ui';
import { useId, useRef, useState } from 'react';
import type {
  ChangeEvent,
  FormEvent,
  InputHTMLAttributes,
  KeyboardEvent,
  ReactNode,
  TextareaHTMLAttributes,
} from 'react';
import type { ChevronProps, ClassNames } from '@daypicker/react';

import { Icon } from './Icon';
import type { IconName } from './Icon';

interface FieldShellProps {
  readonly controlId: string;
  readonly label: string;
  readonly hint?: string;
  readonly children: ReactNode;
  readonly icon?: IconName;
  readonly labelVisuallyHidden?: boolean;
}

function FieldShell({
  controlId,
  label,
  hint,
  children,
  icon,
  labelVisuallyHidden = false,
}: FieldShellProps) {
  return (
    <div className="ui-field">
      <label
        className={cx('ui-field__label', labelVisuallyHidden && 'ui-visually-hidden')}
        htmlFor={controlId}
      >
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

function cx(...classes: readonly (string | false | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
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

export interface SearchFieldTrailingAction {
  readonly icon: IconName;
  readonly label: string;
  readonly onClick: () => void;
}

interface SearchFieldProps {
  readonly label: string;
  readonly hint?: string;
  readonly id?: string;
  readonly name?: string;
  readonly placeholder?: string;
  readonly value?: string;
  readonly defaultValue?: string;
  readonly onValueChange?: (value: string) => void;
  readonly onSubmit?: (value: string) => void;
  readonly onClear?: () => void;
  readonly disabled?: boolean;
  readonly required?: boolean;
  readonly autoComplete?: string;
  readonly labelVisuallyHidden?: boolean;
  readonly trailingAction?: SearchFieldTrailingAction;
}

export function SearchField({
  label,
  hint,
  id,
  name,
  placeholder,
  value,
  defaultValue = '',
  onValueChange,
  onSubmit,
  onClear,
  disabled = false,
  required = false,
  autoComplete,
  labelVisuallyHidden = false,
  trailingAction,
}: SearchFieldProps) {
  const controlId = useControlId(id);
  const inputRef = useRef<HTMLInputElement>(null);
  const [internalValue, setInternalValue] = useState(defaultValue);
  const currentValue = value ?? internalValue;
  const hasValue = currentValue.length > 0;

  const updateValue = (nextValue: string) => {
    if (value === undefined) {
      setInternalValue(nextValue);
    }

    onValueChange?.(nextValue);
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    updateValue(event.currentTarget.value);
  };

  const handleClear = () => {
    updateValue('');
    onClear?.();
    inputRef.current?.focus();
  };

  const handleSubmit = () => {
    onSubmit?.(currentValue);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && onSubmit) {
      event.preventDefault();
      handleSubmit();
    }
  };

  return (
    <FieldShell
      controlId={controlId}
      hint={hint}
      label={label}
      labelVisuallyHidden={labelVisuallyHidden}
    >
      <input
        aria-describedby={hint ? `${controlId}-hint` : undefined}
        autoComplete={autoComplete}
        className={cx(
          'ui-input',
          'ui-input--search',
          trailingAction && 'ui-input--search-trailing',
        )}
        disabled={disabled}
        id={controlId}
        name={name}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        ref={inputRef}
        required={required}
        type="search"
        value={currentValue}
      />
      <div className="ui-search-actions">
        {hasValue ? (
          <button
            aria-label="Очистить поиск"
            className="ui-search-actions__button"
            disabled={disabled}
            onClick={handleClear}
            type="button"
          >
            <Icon name="close" />
          </button>
        ) : null}
        {trailingAction ? (
          <button
            aria-label={trailingAction.label}
            className="ui-search-actions__button"
            disabled={disabled}
            onClick={trailingAction.onClick}
            type="button"
          >
            <Icon name={trailingAction.icon} />
          </button>
        ) : null}
        {onSubmit ? (
          <button
            aria-label="Выполнить поиск"
            className="ui-search-actions__button"
            disabled={disabled}
            onClick={handleSubmit}
            type="button"
          >
            <Icon name="search" />
          </button>
        ) : (
          <Icon className="ui-search-actions__icon" name="search" />
        )}
      </div>
    </FieldShell>
  );
}

interface PhoneFieldProps {
  readonly label: string;
  readonly hint?: string;
  readonly id?: string;
  readonly name?: string;
  readonly placeholder?: string;
  readonly value?: string;
  readonly defaultValue?: string;
  readonly onValueChange?: (value: string) => void;
  readonly disabled?: boolean;
  readonly required?: boolean;
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
  id,
  name,
  placeholder = '+7 (___) ___-__-__',
  value,
  defaultValue = '',
  onValueChange,
  disabled = false,
  required = false,
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
    <FieldShell controlId={controlId} hint={hint} label={label}>
      <input
        aria-describedby={hint ? `${controlId}-hint` : undefined}
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

interface SelectFieldProps {
  readonly label: string;
  readonly hint?: string;
  readonly id?: string;
  readonly placeholder?: string;
  readonly options: readonly { readonly value: string; readonly label: string }[];
  readonly value?: string;
  readonly defaultValue?: string;
  readonly onValueChange?: (value: string) => void;
  readonly disabled?: boolean;
  readonly required?: boolean;
  readonly name?: string;
}

export function SelectField({
  label,
  hint,
  id,
  placeholder,
  options,
  value,
  defaultValue,
  onValueChange,
  disabled = false,
  required = false,
  name,
}: SelectFieldProps) {
  const controlId = useControlId(id);

  return (
    <FieldShell controlId={controlId} hint={hint} label={label}>
      <Select.Root
        defaultValue={defaultValue}
        disabled={disabled}
        name={name}
        onValueChange={onValueChange}
        required={required}
        value={value}
      >
        <Select.Trigger
          aria-describedby={hint ? `${controlId}-hint` : undefined}
          className="ui-input ui-input--select-trigger"
          id={controlId}
        >
          <Select.Value placeholder={placeholder} />
          <Select.Icon asChild>
            <Icon className="ui-input__select-icon" name="chevron-down" />
          </Select.Icon>
        </Select.Trigger>
        <Select.Portal>
          <Select.Content
            align="start"
            className="ui-floating-surface ui-select-content"
            collisionPadding={16}
            position="popper"
            sideOffset={8}
          >
            <Select.Viewport className="ui-select-content__viewport">
              {options.map((option) => (
                <Select.Item
                  className="ui-select-content__item"
                  key={option.value}
                  value={option.value}
                >
                  <Select.ItemText>{option.label}</Select.ItemText>
                </Select.Item>
              ))}
            </Select.Viewport>
          </Select.Content>
        </Select.Portal>
      </Select.Root>
    </FieldShell>
  );
}

interface DateFieldProps {
  readonly label: string;
  readonly hint?: string;
  readonly id?: string;
  readonly placeholder?: string;
  readonly value?: string;
  readonly defaultValue?: string;
  readonly onValueChange?: (value: string) => void;
  readonly disabled?: boolean;
  readonly min?: string;
  readonly max?: string;
}

const dateFormatter = new Intl.DateTimeFormat('ru-RU', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
});

const calendarClassNames = {
  [UI.Root]: 'ui-calendar',
  [UI.Months]: 'ui-calendar__months',
  [UI.Month]: 'ui-calendar__month',
  [UI.MonthCaption]: 'ui-calendar__month-caption',
  [UI.CaptionLabel]: 'ui-calendar__caption-label',
  [UI.Nav]: 'ui-calendar__nav',
  [UI.PreviousMonthButton]: 'ui-calendar__nav-button ui-calendar__nav-button--previous',
  [UI.NextMonthButton]: 'ui-calendar__nav-button ui-calendar__nav-button--next',
  [UI.Chevron]: 'ui-calendar__chevron',
  [UI.MonthGrid]: 'ui-calendar__month-grid',
  [UI.Weekdays]: 'ui-calendar__weekdays',
  [UI.Weekday]: 'ui-calendar__weekday',
  [UI.Weeks]: 'ui-calendar__weeks',
  [UI.Week]: 'ui-calendar__week',
  [UI.Day]: 'ui-calendar__day',
  [UI.DayButton]: 'ui-calendar__day-button',
  [DayFlag.today]: 'ui-calendar__day--today',
  [DayFlag.outside]: 'ui-calendar__day--outside',
  [DayFlag.disabled]: 'ui-calendar__day--disabled',
  [DayFlag.focused]: 'ui-calendar__day--focused',
  [SelectionState.selected]: 'ui-calendar__day--selected',
} satisfies Partial<ClassNames>;

function formatDateValue(date: Date): string {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');

  return `${year}-${month}-${day}`;
}

function parseDateValue(value?: string): Date | undefined {
  if (!value) {
    return undefined;
  }

  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);

  if (!match) {
    return undefined;
  }

  const year = Number(match[1]);
  const month = Number(match[2]) - 1;
  const day = Number(match[3]);
  const date = new Date(year, month, day);

  if (date.getFullYear() !== year || date.getMonth() !== month || date.getDate() !== day) {
    return undefined;
  }

  return date;
}

function CalendarChevron({ orientation = 'left', className }: ChevronProps) {
  const name = orientation === 'right' ? 'chevron-right' : 'chevron-left';

  return <Icon className={className} name={name} />;
}

export function DateField({
  label,
  hint,
  id,
  placeholder = 'Выберите дату',
  value,
  defaultValue = '',
  onValueChange,
  disabled = false,
  min,
  max,
}: DateFieldProps) {
  const controlId = useControlId(id);
  const [internalValue, setInternalValue] = useState(defaultValue);
  const [open, setOpen] = useState(false);
  const currentValue = value ?? internalValue;
  const selectedDate = parseDateValue(currentValue);
  const minDate = parseDateValue(min);
  const maxDate = parseDateValue(max);
  const displayValue = selectedDate ? dateFormatter.format(selectedDate) : placeholder;

  const updateValue = (nextValue: string) => {
    if (value === undefined) {
      setInternalValue(nextValue);
    }

    onValueChange?.(nextValue);
  };

  return (
    <FieldShell controlId={controlId} hint={hint} label={label}>
      <Popover.Root onOpenChange={setOpen} open={open}>
        <Popover.Trigger
          aria-describedby={hint ? `${controlId}-hint` : undefined}
          className="ui-input ui-input--date-trigger"
          disabled={disabled}
          id={controlId}
        >
          <span
            className={cx(
              'ui-date-trigger__value',
              !selectedDate && 'ui-date-trigger__value--placeholder',
            )}
          >
            {displayValue}
          </span>
          <Icon className="ui-date-trigger__icon" name="calendar" />
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Content
            align="start"
            className="ui-floating-surface ui-date-popover"
            collisionPadding={16}
            sideOffset={8}
          >
            <DayPicker
              classNames={calendarClassNames}
              components={{ Chevron: CalendarChevron }}
              defaultMonth={selectedDate}
              disabled={[
                ...(minDate ? [{ before: minDate }] : []),
                ...(maxDate ? [{ after: maxDate }] : []),
              ]}
              fixedWeeks
              locale={ru}
              mode="single"
              onSelect={(nextDate) => {
                updateValue(nextDate ? formatDateValue(nextDate) : '');
                setOpen(false);
              }}
              selected={selectedDate}
              showOutsideDays
              weekStartsOn={1}
            />
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
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
