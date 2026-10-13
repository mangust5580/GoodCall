import { MOCK_SUPABASE_HOST } from '../lib/build.mjs';
import { launchBrowser } from '../lib/browser.mjs';
import { openPage } from '../lib/page.mjs';
import { appBase, reportCounts } from '../lib/suite.mjs';

const BASE = appBase();
const CART = 'goodcall.cart.v1';
const PHONE = '8 800 100-10-10';
const EMAIL = 'support@goodcall.example';
const HOURS = 'Ежедневно с 9:00 до 21:00';

let passed = 0;
const failures = [];
function check(condition, message) {
  if (condition) passed += 1;
  else failures.push(message);
}

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

const page = await newPage();

const SHOPS_DISCLOSURE =
  'Это демонстрационный список вымышленных магазинов GoodCall для сценария самовывоза. У GoodCall нет действующих магазинов по указанным адресам: посетить их или получить реальный заказ нельзя. Адреса и часы работы используются только как примеры.';
const CONTACTS_STORES_DISCLOSURE =
  'Здесь показаны вымышленные магазины GoodCall для демонстрации самовывоза при оформлении заказа. Реально посетить эти магазины или получить в них заказ нельзя. Адреса и часы работы приведены для примера.';
const VISIT_INVITATION = /приходите|вживую|протестировать технику/i;
const STORE_IDS = [
  'moscow-aviapark',
  'moscow-evropeisky',
  'moscow-metropolis',
  'moscow-rio-dmitrovka',
  'moscow-columbus',
  'moscow-megapolis',
];

function storeVisuals(cardSelector, visualSelector) {
  return page.evaluate(
    ([cards, visual]) =>
      [...document.querySelectorAll(cards)].map((card) => {
        const slot = card.querySelector(visual);
        const image = slot?.querySelector('img');
        return {
          id: card.querySelector('[id]')?.id ?? '',
          src: image?.getAttribute('src') ?? null,
          alt: image?.getAttribute('alt') ?? null,
          loading: image?.getAttribute('loading') ?? null,
          width: image?.getAttribute('width') ?? null,
          height: image?.getAttribute('height') ?? null,
          icon: slot?.querySelector('.ui-icon--store') !== null,
          slotWidth: Math.round(slot?.getBoundingClientRect().width ?? 0),
          slotHeight: Math.round(slot?.getBoundingClientRect().height ?? 0),
          imageBox: (() => {
            if (slot === null || image === null || image === undefined) return null;
            const outer = slot.getBoundingClientRect();
            const inner = image.getBoundingClientRect();
            return {
              left: Math.round(inner.left - outer.left),
              top: Math.round(inner.top - outer.top),
              width: Math.round(inner.width),
              height: Math.round(inner.height),
              fit: getComputedStyle(image).objectFit,
            };
          })(),
        };
      }),
    [cardSelector, visualSelector],
  );
}

function checkStoreVisuals(label, visuals, ids) {
  check(
    visuals.length === ids.length &&
      visuals.every(
        (visual, index) =>
          visual.id.includes(ids[index]) &&
          visual.src !== null &&
          visual.src.includes(`store-${ids[index]}`) &&
          visual.src.endsWith('.webp') &&
          !visual.icon,
      ),
    `${label}: thumbnails mapped to store IDs ${JSON.stringify(visuals.map((v) => [v.id, v.src]))}`,
  );
  check(
    new Set(visuals.map((visual) => visual.src)).size === visuals.length,
    `${label}: unique thumbnails`,
  );
  check(
    visuals.every(
      (visual) =>
        visual.alt === '' &&
        visual.loading === 'lazy' &&
        visual.width === '512' &&
        visual.height === '512',
    ),
    `${label}: decorative lazy thumbnails with intrinsic size`,
  );
  check(
    visuals.every((visual) => visual.slotWidth > 0 && visual.slotWidth === visual.slotHeight),
    `${label}: square thumbnail slots ${JSON.stringify(visuals.map((v) => [v.slotWidth, v.slotHeight]))}`,
  );
  check(
    visuals.every(
      (visual) =>
        visual.imageBox !== null &&
        visual.imageBox.left === 0 &&
        visual.imageBox.top === 0 &&
        visual.imageBox.width === visual.slotWidth &&
        visual.imageBox.height === visual.slotHeight &&
        visual.imageBox.fit === 'cover',
    ),
    `${label}: thumbnail image box fills its slot exactly, whole square source shown ${JSON.stringify(visuals.map((v) => [v.slotWidth, v.slotHeight, v.imageBox]))}`,
  );
}

async function checkThumbnailsLoad(label, sources) {
  const statuses = await page.evaluate(
    (urls) =>
      Promise.all(
        urls.map((url) =>
          fetch(url).then(
            (response) => `${response.status} ${response.headers.get('content-type')}`,
          ),
        ),
      ),
    sources,
  );
  check(
    statuses.every((status) => status.startsWith('200 image/webp')),
    `${label}: thumbnail assets served ${JSON.stringify(statuses)}`,
  );
  const decoded = await page.evaluate(
    (urls) =>
      Promise.all(
        urls.map(
          (url) =>
            new Promise((resolve) => {
              const image = new Image();
              image.onload = () => {
                resolve(`${String(image.naturalWidth)}x${String(image.naturalHeight)}`);
              };
              image.onerror = () => {
                resolve('error');
              };
              image.src = url;
            }),
        ),
      ),
    sources,
  );
  check(
    decoded.every((size) => size === '512x512'),
    `${label}: thumbnail assets decode as 512x512 squares ${JSON.stringify(decoded)}`,
  );
}

