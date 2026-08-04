import { describe, it, expect, vi } from 'vitest';
import { createRef } from 'react';
import type { ReactElement } from 'react';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ErrorSummary, Select, TextField, Textarea } from '@/shared/ui';
import type { ErrorSummaryItem } from '@/shared/ui';

const ITEMS: ErrorSummaryItem[] = [
  { message: 'Enter your email', targetId: 'email-field' },
  { message: 'Delivery is unavailable for this region' },
];

function invalidHeadingLevel(): object {
  return { headingLevel: 7 };
}

function conflictingProps() {
  return {
    children: 'Injected content',
    role: 'alert',
    tabIndex: 0,
    'aria-labelledby': 'wrong-label',
    'aria-live': 'assertive',
    'aria-atomic': true,
    'aria-hidden': true,
    hidden: true,
    inert: true,
    style: { display: 'none' },
    dangerouslySetInnerHTML: { __html: '<span>Wrong content</span>' },
  };
}

function FormWithSummary({ control }: { control: ReactElement }): ReactElement {
  return (
    <div>
      <ErrorSummary
        title="Fix these problems"
        items={[{ message: 'Fix this field', targetId: 'target-control' }]}
      />
      {control}
    </div>
  );
}

describe('ErrorSummary', () => {
  it('renders a native section with a visible heading', () => {
    const { container } = render(<ErrorSummary title="Fix these problems" items={ITEMS} />);

    expect(container.firstElementChild?.tagName.toLowerCase()).toBe('section');
    expect(screen.getByRole('heading', { name: 'Fix these problems' })).toBeInTheDocument();
  });

  it('defaults the heading to level 2', () => {
    render(<ErrorSummary title="Fix these problems" items={ITEMS} />);

    expect(
      screen.getByRole('heading', { level: 2, name: 'Fix these problems' })
    ).toBeInTheDocument();
  });

  it('supports heading levels 3 and 4', () => {
    const { unmount } = render(
      <ErrorSummary title="Fix these problems" items={ITEMS} headingLevel={3} />
    );

    expect(screen.getByRole('heading', { level: 3 })).toBeInTheDocument();
    unmount();

    render(<ErrorSummary title="Fix these problems" items={ITEMS} headingLevel={4} />);

    expect(screen.getByRole('heading', { level: 4 })).toBeInTheDocument();
  });

  it('labels the region with the visible heading', () => {
    const { container } = render(<ErrorSummary title="Fix these problems" items={ITEMS} />);
    const root = container.firstElementChild;
    const labelledBy = root?.getAttribute('aria-labelledby');

    expect(labelledBy).toBeTruthy();
    expect(document.getElementById(labelledBy ?? '')?.textContent).toBe('Fix these problems');
    expect(screen.getByRole('region', { name: 'Fix these problems' })).toBeInTheDocument();
  });

  it('is programmatically focusable but carries no live semantics', () => {
    const { container } = render(<ErrorSummary title="Fix these problems" items={ITEMS} />);
    const root = container.firstElementChild;

    expect(root).toHaveAttribute('tabindex', '-1');
    expect(root).not.toHaveAttribute('role');
    expect(root).not.toHaveAttribute('aria-live');
    expect(screen.queryByRole('alert')).toBeNull();
  });

  it('renders a link for a targeted item and plain text otherwise', () => {
    render(<ErrorSummary title="Fix these problems" items={ITEMS} />);
    const list = screen.getByRole('list');
    const entries = within(list).getAllByRole('listitem');

    expect(entries).toHaveLength(2);
    expect(screen.getByRole('link', { name: 'Enter your email' })).toHaveAttribute(
      'href',
      '#email-field'
    );
    expect(screen.getByText('Delivery is unavailable for this region')).toBeInTheDocument();
    expect(
      screen.queryByRole('link', { name: 'Delivery is unavailable for this region' })
    ).toBeNull();
  });

  it('encodes the target id in the fragment href', () => {
    render(
      <ErrorSummary
        title="Fix these problems"
        items={[{ message: 'Fix this', targetId: 'field name' }]}
      />
    );

    expect(screen.getByRole('link', { name: 'Fix this' })).toHaveAttribute('href', '#field%20name');
  });

  it('does not take focus on mount', () => {
    const { container } = render(<ErrorSummary title="Fix these problems" items={ITEMS} />);

    expect(container.firstElementChild).not.toHaveFocus();
    expect(document.body).toHaveFocus();
  });

  it('exposes the root through a ref so the form owner can focus it', () => {
    const ref = createRef<HTMLElement>();
    const { container } = render(
      <ErrorSummary title="Fix these problems" items={ITEMS} ref={ref} />
    );

    expect(ref.current).toBe(container.firstElementChild);
    expect(ref.current?.tagName.toLowerCase()).toBe('section');

    ref.current?.focus();

    expect(ref.current).toHaveFocus();
  });

  it('focuses a native text input when its summary link is activated', async () => {
    const user = userEvent.setup();
    render(<FormWithSummary control={<TextField label="Email" id="target-control" />} />);

    await user.click(screen.getByRole('link', { name: 'Fix this field' }));

    expect(screen.getByRole('textbox', { name: 'Email' })).toHaveFocus();
  });

  it('focuses a native select when its summary link is activated', async () => {
    const user = userEvent.setup();
    render(
      <FormWithSummary
        control={
          <Select label="Delivery" id="target-control">
            <option value="courier">Courier</option>
          </Select>
        }
      />
    );

    await user.click(screen.getByRole('link', { name: 'Fix this field' }));

    expect(screen.getByRole('combobox', { name: 'Delivery' })).toHaveFocus();
  });

  it('focuses a native textarea when its summary link is activated', async () => {
    const user = userEvent.setup();
    render(<FormWithSummary control={<Textarea label="Comment" id="target-control" />} />);

    await user.click(screen.getByRole('link', { name: 'Fix this field' }));

    expect(screen.getByRole('textbox', { name: 'Comment' })).toHaveFocus();
  });

  it('does not mutate the target tabindex or scroll it into view', async () => {
    const user = userEvent.setup();
    const scrollIntoView = vi.fn();
    Element.prototype.scrollIntoView = scrollIntoView;

    render(<FormWithSummary control={<TextField label="Email" id="target-control" />} />);
    const target = screen.getByRole('textbox', { name: 'Email' });

    await user.click(screen.getByRole('link', { name: 'Fix this field' }));

    expect(target).not.toHaveAttribute('tabindex');
    expect(scrollIntoView).not.toHaveBeenCalled();
  });

  it('does not throw when the target does not exist', async () => {
    const user = userEvent.setup();
    render(
      <ErrorSummary
        title="Fix these problems"
        items={[{ message: 'Missing target', targetId: 'not-rendered' }]}
      />
    );
    const link = screen.getByRole('link', { name: 'Missing target' });

    expect(link).toHaveAttribute('href', '#not-rendered');
    await expect(user.click(link)).resolves.toBeUndefined();
  });

  it('rejects invalid content with clear runtime errors', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);

    expect(() => render(<ErrorSummary title="  " items={ITEMS} />)).toThrow(/non-empty title/i);
    expect(() => render(<ErrorSummary title="Fix these" items={[]} />)).toThrow(/at least one/i);
    expect(() => render(<ErrorSummary title="Fix these" items={[{ message: ' ' }]} />)).toThrow(
      /non-empty message/i
    );
    expect(() =>
      render(<ErrorSummary title="Fix these" items={[{ message: 'Fix this', targetId: '  ' }]} />)
    ).toThrow(/non-empty targetId/i);
    expect(() =>
      render(<ErrorSummary title="Fix these" items={ITEMS} {...invalidHeadingLevel()} />)
    ).toThrow(/unsupported heading level/i);

    consoleError.mockRestore();
  });

  it('keeps ownership of its semantics under a conflicting spread', () => {
    const { container } = render(
      <ErrorSummary title="Fix these problems" items={ITEMS} {...conflictingProps()} />
    );
    const root = container.firstElementChild;

    expect(root?.tagName.toLowerCase()).toBe('section');
    expect(root).not.toHaveAttribute('role');
    expect(root).toHaveAttribute('tabindex', '-1');
    expect(root).not.toHaveAttribute('aria-live');
    expect(root).not.toHaveAttribute('aria-atomic');
    expect(root).not.toHaveAttribute('aria-hidden');
    expect(root).not.toHaveAttribute('hidden');
    expect(root).not.toHaveAttribute('inert');
    expect(root).not.toHaveAttribute('style');
    expect(screen.getByRole('heading', { name: 'Fix these problems' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Enter your email' })).toBeInTheDocument();
    expect(screen.queryByText('Injected content')).toBeNull();
    expect(screen.queryByText('Wrong content')).toBeNull();

    const labelledBy = root?.getAttribute('aria-labelledby');
    expect(labelledBy).not.toBe('wrong-label');
    expect(document.getElementById(labelledBy ?? '')?.textContent).toBe('Fix these problems');
  });
});
