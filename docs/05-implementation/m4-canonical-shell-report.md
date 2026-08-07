# M4 Canonical Application Shell Report

## Status

| Task                                                                          | Status                                                                                    |
| ----------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| M4-01 — Shell destination safety and composition boundary                     | **CLOSED THROUGH M4-01A**                                                                 |
| M4-01A — Catalog family catch-all correction and CI reconciliation            | **APPROVED AND CLOSED**                                                                   |
| M4-02 — Runtime brand/logo integration                                        | **CLOSED THROUGH M4-02A**                                                                 |
| M4-02A — Brand landmark accessibility correction and E2E stabilization        | **APPROVED AND CLOSED**                                                                   |
| M4-03 — Information Bar                                                       | **CLOSED THROUGH M4-03A**                                                                 |
| M4-03A — Information Bar E2E correction and exact active-state reconciliation | **APPROVED AND CLOSED**                                                                   |
| M4-04 — Primary Header core: Catalog entry and Global Search                  | **APPROVED AND CLOSED THROUGH M4-04A AND M4-04B**                                         |
| M4-04A — Compact Header layout correction and E2E geometry stabilization      | **CLOSED THROUGH M4-04B**                                                                 |
| M4-04B — Deterministic keyboard focus origin and CI reconciliation            | **APPROVED AND CLOSED**                                                                   |
| M4-05-ICN — Application-owned shell icon set                                  | **APPROVED AND CLOSED**                                                                   |
| M4-05-ICN-A — Comparison icon semantic correction                             | **CLOSED THROUGH M4-05-ICN-B**                                                            |
| M4-05-ICN-B — Comparison marker legibility correction                         | **APPROVED AND CLOSED**                                                                   |
| M4-05 — Header route actions: Comparison, Favorites, Cart and Account         | **APPROVED AND CLOSED THROUGH M4-05A**                                                    |
| M4-05A — Header action E2E accessible-name assertion correction               | **APPROVED AND CLOSED**                                                                   |
| M4-06 — Newsletter pre-footer and deterministic local subscription lifecycle  | **CHANGES REQUIRED — ARCHITECTURE RECONCILIATION IMPLEMENTED IN M4-06A**                  |
| M4-06A — Newsletter form and session-persistence architecture reconciliation  | **IMPLEMENTED — AWAITING INDEPENDENT AUDIT, CI AND USER VISUAL/MANUAL FORM CONFIRMATION** |

M4 is not approved and not closed. The Information Bar, the primary Header core, the Header route actions and the Newsletter pre-footer now exist. The Footer remains a later stage. The transitional brand banner was replaced by the canonical Header in M4-04.

M4-04B closure evidence: commit `d7b02e0169391177b6cd4641d598b8a10bdaf553`, workflow run `31138021965`, job `92741720296`, workflow conclusion `success`, Vitest `880 passed in 48 files`, Playwright `108 passed`, `0 failed`, `0 flaky`, no retry marker, independent technical audit approved and user visual confirmation approved at `1440px`, `768px` and `320px`.

M4-04B is **APPROVED AND CLOSED**. M4-04A is **CLOSED THROUGH M4-04B**. M4-04 is **APPROVED AND CLOSED THROUGH M4-04A AND M4-04B**.

M4-05-ICN-B closure evidence: commit `3737da32b4e420f18cdb7b71a54424875dcf3820`, workflow run `31145480483`, job `92763895227`, workflow conclusion `success`, Vitest `921 passed in 49 files`, shell icon asset suite `41 passed`, Playwright `108 passed`, `0 failed`, `0 flaky`, build success, independent asset audit approved and user visual confirmation of the complete six-icon contact sheet received. The full job log was independently inspected.

M4-05-ICN-B is **APPROVED AND CLOSED**. M4-05-ICN-A is **CLOSED THROUGH M4-05-ICN-B**. M4-05-ICN is **APPROVED AND CLOSED**. That closed the icon asset prerequisite and unblocked runtime M4-05.

M4-05A closure evidence: commit `e8d92f915797a00326b4115b280328546d66c176`, workflow run `31148635608`, job `92773433563`, workflow conclusion `success`, Vitest `979 passed in 51 files`, shell icon asset suite `44 passed`, Playwright `144 passed`, `0 failed`, `0 flaky`, no retries, Playwright duration `50.2s`, build and build validation success. The full job log was independently inspected, the independent diff audit approved it, and the user confirmed the visual result at `1440px` expanded, `1024px` wide boundary, `768px` medium and `320px` compact — including the one-row expanded and wide Header, the two-row medium Header, the three-row compact Header, visible action labels at 64rem and above, icon-first actions below 64rem, Search before actions, and no overlap, clipping or horizontal overflow.

M4-05A is **APPROVED AND CLOSED**. M4-05 is **APPROVED AND CLOSED THROUGH M4-05A**. That unblocked M4-06, which is implemented below and awaits its own audit, CI and user visual/manual form confirmation.

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

**Terminal status: NOT ACCEPTED — exact-SHA CI failed. Corrective chain: M4-04A, then M4-04B.**

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

M4-04 is **not** closed. Its corrective chain runs M4-04A → **M4-04B**, and the stage closes only on green GitHub Actions CI for the exact M4-04B SHA with zero failed and zero flaky Playwright tests, then independent diff audit, then user visual confirmation against RTE-001 and CMP-001. **M4-05 must not begin until all three close.**

## M4-04A — Compact Header layout correction and E2E geometry stabilization

**Status at commit time: IMPLEMENTED — AWAITING INDEPENDENT AUDIT, CI AND USER VISUAL CONFIRMATION**

**Terminal status: NOT ACCEPTED — the exact-SHA workflow was green, but the Playwright run contained one flaky test. Corrected by M4-04B.**

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

### Exact-SHA CI result

The workflow concluded **success**, but the run was **not acceptable**: Playwright recorded one flaky test, and the stage gate requires zero.

| Item                | Value                                                                                |
| ------------------- | ------------------------------------------------------------------------------------ |
| Commit              | `c82f54adb4438a3068ff5093570d99e50cdd6f90`                                           |
| Workflow run        | 31136136192                                                                          |
| Job                 | 92735794125                                                                          |
| Workflow conclusion | success                                                                              |
| Vitest              | 880 passed in 48 files                                                               |
| Playwright          | **108 total, 107 passed, 0 failed after retries, 1 flaky**                           |
| Suite duration      | approximately 41.0s                                                                  |
| Failure artifact    | none — the uploader is gated on `if: failure()` and the E2E step exited successfully |

Every step concluded success, including `E2E tests`. The workflow was green only because Playwright's retry recovered the failing test; a green workflow does not by itself prove a zero flaky count, because Playwright exits 0 when a test fails and then passes on retry.

**Flaky scenario:** `tests/e2e/site-header.spec.ts` → `M4-04 primary Header core` → `compact keyboard order reaches Header controls after the Information Bar`. On its first attempt, after the focus sentinel was installed and the first `Tab` was pressed, the expected skip link `a[href="#main-content"]` was not focused — the assertion received an inactive element. The retry passed.

**Root cause.** The M4-04A sentinel was created with `tabIndex = -1`. That makes an element programmatically focusable but keeps it **out of sequential keyboard navigation**, so the next `Tab` was not guaranteed to advance from the sentinel to the next element in document order; Chromium was free to resolve a different sequential-navigation starting point. The helper proved the sentinel became `document.activeElement`, which is a weaker property than being a valid Tab origin.

The compact runtime correction and the geometry evidence were unaffected and remain valid. The runtime focus order was, and is, correct.

M4-04A was **not accepted**, user visual confirmation was **not performed**, and M4-05 **remained blocked**.

### Next gate

M4-04A is superseded by **M4-04B** below. **M4-05 must not begin until M4-04B closes.**

## M4-04B — Deterministic keyboard focus origin and CI reconciliation

**Status at commit time: IMPLEMENTED — AWAITING INDEPENDENT AUDIT, CI AND USER VISUAL CONFIRMATION**

### Baseline

| Item                                 | Value                                          |
| ------------------------------------ | ---------------------------------------------- |
| Branch                               | `main`                                         |
| Baseline SHA                         | `c82f54adb4438a3068ff5093570d99e50cdd6f90`     |
| Baseline commit                      | `fix(shell): stabilize header layout evidence` |
| Parent SHA                           | `9cc65787d6cd41b513931fdebbb682c1eb16f9e3`     |
| `git rev-parse HEAD` / `origin/main` | both matched the baseline before changes       |
| `git diff` / `git diff --cached`     | exit 0 — clean                                 |

RTE-001 and CMP-001 were re-verified against their recorded dimensions, byte counts and SHA-256 hashes; all six values match, and both remain ignored through `.git/info/exclude` and uncommitted.

### Corrective scope

One defect: the test-only focus sentinel was not a valid sequential-focus anchor. The correction is confined to the shared E2E helper. **No runtime file changed**, and every accepted M4-04A contract is preserved — compact 120px logo restored to 180px at 48rem, the non-wrapping compact identity row, Brand and Catalog on the first compact row, Search on the full-width second row, the complete Search-form geometry assertions, the visible Search label, Catalog and Search behaviour, the application focus lifecycle and the shell keyboard order.

### Sequential focus-anchor contract

`tests/e2e/support/focus-origin.ts` keeps its path and its public function `withDocumentStartFocus(page, traversal)`. The sentinel now:

- is a neutral `div` inserted **immediately before** the application root `#root`, verified through `nextElementSibling`;
- uses **`tabIndex = 0`**, so it genuinely participates in sequential focus order and `Tab` deterministically advances to the next tabbable element in document order;
- is visually non-disruptive and layout-neutral — `position: fixed`, 1px × 1px, `opacity: 0`, `pointer-events: none`, no text content;
- is focused with `focus({ preventScroll: true })`, and the helper asserts the scroll position is unchanged;
- is asserted mounted, immediately preceding `#root`, `tabIndex` `0`, and focused.

`tabIndex = -1`, `document.body.focus()`, `display: none`, `visibility: hidden`, the `hidden` attribute, `inert`, `aria-hidden` on a focusable sentinel, disabled controls, production components and runtime test hooks are all excluded.

### Focus-stability verification

Before the traversal callback runs, the helper asserts focus with Playwright's auto-waiting `toBeFocused()`, lets the browser complete a bounded rendering turn — two nested `requestAnimationFrame` callbacks awaited through `page.evaluate` — and then asserts `toBeFocused()` again. No `waitForTimeout`, no arbitrary sleep, no timeout or retry change.

### Cleanup

Any previous sentinel is removed before a new one is installed. Removal runs in `finally`, returns early when the page is closed, removes the exact element by id and verifies it is gone. The post-cleanup assertion is applied only when the traversal itself succeeded, so a cleanup assertion can never mask the original traversal failure. No test-only focusable element survives, and focus is never handed to a production control.

### Affected traversals

All five document-start traversals share the single helper and keep their approved sequences and real `Tab` presses:

| File                                | Test                                                                       |
| ----------------------------------- | -------------------------------------------------------------------------- |
| `tests/e2e/site-header.spec.ts`     | `compact keyboard order reaches Header controls after the Information Bar` |
| `tests/e2e/site-header.spec.ts`     | `wide keyboard order passes the inline service links first`                |
| `tests/e2e/information-bar.spec.ts` | `compact keyboard order reaches the disclosure before the brand link`      |
| `tests/e2e/information-bar.spec.ts` | `forced colors keeps focus and current state perceivable`                  |
| `tests/e2e/brand-home-link.spec.ts` | `skip link remains first and the brand link follows the shell controls`    |

Compact order remains sentinel → skip link → Information Bar disclosure → brand → Catalog → Search field → Search submit. Wide order remains sentinel → skip link → five service links → brand → Catalog → Search field → Search submit. No assertion was weakened and no traversal was converted to a DOM-order-only check.

### Files changed

| File                                                  | Change                                                  |
| ----------------------------------------------------- | ------------------------------------------------------- |
| `tests/e2e/support/focus-origin.ts`                   | sequential-focus anchor, stability check, safer cleanup |
| `docs/05-implementation/m4-canonical-shell-report.md` | status table, M4-04A CI reconciliation; this section    |
| `docs/05-implementation/repository-state.md`          | current-state note                                      |

No runtime file changed. No spec file changed — the helper's public API is unchanged, so no import or call site needed updating. No route, Shared UI, Foundations, asset, dependency, lockfile, Playwright config or workflow change.

### Local verification

| Command                  | Result                                         |
| ------------------------ | ---------------------------------------------- |
| `npm run typecheck`      | PASS                                           |
| `npm run lint`           | PASS — 0 errors, 0 warnings                    |
| `npm run lint:styles`    | PASS                                           |
| `npm run format:check`   | PASS                                           |
| `npm run check:comments` | PASS — no authored comments                    |
| `npm test`               | PASS — **880 tests in 48 files**, unchanged    |
| `npm run build`          | PASS — 244 modules                             |
| `npm run validate:build` | PASS                                           |
| `npm run check:full`     | PASS — includes the bounded dev-bootstrap gate |
| `git diff --check`       | PASS                                           |

Bundle unchanged at raw **424.75 KB** / gzip **126.90 KB** — the change is test-only and ships nothing.

Intentionally not run: `npm run dev`, `npm run preview`, `npm run test:e2e`, `playwright test`, `vite`, `vite preview`, `npm run review:m3-browser`, background or fixed-port servers, and user browser automation. CI was pending at commit time and user visual confirmation remains pending.

### Deviations

None. The tracked diff is exactly the expected minimal set: the shared helper and the two documentation files.

### Risks

- The correction cannot be proven locally. `AGENTS.md` forbids running the Playwright suite locally, so the fix rests on the sequential-focus contract — a `tabIndex = 0` element is a valid Tab origin, whereas a `tabIndex = -1` element is focusable but outside sequential navigation — and on exact-SHA CI as the only admissible evidence.
- The bounded rendering turn relies on `requestAnimationFrame` firing. Playwright pages are foregrounded, so this holds in CI; a page that never paints would stall until the unchanged test timeout rather than fail fast.
- The sentinel joins the Tab order while mounted. It sits before `#root` and is removed after each traversal, so it cannot affect the asserted sequences, but any future test that tabs backwards would reach it.
- User visual confirmation against RTE-001 and CMP-001 is still outstanding for the whole M4-04 chain.

### Closure

M4-04B is approved and closed. Exact-SHA CI passed for `d7b02e0169391177b6cd4641d598b8a10bdaf553`: workflow run `31138021965`, job `92741720296`, conclusion `success`, Vitest `880 passed in 48 files`, Playwright `108 passed`, `0 failed`, `0 flaky`, no retry marker. The independent technical audit approved the stage, and user visual confirmation was approved at `1440px`, `768px` and `320px`.

M4-04A is closed through M4-04B. M4-04 is approved and closed through M4-04A and M4-04B. M4-05 is unblocked.

## M4-05-ICN — Application-owned shell icon set

**Status at commit time: IMPLEMENTED — AWAITING INDEPENDENT ASSET AUDIT, CI AND USER VISUAL CONFIRMATION**

### Baseline

| Item                                 | Value                                        |
| ------------------------------------ | -------------------------------------------- |
| Branch                               | `main`                                       |
| Baseline SHA                         | `d7b02e0169391177b6cd4641d598b8a10bdaf553`   |
| Baseline commit                      | `fix(test): stabilize shell focus traversal` |
| `git rev-parse HEAD` / `origin/main` | both matched the baseline before changes     |
| `git diff` / `git diff --cached`     | exit 0 — clean before tracked changes        |

### Visual-source evidence

RTE-001: `artifacts/m4-03/references/RTE-001.png`, `1920 × 3840`, `5 438 232` bytes, SHA-256 `cb943e0b5b525645ede341c53fb6bff7eca714a69b62c042db23d62feb7bdd64`. It was used for Header action hierarchy, action roles, icon-to-label relationship, optical weight and wide Header density.

CMP-001: `artifacts/m4-04/references/CMP-001.png`, `1920 × 3412`, `4 354 263` bytes, SHA-256 `127c41f4604135c8e6a89ae6614d5702a3b55a69bfb26ebfea4e4c15a5dfe772`. Inspection used the full-resolution Header and Navigation crop `x=282`, `y=218`, `width=1546`, `height=260`, covering the information bar, main Header action row and category navigation row.

Both sources remain ignored and uncommitted.

### Output inventory

Six application-owned production SVG assets were added:

| Asset      | Path                                    | Bytes | SHA-256                                                            |
| ---------- | --------------------------------------- | ----: | ------------------------------------------------------------------ |
| Catalog    | `src/assets/icons/shell/catalog.svg`    |   449 | `d300da2ef73302ca9c56abde611bedf53daad2a03a345ef0ce4fa62e72f4edb2` |
| Search     | `src/assets/icons/shell/search.svg`     |   281 | `9d83689fae2d84e027e9d52ef93787529d1f0851f8882ef2c14eeb70921cedd7` |
| Comparison | `src/assets/icons/shell/comparison.svg` |   451 | `960541877f591f97d795f689c226fcf7e7607dc9cbb7a7aaf3e8cc5de3d4e61b` |
| Favorites  | `src/assets/icons/shell/favorites.svg`  |   376 | `1df513b8e9292e0d4ac73d0e9b0c98340bc8e2306f9b1fe41ba924c8154c7493` |
| Cart       | `src/assets/icons/shell/cart.svg`       |   385 | `a2dfe084f4c9e5484c208278ffc4f1cedbe110d622acaacf99691d7d57e7558a` |
| Account    | `src/assets/icons/shell/account.svg`    |   314 | `e79c601fae31f7ff4b0d7fffb056858bf91a5e0a91177346bcf4c5ac1441d093` |

### Family direction

The selected family direction is a clean monochrome outline set with `viewBox="0 0 24 24"`, intrinsic `24 × 24`, `stroke-width="1.9"`, rounded caps and joins, transparent backgrounds, no filled containers, no gradients, no shadows and no brand-purple pixels. Paint is limited to `#000000` and `none`, making the source files mask-compatible while keeping contextual colour, hover, current-route and forced-colors behavior in the future consuming component.

### Per-icon semantic rationale

Catalog uses four rounded tiles for structured category access and avoids hamburger, bag, product-card and text semantics.

Search uses a circular lens and diagonal handle without an input field or button container.

Comparison uses two simplified product/card entities with separated opposing directional rows so the icon reads as alternatives being compared, not server racks, list columns, refresh, sync, chart or legal scales.

Favorites uses an inactive outline heart and does not introduce a filled active-state variant.

Cart uses an open cart body and two wheels without total, item count, badge or notification dot.

Account uses a neutral outline person/profile mark for the guest account/auth entry and the later visible label `Войти`, with no avatar, initials, status dot or chevron.

### Technical constraints

