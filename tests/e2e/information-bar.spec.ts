import { test, expect, type Page } from '@playwright/test';
import { AxeBuilder } from '@axe-core/playwright';
import { withDocumentStartFocus } from './support/focus-origin';

const NAV_LABEL = 'Сервисная навигация';
const DISCLOSURE_LABEL = 'Информация и помощь';
const BRAND_LINK_LABEL = 'GoodCall — на главную';
const CITY = 'Москва';
const CITY_CONTEXT = 'Текущий город: Москва';
const MINIMUM_TARGET = 44;

const CANONICAL_LINKS = [
  { label: 'Доставка и оплата', path: '/delivery-and-payment' },
  { label: 'Гарантия и возврат', path: '/warranty-and-returns' },
  { label: 'Программа лояльности', path: '/loyalty' },
  { label: 'Помощь', path: '/help' },
  { label: 'Контакты', path: '/contacts' },
];

const DISCLOSURE_WIDTHS = [767, 768, 769, 1023];
const INLINE_WIDTHS = [1024, 1025, 1280, 1440];

function serviceNav(page: Page) {
  return page.getByRole('navigation', { name: NAV_LABEL });
}

function disclosure(page: Page) {
  return page.getByRole('button', { name: DISCLOSURE_LABEL, exact: true });
}

function cityContext(page: Page) {
  return serviceNav(page).locator('p').filter({ hasText: CITY });
}

