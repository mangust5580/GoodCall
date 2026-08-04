import { describe, it, expect, vi } from 'vitest';
import { createRef, useState } from 'react';
import type { ReactElement } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TextField } from '@/shared/ui';
import type { TextFieldType } from '@/shared/ui';

const TYPES: TextFieldType[] = ['text', 'email', 'password', 'search', 'tel', 'url'];

function unsupportedType(): object {
  return { type: 'checkbox' };
}

function ControlledField(): ReactElement {
  const [value, setValue] = useState('start');

  return (
    <TextField label="Email" value={value} onChange={(event) => setValue(event.target.value)} />
  );
}

describe('TextField', () => {
  it('renders a native input defaulting to type text', () => {
    render(<TextField label="Email" />);
    const control = screen.getByRole('textbox', { name: 'Email' });

    expect(control.tagName.toLowerCase()).toBe('input');
    expect(control).toHaveAttribute('type', 'text');
  });

  it('accepts every approved type', () => {
    for (const type of TYPES) {
      const { container, unmount } = render(<TextField label="Email" type={type} />);
      const control = container.querySelector('input');

      expect(control).toHaveAttribute('type', type);
      unmount();
    }
  });

  it('rejects an unsupported type arriving through a spread', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);

    expect(() => render(<TextField label="Email" {...unsupportedType()} />)).toThrow(
      /TextField supports only/i
    );

    consoleError.mockRestore();
  });

  it('supports a controlled value', async () => {
    const user = userEvent.setup();
    render(<ControlledField />);
    const control = screen.getByRole('textbox', { name: 'Email' });

    expect(control).toHaveValue('start');

    await user.clear(control);
    await user.type(control, 'typed');

    expect(control).toHaveValue('typed');
  });

  it('supports an uncontrolled default value with change notification', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<TextField label="Email" defaultValue="preset" onChange={onChange} />);
    const control = screen.getByRole('textbox', { name: 'Email' });

    expect(control).toHaveValue('preset');

    await user.type(control, 'x');

    expect(control).toHaveValue('presetx');
    expect(onChange).toHaveBeenCalled();
  });

  it('keeps native mobile and autofill attributes', () => {
    render(
      <TextField
        label="Phone"
        type="tel"
        inputMode="tel"
        autoComplete="tel"
        placeholder="+7"
        maxLength={20}
      />
    );
    const control = screen.getByRole('textbox', { name: 'Phone' });

    expect(control).toHaveAttribute('inputmode', 'tel');
    expect(control).toHaveAttribute('autocomplete', 'tel');
    expect(control).toHaveAttribute('placeholder', '+7');
    expect(control).toHaveAttribute('maxlength', '20');
  });

  it('keeps a read-only control focusable but not editable', async () => {
    const user = userEvent.setup();
    render(<TextField label="Email" defaultValue="locked" readOnly />);
    const control = screen.getByRole('textbox', { name: 'Email' });

    expect(control).toHaveAttribute('readonly');
    expect(control).not.toBeDisabled();

    await user.click(control);
    expect(control).toHaveFocus();

    await user.type(control, 'edit');
    expect(control).toHaveValue('locked');
  });

  it('keeps a disabled control out of focus and editing', async () => {
    const user = userEvent.setup();
    render(<TextField label="Email" defaultValue="locked" disabled />);
    const control = screen.getByRole('textbox', { name: 'Email' });

    expect(control).toBeDisabled();
    expect(control).not.toHaveAttribute('readonly');

    await user.click(control);
    expect(control).not.toHaveFocus();
    expect(control).toHaveValue('locked');
  });

  it('exposes read-only and disabled as distinct states', () => {
    const { container: readOnlyContainer } = render(<TextField label="Email" readOnly />);
    const { container: disabledContainer } = render(<TextField label="Email" disabled />);

    expect(readOnlyContainer.querySelector('input')).toHaveAttribute('readonly');
    expect(readOnlyContainer.querySelector('input')).not.toBeDisabled();
    expect(disabledContainer.querySelector('input')).toBeDisabled();
    expect(disabledContainer.querySelector('input')).not.toHaveAttribute('readonly');
  });

  it('forwards the ref to the native input', () => {
    const ref = createRef<HTMLInputElement>();
    render(<TextField label="Email" ref={ref} />);

    expect(ref.current).toBeInstanceOf(HTMLInputElement);
    expect(ref.current).toBe(screen.getByRole('textbox', { name: 'Email' }));
  });
});
