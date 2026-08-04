import { describe, it, expect, vi } from 'vitest';
import { createRef, useState } from 'react';
import type { ReactElement } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Checkbox } from '@/shared/ui';

function textTypeProps() {
  return { type: 'text' };
}

function ControlledCheckbox(): ReactElement {
  const [checked, setChecked] = useState(false);

  return (
    <Checkbox
      label="Subscribe"
      checked={checked}
      onChange={(event) => setChecked(event.target.checked)}
    />
  );
}

describe('Checkbox', () => {
  it('renders a native checkbox input', () => {
    render(<Checkbox label="Subscribe" />);
    const control = screen.getByRole('checkbox', { name: 'Subscribe' });

    expect(control.tagName.toLowerCase()).toBe('input');
    expect(control).toHaveAttribute('type', 'checkbox');
  });

  it('toggles when the visible label is clicked', async () => {
    const user = userEvent.setup();
    render(<Checkbox label="Subscribe" />);
    const control = screen.getByRole('checkbox', { name: 'Subscribe' });

    expect(control).not.toBeChecked();

    await user.click(screen.getByText('Subscribe'));

    expect(control).toBeChecked();
  });

  it('toggles on Space', async () => {
    const user = userEvent.setup();
    render(<Checkbox label="Subscribe" />);
    const control = screen.getByRole('checkbox', { name: 'Subscribe' });

    await user.tab();
    expect(control).toHaveFocus();
    await user.keyboard(' ');

    expect(control).toBeChecked();
  });

  it('supports a controlled checked state', async () => {
    const user = userEvent.setup();
    render(<ControlledCheckbox />);
    const control = screen.getByRole('checkbox', { name: 'Subscribe' });

    expect(control).not.toBeChecked();
    await user.click(control);
    expect(control).toBeChecked();
  });

  it('supports an uncontrolled default with change notification', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Checkbox label="Subscribe" defaultChecked onChange={onChange} />);
    const control = screen.getByRole('checkbox', { name: 'Subscribe' });

    expect(control).toBeChecked();
    await user.click(control);
    expect(control).not.toBeChecked();
    expect(onChange).toHaveBeenCalled();
  });

  it('blocks focus and toggling when disabled', async () => {
    const user = userEvent.setup();
    render(<Checkbox label="Subscribe" disabled />);
    const control = screen.getByRole('checkbox', { name: 'Subscribe' });

    expect(control).toBeDisabled();
    await user.click(control);
    expect(control).not.toBeChecked();
    expect(control).not.toHaveFocus();
  });

  it('exposes a mixed state while indeterminate', () => {
    render(<Checkbox label="Subscribe" indeterminate />);
    const control = screen.getByRole('checkbox', { name: 'Subscribe' });

    expect(control).toBePartiallyChecked();
    expect(control).not.toHaveAttribute('aria-checked');
  });

  it('clears the mixed state when indeterminate becomes false', () => {
    const { rerender } = render(<Checkbox label="Subscribe" indeterminate />);
    const control = screen.getByRole('checkbox', { name: 'Subscribe' });

    expect(control).toBePartiallyChecked();

    rerender(<Checkbox label="Subscribe" indeterminate={false} />);

    expect(control).not.toBePartiallyChecked();
  });

  it('keeps the consumer ref working alongside the internal indeterminate ref', () => {
    const ref = createRef<HTMLInputElement>();
    render(<Checkbox label="Subscribe" indeterminate ref={ref} />);
    const control = screen.getByRole('checkbox', { name: 'Subscribe' });

    expect(ref.current).toBeInstanceOf(HTMLInputElement);
    expect(ref.current).toBe(control);
    expect(ref.current?.indeterminate).toBe(true);
  });

  it('does not submit indeterminate as a third value', async () => {
    const user = userEvent.setup();
    render(<Checkbox label="Subscribe" name="subscribe" value="yes" indeterminate />);
    const control = screen.getByRole('checkbox', { name: 'Subscribe' });

    expect(control).not.toBeChecked();

    await user.click(control);

    expect(control).toBeChecked();
    expect(control).toHaveAttribute('value', 'yes');
  });

  it('stays a checkbox when a conflicting type arrives through a spread', () => {
    render(<Checkbox label="Subscribe" {...textTypeProps()} />);
    const control = screen.getByRole('checkbox', { name: 'Subscribe' });

    expect(control).toHaveAttribute('type', 'checkbox');
    expect(screen.queryByRole('textbox')).toBeNull();
  });
});