async function expectCityContext(page: Page): Promise<void> {
  await expect(cityContext(page)).toHaveCount(1);
  await expect(cityContext(page)).toBeVisible();
  await expect(cityContext(page)).toHaveText(CITY_CONTEXT);
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

test.describe('M4-03 Information Bar', () => {
  test('compact 320px exposes city and a closed disclosure', async ({ page }) => {
    const problems = collectRuntimeProblems(page);
    await page.setViewportSize({ width: 320, height: 640 });
    await page.goto('/GoodCall/');

    await expect(serviceNav(page)).toHaveCount(1);
    await expectCityContext(page);
    await expect(disclosure(page)).toBeVisible();
    await expect(disclosure(page)).toHaveAttribute('aria-expanded', 'false');

    for (const link of CANONICAL_LINKS) {
      await expect(
        serviceNav(page).getByRole('link', { name: link.label, exact: true })
      ).toBeHidden();
    }

    const buttonBox = await disclosure(page).boundingBox();
    expect(buttonBox?.width ?? 0).toBeGreaterThanOrEqual(MINIMUM_TARGET);
    expect(buttonBox?.height ?? 0).toBeGreaterThanOrEqual(MINIMUM_TARGET);

    expect(await horizontalOverflow(page)).toBeLessThanOrEqual(1);
    expect(problems.pageErrors).toHaveLength(0);
    expect(problems.consoleErrors).toHaveLength(0);
    expect(problems.failedRequests).toHaveLength(0);
  });

  test('compact keyboard order reaches the disclosure before the brand link', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 640 });
    await page.goto('/GoodCall/');

    await withDocumentStartFocus(page, async () => {
      await page.keyboard.press('Tab');
      await expect(page.locator('a[href="#main-content"]')).toBeFocused();

      await page.keyboard.press('Tab');
      await expect(disclosure(page)).toBeFocused();

      await page.keyboard.press('Enter');
      await expect(disclosure(page)).toHaveAttribute('aria-expanded', 'true');
      await expect(disclosure(page)).toBeFocused();

      for (const link of CANONICAL_LINKS) {
        await page.keyboard.press('Tab');
        await expect(
          serviceNav(page).getByRole('link', { name: link.label, exact: true })
        ).toBeFocused();
      }

      await page.keyboard.press('Tab');
      await expect(page.getByRole('link', { name: BRAND_LINK_LABEL, exact: true })).toBeFocused();
    });
  });

  test('opened compact disclosure shows five links in canonical order at usable size', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 320, height: 640 });
    await page.goto('/GoodCall/');

    await disclosure(page).click();
    await expect(disclosure(page)).toHaveAttribute('aria-expanded', 'true');

    const links = serviceNav(page).getByRole('link');
    await expect(links).toHaveCount(CANONICAL_LINKS.length);
    await expect(links).toHaveText(CANONICAL_LINKS.map((link) => link.label));

    for (const link of CANONICAL_LINKS) {
      const target = serviceNav(page).getByRole('link', { name: link.label, exact: true });
      await expect(target).toBeVisible();
      const box = await target.boundingBox();
      expect(box?.height ?? 0, `${link.label} target height`).toBeGreaterThanOrEqual(
        MINIMUM_TARGET
      );
    }

    expect(await horizontalOverflow(page)).toBeLessThanOrEqual(1);
  });

  for (const width of DISCLOSURE_WIDTHS) {
    test(`${String(width)}px keeps disclosure mode active`, async ({ page }) => {
      await page.setViewportSize({ width, height: 800 });
      await page.goto('/GoodCall/');

      await expectCityContext(page);
      await expect(disclosure(page)).toBeVisible();

      for (const link of CANONICAL_LINKS) {
        await expect(
          serviceNav(page).getByRole('link', { name: link.label, exact: true })
        ).toBeHidden();
      }

      expect(await horizontalOverflow(page)).toBeLessThanOrEqual(1);
    });
  }

  for (const width of INLINE_WIDTHS) {
    test(`${String(width)}px shows all links inline without the disclosure`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto('/GoodCall/');

      await expectCityContext(page);
      await expect(disclosure(page)).toBeHidden();

      const links = serviceNav(page).getByRole('link');
      await expect(links).toHaveCount(CANONICAL_LINKS.length);
      await expect(links).toHaveText(CANONICAL_LINKS.map((link) => link.label));

      for (const link of CANONICAL_LINKS) {
        await expect(
          serviceNav(page).getByRole('link', { name: link.label, exact: true })
        ).toBeVisible();
      }

      expect(await horizontalOverflow(page)).toBeLessThanOrEqual(1);
    });
  }

  test('expanded width keeps the city first and the bar separate from the banner', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/GoodCall/');

    await expectCityContext(page);

    const cityBox = await cityContext(page).boundingBox();
    const firstLinkBox = await serviceNav(page)
      .getByRole('link', { name: CANONICAL_LINKS[0]?.label ?? '', exact: true })
      .boundingBox();
    expect(cityBox?.x ?? 0).toBeLessThan(firstLinkBox?.x ?? 0);

    const navBox = await serviceNav(page).boundingBox();
    const bannerBox = await page.locator('header').boundingBox();
    expect((navBox?.y ?? 0) + (navBox?.height ?? 0)).toBeLessThanOrEqual((bannerBox?.y ?? 0) + 1);

    expect(await horizontalOverflow(page)).toBeLessThanOrEqual(1);
  });

  test('service navigation reaches a carrier under the project base path', async ({ page }) => {
    const problems = collectRuntimeProblems(page);
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto('/GoodCall/');

    await serviceNav(page).getByRole('link', { name: 'Доставка и оплата', exact: true }).click();

    await expect(page).toHaveURL('/GoodCall/delivery-and-payment');
    const heading = page.locator('h1');
    await expect(heading).toHaveText('Доставка и оплата');
    await expect(heading).toBeFocused();
    await expect(
      serviceNav(page).getByRole('link', { name: 'Доставка и оплата', exact: true })
    ).toHaveAttribute('aria-current', 'page');

    await page.reload();
    await expect(page).toHaveURL('/GoodCall/delivery-and-payment');
    await expect(page.locator('h1')).toHaveText('Доставка и оплата');
    await expect(serviceNav(page)).toHaveCount(1);

    expect(problems.pageErrors).toHaveLength(0);
    expect(problems.consoleErrors).toHaveLength(0);
    expect(problems.failedRequests).toHaveLength(0);
  });

  test('disclosure navigation reaches Контакты from compact width', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 700 });
    await page.goto('/GoodCall/');

    await disclosure(page).click();
    await serviceNav(page).getByRole('link', { name: 'Контакты', exact: true }).click();

    await expect(page).toHaveURL('/GoodCall/contacts');
    await expect(page.locator('h1')).toHaveText('Контакты');
    await expect(page.locator('h1')).toBeFocused();
  });

  test('coarse pointer opens the disclosure by tap and reaches a destination', async ({
    browser,
  }) => {
    const context = await browser.newContext({
      viewport: { width: 390, height: 844 },
      hasTouch: true,
      isMobile: true,
    });
    const page = await context.newPage();

    try {
      await page.goto('/GoodCall/');

      await expect(disclosure(page)).toBeVisible();
      await disclosure(page).tap();
      await expect(disclosure(page)).toHaveAttribute('aria-expanded', 'true');

      const target = serviceNav(page).getByRole('link', { name: 'Помощь', exact: true });
      await expect(target).toBeVisible();
      await target.tap();

      await expect(page).toHaveURL('/GoodCall/help');
      await expect(page.locator('h1')).toHaveText('Помощь');
    } finally {
      await context.close();
    }
  });

  test('axe passes for the wide inline state', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto('/GoodCall/');

    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toHaveLength(0);
  });

  test('axe passes for the compact closed state', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 640 });
    await page.goto('/GoodCall/');

    await expect(disclosure(page)).toHaveAttribute('aria-expanded', 'false');
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toHaveLength(0);
  });

  test('axe passes for the compact open state', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 640 });
    await page.goto('/GoodCall/');

    await disclosure(page).click();
    await expect(disclosure(page)).toHaveAttribute('aria-expanded', 'true');

    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toHaveLength(0);
  });

  test('axe passes on a current service carrier route', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto('/GoodCall/loyalty');

    await expect(
      serviceNav(page).getByRole('link', { name: 'Программа лояльности', exact: true })
    ).toHaveAttribute('aria-current', 'page');

    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toHaveLength(0);
  });

  test('forced colors keeps focus and current state perceivable', async ({ page }) => {
    await page.emulateMedia({ forcedColors: 'active' });
    await page.setViewportSize({ width: 320, height: 640 });
    await page.goto('/GoodCall/help');

    const current = serviceNav(page).getByRole('link', { name: 'Помощь', exact: true });

    await withDocumentStartFocus(page, async () => {
      await page.keyboard.press('Tab');
      await expect(page.locator('a[href="#main-content"]')).toBeFocused();

      await page.keyboard.press('Tab');
      await expect(disclosure(page)).toBeFocused();

      await page.keyboard.press('Enter');
      await expect(disclosure(page)).toHaveAttribute('aria-expanded', 'true');
      await expect(disclosure(page)).toBeFocused();

      const buttonIndicator = await disclosure(page).evaluate((element) => {
        const style = window.getComputedStyle(element);
        return { style: style.outlineStyle, width: parseFloat(style.outlineWidth) };
      });
      expect(buttonIndicator.style).not.toBe('none');
      expect(buttonIndicator.width).toBeGreaterThan(0);

      const helpIndex = CANONICAL_LINKS.findIndex((link) => link.label === 'Помощь');
      expect(helpIndex).toBeGreaterThanOrEqual(0);

      for (let step = 0; step <= helpIndex; step += 1) {
        await page.keyboard.press('Tab');
      }

      await expect(current).toBeFocused();
      await expect(current).toHaveAttribute('aria-current', 'page');
    });

    const currentTreatment = await current.evaluate((element) => {
      const style = window.getComputedStyle(element);
      return {
        outlineStyle: style.outlineStyle,
        outlineWidth: parseFloat(style.outlineWidth),
        textDecoration: style.textDecorationLine,
        fontWeight: style.fontWeight,
      };
    });

    expect(currentTreatment.outlineStyle).not.toBe('none');
    expect(currentTreatment.outlineWidth).toBeGreaterThan(0);
    expect(
      currentTreatment.textDecoration.includes('underline') ||
        Number(currentTreatment.fontWeight) >= 600
    ).toBe(true);
  });

  test('exact pathname alone carries the current service state', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });

    await page.goto('/GoodCall/help');
    await expect(
      serviceNav(page).getByRole('link', { name: 'Помощь', exact: true })
    ).toHaveAttribute('aria-current', 'page');

    await page.goto('/GoodCall/help?source=bar');
    await expect(
      serviceNav(page).getByRole('link', { name: 'Помощь', exact: true })
    ).toHaveAttribute('aria-current', 'page');

    await page.goto('/GoodCall/help/unknown');
    await expect(serviceNav(page).locator('a[aria-current="page"]')).toHaveCount(0);

    await page.goto('/GoodCall/');
    await expect(serviceNav(page).locator('a[aria-current="page"]')).toHaveCount(0);
  });
});
