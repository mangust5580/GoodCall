# M4 Canonical Application Shell Report

## Status

| Task                                                                          | Status                                                                        |
| ----------------------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| M4-01 — Shell destination safety and composition boundary                     | **CLOSED THROUGH M4-01A**                                                     |
| M4-01A — Catalog family catch-all correction and CI reconciliation            | **APPROVED AND CLOSED**                                                       |
| M4-02 — Runtime brand/logo integration                                        | **CLOSED THROUGH M4-02A**                                                     |
| M4-02A — Brand landmark accessibility correction and E2E stabilization        | **APPROVED AND CLOSED**                                                       |
| M4-03 — Information Bar                                                       | **CLOSED THROUGH M4-03A**                                                     |
| M4-03A — Information Bar E2E correction and exact active-state reconciliation | **APPROVED AND CLOSED**                                                       |
| M4-04 — Primary Header core: Catalog entry and Global Search                  | **IMPLEMENTED — AWAITING INDEPENDENT AUDIT, CI AND USER VISUAL CONFIRMATION** |

M4 is not approved and not closed. The Information Bar and the primary Header core now exist; Header route actions, the shell icon set, Footer and Newsletter all remain later stages. The transitional brand banner was replaced by the canonical Header in M4-04.

## M4-01 — Shell destination safety and composition boundary

### Baseline

| Item                             | Value                                                        |
| -------------------------------- | ------------------------------------------------------------ |
| Branch                           | `main`                                                       |
| Required starting SHA            | `7db61d2eb41c56fcdc43531f21e1fe64db730604`                   |
| `git rev-parse HEAD`             | matched before changes                                       |
| `git rev-parse origin/main`      | matched before changes                                       |
| `git diff` / `git diff --cached` | exit 0 — clean                                               |
| Untracked at start               | `artifacts/`, `AUDIT.md` (git-excluded)                      |
| Milestone state                  | M1 closed, M2 tracked, M3 closed, M3-06 closed, M4 unblocked |

### Scope

This stage makes future shell destinations route-safe. It registers the approved shell destination routes that did not exist in the runtime, so that Header, Information Bar and Footer links added in later stages cannot fall into the catch-all 404.

It is deliberately **not** a visual stage. No Header, Footer, Information Bar, search form, Catalog button, Compare/Favorites/Cart/Account actions, newsletter, runtime logo, icons, sticky behaviour or responsive shell styling is implemented.

### Accepted decisions

- **Technical route carriers.** Each missing destination gets a narrow technical carrier with a canonical route identity, a route-specific title and `h1`, and an explicit notice that the section is not implemented. A carrier is not a final page and must be replaced by its own owner milestone.
- **No `/catalog` root route.** The future global Catalog entry uses the existing representative category route `/catalog/laptops`. The category route contract is unchanged and no catalog surface, menu, drawer or taxonomy is implemented.
- **One reusable carrier presentation.** A single application-owned neutral presentation, `RouteCarrierPage`, is driven by typed route descriptors. There is no copied page implementation per route, no per-carrier chunk, no domain component, no Shared UI addition and no abstraction that hides route identity — every route is still explicitly registered and independently assertable.
- **One shared typed descriptor.** `src/app/routing/carriers.ts` is the single source consumed by both the route registry and the runtime router. This closes a real drift risk: nineteen routes would otherwise have to be kept in manual sync across two files. The five existing routes remain hand-written in both places exactly as before; the M1 routing architecture, loaders, error boundaries and lazy boundaries are untouched.

### Route carrier inventory

Nineteen carriers, all `public`, all registered before the catch-all.

| Route key                        | Path                    | Canonical technical heading |
| -------------------------------- | ----------------------- | --------------------------- |
| `search`                         | `/search`               | Поиск                       |
| `comparison`                     | `/comparison`           | Сравнение товаров           |
| `favorites`                      | `/favorites`            | Избранное                   |
| `auth`                           | `/auth`                 | Вход и регистрация          |
| `information.deliveryAndPayment` | `/delivery-and-payment` | Доставка и оплата           |
| `help.warrantyReturns`           | `/warranty-and-returns` | Гарантия и возврат          |
| `loyalty.program`                | `/loyalty`              | Программа лояльности        |
| `help.faq`                       | `/help`                 | Помощь                      |
| `company.contacts`               | `/contacts`             | Контакты                    |
| `promotions.list`                | `/promotions`           | Акции                       |
| `brands.directory`               | `/brands`               | Бренды                      |
| `locations.shops`                | `/shops`                | Магазины                    |
| `locations.serviceCenters`       | `/service-centers`      | Сервисные центры            |
| `company.about`                  | `/about`                | О компании                  |
| `blog.list`                      | `/blog`                 | Блог                        |
| `order.tracking`                 | `/track-order`          | Отследить заказ             |
| `legal.privacyPolicy`            | `/privacy-policy`       | Политика конфиденциальности |
| `legal.userAgreement`            | `/user-agreement`       | Пользовательское соглашение |
| `legal.publicOffer`              | `/public-offer`         | Публичная оферта            |

Each carrier route title is `<heading> — GoodCall`.

Not added in this stage: the account subtree, checkout and order-confirmation routes, promotion detail, blog article, any product or category route beyond the existing ones, shop and service-centre details, Email Preview, and anything absent from the approved canonical routing contract.

### Architecture boundary

- The route registry keeps its invariants: unique keys, unique IDs, app-relative canonical paths, no repository literal, a single catch-all that stays last. `validateRouteRegistry()` gains two auditable invariants — no trailing slash, and lowercase kebab-case static segments.
- Existing `home`, `catalog.category`, `catalog.product`, `cart` and `error.notFound` identities are unchanged.
- There is one router, one registry, one `main#main-content` per route and one route-announcement owner.
- `RootLayout` remains the only application root layout and the only route-lifecycle owner. Title, focus, scroll and announcement semantics are untouched: initial direct load does not steal focus, client PUSH/REPLACE to a new pathname focuses the route `h1`, POP does not force heading focus, query-only navigation does not re-focus, and `ScrollRestoration` ownership is unchanged.
- No speculative shell metadata was added. The existing route `id` and `handle` are already sufficient for future route-aware shell integration, so no extra abstraction layer was introduced.
- The carrier presentation consumes only existing Shared UI primitives through `@/shared/ui` — no deep imports, no domain modules, no Supabase, Query Client, MSW, storage or raw fetch, and only existing technical tokens.

### Files changed

| File                                                  | Change                                                                          |
| ----------------------------------------------------- | ------------------------------------------------------------------------------- |
| `src/app/routing/carriers.ts`                         | new — typed carrier descriptors, shared notice and label, title/segment helpers |
| `src/routes/carrier/RouteCarrierPage.tsx`             | new — the single neutral carrier presentation                                   |
| `src/app/routing/registry.ts`                         | carrier keys and metadata; trailing-slash and kebab-case invariants             |
| `src/app/composition/create-runtime.ts`               | carrier routes registered before the catch-all                                  |
| `tests/routing/registry.test.ts`                      | table-driven carrier inventory and baseline-identity coverage                   |
| `tests/routing/route-carriers.integration.test.tsx`   | new — carrier rendering and lifecycle contracts                                 |
| `tests/e2e/route-carriers.spec.ts`                    | new — data-driven production-preview evidence                                   |
| `docs/05-implementation/m4-canonical-shell-report.md` | new — this report                                                               |
| `docs/05-implementation/repository-state.md`          | M4-01 current-state note                                                        |

Unchanged: `src/shared/ui/**` and its public API, `package.json`, `package-lock.json`, `AGENTS.md`, `CLAUDE.md`, `README.md`, `src/assets/**`, `.github/**` and every tooling configuration file.

### Accessibility

Every carrier route renders exactly one `main` with the stable `id="main-content"`, and exactly one canonical `h1` carrying the existing `data-route-focus` and `tabIndex={-1}` route-focus contract. The Home link has the accessible name **На главную**. DOM order matches reading and focus order. No extra landmark, no local live region, no focus trap and no keyboard interaction beyond the native link were added. Visible focus is preserved through the existing token-driven styles. Reflow at narrow viewports is asserted in E2E to produce no page-level horizontal scroll, and the notice never claims that the destination feature is implemented.

### Tests

Unit and registry coverage is table-driven over the descriptor list rather than nineteen near-identical files:

- exact carrier inventory, order and count;
- unique route keys and IDs; exact canonical paths; expected public access; route-specific titles;
- catch-all unique and last; no `/GoodCall/` inside route identities; no trailing slashes; lowercase kebab-case static segments;
- the five existing route records unchanged; no route added outside the approved inventory; no `/catalog` root route.

Integration coverage, per carrier route: resolves to the carrier and not the catch-all; one `main#main-content`; one route `h1` with the expected heading; the neutral notice; the Home link; the correct document title; no duplicated route-announcement owner. Plus lifecycle checks that client navigation to a carrier focuses its `h1`, POP does not force heading focus, query-only navigation does not re-focus, and the carrier title is announced on client navigation only.

E2E coverage is one data-driven scenario over the exact inventory: direct navigation under `/GoodCall/`, base-path safety on hard refresh, heading and title, catch-all is not rendered, the Home recovery link, one `main` and one `h1`, and no page errors, console errors or failed requests. Representative axe coverage was added for one standard carrier (`/contacts`) and one legal carrier (`/privacy-policy`); existing Home and 404 axe coverage is unchanged.

### Local verification

| Command                  | Result                                         |
| ------------------------ | ---------------------------------------------- |
| `npm run typecheck`      | PASS                                           |
| `npm run lint`           | PASS — 0 errors, 0 warnings                    |
| `npm run lint:styles`    | PASS                                           |
| `npm run format:check`   | PASS                                           |
| `npm run check:comments` | PASS                                           |
| `npm test`               | PASS — **685 tests in 38 files**               |
| `npm run build`          | PASS                                           |
| `npm run validate:build` | PASS — worker absent from `dist`               |
| `npm run check:full`     | PASS — includes the bounded dev-bootstrap gate |

Unit/integration totals move from 533 in 37 files to **685 in 38 files**.

Bundle moves from raw 407.10 KB / gzip 122.19 KB to raw **410.18 KB** / gzip **123.44 KB** — plus 3.08 KB raw, plus 1.25 KB gzip. The carrier element is registered eagerly rather than through nineteen lazy modules, so the Shared UI primitives it uses now resolve into the entry chunk instead of a route chunk. That is the deliberate cost of refusing a per-carrier chunk; the repository defines no numeric bundle budget.

### E2E and CI status

Local E2E was **not** run: `AGENTS.md` reserves the production-preview server lifecycle for CI or a user-owned preview. `npm run dev`, `npm run preview`, `npm run test:e2e`, `playwright test`, `vite`, `vite preview` and `npm run review:m3-browser` were not executed. The only server-bearing command used was the repository-owned bounded verifier through `npm run check:full`, which met every `AGENTS.md` constraint and released its own server and browser.

**CI failed on the exact M4-01 SHA.**

| Item         | Value                                      |
| ------------ | ------------------------------------------ |
| Commit       | `dcf5008652061b6618ef32fab685e4362ea62bf6` |
| Workflow run | 31074911879                                |
| Job          | 92530710353 — `test (24.x)`                |
| Conclusion   | **failure**                                |