async function checkThumbnailFallback(label, cardSelector, visualSelector) {
  await page.evaluate(
    ([cards, visual]) => {
      document.querySelector(`${cards} ${visual} img`)?.dispatchEvent(new Event('error'));
    },
    [cardSelector, visualSelector],
  );
  await page.waitForFunction(
    ([cards, visual]) => document.querySelector(`${cards} ${visual} .ui-icon--store`) !== null,
    [cardSelector, visualSelector],
  );
  const after = await storeVisuals(cardSelector, visualSelector);
  check(
    after[0].icon &&
      after[0].src === null &&
      after.slice(1).every((visual) => visual.src !== null && !visual.icon),
    `${label}: failed thumbnail falls back to store icon ${JSON.stringify(after[0])}`,
  );
  check(
    after[0].slotWidth > 0 && after[0].slotWidth === after[0].slotHeight,
    `${label}: fallback keeps slot size`,
  );
}

await open(page, '/shops');
const shopNames = await page.evaluate(() =>
  [...document.querySelectorAll('.store-card__title')].map((el) => el.textContent.trim()),
);
check(shopNames.length === 6, `shops: demo store count ${shopNames.length}`);
const shopsCopy = await page.evaluate(() => ({
  lead: document.querySelector('.stores-page__lead')?.textContent.replace(/\s+/g, ' ').trim(),
  mainText: document.querySelector('main').innerText,
}));
check(shopsCopy.lead === SHOPS_DISCLOSURE, `shops: demo disclosure lead ${shopsCopy.lead}`);
check(!VISIT_INVITATION.test(shopsCopy.mainText), 'shops: no invitation to visit stores');
const shopVisuals = await storeVisuals('.store-card', '.store-card__visual');
checkStoreVisuals('shops', shopVisuals, STORE_IDS);
await checkThumbnailsLoad(
  'shops',
  shopVisuals.map((visual) => visual.src),
);
await checkThumbnailFallback('shops', '.store-card', '.store-card__visual');

await open(page, '/contacts');
const facts = await page.evaluate(() => {
  const main = document.querySelector('main');
  return {
    h1: [...document.querySelectorAll('h1')].map((h) => h.textContent.trim()),
    crumbs: [...document.querySelectorAll('nav[aria-label="Хлебные крошки"] li')].map((li) => [
      li.textContent.trim(),
      li.querySelector('a')?.getAttribute('href') ?? null,
      li.getAttribute('aria-current'),
    ]),
    sectionNavs: [...main.querySelectorAll('nav')].filter(
      (nav) => nav.getAttribute('aria-label') !== 'Хлебные крошки',
    ).length,
    channels: [...document.querySelectorAll('.contacts-channels__item')].map((li) => ({
      label: li.querySelector('.contacts-channels__label').textContent.trim(),
      value: li.querySelector('.contacts-channels__value').textContent.trim(),
      href: li.querySelector('a.contacts-channels__value')?.getAttribute('href') ?? null,
      note: li.querySelector('.contacts-channels__note')?.textContent.trim() ?? null,
    })),
    storesLead: main
      .querySelector('.contacts-stores__lead')
      ?.textContent.replace(/\s+/g, ' ')
      .trim(),
    stores: [...main.querySelectorAll('.contacts-store__title')].map((el) => el.textContent.trim()),
    storesCta: [...main.querySelectorAll('.contacts-stores a')].map((a) => [
      a.textContent.trim(),
      a.getAttribute('href'),
    ]),
    formControls: main.querySelectorAll('form, input, textarea, select, button').length,
    maps: main.querySelectorAll('iframe, canvas').length,
    mainText: main.innerText,
    bodyText: document.body.innerText,
  };
});
check(facts.h1.join() === 'Контакты', `contacts: single h1 ${facts.h1}`);
check(
  JSON.stringify(facts.crumbs) ===
    JSON.stringify([
      ['Главная', '#/', null],
      ['Контакты', null, 'page'],
    ]),
  `contacts: breadcrumbs ${JSON.stringify(facts.crumbs)}`,
);
check(
  facts.sectionNavs === 0 && !facts.mainText.includes('Информация'),
  `contacts: no section sidebar/navigation (${facts.sectionNavs})`,
);
const channel = (label) => facts.channels.find((c) => c.label === label);
check(
  channel('Телефон')?.value === PHONE && channel('Телефон')?.href === 'tel:+78001001010',
  'contacts: canonical phone link',
);
check(
  channel('E-mail')?.value === EMAIL && channel('E-mail')?.href === `mailto:${EMAIL}`,
  'contacts: canonical email link',
);
check(channel('Часы работы поддержки')?.value === HOURS, 'contacts: canonical support hours');
check(
  channel('Магазины')?.value === '6 магазинов GoodCall' && channel('Магазины')?.href === '#/shops',
  `contacts: store channel ${JSON.stringify(channel('Магазины'))}`,
);
check(
  channel('Магазины')?.note === 'Демо-точки самовывоза · Москва',
  `contacts: store channel demo note ${channel('Магазины')?.note}`,
);
check(
  facts.storesLead === CONTACTS_STORES_DISCLOSURE,
  `contacts: stores demo disclosure ${facts.storesLead}`,
);
check(!VISIT_INVITATION.test(facts.mainText), 'contacts: no invitation to visit stores');
const contactVisuals = await storeVisuals('.contacts-store', '.contacts-store__visual');
checkStoreVisuals('contacts', contactVisuals, STORE_IDS.slice(0, 3));
check(
  contactVisuals.every((visual, index) => visual.src === shopVisuals[index].src),
  'contacts: same thumbnail sources as #/shops',
);
await checkThumbnailFallback('contacts', '.contacts-store', '.contacts-store__visual');
check(facts.channels.length === 4, `contacts: four channels (${facts.channels.length})`);
check(
  JSON.stringify(facts.stores) === JSON.stringify(shopNames.slice(0, 3)),
  `contacts: stores from DEMO_STORES ${facts.stores}`,
);
check(
  facts.storesCta.some(([label, href]) => label === 'Все магазины' && href === '#/shops'),
  'contacts: CTA to #/shops',
);
check(facts.formControls === 0, `contacts: no form controls (${facts.formControls})`);
check(
  facts.maps === 0 && !/на карте|карта магазинов|яндекс|google maps/i.test(facts.mainText),
  `contacts: no map (${facts.maps})`,
);
check(
  !/офис|пресненск|тверская|башня|инн|огрн/i.test(facts.mainText),
  'contacts: no invented office address',
);
check(!/24\/7|круглосуточ/i.test(facts.bodyText), 'contacts: no 24/7 claim on page or shell');
check(
  !/vk\.com|t\.me|youtube|instagram|tiktok/i.test(
    await page.evaluate(() => [...document.querySelectorAll('a')].map((a) => a.href).join(' ')),
  ),
  'contacts: no social destinations',
);

