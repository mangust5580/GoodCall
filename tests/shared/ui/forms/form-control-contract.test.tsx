import { describe, it, expect, vi } from 'vitest';
import type { ReactElement } from 'react';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Checkbox, Radio, Select, Switch, Textarea, TextField } from '@/shared/ui';

const REQUIRED_INDICATION = 'Обязательное поле';

function conflictingProps() {
  return {
    role: 'presentation',
    tabIndex: -1,
    hidden: true,
    inert: true,
    contentEditable: true,
    style: { display: 'none' },
    autoFocus: true,
    'aria-label': 'Wrong name',
    'aria-labelledby': 'wrong-label',
    'aria-invalid': false,
    'aria-errormessage': 'wrong-error',
    'aria-disabled': true,
    'aria-readonly': true,
    'aria-required': false,
    'aria-busy': true,
    'aria-hidden': true,
    'aria-checked': false,
    children: 'Wrong child content',
    dangerouslySetInnerHTML: { __html: '<span>Wrong content</span>' },
  };
}

type FieldCase = {
  name: string;
  role: string;
  label: string;
  ownedRole: string | undefined;
  supportsAriaInvalid: boolean;
  render: (extra: object) => ReactElement;
  renderBlankLabel: () => ReactElement;
};

const CASES: FieldCase[] = [
  {
    name: 'TextField',
    role: 'textbox',
    label: 'Email',
    ownedRole: undefined,
    supportsAriaInvalid: true,
    render: (extra) => <TextField label="Email" {...extra} />,
    renderBlankLabel: () => <TextField label="   " />,
  },
  {
    name: 'Textarea',
    role: 'textbox',
    label: 'Comment',
    ownedRole: undefined,
    supportsAriaInvalid: true,
    render: (extra) => <Textarea label="Comment" {...extra} />,
    renderBlankLabel: () => <Textarea label="   " />,
  },
  {
    name: 'Select',
    role: 'combobox',
    label: 'Delivery',
    ownedRole: undefined,
    supportsAriaInvalid: true,
    render: (extra) => (
      <Select label="Delivery" {...extra}>
        <option value="courier">Courier</option>
        <option value="pickup">Pickup</option>
      </Select>
    ),
    renderBlankLabel: () => (
      <Select label="   ">
        <option value="courier">Courier</option>
      </Select>
    ),
  },
  {
    name: 'Checkbox',
    role: 'checkbox',
    label: 'Subscribe',
    ownedRole: undefined,
    supportsAriaInvalid: true,
    render: (extra) => <Checkbox label="Subscribe" {...extra} />,
    renderBlankLabel: () => <Checkbox label="   " />,
  },
  {
    name: 'Radio',
    role: 'radio',
    label: 'Courier',
    ownedRole: undefined,
    supportsAriaInvalid: false,
    render: (extra) => <Radio label="Courier" name="delivery" value="courier" {...extra} />,
    renderBlankLabel: () => <Radio label="   " name="delivery" value="courier" />,
  },
  {
    name: 'Switch',
    role: 'switch',
    label: 'Notifications',
    ownedRole: 'switch',
    supportsAriaInvalid: true,
    render: (extra) => <Switch label="Notifications" {...extra} />,
    renderBlankLabel: () => <Switch label="   " />,
  },
];

