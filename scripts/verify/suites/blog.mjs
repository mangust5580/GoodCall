import { MOCK_SUPABASE_HOST } from '../lib/build.mjs';
import { launchBrowser } from '../lib/browser.mjs';
import { openPage } from '../lib/page.mjs';
import { appBase, reportCounts } from '../lib/suite.mjs';

const BASE = appBase();
const ARTICLE_SLUG = 'how-to-choose-smartphone-2024';
const ARTICLE_HASH = `#/blog/${ARTICLE_SLUG}`;
const FLOW_CHUNK = /\/assets\/BlogFlowRoutes-[\w-]+\.js$/;
const FAILURE_TITLE = 'Страница временно недоступна';

let passed = 0;
const failures = [];
function check(condition, message) {
  if (condition) passed += 1;
  else failures.push(message);
}

const browser = await launchBrowser({ extraArgs: ['--hide-scrollbars'] });

function newPage(width = 1440, height = 900, extra = {}) {
  return openPage(browser, {
    width,
    height,
    interceptPatterns: [`*${MOCK_SUPABASE_HOST}*`, ...(extra.patterns ?? [])],
    respond: extra.respond ?? (() => ({ status: 200, body: '[]' })),
    onPageError: (message) => failures.push(`pageerror ${message}`),
  });
}

const ready = () =>
  document.querySelector('main h1') !== null &&
  document.querySelector('main.route-status') === null;
const shellFacts = () => ({
  shells: document.querySelectorAll('.production-shell').length,
  mains: document.querySelectorAll('main').length,
  h1: [...document.querySelectorAll('h1')].map((h) => h.textContent.trim()),
  title: document.title,
  hash: location.hash,
});
const singleShell = (facts) => facts.shells === 1 && facts.mains === 1 && facts.h1.length === 1;
const listingFacts = () => ({
  cards: document.querySelectorAll('.blog-grid .blog-card').length,
  linkedCards: [...document.querySelectorAll('.blog-grid .blog-card')]
    .filter((card) => card.querySelector('a[href]') !== null)
    .map((card) => [...card.querySelectorAll('a[href]')].map((a) => a.getAttribute('href'))),
  count: document.querySelector('.blog-results__count')?.textContent.trim(),
  pressed: [...document.querySelectorAll('.blog-categories__item')]
    .filter((button) => button.getAttribute('aria-pressed') === 'true')
    .map((button) => button.textContent.trim()),
  empty: document.querySelector('.blog-empty__title')?.textContent.trim() ?? null,
  page:
    document
      .querySelector('.blog-workspace__pagination [aria-current="page"]')
      ?.textContent.trim() ?? null,
});
const flowChunkLoaded = () =>
  performance.getEntriesByType('resource').some((entry) => /\/BlogFlowRoutes-/.test(entry.name));

async function entry(page, hash) {
  await page.goto('about:blank');
  await page.goto(`${BASE}${hash}`);
  await page.waitForFunction(ready);
  return page.evaluate(shellFacts);
}

const home = await newPage();
await home.goto(`${BASE}#/`);
await home.waitForSelector('.site-footer');
check(!(await home.evaluate(flowChunkLoaded)), 'Home does not load the Blog chunk');
await home.close();

const page = await newPage();
const listing = await entry(page, '#/blog');
const listed = await page.evaluate(listingFacts);
check(
  singleShell(listing) && listing.title === 'Блог — GoodCall' && listing.h1[0].includes('Блог'),
  `listing: direct #/blog renders one shell, h1 and title ${JSON.stringify(listing)}`,
);
check(
  listed.cards === 8 &&
    listed.linkedCards.length === 1 &&
    listed.linkedCards[0].every((href) => href === ARTICLE_HASH) &&
    JSON.stringify(listed.pressed) === JSON.stringify(['Все статьи']),
  `listing: 8 cards on page 1, only the article with a detail page is linked ${JSON.stringify(listed)}`,
);
await page.reload();
await page.waitForFunction(ready);
check(
  JSON.stringify(await page.evaluate(listingFacts)) === JSON.stringify(listed),
  'listing: reload renders the same listing',
);