await open(page, '/privacy');
const privacyText = await page.evaluate(() =>
  document.querySelector('main').innerText.replace(/\s+/g, ' '),
);
check(
  privacyText.includes(
    'Данные демо-аккаунта, если вы в него вошли: признак входа, а после сохранения профиля — имя, фамилия, e-mail, телефон, дата рождения и пол.',
  ),
  'privacy: demo-account profile disclosure',
);
check(
  privacyText.includes(
    'Адреса доставки, сохранённые в демо-аккаунте: получатель, контактный телефон, город, адрес и почтовый индекс, если он указан.',
  ),
  'privacy: demo address book disclosure',
);
check(
  privacyText.includes(
    'Демо-аккаунт — признак входа, данные профиля и сохранённые адреса — тоже хранится в localStorage этого браузера.',
  ),
  'privacy: demo account localStorage disclosure',
);
check(
  privacyText.includes(
    'Данные демо-профиля и сохранённые адреса удаляются при выходе из демо-аккаунта. Корзина, избранное, сравнение и выбранный город при этом не очищаются.',
  ),
  'privacy: sign-out retention wording',
);
check(
  !privacyText.includes('всё, что вы делаете в магазине, обрабатывается в вашем браузере'),
  'privacy: no blanket in-browser processing claim',
);

const legalUpdated = () =>
  page.evaluate(() => document.querySelector('.legal-document__updated')?.textContent.trim());
check(
  (await legalUpdated()) === 'Последнее обновление: 10 октября 2026 г.',
  'privacy: updated date 10 October 2026',
);
for (const [path, date] of [
  ['/terms', '13 октября 2026 г.'],
  ['/offer', '4 октября 2026 г.'],
]) {
  await open(page, path);
  const updated = await legalUpdated();
  check(updated === `Последнее обновление: ${date}`, `${path}: updated date ${date} (${updated})`);
}

await open(page, '/terms');
const termsText = await page.evaluate(() =>
  document.querySelector('main').innerText.replace(/\s+/g, ' '),
);
check(
  termsText.includes(
    'Сайт можно свободно просматривать без регистрации. Личный кабинет открывается после входа в демо-аккаунт — без пароля и без создания настоящей учётной записи. Корзина, избранное, сравнение и демо-аккаунт хранятся только в вашем браузере — подробнее в Политике конфиденциальности.',
  ),
  'terms: demo-account access wording',
);
check(
  !termsText.includes('все разделы доступны без учётной записи'),
  'terms: no "all sections without account" claim',
);

await open(page, '/contacts');
const shell = await page.evaluate(() => ({
  header: [...document.querySelectorAll('.site-header__support')].map((a) => [
    a.textContent.trim(),
    a.getAttribute('href'),
  ]),
  footer: [...document.querySelectorAll('.site-footer__group-link')].map((a) => [
    a.textContent.trim(),
    a.getAttribute('href'),
  ]),
}));
check(
  shell.header.length === 1 &&
    shell.header[0][0] === 'Поддержка' &&
    shell.header[0][1] === '#/contacts',
  `shell: header support ${JSON.stringify(shell.header)}`,
);
check(
  shell.footer.some(([l, h]) => l === 'Контакты' && h === '#/contacts') &&
    shell.footer.some(([l, h]) => l === 'Поддержка' && h === '#/contacts'),
  `shell: footer contacts/support ${JSON.stringify(shell.footer)}`,
);

