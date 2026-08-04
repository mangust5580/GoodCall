import { describe, it, expect, vi } from 'vitest';
import { createRef } from 'react';
import type { ReactElement } from 'react';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Radio } from '@/shared/ui';

function textTypeProps() {
  return { type: 'text' };
}

function DeliveryGroup(): ReactElement {
  return (
    <fieldset>
      <legend>Способ доставки</legend>
      <Radio name="delivery" value="courier" label="Курьер" />
      <Radio name="delivery" value="pickup" label="Самовывоз" />
    </fieldset>
  );
}

describe('Radio', () => {
  it('renders a native radio input', () => {
    render(<Radio label="Courier" name="delivery" value="courier" />);
    const control = screen.getByRole('radio', { name: 'Courier' });

    expect(control.tagName.toLowerCase()).toBe('input');
    expect(control).toHaveAttribute('type', 'radio');
    expect(control).toHaveAttribute('name', 'delivery');
    expect(control).toHaveAttribute('value', 'courier');
  });

  it('rejects a blank name with a clear runtime error', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);

    expect(() => render(<Radio label="Courier" name="  " value="courier" />)).toThrow(
      /non-empty name/i
    );

    consoleError.mockRestore();
  });

  it('rejects a blank value with a clear runtime error', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);

    expect(() => render(<Radio label="Courier" name="delivery" value="   " />)).toThrow(
      /non-empty value/i
    );

    consoleError.mockRestore();
  });

  it('groups through native fieldset and legend composition', () => {
    render(<DeliveryGroup />);
    const group = screen.getByRole('group', { name: 'Способ доставки' });

    expect(within(group).getAllByRole('radio')).toHaveLength(2);
  });

  it('makes choices with the same name mutually exclusive', async () => {
    const user = userEvent.setup();
    render(<DeliveryGroup />);
    const courier = screen.getByRole('radio', { name: 'Курьер' });
    const pickup = screen.getByRole('radio', { name: 'Самовывоз' });

    await user.click(courier);
    expect(courier).toBeChecked();
    expect(pickup).not.toBeChecked();

    await user.click(pickup);
    expect(pickup).toBeChecked();
    expect(courier).not.toBeChecked();
  });

  it('selects when the visible label is clicked', async () => {
    const user = userEvent.setup();
    render(<DeliveryGroup />);

    await user.click(screen.getByText('Самовывоз'));

    expect(screen.getByRole('radio', { name: 'Самовывоз' })).toBeChecked();
  });

  it('selects on Space', async () => {
    const user = userEvent.setup();
    render(<DeliveryGroup />);
    const courier = screen.getByRole('radio', { name: 'Курьер' });

    await user.tab();
    expect(courier).toHaveFocus();
    await user.keyboard(' ');

    expect(courier).toBeChecked();
  });

  it('supports a controlled checked state and change notification', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <Radio label="Courier" name="delivery" value="courier" checked={false} onChange={onChange} />
    );

    await user.click(screen.getByRole('radio', { name: 'Courier' }));

    expect(onChange).toHaveBeenCalled();
  });

  it('blocks selection when disabled', async () => {
    const user = userEvent.setup();
    render(<Radio label="Courier" name="delivery" value="courier" disabled />);
    const control = screen.getByRole('radio', { name: 'Courier' });

    expect(control).toBeDisabled();
    await user.click(control);
    expect(control).not.toBeChecked();
  });

  it('stays a radio when a conflicting type arrives through a spread', () => {
    render(<Radio label="Courier" name="delivery" value="courier" {...textTypeProps()} />);
    const control = screen.getByRole('radio', { name: 'Courier' });

    expect(control).toHaveAttribute('type', 'radio');
    expect(screen.queryByRole('textbox')).toBeNull();
  });

  it('forwards the ref to the native input', () => {
    const ref = createRef<HTMLInputElement>();
    render(<Radio label="Courier" name="delivery" value="courier" ref={ref} />);

    expect(ref.current).toBeInstanceOf(HTMLInputElement);
    expect(ref.current).toBe(screen.getByRole('radio', { name: 'Courier' }));
  });
});