const paged = await entry(page, '#/blog?page=2');
const pagedFacts = await page.evaluate(listingFacts);
check(
  singleShell(paged) && pagedFacts.page === '2' && pagedFacts.cards > 0 && pagedFacts.cards < 8,
  `listing: #/blog?page=2 shows the second page ${JSON.stringify(pagedFacts)}`,
);

await entry(page, '#/blog');
await page.click('.blog-categories__item', { hasText: 'Гайды' });
await page.waitForFunction(
  () =>
    location.hash === '#/blog?category=guides' &&
    document.querySelector('.blog-categories__item[aria-pressed="true"]')?.textContent.trim() ===
      'Гайды',
);
const guides = await page.evaluate(listingFacts);
check(
  JSON.stringify(guides.pressed) === JSON.stringify(['Гайды']) &&
    guides.cards > 0 &&
    guides.cards < 8,
  `listing: category click filters and writes ?category=guides ${JSON.stringify(guides)}`,
);
await page.reload();
await page.waitForFunction(ready);
check(
  JSON.stringify((await page.evaluate(listingFacts)).pressed) === JSON.stringify(['Гайды']),
  'listing: reload keeps the category filter',
);
await page.evaluate(() => history.back());
await page.waitForFunction(
  () =>
    location.hash === '#/blog' &&
    document.querySelector('.blog-categories__item[aria-pressed="true"]')?.textContent.trim() ===
      'Все статьи',
);
check(
  (await page.evaluate(listingFacts)).cards === 8,
  'listing: Back returns to the unfiltered listing',
);

await entry(page, '#/blog');
await page.focus('.blog-categories__item:nth-child(3)');
const focusedCategory = await page.evaluate(() => document.activeElement.textContent.trim());
await page.keyboard.press('Enter');
await page.waitForFunction((label) => {
  const pressed = [...document.querySelectorAll('.blog-categories__item')].find(
    (button) => button.getAttribute('aria-pressed') === 'true',
  );
  return pressed?.textContent.trim() === label && location.hash.includes('category=');
}, focusedCategory);
check(true, `listing: keyboard Enter on a category applies it (${focusedCategory})`);

const searched = await entry(page, `#/blog?q=${encodeURIComponent('смартфон')}`);
const searchedFacts = await page.evaluate(listingFacts);
check(
  singleShell(searched) && searchedFacts.cards > 0 && searchedFacts.empty === null,
  `listing: #/blog?q=смартфон shows matching articles ${JSON.stringify(searchedFacts)}`,
);
await entry(page, '#/blog?q=zzzz');
const emptyFacts = await page.evaluate(listingFacts);
check(
  emptyFacts.cards === 0 && emptyFacts.empty === 'Статьи не найдены',
  `listing: an unmatched query shows the empty state ${JSON.stringify(emptyFacts)}`,
);
await page.click('.blog-empty button', { hasText: 'Показать все статьи' });
await page.waitForFunction(
  () =>
    location.hash === '#/blog' && document.querySelectorAll('.blog-grid .blog-card').length === 8,
);
check(
  (await page.evaluate(listingFacts)).cards === 8,
  'listing: «Показать все статьи» clears the query from the URL',
);
await entry(page, `#/blog?q=${encodeURIComponent('смартфон')}`);
await page.click('.blog-results__reset');
await page.waitForFunction(
  () =>
    location.hash === '#/blog' && document.querySelectorAll('.blog-grid .blog-card').length === 8,
);
check(
  (await page.evaluate(listingFacts)).cards === 8,
  'listing: «Сбросить фильтры» clears a matching query from the URL',
);

