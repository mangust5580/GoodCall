import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IconButton } from '@/shared/ui';
import type { ActionVariant } from '@/shared/ui';

const VARIANTS: ActionVariant[] = ['primary', 'secondary', 'tertiary', 'destructive'];

function rawHtmlProps() {
  return { dangerouslySetInnerHTML: { __html: '<span>Wrong content</span>' } };
}

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

  it('keeps ownership of its accessible name when conflicting props arrive through a spread', () => {
    const forwarded = {
      role: 'link',
      'aria-label': 'Wrong name',
      'aria-labelledby': 'wrong-label',
      'aria-disabled': true,
      tabIndex: -1,
      'aria-busy': false,
      className: 'consumer-hook',
    };

    render(
      <IconButton label="Close dialog" isLoading {...forwarded}>
        x
      </IconButton>
    );

    const button = screen.getByRole('button', { name: 'Close dialog' });

    expect(button.tagName.toLowerCase()).toBe('button');
    expect(button).not.toHaveAttribute('role');
    expect(button).toHaveAttribute('aria-label', 'Close dialog');
    expect(button).not.toHaveAttribute('aria-labelledby');
    expect(button).not.toHaveAttribute('aria-disabled');
    expect(button).not.toHaveAttribute('tabindex');
    expect(button).toHaveAttribute('aria-busy', 'true');
    expect(button).toBeDisabled();
    expect(button.classList.contains('consumer-hook')).toBe(true);
    expect(button.classList.length).toBeGreaterThan(1);
    expect(screen.queryByRole('button', { name: 'Wrong name' })).toBeNull();
  });

  it('cannot be hidden from the accessibility tree through a spread', async () => {
    const user = userEvent.setup();
    const forwarded = {
      hidden: true,
      'aria-hidden': true,
      inert: true,
    };

    const { container } = render(
      <IconButton label="Close dialog" {...forwarded}>
        decorative
      </IconButton>
    );

    const button = screen.getByRole('button', { name: 'Close dialog' });

    expect(button).not.toHaveAttribute('hidden');
    expect(button).not.toHaveAttribute('aria-hidden');
    expect(button).not.toHaveAttribute('inert');
    expect(button).toHaveAttribute('aria-label', 'Close dialog');

    const decorative = container.querySelector('[aria-hidden="true"]');

    expect(decorative).not.toBeNull();
    expect(decorative).not.toBe(button);
    expect(decorative?.textContent).toBe('decorative');

    await user.tab();
    expect(button).toHaveFocus();
  });

  it('keeps ownership of its content when raw HTML arrives through a spread', () => {
    const { container } = render(
      <IconButton label="Close dialog" {...rawHtmlProps()}>
        decorative
      </IconButton>
    );

    expect(screen.getByRole('button', { name: 'Close dialog' })).toBeInTheDocument();
    expect(screen.queryByText('Wrong content')).toBeNull();
    expect(container.querySelector('[aria-hidden="true"]')?.textContent).toBe('decorative');
  });

  it('does not adopt a forwarded busy state while idle', () => {
    const forwarded = { 'aria-busy': true };

    render(
      <IconButton label="Close dialog" {...forwarded}>
        x
      </IconButton>
    );

    expect(screen.getByRole('button', { name: 'Close dialog' })).not.toHaveAttribute('aria-busy');
  });

  it('imports no icon or image asset of its own', () => {
    const { container } = render(<IconButton label="Close dialog">x</IconButton>);

    expect(container.querySelector('img')).toBeNull();
    expect(container.querySelector('svg')).toBeNull();
    expect(container.querySelector('use')).toBeNull();
  });
});