describe('Form control shared contract', () => {
  for (const field of CASES) {
    describe(field.name, () => {
      it('renders a visible label that names the control', () => {
        const { container } = render(field.render({}));

        expect(screen.getByRole(field.role, { name: field.label })).toBeInTheDocument();
        expect(container.querySelector('label')?.textContent).toContain(field.label);
      });

      it('uses an explicit consumer id', () => {
        const { container } = render(field.render({ id: 'consumer-field' }));

        expect(screen.getByRole(field.role, { name: field.label })).toHaveAttribute(
          'id',
          'consumer-field'
        );
        expect(container.querySelector('label')).toHaveAttribute('for', 'consumer-field');
      });

      it('generates a stable fallback id and associates the label with it', () => {
        const { container } = render(field.render({}));
        const control = screen.getByRole(field.role, { name: field.label });

        expect(control.id.length).toBeGreaterThan(0);
        expect(container.querySelector('label')).toHaveAttribute('for', control.id);
      });

      it('moves focus to the control when the label is activated', async () => {
        const user = userEvent.setup();
        const { container } = render(field.render({}));
        const label = container.querySelector('label');

        expect(label).not.toBeNull();
        if (label !== null) {
          await user.click(label);
        }

        expect(screen.getByRole(field.role, { name: field.label })).toHaveFocus();
      });

      it('associates the description and places it before the error', () => {
        render(field.render({ description: 'Help text', error: 'Something is wrong' }));

        const control = screen.getByRole(field.role, { name: field.label });
        const describedBy = control.getAttribute('aria-describedby')?.split(' ') ?? [];

        expect(describedBy).toHaveLength(2);
        expect(document.getElementById(describedBy[0] ?? '')?.textContent).toBe('Help text');
        expect(document.getElementById(describedBy[1] ?? '')?.textContent).toBe(
          'Something is wrong'
        );
      });

      it('keeps external described-by ids between the description and the error', () => {
        render(
          field.render({
            description: 'Help text',
            error: 'Something is wrong',
            'aria-describedby': 'external-one external-two',
          })
        );

        const control = screen.getByRole(field.role, { name: field.label });
        const describedBy = control.getAttribute('aria-describedby')?.split(' ') ?? [];

        expect(describedBy).toHaveLength(4);
        expect(describedBy[1]).toBe('external-one');
        expect(describedBy[2]).toBe('external-two');
        expect(document.getElementById(describedBy[0] ?? '')?.textContent).toBe('Help text');
        expect(document.getElementById(describedBy[3] ?? '')?.textContent).toBe(
          'Something is wrong'
        );
      });

      it('deduplicates repeated described-by ids and keeps the first position', () => {
        render(field.render({ 'aria-describedby': 'shared  shared other shared' }));

        const control = screen.getByRole(field.role, { name: field.label });

        expect(control).toHaveAttribute('aria-describedby', 'shared other');
      });

      it('renders no description or error container when both are absent', () => {
        const { container } = render(field.render({}));
        const control = screen.getByRole(field.role, { name: field.label });

        expect(control).not.toHaveAttribute('aria-describedby');
        expect(container.querySelectorAll('p')).toHaveLength(0);
      });

      it('treats blank description and error text as absent', () => {
        const { container } = render(field.render({ description: '   ', error: '  ' }));
        const control = screen.getByRole(field.role, { name: field.label });

        expect(control).not.toHaveAttribute('aria-describedby');
        expect(control).not.toHaveAttribute('aria-invalid');
        expect(container.querySelectorAll('p')).toHaveLength(0);
      });

      it('marks the control invalid only when an error is present', () => {
        const { unmount } = render(field.render({}));

        expect(screen.getByRole(field.role, { name: field.label })).not.toHaveAttribute(
          'aria-invalid'
        );
        unmount();

        render(field.render({ error: 'Something is wrong' }));
        const control = screen.getByRole(field.role, { name: field.label });

        if (field.supportsAriaInvalid) {
          expect(control).toHaveAttribute('aria-invalid', 'true');
        } else {
          expect(control).not.toHaveAttribute('aria-invalid');
        }

        expect(screen.getByText('Something is wrong')).toBeInTheDocument();
        expect(control.getAttribute('aria-describedby')).toBe(
          screen.getByText('Something is wrong').id
        );
      });

      it('does not turn the error text into a live region', () => {
        render(field.render({ error: 'Something is wrong' }));
        const message = screen.getByText('Something is wrong');

        expect(message).not.toHaveAttribute('role');
        expect(message).not.toHaveAttribute('aria-live');
      });

      it('uses the native required attribute with visible required text', () => {
        render(field.render({ required: true }));
        const control = screen.getByRole(field.role, { name: field.label });

        expect(control).toBeRequired();
        expect(screen.getByText(REQUIRED_INDICATION)).toBeInTheDocument();
        expect(control).not.toHaveAttribute('aria-required');
      });

      it('hides the decorative required text from the accessibility tree', () => {
        render(field.render({ required: true }));

        expect(screen.getByText(REQUIRED_INDICATION)).toHaveAttribute('aria-hidden', 'true');
        expect(screen.getByRole(field.role, { name: field.label })).toBeInTheDocument();
      });

      it('keeps the consumer className on the field wrapper, not on the control', () => {
        const { container } = render(field.render({ className: 'consumer-hook' }));
        const wrapper = container.firstElementChild;
        const control = screen.getByRole(field.role, { name: field.label });

        expect(wrapper?.classList.contains('consumer-hook')).toBe(true);
        expect(control.classList.contains('consumer-hook')).toBe(false);
      });

      it('forwards safe consumer attributes to the control', () => {
        render(field.render({ 'aria-controls': 'panel-id', 'data-testid': 'field-control' }));
        const control = screen.getByRole(field.role, { name: field.label });

        expect(control).toHaveAttribute('aria-controls', 'panel-id');
        expect(control).toHaveAttribute('data-testid', 'field-control');
      });

      it('rejects a blank label with a clear runtime error', () => {
        const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);

        expect(() => render(field.renderBlankLabel())).toThrow(/non-empty label/i);

        consoleError.mockRestore();
      });

      it('keeps its semantics when conflicting props arrive through a spread', async () => {
        const user = userEvent.setup();

        render(field.render(conflictingProps()));

        const control = screen.getByRole(field.role, { name: field.label });

        if (field.ownedRole === undefined) {
          expect(control).not.toHaveAttribute('role');
        } else {
          expect(control).toHaveAttribute('role', field.ownedRole);
        }

        expect(control).not.toHaveAttribute('hidden');
        expect(control).not.toHaveAttribute('aria-hidden');
        expect(control).not.toHaveAttribute('inert');
        expect(control).not.toHaveAttribute('contenteditable');
        expect(control).not.toHaveAttribute('style');
        expect(control).not.toHaveAttribute('tabindex');
        expect(control).not.toHaveAttribute('aria-label');
        expect(control).not.toHaveAttribute('aria-labelledby');
        expect(control).not.toHaveAttribute('aria-invalid');
        expect(control).not.toHaveAttribute('aria-errormessage');
        expect(control).not.toHaveAttribute('aria-disabled');
        expect(control).not.toHaveAttribute('aria-readonly');
        expect(control).not.toHaveAttribute('aria-required');
        expect(control).not.toHaveAttribute('aria-busy');
        expect(control).not.toHaveAttribute('aria-checked');
        expect(control).not.toHaveFocus();
        expect(screen.queryByText('Wrong content')).toBeNull();
        expect(screen.queryByText('Wrong child content')).toBeNull();
        expect(screen.queryByRole(field.role, { name: 'Wrong name' })).toBeNull();
        expect(screen.getByRole(field.role, { name: field.label })).toBeInTheDocument();

        await user.tab();
        expect(control).toHaveFocus();
      });
    });
  }

  describe('choice control activation target', () => {
    const CHOICE_CASES = CASES.filter(
      (field) => field.role !== 'textbox' && field.role !== 'combobox'
    );

    for (const field of CHOICE_CASES) {
      describe(field.name, () => {
        it('nests the native control inside the clickable label row', () => {
          const { container } = render(field.render({}));
          const control = screen.getByRole(field.role, { name: field.label });
          const label = container.querySelector('label');

          expect(label).not.toBeNull();
          expect(label?.contains(control)).toBe(true);
          expect(control.closest('label')).toBe(label);
        });

        it('makes the label itself the row, with no non-interactive wrapper between it and the field', () => {
          const { container } = render(field.render({}));
          const wrapper = container.firstElementChild;
          const label = container.querySelector('label');

          expect(wrapper?.firstElementChild).toBe(label);
          expect(label?.tagName.toLowerCase()).toBe('label');
          expect(label?.parentElement).toBe(wrapper);
        });

        it('keeps the control before the visible text in DOM order', () => {
          const { container } = render(field.render({}));
          const label = container.querySelector('label');
          const control = screen.getByRole(field.role, { name: field.label });

          expect(label?.firstElementChild).toBe(control);
          expect(label?.textContent).toContain(field.label);
        });

        it('activates the native control when the label row is clicked', async () => {
          const user = userEvent.setup();
          const { container } = render(field.render({}));
          const control = screen.getByRole(field.role, { name: field.label });
          const label = container.querySelector('label');

          expect(control).not.toBeChecked();
          if (label !== null) {
            await user.click(label);
          }

          expect(control).toBeChecked();
          expect(control).toHaveFocus();
        });

        it('activates the native control when the visible text is clicked', async () => {
          const user = userEvent.setup();
          render(field.render({}));
          const control = screen.getByRole(field.role, { name: field.label });

          await user.click(screen.getByText(field.label));

          expect(control).toBeChecked();
          expect(control).toHaveFocus();
        });

        it('separates the required indication from the label text', () => {
          const { container } = render(field.render({ required: true }));
          const indication = screen.getByText(REQUIRED_INDICATION);
          const labelText = screen.getByText(field.label);

          expect(indication).not.toBe(labelText);
          expect(indication.contains(labelText)).toBe(false);
          expect(labelText.contains(indication)).toBe(false);
          expect(indication).toHaveAttribute('aria-hidden', 'true');
          expect(container.querySelector('label')?.contains(indication)).toBe(true);
        });

        it('keeps the description and error after the choice row', () => {
          const { container } = render(
            field.render({ description: 'Help text', error: 'Something is wrong' })
          );
          const wrapper = container.firstElementChild;
          const children = Array.from(wrapper?.children ?? []);

          expect(children[0]?.tagName.toLowerCase()).toBe('label');
          expect(children[1]?.textContent).toBe('Help text');
          expect(children[2]?.textContent).toBe('Something is wrong');
        });
      });
    }
  });

  it('keeps Select option children intact under a conflicting spread', () => {
    render(
      <Select label="Delivery" {...conflictingProps()}>
        <option value="courier">Courier</option>
        <option value="pickup">Pickup</option>
      </Select>
    );

    const select = screen.getByRole('combobox', { name: 'Delivery' });

    expect(within(select).getAllByRole('option')).toHaveLength(2);
  });
});
