export const BREADCRUMB_LABEL = 'Хлебные крошки';

export function breadcrumbFacts(label) {
  const navs = [...document.querySelectorAll(`nav[aria-label="${label}"]`)];
  const items = navs[0] === undefined ? [] : [...navs[0].querySelectorAll(':scope > ol > li')];
  return {
    navs: navs.length,
    labels: items.map((li) => li.textContent.trim()),
    hrefs: items.map((li) => li.querySelector('a')?.getAttribute('href') ?? null),
    current: items.map((li) => li.getAttribute('aria-current')),
    separators: items.map((li) => getComputedStyle(li, '::before').content),
  };
}

export function breadcrumbProblems(facts) {
  const problems = [];
  const last = facts.labels.length - 1;
  if (facts.navs !== 1) problems.push(`navs=${facts.navs}`);
  if (last < 1) problems.push('fewer than two items');
  facts.current.forEach((value, index) => {
    if (index === last ? value !== 'page' : value !== null) problems.push(`aria-current@${index}`);
  });
  if (facts.hrefs[last] !== null) problems.push('current item is a link');
  if (facts.separators[0] !== 'none') problems.push('separator before first item');
  facts.separators.slice(1).forEach((content, index) => {
    if (content !== '"›" / ""') problems.push(`separator@${index + 1}=${content}`);
  });
  if (facts.labels.some((text) => text === '')) problems.push('empty label');
  return problems;
}

export function headingOutline() {
  const headings = [...document.querySelectorAll('main :is(h1, h2, h3, h4, h5, h6)')].filter(
    (heading) =>
      heading.getClientRects().length > 0 &&
      getComputedStyle(heading).visibility !== 'hidden' &&
      heading.closest('[aria-hidden="true"]') === null,
  );
  const levels = headings.map((heading) => Number(heading.tagName.slice(1)));
  const skips = [];
  levels.forEach((level, index) => {
    const previous = index === 0 ? 0 : levels[index - 1];
    if (level > previous + 1) {
      skips.push(`h${previous}→h${level} "${headings[index].textContent.trim().slice(0, 40)}"`);
    }
  });
  const visibleH1 = headings.filter(
    (heading) => heading.tagName === 'H1' && heading.getBoundingClientRect().width > 1,
  ).length;
  const hiddenH2 = headings
    .filter(
      (heading) => heading.tagName === 'H2' && heading.classList.contains('ui-visually-hidden'),
    )
    .map((heading) => heading.textContent.trim());
  return { levels, skips, visibleH1, hiddenH2 };
}

export function routeStatusFacts() {
  const main = document.querySelector('main');
  const inner = document.querySelector('.route-status__inner');
  const title = document.querySelector('.route-status__title');
  return {
    mains: document.querySelectorAll('main').length,
    routeStatus: main?.classList.contains('route-status') ?? false,
    busy: main?.getAttribute('aria-busy') ?? null,
    status: main?.querySelector('[role="status"]')?.textContent.trim() ?? null,
    h1: [...document.querySelectorAll('h1')].map((heading) => heading.textContent.trim()),
    message: document.querySelector('.route-status__message')?.textContent.trim() ?? null,
    actions: [...document.querySelectorAll('.route-status__actions a')].map(
      (link) => `${link.textContent.trim()}=${link.getAttribute('href')}`,
    ),
    paddingTop: inner === null ? null : getComputedStyle(inner).paddingTop,
    titleSize: title === null ? null : getComputedStyle(title).fontSize,
  };
}

export function emptyStateFacts(scope) {
  const root = document.querySelector(`${scope} .empty-state`);
  if (root === null) return null;
  const heading = root.querySelector('.empty-state__title');
  const icon = root.querySelector('.empty-state__icon');
  return {
    variant: root.classList.contains('empty-state--page') ? 'page' : 'panel',
    level: heading?.tagName.toLowerCase() ?? null,
    title: heading?.textContent.trim() ?? null,
    labelledBy: root.getAttribute('aria-labelledby') === heading?.id,
    icon: [...(icon?.classList ?? [])].find((name) => name.startsWith('ui-icon--')) ?? null,
    actions: [...root.querySelectorAll('.empty-state__action')].map((action) =>
      action.tagName === 'A'
        ? `a:${action.textContent.trim()}=${action.getAttribute('href')}`
        : `${action.tagName.toLowerCase()}:${action.textContent.trim()}`,
    ),
  };
}
