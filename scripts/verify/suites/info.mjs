import { MOCK_SUPABASE_HOST } from '../lib/build.mjs';
import { launchBrowser } from '../lib/browser.mjs';
import { openPage } from '../lib/page.mjs';
import { appBase, reportCounts } from '../lib/suite.mjs';

const BASE = appBase();

let passed = 0;
const failures = [];
function check(condition, message) {
  if (condition) passed += 1;
  else failures.push(message);
}

const ROUTES = [
  { path: '/delivery', short: 'delivery', title: 'Доставка и оплата', crumb: 'Доставка и оплата' },
  {
    path: '/warranty',
    short: 'warranty',
    title: 'Гарантия и возврат',
    crumb: 'Гарантия и возврат',
  },
  { path: '/faq', short: 'faq', title: 'Часто задаваемые вопросы', crumb: 'FAQ' },
];
const CANONICAL_PAYMENT = ['Банковская карта', 'СБП', 'Наличные'];
const UNSUPPORTED_PAYMENT =
  /visa|mastercard|qiwi|ю\s?money|юmoney|sberpay|t-pay|tinkoff|тинькофф|apple pay|google pay|сбербанк|рассрочк|кредит/i;
const INACTIVE_ACCOUNT =
  /зарегистр|регистрац|парол|личн\S* кабинет|бонус|аккаунт|войдите|авторизу/i;
const SUPPORT_PHONE = '8 800 100-10-10';

const browser = await launchBrowser({ extraArgs: ['--hide-scrollbars'] });

function newPage(width = 1440, height = 900) {
  return openPage(browser, {
    width,
    height,
    interceptPatterns: [`*${MOCK_SUPABASE_HOST}*`],
    respond: () => ({ status: 200, body: '[]' }),
    onPageError: (message) => failures.push(`pageerror ${message}`),
  });
}

async function open(page, path) {
  await page.goto(`${BASE}#${path}`);
  await page.waitForSelector('main h1');
}

const mainText = (page) => page.evaluate(() => document.querySelector('main').innerText);

const page = await newPage();

for (const route of ROUTES) {
  await open(page, route.path);
  const facts = await page.evaluate(() => ({
    h1: [...document.querySelectorAll('h1')].map((h) => h.textContent.trim()),
    crumbs: [...document.querySelectorAll('nav[aria-label="Хлебные крошки"] li')].map((li) => ({
      text: li.textContent.trim(),
      href: li.querySelector('a')?.getAttribute('href') ?? null,
      current: li.getAttribute('aria-current'),
    })),
    footer: [...document.querySelectorAll('.site-footer__group-link')].map((a) => [
      a.textContent.trim(),
      a.getAttribute('href'),
    ]),
    footerPlain: [...document.querySelectorAll('.site-footer__group-item')]
      .filter((li) => li.querySelector('a') === null)
      .map((li) => li.textContent.trim()),
    footerMarks: [...document.querySelectorAll('.site-footer__payment-mark')].map((img) => img.alt),
    footerContacts: [...document.querySelectorAll('.site-footer__contact-value')].map((a) =>
      a.textContent.trim(),
    ),
    bodyText: document.body.innerText,
    sectionHeadings: [...document.querySelectorAll('main h2')].map((h) => h.textContent.trim()),
  }));
  const tag = route.short;
  check(facts.h1.length === 1 && facts.h1[0] === route.title, `${tag}: single h1 ${facts.h1}`);
  check(
    facts.crumbs.length === 2 &&
      facts.crumbs[0].href === '#/' &&
      facts.crumbs[1].text === route.crumb &&
      facts.crumbs[1].current === 'page',
    `${tag}: breadcrumbs ${JSON.stringify(facts.crumbs)}`,
  );
  check(
    JSON.stringify(facts.footer) ===
      JSON.stringify([
        ['Доставка и оплата', '#/delivery'],
        ['Гарантия и возврат', '#/warranty'],
        ['FAQ', '#/faq'],
      ]),
    `${tag}: footer help links ${JSON.stringify(facts.footer)}`,
  );
  check(
    facts.footerPlain.includes('Бонусная программа') &&
      facts.footerPlain.includes('Сервисные центры') &&
      facts.footerPlain.includes('Контакты'),
    `${tag}: unrelated footer items stay plain text`,
  );
  check(
    facts.footerMarks.join(',') === 'МИР,СБП',
    `${tag}: footer payment marks ${facts.footerMarks}`,
  );
  check(
    facts.footerContacts.join('|') === `${SUPPORT_PHONE}|support@goodcall.example`,
    `${tag}: footer support identity ${facts.footerContacts}`,
  );
  check(!UNSUPPORTED_PAYMENT.test(facts.bodyText), `${tag}: no unsupported payment claims`);
  check(
    !facts.bodyText.includes('goodcall.ru') && !facts.bodyText.includes('100-10-19'),
    `${tag}: no conflicting support contacts`,
  );
  const main = await mainText(page);
  check(!INACTIVE_ACCOUNT.test(main), `${tag}: no Account/Auth/bonus claims in page body`);
  check(main.includes(SUPPORT_PHONE), `${tag}: canonical support phone in page`);
  check(
    (await page.count('main a[href="tel:+78001001010"]')) >= 1 &&
      (await page.count('main a[href="mailto:support@goodcall.example"]')) >= 1,
    `${tag}: support contact links`,
  );
  check(facts.sectionHeadings.length >= 2, `${tag}: section headings ${facts.sectionHeadings}`);
}