The production SVGs are standalone UTF-8 files under 3 KB, with no `<title>`, `<desc>`, text, image, script, style, foreign object, external reference, data URI, font dependency, filter, gradient, pattern, animation, opacity below 1, editor namespace, hidden layer, accessible name or authored comment. They are project-specific reconstructions based on semantic roles and raster evidence; no third-party icon library or downloaded SVG was used.

### Manifest and tests

Manifest: `docs/05-implementation/m4-shell-icon-asset-manifest.json`.

Source-level test: `tests/shell-icon-assets.test.ts`.

The manifest records six entries in canonical order with final byte sizes, SHA-256 hashes, element counts, stroke/fill strategy, source evidence, `approvalStatus: "awaiting-independent-asset-audit-and-user-visual-confirmation"` and `integrationStatus: "produced-not-integrated"`.

### Review contact sheet evidence

Local ignored review artifact: `artifacts/m4-05/review/shell-icon-contact-sheet.png`.

| Item              | Value                                                                                                                               |
| ----------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| Dimensions        | `2200 × 1500`                                                                                                                       |
| Bytes             | `142 827`                                                                                                                           |
| SHA-256           | `1c01b1d35849ebc798e5874d93c1331c65d23dcf8648d1989f1f1210b57d68ef`                                                                  |
| Generation method | Bounded foreground headless Playwright rasterization from the actual six production SVG file bytes loaded from disk, with no server |

The regenerated contact sheet is not a full Header mockup and contains no counters, active-route state or approval claim. It adds the required Catalog-vs-Comparison review block at 16px, 20px, 24px and 32px, plus a zoomed Comparison marker detail derived from the actual SVG.

### Files changed

| File                                                       | Change                                    |
| ---------------------------------------------------------- | ----------------------------------------- |
| `src/assets/icons/shell/catalog.svg`                       | new Catalog source SVG                    |
| `src/assets/icons/shell/search.svg`                        | new Search source SVG                     |
| `src/assets/icons/shell/comparison.svg`                    | new Comparison source SVG                 |
| `src/assets/icons/shell/favorites.svg`                     | new Favorites source SVG                  |
| `src/assets/icons/shell/cart.svg`                          | new Cart source SVG                       |
| `src/assets/icons/shell/account.svg`                       | new Account source SVG                    |
| `tests/shell-icon-assets.test.ts`                          | new source-level asset contract test      |
| `docs/05-implementation/m4-shell-icon-asset-manifest.json` | new deterministic asset manifest          |
| `docs/05-implementation/m4-shell-icon-assets-report.md`    | new asset report                          |
| `docs/05-implementation/m4-canonical-shell-report.md`      | M4-04 closure and M4-05-ICN documentation |
| `docs/05-implementation/repository-state.md`               | M4-04 closure and current state note      |

No runtime file changed. No Header action markup, React icon component, runtime asset map, CSS, route, Shared UI, dependency, lockfile, tooling or workflow change was made.

### Local verification

| Command                                          | Result                                                                                                        |
| ------------------------------------------------ | ------------------------------------------------------------------------------------------------------------- |
| `npx vitest run tests/shell-icon-assets.test.ts` | PASS — **41 tests**                                                                                           |
| `npm run typecheck`                              | PASS                                                                                                          |
| `npm run lint`                                   | PASS                                                                                                          |
| `npm run lint:styles`                            | PASS                                                                                                          |
| `npm run format:check`                           | PASS                                                                                                          |
| `npm run check:comments`                         | PASS — no authored comments                                                                                   |
| `npm test`                                       | PASS — **921 tests in 49 files**                                                                              |
| `npm run build`                                  | PASS — 244 modules, bundle unchanged at raw **424.75 KB** / gzip **126.90 KB** because icons are not imported |
| `npm run validate:build`                         | PASS                                                                                                          |
| `npm run check:full`                             | PASS — includes bounded `verify:dev-bootstrap`, dynamic port `58649`, cleanup and port release verified       |
| `git diff --check`                               | PASS — no whitespace errors                                                                                   |
| deterministic asset inspection                   | PASS — viewBox, byte sizes, SHA-256, element counts, forbidden markup and allowed paint match the manifest    |
| ignore checks                                    | PASS — `AUDIT.md`, RTE-001, CMP-001 and contact sheet remain ignored                                          |

Non-blocking warnings observed during Vitest/check:full: the existing Vite native config-loader warning for `__dirname` in `vitest.config.ts`, jsdom `Window.scrollTo()` notices, and Vite's existing `HydrateFallback` console warning during the bounded bootstrap check.

### Commands intentionally not run

`npm run dev`, `npm run preview`, `npm run test:e2e`, direct Playwright, persistent local servers, fixed-port servers, browser automation against the user's browser and `npm run review:m3-browser` were not run.

### CI status

Pending at commit time. Exact-SHA CI is required before this asset stage can be considered an implementation candidate.

### Deviations

The repository does not contain tracked copies of the named canonical `03`, `04C` or `06` planning documents, so tracked reconciliation was limited to this M4 report and `repository-state.md`.

### Risks

The corrected comparison icon's two-card-and-separated-row metaphor still needs explicit review at 16px and 20px to confirm it reads as product comparison. Runtime M4-05 still needs to prove accessible names, visible labels, responsive action layout, current-route state, counters and forced-colors behavior.

### Next gate

Independent asset diff audit, exact-SHA green CI and user visual confirmation of the regenerated `artifacts/m4-05/review/shell-icon-contact-sheet.png`. Runtime M4-05 must not begin before both asset approvals and green CI.

## M4-05-ICN-A — Comparison icon semantic correction

**Status after exact-SHA CI: IMPLEMENTED — CI SUCCESS; VISUAL GATE FAILED**

### Baseline

| Item                                 | Value                                      |
| ------------------------------------ | ------------------------------------------ |
| Branch                               | `main`                                     |
| Baseline SHA                         | `cd971f954649c83415056db56386544bf4b2e274` |
| Baseline commit                      | `feat(assets): add shell icon set`         |
| Parent SHA                           | `d7b02e0169391177b6cd4641d598b8a10bdaf553` |
| `git rev-parse HEAD` / `origin/main` | both matched the baseline before changes   |
| `git diff` / `git diff --cached`     | exit 0 — clean before tracked changes      |

### Prior icon evidence

M4-05-ICN exact-SHA CI succeeded for commit `cd971f954649c83415056db56386544bf4b2e274`: workflow run `31142675965`, job `92755640110`, workflow conclusion `success`, Vitest `920 passed in 49 files`, shell icon asset suite `40 passed`, Playwright `108 passed`, `0 failed`, `0 flaky`, and build `success`.

The technical asset contract was approved for the family. Catalog, Search, Favorites, Cart and Account were approved. The Comparison asset required semantic correction because the prior two-panel-with-list-marks geometry could read as server racks, devices, columns or lists at 16px and 20px and was too close to Catalog's structured grid semantics.

### Correction

Only `src/assets/icons/shell/comparison.svg` changed among production icons. The final icon preserves `viewBox="0 0 24 24"`, intrinsic `24 × 24`, `stroke-width="1.9"`, round caps and joins, transparent background and paint limited to `#000000` and `none`.

The corrected geometry used two simplified product/card entities and one central bidirectional horizontal relation marker. Catalog remained a four-tile category grid with no relation-marker path, so the source-level structure was distinct from Catalog; visual audit later found the center-converging marker collapsed at small sizes and did not establish reliable comparison semantics.

Final comparison identity: `435` bytes, SHA-256 `b9ce0fae1f130e4d830805212e8d7005fba072d269b2fbff6ae3a3c907c28006`, element counts `svg=1`, `rect=2`, `path=1`, path count `1`.

The manifest updates only the Comparison entry's file identity, risk and rationale fields. `tests/shell-icon-assets.test.ts` preserves the prior source asset checks and adds a bounded structural assertion for the corrected Comparison-vs-Catalog distinction.

### Review and integration state

The ignored contact sheet was regenerated from the actual six production SVG bytes loaded from disk through a bounded foreground headless Playwright rasterization script, with no server. Final artifact: `artifacts/m4-05/review/shell-icon-contact-sheet.png`, `1900 × 1250`, `113 250` bytes, SHA-256 `a4ae3a297150b22974aae9c53624a55edd1173dfd282d4056aa169095ee154ad`.

No runtime file changed. No Header action markup, React icon component, icon barrel, runtime asset map, route, Shared UI, CSS, dependency, lockfile, tooling or workflow change was made. Runtime M4-05 remains blocked, no shell icon is imported at runtime, and user visual confirmation is pending.

M4-05-ICN-A exact-SHA CI succeeded for commit `69c0eca78e91cd66acad7f031d756454bd90dea5`: workflow run `31144366072`, job `92760669561`, Vitest `921 passed in 49 files`, shell icon asset suite `41 passed`, Playwright `108 passed`, `0 failed`, `0 flaky`, build `success`, workflow conclusion `success`. The technical gate passed, but the visual gate failed for Comparison: at 16px the relation marker nearly collapsed, at 20px it read as a clasp or compact connector, and at 24px and 32px the center-converging arrowheads merged into a diamond or bow-tie.

## M4-05-ICN-B — Comparison marker legibility correction

**Status at commit time: IMPLEMENTED — AWAITING INDEPENDENT ASSET AUDIT, CI AND USER VISUAL CONFIRMATION**

### Baseline

| Item                                 | Value                                      |
| ------------------------------------ | ------------------------------------------ |
| Branch                               | `main`                                     |
| Baseline SHA                         | `69c0eca78e91cd66acad7f031d756454bd90dea5` |
| Baseline commit                      | `fix(assets): clarify comparison icon`     |
| Parent SHA                           | `cd971f954649c83415056db56386544bf4b2e274` |
| `git rev-parse HEAD` / `origin/main` | both matched the baseline before changes   |
| `git diff` / `git diff --cached`     | exit 0 — clean before tracked changes      |