await open(page, '/');
await page.click('.site-header__support');
await page.waitForFunction(() => location.hash === '#/contacts');
await page.waitForSelector('main h1');
check((await page.textContent('main h1')) === 'Контакты', 'shell: header support opens contacts');
await open(page, '/delivery');
await page.focus('.site-footer__group-link[href="#/contacts"]');
await page.keyboard.press('Enter');
await page.waitForFunction(() => location.hash === '#/contacts');
check(
  (await page.evaluate(() => window.scrollY)) === 0,
  'shell: footer contacts link opens contacts at top',
);

await page.goto(`${BASE}#/`);
await page.evaluate(
  (key) =>
    localStorage.setItem(
      key,
      JSON.stringify({
        lines: [
          {
            id: 'contacts-probe',
            productSlug: 'iphone-15-128',
            title: 'Apple iPhone 15 128 ГБ, Розовый',
            image: { kind: 'catalog-fallback' },
            price: 79990,
            quantity: 1,
            selected: true,
          },
        ],
      }),
    ),
  CART,
);
for (const path of ['/', '/cart', '/checkout', '/delivery', '/faq']) {
  await open(page, path);
  await page.waitForTimeout(200);
  const text = await page.evaluate(() => document.body.innerText);
  check(!/24\/7|в любое время|мы всегда на связи/i.test(text), `support claim truthful on ${path}`);
}
await open(page, '/checkout');
await page.reload();
await page.waitForSelector('main .benefits-strip');
check(
  (await page.evaluate(() => document.querySelector('main').innerText)).includes(HOURS),
  'checkout: support benefit shows canonical hours',
);
await page.evaluate((key) => localStorage.removeItem(key), CART);

const homeBenefits = () =>
  page.evaluate(() =>
    [...document.querySelectorAll('.home-page .benefits-strip__item')].map((li) => [
      li.querySelector('.benefits-strip__title').textContent.trim(),
      li.querySelector('.benefits-strip__note').textContent.trim(),
    ]),
  );
const HOME_SHARED_BENEFITS = [
  ['Гарантия до 24 месяцев', 'на все товары'],
  ['Оригинальная продукция', 'только официальные поставки'],
  ['Быстрая доставка', 'от 1 дня по всей России'],
];
await open(page, '/');
const productionBenefits = await homeBenefits();
check(
  JSON.stringify(productionBenefits) ===
    JSON.stringify([...HOME_SHARED_BENEFITS, ['Поддержка', HOURS]]),
  `home: production support benefit truthful ${JSON.stringify(productionBenefits)}`,
);
await page.goto(`${BASE}?reference=home`);
await page.waitForSelector('.home-page .benefits-strip__item');
const referenceBenefits = await homeBenefits();
check(
  JSON.stringify(referenceBenefits) ===
    JSON.stringify([...HOME_SHARED_BENEFITS, ['Поддержка 24/7', 'мы всегда на связи']]),
  `home: reference specimen benefits preserved ${JSON.stringify(referenceBenefits)}`,
);

for (const path of ['/contacts/extra', '/contact', '/about/extra']) {
  await page.goto(`${BASE}#${path}`);
  await page.waitForSelector('main h1');
  check((await page.textContent('main h1')).trim() === 'Страница не найдена', `404: ${path}`);
}
await page.close();