await open(page, '/delivery');
const delivery = await page.evaluate(() => ({
  tabs: [...document.querySelectorAll('[role="tab"]')].map((t) => [
    t.textContent.trim(),
    t.getAttribute('aria-selected'),
  ]),
  panels: [...document.querySelectorAll('[role="tabpanel"]')].map((p) => [p.id, p.hidden]),
  payment: [...document.querySelectorAll('.payment-method__title')].map((h) =>
    h.textContent.trim(),
  ),
  marks: [...document.querySelectorAll('.payment-method__mark')].map(
    (img) => img.getAttribute('src') !== null,
  ),
  slots: ['10:00 – 14:00', '14:00 – 18:00', '18:00 – 22:00'].every((slot) =>
    document.querySelector('main').innerText.includes(slot),
  ),
  courierFacts: [
    ...document.querySelectorAll('#delivery-methods-tabpanel-courier .info-facts__title'),
  ].map((el) => el.textContent.trim()),
  timings: [...document.querySelectorAll('.payment-method')].map((card) =>
    [...card.querySelectorAll('.payment-method__timing')].map((el) => el.textContent.trim()),
  ),
  options: [...document.querySelectorAll('.payment-method__options')].map((el) =>
    el.textContent.trim(),
  ),
  highlightNotes: [...document.querySelectorAll('.benefits-strip__note')].map((el) =>
    el.textContent.trim(),
  ),
  security: document.querySelector('.payment-security')?.innerText ?? '',
  support: document.querySelector('.info-support')?.innerText ?? '',
  supportLinks: [...document.querySelectorAll('.info-support__action')].map((a) =>
    a.getAttribute('href'),
  ),
}));
check(
  JSON.stringify(delivery.tabs) ===
    JSON.stringify([
      ['Курьером', 'true'],
      ['Самовывоз', 'false'],
    ]),
  `delivery: tabs ${JSON.stringify(delivery.tabs)}`,
);
check(
  delivery.panels.length === 2 && delivery.panels[0][1] === false && delivery.panels[1][1] === true,
  'delivery: courier panel shown by default',
);
check(
  JSON.stringify(delivery.payment) === JSON.stringify(CANONICAL_PAYMENT),
  `delivery: canonical payment methods ${delivery.payment}`,
);
check(delivery.marks.length === 2, 'delivery: МИР and СБП marks only');
check(delivery.slots, 'delivery: checkout delivery intervals');
check(
  delivery.courierFacts.join('|') === 'Дата доставки|Интервал|До двери|Комментарий курьеру',
  `delivery: courier fact tiles ${delivery.courierFacts}`,
);
check(
  JSON.stringify(delivery.timings) ===
    JSON.stringify([['Онлайн', 'При получении'], ['Онлайн'], ['При получении']]),
  `delivery: payment timings from checkout options ${JSON.stringify(delivery.timings)}`,
);
check(
  delivery.options[0].includes('«Банковской картой онлайн», «При получении картой»') &&
    delivery.options[1].includes('«СБП»') &&
    delivery.options[2].includes('«Наличными»'),
  `delivery: checkout option labels ${delivery.options}`,
);
check(
  delivery.highlightNotes.includes('Срок указан для конкретного товара'),
  'delivery: warranty highlight is product-specific',
);
check(delivery.security.includes('не списываются'), 'delivery: demo payment boundary');
check(
  delivery.supportLinks.join(',') === '#/faq,#/warranty',
  `delivery: support cross-links ${delivery.supportLinks}`,
);
await page.focus('[role="tab"][aria-selected="true"]');
await page.keyboard.press('ArrowRight');
await page.waitForFunction(() => document.activeElement?.textContent === 'Самовывоз');
const pickup = await page.evaluate(() => {
  const panel = [...document.querySelectorAll('[role="tabpanel"]')].find((p) => !p.hidden);
  return {
    id: panel?.id,
    labelledBy: panel?.getAttribute('aria-labelledby'),
    stores: panel?.querySelectorAll('.delivery-method__store').length,
    shops: panel?.querySelector('a[href="#/shops"]') !== null,
  };
});
check(
  pickup.id === 'delivery-methods-tabpanel-pickup' &&
    pickup.labelledBy === 'delivery-methods-tab-pickup',
  `delivery: arrow key selects pickup ${JSON.stringify(pickup)}`,
);
check(pickup.stores === 6 && pickup.shops, 'delivery: pickup lists demo stores + shops link');

