import { test, expect, type Locator, type Page } from '@playwright/test';
import { AxeBuilder } from '@axe-core/playwright';
import { withDocumentStartFocus } from './support/focus-origin';

const HEADING = 'Будьте в курсе новинок и акций';
const DESCRIPTION = 'Получайте подборки товаров, новые материалы и информацию об акциях GoodCall.';
const EMAIL_LABEL = 'Электронная почта';
const SUBMIT_LABEL = 'Подписаться';
const PENDING_LABEL = 'Подписываем…';
const CANONICAL_CONSENT =
  'Нажимая «Подписаться», вы соглашаетесь с демонстрационными условиями обработки данных.';
const DEMO_BOUNDARY = 'Реальная отправка писем не выполняется.';
const PENDING_STATUS = 'Подписываем адрес электронной почты…';
const SUCCESS_STATUS = 'Вы подписаны на новости и акции GoodCall.';
const EMPTY_ERROR = 'Введите адрес электронной почты.';
const INVALID_ERROR = 'Введите корректный адрес электронной почты.';

const VALID_EMAIL = 'reader@goodcall.test';
const SECOND_EMAIL = 'second@goodcall.test';
const MINIMUM_TARGET = 44;
const ROW_TOLERANCE = 2;

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

function newsletter(page: Page) {
  return page.getByRole('region', { name: HEADING });
}

function emailField(page: Page) {
  return newsletter(page).getByRole('textbox', { name: new RegExp(EMAIL_LABEL) });
}

function submitButton(page: Page) {
  return newsletter(page).getByRole('button');
}

function newsletterStatus(page: Page) {
  return page.locator('[data-newsletter-status]');
}

function newsletterHeading(page: Page) {
  return newsletter(page).getByRole('heading', { level: 2, name: HEADING });
}

function routeMain(page: Page) {
  return page.locator('main#main-content');
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

function collectDataRequests(page: Page): string[] {
  const requests: string[] = [];

  page.on('request', (request) => {
    const type = request.resourceType();
    if (type === 'xhr' || type === 'fetch') {
      requests.push(`${type} ${request.url()}`);
    }
  });

  return requests;
}

async function horizontalOverflow(page: Page): Promise<number> {
  return page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth
  );
}

const NEWSLETTER_STORAGE_KEY = 'goodcall.newsletter';

async function readNewsletterStorage(page: Page): Promise<unknown> {
  return page.evaluate((key) => {
    const raw = window.sessionStorage.getItem(key);
    return raw === null ? null : (JSON.parse(raw) as unknown);
  }, NEWSLETTER_STORAGE_KEY);
}

async function clearNewsletterStorage(page: Page): Promise<void> {
  await page.evaluate((key) => {
    window.sessionStorage.removeItem(key);
  }, NEWSLETTER_STORAGE_KEY);
}

async function subscribe(page: Page, value: string): Promise<void> {
  await emailField(page).fill(value);
  await submitButton(page).click();
  await expect(newsletterStatus(page)).toHaveText(SUCCESS_STATUS);
}

