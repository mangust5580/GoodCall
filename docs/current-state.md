# Current state

Operational handoff. This is not a history log.

## Repository

- Identity: `mangust5580/GoodCall`
- Default branch: `main`
- Current branch: `main`
- Deployment target: GitHub Pages project site (`/GoodCall/`)

## Current milestone

Accepted:

- Global Shell A / Container
- Global Shell B / SiteHeader + MobileActionBar
- Global Shell C / BrandLogo + favicon
- **Global Shell D / NewsletterBand — user visual PASS on 2026-08-27, closed.**
  The PASS covers the accepted state: the violet-to-lavender promotional
  surface, white inverse copy, the mail motif, the grouped email CTA cluster,
  the bright right decorative zone, the revised gift artwork, the mobile
  composition with the gift hidden, and the unchanged form contract.
- **Catalog A / Page Foundation & Layout — user visual PASS on 2026-08-29,
  closed.** Breadcrumbs, title/count geometry, the 250px desktop sidebar, the
  32px sidebar/results gap, heading and sort placement, single-column mobile
  page geometry and shell integration are all accepted.
- **Catalog B / Filters + Mobile Filter Dialog — user visual PASS on
  2026-08-29, closed.** The desktop filter panel, the evidenced filter
  inventory, the quick-filter preset row, the mobile `Фильтры` trigger with its
  active count, and the Radix bottom-sheet dialog with its draft/apply/reset
  model are all accepted. The `Серия` and `Диагональ` taxonomy is raster fixture
  copy, not a future domain contract, and is not to be reworked.
- **Catalog C / Product Grid + Pagination + Sorting — user visual PASS on
  2026-08-30, closed.** The accepted state includes the canonical `ProductCard`
  correction, the dark in-grid promo, the Footer top separation, the `#DC2626`
  sale badge with white text, the Brand local search, the compact
  `★4,5 и выше` rating markers, the responsive mobile filter `Dialog`, and the
  fixture sorting and pagination behaviour.
- **Catalog page family — CLOSED.** Catalog A, B and C all hold explicit user
  visual PASS. Do not reopen Catalog visuals; a routing regression is fixed in
  routing integration, never by redesigning Catalog.
- **Product Details visual milestone (A + B + B1) — user visual PASS on
  2026-09-27, CLOSED.** Covers the primary surface, colour-aware gallery,
  content/trust/payment tabs, review avatars, payment marks, the accepted footer
  payment row and the compact sticky primary header. Reference surface at
  `?reference=product-details`. See the Product Details section below.
- **Product Details Production Integration A + Route scroll fix — user
  visual / UX PASS on 2026-09-27, CLOSED and published.** The specimen-gated
  `#/product/:slug` route reads live commercial fields, and production route
  navigation resets scroll. See the Product Details Production Integration and
  Route scroll sections.
- **Cart A / System Foundation + Empty State — user visual PASS on
  2026-09-27 (desktop and mobile), CLOSED and published.** The production
  `#/cart` empty-cart page. See the Cart A section below.
- **Cart B / Populated Cart — user visual/UX PASS on 2026-09-27 (desktop and
  mobile), CLOSED and published.** `#/cart` opens on a populated Cart-local
  seed and falls back to the Cart A empty state. See the Cart B section below.
- **Search A / Results Page Foundation — user visual/UX PASS on 2026-09-27
  (desktop and mobile results and no-results), CLOSED and published.**
  `#/search?q=…` is the production results route, and the Header search
  submits to it. See the Search A section below.
- **Search B / Faceted Results Foundation — user visual PASS on 2026-09-28
  (desktop), CLOSED and published.** Desktop faceted filters and enriched
  result rows on `#/search?q=…` from 1024px. See the Search B section below.
- **Commerce C / Home Popular Products → Shared Cart — USER VISUAL/UX PASS on
  2026-09-30, CLOSED and published.** Home «Популярные товары» cards add live
  products to the shared cart; cart-enabled product cards remove a line at
  quantity 0. See the Commerce C section below.
- **Comparison A / Local Product Comparison — USER VISUAL/UX PASS on
  2026-09-30, CLOSED and published.** Catalog cards add up to 4 products to a
  local comparison shown on `#/compare`; the fabricated shell count `3` is
  gone. See the Comparison A section below.
- **Order Confirmation A / Demo Order Handoff + Thank-you Page — USER
  VISUAL/UX PASS, CLOSED and published.** A valid Checkout submit records a
  session-only demo order, removes the ordered cart lines and opens
  `#/order-confirmation`. See the Order Confirmation A section
  below.
- **Pickup A / Checkout Pickup Foundation — user visual/UX PASS (desktop 1440
  and mobile 390), CLOSED and published.** Courier or pickup in Checkout; any
  of the six `DEMO_STORES` is selectable as a demo pickup point by stable ID,
  with no availability, pricing or scheduling. See the Pickup A section below.
- **Stores A / Demo Store Dataset + Shops List Page — user visual/UX PASS
  (desktop 1440 and mobile 390), CLOSED and published.** `#/shops` lists the
  six Moscow demo stores from the typed local `DEMO_STORES` dataset (list-only,
  no map, stock or filters). See the Stores A section below.
- **Checkout A / Checkout Page Foundation — user visual/UX PASS on 2026-09-30,
  CLOSED and published.** `#/checkout` over the selected Cart lines, with
  courier delivery, DaData address autocomplete (optional) and a first-class
  manual address fallback. See the Checkout A section below.
- **Search C / Mobile Search Filters — user visual/UX PASS on 2026-09-30
  (desktop and mobile), CLOSED and published.** The mobile filter trigger and
  inset dialog, applied filters at every width and the refined mobile card
  composition on `#/search?q=…`. See the Search C section below.
- **Favourites A / Local Favourites — user visual/UX PASS on 2026-09-30
  (desktop and mobile), CLOSED and published.** Live Catalog and Product
  Details ♥ share one local product-level favourites store, with a real shell
  count and the `#/favorites` page. See the Favourites A section below.
- **Commerce B / Search → Shared Cart — user visual/UX PASS on 2026-09-30
  (desktop and mobile), CLOSED and published.** Live Search results add to
  the Commerce A shared cart on both Search layouts. See the Commerce B
  section below.
- **Commerce A / Shared Cart State A — user visual/UX PASS on 2026-09-30
  (desktop and mobile), CLOSED and published.** Live Catalog and Product
  Details add to one shared, locally persisted cart with a total-unit badge.
  See the Commerce A section below.
- **Blog B / Article Details — user visual PASS on 2026-09-28 (desktop and
  mobile ~390px), CLOSED and published.** `#/blog/how-to-choose-smartphone-2024`
  is the only Blog detail page. See the Blog B section below.
- **Blog A / Blog Listing — user visual PASS on 2026-09-28 (desktop and
  mobile), CLOSED and published.** `#/blog` renders the accepted Blog listing.
  See the Blog A section below.
- **404 A / Designed Not Found — user visual PASS on 2026-09-27 (desktop and
  mobile), CLOSED and published.** Unmatched routes render the designed 404
  in the accepted Global Shell. See the 404 A section below.
- **Home A / Page Structure & Section Inventory — user visual PASS on
  2026-09-27, CLOSED and published.** `#/` renders the accepted Home page with
  the three-slide hero, accepted side offer cards, revised article covers,
  accepted Newsletter/Footer integration and the deferred non-faked
  destinations. See the Home section below.
- Media Foundation / Picture pipeline + Icon policy
- Location Foundation / CitySelector — visual gate, user visual PASS on
  2026-08-27, including the requested danger-red service/geolocation failure
  correction

Open external integration:

- Location live DaData functional verification, pending `DADATA_TOKEN`
  configuration. It is a separate configuration-dependent gate and does not
  block visual shell work.

Accepted as-is:

- **Global Shell E / SiteFooter — accepted as-is for project closeout.** The
  integrated 1440/390 review found no layout, spacing or hierarchy blocker; the
  Footer follows Newsletter correctly with no overflow or collision. The
  production support identity is settled (see the Global Shell E section).
  Unavailable destinations stay plain, non-interactive text until real URLs
  exist; social and app-store destinations remain externally/product blocked.

Technically complete:

- **Routing Foundation — technically complete.** Production path routing is
  owned by React Router using a GitHub Pages-safe hash strategy. See the
  Current routes section below.

Active visual slice: none. Active implementation milestone: none. No next
milestone is approved; select from `docs/master-backlog.md` when requested.

Completed visual slices:

- **WP-01A / Privacy & Demo Stores Truthfulness — USER VISUAL/UX PASS on
  2026-10-10 (user-confirmed review of desktop and mobile Privacy, Shops and
  Contacts), CLOSED and published.** It closes AUD-01 and AUD-02 from
  `docs/master-backlog.md`, using the approved D-03 wording:
  - `#/privacy` discloses the browser-local demo account (`goodcall.account.v1`:
    sign-in flag, saved profile, address book). The data is removed on sign-out;
    cart, favourites, compare and city stay.
  - `#/shops` and the Contacts stores block state that the six GoodCall stores
    are fictional demo pickup points with example addresses and hours, and no
    longer invite visits.
  - The Contacts «Магазины» row note reads «Демо-точки самовывоза · Москва».
  - The Privacy «Последнее обновление» date is 10 October 2026, via the
    optional `LegalDocumentPage.updatedDate` prop. Terms and Offer keep
    4 October 2026.

  `DEMO_STORES`, pickup and storage behaviour are unchanged. The `contacts`
  suite asserts the wording and the legal dates. The rest of WP-01 (WP-01B:
  support phone, store-heading affordance, FAQ/Terms/Offer copy, compare
  retention wording) and store thumbnails remain open and not implemented.

- **Quality G / Breakpoint Off-by-One Correction — USER VISUAL/UX PASS on
  2026-10-10, CLOSED and published.** Closes the Q-08 off-by-one slice only;
  residual Q-08 stays open. See the Quality remediation section below.
- **Quality F / Cart Recommendations from Home Curation — USER VISUAL/UX PASS
  on 2026-10-10, CLOSED and published.** Closes audit item Q-03. See the
  Quality remediation section below.
- **Quality C / Product Presentation Consistency — USER VISUAL/UX PASS on
  2026-10-08, CLOSED and published.** Closes audit items Q-05, Q-06, Q-19 and
  Q-20. See the Quality remediation section below.
- **Quality B / Shared Navigation and Feedback Primitives — USER VISUAL/UX
  PASS on 2026-10-08, CLOSED and published.** Closes audit items Q-04, Q-09,
  Q-10 and Q-21. See the Quality remediation section below.
- **Quality A / Correctness and Document Semantics — USER VISUAL/UX PASS on
  2026-10-08, CLOSED and published.** Closes audit items Q-01, Q-02, Q-11,
  Q-16 and Q-17. See the Quality remediation section below.
- **Second Category A / Ноутбуки — USER VISUAL/UX PASS on 2026-10-08, CLOSED
  and published.** `#/catalog/laptops` with 12 live laptops. See the Second
  Category A section below.
- **Account C / Delivery Addresses — USER VISUAL/UX PASS on 2026-10-08,
  CLOSED and published.** Browser-local demo address book on
  `#/account/addresses`. See the Account C section below.
- **Account B / Orders and Profile Edit — USER VISUAL/UX PASS on 2026-10-08,
  CLOSED and published.** Session-only `#/account/orders` and local demo
  profile editing on `#/account/profile`. See the Account B section below.
- **Account A / Demo Entry, Account Shell and Profile Overview — USER
  VISUAL/UX PASS on 2026-10-07, CLOSED and published.** A truthful demo/local
  account: `#/login` and `#/account`. See the Account A section below.
- **Closeout Polish A — USER VISUAL/UX PASS — CLOSED and published.**
  Storefront truthfulness and copy cleanup on Home, Catalog, Search and PDP.
  See the Closeout Polish A section below.
- **Newsletter Feedback A — USER VISUAL/UX PASS — CLOSED and published.** A
  valid production Newsletter submit shows a truthful local demo
  acknowledgement. See the Newsletter Feedback A section below.
- **Catalog URL State A — USER VISUAL/UX PASS — CLOSED and published.** Live
  `#/catalog/smartphones` applied state lives in the URL. See the Catalog URL
  State A section below.
- **Catalog Live Results A — USER VISUAL/UX PASS — CLOSED and published.**
  Live `#/catalog/smartphones` count, pagination, filters and quick filters. See
  the Catalog Live Results A section below.
- **Persisted Product Image Integration B2 / Order Confirmation — USER VISUAL/UX
  PASS — CLOSED and published.** Product thumbnails on Order Confirmation. See
  the Persisted Product Image Integration B2 section below.
- **Persisted Product Image Integration B1 — USER VISUAL/UX PASS — CLOSED and
  published.** Product thumbnails on Favourites, Cart, Checkout and Compare. See
  the Persisted Product Image Integration B1 section below.
- **Product Thumbnail Integration A — USER VISUAL/UX PASS — CLOSED and
  published.** Product thumbnails on list surfaces. See the Product Thumbnail
  Integration A section below.
- **PDP Media Coverage A / Batch 1 — USER VISUAL/UX PASS — CLOSED and
  published.** Five smartphone PDP galleries. See the PDP Media Coverage A
  section below.
- **Product Details C / «Другие смартфоны» — USER VISUAL/UX PASS — CLOSED and
  published.** Smartphone PDPs. See the Product Details C section below.
- **About A / О GoodCall — USER VISUAL/UX PASS — CLOSED and published.**
  `#/about`. See the About A section below.
- **Legal A / Privacy, Terms and Public Offer — USER VISUAL/UX PASS — CLOSED.**
  `#/privacy`, `#/terms`, `#/offer`. See the Legal A section below.
- **Contacts A / Customer Contacts Page — USER VISUAL/UX PASS — CLOSED.**
  `#/contacts`. See the Contacts A section below.
- **Info A / Customer Help Pages — USER VISUAL/UX PASS granted after manual
  desktop and mobile review — CLOSED.** `#/delivery`, `#/warranty` and
  `#/faq`. See the Info A section below.
- **Product Details Production Integration B / Rich Live Product Pages —
  USER VISUAL/UX PASS granted — implementation/regression gates complete —
  verification harnesses repository-owned and reproducible — final Codex
  commit-readiness gate passed (READY TO COMMIT) — milestone complete.**
  See the Product Details Production Integration B section below.

Closed slices: **Commerce C / Home Popular Products → Shared Cart — USER VISUAL/UX
PASS on 2026-09-30, CLOSED and published.** See the Commerce C section below.
**Comparison A / Local Product Comparison — USER VISUAL/UX PASS on
2026-09-30, CLOSED and published.** See the Comparison A section below.
**Order Confirmation A / Demo Order Handoff + Thank-you Page — USER
VISUAL/UX PASS, CLOSED and published.** See the Order Confirmation A section
below. **Pickup A / Checkout Pickup Foundation — USER VISUAL/UX PASS
(desktop 1440 and mobile 390), CLOSED and published.** See the Pickup A
section below. **Stores A / Demo Store Dataset + Shops List Page — USER VISUAL/UX
PASS (desktop 1440 and mobile 390), CLOSED and published.** See the Stores A
section below. **Checkout A / Checkout Page Foundation — USER VISUAL/UX PASS
on 2026-09-30, CLOSED and published.** See the Checkout A section below. Search C, Favourites A, Commerce B, Commerce A,
Blog B, Blog A, Home A, Cart A, Cart B, Search A, Search B, 404 A and the
Product Details production integration are closed.

### Second Category A — Ноутбуки

**Status: USER VISUAL/UX PASS on 2026-10-08 — CLOSED and published.**

- **Route.** `#/catalog/laptops` is an explicit route (no `/catalog/:category`
  wildcard; `#/catalog/tablets` and other categories stay the designed 404).
  Breadcrumbs «Главная › Каталог › Ноутбуки», h1 «Ноутбуки».
- **Data.** 12 live laptop products in the existing `products` table (category
  `laptops`); no schema change, no `product_images` or `home_popular_products`
  change. The approved seed SQL was executed outside Claude Code through the
  connected Supabase tool in the working ChatGPT session; the live state was
  re-read and verified before implementation. The verify fixture holds the
  same 30 live rows.
- **Read.** `fetchCatalogProducts(categorySlug)` serves `'smartphones'` and
  `'laptops'`. Laptop badges come from live data (sale `-N%`, else
  «Новинка»). Loading, read error and an empty result show route states; there
  is no laptop fixture fallback.
- **Facets.** Цена, Производитель (live `brand`), Диагональ экрана
  (`13-14`/`15-16`/`17+`), Процессор, RAM, SSD, Видеокарта, ОС, Цвет — from a
  typed local facts map keyed by slug (`src/pages/catalog/laptops/laptopFacts.ts`),
  never parsed from names. No availability, rating, quick filters or Серия.
- **URL state.** `brand diagonal cpu ram ssd gpu os colour price_from price_to
sort page` in that order; same push/replace, page-reset, unknown-value,
  unrelated-param and mobile draft/apply rules as smartphones. 12 per page:
  one page, no visible pagination.
- **Catalog family boundary.** Two explicit category consumers. Shared:
  `CatalogListingLayout`, `CatalogFilterGroups`, `CatalogFilterDialogShell`,
  the colour palette, price/sort/page helpers. Smartphone-owned: specimen and
  reference mode, quick filters, in-grid promo, smartphone facets and URL.
  Laptop-owned: facts, facets, filter state, URL state. No universal facet
  engine or category DSL.
- **Navigation.** Header «Ноутбуки» (`SiteHeader.laptopsHref`) and the Home
  «Ноутбуки» tile (`HomePage.laptopsPath`) link to `#/catalog/laptops`; both
  props are optional, so reference output is unchanged.
- **PDP.** 12 laptop entries (`content/laptops.ts`, category `laptops`, six
  spec groups) with provenance in `docs/product-content-sources.md`; the
  `content` suite asserts facts/PDP parity. The category crumb links to
  `#/catalog/laptops`; no laptop related-products section.
- **Media.** All 12 laptops use the laptop category artwork
  (`productThumbnail` → `HOME_DEVICE_MEDIA.laptop`) on Catalog, Cart,
  Favourites, Compare, Checkout, Order Confirmation and the PDP.
- **Search.** Global Search stays smartphone-only by explicit scope;
  cross-category Search is a separate product decision.
- **Verification.** New `laptops` suite (route, facets, URL state, sort,
  cards, navigation, states, downstream media, PDP handoff, responsive,
  reference pixel diffs vs HEAD); `content` extended.

### Account C — Delivery Addresses

**Status: USER VISUAL/UX PASS on 2026-10-08 — CLOSED and published.** The user
explicitly granted USER VISUAL/UX PASS for Account C after review. Address
empty/validation/add/populated/edit/delete states at 1440/390, the limit state
at 1440, the overview address card empty/populated at 1440/390, the compact
shell at 1024 and the Account A/B regression states are agent-verified
(`account` suite and screenshots). Evidence: `Account_profile_address.png`
main area and the `Account_profile.png` address card; the Account A/B shell
and rail stay canonical.

- **Address book.** `#/account/addresses` is an empty-by-default, browser-local
  demo address book: add, edit and delete (with `ConfirmationDialog`) up to 5
  addresses through one inline form; at 5 the add form is replaced by a limit
  note while editing stays available. Fields: recipient, phone, city, address
  line, optional 6-digit postal code — no country, entrance, floor, comment,
  split street/house fields, geocoding or verification. Copy states the
  addresses stay in this browser and are not inserted at checkout.
- **Default.** The first saved address becomes default; «Сделать основным
  адресом» moves it; unchecking the current default keeps it; deleting the
  default promotes the first remaining one. Exactly one default exists while
  any address exists; none when the list is empty.
- **Profile snapshot.** A new address prefills recipient and phone from the
  current profile; saved values are address-local snapshots that later profile
  edits do not change.
- **State.** `goodcall.account.v1` stays version 1; `addresses` and
  `defaultAddressId` are optional additive fields (omitted when empty), so
  Account A/B values stay valid. One merge-based write path: profile saves
  keep addresses/default, address changes keep the profile, and the default is
  normalized atomically with the list (never dangling). Read-time recovery
  drops invalid items individually, keeps the first of duplicate ids, trims to
  5, drops a non-array list and promotes the first address for a dangling
  default — without signing out and keeping a valid profile. IDs come from
  `crypto.randomUUID()` (fallback `getRandomValues`). Logout removes the key;
  cart, favourites, compare, city and the session order are preserved.
- **Routes and rail.** `#/account/addresses` joins the deep-link return
  allow-list; `#/account/addresses/<anything>` is the designed 404. Rail:
  Профиль / Мои заказы / Избранное / Сравнение / Адреса доставки / Выход;
  «Адреса доставки» is active only on `/account/addresses`.
- **Overview.** A third «Адрес доставки» card shows the default address only
  («Изменить адрес») or «Адрес пока не добавлен» («Добавить адрес»), both
  linking to `#/account/addresses`.
- **AddressCard.** Optional `badge`, `deleteLabel`/`onDelete` and
  `actionContext` (unique accessible action names); without them the
  `?reference=components` rendering is pixel-identical.
- **Checkout boundary.** Checkout does not read, offer or prefill Account
  addresses and is unchanged; there is no integration seam or flag.

### Account B — Orders and Profile Edit

**Status: USER VISUAL/UX PASS on 2026-10-08 — CLOSED and published.** The user
explicitly granted USER VISUAL/UX PASS for Account B after review. Orders
empty/populated, profile default/invalid/saved and the integrated overview at
1440/390, the compact shell at 1024 and the Account A regression states are
agent-verified (`account` suite and screenshots). Evidence:
`Account_profile_orders.png` and `Account_profile_edit.png` main columns only;
the Account A shell and rail stay canonical.

- **Boundary.** Still Option B — demo/local-only. No real auth, passwords,
  registration, Supabase Auth, remote profile/order writes or sync.
- **Routes.** `#/account/orders` and `#/account/profile`; other
  `#/account/...` paths reach the designed 404. Signed-out Account deep links
  redirect to `#/login` with router state `{ accountReturn }` and return there
  after demo entry; only `/account`, `/account/orders` and `/account/profile`
  are allowed, anything else falls back to `/account`. No query-param return,
  `replace` redirects, one-time state cleared from history.
- **Orders.** `readDemoOrder()` only: 0 or 1 current-session order in a
  page-owned card (thumbnail, «Демо-заказ №…», «Оформлен», date, count/total,
  payment, «Курьером»/«Самовывоз», address or store) with «Подробнее» →
  `#/order-confirmation`, or «В этой сессии заказов пока нет». No history,
  filters, pagination, pay, reorder, tracking or `#/account/orders/:id`.
  `OrderRow` stays reference-only and unchanged.
- **Profile.** Local demo edit of Имя, Фамилия, E-mail, Телефон, Дата рождения
  (ISO, ≥ 1900-01-01, ≤ today) and optional Пол (Не указан / Мужской / Женский),
  with the Checkout name/e-mail/phone rules duplicated in
  `commerce/account/accountProfile.ts`. Inline errors focus the first invalid
  field; save stays on the page and announces «Изменения сохранены в этом
  браузере». No avatar upload, no unsaved-changes guard.
- **State.** `goodcall.account.v1` stays version 1 with an optional complete
  validated `profile`; defaults come from the persona fixture (now ISO
  `birthDate` and `gender: unspecified`). An invalid profile is dropped and the
  key rewritten to `{"version":1,"signedIn":true}` without signing out. Logout
  removes the key (resetting edits); cart, favourites, compare, city and the
  session order are preserved.
- **Overview and rail.** The greeting and «Личные данные» read the current
  profile (birth date shown `dd.mm.yyyy`); «Редактировать профиль» →
  `#/account/profile`; the Заказы tile links «Подробнее» → `#/account/orders`.
  Rail (Account B): Профиль / Мои заказы / Избранное / Сравнение / Выход —
  extended by Account C; Профиль is active
  on `/account` and `/account/profile`, Мои заказы on `/account/orders`.
  `AccountLayout` in `pages/account/AccountParts.tsx` is the shared page chrome.
- Дата рождения uses the bounded `DateField` month/year selectors (Quality E),
  so any month from January 1900 to the current month is a direct jump.

### Account A — Demo Entry, Account Shell and Profile Overview

**Status: USER VISUAL/UX PASS on 2026-10-07 — CLOSED and published.** The user
visually reviewed desktop and mobile (390) `#/login` and `#/account` and
explicitly granted the pass. Empty/populated overview states, signed-in/out
shell states and 1440/1024/390 responsive sanity are agent-verified (`account`
verify suite and screenshots), not separately user-reviewed. Evidence:
`Login_register.png` and `Account_profile.png` (accepted-shell rasters); the
other Account rasters are a divergent older shell and are not shell evidence.

- **Product boundary.** Option B — demo/local-only account. No real
  authentication, password, registration, social login, Supabase Auth, remote
  profile/order data or remote mutation.
- **Routes.** `#/login` is a one-click «Войти в демо-аккаунт» entry that keeps
  the `Login_register` composition with truthful demo copy. `#/account` is the
  canonical overview. Signed-out `#/account` and signed-in `#/login` redirect
  with `replace`; `#/account/<anything>` reaches the designed 404. Entry focuses
  the overview h1; logout focuses the login h1 and announces «Вы вышли из
  демо-аккаунта» through one-time router state that is cleared from history.
- **State.** `src/commerce/account/` owns `goodcall.account.v1` in localStorage
  (`{"version":1,"signedIn":true}`, guarded; invalid state recovers signed-out
  and is removed). The persona (Иван Иванов, `demo@goodcall.example`,
  `+7 (900) 000-00-00`) is a code fixture, never stored. Logout removes only the
  account key; cart, favourites, compare, city and the session order stay.
- **Overview.** «Демо-профиль» greeting; stat tiles from real local data —
  Избранное/Сравнение counts from the existing stores (links to `#/favorites` /
  `#/compare`) and Заказы 0/1 from the current session demo order only;
  read-only «Личные данные»; «Последние заказы» shows the session order
  («Подробнее» → `#/order-confirmation`) or «В этой сессии заказов пока нет».
  Rail (Account A): Профиль / Избранное / Сравнение / Выход — extended by
  Account B. Bonuses,
  addresses, recently viewed, profile edit and settings are omitted, not
  placeheld. Below 1024px the rail stacks above the content.
- **Shell.** `shellActions` gained `accountLabel` (default «Войти»):
  production passes «Войти» → `#/login` signed out and «Профиль» → `#/account`
  signed in, to both SiteHeader and MobileActionBar. Reference surfaces keep
  «Войти» and the base fallback.
- **Components.** `AccountNavigation` has its first production consumer.
  `AccountStats` gained an optional `layout="tiles"`, `note` and `link`; the
  default list layout stays pixel-identical on `?reference=components`.
- No dependency, Context, state library or future Account schema.

### Closeout Polish A

**Status: USER VISUAL/UX PASS — CLOSED and published.** The user visually
reviewed production Home, Catalog, Search and PDP desktop states and explicitly
granted USER VISUAL/UX PASS. No separate mobile screenshot was supplied; 390
correctness is covered by the verify suites and the explicit pass.

- **Catalog count** uses the existing `formatUnitCount()` (`commerce/cart`), so
  Russian inflection is correct (`1 товар`, `2 товара`, `5 товаров`,
  `21 товар`); the specimen still reads `2 546 товаров`. `aria-live`, filters,
  sort, pagination and URL state are unchanged.
- **Home hero offers** (static, non-linked `HOME_HERO_OFFERS`) match the live
  assortment: iPhone 15 · 128 ГБ, розовый · 79 990 ₽; Samsung Galaxy S24 ·
  128 ГБ, фиолетовый · 75 990 ₽; Apple Watch Series 9 · 45 мм, чёрный ·
  44 990 ₽. Colours mirror the live product names. The third card keeps the
  internal id `apple-watch-se` because it drives the artwork CSS modifier.
- **Live sale badges.** `homeData.ts` and `catalogProductData.ts` each derive the
  sale badge locally from live `price` / `old_price` with the PDP/Cart rounding
  (`-round((old - price) / old × 100)%`), only where the presentation intends a
  sale and only when `old_price > price`; no valid old price means no badge.
  Search inherits the Catalog mapper. `Новинка` is preserved. Specimen/reference
  badge fixtures (`HOME_PRODUCTS`, `CATALOG_PRODUCTS`) are unchanged, and the
  `discounted` quick filter stays price-based.
- **Production header search placeholder** is `Поиск товаров` at every width,
  passed from `ProductionShell` through the existing `searchPlaceholder` seam.
  The `SiteHeader` default (reference surfaces) is unchanged.
- **Production PDP** no longer advertises a non-existent online chat.
  `chatNote` is optional in `ProductDetailsStorewide` / `ProductDetailsView`;
  production storewide data omits it and `ProductOfferSummary` renders the chat
  row only when a note exists. «Нужна помощь?» keeps the canonical phone and
  hours. The reference fixture keeps its chat row, and the Product Details
  reference stays pixel-identical (diff 0 at 1440 and 390).
- No dependency, backend, Supabase query/schema, store, context or route change.

### Newsletter Feedback A

**Status: USER VISUAL/UX PASS — CLOSED and published.** The user visually
reviewed the production Newsletter post-submit state and explicitly granted
USER VISUAL/UX PASS. Desktop post-submit visual evidence was provided; no
separate mobile screenshot was supplied. Responsive mobile correctness is
covered by the verify suite and the explicit user pass.

- **Production.** `NewsletterBand` is still rendered globally through
  `ProductionShell` (unchanged) with no `onSubscribe`. A valid native submit
  shows exactly «Подписка пока не подключена: адрес никуда не отправлен и не
  сохранён.» No email is sent or stored. The input stays uncontrolled and keeps
  its value; the button stays enabled and unchanged; there is no focus move.
- **State.** The only new state is local `statusVisible` in `NewsletterBand`.
  Editing the input hides the status; a repeat submit keeps one unchanged
  status; the next valid submit shows it again. Feedback is ephemeral: it resets
  on route remount and reload. No storage, URL state, context or global store.
- **Accessibility.** One always-mounted `<p role="status" aria-atomic="true">`;
  idle it is empty, `.ui-visually-hidden` and layout-neutral. Native
  `required` / `type="email"` validation remains the only invalid-input
  mechanism; no custom validation, error copy or `role="alert"`.
- **Callback mode.** The API stays `onSubscribe?: (email: string) => void`;
  the callback receives the trimmed email and the built-in demo claim stays
  hidden — the caller owns the outcome (`?reference=newsletter`).
- **Visual.** The status is a full-width in-flow line below the input/button row
  inside `.newsletter-band__content` (`newsletter.scss` only). Idle Newsletter
  remains reference-identical; the shown state is verified at 1440 and 390 —
  input/button rects unchanged, vertical growth only, no overflow, clipping or
  gift overlap.
- No async, loading, error, backend, Supabase change, storage, persistence or
  new dependency.

### Catalog URL State A

**Status: USER VISUAL/UX PASS — CLOSED and published.** The user visually
reviewed the Catalog URL-state milestone and explicitly granted USER VISUAL/UX
PASS. The milestone intentionally introduced no visual redesign; history,
reload and PDP round-trip behaviour is covered by the verify suite, not by
per-state screenshots.

- **Ownership.** On live `#/catalog/smartphones` the URL is canonical for the
  applied state (filters, quick filter, sort, page). `CatalogRoute` parses
  `useSearchParams()` against the live facets once products are `ready` and
  passes `applied` + `onAppliedChange` to `CatalogPage`; the page keeps no
  second live copy. Specimen, pre-ready, fallback and `?reference=catalog` keep
  local state and ignore Catalog params (left untouched).
- **Params** (pure `src/pages/catalog/catalogUrlState.ts`): repeated `brand`,
  `memory`, `colour`, `rating`; `price_from`, `price_to`, `quick`, `sort`,
  `page`. Sort is exactly `popular | cheap | expensive | rating` (no aliases);
  quick is `discounted | under-15000 | 15000-30000 | over-30000`.
- **Validation.** Brand, memory and colour must be exact live facet values;
  rating must be in `CATALOG_RATING_VALUES` (`catalogFilterState.ts`, also the
  source of the sidebar rating options). Prices default when missing or
  invalid, snap to the 1000 step, clamp to 3000–250000 and order ascending.
  Page is a positive integer, else 1; an out-of-range page renders clamped
  without a URL rewrite. Invalid values are ignored; there is no auto-clean on
  load; unrelated params are always preserved.
- **Serialization.** Fixed order brand, memory, colour, rating, price_from,
  price_to, quick, sort, page; list values keep selection order, de-duplicated;
  native `URLSearchParams` encoding (Cyrillic round-trips, space as `+`).
  Defaults (empty lists, 3000/250000, `quick=all`, `sort=popular`, `page=1`) are
  omitted, so the default is the bare route.
- **History.** Checkbox/list changes, quick chips, sort, pagination, resets and
  mobile «Показать» push; sidebar price-only changes (slider, inputs) replace.
  Identical queries are not written. Every refinement drops `page`.
  Back/Forward, reload, shared links and Catalog → PDP → Back restore the
  applied state; render derives from the URL with no write-back effect. No
  custom scroll restoration.
- **Reset** (sidebar and empty state) clears filters, quick filter and page and
  preserves the current sort. The mobile dialog draft stays local; its
  «Сбросить» is draft-only and «Показать» writes once.
- Search URL behaviour is unchanged (no Catalog → Search import). No new
  dependency, query, schema, storage or `CatalogProduct` change.

### Catalog Live Results A

**Status: USER VISUAL/UX PASS — CLOSED and published.** The user visually
reviewed the implemented Catalog states and explicitly granted USER VISUAL/UX
PASS. No screenshot evidence is claimed for every mobile filter-dialog state
(in particular, none for the dialog after colour expansion).

- **Mode.** `CatalogPage` takes `mode: 'specimen' | 'live'` (default
  `specimen`). `CatalogRoute` passes `live` only after `fetchCatalogProducts()`
  is `ready`; before that, on fallback and on `?reference=catalog` the accepted
  specimen stays (`2 546 товаров`, 65 cycling pages, fixture groups, counts and
  all 7 quick chips).
- **Live pipeline.** products → `applyCatalogLiveFilters` →
  `sortCatalogProducts` → matches. The count is the match count; pages are
  `max(1, ceil(n / 12))` with normal non-cycling slices; the page is clamped
  after results shrink and reset to 1 on any filter or quick-chip change.
  Pagination hides at one page.
- **Live filters.** Brand (first title word), price (`priceValue`), memory
  (storage, so `12/256 ГБ` is 256), colour (exact title suffix after the last
  comma) and rating (≥ the lowest selected threshold). Facet values and counts
  come from the full live source set (no disjunctive faceting).
- **Colour facet.** Every parseable live colour is an option. Colours whose
  exact label matches the existing palette keep the swatch; others render as a
  text checkbox row with label and count. No guessed colours, families or
  normalisation; «Показать ещё» covers the full live list.
- **Quick filters.** `Все смартфоны`, `Со скидкой` (`oldPriceValue > priceValue`),
  `До 15 000 ₽` (< 15 000), `15 000 – 30 000 ₽` (≥ 15 000 and < 30 000),
  `30 000 ₽ и выше` (≥ 30 000).
- **Hidden in live mode:** `Серия`, `Диагональ`, `Новинки`, `Хиты продаж`
  (still present in specimen/reference).
- **Empty state and reset.** Zero matches show «Ничего не найдено» with
  «Сбросить фильтры». Sidebar and empty-state reset clear filters, quick chip
  and page. The mobile dialog «Сбросить» still resets the draft only; the
  external quick chip is untouched. Desktop and mobile use the same live facets.
- **Ownership.** `src/pages/catalog/catalogFacets.ts` owns the pure product
  derivation helpers (moved from Search) and the Catalog live helpers. Search
  imports them from `../catalog`; Search behaviour is unchanged.
- No new dependency, query, schema, storage or `CatalogProduct` change; the
  commerce seams and media are untouched.

### Persisted Product Image Integration B2 — Order Confirmation

**Status: USER VISUAL/UX PASS — CLOSED and published.** User explicitly granted
USER VISUAL/UX PASS after reviewing the Order Confirmation thumbnail
integration.

- **Contract.** `DemoOrderLine` gains optional `productSlug`;
  `createDemoOrder` copies `CartLine.productSlug`. `toOrderLine` accepts it with
  the existing optional-field convention (missing → accepted; a present empty or
  non-string value rejects the order, like `variant`).
