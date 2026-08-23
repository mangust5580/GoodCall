import { useId } from 'react';

import { Radio } from '../ui';

export interface CommerceOption {
  readonly id: string;
  readonly label: string;
  readonly trailing?: string;
  readonly meta?: string;
  readonly disabled?: boolean;
}

interface CommerceOptionGroupProps {
  readonly label: string;
  readonly options: readonly CommerceOption[];
  readonly selectedId: string;
  readonly onSelect: (id: string) => void;
  readonly hideLabel?: boolean;
  readonly name?: string;
  readonly actionLabel?: string;
  readonly actionHref?: string;
  readonly onAction?: () => void;
}

export function CommerceOptionGroup({
  label,
  options,
  selectedId,
  onSelect,
  hideLabel = false,
  name,
  actionLabel,
  actionHref,
  onAction,
}: CommerceOptionGroupProps) {
  const generatedName = useId();
  const groupName = name ?? generatedName;
  const separated = options.some(
    (option) => option.trailing !== undefined || option.meta !== undefined,
  );
  const rowClasses = separated
    ? 'commerce-option-group__row commerce-option-group__row--separated'
    : 'commerce-option-group__row';

  const action = (() => {
    if (actionLabel === undefined) {
      return null;
    }

    if (actionHref !== undefined) {
      return (
        <a className="commerce-option-group__action" href={actionHref}>
          {actionLabel}
        </a>
      );
    }

    if (onAction !== undefined) {
      return (
        <button className="commerce-option-group__action" onClick={onAction} type="button">
          {actionLabel}
        </button>
      );
    }

    return null;
  })();

  return (
    <fieldset className="commerce-option-group">
      <legend className={hideLabel ? 'ui-visually-hidden' : 'commerce-option-group__legend'}>
        {label}
      </legend>
      {options.map((option) => (
        <div className={rowClasses} key={option.id}>
          <Radio
            checked={option.id === selectedId}
            disabled={option.disabled}
            label={
              <>
                <span className="commerce-option-group__line">
                  <span className="commerce-option-group__label">{option.label}</span>
                  {option.trailing === undefined ? null : (
                    <span className="commerce-option-group__trailing">{option.trailing}</span>
                  )}
                </span>
                {option.meta === undefined ? null : (
                  <span className="commerce-option-group__meta">{option.meta}</span>
                )}
              </>
            }
            name={groupName}
            onChange={() => {
              onSelect(option.id);
            }}
            value={option.id}
          />
        </div>
      ))}
      {action}
    </fieldset>
  );
}
