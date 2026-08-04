import { describe, it, expect, vi } from 'vitest';
import { createRef, useState } from 'react';
import type { ReactElement } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Switch } from '@/shared/ui';

function conflictingSwitchProps() {
  return { type: 'text', role: 'checkbox', 'aria-checked': true, indeterminate: true };
}

function ControlledSwitch(): ReactElement {
  const [checked, setChecked] = useState(false);

  return (
    <Switch
      label="Notifications"
      checked={checked}
      onChange={(event) => setChecked(event.target.checked)}
    />
  );
}

describe('Switch', () => {
  it('renders a native checkbox input with switch role', () => {
    render(<Switch label="Notifications" />);
    const control = screen.getByRole('switch', { name: 'Notifications' });

    expect(control.tagName.toLowerCase()).toBe('input');
    expect(control).toHaveAttribute('type', 'checkbox');
    expect(control).toHaveAttribute('role', 'switch');
  });

  it('takes its accessible name from the visible label only', () => {
    render(<Switch label="Notifications" />);

    expect(screen.getByRole('switch', { name: 'Notifications' })).toBeInTheDocument();
    expect(screen.getByText('Notifications')).toBeInTheDocument();
  });

  it('toggles when the visible label is clicked', async () => {
    const user = userEvent.setup();
    render(<Switch label="Notifications" />);
    const control = screen.getByRole('switch', { name: 'Notifications' });

    expect(control).not.toBeChecked();

    await user.click(screen.getByText('Notifications'));

    expect(control).toBeChecked();
  });

  it('toggles on Space', async () => {
    const user = userEvent.setup();
    render(<Switch label="Notifications" />);
    const control = screen.getByRole('switch', { name: 'Notifications' });

    await user.tab();
    expect(control).toHaveFocus();
    await user.keyboard(' ');

    expect(control).toBeChecked();
  });

  it('supports controlled and uncontrolled checked state', async () => {
    const user = userEvent.setup();
    const { unmount } = render(<ControlledSwitch />);
    const controlled = screen.getByRole('switch', { name: 'Notifications' });

    await user.click(controlled);
    expect(controlled).toBeChecked();
    unmount();

    const onChange = vi.fn();
    render(<Switch label="Notifications" defaultChecked onChange={onChange} />);
    const uncontrolled = screen.getByRole('switch', { name: 'Notifications' });

    expect(uncontrolled).toBeChecked();
    await user.click(uncontrolled);
    expect(uncontrolled).not.toBeChecked();
    expect(onChange).toHaveBeenCalled();
  });

  it('blocks toggling when disabled', async () => {
    const user = userEvent.setup();
    render(<Switch label="Notifications" disabled />);
    const control = screen.getByRole('switch', { name: 'Notifications' });

    expect(control).toBeDisabled();
    await user.click(control);
    expect(control).not.toBeChecked();
  });

  it('exposes no mixed or indeterminate state', () => {
    render(<Switch label="Notifications" {...conflictingSwitchProps()} />);
    const control = screen.getByRole('switch', { name: 'Notifications' });

    expect(control).not.toBePartiallyChecked();
    expect(control).not.toHaveAttribute('indeterminate');
  });

  it('keeps its role, type and checked ownership under a conflicting spread', () => {
    render(<Switch label="Notifications" {...conflictingSwitchProps()} />);
    const control = screen.getByRole('switch', { name: 'Notifications' });

    expect(control).toHaveAttribute('role', 'switch');
    expect(control).toHaveAttribute('type', 'checkbox');
    expect(control).not.toHaveAttribute('aria-checked');
    expect(screen.queryByRole('checkbox')).toBeNull();
  });

  it('forwards the ref to the native input', () => {
    const ref = createRef<HTMLInputElement>();
    render(<Switch label="Notifications" ref={ref} />);

    expect(ref.current).toBeInstanceOf(HTMLInputElement);
    expect(ref.current).toBe(screen.getByRole('switch', { name: 'Notifications' }));
  });
});
