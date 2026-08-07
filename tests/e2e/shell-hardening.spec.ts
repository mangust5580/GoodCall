import { test, expect, type Locator, type Page } from '@playwright/test';
import { withDocumentStartFocus } from './support/focus-origin';

const INFORMATION_BAR_NAV_LABEL = 'Сервисная навигация';
const INFORMATION_BAR_DISCLOSURE_LABEL = 'Информация и помощь';
const PRIMARY_NAV_LABEL = 'Основная навигация';
const USER_NAV_LABEL = 'Пользовательская навигация';
const SEARCH_LANDMARK_LABEL = 'Поиск по каталогу';
const SEARCH_SUBMIT_LABEL = 'Найти';
const CATALOG_LABEL = 'Каталог';
const BRAND_LINK_LABEL = 'GoodCall — на главную';
const NEWSLETTER_HEADING = 'Будьте в курсе новинок и акций';
const NEWSLETTER_EMAIL_LABEL = 'Электронная почта';
const NEWSLETTER_SUCCESS_STATUS = 'Вы подписаны на новости и акции GoodCall.';
const NOT_FOUND_NAV_LABEL = 'Page not found navigation';
const CARRIER_HOME_LINK_LABEL = 'На главную';
const ACTION_LABELS = ['Сравнение', 'Избранное', 'Корзина', 'Войти'] as const;
const FOOTER_GROUP_TITLES = ['Покупателям', 'Компания', 'Помощь'] as const;
const SUPPORT_PHONE = '8 800 100-10-10';
const VALID_EMAIL = 'reader@goodcall.test';
const NEWSLETTER_STORAGE_KEY = 'goodcall.newsletter';

const BASE_PATH = '/GoodCall/';
const SHELL_REGION_TOLERANCE = 1;
const OVERFLOW_TOLERANCE = 1;

const INFORMATION_BAR_INLINE_FROM = 1024;
const FOOTER_DISCLOSURE_BELOW = 768;

const SHELL_VIEWPORTS = [
  { width: 320, height: 640, range: 'compact' },
  { width: 375, height: 667, range: 'compact' },
  { width: 767, height: 800, range: 'compact' },
  { width: 768, height: 800, range: 'medium' },
  { width: 769, height: 800, range: 'medium' },
  { width: 1023, height: 800, range: 'medium' },
  { width: 1024, height: 800, range: 'wide' },
  { width: 1025, height: 800, range: 'wide' },
  { width: 1279, height: 800, range: 'wide' },
  { width: 1280, height: 900, range: 'expanded' },
  { width: 1281, height: 900, range: 'expanded' },
  { width: 1440, height: 900, range: 'expanded' },
  { width: 1920, height: 1080, range: 'expanded' },
] as const;

interface Box {
  x: number;
  y: number;
  width: number;
  height: number;
}

async function resolveBox(locator: Locator, name: string): Promise<Box> {
  const box = await locator.boundingBox();

  expect(box, `${name} must expose a bounding box`).not.toBeNull();

  if (box === null) {
    throw new Error(`${name} has no bounding box`);
  }

  return box;
}

function boxBottom(box: Box): number {
  return box.y + box.height;
}

function informationBar(page: Page) {
  return page.getByRole('navigation', { name: INFORMATION_BAR_NAV_LABEL });
}

function informationBarDisclosure(page: Page) {
  return page.getByRole('button', { name: INFORMATION_BAR_DISCLOSURE_LABEL, exact: true });
}

function banner(page: Page) {
  return page.getByRole('banner');
}

function routeMain(page: Page) {
  return page.locator('main#main-content');
}

function newsletter(page: Page) {
  return page.getByRole('region', { name: NEWSLETTER_HEADING });
}

function newsletterEmail(page: Page) {
  return newsletter(page).getByRole('textbox', { name: new RegExp(NEWSLETTER_EMAIL_LABEL) });
}

