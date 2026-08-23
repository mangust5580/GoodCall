# Current state

Operational handoff. This is not a history log.

## Repository

- Identity: `mangust5580/GoodCall`
- Default branch: `main`
- Current branch: `main`
- Deployment target: GitHub Pages project site (`/GoodCall/`)

## Current milestone

**Components — open.** Closed slices: **Components A — Core Controls & Forms**,
covering raster sections 02 Buttons & Controls and 03 Inputs & Forms,
**Components B — Product Components**, covering raster section 04, and
**Components C — Content & Marketing**, covering raster section 05, and
**Components D — Account Components**, covering raster section 06.

Components A received user visual PASS on 2026-08-23 and is closed.

Components B received user visual PASS on 2026-08-23 and is closed. The
prepared product assets are consumed, the existing Chip, QuantityStepper and Icon
primitives are reused, and no product domain model, cart store or wishlist store
was introduced. Raster sections 01 and 07-08 are not implemented.

User visual PASS received for Components C — Content & Marketing on 2026-08-23.
Components C is closed. All four prepared section-05 assets are consumed — the
reused `product-phone.svg`, the headset icon through the existing Icon system,
the sale-bags promo illustration and the generic technology brand mark. No CMS
layer, marketing data model or newsletter backend was introduced.

Components D — Account Components received user visual PASS on 2026-08-23 and
is closed.

**Components E — Commerce Blocks, covering raster section 07, is implemented
and awaits user visual PASS.** It is not closed.

Components A, B, C and D are closed. Overall Components remains open. Raster
section 08 is not implemented. Section 01 Header & Navigation remains deferred
until future Global Shell work creates the real shell consumer.

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

**Foundations — complete.**

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
  text and link roles.
- Foundations colour tokens: `src/styles/foundations/` (`_colors.scss`,
  `_gradients.scss`, `_index.scss`).
- Generic SCSS helpers: `src/styles/helpers/` (fluid scalars, media mixins,
  `emit-vars`).
- Generic UI SVG icon assets for Components A controls/forms:
  `src/assets/icons/`.
- Foundations colour reference surface: `src/app/FoundationsColorReference.tsx`
  with its own reference-only styles.
- Temporary reference pages: `src/app/TemporaryReference.tsx`.
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
- Commerce brand and store assets for section 07: `src/assets/commerce/`.
- Content and marketing assets for section 05: `src/assets/marketing/`.
- Components A, B, C, D and E reference surface:
  `src/app/ComponentsReference.tsx`.

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
is reachable at `?reference=components`. Components E awaits user visual PASS
and is not closed.

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
card is media-backed with iconed contact rows, while the service card is a large
decorative `tools` glyph beside plain text lines with no per-row icons. A
generic `CommerceCard` mega-component is rejected.

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
plus the existing `map-pin` and `edit`, all through the `Icon` system; the three
prepared payment marks `payment-visa.svg`, `payment-mastercard.svg` and
`payment-mir.svg` as direct image assets that are deliberately not `IconName`
entries; the prepared `store-europeisky.webp`; and the existing
`src/assets/products/product-phone.svg` for the cart specimen. No new asset was
added and no prepared asset geometry was changed.

Known asset delta: `payment-mastercard.svg` draws its circles across only about
44 percent of its `0 0 72 24` viewBox, while the VISA and MIR marks fill roughly
90 percent of theirs. Rendered in one shared brand box the Mastercard mark
therefore reads optically smaller than the raster shows. Prepared asset geometry
was intentionally not edited in the implementation slice; normalizing the three
marks to a common optical size belongs to a later asset correction.

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

- base URL — temporary reference index, linking to the two surfaces below
- `?reference=foundations` — the Foundations colour reference
- `?reference=components` — the Components A, B, C, D and E reference surface

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

**Components E — Commerce Blocks awaits user visual PASS.** Section 07 Commerce
Blocks is implemented on the reference surface at `?reference=components`,
composing the real reusable commerce components. The system-first normalizations
applied against the raster are the shared selectable-options family for the
delivery and payment blocks, one trailing-value treatment across both option
blocks rather than the raster's two slightly different weights, and one shared
Commerce card surface and hairline divider across all six specimens. Section 07
shows no horizontal overflow at 1440px, 768px, 375px or 320px. Components E is
not closed.

**Foundations / Colors — visually accepted by the user on 2026-08-19.**

The Foundations reference surface mirrors the raster's five sections so the
colour system can be compared side by side. It is reached at
`?reference=foundations`.

The Footer gradient runs left-to-right, matching the visible raster specimen,
which is horizontal despite the poster's 180 degree annotation. Its stops are
unchanged. The other five gradients were measured against their specimens and
left as they were, since none showed a material mismatch.

Typography and geometry deliberately do not match the raster: it documents no
font family, type scale, spacing or radius scale, so those were not invented.

## Current routes

None. No router is installed.

## Current dependencies

Runtime: `react`, `react-dom`, `radix-ui`, `@daypicker/react`, `@maskito/core`,
`@maskito/react`.

Dev: `vite`, `@vitejs/plugin-react`, `typescript`, `@types/react`,
`@types/react-dom`, `@types/node`, `sass-embedded`, `postcss`, `autoprefixer`,
`postcss-pxtorem`, `eslint`, `@eslint/js`, `typescript-eslint`, `globals`,
`eslint-plugin-react`, `eslint-plugin-react-hooks`, `eslint-plugin-react-refresh`,
`eslint-plugin-jsx-a11y`, `prettier`, `stylelint`, `stylelint-config-standard-scss`.

Nothing else is installed. In particular there is no router, no Supabase, no
data-fetching, state, form, schema, search/autocomplete, phone validation,
mocking, or E2E library.

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
- Layout primitives.
- Named breakpoints and responsive token decisions — `$breakpoints` stays empty
  and `fluid()` has no consumer.
- Overlay and Backdrop opacity, and what distinguishes the two roles.
- Raster scale factor (1x / 1.5x / 2x), still unconfirmed; it blocks geometry
  work but never affected colour.

## Known deferred work

- The Components reference section 03 can overflow at a 320px viewport because
  the reference grid currently uses a 360px minimum track. This is a deferred
  reference-composition correction, does not reopen Components A and does not
  block any closed Components slice, but remains required before the overall
  Components milestone can close.
- Phone validation, country selection and international formatting are deferred
  until a real product form consumer defines those requirements.
- ESLint is pinned to the 9.x line. ESLint 10 is current, but
  `eslint-plugin-jsx-a11y@6.10.2` and `eslint-plugin-react@7.37.5` declare peer
  support only through ESLint 9. Accessibility coverage was kept rather than
  forced with peer overrides. Revisit when those plugins ship ESLint 10 support.
- TypeScript is pinned to `~6.0.2`. TypeScript 7 is current, but
  `typescript-eslint@8.67` requires `<6.1.0`. Revisit when it supports 7.
- No `public/` directory exists. Add one only when a genuine stable public asset
  is needed.
- No favicon is declared yet.

## Active open questions

None.

## Next approved step

**User visual review of Components E — Commerce Blocks, raster section 07.**
Components E is implemented and technically ready; it stays open until the user
gives visual PASS.

Components stays open. Section 08 needs a later bounded slice. Section 01 Header
& Navigation remains deferred to future Global Shell work rather than being
treated as an isolated Components slice.

## Normative repository docs

- `AGENTS.md` — canonical agent policy (wins on conflict).
- `CLAUDE.md` — entry pointer for Claude Code.
- `README.md` — developer setup and workflow.
- `docs/current-state.md` — this file.