for (const width of [1440, 390, 320]) {
  const shot = await newPage(width, width === 1440 ? 900 : 844);
  await open(shot, '/contacts');
  await shot.waitForTimeout(150);
  const metrics = await shot.evaluate(() => {
    const main = document.querySelector('main');
    return {
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      small: [...main.querySelectorAll('.ui-button')]
        .filter((el) => el.getBoundingClientRect().height < 44)
        .map((el) => el.textContent.trim()),
      clipped: [...main.querySelectorAll('h1, h2, h3, p, li, span, a')].filter((el) => {
        const rect = el.getBoundingClientRect();
        return rect.width > 0 && rect.right > document.documentElement.clientWidth + 1;
      }).length,
    };
  });
  const key = `contacts@${width}`;
  check(metrics.overflow <= 0, `${key}: horizontal overflow ${metrics.overflow}`);
  check(metrics.small.length === 0, `${key}: small touch targets ${metrics.small}`);
  check(metrics.clipped === 0, `${key}: clipped content ${metrics.clipped}`);
  const storeHeadings = await shot.evaluate(() => {
    const resolve = (role) => {
      const probe = document.createElement('span');
      probe.style.color = `var(${role})`;
      document.body.append(probe);
      const color = getComputedStyle(probe).color;
      probe.remove();
      return color;
    };
    const cta = [...document.querySelectorAll('.contacts-stores a')].find(
      (a) => a.textContent.trim() === 'Все магазины',
    );
    return {
      primary: resolve('--role-text-primary'),
      link: resolve('--role-text-link'),
      headings: [...document.querySelectorAll('.contacts-store__title')].map((el) => ({
        tag: el.tagName,
        color: getComputedStyle(el).color,
        linked: el.closest('a') !== null || el.querySelector('a') !== null,
        focusable: el.tabIndex >= 0 || el.hasAttribute('role') || el.hasAttribute('onclick'),
      })),
      cta: cta === undefined ? null : [cta.tagName, cta.getAttribute('href')],
    };
  });
  check(
    storeHeadings.headings.length === 3 &&
      storeHeadings.headings.every(
        (heading) => heading.tag === 'H3' && !heading.linked && !heading.focusable,
      ),
    `${key}: store headings are plain h3 ${JSON.stringify(storeHeadings.headings)}`,
  );
  check(
    storeHeadings.primary !== storeHeadings.link &&
      storeHeadings.headings.every((heading) => heading.color === storeHeadings.primary),
    `${key}: store headings use --role-text-primary ${storeHeadings.primary} ${JSON.stringify(storeHeadings.headings.map((heading) => heading.color))}`,
  );
  check(
    JSON.stringify(storeHeadings.cta) === JSON.stringify(['A', '#/shops']),
    `${key}: «Все магазины» stays a link ${JSON.stringify(storeHeadings.cta)}`,
  );
  await shot.click('.contacts-stores__action', { hasText: 'Все магазины' });
  await shot.waitForFunction(() => location.hash === '#/shops');
  check(
    (await shot.evaluate(() => location.hash)) === '#/shops',
    `${key}: «Все магазины» opens #/shops`,
  );
  await open(shot, '/contacts');
  for (const [path, visual] of [
    ['/contacts', '.contacts-store__visual'],
    ['/shops', '.store-card__visual'],
  ]) {
    if (path !== '/contacts') {
      await open(shot, path);
    }
    const boxes = await shot.evaluate(
      (selector) =>
        [...document.querySelectorAll(selector)].map((slot) => {
          const outer = slot.getBoundingClientRect();
          const inner = slot.querySelector('img')?.getBoundingClientRect();
          return inner === undefined
            ? null
            : [
                Math.round(inner.left - outer.left),
                Math.round(inner.top - outer.top),
                Math.round(inner.width - outer.width),
                Math.round(inner.height - outer.height),
              ];
        }),
      visual,
    );
    check(
      boxes.length > 0 && boxes.every((box) => box !== null && box.every((delta) => delta === 0)),
      `${path}@${width}: thumbnail images match their slots ${JSON.stringify(boxes)}`,
    );
  }
  await shot.close();
}

for (const [width, height] of [
  [1440, 900],
  [1024, 768],
  [768, 1024],
  [390, 844],
  [320, 568],
]) {
  const tag = `contacts lead image@${width}`;
  const lead = await newPage(width, height);
  await open(lead, '/contacts');
  await lead.waitForFunction(() => {
    const image = document.querySelector('.contacts-card__image');
    return image !== null && image.complete && image.naturalWidth > 0;
  });
  const facts = await lead.evaluate(() => {
    const image = document.querySelector('.contacts-card__image');
    const picture = image.parentElement;
    const visual = document.querySelector('.contacts-card__visual').getBoundingClientRect();
    const box = image.getBoundingClientRect();
    const candidates = [...picture.querySelectorAll('source')].flatMap((source) =>
      source.srcset.split(',').map((entry) => {
        const [url, descriptor] = entry.trim().split(/\s+/);
        return { url: new URL(url, location.href).href, width: Number.parseInt(descriptor, 10) };
      }),
    );
    return {
      inPicture:
        picture.tagName === 'PICTURE' && picture.parentElement.matches('.contacts-card__visual'),
      types: [...picture.querySelectorAll('source')].map((source) => source.type),
      alt: image.getAttribute('alt'),
      loading: image.getAttribute('loading'),
      fetchPriority: image.getAttribute('fetchpriority'),
      intrinsic: [image.getAttribute('width'), image.getAttribute('height')],
      sizes: image.getAttribute('sizes'),
      chosenWidth: candidates.find((candidate) => candidate.url === image.currentSrc)?.width ?? 0,
      chosenFormat: image.currentSrc.split('.').pop(),
      requiredWidth: Math.ceil(Math.max(box.width, (box.height * 16) / 9) * devicePixelRatio),
      fills: [
        box.x - visual.x,
        box.y - visual.y,
        box.width - visual.width,
        box.height - visual.height,
      ]
        .map(Math.round)
        .every((delta) => delta === 0),
      fit: getComputedStyle(image).objectFit,
      overflow: document.documentElement.scrollWidth - innerWidth,
    };
  });
  check(
    facts.inPicture &&
      JSON.stringify(facts.types) === JSON.stringify(['image/avif', 'image/webp']) &&
      facts.alt === '' &&
      facts.loading === 'eager' &&
      facts.fetchPriority === 'high' &&
      JSON.stringify(facts.intrinsic) === JSON.stringify(['1600', '900']) &&
      facts.sizes === '(min-width: 900px) 860px, 100vw',
    `${tag}: decorative eager high-priority picture with AVIF/WebP sources and 1600×900 intrinsic size ${JSON.stringify(facts)}`,
  );
  check(
    facts.chosenFormat === 'avif' && facts.chosenWidth >= facts.requiredWidth,
    `${tag}: browser picks an AVIF variant wide enough for the cover box (${facts.chosenWidth}w ≥ ${facts.requiredWidth}px)`,
  );
  check(
    facts.fills && facts.fit === 'cover' && facts.overflow <= 0,
    `${tag}: image fills its visual slot with object-fit cover and no horizontal overflow ${JSON.stringify(facts)}`,
  );
  await lead.close();
}

