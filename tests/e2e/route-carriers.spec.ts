import { test, expect, type Page } from '@playwright/test';
import { AxeBuilder } from '@axe-core/playwright';

const CARRIER_NOTICE =
  'Технический маршрут подготовлен для интеграции глобальной оболочки. Функциональность раздела будет реализована на отдельном этапе.';

const HOME_LINK_LABEL = 'На главную';

const CARRIER_ROUTES = [
  { path: '/search', heading: 'Поиск' },
  { path: '/comparison', heading: 'Сравнение товаров' },
  { path: '/favorites', heading: 'Избранное' },
  { path: '/auth', heading: 'Вход и регистрация' },
  { path: '/delivery-and-payment', heading: 'Доставка и оплата' },
  { path: '/warranty-and-returns', heading: 'Гарантия и возврат' },
  { path: '/loyalty', heading: 'Программа лояльности' },
  { path: '/help', heading: 'Помощь' },
  { path: '/contacts', heading: 'Контакты' },
  { path: '/promotions', heading: 'Акции' },
  { path: '/brands', heading: 'Бренды' },
  { path: '/shops', heading: 'Магазины' },
  { path: '/service-centers', heading: 'Сервисные центры' },
  { path: '/about', heading: 'О компании' },
  { path: '/blog', heading: 'Блог' },
  { path: '/track-order', heading: 'Отследить заказ' },
  { path: '/privacy-policy', heading: 'Политика конфиденциальности' },
  { path: '/user-agreement', heading: 'Пользовательское соглашение' },
  { path: '/public-offer', heading: 'Публичная оферта' },
];

function collectRuntimeProblems(page: Page): { pageErrors: string[]; consoleErrors: string[] } {
  const pageErrors: string[] = [];
  const consoleErrors: string[] = [];

  page.on('pageerror', (error) => {
    pageErrors.push(error.message);
  });

  page.on('console', (message) => {
    if (message.type() === 'error') {
      consoleErrors.push(message.text());
    }
  });

  return { pageErrors, consoleErrors };
}

test.describe('M4-01 route carriers', () => {
  for (const carrier of CARRIER_ROUTES) {
    test(`direct navigation to ${carrier.path} renders its carrier`, async ({ page }) => {
      const problems = collectRuntimeProblems(page);
      const failedRequests: string[] = [];

      page.on('requestfailed', (request) => {
        failedRequests.push(`${request.resourceType()} ${request.url()}`);
      });

      await page.goto(`/GoodCall${carrier.path}`);

      await expect(page).toHaveURL(`/GoodCall${carrier.path}`);
      await expect(page).toHaveTitle(`${carrier.heading} — GoodCall`);

      const main = page.locator('main#main-content');
      const heading = page.locator('h1');

      await expect(main).toHaveCount(1);
      await expect(heading).toHaveCount(1);
      await expect(heading).toHaveText(carrier.heading);
      await expect(page.getByText(CARRIER_NOTICE)).toBeVisible();
      await expect(heading).not.toHaveText('Page not found');

      const homeLink = page.getByRole('link', { name: HOME_LINK_LABEL, exact: true });
      await expect(homeLink).toBeVisible();
      await expect(homeLink).toHaveAttribute('href', '/GoodCall/');

      expect(problems.pageErrors).toHaveLength(0);
      expect(problems.consoleErrors).toHaveLength(0);
      expect(failedRequests).toHaveLength(0);
    });
  }

  test('hard refresh keeps a carrier under the project base path', async ({ page }) => {
    await page.goto('/GoodCall/service-centers');
    await page.reload();

    await expect(page).toHaveURL('/GoodCall/service-centers');
    await expect(page.locator('h1')).toHaveText('Сервисные центры');
    await expect(page.locator('main#main-content')).toHaveCount(1);
  });

  test('carrier Home link recovers to Home', async ({ page }) => {
    await page.goto('/GoodCall/promotions');
    await expect(page.locator('h1')).toHaveText('Акции');

    await page.getByRole('link', { name: HOME_LINK_LABEL, exact: true }).click();

    await expect(page).toHaveURL('/GoodCall/');
    await expect(page.locator('h1')).toContainText('GoodCall');
  });

  test('client navigation to a carrier focuses its heading', async ({ page }) => {
    await page.goto('/GoodCall/search');
    await expect(page.locator('h1')).toHaveText('Поиск');

    await page.getByRole('link', { name: HOME_LINK_LABEL, exact: true }).click();
    await expect(page).toHaveURL('/GoodCall/');

    const headingFocused = await page.evaluate(
      () => document.activeElement === document.querySelector('h1')
    );
    expect(headingFocused).toBe(true);
  });

  test('an unregistered path still renders the catch-all', async ({ page }) => {
    await page.goto('/GoodCall/catalog');
    await expect(page.locator('h1')).toContainText('Page not found');
  });

  test('axe scan of a standard carrier passes', async ({ page }) => {
    const problems = collectRuntimeProblems(page);

    await page.goto('/GoodCall/contacts');
    const results = await new AxeBuilder({ page }).analyze();

    expect(results.violations).toHaveLength(0);
    expect(problems.pageErrors).toHaveLength(0);
    expect(problems.consoleErrors).toHaveLength(0);
  });

  test('axe scan of a legal carrier passes', async ({ page }) => {
    const problems = collectRuntimeProblems(page);

    await page.goto('/GoodCall/privacy-policy');
    const results = await new AxeBuilder({ page }).analyze();

    expect(results.violations).toHaveLength(0);
    expect(problems.pageErrors).toHaveLength(0);
    expect(problems.consoleErrors).toHaveLength(0);
  });

  test('carrier reflow holds without page-level horizontal scroll', async ({ page }) => {
    for (const viewport of [
      { width: 320, height: 568 },
      { width: 640, height: 512 },
    ]) {
      await page.setViewportSize(viewport);
      await page.goto('/GoodCall/user-agreement');

      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth
      );

      expect(overflow, `horizontal overflow at ${String(viewport.width)}px`).toBeLessThanOrEqual(1);
      await expect(page.locator('h1')).toBeVisible();
    }
  });
});
