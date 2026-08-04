import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from '@/shared/ui';
import type { ActionVariant } from '@/shared/ui';

const VARIANTS: ActionVariant[] = ['primary', 'secondary', 'tertiary', 'destructive'];

function rawHtmlProps() {
  return { dangerouslySetInnerHTML: { __html: '<span>Wrong content</span>' } };
}

describe('Button', () => {
  it('renders a native button', () => {
    render(<Button>Save</Button>);

    const button = screen.getByRole('button', { name: 'Save' });

    expect(button.tagName.toLowerCase()).toBe('button');
  });

  it('defaults to type button', () => {
    render(<Button>Save</Button>);

    expect(screen.getByRole('button', { name: 'Save' })).toHaveAttribute('type', 'button');
  });

  it('passes an explicit submit or reset type through', () => {
    const { unmount } = render(<Button type="submit">Submit</Button>);

    expect(screen.getByRole('button', { name: 'Submit' })).toHaveAttribute('type', 'submit');
    unmount();

    render(<Button type="reset">Reset</Button>);

    expect(screen.getByRole('button', { name: 'Reset' })).toHaveAttribute('type', 'reset');
  });

  it('derives its accessible name from the visible label', () => {
    render(<Button>Add to cart</Button>);

    expect(screen.getByRole('button', { name: 'Add to cart' })).toBeInTheDocument();
    expect(screen.getByText('Add to cart')).toBeInTheDocument();
  });

  it('activates on pointer click', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Save</Button>);

    await user.click(screen.getByRole('button', { name: 'Save' }));

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('activates on Enter', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Save</Button>);

    await user.tab();
    expect(screen.getByRole('button', { name: 'Save' })).toHaveFocus();
    await user.keyboard('{Enter}');

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('activates on Space', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Save</Button>);

    await user.tab();
    await user.keyboard(' ');

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('blocks activation while disabled', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <Button disabled onClick={onClick}>
        Save
      </Button>
    );

    const button = screen.getByRole('button', { name: 'Save' });

    expect(button).toBeDisabled();
    await user.click(button);

    expect(onClick).not.toHaveBeenCalled();
  });

  it('blocks activation while loading', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <Button isLoading onClick={onClick}>
        Save
      </Button>
    );

    const button = screen.getByRole('button', { name: 'Save' });

    await user.click(button);
    await user.click(button);

    expect(onClick).not.toHaveBeenCalled();
  });

  it('marks the loading control as disabled and busy', () => {
    render(<Button isLoading>Save</Button>);

    const button = screen.getByRole('button', { name: 'Save' });

    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('aria-busy', 'true');
  });

  it('is not busy when idle', () => {
    render(<Button>Save</Button>);

    expect(screen.getByRole('button', { name: 'Save' })).not.toHaveAttribute('aria-busy');
  });

  it('keeps the accessible name and visible label stable while loading', () => {
    const { rerender } = render(<Button>Save</Button>);

    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();

    rerender(<Button isLoading>Save</Button>);

    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
    expect(screen.getByText('Save')).toBeInTheDocument();
  });

  it('hides the loading indicator from the accessibility tree', () => {
    const { container } = render(<Button isLoading>Save</Button>);
    const hidden = container.querySelectorAll('[aria-hidden="true"]');

    expect(hidden.length).toBe(1);
    expect(hidden[0]?.textContent).toBe('');
  });

  it('stays disabled when the consumer disables a loading control', () => {
    render(
      <Button disabled isLoading>
        Save
      </Button>
    );

    expect(screen.getByRole('button', { name: 'Save' })).toBeDisabled();
  });

  it('passes consumer identity, safe ARIA props and className to the root', () => {
    render(
      <Button id="save-action" aria-describedby="save-hint" className="consumer-hook">
        Save
      </Button>
    );

    const button = screen.getByRole('button', { name: 'Save' });

    expect(button.id).toBe('save-action');
    expect(button).toHaveAttribute('aria-describedby', 'save-hint');
    expect(button.classList.contains('consumer-hook')).toBe(true);
  });

  it('accepts every approved variant', () => {
    for (const variant of VARIANTS) {
      const { unmount } = render(<Button variant={variant}>Save</Button>);

      expect(screen.getByRole('button', { name: 'Save' }).tagName.toLowerCase()).toBe('button');
      unmount();
    }
  });

  it('keeps ownership of its semantics when conflicting props arrive through a spread', () => {
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
      <Button isLoading {...forwarded}>
        Save
      </Button>
    );

    const button = screen.getByRole('button', { name: 'Save' });

    expect(button.tagName.toLowerCase()).toBe('button');
    expect(button).not.toHaveAttribute('role');
    expect(button).not.toHaveAttribute('aria-label');
    expect(button).not.toHaveAttribute('aria-labelledby');
    expect(button).not.toHaveAttribute('aria-disabled');
    expect(button).not.toHaveAttribute('tabindex');
    expect(button).toHaveAttribute('aria-busy', 'true');
    expect(button).toBeDisabled();
    expect(button.classList.contains('consumer-hook')).toBe(true);
    expect(button.classList.length).toBeGreaterThan(1);
    expect(screen.getByText('Save')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Wrong name' })).toBeNull();
  });

  it('cannot be hidden from the accessibility tree through a spread', async () => {
    const user = userEvent.setup();
    const forwarded = {
      hidden: true,
      'aria-hidden': true,
      inert: true,
    };

    render(<Button {...forwarded}>Save</Button>);

    const button = screen.getByRole('button', { name: 'Save' });

    expect(button).not.toHaveAttribute('hidden');
    expect(button).not.toHaveAttribute('aria-hidden');
    expect(button).not.toHaveAttribute('inert');
    expect(screen.getByText('Save')).toBeInTheDocument();

    await user.tab();
    expect(button).toHaveFocus();
  });

  it('keeps ownership of its content when raw HTML arrives through a spread', () => {
    expect(() => render(<Button {...rawHtmlProps()}>Save</Button>)).not.toThrow();

    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
    expect(screen.getByText('Save')).toBeInTheDocument();
    expect(screen.queryByText('Wrong content')).toBeNull();
  });

  it('does not adopt a forwarded busy state while idle', () => {
    const forwarded = { 'aria-busy': true };

    render(<Button {...forwarded}>Save</Button>);

    expect(screen.getByRole('button', { name: 'Save' })).not.toHaveAttribute('aria-busy');
  });

  it('introduces no navigation semantics', () => {
    const { container } = render(<Button>Save</Button>);

    expect(container.querySelector('a')).toBeNull();
    expect(screen.getByRole('button', { name: 'Save' })).not.toHaveAttribute('href');
    expect(screen.queryByRole('link')).toBeNull();
  });
});
