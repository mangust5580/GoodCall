import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IconButton } from '@/shared/ui';
import type { ActionVariant } from '@/shared/ui';

const VARIANTS: ActionVariant[] = ['primary', 'secondary', 'tertiary', 'destructive'];

describe('IconButton', () => {
  it('renders a native button', () => {
    render(<IconButton label="Close dialog">x</IconButton>);

    const button = screen.getByRole('button', { name: 'Close dialog' });

    expect(button.tagName.toLowerCase()).toBe('button');
  });

  it('defaults to type button and accepts explicit submit', () => {
    const { unmount } = render(<IconButton label="Close dialog">x</IconButton>);

    expect(screen.getByRole('button', { name: 'Close dialog' })).toHaveAttribute('type', 'button');
    unmount();

    render(
      <IconButton label="Submit form" type="submit">
        x
      </IconButton>
    );

    expect(screen.getByRole('button', { name: 'Submit form' })).toHaveAttribute('type', 'submit');
  });

  it('takes its accessible name from the label prop only', () => {
    render(<IconButton label="Close dialog">decorative</IconButton>);

    expect(screen.getByRole('button', { name: 'Close dialog' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'decorative' })).toBeNull();
  });

  it('excludes the visual content from the accessibility tree', () => {
    const { container } = render(<IconButton label="Close dialog">decorative</IconButton>);
    const visual = container.querySelector('[aria-hidden="true"]');

    expect(visual).not.toBeNull();
    expect(visual?.textContent).toBe('decorative');
  });

  it('rejects a blank label with a clear runtime error', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);

    expect(() => render(<IconButton label="   ">x</IconButton>)).toThrow(/non-empty label/i);
    expect(() => render(<IconButton label="">x</IconButton>)).toThrow(/non-empty label/i);

    consoleError.mockRestore();
  });

  it('activates on pointer click', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <IconButton label="Close dialog" onClick={onClick}>
        x
      </IconButton>
    );

    await user.click(screen.getByRole('button', { name: 'Close dialog' }));

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('activates on Enter and Space', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <IconButton label="Close dialog" onClick={onClick}>
        x
      </IconButton>
    );

    await user.tab();
    expect(screen.getByRole('button', { name: 'Close dialog' })).toHaveFocus();
    await user.keyboard('{Enter}');
    await user.keyboard(' ');

    expect(onClick).toHaveBeenCalledTimes(2);
  });

  it('blocks activation while disabled or loading', async () => {
    const user = userEvent.setup();
    const onDisabledClick = vi.fn();
    const onLoadingClick = vi.fn();

    const { unmount } = render(
      <IconButton label="Close dialog" disabled onClick={onDisabledClick}>
        x
      </IconButton>
    );

    await user.click(screen.getByRole('button', { name: 'Close dialog' }));
    expect(onDisabledClick).not.toHaveBeenCalled();
    unmount();

    render(
      <IconButton label="Close dialog" isLoading onClick={onLoadingClick}>
        x
      </IconButton>
    );

    await user.click(screen.getByRole('button', { name: 'Close dialog' }));
    expect(onLoadingClick).not.toHaveBeenCalled();
  });

  it('keeps the accessible name and marks the control busy while loading', () => {
    render(
      <IconButton label="Close dialog" isLoading>
        x
      </IconButton>
    );

    const button = screen.getByRole('button', { name: 'Close dialog' });

    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('aria-busy', 'true');
  });

  it('keeps the loading indicator out of the accessibility tree', () => {
    const { container } = render(
      <IconButton label="Close dialog" isLoading>
        decorative
      </IconButton>
    );
    const hidden = container.querySelectorAll('[aria-hidden="true"]');

    expect(hidden.length).toBe(1);
    expect(hidden[0]?.textContent).toBe('');
  });

  it('accepts every approved variant', () => {
    for (const variant of VARIANTS) {
      const { unmount } = render(
        <IconButton label="Close dialog" variant={variant}>
          x
        </IconButton>
      );

      expect(screen.getByRole('button', { name: 'Close dialog' }).tagName.toLowerCase()).toBe(
        'button'
      );
      unmount();
    }
  });

  it('passes consumer identity, safe ARIA props and className to the root', () => {
    render(
      <IconButton
        label="Close dialog"
        id="close-action"
        aria-describedby="close-hint"
        className="consumer-hook"
      >
        x
      </IconButton>
    );

    const button = screen.getByRole('button', { name: 'Close dialog' });

    expect(button.id).toBe('close-action');
    expect(button).toHaveAttribute('aria-describedby', 'close-hint');
    expect(button.classList.contains('consumer-hook')).toBe(true);
  });

  it('imports no icon or image asset of its own', () => {
    const { container } = render(<IconButton label="Close dialog">x</IconButton>);

    expect(container.querySelector('img')).toBeNull();
    expect(container.querySelector('svg')).toBeNull();
    expect(container.querySelector('use')).toBeNull();
  });
});