### Correction

Only `src/assets/icons/shell/comparison.svg` changed among production icons. The final icon preserves `viewBox="0 0 24 24"`, intrinsic `24 × 24`, `stroke-width="1.9"`, round caps and joins, transparent background and paint limited to `#000000` and `none`.

The selected marker is Option A: two separated directional rows. The upper row points left-to-right and the lower row points right-to-left, with arrowheads at opposite row ends instead of one shared center. The two product/card entities remain present.

Final comparison geometry: left card `x=2.75 y=6.75 width=5.4 height=10.5 rx=1.4`, right card `x=15.85 y=6.75 width=5.4 height=10.5 rx=1.4`, upper row `M9.25 10.1h5.5m-1.35-1.3 1.35 1.3-1.35 1.3`, lower row `M14.75 13.9h-5.5m1.35-1.3-1.35 1.3 1.35 1.3`.

Small-size review from the regenerated actual-SVG contact sheet: at 16px the marker remains visible as separated directional detail between the two cards; at 20px the upper and lower rows are distinct; at 24px and 32px no center diamond or bow-tie appears, and the marker does not overpower the cards.

Final comparison identity: `451` bytes, SHA-256 `960541877f591f97d795f689c226fcf7e7607dc9cbb7a7aaf3e8cc5de3d4e61b`, element counts `svg=1`, `rect=2`, `path=2`, path count `2`.

The ignored contact sheet was regenerated from the actual six production SVG bytes loaded from disk through a bounded foreground headless Playwright rasterization script, with no server. Final artifact: `artifacts/m4-05/review/shell-icon-contact-sheet.png`, `2200 × 1500`, `142 827` bytes, SHA-256 `1c01b1d35849ebc798e5874d93c1331c65d23dcf8648d1989f1f1210b57d68ef`.

No runtime file changed. No Header action markup, React icon component, icon barrel, runtime asset map, route, Shared UI, CSS, dependency, lockfile, tooling or workflow change was made. Runtime M4-05 remains blocked, no shell icon is imported at runtime, and user visual confirmation is pending.

## M4-05 — Header route actions: Comparison, Favorites, Cart and Account

**Status at commit time: IMPLEMENTED — AWAITING INDEPENDENT AUDIT, CI AND USER VISUAL CONFIRMATION**

### Baseline

| Item                                 | Value                                      |
| ------------------------------------ | ------------------------------------------ |
| Branch                               | `main`                                     |
| Baseline SHA                         | `3737da32b4e420f18cdb7b71a54424875dcf3820` |
| Baseline commit                      | `fix(assets): improve comparison marker`   |
| Parent SHA                           | `69c0eca78e91cd66acad7f031d756454bd90dea5` |
| `git rev-parse HEAD` / `origin/main` | both matched the baseline before changes   |
| `git diff` / `git diff --cached`     | exit 0 — clean                             |

RTE-001, CMP-001 and the approved contact sheet were re-verified against their recorded dimensions, byte counts and SHA-256 hashes; all nine values match, and all three remain ignored through `.git/info/exclude` and uncommitted. All six production SVG hashes were recomputed before and after implementation and are unchanged.

### Action inventory and route mapping

Four navigation-only actions, resolved from the existing route registry. No route was added, renamed or altered.

| Order | id           | Visible label and accessible name | Route key    | Destination   | Icon             |
| ----- | ------------ | --------------------------------- | ------------ | ------------- | ---------------- |
| 1     | `comparison` | `Сравнение`                       | `comparison` | `/comparison` | `comparison.svg` |
| 2     | `favorites`  | `Избранное`                       | `favorites`  | `/favorites`  | `favorites.svg`  |
| 3     | `cart`       | `Корзина`                         | `cart`       | `/cart`       | `cart.svg`       |
| 4     | `account`    | `Войти`                           | `auth`       | `/auth`       | `account.svg`    |

`header-actions-config.ts` rejects a missing route, a catch-all destination, a dynamic path, a non-app-relative path, the repository literal `GoodCall`, and any duplicate id, label, route key or destination. No second route table exists and no destination is hardcoded.

### Guest Account baseline

The Account action is the guest entry only: visible label and accessible name `Войти`, destination `/auth`. There is no authenticated avatar, profile name, initials, account dropdown, chevron, logout, session detection or auth state anywhere in the Header.

### No counters

M4-05 renders no comparison, favorites or cart count, no notification dot, no badge, no empty counter slot, no zero placeholder and no cart total. The approved planning rule applies: counters are omitted when no approved runtime owner provides a value. No speculative count prop or global count owner was added, and the component tests assert the absence directly.

### Component boundary

`src/app/shell/site-header/index.ts` still exports only `SiteHeader`. `HeaderActions`, the action descriptors, the labels and the icon URLs are all internal.

| File                        | Responsibility                                                            |
| --------------------------- | ------------------------------------------------------------------------- |
| `header-actions-config.ts`  | typed immutable descriptor list, registry resolution, route-safety guards |
| `HeaderActions.tsx`         | user navigation landmark, four `NavLink` actions, decorative icon spans   |
| `HeaderActions.module.scss` | action layout, icon box, label visibility, current-route treatment        |

`header-core-config.ts` was deliberately **not** touched. A shared route resolver was considered and rejected: the Header core resolves a dynamic category route through `generatePath` while the actions resolve four static routes, the overlap is roughly fifteen lines, and refactoring would have destabilised an approved M4-04 file and its source-contract test for no behavioural gain.

### Icon consumption

The four approved SVGs are imported as Vite asset URLs and rendered through a CSS mask on an application-owned decorative span:

- imported URL assigned to the typed custom property `--gc-header-action-icon`;
- `mask-image`, `mask-repeat: no-repeat`, `mask-position: center`, `mask-size: contain` — vendor prefixes are added by the existing autoprefixer step, matching the `BrandHomeLink` precedent;
- `background-color: currentcolor`, so colour is owned by the link;
- `background-color: canvastext` under `forced-colors: active`, so the icons survive forced colours;
- `aria-hidden="true"` on every icon span;
- runtime icon box exactly **20px × 20px**, the size the user confirmed on the contact sheet.

Because all six assets are far below Vite's inline threshold, each import resolves to a `data:image/svg+xml` URI rather than an emitted file. No SVG source is inlined into TSX, no path data is copied, and no `<object>`, icon font, Unicode glyph, emoji or icon package is used. Catalog and Search icons are imported nowhere.

### Landmarks and accessibility

The runtime now exposes exactly one banner, one `Сервисная навигация`, one `Основная навигация`, one `Поиск по каталогу` search landmark and one `Пользовательская навигация` user navigation. The user actions were not merged into the Information Bar.

Each action carries its exact programmatic name through `aria-label` on the link. The visible label span is `aria-hidden` so the name has a single source, and its text is identical to the `aria-label`, satisfying label-in-name. No tooltip is used for naming, no `title` attribute is set, and no ARIA menu, menubar, menuitem or toolbar semantics were introduced. `IconButton` is not used — it is button-only and would misstate navigation.

Current-route state uses exact `NavLink` `end` matching, so `aria-current="page"` appears only on the exact destination. `/comparison?source=header` and `/favorites#saved` stay current; `/comparison-extra`, `/cart/checkout`, `/catalog/laptops`, `/search`, service routes and Home mark nothing current. The current action is signalled by a visible border plus increased weight, not colour alone, and forced colours upgrade it to a 3px double border.

### Responsive composition

Only the four approved ranges are used, expressed as CSS ranges. There is no JavaScript viewport detection, no CSS `order`, no duplicated responsive DOM and no new breakpoint.

| Range                    | Composition                                                         | Actions                                                    |
| ------------------------ | ------------------------------------------------------------------- | ---------------------------------------------------------- |
| Compact `< 48rem`        | three rows: identity/Catalog, full-width Search, full-width actions | four equal grid columns, icon-only, labels `display: none` |
| Medium `48rem–63.999rem` | two rows: identity + Search, then actions                           | flex row aligned to the inline end, icon-only              |
| Wide `64rem–79.999rem`   | one row: identity, Search, actions                                  | icon above label, all four labels visible                  |
| Expanded `>= 80rem`      | one row, wider action spacing                                       | labels visible, Search absorbs the extra width             |

Search keeps its visible label, field and submit at every range and is never replaced by `search.svg`. The compact logo stays 120px and the medium-and-above logo stays 180px. Every action target is at least 44 × 44 CSS px at every range.

### Focus and DOM order

DOM and focus order is `BrandHomeLink` → `Catalog` → Search field → Search submit → `Сравнение` → `Избранное` → `Корзина` → `Войти`, produced by DOM sequence rather than CSS. The full page order remains skip link → Information Bar disclosure (or five service links when inline) → Header controls → route content. Route heading focus, document title, scroll restoration and route announcements remain owned by the existing M1 lifecycle; no live region was added.

### Files changed