const article = await entry(page, ARTICLE_HASH);
const articleFacts = await page.evaluate(() => ({
  heading: document.querySelector('.blog-article__title')?.textContent.trim(),
  crumbs: [...document.querySelectorAll('nav[aria-label="Хлебные крошки"] li')].map(
    (li) => li.querySelector('a')?.getAttribute('href') ?? null,
  ),
  share: [...document.querySelectorAll('.blog-share__list a[href]')].map((a) => a.href),
  related: document.querySelectorAll('.blog-detail__related .blog-card').length,
  allArticles: document.querySelector('.blog-related__all')?.getAttribute('href'),
}));
const expectedShare = encodeURIComponent(`${new URL(BASE).origin}/GoodCall/${ARTICLE_HASH}`);
check(
  singleShell(article) &&
    article.title === `${articleFacts.heading} — GoodCall` &&
    JSON.stringify(articleFacts.crumbs) === JSON.stringify(['#/', '#/blog', null]) &&
    articleFacts.related > 0 &&
    articleFacts.allArticles === '#/blog',
  `article: direct entry renders the article, title, breadcrumbs and related ${JSON.stringify({ ...article, ...articleFacts })}`,
);
check(
  articleFacts.share.length > 0 && articleFacts.share.every((href) => href.includes(expectedShare)),
  `article: share links carry the GitHub Pages article URL ${JSON.stringify(articleFacts.share)}`,
);
await page.reload();
await page.waitForFunction(ready);
check(
  (await page.evaluate(shellFacts)).title === article.title,
  'article: reload keeps the article and title',
);

const unknown = await entry(page, '#/blog/no-such-article');
check(
  singleShell(unknown) && unknown.title === 'Страница не найдена — GoodCall',
  `article: an unknown slug renders the existing not-found page ${JSON.stringify(unknown)}`,
);

await entry(page, '#/blog');
await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
await page.click('.blog-grid .blog-card a[href]');
await page.waitForFunction((hash) => location.hash === hash, ARTICLE_HASH);
await page.waitForFunction(ready);
check(
  (await page.evaluate(() => Math.round(scrollY))) === 0,
  'navigation: listing → article resets scroll to the top',
);
await page.evaluate(() => history.back());
await page.waitForFunction(
  () => location.hash === '#/blog' && document.title === 'Блог — GoodCall',
);
await page.evaluate(() => history.forward());
await page.waitForFunction((hash) => location.hash === hash, ARTICLE_HASH);
await page.waitForFunction(ready);
check(
  (await page.evaluate(shellFacts)).title === article.title,
  'navigation: Back/Forward between listing and article restore pages and titles',
);
await page.close();

const isFlowChunk = (request) => FLOW_CHUNK.test(new URL(request.url).pathname);
const shiftFacts = () =>
  new Promise((resolve) => {
    const entries = [];
    const observer = new PerformanceObserver((list) => entries.push(...list.getEntries()));
    observer.observe({ type: 'layout-shift', buffered: true });
    setTimeout(() => {
      observer.disconnect();
      const kept = entries.filter((item) => !item.hadRecentInput);
      resolve({
        total: Number(kept.reduce((sum, item) => sum + item.value, 0).toFixed(4)),
        shell: kept.filter((item) =>
          item.sources.some((source) => source.node?.closest?.('.newsletter-band, .site-footer')),
        ).length,
      });
    }, 300);
  });

