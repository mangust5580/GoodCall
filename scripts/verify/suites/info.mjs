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
        ['О нас', '#/about'],
        ['Контакты', '#/contacts'],
        ['Поддержка', '#/contacts'],
      ]),
    `${tag}: footer help links ${JSON.stringify(facts.footer)}`,
  );
  check(
    facts.footerPlain.includes('Бонусная программа') &&
      facts.footerPlain.includes('Сервисные центры') &&
      facts.footerPlain.includes('Карьера'),
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
  const supportContacts = await page.evaluate(() => ({
    values: [...document.querySelectorAll('main .info-support__contact-value')].map((node) => ({
      tag: node.tagName,
      type: node.getAttribute('type'),
      popup: node.getAttribute('aria-haspopup'),
      href: node.getAttribute('href'),
      text: node.textContent.trim(),
    })),
    tel: document.querySelectorAll('main [href^="tel:"]').length,
    mailto: document.querySelectorAll('main [href^="mailto:"]').length,
  }));
  check(
    JSON.stringify(supportContacts.values) ===
      JSON.stringify(
        [SUPPORT_PHONE, 'support@goodcall.example'].map((text) => ({
          tag: 'BUTTON',
          type: 'button',
          popup: 'dialog',
          href: null,
          text,
        })),
      ) &&
      supportContacts.tel === 0 &&
      supportContacts.mailto === 0,
    `${tag}: support phone and e-mail are demo dialog buttons (no tel:/mailto: target) ${JSON.stringify(supportContacts)}`,
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

const NEWSLETTER_STATUS = 'Подписка пока не подключена: адрес никуда не отправлен и не сохранён.';
const NEWSLETTER_FALSE_CLAIMS =
  /вы подписаны|подписка оформлена|подписка подтверждена|проверьте почту|письмо отправлено|спасибо за подписку/i;

const newsletterFacts = (target) =>
  target.evaluate(() => {
    const band = document.querySelector('.newsletter-band');
    const statuses = band.querySelectorAll('[role="status"]');
    const status = statuses[0];
    const art = band.querySelector('.newsletter-band__art');
    const input = band.querySelector('input[type="email"]');
    const button = band.querySelector('button[type="submit"]');
    const rect = (el) => {
      const r = el.getBoundingClientRect();
      return { x: r.x, y: r.y + scrollY, w: r.width, h: r.height };
    };
    const s = status.getBoundingClientRect();
    const a = art.getBoundingClientRect();
    const artVisible = getComputedStyle(art).display !== 'none';
    const storage = (store) =>
      JSON.stringify(
        Object.fromEntries(Object.keys(store).map((key) => [key, store.getItem(key)])),
      );
    return {
      statusCount: statuses.length,
      atomic: status.getAttribute('aria-atomic'),
      text: status.textContent,
      hidden: status.classList.contains('ui-visually-hidden'),
      clipped:
        status.scrollWidth > status.clientWidth + 1 ||
        status.scrollHeight > status.clientHeight + 1,
      status: rect(status),
      content: rect(band.querySelector('.newsletter-band__content')),
      input: rect(input),
      button: rect(button),
      value: input.value,
      buttonText: button.textContent.trim(),
      disabled: button.disabled,
      busy: band.querySelector('[aria-busy], [aria-disabled="true"], .ui-spinner') !== null,
      artVisible,
      overlap:
        artVisible &&
        !(s.right <= a.left || s.left >= a.right || s.bottom <= a.top || s.top >= a.bottom),
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      formDirection: getComputedStyle(band.querySelector('.newsletter-band__form')).flexDirection,
      bandText: band.innerText,
      url: location.href,
      storage: `${storage(localStorage)}|${storage(sessionStorage)}`,
      focusInStatus: status.contains(document.activeElement),
    };
  });
const fillNewsletter = (target, value) =>
  target.evaluate((next) => {
    const input = document.querySelector('.newsletter-band input[type="email"]');
    Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set.call(input, next);
    input.dispatchEvent(new Event('input', { bubbles: true }));
  }, value);
const submitNewsletter = async (target) => {
  const valid = await target.evaluate(() => {
    const form = document.querySelector('.newsletter-band__form');
    const ok = form.checkValidity();
    form.requestSubmit();
    return ok;
  });
  await target.waitForTimeout(150);
  return valid;
};
const sameRect = (left, right) =>
  ['x', 'y', 'w', 'h'].every((key) => Math.abs(left[key] - right[key]) <= 0.5);
const idleNewsletter = (facts) =>
  facts.statusCount === 1 && facts.atomic === 'true' && facts.text === '' && facts.hidden;
const shownNewsletter = (facts) =>
  facts.statusCount === 1 &&
  facts.atomic === 'true' &&
  facts.text === NEWSLETTER_STATUS &&
  !facts.hidden &&
  !NEWSLETTER_FALSE_CLAIMS.test(facts.bandText);

for (const [width, height] of [
  [1440, 900],
  [390, 844],
]) {
  const nl = await newPage(width, height);
  for (const path of ['/', '/delivery']) {
    const tag = `newsletter ${path}@${width}`;
    await nl.goto(`${BASE}#${path}`);
    await nl.waitForSelector('.newsletter-band');
    await nl.waitForTimeout(300);
    const idle = await newsletterFacts(nl);
    check(idleNewsletter(idle), `${tag}: one empty, visually hidden role=status aria-atomic node`);

    await fillNewsletter(nl, '');
    const emptyValid = await submitNewsletter(nl);
    const afterEmpty = await newsletterFacts(nl);
    await fillNewsletter(nl, 'abc');
    const invalidValid = await submitNewsletter(nl);
    const afterInvalid = await newsletterFacts(nl);
    check(
      !emptyValid && !invalidValid && idleNewsletter(afterEmpty) && idleNewsletter(afterInvalid),
      `${tag}: empty and malformed input are blocked natively with no status`,
    );
    check(
      sameRect(afterInvalid.content, idle.content),
      `${tag}: idle band geometry unchanged by blocked submits`,
    );

    await fillNewsletter(nl, 'user@example.com');
    const beforeSubmit = await newsletterFacts(nl);
    const valid = await submitNewsletter(nl);
    const shown = await newsletterFacts(nl);
    check(valid && shownNewsletter(shown), `${tag}: valid submit shows the exact truthful status`);
    check(
      shown.value === 'user@example.com' &&
        shown.buttonText === 'Подписаться' &&
        !shown.disabled &&
        !shown.busy &&
        !shown.focusInStatus,
      `${tag}: field kept, button unchanged and enabled, no busy state, no focus move`,
    );
    check(
      shown.url === beforeSubmit.url && shown.storage === beforeSubmit.storage,
      `${tag}: no navigation and no storage write on submit`,
    );
    check(
      sameRect(shown.input, idle.input) && sameRect(shown.button, idle.button),
      `${tag}: input and button rects unchanged by the status`,
    );
    check(
      Math.abs(shown.content.w - idle.content.w) <= 0.5 &&
        Math.abs(shown.content.x - idle.content.x) <= 0.5 &&
        shown.content.h > idle.content.h &&
        shown.content.h - idle.content.h <= shown.status.h + 21,
      `${tag}: band grows only vertically by the status line (${idle.content.h}→${shown.content.h})`,
    );
    check(
      shown.overflow <= 0 && !shown.clipped && !shown.overlap,
      `${tag}: no overflow, clipping or gift overlap (${JSON.stringify(shown.status)})`,
    );
    if (width === 390) {
      check(
        shown.formDirection === 'column' &&
          !shown.artVisible &&
          Math.abs(shown.input.w - shown.button.w) <= 0.5 &&
          shown.button.y > shown.input.y,
        `${tag}: form stays stacked full width and the gift stays hidden`,
      );
    }

    await submitNewsletter(nl);
    const repeated = await newsletterFacts(nl);
    check(
      shownNewsletter(repeated) &&
        repeated.value === 'user@example.com' &&
        !repeated.disabled &&
        sameRect(repeated.content, shown.content),
      `${tag}: repeated submit keeps one unchanged status`,
    );

    await fillNewsletter(nl, 'user2@example.com');
    const edited = await newsletterFacts(nl);
    await submitNewsletter(nl);
    const resubmitted = await newsletterFacts(nl);
    check(
      idleNewsletter(edited) && shownNewsletter(resubmitted),
      `${tag}: editing hides the status and the next valid submit shows it again`,
    );
  }

  await nl.evaluate(() => {
    location.hash = '#/';
  });
  await nl.waitForTimeout(500);
  check(
    idleNewsletter(await newsletterFacts(nl)),
    `newsletter@${width}: status resets after navigating to another route`,
  );
  await nl.close();
}

const reference = await newPage();
await reference.goto(`${BASE}?reference=newsletter`);
await reference.waitForSelector('.newsletter-band');
await fillNewsletter(reference, '  user@example.com  ');
await submitNewsletter(reference);
const referenceFacts = await newsletterFacts(reference);
const referenceProof = await reference.evaluate(
  () => document.querySelector('.newsletter-reference__status').textContent,
);
check(
  referenceProof === 'Отправлено: user@example.com',
  `newsletter reference: onSubscribe receives the trimmed email (${referenceProof})`,
);
check(
  idleNewsletter(referenceFacts) && !referenceFacts.bandText.includes(NEWSLETTER_STATUS),
  'newsletter reference: built-in demo status stays hidden when onSubscribe is supplied',
);
await reference.close();

const LAZY_TITLES = [
  ['/delivery', 'Доставка и оплата'],
  ['/warranty', 'Гарантия и возврат'],
  ['/faq', 'Часто задаваемые вопросы'],
  ['/contacts', 'Контакты'],
  ['/about', 'О нас'],
  ['/privacy', 'Политика конфиденциальности'],
  ['/terms', 'Пользовательское соглашение'],
  ['/offer', 'Публичная оферта'],
];
const INFO_CHUNK = /\/assets\/InfoRoutes-[\w-]+\.js$/;
const FAILURE_TITLE = 'Страница временно недоступна';
const isInfoChunk = (request) => INFO_CHUNK.test(new URL(request.url).pathname);
const infoReady = () =>
  document.querySelector('main h1') !== null &&
  document.querySelector('main.route-status') === null;
const shellFacts = () => ({
  shells: document.querySelectorAll('.production-shell').length,
  mains: document.querySelectorAll('main').length,
  headers: document.querySelectorAll('header.site-header').length,
  footers: document.querySelectorAll('footer.site-footer').length,
  h1: [...document.querySelectorAll('h1')].map((h) => h.textContent.trim()),
  title: document.title,
  scrollY: Math.round(scrollY),
});
const singleShell = (facts) =>
  facts.shells === 1 && facts.mains === 1 && facts.headers === 1 && facts.footers === 1;
const infoChunkLoaded = () =>
  performance.getEntriesByType('resource').some((entry) => /\/InfoRoutes-/.test(entry.name));
const lazyShiftFacts = () =>
  new Promise((resolve) => {
    const entries = [];
    const observer = new PerformanceObserver((list) => entries.push(...list.getEntries()));
    observer.observe({ type: 'layout-shift', buffered: true });
    setTimeout(() => {
      observer.disconnect();
      const kept = entries.filter((entry) => !entry.hadRecentInput);
      resolve({
        total: Number(kept.reduce((sum, entry) => sum + entry.value, 0).toFixed(4)),
        shell: kept.filter((entry) =>
          entry.sources.some((source) => source.node?.closest?.('.newsletter-band, .site-footer')),
        ).length,
      });
    }, 300);
  });

function chunkPage(width, height, chunkReply) {
  return openPage(browser, {
    width,
    height,
    interceptPatterns: [`*${MOCK_SUPABASE_HOST}*`, '*InfoRoutes-*'],
    respond: (request) => (isInfoChunk(request) ? chunkReply() : { status: 200, body: '[]' }),
    onPageError: (message) => failures.push(`pageerror ${message}`),
  });
}

const direct = await newPage();
for (const [path, title] of LAZY_TITLES) {
  const tag = `lazy ${path}`;
  await direct.goto('about:blank');
  await direct.goto(`${BASE}#${path}`);
  await direct.waitForFunction(infoReady);
  const opened = await direct.evaluate(shellFacts);
  check(
    singleShell(opened) && opened.h1.length === 1 && opened.title === `${title} — GoodCall`,
    `${tag}: direct entry renders one shell, one h1 and the page title ${JSON.stringify(opened)}`,
  );
  await direct.reload();
  await direct.waitForFunction(infoReady);
  const reloaded = await direct.evaluate(shellFacts);
  check(
    singleShell(reloaded) &&
      reloaded.h1[0] === opened.h1[0] &&
      reloaded.title === `${title} — GoodCall`,
    `${tag}: reload keeps the page and title ${JSON.stringify(reloaded)}`,
  );
}
await direct.close();

const lazyNav = await newPage();
await lazyNav.goto(`${BASE}#/`);
await lazyNav.waitForSelector('.site-footer');
check(!(await lazyNav.evaluate(infoChunkLoaded)), 'lazy: Home does not load the Info chunk');
await lazyNav.click('.site-footer a[href="#/delivery"]');
await lazyNav.waitForFunction(() => location.hash === '#/delivery');
await lazyNav.waitForFunction(infoReady);
const navigated = await lazyNav.evaluate(shellFacts);
check(
  singleShell(navigated) &&
    navigated.title === 'Доставка и оплата — GoodCall' &&
    navigated.scrollY === 0 &&
    (await lazyNav.evaluate(infoChunkLoaded)),
  `lazy: Footer → Delivery loads the chunk, resets scroll and sets the title ${JSON.stringify(navigated)}`,
);
await lazyNav.click('.site-footer a[href="#/faq"]');
await lazyNav.waitForFunction(
  () => location.hash === '#/faq' && document.title === 'Часто задаваемые вопросы — GoodCall',
);
await lazyNav.waitForFunction(infoReady);
check(
  (await lazyNav.evaluate(() => scrollY)) === 0 && singleShell(await lazyNav.evaluate(shellFacts)),
  'lazy: Info → Info navigation keeps one shell and resets scroll',
);
await lazyNav.evaluate(() => history.back());
await lazyNav.waitForFunction(
  () => location.hash === '#/delivery' && document.title === 'Доставка и оплата — GoodCall',
);
await lazyNav.waitForFunction(infoReady);
await lazyNav.evaluate(() => history.back());
await lazyNav.waitForFunction(
  () => location.hash === '#/' && document.title === 'Главная — GoodCall',
);
await lazyNav.evaluate(() => history.forward());
await lazyNav.waitForFunction(
  () => location.hash === '#/delivery' && document.title === 'Доставка и оплата — GoodCall',
);
await lazyNav.waitForFunction(infoReady);
check(
  singleShell(await lazyNav.evaluate(shellFacts)),
  'lazy: Back/Forward across Home and Info restores pages and titles',
);
await lazyNav.close();

for (const [width, height] of [
  [1440, 900],
  [390, 844],
]) {
  const tag = `lazy loading@${width}`;
  let release;
  const gate = new Promise((resolve) => {
    release = resolve;
  });
  const slow = await chunkPage(width, height, () => gate.then(() => ({ continue: true })));
  await slow.goto(`${BASE}#/delivery`);
  await slow.waitForFunction(() =>
    document.querySelector('main.route-status[aria-busy="true"] [role="status"]'),
  );
  const loading = await slow.evaluate(() => ({
    message: document.querySelector('main.route-status [role="status"]').textContent,
    newsletterBelowFold:
      document.querySelector('.newsletter-band').getBoundingClientRect().top >= innerHeight,
  }));
  const loadingShell = await slow.evaluate(shellFacts);
  check(
    loading.message === 'Загружаем страницу…' &&
      loading.newsletterBelowFold &&
      singleShell(loadingShell) &&
      loadingShell.h1.length === 0,
    `${tag}: fallback shows one shell, the loading status and keeps Newsletter below the fold ${JSON.stringify({ ...loading, ...loadingShell })}`,
  );
  release();
  await slow.waitForFunction(infoReady);
  const shifts = await slow.evaluate(lazyShiftFacts);
  check(
    shifts.shell === 0 && shifts.total < 0.1,
    `${tag}: fallback → ready causes no Newsletter/Footer shift ${JSON.stringify(shifts)}`,
  );
  check(
    singleShell(await slow.evaluate(shellFacts)),
    `${tag}: ready page replaces the fallback without a second shell`,
  );
  await slow.close();
}

let chunkBlocked = true;
let chunkRequests = 0;
const failing = await chunkPage(1440, 900, () => {
  chunkRequests += 1;
  return chunkBlocked ? { status: 404, body: '' } : { continue: true };
});
await failing.goto(`${BASE}#/delivery`);
await failing.waitForFunction(() => document.querySelector('main.route-status h1'));
const failed = await failing.evaluate(() => {
  const status = document.querySelector('main.route-status');
  const button = status.querySelector('button');
  const link = status.querySelector('a');
  return {
    title: status.querySelector('h1').textContent,
    message: status.querySelector('.route-status__message').textContent,
    busy: status.getAttribute('aria-busy'),
    button: button && { text: button.textContent, type: button.type },
    link: link && { text: link.textContent, href: link.getAttribute('href') },
  };
});
const failedShell = await failing.evaluate(shellFacts);
check(
  failed.title === FAILURE_TITLE &&
    failed.busy === null &&
    failed.button?.text === 'Обновить страницу' &&
    failed.button.type === 'button' &&
    failed.link?.text === 'На главную' &&
    failed.link.href === '#/' &&
    !/error|chunk|import|stack|undefined/i.test(failed.message) &&
    singleShell(failedShell) &&
    failedShell.title === `${FAILURE_TITLE} — GoodCall`,
  `lazy failure: blocked chunk shows the shell and the failure status ${JSON.stringify({ ...failed, ...failedShell })}`,
);
await failing.focus('main.route-status button');
await failing.keyboard.press('Tab');
check(
  await failing.evaluate(
    () =>
      document.activeElement?.textContent === 'На главную' &&
      document.activeElement.tagName === 'A',
  ),
  'lazy failure: actions are focusable in order (Обновить страницу → На главную)',
);
await failing.evaluate(() => {
  window.goodcallNoReloadMarker = true;
});
const requestsAtFailure = chunkRequests;
await failing.waitForTimeout(2000);
check(
  (await failing.evaluate(() => window.goodcallNoReloadMarker === true)) &&
    chunkRequests === requestsAtFailure &&
    (await failing.evaluate(() => document.querySelector('main.route-status h1')?.textContent)) ===
      FAILURE_TITLE,
  `lazy failure: no automatic reload or retry (chunk requests ${chunkRequests})`,
);
await failing.click('main.route-status a', { hasText: 'На главную' });
await failing.waitForFunction(
  () => location.hash === '#/' && document.title === 'Главная — GoodCall',
);
check(
  (await failing.evaluate(() =>
    document.body.innerText.includes('Страница временно недоступна'),
  )) === false,
  'lazy failure: «На главную» leaves no failure UI behind',
);
chunkBlocked = false;
await failing.evaluate(() => {
  location.hash = '#/delivery';
});
await failing.waitForFunction(() => document.querySelector('main.route-status h1'));
await failing.click('main.route-status button', { hasText: 'Обновить страницу' });
await failing.waitForFunction(() => window.goodcallNoReloadMarker === undefined);
await failing.waitForFunction(infoReady);
const recovered = await failing.evaluate(shellFacts);
check(
  singleShell(recovered) &&
    recovered.title === 'Доставка и оплата — GoodCall' &&
    recovered.h1.length === 1,
  `lazy failure: «Обновить страницу» reloads and recovers once the chunk is available ${JSON.stringify(recovered)}`,
);
await failing.close();

const contactCopy = await newPage();
const routeText = async (path) => {
  await open(contactCopy, path);
  await contactCopy.waitForFunction(() => document.querySelector('main.route-status') === null);
  return contactCopy.evaluate(() => document.querySelector('main').textContent);
};
await routeText('/faq');
await contactCopy.click('.faq-accordion__question', { hasText: 'Как вернуть или обменять товар?' });
await contactCopy.waitForFunction(() =>
  document.querySelector('main').textContent.includes('В демо-версии телефон и e-mail'),
);
const faqText = await contactCopy.evaluate(() => document.querySelector('main').textContent);
check(
  faqText.includes(
    'Возврат и обмен проводятся по Закону РФ «О защите прав потребителей». Условия зависят от категории товара и от того, есть ли в нём недостаток.',
  ) &&
    faqText.includes(
      'В демо-версии телефон и e-mail поддержки не подключены — обращения не принимаются.',
    ) &&
    !faqText.includes('начните с обращения в поддержку') &&
    !faqText.includes('Телефон поддержки:'),
  'faq: return answer carries the demo contact statement',
);
const warrantyText = await routeText('/warranty');
check(
  warrantyText.includes(
    'GoodCall — демонстрационный магазин: заказы не выполняются, поэтому возврат, обмен и гарантийные обращения не оформляются.',
  ) && !warrantyText.includes('позвоните в поддержку'),
  'warranty: single demo notice replaces the call-support instruction',
);
const aboutText = await routeText('/about');
check(
  aboutText.includes('Телефон и e-mail — демонстрационные, обращения не обрабатываются.') &&
    !aboutText.includes('Телефон и e-mail поддержки —'),
  'about: demo contact line',
);

const SUPPORT_INVITATION = /Свяжитесь с поддержкой|позвоните в поддержку|поддержка подскажет/;
const BROKEN_ITEM_ANSWER = [
  'Гарантийный ремонт обычно выполняют авторизованные сервисные центры производителя. Информацию о них можно уточнить по официальным каналам производителя.',
];
const supportBlock = () =>
  contactCopy.evaluate(() => ({
    text: document.querySelector('.info-support__text')?.textContent.trim() ?? null,
    notes: [...document.querySelectorAll('.info-support__contact-note')].map((note) =>
      note.textContent.trim(),
    ),
  }));
const DEMO_CONTACT_NOTES = [
  'Демо-номер, звонки не принимаются',
  'Демо-адрес, письма не обрабатываются',
];
const highlightNotes = () =>
  contactCopy.evaluate(() =>
    [...document.querySelectorAll('.info-highlights .benefits-strip__item')].map((item) => [
      item.querySelector('.benefits-strip__title').textContent.trim(),
      item.querySelector('.benefits-strip__note').textContent.trim(),
    ]),
  );
const TRUST_HIGHLIGHTS = [
  ['Официальная гарантия', 'Срок указан для конкретного товара'],
  ['Оригинальная продукция', 'Только официальные поставки'],
  ['Обмен и возврат', 'По условиям законодательства о защите прав потребителей'],
];
const SUPPORT_HIGHLIGHT = ['Поддержка', 'Ежедневно с 9:00 до 21:00'];

await routeText('/faq');
check(
  JSON.stringify(await highlightNotes()) ===
    JSON.stringify([...TRUST_HIGHLIGHTS, SUPPORT_HIGHLIGHT]),
  `faq: support highlight shows the storefront hours ${JSON.stringify(await highlightNotes())}`,
);
const faqSupport = await supportBlock();
check(
  faqSupport.text === 'Ответы о заказах, доставке и гарантии собраны в справочных разделах.' &&
    JSON.stringify(faqSupport.notes) === JSON.stringify(DEMO_CONTACT_NOTES),
  `faq: natural support intro, demo notes stay at the contacts ${JSON.stringify(faqSupport)}`,
);
await contactCopy.click('.faq-accordion__question', {
  hasText: 'Что делать, если товар неисправен?',
});
await contactCopy.waitForFunction(() =>
  [...document.querySelectorAll('.faq-accordion__content')].some(
    (region) =>
      !region.hidden && region.textContent.includes('по официальным каналам производителя'),
  ),
);
const brokenItem = await contactCopy.evaluate(() => {
  const region = [...document.querySelectorAll('.faq-accordion__content')].find((r) => !r.hidden);
  return {
    question: document.getElementById(region.getAttribute('aria-labelledby')).textContent.trim(),
    paragraphs: [...region.querySelectorAll('.faq-answer__text')].map((p) => p.textContent.trim()),
  };
});
check(
  brokenItem.question === 'Что делать, если товар неисправен?' &&
    JSON.stringify(brokenItem.paragraphs) === JSON.stringify(BROKEN_ITEM_ANSWER) &&
    !brokenItem.paragraphs.some((p) => SUPPORT_INVITATION.test(p) || p.includes('В демо-версии')),
  `faq: broken-item natural answer ${JSON.stringify(brokenItem)}`,
);
const searchFaq = (value) =>
  contactCopy.evaluate((next) => {
    const input = document.querySelector('.faq-page__search input');
    const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;
    setter.call(input, next);
    input.dispatchEvent(new Event('input', { bubbles: true }));
  }, value);
await searchFaq('неисправен');
await contactCopy.waitForFunction(
  () => document.querySelectorAll('.faq-accordion__question').length === 1,
);
check(
  (await contactCopy.textContent('.faq-accordion__question')).trim() ===
    'Что делать, если товар неисправен?',
  'faq: search reaches broken-item',
);
await searchFaq('телепортация');
await contactCopy.waitForSelector('.faq-empty');
const emptyState = await contactCopy.evaluate(() => ({
  text: document.querySelector('.faq-empty__text').textContent.replace(/\s+/g, ' ').trim(),
  reset: document.querySelector('.faq-empty__action')?.textContent.trim() ?? null,
}));
check(
  emptyState.text ===
    'Попробуйте изменить запрос или выбрать другую тему. Ответы о доставке, оплате и гарантии есть на страницах «Доставка и оплата» и «Гарантия и возврат».' &&
    !SUPPORT_INVITATION.test(emptyState.text) &&
    !/напишите/.test(emptyState.text) &&
    emptyState.reset === 'Сбросить поиск',
  `faq: empty search state without support invitation ${JSON.stringify(emptyState)}`,
);

const warrantyCopy = (await routeText('/warranty')).replace(/\s+/g, ' ');
check(
  JSON.stringify(await highlightNotes()) ===
    JSON.stringify([...TRUST_HIGHLIGHTS, SUPPORT_HIGHLIGHT]),
  `warranty: support highlight shows the storefront hours ${JSON.stringify(await highlightNotes())}`,
);
const warrantySupport = await supportBlock();
check(
  warrantySupport.text ===
    'Ответы на частые вопросы и условия доставки собраны в справочных разделах.' &&
    JSON.stringify(warrantySupport.notes) === JSON.stringify(DEMO_CONTACT_NOTES),
  `warranty: natural support intro, demo notes stay at the contacts ${JSON.stringify(warrantySupport)}`,
);
const warrantyNotices = await contactCopy.evaluate(() => ({
  considerations: [...document.querySelectorAll('.warranty-block__note')].map((note) =>
    note.textContent.trim(),
  ),
  notices: [...document.querySelectorAll('main .info-notice__text')].map((notice) =>
    notice.textContent.replace(/s+/g, ' ').trim(),
  ),
}));
check(
  JSON.stringify(warrantyNotices.considerations) ===
    JSON.stringify([
      'Для товара надлежащего качества законом предусмотрены ограничения — для части категорий техники возврат и обмен недоступны',
      'Если в товаре есть недостаток, решение принимается после проверки качества',
    ]),
  `warranty: two return considerations ${JSON.stringify(warrantyNotices.considerations)}`,
);
check(
  warrantyNotices.notices.length === 3 &&
    warrantyNotices.notices.filter((notice) => /демонстрационн|демо-/i.test(notice)).length === 1,
  `warranty: one contextual demo notice among three ${JSON.stringify(warrantyNotices.notices)}`,
);
const warrantyDemoCopy = [
  'Как обычно устроены возврат, обмен, гарантия и обращение в сервис.',
  'GoodCall — демонстрационный магазин: заказы не выполняются, поэтому возврат, обмен и гарантийные обращения не оформляются.',
  'Обратитесь к продавцу по телефону или почте',
  'Продавец уточнит условия для категории товара',
  'Производитель товара. Точные условия — в его гарантийных документах.',
  'Частые вопросы',
  'Ответы о гарантии и возврате — в разделе FAQ',
  'Проверьте срок и условия гарантии в документах',
  'Найдите авторизованный сервис производителя',
  'GoodCall не управляет собственными сервисными центрами: контакты авторизованного сервиса можно уточнить по официальным каналам производителя. Срок ремонта зависит от сложности и наличия запчастей.',
];
check(
  warrantyDemoCopy.every((text) => warrantyCopy.includes(text)),
  `warranty: illustrative demo copy ${JSON.stringify(warrantyDemoCopy.filter((text) => !warrantyCopy.includes(text)))}`,
);
check(
  !SUPPORT_INVITATION.test(warrantyCopy) &&
    !/Поддержка уточнит|Поддержка GoodCall|продаёт технику|Получите контакты сервиса/.test(
      warrantyCopy,
    ),
  'warranty: no live-support or sales claims',
);
check(
  !/В демо-версии GoodCall эти услуги не оказываются|товары не продаются|поддержка в демо-версии не работает|Демо-заказы не выполняются|Телефон и e-mail показаны для демонстрации/.test(
    warrantyCopy,
  ),
  'warranty: redundant demo statements removed',
);

await routeText('/delivery');
check(
  JSON.stringify((await highlightNotes()).find(([title]) => title === 'Поддержка')) ===
    JSON.stringify(['Поддержка', 'Ежедневно с 9:00 до 21:00']),
  'delivery: support highlight unchanged',
);
await contactCopy.close();

await browser.close();
console.log(JSON.stringify({ responsive }, null, 1));
reportCounts(passed, failures);
