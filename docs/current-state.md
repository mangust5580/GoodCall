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
- Media Foundation / Picture pipeline + Icon policy
- Location Foundation / CitySelector — visual gate, user visual PASS on
  2026-08-27, including the requested danger-red service/geolocation failure
  correction

Open external integration:

- Location live DaData functional verification, pending `DADATA_TOKEN`
  configuration. It is a separate configuration-dependent gate and does not
  block visual shell work.

Technically complete, final polish deferred:

- **Global Shell E / SiteFooter — technically complete and usable. Final user
  visual polish is deferred until integrated page review near the end of the
  project, so page-family work is not blocked on an immediate Footer visual
  PASS.** Its open items ride along: the support phone conflict across the five
  rasters, social destination wiring until real URLs exist, and app-store badges
  until a real GoodCall application and store contract exists.

Active visual slice:

- **Catalog C / Product Grid + Pagination + Sorting — technically complete,
  user visual PASS is still required.**

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

**Routing.** No router was added. The milestone is exposed through the existing
`?reference=catalog` development mechanism, so GitHub Pages direct entry keeps
working without a history fallback. Routing remains a separate decision gate;
see the task audit for the assessment.

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
data slice own real results.

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
results region; the filter state itself is unchanged and still never touches
products or the result count.

### Catalog C — Product Grid + Pagination + Sorting

**Active slice. User visual PASS is still required.**

**Ownership.** `src/pages/catalog/` gains `catalogProductFixtures.ts` (product
shape, 16 specimen products, sort options and comparators, page constants) and
`CatalogProductGrid.tsx` (the grid, the in-grid promo and the local card state).
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

**ProductCard reuse.** The accepted card renders every result; no
`CatalogProductCard` exists. Exercised props: `title`, `imageSrc`, `imageAlt`,
`price`, `oldPrice` (10 of 16), `badge` (15 of 16, through the accepted `Chip` —
`brand` for `Новинка`, `danger` for discounts), `rating`, `reviewCount`,
`favoritePressed`/`onFavoriteToggle`, `onAddToCart`, and
`quantity`/`onQuantityChange` once a card is added. `availability` is
deliberately unused: the raster's catalog card shows none, and its bordered
padded box does not fit a 259px column beside the price.