await open(page, '/warranty');
const warranty = await page.evaluate(() => ({
  tabs: document.querySelectorAll('[role="tab"], [role="tabpanel"]').length,
  hidden: [...document.querySelectorAll('main section')].filter(
    (section) => section.hidden || section.closest('[hidden]') !== null,
  ).length,
  sections: [...document.querySelectorAll('main .info-section > .info-section__heading h2')].map(
    (h) => h.textContent.trim(),
  ),
  jump: [...document.querySelectorAll('nav[aria-label="Разделы страницы"] button')].map((b) =>
    b.textContent.trim(),
  ),
  returnSteps: document.querySelectorAll('[aria-label="Порядок возврата и обмена"] li').length,
  repairSteps: document.querySelectorAll('[aria-label="Порядок обращения в сервис"] li').length,
  facts: [...document.querySelectorAll('[aria-label="Условия гарантии"] .info-facts__title')].map(
    (el) => el.textContent.trim(),
  ),
  sources: document.querySelectorAll('[aria-label="Где найти условия гарантии"] li').length,
  order: [...document.querySelectorAll('main .info-section__title, main .info-support__title')].map(
    (h) => h.textContent.trim(),
  ),
  text: document.querySelector('main').innerText,
}));
check(warranty.tabs === 0 && warranty.hidden === 0, 'warranty: no hidden tab panels');
check(
  warranty.order.join('|') ===
    'Возврат и обмен|Гарантия|Ремонт и сервисное обслуживание|Остались вопросы?',
  `warranty: sequential journey ${warranty.order}`,
);
check(
  warranty.jump.join('|') === 'Возврат и обмен|Гарантия|Ремонт и сервис',
  `warranty: section navigation ${warranty.jump}`,
);
check(
  warranty.returnSteps === 4 && warranty.repairSteps === 4,
  `warranty: return ${warranty.returnSteps} / repair ${warranty.repairSteps} steps`,
);
check(
  warranty.facts.join('|') ===
    'Кто даёт гарантию|Срок гарантии|Что обычно покрывает|Что обычно не покрывает' &&
    warranty.sources === 3,
  `warranty: guarantee facts ${warranty.facts} sources ${warranty.sources}`,
);
check(warranty.text.includes('О защите прав потребителей'), 'warranty: consumer-law basis');
check(
  !/14 дней|без объяснения причин/i.test(warranty.text),
  'warranty: no raster return-period claim',
);
check(
  warranty.text.includes('не управляет собственными сервисными центрами'),
  'warranty: no owned service-center claim',
);
check(
  !/12 месяц|12 мес/.test(warranty.text) && warranty.text.includes('Указан для конкретного товара'),
  'warranty: no global warranty duration',
);
await page.click('nav[aria-label="Разделы страницы"] button', { hasText: 'Ремонт и сервис' });
await page.waitForFunction(() => document.activeElement?.id === 'warranty-repair-title');
const jumped = await page.evaluate(() => {
  const rect = document.getElementById('warranty-repair-title').getBoundingClientRect();
  return { top: rect.top, viewport: innerHeight, scrolled: scrollY > 0 };
});
check(
  jumped.scrolled && jumped.top >= 0 && jumped.top < jumped.viewport / 2,
  `warranty: section navigation scrolls and focuses ${JSON.stringify(jumped)}`,
);
await page.focus('nav[aria-label="Разделы страницы"] button');
await page.keyboard.press('Enter');
await page.waitForFunction(() => document.activeElement?.id === 'warranty-returns-title');
check(
  (await page.evaluate(() => document.activeElement?.tagName)) === 'H2',
  'warranty: keyboard section navigation',
);

