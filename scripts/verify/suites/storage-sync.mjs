import { register } from 'node:module';

import { report } from '../lib/suite.mjs';

register(new URL('../lib/ts-hook.mjs', import.meta.url));
const results = [];
const check = (name, ok, detail = '') =>
  results.push(`${ok ? 'PASS' : 'FAIL'} ${name}${detail ? ` — ${detail}` : ''}`);

function fakeStorage(initial = {}) {
  const data = { ...initial };
  const log = { set: 0, removed: [] };
  return {
    log,
    data,
    getItem: (k) => (k in data ? data[k] : null),
    setItem: (k, v) => {
      log.set += 1;
      data[k] = String(v);
    },
    removeItem: (k) => {
      log.removed.push(k);
      delete data[k];
    },
  };
}

function fakeWindow(localStorage) {
  const handlers = [];
  return {
    localStorage,
    handlers,
    addEventListener: (type, handler) => {
      if (type === 'storage') handlers.push(handler);
    },
  };
}

let n = 0;
async function openTab(win, url) {
  globalThis.window = win;
  const before = win.handlers.length;
  n += 1;
  const module = await import(`${url}?tab=${n}`);
  return { module, handlers: win.handlers.slice(before) };
}

function deliver(tab, event) {
  for (const handler of tab.handlers) handler(event);
}

const src = (path) => new URL(`../../../src/commerce/${path}`, import.meta.url).href;
const STORES = [
  {
    name: 'cart',
    url: src('cart/cartStore.ts'),
    key: 'goodcall.cart.v1',
    subscribe: (m, l) => m.subscribeCart(l),
    read: (m) =>
      m
        .getCartLines()
        .map((line) => `${line.id}x${line.quantity}`)
        .join(),
    snapshot: (m) => m.getCartLines(),
    empty: '',
    first: (m) =>
      m.addCartLine(
        { id: 'a', productSlug: 'a', title: 'A', image: { kind: 'catalog-fallback' }, price: 100 },
        1,
      ),
    firstValue: 'ax1',
    second: (m) =>
      m.addCartLine(
        { id: 'b', productSlug: 'b', title: 'B', image: { kind: 'catalog-fallback' }, price: 200 },
        2,
      ),
    secondValue: 'ax1,bx2',
    invalid: [
      ['malformed JSON', '{bad'],
      ['foreign shape', JSON.stringify({ items: [] })],
    ],
  },
  {
    name: 'favorites',
    url: src('favorites/favoritesStore.ts'),
    key: 'goodcall.favorites.v1',
    subscribe: (m, l) => m.subscribeFavorites(l),
    read: (m) =>
      m
        .getFavoriteItems()
        .map((item) => item.slug)
        .join(),
    snapshot: (m) => m.getFavoriteItems(),
    empty: '',
    first: (m) =>
      m.addFavorite({ slug: 'a', title: 'A', image: { kind: 'catalog-fallback' }, price: 100 }),
    firstValue: 'a',
    second: (m) =>
      m.addFavorite({ slug: 'b', title: 'B', image: { kind: 'catalog-fallback' }, price: 200 }),
    secondValue: 'b,a',
    invalid: [
      ['malformed JSON', '{bad'],
      ['foreign shape', JSON.stringify({ lines: [] })],
    ],
  },
  {
    name: 'compare',
    url: src('compare/compareStore.ts'),
    key: 'goodcall.compare.v1',
    subscribe: (m, l) => m.subscribeCompare(l),
    read: (m) =>
      m
        .getCompareItems()
        .map((item) => item.slug)
        .join(),
    snapshot: (m) => m.getCompareItems(),
    empty: '',
    first: (m) =>
      m.addCompareItem({
        slug: 'a',
        title: 'A',
        image: { kind: 'catalog-fallback' },
        price: 100,
        reviewCount: 0,
      }),
    firstValue: 'a',
    second: (m) =>
      m.addCompareItem({
        slug: 'b',
        title: 'B',
        image: { kind: 'catalog-fallback' },
        price: 200,
        reviewCount: 0,
      }),
    secondValue: 'a,b',
    invalid: [
      ['malformed JSON', '{bad'],
      ['over the item limit', JSON.stringify({ items: [1, 2, 3, 4, 5] })],
    ],
  },
  {
    name: 'account',
    url: src('account/accountStore.ts'),
    key: 'goodcall.account.v1',
    subscribe: (m, l) => m.subscribeAccount(l),
    read: (m) => (m.isAccountSignedIn() ? 'in' : 'out'),
    snapshot: (m) => m.getAccountAddresses(),
    empty: 'out',
    first: (m) => m.signInDemoAccount(),
    firstValue: 'in',
    second: (m) => m.signOutDemoAccount(),
    secondValue: 'out',
    invalid: [
      ['malformed JSON', '{bad'],
      ['outdated version', JSON.stringify({ version: 0, signedIn: true })],
    ],
  },
];

const OTHER_KEYS = ['goodcall.cart.v1', 'goodcall.favorites.v1', 'goodcall.compare.v1'];

