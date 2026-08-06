# M4 Canonical Application Shell Report

## Status

| Task                                                               | Status                                                |
| ------------------------------------------------------------------ | ----------------------------------------------------- |
| M4-01 — Shell destination safety and composition boundary          | **CI FAILED ON ITS EXACT SHA — SUPERSEDED BY M4-01A** |
| M4-01A — Catalog family catch-all correction and CI reconciliation | **IMPLEMENTED — AWAITING INDEPENDENT AUDIT AND CI**   |

M4 is not approved and not closed. No canonical shell surface exists yet.

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

**Status at commit time: IMPLEMENTED — AWAITING INDEPENDENT AUDIT AND CI**

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

Green GitHub Actions CI on the exact M4-01A SHA, then independent diff audit. **M4-02 must not begin until both close.**