await open(page, '/faq');
const faqState = () =>
  page.evaluate(() => ({
    triggers: [...document.querySelectorAll('.faq-accordion__question')].map((b) => ({
      text: b.textContent.trim(),
      expanded: b.getAttribute('aria-expanded'),
      controls: b.getAttribute('aria-controls'),
      tag: b.tagName,
    })),
    regions: [...document.querySelectorAll('.faq-accordion__content[role="region"]')].map((r) => ({
      hidden: r.hidden,
      labelledBy: r.getAttribute('aria-labelledby'),
      id: r.id,
    })),
    ids: [...document.querySelectorAll('.faq-accordion__question')].map((b) => b.id),
    pressed: [...document.querySelectorAll('.faq-topics__item[aria-pressed="true"]')].map(
      (b) => b.querySelector('.faq-topics__label').textContent,
    ),
    topics: document.querySelectorAll('.faq-topics__item').length,
    empty: document.querySelector('.faq-empty') !== null,
    count: document.querySelector('.faq-results__count')?.textContent ?? '',
    searchName: document.querySelector('.faq-page__search input')?.labels?.[0]?.textContent ?? '',
  }));
let faq = await faqState();
check(faq.triggers.length === 18, `faq: 18 questions (${faq.triggers.length})`);
check(
  faq.triggers.every(
    (t) => t.tag === 'BUTTON' && (t.expanded === 'true' || t.expanded === 'false'),
  ) &&
    faq.regions.length === faq.triggers.length &&
    faq.regions.every((r, index) => r.labelledBy === faq.ids[index]),
  'faq: semantic buttons with aria-expanded and labelled answer regions',
);
check(
  faq.triggers
    .filter((t) => t.expanded === 'true')
    .every((t) => faq.regions.some((r) => r.id === t.controls && !r.hidden)),
  'faq: open trigger controls its visible answer region',
);
check(
  faq.triggers[0].text === 'Как оформить заказ?' &&
    faq.triggers[0].expanded === 'true' &&
    faq.triggers.slice(1).every((t) => t.expanded === 'false'),
  'faq: first question open by default',
);
check(
  faq.regions.filter((r) => !r.hidden).length === 1,
  `faq: one answer region open (${faq.regions.filter((r) => !r.hidden).length})`,
);
check(
  faq.topics === 6 && faq.pressed.join() === 'Все вопросы',
  `faq: topics ${faq.topics} ${faq.pressed}`,
);
check(faq.searchName === 'Поиск по вопросам', `faq: search label "${faq.searchName}"`);
check(
  (await page.count('.faq-steps__item')) === 4 && (await page.count('main a[href="#/cart"]')) === 1,
  'faq: order steps + cart link in default answer',
);
await page.click('.faq-accordion__question', { hasText: 'Можно ли изменить или отменить заказ?' });
await page.waitForFunction(
  () =>
    [...document.querySelectorAll('.faq-accordion__question')]
      .find((b) => b.textContent.includes('изменить или отменить'))
      ?.getAttribute('aria-expanded') === 'true',
);
faq = await faqState();
check(faq.triggers[0].expanded === 'false', 'faq: single-open accordion');
await page.focus('.faq-accordion__question');
await page.keyboard.press('Enter');
await page.waitForTimeout(150);
faq = await faqState();
check(
  faq.triggers[0].expanded === 'true' && faq.triggers[2].expanded === 'false',
  'faq: Enter toggles focused question',
);
await page.click('.faq-topics__item', { hasText: 'Оплата' });
await page.waitForFunction(
  () => document.querySelectorAll('.faq-accordion__question').length === 3,
);
faq = await faqState();
check(
  faq.pressed.join() === 'Оплата' &&
    faq.triggers.map((t) => t.text).join('|') ===
      'Какие способы оплаты доступны?|Можно ли оплатить заказ при получении?|Спишутся ли деньги при оформлении?',
  `faq: payment category ${faq.triggers.map((t) => t.text)}`,
);
check(faq.triggers[0].expanded === 'true', 'faq: filter opens first visible answer');
const paymentAnswer = await page.evaluate(
  () => document.querySelector('.faq-accordion__content').innerText,
);
check(
  paymentAnswer.includes('банковской картой онлайн, сбп, при получении картой, наличными'),
  `faq: payment answer uses canonical options`,
);
await page.click('.faq-topics__item', { hasText: 'Все вопросы' });
await page.evaluate(() => {
  const input = document.querySelector('.faq-page__search input');
  const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;
  setter.call(input, 'НАЛИЧНЫМИ');
  input.dispatchEvent(new Event('input', { bubbles: true }));
});
await page.waitForFunction(() =>
  document.querySelector('.faq-results__count').textContent.startsWith('Найдено'),
);
faq = await faqState();
check(
  faq.triggers.some((t) => t.text === 'Можно ли оплатить заказ при получении?') &&
    faq.triggers.length < 18,
  `faq: search filters (${faq.triggers.length})`,
);
await page.evaluate(() => {
  const input = document.querySelector('.faq-page__search input');
  const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;
  setter.call(input, 'подтвержденный');
  input.dispatchEvent(new Event('input', { bubbles: true }));
});
await page.waitForFunction(
  () => document.querySelectorAll('.faq-accordion__question').length === 1,
);
faq = await faqState();
check(
  faq.triggers[0]?.text === 'Можно ли изменить или отменить заказ?',
  `faq: ё/е-normalised search ${faq.triggers.map((t) => t.text)}`,
);
await page.evaluate(() => {
  const input = document.querySelector('.faq-page__search input');
  const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;
  setter.call(input, 'телепортация');
  input.dispatchEvent(new Event('input', { bubbles: true }));
});
await page.waitForSelector('.faq-empty');
faq = await faqState();
check(faq.empty && faq.triggers.length === 0, 'faq: empty search state');
check(faq.count === 'Найдено: 0 вопросов', `faq: empty count "${faq.count}"`);
await page.click('.faq-empty__action');
await page.waitForFunction(
  () => document.querySelectorAll('.faq-accordion__question').length === 18,
);
faq = await faqState();
check(
  !faq.empty && faq.pressed.join() === 'Все вопросы' && faq.triggers[0].expanded === 'true',
  'faq: reset restores all questions',
);