for (const store of STORES) {
  const label = store.name;
  const storage = fakeStorage();
  const session = fakeStorage();
  const win = fakeWindow(storage);
  const a = await openTab(win, store.url);
  const b = await openTab(win, store.url);
  const event = (key, newValue, storageArea = storage) => ({ key, newValue, storageArea });

  check(
    `${label}: each tab registers exactly one storage listener for the store key`,
    a.handlers.length >= 1 && b.handlers.length === 1,
    `${a.handlers.length}/${b.handlers.length}`,
  );

  let aNotified = 0;
  let bNotified = 0;
  const offA = store.subscribe(a.module, () => {
    aNotified += 1;
  });
  const offB = store.subscribe(b.module, () => {
    bNotified += 1;
  });
  const offExtra = store.subscribe(b.module, () => {});
  offExtra();
  check(
    `${label}: subscribing does not add window listeners`,
    win.handlers.length === a.handlers.length + b.handlers.length,
  );
  check(`${label}: both tabs start at the default state`, store.read(b.module) === store.empty);

  store.first(a.module);
  check(
    `${label}: local write notifies own subscribers once without a storage event`,
    aNotified === 1 && store.read(a.module) === store.firstValue,
    `${aNotified}`,
  );
  check(
    `${label}: other tab keeps its cache until the storage event arrives`,
    store.read(b.module) === store.empty && bNotified === 0,
  );

  let writesBefore = storage.log.set + storage.log.removed.length;
  deliver(b, event(store.key, storage.data[store.key] ?? null));
  check(
    `${label}: remote change notifies other tab once and it re-reads the latest state`,
    bNotified === 1 && store.read(b.module) === store.firstValue,
    `${bNotified} ${store.read(b.module)}`,
  );
  check(
    `${label}: handling a valid remote change writes nothing back`,
    storage.log.set + storage.log.removed.length === writesBefore,
  );

  store.second(b.module);
  deliver(a, event(store.key, storage.data[store.key] ?? null));
  check(
    `${label}: sequential write from the updated tab keeps the earlier change`,
    store.read(a.module) === store.secondValue && store.read(b.module) === store.secondValue,
    `${store.read(a.module)} | ${store.read(b.module)}`,
  );
  check(
    `${label}: originating tab saw one local notification per write`,
    aNotified === 2 && bNotified === 2,
    `${aNotified}/${bNotified}`,
  );

  const stable = store.snapshot(b.module);
  const notifiedBefore = bNotified;
  for (const key of [
    ...OTHER_KEYS.filter((other) => other !== store.key),
    'goodcall.account.v1',
    'goodcall.city.v1',
    'goodcall.lastOrder.v1',
    'unrelated',
  ].filter((other) => other !== store.key)) {
    deliver(b, event(key, 'x'));
  }
  deliver(b, event(store.key, 'x', session));
  deliver(b, event(null, null, session));
  check(
    `${label}: unrelated keys and sessionStorage events are ignored`,
    bNotified === notifiedBefore && store.snapshot(b.module) === stable,
  );

  if (store.name === 'account') {
    store.first(a.module);
    deliver(b, event(store.key, storage.data[store.key]));
  }
  writesBefore = storage.log.set;
  delete storage.data[store.key];
  deliver(b, event(store.key, null));
  check(
    `${label}: remote key deletion → default state, no write-back`,
    store.read(b.module) === store.empty && storage.log.set === writesBefore,
  );

  store.first(a.module);
  deliver(b, event(store.key, storage.data[store.key]));
  delete storage.data[store.key];
  deliver(b, event(null, null));
  check(`${label}: remote clear() → default state`, store.read(b.module) === store.empty);

  for (const [name, raw] of store.invalid) {
    store.first(a.module);
    deliver(b, event(store.key, storage.data[store.key]));
    storage.data[store.key] = raw;
    storage.data['unrelated'] = 'keep';
    storage.log.removed.length = 0;
    let threw = false;
    try {
      deliver(b, event(store.key, raw));
      store.read(b.module);
    } catch {
      threw = true;
    }
    check(
      `${label}: remote ${name} → existing recovery, no throw, no stale cache`,
      !threw &&
        store.read(b.module) === store.empty &&
        !(store.key in storage.data) &&
        storage.log.removed.join() === store.key &&
        storage.data['unrelated'] === 'keep',
      `${store.read(b.module)} ${storage.log.removed.join()}`,
    );
  }

  offA();
  offB();
  const afterOff = bNotified;
  deliver(b, event(store.key, null));
  check(`${label}: unsubscribed listeners are not called`, bNotified === afterOff);
}

{
  const storage = fakeStorage();
  const win = fakeWindow(storage);
  const a = await openTab(win, src('account/accountStore.ts'));
  const b = await openTab(win, src('account/accountStore.ts'));
  a.module.signInDemoAccount();
  const canonical = storage.data['goodcall.account.v1'];
  const padded = JSON.stringify({ ...JSON.parse(canonical), profile: { unknown: true } });
  storage.data['goodcall.account.v1'] = padded;
  storage.log.set = 0;
  deliver(b, { key: 'goodcall.account.v1', newValue: padded, storageArea: storage });
  const recoveredWrites = (b.module.isAccountSignedIn(), storage.log.set);
  deliver(a, {
    key: 'goodcall.account.v1',
    newValue: storage.data['goodcall.account.v1'],
    storageArea: storage,
  });
  a.module.isAccountSignedIn();
  check(
    'account: recoverable remote payload is normalised once and does not ping-pong',
    recoveredWrites === 1 &&
      storage.log.set === 1 &&
      storage.data['goodcall.account.v1'] === canonical,
    `${recoveredWrites}/${storage.log.set}`,
  );
}

{
  delete globalThis.window;
  let threw = false;
  try {
    for (const store of STORES) {
      n += 1;
      const module = await import(`${store.url}?nowindow=${n}`);
      store.read(module);
    }
  } catch {
    threw = true;
  }
  check('stores import and read without a window', !threw);
}

{
  const storage = fakeStorage();
  globalThis.window = { localStorage: storage };
  let threw = false;
  try {
    n += 1;
    const module = await import(`${src('cart/cartStore.ts')}?nolisten=${n}`);
    module.getCartLines();
  } catch {
    threw = true;
  }
  check('stores load when window has no addEventListener', !threw);
}

report(results);