const PHONE_HREF = 'tel:+78001001010';
const EMAIL_HREF = `mailto:${EMAIL}`;
const DEMO_NOTICE = {
  [PHONE_HREF]: {
    title: 'Демонстрационный телефон',
    message:
      'GoodCall — демонстрационный проект. Телефонная поддержка не подключена. Звонки по этому номеру не принимаются.',
  },
  [EMAIL_HREF]: {
    title: 'Демонстрационная почта',
    message:
      'GoodCall — демонстрационный проект. Почтовая поддержка не подключена. Письма на этот адрес не обрабатываются.',
  },
};
const PHONE_NOTE = 'Демо-номер, звонки не принимаются';
const DIMMED_BACKDROP = 'rgba(18, 19, 26, 0.36)';
const EMAIL_NOTE = 'Демо-адрес, письма не обрабатываются';
const HOURS_NOTE = 'Пример графика — в демо-версии поддержка не работает';
const CONTACTS_LEAD =
  'GoodCall — демонстрационный магазин: телефон и e-mail ниже показаны как пример, звонки и письма не обрабатываются.';

async function openRoute(target, hash, ready) {
  await target.goto(`${BASE}${hash}`);
  await target.waitForFunction(
    (selector) =>
      document.querySelector(selector) !== null &&
      document.querySelector('main.route-status') === null,
    ready,
  );
  await target.evaluate(() => {
    window.goodcallContactProbe = { clicks: [] };
    window.addEventListener('click', (event) => {
      const link = event.target instanceof Element ? event.target.closest('a[href]') : null;
      const href = link?.getAttribute('href') ?? '';
      if (!/^(tel|mailto):/.test(href)) return;
      window.goodcallContactProbe.clicks.push({ href, prevented: event.defaultPrevented });
      event.preventDefault();
    });
  });
}

function markContact(target, selector, nth) {
  return target.evaluate(
    ([css, index]) => {
      const link = [...document.querySelectorAll(css)].filter(
        (element) => element.getClientRects().length > 0,
      )[index];
      window.goodcallContactTarget = link ?? null;
      return link === undefined
        ? null
        : {
            href: link.getAttribute('href'),
            text: link.textContent.trim(),
            tag: link.tagName,
            lines: link.getClientRects().length,
          };
    },
    [selector, nth],
  );
}

const dialogFacts = (target) =>
  target.evaluate(() => {
    const dialogs = [...document.querySelectorAll('[role="dialog"]')];
    const dialog = dialogs[0];
    const byId = (attribute) =>
      document.getElementById(dialog?.getAttribute(attribute) ?? '')?.textContent.trim() ?? null;
    const button = dialog?.querySelector('button');
    const rect = dialog?.getBoundingClientRect();
    const buttonRect = button?.getBoundingClientRect();
    return {
      count: dialogs.length,
      title: dialog === undefined ? null : byId('aria-labelledby'),
      message: dialog === undefined ? null : byId('aria-describedby'),
      buttons:
        dialog === undefined
          ? []
          : [...dialog.querySelectorAll('button')].map((b) => b.textContent.trim()),
      focusInside: dialog?.contains(document.activeElement) ?? false,
      fits:
        rect !== undefined &&
        rect.left >= 0 &&
        rect.right <= innerWidth &&
        buttonRect !== undefined &&
        buttonRect.bottom <= innerHeight &&
        buttonRect.width > 0,
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      overlay: (() => {
        const overlay = document.querySelector('.feedback-dialog__overlay');
        if (overlay === null) return null;
        const box = overlay.getBoundingClientRect();
        const topmost = (x, y) => document.elementFromPoint(x, y) === overlay;
        return {
          dimmed: overlay.classList.contains('feedback-dialog__overlay--dimmed'),
          background: getComputedStyle(overlay).backgroundColor,
          covers:
            box.left <= 0 && box.top <= 0 && box.right >= innerWidth && box.bottom >= innerHeight,
          coversShell: topmost(4, 4) && topmost(4, innerHeight - 4),
        };
      })(),
    };
  });

const waitDialogClosed = (target) =>
  target.waitForFunction(() => document.querySelector('[role="dialog"]') === null);

async function focusReturned(target) {
  for (let attempt = 0; attempt < 20; attempt += 1) {
    const returned = await target.evaluate(
      () =>
        window.goodcallContactTarget !== null &&
        document.activeElement === window.goodcallContactTarget,
    );
    if (returned) return true;
    await target.waitForTimeout(50);
  }
  return false;
}