await open(page, '/delivery');
await page.focus('.site-footer__group-link[href="#/faq"]');
await page.keyboard.press('Enter');
await page.waitForFunction(() => location.hash === '#/faq');
await page.waitForSelector('main h1');
check(
  (await page.textContent('main h1')) === 'Часто задаваемые вопросы',
  'shell: keyboard footer link opens FAQ',
);
await page.click('.site-footer__group-link', { hasText: 'Гарантия и возврат' });
await page.waitForFunction(() => location.hash === '#/warranty');
check((await page.evaluate(() => window.scrollY)) === 0, 'shell: footer navigation resets scroll');

for (const path of ['/delivery/extra', '/faq-old', '/help']) {
  await page.goto(`${BASE}#${path}`);
  await page.waitForSelector('main h1');
  check(
    (await page.textContent('main h1')).trim() === 'Страница не найдена',
    `404: ${path} unaffected`,
  );
}
await page.close();

const responsive = {};
for (const width of [1440, 390, 320]) {
  const shot = await newPage(width, width === 1440 ? 900 : 844);
  for (const route of ROUTES) {
    await open(shot, route.path);
    await shot.waitForTimeout(150);
    const metrics = await shot.evaluate(() => {
      const main = document.querySelector('main');
      const small = [...main.querySelectorAll('button, a, input')]
        .filter((el) => el.getClientRects().length > 0)
        .filter((el) => {
          const rect = el.getBoundingClientRect();
          return (
            el.matches(
              '[role="tab"], .info-jump__item, .faq-topics__item, .faq-accordion__question, .ui-button',
            ) && rect.height < 44
          );
        })
        .map((el) => el.textContent.trim().slice(0, 30));
      const clipped = [...main.querySelectorAll('h1, h2, h3, p, li, span')].filter((el) => {
        const rect = el.getBoundingClientRect();
        return (
          rect.width > 0 &&
          rect.right > document.documentElement.clientWidth + 1 &&
          !el.closest('.info-tabs, .faq-topics__list')
        );
      }).length;
      return {
        overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
        small,
        clipped,
      };
    });
    const key = `${route.short}@${width}`;
    responsive[key] = metrics;
    check(metrics.overflow <= 0, `${key}: horizontal overflow ${metrics.overflow}`);
    check(metrics.small.length === 0, `${key}: small touch targets ${metrics.small}`);
    check(metrics.clipped === 0, `${key}: clipped content ${metrics.clipped}`);
  }
  for (const filter of ['topic', 'search']) {
    await open(shot, '/faq');
    if (filter === 'topic') {
      await shot.click('.faq-topics__item', { hasText: 'Возврат и гарантия' });
      await shot.waitForFunction(
        () => document.querySelectorAll('.faq-accordion__question').length === 3,
      );
    } else {
      await shot.evaluate(() => {
        const input = document.querySelector('.faq-page__search input');
        const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;
        setter.call(input, 'дост');
        input.dispatchEvent(new Event('input', { bubbles: true }));
      });
      await shot.waitForFunction(() =>
        document.querySelector('.faq-results__count').textContent.startsWith('Найдено'),
      );
    }
    const layout = await shot.evaluate(() => {
      const box = (selector) => document.querySelector(selector).getBoundingClientRect();
      const workspace = box('.faq-workspace');
      const topics = box('.faq-topics');
      const results = box('.faq-results');
      const support = box('.faq-workspace__support');
      const highlights = box('.info-highlights');
      return {
        supportGap: Math.round(support.top - results.bottom),
        trailing: Math.round(highlights.top - workspace.bottom),
        excess: Math.round(
          workspace.height - Math.max(topics.height, support.bottom - results.top),
        ),
        desktop: innerWidth >= 1024,
      };
    });
    const key = `faq ${filter}@${width}`;
    check(layout.supportGap <= 32, `${key}: support follows results (${layout.supportGap})`);
    check(layout.trailing <= 64, `${key}: no blank before trust strip (${layout.trailing})`);
    check(
      !layout.desktop || layout.excess <= 1,
      `${key}: content-driven workspace height (${layout.excess})`,
    );
  }
  await shot.close();
}

await browser.close();
console.log(JSON.stringify({ responsive }, null, 1));
reportCounts(passed, failures);