for (const [width, height] of [
  [1440, 900],
  [390, 844],
]) {
  let release;
  const gate = new Promise((resolve) => {
    release = resolve;
  });
  const slow = await newPage(width, height, {
    patterns: ['*BlogFlowRoutes-*'],
    respond: (request) =>
      isFlowChunk(request) ? gate.then(() => ({ continue: true })) : { status: 200, body: '[]' },
  });
  await slow.goto(`${BASE}#/blog`);
  await slow.waitForFunction(() =>
    document.querySelector('main.route-status[aria-busy="true"] [role="status"]'),
  );
  const loading = await slow.evaluate(() => ({
    message: document.querySelector('main.route-status [role="status"]').textContent,
    newsletterBelowFold:
      document.querySelector('.newsletter-band').getBoundingClientRect().top >= innerHeight,
    shells: document.querySelectorAll('.production-shell').length,
  }));
  check(
    loading.message === 'Загружаем страницу…' &&
      loading.newsletterBelowFold &&
      loading.shells === 1,
    `loading@${width}: fallback shows one shell and the loading status, Newsletter below the fold ${JSON.stringify(loading)}`,
  );
  release();
  await slow.waitForFunction(ready);
  const shifts = await slow.evaluate(shiftFacts);
  check(
    shifts.shell === 0 && shifts.total < 0.1 && singleShell(await slow.evaluate(shellFacts)),
    `loading@${width}: fallback → ready keeps one shell without a Newsletter/Footer shift ${JSON.stringify(shifts)}`,
  );
  await slow.close();
}

let blocked = true;
let chunkRequests = 0;
const failing = await newPage(1440, 900, {
  patterns: ['*BlogFlowRoutes-*'],
  respond: (request) => {
    if (!isFlowChunk(request)) return { status: 200, body: '[]' };
    chunkRequests += 1;
    return blocked ? { status: 404, body: '' } : { continue: true };
  },
});
await failing.goto(`${BASE}${ARTICLE_HASH}`);
await failing.waitForFunction(() => document.querySelector('main.route-status h1'));
const failed = await failing.evaluate(() => {
  const status = document.querySelector('main.route-status');
  return {
    title: status.querySelector('h1').textContent,
    message: status.querySelector('.route-status__message').textContent,
    button: status.querySelector('button')?.textContent,
    link: status.querySelector('a')?.getAttribute('href'),
    shells: document.querySelectorAll('.production-shell').length,
    documentTitle: document.title,
  };
});
check(
  failed.title === FAILURE_TITLE &&
    failed.button === 'Обновить страницу' &&
    failed.link === '#/' &&
    failed.shells === 1 &&
    failed.documentTitle === `${FAILURE_TITLE} — GoodCall` &&
    !/error|chunk|import|stack|undefined/i.test(failed.message),
  `failure: a blocked chunk shows the failure status in one shell ${JSON.stringify(failed)}`,
);
await failing.focus('main.route-status button');
await failing.keyboard.press('Tab');
check(
  await failing.evaluate(() => document.activeElement?.textContent === 'На главную'),
  'failure: actions are focusable in order',
);
await failing.evaluate(() => {
  window.goodcallBlogMarker = true;
});
const requestsAtFailure = chunkRequests;
await failing.waitForTimeout(2000);
check(
  (await failing.evaluate(() => window.goodcallBlogMarker === true)) &&
    chunkRequests === requestsAtFailure,
  `failure: no automatic reload or retry (chunk requests ${chunkRequests})`,
);
await failing.click('main.route-status a', { hasText: 'На главную' });
await failing.waitForFunction(
  () => location.hash === '#/' && document.title === 'Главная — GoodCall',
);
check(
  !(await failing.evaluate(() => document.body.innerText.includes('Страница временно недоступна'))),
  'failure: «На главную» leaves no failure UI behind',
);
blocked = false;
await failing.evaluate((hash) => {
  location.hash = hash;
}, ARTICLE_HASH);
await failing.waitForFunction(() => document.querySelector('main.route-status h1'));
await failing.click('main.route-status button', { hasText: 'Обновить страницу' });
await failing.waitForFunction(() => window.goodcallBlogMarker === undefined);
await failing.waitForFunction(ready);
check(
  (await failing.evaluate(shellFacts)).title === article.title,
  'failure: «Обновить страницу» reloads and recovers the article once the chunk is available',
);
await failing.close();

await browser.close();
reportCounts(passed, failures);