- **Rendering.** `OrderConfirmationPage` passes the slug to the unchanged
  `CartLineMedia`, inheriting the B1 precedence: stored `url`, stored
  `product-details` colour, `productThumbnail(slug)` for a stored
  `catalog-fallback`, then the SVG. Old session orders without a slug still parse
  and keep the SVG.
- **Storage.** `goodcall.lastOrder.v1` is unchanged: no version bump, no
  migration, and rendering or reload never rewrite the stored order (asserted by
  the order gate). New orders carry `productSlug` on each line. B1 surfaces,
  media and references are unchanged.

### Persisted Product Image Integration B1

**Status: USER VISUAL/UX PASS — CLOSED and published.** User explicitly granted
USER VISUAL/UX PASS after reviewing the B1 persisted-surface thumbnail
rendering.

- **Surfaces.** Favourites, Cart, Checkout and Compare, render-time only.
- **Precedence.** Matched on the stored image kind: stored `url`, then stored
  `product-details` colour hero (legacy pink, black and blue lines stay valid),
  then `productThumbnail(slug)` for a stored `catalog-fallback`, then
  `product-phone.svg`.
- **Wiring.** `CartLineMedia` takes an optional `productSlug` (Cart and Checkout
  pass `line.productSlug`, Compare passes `item.slug`); `FavoritesPage` sets
  `ProductCard.image` only for `catalog-fallback` items.
- **Unchanged.** `CartLine`, `CartLineImage`, `FavoriteItem`, `FavoriteImage`,
  `CompareItem`, `DemoOrderLine`, the storage keys, parsers and legacy parsing,
  and every write path. Rendering and reload never rewrite stored JSON (asserted
  by the cart, favorites and compare gates).
- **Order Confirmation** was left to B2 (see the B2 section).

### Product Thumbnail Integration A

**Status: USER VISUAL/UX PASS — CLOSED and published.** User explicitly granted
USER VISUAL/UX PASS after reviewing the implemented thumbnail integration.

- **Surfaces.** Catalog grid, Search mobile cards, Search desktop rows, the
  Product Details C rail (inherited through `CatalogProductCard`; its order,
  limit, navigation, layout and controls are unchanged) and Home popular
  products.
- **Lookup.** `productThumbnail(slug): PictureSource | undefined` in
  `src/assets/media/product-details/productThumbnailMedia.ts`, with 7 existing
  production sources: the pink `iphone-15-128` hero, the five Batch 1 heroes and
  `apple-watch-series-9-45` (Home only). The black and blue iPhone reference
  sets are excluded. No images were generated and no gallery changed.
- **Precedence.** Live `product_images` URL, then the local thumbnail, then the
  existing fallback (`product-phone.svg` in Catalog, Search and the rail;
  `HOME_DEVICE_MEDIA` on Home). The lookup runs only in the live mappers
  (`catalogProductData.ts` sets `CatalogProduct.image`; `homeData.ts` sets
  `HomeProduct.thumbnail`), so fixtures, `?reference=catalog`,
  `?reference=home` and the Search fixture fallback are unchanged. Search rows
  render `Picture` when `image` is set, with the same row geometry.

### PDP Media Coverage A — Batch 1

**Status: USER VISUAL/UX PASS — CLOSED and published.** The user independently
reviewed the generated gallery media and explicitly granted USER VISUAL/UX PASS
without an in-chat screenshot comparison.

- **Scope.** `iphone-15-pro-128`, `galaxy-s24-128`, `xiaomi-14-256`,
  `pixel-8-128` and `oneplus-12-256` each have three product-specific gallery
  images: `heroFront`, `rearCamera` and `frontRearPair`.
- **Ownership.** 15 masters in `src/assets/media/product-details/masters/`,
  derivatives from the existing `npm run media:product-details`, exported as
  `PRODUCT_DETAILS_GALLERY_BY_SLUG` in `productDetailsMedia.ts` (the colour sets
  are unchanged). The five content records gained `media.gallery` only; no
  editorial or warranty image, and `cartImage` stays `catalog-fallback`.
- **Unchanged.** `ProductGallery`, the `ProductDetailsContent`/`View` contracts,
  Product Details C, `?reference=product-details` (0-pixel diff), every card and
  thumbnail surface (Catalog, Search, Home, Favourites, Cart, Checkout, Order,
  Compare) and the persisted commerce image kinds. Product Thumbnail Integration
  A later reuses the heroes on the list surfaces, and Persisted Product Image
  Integration B1 on Favourites, Cart, Checkout and Compare.

### Product Details C — «Другие смартфоны»

**Status: USER VISUAL/UX PASS (desktop 1440, mobile 390, on `iphone-15-128`) —
CLOSED and published.** Evidence: the lower row of `Product_details.png`.

- **Surface.** Production smartphone PDPs only: a section after
  `ProductDetailsSections`, inside the PDP container. The heading is «Другие
  смартфоны», not the raster's «Похожие товары», because there is no
  recommendation or similarity contract. «Смотреть все» → `#/catalog/smartphones`.
- **Data.** `ProductDetailsRoute` reuses `fetchCatalogProducts()` (no new query).
  It keeps the canonical order, excludes the current slug and takes the first 8
  (`RELATED_PRODUCTS_LIMIT`). The read runs once per route lifetime, only for a
  ready smartphone PDP, and is reused across smartphone slugs. Watch and
  headphones PDPs, read failure or an empty result omit the section; there is no
  fixture fallback and no error surface.
- **Ownership.** `ProductRelatedProducts` (`src/pages/product-details/`) renders
  each item with `CatalogProductCard` (`src/pages/catalog/`, the canonical
  `ProductCard` mapping shared with `CatalogProductGrid`). Cart, quantity,
  remove-at-zero, favourites and compare (with `COMPARE_LIMIT`) reuse
  `useCatalogCartSeam`, `useCatalogFavoritesSeam` and `useCatalogCompareSeam`.
  The page family imports nothing from `src/commerce`.
- **Rail.** One horizontal row with native scrolling and scroll-snap: 5 columns
  from 1200px, 3 from 768px, about 1.25 cards below. Prev/next buttons appear
  only on overflow at 768px and up, are natively disabled at the edges, and sit
  below the card toggles. No autoplay, loop, dots or promo card. The rail is the
  containing block for card descendants, so nothing escapes the scroll area.
- **Production-only seam.** `ProductDetailsPage.related` is optional and only
  the route passes it; `?reference=product-details` is unchanged (0-pixel diff
  at 1440 and 390).

### About A — О GoodCall

**Status: USER VISUAL/UX PASS (desktop 1440, mobile 390) — CLOSED and
published.** Evidence: `About.png` (page body only; the production Global Shell
is authoritative).

- **Route.** `#/about` (`ABOUT_PATH`), `AboutRoute` in
  `src/app/routes/InfoRoutes.tsx`; `AboutPage` lives in `src/pages/info/`. It
  renders the shared `Breadcrumbs` directly (`InfoPageHeader` renders it too)
  so the hero can sit between breadcrumb and `h1`.
- **Sections.** Breadcrumb «Главная › О нас», wide hero, `h1` «О GoodCall» with
  the intro, «Как устроен GoodCall», «Что можно сделать на сайте», the «Задача
  проекта» callout, «Возможности сайта» with six cards (Каталог и поиск,
  Сравнение товаров, Избранное, Корзина и демо-заказ, Магазины и самовывоз,
  Поддержка) and a CTA strip: «Связаться с нами» → `#/contacts`, «Перейти в
  каталог» → `#/catalog/smartphones`.
- **Truthful content.** Framed as «демонстрационный интернет-магазин
  электроники» describing only existing flows. The compare limit comes from
  `COMPARE_LIMIT`, the store count from `DEMO_STORES.length` and support hours
  from `STOREFRONT_SUPPORT.hours`. There is no About-specific Supabase read and
  no product, brand or category statistic.
- **Deliberate raster deviations.** Current shell; no «Информация» sidebar or
  breadcrumb level; no company history, customer counts, team or people
  imagery, distributors, partnerships, awards, legal identity, 24/7 or blanket
  warranty claims; the raster's «Наша миссия» and «Наши преимущества» become
  «Задача проекта» and «Возможности сайта».
- **Media.** `src/assets/media/about/` (`aboutMedia.ts`): `about-hero.webp`
  (hero), `about-products.webp` («Что можно сделать на сайте») and
  `about-project.webp` («Задача проекта»); «Как устроен GoodCall» reuses
  `contacts/contacts-store-interior.webp`. All are decorative (`alt=""`).
- **Footer.** `SiteFooter.companyLinks` wires only «О нас» in production;
  «Новости» and «Карьера» stay plain, and reference surfaces pass no
  `companyLinks`.

### Legal A — Privacy, Terms and Public Offer

**Status: USER VISUAL/UX PASS — CLOSED.** Evidence: `Privacy_terms.png`,
`Offer.png` (page body only; the production Global Shell is authoritative).

- **Routes.** `#/privacy` (`PRIVACY_PATH`), `#/terms` (`TERMS_PATH`) and
  `#/offer` (`OFFER_PATH`); seams `PrivacyRoute`, `TermsRoute` and `OfferRoute`
  in `src/app/routes/InfoRoutes.tsx`. The pages live in `src/pages/info/`.
- **Shared pattern.** `LegalDocumentPage` (`LegalParts.tsx`) renders all three:
  `InfoPageHeader`, a «Содержание» nav card beside one document card of
  numbered sections (icon tile, `h2`, text, divider) and an update note. Offer
  adds a disclaimer callout (`intro`) and a «Статус демонстрационного проекта»
  block (`outro`). Contents buttons scroll to and focus the section heading;
  they never touch the URL (no fragment anchors under `HashRouter`) and there is
  no scroll-spy.
