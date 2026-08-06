import { test, expect, type Page } from '@playwright/test';
import { AxeBuilder } from '@axe-core/playwright';

const PRIMARY_NAV_LABEL = 'Основная навигация';
const SEARCH_LANDMARK_LABEL = 'Поиск по каталогу';
const SEARCH_SUBMIT_LABEL = 'Найти';
const CATALOG_LABEL = 'Каталог';
const BRAND_LINK_LABEL = 'GoodCall — на главную';
const SERVICE_NAV_LABEL = 'Сервисная навигация';
const DISCLOSURE_LABEL = 'Информация и помощь';
const SEARCH_EMPTY_ERROR = 'Введите поисковый запрос.';
const MINIMUM_TARGET = 44;
const MINIMUM_LOGO_WIDTH = 120;

const SERVICE_LINK_LABELS = [
  'Доставка и оплата',
  'Гарантия и возврат',
  'Программа лояльности',
  'Помощь',
  'Контакты',
];

function banner(page: Page) {
  return page.getByRole('banner');
}

function catalogLink(page: Page) {
  return page
    .getByRole('navigation', { name: PRIMARY_NAV_LABEL })
    .getByRole('link', { name: CATALOG_LABEL, exact: true });
}

function searchLandmark(page: Page) {
  return page.getByRole('search', { name: SEARCH_LANDMARK_LABEL });
}

function searchField(page: Page) {
  return page.getByRole('searchbox', { name: SEARCH_LANDMARK_LABEL });
}

function searchSubmit(page: Page) {
  return searchLandmark(page).getByRole('button', { name: SEARCH_SUBMIT_LABEL, exact: true });
}

function brandLink(page: Page) {
  return page.getByRole('link', { name: BRAND_LINK_LABEL, exact: true });
}

function collectRuntimeProblems(page: Page): {
  pageErrors: string[];
  consoleErrors: string[];
  failedRequests: string[];
} {
  const pageErrors: string[] = [];
  const consoleErrors: string[] = [];
  const failedRequests: string[] = [];

  page.on('pageerror', (error) => {
    pageErrors.push(error.message);
  });
  page.on('console', (message) => {
    if (message.type() === 'error') {
      consoleErrors.push(message.text());
    }
  });
  page.on('requestfailed', (request) => {
    failedRequests.push(`${request.resourceType()} ${request.url()}`);
  });

  return { pageErrors, consoleErrors, failedRequests };
}

async function horizontalOverflow(page: Page): Promise<number> {
  return page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth
  );
}

async function resetFocusOrigin(page: Page): Promise<void> {
  await page.evaluate(() => {
    const active = document.activeElement;
    if (active instanceof HTMLElement && active !== document.body) {
      active.blur();
    }
    document.body.focus();
  });
}