async function checkDemoContact(target, tag, selector, nth, expectedHref) {
  const link = await markContact(target, selector, nth);
  check(
    link !== null && link.tag === 'A' && link.href === expectedHref,
    `${tag}: anchor keeps ${expectedHref} ${JSON.stringify(link)}`,
  );
  if (link === null) return;
  const expected = DEMO_NOTICE[expectedHref];
  const before = await target.evaluate(() => location.href);

  if (link.lines === 1) {
    await target.click(selector, { nth });
  } else {
    await target.evaluate(() => window.goodcallContactTarget.focus());
    await target.keyboard.press('Enter');
  }
  await target.waitForFunction(() => document.querySelector('[role="dialog"]') !== null);
  const pointer = await dialogFacts(target);
  check(
    pointer.count === 1 &&
      pointer.title === expected.title &&
      pointer.message === expected.message &&
      JSON.stringify(pointer.buttons) === JSON.stringify(['Понятно']) &&
      pointer.focusInside &&
      pointer.fits &&
      pointer.overflow <= 0 &&
      pointer.overlay?.dimmed === true &&
      pointer.overlay.background === DIMMED_BACKDROP &&
      pointer.overlay.covers &&
      pointer.overlay.coversShell,
    `${tag}: ${link.lines === 1 ? 'click' : 'wrapped link, Enter'} opens one accessible demo dialog ${JSON.stringify(pointer)}`,
  );
  await target.click('[role="dialog"] .feedback-dialog__message');
  await target.waitForTimeout(150);
  check((await dialogFacts(target)).count === 1, `${tag}: clicking dialog content keeps it open`);
  await target.evaluate(() =>
    document.activeElement.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }),
    ),
  );
  await waitDialogClosed(target);
  check(await focusReturned(target), `${tag}: Escape closes and returns focus to the link`);

  await target.evaluate(() => window.goodcallContactTarget.focus());
  await target.keyboard.press('Enter');
  await target.waitForFunction(() => document.querySelector('[role="dialog"]') !== null);
  const keyboard = await dialogFacts(target);
  check(
    keyboard.count === 1 && keyboard.title === expected.title && keyboard.focusInside,
    `${tag}: Enter opens the same dialog ${JSON.stringify(keyboard)}`,
  );
  await target.keyboard.press('Enter');
  await waitDialogClosed(target);
  check(await focusReturned(target), `${tag}: «Понятно» closes and returns focus to the link`);

  const probe = await target.evaluate(() => ({
    clicks: window.goodcallContactProbe.clicks,
    href: location.href,
    dialogs: document.querySelectorAll('[role="dialog"]').length,
  }));
  check(
    probe.clicks.length === 2 &&
      probe.clicks.every((click) => click.href === expectedHref && click.prevented) &&
      probe.href === before &&
      probe.dialogs === 0,
    `${tag}: ordinary click and Enter are prevented, no navigation ${JSON.stringify(probe)}`,
  );
  await target.evaluate(() => {
    window.goodcallContactProbe.clicks = [];
  });
}

const PRODUCTION_CONTACTS = [
  {
    route: 'home',
    hash: '#/',
    ready: '.site-footer',
    links: [
      ['.site-footer__contact-value', 0, PHONE_HREF],
      ['.site-footer__contact-value', 1, EMAIL_HREF],
    ],
  },
  {
    route: 'not-found',
    hash: '#/no-such-page',
    ready: 'main h1',
    links: [['.site-footer__contact-value', 0, PHONE_HREF]],
  },
  {
    route: 'contacts',
    hash: '#/contacts',
    ready: '.contacts-channels',
    links: [
      ['a.contacts-channels__value', 0, PHONE_HREF],
      ['a.contacts-channels__value', 1, EMAIL_HREF],
    ],
  },
  {
    route: 'delivery',
    hash: '#/delivery',
    ready: '.info-support',
    links: [
      ['.info-support__contact-value', 0, PHONE_HREF],
      ['.info-support__contact-value', 1, EMAIL_HREF],
    ],
  },
  {
    route: 'faq',
    hash: '#/faq',
    ready: '.info-support',
    links: [
      ['.info-support__contact-value', 0, PHONE_HREF],
      ['.info-support__contact-value', 1, EMAIL_HREF],
    ],
  },
  {
    route: 'warranty',
    hash: '#/warranty',
    ready: '.info-support',
    links: [
      ['.info-support__contact-value', 0, PHONE_HREF],
      ['.info-support__contact-value', 1, EMAIL_HREF],
    ],
  },
  {
    route: 'privacy',
    hash: '#/privacy',
    ready: 'main h1',
    links: [
      [`main a[href="${PHONE_HREF}"]`, 0, PHONE_HREF],
      [`main a[href="${EMAIL_HREF}"]`, 0, EMAIL_HREF],
    ],
  },
  {
    route: 'offer',
    hash: '#/offer',
    ready: 'main h1',
    links: [
      [`main a[href="${PHONE_HREF}"]`, 0, PHONE_HREF],
      [`main a[href="${PHONE_HREF}"]`, 1, PHONE_HREF],
      [`main a[href="${EMAIL_HREF}"]`, 0, EMAIL_HREF],
      [`main a[href="${EMAIL_HREF}"]`, 1, EMAIL_HREF],
    ],
  },
];

for (const { route, hash, ready, links } of PRODUCTION_CONTACTS) {
  const target = await newPage();
  await openRoute(target, hash, ready);
  for (const [selector, nth, href] of links) {
    await checkDemoContact(target, `demo contact ${route} ${selector}#${nth}`, selector, nth, href);
  }
  await target.close();
}

for (const [width, height] of [
  [390, 844],
  [320, 700],
]) {
  const target = await newPage(width, height);
  await openRoute(target, '#/contacts', '.contacts-channels');
  await checkDemoContact(
    target,
    `demo contact contacts@${width} phone`,
    'a.contacts-channels__value',
    0,
    PHONE_HREF,
  );
  await checkDemoContact(
    target,
    `demo contact footer@${width} email`,
    '.site-footer__contact-value',
    1,
    EMAIL_HREF,
  );
  await target.close();
}