| File                                                       | Change                                                      |
| ---------------------------------------------------------- | ----------------------------------------------------------- |
| `src/app/shell/site-header/header-actions-config.ts`       | new — typed action descriptors and registry resolution      |
| `src/app/shell/site-header/HeaderActions.tsx`              | new — user navigation landmark and four route actions       |
| `src/app/shell/site-header/HeaderActions.module.scss`      | new — action layout, icon mask, responsive label visibility |
| `src/app/shell/site-header/SiteHeader.tsx`                 | renders `HeaderActions` after the Search form               |
| `src/app/shell/site-header/SiteHeader.module.scss`         | action slot placement across the approved ranges            |
| `tests/app/shell/header-actions-config.test.ts`            | new — configuration, route safety and asset selection       |
| `tests/app/shell/header-actions.test.tsx`                  | new — landmark, semantics, icons and current-route state    |
| `tests/app/shell/site-header.test.tsx`                     | canonical order and action integration                      |
| `tests/app/shell/site-header-runtime-mount.test.tsx`       | real route-tree navigation, focus and current state         |
| `tests/app/shell/brand-runtime-mount.test.tsx`             | banner navigation count rescoped for the user navigation    |
| `tests/shell-icon-assets.test.ts`                          | approval and integration reconciliation                     |
| `tests/e2e/header-actions.spec.ts`                         | new — responsive, navigation, keyboard, zoom, touch, axe    |
| `tests/e2e/site-header.spec.ts`                            | canonical order extended with the four actions              |
| `docs/05-implementation/m4-shell-icon-asset-manifest.json` | approval and integration statuses                           |
| `docs/05-implementation/m4-shell-icon-assets-report.md`    | icon-stage closure and integration state                    |
| `docs/05-implementation/m4-canonical-shell-report.md`      | icon-stage closure; this section                            |
| `docs/05-implementation/repository-state.md`               | current-state note                                          |

No production SVG byte changed. No route, registry, carrier, loader, Shared UI, Foundations, asset, dependency, lockfile, Playwright config or workflow change.

### Local verification

| Command                  | Result                                         |
| ------------------------ | ---------------------------------------------- |
| `npm run typecheck`      | PASS                                           |
| `npm run lint`           | PASS — 0 errors, 0 warnings                    |
| `npm run lint:styles`    | PASS                                           |
| `npm run format:check`   | PASS                                           |
| `npm run check:comments` | PASS — no authored comments                    |
| `npm test`               | PASS — **979 tests in 51 files**               |
| `npm run build`          | PASS — 251 modules                             |
| `npm run validate:build` | PASS                                           |
| `npm run check:full`     | PASS — includes the bounded dev-bootstrap gate |
| `git diff --check`       | PASS                                           |

Bundle moves from raw 424.75 KB / gzip 126.90 KB to raw **430.50 KB** / gzip **128.07 KB**; the increase is the four inlined icon data URIs plus the action stylesheet.

Intentionally not run: `npm run dev`, `npm run preview`, `npm run test:e2e`, `playwright test`, `vite`, `vite preview`, `npm run review:m3-browser`, background or fixed-port servers, and user browser automation. CI was pending at commit time and user visual confirmation remains pending.

### Deviations

One. `tests/app/shell/brand-runtime-mount.test.tsx` is outside the expected file list. Its M4-02A assertion required the banner to contain exactly one navigation landmark, which the canonical Header legitimately invalidates now that the user navigation lives inside the banner. The assertion was rescoped rather than weakened: the brand link must still sit outside any navigation landmark, and the banner must now contain exactly two navigations, named `Основная навигация` and `Пользовательская навигация`. This is the same file and the same class of rescoping already recorded as a deviation in M4-04.

### Risks

- The wide one-row composition is tightest at exactly 1024px, where identity, Search and four labelled actions share the row. Search keeps `flex: 1 1 20rem` with `min-inline-size: 0`, so pressure resolves by shrinking Search rather than overflowing, and the boundary widths are asserted in E2E.
- Action labels are Russian and their rendered width is font-dependent. A significantly wider font could compress Search further at the wide boundary before the expanded range relieves it.
- The icons resolve to inlined data URIs because they sit below Vite's inline threshold. Raising an icon above that threshold later would switch it to an emitted file and change the custom-property value; the tests accept either form deliberately.
- Counters are absent by decision, not by oversight. When a domain stage introduces counts, the action links will need a component-owned counter boundary, and the current no-digit assertions will need revisiting.
- User visual confirmation of the integrated Header at expanded, wide, medium and compact widths is outstanding.

### Exact-SHA CI result

The GitHub Actions run for the M4-05 commit concluded **failure**, in the Playwright step only. The full job log was independently inspected; exact counts and scenario names are recorded here.

| Item                   | Value                                         |
| ---------------------- | --------------------------------------------- |
| Commit                 | `0e6948b421540852127e5c299219cc18d3816792`    |
| Workflow run           | 31147582955                                   |
| Job                    | 92770165065                                   |
| Run attempt            | 1                                             |
| Conclusion             | failure                                       |
| Failing step           | `E2E tests`                                   |
| Vitest                 | 979 passed in 51 files                        |
| Shell icon asset suite | 44 passed                                     |
| Playwright             | **144 total, 130 passed, 14 failed, 0 flaky** |

Install, Playwright browser setup, dev bootstrap, TypeCheck, ESLint, Stylelint, format check, comment check, Vitest, build, build validation and the test-result upload all passed. All fourteen failures reproduced on both retries, so none was a timing artefact.

| Artifact            | ID         | Size            | Digest                                                                    |
| ------------------- | ---------- | --------------- | ------------------------------------------------------------------------- |
| `playwright-report` | 8982103604 | 1 676 903 bytes | `sha256:f4b2adc8e46c5340acf85e3f0c1f6439ba4d52ce06e192120b5cde44297f7e8f` |

**Root cause — a test defect, not a runtime defect.** Playwright's matcher contract is `toHaveAccessibleName(name: string | RegExp, options?)`; it does not accept an array. Two M4-05 E2E locations passed `ACTION_LABELS`, which is `string[]`:

- `tests/e2e/header-actions.spec.ts` — inside the shared `expectActionInventory()` helper, which runs at the start of most new responsive scenarios;
- `tests/e2e/site-header.spec.ts` — the M4-04 expanded Header regression scenario.

Because the matcher failed early, the downstream assertions in those scenarios never executed — responsive geometry, visible-label state, Search dominance, compact equal-width action columns, horizontal overflow and part of the zoom evidence. **No runtime Header defect was established.**

The fourteen failed scenarios were: expanded 1440px; 1023px; 1024px; 1025px; 1279px; 1280px; 1281px; 767px; 768px; 769px; compact 320px; 200% zoom; 400% zoom; and one M4-04 expanded Header regression scenario.

M4-05 was **not accepted** on that SHA, user visual confirmation was **not performed**, and M4-06 **remained blocked**.

### Next gate

M4-05 is corrected by **M4-05A** below. Green GitHub Actions CI on the exact M4-05A SHA with zero failed and zero flaky Playwright tests, then independent diff audit, then user visual confirmation at expanded, wide, medium and compact widths. **M4-06 must not begin until all three close.**

## M4-05A — Header action E2E accessible-name assertion correction

**Status at commit time: IMPLEMENTED — AWAITING INDEPENDENT AUDIT, CI AND USER VISUAL CONFIRMATION**

### Baseline

| Item                                 | Value                                      |
| ------------------------------------ | ------------------------------------------ |
| Branch                               | `main`                                     |
| Baseline SHA                         | `0e6948b421540852127e5c299219cc18d3816792` |
| Baseline commit                      | `feat(shell): add header route actions`    |
| Parent SHA                           | `3737da32b4e420f18cdb7b71a54424875dcf3820` |
| `git rev-parse HEAD` / `origin/main` | both matched the baseline before changes   |
| `git diff` / `git diff --cached`     | exit 0 — clean                             |

RTE-001, CMP-001 and the approved contact sheet were re-verified against their recorded dimensions, byte counts and SHA-256 hashes; all nine values match, and all three remain ignored through `.git/info/exclude` and uncommitted.

### Scope

Test-only. Exactly two invalid matcher calls are replaced. No runtime file, stylesheet, route, SVG asset, asset manifest, dependency, Playwright configuration or workflow changed, and no assertion was removed, skipped, softened or converted to a soft assertion.

### Corrected assertion strategy

Each affected navigation locator now proves link count, canonical order and exact accessible name together, through one small ordered-name helper per file:

```ts
async function expectOrderedAccessibleNames(
  links: Locator,
  names: readonly string[]
): Promise<void> {
  await expect(links).toHaveCount(names.length);

  for (const [index, name] of names.entries()) {
    await expect(links.nth(index)).toHaveAccessibleName(name);
  }
}
```

`tests/e2e/header-actions.spec.ts` calls it from the existing shared `expectActionInventory()` helper, so the loop is not duplicated across scenarios. `tests/e2e/site-header.spec.ts` uses a narrow local copy rather than introducing a broad shared E2E utility for two assertions. This is a deliberately ordered, indexed comparison — not an unordered set comparison — so `Сравнение → Избранное → Корзина → Войти` remains asserted exactly.

A bounded static search confirms no call passes an array: every remaining `toHaveAccessibleName` invocation in `tests/e2e/` receives a single string.

### Runtime freeze

Every accepted M4-05 contract is untouched: four route links; order Comparison → Favorites → Cart → Account; the `Пользовательская навигация` landmark; exact `NavLink` `end` matching; 20px mask icons; the guest `Войти` label; no counters; compact three-row, medium two-row and wide/expanded one-row layouts; labels visible at 64rem and above; icon-first actions below 64rem; Search before actions; and M1 route lifecycle ownership.

### Files changed

| File                                                  | Change                                              |
| ----------------------------------------------------- | --------------------------------------------------- |
| `tests/e2e/header-actions.spec.ts`                    | ordered-name helper replaces the array matcher call |
| `tests/e2e/site-header.spec.ts`                       | ordered-name helper replaces the array matcher call |
| `docs/05-implementation/m4-canonical-shell-report.md` | M4-05 red-CI reconciliation; this section           |
| `docs/05-implementation/repository-state.md`          | current-state note                                  |

