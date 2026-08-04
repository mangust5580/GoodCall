import { describe, it, expect } from 'vitest';
import type { InputHTMLAttributes, Ref, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react';
import type {
  CheckboxProps,
  RadioProps,
  SelectProps,
  SwitchProps,
  TextFieldProps,
  TextFieldType,
  TextareaProps,
} from '@/shared/ui';

type Assert<T extends true> = T;

type Absent<TProps, TKeys> = [Extract<keyof TProps, TKeys>] extends [never] ? true : false;

type Present<TProps, TKeys extends PropertyKey> = TKeys extends keyof TProps ? true : false;

type IsRequired<TProps, TKey extends keyof TProps> =
  Record<never, never> extends Pick<TProps, TKey> ? false : true;

type FieldForbiddenProp =
  | 'style'
  | 'role'
  | 'tabIndex'
  | 'hidden'
  | 'inert'
  | 'contentEditable'
  | 'dangerouslySetInnerHTML'
  | 'autoFocus'
  | 'aria-label'
  | 'aria-labelledby'
  | 'aria-invalid'
  | 'aria-errormessage'
  | 'aria-disabled'
  | 'aria-readonly'
  | 'aria-required'
  | 'aria-busy'
  | 'aria-hidden'
  | 'aria-checked';

type TextFieldForbiddenPropsAbsent = Assert<
  Absent<TextFieldProps, FieldForbiddenProp | 'children'>
>;
type TextareaForbiddenPropsAbsent = Assert<Absent<TextareaProps, FieldForbiddenProp | 'children'>>;
type SelectForbiddenPropsAbsent = Assert<
  Absent<SelectProps, FieldForbiddenProp | 'multiple' | 'size' | 'readOnly'>
>;
type CheckboxForbiddenPropsAbsent = Assert<
  Absent<CheckboxProps, FieldForbiddenProp | 'type' | 'readOnly' | 'children'>
>;
type RadioForbiddenPropsAbsent = Assert<
  Absent<RadioProps, FieldForbiddenProp | 'type' | 'readOnly' | 'indeterminate' | 'children'>
>;
type SwitchForbiddenPropsAbsent = Assert<
  Absent<SwitchProps, FieldForbiddenProp | 'type' | 'readOnly' | 'indeterminate' | 'children'>
>;

type LabelRequiredEverywhere = Assert<
  [
    IsRequired<TextFieldProps, 'label'>,
    IsRequired<TextareaProps, 'label'>,
    IsRequired<SelectProps, 'label'>,
    IsRequired<CheckboxProps, 'label'>,
    IsRequired<RadioProps, 'label'>,
    IsRequired<SwitchProps, 'label'>,
  ] extends [true, true, true, true, true, true]
    ? true
    : false
>;

type SelectChildrenRequired = Assert<IsRequired<SelectProps, 'children'>>;
type RadioNameRequired = Assert<IsRequired<RadioProps, 'name'>>;
type RadioValueRequired = Assert<IsRequired<RadioProps, 'value'>>;

type TextFieldRefTarget = Assert<
  TextFieldProps['ref'] extends Ref<HTMLInputElement> | undefined ? true : false
>;
type TextareaRefTarget = Assert<
  TextareaProps['ref'] extends Ref<HTMLTextAreaElement> | undefined ? true : false
>;
type SelectRefTarget = Assert<
  SelectProps['ref'] extends Ref<HTMLSelectElement> | undefined ? true : false
>;
type CheckboxRefTarget = Assert<
  CheckboxProps['ref'] extends Ref<HTMLInputElement> | undefined ? true : false
>;
type RadioRefTarget = Assert<
  RadioProps['ref'] extends Ref<HTMLInputElement> | undefined ? true : false
>;
type SwitchRefTarget = Assert<
  SwitchProps['ref'] extends Ref<HTMLInputElement> | undefined ? true : false
>;

type TextFieldTypeIsRestricted = Assert<
  TextFieldProps['type'] extends TextFieldType | undefined ? true : false
>;
type TextFieldTypeExcludesNonText = Assert<
  Extract<TextFieldType, 'checkbox' | 'radio' | 'date' | 'file' | 'number' | 'range'> extends never
    ? true
    : false
>;
type TextFieldPropsPreserved = Assert<
  Present<
    TextFieldProps,
    | 'value'
    | 'defaultValue'
    | 'onChange'
    | 'readOnly'
    | 'disabled'
    | 'required'
    | 'autoComplete'
    | 'inputMode'
  >
>;

type TextareaPropsPreserved = Assert<
  Present<TextareaProps, 'value' | 'defaultValue' | 'rows' | 'readOnly' | 'disabled'>
>;

type SelectPropsPreserved = Assert<
  Present<SelectProps, 'value' | 'defaultValue' | 'onChange' | 'required' | 'disabled'>
>;

type CheckboxPropsPreserved = Assert<
  Present<CheckboxProps, 'checked' | 'defaultChecked' | 'onChange' | 'disabled' | 'indeterminate'>
>;

type RadioPropsPreserved = Assert<
  Present<RadioProps, 'checked' | 'defaultChecked' | 'onChange' | 'disabled'>
>;

type SwitchPropsPreserved = Assert<
  Present<SwitchProps, 'checked' | 'defaultChecked' | 'onChange' | 'disabled'>
>;

type ForbiddenPropsExistOnInputBase = Assert<
  Present<InputHTMLAttributes<HTMLInputElement>, FieldForbiddenProp | 'type' | 'readOnly'>
>;
type ForbiddenPropsExistOnTextareaBase = Assert<
  Present<TextareaHTMLAttributes<HTMLTextAreaElement>, FieldForbiddenProp | 'readOnly'>
>;
type ForbiddenPropsExistOnSelectBase = Assert<
  Present<SelectHTMLAttributes<HTMLSelectElement>, FieldForbiddenProp | 'multiple' | 'size'>
>;

describe('Form control type contracts', () => {
  it('removes semantic-override and hiding props from every control', () => {
    const results: true[] = [
      true satisfies TextFieldForbiddenPropsAbsent,
      true satisfies TextareaForbiddenPropsAbsent,
      true satisfies SelectForbiddenPropsAbsent,
      true satisfies CheckboxForbiddenPropsAbsent,
      true satisfies RadioForbiddenPropsAbsent,
      true satisfies SwitchForbiddenPropsAbsent,
    ];

    expect(results).toHaveLength(6);
  });

  it('requires a label everywhere and the control-specific required props', () => {
    const labelRequired: LabelRequiredEverywhere = true;
    const selectChildren: SelectChildrenRequired = true;
    const radioName: RadioNameRequired = true;
    const radioValue: RadioValueRequired = true;

    expect([labelRequired, selectChildren, radioName, radioValue]).toEqual([
      true,
      true,
      true,
      true,
    ]);
  });

  it('points every ref at the matching native control', () => {
    const results: true[] = [
      true satisfies TextFieldRefTarget,
      true satisfies TextareaRefTarget,
      true satisfies SelectRefTarget,
      true satisfies CheckboxRefTarget,
      true satisfies RadioRefTarget,
      true satisfies SwitchRefTarget,
    ];

    expect(results).toHaveLength(6);
  });

  it('restricts TextField to the approved text-like types', () => {
    const restricted: TextFieldTypeIsRestricted = true;
    const excludesNonText: TextFieldTypeExcludesNonText = true;

    expect([restricted, excludesNonText]).toEqual([true, true]);
  });

  it('preserves the supported native props on every control', () => {
    const results: true[] = [
      true satisfies TextFieldPropsPreserved,
      true satisfies TextareaPropsPreserved,
      true satisfies SelectPropsPreserved,
      true satisfies CheckboxPropsPreserved,
      true satisfies RadioPropsPreserved,
      true satisfies SwitchPropsPreserved,
    ];

    expect(results).toHaveLength(6);
  });

  it('guards against the native base types silently dropping the forbidden props', () => {
    const results: true[] = [
      true satisfies ForbiddenPropsExistOnInputBase,
      true satisfies ForbiddenPropsExistOnTextareaBase,
      true satisfies ForbiddenPropsExistOnSelectBase,
    ];

    expect(results).toHaveLength(3);
  });
});