Every step through `Build` and `Validate build` passed. The `E2E tests` step failed: **48 passed, 1 failed**, reproduced on the initial attempt and both retries.

Failing scenario — `tests/e2e/route-carriers.spec.ts:114`, _M4-01 route carriers › an unregistered path still renders the catch-all_: navigating to `/GoodCall/catalog` expected an `h1` containing `Page not found` and found no `h1` at all.

Root cause: `catalog-family` was declared with `path: 'catalog'` and its only child with `path: ':categorySlug'`. The parent had neither a renderable element nor an index route, so `/catalog` matched the parent and rendered an empty outlet instead of falling through to `path: '*'`. The Playwright trace warning — _Matched leaf route at location "/catalog" does not have an element or Component_ — is consistent with that composition. This was not a flake and not CI infrastructure.

The defect escaped local verification because the M4-01 integration tests built their own simplified route definitions instead of exercising the production route tree.

**M4-01 was not accepted on that SHA, and M4-02 remained blocked.** The correction is [M4-01A](#m4-01a--catalog-family-catch-all-correction-and-ci-reconciliation).

### Rejected variants

- **A `/catalog` root route** — the approved Catalog entry is the existing `/catalog/laptops`; adding a root would expand M4-01 into catalog surface work.
- **Nineteen copied page implementations** — nineteen files to keep in sync, with no additional evidence value.
- **Nineteen lazy route modules** — nineteen chunks for identical markup, against the explicit stage constraint.
- **A Shared UI carrier component** — the carrier is a temporary technical boundary, not a design-system primitive, and the Shared UI public API is frozen for this stage.
- **A generic route-driven page that infers its heading from router state** — it would hide route identity and make each route harder to assert.
- **Speculative shell metadata on route handles** — no consumer exists in M4-01, so it would encode future Header/Footer policy with no test behind it.
- **Auto-generating the whole runtime route tree from the registry** — a rewrite of M1 routing architecture that this stage does not need.

### Deviations

One, and it is structural rather than a scope change. The stage asked that the repository-state note carry the exact M4-01 commit SHA. A commit cannot contain its own SHA, and this stage is limited to a single commit with no amend, so the note records the baseline SHA and states that the M4-01 commit SHA is reported in the stage handoff and recorded by the next documentation stage.

Otherwise none: the implemented inventory matches the approved list exactly, and no file outside the permitted scope was modified.

### Risks

- Carriers are technical placeholders. If a later stage ships a shell link to one of them without its owner milestone, users reach a real route that states the section is unimplemented — visible, but intentionally not a 404.
- The carrier presentation is registered eagerly, so future growth of carrier markup would land in the entry chunk. If carriers ever gain per-destination content, a single shared lazy boundary should be reconsidered.
- Route identity, headings and titles are Russian-language canonical strings with no localisation layer; introducing i18n later will need to own these strings.

### Documentation updates

This report is new. `docs/05-implementation/repository-state.md` gains an M4-01 current-state note. No canonical design document, no 04A–04C architecture contract, no M1/M2/M3 report, no README and no tooling-versions file was modified.

### Next gate

Superseded. CI failed for `dcf5008…`, so M4-01 alone is not an implementation candidate; the gate moved to [M4-01A](#m4-01a--catalog-family-catch-all-correction-and-ci-reconciliation).

## M4-01A — Catalog family catch-all correction and CI reconciliation

**Status: APPROVED AND CLOSED**

Closure evidence: commit `ec1b113a30c64a6da9175b99e24199cf51b5af27`, GitHub Actions run **31076416986**, job **92535335985**, conclusion **success** — every step green including `E2E tests` (Vitest 697 passed in 39 files, Playwright 49 passed). The independent audit returned **approved**. M4-01 is closed through M4-01A.

### Baseline

| Item                                 | Value                                      |
| ------------------------------------ | ------------------------------------------ |
| Branch                               | `main`                                     |
| Baseline SHA                         | `dcf5008652061b6618ef32fab685e4362ea62bf6` |
| Baseline commit                      | `feat(shell): establish M4 route carriers` |
| `git rev-parse HEAD` / `origin/main` | both matched the baseline before changes   |
| `git diff` / `git diff --cached`     | exit 0 — clean                             |

### Catalog family composition correction

`catalog-family` is now a **pathless grouping route** that still owns `CatalogErrorBoundary`, and its category child owns the full path `catalog/:categorySlug`.

| Before                                          | After                                                   |
| ----------------------------------------------- | ------------------------------------------------------- |
| `catalog-family` with `path: 'catalog'`         | `catalog-family` pathless, `errorElement` retained      |
| `catalog-category` with `path: ':categorySlug'` | `catalog-category` with `path: 'catalog/:categorySlug'` |

Consequences:

- `/catalog/laptops` resolves exactly as before, through the same route ID, the same lazy module and the same `categoryLoader`;
- the category URL contract stays `/catalog/:categorySlug`;
- `/catalog` no longer matches an empty parent leaf and reaches the existing global catch-all;
- `CatalogErrorBoundary` still scopes loader rejections for the category route;
- no `/catalog` index route, redirect, root page or carrier was added — `/catalog` remains intentionally unregistered as a destination.

Product routing, cart routing, carrier routing and catch-all ordering are untouched, as are `RootLayout` ownership, the title/focus/scroll/announcement lifecycle, skip-link behaviour, route-owned `main#main-content`, canonical route IDs and keys, the carrier inventory and content, and the `/GoodCall/` project base.

### Regression-test seam

The defect escaped because local integration tests declared their own simplified route trees. `createApplicationRoutes()` is now a focused exported function in the narrowly scoped module `src/app/composition/application-routes.ts`, and `createApplicationRuntime()` consumes exactly that function. Serverless Vitest builds a memory router from the **same route objects** production hands to `createBrowserRouter`.

The extraction went to an adjacent module rather than staying in `create-runtime.ts` out of technical necessity: `create-runtime.ts` imports `publicConfig`, which validates `import.meta.env.MODE` against `development | production` at module load and therefore throws under Vitest's `test` mode. Keeping the route tree there would have left it unimportable by serverless tests, reproducing the exact blind spot this stage exists to close. `application-routes.ts` has no configuration dependency; `create-runtime.ts` keeps `publicConfig` for the router `basename`. No second registry or duplicated route tree was introduced.

`tests/routing/application-routes.integration.test.tsx` asserts against that shared tree: `/catalog` renders the catch-all with exactly one `main#main-content` and one `h1` containing `Page not found`, keeps the not-found title contract and leaves no empty outlet; `/catalog/laptops` still resolves through the category route with its slug rendered; an invalid category slug still surfaces through `CatalogErrorBoundary`; a deeper unknown catalog path still reaches the catch-all; and Home, Product, Cart, a representative carrier and an unknown path all remain green.

The regression was proven red-then-green: against the baseline composition the four `/catalog` assertions failed, and they pass after the correction.

### Lifecycle test determinism

`tests/routing/route-carriers.integration.test.tsx` carried a race: the POP and query-only assertions blurred the active element without first waiting for the `requestAnimationFrame` focus that `RootLayout` schedules on PUSH, so a late frame could focus the heading after the blur. Measured locally at roughly one failure in two runs, it would have reddened CI intermittently.

Both tests now wait until PUSH focus has actually landed on the heading, assert the blur took effect, and only then exercise POP or query-only navigation. The assertions are stricter than before, not weaker, and the lifecycle behaviour under test is unchanged. Six consecutive runs pass.

### Files changed

| File                                                    | Change                                                                    |
| ------------------------------------------------------- | ------------------------------------------------------------------------- |
| `src/app/composition/application-routes.ts`             | new — the production route tree with the corrected catalog family         |
| `src/app/composition/create-runtime.ts`                 | consumes `createApplicationRoutes()`; keeps `publicConfig` for `basename` |
| `tests/routing/application-routes.integration.test.tsx` | new — regression coverage against the real application route objects      |
| `tests/routing/route-carriers.integration.test.tsx`     | POP and query-only focus assertions made deterministic                    |
| `docs/05-implementation/m4-canonical-shell-report.md`   | M4-01 failure evidence and this corrective section                        |
| `docs/05-implementation/repository-state.md`            | current-state note reconciled                                             |

`tests/e2e/route-carriers.spec.ts` is **unchanged** — the failing assertion is valid and was preserved.

### Local verification

| Command                  | Result                                         |
| ------------------------ | ---------------------------------------------- |
| `npm run typecheck`      | PASS                                           |
| `npm run lint`           | PASS — 0 errors, 0 warnings                    |
| `npm run lint:styles`    | PASS                                           |
| `npm run format:check`   | PASS                                           |
| `npm run check:comments` | PASS                                           |
| `npm test`               | PASS — **697 tests in 39 files**               |
| `npm run build`          | PASS                                           |
| `npm run validate:build` | PASS                                           |
| `npm run check:full`     | PASS — includes the bounded dev-bootstrap gate |
| `git diff --check`       | PASS                                           |

Bundle: raw **410.20 KB** / gzip **123.43 KB**, unchanged from M4-01 within rounding.

Local E2E was **not** run, per `AGENTS.md`. The E2E fix cannot be claimed from serverless tests alone; only exact-SHA CI can confirm it.

### E2E and CI status

CI was pending at commit time. No result is claimed in this document; the exact-SHA outcome is recorded in the untracked stage handoff.

### Rejected variants

- **Registering `/catalog` as a route, index page or carrier** — project decisions explicitly prohibit it as a runtime destination.
- **Redirecting `/catalog` to `/catalog/laptops`** — invents navigation policy this stage does not own and hides the composition defect instead of fixing it.
- **Giving `catalog-family` an element** — makes `/catalog` a real destination by another name.
- **Weakening or deleting the failing E2E assertion** — it was correct and caught a real defect.
- **Raising Playwright retries or timeouts** — the failure was deterministic, not flaky.
- **Duplicating the corrected route tree into tests** — the same blind spot that let the defect through.

### Deviations

One, documented above: the route tree was extracted into the adjacent `application-routes.ts` rather than exported from `create-runtime.ts`, because `create-runtime.ts` cannot be imported under Vitest. The stage's allowed-files list anticipates one narrowly scoped adjacent route-composition module.

Additionally, `tests/routing/route-carriers.integration.test.tsx` was changed beyond the catalog defect to remove a genuine intermittent failure that would otherwise redden the corrective CI run. It is an existing routing integration test file, which the stage permits.

### Next gate

Closed. CI passed for `ec1b113a…` and the independent audit approved it, which unblocked M4-02.

## M4-02 — Runtime brand/logo integration

**Status at commit time: IMPLEMENTED — AWAITING INDEPENDENT AUDIT AND CI**

### Baseline

| Item                                 | Value                                      |
| ------------------------------------ | ------------------------------------------ |
| Branch                               | `main`                                     |
| Baseline SHA                         | `ec1b113a30c64a6da9175b99e24199cf51b5af27` |
| Baseline commit                      | `fix(routing): restore catalog catch-all`  |
| `git rev-parse HEAD` / `origin/main` | both matched the baseline before changes   |
| `git diff` / `git diff --cached`     | exit 0 — clean                             |

### Architecture and public API

The brand boundary is application-shell owned and published from `src/app/shell/brand`. Header and Footer stages will later import it through `@/app/shell/brand`. It is deliberately **not** exported from `src/shared/ui`, and is not a route-domain component.

```
export type BrandLockup = 'horizontal' | 'symbol';
export type BrandVariant = 'primary' | 'inverse' | 'monochrome';

export interface BrandHomeLinkProps {
  lockup?: BrandLockup;
  variant?: BrandVariant;
  className?: string;
}
```

Defaults are `lockup="horizontal"` and `variant="primary"`. The props surface is deliberately narrow: there is no custom destination, no custom accessible label, no custom SVG markup, no arbitrary children, no geometry transform, no raw asset path and no free-form size that could bypass the approved minimums.

The component renders a direct React Router `Link` inside the application-owned boundary, because the Shared UI `Link` does not expose a consumer-owned `aria-label` and its API was not changed for this GoodCall-specific component.

### Asset selection

A typed `Record<BrandLockup, Record<BrandVariant, BrandAsset>>` makes the mapping exhaustive — TypeScript rejects a missing combination — and every asset is a distinct Vite module import, so no filename is ever derived by concatenation.

| Lockup     | Variant    | Production path                                   | Rendering |
| ---------- | ---------- | ------------------------------------------------- | --------- |
| horizontal | primary    | `src/assets/brand/goodcall-logo.svg`              | image     |
| horizontal | inverse    | `src/assets/brand/goodcall-logo-inverse.svg`      | image     |
| horizontal | monochrome | `src/assets/brand/goodcall-logo-monochrome.svg`   | mask      |
| symbol     | primary    | `src/assets/brand/goodcall-symbol.svg`            | image     |
| symbol     | inverse    | `src/assets/brand/goodcall-symbol-inverse.svg`    | image     |
| symbol     | monochrome | `src/assets/brand/goodcall-symbol-monochrome.svg` | mask      |

Vite inlines assets under its 4 KB threshold, so the three symbol SVGs (726–736 bytes) resolve to `data:` URIs while the three horizontal logos are emitted as files, byte-identical to source. Both forms are base-safe under `/GoodCall/`; the data URI needs no base, and the emitted file URL carries it.

### Monochrome rendering strategy

Rendering the monochrome asset as an ordinary external `<img>` would have made the "consumer-owned `currentColor`" contract untrue, because an external image cannot inherit colour from its link context. The monochrome variants therefore render as a CSS mask: `mask-image` points at the imported approved asset through a custom property, and `background-color: currentcolor` supplies the visible colour, so the logo genuinely resolves from the consumer's `currentColor`.

Asset bytes and geometry are unchanged, no replacement colour is hardcoded, no SVG paths are recreated inline, `dangerouslySetInnerHTML` is not used, and no dependency was added. The mask element stays decorative inside the named link.

### Transitional runtime mount

`RootLayout` renders exactly one default `BrandHomeLink` in a plain `div` slot placed after the skip link and live regions and before `ScrollRestoration` and the route outlet. The slot is **not** wrapped in `header`, `nav`, `main` or any other landmark, has no role, no route-aware visibility, no sticky behaviour and no breakpoint-specific behaviour.

This is implementation scaffolding for M4-02 only. M4-04 will relocate the same public component into the canonical Header, and M4-07 may reuse it in the Footer. It is deliberately not a partial Header.

### Accessibility contract

- The link owns exactly one accessible name: `GoodCall — на главную`.
- The internal visual is decorative — `alt=""` for images, `aria-hidden="true"` for the mask — and contributes no second accessible name. No `<title>` is introduced and no adjacent visible text duplicates the spoken name.
- The skip link remains the first focusable control; the brand link is second.
- No landmark and no live region were added, and route focus, title, scroll and announcement ownership are unchanged.
- Each route still owns one `main#main-content` and one canonical `h1`.
- The link carries a `min-inline-size`/`min-block-size` of 44px, and its focus indicator is an outline that survives forced colors and does not depend on asset colour.
- The horizontal asset never renders below 120px and the symbol never below 16px; both preserve aspect ratio with a `contain` fit, and neither uses transforms or negative margins.

### Files changed

| File                                                  | Change                                                               |
| ----------------------------------------------------- | -------------------------------------------------------------------- |
| `src/app/shell/brand/brand-assets.ts`                 | new — typed exhaustive asset selection over the six approved imports |
| `src/app/shell/brand/BrandHomeLink.tsx`               | new — the named Home link with decorative visual                     |
| `src/app/shell/brand/BrandHomeLink.module.scss`       | new — sizing, minimums, contain fit, mask and focus styles           |
| `src/app/shell/brand/index.ts`                        | new — the `@/app/shell/brand` public boundary                        |
| `src/app/shell/RootLayout.tsx`                        | transitional brand slot after the skip link                          |
| `src/app/shell/Shell.module.scss`                     | transitional slot padding                                            |
| `tests/app/shell/brand-home-link.test.tsx`            | new — component contract across all six combinations                 |
| `tests/app/shell/brand-runtime-mount.test.tsx`        | new — mount behaviour against the real application route tree        |
| `tests/brand-assets.test.ts`                          | integration-status assertion only                                    |
| `tests/e2e/route-carriers.spec.ts`                    | carrier Home-link lookups made exact                                 |
| `tests/e2e/brand-home-link.spec.ts`                   | new — production-preview brand evidence                              |
| `docs/05-implementation/m2-brand-asset-manifest.json` | `runtime-integrated`; stale "not consumed" risk replaced             |
| `docs/05-implementation/m2-brand-assets-report.md`    | M4 runtime-integration addendum                                      |
| `docs/05-implementation/m4-canonical-shell-report.md` | M4-01A closure; this section                                         |
| `docs/05-implementation/repository-state.md`          | current-state note                                                   |

No SVG byte change, no new asset, no dependency or lockfile change, no Shared UI API change, no Vite/Playwright/workflow configuration change, and no Header, Footer, Information Bar, Newsletter, Search or Catalog UI.

### Tests

Component coverage asserts the destination, the exact accessible name, the absence of a second accessible name, the horizontal-primary default, every one of the six selections, the image-versus-mask strategy, the `currentColor` mask contract, the absence of inline SVG reconstruction, the 120px/16px/44px sizing contracts, aspect-ratio and contain fit, the focus indicator, consumer `className` passthrough, and that the component is absent from the Shared UI barrel.

Asset assertions compare the runtime URL against the **approved source geometry** — decoding inlined data URIs and matching viewBox and every path `d` value — rather than trusting a filename, so integrity holds in both emission forms.

Mount coverage runs against `createApplicationRoutes()`, the production route objects, on Home and a carrier route: exactly one brand link, one `main`, one `h1`, unchanged route titles, the brand link outside `main`, skip link first in DOM and focus order, no added landmark or live region, navigation back to Home, and no collision with the carrier's own `На главную` link.

E2E adds production-preview evidence for the mounted horizontal primary logo: the named link with `href="/GoodCall/"`, a rendered visual at or above 120px, preserved aspect ratio and `contain` fit, navigation from a carrier back to Home, skip link still first focusable, 320px compact reflow with a 44px target and no page overflow, 1440px containment, and a visible focus indicator under forced colors — asserted structurally, not by colour value.

### Local verification

| Command                  | Result                                         |
| ------------------------ | ---------------------------------------------- |
| `npm run typecheck`      | PASS                                           |
| `npm run lint`           | PASS — 0 errors, 0 warnings                    |
| `npm run lint:styles`    | PASS                                           |
| `npm run format:check`   | PASS                                           |
| `npm run check:comments` | PASS                                           |
| `npm test`               | PASS — **742 tests in 41 files**               |
| `npm run build`          | PASS — 234 modules, brand family processed     |
| `npm run validate:build` | PASS                                           |
| `npm run check:full`     | PASS — includes the bounded dev-bootstrap gate |
| `git diff --check`       | PASS                                           |

Bundle moves from raw 410.20 KB / gzip 123.43 KB to raw **415.49 KB** / gzip **124.67 KB**, which is the cost of the inlined symbol data URIs and the brand styles. The three horizontal logos are emitted to `dist/assets` at 10208, 10208 and 10223 bytes — byte-identical to source.

### E2E and CI status

Local E2E was **not** run: `AGENTS.md` reserves the production-preview lifecycle for CI or a user-owned preview. `npm run dev`, `npm run preview`, `npm run test:e2e`, `playwright test`, `vite`, `vite preview` and `npm run review:m3-browser` were not executed.

**CI failed on the exact M4-02 SHA.**

| Item         | Value                                       |
| ------------ | ------------------------------------------- |
| Commit       | `c234ad8dabb6db78da0ac5dab1b6bb67b6a28ddd`  |
| Workflow run | 31078039148                                 |
| Job          | 92540284189 — `test (24.x)`                 |
| Conclusion   | **failure**                                 |
| Vitest       | 742 passed in 41 files                      |
| Playwright   | 57 total — 50 passed, **5 failed**, 2 flaky |

Every step through `Build` and `Validate build` passed; `E2E tests` failed.

**Five blocking failures, all the same axe rule `region`** — _All page content should be contained by landmarks_ — on the violating node `<div class="brand-slot">`:

- `tests/e2e/bootstrap.spec.ts` › M1 Routing and Navigation › axe scan Home passes
- `tests/e2e/bootstrap.spec.ts` › M1 Routing and Navigation › axe scan 404 passes
- `tests/e2e/bootstrap.spec.ts` › M3 Shared UI integration › reduced motion and forced colors keep the invalid state accessible
- `tests/e2e/route-carriers.spec.ts` › M4-01 route carriers › axe scan of a standard carrier passes
- `tests/e2e/route-carriers.spec.ts` › M4-01 route carriers › axe scan of a legal carrier passes

Each reproduced on the initial attempt and both retries.

Root cause: the transitional brand slot was a plain `div` holding meaningful interactive content, placed outside the route-owned `main` and inside no landmark. The M4-02 constraint that forbade `header`, `nav` or any other landmark for this wrapper was wrong for a root-level placement — content outside `main` still has to belong to a landmark.

**Two flaky tests**, both test-synchronization defects rather than runtime defects:

- `tests/e2e/brand-home-link.spec.ts` › skip link remains the first focusable control — the first `Tab` did not focus the skip link on one attempt because the initial document focus position after `page.goto()` is nondeterministic; the retry passed.
- `tests/e2e/route-carriers.spec.ts` › client navigation to a carrier focuses its heading — the URL assertion resolved before the `requestAnimationFrame` focus callback ran, and an immediate `page.evaluate()` read `document.activeElement` too early; the retry passed.

**M4-02 was not accepted on this SHA, and M4-03 remained blocked.** The correction is [M4-02A](#m4-02a--brand-landmark-accessibility-correction-and-e2e-stabilization).

### Rejected variants

- **Exporting `BrandHomeLink` from `src/shared/ui`** — it is application-shell scaffolding with a GoodCall-specific accessible name, not a design-system primitive.
- **Widening the Shared UI `Link` API to accept `aria-label`** — a public API change to serve one consumer.
- **Rendering monochrome as a plain external `<img>`** — would claim `currentColor` ownership the rendering could not deliver.
- **Inlining SVG paths in React or using `dangerouslySetInnerHTML`** — duplicates approved geometry into code where it can drift from the tracked asset.
- **A free-form `size` or `width` prop** — a consumer could drop below the approved 120px/16px minimums.
- **Building a Header shell around the mount** — M4-04 owns that; a transitional slot must not become a partial Header.
- **Rendering several variant examples on the technical Home route** — a variant gallery is not runtime integration.

### Deviations

One. `tests/e2e/route-carriers.spec.ts` was changed, which earlier stages had kept untouched. The brand link's accessible name `GoodCall — на главную` contains the carrier link name `На главную` as a substring, and Playwright's `getByRole` name option matches substrings by default, so the three existing carrier lookups would have matched two links and failed on strict mode. The lookups now pass `exact: true`. No assertion was weakened and no carrier expectation changed; this is a direct, necessary consequence of introducing a second Home link.

### Risks

- The transitional slot is not a Header. Until M4-04 places it, the logo sits in a plain padded row above route content, which is intentional scaffolding rather than a designed surface.
- Inverse, monochrome and symbol variants are integrated and unit-tested but unplaced. Their contrast obligations — an approved dark surface for inverse, consumer-owned contrast for monochrome — transfer to whichever stage places them.
- Exact clear-space placement remains a Header/Footer layout responsibility. M4-02 avoids cropping, overlap and negative spacing but does not encode the geometric `x` clear-space rule.
- The M3 browser-review harness `scripts/review-m3-browser.mjs` asserts that no image or SVG asset is present, which encoded an M3-era truth. That assertion is now intentionally obsolete. The harness is milestone-review tooling for a closed milestone, is not a CI gate, and was deliberately left unchanged by this stage.

### Next gate

Superseded. CI failed for `c234ad8d…`, so M4-02 alone is not an implementation candidate; the gate moved to [M4-02A](#m4-02a--brand-landmark-accessibility-correction-and-e2e-stabilization).

## M4-02A — Brand landmark accessibility correction and E2E stabilization

**Status: APPROVED AND CLOSED**

Closure evidence: commit `b7be1bdccd03c72ad00bea0cc8653f8f8926e7c4`, GitHub Actions run **31079420627**, job **92544592644**, conclusion **success** — Vitest 746 passed in 41 files, Playwright **57 passed, 0 failed, 0 flaky** (flaky count confirmed from the full job log). All five previously blocking axe `region` scenarios passed, and both previously flaky focus scenarios passed without retry. The independent audit returned **approved**. M4-02 is closed through M4-02A.

### Baseline

| Item                                 | Value                                      |
| ------------------------------------ | ------------------------------------------ |
| Branch                               | `main`                                     |
| Baseline SHA                         | `c234ad8dabb6db78da0ac5dab1b6bb67b6a28ddd` |
| Baseline commit                      | `feat(shell): integrate runtime brand`     |
| `git rev-parse HEAD` / `origin/main` | both matched the baseline before changes   |
| `git diff` / `git diff --cached`     | exit 0 — clean                             |

### Landmark correction

The transitional brand slot changed from a plain `div` to a semantic `header`:

```
<header className={styles['brand-slot']}>
  <BrandHomeLink />
</header>
```

That `header` is a child of the shell root and of no other landmark, so it is the page-level **banner**. It needs no explicit `role` and carries no `aria-label`. It stays after the skip link and live-region infrastructure and before `ScrollRestoration` and the route outlet, so the skip link remains the first focusable control and the brand link the second. All global brand content is now contained by a landmark, which is exactly what axe `region` requires.

`Shell.module.scss` is unchanged: `header` carries no default margin or display behaviour that would need normalising, and the build output is byte-for-byte the same size as M4-02.

**This is not the canonical Header stage.** No Catalog control, Search, Compare, Favorites, Cart, Account, city selector, Information Bar, responsive composition, sticky behaviour, navigation landmark, toolbar semantics or duplicate brand link was added. M4-04 still owns the canonical Header and will replace this transitional banner.

### E2E stabilization

Both fixes are test-side only. No runtime tab order, focus lifecycle, `requestAnimationFrame` timing, Playwright configuration, retry count or timeout was changed, and no sleep was introduced.

- **Skip-link focus order.** The test now establishes a deterministic focus origin before traversal: it blurs any active element, focuses `document.body`, and asserts the reset element is neither the skip link nor the brand link. Only then does it press `Tab` twice, asserting the skip link and then the brand link. It still proves real keyboard traversal — the skip link is never focused directly as the test action.
- **Route-heading focus.** The immediate `page.evaluate()` read is replaced with Playwright's auto-waiting `await expect(heading).toBeFocused()`, which retries until the `requestAnimationFrame` callback has run. The assertion still proves the actual runtime focus lifecycle through a real client-side link click.

### Axe coverage

None of the five blocking assertions was modified. No rule was disabled, no selector excluded, no violation filtered, no expected count reduced and no retry removed. The corrected DOM is expected to pass the existing scans unchanged.

### Files changed

| File                                                  | Change                                                       |
| ----------------------------------------------------- | ------------------------------------------------------------ |
| `src/app/shell/RootLayout.tsx`                        | transitional brand slot `div` → `header` (banner landmark)   |
| `tests/app/shell/brand-runtime-mount.test.tsx`        | banner-landmark coverage replacing the no-landmark assertion |
| `tests/e2e/brand-home-link.spec.ts`                   | deterministic focus origin before keyboard traversal         |
| `tests/e2e/route-carriers.spec.ts`                    | auto-waiting focus assertion                                 |
| `docs/05-implementation/m4-canonical-shell-report.md` | M4-02 failure evidence; this section                         |
| `docs/05-implementation/repository-state.md`          | current-state note reconciled                                |

### Preserved brand contract

Unchanged by this correction: the `BrandHomeLink` public API, the asset selection matrix, primary/inverse/monochrome behaviour, the CSS mask strategy, the accessible name `GoodCall — на главную`, the Home destination `/`, imported asset URLs, all six SVG byte lengths and SHA-256 values, the manifest `runtime-integrated` statuses, the minimum-size contracts and the focus styling. `src/app/shell/brand/**`, `src/assets/brand/**`, `src/shared/**`, `package.json`, `package-lock.json`, `playwright.config.ts` and `.github/**` show an empty diff.

### Integration coverage

Runtime-mount tests now assert, on Home and a carrier route: exactly one banner, rendered as `header` with no `role` and no `aria-label`; the banner contains exactly one brand Home link; the banner sits outside `main` and is not nested in another `header`; no navigation landmark exists; no extra live region exists — the single route announcement remains the only one; one `main`; one `h1`; the skip link still precedes the brand link in DOM and focus order; and route titles and headings are preserved.

### Local verification

| Command                  | Result                                         |
| ------------------------ | ---------------------------------------------- |
| `npm run typecheck`      | PASS                                           |
| `npm run lint`           | PASS — 0 errors, 0 warnings                    |
| `npm run lint:styles`    | PASS                                           |
| `npm run format:check`   | PASS                                           |
| `npm run check:comments` | PASS                                           |
| `npm test`               | PASS — **746 tests in 41 files**               |
| `npm run build`          | PASS — 234 modules                             |
| `npm run validate:build` | PASS                                           |
| `npm run check:full`     | PASS — includes the bounded dev-bootstrap gate |
| `git diff --check`       | PASS                                           |

Bundle is **unchanged** at raw 415.49 KB / gzip 124.67 KB, confirming the correction is semantic rather than stylistic.

Local E2E was **not** run, per `AGENTS.md`. The axe and focus fixes cannot be claimed from serverless tests alone; only exact-SHA CI can confirm them. CI was pending at commit time; the outcome is recorded in the untracked stage handoff.

### Rejected variants

- **Suppressing or excluding the axe `region` rule, or excluding `.brand-slot`** — hides a real accessibility defect instead of fixing it.
- **Moving the brand link inside route-owned `main`** — would put global shell content in the route's landmark and break single-`main` ownership.
- **Adding `role="banner"` to the `div`** — a semantic `header` at root level already exposes the banner role; an explicit role would be redundant.
- **Giving the banner an `aria-label`** — nothing to disambiguate with a single banner, and it would encode Header content policy this stage does not own.
- **Implementing the canonical Header now** — M4-04 owns it; a landmark fix must not become a shell stage.
- **`skipLink.focus()` in the flaky test** — would delete the very keyboard-traversal evidence the test exists to provide.
- **An arbitrary sleep or a raised timeout for the focus race** — masks the race instead of synchronising on the real condition.
- **Changing `RootLayout` focus timing or removing `requestAnimationFrame`** — the runtime lifecycle was correct; only the tests were unsynchronised.

### Deviations

None. The diff is limited to the expected minimal set, `Shell.module.scss` needed no change, and the brand component, asset contract and manifest were left untouched.

### Risks

- The banner is transitional. Until M4-04, the page exposes a banner landmark containing only a logo, which is valid but not a designed Header.
- The two E2E stabilisations are verified locally only by reasoning about the failure mode; their real proof is a green CI run with zero flaky results.
- The remaining M4-02 risks still stand: unplaced inverse/monochrome/symbol variants carry their contrast obligations forward, clear-space placement belongs to Header/Footer stages, and `scripts/review-m3-browser.mjs` still asserts no image asset is present, an M3-era truth now intentionally obsolete.

### Next gate

Closed. CI passed for `b7be1bdc…` with zero failed and zero flaky tests, and the independent audit approved it, which unblocked M4-03.

## M4-03 — Information Bar

**Status at commit time: IMPLEMENTED — AWAITING INDEPENDENT AUDIT, CI AND USER VISUAL CONFIRMATION**

### Baseline

| Item                                 | Value                                      |
| ------------------------------------ | ------------------------------------------ |
| Branch                               | `main`                                     |
| Baseline SHA                         | `b7be1bdccd03c72ad00bea0cc8653f8f8926e7c4` |
| Baseline commit                      | `fix(shell): contain brand link in banner` |
| `git rev-parse HEAD` / `origin/main` | both matched the baseline before changes   |
| `git diff` / `git diff --cached`     | exit 0 — clean                             |

### Visual evidence

| Item       | Value                                                               |
| ---------- | ------------------------------------------------------------------- |
| Design ID  | RTE-001 — Home                                                      |
| Local path | `artifacts/m4-03/references/RTE-001.png` (untracked, not committed) |
| Dimensions | 1920 × 3840                                                         |
| Format     | PNG, 8-bit, colour type 6 (RGBA)                                    |
| Bytes      | 5 438 232                                                           |
| SHA-256    | `cb943e0b5b525645ede341c53fb6bff7eca714a69b62c042db23d62feb7bdd64`  |

The top strip was cropped at full resolution and inspected. It shows a persistent thin neutral service strip above the primary Header, with the city at the far left, utility items distributed across the width, muted compact type, and a subtle divider separating it from the Header below. It was used for hierarchy, density, spacing and proportion only.

**Recorded discrepancy.** The raster's middle items are promotional claims — free delivery above a threshold, official warranty, loyalty programme — rather than the canonical service destinations. Those claims are not approved canonical fixtures, so the implementation follows the canonical contract (five navigational service links) and not the raster's copy. The raster also carries a small location-pin glyph next to the city; no approved shell icon source exists, so M4-03 is text-only.

### Canonical content and routes

City context is display-only: visible text `Москва`, with the programmatic context `Текущий город: Москва` supplied by a visually hidden prefix so the accessible name is not duplicated. The city is a `<p>` — not a button, link, combobox or inert pseudo-control.

| Order | Visible label        | Route key                        | Resolved path           |
| ----- | -------------------- | -------------------------------- | ----------------------- |
| 1     | Доставка и оплата    | `information.deliveryAndPayment` | `/delivery-and-payment` |
| 2     | Гарантия и возврат   | `help.warrantyReturns`           | `/warranty-and-returns` |
| 3     | Программа лояльности | `loyalty.program`                | `/loyalty`              |
| 4     | Помощь               | `help.faq`                       | `/help`                 |
| 5     | Контакты             | `company.contacts`               | `/contacts`             |

Destinations are resolved at module load through `getRouteMetadata()` from the existing route registry. The resolver rejects an unregistered key, the catch-all, any dynamic path, any non-app-relative path, any repository literal and any duplicate destination. No path literal appears in the configuration, so there is no second route registry and no destination is built by string concatenation.

### Component ownership and public boundary

`src/app/shell/information-bar/` publishes `InformationBar` through `@/app/shell/information-bar`. It is application-shell owned — not Shared UI, not route-domain — and the service-link array is not exported as a general Shared UI API. `PageContainer` and `VisuallyHidden` are consumed through the existing Shared UI barrel; no Shared UI API was changed.

### Responsive disclosure strategy

One DOM instance of each link serves both ranges. There is no duplicated compact/desktop list, no `matchMedia`, no resize listener, no `window.innerWidth` read and no new breakpoint.

- Below **64rem**: the panel is `display: none` unless `data-expanded="true"`, so closed links are neither visible nor tabbable; the disclosure button is visible.
- At **64rem and above**: CSS displays the same panel regardless of component state and hides the disclosure button.

State lives in a component-local `useState`, exposed to CSS through a `data-expanded` attribute rather than the `hidden` attribute, precisely so the wide range can reveal the same panel without JavaScript viewport logic.

### Landmark and disclosure semantics

- Exactly one navigation landmark, `PageContainer as="nav"` with `aria-label="Сервисная навигация"`. All Information Bar content — including the city — lives inside it, which avoids recreating the axe `region` defect corrected in M4-02A.
- The disclosure is a native `<button type="button">` labelled `Информация и помощь`, closed initially, carrying `aria-expanded` and `aria-controls` pointing at one stable `useId()` panel ID.
- Enter and Space work through native button behaviour. Opening and closing leave focus on the button. There is no focus trap, no click-outside requirement, no hover-only access, no ARIA menu semantics, no dialog and no popover.
- Current-route indication uses React Router `NavLink`, which sets `aria-current="page"` on the active destination. The treatment is not colour-only: the current link also gains an underline and a heavier weight, and the link text is unchanged.
- No live region was added; the single route announcement remains the only one.
- The bar is not sticky and not fixed.

### Root composition

`RootLayout` order is: skip link → route-announcement region → delayed pending-announcement region → **Information Bar** → transitional brand banner → `ScrollRestoration` → route outlet.

The skip link remains the first focusable control, Information Bar controls precede the brand Home link in keyboard order, and exactly one banner, one `main#main-content` and one canonical `h1` remain. `BrandHomeLink` was not moved and the transitional banner was not converted into the canonical Header. Title, focus, scroll and announcement ownership are unchanged.

### Visual character

A full-width neutral strip on `--gc-disabled-surface` with a `--gc-border-subtle` bottom divider, inner content constrained by the existing `PageContainer`, 0.875rem muted type, city first, links reading as utility navigation. No promotional weight, no dark permanent city bar, no elevated card, no shadow, no gradient, no sticky treatment. Only existing semantic tokens are used; no global shell token was extracted.

**Accessibility over raster density.** The 44px target contract makes the bar taller than the raster's strip. The visual thinness is preserved through small type and minimal padding, but the target contract wins where the two conflict.

### Files changed

| File                                                       | Change                                                      |
| ---------------------------------------------------------- | ----------------------------------------------------------- |
| `src/app/shell/information-bar/information-bar-items.ts`   | new — typed registry-resolved service-link configuration    |
| `src/app/shell/information-bar/InformationBar.tsx`         | new — landmark, city context, disclosure, service links     |
| `src/app/shell/information-bar/InformationBar.module.scss` | new — neutral strip, responsive disclosure, focus, current  |
| `src/app/shell/information-bar/index.ts`                   | new — `@/app/shell/information-bar` boundary                |
| `src/app/shell/RootLayout.tsx`                             | mount before the transitional banner                        |
| `tests/app/shell/information-bar-items.test.ts`            | new — configuration contract                                |
| `tests/app/shell/information-bar.test.tsx`                 | new — component semantics and disclosure behaviour          |
| `tests/app/shell/information-bar-runtime-mount.test.tsx`   | new — real route-tree integration                           |
| `tests/app/shell/brand-runtime-mount.test.tsx`             | two M4-02A assertions rescoped for the new landmark         |
| `tests/e2e/information-bar.spec.ts`                        | new — production-preview responsive, keyboard, axe evidence |
| `docs/05-implementation/m4-canonical-shell-report.md`      | M4-02A closure; this section                                |
| `docs/05-implementation/repository-state.md`               | current-state note                                          |

`Shell.module.scss` needed no change. No route, Shared UI, brand, asset, manifest, dependency, tooling or workflow change.

### Tests

Configuration coverage asserts five descriptors in canonical order with exact labels and route keys, registry-resolved paths, no dynamic or catch-all destination, no repository literal or browser-root URL, unique keys and destinations, no second registry and no concatenated path.

Component coverage asserts the landmark name and containment, visible city text, the `Текущий город: Москва` programmatic context without duplication, city non-interactivity, native button semantics, closed initial state, `aria-expanded`/`aria-controls`, pointer and Enter and Space activation, focus remaining on the button, five links rendered once in canonical order with exact destinations, `aria-current="page"` on the current service route, a non-colour-only current treatment, no current link on unrelated or non-service routes, and no live region or ARIA menu semantics.

Root integration coverage runs against `createApplicationRoutes()` on Home and a service carrier: one service navigation, one banner, one brand link, one `main`, one `h1`, Information Bar before the banner in DOM order, skip link before Information Bar focusables, brand link after them, unchanged titles, service navigation reaching the carrier with heading focus through the M1 lifecycle, and no duplicate announcement owner.

E2E covers compact 320px closed state, the compact keyboard sequence, the opened compact panel with 44px targets, the four disclosure-mode widths (767, 768, 769, 1023) and four inline widths (1024, 1025, 1280, 1440), expanded city-first ordering and separation from the banner, base-safe navigation with hard refresh, a second destination through the disclosure, a coarse-pointer tap path using per-test context options, axe in wide/closed/open/current-route states, and forced-colors focus and current-state perceivability.

### Local verification

| Command                  | Result                                         |
| ------------------------ | ---------------------------------------------- |
| `npm run typecheck`      | PASS                                           |
| `npm run lint`           | PASS — 0 errors, 0 warnings                    |
| `npm run lint:styles`    | PASS                                           |
| `npm run format:check`   | PASS                                           |
| `npm run check:comments` | PASS                                           |
| `npm test`               | PASS — **791 tests in 44 files**               |
| `npm run build`          | PASS — 238 modules                             |
| `npm run validate:build` | PASS                                           |
| `npm run check:full`     | PASS — includes the bounded dev-bootstrap gate |
| `git diff --check`       | PASS                                           |

Bundle moves from raw 415.49 KB / gzip 124.67 KB to raw **419.75 KB** / gzip **125.66 KB**.

Intentionally not run: `npm run dev`, `npm run preview`, `npm run test:e2e`, `playwright test`, `vite`, `vite preview`, `npm run review:m3-browser`, and any background or fixed-port server.

### Exact-SHA CI — failed

| Item         | Value                                        |
| ------------ | -------------------------------------------- |
| Commit       | `71a0addfb8e461affd91d788fde493fce5acb765`   |
| Workflow run | 31083387582                                  |
| Job          | 92557147682 — `test (24.x)`                  |
| Conclusion   | **failure**                                  |
| Vitest       | 791 passed in 44 files                       |
| Playwright   | 77 total — 65 passed, **12 failed**, 0 flaky |

Every step through `Build` and `Validate build` passed; `E2E tests` failed. All twelve failures reproduced on the initial attempt and both retries, so none was flaky. The failure artifact `playwright-report` (id 8960564053, 1 633 460 bytes) was uploaded.

Three failure classes, all in test code rather than in the shipped Information Bar:

1. **Obsolete brand focus-order expectation** — `tests/e2e/brand-home-link.spec.ts` still asserted `skip link → BrandHomeLink`. M4-03 deliberately inserted the Information Bar disclosure between them, so the correct compact closed order is `skip link → Информация и помощь → GoodCall — на главную`. The runtime order was right; the expectation was stale.
2. **Ten invalid exact city locators** — `serviceNav(page).getByText('Москва', { exact: true })` resolved to zero elements. The city paragraph intentionally renders a visually hidden prefix plus the visible city, so its full text content is `Текущий город: Москва` and no element in that subtree matches `Москва` exactly. Affected: the compact 320px scenario, 767, 768, 769, 1023, 1024, 1025, 1280 and 1440 px scenarios, and the expanded geometry scenario.
3. **Unstable forced-colors focus origin** — the test clicked the disclosure, then blurred and focused `document.body`, then assumed two `Tab` presses would restart sequential navigation from the document start. Chromium may retain the sequential focus-navigation starting point from the activated button, so the traversal did not deterministically return to it.

**M4-03 was not accepted on that SHA**, user visual confirmation was not performed, and M4-04 remained blocked.

### Independent-audit findings on M4-03

- `NavLink` lacked `end`, so a longer pathname such as `/help/unknown` could mark `/help` current even though the catch-all renders it.
- The public barrel exported four internal constants and `ServiceLinkDescriptor` alongside `InformationBar`, wider than any consumer needed.
- `artifacts/` was untracked but not excluded, so the RTE-001 screenshot was one careless `git add .` away from being committed.

All three are corrected in [M4-03A](#m4-03a--information-bar-e2e-correction-and-exact-active-state-reconciliation).

### Rejected variants

- **Reproducing the raster's promotional claims** — free-delivery and warranty claims are not approved canonical fixtures.
- **A city selector, geolocation, persistence or confirmation banner** — explicitly out of scope; the city is display context only in M4-03.
- **Duplicated compact and desktop link lists** — two DOM copies of the same destinations, and a second thing to keep in canonical order.
- **`matchMedia` or a resize listener driving layout state** — JavaScript viewport detection where CSS ranges already express the contract.
- **The `hidden` attribute on the link panel** — would block the wide range from revealing the same panel without JavaScript viewport logic.
- **ARIA menu, dialog or popover semantics** — a disclosure is the correct pattern for a list of links.
- **Extracting a Shared UI disclosure primitive** — premature for one application-shell consumer.
- **Widening the Shared UI `Link` API for `aria-current`** — a local `NavLink` inside the shell boundary already provides it.
- **Adding a location-pin icon** — no approved shell icon source exists in the repository.
- **A sticky or dark permanent city bar** — contradicts the neutral subordinate strip and the obsolete RTE-003 direction.

### Deviations

One. `tests/app/shell/brand-runtime-mount.test.tsx` is outside the expected file list. Two M4-02A assertions encoded the pre-M4-03 shell exactly: the brand link was asserted to be focusable index `1`, and the document was asserted to contain zero navigation landmarks. M4-03 deliberately inserts a named navigation landmark and its controls between the skip link and the brand link, so both assertions became false by design. They were rescoped rather than weakened — the brand link must still follow the skip link in DOM and focus order, and the **banner** must still contain no navigation landmark and no live region.

### Risks

- User visual confirmation against RTE-001 is outstanding; the strip's proportion relative to the future Header cannot be finally judged until M4-04 exists.
- The 44px target contract makes the bar taller than the raster strip. If the visual review rejects the density, the resolution is a design decision about target size, not a silent reduction below the contract.
- The bar is text-only. If an approved shell icon source appears later, the city may gain its pin glyph.
- Wide-range links are right-aligned after the city, matching the raster's distribution loosely rather than exactly; exact horizontal distribution belongs with the Header composition in M4-04.
- `scripts/review-m3-browser.mjs` still asserts no image asset and a specific tab order; it is milestone-review tooling for a closed milestone, is not a CI gate, and was deliberately left unchanged.

### Next gate

Superseded. CI failed for `71a0addf…`, so M4-03 alone is not an implementation candidate; the gate moved to [M4-03A](#m4-03a--information-bar-e2e-correction-and-exact-active-state-reconciliation).

## M4-03A — Information Bar E2E correction and exact active-state reconciliation

**Status: APPROVED AND CLOSED**

Closure evidence: M4-03 commit `71a0addfb8e461affd91d788fde493fce5acb765`, corrected by M4-03A commit `54d9eb954fda1b582db49c1d3df217d8ea6723ca`. GitHub Actions run **31085424042**, job **92563626221**, conclusion **success** — Vitest 803 passed in 44 files, Playwright **78 passed, 0 failed, 0 flaky**. All twelve previous M4-03 failures passed and the exact active-route regressions passed. The independent technical audit returned **approved**, and the user confirmed the visual result for the wide inline, compact closed and compact open states. M4-03 is closed through M4-03A.

### Baseline

| Item                                 | Value                                      |
| ------------------------------------ | ------------------------------------------ |
| Branch                               | `main`                                     |
| Baseline SHA                         | `71a0addfb8e461affd91d788fde493fce5acb765` |
| Baseline commit                      | `feat(shell): add information bar`         |
| `git rev-parse HEAD` / `origin/main` | both matched the baseline before changes   |
| `git diff` / `git diff --cached`     | exit 0 — clean                             |

RTE-001 re-verified before any change: 1920 × 3840, 5 438 232 bytes, SHA-256 `cb943e0b5b525645ede341c53fb6bff7eca714a69b62c042db23d62feb7bdd64` — all three match the recorded evidence exactly.

### Corrective scope

No Information Bar redesign. The application-owned location, the single named service navigation, static `Москва`, the visually hidden `Текущий город: ` prefix, five canonical registry-resolved links, the local controlled disclosure, one DOM copy per link, the CSS-only 64rem transformation, the 44px target contract, non-sticky behaviour, root composition and all styling are unchanged. **No CSS, RootLayout, route, Shared UI, dependency, asset, tooling or workflow change.**

### Exact active-state contract

Each service `NavLink` now carries `end`, so only the exact pathname is current. No custom pathname matcher was introduced and no route was added for the longer path — `/help/unknown` legitimately renders through the catch-all.

| Location           | Current service link |
| ------------------ | -------------------- |
| `/help`            | Помощь               |
| `/help?source=bar` | Помощь               |
| `/help#section`    | Помощь               |
| `/help/unknown`    | none                 |
| `/cart`            | none                 |

Each of the five destinations is additionally proven current on its own exact path and nowhere else.

### City locator correction

The runtime markup was **not** changed — the visually hidden prefix stays, because it is the accessibility contract. The ten invalid `getByText('Москва', { exact: true })` assertions are replaced by one helper that locates the unique city paragraph inside the service navigation and asserts count, visibility and full text `Текущий город: Москва`. It relies on neither CSS-module class names nor a `data-testid`, and no runtime test hook was added. The expanded geometry scenario now takes its bounding box from the same asserted paragraph.

A serverless contract test pins the assumption the helper depends on: exactly one `<p>` inside the landmark, with text content `Текущий город: Москва`.

### Keyboard and focus reconciliation

- **Brand focus order** — the M4-02 test now sets an explicit compact viewport, asserts the disclosure is present and closed, establishes a neutral focus origin, and proves `skip link → Информация и помощь → GoodCall — на главную` through real `Tab` presses. It was renamed to drop the obsolete implication that the brand link is always second. No control is focused directly and no assertion was removed.
- **Forced colors** — the test no longer clicks the disclosure before resetting focus. It establishes a neutral origin first, then reaches the disclosure by `Tab`, opens it with `Enter`, asserts focus is retained and `aria-expanded="true"`, inspects the forced-colors indicator, and continues tabbing to `Помощь` — the fourth service link — where it asserts focus, `aria-current="page"` and a non-colour-only treatment. No `.focus()` simulates the sequence, no sleep, no timeout or retry change.

### Public boundary

`src/app/shell/information-bar/index.ts` exports only `InformationBar`. The content constants, `serviceLinks`, `ServiceLinkDescriptor` and the internal resolver are no longer re-exported; the configuration file did not move. Tests that need the constants import the internal module directly, which is contract testing rather than a public dependency. A test asserts the barrel's export list is exactly `['InformationBar']`.

### Visual evidence exclusion

`artifacts/` was added to `.git/info/exclude` — the local, untracked exclude file. The tracked `.gitignore` was **not** modified. `git check-ignore -v artifacts/m4-03/references/RTE-001.png` now reports `.git/info/exclude:9`, and `git status --short` no longer lists `?? artifacts/`. The screenshot remains local and uncommitted.

### Files changed

| File                                                     | Change                                                                     |
| -------------------------------------------------------- | -------------------------------------------------------------------------- |
| `src/app/shell/information-bar/InformationBar.tsx`       | `end` added to each service `NavLink`                                      |
| `src/app/shell/information-bar/index.ts`                 | barrel narrowed to `InformationBar` only                                   |
| `tests/app/shell/information-bar.test.tsx`               | exact active-state cases, city paragraph contract, barrel export assertion |
| `tests/app/shell/information-bar-runtime-mount.test.tsx` | import updated for the narrowed barrel                                     |
| `tests/e2e/information-bar.spec.ts`                      | city helper, forced-colors keyboard sequence, exact-pathname scenario      |
| `tests/e2e/brand-home-link.spec.ts`                      | focus-order test reconciled with the current shell order                   |
| `docs/05-implementation/m4-canonical-shell-report.md`    | M4-03 failure evidence and audit findings; this section                    |
| `docs/05-implementation/repository-state.md`             | current-state note reconciled                                              |

Local, uncommitted: `.git/info/exclude` gained `artifacts/`.

### Local verification

| Command                  | Result                                         |
| ------------------------ | ---------------------------------------------- |
| `npm run typecheck`      | PASS                                           |
| `npm run lint`           | PASS — 0 errors, 0 warnings                    |
| `npm run lint:styles`    | PASS                                           |
| `npm run format:check`   | PASS                                           |
| `npm run check:comments` | PASS                                           |
| `npm test`               | PASS — **803 tests in 44 files**               |
| `npm run build`          | PASS — 238 modules                             |
| `npm run validate:build` | PASS                                           |
| `npm run check:full`     | PASS — includes the bounded dev-bootstrap gate |
| `git diff --check`       | PASS                                           |

Bundle essentially unchanged at raw **419.76 KB** / gzip **125.66 KB**, confirming the correction is behavioural and test-side rather than visual.

Intentionally not run: `npm run dev`, `npm run preview`, `npm run test:e2e`, `playwright test`, `vite`, `vite preview`, `npm run review:m3-browser`, and any background or fixed-port server. CI was pending at commit time, and user visual confirmation against RTE-001 remains pending.

### Deviations

None beyond the expected file set. `tests/app/shell/information-bar-runtime-mount.test.tsx` is explicitly permitted by the stage and was changed only to follow the narrowed barrel.

### Risks

- Twelve corrected E2E scenarios are verified by reasoning about the failure mode, not by local execution; repository policy forbids running Playwright locally, so only exact-SHA CI can confirm them.
- The forced-colors traversal now depends on the canonical link order — `Помощь` being the fourth service link. If the canonical order ever changes, that test must change with it; it derives the index from the shared link table rather than hard-coding it, which limits but does not eliminate the coupling.
- User visual confirmation against RTE-001 is still outstanding, so density and proportion remain unvalidated.
- `scripts/review-m3-browser.mjs` still asserts no image asset and a specific tab order, both obsolete since M4-02 and M4-03. It is milestone-review tooling for a closed milestone, is not a CI gate, and was deliberately left unchanged.

### Next gate

Closed. CI passed for `54d9eb95…` with zero failed and zero flaky tests, the independent audit approved it and the user confirmed the visual result, which unblocked M4-04.

## M4-04 — Primary Header core: Catalog entry and Global Search

**Status at commit time: IMPLEMENTED — AWAITING INDEPENDENT AUDIT, CI AND USER VISUAL CONFIRMATION**

**Terminal status: NOT ACCEPTED — exact-SHA CI failed. Corrected by M4-04A.**

### Baseline

| Item                                 | Value                                            |
| ------------------------------------ | ------------------------------------------------ |
| Branch                               | `main`                                           |
| Baseline SHA                         | `54d9eb954fda1b582db49c1d3df217d8ea6723ca`       |
| Baseline commit                      | `fix(shell): reconcile information bar behavior` |
| `git rev-parse HEAD` / `origin/main` | both matched the baseline before changes         |
| `git diff` / `git diff --cached`     | exit 0 — clean                                   |

### Visual evidence

| Source  | Path                                     | Dimensions  | Bytes     | SHA-256                                                            |
| ------- | ---------------------------------------- | ----------- | --------- | ------------------------------------------------------------------ |
| RTE-001 | `artifacts/m4-03/references/RTE-001.png` | 1920 × 3840 | 5 438 232 | `cb943e0b5b525645ede341c53fb6bff7eca714a69b62c042db23d62feb7bdd64` |
| CMP-001 | `artifacts/m4-04/references/CMP-001.png` | 1920 × 3412 | 4 354 263 | `127c41f4604135c8e6a89ae6614d5702a3b55a69bfb26ebfea4e4c15a5dfe772` |

RTE-001 was re-verified against its recorded evidence; all three values match. Both sources remain local, ignored through `.git/info/exclude` and uncommitted.

**CMP-001 inspection method.** A 1:3 downscaled overview located section **01 “Header & Navigation”** at the top of the sheet. That region was then cropped losslessly at native resolution — `x=0, y=140, w=1920, h=440`, no scaling — and inspected. It contains four labelled reference rows: `Информационная панель`, `Основной хедер`, `Навигация по категориям` and `Хлебные крошки`.

The `Основной хедер` row is the relevant evidence: a white rounded surface carrying, left to right, the GoodCall horizontal lockup, a solid violet Catalog control, a bordered Search field that takes the dominant width, then a divider and four icon actions with counters. That confirms the canonical order and the relative salience of Catalog versus Search.

**Recorded discrepancies**, all resolved in favour of the canonical contract:

- the sheet labels the Catalog control `Каталог товаров`; the canonical contract specifies exactly `Каталог`;
- the sheet's Search uses placeholder-only labelling with a magnifier glyph; the contract requires a persistently visible label and a text submit, and M4-04 forbids icons;
- the sheet renders the Information Bar as a violet strip; the implemented Information Bar is the approved neutral strip from RTE-001, already closed and user-confirmed in M4-03A;
- the sheet's four Header actions with counters are M4-05 scope and are not implemented here.

### Catalog bounded decision

The Catalog control is a normal Router navigation link, not a surface. There is no mega-menu, drawer, disclosure or taxonomy, and no `/catalog` root route — `/catalog` still reaches the global catch-all.

| Property            | Value                                               |
| ------------------- | --------------------------------------------------- |
| Visible label       | `Каталог`                                           |
| Route key           | `catalog.category`                                  |
| Registry path       | `/catalog/:categorySlug`                            |
| Representative slug | `laptops`, validated through `categorySlugSchema`   |
| Destination         | `/catalog/laptops`, built with `generatePath`       |
| Current state       | `aria-current="page"` on the exact destination only |

`end` on the `NavLink` keeps `/catalog/phones` and `/catalog/laptops/extra` from inheriting the current state.

### Search contract

A Header-owned form, not a Shared UI primitive. It reuses `TextField` and `Button` unchanged — both already satisfy the 44px target contract, and `TextField` already provides a visible label, `aria-describedby` error association, `aria-invalid` and a 2px invalid border, so no Shared UI API was widened.

- `role="search"` with `aria-label="Поиск по каталогу"`; visible label `Поиск по каталогу`; `type="search"`; `name="q"`; submit `Найти`.
- Submit trims leading and trailing whitespace and preserves internal spacing and characters, then navigates with `URLSearchParams` encoding to `/search?q=…` through Router history under the existing basename. No `window.location`, no literal `/GoodCall/`.
- Empty or whitespace-only input does not navigate: it shows exactly `Введите поисковый запрос.`, associates it with the field, sets `aria-invalid="true"` and focuses the field. Editing clears the error.
- The field synchronises from the URL on the Search route only — direct entry, query-only navigation and POP all reflect the current `q`; a missing `q` resolves to empty. No history list, no persistence, no store, no suggestions, no results.

### Component boundary

`src/app/shell/site-header/` publishes only `SiteHeader` through `@/app/shell/site-header`. Labels, route paths, query helpers, the representative slug, `GlobalSearchForm` and the configuration types stay internal. `BrandHomeLink` is consumed through `@/app/shell/brand` — brand markup is not recreated and no SVG is imported directly.

### Landmarks and accessibility

One page-level banner; one primary navigation `Основная навигация`; one search landmark `Поиск по каталогу`; the Information Bar keeps its separate `Сервисная навигация`. The brand link keeps its `GoodCall — на главную` name and sits outside any navigation landmark. No live region was added and route title, focus, scroll and announcement ownership are unchanged.

Focus order — compact: skip link → Information Bar disclosure → brand → Catalog → Search field → Search submit. Wide: skip link → five service links → brand → Catalog → Search field → Search submit.

### Responsive composition

Mobile-first SCSS Modules over the approved ranges; no new breakpoint, no JavaScript viewport detection, no duplicated markup, no CSS reordering.

- **Compact (< 48rem):** identity row holds brand and Catalog; the Search form takes a full-width second row via `flex: 1 1 100%`.
- **Medium and above (≥ 48rem):** the identity block stops growing and the Search slot takes the remaining width, composing one row.
- **Wide and expanded:** the same one-row core, with Search absorbing the extra space rather than adding ornamental whitespace.

The Header is not sticky and has no fixed height.

### Root composition

`RootLayout` order is skip link → route announcement → pending announcement → Information Bar → `SiteHeader` → `ScrollRestoration` → outlet. The transitional `brand-slot` wrapper and its `Shell.module.scss` rule were removed.

### Files changed

| File                                                     | Change                                                      |
| -------------------------------------------------------- | ----------------------------------------------------------- |
| `src/app/shell/site-header/header-core-config.ts`        | new — registry-derived destinations, labels, query helpers  |
| `src/app/shell/site-header/GlobalSearchForm.tsx`         | new — named search form with validation and URL sync        |
| `src/app/shell/site-header/GlobalSearchForm.module.scss` | new — search composition                                    |
| `src/app/shell/site-header/SiteHeader.tsx`               | new — banner, brand, primary nav, Catalog, Search           |
| `src/app/shell/site-header/SiteHeader.module.scss`       | new — Header surface and responsive composition             |
| `src/app/shell/site-header/index.ts`                     | new — `@/app/shell/site-header` boundary                    |
| `src/app/shell/RootLayout.tsx`                           | transitional banner replaced by `SiteHeader`                |
| `src/app/shell/Shell.module.scss`                        | obsolete `brand-slot` rule removed                          |
| `tests/app/shell/header-core-config.test.ts`             | new — configuration and public-barrel contract              |
| `tests/app/shell/global-search-form.test.tsx`            | new — search semantics, sync, submit, validation            |
| `tests/app/shell/site-header.test.tsx`                   | new — landmarks, Catalog, canonical order, deferred actions |
| `tests/app/shell/site-header-runtime-mount.test.tsx`     | new — real route-tree integration                           |
| `tests/app/shell/brand-runtime-mount.test.tsx`           | one M4-02A assertion rescoped for the Header navigation     |
| `tests/e2e/site-header.spec.ts`                          | new — responsive, keyboard, Catalog, Search, axe evidence   |
| `docs/05-implementation/m4-canonical-shell-report.md`    | M4-03A closure; this section                                |
| `docs/05-implementation/repository-state.md`             | current-state note                                          |

No route, registry, carrier, loader, Shared UI, Foundations, asset, dependency, lockfile, Playwright config or workflow change.

### Local verification

| Command                  | Result                                         |
| ------------------------ | ---------------------------------------------- |
| `npm run typecheck`      | PASS                                           |
| `npm run lint`           | PASS — 0 errors, 0 warnings                    |
| `npm run lint:styles`    | PASS                                           |
| `npm run format:check`   | PASS                                           |
| `npm run check:comments` | PASS                                           |
| `npm test`               | PASS — **869 tests in 48 files**               |
| `npm run build`          | PASS — 244 modules                             |
| `npm run validate:build` | PASS                                           |
| `npm run check:full`     | PASS — includes the bounded dev-bootstrap gate |
| `git diff --check`       | PASS                                           |

Bundle moves from raw 419.76 KB / gzip 125.66 KB to raw **424.50 KB** / gzip **126.86 KB**.

Intentionally not run: `npm run dev`, `npm run preview`, `npm run test:e2e`, `playwright test`, `vite`, `vite preview`, `npm run review:m3-browser`, background or fixed-port servers, and user browser automation. CI was pending at commit time and user visual confirmation remains pending.

### Rejected variants

- **A Catalog button with `aria-haspopup`** — it opens nothing in M4-04; a fake disclosure would misstate the affordance.
- **Registering `/catalog`** — explicitly prohibited; the catch-all behaviour is covered by existing tests.
- **Hardcoding `/catalog/laptops`** — `generatePath` over the registry path keeps one source of truth.
- **Placeholder-only Search labelling as in CMP-001** — the contract requires a persistently visible label.
- **Icon-only Search submit** — no approved shell icon source exists; icons are an M4-05 prerequisite.
- **Extending `TextField` with an adornment API** — a Shared UI change to serve one shell consumer.
- **A Shared UI search primitive** — the Search form is shell-specific, not a design-system pattern.
- **Empty action placeholders for M4-05** — hidden or nameless controls in the focus order.
- **A sticky Header** — outside the M4-04 boundary.
- **`matchMedia` for the compact two-row switch** — CSS ranges already express it.

### Deviations

One. `tests/app/shell/brand-runtime-mount.test.tsx` is outside the expected file list. An M4-02A assertion required the banner to contain **no** navigation landmark, which encoded the pre-Header shell; the canonical Header legitimately places the primary navigation inside the banner. The assertion was rescoped rather than weakened: the brand link must still sit outside any navigation landmark, and the banner must now contain exactly one navigation, named `Основная навигация`, with no live region.

### Risks

- User visual confirmation against RTE-001 and CMP-001 is outstanding; Search dominance and Catalog salience are judged against a raster whose copy and iconography deliberately differ.
- Header actions are absent, so the wide Header currently ends after Search. The composition will shift when M4-05 appends four actions, and the Search flex basis may need revisiting then.
- Catalog points at a representative category rather than a catalog surface. It is a route-safe placeholder and must be revisited when the Catalog surface milestone lands.
- The 44px target contract keeps the Header taller than the raster's proportions, as it already does for the Information Bar.
- `scripts/review-m3-browser.mjs` still asserts no image asset and a specific tab order, both long obsolete. It is milestone-review tooling for a closed milestone, is not a CI gate, and was deliberately left unchanged.

### Exact-SHA CI result

The GitHub Actions run for the M4-04 commit concluded **failure**. The full job log was retrieved; exact Playwright counts and scenario names were available and are recorded here.

| Item         | Value                                      |
| ------------ | ------------------------------------------ |
| Commit       | `9cc65787d6cd41b513931fdebbb682c1eb16f9e3` |
| Workflow run | 31088410761                                |
| Job          | 92573279593                                |
| Conclusion   | failure                                    |
| Failing step | `E2E tests`                                |
| Vitest       | 869 passed in 48 files                     |
| Playwright   | 108 total, 99 passed, 8 failed, 1 flaky    |

Every step before `E2E tests` — dev bootstrap, typecheck, lint, stylelint, format, comment check, unit tests, build, validate build — concluded success. All eight blocking failures reproduced on the initial attempt **and both retries**, so none of them was a timing artefact. The one flaky test failed on its initial attempt and passed on retry.

| Artifact            | ID         | Size            | Archive SHA-256                                                    |
| ------------------- | ---------- | --------------- | ------------------------------------------------------------------ |
| `playwright-report` | 8962434188 | 1 484 191 bytes | `a4e210bcf0c832eb833e20ac8e5e91959c3d7c498a49a35bc2da9839678cd08d` |

**Three failure classes, not one:**

1. **Seven invalid wide/expanded geometry assertions — test defects.** `expanded 1440px composes the Header core in one row` plus `1023px`, `1024px`, `1025px`, `1279px`, `1280px` and `1281px keeps the Header core usable without overflow` each compared the **top coordinate of the raw Search input** with the top of Brand or Catalog. Observed deterministically: identity top ≈ 75px, Search input top ≈ 89px, difference 14px — exactly the height of the persistently visible Search label above the input. The Header row aligns the **complete Search form block**, not the input element, so the one-row runtime composition was never disproved. The premise was wrong, not the runtime.
2. **One real compact runtime defect.** `compact 320px stacks identity and a full-width Search` measured Brand top 61px against Catalog top 113px — a 52px difference proving a **three-row** composition (Brand, then Catalog, then Search) instead of the canonical two rows. `.identity` permitted wrapping and the horizontal logo rendered at its default 180px, so logo + gap + Catalog exceeded the 288px compact content width.
3. **One flaky document-start focus origin.** `compact keyboard order reaches the disclosure before the brand link` in `tests/e2e/information-bar.spec.ts` blurred the active element and called `document.body.focus()`, which does not reliably reset Chromium's sequential focus-navigation starting point. The same premise had been copied into the new Header keyboard tests.

M4-04 was **not accepted** on that SHA, user visual confirmation was **not performed**, and M4-05 **remained blocked**.

### Next gate

M4-04 is closed through **M4-04A** below. Green GitHub Actions CI on the exact M4-04A SHA with zero failed and zero flaky Playwright tests, then independent diff audit, then user visual confirmation against RTE-001 and CMP-001. **M4-05 must not begin until all three close.**

## M4-04A — Compact Header layout correction and E2E geometry stabilization

**Status at commit time: IMPLEMENTED — AWAITING INDEPENDENT AUDIT, CI AND USER VISUAL CONFIRMATION**

### Baseline

| Item                                 | Value                                      |
| ------------------------------------ | ------------------------------------------ |
| Branch                               | `main`                                     |
| Baseline SHA                         | `9cc65787d6cd41b513931fdebbb682c1eb16f9e3` |
| Baseline commit                      | `feat(shell): add header core`             |
| Parent SHA                           | `54d9eb954fda1b582db49c1d3df217d8ea6723ca` |
| `git rev-parse HEAD` / `origin/main` | both matched the baseline before changes   |
| `git diff` / `git diff --cached`     | exit 0 — clean                             |

RTE-001 and CMP-001 were re-verified against their recorded dimensions, byte counts and SHA-256 hashes; all six values match. Both remain ignored through `.git/info/exclude` and uncommitted, confirmed by `git check-ignore -v`.

### Corrective scope

M4-04A fixes the confirmed defects and nothing else. The Header core is not redesigned: the component boundary, the single banner, the single brand Home link, `Основная навигация`, the `Поиск по каталогу` landmark, the `Brand → Catalog → Search` DOM and focus order, the `/catalog/laptops` destination with exact `end` matching, the visible Search label, Search validation and URL synchronisation, non-sticky behaviour, the 48rem compact breakpoint, one DOM copy of every control and the absence of JavaScript viewport detection are all unchanged. No M4-05 action was added.

### Compact identity-row contract

The defect was layout ownership, not the brand component. `BrandHomeLink` keeps its public API, its default sizing for every other consumer, its horizontal primary lockup and its SVG bytes; `BrandHomeLink.module.scss` is untouched.

`SiteHeader` now passes a Header-owned `brand-link` class through the existing `className` prop and scopes the compact visual width in its own module:

| Range      | Rendered horizontal logo width | Identity row                                  |
| ---------- | ------------------------------ | --------------------------------------------- |
| `< 48rem`  | **120px**                      | Brand and Catalog on one non-wrapping row     |
| `>= 48rem` | **180px** (restored default)   | Identity and the complete Search form one row |

`.identity` is `flex-wrap: nowrap` at every width; `.brand-link` and `.primary-nav` are `flex: 0 0 auto`, so neither the lockup nor the Catalog target shrinks below its content or below 44px. At 320px the PageContainer content width is 288px and the identity row needs roughly 120px + a 16px gap + the Catalog control, which fits with margin — the same row needed roughly 296px at 180px, which is what forced the wrap. Search keeps `flex: 1 1 100%` below 48rem, so it remains the full-width second row, and `flex: 1 1 20rem` above it. No absolute positioning, no CSS `order`, no reduced PageContainer padding, no symbol lockup, no abbreviated `Каталог`, no new breakpoint.

### Geometry evidence correction

The wide and expanded scenarios now measure the **complete Search form** through `searchLandmark(page).boundingBox()` instead of the raw input, and the Search label was neither hidden nor moved to satisfy them.

Focused helpers — `resolveBox`, `boxTop`, `boxBottom`, `boxCenterY`, `boxRight`, `verticalOverlap` — replace the previous `?? 0` fallbacks. `resolveBox` asserts the bounding box is non-null and throws otherwise, so a missing box can no longer masquerade as the coordinate `0`.

- **Expanded 1440px:** Brand and Catalog vertical centres agree within a 2px tolerance; the Search form's vertical interval overlaps both identity controls; the Search form's left edge is at or beyond Catalog's right edge; the Search form is wider than Catalog; the Information Bar still ends at or above the banner; no overflow; no M4-05 actions.
- **1023 / 1024 / 1025 / 1279 / 1280 / 1281px:** Brand, Catalog, the Search form, its field and its submit are visible; the logo is at least 120px; the complete Search form shares the Header row with the identity controls and follows them horizontally; no overflow.
- **Compact 320px:** Brand and Catalog centres agree within tolerance, Brand precedes Catalog with a non-negative gap, the Search form starts strictly below the bottom of both identity controls, the Search form fills the measured Header content width within 1px, the visible label, field and submit remain visible, the logo is at least 120px at the correct aspect ratio, every primary target is at least 44px, and there is no horizontal overflow. A three-row identity composition now fails the test.

The 767 / 768 / 769px DOM-order scenarios are retained unchanged. The viewport matrix was not widened; a 319px scenario was deliberately **not** added, because it sits below the approved supported minimum.

### Deterministic keyboard focus origin

`document.body.focus()` is not a reliable document-start anchor for Chromium sequential focus navigation. One shared, test-only helper replaces it: `tests/e2e/support/focus-origin.ts`, exporting `withDocumentStartFocus(page, traversal)`.

It mounts a temporary sentinel `div` **before the application root**, gives it `tabIndex = -1` so it never enters the normal Tab order, focuses it, and asserts that it is mounted, precedes the root, kept `tabIndex` `-1` and became `document.activeElement`. The sentinel stays mounted for the whole traversal and is removed in `finally`. It is test-only; no production focus sentinel, test hook or `data-testid` was added, and no runtime `tabIndex` changed.

Migrated traversals: the Information Bar compact keyboard order test and its forced-colors keyboard scenario, the Header compact and wide keyboard-order tests, and the brand `skip link remains first` traversal in `tests/e2e/brand-home-link.spec.ts`, which carried the identical premise. The Header forced-colors scenario does not traverse from document start — it inspects a focus indicator — so it simply dropped the obsolete reset. No target control is focused directly to simulate keyboard order, no sleeps were added and Playwright retries and timeouts are unchanged.

Runtime focus order is unchanged: compact `skip → disclosure → brand → Catalog → field → submit`; wide `skip → five service links → brand → Catalog → field → submit`; the open Information Bar still passes its five links before the brand link.

### Serverless regression evidence

Because local Playwright execution is prohibited, `tests/app/shell/site-header.test.tsx` adds bounded non-browser evidence: `BrandHomeLink` receives the Header-owned `brand-link` class alongside its own classes and keeps the horizontal lockup, and a style-contract group reads the `SiteHeader.module.scss` source to prove compact 120px ownership, the 48rem restoration to 180px, that no declared brand width falls below 120px, the non-wrapping identity row, the non-shrinking brand and Catalog, the full-width compact Search row, the 44px Catalog target, and the absence of absolute positioning or CSS `order`. No CSS parser dependency was added, and these assertions do not claim jsdom performs layout — browser geometry remains owned by the E2E suite.

### Files changed

| File                                                  | Change                                                       |
| ----------------------------------------------------- | ------------------------------------------------------------ |
| `src/app/shell/site-header/SiteHeader.tsx`            | Header-owned `brand-link` class passed to `BrandHomeLink`    |
| `src/app/shell/site-header/SiteHeader.module.scss`    | non-wrapping identity row, compact 120px logo, 48rem restore |
| `tests/app/shell/site-header.test.tsx`                | brand class ownership and compact style-contract evidence    |
| `tests/e2e/support/focus-origin.ts`                   | new — shared document-start focus sentinel                   |
| `tests/e2e/site-header.spec.ts`                       | complete Search-form geometry, migrated keyboard traversals  |
| `tests/e2e/information-bar.spec.ts`                   | migrated keyboard and forced-colors traversals               |
| `tests/e2e/brand-home-link.spec.ts`                   | migrated document-start traversal                            |
| `docs/05-implementation/m4-canonical-shell-report.md` | M4-04 CI reconciliation; this section                        |
| `docs/05-implementation/repository-state.md`          | current-state note                                           |

No change to `GlobalSearchForm`, `header-core-config.ts`, `RootLayout`, the Information Bar, `BrandHomeLink`, brand SVGs, routes, Shared UI, Foundations, dependencies, the lockfile, the Playwright config, workflows or `.gitignore`.

### Local verification

| Command                  | Result                                         |
| ------------------------ | ---------------------------------------------- |
| `npm run typecheck`      | PASS                                           |
| `npm run lint`           | PASS — 0 errors, 0 warnings                    |
| `npm run lint:styles`    | PASS                                           |
| `npm run format:check`   | PASS                                           |
| `npm run check:comments` | PASS — no authored comments                    |
| `npm test`               | PASS — **880 tests in 48 files**               |
| `npm run build`          | PASS — 244 modules                             |
| `npm run validate:build` | PASS                                           |
| `npm run check:full`     | PASS — includes the bounded dev-bootstrap gate |
| `git diff --check`       | PASS                                           |

Bundle moves from raw 424.50 KB / gzip 126.86 KB to raw **424.75 KB** / gzip **126.90 KB**.

Intentionally not run: `npm run dev`, `npm run preview`, `npm run test:e2e`, `playwright test`, `vite`, `vite preview`, `npm run review:m3-browser`, background or fixed-port servers, and user browser automation. CI was pending at commit time and user visual confirmation remains pending.

### Deviations

Two, both bounded.

1. `tests/e2e/brand-home-link.spec.ts` is listed in the prompt as conditional. It does carry the same `document.body.focus()` document-start premise, so its one traversal test was migrated; nothing else in that file changed.
2. `styles['brand-link']` types as `string | undefined`, and `BrandHomeLinkProps.className` is `string` under `exactOptionalPropertyTypes`. Rather than widen the `BrandHomeLink` API, `SiteHeader` resolves the class locally before passing it; `BrandHomeLink` already discards empty class values.

### Risks

- The compact identity row now depends on `120px + 16px + Catalog` fitting the 288px content width at 320px. The measured margin is comfortable, and a regression would surface as a horizontal-overflow failure rather than silently, but the Catalog label's rendered width is font-dependent.
- The compact logo width is enforced from `SiteHeader.module.scss` through a selector deliberately more specific than the `BrandHomeLink` default. Restructuring the brand markup would break that override; the style-contract tests guard the Header side, not the brand side.
- User visual confirmation against RTE-001 and CMP-001 is still outstanding, and the compact lockup is now visibly smaller than it was in the raster.
- The wide Header still ends after Search. The composition will shift when M4-05 appends four actions, and the `search.x >= catalogRight` assertion will need revisiting then.

### Next gate

Green GitHub Actions CI on the exact M4-04A SHA with zero failed and zero flaky Playwright tests, then independent diff audit, then user visual confirmation against RTE-001 and CMP-001. **M4-05 must not begin until all three close.**