function newsletterSubmit(page: Page) {
  return newsletter(page).getByRole('button');
}

function newsletterStatus(page: Page) {
  return page.locator('[data-newsletter-status]');
}

function footer(page: Page) {
  return page.getByRole('contentinfo');
}

function catalogLink(page: Page) {
  return page
    .getByRole('navigation', { name: PRIMARY_NAV_LABEL })
    .getByRole('link', { name: CATALOG_LABEL, exact: true });
}

function searchField(page: Page) {
  return page.getByRole('searchbox', { name: SEARCH_LANDMARK_LABEL });
}

function searchSubmit(page: Page) {
  return page
    .getByRole('search', { name: SEARCH_LANDMARK_LABEL })
    .getByRole('button', { name: SEARCH_SUBMIT_LABEL, exact: true });
}

function footerDisclosure(page: Page, title: string) {
  return footer(page).getByRole('button', { name: new RegExp(`раздел «${title}»`) });
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

function expectNoRuntimeProblems(problems: {
  pageErrors: string[];
  consoleErrors: string[];
  failedRequests: string[];
}): void {
  expect(problems.pageErrors, 'unexpected page errors').toHaveLength(0);
  expect(problems.consoleErrors, 'unexpected console errors').toHaveLength(0);
  expect(problems.failedRequests, 'unexpected failed requests').toHaveLength(0);
}

async function horizontalOverflow(page: Page): Promise<number> {
  return page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth
  );
}

async function resolveNavigationNames(page: Page): Promise<string[]> {
  return page.evaluate(() =>
    Array.from(document.querySelectorAll('nav')).map((landmark) => {
      const label = landmark.getAttribute('aria-label');

      if (label !== null && label.trim().length > 0) {
        return label.trim();
      }

      const labelledBy = landmark.getAttribute('aria-labelledby');

      if (labelledBy !== null) {
        return (document.getElementById(labelledBy)?.textContent ?? '').trim();
      }

      return '';
    })
  );
}

async function expectComposedShell(page: Page, label: string): Promise<void> {
  const regions = [
    { name: 'Information Bar', box: await resolveBox(informationBar(page), 'Information Bar') },
    { name: 'Header', box: await resolveBox(banner(page), 'Header') },
    { name: 'route main', box: await resolveBox(routeMain(page), 'route main') },
    { name: 'Newsletter', box: await resolveBox(newsletter(page), 'Newsletter') },
    { name: 'Footer', box: await resolveBox(footer(page), 'Footer') },
  ];

  for (let index = 1; index < regions.length; index += 1) {
    const previous = regions[index - 1];
    const current = regions[index];

    if (previous === undefined || current === undefined) {
      throw new Error('shell region box missing');
    }

    expect(
      current.box.y,
      `${label}: ${current.name} begins after ${previous.name} ends`
    ).toBeGreaterThanOrEqual(boxBottom(previous.box) - SHELL_REGION_TOLERANCE);
  }

  expect(
    await horizontalOverflow(page),
    `${label}: page-level horizontal overflow`
  ).toBeLessThanOrEqual(OVERFLOW_TOLERANCE);
}

async function readNewsletterStorage(page: Page): Promise<unknown> {
  return page.evaluate((key) => {
    const raw = window.sessionStorage.getItem(key);
    return raw === null ? null : (JSON.parse(raw) as unknown);
  }, NEWSLETTER_STORAGE_KEY);
}

function pathnameOf(page: Page): string {
  return new URL(page.url()).pathname;
}

