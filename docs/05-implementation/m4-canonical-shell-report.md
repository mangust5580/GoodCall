# M4 Canonical Application Shell Report

## Status

| Task                                                                   | Status                                                |
| ---------------------------------------------------------------------- | ----------------------------------------------------- |
| M4-01 — Shell destination safety and composition boundary              | **CLOSED THROUGH M4-01A**                             |
| M4-01A — Catalog family catch-all correction and CI reconciliation     | **APPROVED AND CLOSED**                               |
| M4-02 — Runtime brand/logo integration                                 | **CI FAILED ON ITS EXACT SHA — SUPERSEDED BY M4-02A** |
| M4-02A — Brand landmark accessibility correction and E2E stabilization | **IMPLEMENTED — AWAITING INDEPENDENT AUDIT AND CI**   |

M4 is not approved and not closed. No canonical shell surface exists yet: Header, Footer, Information Bar, Newsletter, Search and Catalog UI all remain later stages.

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

**Status at commit time: IMPLEMENTED — AWAITING INDEPENDENT AUDIT AND CI**

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

Green GitHub Actions CI on the exact M4-02A SHA with zero failed and zero flaky Playwright tests, then independent diff audit. **M4-03 must not begin until both close.**