### Local verification

| Command                  | Result                                         |
| ------------------------ | ---------------------------------------------- |
| `npm run typecheck`      | PASS                                           |
| `npm run lint`           | PASS — 0 errors, 0 warnings                    |
| `npm run lint:styles`    | PASS                                           |
| `npm run format:check`   | PASS                                           |
| `npm run check:comments` | PASS — no authored comments                    |
| `npm test`               | PASS — **979 tests in 51 files**, unchanged    |
| Shell icon asset suite   | PASS — **44 tests**, unchanged                 |
| `npm run build`          | PASS — 251 modules                             |
| `npm run validate:build` | PASS                                           |
| `npm run check:full`     | PASS — includes the bounded dev-bootstrap gate |
| Static matcher search    | PASS — no array-based call remains             |
| `git diff --check`       | PASS                                           |

Bundle unchanged at raw **430.50 KB** / gzip **128.07 KB** — the change is test-only and ships nothing.

**No local command executes Playwright.** `AGENTS.md` forbids running the E2E suite locally, so the corrected assertions are validated only by exact-SHA CI.

Intentionally not run: `npm run dev`, `npm run preview`, `npm run test:e2e`, `playwright test`, `vite`, `vite preview`, `npm run review:m3-browser`, background or fixed-port servers, and user browser automation. CI was pending at commit time and user visual confirmation remains pending.

### Deviations

None. The tracked diff is exactly the expected four files.

### Risks

- **The fourteen scenarios' downstream assertions have still never executed.** They failed at the matcher before reaching responsive geometry, label visibility, Search dominance, compact equal-width columns, overflow and part of the zoom evidence. Those assertions are being exercised for the first time by this stage's CI run, so further defects may surface there.
- The E2E specs remain outside local TypeScript and ESLint coverage — `tsconfig.json` excludes `tests/e2e` and `eslint.config.js` ignores it — so a type error in a spec is invisible locally while the suite cannot be run locally. That structural gap produced this defect and is recorded as a future risk; closing it is outside M4-05A scope.
- User visual confirmation of the integrated Header is outstanding for the whole M4-05 chain.

### Next gate

Green GitHub Actions CI on the exact M4-05A SHA with zero failed and zero flaky Playwright tests, then independent diff audit, then user visual confirmation at expanded, wide, medium and compact widths. **M4-06 must not begin until all three close.**

## M4-06 — Newsletter pre-footer and deterministic local subscription lifecycle

**Status at commit time: IMPLEMENTED — AWAITING INDEPENDENT AUDIT, CI AND USER VISUAL/MANUAL FORM CONFIRMATION**

### Baseline

| Item                                 | Value                                              |
| ------------------------------------ | -------------------------------------------------- |
| Branch                               | `main`                                             |
| Baseline SHA                         | `e8d92f915797a00326b4115b280328546d66c176`         |
| Baseline commit                      | `fix(test): correct header action name assertions` |
| Parent SHA                           | `0e6948b421540852127e5c299219cc18d3816792`         |
| `git rev-parse HEAD` / `origin/main` | both matched the baseline before changes           |
| `git diff` / `git diff --cached`     | exit 0 — clean                                     |

RTE-001 was re-verified at `1920 × 3840`, `5 438 232` bytes, SHA-256 `cb943e0b5b525645ede341c53fb6bff7eca714a69b62c042db23d62feb7bdd64`. It, CMP-001 and the shell icon contact sheet all remain ignored through `.git/info/exclude` and uncommitted. RTE-001 informed placement after route content, the full-width light pre-footer treatment, the copy/form relationship and relative density only; the obsolete dark-gradient Newsletter treatment was not reproduced.

### Canonical content

| Role           | Exact copy                                                                               |
| -------------- | ---------------------------------------------------------------------------------------- |
| Heading        | `Будьте в курсе новинок и акций`                                                         |
| Description    | `Получайте подборки товаров, новые материалы и информацию об акциях GoodCall.`           |
| Email label    | `Электронная почта`                                                                      |
| Action         | `Подписаться`                                                                            |
| Pending action | `Подписываем…`                                                                           |
| Consent        | `Нажимая «Подписаться», вы соглашаетесь с демонстрационными условиями обработки данных.` |
| Demo boundary  | `Реальная отправка писем не выполняется.`                                                |
| Pending status | `Подписываем адрес электронной почты…`                                                   |
| Success        | `Вы подписаны на новости и акции GoodCall.`                                              |
| Empty error    | `Введите адрес электронной почты.`                                                       |
| Format error   | `Введите корректный адрес электронной почты.`                                            |

The canonical consent note is stored verbatim and the demo boundary is appended to it, so the rendered note reads as one visible line and tests can assert both parts independently. Nothing in the copy implies real marketing consent storage, remote registration, campaign delivery or account preference mutation.

### Route visibility policy

Visibility is owned by a typed route-handle policy, never by pathname inspection.

`src/app/routing/route-shell-policy.ts` declares `RouteShellPolicy`, `RouteShellHandle`, the shared `NEWSLETTER_HIDDEN_SHELL_POLICY` override and one resolver, `isNewsletterVisible(matches)`. The resolver walks matched routes deepest-first, returns on the first explicit decision and defaults to visible, so ordinary shell routes inherit visibility and only an explicit override hides the section. The catch-all route module spreads the shared override into its existing `handle`.

| Route                                         | Newsletter |
| --------------------------------------------- | ---------- |
| Home, Category, Product, Cart                 | visible    |
| Comparison, Favorites, Auth, service carriers | visible    |
| Catch-all / 404                               | **hidden** |

Query strings and hashes never change the outcome, and no repository base literal appears anywhere in the policy.

### Component and state ownership

`src/app/shell/newsletter/` is application-shell owned, not Shared UI. Its barrel exports only `NewsletterSection` and its props type; the copy constants, the schema and the delay constant stay internal.

`RootLayout` mounts `<NewsletterSection visible={isNewsletterVisible(matches)} />` after `<Outlet />` and outside the route-owned `main#main-content`. The component stays mounted when hidden and simply renders `null`, so subscription state survives navigation to and from the catch-all without any pathname key or remount.

**Superseded by M4-06A:** this section originally reset to `not-subscribed` on hard reload. The approved 04B state-ownership matrix requires versioned session persistence for Newsletter consent, so M4-06A restores the subscribed state within the same browser tab/session.

There is no network request, MSW handler, TanStack Query mutation, Zustand store or account/session dependency. Bounded static searches over the module confirm each exclusion.

**Superseded by M4-06A:** this section originally excluded `sessionStorage` as well. Versioned session storage is **required** by the approved Newsletter consent ownership row and is implemented in M4-06A; `localStorage`, `IndexedDB` and cookies remain prohibited.

### Form, validation and lifecycle

One native `<form>` named by the section heading, with `noValidate` so owner-controlled messages replace browser-localized popups while native `type="email"`, `required`, `autocomplete="email"` and `inputmode="email"` semantics are preserved.

Zod owns the submission boundary. A single `superRefine` trims the value, then reports the empty message or the format message — never both — so exactly one deterministic issue reaches the field. Entered casing is preserved.

| Transition                      | Behaviour                                                                                                               |
| ------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| invalid submit                  | one associated field error, focus moves to the email field, value preserved, no status, no state change                 |
| `not-subscribed` → `submitting` | immediate; form `aria-busy="true"`, submit disabled and relabelled `Подписываем…`, one pending status                   |
| `submitting` → `subscribed`     | after **400ms**; the same status element becomes the canonical success message; no focus move, no navigation, no scroll |
| edit after success              | result clears, lifecycle returns to `not-subscribed`, new value kept, submit re-enabled                                 |
| unchanged subscribed value      | submit stays disabled and the handler returns early                                                                     |

Duplicate submission is blocked twice over: the control is disabled, and a `pendingRef` guard rejects re-entry synchronously. The ref matters — a closure-based check cannot stop several `requestSubmit()` calls dispatched in one task, because the state update has not been applied yet. A unit test asserts `vi.getTimerCount()` is exactly `1` after three synchronous submits, which is what makes that guarantee observable rather than assumed.

The 400ms delay is a named implementation-level demo constant, not a network timing contract. `unsubscribed` is not implemented; it stays owned by a future explicit unsubscribe surface.

### Announcement ownership

Newsletter feedback has exactly one owner: a single `InlineStatus` with `role="status"`, rendered only when there is a message. Pending and success reuse the same element, so the live region persists across the transition and the text change is announced once. Initial render has no Newsletter status, and clearing the result after an edit removes the element without announcing a redundant reset. Validation errors stay field-associated and focus-based. The existing route announcement is a separate channel and is asserted never to contain Newsletter copy.

### Responsive composition

Only the approved ranges are used, expressed as CSS ranges; there is no JavaScript viewport detection, no CSS `order`, no new breakpoint, no fixed height and no sticky behaviour.

| Range                    | Composition                                                              |
| ------------------------ | ------------------------------------------------------------------------ |
| Compact `< 48rem`        | sequential: heading, description, field, submit, consent note, status    |
| Medium `48rem–63.999rem` | same sequential order                                                    |
| Wide `64rem–79.999rem`   | two columns — copy column then form column; field and submit share a row |
| Expanded `>= 80rem`      | same two columns with increased block spacing                            |

