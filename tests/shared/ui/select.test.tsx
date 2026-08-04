import { describe, it, expect, vi } from 'vitest';
import { createRef, useState } from 'react';
import type { ReactElement } from 'react';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Select } from '@/shared/ui';

function multiSelectProps() {
  return { multiple: true, size: 4, readOnly: true };
}

function options(): ReactElement {
  return (
    <>
      <option value="courier">Courier</option>
      <option value="pickup">Pickup</option>
    </>
  );
}

function ControlledSelect(): ReactElement {
  const [value, setValue] = useState('courier');

  return (
    <Select label="Delivery" value={value} onChange={(event) => setValue(event.target.value)}>
      {options()}
    </Select>
  );
}

describe('Select', () => {
  it('renders a native single select', () => {
    render(<Select label="Delivery">{options()}</Select>);
    const control = screen.getByRole('combobox', { name: 'Delivery' });

    expect(control.tagName.toLowerCase()).toBe('select');
    expect(control).not.toHaveAttribute('multiple');
  });

  it('preserves consumer option children', () => {
    render(
      <Select label="Delivery">
        <optgroup label="Fast">
          <option value="courier">Courier</option>
        </optgroup>
        <option value="pickup">Pickup</option>
      </Select>
    );
    const control = screen.getByRole('combobox', { name: 'Delivery' });

    expect(within(control).getAllByRole('option')).toHaveLength(2);
    expect(within(control).getByRole('group', { name: 'Fast' })).toBeInTheDocument();
  });

  it('supports a controlled selection', async () => {
    const user = userEvent.setup();
    render(<ControlledSelect />);
    const control = screen.getByRole('combobox', { name: 'Delivery' });

    expect(control).toHaveValue('courier');

    await user.selectOptions(control, 'pickup');

    expect(control).toHaveValue('pickup');
  });

  it('supports an uncontrolled default selection with change notification', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <Select label="Delivery" defaultValue="pickup" onChange={onChange}>
        {options()}
      </Select>
    );
    const control = screen.getByRole('combobox', { name: 'Delivery' });

    expect(control).toHaveValue('pickup');

    await user.selectOptions(control, 'courier');

    expect(control).toHaveValue('courier');
    expect(onChange).toHaveBeenCalled();
  });

  it('supports native required and disabled states', () => {
    const { unmount } = render(
      <Select label="Delivery" required>
        {options()}
      </Select>
    );

    expect(screen.getByRole('combobox', { name: 'Delivery' })).toBeRequired();
    unmount();

    render(
      <Select label="Delivery" disabled>
        {options()}
      </Select>
    );

    expect(screen.getByRole('combobox', { name: 'Delivery' })).toBeDisabled();
  });

  it('stays a single select when multiple, size and readOnly arrive through a spread', () => {
    render(
      <Select label="Delivery" {...multiSelectProps()}>
        {options()}
      </Select>
    );
    const control = screen.getByRole('combobox', { name: 'Delivery' });

    expect(control).not.toHaveAttribute('multiple');
    expect(control).not.toHaveAttribute('size');
    expect(control).not.toHaveAttribute('readonly');
    expect(screen.queryByRole('listbox')).toBeNull();
  });

  it('forwards the ref to the native select', () => {
    const ref = createRef<HTMLSelectElement>();
    render(
      <Select label="Delivery" ref={ref}>
        {options()}
      </Select>
    );

    expect(ref.current).toBeInstanceOf(HTMLSelectElement);
    expect(ref.current).toBe(screen.getByRole('combobox', { name: 'Delivery' }));
  });
});
