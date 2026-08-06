import { describe, it, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryRouter, RouterProvider, useLocation } from 'react-router-dom';
import React from 'react';
import { GlobalSearchForm } from '@/app/shell/site-header/GlobalSearchForm';

function LocationProbe(): React.ReactElement {
  const location = useLocation();

  return <output data-testid="location">{`${location.pathname}${location.search}`}</output>;
}

function renderForm(initialEntry = '/') {
  const router = createMemoryRouter(
    [
      {
        path: '*',
        element: (
          <>
            <GlobalSearchForm />
            <LocationProbe />
          </>
        ),
      },
    ],
    { initialEntries: [initialEntry] }
  );

  render(<RouterProvider router={router} />);
  return router;
}

function searchForm(): HTMLElement {
  return screen.getByRole('search', { name: 'Поиск по каталогу' });
}

function field(): HTMLInputElement {
  return screen.getByRole('searchbox', { name: 'Поиск по каталогу' });
}

function submit(): HTMLElement {
  return screen.getByRole('button', { name: 'Найти' });
}

function currentLocation(): string {
  return screen.getByTestId('location').textContent ?? '';
}

describe('GlobalSearchForm', () => {
  describe('semantics', () => {
    it('exposes exactly one named search landmark', () => {
      renderForm();

      expect(screen.getAllByRole('search', { name: 'Поиск по каталогу' })).toHaveLength(1);
      expect(searchForm().tagName.toLowerCase()).toBe('form');
    });

    it('renders a visible label bound to the field', () => {
      renderForm();

      const label = screen.getByText('Поиск по каталогу', { selector: 'label' });
      expect(label).toBeVisible();
      expect(label).toHaveAttribute('for', field().id);
    });

    it('uses a search input named q', () => {
      renderForm();

      expect(field()).toHaveAttribute('type', 'search');
      expect(field()).toHaveAttribute('name', 'q');
    });

    it('renders a native submit button with the canonical label', () => {
      renderForm();

      expect(submit().tagName.toLowerCase()).toBe('button');
      expect(submit()).toHaveAttribute('type', 'submit');
    });

    it('exposes no suggestion, listbox or menu semantics', () => {
      renderForm();

      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
      expect(screen.queryByRole('combobox')).not.toBeInTheDocument();
      expect(screen.queryByRole('menu')).not.toBeInTheDocument();
      expect(screen.queryByRole('option')).not.toBeInTheDocument();
      expect(searchForm().querySelectorAll('[aria-live]')).toHaveLength(0);
    });
  });

  describe('URL synchronization', () => {
    it('starts empty when the URL carries no query', () => {
      renderForm('/');

      expect(field()).toHaveValue('');
    });

    it('starts empty on the search route without q', () => {
      renderForm('/search');

      expect(field()).toHaveValue('');
    });

    it('synchronizes from a direct search URL', async () => {
      renderForm('/search?q=%D0%BD%D0%BE%D1%83%D1%82%D0%B1%D1%83%D0%BA');

      await waitFor(() => {
        expect(field()).toHaveValue('ноутбук');
      });
    });

    it('decodes spaces in the query', async () => {
      renderForm(
        '/search?q=%D0%B8%D0%B3%D1%80%D0%BE%D0%B2%D0%BE%D0%B9%20%D0%BD%D0%BE%D1%83%D1%82%D0%B1%D1%83%D0%BA'
      );

      await waitFor(() => {
        expect(field()).toHaveValue('игровой ноутбук');
      });
    });

    it('follows query-only navigation without taking focus', async () => {
      const router = renderForm('/search?q=%D0%BD%D0%BE%D1%83%D1%82%D0%B1%D1%83%D0%BA');

      await waitFor(() => {
        expect(field()).toHaveValue('ноутбук');
      });

      (document.activeElement as HTMLElement | null)?.blur();

      await router.navigate('/search?q=%D1%82%D0%B5%D0%BB%D0%B5%D1%84%D0%BE%D0%BD');

      await waitFor(() => {
        expect(field()).toHaveValue('телефон');
      });

      expect(document.activeElement).toBe(document.body);
    });

    it('ignores the query parameter outside the search route', () => {
      renderForm('/catalog/laptops?q=ноутбук');

      expect(field()).toHaveValue('');
    });
  });

  describe('submission', () => {
    it('navigates to the search route with an encoded query', async () => {
      const user = userEvent.setup();
      renderForm('/');

      await user.type(field(), 'ноутбук');
      await user.click(submit());

      await waitFor(() => {
        expect(currentLocation()).toBe('/search?q=%D0%BD%D0%BE%D1%83%D1%82%D0%B1%D1%83%D0%BA');
      });
    });

    it('trims leading and trailing whitespace', async () => {
      const user = userEvent.setup();
      renderForm('/');

      await user.type(field(), '   ноутбук   ');
      await user.click(submit());

      await waitFor(() => {
        expect(new URLSearchParams(currentLocation().split('?')[1]).get('q')).toBe('ноутбук');
      });
    });

    it('preserves internal spacing and characters', async () => {
      const user = userEvent.setup();
      renderForm('/');

      await user.type(field(), '  игровой  ноутбук 15"  ');
      await user.click(submit());

      await waitFor(() => {
        expect(new URLSearchParams(currentLocation().split('?')[1]).get('q')).toBe(
          'игровой  ноутбук 15"'
        );
      });
    });

    it('submits through Router history rather than a document reload', async () => {
      const user = userEvent.setup();
      const router = renderForm('/');

      await user.type(field(), 'ноутбук');
      await user.keyboard('{Enter}');

      await waitFor(() => {
        expect(router.state.location.pathname).toBe('/search');
      });

      expect(router.state.historyAction).toBe('PUSH');
    });
  });

  describe('empty query validation', () => {
    it('does not navigate on an empty submit', async () => {
      const user = userEvent.setup();
      renderForm('/');

      await user.click(submit());

      expect(currentLocation()).toBe('/');
    });

    it('does not navigate when the query is only whitespace', async () => {
      const user = userEvent.setup();
      renderForm('/');

      await user.type(field(), '    ');
      await user.click(submit());

      expect(currentLocation()).toBe('/');
    });

    it('shows the canonical error associated with the field', async () => {
      const user = userEvent.setup();
      renderForm('/');

      await user.click(submit());

      const error = await screen.findByText('Введите поисковый запрос.');
      expect(error).toBeVisible();

      const describedBy = field().getAttribute('aria-describedby') ?? '';
      expect(describedBy.split(' ')).toContain(error.id);
      expect(field()).toHaveAttribute('aria-invalid', 'true');
    });

    it('focuses the field on an invalid submit', async () => {
      const user = userEvent.setup();
      renderForm('/');

      await user.click(submit());

      expect(document.activeElement).toBe(field());
    });

    it('clears the error when the user edits the value', async () => {
      const user = userEvent.setup();
      renderForm('/');

      await user.click(submit());
      expect(await screen.findByText('Введите поисковый запрос.')).toBeInTheDocument();

      await user.type(field(), 'н');

      await waitFor(() => {
        expect(screen.queryByText('Введите поисковый запрос.')).not.toBeInTheDocument();
      });
      expect(field()).not.toHaveAttribute('aria-invalid');
    });
  });
});
