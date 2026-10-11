import { DayFlag, DayPicker, SelectionState, UI, useDayPicker } from '@daypicker/react';
import { ru } from '@daypicker/react/locale';
import type { ChevronProps, ClassNames, MonthCaptionProps } from '@daypicker/react';
import { Popover, Select } from 'radix-ui';
import { useState } from 'react';

import { cx, describedBy, useControlId } from './fieldParts';
import { FieldShell } from './Fields';
import { Icon } from './Icon';

interface DateFieldProps {
  readonly label: string;
  readonly hint?: string;
  readonly error?: string;
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

const calendarMonthFormatter = new Intl.DateTimeFormat('ru-RU', { month: 'long' });

const calendarMonthLabels = Array.from({ length: 12 }, (_, month) =>
  calendarMonthFormatter.format(new Date(2000, month, 1)),
);

function monthIndex(date: Date): number {
  return date.getFullYear() * 12 + date.getMonth();
}

interface CalendarDropdownProps {
  readonly label: string;
  readonly value: number;
  readonly options: readonly {
    readonly value: number;
    readonly label: string;
    readonly disabled: boolean;
  }[];
  readonly onValueChange: (value: number) => void;
}

function CalendarDropdown({ label, value, options, onValueChange }: CalendarDropdownProps) {
  return (
    <Select.Root
      onValueChange={(nextValue) => {
        onValueChange(Number(nextValue));
      }}
      value={String(value)}
    >
      <Select.Trigger aria-label={label} className="ui-calendar__dropdown">
        <Select.Value />
        <Select.Icon asChild>
          <Icon className="ui-calendar__dropdown-icon" name="chevron-down" />
        </Select.Icon>
      </Select.Trigger>
      <Select.Portal>
        <Select.Content
          align="start"
          className="ui-floating-surface ui-select-content ui-select-content--calendar"
          collisionPadding={16}
          position="popper"
          sideOffset={4}
        >
          <Select.Viewport className="ui-select-content__viewport">
            {options.map((option) => (
              <Select.Item
                className="ui-select-content__item"
                disabled={option.disabled}
                key={option.value}
                value={String(option.value)}
              >
                <Select.ItemText>{option.label}</Select.ItemText>
              </Select.Item>
            ))}
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
}

const calendarComponents = { Chevron: CalendarChevron };

function CalendarMonthCaption({ calendarMonth, className, children }: MonthCaptionProps) {
  const { dayPickerProps, goToMonth } = useDayPicker();
  const { startMonth, endMonth } = dayPickerProps;
  const displayed = calendarMonth.date;
  const displayedYear = displayed.getFullYear();
  const displayedMonth = displayed.getMonth();

  if (!startMonth || !endMonth) {
    return <div className={className}>{children}</div>;
  }

  const monthOptions = calendarMonthLabels.map((monthLabel, month) => {
    const candidate = monthIndex(new Date(displayedYear, month, 1));

    return {
      value: month,
      label: monthLabel,
      disabled: candidate < monthIndex(startMonth) || candidate > monthIndex(endMonth),
    };
  });
  const yearOptions = Array.from(
    { length: endMonth.getFullYear() - startMonth.getFullYear() + 1 },
    (_, offset) => {
      const year = endMonth.getFullYear() - offset;

      return { value: year, label: String(year), disabled: false };
    },
  );

  return (
    <div className={className}>
      <CalendarDropdown
        label="Выберите месяц"
        onValueChange={(month) => {
          goToMonth(new Date(displayedYear, month, 1));
        }}
        options={monthOptions}
        value={displayedMonth}
      />
      <CalendarDropdown
        label="Выберите год"
        onValueChange={(year) => {
          goToMonth(new Date(year, displayedMonth, 1));
        }}
        options={yearOptions}
        value={displayedYear}
      />
      <span className="ui-visually-hidden">{children}</span>
    </div>
  );
}

const navigableCalendarComponents = {
  Chevron: CalendarChevron,
  MonthCaption: CalendarMonthCaption,
};

export function DateField({
  label,
  hint,
  error,
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
  const navigationBounds =
    minDate && maxDate && minDate <= maxDate
      ? {
          startMonth: new Date(minDate.getFullYear(), minDate.getMonth(), 1),
          endMonth: new Date(maxDate.getFullYear(), maxDate.getMonth(), 1),
          navLayout: 'after' as const,
          className: 'ui-calendar--navigable',
          components: navigableCalendarComponents,
        }
      : { components: calendarComponents };

  const updateValue = (nextValue: string) => {
    if (value === undefined) {
      setInternalValue(nextValue);
    }

    onValueChange?.(nextValue);
  };

  return (
    <FieldShell controlId={controlId} error={error} hint={hint} label={label}>
      <Popover.Root onOpenChange={setOpen} open={open}>
        <Popover.Trigger
          aria-describedby={describedBy(controlId, hint, error)}
          aria-invalid={error ? true : undefined}
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
              {...navigationBounds}
              classNames={calendarClassNames}
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