test.describe('M4-06 Newsletter pre-footer', () => {
  test('expanded 1440px renders the canonical section after route content', async ({ page }) => {
    const problems = collectRuntimeProblems(page);
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/GoodCall/');

    await expect(newsletter(page)).toHaveCount(1);
    await expect(newsletterHeading(page)).toHaveText(HEADING);
    await expect(newsletter(page).getByText(DESCRIPTION)).toBeVisible();
    await expect(emailField(page)).toBeVisible();
    await expect(submitButton(page)).toHaveText(SUBMIT_LABEL);
    await expect(newsletter(page).getByText(CANONICAL_CONSENT, { exact: false })).toBeVisible();
    await expect(newsletter(page).getByText(DEMO_BOUNDARY, { exact: false })).toBeVisible();
    await expect(newsletterStatus(page)).toHaveCount(0);

    const main = await resolveBox(routeMain(page), 'route main');
    const section = await resolveBox(newsletter(page), 'Newsletter section');

    expect(section.y, 'Newsletter follows route content').toBeGreaterThanOrEqual(
      boxBottom(main) - ROW_TOLERANCE
    );

    await expect(page.locator('footer')).toHaveCount(0);
    await expect(page.getByRole('contentinfo')).toHaveCount(0);
    await expect(routeMain(page)).toHaveCount(1);

    expect(await horizontalOverflow(page)).toBeLessThanOrEqual(1);
    expect(problems.pageErrors).toHaveLength(0);
    expect(problems.consoleErrors).toHaveLength(0);
    expect(problems.failedRequests).toHaveLength(0);
  });

  test('expanded 1440px composes copy and form as two columns', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/GoodCall/');

    const heading = await resolveBox(newsletterHeading(page), 'heading');
    const field = await resolveBox(emailField(page), 'email field');

    expect(field.x, 'form column follows the copy column').toBeGreaterThan(heading.x);
    expect(field.y, 'form column shares the section row').toBeLessThan(boxBottom(heading) + 200);
    expect(await horizontalOverflow(page)).toBeLessThanOrEqual(1);
  });

  for (const width of [1023, 1024, 1025, 1279, 1280, 1281]) {
    test(`${String(width)}px keeps the Newsletter form usable`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto('/GoodCall/');

      await expect(newsletter(page)).toHaveCount(1);
      await expect(emailField(page)).toBeVisible();
      await expect(submitButton(page)).toBeVisible();

      const heading = await resolveBox(newsletterHeading(page), 'heading');
      const field = await resolveBox(emailField(page), 'email field');
      const submit = await resolveBox(submitButton(page), 'submit');

      if (width >= 1024) {
        expect(field.x, 'wide uses a form column beside the copy').toBeGreaterThan(heading.x);
      } else {
        expect(field.y, 'medium stacks the form below the copy').toBeGreaterThan(
          boxBottom(heading) - ROW_TOLERANCE
        );
        expect(Math.round(field.x)).toBe(Math.round(heading.x));
      }

      expect(submit.height).toBeGreaterThanOrEqual(MINIMUM_TARGET);
      expect(submit.width).toBeGreaterThanOrEqual(MINIMUM_TARGET);
      expect(await horizontalOverflow(page)).toBeLessThanOrEqual(1);
    });
  }

  for (const width of [767, 768, 769]) {
    test(`${String(width)}px keeps the sequential composition stable`, async ({ page }) => {
      await page.setViewportSize({ width, height: 800 });
      await page.goto('/GoodCall/');

      const heading = await resolveBox(newsletterHeading(page), 'heading');
      const description = await resolveBox(newsletter(page).getByText(DESCRIPTION), 'description');
      const field = await resolveBox(emailField(page), 'email field');
      const submit = await resolveBox(submitButton(page), 'submit');

      expect(description.y).toBeGreaterThanOrEqual(boxBottom(heading) - ROW_TOLERANCE);
      expect(field.y).toBeGreaterThanOrEqual(boxBottom(description) - ROW_TOLERANCE);
      expect(submit.y).toBeGreaterThanOrEqual(boxBottom(field) - ROW_TOLERANCE);

      expect(submit.height).toBeGreaterThanOrEqual(MINIMUM_TARGET);
      expect(await horizontalOverflow(page)).toBeLessThanOrEqual(1);
    });
  }

  test('compact 320px keeps the strict sequential order and usable targets', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 640 });
    await page.goto('/GoodCall/');

    const heading = await resolveBox(newsletterHeading(page), 'heading');
    const description = await resolveBox(newsletter(page).getByText(DESCRIPTION), 'description');
    const field = await resolveBox(emailField(page), 'email field');
    const submit = await resolveBox(submitButton(page), 'submit');
    const consent = await resolveBox(
      newsletter(page).getByText(CANONICAL_CONSENT, { exact: false }),
      'consent note'
    );

    expect(description.y).toBeGreaterThanOrEqual(boxBottom(heading) - ROW_TOLERANCE);
    expect(field.y).toBeGreaterThanOrEqual(boxBottom(description) - ROW_TOLERANCE);
    expect(submit.y).toBeGreaterThanOrEqual(boxBottom(field) - ROW_TOLERANCE);
    expect(consent.y).toBeGreaterThanOrEqual(boxBottom(submit) - ROW_TOLERANCE);

    expect(submit.height).toBeGreaterThanOrEqual(MINIMUM_TARGET);
    expect(submit.width).toBeGreaterThanOrEqual(MINIMUM_TARGET);
    expect(field.height).toBeGreaterThanOrEqual(MINIMUM_TARGET);

    expect(await horizontalOverflow(page)).toBeLessThanOrEqual(1);
  });

  test('invalid submission reports associated errors without a status', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto('/GoodCall/');

    await emailField(page).focus();
    await submitButton(page).click();

    await expect(newsletter(page).getByText(EMPTY_ERROR)).toBeVisible();
    await expect(emailField(page)).toBeFocused();
    await expect(emailField(page)).toHaveAttribute('aria-invalid', 'true');
    await expect(newsletterStatus(page)).toHaveCount(0);

    await emailField(page).fill('broken');
    await submitButton(page).click();

    await expect(newsletter(page).getByText(INVALID_ERROR)).toBeVisible();
    await expect(emailField(page)).toHaveValue('broken');
    await expect(emailField(page)).toBeFocused();
    await expect(newsletterStatus(page)).toHaveCount(0);

    const announcement = page.locator('#route-announcement');
    await expect(announcement).not.toContainText(INVALID_ERROR);
    await expect(announcement).not.toContainText(EMPTY_ERROR);
  });

  test('valid submission runs the deterministic pending and success lifecycle', async ({
    page,
  }) => {
    const dataRequests = collectDataRequests(page);
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto('/GoodCall/');

    await emailField(page).fill(VALID_EMAIL);
    await emailField(page).press('Enter');

    await expect(newsletterStatus(page)).toHaveText(PENDING_STATUS);
    await expect(newsletterStatus(page)).toHaveCount(1);
    await expect(newsletterStatus(page)).toHaveAttribute('role', 'status');
    await expect(submitButton(page)).toBeDisabled();
    await expect(submitButton(page)).toHaveText(PENDING_LABEL);

    await expect(newsletterStatus(page)).toHaveText(SUCCESS_STATUS);
    await expect(newsletterStatus(page)).toHaveCount(1);
    await expect(emailField(page)).toHaveValue(VALID_EMAIL);
    await expect(emailField(page)).toBeFocused();
    await expect(submitButton(page)).toBeDisabled();

    const announcement = page.locator('#route-announcement');
    await expect(announcement).not.toContainText(SUCCESS_STATUS);

    expect(dataRequests, 'no data request is issued').toHaveLength(0);
  });

  test('rapid duplicate activation produces one lifecycle', async ({ page }) => {
    const dataRequests = collectDataRequests(page);
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto('/GoodCall/');

    await emailField(page).fill(VALID_EMAIL);

    await newsletter(page).evaluate((section) => {
      const form = section.querySelector('form');
      form?.requestSubmit();
      form?.requestSubmit();
      form?.requestSubmit();
    });

    await expect(newsletterStatus(page)).toHaveCount(1);
    await expect(newsletterStatus(page)).toHaveText(SUCCESS_STATUS);
    await expect(newsletterStatus(page)).toHaveCount(1);
    expect(dataRequests).toHaveLength(0);
  });

  test('editing after success resets the lifecycle and allows a second subscription', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto('/GoodCall/');

    await subscribe(page, VALID_EMAIL);

    await emailField(page).fill(SECOND_EMAIL);

    await expect(newsletterStatus(page)).toHaveCount(0);
    await expect(submitButton(page)).toBeEnabled();

    await submitButton(page).click();
    await expect(newsletterStatus(page)).toHaveText(SUCCESS_STATUS);
    await expect(emailField(page)).toHaveValue(SECOND_EMAIL);
  });

  test('route visibility and state continuity follow the shell policy', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto('/GoodCall/');

    await subscribe(page, VALID_EMAIL);

    await page
      .getByRole('navigation', { name: 'Пользовательская навигация' })
      .getByRole('link', { name: 'Сравнение', exact: true })
      .click();
    await expect(page.locator('h1')).toHaveText('Сравнение товаров');
    await expect(newsletter(page)).toHaveCount(1);
    await expect(newsletterStatus(page)).toHaveText(SUCCESS_STATUS);

    await page.goto('/GoodCall/help');
    await expect(page.locator('h1')).toHaveText('Помощь');
    await expect(newsletter(page)).toHaveCount(1);
    await expect(newsletterStatus(page)).toHaveText(SUCCESS_STATUS);
    await expect(emailField(page)).toHaveValue(VALID_EMAIL);
  });

  test('client navigation between visible routes preserves the subscribed state', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto('/GoodCall/');

    await subscribe(page, VALID_EMAIL);

    await page
      .getByRole('navigation', { name: 'Основная навигация' })
      .getByRole('link', { name: 'Каталог', exact: true })
      .click();
    await expect(page.locator('h1')).toHaveText('Category');
    await expect(newsletter(page)).toHaveCount(1);

    await page.getByRole('link', { name: 'GoodCall — на главную', exact: true }).click();
    await expect(newsletterStatus(page)).toHaveText(SUCCESS_STATUS);
  });

  test('the catch-all route renders no Newsletter section', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto('/GoodCall/unknown-path');

    await expect(page.locator('h1')).toContainText('Page not found');
    await expect(newsletter(page)).toHaveCount(0);
    await expect(routeMain(page)).toHaveCount(1);
    await expect(page.getByRole('banner')).toHaveCount(1);
  });

  test('a reload restores the subscription within the same browser session', async ({ page }) => {
    const dataRequests = collectDataRequests(page);
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto('/GoodCall/');
    await clearNewsletterStorage(page);
    await page.reload();

    await emailField(page).fill(`   ${VALID_EMAIL}   `);
    await submitButton(page).click();
    await expect(newsletterStatus(page)).toHaveText(SUCCESS_STATUS);

    expect(await readNewsletterStorage(page)).toEqual({
      version: 1,
      state: 'subscribed',
      email: VALID_EMAIL,
    });

    await page.reload();

    await expect(newsletter(page)).toHaveCount(1);
    await expect(newsletterStatus(page)).toHaveText(SUCCESS_STATUS);
    await expect(emailField(page)).toHaveValue(VALID_EMAIL);
    await expect(submitButton(page)).toBeDisabled();
    await expect(newsletterStatus(page)).not.toHaveText(PENDING_STATUS);
    await expect(emailField(page)).not.toBeFocused();
    expect(dataRequests, 'no data request is issued').toHaveLength(0);
  });

  test('editing a subscription removes the persisted consent', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto('/GoodCall/');
    await clearNewsletterStorage(page);
    await page.reload();

    await subscribe(page, VALID_EMAIL);
    expect(await readNewsletterStorage(page)).not.toBeNull();

    await emailField(page).fill(SECOND_EMAIL);

    await expect(newsletterStatus(page)).toHaveCount(0);
    expect(await readNewsletterStorage(page)).toBeNull();

    await page.reload();

    await expect(newsletterStatus(page)).toHaveCount(0);
    await expect(emailField(page)).toHaveValue('');
    await expect(submitButton(page)).toBeEnabled();
  });

  for (const scenario of [
    { name: 'malformed JSON', raw: 'not-json{' },
    {
      name: 'unsupported version',
      raw: JSON.stringify({ version: 2, state: 'subscribed', email: VALID_EMAIL }),
    },
    {
      name: 'invalid email',
      raw: JSON.stringify({ version: 1, state: 'subscribed', email: 'broken' }),
    },
  ]) {
    test(`boots safely with ${scenario.name} persisted`, async ({ page }) => {
      const problems = collectRuntimeProblems(page);
      await page.setViewportSize({ width: 1280, height: 900 });

      await page.addInitScript(
        ([key, raw]) => {
          window.sessionStorage.setItem(key as string, raw as string);
          window.sessionStorage.setItem('goodcall.unrelated', 'keep-me');
        },
        [NEWSLETTER_STORAGE_KEY, scenario.raw]
      );

      await page.goto('/GoodCall/');

      await expect(newsletter(page)).toHaveCount(1);
      await expect(newsletterStatus(page)).toHaveCount(0);
      await expect(emailField(page)).toHaveValue('');
      expect(await readNewsletterStorage(page)).toBeNull();

      const unrelated = await page.evaluate(() =>
        window.sessionStorage.getItem('goodcall.unrelated')
      );
      expect(unrelated).toBe('keep-me');

      expect(problems.pageErrors).toHaveLength(0);
      expect(problems.consoleErrors).toHaveLength(0);
    });
  }

  test('post-error revalidation follows the Zod boundary on change and blur', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto('/GoodCall/');
    await clearNewsletterStorage(page);
    await page.reload();

    await emailField(page).fill('broken');
    await submitButton(page).click();
    await expect(newsletter(page).getByText(INVALID_ERROR)).toBeVisible();

    await emailField(page).fill('still-broken');
    await expect(newsletter(page).getByText(INVALID_ERROR)).toBeVisible();
    await expect(emailField(page)).toHaveAttribute('aria-invalid', 'true');

    await emailField(page).blur();
    await expect(newsletter(page).getByText(INVALID_ERROR)).toBeVisible();

    await emailField(page).fill(VALID_EMAIL);
    await expect(newsletter(page).getByText(INVALID_ERROR)).toHaveCount(0);
    await expect(emailField(page)).not.toHaveAttribute('aria-invalid', 'true');

    await expect(newsletter(page).getByText(EMAIL_LABEL, { exact: true })).toBeVisible();

    await submitButton(page).click();
    await expect(newsletterStatus(page)).toHaveText(SUCCESS_STATUS);
  });

  test('keyboard order reaches the email field before the submit control', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto('/GoodCall/');

    const order = await newsletter(page).evaluate((section) => {
      const nodes = Array.from(section.querySelectorAll('input, button'));
      return nodes.map((node) => node.tagName.toLowerCase());
    });

    expect(order).toEqual(['input', 'button']);

    await withDocumentStartFocus(page, async () => {
      await emailField(page).focus();
      await expect(emailField(page)).toBeFocused();

      await page.keyboard.press('Tab');
      await expect(submitButton(page)).toBeFocused();
    });

    await expect(newsletterStatus(page)).toHaveCount(0);
  });

  test('200 percent zoom keeps the form operable', async ({ page }) => {
    await page.setViewportSize({ width: 640, height: 512 });
    await page.goto('/GoodCall/');

    await expect(emailField(page)).toBeVisible();
    await expect(submitButton(page)).toBeVisible();

    await subscribe(page, VALID_EMAIL);

    expect(await horizontalOverflow(page)).toBeLessThanOrEqual(1);
  });

  test('400 percent zoom resolves to the sequential composition', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 256 });
    await page.goto('/GoodCall/');

    const heading = await resolveBox(newsletterHeading(page), 'heading');
    const field = await resolveBox(emailField(page), 'email field');
    const submit = await resolveBox(submitButton(page), 'submit');

    expect(field.y).toBeGreaterThan(boxBottom(heading) - ROW_TOLERANCE);
    expect(submit.y).toBeGreaterThanOrEqual(boxBottom(field) - ROW_TOLERANCE);

    await subscribe(page, VALID_EMAIL);

    expect(await horizontalOverflow(page)).toBeLessThanOrEqual(1);
  });

  test('low-height viewport keeps the field, error and status reachable', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 400 });
    await page.goto('/GoodCall/');

    await submitButton(page).click();
    await expect(newsletter(page).getByText(EMPTY_ERROR)).toBeVisible();

    await subscribe(page, VALID_EMAIL);
    await expect(newsletterStatus(page)).toBeVisible();

    const position = await newsletter(page).evaluate(
      (element) => window.getComputedStyle(element).position
    );
    expect(['static', 'relative']).toContain(position);
  });

  test('coarse pointer completes the lifecycle by tap', async ({ browser }) => {
    const context = await browser.newContext({
      viewport: { width: 390, height: 844 },
      hasTouch: true,
      isMobile: true,
    });
    const page = await context.newPage();

    try {
      await page.goto('/GoodCall/');

      await emailField(page).tap();
      await emailField(page).fill(VALID_EMAIL);
      await submitButton(page).tap();

      await expect(newsletterStatus(page)).toHaveText(SUCCESS_STATUS);

      await emailField(page).fill(SECOND_EMAIL);
      await expect(newsletterStatus(page)).toHaveCount(0);

      await submitButton(page).tap();
      await expect(newsletterStatus(page)).toHaveText(SUCCESS_STATUS);
    } finally {
      await context.close();
    }
  });

  test('forced colors keeps the field, focus, error and status perceivable', async ({ page }) => {
    await page.emulateMedia({ forcedColors: 'active' });
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto('/GoodCall/');

    const fieldBoundary = await emailField(page).evaluate((element) => {
      const style = window.getComputedStyle(element);
      return { style: style.borderTopStyle, width: parseFloat(style.borderTopWidth) };
    });
    expect(fieldBoundary.style).not.toBe('none');
    expect(fieldBoundary.width).toBeGreaterThan(0);

    await emailField(page).focus();
    const focusIndicator = await emailField(page).evaluate((element) => {
      const style = window.getComputedStyle(element);
      return { style: style.outlineStyle, width: parseFloat(style.outlineWidth) };
    });
    expect(focusIndicator.style).not.toBe('none');
    expect(focusIndicator.width).toBeGreaterThan(0);

    const submitBoundary = await submitButton(page).evaluate((element) => {
      const style = window.getComputedStyle(element);
      return { style: style.borderTopStyle, width: parseFloat(style.borderTopWidth) };
    });
    expect(submitBoundary.style).not.toBe('none');

    await submitButton(page).click();
    await expect(newsletter(page).getByText(EMPTY_ERROR)).toBeVisible();
    await expect(emailField(page)).toHaveAttribute('aria-invalid', 'true');

    await subscribe(page, VALID_EMAIL);
    await expect(newsletterStatus(page)).toBeVisible();
    await expect(newsletterStatus(page)).toHaveText(SUCCESS_STATUS);
  });

  test('reduced motion keeps the lifecycle immediate', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto('/GoodCall/');

    await subscribe(page, VALID_EMAIL);
    await expect(newsletterStatus(page)).toHaveText(SUCCESS_STATUS);
  });

  test('axe passes for the initial Newsletter at expanded width', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/GoodCall/');
    await expect(newsletter(page)).toHaveCount(1);

    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toHaveLength(0);
  });

  test('axe passes for the invalid Newsletter state', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto('/GoodCall/');

    await submitButton(page).click();
    await expect(newsletter(page).getByText(EMPTY_ERROR)).toBeVisible();

    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toHaveLength(0);
  });

  test('axe passes for the subscribed Newsletter state', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto('/GoodCall/');

    await subscribe(page, VALID_EMAIL);

    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toHaveLength(0);
  });

  test('axe passes for the compact initial Newsletter', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 640 });
    await page.goto('/GoodCall/');
    await expect(newsletter(page)).toHaveCount(1);

    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toHaveLength(0);
  });

  test('axe passes for the compact invalid Newsletter', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 640 });
    await page.goto('/GoodCall/');

    await submitButton(page).click();
    await expect(newsletter(page).getByText(EMPTY_ERROR)).toBeVisible();

    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toHaveLength(0);
  });

  test('axe passes on the catch-all without a Newsletter section', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto('/GoodCall/unknown-path');

    await expect(newsletter(page)).toHaveCount(0);

    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toHaveLength(0);
  });
});
