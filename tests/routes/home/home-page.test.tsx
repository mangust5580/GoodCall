import { describe, it, expect } from 'vitest';
import type { RenderResult } from '@testing-library/react';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { HomePage } from '@/routes/home/HomePage';

const TECHNICAL_NOTICE =
  'Technical Shared UI verification surface — not the canonical storefront Home page.';
const SUCCESS_RESULT = 'Demonstration form validated. No data was sent.';
const SUMMARY_TITLE = 'Fix these demonstration fields';

function renderHome(): RenderResult {
  const router = createMemoryRouter(
    [
      { path: '/', element: <HomePage /> },
      { path: '/catalog/laptops', element: <h1>Category</h1> },
      { path: '/products/demo-product', element: <h1>Product</h1> },
      { path: '/cart', element: <h1>Cart</h1> },
    ],
    { initialEntries: ['/'] }
  );

  return render(<RouterProvider router={router} />);
}

async function submitForm(user: ReturnType<typeof userEvent.setup>): Promise<void> {
  await user.click(screen.getByRole('button', { name: /validate demonstration form/i }));
}

describe('Home Shared UI verification surface', () => {
  describe('structure', () => {
    it('renders exactly one main landmark owned by PageContainer', () => {
      const { container } = renderHome();
      const mains = container.querySelectorAll('main');

      expect(mains).toHaveLength(1);
      expect(mains[0]).toHaveAttribute('id', 'main-content');
      expect(mains[0]).toHaveAttribute('tabindex', '-1');
      expect(screen.getByRole('main')).toBe(mains[0]);
    });

    it('renders exactly one h1 that keeps the routing focus contract', () => {
      const { container } = renderHome();
      const headings = container.querySelectorAll('h1');

      expect(headings).toHaveLength(1);
      expect(headings[0]).toHaveAttribute('data-route-focus');
      expect(headings[0]).toHaveAttribute('tabindex', '-1');
      expect(headings[0]?.textContent).toContain('GoodCall');
    });

    it('states that the page is not the canonical storefront Home', () => {
      renderHome();

      expect(screen.getByText(TECHNICAL_NOTICE)).toBeInTheDocument();
    });

    it('preserves the three existing route links', () => {
      renderHome();

      expect(screen.getByRole('link', { name: 'Catalog Category' })).toHaveAttribute(
        'href',
        '/catalog/laptops'
      );
      expect(screen.getByRole('link', { name: 'Product Details' })).toHaveAttribute(
        'href',
        '/products/demo-product'
      );
      expect(screen.getByRole('link', { name: 'Shopping Cart' })).toHaveAttribute('href', '/cart');
    });

    it('names the navigation landmark', () => {
      renderHome();

      expect(screen.getByRole('navigation', { name: /route navigation/i })).toBeInTheDocument();
    });

    it('renders no header, footer or brand image', () => {
      const { container } = renderHome();

      expect(container.querySelector('header')).toBeNull();
      expect(container.querySelector('footer')).toBeNull();
      expect(container.querySelector('img')).toBeNull();
      expect(container.querySelector('svg')).toBeNull();
    });
  });

  describe('primitive integration', () => {
    it('renders the compact feedback primitives', () => {
      renderHome();

      expect(screen.getByText('Technical')).toBeInTheDocument();
      expect(screen.getByText('Verification surface')).toBeInTheDocument();
      expect(screen.getByTestId('demo-counter')).toHaveTextContent('0');
      expect(screen.getByText('Demonstration counter value: 0')).toBeInTheDocument();
    });

    it('renders the action primitives', () => {
      renderHome();

      expect(
        screen.getByRole('button', { name: /increment demonstration counter/i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /reset demonstration counter/i })
      ).toBeInTheDocument();
    });

    it('renders the layout evidence panels', () => {
      renderHome();
      const panels = screen.getAllByRole('heading', { level: 3 });

      expect(panels.length).toBeGreaterThanOrEqual(2);
    });

    it('renders every form control with an accessible name', () => {
      renderHome();

      expect(screen.getByRole('textbox', { name: /name/i })).toHaveAttribute('id', 'm3-demo-name');
      expect(screen.getByRole('textbox', { name: /notes/i })).toHaveAttribute(
        'id',
        'm3-demo-notes'
      );
      expect(screen.getByRole('combobox', { name: /category/i })).toHaveAttribute(
        'id',
        'm3-demo-category'
      );
      expect(
        screen.getByRole('checkbox', { name: 'Receive demonstration updates' })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('switch', { name: 'Enable compact notifications' })
      ).toBeInTheDocument();
      expect(screen.getByText('Optional technical notes')).toBeInTheDocument();
    });

    it('groups the radio choices in a native fieldset and legend', () => {
      renderHome();
      const group = screen.getByRole('group', { name: 'Delivery preference' });

      expect(group.tagName.toLowerCase()).toBe('fieldset');
      expect(within(group).getAllByRole('radio')).toHaveLength(2);
      expect(within(group).getByRole('radio', { name: 'Courier' })).toBeInTheDocument();
      expect(within(group).getByRole('radio', { name: 'Pickup' })).toBeInTheDocument();
    });

    it('renders the technical inline status without live semantics', () => {
      renderHome();

      expect(screen.queryAllByRole('status')).toHaveLength(0);
      expect(screen.queryAllByRole('alert')).toHaveLength(0);
    });
  });

  describe('counter demonstration', () => {
    it('starts at zero, increments and resets without announcing', async () => {
      const user = userEvent.setup();
      renderHome();
      const counter = screen.getByTestId('demo-counter');

      expect(counter).toHaveTextContent('0');
      expect(counter).not.toHaveAttribute('role');
      expect(counter).not.toHaveAttribute('aria-live');

      await user.click(screen.getByRole('button', { name: /increment demonstration counter/i }));
      await user.click(screen.getByRole('button', { name: /increment demonstration counter/i }));

      expect(counter).toHaveTextContent('2');
      expect(screen.getByText('Demonstration counter value: 2')).toBeInTheDocument();
      expect(counter).not.toHaveAttribute('role');
      expect(counter).not.toHaveAttribute('aria-live');
      expect(screen.queryAllByRole('status')).toHaveLength(0);

      await user.click(screen.getByRole('button', { name: /reset demonstration counter/i }));

      expect(counter).toHaveTextContent('0');
      expect(screen.queryAllByRole('status')).toHaveLength(0);
    });
  });

  describe('invalid submit', () => {
    it('renders the error summary, focuses it and keeps it out of live regions', async () => {
      const user = userEvent.setup();
      renderHome();

      await submitForm(user);

      const summary = screen.getByRole('region', { name: SUMMARY_TITLE });

      expect(summary).toHaveFocus();
      expect(summary).not.toHaveAttribute('role');
      expect(summary).not.toHaveAttribute('aria-live');
      expect(screen.queryAllByRole('alert')).toHaveLength(0);
      expect(screen.queryByText(SUCCESS_RESULT)).toBeNull();
    });

    it('associates the field errors with the owning controls', async () => {
      const user = userEvent.setup();
      renderHome();

      await submitForm(user);

      const name = screen.getByRole('textbox', { name: /name/i });
      const category = screen.getByRole('combobox', { name: /category/i });

      expect(name).toHaveAttribute('aria-invalid', 'true');
      expect(category).toHaveAttribute('aria-invalid', 'true');

      const nameDescribedBy = name.getAttribute('aria-describedby') ?? '';
      const categoryDescribedBy = category.getAttribute('aria-describedby') ?? '';

      expect(document.getElementById(nameDescribedBy.split(' ').pop() ?? '')).toBeTruthy();
      expect(document.getElementById(categoryDescribedBy.split(' ').pop() ?? '')).toBeTruthy();
    });

    it('moves focus to the exact control when a summary link is activated', async () => {
      const user = userEvent.setup();
      renderHome();

      await submitForm(user);
      const summary = screen.getByRole('region', { name: SUMMARY_TITLE });
      const links = within(summary).getAllByRole('link');

      expect(links).toHaveLength(2);
      expect(links[0]).toHaveAttribute('href', '#m3-demo-name');
      expect(links[1]).toHaveAttribute('href', '#m3-demo-category');

      await user.click(links[0] as HTMLElement);
      expect(screen.getByRole('textbox', { name: /name/i })).toHaveFocus();

      await user.click(links[1] as HTMLElement);
      expect(screen.getByRole('combobox', { name: /category/i })).toHaveFocus();
    });
  });

  describe('valid submit', () => {
    it('clears the summary and announces exactly one result', async () => {
      const user = userEvent.setup();
      renderHome();

      await user.type(screen.getByRole('textbox', { name: /name/i }), 'Demonstration');
      await user.selectOptions(screen.getByRole('combobox', { name: /category/i }), 'laptops');
      await submitForm(user);

      expect(screen.queryByRole('region', { name: SUMMARY_TITLE })).toBeNull();
      expect(screen.getByRole('textbox', { name: /name/i })).not.toHaveAttribute('aria-invalid');
      expect(screen.getByRole('combobox', { name: /category/i })).not.toHaveAttribute(
        'aria-invalid'
      );

      const results = screen.getAllByRole('status');

      expect(results).toHaveLength(1);
      expect(results[0]).toHaveTextContent(SUCCESS_RESULT);
      expect(screen.queryAllByRole('alert')).toHaveLength(0);
    });
  });

  describe('reset', () => {
    it('clears the summary, errors and result without stealing focus', async () => {
      const user = userEvent.setup();
      renderHome();

      await submitForm(user);
      expect(screen.getByRole('region', { name: SUMMARY_TITLE })).toBeInTheDocument();

      const reset = screen.getByRole('button', { name: /reset demonstration form/i });
      await user.click(reset);

      expect(screen.queryByRole('region', { name: SUMMARY_TITLE })).toBeNull();
      expect(screen.queryAllByRole('status')).toHaveLength(0);
      expect(screen.getByRole('textbox', { name: /name/i })).not.toHaveAttribute('aria-invalid');
      expect(reset).toHaveFocus();
    });
  });
});