{
  const target = await newPage();
  await openRoute(target, '#/contacts', '.contacts-channels');
  const copy = await target.evaluate(() => ({
    lead: document.querySelector('.info-page__lead')?.textContent.trim() ?? null,
    channelNotes: [...document.querySelectorAll('.contacts-channels__note')].map((el) =>
      el.textContent.trim(),
    ),
    footerNotes: [...document.querySelectorAll('.site-footer__contact-note')].map((el) =>
      el.textContent.trim(),
    ),
    bodyText: document.body.innerText,
  }));
  check(copy.lead === CONTACTS_LEAD, `contacts: demo lead ${copy.lead}`);
  check(
    JSON.stringify(copy.channelNotes) ===
      JSON.stringify([PHONE_NOTE, EMAIL_NOTE, HOURS_NOTE, 'Демо-точки самовывоза · Москва']),
    `contacts: demo channel notes ${JSON.stringify(copy.channelNotes)}`,
  );
  check(
    JSON.stringify(copy.footerNotes) === JSON.stringify([PHONE_NOTE, EMAIL_NOTE]),
    `production footer: demo contact notes ${JSON.stringify(copy.footerNotes)}`,
  );
  check(
    !/бесплатн|Отвечаем по телефону|Служба поддержки GoodCall поможет/.test(copy.bodyText),
    'contacts: no free-call or live-support claims',
  );
  await target.close();
}

for (const route of ['#/delivery', '#/faq', '#/warranty']) {
  const target = await newPage();
  await openRoute(target, route, '.info-support');
  const notes = await target.evaluate(() =>
    [...document.querySelectorAll('.info-support__contact-note')].map((el) =>
      el.textContent.trim(),
    ),
  );
  check(
    JSON.stringify(notes) === JSON.stringify([PHONE_NOTE, EMAIL_NOTE]),
    `${route}: support block demo notes ${JSON.stringify(notes)}`,
  );
  await target.close();
}

for (const reference of ['footer', 'home', 'catalog']) {
  const target = await newPage();
  await target.goto(`${BASE}?reference=${reference}`);
  await target.waitForSelector('.site-footer');
  await target.evaluate(() => {
    window.goodcallReferenceClicks = [];
    window.addEventListener('click', (event) => {
      const href = event.target.closest?.('a[href]')?.getAttribute('href') ?? '';
      if (!/^(tel|mailto):/.test(href)) return;
      window.goodcallReferenceClicks.push({ href, prevented: event.defaultPrevented });
      event.preventDefault();
    });
  });
  const facts = await target.evaluate(() => {
    const values = [...document.querySelectorAll('.site-footer__contact-value')];
    for (const link of values) {
      link.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
    }
    return {
      values: values.map((link) => [link.textContent.trim(), link.getAttribute('href')]),
      notes: [...document.querySelectorAll('.site-footer__contact-note')].map((el) =>
        el.textContent.trim(),
      ),
      clicks: window.goodcallReferenceClicks,
    };
  });
  await target.waitForTimeout(200);
  const dialogs = await target.count('[role="dialog"]');
  check(
    JSON.stringify(facts.values) ===
      JSON.stringify([
        [PHONE, PHONE_HREF],
        ['info@goodcall.ru', 'mailto:info@goodcall.ru'],
      ]) &&
      JSON.stringify(facts.notes) === JSON.stringify(['Звонок по России бесплатный', HOURS]) &&
      facts.clicks.length === 2 &&
      facts.clicks.every((click) => !click.prevented) &&
      dialogs === 0,
    `reference ${reference}: footer keeps its native default contacts without the demo dialog ${JSON.stringify({ ...facts, dialogs })}`,
  );
  await target.close();
}

{
  const target = await newPage();
  await target.goto(`${BASE}?reference=components`);
  await target.waitForSelector('.product-card');
  for (const [nth, title] of [
    [0, 'Важно знать!'],
    [1, 'Удалить товар из корзины?'],
  ]) {
    await target.click('.cmp-feedback-group--dialog button', { hasText: 'Показать окно', nth });
    await target.waitForFunction(
      () => document.querySelector('[role="dialog"], [role="alertdialog"]') !== null,
    );
    const facts = await target.evaluate(() => {
      const overlay = document.querySelector('.feedback-dialog__overlay');
      const dialog = document.querySelector('[role="dialog"], [role="alertdialog"]');
      return {
        title: document.getElementById(dialog.getAttribute('aria-labelledby'))?.textContent.trim(),
        dimmed: overlay?.classList.contains('feedback-dialog__overlay--dimmed') ?? null,
        background: overlay === null ? null : getComputedStyle(overlay).backgroundColor,
      };
    });
    check(
      facts.title === title && facts.dimmed === false && facts.background === 'rgba(0, 0, 0, 0)',
      `reference components: non-contact dialog keeps the default transparent overlay ${JSON.stringify(facts)}`,
    );
    await target.evaluate(() =>
      document.activeElement.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }),
      ),
    );
    await target.waitForFunction(
      () => document.querySelector('[role="dialog"], [role="alertdialog"]') === null,
    );
  }
  await target.close();
}

await browser.close();
reportCounts(passed, failures);