The copy column precedes the form column in DOM at every range. The section is a full-width light brand-soft surface whose inner content aligns to the existing `PageContainer` gutters. Foundations has no brand-soft surface token, so two **locally scoped** custom properties are declared on the section itself — `--gc-newsletter-surface: #f4f0fd` and `--gc-newsletter-border: #e4dcfb`. No global token was added or rewritten, and reusing `--gc-disabled-surface` was rejected because it carries disabled-state semantics.

### Files changed

| File                                                     | Change                                                        |
| -------------------------------------------------------- | ------------------------------------------------------------- |
| `src/app/shell/newsletter/newsletter-content.ts`         | new — canonical copy, demo boundary and the delay constant    |
| `src/app/shell/newsletter/newsletter-schema.ts`          | new — Zod submission boundary and validation result           |
| `src/app/shell/newsletter/NewsletterSection.tsx`         | new — section, form and deterministic lifecycle               |
| `src/app/shell/newsletter/NewsletterSection.module.scss` | new — light surface and responsive composition                |
| `src/app/shell/newsletter/index.ts`                      | new — the narrow public boundary                              |
| `src/app/routing/route-shell-policy.ts`                  | new — typed route-handle visibility policy and resolver       |
| `src/routes/error/not-found/route.tsx`                   | catch-all carries the explicit hide override                  |
| `src/app/shell/RootLayout.tsx`                           | mounts the Newsletter after the outlet                        |
| `tests/app/shell/newsletter-content.test.ts`             | new — canonical copy and schema contract                      |
| `tests/app/shell/newsletter-section.test.tsx`            | new — structure, lifecycle, announcement and boundaries       |
| `tests/app/shell/newsletter-runtime-mount.test.tsx`      | new — real route tree, visibility policy and state continuity |
| `tests/smoke.test.tsx`                                   | loose `GoodCall` text query rescoped                          |
| `tests/e2e/newsletter.spec.ts`                           | new — responsive, lifecycle, visibility, zoom, touch, axe     |
| `docs/05-implementation/m4-canonical-shell-report.md`    | M4-05A closure reconciliation; this section                   |
| `docs/05-implementation/repository-state.md`             | current-state note                                            |

No Footer implementation. No Header, Information Bar, brand, Shared UI, route inventory, SVG asset, asset manifest, dependency, lockfile, Playwright config or workflow change.

### Local verification

| Command                  | Result                                                                                     |
| ------------------------ | ------------------------------------------------------------------------------------------ |
| Focused Newsletter tests | PASS — **78 tests** across three files                                                     |
| `npm run typecheck`      | PASS                                                                                       |
| `npm run lint`           | PASS — 0 errors, 0 warnings                                                                |
| `npm run lint:styles`    | PASS                                                                                       |
| `npm run format:check`   | PASS                                                                                       |
| `npm run check:comments` | PASS — no authored comments                                                                |
| `npm test`               | PASS — **1057 tests in 54 files**                                                          |
| `npm run build`          | PASS — 257 modules                                                                         |
| `npm run validate:build` | PASS                                                                                       |
| `npm run check:full`     | PASS — includes the bounded dev-bootstrap gate                                             |
| Static boundary searches | PASS — no persistence, network, store, pathname parsing, Footer, dialog or raw `aria-live` |
| `git diff --check`       | PASS                                                                                       |

Bundle moves from raw 430.50 KB / gzip 128.07 KB to raw **435.44 KB** / gzip **129.54 KB**.

Intentionally not run: `npm run dev`, `npm run preview`, `npm run test:e2e`, `playwright test`, `vite`, `vite preview`, `npm run review:m3-browser`, background or fixed-port servers, and user browser automation. **No local command executes Playwright.** CI was pending at commit time and user visual/manual form confirmation remains pending.

### Deviations

Three, all documented.

1. **React Hook Form was not used, because it was not installed and the stage forbade adding a dependency.** ~~The form used controlled React state with Zod as the submission-boundary owner.~~ **Rejected by independent audit and corrected in M4-06A:** STATE-FORM-001 makes React Hook Form the required submission-form baseline, including Newsletter. M4-06A installs `react-hook-form` as a direct runtime dependency and migrates the form to it, keeping Zod as the single validation truth through one application-owned resolver.
2. **`tests/smoke.test.tsx` is outside the expected file list.** Its `getByText(/GoodCall/i)` matched exactly one node before this stage; the canonical Newsletter description legitimately contains `GoodCall`, so the query became ambiguous. The assertion was rescoped to `getAllByText(...).length > 0` rather than weakened, and the neighbouring `h1` assertion already pins the heading precisely.
3. **`src/routes/error/not-found/route.tsx` is outside the expected file list.** The prompt's preferred policy requires the catch-all to carry an explicit typed hide override, and that route module is where its `handle` is declared. Statically overriding `handle` in `application-routes.ts` is not viable because the route is `lazy` and React Router resolves lazy-module properties there. The change is one spread of the shared constant.

### Risks

- **The pending state is only observable for 400ms in E2E.** Playwright's auto-retrying assertions poll immediately after the click, so this is normally stable, but an extreme runner stall could let the success state arrive before the first poll. `page.clock` would remove the race entirely; it was rejected here because freezing `requestAnimationFrame` can hang Playwright's own actionability checks, and that cannot be validated locally under the no-local-E2E policy. The pending transition is additionally proven deterministically by fake-timer unit tests.
- The section adds a named `region` landmark and the form adds a `form` landmark with the same accessible name. Roles differ, so landmark uniqueness holds, but a future Footer landmark in the same area should be named distinctly.
- The light surface uses locally scoped literals. If a second component needs the same brand-soft surface, that repetition should be promoted to a Foundations token rather than copied.
- `userEvent` could not be combined with fake timers in this stack — every interaction hung until the 5s test timeout, with and without `delay: null` and a narrowed `toFake` list. The Newsletter unit tests therefore drive interactions with `fireEvent`, which is synchronous and deterministic. Any future form stage should expect the same constraint.
- User visual and manual form confirmation is outstanding, including the invalid, pending and subscribed states.

### Next gate

Green GitHub Actions CI on the exact M4-06 SHA with zero failed and zero flaky Playwright tests, then independent diff audit, then user visual and manual form confirmation at expanded, wide, medium and compact widths. **M4-07 must not begin until all three close.**

### M4-06 exact-SHA CI result and independent audit

The workflow concluded **success**, and the full job log was independently inspected. The earlier statement in this report that Playwright totals and flaky status could not be read is **obsolete and withdrawn** — the exact counts are recorded here.

| Item                     | Value                                      |
| ------------------------ | ------------------------------------------ |
| Commit                   | `6e82fa863a5e67cecba6802d7ffbc0d82a7d6691` |
| Workflow run             | 31150969842                                |
| Job                      | 92780333313                                |
| Run attempt              | 1                                          |
| Vitest                   | **1057 passed in 54 files**                |
| Focused Newsletter tests | **78** across three files                  |
| Shell icon asset suite   | **44 passed**                              |
| Playwright               | **177 passed, 0 failed, 0 flaky**          |
| Retries                  | none                                       |
| Playwright duration      | approximately 1.3m                         |
| Build / build validation | success                                    |
| Workflow conclusion      | success                                    |

**The independent audit result was CHANGES REQUIRED**, and user visual/manual form confirmation was not performed. Three architecture-contract violations were found:

1. the submission form used controlled React state instead of the approved React Hook Form baseline (STATE-FORM-001);
2. Newsletter consent was memory-only and reset on reload instead of using versioned session storage (Newsletter consent ownership row);
3. after a field error, `handleChange()` erased the error instead of revalidating the field (STATE-FORM-003).

The visual and layout implementation, the route-shell visibility policy, the canonical content, the single status owner, the 400 ms deterministic demo lifecycle and the no-backend boundary were **not** rejected.

The CI log additionally contained one Newsletter-owned warning — `An update to NewsletterSection inside a test was not wrapped in act(...)` in `valid submission lifecycle > enters pending immediately with one owned status`.

M4-06 is therefore **not accepted**; it is reconciled by M4-06A below.

## M4-06A — Newsletter form and session-persistence architecture reconciliation

**Status at commit time: IMPLEMENTED — AWAITING INDEPENDENT AUDIT, CI AND USER VISUAL/MANUAL FORM CONFIRMATION**

### Baseline

| Item                                 | Value                                      |
| ------------------------------------ | ------------------------------------------ |
| Branch                               | `main`                                     |
| Baseline SHA                         | `6e82fa863a5e67cecba6802d7ffbc0d82a7d6691` |
| Baseline commit                      | `feat(shell): add newsletter pre-footer`   |
| Parent SHA                           | `e8d92f915797a00326b4115b280328546d66c176` |
| `git rev-parse HEAD` / `origin/main` | both matched the baseline before changes   |
| `git diff` / `git diff --cached`     | exit 0 — clean                             |

### Authority resolution

M4-06 recorded a deviation stating that React Hook Form "is not in the repository" and that adding a dependency was prohibited. The approved 04B contract is authoritative: STATE-FORM-001 requires React Hook Form for submission forms including Newsletter, and the Newsletter consent ownership row requires versioned session persistence. This corrective stage explicitly authorises the dependency change needed to satisfy that contract. Both M4-06 deviations in this area are withdrawn.

### Dependency reconciliation

| Item                   | Value                                            |
| ---------------------- | ------------------------------------------------ |
| Package                | `react-hook-form`                                |
| Placement              | `dependencies` — imported by application runtime |
| Requested range        | `^7.84.0`                                        |
| Resolved version       | `7.84.0`                                         |
| Lockfile entries added | exactly one — `node_modules/react-hook-form`     |
| `@hookform/resolvers`  | **not added**                                    |

