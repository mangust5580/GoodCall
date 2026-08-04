import { describe, it, expect, vi } from 'vitest';
import { createRef, useState } from 'react';
import type { ReactElement } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Textarea } from '@/shared/ui';

function rawHtmlProps() {
  return { dangerouslySetInnerHTML: { __html: '<span>Wrong content</span>' } };
}

function ControlledTextarea(): ReactElement {
  const [value, setValue] = useState('start');

  return (
    <Textarea label="Comment" value={value} onChange={(event) => setValue(event.target.value)} />
  );
}

describe('Textarea', () => {
  it('renders a native textarea', () => {
    render(<Textarea label="Comment" />);
    const control = screen.getByRole('textbox', { name: 'Comment' });

    expect(control.tagName.toLowerCase()).toBe('textarea');
  });

  it('supports a controlled value', async () => {
    const user = userEvent.setup();
    render(<ControlledTextarea />);
    const control = screen.getByRole('textbox', { name: 'Comment' });

    expect(control).toHaveValue('start');

    await user.clear(control);
    await user.type(control, 'typed');

    expect(control).toHaveValue('typed');
  });

  it('supports an uncontrolled default value and multiline input', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Textarea label="Comment" defaultValue="first" onChange={onChange} />);
    const control = screen.getByRole('textbox', { name: 'Comment' });

    await user.click(control);
    await user.keyboard('{Enter}second');

    expect(control).toHaveValue('first\nsecond');
    expect(onChange).toHaveBeenCalled();
  });

  it('passes native sizing and wrapping attributes through', () => {
    render(<Textarea label="Comment" rows={7} wrap="soft" maxLength={50} />);
    const control = screen.getByRole('textbox', { name: 'Comment' });

    expect(control).toHaveAttribute('rows', '7');
    expect(control).toHaveAttribute('wrap', 'soft');
    expect(control).toHaveAttribute('maxlength', '50');
  });

  it('exposes read-only and disabled as distinct states', async () => {
    const user = userEvent.setup();
    const { unmount } = render(<Textarea label="Comment" defaultValue="locked" readOnly />);
    const readOnlyControl = screen.getByRole('textbox', { name: 'Comment' });

    expect(readOnlyControl).toHaveAttribute('readonly');
    expect(readOnlyControl).not.toBeDisabled();
    await user.click(readOnlyControl);
    expect(readOnlyControl).toHaveFocus();
    await user.type(readOnlyControl, 'edit');
    expect(readOnlyControl).toHaveValue('locked');
    unmount();

    render(<Textarea label="Comment" defaultValue="locked" disabled />);
    const disabledControl = screen.getByRole('textbox', { name: 'Comment' });

    expect(disabledControl).toBeDisabled();
    expect(disabledControl).not.toHaveAttribute('readonly');
    await user.click(disabledControl);
    expect(disabledControl).not.toHaveFocus();
  });

  it('keeps ownership of its content when raw HTML arrives through a spread', () => {
    render(<Textarea label="Comment" defaultValue="kept" {...rawHtmlProps()} />);

    expect(screen.getByRole('textbox', { name: 'Comment' })).toHaveValue('kept');
    expect(screen.queryByText('Wrong content')).toBeNull();
  });

  it('forwards the ref to the native textarea', () => {
    const ref = createRef<HTMLTextAreaElement>();
    render(<Textarea label="Comment" ref={ref} />);

    expect(ref.current).toBeInstanceOf(HTMLTextAreaElement);
    expect(ref.current).toBe(screen.getByRole('textbox', { name: 'Comment' }));
  });
});