test.describe('M4-08 assembled shell hardening', () => {
  test('the shell composes in source order across every responsive range', async ({ page }) => {
    const problems = collectRuntimeProblems(page);
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto('/GoodCall/');

    for (const viewport of SHELL_VIEWPORTS) {
      const label = `${String(viewport.width)}px ${viewport.range}`;
      await page.setViewportSize({ width: viewport.width, height: viewport.height });

      await expectComposedShell(page, label);

      await expect(
        informationBarDisclosure(page),
        `${label}: Information Bar disclosure mode`
      ).toBeVisible({ visible: viewport.width < INFORMATION_BAR_INLINE_FROM });

      for (const title of FOOTER_GROUP_TITLES) {
        await expect(
          footerDisclosure(page, title),
          `${label}: Footer ${title} disclosure mode`
        ).toBeVisible({ visible: viewport.width < FOOTER_DISCLOSURE_BELOW });
      }
    }

    expectNoRuntimeProblems(problems);
  });

  for (const surface of [
    { name: 'a normal route', path: '/GoodCall/help', newsletterCount: 1 },
    { name: 'the catch-all', path: '/GoodCall/unknown-shell-surface', newsletterCount: 0 },
  ]) {
    test(`${surface.name} exposes exactly one of each shell landmark`, async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 900 });
      await page.goto(surface.path);

      await expect(banner(page), 'one banner').toHaveCount(1);
      await expect(footer(page), 'one contentinfo').toHaveCount(1);
      await expect(routeMain(page), 'one route main').toHaveCount(1);
      await expect(page.locator('h1'), 'one route h1').toHaveCount(1);
      await expect(page.locator('#route-announcement'), 'one route announcement').toHaveCount(1);
      await expect(page.locator('[aria-live]'), 'one shell live region').toHaveCount(1);
      await expect(newsletter(page), 'Newsletter route policy').toHaveCount(
        surface.newsletterCount
      );

      await expect(routeMain(page).getByRole('banner'), 'Header outside route main').toHaveCount(0);
      await expect(
        routeMain(page).getByRole('contentinfo'),
        'Footer outside route main'
      ).toHaveCount(0);
      await expect(routeMain(page).locator('#route-announcement')).toHaveCount(0);
      await expect(
        routeMain(page).getByRole('region', { name: NEWSLETTER_HEADING }),
        'Newsletter outside route main'
      ).toHaveCount(0);

      const navigationNames = await resolveNavigationNames(page);

      expect(
        navigationNames.length,
        'the shell exposes several navigation landmarks'
      ).toBeGreaterThan(1);
      expect(
        navigationNames.filter((name) => name.length === 0),
        'every navigation landmark is named'
      ).toHaveLength(0);
      expect(
        new Set(navigationNames).size,
        `navigation landmark names are distinct: ${navigationNames.join(' | ')}`
      ).toBe(navigationNames.length);
    });
  }

  test('compact keyboard traversal crosses the whole shell in source order', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 640 });
    await page.goto('/GoodCall/help');

    await withDocumentStartFocus(page, async () => {
      await page.keyboard.press('Tab');
      await expect(page.locator('a[href="#main-content"]')).toBeFocused();

      await page.keyboard.press('Tab');
      await expect(informationBarDisclosure(page)).toBeFocused();

      await page.keyboard.press('Tab');
      await expect(
        banner(page).getByRole('link', { name: BRAND_LINK_LABEL, exact: true })
      ).toBeFocused();

      await page.keyboard.press('Tab');
      await expect(catalogLink(page)).toBeFocused();

      await page.keyboard.press('Tab');
      await expect(searchField(page)).toBeFocused();

      await page.keyboard.press('Tab');
      await expect(searchSubmit(page)).toBeFocused();

      const userNav = page.getByRole('navigation', { name: USER_NAV_LABEL });
      for (const label of ACTION_LABELS) {
        await page.keyboard.press('Tab');
        await expect(userNav.getByRole('link', { name: label, exact: true })).toBeFocused();
      }

      await page.keyboard.press('Tab');
      await expect(
        routeMain(page).getByRole('link', { name: CARRIER_HOME_LINK_LABEL, exact: true })
      ).toBeFocused();

      await page.keyboard.press('Tab');
      await expect(newsletterEmail(page)).toBeFocused();

      await page.keyboard.press('Tab');
      await expect(newsletterSubmit(page)).toBeFocused();

      await page.keyboard.press('Tab');
      await expect(
        footer(page).getByRole('link', { name: BRAND_LINK_LABEL, exact: true })
      ).toBeFocused();

      for (const title of FOOTER_GROUP_TITLES) {
        await page.keyboard.press('Tab');
        await expect(footerDisclosure(page, title)).toBeFocused();
      }

      await page.keyboard.press('Tab');
      await expect(footer(page).getByRole('link', { name: SUPPORT_PHONE })).toBeFocused();
    });
  });

  test('pathname navigation focuses the heading while POP leaves focus alone', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto('/GoodCall/');

    await catalogLink(page).click();
    await expect(page).toHaveURL('/GoodCall/catalog/laptops');

    const heading = page.locator('h1');
    await expect(heading, 'pathname navigation focuses the new route heading').toBeFocused();

    await page.goBack();
    await expect(page).toHaveURL(BASE_PATH);
    await expect(routeMain(page)).toHaveCount(1);
    await expect(page.locator('h1'), 'POP does not force heading focus').not.toBeFocused();

    await page.goForward();
    await expect(page).toHaveURL('/GoodCall/catalog/laptops');
    await expect(routeMain(page)).toHaveCount(1);
    await expect(page.locator('h1'), 'POP forward does not force heading focus').not.toBeFocused();
  });

  test('the catch-all leaves heading focus to the shell and names its recovery landmark', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto('/GoodCall/unknown-shell-surface');

    await expect(page.locator('h1')).toContainText('Page not found');
    await expect(
      page.locator('h1'),
      'a direct catch-all load does not steal focus from the document start'
    ).not.toBeFocused();

    await withDocumentStartFocus(page, async () => {
      await page.keyboard.press('Tab');
      await expect(page.locator('a[href="#main-content"]')).toBeFocused();
    });

    const recovery = page.getByRole('navigation', { name: NOT_FOUND_NAV_LABEL });
    await expect(recovery).toHaveCount(1);
    await expect(recovery.getByRole('link', { name: 'Back to Home' })).toBeVisible();
  });

  for (const journey of [
    {
      name: 'the Information Bar',
      expected: '/GoodCall/contacts',
      navigate: async (page: Page) => {
        await informationBar(page).getByRole('link', { name: 'Контакты', exact: true }).click();
      },
    },
    {
      name: 'a Header action',
      expected: '/GoodCall/cart',
      navigate: async (page: Page) => {
        await page
          .getByRole('navigation', { name: USER_NAV_LABEL })
          .getByRole('link', { name: 'Корзина', exact: true })
          .click();
      },
    },
    {
      name: 'a Footer legal link',
      expected: '/GoodCall/public-offer',
      navigate: async (page: Page) => {
        await footer(page)
          .getByRole('navigation', { name: 'Правовая информация' })
          .getByRole('link', { name: 'Публичная оферта', exact: true })
          .click();
      },
    },
    {
      name: 'the Global Search',
      expected: '/GoodCall/search',
      navigate: async (page: Page) => {
        await searchField(page).fill('ноутбук');
        await searchSubmit(page).click();
      },
    },
  ]) {
    test(`${journey.name} stays base-safe when leaving a nested route`, async ({ page }) => {
      const problems = collectRuntimeProblems(page);
      await page.setViewportSize({ width: 1280, height: 900 });
      await page.goto('/GoodCall/catalog/laptops');
      await expect(page.locator('h1')).toHaveText('Category');

      await journey.navigate(page);

      await expect
        .poll(() => pathnameOf(page), 'the destination resolves under the project base')
        .toBe(journey.expected);

      expect(pathnameOf(page), 'the project base is not duplicated').not.toContain(
        '/GoodCall/GoodCall'
      );
      await expect(routeMain(page)).toHaveCount(1);
      await expect(page.locator('h1')).toHaveCount(1);
      await expect(page.locator('h1')).not.toContainText('Page not found');

      expect(await horizontalOverflow(page)).toBeLessThanOrEqual(OVERFLOW_TOLERANCE);
      expectNoRuntimeProblems(problems);
    });
  }

  test('the catch-all hides the Newsletter without corrupting its session state', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto('/GoodCall/');

    await newsletterEmail(page).fill(VALID_EMAIL);
    await newsletterSubmit(page).click();
    await expect(newsletterStatus(page)).toHaveText(NEWSLETTER_SUCCESS_STATUS);

    const subscribedState = await readNewsletterStorage(page);
    expect(subscribedState, 'the subscription is persisted').not.toBeNull();

    await page.goto('/GoodCall/unknown-shell-surface');
    await expect(page.locator('h1')).toContainText('Page not found');
    await expect(newsletter(page), 'the catch-all renders no Newsletter').toHaveCount(0);
    await expect(footer(page), 'the catch-all keeps the Footer').toHaveCount(1);
    expect(
      await readNewsletterStorage(page),
      'the catch-all leaves the persisted subscription intact'
    ).toEqual(subscribedState);

    await footer(page).getByRole('link', { name: BRAND_LINK_LABEL, exact: true }).click();

    await expect(page).toHaveURL(BASE_PATH);
    await expect(newsletter(page)).toHaveCount(1);
    await expect(newsletterStatus(page)).toHaveText(NEWSLETTER_SUCCESS_STATUS);
    await expect(newsletterEmail(page)).toHaveValue(VALID_EMAIL);
  });

  for (const zoom of [
    { name: '200 percent', width: 640, height: 512 },
    { name: '400 percent', width: 320, height: 256 },
  ]) {
    test(`${zoom.name} zoom keeps the whole shell composed and reachable`, async ({ page }) => {
      await page.setViewportSize({ width: zoom.width, height: zoom.height });
      await page.goto('/GoodCall/help');

      await expectComposedShell(page, `${zoom.name} zoom`);

      await expect(informationBarDisclosure(page)).toBeVisible();
      await expect(searchField(page)).toBeVisible();
      await expect(searchSubmit(page)).toBeVisible();
      await expect(newsletterEmail(page)).toBeVisible();
      await expect(newsletterSubmit(page)).toBeVisible();

      for (const title of FOOTER_GROUP_TITLES) {
        await expect(footerDisclosure(page, title)).toBeVisible();
      }

      await footerDisclosure(page, FOOTER_GROUP_TITLES[0]).click();
      await expect(
        footer(page).getByRole('link', { name: 'Доставка и оплата', exact: true })
      ).toBeVisible();

      expect(await horizontalOverflow(page)).toBeLessThanOrEqual(OVERFLOW_TOLERANCE);
    });
  }

  test('a low-height viewport keeps every shell region scrollable and unpinned', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 400 });
    await page.goto('/GoodCall/help');

    const pinned = await page.evaluate(() => {
      const selectors = ['nav', 'header', 'main#main-content', 'footer'];

      return selectors
        .flatMap((selector) => Array.from(document.querySelectorAll(selector)))
        .map((element) => ({
          tag: element.tagName.toLowerCase(),
          position: window.getComputedStyle(element).position,
        }))
        .filter((entry) => entry.position === 'fixed' || entry.position === 'sticky');
    });

    expect(pinned, 'no shell region is pinned to the viewport').toEqual([]);

    await expectComposedShell(page, 'low height');

    const phone = footer(page).getByRole('link', { name: SUPPORT_PHONE });
    await phone.scrollIntoViewIfNeeded();
    await expect(phone).toBeVisible();

    await newsletterEmail(page).scrollIntoViewIfNeeded();
    await expect(newsletterEmail(page)).toBeVisible();
  });
});