**Grid.** `repeat(auto-fill, minmax(228px, 1fr))` with a 20px gap, so the column
count follows usable card width instead of a fixed desktop number: 4 columns at
259px from 1440 (the raster's own 4 columns at ~258px), 3 at 1280, 2 from 1024
and 768, 1 below roughly 500px. The single mobile column is a measured decision,
not a default — at 390px two columns give a 172px card whose 140px content box
cannot hold the accepted 94px price plus the 44px cart action on one line, and
whose titles wrap to four lines. One Catalog-scoped layout rule makes the price
block span the card footer so every card stacks price above action, which is
both consistent across a row and what the raster shows at that card width.

**In-grid promo.** Implemented with the accepted `PromoBanner`, spanning all
columns after the eighth card, reproducing the raster's row-2/row-3 break. It
carries no `actionLabel`, because no route exists and a dead CTA would be fake
interactivity. No campaign architecture and no marketing artwork were added; the
surface is the component's accepted `--gradient-cta` rather than the raster's
black.

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

**Filters stay UI-only.** Sidebar filters and quick presets still change only
their own selection state; they never reorder, filter or count products. Sorting
and pagination do act on the fixtures, because Catalog C explicitly owns those
presentation behaviours. That asymmetry is deliberate and holds until a real
catalogue and facet contract exists.

**View-mode controls were omitted.** The raster's two toolbar buttons are grid
_density_ variants (a 2x3 block and a 3x3 dot grid), not grid-versus-list, so
mapping them onto `ProductCard` `vertical`/`horizontal` would misrepresent the
evidence; and the accepted icon set has no grid, list or dot-grid glyph, so
implementing them would reopen the accepted Icon policy.

**Observed accepted-component deviations from `Catalog.png`**, recorded rather
than fixed, because each belongs to a closed component: `ProductCard` renders the
rating above the title (`__info` is `column-reverse` in vertical layout) while
the raster shows title first; the add-to-cart affordance is a 44px icon button
while the raster shows a full-width labelled `В корзину`; `Chip` badges are soft
tints while the raster uses solid violet and red. None is a correctness defect.

**Deferred:** routing and product detail pages; the multi-category filter/facet
architecture; the final Footer polish pass. The raster shows a tighter last-row →
`NewsletterBand` transition than the accepted page padding produces — recorded
for that integrated review, not changed here.

### Global Shell E — SiteFooter

**Technically complete and usable. Final user visual polish is deferred until
integrated page review near the end of the project.**

`src/components/shell/` owns `SiteFooter`, the canonical global shell footer,
with its styles in `footer.scss`. There is no `src/components/footer/`,
`src/features/footer/`, provider, context, service or config store: the footer is
static shell structure at this milestone.

**Public API is exactly `homeHref?: string`**, defaulting to
`import.meta.env.BASE_URL` like `SiteHeader`. It exists only because the brand
lockup is a real home link. There is no `columns`, `links`, `contacts`,
`socials`, `payments`, `copyright`, `variant`, `theme`, `compact`,
`showNewsletter`, `legalLinks` or `companyInfo` prop, and no footer CMS model,
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

**Link policy.** No router exists, so footer navigation labels and legal labels
render as **non-interactive text**, not fake links. There is no `href="#"`, no
link pointing at the repository root merely to be clickable, and no no-op click
handler. Only three real anchors exist: the brand home link, `tel:+78001001010`
and `mailto:info@goodcall.ru`. Route wiring — and the `<nav>` landmarks that
should accompany it — is deferred to page-family implementation.

**Contact conflict, open.** The email `info@goodcall.ru` is unanimous across all
five rasters. The phone is **not**: Home shows `8 800 100-10-47`, Blog
`8 800 100-10-67`, About and Catalog `8 800 100-10-10`, and Shops
`8 (800) 123-45-67`. The most repeated readable value, `8 800 100-10-10`, is
implemented and is a single constant in `SiteFooter.tsx`. It needs user
confirmation. No address, legal entity or support hours beyond the repeated
9:00-21:00 window were fabricated.

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

**Payments are МИР + СБП only.** VISA, Mastercard, Apple Pay, Google Pay, SberPay
and YooMoney are deliberately not shown.

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
and any privacy/consent copy or policy link — no raster shows one, and no
destination route exists to invent.

**Form semantics.** A plain uncontrolled form. Submission is read with
`FormData`, `event.preventDefault()` stops navigation, the value is trimmed and
handed to `onSubscribe`. Browser-native validation gates submission —
`type="email"`, `required`, `autocomplete="email"`, `inputMode="email"`, and
`noValidate` is never set. There is **no** backend, `fetch`, endpoint,
newsletter/marketing SDK, `localStorage`, cookie, loading state, retry,
analytics, validation schema, form library or React form state. No success or
failure UI exists inside the production component.

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
  location (`Москва`), `Доставка по всей России`, `Магазины`, `Поддержка 24/7`.
  Page-specific geo banners and campaign copy are deliberately excluded.
- **MainHeader** — brand lockup, prominent purple catalog entry, the reused
  `SearchField`, and — at 768px and above — the four user actions Compare /
  Favorites / Cart / Account with optional numeric badges.
- **CategoryNav** — `<nav aria-label="Категории товаров">` with the canonical
  compact category set and a trailing `Ещё` link to the catalog. Every canonical
  category now carries a typed line icon; no mega-menu or flyout exists.

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
model, auth or session inference, and makes no network request. With no router
installed, destination props default to `import.meta.env.BASE_URL`.

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
contract. Future promotional/banner carousels may reuse Embla but none is
implemented.

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
closed. Every raster Components section except 01 is implemented. Section 01
Header & Navigation remains deferred until future Global Shell work creates the
real shell consumer and is not an open Components-slice blocker.

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
container-driven numeric range primitive. Catalog URL state, backend commits and
filter/search architecture remain deferred feature-level work. Components A
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
- Foundations colour reference surface: `src/app/FoundationsColorReference.tsx`
  with its own reference-only styles.
- Temporary reference pages: `src/app/TemporaryReference.tsx`.
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
  `src/app/ComponentsReference.tsx`.
- Global Shell Container reference surface: `src/app/LayoutReference.tsx`, with
  its reference-only styles in `LayoutReference.scss`.
- Global Shell Header reference surface: `src/app/HeaderReference.tsx`, with its
  reference-only styles in `HeaderReference.scss`.
- Global Shell NewsletterBand reference surface:
  `src/app/NewsletterReference.tsx`, with its reference-only styles in
  `NewsletterReference.scss`.
- Global Shell SiteFooter reference surface: `src/app/FooterReference.tsx`, with
  its reference-only styles in `FooterReference.scss`.
- First page family: `src/pages/catalog/` — `CatalogPage`, with its styles in
  `catalog.scss`. Its reference surface is `src/app/CatalogReference.tsx`, with
  reference-only styles in `CatalogReference.scss`.

There is no router, no data layer, and no feature architecture. The reference
surfaces are development comparison pages, not product UI.

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
`App.tsx` selects the surface, with no router and no new dependency:

- base URL — temporary reference index, linking to the four surfaces below
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
- `?reference=catalog` — the Catalog reference surface: a reference-only note
  followed by the real production shell — `SiteHeader`, `CatalogPage`,
  `NewsletterBand`, `SiteFooter` and `MobileActionBar`. It owns the mobile bottom
  inset and builds no Home page. It seeds no filter, sort or page state: the page
  opens in its own defaults, which are the state `Catalog.png` shows. No
  `?reference=catalog-filters` or `?reference=catalog-c` surface was added.

Links are built from `import.meta.env.BASE_URL`, so they resolve under the
GitHub Pages base without hardcoding the repository name, and no SPA fallback is
needed because the path never changes.

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

**Catalog C / Product Grid + Pagination + Sorting — technically complete; user
visual PASS is still required.** `?reference=catalog` renders the real shell
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

**Global Shell E / SiteFooter — technically complete and usable; final visual
polish deferred to integrated page review.** `?reference=footer` reports zero horizontal document overflow, zero
runtime errors and zero failed requests at 1920 / 1440 / 1280 / 1024 / 768 / 430 /
390 / 375 / 320, and so do the base index and every earlier reference surface. The
footer surface is 264px tall at 1280px and above. Layout is five columns from
1200px, three from 768px with the contacts block spanning two cells, two from
560px and one below that. The social row stays a single line of four official
marks (178px wide) at every width down to 320px, and the МИР and СБП marks share
one centred line everywhere. The composition holds exactly one `<footer>`
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

None. No router is installed.

## Current dependencies

Runtime: `react`, `react-dom`, `radix-ui`, `@daypicker/react`, `@maskito/core`,
`@maskito/react`, `embla-carousel-react`.

Dev: `vite`, `@vitejs/plugin-react`, `typescript`, `@types/react`,
`@types/react-dom`, `@types/node`, `sass-embedded`, `postcss`, `autoprefixer`,
`postcss-pxtorem`, `eslint`, `@eslint/js`, `typescript-eslint`, `globals`,
`eslint-plugin-react`, `eslint-plugin-react-hooks`, `eslint-plugin-react-refresh`,
`eslint-plugin-jsx-a11y`, `prettier`, `stylelint`, `stylelint-config-standard-scss`.

`embla-carousel-react` resolves to **8.6.0** and is user-approved. It has exactly
one current consumer — the mobile category navigation in `SiteHeader` — and the
supplied page designs also contain future promotional/banner slider evidence. No
Embla plugin is installed (`embla-carousel-autoplay`, `-auto-scroll`,
`-wheel-gestures` and the rest are absent), and the v9 release candidate is not
in the tree; only `embla-carousel-react`, `embla-carousel` and
`embla-carousel-reactive-utils`, all 8.6.0.

Nothing else is installed. In particular there is no router, no Supabase, no
data-fetching, state, form, schema, search/autocomplete, phone validation,
mocking, or E2E library, and no other carousel/slider library.

## Scripts

```
npm run dev           # Vite dev server (user-owned; agents do not start it)
npm run build         # tsc -b && vite build
npm run preview       # preview the production build
npm run typecheck     # tsc -b
npm run lint          # eslint .
npm run lint:styles   # stylelint "src/**/*.scss"
npm run format        # prettier --write .
npm run format:check  # prettier --check .
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
- Options behind the brand and colour `Показать ещё` buttons are fixtures. The
  raster shows only the collapsed lists, so the hidden values are specimen data
  until a real catalogue source exists.
- The smartphone filter and product fixtures are **not** the future universal
  category contract. GoodCall will hold many technical categories with different
  filter inventories, and the trigger for designing common-versus-category-
  specific filter and facet architecture is a second real category with a
  different inventory — not a refactor of the current specimen data.
- Routing remains a separate milestone after Catalog C. No product or category
  routes exist, so cards and the in-grid promo carry no links.
- Live DaData behaviour is unverified. No local token is available, GitHub secret
  presence is unverifiable without `gh`, and the DaData hosts are unreachable
  from this build environment, so the adapter was verified against recorded
  response shapes rather than the live service. Live search, live IP detection,
  live reverse geocoding and live Pages behaviour all remain open.

## Next approved step

**User visual review of Catalog C / Product Grid + Pagination + Sorting.** The
slice is technically complete; only the user can grant the visual PASS. Four
questions ride with it. The accepted `ProductCard` renders the rating above the
title and offers a 44px icon-only cart action, where `Catalog.png` shows title
first and a full-width `В корзину` button — both are closed-component
decisions, recorded rather than overridden. The raster's two toolbar buttons are
grid-density variants and the accepted icon set has no matching glyph, so
view-mode controls were omitted. `pageCount` is the raster's 65 and, like
`2 546 товаров`, is specimen copy rather than a computed total. And the in-grid
promo uses the accepted `PromoBanner` — violet gradient, no CTA — where the
raster shows a black band with a `Смотреть подборку` button.

Footer questions stay open for its deferred polish pass: the support phone
conflict, social destination wiring, and app-store badges.

**Outstanding external configuration, separate from this slice:** set the
repository secret `DADATA_TOKEN` (and a local `.env.local` with
`VITE_DADATA_TOKEN` for local work), then re-run live DaData and Pages
verification of the Location Foundation. Until then the deployed Header falls
back to `Выберите город` and the network features are disabled gracefully. That
gate is configuration-dependent and does not block visual shell work.

Do not begin routing or a second page family before Catalog C receives explicit
user visual PASS. Do not reopen or redesign the accepted Header, BrandLogo,
Media Foundation, Location visuals, NewsletterBand, SiteFooter, ProductCard,
Pagination or closed Components. Do not turn the Catalog fixtures into a product
or category domain model, do not add router, state or data architecture, do not
add a footer CMS/config layer, backend or persistence, and do not add
dependencies unless a concrete requirement proves necessary. Accepted system
decisions win over incidental raster differences.

## Normative repository docs

- `AGENTS.md` — canonical agent policy (wins on conflict).
- `CLAUDE.md` — entry pointer for Claude Code.
- `README.md` — developer setup and workflow.
- `docs/current-state.md` — this file.