- **Sticky contents.** From 1024px the «Содержание» card is `position: sticky`
  below the sticky header (`$legal-sticky-top` 112px, 92px between 1024 and
  1080px, matching the header's height switch). Below 1024px it is a normal
  block above the document. No internal scroller was needed.
- **Truthful content.** Privacy describes only what the code does: local
  storage for cart, favourites, comparison and city; session storage for the
  demo order (no name, phone, e-mail or comments); DaData suggestions, IP city
  detection and opt-in geolocation when configured; read-only Supabase catalogue
  reads; no cookies, analytics or newsletter backend. Terms describe a demo
  storefront with no registration, payment, real order or obligation. Offer
  states that the demo is not a public offer and concludes no sale contract.
  These texts must change when that behaviour changes.
- **Deliberate raster deviations.** Current shell instead of the raster shell;
  no seller, legal entity, address, INN/OGRN, bank or requisites (replaced by
  the demo-status block); no «Правовая информация» breadcrumb level; no cookie,
  152-ФЗ or registration sections; Offer uses the shared vertical document
  pattern instead of the raster's two-column accordion; «Публичная оферта» has
  no forced line break.
- **Footer.** `SiteFooter.legalLinks` wires the three legal labels in
  production; reference surfaces pass no `legalLinks` and keep plain text.

### Contacts A — Customer Contacts Page

**Status: USER VISUAL/UX PASS — CLOSED.** Evidence: `Contacts.png` (page body only; the production Global Shell is
authoritative).

- **Route.** `#/contacts` (`CONTACTS_PATH`), `ContactsRoute` in
  `src/app/routes/InfoRoutes.tsx`; `ContactsPage` lives in `src/pages/info/`.
- **Content.** Breadcrumb, one `h1` and lead (the shared `InfoPageHeader`), a
  full-width contact card (phone, e-mail,
  support hours from `STOREFRONT_SUPPORT`, and the shop count/hours from
  `DEMO_STORES`) beside the decorative store-interior photo
  (`src/assets/media/contacts/contacts-store-interior.webp`), and «Наши
  магазины» with the first three `DEMO_STORES` and a «Все магазины» link to
  `#/shops`.
- **Deliberate raster deviations.** No feedback form, no map, no head-office
  address and no social links — none of these exist
  truthfully. The raster's «Информация» sidebar is omitted: the help pages do
  not share section navigation (FAQ keeps only its own topic filter).
- **Shell.** Header «Поддержка», footer «Контакты» and footer «Поддержка» link to
  `#/contacts`. `SiteHeader.supportLabel` and `SiteFooter.supportLabel` carry the
  production label; reference surfaces keep their raster copy.
- **Support hours.** Production no longer claims 24/7: the shell label is
  «Поддержка», and the Home, Cart and Checkout benefit item is «Поддержка —
  Ежедневно с 9:00 до 21:00» from `STOREFRONT_SUPPORT.hours`.
- **Reference Home.** `HomePage` takes an optional `benefits` prop defaulting
  to the truthful production `HOME_BENEFITS`; `?reference=home` passes its own
  `HOME_SPECIMEN_BENEFITS` (in `src/reference/HomeReference.tsx`) and keeps the
  accepted «Поддержка 24/7 — мы всегда на связи» specimen copy.
- **Verification.** `contacts` suite in `npm run verify`, including production
  vs `?reference=home` benefit copy.

### Info A — Customer Help Pages

**Status: USER VISUAL/UX PASS granted (manual desktop and mobile review),
automated gates green, CLOSED.** Evidence: `Payment.png`, `Warranty.png`, `FAQ.png` (page body
only; the production Global Shell is authoritative).

- **Routes.** `#/delivery` (Доставка и оплата), `#/warranty` (Гарантия и
  возврат) and `#/faq` (Часто задаваемые вопросы), each inside
  `ProductionShell`. Route seams live in `src/app/routes/InfoRoutes.tsx`; pages are
  router-free and take an `InfoLinks` object. Unknown paths still render 404.
- **Shell navigation.** `SiteFooter` gained optional `helpLinks`,
  `paymentMarks` and `support` props. Production passes them; reference
  surfaces pass none and render exactly as before. Only «Доставка и оплата»,
  «Гарантия и возврат» and «FAQ» became links; every other footer item and the
  Header stay unwired.
- **Ownership.** `src/pages/info/` owns the three pages, shared header,
  highlights (wrapping `BenefitsStrip`), notice, check list, CSS/icon
  illustration medallion, support CTA, `faqData.ts` and `faqSearch.ts`.
  `src/commerce/storefront/storefrontFacts.ts` is the single source of truth for
  cross-page storefront facts: payment methods and Checkout payment options,
  support identity, warranty term and trust items.
- **Payment contract.** Canonical methods are the ones Checkout actually
  offers: Банковская карта (МИР; online or on receipt), СБП (online) and
  Наличные (on receipt). `CHECKOUT_PAYMENT_METHODS` is derived from
  `STOREFRONT_PAYMENT_OPTIONS` with identical values, labels and marks.
  Live Product Details, the production footer and the help pages read the
  same contract, so SberPay and T-Pay no longer appear in production. The
  `?reference=product-details` fixture and the default `SiteFooter` keep their
  raster specimen values, so the frozen reference pixel diff stays at 0.
- **Demo support identity.** `8 800 100-10-10`, `support@goodcall.example`
  (reserved domain; `goodcall.ru` resolves to a live server and is not used in
  production), `Ежедневно с 9:00 до 21:00`. The former Product Details phone
  `8 800 100-10-19` survives only in the reference fixture.
- **Content truthfulness.** Delivery uses Checkout facts only: courier
  (any of the next 7 days from tomorrow, the three Checkout intervals) or pickup
  from the six `DEMO_STORES`; no delivery fee is charged; payment is not
  processed. Returns are framed by the consumer-protection law without
  periods or category lists; warranty names the manufacturer as the source,
  gives general «обычно» guidance and states that the term is specified for
  the concrete product (help pages never promise a global duration); repair
  points to manufacturers' authorized service centres and states GoodCall
  runs none. FAQ: 18 entries
  in Заказы, Оплата, Доставка, Возврат и гарантия, Товары. No Account, Auth,
  bonus, order-tracking or password content.
- **Warranty contract.** `STOREFRONT_TRUST` (help pages) says «Официальная
  гарантия — Срок указан для конкретного товара». The 12-month figure is the
  per-product term Product Details shows (`PRODUCT_WARRANTY_TEXT`,
  `PRODUCT_TRUST`), currently the same for every catalogue product.
- **Interaction.** Delivery uses the system `Tabs` (Курьером / Самовывоз,
  arrow-key navigation). Warranty is one sequential journey — Возврат и обмен →
  Гарантия → Ремонт и сервисное обслуживание → support — with a «Разделы
  страницы» button row that scrolls to a section and focuses its heading. FAQ uses `FAQAccordion` (Radix single-open, first answer open),
  `aria-pressed` topic buttons with counts, a client-side search with ё/е
  normalization and an empty state with reset. Its «Не нашли ответ?» support
  block sits under the results, so the workspace height follows the content.
- **Icons.** `shield`, `credit-card`, `banknote` and `info` were added to the
  Icon registry. No raster illustrations were generated; the raster's 3D
  artwork is represented by the CSS/icon medallion.
- **Deliberate normalizations.** System underline `Tabs` on Delivery instead of
  the raster's filled segments; Warranty section navigation instead of tabs;
  the FAQ support card moved from the sidebar to below the results; one bordered `FAQAccordion` surface instead of
  separate cards; the FAQ topic sidebar and chip row merged into one control
  (sidebar ≥1024px, scrolling chips below); delivery methods reduced to the
  two that exist; the raster's prices, 14-day return promise, 24/7 copy,
  Visa/Mastercard/ЮMoney/QIWI/Tinkoff marks and «Аккаунт и бонусы» omitted.
- **Verification.** New `info` suite in `npm run verify` (128 checks,
  including Warranty sequential order and FAQ natural-height assertions).
  `scripts/verify/lib/page.mjs` sends Enter as a real key press so keyboard
  activation of buttons can be tested.
- **Known remaining inconsistency (out of scope).** The Product Details
  «Онлайн-чат» item describes a chat that does not exist. The former 24/7 support
  claims were resolved by Contacts A.

### Product Details Production Integration B — Rich Live Product Pages

**Status: USER VISUAL/UX PASS granted — implementation/regression gates
complete — verification harnesses repository-owned and reproducible — final
Codex commit-readiness gate passed (READY TO COMMIT) — milestone complete.** It
supersedes the specimen gate of Integration A; the accepted Product Details
visual system is reused, not redesigned.

Commit gates run with `npm run verify` (all suites; details in
`scripts/verify/README.md`). The runner builds the working tree and the
reference ref (default `HEAD`) itself, with an empty `VITE_DADATA_TOKEN`, mock
Supabase values and an empty `envDir`, so `.env.local` is never read; a build
that resolves anything else aborts. Do not hand-build regression artifacts: a
PowerShell `$env:VITE_DADATA_TOKEN = ""` build once leaked the real token and
produced a false checkout `87/95` with order/form aborts. Expected Product
Details B gates: content 5020/5020, product-details 310/310 (includes the
frozen reference pixel diff, 0 at 1440 and 390), home-cart 40/40, compare
71/71, compare-store 21/21, search 46/46, cart 51/51, checkout 95/95, order
50/50, form-unconfigured 41/41, favorites 50/51. The favorites failure
«shell: comparison specimen 3 unchanged» was known baseline drift until Quality
A replaced it with a real invariant; configured-mode form and Search C remain
outside the runner.

- **Coverage.** All 18 active products have a production page: 16
  smartphones, `apple-watch-series-9-45` and `airpods-pro-2-usb-c`.
- **Ownership.** Live `products` + `categories` own identity and commercial
  facts (slug, name, brand, category, prices, rating, review count, `is_new`,
  active). Derived values: discount, «Выгода», 36-month installment, the
  smartphones breadcrumb link, the pickup store count (`DEMO_STORES.length`).
  A typed local registry (`productDetailsContent.ts` + `content/*.ts`, typed by
  `productDetailsContent.types.ts`, keyed
  by canonical slug; duplicate slugs throw) owns static attributes,
  highlights, original editorial description and features, specification
  groups with key flags, and optional Tier-1 media.
  `productDetailsStorewide.ts` owns delivery/pickup wording, payment methods,
  installment term, warranty/trust and support copy.
  `buildProductDetailsView(live, content, storewide)` produces the
  router-free `ProductDetailsView` consumed by the existing components.
- **Content policy (B2).** Specifications are externally verified against
  official manufacturer sources; provenance per slug lives in
  `docs/product-content-sources.md`. Editorial copy is original. Category
  templates: smartphones (7 groups), smart watches (7), headphones (6).
- **Routing.** `productDetailsHref(slug)` links only when
  `hasProductDetailsContent(slug)`. The route checks content first (no content
  → «Товар не найден», no read), then reads the live row with its category;
  missing/inactive → not-found, query/config failure → error, content/live
  category mismatch → not-found with a dev-only warning. There is no thin
  fallback page. Catalog, Search, Home popular, Favorites, Comparison and the
  404 popular cards link live products through their existing seams.
- **No fabricated operations.** Production pages render no stock, delivery
  dates, SKU, «Хит продаж», bonus, colour/memory selectors, review cards or
  «Купить в 1 клик». Configuration values from the live name render as a
  static attribute row (`dl.product-attributes`), not as controls. Only live
  «Новинка» renders as a label. Delivery reads «Дата и время — при
  оформлении», pickup «Из 6 магазинов».
- **Reviews.** Summary-only in production (live score, stars, count) with a
  muted note that review texts are not published in the demo storefront.
- **Media.** Tier 1: per-product local media from the content record —
  `iphone-15-128` (its pink five-image gallery, editorial and warranty art)
  and `apple-watch-series-9-45` (one Apple Watch render, master
  `product-details-gallery-apple-watch-s9-black.png`, cropped from the
  repository's own blog Apple Watch render). Tier 2: existing
  `HOME_DEVICE_MEDIA` category artwork (smartphone, earbuds) as one
  decorative image (`alt=""`, section label «Изображение товара»); arrows and
  thumbnails render only for two or more images. Description and warranty fall
  back to text-only layouts without empty media slots. The Apple Watch media
  blocker from user review (generic round-watch artwork) is corrected on the
  product page; Product Details B has USER VISUAL/UX PASS and passed the final
  commit-readiness gate.
- **Commerce.** Product Details adds `cartLineId(slug)` lines (live name, no
  variant text), so they merge with Catalog, Search and Home lines. Legacy
  `iphone-15-128|pink|128` lines stay parseable and are not migrated. ♥ uses
  the canonical slug. Compare stays absent from Product Details.
- **Reference.** `?reference=product-details` keeps the frozen rich fixture
  (selectors, SKU, stock, bonus, review cards, one-click, alternate galleries)
  through a reference adapter onto the same view shape; production never sets
  those fields.
- **No backend, schema or dependency changes.**

### Commerce C — Home Popular Products → Shared Cart

**Status: USER VISUAL/UX PASS on 2026-09-30 — CLOSED and published.** The
PASS covers the Home shelf integration and the shared decrement-to-zero
behaviour. Do not reopen them without a new explicit requirement. Evidence:
`Home.png` «Популярные товары» (full-width «В корзину» on
every card; no ♥ or compare there).

- `HomeProduct` gained numeric `priceValue` / `oldPriceValue` beside the
  formatted strings; `homeData.ts` fills them from `products.price` /
  `old_price`, and the fixtures carry matching numbers.
- `useHomeCartSeam` (`src/app/`) binds only after a successful live Home read
  (live ids are backend slugs). It maps to the existing cart line
  (`cartLineId(slug)`, `productSlug`, title, prices, `url` image when
  `product_images` has one, else `catalog-fallback`), so Home lines merge with
  Catalog, Search, PD, Favorites and Comparison lines; the shell cart count
  follows.
- `HomePage` passes the accepted `ProductCard` cart props: the labelled
  «В корзину» plus, once in the cart, the existing stepper above it, and a
  visually hidden `role="status"` announcement with the Catalog wording.
- **Decrement to zero (shared).** `ProductCard` gained an opt-in
  `allowZeroQuantity` (default `false`): the stepper minimum becomes 0 and
  `onQuantityChange(0)` means «remove this line». Catalog, Search (mobile
  cards), Favorites and Home opt in; their seams map 0 to the existing
  `removeCartLine`, the card returns focus to its «В корзину», and pages
  announce «Товар удалён из корзины: <title>». The Cart page, desktop
  `SearchResultRow`, Product Details and reference surfaces keep min 1.
- Fallback Home data keeps the labelled button visible but disabled; fixture
  ids never reach the cart.
- Not included: ♥ and compare on Home cards, the `Modals.png` add-to-cart
  dialog, Home layout changes, backend/Supabase/dependency changes.

### Comparison A — Local Product Comparison

**Status: USER VISUAL/UX PASS on 2026-09-30 — CLOSED and published.** Do not
reopen the accepted table, card control or shell count without a new explicit
requirement. Evidence: `Account_profile_product comparison.png` (main content,
account rail omitted as in Favorites A); `Modals.png` #1 for the compare
control paired with ♥. `Catalog.png` and `Product_details.png` show no
compare control; the Catalog card control is an approved extension.

- **State** (`src/commerce/compare/compareStore.ts`, `useCompare.ts`):
  `localStorage` `goodcall.compare.v1` as `{ items }`, product-level slug
  identity plus a minimal snapshot (title, image ref, price, old price,
  rating, review count, brand, storage, colour). Cap `COMPARE_LIMIT = 4`,
  insertion order, duplicate or over-cap add is a no-op; malformed JSON, a
  foreign shape, duplicate slugs or more than 4 items clear only this key.
  No category rule, no cross-tab sync.
- **Entry point: Catalog only.** `ProductCard` gained optional
  `onCompareToggle` / `comparePressed` / `compareDisabled` / `compareLabel`;
  a `CompareButton` (native `aria-pressed` icon button) sits under ♥ on the
  media. `useCatalogCompareSeam` binds it after the live read, deriving brand,
  storage and colour with the accepted Search B helpers. At 4/4 inactive
  toggles are disabled with «Сравнение заполнено (4 из 4): …»; active ones
  stay usable. Search, Product Details, Home and Favorites have no control.
- **Shell.** `COMPARISON_COUNT = 3` is removed; `ProductionShell` passes the
  live count and `#/compare` to `SiteHeader` and `MobileActionBar`.
- **Page** (`CompareRoute` → router-free `ComparePage`, `#/compare`):
  breadcrumb «Главная › Сравнение товаров», `h1` «Сравнение товаров» with
  «N из 4», «Очистить все»; a native `<table>` (hidden caption, product
  `th scope="col"` with ×, image, title, price/old price; `th scope="row"`
  labels) with exactly six rows — Цена, Выгода (old − current, else «—»),
  Рейтинг, Бренд, Встроенная память, Цвет — and a per-column «В корзину»
  through the shared cart (merge by `cartLineId(slug)`; the item stays in
  comparison). Removing a column focuses the next (else previous) remove
  button; clearing focuses the empty-state `h1` «Сравнение пусто». The
  top-left header cell is structurally present but visually empty; the page
  bottom padding is `fluid(40, 28)`.
- **Responsive.** The matrix fits at desktop; below that it scrolls inside
  its own wrapper (label ≥120px, columns ≥168px), which becomes a focusable
  `role="region"` only while it overflows. The page never scrolls sideways.
- **Deferred.** Richer spec rows (screen, CPU, RAM, battery, weight…),
  stock/«В наличии», share, highlight/hide-equal, category rules, reorder,
  sticky headers, the Modals #12 header popover, Quick View, Search/PD/Home
  entry points, account/server/cross-tab sync.

### Order Confirmation A — Demo Order Handoff + Thank-you Page

**Status: USER VISUAL/UX PASS — CLOSED and published.** The PASS covers the
whole confirmation flow after the final density polish (desktop and mobile
composition). Evidence: `Thank-you.png`, normalized to a truthful demo (no
account rail). Do not reopen the accepted contract or visual state without a
new explicit requirement.

- **Behaviour summary.** Valid Checkout placement creates a local demo order,
  kept for the browser session only. Exactly the ordered (selected) lines are
  removed once; unselected lines stay. Courier and pickup are both confirmed.
  Direct entry without an order shows a real empty state. Payment is
  descriptive only. There is no backend order, no real payment, no
  e-mail/SMS/tracking and no inventory or store reservation. Customer Account
  is outside this milestone; there is no Admin panel in the product scope.

- **Handoff (replaces Checkout D1).** A valid submit in `CheckoutForm` calls
  `onPlaceOrder(normalizedForm)`; `CheckoutRoute` builds the snapshot with
  `createDemoOrder`, saves it with `saveDemoOrder`, calls the existing
  `removeSelectedCartLines()` and navigates to `ORDER_CONFIRMATION_PATH` with
  `replace`, so Back returns to Cart. `CheckoutForm` stays router-free; a ref
  plus the disabled CTA prevent a double placement.
- **Snapshot** (`src/pages/order-confirmation/demoOrder.ts`): number
  `GC-YYYYMMDD-XXXX` (client-generated), `createdAt`, the selected lines
  (title, variant, image ref, price, oldPrice, quantity), totals, delivery
  method, payment method value, courier `{ address, date (ISO), slot }` or
  `pickupStoreId`. No contact data, comments or DaData IDs.
- **Persistence.** `sessionStorage` `goodcall.lastOrder.v1`, shape-validated
  on read; malformed values are removed. When storage throws, an in-memory
  copy serves the current page (a refresh then shows the empty state).
- **Page** (`OrderConfirmationPage`, `#/order-confirmation`): breadcrumb, one
  focused `h1` «Спасибо! Ваш заказ оформлен», a demo lead, «Номер демо-заказа»,
  a `dl` info strip (date, «Способ оплаты: <label>», method, address or
  store), the lines list and an «Итого» `dl`, then «Перейти к покупкам»
  (Catalog) and «На главную». Pickup resolves the store via `findStore`, with
  the fallback «Магазин самовывоза», and shows no date, ETA, price or
  availability.
- **Empty state.** Direct entry without a stored order shows «Заказ не
  найден» with Catalog and Home links; the cart is not touched.
- **Omitted by decision.** The account rail, «Смотреть заказ», «Что дальше?»,
  «Отследить заказ», «Доставка Бесплатно», email/SMS/processing copy, any
  payment status, and comments.
- **Deferred.** Real backend orders and Supabase order mutation,
  server-generated order numbers, payment execution and transaction status,
  e-mail/SMS, inventory mutation and store reservation, fulfilment statuses
  and tracking, cancellation/refund, Customer Account order history. An Admin
  order-management panel is not in the product scope.

### Pickup A — Checkout Pickup Foundation

**Status: USER VISUAL/UX PASS (desktop 1440 and mobile 390) — CLOSED and
published.** It uses the approved demo contract. Do not reopen the accepted
selector, summary block or switching semantics without a new explicit
requirement.

- **State.** `CheckoutFormState` gains `deliveryMethod: 'courier' | 'pickup'`
  (default courier) and `pickupStoreId: StorePoint['id'] | null`. Display
  data is derived by ID through the Stores-owned `findStore`; Checkout holds
  no copied store data.
- **Delivery method.** «Способ получения» offers «Курьером» and «Самовывоз» as
  native radios in two cards, as in `Checkout.png`.
- **Pickup branch.** «Магазин для самовывоза» replaces «Адрес доставки» and
  «Дата и время доставки». It is a `fieldset` of radio cards for all six
  `DEMO_STORES` (name, address, metro, hours) with the city shown once, and it
  requires «Выберите магазин для самовывоза». Validation and first-invalid
  focus are branch-aware.
- **Summary.** A «Самовывоз» block shows the store name and address; totals
  are unchanged.
- **Switching.** Courier address, DaData state and the date/slot values are
  kept in memory while pickup is active: not rendered, not validated, and not
  in the focus order. The selected store is kept while courier is active.
- **Demo truthfulness.** All six stores are selectable as demo pickup points.
  There is no availability or stock, no pickup price or «Бесплатно», no
  pickup scheduling (store hours are descriptive only), no payment
  restrictions (all four methods stay), and no real order creation (Order
  Confirmation A records a session-only demo snapshot). `/shops`
  stays informational.

### Stores A — Demo Store Dataset + Shops List Page

**Status: USER VISUAL/UX PASS (desktop 1440 and mobile 390) — CLOSED and
published.** Evidence: `Shops.png`, from which the list-only scope is derived.
Do not reopen the accepted list-only adaptation, neutral tiles or metadata strip
without a new explicit requirement.

**Data.** `src/commerce/shops/shopData.ts` owns the canonical store identity:
`StorePoint { id, name, city, address, hours, metro? }` and the typed local
**demo** dataset `DEMO_STORES`.

- It holds the six Moscow stores visible in `Shops.png`: Авиапарк, Европейский,
  Метрополис, РИО Дмитровка, Колумбус, Мегаполис. They have stable slug IDs
  (`moscow-aviapark` …), raster addresses and metro stations, and the hours
  «Ежедневно 10:00 – 22:00».
- It is demo/reference content, not a real store network.
- There are no coordinates, stock, pickup cost or timing, phone or images,
  and no Supabase table.

**Route.** `SHOPS_PATH` (`/shops`) → `ShopsRoute` → the router-free
`StoresPage` inside `ProductionShell`. The Header «Магазины» utility link
points to `#/shops`.

**Page.** A list-only derivation of `Shops.png`:

- breadcrumb, `h1` «Магазины», and the raster lead;
- a static city label and a count derived from the data
  («Найдено 6 магазинов»);
- a semantic list of Stores-owned cards: a neutral store-icon tile, the
  name as `h2`, then address, metro and hours rows;
- a grid of 3/2/1 columns (1440/768/390).

**Deferred and intentionally absent.** Map, pins and route-building; the
stock labels and the «Только магазины с наличием» filter; the metro filter;
the city selector; «Показать ещё»; store photos (only one approved store
image exists, so a consistent neutral tile is used); the «Не нашли магазин
рядом?» promo, which advertises pickup. `CommerceLocationCard` is unchanged.

Stores A supplies the store-identity prerequisite for a future Pickup A.
Pickup is not implemented.

### Checkout A — Checkout Page Foundation

**Status: USER VISUAL/UX PASS on 2026-09-30 — CLOSED and published.** The PASS covers the accepted density scale, the live
DaData address autocomplete (observed working by the user), and the
manual/graceful-degradation address UX. Evidence: `Checkout.png` (desktop
only). The mobile layout is derived.

**Pickup** is delivered separately by Pickup A (see above) as a demo
contract, with no availability, pricing or scheduling.

**Route and handoff.**

- `CHECKOUT_PATH` (`/checkout`) routes to `src/app/routes/CheckoutRoute.tsx`, which
  renders the router-free `src/pages/checkout/CheckoutPage` inside
  `ProductionShell`. Styles live in `checkout.scss`, loaded through
  `global.scss`.
- Cart's `Оформить заказ` is a link to `#/checkout` when at least one line is
  selected. It stays a disabled `Button` otherwise. Cart pricing, selection
  and layout are unchanged.

**Ownership.**

- Checkout reads the shared cart through `useCartLineList()` and shows only
  the selected lines. Totals come from `cartTotals` in `cartPricing.ts`, so
  `К оплате` equals the Cart `Итого`.
- The line image resolver moved unchanged from `CartLineItem` into
  `src/commerce/cart/CartLineMedia.tsx`, now shared by Cart and Checkout.
- Form state is page-local (`CheckoutForm`, `checkoutFormModel.ts`). There is
  no checkout store and no URL state; the only persistence is the Order
  Confirmation A session snapshot written on a valid submit.
- `Город` is prefilled once from the existing public `readStoredCity()` seam;
  otherwise it is empty. Checkout never writes the header city.

**Entry guard.** With no selected lines, the page shows a Checkout-owned state
(`h1` `Оформление заказа`, a message for an empty cart or no selection, and a
`Перейти в корзину` link). It never auto-selects lines.

**Form.**

- Sections: `Контактные данные`, `Способ получения`, `Адрес доставки`,
  `Дата и время доставки`, `Способ оплаты`, `Комментарий к заказу`, built from
  the accepted `TextField`, `PhoneField`, `SelectField`, `TextareaField` and
  `Radio`.
- Fields start empty; the raster's specimen values are not used.
- Courier delivery only; `Самовывоз` is not shown.
- The date is a local choice of the next 7 days, defaulting to `Завтра, …`.
  The time is one of three local intervals. Neither claims availability.
- Payment choices: card online (МИР mark), СБП (СБП mark), card on delivery
  (МИР mark) and cash. They are form choices only; there is no payment
  capability.

**Address flow.** Город → Улица → Дом use one Checkout-owned ARIA combobox,
`CheckoutAddressCombobox`, over the existing DaData owner in
`src/components/location/`. That module adds `createDaDataAddressClient`
(`searchStreets`, `searchHouses`) through the same `suggest/address` request
path. The header city picker and storage are unchanged. There is no new
dependency, provider or proxy.

- **Parent restrictions.** Streets are restricted by `city_fias_id`, or
  `region_fias_id` for federal cities. Houses are restricted by
  `street_fias_id`. Both use street/house `from_bound`/`to_bound`.
- **Minimum query lengths.** City 2, street 1, house 1.
- **Form state.** The form keeps the text plus `cityFiasId`, `cityRegion`,
  `streetFiasId` and `houseFiasId`, together with `addressMode`
  (provider/manual session) and `manualFrom` (the level where the user chose
  «Не нашли? Указать вручную»). No postal code, coordinates or persistence
  are kept.
- **Dependencies.** A dependent field is disabled with a hint until its parent
  is confirmed. Selecting a different city clears street and house; selecting
  a different street clears the house. Typing that diverges clears that
  level's ID and its descendants' IDs. The apartment is never reset.
- **Manual escape.** Every result list, including an empty one, ends with the
  manual option. The chosen level and all lower levels then become plain
  validated text fields.
- **Progressive enhancement.** DaData is optional: Checkout stays fully usable
  with local manual address entry whenever the provider is unavailable.
  - Lookup unconfigured: all address fields are manual.
  - «Ввести адрес вручную» in the address heading (provider mode only) switches
    the whole address to manual. It shows no notice and moves focus to Город.
  - A genuine lookup failure does the same automatically, with the neutral
    notice «Не удалось загрузить подсказки. Адрес можно ввести вручную.».
    Genuine failures are a network error, a non-OK response, a malformed
    street/house response, or no response within 6 s.
  - In every case, text is kept, FIAS IDs are cleared, and DaData is not
    called again for that Checkout mount. There are no retries; a reload tries
    the provider again.
  - Not failures: empty results (the per-field «Не нашли? Указать вручную»
    escape still applies), query-replacement aborts and unmount.
- **Configuration.** Autocomplete needs `VITE_DADATA_TOKEN` in `.env.local`
  locally, or the `DADATA_TOKEN` secret in the Pages build. `.env.local`
  currently has no such key, so local Checkout runs in manual address mode,
  and in dev the console logs that lookup is off. Vite restarts on `.env*`
  changes; reload the page afterwards.
- **Verification status.** Live DaData street/house behaviour is **not
  verified**: there is no token, and the host is unreachable from the agent
  environment. It is verified with mocked responses only.

**Field constraints.** Validation is page-local and non-destructive; values are
normalized (trim, collapse spaces) only at a valid submit.

- Имя / Фамилия: Unicode letters with space, hyphen or apostrophe.
- Телефон: the accepted `PhoneField` mask, with `autocomplete="tel"`.
- E-mail: `type=email`, basic format.
- Улица: must contain a letter.
- Дом, and Квартира when filled: must contain a letter or digit.
- Comments: 300 and 500 characters, with visible hints.

**Submit contract.** `Подтвердить заказ` validates on the client only:

- the required fields and groups, the complete `PhoneField` mask and the
  e-mail format;
- errors are tied to their fields, and focus moves to the first invalid one;
- **D1 replaced by Order Confirmation A:** a valid form records a local demo
  order, removes the ordered selected lines and replaces the route with
  `#/order-confirmation`. The former status «Данные заполнены…» is gone.

**Shared field change.** The accepted fields gained an optional `error` prop
(through `FieldShell`), which renders `.ui-field__error` and sets
`aria-invalid` and `aria-describedby`. The error text is an AA colour mix of
`--role-state-danger`. Without `error`, the output is unchanged.

**Intentional raster deviations.** Omitted:

- the `Начислим бонусы` card;
- the `Бонусы`, `Промокод` and `Доставка: Бесплатно` rows;
- `Самовывоз`;
- the VISA and Mastercard marks.

Also:

- The `h1` is visually hidden.
- The breadcrumb uses the accepted `›` separator.
- Город, Улица and Дом are dependent DaData comboboxes with a manual escape and
  a manual fallback. There is no local address list.
- The optional fields are labelled «(необязательно)».
- The BenefitsStrip payment note matches the offered methods.
- The BenefitsStrip spans the full width below both columns instead of the
  left column. The raster pairs it with the omitted bonus card.
- Controls use the accepted system scale: 48px height, 15px text and 13px
  labels. Card headings are 18px; the Cart-level summary uses a 22px title, a
  26px total and a 48px CTA. The body keeps the accepted 1440 `Container`, so
  at viewports wider than 1440 it is narrower than the raster's roughly
  1780px canvas.

**Deferred.** Real (server) order creation, payment,
bonuses, promo codes, delivery pricing, pickup, address lookup, account
prefill and saved addresses/cards.

### Search C — Mobile Search Filters

**Status: CLOSED — USER VISUAL/UX PASS on 2026-09-30; published.** Do not
reopen accepted Search filter behaviour or visuals without a new explicit
requirement. The user's manual review accepted:

- desktop Search, unchanged (no regression);
- the responsive Search layouts;
- the mobile card price/action composition and its cart-state geometry;
- the open mobile filter dialog at ~390px after the inset modal-surface
  refinement.

Evidence:

- `Search_result.png` for the facet content;
- the accepted Catalog B mobile filter trigger and bottom sheet for the
  presentation;
- the accepted Search compact and stacked cards for the page.

There is no mobile Search raster, so the presentation is derived.

**Filtering.** `SearchPage` stays the single owner of `draftFilters` and
`appliedFilters`.

- The viewport no longer gates filtering: applied filters narrow the base
  matches at every width, and the «с выбранными фильтрами» summary is
  viewport-independent.
- `facetsViewport` (1024px and up) now chooses only the desktop
  panel-plus-rows presentation.
- With nothing applied, the output is unchanged.
- Applied filters survive resizing across 1024px. A mobile apply also syncs
  the desktop draft.

**Mobile dialog.** `src/pages/search/SearchFilterDialog.tsx` is Search-owned
and mirrors `CatalogFilterDialog`; Catalog is unchanged.

- The Radix trigger pill «Фильтры» shows a count badge when N > 0. Its
  `aria-label` is «Фильтры» or «Фильтры, выбрано: N».
- It opens a bottom sheet: title «Фильтры», close «Закрыть», a scrolling
  body, and a footer with `Сбросить` and `Показать`.
- The body is `SearchFilters layout="dialog"`, a discriminated-union prop. It
  has the same four facets (`Цена, ₽`, `Бренд`, `Цвет`, `Встроенная память`),
  no panel `h2` and no in-panel actions, and uses plain chrome
  (`search-filters--plain`).
- The trigger and dialog render only below 1024px when there are base
  matches. The panel and dialog are never mounted together.

**Semantics (Catalog B parity).**

- Opening seeds the dialog draft from the applied filters. Edits change only
  that draft.
- `Показать` applies the filters, syncs the desktop draft, returns to page 1
  and closes.
- `Сбросить` clears the draft only.
- Close, Escape and overlay discard the draft.
- The desktop panel's immediate reset is unchanged.
- `countActiveSearchFilters` in `searchFacets.ts` counts each brand, colour
  and storage value, plus 1 for an active price range.

**Layout.** `search-page__controls` groups `[Фильтры] + sort` on the header's
right. It renders only when it has content. At 1024px and up it holds only the
sort, and the header geometry is identical to before. At 480px and below the
group takes full width, the trigger stays compact and the sort grows from a
160px basis; at 320px the sort wraps under the trigger.

**Mobile card price/action composition (refined during visual review).**
Below 768px, Search-owned rules in `search.scss` compose the horizontal card
footer as one row: the price is on the left, with the old price stacked under
it (the compact-override precedent), and the `[stepper][cart]` group is on the
right, adjacent with the existing 12px gap.

- The actions row is held at `--control-height`, so the cart button has one
  anchor and the card has one height in both cart states.
- Below 360px the footer deliberately uses two rows (the price row, then the
  right-aligned group) in **both** states, because one row needs about 288px.
- The card is 40px shorter at 360–480px. `ProductCard` is unchanged, and 768px
  and wider is geometrically identical.

**Mobile filter dialog surface (refined during visual review).** The Search
bottom sheet is now an inset modal surface, using Search-owned values that
mirror the accepted feedback-dialog language:

- an inset of `fluid-between(16, 10, 320, 768)` from the viewport sides and
  bottom;
- a 16px radius on all corners, a 1px `--role-border-default` border and the
  existing floating shadow;
- centring with `max-inline-size: 560px` (the Search empty-state measure) and
  `max-block-size: 85dvh`.

The body scrolls inside the rounded surface with a thin, progressively styled
scrollbar and a stable gutter. The overlay, semantics, contents and filter
behaviour are unchanged, and nothing changes from 1024px up.

**Filtered-empty.** Below 1024px, zero filtered results show the existing
`search-filtered-empty` section, extracted to one local constant shared with
desktop, not the generic no-results state. The trigger stays; summary and
sort hide as before.

**Verification (agent checks, not the user PASS).** A headless-Chrome
DevTools run passed 56/56 checks, one of them informational (320px
composition). It ran against a scratch build with test-row Supabase reads,
and it covered:

- desktop 1440 and 1024 header, sort, panel and rows geometry, identical to
  a `HEAD` baseline build;
- mobile card and list sizes, identical to that baseline at
  1023/768/390/320;
- open and close, focus return, and draft, apply, reset and cancel;
- counts 1, 2 and 5; page reset and clamping; sort persistence;
- mobile filtered-empty and its recovery;
- breakpoint crossing, with no stranded modal;
- desktop panel regressions and Search cart regressions;
- no overflow, and a usable dialog down to 320×640.

**Known debt.** The dialog-shell SCSS duplicates Catalog's
(`search-filter-trigger`, `search-filter-dialog`), which is intentional under
the page-local precedent.

**Deferred.** URL-synced filters, a category facet, cross-category search,
autocomplete, a page-size selector, a count in `Показать`, new facet types and
a shared filter-dialog abstraction.

### Favourites A — Local Favourites

**Status: CLOSED — USER VISUAL/UX PASS on 2026-09-30; published.** Do not
reopen accepted favourites behaviour or visuals without a new explicit
requirement. The user's manual review accepted:

- the desktop empty state (~1440px): hierarchy, centring and CTA hierarchy;
- the desktop filled state: `h1` plus count `Chip` plus lead, the grid and
  card composition, the pressed-♥ remove affordance, and the price, old-price
  and cart-action hierarchy;
- the mobile filled state (~390px): one column, and the card image, title,
  price and action layout, with no overflow;
- shell favourites-count synchronization;
- the normalized page without the account sidebar and deferred raster
  controls, with Newsletter and Footer coherent.

Evidence: `Favorites.png` (main content). `Account_profile_favorites.png`
and `Modals.png` #3 are secondary. There is no mobile raster, so mobile
behaviour is derived from the accepted `ProductCard` and the Catalog grid rule.

**Ownership.** `src/commerce/favorites/favoritesStore.ts` is the single owner: a
module store with a listener set, read through `useSyncExternalStore` in
`useFavorites.ts` (`useFavoriteItems`, `useFavoritesCount`). It mirrors the
Commerce A pattern without sharing code with it. There is no Context,
dependency or generic persistence layer, and the cart store is untouched.

**Persistence.**

- Key `goodcall.favorites.v1`, value `{ "items": FavoriteItem[] }`. It is read
  lazily once and written after every mutation, with every storage access
  guarded.
- Items are ordered newest first; re-adding an existing slug is a no-op.
- Validation mirrors the cart: malformed JSON, a foreign shape, a duplicate
  slug or a malformed item empties the list and removes only this key.
- A write failure still updates the in-memory state for the session.
- There is no cross-tab sync and no migration framework; a future shape
  change bumps the key version.

**Identity and snapshot.**

- Identity is the canonical live product slug. It is product-level: Product
  Details colour and memory never change the ♥ state or create a second entry.
- The snapshot holds the slug, the live product name, an image reference
  (`url`, or `catalog-fallback` for the accepted `product-phone.svg`), the
  numeric price and the optional old price. It is captured when the product is
  favourited and not revalidated; removing and re-adding refreshes it.
- Rating, badge, availability, descriptions and variant choices are not
  stored.

**Surfaces.**

- **Catalog:** `src/app/routes/useCatalogFavoritesSeam.ts` provides a
  `CatalogFavoritesSeam` (`isFavorite`, `toggle`) only after the live read.
  This is the same boundary as links and the cart seam. `CatalogProductGrid`
  lost its grid-local favourites state. Fallback and `?reference=catalog`
  cards keep the existing `disabled` treatment and never write.
- **Product Details:** `ProductDetailsRoute` passes a
  `ProductFavoriteBinding` (`pressed`, `onToggle`) through
  `ProductDetailsPage` to `ProductGallery`, replacing its local `useState`.
  The persisted title is the live backend name, not the colour-swapped `h1`,
  and the image is the listing `catalog-fallback`.
  `?reference=product-details` passes no binding, so the ♥ renders
  `disabled`. The gallery layout and `FavoriteButton` are unchanged.
- **Shell:** `ProductionShell` reads `useFavoritesCount()` and passes
  `favoritesHref` `#/favorites` to `SiteHeader` and `MobileActionBar`.
  - The specimen `12` is gone. Zero shows `0`, following the cart convention.
  - The accessible name is `Избранное: N`.
  - The comparison specimen `3` was later replaced by the real count in
    Comparison A.

**`#/favorites` page.** `FAVORITES_PATH` routes to
`src/app/routes/FavoritesRoute.tsx`, which renders the router-free
`src/pages/favorites/FavoritesPage.tsx` inside `ProductionShell`. Styles live
in `favorites.scss`, loaded through `global.scss`. The page shows:

- a page-local breadcrumb `Главная › Избранное`;
- `h1` `Избранное` with a count `Chip` (`N товаров`, cart plurals);
- the lead «Товары, которые вы добавили в избранное.»;
- a `<ul aria-label="Товары в избранном">` of accepted vertical
  `ProductCard`s on the Catalog grid rule
  `repeat(auto-fill, minmax(228px, 1fr))` / 20px. That gives 5 columns at
  1440, 3 at 1024, 2 at 768 and 1 at 390/320.

Each card shows the snapshot title, image, price and old price, a pressed ♥
(the only remove affordance) and the shared-cart action and stepper. The
iPhone specimen title links to its product page.

**Cart integration.** `FavoritesRoute` holds a small adapter over the Commerce
A API (`cartLineId(slug)`, `addCartLine`, `setCartLineQuantity`,
`useCartLineList`). The same slug merges with Catalog and Search lines, and
adding to the cart keeps the favourite.

**Empty state and accessibility.**

- The empty state is page-owned, following the Search pattern: a heart disc,
  `h2` «В избранном пока пусто», «Нажимайте ♥ на карточках товаров, чтобы
  сохранить их здесь.», and the links `Перейти в каталог` / `На главную`.
- When empty, the chip and lead are omitted. Since Quality B the empty state is
  the shared `EmptyState` `variant="page"` (`h2`, heart icon).
- Removing a card moves focus to the `h1` when focus would fall to `body`, as
  in the Cart precedent.
- One polite `role="status"` announces removals and cart adds.

**Raster normalization (documented omissions).**

- The account sidebar is omitted; there is no account system.
- Omitted controls: `Поделиться списком`, `Очистить избранное`, select-all,
  bulk delete, sort, per-card checkbox, the red `Удалить` link (the ♥ removes),
  `В наличии`, `Показать ещё` and `Рекомендуем вам`.
- The first lead sentence is kept; «Цены и наличие обновляются регулярно» is
  dropped as untrue.
- The grid is wider than the raster (5 columns at 1440) because there is no
  sidebar.

**Limitations.**

- Device/browser-local only; no account, cross-device or cross-tab sync.
- Snapshot prices are not revalidated.
- Search, Home, 404 and Cart-recommendation cards have no ♥.

**Agent verification (not the user PASS).** A headless-Chrome DevTools run
passed 50/50 checks. It ran against a scratch build whose Supabase reads were
answered with test rows. It covered:

- shell count, link and accessible names;
- Catalog ↔ Product Details ↔ page synchronization, with colour/memory
  stability;
- favourites → Cart merge with Catalog and Search;
- removal focus and announcements;
- the empty state and its links;
- five storage cases;
- fallback and reference disabling;
- cart regressions;
- no overflow at 1440/1024/768/390/320, filled and empty.

**Deferred.** Server, account and cross-tab favourites; Search, Home, 404 and
recommendation ♥; Comparison; share, sort, bulk and show-more; the favourites
mini-modal; availability; recommendations; snapshot revalidation.

### Commerce B — Search → Shared Cart

**Status: CLOSED — USER VISUAL/UX PASS on 2026-09-30; published.** Do not
reopen accepted Search cart behaviour or visuals without a new explicit
requirement. The user's manual review accepted:

- the desktop Search initial `В корзину` action (~1440px);
- the desktop `SearchResultRow` shared stepper plus `В корзину` state after an
  add;
- the Search → Cart handoff for the added live product;
- the mobile Search shared-cart states (~390px): an in-cart card with the
  stepper and cart action, and a not-yet-added card with the normal action;
- the surrounding Search layout, Newsletter and Footer, unchanged.

Evidence: `Search_result.png`, which shows `В корзину` under the
price in the row's right column. It is the pre-add state only; the post-add
stepper follows the accepted Catalog pattern. There is no mobile Search
raster, so mobile behaviour is derived from the accepted horizontal
`ProductCard`.

**Shared seam.** `src/app/routes/useCatalogCartSeam.ts` is the Commerce A seam
builder extracted unchanged from `CatalogRoute`. It is called with
`liveProducts: boolean` and returns a `CatalogCartSeam` (`quantityOf`, `add`,
`setQuantity`) only when that flag is true.

- It uses `useCartLineList()`, `cartLineId(product.id)`,
  `addCartLine(…, 1)` and `setCartLineQuantity`, with the Commerce A snapshot:
  slug id, title, `url` or `catalog-fallback` image reference, numeric price
  and old price.
- `CatalogRoute` and `SearchRoute` both call it with
  `products !== undefined`, the same live condition as `productHref`.
- No `cartStore`, Context or dependency change.

**Search.**

- `SearchRoute` passes `cart` to `SearchPage` only after
  `fetchCatalogProducts()` returned `ready`. No extra query was added, and
  query parsing, matching, facets, sort and pagination are unchanged.
- **Below 1024px:** the accepted `ProductCard layout="horizontal"` receives
  `onAddToCart`, `quantity`, `onQuantityChange` and `disabled`. It shows the
  accepted icon cart button, then the shared stepper beside it after an add.
- **From 1024px:** `SearchResultRow` wraps its unchanged price paragraph in
  `search-row__aside` and adds `search-row__actions` under it. These hold the
  existing `QuantityStepper` (after an add) and the labelled `AddToCartButton`
  `В корзину`. The row grid `136px / 1fr / auto` and the media, info and
  price hierarchy are unchanged. The only new styles are the two Search-owned
  flex rules in `search.scss`.
- Fallback results (`CATALOG_PRODUCTS`) render the add control natively
  `disabled`, with no stepper and no cart mutation.
- One visually hidden `role="status"` line in `SearchPage` announces
  «Товар добавлен в корзину: … В корзине: N шт.». Focus does not move.

**Identity.** Search results carry the live slug, so a Search add and a
Catalog add of the same product merge into one line. A Product Details line
(`slug|colour|memory`) stays separate, as accepted in Commerce A. Quantity is
read from the store on every render, so Search, Catalog and Cart always agree.

**Verification (agent checks, not the user PASS).** A headless-Chrome
DevTools run passed 46/46 checks. It ran against a scratch build whose
Supabase reads were answered with test rows. It covered:

- Search add, stepper, badge and announcement;
- Cart handoff: title, price, old price and image;
- Search ↔ Cart quantity agreement;
- the Catalog ↔ Search merge, with Product Details lines kept separate;
- reload persistence;
- fallback disabling on both layouts;
- Search query, sort, pagination, filtered-empty, reset, no-results and
  no-query;
- Catalog, Product Details and Cart regressions;
- no overflow or control spill at 1440/1024/1023/768/390/320.

**Deferred.**

- the raster's row `♥`, `Сравнить` and `В наличии`;
- Home, 404 and Cart-recommendation cart actions;
- the add-to-cart modal;
- Checkout, orders, auth, stock and a server or cross-tab cart.

### Commerce A — Shared Cart State A

**Status: user visual/UX PASS on 2026-09-30; CLOSED and published.** Do not
reopen accepted cart behaviour or visuals without a new explicit requirement.
The user reviewed the flow end to end on desktop and mobile:

- the empty Cart;
- the live Catalog `В корзину` and the shared stepper;
- Catalog → Cart;
- Product Details presentation variant → Cart, as a separate line with the
  correct variant text and image;
- populated Cart prices, discounts and totals;
- reload persistence.

Evidence: `Catalog.png`, `Product_details.png`, `Cart_empty.png`,
`Cart_items.png`. There are no new visuals; the PASS covers behaviour on the
accepted surfaces. There is no commerce mobile raster, so mobile behaviour is
derived from the accepted Catalog, Product Details, Cart and shell patterns.

**Accepted user decisions.**

- The production cart starts empty. `CART_SEED_LINES` is removed; Cart B's
  populated state is reached only through real adds.
- Product Details colour and memory are presentation-level variants. They
  take part in line identity and display, with the one displayed price. They
  are not backend SKUs, stock or per-variant prices.
- Only live-backed Catalog products can enter the cart. Fixture-fallback
  cards keep their layout with the accepted `ProductCard` `disabled`
  semantics.

**Ownership.** `src/commerce/cart/cartStore.ts` is the single cart owner: a
module store with a listener set, read through `useSyncExternalStore` in
`src/commerce/cart/useCartLines.ts` (`useCartLineList`, `useCartUnitCount`,
`useCartLines`). There is no Context, provider, reducer framework or
dependency. Operations:

- add, merging identical identity;
- set quantity, clamped to 1–99 (the `QuantityStepper` range);
- toggle one and toggle all;
- remove one and remove selected.

Totals still come from `cartPricing.ts`.

**Persistence.** The localStorage key is `goodcall.cart.v1`, with the value
`{ "lines": CartLine[] }`. It is read lazily on first use and written after
every mutation.

- Every field is validated. Any of these empties the cart and removes only
  this key:
  - malformed JSON;
  - a foreign shape;
  - an out-of-range quantity;
  - an unknown image kind;
  - a duplicate id.
- Storage errors are swallowed, following the `cityStorage` precedent.
- There is no migration framework; a future shape change bumps the key
  version.
- There is no cross-tab sync.

**Line contract.** `CartLine` has `id`, `productSlug`, `title`, optional
`variant`, `image`, `price`, optional `oldPrice`, `quantity` and `selected`.
`image` is a reference, not a build-hashed URL, so persisted lines survive
redeploys:

- `{ kind: 'url', src }` — a live Storage image URL;
- `{ kind: 'catalog-fallback' }` — the accepted `product-phone.svg`;
- `{ kind: 'product-details', colourId }` — the first gallery image of that
  colour, resolved at render.

**Identity.**

- Catalog: the live product slug.
- Product Details: since Product Details Integration B, also the live product
  slug (`cartLineId(slug)`), so it merges with Catalog lines. Legacy
  `slug|colourId|memoryId` lines (e.g. `iphone-15-128|black|256`) from before
  Integration B remain valid stored lines and are not migrated.

**Catalog.**

- `CatalogRoute` builds a `CatalogCartSeam` only after the live read
  succeeds, the same boundary as product links. It passes the seam through
  `CatalogPage` to `CatalogProductGrid`. Since Commerce B, the builder lives
  in `src/app/routes/useCatalogCartSeam.ts`, shared with Search.
- `В корзину` adds one unit. The accepted card stepper then reads and writes
  the shared line.
- Without the seam (fallback or `?reference=catalog`), every card is
  `disabled` and no stepper appears. This also disables the card's local
  favourite.
- Favourites moved to the shared Favourites A owner (see Favourites A).

**Product Details.**

- `ProductDetailsRoute` passes `onAddToCart` to the router-free
  `ProductDetailsPage`. `ProductPurchasePanel` calls it with the selected
  colour, memory and quantity.
- The line captures:
  - the displayed title (`productDetailsTitle`);
  - the variant `Цвет · Память`, e.g. `Чёрный · 256 ГБ`;
  - the displayed price and old price;
  - the selected colour's first gallery image.
- `?reference=product-details` passes no handler, so its button stays inert.
- `Купить в 1 клик` is unchanged and has no behaviour.

**Cart.** `CartRoute` uses the shared `useCartLines()`. `CartPage` and its
accepted A/B behaviour are unchanged. Catalog lines have no variant row,
because Catalog titles already carry the colour and nothing is parsed from
them.

**Badge.**

- `ProductionShell` reads `useCartUnitCount()` (total units, selected or not)
  for `SiteHeader` and `MobileActionBar` on every production route.
- The specimen default `2` and the `cartCount` prop are gone.
- Zero follows the accepted Cart A convention and shows `0`.
- Shell action links that carry a count get an explicit accessible name, such
  as `Корзина: 3`. The unchanged specimen counts get `Сравнение: 3` and
  `Избранное: 12`.
- Reference surfaces keep their static specimen counts.

**Feedback.** Each surface (the Catalog grid and the Product Details purchase
panel) has one visually hidden, polite `role="status"` line. It announces the
added product and the resulting line quantity. Focus does not move. The
`Modals.png` add-to-cart dialog is deferred.

**Truthfulness limits.**

- Device/browser-local only; no account or cross-device cart.
- Price is a snapshot from the originating read, with no revalidation.
- No stock or reservation.
- No real variant SKU or price.
- No order creation. `Оформить заказ` now opens Checkout A, which validates
  only (see Checkout A).
- The Product Details title keeps the backend `128 ГБ` wording while the
  variant line can say `256 ГБ`. That inconsistency is inherited from the
  accepted page and not resolved here.

**Local development.** Live product-backed commerce needs
`VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` in an untracked
`.env.local`. Without them Catalog renders its fixture fallback with disabled
`В корзину`, and `#/product/iphone-15-128` shows its error state. `VITE_*`
values are compiled at build time, so `npm run preview` serves whatever the
last `npm run build` saw. Rebuild after changing env, or use `npm run dev`.

**Agent verification before the PASS.** A headless-Chrome
DevTools run passed 46 checks. It ran against a scratch build whose Supabase
reads were answered with test rows. It covered:

- the fresh empty state;
- Catalog add, stepper and persistence;
- fallback disabling;
- Product Details variant add, merge and separation;
- Cart quantity, select, remove-selected and last-line removal;
- reload restore;
- three corrupt-storage cases, with unrelated keys untouched;
- announcements and accessible names;
- no horizontal overflow on Cart, Catalog and Product Details at
  1440/1024/768/390/320.

The compiled CSS is byte-identical to the previous build.

**Deferred.**

- Checkout, Thank-you and orders;
- payment, promo code, delivery cost and bonuses;
- the add-to-cart modal and quick view;
- Home and recommendation cart actions (Search is covered by Commerce B);
- favourites, comparison and per-line favourites;
- `Найти в корзине`, `Очистить корзину` and `Купить в 1 клик`;
- stock and variant pricing;
- a server cart.

### Blog B — Article Details

**Status: user visual PASS on 2026-09-28 for desktop and mobile (~390px), from
the user's manual full-page review; CLOSED and published.** The earlier user
asset PASS on the same date covers the three generated detail assets. Do not
reopen accepted Blog B visuals or behaviour without a new explicit requirement.
The other eight Blog articles have no detail content, and no further Blog
architecture exists. Evidence: `Blog_details.png` (1920×3360).

- `#/blog/how-to-choose-smartphone-2024` is the only detail page.
  `BLOG_ARTICLE_PATH` (`/blog/:slug`) renders `BlogArticleRoute`, which renders
  the accepted `NotFoundRoute` for every slug without a detail entry (the other
  eight listing slugs and unknown slugs). There is no Blog-specific not-found
  state.
- Content model: `src/pages/blog/blogArticleDetails.ts` is a typed registry
  keyed by slug (`readingMinutes`, `relatedSlugs`, `Body`). It joins the
  single-source Blog A corpus for title, category, date and cover.
  `HowToChooseSmartphone2024Body.tsx` owns the bespoke JSX body. There is no
  CMS, MDX, markdown or block renderer. `blogArticleHref()` in
  `src/app/routePaths.ts` returns an href only for registered slugs, like
  `productDetailsHref()`.
- Copy is transcribed from the raster. Only obvious raster typos are
  normalized (`Выбрайте`, `робота`, `сьемки`, `SG`). The reading time `8 мин на
чтение` is Blog-B-owned detail metadata. It is not added to the Blog A
  corpus.
- `BlogArticlePage` reuses the `blog-page` breadcrumb, `Container`, `Picture`,
  `Icon`, `BlogArticleCard` and the Blog A sidebar panels. Layout: the article
  column plus the 372px sidebar from 1024px, and `Похожие статьи` across the
  full width below. Mobile order is article → related → sidebar. The prose
  measure is capped at 760px.
- Media: byte-identical promotions of the approved `blog-detail-smartphone-5g.png`
  (1200×960), `blog-detail-camera-macro.png` (1600×490) and
  `blog-detail-target.png` (800×800, alpha) into `src/assets/media/blog/`,
  registered as `BLOG_DETAIL_MEDIA` in `blogMedia.ts`. The hero reuses the
  article's Blog A cover. Target art is decorative (`alt=""`).
- Share: real share-intent links (VK, Telegram, WhatsApp, X) built from the
  current page URL, which open in a new tab, plus a `Скопировать ссылку` button
  (Clipboard API, `role="status"` feedback). It uses the X mark, not the
  Twitter bird. The icon registry gained `vk`, `telegram`, `whatsapp`, `x`,
  `link`, `message`, `camera`, `briefcase`, `lightbulb` and `folder`
  monochrome glyphs.
- Sidebar: the search submits to `#/blog?q=…`, and categories are links to
  `#/blog?category=…`. Popular and Latest are the Blog A panels. The current
  article is plain text in Latest.
- `Похожие статьи` are the three raster-evidenced corpus articles (earbuds,
  Apple Watch, battery), shown with corpus metadata. They are not links, and
  there is no `Читать подробнее`. `Смотреть все` → `#/blog`.
- Blog A integration boundary: only the
  `how-to-choose-smartphone-2024` card title (and its `aria-hidden`
  `tabIndex=-1` cover link) and its `Последние статьи` row link to the detail.
  Card design, spacing, badges, dates, search, categories and pagination are
  unchanged.
- Verified at 1440, 390 and 320 with no horizontal overflow, broken images or
  console errors.

### Blog A — Blog Listing

**Status: user visual PASS on 2026-09-28 for desktop and mobile; CLOSED and
published.** The PASS covers the listing, the Blog media family,
search/categories/pagination, the responsive layout, the visible calendar date
metadata, `Популярные статьи`, `Последние статьи` and the Newsletter/Footer
integration. Do not reopen accepted Blog A visuals or behaviour without a new
explicit requirement. Blog B (article details, `#/blog/:slug`) is closed; see the
Blog B section. Evidence: `Blog.png` (1920×3360); only the
ninth article's title, date, category and lead come from `Blog_details.png`.

- `#/blog` renders `BlogRoute` inside the accepted `ProductionShell`:
  page-owned breadcrumb `Главная › Блог`, the hero band (`h1` `Блог GOODCALL`
  with the violet `Блог`, lead copy, decorative art `alt=""`), then a workspace
  of the article grid with a 372px right sidebar from 1024px (`Поиск по блогу`,
  `Популярные статьи`, `Последние статьи`, `Категории`), pagination under the
  grid, and the existing Newsletter and Footer.
- Data: `src/pages/blog/blogArticles.ts` owns the typed Blog-family corpus
  (`slug`, `title`, `excerpt`, `category`, ISO `publishedAt`, `cover`) of nine
  articles, sorted newest-first with corpus order as the tiebreak, plus
  `BLOG_CATEGORIES` and the explicit five-article popular curation. No author,
  reading time, tags, body or Home fixtures. `blogListing.ts` owns filtering,
  search, pagination, the `ru-RU` date formatter (no ` г.` suffix, UTC) and
  counts.
- Categories are the content-type axis only: `Все статьи` plus Сравнения,
  Гайды, Подборки, Новости, Советы, Акции, Обзоры, as `aria-pressed` buttons;
  pressing the active category clears it. Product-topic chips are omitted.
- Search is a bounded case-insensitive match over the local titles and
  excerpts. A filtered view shows a `role="status"` count and
  `Сбросить фильтры`; zero results show a Blog-owned empty state with
  `Показать все статьи`.
- URL state: `category`, `q`, `page`, owned by `BlogRoute` (the `SearchRoute`
  pattern). Changing category or query drops `page`; invalid values fall back
  to defaults; a page beyond the result count renders the last valid page.
  Page change scrolls to the article list.
- Pagination: 8 per page with the accepted `Pagination`; the corpus is 8 + 1,
  so `Обзор MacBook Air M3` is on page 2. Hidden when there is one page.
- Cards are `<article>` with the category `Chip` over a 16:7 cover, `h3`
  title, excerpt and a date row: a 16px brand-violet `calendar` icon, 6px
  gap, 13px muted `<time>`. It follows the Home row layout but is stronger than
  Home's subtle 14px icon, which renders too faint to read. Only the card with a Blog B detail page
  (`how-to-choose-smartphone-2024`) links: its title, plus its cover as an
  `aria-hidden` duplicate. The other cards are not links. No card carries a
  `Читать подробнее` CTA.
- Media: byte-identical promotions of the user-approved asset pass into
  `src/assets/media/blog/` (`blog-article-<slug>.png` 1600×700 ×9 and
  `blog-hero.png` 1774×887), served through `?picture` from the
  `blogMedia.ts` manifest; no generator script is needed because no crops are
  derived. Review evidence stays in the git-ignored `dist/review/blog-a-assets/`;
  `npm run build` empties `dist/`, so it must be restored after a build.
- `Последние статьи` is derived, not authored: the date-sorted corpus minus the
  popular articles, up to five (currently four), non-linked rows with a violet
  `clock` icon, title and `<time>`. Plain «latest five» would duplicate the
  popular curation exactly.
- Responsive: sidebar below 1024px becomes search → categories → articles →
  popular → latest; hero art stacks under the copy below 900px; grid is 1 column below
  620px. No horizontal overflow from 320px to 1920px.
- Deliberate raster deviations: no `Читать подробнее` CTA and no card links
  (Blog B), `Последние статьи` from the corpus in place of the raster's
  `Последние новости` news items (no news domain), content-type categories only plus `Все статьи`, 2 real pages instead of `…10`, one 16:7
  cover ratio, the details article on page 1 and MacBook on page 2, separate
  search and popular panels, the standard `SearchField` and brand `Chip`
  instead of the raster's filled field and translucent badges.
- Home is unchanged; its three articles stay separate from the Blog corpus and
  Home has no link to `#/blog` yet.

### 404 A — Designed Not Found Page

**Status: user visual PASS on 2026-09-27 for desktop and mobile; CLOSED and
published.** Do not reopen it without a new explicit requirement. Evidence:
`404.png` (1920×2713), for composition and information architecture.

- The `*` route renders `NotFoundRoute` inside the accepted `ProductionShell`:
  breadcrumb `Главная › 404`, the lavender hero (decorative gradient `404`,
  the single `h1` `Страница не найдена`, copy, `На главную` primary and
  `Перейти в каталог` secondary links, the `Попробуйте поискать нужный товар`
  search with a product placeholder), the approved illustration, the
  `Возможно, вы ищете` shortcuts and `Вам может понравиться`, then the existing
  Newsletter and Footer. No left rail and no legacy header.
- Hero media: `src/assets/media/not-found/not-found-hero.png`, a byte-identical
  promotion of the user-approved generated candidate 04 (PNG, 1600×1600, alpha,
  no baked background), served through the `?picture` pipeline with `alt=""`.
  The other candidates and the contact sheet stay review evidence under
  `dist/review/404-a-hero-candidates/` and are not production media.
- Shortcuts are real destinations only: `Смартфоны` → `#/catalog/smartphones`,
  `Apple iPhone` → `#/search?q=iPhone`, `Samsung Galaxy` → `#/search?q=Samsung`,
  `Корзина` → `#/cart`.
- Recommendations reuse the Home product curation (`fetchHomeData`, with the
  Home fixtures as fallback) rendered through the existing `ProductCard`, five
  cards, with no cart, favourite or compare actions. Product links appear only
  for backend-sourced products, as on Home.
- Search reuses the existing `#/search?q=` contract through
  `useSearchNavigation`, now shared by the Header and the 404 hero. Blank input
  is a no-op.
- Responsive: art beside the copy from 900px up and below it under 900px;
  shortcuts 4 → 2 → 1 columns; products auto-fill → 1 column under 520px;
  hero actions stack full-width under 480px. No horizontal overflow from 320px
  to 1920px.

Product Details keeps its own compact `Товар не найден` state for unknown slugs.

### Search B — Faceted Results Foundation

**Status: user visual PASS on 2026-09-28 for the current desktop result;
CLOSED and published.** Do not reopen accepted visuals or behaviour. It builds
on the closed Search A, which is unchanged. Evidence: `Search_result.png`, for
information architecture only.

Richer commerce information and actions (see Deferred) are future work, not
part of Search B.

**Scope.**

- The corpus is still the 16 Catalog smartphones: live, or the fixture
  fallback.
- 12 results per page are retained, with no page-size selector.
- The facet panel is desktop-only from 1024px: a 272px filter card, a 24px
  gap and a results panel (one card with divided rows and a pagination
  footer).
- Below 1024px the page keeps the Search A layout. Since Search C, the same
  facets are available through a mobile filter dialog, and applied filters
  work at every width.

**Facets.** All are derived in `src/pages/search/searchFacets.ts` from the
product **title**, the one field identical across live and fixture data:

- **Цена, ₽** — the accepted `RangeSlider`. Bounds come from the query's
  matches, rounded to 1 000 ₽.
- **Бренд** — the first title word; 13 values, matching the live
  `products.brand` column for all 16 products.
- **Цвет** — the text after the last comma; 12 names, shown as a named swatch
  plus the text label.
- **Встроенная память** — the number before `ГБ` (128 or 256).

Options and counts come from the query's base matches. Selection is OR within
a group and AND across groups.

**Omitted:**

- Category (only one real value);
- RAM (in 4 of 16 titles);
- availability (no data);
- a brand search field (13 options).

**State.**

- `SearchPage` holds a draft and an applied `SearchFilterState` in local
  state.
- `Применить` commits the draft and returns to page 1; `Сбросить` clears both.
  Each is genuinely disabled when there is nothing to do.
- Filters are not in the URL. `SearchRoute` keys the page by query, so a new
  search starts unfiltered.
- The count, sort and 12-per-page pagination all operate on the filtered set.

**Filtered-empty.** When the query has matches but the filters leave none, the
sidebar and selections stay, and the results column shows `Ничего не найдено`,
«По текущему запросу и выбранным фильтрам товаров нет.» and
`Сбросить фильтры`. A query with zero base matches keeps the Search A empty
state, with no sidebar.

**Rows.** At 1024px and up, the Search-owned `SearchResultRow` replaces the
horizontal `ProductCard`, whose shared source is unchanged. Each row is 176px
and has:

- a 136px media tile with the badge;
- an 18px bold title (with the existing specimen title link);
- a muted attributes line, `ОЗУ · память · цвет`, from the derived facets,
  with missing parts omitted. RAM appears only when the title carries the
  explicit `N/M ГБ` form (4 of 16); it is never inferred. Brand is omitted
  because every title starts with it;
- the accepted `ProductRating`;
- a right-aligned price stack: the current price, the old price struck below,
  and a derived `Выгода N ₽` line (old − current), shown only when the old
  price exceeds the current price.

No derived percentage is shown, because fixture badges carry their own `-N%`,
which can differ from the rounded value. The badges are left unchanged.

Availability, cart, favourite and compare remain deferred: there is no stock
data, no shared cart state, and no favourites or comparison capability. No
specs are invented. Below 1024px the Search A `ProductCard` rows are
unchanged.

**Disclosure.** Brand and colour show their first 6 options (count, then name
order) plus any selected option. A native `button` with `aria-expanded` and
`aria-controls` toggles `Показать ещё N` and `Скрыть`.

**Ownership.** `src/pages/search/` gains `searchFacets.ts` (pure facet
derivation and filtering, reusable by a later mobile presentation),
`SearchFilters.tsx` and `SearchResultRow.tsx`. There is no global store, service or generic filter
engine, and no dependency.

**Deferred (future work, not Search B blockers):**

- URL-synced filters. Mobile Search filters are delivered by Search C
  (closed);
- Category facet, cross-category search and autocomplete;
- a page-size selector;
- favourites and comparison. Search `В корзину` is delivered by Commerce B
  (closed);
- availability, stock and delivery availability (no data source);
- richer first-class specs and real product imagery (`product_images` is
  empty);
- first-class brand, colour and storage data (brand exists in the DB but is
  unmapped);
- further row enrichment beyond the accepted scope.

### Search A — Results Page Foundation

**Status: user visual/UX PASS on 2026-09-27; CLOSED and published.** Do not
reopen accepted visuals or behaviour.

The PASS covers:

- desktop and mobile results;
- desktop and mobile no-results;
- the current Header search presentation.

Evidence: `Search_result.png`, anatomy only. Its older-generation shell is
obsolete evidence.

**Route and URL ownership.**

- `SEARCH_PATH` (`/search`) and `searchPath(query)` live in `routePaths.ts`.
- The URL shape is `#/search?q=<query>[&sort=<cheap|expensive|rating>][&page=<n>]`.
- The URL owns the query, sort and page. There is no query-state framework:
  `SearchRoute` uses `useSearchParams` directly.
- Defaults are omitted from the URL (`sort=popular`, `page=1`).
- A sort change deletes `page`.
- Invalid `sort` or `page` values fall back to popular / 1.
- An out-of-range page clamps to the last page.
- Direct entry, reload and Back/Forward all work. `RouteScrollReset` is
  unchanged, so query-only changes do not scroll.

**Header wiring.**

- `ProductionShell` passes `onSearchSubmit` to the existing `SiteHeader`
  seam. It is one `SearchField`, shared by desktop and mobile.
- Submission trims the value and pushes `searchPath(query)` through
  `useNavigate`. Enter and the `Выполнить поиск` button both submit.
- Blank or whitespace input is a no-op: no navigation, focus stays.
- Wiring the seam turns the field's static magnifier into the accepted
  `SearchField` submit button (a 20px glyph in a 34px button, as on
  `?reference=header`). The earlier static glyph drew at 34px because its mask
  ignores the 7px padding. `SiteHeader` CSS is unchanged.

**Data.**

- `SearchRoute` reuses Catalog's unchanged `fetchCatalogProducts()` once per
  mount (the smartphones category), with `CATALOG_PRODUCTS` as the fixture
  fallback — the same philosophy as Catalog.
- The search scope is therefore the current Catalog (16 live smartphones or
  16 fixtures). Other categories are not searchable, because their mapping and
  imagery do not exist.
- No backend schema, query or endpoint was added.
- Results are derived synchronously from the corpus and the URL query, so
  stale results never survive a query change.

**Matching.**

- The query is trimmed and internal whitespace collapsed.
- Matching is a case-insensitive (`ru-RU` locale) substring test on the
  product title only.
- There is no fuzzy, stemming, transliteration, synonym or relevance ranking.

**Results.**

- Breadcrumbs `Главная › Поиск`.
- `h1` `Результаты поиска`, with the summary `По запросу «q» найдено N товаров`.
- The Catalog sort vocabulary and comparators: `Сначала популярные` (default,
  by `popularity_score`), `Сначала дешевле`, `Сначала дороже`, `По рейтингу`.
  They are shown through a Search-local copy of Catalog's Radix `Select`
  markup.
- A `<ul>` of accepted `ProductCard layout="horizontal"`, 12 per page, using
  the accepted `Pagination`.
- From 768px, a Search-owned contextual override in `search.scss` (nested
  under `.search-results`) makes each card one compact row: 112×88 media,
  title and rating in the main area, and prices right-aligned with the price
  above the old price.
- Below 768px the accepted stacked card is unchanged.
- The shared `ProductCard` source was not modified.
- Cards carried no add-to-cart or favourite actions at Search A. Commerce B
  now adds the shared-cart `В корзину` for live results; there are still no
  favourite actions.
- Titles link only through `productDetailsHref` after a live read, so only
  the `iphone-15-128` specimen links.
- Badges use `Chip`.

**No results / no query.**

- A search-icon disc, then `Ничего не найдено` (or `Введите запрос` when `q`
  is absent), with the query quoted.
- Real links: `Перейти в каталог` and `На главную`.
- No sort or pagination is shown.

**Ownership.** `src/pages/search/` holds `SearchPage.tsx`, `searchResults.ts`,
`search.scss` and `index.ts`. `src/app/routes/SearchRoute.tsx` is the route seam. No
Catalog file changed.

**Deferred.**

- filters and facets, the category scope selector;
- autocomplete, suggestions, history, analytics;
- fuzzy, semantic or relevance search, and a search backend;
- cross-category search;
- global cart and favourites state;
- Product Details beyond the specimen;
- a shared `Breadcrumbs` component (now four page-local copies).

### Cart B — Populated Cart

**Status: user visual/UX PASS on 2026-09-27; CLOSED and published.** Do not
reopen accepted visuals or behaviour.

The PASS covers:

- **Desktop:**
  - the two-column items + summary layout;
  - line-item density;
  - the selection, quantity and removal hierarchy;
  - the price hierarchy;
  - the summary weight and the disabled checkout;
  - the fake-free omissions;
  - the transition into Benefits, Recommendations and Newsletter.
- **Mobile:**
  - the narrow line anatomy;
  - the stacked summary, with Benefits following it;
  - the single-column recommendations;
  - no overflow.

Evidence: `Cart_items.png`.

**Ownership.** The page lives in `src/pages/cart/`; the shared cart state,
hook, pricing and line media live in `src/commerce/cart/`. Commerce A replaced
the route-local state and the seed with the shared cart (see Commerce A). The
visuals and transitions below are unchanged.

- `src/commerce/cart/useCartLines.ts` — the hook over the shared `cartStore.ts`;
- `src/commerce/cart/cartPricing.ts` — pure derivation and unit-count formatting;
- `CartLineItem.tsx`, `CartOrderSummary.tsx` and `CartEmptyState.tsx` —
  Cart-local components. `CartEmptyState` holds the accepted Cart A markup,
  moved verbatim.
- `CART_SEED_LINES` was removed by Commerce A; the cart starts empty.

`CartRoute` calls the shared `useCartLines()` and passes the state to the
router-free `CartPage`.

**State.** Since Commerce A the cart is shared and persisted locally. It is
still not a backend Cart. Transitions:

- toggle a line;
- toggle all;
- set quantity (minimum 1; the accepted `QuantityStepper` keeps its default
  maximum of 99);
- remove a line;
- remove selected.

**Derived pricing** (selected lines only):

- line total = price × qty;
- list total = oldPrice × qty, where oldPrice > price;
- discount = Σ (oldPrice − price) × qty;
- `Товары, N шт.` = Σ list-or-current totals;
- `Итого` = Σ price × qty.

With nothing selected, the summary shows `Не выбрано ни одного товара`.

**Badge.** Total units in the cart, selected or not, on every production
route (Commerce A). It reaches `0` with the empty state.

**UI.**

- An `h1` `Корзина` with a unit-count `Chip`.
- `Выбрать все` uses the accepted `Checkbox`, which has no indeterminate state;
  it is checked only when every line is selected.
- `Удалить выбранные` is disabled when nothing is selected.
- Each line shows:
  - a checkbox labelled `Выбрать: …`;
  - a decorative image;
  - the title and a variant line;
  - the accepted `QuantityStepper`, with product-specific labels;
  - a text `Удалить` button labelled `Удалить из корзины: …`;
  - the line total, with the struck list total, a `Chip` discount percentage,
    and a per-unit note when qty > 1.
- After a removal, focus moves to the current `h1`.
- Removing the last line renders the accepted Cart A empty state,
  pixel-identical to Cart A.
- `Популярные категории` renders only in the empty state, matching
  `Cart_items.png`. `BenefitsStrip` and recommendations render once, below
  both states.

**Layout.**

- Summary in a 340px column from 1024px; stacked below that. It is never fixed
  or sticky.
- Lines are one row from 1280px, two rows below that, and three rows below
  560px.

**Omitted instead of faked:**

- `Оформить заказ` renders as a genuinely disabled `Button` when nothing is
  selected. Otherwise, since Checkout A, it links to `#/checkout`.
- The promo code, delivery row, bonus note, payment-method card and
  data-protection note.
- `Найти в корзине`, per-line favourites and `Очистить корзину`.

### Cart A — System Foundation + Empty State

**Status: user visual PASS on 2026-09-27; CLOSED and published.** Do not
reopen accepted visuals.

The PASS covers:

- **Desktop:**
  - the illustration;
  - the empty-state hierarchy;
  - category discovery;
  - the trust strip;
  - recommendation density;
  - the Newsletter/Footer transition.
- **Mobile:**
  - the artwork scale;
  - the stacked actions;
  - the 2×2 categories;
  - the single-column benefits and `ProductCard` stack.

Evidence: `Cart_empty.png`. `Cart_items.png` is planning evidence for the wider
Cart family only.

**Ownership.**

- `src/pages/cart/` holds `CartPage.tsx`, `cartFixtures.ts`, `cart.scss`
  (loaded through `global.scss`) and `index.ts`.
- `src/app/routes/CartRoute.tsx` is the route seam; the route is `#/cart`
  (`CART_PATH`).
- The page is router-free. Its public API is `homeHref` and `catalogHref`.

**Composition,** in order:

1. breadcrumbs `Главная › Корзина`, duplicated page-locally;
2. the illustration `src/assets/marketing/cart-empty.svg`;
3. the `h1` `Корзина пуста` and its copy;
4. `Перейти в каталог` → `#/catalog/smartphones` and `На главную` → `#/`;
5. `Популярные категории`:
   - `Смартфоны` is the only link;
   - `Ноутбуки`, `Наушники` and `Умные часы` are non-interactive items;
   - the list becomes a 2×2 grid at 480px and below;
6. the shared `BenefitsStrip`, between Cart-local hairlines;
7. `Вам может понравиться` — five accepted `ProductCard`s.

**Illustration.** An original, hand-authored gradient SVG, following the
`newsletter-gift.svg` convention. It is decorative (`alt=""`).

**Recommendations.** Superseded by Quality F: the section now reuses the Home
curation (see Quality remediation). `CART_RECOMMENDATIONS` is removed.

**Badge.** `ProductionShell` now reads the shared cart unit count (see
Commerce A).

**Deferred.**

- backend and checkout;
- a recommendations contract;
- a `Смотреть все` link;
- a shared `Breadcrumbs` component.

### Home A — Page Structure & Section Inventory

**Status: user visual PASS on 2026-09-27; CLOSED and published.** Do not reopen
accepted Home visuals or behaviour.

Primary evidence: `Home.png`, 1920x3840. It is the only Home raster; no mobile
or responsive Home raster exists, so responsive behaviour is derived from the
accepted system. The raster maps to the 1440 design space at 1.3333x: its
content spans x 72–1846, i.e. a 1332px content width, which the accepted 1440px
`Container` (1376px inner at 1440) carries without a second container system.

**Ownership.** `src/pages/home/` holds `HomePage.tsx`, `homeProduct.ts` (the
`HomeProduct` card contract and `HomeArtwork`, also used by the 404 page),
`homeFixtures.ts`, `home.scss` and `index.ts`. `src/app/routes/HomeRoute.tsx` composes it inside
`ProductionShell`, and `?reference=home` renders `HomeReference` for visual
review. Public API is exactly `smartphonesPath?: string` — the seam that lets
the route hand Home the one destination that exists.

**Section inventory, in raster order:**

1. Hero — a two-column band: the dominant dark hero banner (a three-slide
   `HomeHeroSlider`, see below) and a 280px column of three compact offer cards
   with small lavender product scenes. Home-owned.
2. Benefits strip — four icon/title/note items, rendered by the shared
   `BenefitsStrip` (`src/components/content/`) from Home's `HOME_BENEFITS`.
3. Promo pair — the light `Новинки от GOODCALL` card and the dark
   `Чёрная пятница` card. Home-owned.
4. Category trio — `Аксессуары`, `Умные часы`, `Наушники и аудиотехника`.
   Home-owned.
5. `Популярные категории` — eight circular icon tiles. Home-owned.
6. `Популярные товары` — five cards rendered by the accepted `ProductCard`.
7. Cinema promo — a dark full-width-in-container band with a three-point
   checklist. Home-owned.
8. `Последние статьи` — three article cards. Home-owned.
9. `NewsletterBand` and 10. `SiteFooter` — the accepted shell components.

Every section sits inside the accepted `Container`; none is full-bleed. Measured
at 1440 the hero is 474px tall with 250/806/280 columns, the promo pair 300px,
the category trio 195px and the cinema band 298px, all matching the raster's
design-space heights.

**Reuse.** `Container`, `Icon`, `ProductCard`, `BenefitsStrip` (extracted from
Home for Cart A, pixel-identical), `SiteHeader`, `NewsletterBand`,
`SiteFooter`, `MobileActionBar`, the existing colour roles, the `fluid()` and
media helpers, and the `ui-button` control classes. No component was forked. No
`Section`, `SectionHeader`, `CardGrid`, `HomeSection`, `Stack`, `Box` or `Grid`
abstraction was introduced: one raster is not evidence for a generic primitive,
and every Home section is markup in `HomePage` plus `home.scss`.

**Fixtures.** `homeFixtures.ts` is deterministic local presentation content —
category labels, three offer cards, four benefits, three category promos, eight
tiles, five products, three articles and three cinema points. It is not a data
or domain contract, imports nothing from Catalog, and has no `HomeData`,
repository, service, store or query layer.

**Deliberately deferred:**

- `Читать все статьи` in `Последние статьи` links to `#/blog` through the
  narrow `articlesPath` seam (production only; `?reference=home` omits it).
  The popular-products `Смотреть все`, the hero CTA `Смотреть все акции`, the
  promo CTAs and the three `Выбрать` buttons remain **omitted**, because none
  of their destinations exists. This follows the
  accepted Catalog decision to drop the raster's `Смотреть подборку` button for
  the same reason. They return as real links when their routes exist.
- **Hero promotional slider.** The main hero banner is a real Embla slider owned
  by `HomeHeroSlider` (`src/pages/home/HomeHeroSlider.tsx`), which uses
  `useEmblaCarousel` directly with `align: 'start'`, no loop and no plugins. It
  renders the page-local `HOME_HERO_SLIDES` fixture with exactly three slides:
  the accepted smartphone discount hero unchanged, the selected laptop campaign
  as slide 2, and the selected audio campaign as slide 3. Mouse drag and touch
  swipe change slides. Three bottom-centre dot `<button>`s expose
  `aria-current`, keep the system focus ring, use `Перейти к слайду N`
  accessible names, follow Embla's selected snap through `select`/`reInit`, and
  jump without animation under `prefers-reduced-motion`. The slider is a
  labelled `<section>`, and each slide is a `group` labelled `Слайд N из 3`.
  Inactive slides are `inert` and `aria-hidden`, and only the active slide's
  title renders as the page `h1`, so duplicated slide content is not exposed to
  screen readers. The hero geometry, offer column, pagination placement and
  stable height are preserved across the three slides. Arrows, a pause/play
  control, a generic `Carousel` abstraction and remote campaign data are
  intentionally deferred. `?reference=home` stays local and deterministic.
- **Hero autoplay.** `HomeHeroSlider` advances every
  `AUTOPLAY_DELAY_MS` (6000 ms) by calling `scrollTo` with the next index from
  Embla's `selectedScrollSnap()`, wrapping from the last slide to the first. A
  single one-shot `setTimeout` effect owns the timer. Its dependencies are the
  Embla API, the selected index and a derived `autoplayPaused` flag, so any
  slide change (autoplay, dot, drag or swipe) and any pause change clears the
  pending timeout and starts a fresh full delay. There is no interval and no
  second reset path. Autoplay pauses while a mouse pointer hovers the hero,
  while keyboard focus (`:focus-visible`) is anywhere inside it (moving between
  dots does not resume it), while `document.hidden` is true, and during an
  Embla pointer drag. `prefers-reduced-motion: reduce` disables autoplay
  entirely and is re-read live through `matchMedia` change events.
  Reduced-motion dot navigation still jumps instantly. There is no
  `aria-live`, and focus is never moved. No autoplay plugin or other
  dependency was added.
- Artwork. Home now has seven original local marketing raster assets for the
  hero discount banner, hero laptop banner, hero audio banner, new-arrivals
  banner, `Чёрная пятница`, the wearable-tech promo, and the
  entertainment/streaming banner. Their master PNGs live under
  `src/assets/media/home/masters/`, generated desktop/mobile crops and AVIF/WebP
  derivatives live under `src/assets/media/home/derived/`, and
  `src/assets/media/home/homeMarketingMedia.ts` is the Home import manifest.
  Runtime rendering still uses the accepted `vite-imagetools` `?picture`
  pipeline for responsive AVIF/WebP source sets. These images are decorative
  (`alt=""`) because the text content is real HTML.

  A shared master sheet backs the smaller device slots and is cropped by the
  generator rather than stored as one master per slot:
  `home-device-library.png` supplies the six `HomeArtwork` device renders
  (`smartphone`, `earbuds`, `watch`, `headphones`, `laptop`, `tablet`), consumed
  by the hero offer list, the category promos and the Home product cards.
  The three `Последние статьи` covers each have their own master, built from a
  user-approved 1200×300 editorial image, and are wired through
  `HOME_ARTICLE_MEDIA`.
  **Category navigation is normalized system-first.** The accepted `SiteHeader`
  horizontal category row is the single top-level category navigation. The
  `Home.png` hero's vertical category rail is intentionally omitted, because it
  duplicated that row immediately below it, and the main hero banner expands into
  the freed space. `Популярные категории` stays as a separate Home discovery and
  merchandising section, distinct in role from Header navigation: the Header row is
  compact global navigation, the section is visual discovery placed below the
  promotional content. The two category inventories remain separately owned; they
  are not merged into a shared category model.

**Responsive.** Verified at 1440, 1280, 1024, 768, 430, 390 and 320 with zero
horizontal document overflow and no clipped text. The hero is banner plus offer
column down to 900px; below that the banner spans full width with the three
offers in a row, and below 760px the offers stack. Benefits go 4/2/1, the promo
pair collapses to one column below 900px, the category promo trio goes 3/2/1
with its single column below 780px, and the article grid collapses to one
column. Below 560px the hero, promo and cinema artwork moves to a bottom media
band so headings always keep full width.

**Promotional banners share one composition.** The hero, both promo banners, the
three category promo cards and the cinema band all use the same text-left /
visual-right pattern, owned by the `banner-media` and `banner-media-stacked`
mixins in `home.scss`. Artwork is anchored to the card's right edge, bounded to
a share of its width, and faded leftward with a `mask-image` gradient, so the
text side carries no artwork behind it and needs no scrim overlay. The three
category promo cards share a single `home-category-promo__media` slot; there is
no separate contained `__art` image.

**Home raster media — current state.** Home marketing, device and article masters
share one generic electronics language: graphite metal, dark and transparent
glass, controlled studio shadows and a restrained violet rim light. The pipeline
is master PNG → `npm run media:home` (`scripts/build-home-media.mjs`, sharp) →
cropped PNG plus AVIF/WebP derivatives → `homeMarketingMedia.ts` →
`vite-imagetools` `?picture`. A full generator run wipes and rebuilds
`derived/`; scoped runs can regenerate named assets without touching unrelated
derivatives. A full current run produces exactly 225 derivative files. Eleven
masters remain: seven marketing banners, `home-device-library.png` and the
three `home-article-*` masters.

- Devices: six transparent packshots cropped from `home-device-library.png` onto
  one square `900x900` card contract, so the accepted `ProductCard` surface stays
  the only visible product container.
- Article covers: three user-approved `1200x300` (4:1) editorial images.
  Each is stored as a lossless PNG master (pixel-identical to the approved WebP):
  - `home-article-iphone-15.png` → `iphone-15-review`;
  - `home-article-galaxy-s24.png` → `galaxy-s24-first-look`;
  - `home-article-smartwatch-guide.png` → `how-to-pick-a-watch`.

  Each master generates an identity `1200x300` `cover` with widths
  `320/480/640/900/1200` (WebP 88, AVIF 64). `?picture` sources must be
  PNG/JPEG. `.home-article__media` sets `height: auto`, so its declared `4 / 1`
  aspect ratio wins over the `height` attribute that `Picture` emits. The former
  shared `home-article-editorial.png` sheet was removed as an orphan.

- Removed as confirmed orphans: the superseded per-device masters
  `home-device-{smartphone,earbuds,watch,headphones}.png`, which the generator no
  longer reads since the device library sheet replaced them.
- Deliberately preserved: `assets/products/product-phone.svg` is the Catalog
  `ProductCard` fallback for products without Supabase `product_images`;
  `product-earbuds.svg`, `product-laptop.svg`, `marketing/brand-tech.svg`,
  `marketing/promo-sale-bags.svg` and `commerce/store-europeisky.png` back
  `?reference=components`; `marketing/newsletter-gift.svg` belongs to
  `NewsletterBand`; icons, brand, payment and social vectors are shared UI.
- `?reference=home` renders `HomePage` from fixtures and local media only; it
  does not depend on Supabase or remote media.
- Mobile overflow was measured in the DOM at 390 and 320 on `?reference=home`,
  `#/`, `#/catalog/smartphones`, `?reference=catalog` and
  `?reference=components`: `scrollWidth === clientWidth` everywhere, so the
  earlier page-level overflow suspicion is cleared.

No Home layout, banner composition, route, Supabase, Catalog, dependency or
global design-system contract changed in the media work.

### Product Details A + B — Primary Surface, Content, Trust & Payment

**Status: user visual PASS on 2026-09-27; CLOSED and published.** Do not
reopen accepted visuals. Evidence: `Product_details.png`. A covers the
primary surface (breadcrumbs through the purchase panel and offer card). B adds
the lower tabbed content and the key-specification card, above the raster's
`Похожие товары` row, which Product Details C delivers as «Другие смартфоны».

**Ownership.** `src/pages/product-details/` owns `ProductDetailsPage` (the
page `<main>`, breadcrumbs and the three-region grid), `ProductGallery`,
`ProductPurchasePanel`, `ProductOfferSummary`, `productDetailsFormat.ts`,
`productDetailsFixtures.ts` and `product-details.scss`. B adds
`ProductDetailsSections` (tabs, panels and the key-spec card),
`ProductDescription`, `ProductSpecifications` (its `ProductSpecificationList`
serves both the full and the key lists), `ProductReviews`,
`ProductDeliveryPayment`, `ProductWarranty` and `ProductStars` (the half-star
rating shared by the purchase panel and the reviews). The reference surface
`src/reference/ProductDetailsReference.tsx` composes the accepted shell around it,
like Catalog and Home. The production route is described in the Product
Details Production Integration section below. There is no provider, context,
store or product/variant/offer domain model.

**Fixture.** `PRODUCT_DETAILS_FIXTURE` derives `baseTitle` (the title minus its
verified `, Розовый` suffix) and reads price, old price, rating, review count
and the `-6%` badge from the Catalog
`iphone-15-128` entry (`Apple iPhone 15 128 ГБ, Розовый`, 79 990 / 84 990 ₽),
which matches the live Supabase product. Home's differing iPhone 15 specimen
was not used. Fixture-only presentation fields: `sku` `213475`, labels
`Новинка`/`Хит продаж`, `installmentMonths` 36 (the monthly figure is
`ceil(price / 36)` = 2 222 ₽), availability and delivery notes, three colours
(Розовый, Чёрный, Голубой), two memory options (128/256 ГБ), five highlights,
`bonusPoints` 800, a five-image gallery per colour, three service rows and the
support phone, hours and chat note. B added:

- `kind` (`delivery`/`warranty`) on each service row;
- `paymentMethods` (Банковская карта with the МИР mark, СБП with the СБП mark,
  SberPay and T-Pay with their official marks);
- `description` (title, two paragraphs, five features);
- `specificationGroups` (six groups, 21 rows; the 11 rows flagged `key` feed
  the key-spec card);
- three `reviews`;
- `trust` (warranty, original products, exchange and return).

The specifications are real published iPhone 15 values. The review cards are
deterministic specimens. These are presentation specimens, not a backend
schema.

**Behaviour.**

- Gallery: five real thumbnail buttons (`aria-current` plus a thicker purple
  ring) and prev/next arrows that wrap, all driving one active index. The main
  image alt names the photo position. Gallery image changes use a short
  220ms fade/translate/scale animation, and thumbnails, arrows and swatches use
  restrained 200–220ms ease-out state transitions. Under
  `prefers-reduced-motion: reduce`, these non-essential transitions and the
  image animation are removed, with instant state changes and no focus movement.
- `FavoriteButton` reflects shared Favourites A state on the production route
  (product-level slug). It is `disabled` on the reference surface.
- Colour and memory are native radio groups in `<fieldset>`/`<legend>`.
  Colour keeps the selected label in the legend, e.g. `Цвет: Розовый`.
  Swatches use 48px hit targets around 32px visual dots, a restrained
  GoodCall-purple selected ring, a check mark inside the selected swatch and
  related hover/focus/selected states, so selection is never colour-only.
  No icon was added beside the colour label. The selected memory option shows a
  thicker border. Colour selection is now shared by `ProductDetailsPage`,
  `ProductPurchasePanel` and `ProductGallery`: pink, black and blue each use a
  dedicated local five-image gallery set, and changing colour resets the gallery
  to the first image. The same `selectedColourId` drives the `<h1>` and the
  current breadcrumb label via `productDetailsTitle`: the fixture's `baseTitle`
  (the Catalog title with its verified `, Розовый` suffix removed) plus the
  selected colour label. Price, SKU, specs and memory options do not vary by
  colour, because production variant pricing and backend contracts are
  deferred.
- `QuantityStepper` is local.
- On the production route, `В корзину` adds the selected presentation-level
  variant and quantity to the shared cart (Commerce A). `Купить в 1 клик` is a
  real button with no checkout behaviour.
- Lower sections reuse the accepted `Tabs` unchanged: `Описание`,
  `Характеристики`, `Отзывы (1 976)` (the raster's three), plus task-directed
  `Доставка и оплата` and `Гарантия`. Panels are `role="tabpanel"` with
  `hidden` inactive panels, arrow-key roving and no URL sync. The page-scoped
  tab strip does not wrap and scrolls horizontally below its width.
- `Ключевые характеристики` is a persistent right-column `<dl>` card. Its
  `Все характеристики` button selects and focuses the `Характеристики` tab.
- The reviews shell shows the average, stars and count plus three static cards.
  Each card header carries a decorative (`aria-hidden`) 38px circular local
  generated photorealistic raster avatar. The avatar image is `alt=""`, the
  `h3` author name remains the accessible identity, and deterministic initials
  remain only as the local fallback concept. Reviewer names, dates, text and
  ratings remain fixture-owned.
  There is no distribution, submission, pagination or «Все отзывы» /
  «Оставить отзыв» control, because the raster shows none and no destination
  exists.
- Payment is presentation only. Product Details shows four methods:
  Банковская карта, СБП, SberPay and T-Pay. The offer card shows four
  logo-only tiles, МИР, СБП, SberPay and T-Pay (accessible names «Банковская
  карта МИР», «СБП», «SberPay», «T-Pay»), on one row except at the narrowest
  widths. The delivery tab lists the four methods as equal 48px rows with visible labels
  and a fixed 56 × 24px visual slot: МИР/СБП marks and the SberPay and T-Pay
  marks (decorative, 21px tall). Installment stays in a separate box.
- Payment brand assets: the owner-supplied final sources were two local SVGs
  (the temporary source folder has since been removed). `sber-pay.svg` is the
  SberPay compact mark
  (gradient pill with the Sber check and «Pay»). It is
  `src/assets/commerce/payment-sberpay.svg`: an Illustrator export (viewBox
  1000.36 × 479.41) whose gradient is an embedded JPEG. The only change from the
  source is trailing whitespace removed for the repository whitespace check,
  verified pixel-identical in Chromium at 20–479px heights; no geometry, colour
  or metadata cleanup was applied. `t-pay.svg` is byte-identical to the existing
  `src/assets/commerce/payment-tpay.svg`, the T-Pay main logo. T-Bank's
  guideline shows it with «T-Pay» text in method lists; the footer and offer
  tiles use it logo-only by owner decision, while the delivery rows keep the
  visible label beside the mark. No logo was drawn, traced, recoloured or edited.
- The shared footer payment set is МИР, СБП, SberPay and T-Pay marks, all
  logo-only from `src/assets/commerce/`, in one row down to 320px.
- Mir Pay is intentionally omitted from the current UI. The final method set
  must be reconciled with the real acquiring provider; no payment integration
  or SDK exists.
- Warranty and trust content stays presentation-level: the official 12-month
  warranty (the same string as the offer card), «Только официальные поставки»
  (the accepted Home benefit copy), and exchange/return «по условиям
  законодательства о защите прав потребителей». The tab keeps exactly these
  three trust cards and now adds one small decorative trust visual plus a compact
  lead and support-phone row. No legal terms, day counts, service SLAs or return
  policy text are invented.
- There is no mobile sticky purchase bar, because `MobileActionBar` already
  owns the bottom edge below 768px and a second fixed bar would overlap it.

**Responsive.** Three columns (`1.2fr / 1fr / 340px`, 40px gap) from 1200px.
From 768px: gallery and purchase side by side, with the offer card full width
as a 2×2 section grid. Below 768px everything stacks. The lower section places
the tab panel and the 340px key-spec card side by side from 1200px. Below that
the key-spec card follows the panel, with a two-column list from 768px to
1199px. No horizontal overflow at 1440/1024/768/390/320.

**System-first normalizations (visible against the raster).**

- The page stays on the accepted white page surface with bordered cards,
  instead of the raster's grey page and shadowed cards.
- CTAs use the accepted pill `Button` (primary/secondary), not rectangles.
- Labels use the brand `Chip`; the raster's orange `Хит продаж` has no
  accepted role.
- Breadcrumbs keep the Catalog `›` treatment, duplicated page-locally because
  the closed Catalog was not refactored. A shared `Breadcrumbs` extraction is
  now justified and is a follow-up.
- Availability text uses the success-Chip AA colour mix; raw `#22c55e` is about
  2.3:1 on white.
- The only image marks are МИР, СБП, SberPay and T-Pay, the repository-owned
  assets. Other methods are text; VISA, Mastercard and Apple Pay are not shown.
- Description media uses a dedicated improved wide original generated raster,
  composed lower in the source so the existing horizontal media tile keeps the
  phone top and camera area visible with dark graphite/violet headroom and no
  local object-position override. The warranty tab uses one separate generated
  trust visual. Icon usage remains restrained and only uses the existing
  repository icon system:
  delivery, pickup, warranty, original product, exchange/return, support,
  payment fallbacks and description feature tiles carry icons; no icons were
  added to the colour label, memory label, title, rating, review cards or key
  specification rows.

**Omitted instead of faked.** The raster's `+3` thumbnail, the
`Видео`/`360°`/`Доп. фото` row and the installment underline affordance have
no content or destination.

**Product Details media.** Product Details now owns original generated synthetic
local raster media under `src/assets/media/product-details/`: seventeen PNG
masters, Sharp-derived PNG bases, AVIF/WebP responsive derivatives, and three
static generated 256 × 256 WebP review avatars under
`src/assets/media/product-details/reviews/`. The
gallery is colour-aware local fixture behaviour: Розовый, Чёрный and Голубой
each map to a dedicated five-image set with the same view family (front hero,
rear camera, side profile, front/rear pair and camera/material detail). The
black set reuses the current graphite/lavender gallery; pink and blue are fixed
local generated masters, not runtime AI or CSS tinting. Description and warranty
media remain independent editorial/supporting visuals and are not colour-aware;
review avatars are deterministic fixture media and are not part of a user
profile or upload contract. The Product Details media generator remains
deterministic across consecutive runs and does not upscale the generated
masters. The generated review-avatar source originals are session scratch only,
not runtime dependencies. No official Apple imagery, marketplace photography,
third-party product photography, real-person portrait photography, logos or
baked text are used. These assets remain temporary generated media until the
project owns licensed real product photography, if that remains the product
direction. Gallery, description and warranty media use the existing `Picture` /
`vite-imagetools` contract; review avatars use direct local WebP imports.
`npm run media:product-details` regenerates the derived files deterministically.

**Deferred at this milestone (historical; partly delivered later).**

- Delivered later: product pages for every active product (Product Details
  Production Integration A/B); PDP cart and favourites (Commerce A, Favourites
  A); comparison from Catalog and the PDP «Другие смартфоны» cards
  (Comparison A, Product Details C).
- Still unscoped: Supabase image and review reads; the skeleton/loading-state
  system; variant pricing; Compare on the main PDP surface; a reviews backend,
  a payment provider and a delivery estimator; licensed real product imagery
  and remote `product_images`.

The Home latest-article cover visual debt is unrelated and untouched.

### Product Details Production Integration A — specimen-gated route

**Status: user visual / UX PASS on 2026-09-27; CLOSED and published.** The
PASS covers:

- the linked `ProductCard` title;
- the loading, not-found and error route surfaces;
- the live specimen route.

**Superseded by Product Details Production Integration B.** This section records
the narrower specimen gate Integration A originally shipped; it is not current
behaviour. Production now gates `#/product/:slug` and `productDetailsHref()` on
`hasProductDetailsContent(slug)` — the local content registry covering all 18
active products.

**Route.**

- `routePaths.ts` (then `routes.ts`) owns:
  - `PRODUCT_PATH` (`/product/:slug`);
  - `productPath(slug)` (URI-encoded);
  - `productDetailsHref(slug)`, which then returned a hash href only for
    specimen slugs.
- The URL shape is `#/product/iphone-15-128`.
- `src/app/routes/ProductDetailsRoute.tsx` renders inside `ProductionShell` and owns
  the route states, rendered with the shared `RouteStatus` (Quality B).

**Read.** `src/pages/product-details/productDetailsData.ts` makes one query:

- `products.select('slug, name, price, old_price, rating, review_count, is_new, is_active')`;
- filtered by `slug = :slug` and `is_active = true`;
- read with `.maybeSingle()`.

It returns `ready`, `not-found`, `failure` or `unavailable`. A non-finite price
or review count, or a null rating, is a `failure`.

**Specimen gate (original, since removed).** `isProductDetailsSpecimenSlug` in
`productDetailsFixtures.ts` accepted only `iphone-15-128` and was checked before
any request, so every other slug rendered not-found with no backend read.
`productDetailsSpecimenFromLive` overlaid the backend fields on the specimen and
failed closed unless the backend name ended with `, Розовый`. Neither symbol
exists any more.

**Backend-owned fields:**

- the name (h1 and current breadcrumb, with the existing colour swap);
- price and old price;
- rating;
- review count (including the tab label).

`Новинка` shows only when `is_new` is true; the live row is false, so it is
hidden.

Derived fields:

- The discount is `-round((old - price) / old × 100)%`, shown only when old
  price is above price.
- The monthly installment is `ceil(price / 36)`.

`Хит продаж` and every other content, gallery, variant, review, SKU,
availability, delivery and bonus value remain local specimen presentation for
this slug only.

`?reference=product-details` still renders the unmodified fixture. It shows
both labels and makes no network request.

**States.**

- Loading is a compact `<main aria-busy="true">` with a `role="status"` line.
  It is not a skeleton and shows no fixture.
- Not-found (`Товар не найден`, links to Catalog and Home) covers:
  - an unsupported slug;
  - no active row;
  - a specimen identity mismatch.
- Error (`Не удалось загрузить товар`, link to Catalog) covers:
  - missing Supabase configuration;
  - a query failure;
  - a multiple-row result;
  - invalid values.
- There is **no fixture fallback** on the production route.
- An empty `#/product/` falls through to the global `*` fallback.

**Links.**

- `ProductCard` has an optional router-free `href`. When present, only the
  `<h3>` text is wrapped in `a.product-card__link`, with an inherited colour,
  the link-role hover and the standard focus-visible outline. Card geometry is
  unchanged.
- `CatalogPage` and `CatalogProductGrid` take an optional
  `productHref(slug)`, and so does `HomePage`.
- `CatalogRoute` and `HomeRoute` pass `productDetailsHref` only after their
  live read succeeded. As a result:
  - _(superseded)_ at this milestone only the live `iphone-15-128` card
    linked; production now links every registered live product slug (see
    Product Details Production Integration B);
  - fixture-fallback cards never link.

**Live backend facts** (verified read-only outside this repository at task
handoff, 2026-09-27):

- 8 categories;
- 18 products, all active;
- `products.slug` has a UNIQUE constraint;
- `product_images` has 0 rows;
- `home_popular_products` has 5 rows;
- `iphone-15-128` is Розовый, 79 990 / 84 990 ₽, rating 4.7, 1 976 reviews,
  `is_new = false`.

**Readiness facts** (from the preceding audit; the full matrices were in its
local `AUDIT.md`):

- `products` has only list-level columns. There is no SKU, stock,
  description, specification, variant, review-body or delivery data.
- Home's local fallback ids (`galaxy-s24-256`, `redmi-note-13-pro`,
  `airpods-pro-2`, `apple-watch-9-45`) are not backend slugs. Its fallback
  iPhone is `Чёрный`, 64 990 ₽.
- The specimen's specifications, description, highlights, colours, memory
  options, galleries, reviews and SKU are iPhone-specific.

**Deferred at this milestone (historical; partly delivered later).**

- Delivered later: the product content contract and pages for every active
  product (Integration B); the Home iPhone badge now derives `-6%` from live
  prices (Closeout Polish A).
- Still unscoped: interactive variants (per-variant price, SKU and media), stock
  and delivery, review bodies, and `product_images` in `ProductGallery`. The
  skeleton system and Back/Forward scroll restoration remain deferred (see
  Project closeout state).

### Catalog A — Page Foundation & Layout

**User visual PASS received on 2026-08-29, closed.** The PASS covers the
accepted state: breadcrumbs stay, the title/count geometry, the 250px desktop
sidebar, the 32px sidebar/results gap, the heading and sort placement, the
single-column mobile page geometry, and the shell integration. Do not reopen
these decisions unless a later slice exposes a correctness problem.

`src/pages/catalog/` owns `CatalogPage` and `catalog.scss`, the first real
GoodCall page family. **Public API is exactly `resultCount?: number`**
(default 2546, the raster's specimen figure). There is no
`src/features/catalog/`, provider, context, store, `catalogApi`,
`catalogService`, `catalogRepository`, `catalog.types` or `routeConfig`.

**Shell ownership.** `CatalogPage` renders **only** the page `<main>`. The
reference surface owns the shell composition — `SiteHeader`, `CatalogPage`,
`NewsletterBand`, `SiteFooter`, `MobileActionBar` — so the shell regions stay
independently reusable and none becomes page-owned. No generic `PageShell` was
extracted for a single consumer.

**Anatomy.** `<main class="catalog-page">` → accepted `Container` → a breadcrumb
`<nav>` above a CSS-grid `__layout` holding three areas: `heading`, `sidebar`
and `results`. From 1024px the grid is
`var(--catalog-sidebar-width) minmax(0, 1fr)` with areas
`'sidebar heading' / 'sidebar results'`, which reproduces the raster, where the
`<h1>` sits at the results column's left edge and the sidebar spans both rows.
Below 1024px it collapses to one column ordered heading → sidebar → results, so
the `<h1>` stays first. `--catalog-sidebar-width: 250px` and
`--catalog-column-gap: 32px` are Catalog-local custom properties for real
repeated page geometry; no global Catalog token was added.

**Breadcrumbs.** `Catalog.png` shows **no breadcrumb row** — the category nav
runs straight into the hero. Breadcrumbs are implemented because the slice
requires them, following the house treatment visible in
`Second_level_category.png` (`Главная > … > current`, small muted text with
chevron separators, above the title). Copy is `Главная / Каталог / Смартфоны`,
derived from the accepted Header, which reaches top-level categories through its
catalog entry. Semantics: `<nav aria-label="Хлебные крошки">` with an `<ol>`;
`Главная` is a real anchor to `import.meta.env.BASE_URL`, `Каталог` has no route
yet and is non-interactive text, and the current page carries
`aria-current="page"`. No generic `Breadcrumb` component was extracted until a
second page proves the pattern. **Their placement and rhythm are task-directed,
not raster-derived, and need user confirmation.**

**Heading and count.** A real `<h1>Смартфоны</h1>` with
`2 546 товаров` beside it, formatted through `Intl.NumberFormat('ru-RU')`. The
count is visible text, never colour- or position-only. Russian plural forms are
deferred to the data slice; the current wording is correct for the canonical
figure.

**Toolbar.** The raster's sort control sits on the heading row at the results
column's right edge. Catalog A reproduces that position with a non-interactive
`Сортировка: Сначала популярные` indicator. A real control is deliberately **not**
rendered: sort behaviour belongs to the slice that owns the grid, and a select
that sorts nothing would be exactly the fake interactivity this project forbids.
The raster's quick-filter chip row and its two view-mode toggles are likewise
deferred.

**Reserved regions are gone.** The sidebar placeholder became the Catalog B
filter panel and the results placeholder became the Catalog C product grid; no
dashed region remains on the page.

**Routing.** Catalog A added no router; the milestone was exposed through the
`?reference=catalog` development surface. Routing Foundation later added the
production `#/catalog/smartphones` route around the same `CatalogPage`. See the
Current routes section.

### Catalog B — Filters + Mobile Filter Dialog

**User visual PASS received on 2026-08-29, closed.** The accepted state covers
the desktop filter panel, the evidenced filter inventory, the quick-filter
preset row, the mobile trigger and active count, and the dialog's
draft/apply/reset behaviour. The `Серия` and `Диагональ` taxonomy is raster
fixture copy, not a domain contract.

**Ownership.** Everything lives under `src/pages/catalog/`: `CatalogFilters`
(the panel), `CatalogFilterDialog` (the mobile sheet), `catalogFilterState`
(state shape, defaults, active count, list toggle) and `catalog.scss`. There is
no `src/features/filters/`, `FilterProvider`, `FilterContext`, `CatalogStore`,
`catalogFilterService` or `catalogFilterSchema`. The filter state has exactly
one consumer — `CatalogPage` — so it is plain `useState` in that page, passed
down as props. `catalogFilterState.ts` exists because
`react-refresh/only-export-components` forbids exporting non-component values
from a component module; it is a page-local module, not a domain layer.

**Public API is unchanged: `resultCount?: number`.** No `filters`,
`filterOptions`, `onFiltersChange`, `products`, `sort`, `pagination` or
`category` prop was added. `resultCount` is forwarded to the panel as
`totalCount` so the `Все бренды` count and the page count stay one number.

**Filter inventory** follows `Catalog.png` exactly, in raster order: brand
checkboxes with counts and `Показать ещё`; `Серия`; `Диагональ`; `Рейтинг`
(4,5 / 4 / 3 / 2 / 1 `и выше`, with a half star on the first row); `Цена, ₽`;
`Память`; `Цвет` swatches with `Показать ещё`; and `Сбросить фильтры`.
`Catalog.png` pairs the `Серия` heading with `Только со скидкой` /
`Сначала от 1%` and the `Диагональ` heading with `Быстрая доставка` /
`Доставка сегодня`. Those pairings are semantically inconsistent in the raster
itself. Headings and option labels are implemented verbatim rather than
"corrected", no options were invented to reconcile them, and the copy decision
belongs to the user at visual review. Options behind the two `Показать ещё`
buttons are fixtures — the raster shows only the collapsed lists.

**Reuse.** The accepted `Checkbox` carries every option row, with the count
inside its `label` ReactNode so it stays part of the accessible name
(`Apple 256`). The accepted `RangeSlider` owns the price control whole —
3 000 to 250 000 ₽, step 1 000, `ru-RU` grouping. The accepted `Button` drives
the dialog footer. No closed UI primitive was modified. The only contextual
override is `.catalog-filters__row .ui-choice { display: grid }`, which lets the
existing label span fill the row so counts can sit at its right edge.

**Quick filters** are a real single-select preset row above the results
boundary: `Все смартфоны` (default), `Новинки`, `Хиты продаж`, `Со скидкой`,
`До 15 000 ₽`, `15 000 – 30 000 ₽`, `30 000 ₽ и выше`. They are native
`<button type="button">` elements with `aria-pressed`, inside a `role="group"`
labelled `Быстрые фильтры`. The accepted global `Chip` is a non-interactive
`<span>` and was deliberately **not** mutated to make one page's row clickable;
no `InteractiveChip` was created for a single consumer.

**State is UI-only.** Selections, the price pair, the preset, the expansion
flags and the dialog draft live in component state. There is no URL sync, no
`localStorage`, no context, no store, no request, no filtering engine and no
analytics. **`2 546 товаров` never reacts to a filter**, no `Найдено …` line
exists, and there is no loading, empty or no-results state. Catalog C and the
data slice own real results. (Specimen mode only: on the live route Catalog
Live Results A makes the count, filters and empty state real.)

**Desktop.** From 1024px the accepted geometry is untouched — 250px sidebar,
32px gap, heading in the results column. The desktop grid now uses
`grid-template: 'sidebar heading' auto / 'sidebar results' 1fr`, so the tall
filter panel no longer inflates the heading row and the quick-filter row sits
directly under the `<h1>`. The panel is a Catalog-local card (20px padding,
16px radius, `--role-border-soft` hairlines between groups); no second global
card system and no global filter tokens were added. Groups are real
`<fieldset>`/`<legend>` pairs — the brand legend is visually hidden because the
raster's card title covers it — and legends float so the group hairline is not
cut by the legend slot. Price is an `<h3>` plus the accepted `RangeSlider`.

**Mobile.** Below 1024px the sidebar leaves the document flow entirely
(`display: none`, so none of its 35 controls stays focusable) and a real
`Фильтры` trigger appears above the quick-filter row, carrying the active-filter
count as a badge when it is above zero. The trigger opens a Catalog-local Radix
`Dialog` bottom sheet — `Dialog.Root` / `Trigger` / `Portal` / `Overlay` /
`Content` / `Title` / `Close` — layered at `--control-floating-z-index` (30)
above `MobileActionBar` (20), capped at `100dvh - 24px`, with the filter body
scrolling under a sticky footer that carries `env(safe-area-inset-bottom)`. No
generic `Drawer` was created for one consumer and no new dependency was added.
The overlay uses `--alpha-black-36`; the accepted Location and Feedback dialogs
have transparent overlays, and the scrim is a deliberate local addition because
a sheet anchored to one edge needs it to read as modal.

**Apply semantics are a real draft model.** Opening the sheet copies the applied
state into a draft; the controls edit the draft; `Сбросить` returns the draft to
defaults without closing; `Показать` commits the draft and closes; Escape, the
close button and an overlay dismiss discard it. Desktop edits apply immediately
and `Сбросить фильтры` at the panel foot resets them. Mobile wording is not
raster-evidenced — `Catalog.png` is a desktop composition with no mobile frame —
so `Сбросить` / `Показать` were chosen for GoodCall consistency.

**Active-filter count** is UI-only: one per selected checkbox option across
every group plus one if the price pair differs from `[3000, 250000]`. The
default `Все бренды` row is the derived "no brand selected" state, so it never
counts; ticking a brand unticks it and ticking it clears the brand list. The
quick-filter preset sits outside the sidebar and outside the dialog, so it is
deliberately excluded from the count. Nothing about the count touches
`resultCount`.

Catalog C replaced the sort indicator with a real control and filled the
results region; in specimen mode the filter state still never touches products
or the result count (live mode: see Catalog Live Results A).

### Catalog C — Product Grid + Pagination + Sorting

**User visual PASS received on 2026-08-30, closed.**

**Ownership.** `src/pages/catalog/` gains `catalogProduct.ts` (the
`CatalogProduct` shape, sort values/options/default, comparators and
`sortCatalogProducts`, and the 12-per-page size), `catalogProducts.ts` (the 16
demo products: Search/Catalog fallback, live-product badge presentation and the
Product Details reference product), `catalogProductFixtures.ts` (the specimen
65-page count and `catalogPageProducts`) and
`CatalogProductGrid.tsx` (the grid, the in-grid promo and the local card state)
and `CatalogProductCard.tsx` (the single `ProductCard` mapping and the seam types,
shared with the Product Details C rail and exported through `index.ts`).
There is no `src/data/`, `src/api/`, `src/services/`, `src/repositories/`,
`src/features/products/`, `ProductRepository`, `CatalogApi`, `ProductService`,
`ProductProvider` or `CatalogProvider`. The fixtures are page-local specimen
content for visual review, not a product or domain model: the shape carries only
what `ProductCard`, the comparators and the pager need, and models no SKU,
inventory, seller, variant, spec or delivery concept.

**Public API is still exactly `resultCount?: number`.**

**Fixtures.** 16 deterministic smartphones. The 12 the raster shows are
transcribed from `Catalog.png` — titles, colours, current prices, ratings and
badges; four more extend the pool so page changes show different products. All
of them share the existing synthetic `product-phone.svg`; no branded photography
was downloaded and no new artwork was created. Review counts and the illegible
old prices are coherent specimen values, because that line renders unreliably in
the raster.

**`2 546 товаров` stays specimen copy** and is never derived from fixture length,
sorting or pagination.

**ProductCard reuse.** The accepted card renders every result through
`CatalogProductCard`. Exercised props: `title`, `imageSrc`, `imageAlt`,
`price`, `oldPrice` (10 of 16), `badge` (15 of 16), `rating`, `reviewCount`,
`favoritePressed`/`onFavoriteToggle`, `onAddToCart`, and
`quantity`/`onQuantityChange` once a card is added. `availability` is
deliberately unused: the raster's catalog card shows none, and its bordered
padded box does not fit a 259px column beside the price.

**Badge presentation.** `badge` takes a `ReactNode`. The raster's solid violet
`Новинка` and solid red discount badges render through the shared
`ProductBadge` (Quality C; see Quality remediation). Global `Chip` keeps its
accepted soft-tint design.

**Sale-badge closeout.** Each badge variant owns its own colour pair. `Новинка`
is `--role-text-inverse` on `--color-brand-purple-600` at 6.75:1. The sale badge
is `--role-text-inverse` on the Catalog-local `$catalog-sale-badge-surface`
(`#dc2626`) at **4.83:1** — white text, as the user requires, on a red deeper
than `--role-state-danger`. White on `--role-state-danger` (`#ef4444`) is only
3.76:1 at the rendered 13px/700, which is below AA because that size is not WCAG
large text, so a darker surface was the only way to keep white text; the
threshold was met by colour alone, with no change to font size, weight, padding,
radius or placement.

The darker red is Catalog-local because this is a sale-badge presentation
requirement, not a proven global danger requirement. Foundations expose no red
ramp — `$status` holds one red and `--role-state-danger-soft` is a light tint —
and adding one for a single badge would mean a new global semantic token.
`--role-state-danger` therefore still resolves to `#ef4444`, and `Chip` `danger`,
`Button` `danger`, `ConfirmationDialog`, the Location error states and the
pressed favourite are all untouched.

**Grid.** `repeat(auto-fill, minmax(228px, 1fr))` with a 20px gap, so the column
count follows usable card width instead of a fixed desktop number: 4 columns at
259px from 1440 (the raster's own 4 columns at ~258px), 3 at 1280, 2 from 1024
and 768, 1 below roughly 500px. The single mobile column is a measured decision,
not a default — at 390px two columns give a 172px card whose 140px content box
cannot hold the accepted 94px price plus the 44px cart action on one line, and
whose titles wrap to four lines. The price-above-action stack that used to need
a Catalog-scoped layout rule is now the canonical vertical card anatomy, so that
page-level override is gone.

**In-grid promo.** Implemented with the accepted `PromoBanner`, spanning all
columns after the eighth card, reproducing the raster's row-2/row-3 break. It
carries no `actionLabel`, because no route exists and a dead CTA would be fake
interactivity. No campaign architecture and no marketing artwork were added.

**Promo surface separation.** `PromoBanner` exposes no surface or variant prop,
so the Catalog promo is darkened by one contextual rule scoped inside
`.catalog-grid__promo` in `catalog.scss`: `--color-base-rich-text` with
`background-image: none`, plus a 160px `min-height` so the band keeps the
raster's full-width break role between product rows. The shared `PromoBanner`
API and its `--gradient-cta` default are untouched, and the Components reference
banners are unchanged. White inverse copy on `#12131a` clears WCAG AA
comfortably. The resulting page hierarchy is product results → dark Catalog
campaign promo → pagination → page whitespace → the violet `NewsletterBand`,
which is what the user asked for; `NewsletterBand` itself was not touched.

**Sorting** is real and local over the fixtures: `Сначала популярные` (default,
popularity descending), `Сначала дешевле`, `Сначала дороже`, `По рейтингу`, each
with a stable id fallback. Changing sort resets the page to 1. The accepted
`SelectField` could not take the toolbar role — `SelectFieldProps` exposes no
`labelVisuallyHidden`, `FieldShell` always renders a visible `<label>`, and
`.ui-field` is a column flex, so the raster's compact single-line trigger is not
expressible without editing a closed primitive. A Catalog-local Radix `Select`
reuses the accepted `.ui-input--select-trigger` and `.ui-select-content` styling
with `aria-label="Сортировка"`; global `SelectField` was not altered.

**Pagination** uses the accepted component. `pageCount` is 65 — the figure
`Catalog.png` shows — and, like `2 546 товаров`, it is specimen copy rather than
a computed total; it is never derived from the fixture array. Twelve cards per
page, and each page deterministically rotates the 16-item pool so page changes
visibly change results without claiming thousands of local products.

**Filters stay UI-only.** Sidebar filters, quick presets and the brand search
still change only their own selection or presentation state; they never reorder,
filter or count products. Sorting and pagination do act on the fixtures, because
Catalog C explicitly owns those presentation behaviours. That asymmetry is
deliberate and holds in specimen mode; the live route filters, counts and
paginates real products (see Catalog Live Results A).

**Rating rows use compact `★N` threshold markers.** Each row is
`checkbox | ★4,5 | и выше`: a single 16px `--role-state-warning` star and the
value sit inside one `catalog-filters__rating-marker` inline-flex unit with no
gap between them, so they read as one rating marker rather than two fragments.
The number is 14px semibold tabular at `--role-text-primary`; the marker has a
38px `min-width` — the smallest that fits `★4,5` — so the muted `и выше`
qualifier lines up across all five rows, 8px after the marker. No separate
numeric column, no pill, background or border. The thresholds stay the accepted
Catalog B set the raster evidences — `4,5`, `4`, `3`, `2`, `1` — and were not
renumbered to a `5`-topped scale, because that inventory is closed raster fixture
copy. The star is `aria-hidden` decoration and each checkbox carries the full
`Рейтинг N и выше` accessible name, so nothing is conveyed by the star or by
colour alone.

**Brand search** is a local substring filter over the brand options, using the
accepted `SearchField` with `labelVisuallyHidden` so the real `Поиск бренда`
label exists without competing with the group heading. Its icons render at 18px
rather than the component's default 34px, which reads as oversized in the compact
field: `.catalog-filters__brand-search` sets `--control-icon-size: 18px` and
applies it to the nested `.ui-icon`, whose size the shared
`.ui-search-actions__icon` rule would otherwise hard-code. The clear control
keeps its full 34px target and its `Очистить поиск` name; only the glyph shrinks.
`SearchField`, the `Icon` primitive and the Header search are untouched. The query is trimmed and
lower-cased and matched case-insensitively against every brand — including the
ones behind `Показать ещё` — with no debounce, fuzzy matching, transliteration or
request of any kind. While a query is active the collapse affordance is hidden
and all matches show; `Все бренды` stays pinned at the top; brands already
selected stay selected even when the query hides them; and clearing the query
restores the previous collapsed or expanded state untouched. No match renders a
muted `Бренды не найдены`, not an error state.

The query lives in local `useState` inside `CatalogFilters`, not in
`CatalogFilterState`. It is presentation state: it never reaches
`countActiveCatalogFilters`, never becomes an applied filter, and is not
persisted. The sidebar reset clears it alongside the selections because that
control is inside the same component; the dialog's own `Сбросить` keeps its
existing draft-only meaning. In the mobile dialog the query resets on reopen
purely because Radix unmounts the content, so no extra lifecycle code exists.

**No generic searchable-filter schema was introduced.** There is no
`searchable`, `filterType`, `filterDefinition`, `facetSchema` or
`FilterRenderer`. Brand search is implemented for the one proven long enumerated
filter; generic category/filter/facet architecture stays deferred until a second
real category proves the requirement.

**View-mode controls were omitted.** The raster's two toolbar buttons are grid
_density_ variants (a 2x3 block and a 3x3 dot grid), not grid-versus-list, so
mapping them onto `ProductCard` `vertical`/`horizontal` would misrepresent the
evidence; and the accepted icon set has no grid, list or dot-grid glyph, so
implementing them would reopen the accepted Icon policy.

**Bounded `ProductCard` reopen (2026-08-30).** Those deviations were recorded
rather than fixed while the Components reference was the card's only consumer.
The real Catalog turned them into a repeated visual mismatch across every result
row, and the user preferred the raster treatment, so the shared card was reopened
once, deliberately and canonically. Consumers at the time: `ComponentsReference`
vertical (reference-only), `ComponentsReference` horizontal (reference-only), and
`CatalogProductGrid` vertical (real page). Both vertical consumers accept the
corrected anatomy, so it became canonical rather than a Catalog prop, and no
`CatalogProductCard` and no duplicated card markup exist.

**Canonical vertical anatomy** is now image → title → rating → price row → cart
action. The `column-reverse` on `__info` is gone. In vertical layout `__footer`
is a stretch column, the price row puts the struck old price at the start and the
dominant current price at the end, `__body` grows so the action bottom-aligns
across a row, `__actions` is a stretch column so a shown `QuantityStepper` and
the cart button each fill the card width, and `--product-media-height` is 148px
(the raster's ~138px image inside a ~164px media band, normalised to the 259px
card). Horizontal layout is untouched and still renders price-then-old-price with
the icon-only cart beside the stepper.

**Cart CTA.** The vertical card renders the raster's labelled `В корзину` at full
card width. `AddToCartButton` gained one optional `children` slot; passing it adds
`product-action--cart-labelled` and nothing else, so `MiniProductCard` and the
horizontal card keep the accepted 44px icon-only affordance with no call-site
change. No `variant`, `compact` or `dense` prop was introduced, because the
difference is layout-owned: `ProductCard` decides from its own `layout` and the
width comes from `.product-card--vertical .product-card__actions`. The visible
label is inside the accessible name (`В корзину: <title>`), so the CTA stays
product-specific and satisfies label-in-name.

**Deferred:** routing and product detail pages; the multi-category filter/facet
architecture. (The Footer was later accepted as-is.) Two raster details stay unmatched by
choice: the promo's `Смотреть подборку` button (no route exists) and its full
product-cluster photography (only the synthetic `product-phone.svg` exists).

### Global Shell E — SiteFooter

**Accepted as-is for project closeout.** The integrated 1440/390 review found no
layout, spacing or hierarchy blocker; no Footer milestone is open.

`src/components/shell/` owns `SiteFooter`, the canonical global shell footer,
with its styles in `footer.scss`. There is no `src/components/footer/`,
`src/features/footer/`, provider, context, service or config store: the footer is
static shell structure at this milestone.

**Top separation (2026-08-30).** Integrated Catalog review showed the footer
blending into the content above it, because `--role-surface-footer` (`#fafafc`)
sits almost invisibly against the white page. `.site-footer` now carries a
`--control-border-width` top border in `--role-border-default` plus a very soft
upward `0 -10px 24px -20px var(--alpha-black-24)` shadow. Existing semantic
tokens only; no new shadow system, no new surface, no gradient, no radius and no
floating-card effect. Footer content, columns, socials, contacts, payments,
legal row and link semantics are unchanged, the footer still reads quieter than
`NewsletterBand`, and the shadow points up from the footer's own top edge so it
never overlays the fixed `MobileActionBar`.

**Public API:** `homeHref?` (defaulting to `import.meta.env.BASE_URL` like
`SiteHeader`), the production seams `helpLinks?`, `companyLinks?`,
`legalLinks?`, `support?`,
`supportLabel?` and `paymentMarks?`. There is no `columns`, `links`, `contacts`,
`socials`, `payments`, `copyright`, `variant`, `theme`, `compact`,
`showNewsletter` or `companyInfo` prop, and no footer CMS model,
site-settings service or JSON data layer.

**Anatomy.** `<footer class="site-footer">` → accepted `Container` → a
`site-footer__main` grid and a `site-footer__bottom` row separated by a
`--role-border-soft` hairline. The grid holds five blocks: the brand block
(`BrandLogo` inside a home anchor, plus the tagline), three heading-plus-list
groups — `Покупателям`, `Компания`, `Помощь` — and a contacts block with the
support phone and email. The bottom row carries the copyright, the legal labels
and the payment marks. Surface is the accepted `--role-surface-footer`.

**Raster synthesis.** Home, Shops, About, Blog and Catalog footers were compared.
Home and Blog agree almost exactly and carry the most repeated system, so the
canonical footer is theirs. Repeated and implemented: the light surface, the
Container alignment, the brand-plus-tagline column, the three named groups, the
icon-led phone and email contacts, the hairline plus bottom row, the copyright,
the legal labels and the payment marks. Shops is the structural outlier — five
columns, no brand block, an address, an app-download block — and was treated as
incidental. Its address, the app-download block and the store badges are
single-raster traits and were **not** implemented; no QR block exists, because no
footer raster shows one.

**Link policy.** Footer labels whose page does not exist render as
**non-interactive text**, not fake links. In production, `helpLinks` wires
Доставка и оплата, Гарантия и возврат, FAQ, Контакты and Поддержка,
`companyLinks` wires «О нас» (About A; «Новости» and «Карьера» stay plain), and
`legalLinks` wires the three legal labels (Legal A); reference surfaces pass
none of them and keep plain text. There is no `href="#"`, no
link pointing at the repository root merely to be clickable, and no no-op click
handler. Production support contacts come from `STOREFRONT_SUPPORT`; the
remaining unwired labels get a link only when their page exists.

**Support identity, settled.** Production passes `STOREFRONT_SUPPORT`:
`8 800 100-10-10`, `support@goodcall.example`, `Ежедневно с 9:00 до 21:00`.
The rasters disagree on the phone (`8 800 100-10-47`, `-67`, `-10`,
`8 (800) 123-45-67`) and show `info@goodcall.ru`; those raster values, and the
`SUPPORT` default in `SiteFooter.tsx` used by reference surfaces, are
specimen/reference-only. No address or legal entity was fabricated.

**Assets.** `BrandLogo` is reused unchanged inside a footer-owned anchor, and the
`phone` and `mail` glyphs come from the accepted `Icon` registry.

The social and payment gaps are now closed with **officially sourced third-party
brand marks**, vendored one file per mark and never reconstructed by hand or
generated: `src/assets/social/vk.svg`, `telegram.svg`, `youtube.svg` and
`rutube.svg`, plus `src/assets/commerce/payment-sbp.svg` beside the existing
`payment-mir.svg`. Sources are recorded in the task audit. They are ordinary
asset imports rendered as `<img>` with the brand name as `alt`; **none is
registered in `IconName`**, because these are brand marks, not UI glyphs.

**Socials are non-interactive.** GoodCall has no real VK / Telegram / YouTube /
RUTUBE destinations yet, so the row is an informative
`<ul aria-label="Мы в соцсетях">` of images with no anchors, no `href="#"`, no
handlers and no tab stops. It converts to links when real destinations exist; no
social-links API was added now.

**Payments: МИР, СБП, SberPay, T-Pay.** Each sits in a uniform 32px bordered
chip (`site-footer__payment`) on the card surface. МИР, СБП and SberPay use
their repository-owned marks, and T-Pay uses the official `payment-tpay.svg`
(20px). All four are logo-only, with the method name as image `alt`, by owner
decision; T-Bank's guideline shows a logo + «T-Pay» text lockup for method
lists. Mir Pay, VISA, Mastercard, Apple Pay, Google Pay and YooMoney are
deliberately not shown. The row is labelled «Способы оплаты» and stays one
278 × 32 line down to 320px.

**App-store badges stay deferred.** No RuStore, App Store, Google Play or
AppGallery badge exists, because GoodCall has no application and no real store
destination contract; no placeholder badge or reserved empty download area was
created.

**Responsive direction** is CSS only. One column below 560px, two from 560px,
three from 768px with the contacts block spanning two cells, and the five-column
desktop layout from 1200px. No accordion: no raster shows a mobile footer, so
plain stacking was chosen.

**MobileActionBar.** Ownership is unchanged — the bar stays fixed below 768px and
production CSS still adds no global body padding, so a page or shell integration
reserves the bottom inset itself. `?reference=footer` does exactly that with
reference-owned padding, and at 430 / 390 / 375 / 320 the last footer content
sits about 57px above the bar when scrolled to the bottom. No footer-owned
clearance was hardcoded and `MobileActionBar` was not modified.

`?reference=footer` renders a reference-only intro, then the real production
`NewsletterBand` and `SiteFooter`, plus `MobileActionBar` for the mobile overlap
test. **`SiteFooter` never contains `NewsletterBand`**; footer styles do not
reach into `.newsletter-band*` and newsletter styles were not modified.

### Global Shell D — NewsletterBand

**Closed. User visual PASS received on 2026-08-27.**

`src/components/shell/` owns `NewsletterBand`, the canonical pre-footer
newsletter region, with its styles in `newsletter.scss`. It is shell, not page
content and not the Footer: the two are separate shell components and
NewsletterBand ends where `SiteFooter` begins. The closed Components `NewsletterCard` is a different,
card-shaped section-05 component and is unchanged; no `src/components/newsletter/`,
`src/features/newsletter/`, provider, service or form context exists.

**Public API is exactly `onSubscribe?: (email: string) => void`.** There is no
`title`, `description`, `theme`, `variant`, `compact`, `layout`, `background`,
`buttonLabel`, `showLegal`, `legalText`, `successMessage`, `errorMessage`,
`loading`, `campaignId` or `source` prop. The canonical Russian copy lives inside
the GoodCall-specific shell component.

**Anatomy.** `<section class="newsletter-band" aria-labelledby>` → accepted
`Container` → `newsletter-band__content`, which is both the violet promotional
surface and the flex row. Inside it: a lead group (the mail motif tile plus the
`<h2>` + `<p>` copy block), a real `<form>` styled as one white CTA cluster
holding a visually hidden `<label>`, a native `type="email"` input carrying
`.ui-input` and the accepted `Button`, and a decorative gift `<img>`. No wrapper
exists without a layout or semantic purpose and there is no clickable `div`.

**Raster synthesis.** The Home, Shops, About, Blog and Catalog page rasters were
compared and normalized into one band. Repeated: the copy
`Будьте в курсе новинок и акций` (4/5 verbatim), the `Подписаться` button (5/5),
a white email field beside a brand-purple submit control, a copy-left /
form-right desktop row, decorative gift/envelope artwork at the right edge (5/5),
and placement directly above the footer.

**The first implementation used the flat light `--role-surface-brand-soft`
treatment. The user judged it too plain, and explicitly selected the richer
promotional direction instead**: a deep-violet-to-lavender gradient surface,
white copy, a compact mail motif at the left, a visually grouped white email
field plus purple CTA, and the decorative violet gift artwork finishing the right
edge. The rasters paint three mutually different purples, so the gradient is
Newsletter-local and built only from accepted `--color-brand-purple-*`
primitives; no Foundations token was added for it. The submit control keeps the
accepted pill Button rather than the raster's rounded rectangle, because
Components is closed and user-accepted. Still omitted: the Shops black button,
and any privacy/consent copy or policy link — no raster shows one. `#/privacy`
now exists (Legal A); adding a consent link to the band is a separate,
unscoped decision.

**Form semantics.** A plain uncontrolled form. Submission is read with
`FormData`, `event.preventDefault()` stops navigation, the value is trimmed and
handed to `onSubscribe` when one is supplied. Browser-native validation gates submission —
`type="email"`, `required`, `autocomplete="email"`, `inputMode="email"`, and
`noValidate` is never set. There is **no** backend, `fetch`, endpoint,
newsletter/marketing SDK, `localStorage`, cookie, loading state, retry,
analytics, validation schema, form library or React form state. Without
`onSubscribe` (production today) a valid submit shows the truthful local demo
acknowledgement from Newsletter Feedback A; there is no success or failure UI.

**Surface and artwork.** `newsletter-band__content` stacks three background
layers: one restrained white radial glow at the upper left, a dedicated right
decorative zone — `linear-gradient(to right, transparent, --color-brand-purple-200)`
sized in px from the right edge by the Newsletter-local `--newsletter-band-zone`
— and a `102deg` linear gradient running `--color-brand-purple-800` → `-700` →
`-600` → `-500` → `--newsletter-band-tail`. Both locals are breakpoint-scoped: the
zone is `0` below 768px and interpolates 170px → 560px across 768px → 1440px, and
the tail is `--color-brand-purple-500` below 768px and `--color-brand-purple-300`
above it. Sizing the zone from the right edge keeps it inside the reserved gift
area at every width, so white body copy never crosses onto the light backdrop and
stays at or above 4.98:1. There is no animation, particle field, filter stack or
noise. `src/assets/marketing/newsletter-gift.svg` — reworked to a 240×150 viewBox
with deepened box facets and a real two-loop ribbon bow so it separates from the
lavender zone — is imported as an ordinary asset URL and rendered as a decorative
`<img alt="" aria-hidden="true">` at `right: -12px; bottom: -10px` with
`object-fit: contain` and one soft `drop-shadow`, so it always fits the band and
crops only into the 10px below it. It is not an `Icon`, not a `Picture`, and not
registered in the icon registry.

**Mail motif.** The typed `Icon` registry gained one glyph, `mail`, in the
existing 24×24 stroke style, backed by `src/assets/icons/mail.svg`; `IconName`
and the SCSS `$icon-names` list were updated together. It is consumed through the
accepted `Icon` inside a 52px translucent white tile (44px below 560px) and adds
no accessible text.

**Responsive direction** is CSS only, with no JS viewport detection. The content
row wraps intrinsically: copy and form share one row at 1280px and above, the
form takes its own row at 1024px and 768px, and the gift is hidden below 768px.
One real breakpoint at 560px stacks the input and the button full width inside
the white cluster and moves the mail tile above the copy, because 375px leaves
about 300px of inner width while an inline input-plus-button needs about 382px.

`?reference=newsletter` renders the real production `NewsletterBand` at full
width on a neutral surface, passes a real `onSubscribe`, and shows the last
submitted address in a reference-only `aria-live="polite"` status **outside** the
component. It is not a Home page and implements no page module.

### Location Foundation — CitySelector

**Visual gate accepted. User visual PASS received on 2026-08-27, including the
danger-red service/geolocation failure correction. Live DaData functional
verification remains open and pending `DADATA_TOKEN`.**

`src/components/location/` owns the whole capability: `CityLocationControl`
(header trigger, confirmation, orchestration), `CityPickerDialog`,
`dadataCityClient`, `cityStorage`, `types` and `location.scss`. There is **no
location Context, Provider, store or global API client**; the selected city has
exactly one production consumer, the Header location control.

**Provider: DaData Suggestions API**, called with native `fetch` — no DaData UI
widget, no `@dadata/*` package, no second IP or geocoding provider, and no
backend proxy. Three endpoints are used:

- `GET  …/4_1/rs/iplocate/address` — city by the requester's IP. No `ip` field is
  sent; DaData resolves the caller's own address, so no public IP is discovered
  or fabricated.
- `POST …/4_1/rs/suggest/address` — city search, sent with
  `from_bound`/`to_bound` `city` and `count: 10`.
- `POST …/4_1/rs/geolocate/address` — reverse geocoding, `{ lat, lon, count }`.

Only the browser-facing Suggestions API token is used, as
`Authorization: Token …`. The Standardization/Clean API and any secret key are
out of scope.

**Environment.** The token is read from `VITE_DADATA_TOKEN` only. `.env.example`
is committed and holds the bare key with no value; `.env*` stays gitignored. The
Pages deploy workflow passes `VITE_DADATA_TOKEN: ${{ secrets.DADATA_TOKEN }}` to
its build step — `DADATA_TOKEN` is the only secret name involved. A `VITE_*`
value is browser-visible after build, which is acceptable for this token class
and only for this token class.

**Minimal city contract.** `CityOption` is exactly
`{ fiasId, name, region }` — three non-empty strings. No coordinates, timezone,
delivery zone, store, price, IP or raw DaData JSON. External JSON is mapped and
validated at the adapter boundary; UI and shell code never see a DaData shape.

**Mapping.** `city_fias_id` → `fiasId`, `city` → `name`,
`region_with_type` (falling back to `region`) → `region`. Federal cities are a
real second shape: for Москва and Санкт-Петербург DaData returns `city` and
`city_fias_id` as `null` and carries the city in `region_*` with
`region_type: "г"`, so the mapper falls back to `region_fias_id`/`region` for
that case. Everything else — non-`RU`, and streets, houses or settlements in
search results — maps to no result. The picker suppresses a redundant
`Москва / Москва` caption.

**Persistence.** Only a confirmed or manually chosen city is written, to
`goodcall.city.v1`, as the minimal object. Parsing is defensive: malformed or
incomplete values are ignored and the key is removed, then normal detection
resumes. A valid stored city wins over IP detection and makes the page issue
zero IP requests. IP addresses, coordinates, search queries, the token and
unconfirmed candidates are never stored or logged.

**Flow.** IP detection runs only when there is no valid stored city and a token
is configured; its result is a _candidate_ that is never persisted on its own.
It appears as a non-modal anchored Radix Popover — `Ваш город — Москва?` with
`Да` and `Выбрать другой` — which does not take focus and does not shift Header
layout. `Да` persists; `Выбрать другой` opens the picker. Dismissing persists
nothing, and a `null`/foreign/failed lookup falls back to `Выберите город`
rather than silently defaulting to Moscow.

**Browser geolocation is requested only by the picker's
`Определить автоматически` action** — never on page load, and
`navigator.permissions` is never touched. Coordinates go to DaData reverse
geocoding and are never stored.

**Search** trims input, needs at least 2 characters, debounces ~280ms without a
library, cancels superseded requests with `AbortController`, and ignores any
response that no longer matches the current query. Popular cities are display
shortcuts resolved through the same city search, cached in memory for the
mount only; no FIAS registry or city dataset is bundled.

**Header.** The static `<p class="site-header__location">` became a real
`<button>` with the same map-pin icon, utility-row typography, 6px gap and white
focus ring. `locationLabel` had no consumers and was removed rather than kept as
dead API. `SiteHeader` gained only `cityLookupClient` / `cityLookupConfigured`,
the injection seam the deterministic reference uses. Nothing else in the accepted
Header changed, and a 2x-DPR comparison of the whole Header with Москва seeded
reports **0 differing pixels** at 1440 / 1024 / 768 / 390 / 375 / 320.

**Opening the picker never shows an availability message on its own:** with no
token and an untouched query the dialog shows only its title, the auto-detect
button, the search field and the six popular cities. Availability feedback
appears **only after a concrete attempt** — clicking `Определить автоматически`,
clicking a popular city, or typing a query of at least 2 characters. No
configuration detail such as `VITE_DADATA_TOKEN` is ever shown to a user.

**Accepted status severity rule.** Genuine service and action failures are
emphasised; informational search states are not:

| State               | Copy                                                | Role                  |
| ------------------- | --------------------------------------------------- | --------------------- |
| Service unavailable | `Поиск города временно недоступен`                  | `--role-state-danger` |
| Geolocation failure | `Не удалось определить город. Найдите его вручную.` | `--role-state-danger` |
| Loading             | `Идёт поиск городов`                                | `--role-text-muted`   |
| No result           | `Город не найден. Проверьте написание.`             | `--role-text-muted`   |

Severity follows the `SearchState` discriminant, not the message text: the
action notice is always a failure and carries the danger role, while the search
status adds `city-picker__status--error` only for its `error` kind. There is no
Alert component, status framework or new token.

Two message channels stay distinct: the **notice** carries the result of a
specific action, the **search status** carries loading / no-result / unavailable
for the active query. When both would carry the same text the notice yields, so
the same sentence is never shown or announced twice; genuinely different
messages still coexist.

With no token the Header shows `Выберите город` unless a valid city is already
persisted, the trigger still opens the picker, a query under 2 characters
produces no message at all, and **browser geolocation permission is never
requested** — auto-detect reports unavailability without touching
`navigator.geolocation`, because the reverse-geocoding backend cannot be used.
No offline FIAS registry, bundled city dataset, fake identifier or fallback
provider was added: a selectable city must still resolve through the real lookup
client, so an unresolvable popular city is reported rather than invented.

This slice implements **no** delivery calculation, store filtering, regional
pricing, warehouse, city-specific catalog, street/house selection, settlement or
foreign-city support, map, analytics or cookie.

### Media Foundation — Picture pipeline and Icon policy

**Closed.** Media Foundation / Picture pipeline + Icon policy — user visual PASS
received on 2026-08-27; accepted and closed.

**Icon is the canonical entry point for UI SVG glyphs.** Every UI, action,
navigation and status glyph — search, cart, heart, compare, menu, phone, map-pin,
clock, category glyphs, chevrons, close, plus/minus and the rest — is consumed as
`<Icon name="…" />`. Production code never imports a file from
`src/assets/icons/` directly; the only reference to that directory is the Icon's
own `mask-image` registry loop in `controls.scss`. The accepted renderer — typed
`IconName` + CSS mask + `currentColor` — **stays as it is**. No SVG sprite, no
SVGR, no icon library.

**Not every SVG is an Icon.** Brand artwork, payment and partner logos,
multicolour marks and marketing/content/product illustrations are assets, not
glyphs, and keep ordinary imports: `src/assets/brand/brand-mark.svg`,
`src/assets/commerce/payment-mir.svg`, `src/assets/marketing/*.svg` and
`src/assets/products/product-*.svg`.

The `IconName` union and the SCSS `$icon-names` list still duplicate the registry.
That is a known maintainability concern and is **deliberately deferred** — it is
not worth a codegen script, AST parsing, sprite parser or custom Vite plugin, and
nothing in the current stack removes it for free.

**Raster policy.** Authored raster sources are **PNG / JPG / JPEG only**. AVIF and
WebP are _generated build output_, never authored source, and are never committed
or hand-maintained as `foo.avif` / `foo.webp` / `foo.jpg` triplets. A PNG source
keeps a PNG fallback and a JPG/JPEG source keeps a JPEG fallback, so transparent
artwork can never silently degrade to JPEG — `vite.config.ts` throws at build
time if a `?picture` import is not PNG/JPG/JPEG. SVG is outside this pipeline.

`vite-imagetools@12.0.0` (a dev/build-only dependency) performs the transform at build
time; there is no runtime image library and no runtime image processing. It is
**opt-in per import**, never global: only imports whose query ends in `&picture`
are transformed, and `defaultDirectives` returns empty directives for everything
else, so the favicon SVG, icon SVGs, the brand mark and ordinary asset imports are
untouched.

`src/components/media/` owns `Picture`, the canonical local responsive raster
primitive. It renders `<picture>` with one `<source>` per generated format
(AVIF, then WebP, then the original-format fallback) plus an `<img>` carrying the
generated intrinsic `width`/`height`. `alt` and `sizes` are required, `loading`
defaults to `lazy` and `decoding` to `async`, and `className` applies to the
`<img>`. **Widths and `sizes` are consumer-owned** — widths are chosen at the
import site from the real rendered slot and the source's native size, and there is
no global width matrix.

**A generic `Image` primitive is intentionally deferred** until a real
external/dynamic/single-source consumer proves its API. Plain single-source URLs
stay native `<img>`.

`CommerceLocationCard` is the first real `Picture` consumer. Its former
`imageSrc: string` prop became `image: PictureSource`; the card owns its own
`sizes` because it owns the slot CSS, and its only caller — the Components
reference — was migrated in the same change. The legacy authored WebP was
normalized to PNG in the same slice, so **no authored WebP or AVIF remains in
`src/`**.

### Global Shell C — BrandLogo and favicon

**User visual PASS received on 2026-08-27. Global Shell C is accepted and
closed.**

`src/components/brand/` owns `BrandLogo`, the accepted GoodCall lockup — the
purple brand mark followed by the `GOODCALL` wordmark — extracted verbatim from
the Header. Its only prop is `className`. It renders a neutral `<span>` wrapper,
so **navigation ownership stays with the consumer**: `SiteHeader` keeps its own
`site-header__brand` anchor, `href` and focus treatment and simply places
`<BrandLogo />` inside it. There are deliberately no `href`, `as`, `variant`,
`size`, `compact`, `theme`, `inverse`, `showWordmark`, `markOnly` or `onClick`
props — no evidence calls for them, and the only current consumer is the Header.

`brand.scss` owns the default lockup treatment and exposes it through
fallback-valued custom properties (`--brand-logo-gap`, `--brand-logo-mark-width`,
`--brand-logo-mark-height`, `--brand-logo-name-size`). The Header sets only the
four values its mobile composition needs, on `.site-header__brand` below 768px.
No React size variants were added to reproduce responsive CSS, and no new
Foundations token or typography scale was introduced.

The canonical brand asset moved from `src/assets/shell/brand-mark.svg` to
`src/assets/brand/brand-mark.svg`, byte-identical — no geometry, colour or
rasterization change. That **one** file is the single source for both the
`BrandLogo` mark and the document favicon; there is no separate `favicon.svg`
copy. `index.html` declares
`<link rel="icon" type="image/svg+xml" href="/src/assets/brand/brand-mark.svg" />`
and Vite's HTML asset pipeline rewrites it to the hashed emitted asset under the
configured Pages base. No `public/` directory was created, no runtime JavaScript
injects the icon, and no `favicon.ico`, apple-touch-icon, Android icon,
webmanifest, mask-icon, `browserconfig.xml`, `theme-color` or PWA metadata was
added.

### Global Shell B — SiteHeader and MobileActionBar

**User visual PASS received on 2026-08-27. Global Shell B is accepted and
closed.** The PASS covers the canonical desktop Header, the normalized mobile
Header, `MobileActionBar`, the Embla-powered mobile category carousel, the
category/store/QR affordance presentation, the bottom-bar separation shadow and
the current GoodCall brand mark and wordmark treatment. Header is not reopened;
the later `BrandLogo` extraction was a no-regression refactor that left the
accepted rendering byte-for-byte identical.

`src/components/shell/` owns one canonical, reusable `SiteHeader`. It deliberately
**normalizes** the recurring header evidence across the supplied Home, Shops,
About, Blog and Catalog page rasters instead of mirroring any one of them, and it
follows raster section 01 Header & Navigation for styling and proportions. There
are no page-specific header variants — no HomeHeader, CatalogHeader, BlogHeader,
AboutHeader or ShopsHeader, and no checkout/minimal header.

Anatomy — three full-width regions, each placing its content in the accepted
`Container`, so all three rows share the same inner horizontal edges:

- **UtilityBar** — brand-purple surface carrying the normalized service content:
  location (`Москва`), `Доставка по всей России`, `Магазины`, `Поддержка`
  (production links it to `#/contacts`; reference surfaces keep `Поддержка 24/7`).
  Page-specific geo banners and campaign copy are deliberately excluded.
- **MainHeader** — brand lockup, prominent purple catalog entry, the reused
  `SearchField`, and — at 768px and above — the four user actions Compare /
  Favorites / Cart / Account with optional numeric badges.
- **CategoryNav** — `<nav aria-label="Категории товаров">` with the canonical
  compact category set and a trailing `Ещё` link to the catalog. Every canonical
  category now carries a typed line icon; no mega-menu or flyout exists.

**Sticky primary header — user visual PASS on 2026-09-27, accepted.**

- **Ownership:** `SiteHeader` renders a fragment in DOM order: the UtilityBar
  `div.site-header__utility`, then `<header class="site-header">` (the primary
  row and the only `banner` landmark), then the CategoryNav `<nav>`. The
  `<header>` itself is sticky (`position: sticky; inset-block-start: 0;
z-index: 10`, header surface, and a 1px `--role-border-soft` box-shadow line
  that overlaps the category row's top border at rest). It uses the page wrapper
  as its sticky parent. There is no `display: contents`.
- **Scrolling:** UtilityBar and CategoryNav scroll away normally. There is no
  scroll listener, JS scroll state, hide-on-scroll or collapse.
- **Heights:**
  - ≥1080px: one row, 88.4px, unchanged desktop design;
  - 768–1079px: one row, 68px; 44px controls, short «Каталог» label, icon-only
    actions with visually hidden labels and badges;
  - <768px: 94px; brand line, then catalog + search with 44px controls;
  - <360px: the catalog button becomes a 44px icon-only square, keeping its
    accessible name, so the search placeholder fits.
- **Search placeholder:** the short «Поиск товаров» is used below 1080px; the
  QR scan action stays <768px only.
- **Scroll padding:** `html:has(.site-header)` sets `scroll-padding-block-start`
  to 96 / 76 / 102px (≥1080 / 768–1079 / <768), so keyboard focus and anchors
  are not hidden under the row.
- **Layering:** above page content (max z 3), below `MobileActionBar` (20)
  and the floating/dialog layer (30).
- Product Details tabs are not sticky; a future sticky tabs row must offset by
  88.4 / 68 / 94px.

**`MobileActionBar` is a separate mobile shell owner**, not a header
subcomponent: `src/components/shell/MobileActionBar.tsx`, rendered by the page
alongside `SiteHeader`. Below 768px the four user actions leave the header
entirely and appear here as `<nav aria-label="Быстрые действия">` fixed to the
bottom of the viewport, with `env(safe-area-inset-bottom)` respected and the same
optional count badges. The actions are never visible in both places at once. It
owns no state, store, context, auth inference or router. Because no GlobalShell
wrapper exists yet, **any real page or shell integration must reserve the mobile
bottom inset itself** — the temporary header reference does this with
reference-owned bottom padding, and production CSS adds no global body padding.

`SiteHeader` is presentation-only. It accepts narrow explicit destination props,
optional action counts, an optional search-submit callback and an optional
category list. It owns **no** router, application state, cart/wishlist/comparison
model, auth or session inference, and makes no network request. Destination
props default to `import.meta.env.BASE_URL`, and Routing Foundation deliberately
left every Header destination on that fallback rather than inventing routes.

Backwards-compatible extensions proved by these real consumers; nothing else
changed in closed Components:

- `SearchField` gained `labelVisuallyHidden?: boolean` (default `false`), which
  applies the existing `.ui-visually-hidden` utility to the field label so the
  compact header search keeps a real accessible label with no visible one.
- `SearchField` gained `trailingAction?: SearchFieldTrailingAction` (default
  `undefined`) — one extra real `<button type="button">` in the existing search
  action area, with its own accessible label. `SiteHeader` passes it as the
  mobile QR affordance only when the consumer supplies `onScanRequest`, so no
  non-functional control is ever rendered. **QR scanning itself does not exist**:
  there is no camera access, permissions request, QR library or decoding — the
  callback is presentation only.
- The typed `Icon` registry gained `menu`, `store`, `scan-qr` and the nine
  category icons `smartphone`, `tablet`, `laptop`, `accessories`, `headphones`,
  `watch`, `tv`, `gamepad`, `appliance`, each backed by a local SVG in the
  existing 24×24 stroke style. No icon dependency was added.
- `SiteHeaderCategory` gained an optional `icon?: IconName`. The canonical
  categories supply their own; consumer-supplied categories may omit it.

Existing `SearchField` callers and the Components reference render identically:
the defaults produce byte-identical markup, and the Components reference shows no
trailing action and unchanged input padding.

Responsive behaviour is **system-first**, because no authoritative mobile raster
exists for this normalized header. At 1280px and above the three rows are
unchanged from the accepted desktop direction. Below 1080px the main row splits
into brand + actions over catalog + search. Below **768px** the header switches
to its mobile composition: the utility row keeps only `Москва` and `Магазины`,
the top action group is hidden in favour of `MobileActionBar`, the catalog entry
becomes a compact `Каталог` action beside the brand rather than a full-width
purple block, search takes its own full-width row and gains the QR action, and
category navigation switches to a horizontally scrollable icon-over-label row. No
hamburger drawer, overlay, mega-menu or mobile menu was invented.

Below 768px the category row is a **drag/swipe carousel driven by Embla**. The
earlier CSS-only scroll/snap version was replaced after user visual review: it
was technically correct but did not read as interactive, and horizontal scrolling
alone was not discoverable enough. `SiteHeader` calls `useEmblaCarousel` directly
with `align: 'start'`, `containScroll: 'trimSnaps'`, `loop: false`,
`dragFree: false`, `skipSnaps: false` and
`breakpoints: { '(min-width: 768px)': { active: false } }`.

Embla is therefore **active only below 768px**. At 768px and above the category
row stays the ordinary horizontal navigation row it already was — the native
`overflow-x: auto` scroller with its hidden scrollbar and
`scroll-padding-inline: 96px` now lives in a `media-up(768px)` block, so nothing
above the mobile band changed. There is never more than one scrolling mechanism
active: at mobile the list is `overflow-x: visible` and only Embla translates it.

DOM stays semantic — `<nav aria-label="Категории товаров">` → `Container` → an
Embla viewport `<div>` → the `<ul>` as Embla's container → `<li>` slides holding
real `<a>` links. No slide divs, no carousel ARIA, no "slide N of M"
announcements, no dots, arrows, autoplay or loop. The mobile viewport uses
`overflow: hidden` and `touch-action: pan-y pinch-zoom`, so vertical page
scrolling still works when the gesture starts on the strip. The mask/edge-fade,
negative-margin full-bleed geometry and CSS scroll-snap from the previous
revision were all removed; the continuation cue is now the partially visible next
category, and drag is the primary affordance. Embla's default `watchFocus`
handles keyboard focus, which scrolls focused links into view instantly.

`options.duration` is deliberately **not** set for reduced motion: Embla's
drag-release settle uses its own internal drag constant rather than
`options.duration`, and its focus scrolling already runs at duration 0. With no
dots, arrows or other programmatic scrolling in this strip there is no
`duration`-governed animation to suppress, so a
`(prefers-reduced-motion: reduce)` breakpoint would have been a no-op.

No shared carousel abstraction was created. There is no `Carousel`,
`CarouselSlide`, `CarouselDots`, `CarouselArrows` or `useGoodCallCarousel`;
extraction is deferred until a second real consumer establishes the common
contract. The Home hero slider is a second, Home-owned Embla consumer with
its own markup. It did not justify a shared abstraction either.

`?reference=header` renders the real production `SiteHeader` and
`MobileActionBar` above a neutral reference-only body, and passes a real local
`onScanRequest` callback so the QR button can be exercised without fake
behaviour. It renders no NewsletterBand and no footer; every page family remains
unimplemented. No dependency was added.

### Global Shell A — Container

**User visual PASS received on 2026-08-24. Global Shell A is accepted.**

Global Shell A added exactly one production layout primitive, `Container`, in
`src/components/layout/`. Its contract:

- one neutral horizontal layout primitive rendering a plain `<div>` with the
  canonical class `.layout-container`;
- maximum outer width 1440px — the outer border-box width, horizontal padding
  included, because the app is globally `box-sizing: border-box`;
- centred with `margin-inline: auto`;
- responsive horizontal gutters from the existing helper, authored as
  `helpers.fluid(32, 16)` over the unchanged 320 → 1280 viewport range;
- no size, fluid, gutter, padding or variant props, and no polymorphic `as`;
- no vertical spacing, background, border, typography, grid or semantic
  ownership.

Region backgrounds stay full viewport width; only the content inside a
`Container` is constrained, and `SiteHeader` is its first production consumer.
`?reference=layout` remains the Container verification surface.

**Components — closed.**

Final integrated Components visual PASS received from the user on 2026-08-24.
This applies to the post-polish / post-section-03 integrated Components
reference and is the acceptance basis for closing the overall Components
milestone.

Closed slices: **Components A — Core Controls & Forms**, covering raster sections
02 Buttons & Controls and 03 Inputs & Forms, **Components B — Product
Components**, covering raster section 04, **Components C — Content & Marketing**,
covering raster section 05, **Components D — Account Components**, covering
raster section 06, **Components E — Commerce Blocks**, covering raster section
07, and **Components F — Utility & Feedback**, covering raster section 08.

Components A received user visual PASS on 2026-08-23 and is closed.

Components B received user visual PASS on 2026-08-23 and is closed. The
prepared product assets are consumed, the existing Chip, QuantityStepper and Icon
primitives are reused, and no product domain model, cart store or wishlist store
was introduced. Raster section 01 remains deferred to future Global Shell work.

User visual PASS received for Components C — Content & Marketing on 2026-08-23.
Components C is closed. All four prepared section-05 assets are consumed — the
reused `product-phone.svg`, the headset icon through the existing Icon system,
the sale-bags promo illustration and the generic technology brand mark. No CMS
layer, marketing data model or newsletter backend was introduced.

Components D — Account Components received user visual PASS on 2026-08-23 and
is closed.

Components E — Commerce Blocks received user visual PASS on 2026-08-24 and is
closed.

Components F — Utility & Feedback received user visual PASS on 2026-08-24 and is
closed.

Foundations and Components A, B, C, D, E and F are closed. Overall Components is
closed. Every raster Components section is implemented; Section 01 Header &
Navigation is implemented by Global Shell B / SiteHeader + MobileActionBar.

The section-03 narrow reference-composition overflow is corrected. The root cause
was the reference-only fixed 360px minimum on `.cmp-fields`; reusable Inputs &
Forms primitives were unchanged, and Components A remains closed. Section 03 now
measures 0px horizontal overflow at 1440px, 768px, 375px and 320px, and the whole
Components reference no longer horizontally overflows at 375px or 320px. No
dependency, Foundation or public API changed. No technical blocker remains before
overall Components milestone closure.

The current Components A visual-polish correction is applied: active Tabs no
longer change on hover, enabled field surfaces share a coherent hover state, and
SelectField / DateField now use GoodCall-styled floating popup surfaces instead
of browser-native popup UI.

The Components A production-controls correction is applied: SearchField is now a
stable base search primitive with GoodCall-owned clear behaviour, PhoneField uses
a fixed RU Maskito mask, the reference show-more filter demo is functional, and
the stepper/range layout corrections are reference-owned. Components A has user
visual PASS and is closed.

The RangeSlider post-PASS interaction hardening is applied. It now uses the
already-installed Radix Slider primitive and supports direct lower/upper numeric
entry, drag, keyboard and click/tap track interaction while remaining a generic
container-driven numeric range primitive. Catalog URL state is delivered by
Catalog URL State A; backend commits and filter/search architecture remain
deferred feature-level work. Components A
remains closed after the user-accepted RangeSlider regression validation.

The shared cross-component polish is technically complete: Pagination renders the
current page as a non-interactive `aria-current` marker; selected Tabs retain tab
semantics and ignore repeated active clicks; inline links use deliberate
continuous underline geometry; AddressCard uses a visible icon-plus-text edit
action and structured city/postal presentation; Chip variants share soft
background plus semantic inset ring; and Textarea remains native
`resize: vertical`.

**Foundations — closed.**

**User visual PASS received for Foundations / Colors on 2026-08-19.** The
approval came from the user; no agent self-certified it.

Closure is bounded to the evidence `Foundations.png` actually contains. That
raster is a colour scheme sheet, so the accepted design-backed scope is the
colour system: primitive, alpha and semantic/role colour tokens, gradients,
colour-only state and focus roles, global semantic colour application, and the
temporary Foundations reference surface.

Categories the raster never specified are listed under Deferred Foundations
evidence. None were invented, and none block this closure.

## Publish status

- Active branch: `main`, pushed to `origin`.
- **GitHub CI: active and green.** `.github/workflows/ci.yml` runs install →
  typecheck → lint → lint:styles → format:check → build on push and pull request
  to `main`.
- **GitHub Pages deployment: active and green.** Pages is configured with
  `build_type: workflow`, publishing from `.github/workflows/deploy.yml`.
- Published site: <https://mangust5580.github.io/GoodCall/>

## Task handoff output

Every bounded Claude Code or Codex task finishes by fully overwriting
repository-root `AUDIT.md` with its final result — implementation, publish,
maintenance, review and correction tasks included, and blocked or failed tasks
too. It is the current attachable handoff, never appended to and never
committed; `/AUDIT.md` is gitignored.

Independent audits themselves remain optional. See the AUDIT.md section of
`AGENTS.md`.

## Implemented layers

- React + TypeScript + Vite SPA baseline.
- Entry point: `src/main.tsx`.
- Application ownership: `src/app/`.
- Global styling entry: `src/styles/global.scss` — applies page surface, primary
  text and link roles. Ordinary inline links carry a deliberate continuous
  underline (`text-decoration-thickness: 1px`, `text-underline-offset: 3px`,
  `text-decoration-skip-ink: none`) so Cyrillic descenders do not break the rule
  and links stay distinguishable by more than colour. Anchors carrying
  `.ui-button` remain un-underlined because the shared Button contract sets
  `text-decoration: none`.
- Foundations colour tokens: `src/styles/foundations/` (`_colors.scss`,
  `_gradients.scss`, `_index.scss`).
- Generic SCSS helpers: `src/styles/helpers/` (fluid scalars, media mixins,
  `emit-vars`).
- Generic UI SVG icon assets for Components A controls/forms:
  `src/assets/icons/`.
- Foundations colour reference surface: `src/reference/FoundationsColorReference.tsx`
  with its own reference-only styles.
- Temporary reference pages: `src/reference/TemporaryReference.tsx`.
- Canonical layout primitive: `src/components/layout/` — `Container`, with its
  styles in `layout.scss`.
- Canonical global shell: `src/components/shell/` — `SiteHeader` and
  `MobileActionBar`, with their styles in `header.scss`, `NewsletterBand`, the
  canonical pre-footer newsletter region, with its styles in `newsletter.scss`,
  and `SiteFooter`, the canonical shell footer, with its styles in
  `footer.scss`.
- Canonical brand lockup: `src/components/brand/` — `BrandLogo`, with its styles
  in `brand.scss` and the accepted brand mark in `src/assets/brand/`. The same
  SVG is the document favicon source.
- Canonical media primitive: `src/components/media/` — `Picture`, the local
  responsive raster renderer. It needs no stylesheet of its own.
- Location capability: `src/components/location/` — `CityLocationControl`,
  `CityPickerDialog`, the DaData adapter, the `goodcall.city.v1` storage helper
  and `location.scss`. It owns the Header city control and nothing else.
- Authored raster sources: `src/assets/**/*.{png,jpg,jpeg}`. Generated
  AVIF/WebP/fallback candidates exist only in `dist/assets/`.
- Reusable controls and form fields: `src/components/ui/`, with the shared
  control system in `controls.scss`.
- Reusable product presentation components: `src/components/product/`, with their
  styles in `product-components.scss`.
- Product illustration assets for section 04: `src/assets/products/`.
- Reusable content and marketing components: `src/components/content/`, with
  their styles in `content-components.scss`.
- Reusable account presentation components: `src/components/account/`, with
  their styles in `account-components.scss`.
- Reusable commerce presentation components: `src/components/commerce/`, with
  their styles in `commerce-components.scss`.
- Reusable utility and feedback components: `src/components/feedback/`, with
  their styles in `feedback-components.scss`.
- Commerce brand and store assets for section 07: `src/assets/commerce/`.
- Content and marketing assets for section 05, plus the decorative
  `newsletter-gift.svg` consumed by `NewsletterBand`: `src/assets/marketing/`.
- Officially sourced third-party social brand marks consumed by `SiteFooter`:
  `src/assets/social/` — `vk.svg`, `telegram.svg`, `youtube.svg`, `rutube.svg`.
  They are brand assets, not `Icon` registry entries.
- Components A, B, C, D, E and F reference surface:
  `src/reference/ComponentsReference.tsx`.
- Global Shell Container reference surface: `src/reference/LayoutReference.tsx`, with
  its reference-only styles in `LayoutReference.scss`.
- Global Shell Header reference surface: `src/reference/HeaderReference.tsx`, with its
  reference-only styles in `HeaderReference.scss`.
- Global Shell NewsletterBand reference surface:
  `src/reference/NewsletterReference.tsx`, with its reference-only styles in
  `NewsletterReference.scss`.
- Global Shell SiteFooter reference surface: `src/reference/FooterReference.tsx`, with
  its reference-only styles in `FooterReference.scss`.
- First page family: `src/pages/catalog/` — `CatalogPage`, with its styles in
  `catalog.scss`. Its reference surface is `src/reference/CatalogReference.tsx`, with
  reference-only styles in `CatalogReference.scss`.

There is no data layer and no feature architecture. The reference surfaces are
development comparison pages, not product UI; `src/app/ProductionRouter.tsx` and
`src/app/routes/CatalogRoute.tsx` are the production routing layer beside them.

### Components A

`src/components/ui/` provides Button, Tabs, Chip, Toggle, Checkbox, Radio,
QuantityStepper, Pagination, TextField, SearchField, SelectField, TextareaField,
PhoneField, DateField, RangeSlider and Icon, exported through `index.ts`.

The shared control system lives in `controls.scss` as Components-owned custom
properties: general controls use `--control-height: 48px`, generic Buttons use
the dedicated `--button-height: 44px`, and the rest of the system keeps three
radii, one border and focus treatment, one padding and one icon size. This is
owned by Components, not Foundations, and is deliberately not a general spacing,
radius, type or button-size scale.

Pagination renders the current page as a non-interactive
`<span aria-current="page">` carrying the active geometry with `cursor: default`
and no hover change; every other numeric page stays a button and the
previous/next arrows keep their disabled semantics. The public Pagination API is
unchanged.

Selected Tabs keep full tab semantics — real `<button>`, `role="tab"`,
`aria-selected="true"`, `tabIndex={0}` and ArrowLeft/ArrowRight roving focus —
but use `cursor: default` and ignore a repeated click on the already-selected
tab, so `onChange` never re-fires for the current selection. The Tabs API is
unchanged.

All three Chip variants share one treatment: semantic soft background, semantic
readable text and a thin semantic inset ring. The rings are `inset box-shadow`
rather than a border, so Chip geometry is byte-identical across variants and
consumers. Brand derives its ring from `--role-text-link` and danger from
`--role-state-danger`; the accepted accessible success treatment is unchanged.
`Chip` keeps exactly `brand | success | danger` — the reference's Бейджи group
is another composition of the same Chip, not a separate Badge component.

TextareaField deliberately keeps native `resize: vertical`. Auto-grow is
deferred until a concrete consumer requires it; no scrollHeight measurement,
ResizeObserver or autosize dependency was introduced.

`.ui-button` owns the complete visual state of any element carrying its classes,
including anchors. The global `a:hover` rule outranks a bare variant class, so
every variant reasserts its own hover colour and `.ui-button` sets
`text-decoration: none` centrally. Without that, an `<a class="ui-button">` CTA
picked up the link hover colour while the native `<button>` did not. This was a
stylesheet-only correction: no Button API, variant set, geometry or markup
changed, and no consumer needed a local override.

Icons are the prepared SVGs in `src/assets/icons/`, applied as CSS masks so they
inherit `currentColor`. The SVG paths are never duplicated into TypeScript.

SelectField uses Radix Select and DateField uses Radix Popover with DayPicker
from `@daypicker/react`. Their popup surfaces share Components-owned background,
border, radius and elevation decisions; those decisions have not moved into
Foundations.

DateField navigation (Quality E): when both `min` and `max` are valid, the
calendar caption is GoodCall-styled Radix Select month («Выберите месяц») and
year («Выберите год», newest first) selectors on the shared select surface,
with DayPicker `startMonth`/`endMonth` from the bounds, `navLayout="after"`
and bound-aware previous/next (`aria-disabled` at the edges; out-of-range
outside days are hidden). Fields without both bounds keep the original label
caption and unbounded month stepping, so the `?reference=components` specimen
is unchanged. The public API is unchanged: values stay `YYYY-MM-DD`, and only
selecting a day changes the value; month/year navigation never does. The
`account` verify suite owns these checks.

SearchField is a reusable control primitive only. It keeps native `type="search"`
semantics, suppresses browser-native cancel UI, and owns value, clear and submit
control behaviour. Future ProductSearch belongs to a feature-level consumer that
composes SearchField with a dedicated combobox/autocomplete interaction layer
when the Header/Search milestone creates a real consumer.

Future ProductSearch must account for query autocomplete, product/category/brand
suggestions, keyboard navigation, Enter / Escape / Arrow key behaviour, click
outside, async loading, request cancellation / stale-result protection,
IME/composition correctness, touch/mobile behaviour, empty/error/no-result
states, and a "show all results" action. A future interaction library such as
Downshift may be introduced then if it is still the best fit; none is installed
now.

Future ecommerce search backend capability requirements are recorded as
requirements, not an engine choice: typo tolerance, Russian morphology,
transliteration, keyboard-layout correction, synonyms, model/SKU exact matching,
prefix search, ranking/boosting, category/brand/attribute facets, facet counts,
price range, pagination, suggestions, and availability/popularity ranking inputs.
No Elasticsearch, OpenSearch, Typesense, Meilisearch, Algolia or other engine is
selected yet.

Real catalog filtering should be URL-driven at feature/page level rather than
hidden only in local component state. Checkbox, RangeSlider and Button remain
reusable primitives; the current Preferences show-more behaviour is reference
demo composition only.

RangeSlider uses Radix Slider through the existing `radix-ui` dependency. It is
controlled by a generic lower/upper numeric tuple, renders compact editable value
fields, preserves formatted display outside editing, and supports pointer,
keyboard and nearest-thumb track click/tap interaction. It does not own ecommerce
price, query, request or apply/reset semantics.

PhoneField uses Maskito with a fixed Russian presentation mask for
`+7 (___) ___-__-__`. It is input assistance, not phone-number validation.
International support, country selection and backend validation remain deferred
until concrete product form requirements exist.

The Components reference surface composes the real components; it does not
reimplement look-alike markup.

### Components B

`src/components/product/` provides ProductCard, MiniProductCard, PriceBlock,
ProductRating, ProductAvailability, FavoriteButton and AddToCartButton, exported
through `index.ts`. Section 04 of the raster is reachable at
`?reference=components`.

One `ProductCard` covers both raster card specimens through a `layout` prop
(`vertical` / `horizontal`). The two layouts share one markup tree; the
differences are expressed entirely in CSS, so no layout branching exists in the
component. `MiniProductCard` stays separate because section 04 evidences only
media plus the two actions for it, and folding it into ProductCard would have
required optional slots the larger cards do not need.

These are presentation components. They take formatted display strings for
prices, plus callbacks and pressed/quantity state from their consumer. There is
no product entity, SKU schema, money model, inventory type or API response type,
and no cart, wishlist or comparison store. Price formatting for the reference
specimens lives in the reference layer.

Chip remains the only badge primitive — it covers Новинка, Хит продаж, -25% and
В наличии without extension. QuantityStepper remains the only quantity
primitive and is reused unchanged in the horizontal card. The heart, cart and
star icons are consumed through the existing Icon mask system.

Favorite and cart actions share one product-owned `product-action` primitive.
A generic application-wide IconButton was deliberately not created: the two
current consumers are both product surfaces, and Components A controls were not
retrofitted.

Product Components add a small Components-owned geometry group —
`--product-card-radius`, `--product-card-padding`, `--product-card-gap`,
`--product-media-height`, `--product-action-size` and `--product-action-radius` —
consumed by more than one section-04 component. It is not a general spacing or
radius scale and does not reopen Foundations.

Section-04 specimen widths belong to the reference composition, not to the
components. The reusable components take the width their consumer gives them.

### Components C

`src/components/content/` provides PromoBanner, CategoryCard, BrandCard,
SupportCard and NewsletterCard, exported through `index.ts`. Section 05 of the
raster is reachable at `?reference=components`.

**Banner normalization.** The raster's two banner specimens — промо and
категория — are structurally identical: title, supporting line, CTA and
subordinate artwork on a purple gradient surface. They are therefore served by
one `PromoBanner` with no tone or style variant. Both surfaces use the accepted
`--gradient-cta`; the raster's two slightly different purple mixes were
normalized into that one accepted gradient rather than encoded as one-off
colours. That gradient is also the only accepted brand gradient whose stops keep
white body text at or above 4.5:1 contrast, so the normalization is an
accessibility decision as much as a system one.

These are presentation components. They take copy strings, image sources and
callbacks. There is no CMS entity, campaign model, category or brand registry,
analytics payload or content DTO, and no application-wide `Content` type.

`PromoBanner` renders its CTA as an anchor when given `href` and as the existing
Button when given `onAction`, so navigation and action semantics are never
swapped. `CategoryCard` and `BrandCard` become a single whole-card anchor when
given `href` and stay non-interactive otherwise; neither ever nests interactive
controls. `SupportCard` takes an `IconName` and renders it through the existing
Icon system as decorative artwork beside visible text.

`NewsletterCard` is a real `<form>` with a native `type="email"` `required`
input, a programmatic visually hidden label and a real submit button. It owns
presentation and local form semantics only: value and submit are controlled by
the consumer through `value` / `onValueChange` / `onSubmit`. There is no
request, no persistence, no subscription service, no validation library and no
async loading architecture. Native browser validation gates submission. The
reference surface holds the only state — an email string and an `aria-live`
confirmation message.

Content Components add four Components-owned geometry properties —
`--content-card-radius`, `--content-card-padding`, `--content-banner-radius` and
`--content-banner-padding`. Everything else reuses accepted Foundations colour
roles and the existing `--control-*` geometry, `.ui-input`, `.ui-button`,
`.ui-visually-hidden` and the `control-focus` mixin. No new spacing, radius or
type scale was introduced and Foundations was not reopened.

Section-05 specimen widths belong to the reference composition. The reusable
components are container-driven and carry no reference max-width. Layout is
intrinsic flex wrapping; no media query and no named breakpoint were added.

Assets consumed: the reused `src/assets/products/product-phone.svg` for the
promo banner and the category card, `src/assets/marketing/promo-sale-bags.svg`
for the seasonal banner, `src/assets/marketing/brand-tech.svg` for the brand
card, and the `headset` icon through the existing Icon system. The brand card
uses the generic mark with a generic `GoodTech` label; no trademark was
substituted.

### Components D

`src/components/account/` provides AccountNavigation, AccountStats, OrderRow,
AddressCard and AccountSettingsCard, exported through `index.ts`, with styles in
`account-components.scss`. Section 06 of the raster is reachable at
`?reference=components`. Components D received user visual PASS on 2026-08-23
and is closed.

Section 06 contains five visible presentation roles, and each has exactly one
owner: account navigation, account statistics, order row, delivery address card
and settings card.

**Normalization.** `AccountNavigation` owns the nine repeated navigation rows;
nine bespoke row components were rejected. `AccountStats` owns the three
repeated metric rows and is deliberately not a generic application-wide Stats
component. `OrderRow`, `AddressCard` and `AccountSettingsCard` stay separate
because their markup and interaction semantics differ materially. A generic
`AccountCard` mega-component is rejected.

**Navigation semantics.** `AccountNavigation` renders a real `<nav>` with an
accessible label and a `<ul>`. The eight navigation rows are real anchors and
the current one carries `aria-current="page"` plus a weight change, so the
selected state is not colour-only. Sign out is a real `<button>` in the same row
family because it is an action, not navigation. The pill-shaped generic Button
was not used for menu rows; an account-owned row style covers both.

**Address presentation.** `AddressCard` takes structured locality props —
`city` plus optional `postalCode` — instead of a flat locality string, so no
consumer string is parsed and no address domain model exists. The city carries
bounded emphasis (weight 600 on the secondary text role) while the postal code
stays regular and muted, joined by ordinary punctuation. Its edit affordance is
a visible icon-plus-text button (`.address-card__edit`) above a hairline
divider, matching the scanability of the commerce saved-payment add action while
staying Account-owned; the visible label is the accessible name and the icon is
decorative. The former icon-only square treatment and its now-unused
`.account-action--edit` modifier were removed; `.account-action--outline` and
`--cart` remain in use by `OrderRow`.

**Order status.** The existing success `Chip` is reused for the delivered state.
The raster paints that status as bare green text, but status presentation is
already normalized onto Chip by the closed section-04 work. The shared success
Chip keeps `--role-state-success-soft` as its background and now uses a
Components-owned green-forward `color-mix()` treatment derived from
`--role-state-success` and `--role-text-primary`, plus an inset success ring.
This restores clear positive semantics while keeping measured AA text contrast
at roughly 5.45:1 and adding or changing no Foundations token. No account-owned
status element was created and the Chip API was not extended.

**Order actions.** The raster shows the details affordance twice - as a bare
chevron at the right edge of the product row and as a small bordered square
button beside the cart button. These were normalized into one bordered details
control that uses the existing `chevron-right` icon, sitting next to the filled
reorder control that uses the existing `cart` icon. `OrderRow` renders the
details control as an anchor when given `detailsHref` and as a button when given
`onDetails`, and its public props require exactly one of those targets. Both or
neither are invalid at the TypeScript API boundary, so navigation and action
semantics are never swapped. Both controls are account-owned `.account-action`
treatments; the product-owned `product-action` primitive was not borrowed and no
generic IconButton was created.
Editable order quantity, reactive item totals and removing a single order item
remain deferred because they belong to a future editable cart/order-line
workflow rather than the current account order-history presentation row.

These are presentation components. They take labels, formatted strings, icon
names, image source/alt, hrefs, callbacks and checked booleans. There is no
`User`, `Account`, `Order`, `Address` or `LoyaltyAccount` type, no backend DTO,
no repository or service interface and no shared account-domain type module. The
only exported types are the two component-local item shapes
`AccountNavigationItem` and `AccountStatsMetric`.

`AccountSettingsCard` reuses the existing `Toggle` unchanged for both
notification switches and is fully controlled by its consumer. Its label-left /
switch-right order is achieved by account-owned layout around `.ui-toggle`, not
by a Toggle API change. Its outline action is an account-owned rounded-rect
`<button>` rather than the pill-shaped `Button`, because the raster action is a
full-width row control, not a pill. There is no persistence and no async state.

`AddressCard` reuses the existing `map-pin` and `person` icons as decorative
leading scan aids for the address and recipient/contact groups. Its public API,
plain readable text order and edit button semantics are unchanged.

Account Components add a small Components-owned geometry group -
`--account-card-radius`, `--account-card-padding`, `--account-card-gap`,
`--account-row-radius`, `--account-action-size` and `--account-action-radius` -
consumed by more than one section-06 component. Everything else reuses accepted
Foundations colour roles, the existing `--control-*` geometry and the
`control-focus` mixin. No new spacing, radius or type scale was introduced,
Foundations was not reopened, and there is no dependency on
`content-components.scss` geometry.

Section-06 specimen widths belong to the reference composition. The reusable
components are container-driven and carry no reference max-width. Layout is
intrinsic flex wrapping; no media query and no named breakpoint was added.

Assets consumed: all nine prepared section-06 icons - `person`, `package`,
`compare`, `return`, `bonus`, `map-pin`, `settings`, `log-out` and `edit` - plus
the existing `heart`, `cart` and `chevron-right` icons, all through the existing
Icon mask system, and the existing `src/assets/products/product-earbuds.svg` for
the order specimen. No new asset was added and no prepared icon geometry was
changed.

The visible account concepts remain presentation-only. No auth/session
architecture, account/user entity, address/order/payment model, loyalty model,
notification persistence model, router, global state or API/backend contract has
been chosen or introduced.

### Components E

`src/components/commerce/` provides CommerceCartSummary, CommerceOptionGroup,
SavedPaymentList, CommerceLocationCard and CommerceServiceCard, exported through
`index.ts`, with styles in `commerce-components.scss`. Section 07 of the raster
is reachable at `?reference=components`. Components E received user visual PASS
on 2026-08-24 and is closed.

Section 07 contains six visible presentation roles served by five components:
mini cart summary, delivery option block, payment-method selector, saved-payment
list, store card and service-center card.

**Normalization.** The delivery option block and the payment-method selector are
one Commerce-owned selectable-options family. Both are repeated mutually
exclusive rows with a primary label, optional trailing value, optional secondary
metadata and a selected state, so `CommerceOptionGroup` serves both; two
primitive families were rejected. `SavedPaymentList` stays separate because
saved instruments are not mutually exclusive choices and carry brand marks
rather than radio semantics. `CommerceCartSummary` stays Commerce-owned rather
than extending `ProductCard`, `MiniProductCard` or `OrderRow`.
`CommerceLocationCard` and `CommerceServiceCard` stay distinct owners: the store
card is media-backed, while the service card leads with a large decorative
`tools` glyph. Both present their address, hours and phone as the same icon-led
metadata rows (`map-pin`, `clock`, `phone`), which the two cards share through
Commerce-owned SCSS mixins rather than a shared component. A generic
`CommerceCard` mega-component is rejected.

**Primitive reuse.** `CommerceCartSummary` composes the existing
`QuantityStepper` and `Button`, rendering the CTA as an anchor when given
`actionHref` and as `Button` when given `onAction`, mirroring the accepted
`PromoBanner` pattern so navigation and action semantics are never swapped.
`CommerceOptionGroup` composes the existing `Radio`, whose `label` already
accepts a `ReactNode`, so the two-line option content needs no Radio change. The
option row re-lays `.ui-choice` as a two-column grid from Commerce-owned styles;
the `Radio` component and its API were not modified. `clock`, `phone`, `tools`,
`map-pin` and `edit` are consumed through the existing `Icon` mask system.

**Group labelling.** `CommerceOptionGroup` is a real `<fieldset>` with a
`<legend>`, and `SavedPaymentList` is a `<section>` with an `<h3>`. Both accept
`hideLabel`, mirroring the accepted `Toggle` API. The reference passes
`hideLabel` because the raster shows those captions as specimen labels above the
card, which the reference `Group` title already renders; duplicating them inside
the cards would deviate from the raster.

These are presentation components. They take labels, formatted strings, ids,
selected ids, image source/alt, brand source/alt, hrefs, callbacks and a
quantity value. There is no `Cart`, `CartItem`, `PaymentMethod`, `SavedCard`,
`DeliveryMethod`, `Store` or `ServiceCenter` type, no backend DTO and no shared
commerce-domain type module. The only exported types are the two
component-local repeated-item shapes `CommerceOption` and `SavedPaymentEntry`.

No cart store, checkout state machine, order creation, pricing/coupon/tax/
shipping engine, payment SDK, tokenization, persistence, router, global state,
auth/session or API contract was introduced. The reference surface holds the
only state: quantity, selected delivery option, selected payment option and one
visually hidden `aria-live` demo message.

Commerce Components add a small Components-owned geometry group —
`--commerce-card-radius`, `--commerce-card-padding`, `--commerce-card-gap` and
`--commerce-row-gap` — consumed by more than one section-07 component, plus two
Commerce-owned mixins for the shared card surface and the shared hairline
divider. Everything else reuses accepted Foundations colour roles, the existing
`--control-*` geometry and the `control-focus` mixin. No account-owned custom
property is borrowed, no new spacing/radius/type scale was introduced and
Foundations was not reopened.

Section-07 specimen widths belong to the reference composition. The reusable
components are container-driven and carry no reference max-width. Layout is
intrinsic flex wrapping; no media query and no named breakpoint was added.
Section 07 shows no horizontal overflow at 1440px, 768px, 375px or 320px.

Assets consumed: the three prepared generic icons `clock`, `phone` and `tools`
plus the existing `map-pin` and `edit`, all through the `Icon` system;
`payment-mir.svg` as the only current saved-payment brand image asset, consumed
as a direct image asset and deliberately not an `IconName` entry; the prepared
`store-europeisky.webp`; and the existing `src/assets/products/product-phone.svg`
for the cart specimen. The saved-payment reference uses three MIR-only demo rows
with distinct masked endings, while `SavedPaymentList` remains brand-agnostic
and receives `brandSrc`, `brandAlt` and `cardLabel` from presentation data. The
payment-method selector still demonstrates multiple payment methods. The unused
VISA and Mastercard reference assets were removed. No new asset was added and no
prepared asset geometry was changed. The previous Mastercard optical-size delta
no longer applies because Mastercard is no longer part of the current reference.

### Components F

`src/components/feedback/` provides FAQAccordion, EmptyState, SuccessFeedback,
InfoDialog, ConfirmationDialog and ProductActionDialog, exported through
`index.ts`, with styles in `feedback-components.scss`. Section 08 of the raster
is reachable at `?reference=components`. Components F — Utility & Feedback
received user visual PASS on 2026-08-24 and is closed.

Section 08 contains six visible presentation roles, each with exactly one owner:
FAQ accordion, empty cart state, success feedback panel, informational modal,
destructive confirmation and product action modal. No `UtilityCard`,
`FeedbackCard`, `StateCard` or schema-driven feedback renderer exists.

FAQAccordion is a controlled single-open Radix Accordion with a local
reduced-motion-aware transition. InfoDialog and ProductActionDialog use Radix
Dialog, while ConfirmationDialog uses Radix AlertDialog. No dependency,
notification bus, modal manager or global feedback architecture was introduced.

Components F uses the existing `cart`, `check` and `chevron-down` icons through
the Icon system, and the existing `src/assets/products/product-earbuds.svg` in
the reference product specimen only. New asset count: 0. Section 08 shows no
horizontal overflow at 1440px, 768px, 375px or 320px.

### Colour tokens

86 CSS custom properties are emitted on `:root` from Sass maps, which are the
single source of truth:

- 33 primitives — base, status, Brand Purple 50-900, Accent Violet 100-700,
  Neutral Gray 50-900 (`--color-*`)
- 15 alpha steps — white, black, purple (`--alpha-*`)
- 32 semantic roles — text, surface, border, state, overlay, backdrop
  (`--role-*`)
- 6 gradients (`--gradient-*`)

Eight semantic roles carry literal values because the raster specifies colours
absent from every primitive ramp: Card Soft, Brand Soft, Hero, Border Soft,
Success Soft, Warning Soft, Danger Soft, Info Soft. They are intentionally not
aliases and no fake primitive steps were added for them.

Overlay and Backdrop define a base colour only. The raster states no opacity and
no difference between them, so composition is deferred.

## Active tooling

| Concern         | Tool                                            |
| --------------- | ----------------------------------------------- |
| Build / dev     | Vite 8 + `@vitejs/plugin-react`                 |
| Language        | TypeScript 6 (`strict`), project references     |
| Styling         | SCSS via `sass-embedded`                        |
| CSS pipeline    | PostCSS: `postcss-pxtorem` then Autoprefixer    |
| JS/TS linting   | ESLint 9 flat config (type-aware)               |
| Style linting   | Stylelint 17 + `stylelint-config-standard-scss` |
| Formatting      | Prettier 3                                      |
| CI / deployment | GitHub Actions                                  |

### px-first authoring, rem on output

SCSS source authors lengths in `px` and never hand-writes `rem`. Stylelint's
`unit-disallowed-list` rejects `rem` in source. `postcss.config.js` is the single
conversion point.

- Root basis: 16px, `replace: true`.
- `minPixelValue: 2` — intentional 1px hairlines stay 1px.
- `mediaQuery: false` — authored px breakpoints stay px in compiled CSS.
- Only `px` is matched, so `%`, viewport, container units, `fr`, angles, time and
  unitless values pass through untouched.

Verified in build output: `24px → 1.5rem`, `18px → 1.125rem`, `1px solid`
unchanged, `50%` / `100dvh` unchanged, `@media (width >= 768px)` unchanged.

Stylelint's `length-zero-no-unit` is configured with `ignoreFunctions: ["env"]`.
This is a deliberate, narrow option, not a disable: `env(safe-area-inset-bottom,
0px)` needs a _united_ zero because the fallback is also consumed inside
`calc()`, where adding a unitless `0` to a length is invalid CSS. Zero lengths
everywhere else still must be unitless.

### SCSS helpers

`src/styles/helpers/` holds the generic helper layer, consumed through its entry
point (`@use '../helpers' as h;`). It contains no design tokens — Foundations
owns those.

- `h.fluid($desktop, $mobile)` and `h.fluid-between($desktop, $mobile, $from, $to)`
  take **unitless px numbers**: `h.fluid(18, 14)`. Unit-bearing input is a
  compile-time error. They emit a bounded `clamp()` whose px terms the PostCSS
  boundary converts to rem, leaving the `vw` term relative.
- Default fluid viewport range: 320 → 1280.
- `h.media-up`, `h.media-max`, `h.media-range` take a px length (`768px`).
  Named breakpoints are deferred until Foundations defines them.

### Base path

`vite.config.ts` holds the only copy of the `/GoodCall/` base path. Application
code reads `import.meta.env.BASE_URL`. A future router derives its basename from
that same value.

## Temporary reference pages

The base page no longer hosts the Foundations surface. A query-string check in
`App.tsx` selects the surface. The check runs **before** the production router,
so reference surfaces are unaffected by routing; the bare base URL now belongs to
`ProductionRouter`:

- `?reference=index` — the temporary reference index, linking to the surfaces
  below. This is the explicit index address; an unrecognised `?reference=` value
  lands here too
- `?reference=foundations` — the Foundations colour reference
- `?reference=components` — the Components A, B, C, D, E and F reference
  surface
- `?reference=layout` — the Global Shell Container reference surface: several
  neutral full-width bands whose `Container` content must share identical inner
  horizontal edges at every viewport. It is deliberately neutral and is not a
  draft Header or Footer; its bands, surfaces and blocks are reference-owned
  styling that exists only to expose Container boundaries.
- `?reference=header` — the Global Shell Header reference surface: the real
  production `SiteHeader` and `MobileActionBar` around a neutral reference-only
  body that reserves bottom space for the fixed bar below 768px. It is not a Home
  page, and it implements no hero, catalog, breadcrumbs, footer or newsletter.
- `?reference=location` — the Location Foundation reference surface: the real
  production `SiteHeader` and `CityLocationControl` driven by an in-memory fake
  `CityLookupClient` owned by the reference file, so the flow is deterministic
  and needs no token or network. It also exposes controls to reset
  `goodcall.city.v1`, simulate a recoverable API failure and simulate a missing
  token. `?reference=header` keeps the real production lookup client.
- `?reference=newsletter` — the Global Shell NewsletterBand reference surface:
  the real production `NewsletterBand` at realistic full width on a neutral
  reference-only page, with a reference-owned `aria-live` status outside the
  component reporting the last submitted address. It builds no Home page and no
  page content module.
- `?reference=footer` — the Global Shell SiteFooter reference surface: a
  reference-only intro followed by the real production `NewsletterBand` and
  `SiteFooter`, plus `MobileActionBar` so the mobile shell overlap can be tested.
  It reserves its own bottom inset below 768px and builds no Home page.
- `?reference=home` — the Home reference surface: a reference-only note
  followed by the real production shell around the real `HomePage`. It builds no
  production route and shows no reference copy on `#/`.
- `?reference=product-details` — the Product Details A + B reference surface: a
  reference-only note followed by the real production shell around
  `ProductDetailsPage` with its deterministic local fixture. It makes no
  network or Supabase request; the production route is `#/product/:slug`.
- `?reference=catalog` — the Catalog reference surface: a reference-only note
  followed by the real production shell — `SiteHeader`, `CatalogPage`,
  `NewsletterBand`, `SiteFooter` and `MobileActionBar`. It owns the mobile bottom
  inset and builds no Home page. It seeds no filter, sort or page state: the page
  opens in its own defaults, which are the state `Catalog.png` shows. No
  `?reference=catalog-filters` or `?reference=catalog-c` surface was added.

Links are built by `src/reference/referenceUrl.ts` from `import.meta.env.BASE_URL`, so
they resolve under the GitHub Pages base without hardcoding the repository name,
and no SPA fallback is needed because the path never changes. Every
`Back to reference index` link, and the `SiteFooter` brand link inside the
catalog and footer surfaces, points at `?reference=index`.

These are temporary development surfaces, not production routes, and will be
removed when the reference surfaces are no longer needed.

## Design reconciliation

Raster evidence defines visual intent and component coverage; accepted
Foundations and established system rules win over incidental raster differences.
Near-duplicate specimen differences are normalized into the smallest coherent
system rather than encoded as separate tokens or variants. See the System-first
design section of `AGENTS.md`.

## Code comments

The repository carries **no comments in authored code**, config, styles or
workflows. Rationale lives in the Markdown documentation instead. See the No
comments section of `AGENTS.md` for the governed file set and the rule on
functional suppression directives.

## Current visual status

**Home A / Page Structure & Section Inventory — user visual PASS on
2026-09-27, CLOSED and published.** `#/` renders the accepted Home page with zero
runtime errors, zero horizontal document overflow and no clipped text at 1440,
1280, 1024, 768, 430, 390 and 320. Measured against `Home.png` mapped to the
1440 design space, the section order matches exactly and the hero height (474),
promo pair (300), category trio (195) and cinema band (298) all match. The
accepted hero is two columns rather than the raster's three: the banner is
1076px wide and the 280px offer column is unchanged. The accepted page is taller
than the raster overall, mostly because the accepted `NewsletterBand` (196
against 109) and `SiteFooter` (265 against 202) are larger than the raster's
variants and the accepted `SiteHeader` carries a category row the raster does
not. Section affordances and unavailable destinations remain deliberately
omitted rather than faked.

**Catalog — pixel-identical to its accepted PASS state.** Restoring the
`Главная` breadcrumb link makes the production Catalog route match the accepted
Catalog C state exactly: 0 differing pixels at both 1440x2252 and 390x6685.

**Routing Foundation — visually neutral, verified.** At 1440 and 390 the
production `#/catalog/smartphones` route and `?reference=catalog` with only the
reference-only note hidden render **pixel-identical** full pages (0 differing
pixels of 1440x2252 and 390x6685). Against the accepted `HEAD` Catalog the only
delta is the breadcrumb: 242 pixels at 1440 and 264 at 390, confined to the one
`Главная` text line, where the colour moves from `--role-text-secondary` to the
muted crumb colour because the crumb is no longer a link. Page height is
unchanged. Header, `ProductCard`, filters, promo, `NewsletterBand`, `SiteFooter`
and `MobileActionBar` are untouched.

**Catalog C / Product Grid + Pagination + Sorting — user visual PASS received on
2026-08-30, closed.** `?reference=catalog` renders the real shell
around the real `CatalogPage` and reports zero horizontal document overflow,
zero runtime errors and zero failed requests at 1920 / 1440 / 1280 / 1024 / 768 /
430 / 390 / 375 / 320. The results grid resolves to 4 columns of 259px at 1920
and 1440, 3 of 298px at 1280, 2 of 333px at 1024, 2 of 351px at 768 and a single
column of 394 / 356 / 341 / 288px at 430 / 390 / 375 / 320, always with a 20px
gap and the promo band spanning every column. Sorting is verified deterministic —
default popularity, ascending 19 990 → 65 990, descending 109 990 → 28 990,
rating 4,8 → 4,5 — and changing it resets page 3 to page 1. Pagination is
verified across first, middle and last: previous is disabled on page 1, next on
page 65, the slot row reads `1 … 62 63 64 65` at the end, and every page change
swaps the visible fixtures. The results region is a labelled `<section>` holding
twelve `<article>` cards; accessible names verify as `Сортировка` (combobox),
`Добавить в избранное: …`, `Добавить в корзину: …`,
`Рейтинг 4.8 из 5, 1 284 отзыва` and `Страницы каталога` with
`aria-current="page"`. The grid contains zero anchors, zero `href="#"` and zero
product routes, and there are no duplicate ids. Favorite and cart state stay on
their own card, never reach the Header counters and never touch `localStorage`.
Catalog B still behaves: the desktop filters and the mobile dialog work, and
selecting filters or a quick preset leaves the grid, the page and
`2 546 товаров` untouched.

**Catalog B / Filters + Mobile Filter Dialog — user visual PASS received on
2026-08-29 and closed.**

**Catalog A / Page Foundation & Layout — user visual PASS received on
2026-08-29 and closed.**

**Global Shell E / SiteFooter — accepted as-is for project closeout.** `?reference=footer` reports zero horizontal document overflow, zero
runtime errors and zero failed requests at 1920 / 1440 / 1280 / 1024 / 768 / 430 /
390 / 375 / 320, and so do the base index and every earlier reference surface. The
footer surface is about 270px tall at 1280px and above (271px at 1440 with the payment chips). Layout is five columns from
1200px, three from 768px with the contacts block spanning two cells, two from
560px and one below that. The social row stays a single line of four official
marks (178px wide) at every width down to 320px, and the four payment chips share
one line everywhere. The composition holds exactly one `<footer>`
and one `<main>`; heading order runs h1 (reference) then h2 for the newsletter and
each footer group. Measured contrast on the footer surface is 4.64:1 for muted
legal and tagline text, 9.89:1 for group items and 17.77:1 for group headings; the
decorative contact tile glyph measures 4.35:1 against its tile. The footer holds
exactly three anchors — the brand home link, `tel:+78001001010` and
`mailto:info@goodcall.ru` — with zero `href="#"` and zero no-op handlers, and
keyboard focus runs brand, phone, email in visual order with the accepted 2px
ring. With `MobileActionBar` present and the page scrolled to the bottom, the last
footer content sits about 57px above the bar at 430 / 390 / 375 / 320; at 768px
the bar is not displayed.

**Global Shell D / NewsletterBand — user visual PASS received on 2026-08-27 and
closed.**

The accepted band measures 116.25px at 1440px and above, 138px at 1280px,
191.73px at 1024px, 208.97px at 768px and 346.31px at 390px; the gift is visible
from 768px up and hidden below it; measured white copy contrast over the painted
gradient stays between 4.98:1 and 10.5:1 at every width.

**Location Foundation / CitySelector — user visual PASS received on 2026-08-27,
with one explicit correction applied: service-unavailable and geolocation-failure
messages use the danger role, while loading and no-result search states stay
muted. The live DaData functional gate remains separate and open.** With Москва seeded into
`goodcall.city.v1`, the Header is **pixel-identical to the accepted Header** —
0 differing pixels at 2x DPR at 1440 / 1024 / 768 / 390 / 375 / 320, with
Header height unchanged at 180.58 / 248.58 / 248.58 / 233.19 / 233.19 / 233.19px.
The only change is the interactive and focus behaviour of the city control.
`?reference=location` and every earlier reference surface report zero horizontal
document overflow and zero runtime errors at all six widths. The confirmation
popover and the picker both fit at 320px, and the picker (`z-index: 30`) layers
above `MobileActionBar` (`z-index: 20`). The picker reuses the accepted
transparent dialog overlay, matching `feedback-dialog__overlay`, because
Foundations still defers overlay/backdrop opacity — no new elevation or backdrop
token was invented. The unavailable-service states were reproduced and then
corrected: the initial open was already clean and stays clean, a duplicate
identical availability message was removed, and — after user review — genuine
service and action failures are emphasised with the danger role again while
loading and no-result search states stay muted. The Header is unchanged by both
corrections — 0 differing pixels again at all six widths.

**Live DaData verification has still not been performed.** No local
`VITE_DADATA_TOKEN` is available (no `.env.local`, no environment variable), the
GitHub secret `DADATA_TOKEN` could not be checked because `gh` is not installed,
and `dadata.ru`/`suggestions.dadata.ru` remain unreachable from this build
environment. The adapter was therefore verified against recorded DaData response
shapes, and live search, live IP detection and live reverse geocoding remain
untested.

**Media Foundation / Picture pipeline + Icon policy — user visual PASS received
on 2026-08-27, accepted and closed.** The `CommerceLocationCard` migration is a media
delivery refactor only: card and image-slot geometry are identical at
1440 / 1024 / 768 / 390 / 320, and the remaining difference is codec-level
(mean absolute error ≈ 1/255, RMSE ≈ 2.5, 0.03–0.08% of pixels differing at a
perceptual threshold) — not visually meaningful. The build emits AVIF, WebP and
PNG candidates at 200 / 260 / 310 and Chromium selects the AVIF candidate at every
tested viewport.

**Global Shell C / BrandLogo + favicon — user visual PASS received on 2026-08-27,
accepted and closed.** The extraction was a no-regression refactor: the brand anchor,
mark, wordmark, gap, font and Header height are identical at
1920 / 1440 / 1280 / 1024 / 768 / 430 / 390 / 375 / 360 / 320, and a 2x-DPR pixel
comparison of both the brand region and the whole Header reports **0 differing
pixels** at every one of those widths. The favicon resolves to
`/GoodCall/assets/brand-mark-<hash>.svg`, loads with HTTP 200, and is
byte-identical to the accepted source; the previous default-favicon 404 on the
base reference index is gone.

**Global Shell B / SiteHeader + MobileActionBar — user visual PASS received on
2026-08-27, accepted and closed.**

`?reference=header` measures zero horizontal document overflow at
1920 / 1440 / 1280 / 1024 / 768 / 430 / 390 / 375 / 360 / 320, with all three
header rows sharing identical Container inner edges at every width. Header height
is 180.58px at 1280px and above, 248.58px at 1024–768px and 233.19px across
430–320 — shorter than before the correction despite the added search row,
because the four actions moved out. The **61px** `MobileActionBar` appears only
below 768px and never coexists with the top action group; its links carry a 60px
`min-height` and 8px vertical padding above `env(safe-area-inset-bottom, 0px)`,
so the labels are no longer attached to the viewport bottom edge. It also casts a
local upward separation shadow, `box-shadow: 0 -8px 24px var(--alpha-black-12)`,
because the user reported the fixed bar merging into page text; the top divider,
height, safe-area declaration and `z-index: 20` are unchanged, and no global
elevation system was introduced. At 1920 / 1440 / 1280 / 1024 / 768 the header
renders pixel-identical to the accepted direction; only the mobile band changed.
Tab reaches every category link in DOM order and each focused link stays at least
98% inside the category viewport at 430 / 390 / 375 / 360 / 320 and 99% at
1024 / 768. The compact search keeps the
accessible label `Поиск по каталогу`; every action, category and utility
destination is a real anchor, and the only header `<button>`s are the search
submit and — on mobile only, with a real callback — the QR action.

**The current reconstructed GoodCall brand mark is visually accepted by the
user** and is intentionally unchanged. The asset moved to
`src/assets/brand/brand-mark.svg` byte-identically; it was not redrawn or
replaced. The Header's brand anchor still exposes the accessible name
`GOODCALL` from its visible wordmark, the mark stays decorative with `alt=""`,
and no ARIA was added.

**Global Shell A / Container — visually accepted by the user on 2026-08-24.**
`?reference=layout` measures 1440px maximum outer width, centred at 1920px, and
32px / 32px / 32px / 23.4667px / 16.9167px / 16.0001px gutters at
1920 / 1440 / 1280 / 768 / 375 / 320, with zero horizontal overflow and
identical inner edges across all four reference bands at every tested width.

**Components B — visually accepted by the user on 2026-08-23 and closed.**
Section 04 Product Components is implemented on the reference surface at
`?reference=components`, composing the real reusable product components. Two
system-first normalizations were applied against the raster: one rating
presentation is used everywhere, so the price block drops the raster's `Рейтинг`
prefix and star-after-value ordering; and availability is expressed as the
success Chip inline in cards, with the product-owned `ProductAvailability` row
used only where section 04 shows the fuller bordered status row.

**Components C — visually accepted by the user on 2026-08-23 and closed.**
Section 05 Content & Marketing is implemented on the reference surface at
`?reference=components`, composing the real reusable content components. The
system-first normalization applied against the raster is the banner family:
both banner specimens share one `PromoBanner` on the single accepted
`--gradient-cta` surface, rather than two components or two one-off purple
mixes. Measured contrast of white banner text over that gradient is 4.99 falling
to 4.73 across the title and 4.91 across the supporting line, so the surface
carries small body text at AA.

**Components A — visually accepted by the user on 2026-08-23 and remains closed
after user-accepted RangeSlider post-PASS hardening.** The reference surface at
`?reference=components` composes the real reusable controls and mirrors the
grouping of raster sections 02 and 03.

The shared success Chip accessibility correction keeps Components A and B
closed after focused regression. Success Chips keep the same success-soft
surface and geometry while using an accessible green-forward Components-owned
treatment with measured AA text contrast. Foundations remains closed and
unchanged.

**Components D — visually accepted by the user on 2026-08-23 and closed.**
Section 06 Account Components is implemented on the reference surface at
`?reference=components`, composing the real reusable account components. Three
system-first normalizations were applied against the raster: the delivered
status uses the accepted success Chip instead of the bare green text the raster
paints; the duplicated details affordance in the order specimen was collapsed
into one bordered chevron control beside the reorder control; and the statistics
card uses one icon per metric, ignoring the stray duplicated glyphs the raster
renders on the bonus and favourites value lines. Section 06 shows no horizontal
overflow at 1440px, 768px, 375px or 320px.

**Components E — visually accepted by the user on 2026-08-24 and closed.**
Section 07 Commerce Blocks is implemented on the reference surface at
`?reference=components`, composing the real reusable commerce components. The
system-first normalizations applied against the raster are the shared
selectable-options family for the delivery and payment blocks, one
trailing-value treatment across both option blocks rather than the raster's two
slightly different weights, and one shared Commerce card surface and hairline
divider across all six specimens. On user visual feedback the service-center
card's metadata now uses the same icon-led row treatment as the store card,
which the raster does not show, so both information cards scan alike while the
service card retains its large decorative tools glyph. The saved-payment
reference now shows three MIR-only demo entries through the brand-agnostic
`SavedPaymentList`; `payment-mir.svg` is the only current saved-payment brand
asset, and the payment-method selector remains multi-method. Section 07 shows no
horizontal overflow at 1440px, 768px, 375px or 320px.

**Components F — Utility & Feedback received user visual PASS on 2026-08-24 and
is closed.** Section 08 is implemented on the reference surface at
`?reference=components`, composing FAQAccordion, EmptyState, SuccessFeedback,
InfoDialog, ConfirmationDialog and ProductActionDialog. It uses the existing
Radix dependency for the single-open accordion and dialog semantics; no
notification bus, modal manager or global feedback architecture exists.

**Foundations / Colors — visually accepted by the user on 2026-08-19.**

The Foundations reference surface mirrors the raster's five sections so the
colour system can be compared side by side. It is reached at
`?reference=foundations`.

The footer-like gradient specimen runs left-to-right, matching the visible
raster evidence, which is horizontal despite the poster's 180 degree annotation.
Its colour stops are unchanged. Footer evidence should be evaluated during
future Global Shell planning if operationally useful, not treated as a completed
reusable Footer component from Components closure.

Typography and geometry deliberately do not match the raster: it documents no
font family, type scale, spacing or radius scale, so those were not invented.

## Current routes

`react-router-dom` **7.18.3** owns production path routing. It is the only new
runtime dependency; it pulls `react-router@7.18.3`, `cookie` and
`set-cookie-parser` into the lockfile as its own dependencies.

### Why hash routing

Vite `base` is `/GoodCall/` and `.github/workflows/deploy.yml` publishes `./dist`
to a GitHub Pages project site. Pages serves static files with no SPA rewrite and
the repository carries no `404.html` fallback, so a clean path such as
`/GoodCall/catalog/smartphones` would 404 on direct entry and on refresh. React
Router's `HashRouter` keeps the route in the fragment, which the server never
sees, so direct entry and refresh work on the current host. No 404 redirect hack
was added and hosting was not changed. Revisit the strategy only if the
deployment contract itself changes.

`HashRouter` needs no `basename`: the Vite base stays in the URL path and the
router owns only the fragment. The base path still lives solely in
`vite.config.ts`.

### Route inventory

- `#/` — the production Home route. The temporary redirect to Catalog is gone.
- `#/catalog/smartphones` — the production Catalog route. Direct-entry shape:
  <https://mangust5580.github.io/GoodCall/#/catalog/smartphones>
- `#/catalog/laptops` — the laptops Catalog route (Second Category A, closed).
- `#/cart` — the production Cart route over the shared local cart
  (Commerce A): the Cart A empty state when the cart is empty, and the Cart B
  populated state otherwise.
- `#/search?q=…` — the production Search results route (Search A, with Search B
  desktop facets); optional `sort` and `page` params.
- `#/product/:slug` — the production Product Details route, content-gated by
  the local Product Details registry (all 30 active products); a slug without
  content renders the route's compact not-found state.
- `#/blog` — the Blog listing (Blog A, closed); optional
  `category`, `q` and `page` params.
- `#/favorites` — the local favourites page (Favourites A, closed).
- `#/compare` — the local product comparison (Comparison A, closed).
- `#/shops` — the list-only Stores page over the demo store dataset
  (Stores A, closed).
- `#/checkout` — the Checkout A page over the selected shared-cart lines
  (complete, user visual/UX PASS).
- `#/delivery`, `#/warranty`, `#/faq` — the Info A customer help pages
  (Info A, closed).
- `#/contacts` — the Contacts A page (Contacts A, closed).
- `#/privacy`, `#/terms`, `#/offer` — the Legal A pages (Legal A, closed).
- `#/about` — the About A page (About A, closed).
- `#/order-confirmation` — the Order Confirmation A thank-you page for the
  session demo order, or «Заказ не найден» (Order Confirmation A, closed).
- `#/blog/:slug` — the Blog article detail (Blog B, closed),
  registered only for `how-to-choose-smartphone-2024`. Every other slug renders
  the designed 404.
- `#/login` — the demo-account entry (Account A, closed); signed-in visitors
  are redirected to `#/account`.
- `#/account` — the demo account overview (Account A, closed); signed-out
  visitors are redirected to `#/login`.
- `#/account/orders` and `#/account/profile` — session-order list and local
  profile edit (Account B, closed); signed-out visitors go to `#/login` and
  return after demo entry. There is no `#/account/:section` catch-all.
- `#/account/addresses` — the browser-local demo address book (Account C,
  closed); same signed-out return. There is no `#/account/addresses/:id`.
- `*` — the designed 404 (`NotFoundRoute`, 404 A, closed).
  It is not a global error architecture.

Route paths live in `src/app/routePaths.ts` as `HOME_PATH`,
`CATALOG_SMARTPHONES_PATH`, `CATALOG_LAPTOPS_PATH`, `PRODUCT_PATH`, `CART_PATH`, `CHECKOUT_PATH`, `ORDER_CONFIRMATION_PATH`, `FAVORITES_PATH`, `COMPARE_PATH`, `SHOPS_PATH`, `DELIVERY_PATH`, `WARRANTY_PATH`, `FAQ_PATH`,
`CONTACTS_PATH`, `ABOUT_PATH`, `PRIVACY_PATH`, `TERMS_PATH`, `OFFER_PATH`, `SEARCH_PATH`, `BLOG_PATH`, `BLOG_ARTICLE_PATH`, `LOGIN_PATH`, `ACCOUNT_PATH`, `ACCOUNT_ORDERS_PATH`, `ACCOUNT_PROFILE_PATH` and `ACCOUNT_ADDRESSES_PATH`.
`hashHref()`, `productDetailsHref()`, `searchPath()`, `blogPath()`,
`blogArticlePath()` and `blogArticleHref()` serve the `href` and navigation
seams.

### Ownership

`src/app/` keeps app-wide modules only: `App.tsx` (the `?reference=` switch),
`ProductionRouter.tsx`, `ProductionShell.tsx`, `RouteScrollReset.tsx`,
`routePaths.ts` (path constants and href builders) and `useSearchNavigation.ts`.
Production route seams and their route-adapter hooks (`useCatalog*Seam`,
`useHomeCartSeam`) live in `src/app/routes/`. Reference-only `?reference=`
surfaces and `referenceUrl.ts` live in `src/reference/`; only `App.tsx` imports
them, statically as before. Module boundaries and public APIs are described in
`AGENTS.md` (Module boundaries) and enforced by `no-restricted-imports` in
`eslint.config.js`.

`src/app/ProductionRouter.tsx` holds the `HashRouter`, twenty-five routes and the 404 catch-all; it
has no local fallback component or stylesheet any more.
`src/app/routes/HomeRoute.tsx`, `src/app/routes/CatalogRoute.tsx`,
`src/app/routes/ProductDetailsRoute.tsx`, `src/app/routes/CartRoute.tsx`,
`src/app/routes/SearchRoute.tsx`, `src/app/routes/BlogRoute.tsx`,
`src/app/routes/BlogArticleRoute.tsx`, `src/app/routes/AccountRoutes.tsx`
(`LoginRoute`, `AccountRoute`, `AccountOrdersRoute`, `AccountProfileRoute`,
`AccountAddressesRoute`) and `src/app/routes/NotFoundRoute.tsx` are the page
seams.
`src/app/useSearchNavigation.ts` turns a submitted query into `#/search?q=…`;
`ProductionShell` uses it for the Header search and `NotFoundRoute` for the 404
hero search. `src/pages/not-found/` owns the router-free `NotFoundPage`.

`src/app/ProductionShell.tsx` owns the shared production composition —
`SiteHeader`, the route's page, `NewsletterBand`, `SiteFooter`,
`MobileActionBar` — with `ProductionShell.scss` owning the page background and
the mobile bottom inset. It was extracted once Home became the second real
production consumer and both routes proved literally identical composition,
props and wrapper styling. It takes only `children` and reads the shared cart
unit count itself (Commerce A). There are no options, variants or configuration. There is still no `AppShell`, `PageShell`, `AppLayout`,
`LayoutProvider` or route registry. Global shell regions stay outside the page
components.

The cart count (Commerce A) and the favourites count (Favourites A) are real.
The comparison count is real since Comparison A (`useCompareCount()`, linking
to `#/compare`).

### Commerce ownership

`src/commerce/` owns cross-route commerce state, contracts and facts, each with
an `index.ts` public API: `cart/` (`cartStore`, `useCartLines`, `cartPricing`,
`CartLineMedia`), `favorites/`, `compare/`, `account/` (the demo-account
identity store and persona fixture, Account A), `storefront/` (storefront
facts) and `shops/` (`shopData.ts`, the `DEMO_STORES` dataset). `src/commerce/format.ts`
holds the single `formatPrice` (ru-RU, RUB, no fractional digits) used by every
production price. `storefront/` also owns `STOREFRONT_DELIVERY_SLOTS`, the three
courier intervals used by Checkout, Order Confirmation and the help pages. Route families under
`src/pages/` and the `src/app/` seams consume it; `src/commerce/` never imports
from `src/pages/` or `src/app/`, and `src/components/` never imports from
`src/commerce/`. `src/pages/stores/` keeps only the `#/shops` page.

### Route scroll

**User UX PASS on 2026-09-27; CLOSED.** `src/app/RouteScrollReset.tsx` sits
inside `HashRouter`, before `Routes`. It only runs in production mode, because
`?reference=` surfaces never mount the router.

It acts only when the pathname changes. Query, state and same-route renders
never scroll.

- **Forward navigation.** It scrolls instantly to the top, with no smooth
  scrolling and no focus change. This covers router `PUSH`/`REPLACE`, and plain
  hash anchors that the Navigation API reports as `push`/`replace`. Plain
  anchors include `ProductCard` titles, breadcrumbs and header/footer home
  links; `HashRouter` reports them as `POP`.
- **Back/Forward.** A Navigation API `traverse` is left to the browser's native
  restoration. `history.scrollRestoration` is unchanged (`auto`).
- **Browsers without the Navigation API.** Plain-anchor `POP` is treated as
  traversal and not reset.

Known limitation: Back/Forward and reload restore Home and Catalog positions,
because both render synchronously. Into `#/product/:slug`, the restored offset
is clamped by the short loading state. Scroll anchoring can then land at the
top or the bottom. This belongs to the deferred loading-state/skeleton work,
not to a custom scroll-persistence layer.

### Catalog Supabase read path

Supabase project `muiesujgtojpjpadrmom` is the current clean backend for the
frontend. Its current public content schema is `categories`, `products` and
`product_images`, with the public Storage bucket `catalog-media`.

`src/lib/supabase/` is the only shared Supabase infrastructure boundary. It
contains the typed browser client and the current database TypeScript contract.
The client reads only `VITE_SUPABASE_URL` and
`VITE_SUPABASE_PUBLISHABLE_KEY`, and is undefined when either value is missing.

`src/pages/catalog/catalogProductData.ts` owns the Catalog-specific read mapper.
The production `#/catalog/smartphones` route starts with the accepted local
fixtures, then attempts a read-only Supabase query for the active `smartphones`
category and active products ordered by `popularity_score` descending with a
stable slug tie-breaker. Successful live data replaces only the product
collection supplied to `CatalogPage`.

Failure, missing configuration, unreachable Supabase, a missing category, an
empty result or invalid mapped products leave the fixture collection in place.
`?reference=catalog` still calls `CatalogPage` without remote data and remains
network-independent and fixture-backed.

Remote products map into the existing `CatalogProduct` presentation model:
`products.slug` is the card id, `products.name` is the title, prices, rating,
review count and popularity come from `products`, and the accepted badge
presentation temporarily comes from matching fixture slugs. Future remote
products without fixture presentation metadata render without an invented badge.
The same reader serves `#/catalog/laptops` with `'laptops'` (live badges, no
fixture fallback; see Second Category A).

`product_images` currently has no rows, so the Catalog renders the local product
thumbnail for covered slugs (Product Thumbnail Integration A) and the accepted
synthetic phone artwork otherwise. When image rows exist, the primary image
is the first ordered image for the product and its public URL is resolved through
the Supabase Storage bucket API. Once the live read is `ready`, the count,
filter options and counts, quick filters and pagination are derived from the
live products (Catalog Live Results A); the `2 546` count, fixture counts and
65-page pagination remain the specimen/fallback contract.

The Supabase GitHub Actions variables are configured. Pages rerun attempt 2 for
Integration A succeeded, the compiled Pages artifact was verified to contain the
Supabase project URL and publishable key, and the production Catalog live
configuration gate is closed.

### Home Supabase read path

Supabase also exposes `home_popular_products(position, product_id)` for the Home
popular-products curation. The table currently has five positions and points at
active products.

The production `#/` Home route starts with local fixtures, then attempts one
atomic Home read after mount. A valid remote result replaces only
`Популярные категории` and `Популярные товары`; if either section is missing,
malformed, unreachable or unavailable, both targeted sections remain fixture
backed.

`Популярные категории` reads active `categories`, ordered by `sort_order`
ascending and `slug` ascending. Database slugs, labels and order own the content;
Home keeps the icon mapping locally by stable slug. Unknown category slugs are
filtered rather than assigned invented icons.

`Популярные товары` reads the five `home_popular_products` rows in backend
position order, then resolves active products and primary images. Product slug,
title, price, old price and category identity come from Supabase; Home-only
badge tone/copy and fallback artwork are local presentation metadata keyed by
the curated product slug.

Current remote Home categories resolve to `Смартфоны`, `Ноутбуки`, `Планшеты`,
`Умные часы`, `Наушники`, `Аксессуары`, `Игры и консоли`, `Телевизоры`.
Current remote Home products resolve in curated order to
`Apple iPhone 15 128 ГБ, Розовый`,
`Samsung Galaxy S24 128 ГБ, Фиолетовый`,
`Xiaomi Redmi Note 13 Pro 256 ГБ, Синий`, `Apple AirPods Pro 2 (USB-C)` and
`Apple Watch Series 9 45 мм, Чёрный`.

`product_images` still has no rows, and category merchandising media is still
null, so Home renders the local product thumbnail for covered slugs (Product
Thumbnail Integration A) and local placeholder artwork otherwise. `?reference=home`
calls `HomePage` without remote data and remains deterministic and
network-independent. Hero, offers, benefits, promo pair, category promo trio,
cinema, latest articles, NewsletterBand and Footer remain fixture/local. Home
campaign, article and CMS contracts remain deferred.

### Reference precedence

`App.tsx` checks `?reference=` first and only renders `ProductionRouter` when the
parameter is absent. Reference surfaces stay a query-string development concern
and were not converted into router routes; there is no `#/reference/...` path and
no route registry for them. An unrecognised `?reference=` value falls back to the
reference index rather than to production.

`?reference=index` is the explicit reference-index address, and every reference
surface's `Back to reference index` link now points at it through
`src/reference/referenceUrl.ts` instead of the bare base URL, which production routing
now owns. The `?reference=catalog` and `?reference=footer` surfaces also point
their `SiteFooter` brand link at the reference index, so a reference surface
never jumps into the production router.

### Deliberately not routed

- **Breadcrumbs.** `Главная` now links to the real `#/` Home route through the
  narrow `homeHref` seam on `CatalogPage`, so the page stays router-free.
  `Каталог` remains non-interactive text until a real Catalog landing exists;
  `Смартфоны` keeps `aria-current="page"`. No `/catalog` landing route was
  invented to make a breadcrumb clickable.
- **Header and Footer brand links** now point at `#/`, because Home is real.
  The utility links («Магазины» → `#/shops`, «Поддержка» → `#/contacts`), the
  Сравнение/Избранное/Корзина actions and the search are wired, and the
  account action is wired since Account A («Войти» → `#/login`, «Профиль» →
  `#/account`). `Каталог товаров`, `Ещё` and seven of the nine category links
  keep the consumer-injected fallback to the app base. The `Смартфоны` category links to
  `#/catalog/smartphones` through the narrow `SiteHeader.smartphonesHref` seam
  and `Ноутбуки` to `#/catalog/laptops` through `SiteHeader.laptopsHref`
  (production only); `Каталог товаров` is deliberately not pointed at the
  smartphones-only route. No unavailable
  destination received a fake route and no category label became semantically
  false. Each gets a real route when its page exists.
- **`ProductCard`.** Live product cards whose slug has Product Details content
  have a title link (Integration B). Fixture-fallback cards remain non-links.
  There is no whole-card link and no `Link` inside `ProductCard`.
- **URL state.** The live Catalog applied state (filters, quick filter, sort,
  page) is canonical in the query string since Catalog URL State A; specimen
  and reference Catalog keep local UI state.
- **Document titles.** No route-level title system was introduced.

## Current dependencies

Runtime: `react`, `react-dom`, `radix-ui`, `@daypicker/react`, `@maskito/core`,
`@maskito/react`, `embla-carousel-react`, `react-router-dom`,
`@supabase/supabase-js`.

Dev: `vite`, `@vitejs/plugin-react`, `typescript`, `@types/react`,
`@types/react-dom`, `@types/node`, `sass-embedded`, `postcss`, `autoprefixer`,
`postcss-pxtorem`, `eslint`, `@eslint/js`, `typescript-eslint`, `globals`,
`eslint-plugin-react`, `eslint-plugin-react-hooks`, `eslint-plugin-react-refresh`,
`eslint-plugin-jsx-a11y`, `prettier`, `stylelint`, `stylelint-config-standard-scss`,
`vite-imagetools`, `sharp`.

`embla-carousel-react` resolves to **8.6.0** and is user-approved. It has exactly
two current consumers, the mobile category navigation in `SiteHeader` and the
Home `HomeHeroSlider`, each using `useEmblaCarousel` directly. No
Embla plugin is installed (`embla-carousel-autoplay`, `-auto-scroll`,
`-wheel-gestures` and the rest are absent), and the v9 release candidate is not
in the tree; only `embla-carousel-react`, `embla-carousel` and
`embla-carousel-reactive-utils`, all 8.6.0.

`react-router-dom` resolves to **7.18.3** and is the routing dependency
authorized by the Routing Foundation task. `react-router-dom@latest` is still the
7.x line; `react-router` 8 exists but publishes no `react-router-dom` package.
Only `react-router`, `cookie` and `set-cookie-parser` came with it. No
`@react-router/*` framework package, data-router loader, route-generation
library or query-state library is installed.

`@supabase/supabase-js` resolves to **2.112.4** and is the only Supabase/client
data dependency. Its current production consumers are:

- the smartphone Catalog read path;
- the Home popular categories/products read path;
- the Product Details product-by-slug read.

`sharp` resolves to **0.35.4** and is a direct dev dependency for the local
`npm run media:home` raster derivative generator. `vite-imagetools` also uses
Sharp at build time for imported `?picture` source sets.

Nothing else is installed. In particular there is no async data-fetching state,
form, schema, search/autocomplete, phone validation, mocking, or E2E library,
and no other carousel/slider or routing library.

Required deployment variables:

```
VITE_SUPABASE_URL
VITE_SUPABASE_PUBLISHABLE_KEY
DADATA_TOKEN
```

## Scripts

```
npm run dev           # Vite dev server (user-owned; agents do not start it)
npm run media:home    # regenerate Home marketing crops plus AVIF/WebP derivatives
npm run build         # tsc -b && vite build
npm run preview       # preview the production build
npm run typecheck     # tsc -b
npm run lint          # eslint .
npm run lint:styles   # stylelint "src/**/*.scss"
npm run format        # prettier --write .
npm run format:check  # prettier --check .
npm run verify        # repository-owned regression gates (scripts/verify/README.md)
```

CI runs install → typecheck → lint → lint:styles → format:check → build.

## Deferred Foundations evidence

`Foundations.png` does not specify these categories, so they are outside the
accepted Foundations closure. Nothing was invented to fill the gaps. Each is
deferred until a real raster or a real downstream consumer supplies evidence, and
none of them blocks the closed milestone.

- Typography scale and font assets — no family, weights or type scale evidenced;
  the system font stack stands in.
- Spacing scale.
- Radius scale.
- Shadow / elevation scale.
- Layout primitives beyond horizontal content geometry. The Global Shell
  `Container` now owns centred width and gutters; no Box, Stack, Grid, Section
  or Surface primitive exists, and none is invented ahead of a real consumer.
- Named breakpoints and responsive token decisions — `$breakpoints` stays empty.
  `fluid()` now has one concrete consumer, the Container gutter; the helper and
  its 320 → 1280 range were not changed.
- Overlay and Backdrop opacity, and what distinguishes the two roles.
- Raster scale factor (1x / 1.5x / 2x), still unconfirmed; it blocks geometry
  work but never affected colour.

## Known deferred work

- Product-facing remaining work is classified in **Project closeout state**
  below. Media coverage detail: `iphone-15-128` and the five PDP Media
  Coverage A SKUs have galleries, `apple-watch-series-9-45` has one image, and
  the other eleven smartphone/headphone SKUs (including AirPods) and all 12
  laptops use category artwork.
- Phone validation, country selection and international formatting are deferred
  until a real product form consumer defines those requirements.
- Textarea auto-grow remains deferred until a concrete consumer requires it.
- Any future animation system remains a separate topic; Components F owns only
  its local reduced-motion-aware FAQ transition.
- ESLint is pinned to the 9.x line. ESLint 10 is current, but
  `eslint-plugin-jsx-a11y@6.10.2` and `eslint-plugin-react@7.37.5` declare peer
  support only through ESLint 9. Accessibility coverage was kept rather than
  forced with peer overrides. Revisit when those plugins ship ESLint 10 support.
- TypeScript is pinned to `~6.0.2`. TypeScript 7 is current, but
  `typescript-eslint@8.67` requires `<6.1.0`. Revisit when it supports 7.
- No `public/` directory exists. Add one only when a genuine stable public asset
  is needed.
- Logo size/mark-only/inverse/monochrome variants, a generic image primitive, and
  the wider favicon ecosystem (`favicon.ico`, apple-touch-icon, Android icons,
  webmanifest, mask-icon, `browserconfig.xml`, `theme-color`, PWA metadata) are
  all deferred. `BrandLogo` and the single SVG favicon cover every current
  requirement; add more only when a concrete one appears.

## Active open questions

- `Catalog.png` pairs the `Серия` and `Диагональ` filter headings with options
  that do not match them (`Только со скидкой` / `Сначала от 1%` and
  `Быстрая доставка` / `Доставка сегодня`). Both are implemented verbatim; the
  copy correction is a user decision, not an agent one.
- In specimen mode, options behind the brand and colour `Показать ещё` buttons
  are fixtures (the raster shows only the collapsed lists). The live route
  derives them from live products.
- The Catalog contract has two explicit category consumers (smartphones,
  laptops): shared listing mechanics, explicit category-specific facet and URL
  modules, no universal facet engine. A third category is a new product
  decision.
- `#/catalog/smartphones` and `#/catalog/laptops` are the only category
  routes. Live product cards link to `#/product/:slug` for every
  registered live product slug; fixture-fallback cards and the in-grid promo
  carry no link.
- Live DaData behaviour is unverified. No local token is available, GitHub secret
  presence is unverifiable without `gh`, and the DaData hosts are unreachable
  from this build environment, so the adapter was verified against recorded
  response shapes rather than the live service. Live search, live IP detection,
  live reverse geocoding and live Pages behaviour all remain open.

## Quality remediation

The portfolio-wide quality audit produced backlog items Q-01 … Q-22. They are
remediated in bounded milestones; an item is closed only by its own milestone.

**Quality A / Correctness and Document Semantics — CLOSED, USER VISUAL/UX
PASS on 2026-10-08.** Closed items: Q-01 (Compare media overflow), Q-02
(document language), Q-11 (route-level document titles), Q-16 (stale
favourites drift), Q-17 (Compare geometry coverage and verify README).

Durable results:

- Compare product media is contained in its media box, and the `compare` suite
  asserts the geometry at 1440/1024/768/390.
- `<html lang="ru">`. English developer notes on `?reference=` surfaces carry
  `lang="en"` (language of parts), so reference pixel diffs remain 0.
- Every production route sets a Russian `<page> — GoodCall` document title
  from its route adapter (`src/app/useDocumentTitle.ts`); the PDP title follows
  the loaded product name or the rendered loading/not-found/error state.
  `?reference=` surfaces keep the static title.
- The favourites known drift is removed (`KNOWN_DRIFT` is empty), and the
  favorites suite is fully green.
- `scripts/verify/README.md` lists current suite ownership, including
  `account`, `laptops` and the live smartphone Catalog coverage in `search`.

**Quality B / Shared Navigation and Feedback Primitives — CLOSED, USER
VISUAL/UX PASS on 2026-10-08.** Closed items: Q-04 (Breadcrumbs), Q-09
(EmptyState), Q-10 (RouteStatus), Q-21 (heading skips).

Durable results:

- `Breadcrumbs` (`src/components/layout`) owns breadcrumb markup and
  semantics for every page family: `{ label, href? }` items, the last item is
  the non-link `aria-current="page"`, and the `›` separator is
  presentation-only. Each family's spacing (`__breadcrumbs` margin,
  `.account-crumbs`) stays page-owned. No variant API.
- `EmptyState` (`src/components/feedback`) has a caller-chosen `icon` and
  `headingLevel`, and two variants: `panel` (Catalog filtered no-results,
  now a search icon; the components reference) and `page` (the disc used by
  Order, Compare, Favourites and Search). An `h1` page empty state uses the
  lead title tier and is a focus target. Page empty-state actions share one
  group: min-width 200px, stacked full-width at ≤480px. Cart, Blog, FAQ and
  Account empty states stay local by design (distinct compositions).
- `RouteStatus` (`src/components/feedback`) owns the PDP and laptop Catalog
  loading (`aria-busy` + `role="status"`) and failure (`h1` + routed
  actions) states, including PDP product-not-found. The cross-route
  `ProductDetailsRoute.scss` seam is gone.
- Catalog, Search and Favourites result lists have visually hidden `h2`s, and
  empty-state headings follow page context. No targeted `h1`→`h3` skip
  remains at 1440/1024/390. Card titles stay `h3`.
- The verify suites lock breadcrumb labels/hrefs/invariants, RouteStatus
  semantics, EmptyState variant/level/icon/CTA and heading outlines. A stub
  may return `null` to hold a request in its loading state.
  Reference-protected surfaces stay pixel-identical.

**Quality C / Product Presentation Consistency — CLOSED, USER VISUAL/UX PASS
on 2026-10-08.** Closed items: Q-05 (ProductBadge), Q-06 (colour swatches),
Q-19 (1024 GB → 1 TB), Q-20 (card fallback artwork).

Durable results:

- `ProductBadge` (`src/components/product`, `tone: 'sale' | 'new'`) is the one
  product badge on Home, Catalog, PDP (gallery and purchase panel) and Search
  (desktop rows and mobile cards). It owns the single sale surface `#DC2626`
  with white text; `new` is `--color-brand-purple-600`. Sale percentages are
  still derived from live `old_price > price`. Generic `Chip`, the Cart
  discount chip, the 404 and the `?reference=components` specimen are
  unchanged. Accepted visible change: Search badges are solid instead of soft
  Chips.
- Colour swatches have one owner in `src/components/product`:
  `_colour-swatches.scss` (fill and mark ink, `colour-swatch-modifiers` mixin)
  and `colourSwatch(label)` (label → key). Catalog smartphone/laptop filters,
  PDP colour options and Search filters consume it. Catalog values win for
  shared colours. Search keeps local fills only for its product-only colours;
  unknown colours keep the ring-only dot. Accepted visible change: six shared
  Search swatches (Чёрный, Фиолетовый, Синий, Зелёный, Розовый, Золотой) now
  match Catalog, with dark marks on light fills.
- `formatMemorySize` (`src/commerce/format.ts`) shows whole multiples of
  1024 GB in ТБ. Compare «Встроенная память» and laptop memory facets use it;
  persisted Compare `storage` stays numeric.
- Live Catalog card image precedence: `product_images` URL → slug thumbnail →
  category artwork (laptops: Home laptop device art) → generic phone fallback.
  Known limitation, not part of this milestone: for a laptop without a
  thumbnail, downstream Cart/Favourites/Compare/Checkout `catalog-fallback`
  media still resolves to phone art. All 12 current laptops have thumbnails.
- Home, Catalog and PDP reference-protected surfaces stay pixel-identical; the
  `search`, `product-details`, `compare` and `laptops` suites lock these
  contracts.

**Quality D / Clean Format Gate — CLOSED (non-visual).** Closed item: Q-22.
The per-machine `.mcp.json` is excluded by root-anchored `/.mcp.json` entries
in `.gitignore` and `.prettierignore`, so `npm run format:check` passes with
the local file present. No tooling rules changed.

**Quality E / DateField Month–Year Navigation — CLOSED, USER VISUAL/UX PASS
on 2026-10-08.** Closed item: Q-12. Bounded DateFields (the Account birth
date) jump directly to any permitted month/year through GoodCall-styled Radix
selectors; unbounded fields and the Components reference are unchanged (see
Components A). No dependency or public API change. Known, unchanged: at 320px
the accepted 306px date popover overhangs the right edge by 2px (pre-existing
geometry); the `account` logout → demo re-entry step (also reproduced on the
Quality D baseline) and the `product-details` related request-count checks
fail intermittently and pass on rerun.

**Quality F / Cart Recommendations from Home Curation — CLOSED, USER
VISUAL/UX PASS on 2026-10-10.** Closed item: Q-03.

Durable results:

- Cart «Вам может понравиться» reuses the Home «Популярные товары» curation.
  `CartRoute` calls `fetchHomeData()` once per mount and passes the ready
  products, otherwise `HOME_PRODUCTS` (while loading, on failure or when the
  backend is unavailable; a DEV-only warning on failure).
- Title links to `productDetailsHref(slug)` appear only for loaded backend
  products; fallback cards are unlinked. No ratings, review counts, cart,
  favourite or compare actions.
- Card image precedence matches Home: `imageSrc` (backend URL) → slug
  `thumbnail` → Cart-local `RECOMMENDATION_ARTWORK` category art from
  `HOME_DEVICE_MEDIA`. No shared artwork mapper was introduced.
- Heading, grid, placement after `BenefitsStrip` and responsive layout are
  unchanged. `CART_RECOMMENDATIONS` is removed from `cartFixtures.ts`.
- The `cart` suite (76 checks) locks fallback/loading/failure/ready states,
  feed order and live prices, Home-equal links and badges, inert cards, the
  URL/thumbnail/artwork image precedence (card-for-card equal to Home) and the
  1440/1024/768/390/320 layout.

**Quality G / Breakpoint Off-by-One Correction — CLOSED, USER VISUAL/UX PASS
on 2026-10-10 (accepted without screenshots).** Closes the Q-08 off-by-one
defect slice only.

Durable results:

- 11 legacy `N-1px` upper bounds now use the system boundary `N`:
  - PDP `h.media-range(768px, 1200px)` ×3 (`.product-offer`, its sections,
    key-specs `.product-specs`);
  - Blog `h.media-max` ×7 (`900px` hero and media row, `768px` split and spec
    media, `560px` tips and tips art, `1024px` related grid);
  - Account `.account-profile__submit` `h.media-max(560px)` ×1.
- Mixin semantics are unchanged: `media-up` is inclusive (`width >= N`),
  `media-max`/`media-range` upper bounds are exclusive (`width < N`). Pass the
  boundary itself, never `N-1px`.
- Each affected layout now switches at the same width as its sibling rules;
  every other width is unchanged.
- The `product-details` suite asserts the PDP offer/key-specs layout at
  767/768/1199/1200. The `laptops` suite asserts Blog at 559/560, 767/768,
  899/900 and 1023/1024, Account profile submit at 559/560, and no overflow at
  those widths plus 1440/1024/768/390/320. Protected reference pixel diffs stay 0.

**Q-08 residual — open, deferred, not approved for implementation.** Wider
breakpoint harmonization remains a backlog item. The existing one-off values
(`620`, `520`, `760`, `780`, `680`, `1080`, `1300`, …) are not defects by
themselves. A named breakpoint system is not approved; it depends on a future
Foundations/design decision.

Still open (not started): Q-07 typography roles, Q-08 residual breakpoint
harmonization (deferred), Q-13 reference lazy loading, Q-14 footer
destinations, Q-15 cross-category Search (product decision), Q-18 rating
separator.

No next milestone is approved; select from the remaining backlog when
requested.

## Project closeout state

WP-01A (Privacy & Demo Stores Truthfulness) is the last published milestone.
**Active visual slice: none. Active implementation milestone: none.** No
active code-level release blocker is known, and there is no approved next
milestone. The next activity is selecting from `docs/master-backlog.md` when
requested.

Settings, Bonuses, Notifications, recently viewed, a real authenticated
account and Checkout saved-address integration are intentionally omitted (not
planned) until a new product decision.

**Defer with reason:**

- PDP Back/Forward scroll restoration — revisit with skeleton/loading-state/cache
  work.
- Stale stored image URL fallback — revisit when `product_images` rows exist.
- Remaining smartphone galleries, AirPods media and full assortment media —
  revisit after assortment freeze.
- iPhone 15 editorial media mismatch — revisit with media/assortment polish.

**Blocked externally:**

- Location live DaData verification — requires the repository secret
  `DADATA_TOKEN` (and a local `.env.local` `VITE_DADATA_TOKEN`). Until then the
  Header falls back to `Выберите город` and network features degrade gracefully.
- Footer social and app-store destinations — require real destinations/apps.

**Blocked by product decision:**

- Catalog landing page.
- Further categories beyond smartphones and laptops; cross-category Search.
- Header unresolved fallback destinations (`Каталог товаров`, `Ещё` and the
  unresolved category links).
- `Серия` / `Диагональ` filter copy (see Active open questions).
- Unscoped product areas — real orders/payment, a real authenticated Customer
  Account, store map/stock, backend cart, promo engine — each needs its own
  explicit scope.

**Accepted as-is:**

- Newsletter backend intentionally absent; the truthful demo acknowledgement
  exists (Newsletter Feedback A).
- The current `SiteFooter` visual implementation (Global Shell E).
- The Home hero «Большие скидки до 50%» campaign copy (accepted demo/raster
  copy from Home A).

Do not reopen or redesign accepted surfaces (Catalog family, Header, BrandLogo,
Media Foundation, Location visuals, NewsletterBand, SiteFooter, ProductCard,
Pagination, closed Components). Do not turn Home or Catalog fixtures into a
domain model, add state or data architecture, create routes for pages that do
not exist, add a footer CMS/config layer, backend or persistence, or add
dependencies without a concrete requirement. Accepted system decisions win over
incidental raster differences.

## Normative repository docs

- `AGENTS.md` — canonical agent policy (wins on conflict).
- `CLAUDE.md` — entry pointer for Claude Code.
- `README.md` — developer setup and workflow.
- `docs/current-state.md` — this file.
- `docs/product-content-sources.md` — source provenance for the local Product
  Details content registry.