test.describe('M4-04 primary Header core', () => {
  test('expanded 1440px composes the Header core in one row', async ({ page }) => {
    const problems = collectRuntimeProblems(page);
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/GoodCall/');

    await expect(banner(page)).toHaveCount(1);
    await expect(brandLink(page)).toBeVisible();
    await expect(catalogLink(page)).toBeVisible();
    await expect(searchLandmark(page)).toHaveCount(1);
    await expect(searchField(page)).toBeVisible();
    await expect(searchSubmit(page)).toBeVisible();

    const serviceNav = page.getByRole('navigation', { name: SERVICE_NAV_LABEL });
    const serviceBox = await serviceNav.boundingBox();
    const headerBox = await banner(page).boundingBox();
    expect((serviceBox?.y ?? 0) + (serviceBox?.height ?? 0)).toBeLessThanOrEqual(
      (headerBox?.y ?? 0) + 1
    );

    const brandBox = await brandLink(page).boundingBox();
    const catalogBox = await catalogLink(page).boundingBox();
    const fieldBox = await searchField(page).boundingBox();

    expect(brandBox?.y ?? 0).toBeCloseTo(catalogBox?.y ?? 0, -1);
    expect(catalogBox?.y ?? 0).toBeCloseTo(fieldBox?.y ?? 0, -1);
    expect(fieldBox?.width ?? 0).toBeGreaterThan(catalogBox?.width ?? 0);

    await expect(page.getByRole('link', { name: 'Сравнение' })).toHaveCount(0);
    await expect(page.getByRole('link', { name: 'Корзина' })).toHaveCount(0);

    expect(await horizontalOverflow(page)).toBeLessThanOrEqual(1);
    expect(problems.pageErrors).toHaveLength(0);
    expect(problems.consoleErrors).toHaveLength(0);
    expect(problems.failedRequests).toHaveLength(0);
  });

  for (const width of [1023, 1024, 1025, 1279, 1280, 1281]) {
    test(`${String(width)}px keeps the Header core usable without overflow`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto('/GoodCall/');

      await expect(catalogLink(page)).toBeVisible();
      await expect(searchField(page)).toBeVisible();
      await expect(searchSubmit(page)).toBeVisible();

      const logoBox = await page.locator('[data-brand-asset]').boundingBox();
      expect(logoBox?.width ?? 0).toBeGreaterThanOrEqual(MINIMUM_LOGO_WIDTH);

      const brandBox = await brandLink(page).boundingBox();
      const fieldBox = await searchField(page).boundingBox();
      expect(brandBox?.y ?? 0).toBeCloseTo(fieldBox?.y ?? 0, -1);

      expect(await horizontalOverflow(page)).toBeLessThanOrEqual(1);
    });
  }

  for (const width of [767, 768, 769]) {
    test(`${String(width)}px keeps DOM order and an operable Search`, async ({ page }) => {
      await page.setViewportSize({ width, height: 800 });
      await page.goto('/GoodCall/');

      await expect(brandLink(page)).toBeVisible();
      await expect(catalogLink(page)).toBeVisible();
      await expect(searchField(page)).toBeVisible();
      await expect(searchSubmit(page)).toBeVisible();

      const order = await page.evaluate(() => {
        const header = document.querySelector('header');
        const nodes = Array.from(header?.querySelectorAll('a[href], input, button') ?? []);
        return nodes.map((node) =>
          node instanceof HTMLInputElement ? 'field' : (node.textContent ?? '').trim() || 'brand'
        );
      });

      expect(order[0]).toBe('brand');
      expect(order[1]).toBe(CATALOG_LABEL);
      expect(order[2]).toBe('field');
      expect(order[3]).toBe(SEARCH_SUBMIT_LABEL);

      expect(await horizontalOverflow(page)).toBeLessThanOrEqual(1);
    });
  }

  test('compact 320px stacks identity and a full-width Search', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 640 });
    await page.goto('/GoodCall/');

    const brandBox = await brandLink(page).boundingBox();
    const catalogBox = await catalogLink(page).boundingBox();
    const fieldBox = await searchField(page).boundingBox();
    const submitBox = await searchSubmit(page).boundingBox();
    const logoBox = await page.locator('[data-brand-asset]').boundingBox();

    expect(brandBox?.y ?? 0).toBeCloseTo(catalogBox?.y ?? 0, -1);
    expect(fieldBox?.y ?? 0).toBeGreaterThan((brandBox?.y ?? 0) + 1);

    await expect(page.getByText(SEARCH_LANDMARK_LABEL).first()).toBeVisible();
    await expect(searchField(page)).toBeVisible();
    await expect(searchSubmit(page)).toBeVisible();

    expect(logoBox?.width ?? 0).toBeGreaterThanOrEqual(MINIMUM_LOGO_WIDTH);
    const ratio = (logoBox?.width ?? 0) / (logoBox?.height ?? 1);
    expect(ratio).toBeGreaterThan(7);
    expect(ratio).toBeLessThan(9);

    expect(brandBox?.height ?? 0).toBeGreaterThanOrEqual(MINIMUM_TARGET);
    expect(catalogBox?.height ?? 0).toBeGreaterThanOrEqual(MINIMUM_TARGET);
    expect(catalogBox?.width ?? 0).toBeGreaterThanOrEqual(MINIMUM_TARGET);
    expect(fieldBox?.height ?? 0).toBeGreaterThanOrEqual(MINIMUM_TARGET);
    expect(submitBox?.height ?? 0).toBeGreaterThanOrEqual(MINIMUM_TARGET);
    expect(submitBox?.width ?? 0).toBeGreaterThanOrEqual(MINIMUM_TARGET);

    expect(await horizontalOverflow(page)).toBeLessThanOrEqual(1);
  });

  test('compact keyboard order reaches Header controls after the Information Bar', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 320, height: 640 });
    await page.goto('/GoodCall/');
    await resetFocusOrigin(page);

    await page.keyboard.press('Tab');
    await expect(page.locator('a[href="#main-content"]')).toBeFocused();

    await page.keyboard.press('Tab');
    await expect(page.getByRole('button', { name: DISCLOSURE_LABEL, exact: true })).toBeFocused();

    await page.keyboard.press('Tab');
    await expect(brandLink(page)).toBeFocused();

    await page.keyboard.press('Tab');
    await expect(catalogLink(page)).toBeFocused();

    await page.keyboard.press('Tab');
    await expect(searchField(page)).toBeFocused();

    await page.keyboard.press('Tab');
    await expect(searchSubmit(page)).toBeFocused();
  });

  test('wide keyboard order passes the inline service links first', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto('/GoodCall/');
    await resetFocusOrigin(page);

    await page.keyboard.press('Tab');
    await expect(page.locator('a[href="#main-content"]')).toBeFocused();

    const serviceNav = page.getByRole('navigation', { name: SERVICE_NAV_LABEL });
    for (const label of SERVICE_LINK_LABELS) {
      await page.keyboard.press('Tab');
      await expect(serviceNav.getByRole('link', { name: label, exact: true })).toBeFocused();
    }

    await page.keyboard.press('Tab');
    await expect(brandLink(page)).toBeFocused();

    await page.keyboard.press('Tab');
    await expect(catalogLink(page)).toBeFocused();

    await page.keyboard.press('Tab');
    await expect(searchField(page)).toBeFocused();

    await page.keyboard.press('Tab');
    await expect(searchSubmit(page)).toBeFocused();
  });

  test('Catalog navigates to the representative category', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto('/GoodCall/');

    await catalogLink(page).click();

    await expect(page).toHaveURL('/GoodCall/catalog/laptops');
    const heading = page.locator('h1');
    await expect(heading).toHaveText('Category');
    await expect(heading).toBeFocused();
    await expect(page.getByText('Category: laptops')).toBeVisible();
    await expect(catalogLink(page)).toHaveAttribute('aria-current', 'page');

    await page.reload();
    await expect(page).toHaveURL('/GoodCall/catalog/laptops');
    await expect(page.locator('h1')).toHaveText('Category');
    await expect(banner(page)).toHaveCount(1);
  });

  test('Catalog current state does not leak to other category paths', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });

    await page.goto('/GoodCall/catalog/phones');
    await expect(page.locator('h1')).toHaveText('Category');
    await expect(catalogLink(page)).not.toHaveAttribute('aria-current', 'page');

    await page.goto('/GoodCall/catalog');
    await expect(page.locator('h1')).toContainText('Page not found');
    await expect(catalogLink(page)).not.toHaveAttribute('aria-current', 'page');
  });

  test('Search submits a normalized query and focuses the carrier heading', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto('/GoodCall/');

    await searchField(page).fill('  ноутбук  ');
    await searchSubmit(page).click();

    await expect(page).toHaveURL(/\/GoodCall\/search\?q=/);
    const heading = page.locator('h1');
    await expect(heading).toHaveText('Поиск');
    await expect(heading).toBeFocused();
    await expect(searchField(page)).toHaveValue('ноутбук');

    const decoded = await page.evaluate(() => new URLSearchParams(location.search).get('q'));
    expect(decoded).toBe('ноутбук');

    await page.reload();
    await expect(page).toHaveURL(/\/GoodCall\/search\?q=/);
    await expect(page.locator('h1')).toHaveText('Поиск');
    await expect(searchField(page)).toHaveValue('ноутбук');
  });

  test('query-only Search does not refocus the heading or duplicate announcements', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto('/GoodCall/search?q=%D0%BD%D0%BE%D1%83%D1%82%D0%B1%D1%83%D0%BA');

    await expect(searchField(page)).toHaveValue('ноутбук');

    await searchField(page).fill('телефон');
    await searchSubmit(page).click();

    await expect
      .poll(async () => page.evaluate(() => new URLSearchParams(location.search).get('q')))
      .toBe('телефон');

    await expect(page).toHaveURL(/\/GoodCall\/search\?q=/);
    await expect(page.locator('h1')).not.toBeFocused();
    await expect(page.locator('#route-announcement')).toHaveCount(1);
    await expect(page.locator('[aria-live]')).toHaveCount(1);
  });

  for (const start of ['/GoodCall/', '/GoodCall/search']) {
    test(`empty Search from ${start} shows the canonical error without navigating`, async ({
      page,
    }) => {
      const problems = collectRuntimeProblems(page);
      await page.setViewportSize({ width: 1280, height: 900 });
      await page.goto(start);

      const urlBefore = page.url();
      await searchField(page).fill('   ');
      await searchSubmit(page).click();

      await expect(page.getByText(SEARCH_EMPTY_ERROR)).toBeVisible();
      await expect(searchField(page)).toHaveAttribute('aria-invalid', 'true');
      await expect(searchField(page)).toBeFocused();
      expect(page.url()).toBe(urlBefore);

      await searchField(page).fill('н');
      await expect(page.getByText(SEARCH_EMPTY_ERROR)).toHaveCount(0);
      await expect(searchField(page)).not.toHaveAttribute('aria-invalid', 'true');

      expect(problems.pageErrors).toHaveLength(0);
      expect(problems.consoleErrors).toHaveLength(0);
    });
  }

  test('200 percent zoom keeps every Header control usable', async ({ page }) => {
    await page.setViewportSize({ width: 640, height: 512 });
    await page.goto('/GoodCall/');

    await expect(brandLink(page)).toBeVisible();
    await expect(catalogLink(page)).toBeVisible();
    await expect(searchField(page)).toBeVisible();
    await expect(searchSubmit(page)).toBeVisible();
    expect(await horizontalOverflow(page)).toBeLessThanOrEqual(1);
  });

  test('400 percent zoom resolves to the compact composition', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 256 });
    await page.goto('/GoodCall/');

    const brandBox = await brandLink(page).boundingBox();
    const fieldBox = await searchField(page).boundingBox();

    await expect(searchField(page)).toBeVisible();
    await expect(searchSubmit(page)).toBeVisible();
    expect(fieldBox?.y ?? 0).toBeGreaterThan((brandBox?.y ?? 0) + 1);
    expect(await horizontalOverflow(page)).toBeLessThanOrEqual(1);
  });

  test('low-height wide viewport keeps the Header non-sticky', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 400 });
    await page.goto('/GoodCall/');

    const position = await banner(page).evaluate(
      (element) => window.getComputedStyle(element).position
    );
    expect(['static', 'relative']).toContain(position);

    const before = await banner(page).boundingBox();
    await page.mouse.wheel(0, 600);
    await page.waitForFunction(
      () => window.scrollY > 0 || document.body.scrollHeight <= window.innerHeight
    );

    const after = await banner(page).boundingBox();
    const scrolled = await page.evaluate(() => window.scrollY);

    if (scrolled > 0) {
      expect(after?.y ?? 0).toBeLessThan(before?.y ?? 0);
    }
  });

  test('coarse pointer activates Catalog and Search by tap', async ({ browser }) => {
    const context = await browser.newContext({
      viewport: { width: 390, height: 844 },
      hasTouch: true,
      isMobile: true,
    });
    const page = await context.newPage();

    try {
      await page.goto('/GoodCall/');

      await searchField(page).tap();
      await searchField(page).fill('ноутбук');
      await searchSubmit(page).tap();

      await expect(page).toHaveURL(/\/GoodCall\/search\?q=/);
      await expect(page.locator('h1')).toHaveText('Поиск');

      await catalogLink(page).tap();
      await expect(page).toHaveURL('/GoodCall/catalog/laptops');
      await expect(page.locator('h1')).toHaveText('Category');
    } finally {
      await context.close();
    }
  });

  test('forced colors keeps Header boundaries and states perceivable', async ({ page }) => {
    await page.emulateMedia({ forcedColors: 'active' });
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto('/GoodCall/catalog/laptops');

    const catalogTreatment = await catalogLink(page).evaluate((element) => {
      const style = window.getComputedStyle(element);
      return {
        borderStyle: style.borderTopStyle,
        borderWidth: parseFloat(style.borderTopWidth),
        textDecoration: style.textDecorationLine,
      };
    });
    expect(catalogTreatment.borderStyle).not.toBe('none');
    expect(catalogTreatment.borderWidth).toBeGreaterThan(0);
    expect(catalogTreatment.textDecoration).toContain('underline');

    await resetFocusOrigin(page);
    await catalogLink(page).focus();
    const catalogFocus = await catalogLink(page).evaluate((element) => {
      const style = window.getComputedStyle(element);
      return { style: style.outlineStyle, width: parseFloat(style.outlineWidth) };
    });
    expect(catalogFocus.style).not.toBe('none');
    expect(catalogFocus.width).toBeGreaterThan(0);

    const fieldBoundary = await searchField(page).evaluate((element) => {
      const style = window.getComputedStyle(element);
      return { style: style.borderTopStyle, width: parseFloat(style.borderTopWidth) };
    });
    expect(fieldBoundary.style).not.toBe('none');
    expect(fieldBoundary.width).toBeGreaterThan(0);

    await searchField(page).fill('   ');
    await searchSubmit(page).click();
    await expect(page.getByText(SEARCH_EMPTY_ERROR)).toBeVisible();

    const invalidBoundary = await searchField(page).evaluate((element) => {
      const style = window.getComputedStyle(element);
      return parseFloat(style.borderTopWidth);
    });
    expect(invalidBoundary).toBeGreaterThanOrEqual(fieldBoundary.width);
  });

  for (const scenario of [
    { name: 'Home at expanded width', path: '/GoodCall/', width: 1440 },
    { name: 'Home at compact width', path: '/GoodCall/', width: 320 },
    {
      name: 'Search carrier with a query',
      path: '/GoodCall/search?q=%D0%BD%D0%BE%D1%83%D1%82%D0%B1%D1%83%D0%BA',
      width: 1280,
    },
    { name: 'category carrier', path: '/GoodCall/catalog/laptops', width: 1280 },
    { name: 'catch-all catalog', path: '/GoodCall/catalog', width: 1280 },
  ]) {
    test(`axe passes for ${scenario.name}`, async ({ page }) => {
      await page.setViewportSize({ width: scenario.width, height: 900 });
      await page.goto(scenario.path);

      const results = await new AxeBuilder({ page }).analyze();
      expect(results.violations).toHaveLength(0);
    });
  }

  test('axe passes with the Search validation error visible', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto('/GoodCall/');

    await searchField(page).fill('   ');
    await searchSubmit(page).click();
    await expect(page.getByText(SEARCH_EMPTY_ERROR)).toBeVisible();

    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toHaveLength(0);
  });
});
