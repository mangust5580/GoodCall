import { register } from 'node:module';

import { report } from '../lib/suite.mjs';

register(new URL('../lib/ts-hook.mjs', import.meta.url));
const STORE = new URL('../../../src/commerce/compare/compareStore.ts', import.meta.url).href;
const KEY = 'goodcall.compare.v1';
const results = [];
const check = (name, ok, detail = '') =>
  results.push(`${ok ? 'PASS' : 'FAIL'} ${name}${detail ? ` — ${detail}` : ''}`);
function fakeStorage(initial = {}, { throwGet = false, throwSet = false } = {}) {
  const data = { ...initial };
  const log = { removed: [] };
  return {
    log,
    data,
    getItem: (k) => {
      if (throwGet) throw new Error('blocked');
      return k in data ? data[k] : null;
    },
    setItem: (k, v) => {
      if (throwSet) throw new Error('blocked');
      data[k] = String(v);
    },
    removeItem: (k) => {
      log.removed.push(k);
      delete data[k];
    },
  };
}
let n = 0;
async function fresh(storage) {
  globalThis.window = { localStorage: storage };
  n += 1;
  return import(`${STORE}?case=${n}`);
}
const item = (slug, extra = {}) => ({
  slug,
  title: `Phone ${slug}`,
  image: { kind: 'catalog-fallback' },
  price: 1000,
  reviewCount: 3,
  ...extra,
});

let st = fakeStorage();
let m = await fresh(st);
check('starts empty', m.getCompareItems().length === 0);
check('limit constant is 4', m.COMPARE_LIMIT === 4);
m.addCompareItem(item('a'));
m.addCompareItem(item('b'));
check(
  'add appends in insertion order',
  m
    .getCompareItems()
    .map((i) => i.slug)
    .join() === 'a,b',
);
m.addCompareItem(item('a', { price: 9 }));
check(
  'duplicate add is a no-op',
  m.getCompareItems().length === 2 && m.getCompareItems()[0].price === 1000,
);
m.toggleCompareItem(item('c'), true);
m.toggleCompareItem(item('b'), false);
check(
  'toggle adds and removes',
  m
    .getCompareItems()
    .map((i) => i.slug)
    .join() === 'a,c',
);
m.removeCompareItem('zzz');
check('remove of absent slug is a no-op', m.getCompareItems().length === 2);
m.addCompareItem(item('d'));
m.addCompareItem(item('e'));
check('cap: 4 items, full', m.getCompareItems().length === 4 && m.isCompareFull());
m.addCompareItem(item('f'));
check(
  'fifth add ignored',
  m
    .getCompareItems()
    .map((i) => i.slug)
    .join() === 'a,c,d,e',
);
m.removeCompareItem('c');
check(
  'removal works while full',
  m
    .getCompareItems()
    .map((i) => i.slug)
    .join() === 'a,d,e' && !m.isCompareFull(),
);
check(
  'persisted under goodcall.compare.v1 as { items }',
  JSON.parse(st.data[KEY])
    .items.map((i) => i.slug)
    .join() === 'a,d,e',
);
let notified = 0;
const off = m.subscribeCompare(() => {
  notified += 1;
});
m.clearCompareItems();
off();
check(
  'clear empties + notifies',
  m.getCompareItems().length === 0 && notified === 1 && JSON.parse(st.data[KEY]).items.length === 0,
);
const fullItem = item('x', {
  oldPrice: 1200,
  rating: 4.5,
  brand: 'Apple',
  storage: 128,
  colour: 'Чёрный',
});
st = fakeStorage({ [KEY]: JSON.stringify({ items: [fullItem] }) });
m = await fresh(st);
check(
  'valid stored snapshot restored with all fields',
  (() => {
    const got = m.getCompareItems()[0];
    const keys = Object.keys(fullItem);
    return (
      Object.keys(got).length === keys.length &&
      keys.every((k) => JSON.stringify(got[k]) === JSON.stringify(fullItem[k]))
    );
  })(),
);
check(
  'snapshot carries no category/stock/selected fields',
  !/category|stock|selected|quantity/.test(JSON.stringify(m.getCompareItems())),
);
for (const [label, raw] of [
  ['malformed JSON', '{bad'],
  ['foreign shape (array)', '[]'],
  ['foreign shape (items not array)', JSON.stringify({ items: 'x' })],
  ['duplicate stored slugs', JSON.stringify({ items: [item('a'), item('a')] })],
  [
    'more than 4 stored items',
    JSON.stringify({ items: ['a', 'b', 'c', 'd', 'e'].map((s) => item(s)) }),
  ],
  ['malformed item (negative price)', JSON.stringify({ items: [item('a', { price: -1 })] })],
  [
    'malformed item (bad image)',
    JSON.stringify({ items: [item('a', { image: { kind: 'nope' } })] }),
  ],
]) {
  st = fakeStorage({ [KEY]: raw, 'goodcall.cart.v1': 'keep' });
  m = await fresh(st);
  check(
    `recovery: ${label} → empty, only compare key removed`,
    m.getCompareItems().length === 0 &&
      st.log.removed.join() === KEY &&
      st.data['goodcall.cart.v1'] === 'keep',
  );
}
st = fakeStorage({}, { throwGet: true, throwSet: true });
m = await fresh(st);
let crashed = false;
try {
  m.getCompareItems();
  m.addCompareItem(item('a'));
  m.removeCompareItem('a');
  m.addCompareItem(item('b'));
} catch {
  crashed = true;
}
check(
  'storage access failure does not crash; in-memory state still works',
  !crashed &&
    m
      .getCompareItems()
      .map((i) => i.slug)
      .join() === 'b',
);
report(results);