`npm install react-hook-form` also alphabetised both dependency blocks in `package.json`; no existing version specifier changed. No lockfile integrity or resolution metadata was hand-edited. A one-file application-owned resolver backed directly by the existing Zod schema replaces the need for a resolver package.

### React Hook Form ownership

`NewsletterSection` remains the application-shell owner and now uses `useForm<NewsletterFormValues>` with `mode: 'onSubmit'`, `reValidateMode: 'onChange'` and the Zod-backed resolver. The manual `email` and `error` state is gone; RHF owns the form value and `formState.errors`. The existing Shared UI `TextField` is registered directly through `register('email')` — its `name`, `onChange`, `onBlur` and `ref` are forwarded, so no `Controller` and no Shared UI API change were needed.

Invalid submit focuses the field through RHF's own `setFocus('email')`. After the 400 ms success transition, `reset({ email })` makes the normalized address both the visible field value and the new clean baseline, satisfying STATE-FORM-004 instead of leaving the submitted and displayed values out of sync.

### Zod validation and revalidation

`newsletterResolver` is the only bridge between RHF and Zod: it parses `{ email }` through `newsletterFormSchema`, returns the normalized output on success and maps the single Zod issue to the `email` field error on failure. No regex or message is duplicated outside the schema and the content module; a test asserts the schema file contains no literal Cyrillic message and exactly one email pattern reference. The now-redundant `validateNewsletterEmail()` helper was removed rather than left as a second validation path.

| Event                   | Behaviour                                                                                  |
| ----------------------- | ------------------------------------------------------------------------------------------ |
| before first submit     | no eager validation — typing and blurring produce no error                                 |
| first invalid submit    | associated error, focus moves to the field                                                 |
| change while in error   | revalidates through Zod; another invalid value updates the message rather than clearing it |
| blur while in error     | revalidates through the same Zod boundary via `trigger('email')`                           |
| change to a valid value | error clears through validation, without a second submit                                   |

`reValidateMode: 'onChange'` covers the change event; blur is composed narrowly and only fires `trigger` when the field is already in an error state.

### Versioned session persistence

`src/app/shell/newsletter/newsletter-session-storage.ts` owns persistence, inside the Newsletter boundary.

| Item             | Value                                                     |
| ---------------- | --------------------------------------------------------- |
| Key              | `goodcall.newsletter`                                     |
| Version          | `1`                                                       |
| Persisted fields | `version`, `state: 'subscribed'`, normalized `email`      |
| Validation       | the same Zod email schema validates the persisted address |

Only durable consent is persisted. `submitting`, validation state, touched/dirty metadata, focus state, announcement state and any account identity are never written. The write happens **only** after the successful transition, never during pending.

Reads recover safely: a missing key yields the initial state; malformed JSON, a wrong shape, an unsupported version or an invalid stored email each remove **only** the Newsletter key and fall back to `not-subscribed`. Boot never throws for a malformed payload, and unrelated `sessionStorage` keys are untouched.

Editing a restored or newly subscribed email clears the result and removes the persisted key immediately, so stored consent can never reference an address different from the currently owned successful value. A second success overwrites the stored email.

### Storage failure and corruption recovery

Every read, write and remove is wrapped, including the `window.sessionStorage` property access itself, which can throw in restrictive privacy modes. A failure degrades silently: the current mount keeps its full in-memory lifecycle and the user can still subscribe. **No new user-facing storage-error copy was invented**, because OQ-B-EVD-11 leaves that wording open; this degraded behaviour is recorded here as implementation evidence for that open question. Unrelated runtime errors are not swallowed.

No `localStorage`, `IndexedDB` or cookie use. No `storage` listener, `BroadcastChannel`, shared worker, polling or mirroring — there is no approved cross-tab baseline for Newsletter consent.

### Reload semantics

Client-side navigation preserves state; the catch-all hides the section without destroying it; returning restores the same mounted state; and a **hard reload within the same browser tab/session now restores the subscribed state and normalized email** from session storage. This replaces the M4-06 reset-on-reload expectation. A new browser session — cleared session storage — starts at the initial state.

### Announcement ownership

The single status owner is preserved, with one refinement. A **new in-session** success sets `role="status"` so it is announced; a **restored** success on page load renders the same canonical text **without** `role`, so hydration does not produce announcement noise for something the user did earlier. Pending always announces. The distinction is exposed as `data-newsletter-announced` and asserted in tests. Validation errors remain field-associated, and the route announcement channel stays separate.

### Preserved visual and route contracts

Unchanged: canonical copy, the visible demo-boundary wording, the 400 ms delay, the single pre-footer instance, placement after route `main`, the absence of a Footer, the typed route-shell visibility policy and its catch-all override, one status slot, no dialog or toast, no network request, no Account ownership or prefill, no unsubscribe UI, no new route, no Header or Information Bar change, and the full responsive composition. `NewsletterSection.module.scss` was **not** modified. Duplicate-submit protection keeps the synchronous `pendingRef` guard, because RHF's async submit state does not close the same-task `requestSubmit()` race.

### Files changed

| File                                                     | Change                                                              |
| -------------------------------------------------------- | ------------------------------------------------------------------- |
| `package.json`                                           | `react-hook-form` added; npm alphabetised both blocks               |
| `package-lock.json`                                      | one resolved entry for `react-hook-form@7.84.0`                     |
| `src/app/shell/newsletter/newsletter-schema.ts`          | Zod-backed RHF resolver; obsolete helper removed                    |
| `src/app/shell/newsletter/newsletter-session-storage.ts` | new — versioned session consent owner                               |
| `src/app/shell/newsletter/NewsletterSection.tsx`         | RHF migration, restoration, persistence, announcement split         |
| `tests/app/shell/newsletter-content.test.ts`             | resolver-based schema coverage                                      |
| `tests/app/shell/newsletter-session-storage.test.ts`     | new — key, version, round-trip, corruption, degradation             |
| `tests/app/shell/newsletter-section.test.tsx`            | RHF, revalidation, persistence, restoration, act-correct            |
| `tests/app/shell/newsletter-runtime-mount.test.tsx`      | session-restore versus cleared-session contract                     |
| `tests/e2e/newsletter.spec.ts`                           | reload restore, edit clears consent, corrupt payloads, revalidation |
| `docs/05-implementation/m4-canonical-shell-report.md`    | M4-06 reconciliation; this section                                  |
| `docs/05-implementation/repository-state.md`             | current-state note                                                  |

`RootLayout.tsx`, `route-shell-policy.ts`, the catch-all route, `newsletter-content.ts`, `index.ts`, `NewsletterSection.module.scss`, Header, Information Bar, Shared UI, assets, Playwright config and workflows are all unchanged.

### Local verification

| Command                            | Result                                                                                                              |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| `npm install react-hook-form`      | PASS — `7.84.0`, one lockfile entry                                                                                 |
| `npm ls react-hook-form --depth=0` | PASS — `react-hook-form@7.84.0`                                                                                     |
| Focused Newsletter Vitest files    | PASS — **126 tests** across four files                                                                              |
| Newsletter act-warning scan        | PASS — no `NewsletterSection … act(...)` warning                                                                    |
| `npm run typecheck`                | PASS                                                                                                                |
| `npm run lint`                     | PASS — 0 errors, 0 warnings                                                                                         |
| `npm run lint:styles`              | PASS                                                                                                                |
| `npm run format:check`             | PASS                                                                                                                |
| `npm run check:comments`           | PASS                                                                                                                |
| `npm test`                         | PASS — **1105 tests in 55 files**                                                                                   |
| `npm run build`                    | PASS — 259 modules                                                                                                  |
| `npm run validate:build`           | PASS                                                                                                                |
| `npm run check:full`               | PASS — includes the bounded dev-bootstrap gate                                                                      |
| Static architecture searches       | PASS — no localStorage/IndexedDB/cookie/cross-tab/network/store/account, RHF imported, `@hookform/resolvers` absent |
| `git diff --check`                 | PASS                                                                                                                |

Bundle moves from raw 435.44 KB / gzip 129.54 KB to raw **464.79 KB** / gzip **131.93 KB**; the increase is `react-hook-form`.

Intentionally not run: `npm run dev`, `npm run preview`, `npm run test:e2e`, `playwright test`, `vite`, `vite preview`, `npm run review:m3-browser`, background or fixed-port servers, and user browser automation. CI was pending at commit time and user visual/manual form confirmation remains pending.

### Deviations

One. The canonical `03-*` and `04*` contract documents are **not tracked in this repository** — only `docs/05-implementation/` exists, and this has been true throughout M4. The normative clauses were therefore taken from the corrective stage prompt, which quotes them verbatim, rather than read from a tracked source. This is an evidence limitation, not a conflict: nothing in the repository contradicts the quoted contracts.

### Risks

- Restored success is deliberately not announced. If a future audit decides restoration should announce, the `data-newsletter-announced` split is the single place to change.
- Session persistence makes reload-dependent tests order-sensitive if a future spec subscribes and then hard-navigates; Playwright's per-test context isolation currently prevents leakage, and the one affected M4-06 test was updated rather than removed.
- `react-hook-form` adds roughly 29 KB raw to the bundle. It is now the approved baseline for every later form stage, so the cost amortises.
- The 400 ms pending window remains brief for manual observation and for E2E pending assertions.
- User visual and manual form confirmation is outstanding, now including the reload-restored subscribed state.

### Next gate

Green GitHub Actions CI on the exact M4-06A SHA with zero failed, zero flaky, no retries and no Newsletter-owned `act(...)` warning, then independent diff audit, then user visual and manual form confirmation. **M4-07 must not begin until all three close.**
