# Repository State

## Created Files Summary

### Root Configuration

```
.nvmrc                          Node 24
.editorconfig                   Editor settings (UTF-8, 2-space indent)
.gitignore                      Standard Node + build artifacts
.env.example                    Public environment template (empty for M0)
package.json                    ESM-based, private, Node 24 restriction
tsconfig.json                   Strict mode, no-emit, @/* alias
tsconfig.app.json               App-specific TypeScript config
tsconfig.node.json              Build/config file TypeScript config
vite.config.ts                  React plugin, alias, /GoodCall/ base
vitest.config.ts                jsdom, setup file, coverage config
playwright.config.ts            Chromium, /GoodCall/ preview base, conditional webServer
postcss.config.mjs              Autoprefixer
prettier.config.mjs             2-space, single quotes, no semicolons (false)
stylelint.config.mjs            SCSS, selector nesting limits
eslint.config.js                Flat config, TypeScript, React hooks, a11y
index.html                       Root entry point, module type script
README.md                        Setup, scripts, architecture, Pages notes, policies
AGENTS.md                        Canonical agent policies (comments, servers, testing)
CLAUDE.md                        Claude Code working instructions
```

### Source Code (`src/`)

```
src/
  main.tsx                      Entry point, React root, MSW guard
  app/
    App.tsx                     Root component with Suspense + providers
    config/
      base.ts                   STORAGE_ID constant only (business-neutral)
      index.ts                  Re-exports
    fallback.ts                 GitHub Pages 404 fallback with parameterized base
    providers/
      index.tsx                 QueryClientProvider setup
    routing/
      index.tsx                 BrowserRouter using import.meta.env.BASE_URL
    shell/
      Shell.tsx                 Main layout, skip link with focus handling, Outlet
      Shell.module.scss         Skip link + main styles (tabIndex=-1)
      pages/
        BootstrapPage.tsx       h1, nav with base-safe links
  shared/
    ui/                         (empty, placeholder for future components)
  styles/
    index.scss                  Imports foundations via @use
    foundations/
      _index.scss               Forwards/uses all foundation modules
      _primitives.scss          Neutral colors, technical accent, spacing, motion
      _semantic.scss            CSS custom properties (--gc-* prefix)
      _breakpoints.scss         Compile-time Sass breakpoint values
      _reset.scss               Border-box, inherited fonts, semantic baseline
      _document.scss            Light-only theme baseline
      _typography.scss          Semantic typography roles
      _accessibility.scss       Focus, motion, forced-colors
    tools/                      (empty, placeholder for future mixins)
  mocks/
    index.ts                    MSW setupWorker (no handlers in M0)
```

### Testing (`tests/`)

```
tests/
  setup.ts                      Vitest globals, RTL cleanup, jest-dom
  smoke.test.tsx                4 tests: render, h1 role, main landmark, skip link
  fallback.test.ts              Tests for URL restore fallback logic
  validate-build.test.ts        Tests for build artifact validation
  check-comments.test.ts        Tests for comment scanner
  e2e/
    bootstrap.spec.ts           Playwright: render, skip link, landmark, axe scan
  support/
    test-utils.tsx              Custom render with Providers, BrowserRouter
```

### Build & Deployment Scripts (`scripts/`)

```
scripts/
  check-comments.mjs            Scanner for authored comments (enforced in CI)
  build-validation.d.mts        Type definitions for build-validation.mjs
  prepare-pages-artifact.mjs    Creates dist/404.html (SPA fallback), .nojekyll
  report-bundle-sizes.mjs       Reports JS/CSS sizes (raw + gzipped)
  validate-build.mjs            Checks required files, forbidden patterns
```

### CI/CD Workflows (`.github/workflows/`)

```
.github/
  workflows/
    ci.yml                      Push + PR → typecheck, lint, test, build, e2e
    deploy-pages.yml            Manual dispatch → build, validate, deploy
```

### Documentation (`docs/`)

```
docs/
  05-implementation/
    bootstrap-report.md         This report
    repository-state.md         This file
    tooling-versions.md         Pinned dependency versions
```

## Dependency Versions

See [tooling-versions.md](tooling-versions.md).

## Directory Tree

```
GoodCall/
├── .github/
│   └── workflows/
│       ├── ci.yml
│       └── deploy-pages.yml
├── .idea/                       (WebStorm, not in git)
├── docs/
│   └── 05-implementation/
│       ├── bootstrap-report.md
│       ├── repository-state.md
│       └── tooling-versions.md
├── scripts/
│   ├── prepare-pages-artifact.mjs
│   ├── report-bundle-sizes.mjs
│   └── validate-build.mjs
├── src/
│   ├── app/
│   │   ├── config/
│   │   │   ├── base.ts
│   │   │   └── index.ts
│   │   ├── providers/
│   │   │   └── index.tsx
│   │   ├── routing/
│   │   │   └── index.tsx
│   │   ├── shell/
│   │   │   ├── Shell.tsx
│   │   │   ├── Shell.module.scss
│   │   │   └── pages/
│   │   │       └── BootstrapPage.tsx
│   │   └── App.tsx
│   ├── mocks/
│   │   └── index.ts
│   ├── shared/
│   │   └── ui/
│   ├── styles/
│   │   ├── index.scss
│   │   ├── foundations/
│   │   │   ├── reset.scss
│   │   │   ├── typography.scss
│   │   │   ├── color.scss
│   │   │   └── accessibility.scss
│   │   └── tools/
│   └── main.tsx
├── tests/
│   ├── setup.ts
│   ├── smoke.test.tsx
│   ├── e2e/
│   │   └── bootstrap.spec.ts
│   └── support/
│       └── test-utils.tsx
├── .editorconfig
├── .env.example
├── .gitignore
├── .nvmrc
├── AGENTS.md
├── CLAUDE.md
├── eslint.config.js
├── index.html
├── package.json
├── package-lock.json
├── playwright.config.ts
├── postcss.config.mjs
├── prettier.config.mjs
├── README.md
├── stylelint.config.mjs
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
├── vitest.config.ts
└── vite.config.ts
```

## No Unexpected Files

Only `.idea/` (WebStorm metadata) exists outside tracked files. Not committed to git.

## Milestone State Note — M2B Brand Assets (2026-08-04)

The "Created Files Summary" and "Directory Tree" sections above describe the M0 baseline and have not been expanded for every later milestone. This note records M2B-relevant state only; it is not a full repository census.

### Added in M2B

```
src/assets/brand/
  goodcall-logo.svg                     horizontal logo, primary, fixed brand colors
  goodcall-symbol.svg                   symbol-only, primary, fixed brand colors
  goodcall-logo-inverse.svg             horizontal logo, inverse, fixed #FFFFFF
  goodcall-symbol-inverse.svg           symbol-only, inverse, fixed #FFFFFF
  goodcall-logo-monochrome.svg          horizontal logo, monochrome, currentColor
  goodcall-symbol-monochrome.svg        symbol-only, monochrome, currentColor
docs/05-implementation/
  m2-brand-assets-report.md             M2B implementation and usage contract
  m2-brand-asset-manifest.json          Tracked asset manifest (hashes, geometry, roles)
tests/
  brand-assets.test.ts                  Serverless brand asset contract test
.gitattributes                          Disables EOL conversion for src/assets/brand/*.svg only
```

### Modified in M2B

```
src/styles/foundations/_primitives.scss   Added $brand-primary, $brand-ink
src/styles/foundations/_semantic.scss     Added --gc-brand-primary, --gc-brand-ink
```

### State at Report Time

- Six approved logo assets are tracked with byte identity verified against approved SHA-256 hashes.
- Brand primitive and semantic tokens are defined; existing technical action, focus and text tokens are unchanged.
- Assets are **not** consumed by the Shell or any component. No Header, Footer or shared logo component exists.
- No route, dependency or lockfile change.
- M2B awaits independent repository diff audit and GitHub Actions CI success.
- M4 canonical shell integration, which owns runtime consumption of these assets, is deferred.

The M2B section above is a **baseline snapshot** taken at that milestone; for the current Shared UI state see the M3 note below.

## Milestone State Note — M3 Shared UI (2026-08-04)

The "Created Files Summary" and "Directory Tree" sections at the top of this document describe the M0 baseline and are historical snapshots. `src/shared/ui` is **no longer empty** — it is the implemented Shared UI layer.

### Structure

`src/shared/ui` is organised by family, each component owning a directory with its `.tsx` and co-located `.module.scss`:

```
src/shared/ui/
├── accessibility/VisuallyHidden/
├── actions/          Button, IconButton, Link + internal/
├── feedback/         Badge, Counter, ErrorSummary, InlineStatus, Status + internal/
├── forms/            Checkbox, Radio, Select, Switch, Textarea, TextField + internal/
├── internal/         class-names.ts
├── layout/           Grid, PageContainer, Stack + internal/
└── index.ts          the only barrel
```

Family-specific helpers live in that family's `internal/`; only `class-names.ts` is shared. There is no `index.ts` in any category, component or internal directory.

### Public API

`src/shared/ui/index.ts` is the **single** public entry point and exports exactly **18 runtime components**: `Badge`, `Button`, `Checkbox`, `Counter`, `ErrorSummary`, `Grid`, `IconButton`, `InlineStatus`, `Link`, `PageContainer`, `Radio`, `Select`, `Stack`, `Status`, `Switch`, `Textarea`, `TextField`, `VisuallyHidden`, plus their public types. Everything outside `src/shared/ui/**` imports from `@/shared/ui`; deep imports are prohibited and no private helper is exported.

### Runtime consumption

The technical Home placeholder (`src/routes/home/HomePage.tsx` and its route-local `HomePage.module.scss`) consumes all eighteen primitives as a **Shared UI verification surface**. It is explicitly not the canonical storefront Home and states so in visible copy.

- No Header, Footer, navigation shell or logo component exists.
- The six tracked brand SVGs remain **unconsumed** at runtime.
- Route registry, paths, titles, loaders, error boundaries and `RootLayout` are unchanged.

### State at report time

- Test suite: **522 tests across 36 files**; expected CI E2E: **23**.
- M3-01 through M3-04 are APPROVED AND CLOSED.
- **M3-05 awaits independent diff audit, GitHub Actions CI and user browser review.** M3 is not closed.
- M4 — canonical shell and runtime logo consumption — remains deferred.

**Superseded:** the two status lines above describe the state on 2026-08-04. M3-05 and the M3 milestone are now approved and closed, and the test baseline has since moved to 533 across 37 files. See [Milestone State Note — M3 Closure](#milestone-state-note--m3-closure-2026-08-06).

## Milestone State Note — M3-05B Dev MSW Bootstrap (2026-08-05)

The M0 sections above describe a repository in which MSW startup was configured but the worker asset had never been generated, so `npm run dev` rendered nothing. That claim of an operational development MSW setup was stale and is corrected here.

### Added in M3-05B

```
dev-public/
  mockServiceWorker.js                  generated by `npx msw init dev-public` from MSW 2.15.0,
                                        served only by the development server
src/app/
  render-bootstrap-failure.ts           plain-DOM fatal startup diagnostic, no Shared UI
scripts/
  verify-dev-bootstrap.mjs              dev server + headless Chromium regression gate
tests/bootstrap/
  bootstrap-failure.test.ts             8 tests for the failure path
```

### Modified in M3-05B

```
build-config.mjs                        dev.publicDir + getPublicDir(command, isPreview)
vite.config.ts                          consumes getPublicDir; base contract unchanged
src/app/bootstrap.tsx                   explicit serviceWorker.url from import.meta.env.BASE_URL
src/main.tsx                            bootstrap() rejection routed to renderBootstrapFailure
tests/vite-config.test.ts               3 publicDir contract tests
package.json                            verify:dev-bootstrap script, added to check:full;
                                        prettier scripts exclude the generated worker
.github/workflows/ci.yml                dedicated "Dev bootstrap" step
```

### State at report time

- The production artifact still **excludes** the worker: `publicDir` is `false` for build and preview, and `validate:build` rejects any `mockServiceWorker` file in `dist`.
- Test suite: **533 tests across 37 files**; expected CI E2E remains **23**, unchanged.
- No Shared UI, Home, route, shell, routing-lifecycle, style or asset change.
- `check:full` is no longer serverless — it runs the dev-bootstrap gate, which owns and releases its own server and browser.
- M3-05B awaits independent diff audit and GitHub Actions CI. The M3 browser review still has to be re-run.

**Superseded:** the line above describes the state on 2026-08-05. M3-05B and M3-05C are approved and closed, and the M3 browser review has since been re-run and approved. See [Milestone State Note — M3 Closure](#milestone-state-note--m3-closure-2026-08-06).

## Milestone State Note — M3 Closure (2026-08-06)

The sections above are historical snapshots taken at their own milestones and are not a current repository census. This note records the state at M3 closure.

### Current implemented state

- `src/shared/ui` exposes **18 runtime components** through one public barrel, `src/shared/ui/index.ts`.
- The technical Home placeholder (`src/routes/home/HomePage.tsx`) remains the Shared UI verification surface, and **all 18 components are consumed there**.
- The development MSW bootstrap is operational and CI-protected by the `Dev bootstrap` gate.
- Final test baseline: **533 tests across 37 files**.
- Production-preview E2E: **23**.
- Bundle: **407.10 KB raw / 122.19 KB gzip**.

### Closure evidence

- Approved implementation SHA: `2f8e37932b31a96dacb0c9d90e8b221d3120abd4`.
- GitHub Actions run **31069745421**, job **92514999778**, checked SHA `2f8e37932b31a96dacb0c9d90e8b221d3120abd4`, conclusion **success**.
- Final interactive browser review — **APPROVED**: `AUTOMATED + USER REVIEW PASSED`, exit code 0.
- Evidence class **FINAL-ELIGIBLE** — exact-SHA match on branch `main` with a clean tracked tree.
- **Zero blocking reasons.** Browser, context and server cleanup succeeded and the port was released.
- The one optional-evidence warning — `manual-final.png` not captured — is non-blocking by design and did not affect the result.
- Review artifacts (`artifacts/M3-browser-review.md`, `artifacts/m3-browser-review/results.json`) remain **untracked** local evidence.

### Current boundaries

- No canonical `Header`.
- No canonical `Footer`.
- No runtime logo component.
- The six tracked brand SVGs under `src/assets/brand/` remain **unconsumed** at runtime.
- The technical Home is **not** the canonical storefront Home and says so in visible copy.
- No M4 shell implementation exists yet.

### Milestone state

- **M3 — APPROVED AND CLOSED.**
- **M4 — NEXT PERMITTED IMPLEMENTATION MILESTONE AFTER M3-06 CI.**

## Milestone State Note — M4-01 Shell Destination Safety (2026-08-06)

The sections above are historical snapshots. This note records the state after the first M4 implementation stage.

### Stage identity

- Stage: **M4-01 — Shell destination safety and composition boundary**, corrected by **M4-01A — Catalog family catch-all correction and CI reconciliation**.
- M4-01 baseline SHA: `7db61d2eb41c56fcdc43531f21e1fe64db730604` (M3-06 closure commit).
- M4-01 commit: `dcf5008652061b6618ef32fab685e4362ea62bf6`.
- M4-01A baseline SHA: `dcf5008652061b6618ef32fab685e4362ea62bf6`. Its own resulting commit SHA cannot be embedded inside that commit; it is recorded in the untracked stage handoff.

### Added in M4-01

```
src/app/routing/carriers.ts               typed carrier route descriptors, shared notice and label
src/routes/carrier/RouteCarrierPage.tsx   the single neutral technical carrier presentation
tests/routing/route-carriers.integration.test.tsx
tests/e2e/route-carriers.spec.ts
docs/05-implementation/m4-canonical-shell-report.md
```

### Modified in M4-01

```
src/app/routing/registry.ts               carrier keys and metadata; trailing-slash and kebab-case invariants
src/app/composition/create-runtime.ts     carrier routes registered before the catch-all
tests/routing/registry.test.ts            table-driven carrier and baseline-identity coverage
```

### Carrier route inventory

Nineteen public routes, all rendered by one shared neutral carrier presentation and all registered before the catch-all:

`/search`, `/comparison`, `/favorites`, `/auth`, `/delivery-and-payment`, `/warranty-and-returns`, `/loyalty`, `/help`, `/contacts`, `/promotions`, `/brands`, `/shops`, `/service-centers`, `/about`, `/blog`, `/track-order`, `/privacy-policy`, `/user-agreement`, `/public-offer`.

No `/catalog` root route was added; the future Catalog entry remains the existing `/catalog/laptops`.

### State at report time

- Existing `home`, `catalog.category`, `catalog.product`, `cart` and `error.notFound` identities are **unchanged**, and the catch-all is still unique and last.
- The M1 title, focus, scroll and announcement lifecycle is **unchanged**; `RootLayout` remains the only root layout and route-lifecycle owner.
- **No canonical shell visuals exist**: no Header, Footer, Information Bar, search form, Catalog button, newsletter, sticky behaviour or responsive shell styling.
- **No runtime brand consumption**: the six tracked brand SVGs under `src/assets/brand/` remain unconsumed, and no runtime logo component exists.
- `src/shared/ui` public API is unchanged at **18 runtime components**; no dependency, `package.json` or lockfile change.
- Test suite: **697 tests across 39 files**, up from 533 in 37. Expected CI E2E grows by the data-driven carrier scenario.
- Bundle: raw **410.20 KB** / gzip **123.43 KB**, up from 407.10 KB / 122.19 KB.
- Local checks pass, including `npm run check:full`. **Local E2E was not run** — the production-preview lifecycle belongs to CI or a user-owned preview.

### M4-01 CI failure and the M4-01A correction

CI for the M4-01 commit `dcf5008652061b6618ef32fab685e4362ea62bf6` — run **31074911879**, job **92530710353** — concluded **failure**. Every step through `Build` and `Validate build` passed; `E2E tests` reported **48 passed, 1 failed** on the initial attempt and both retries.

Confirmed root cause: `catalog-family` was declared with `path: 'catalog'` while its only child used `path: ':categorySlug'`, and the parent had neither a renderable element nor an index route. `/catalog` therefore matched the empty parent and rendered a bare outlet instead of falling through to the global catch-all, so the E2E assertion that `/GoodCall/catalog` renders `Page not found` correctly failed. The defect escaped local verification because the M4-01 integration tests declared their own simplified route trees rather than the production one.

M4-01A corrects it: `catalog-family` becomes a pathless grouping route that keeps `CatalogErrorBoundary`, and the category child owns `catalog/:categorySlug`. `createApplicationRoutes()` moved to `src/app/composition/application-routes.ts` so serverless tests can exercise the same route objects production uses, and a regression test proven red-then-green covers `/catalog`.

- **`/catalog` remains intentionally unregistered** — no route, redirect, index page or carrier. It resolves to the existing catch-all.
- **`/catalog/laptops` remains valid** and unchanged, through the same route ID, lazy module and loader.
- M4-01A is **APPROVED AND CLOSED**: commit `ec1b113a30c64a6da9175b99e24199cf51b5af27`, GitHub Actions run **31076416986**, job **92535335985**, conclusion **success** — Vitest 697 passed in 39 files, Playwright 49 passed — and the independent audit approved it. M4-01 is closed through M4-01A.

## Milestone State Note — M4-02 Runtime Brand Integration (2026-08-06)

### Stage identity

- Stage: **M4-02 — Runtime brand/logo integration**.
- Baseline SHA: `ec1b113a30c64a6da9175b99e24199cf51b5af27` (M4-01A closure commit).
- The resulting M4-02 commit SHA cannot be embedded inside its own commit; it is recorded in the untracked stage handoff.

### Added in M4-02

```
src/app/shell/brand/
  brand-assets.ts                 typed exhaustive selection over the six approved imports
  BrandHomeLink.tsx               named Home link with a decorative brand visual
  BrandHomeLink.module.scss       sizing minimums, contain fit, mask and focus styles
  index.ts                        the @/app/shell/brand public boundary
tests/app/shell/
  brand-home-link.test.tsx        component contract across all six combinations
  brand-runtime-mount.test.tsx    mount behaviour against the real application route tree
tests/e2e/brand-home-link.spec.ts production-preview brand evidence
```

### Modified in M4-02

```
src/app/shell/RootLayout.tsx                          transitional brand slot after the skip link
src/app/shell/Shell.module.scss                       transitional slot padding
tests/brand-assets.test.ts                            integration-status assertion only
tests/e2e/route-carriers.spec.ts                      carrier Home-link lookups made exact
docs/05-implementation/m2-brand-asset-manifest.json   runtime-integrated; stale risk replaced
docs/05-implementation/m2-brand-assets-report.md      M4 runtime-integration addendum
docs/05-implementation/m4-canonical-shell-report.md   M4-01A closure and the M4-02 section
```

### State at report time

- The runtime brand boundary is **application-shell owned** and published from `@/app/shell/brand`. It is not exported from `src/shared/ui`.
- **All six approved lockup/variant combinations** — horizontal and symbol × primary, inverse and monochrome — are integrated through a typed exhaustive selection table and covered by unit tests.
- The **primary horizontal** variant is the current runtime mount: exactly one brand Home link, in a transitional `RootLayout` slot after the skip link, with the accessible name `GoodCall — на главную`.
- Monochrome variants render through a CSS mask so the visible colour resolves from the consumer's `currentColor`; primary and inverse render as imported images.
- **All six SVG byte sizes and SHA-256 values are unchanged**, and the existing hash, geometry and forbidden-markup assertions remain intact.
- **No Header, Footer, Information Bar, Newsletter, Search or Catalog UI** exists. The transitional slot is scaffolding; M4-04 will relocate the component into the canonical Header and M4-07 may reuse it in the Footer.
- No Shared UI API change, no dependency or lockfile change, no tooling, Vite, Playwright or workflow change, and no route inventory or routing-lifecycle change.
- Test suite: **742 tests across 41 files**, up from 697 in 39. Bundle: raw **415.49 KB** / gzip **124.67 KB**.
- Local checks pass, including `npm run check:full`. **Local E2E was not run** — the production-preview lifecycle belongs to CI or a user-owned preview.

### M4-02 CI failure and the M4-02A correction

CI for the M4-02 commit `c234ad8dabb6db78da0ac5dab1b6bb67b6a28ddd` — run **31078039148**, job **92540284189** — concluded **failure**. Vitest passed (742 in 41 files); Playwright reported **57 total, 50 passed, 5 failed, 2 flaky**.

All five blocking failures were the same axe rule, `region` — _All page content should be contained by landmarks_ — on the violating node `<div class="brand-slot">`: the two `bootstrap.spec.ts` axe scans (Home and 404), the reduced-motion/forced-colors scenario, and the two `route-carriers.spec.ts` axe scans. Root cause: the transitional brand slot held meaningful interactive content outside the route-owned `main` and inside no landmark.

Two further tests were flaky for test-synchronization reasons, not runtime defects: the skip-link focus-order test depended on a nondeterministic initial focus position after `page.goto()`, and the carrier heading-focus test read `document.activeElement` before the `requestAnimationFrame` focus callback ran.

M4-02A corrects both classes:

- the transitional brand slot is now a semantic `header`, making it the page-level **banner landmark**; it stays outside `main`, carries no `role` and no `aria-label`, and preserves the skip link as the first focusable control;
- the skip-link E2E establishes a deterministic neutral focus origin before pressing `Tab`, and the heading-focus E2E uses Playwright's auto-waiting `toBeFocused()`. No runtime tab order, focus lifecycle, Playwright configuration, retry count or timeout was changed, and no sleep was added.

- **The canonical Header remains unimplemented.** The banner is transitional scaffolding; M4-04 owns the real Header.
- **The brand component and SVG asset contract are unchanged**: `BrandHomeLink` API, asset selection matrix, mask strategy, accessible name, all six SVG byte lengths and SHA-256 values, and the manifest `runtime-integrated` statuses.
- Test suite: **746 tests across 41 files**. Bundle unchanged at raw 415.49 KB / gzip 124.67 KB.
- M4-02A is **APPROVED AND CLOSED**: commit `b7be1bdccd03c72ad00bea0cc8653f8f8926e7c4`, GitHub Actions run **31079420627**, job **92544592644**, conclusion **success** — Vitest 746 passed in 41 files, Playwright **57 passed, 0 failed, 0 flaky** — and the independent audit approved it. M4-02 is closed through M4-02A.

## Milestone State Note — M4-03 Information Bar (2026-08-06)

### Stage identity

- Stage: **M4-03 — Information Bar**.
- Baseline SHA: `b7be1bdccd03c72ad00bea0cc8653f8f8926e7c4` (M4-02A closure commit).
- The resulting M4-03 commit SHA cannot be embedded inside its own commit; it is recorded in the untracked stage handoff.

### Added in M4-03

```
src/app/shell/information-bar/
  information-bar-items.ts        typed service-link configuration resolved from the route registry
  InformationBar.tsx              service navigation landmark, city context, disclosure, links
  InformationBar.module.scss      neutral strip, responsive disclosure, focus and current-route styles
  index.ts                        the @/app/shell/information-bar public boundary
tests/app/shell/
  information-bar-items.test.ts             configuration contract
  information-bar.test.tsx                  component semantics and disclosure behaviour
  information-bar-runtime-mount.test.tsx    real application route-tree integration
tests/e2e/information-bar.spec.ts           production-preview responsive, keyboard and axe evidence
```

### Modified in M4-03

```
src/app/shell/RootLayout.tsx                          Information Bar mounted before the transitional banner
tests/app/shell/brand-runtime-mount.test.tsx          two M4-02A assertions rescoped for the new landmark
docs/05-implementation/m4-canonical-shell-report.md   M4-02A closure and the M4-03 section
```

### State at report time

- The Information Bar is **application-shell owned** and published from `@/app/shell/information-bar`.
- **Five route-safe service destinations** in canonical order — `/delivery-and-payment`, `/warranty-and-returns`, `/loyalty`, `/help`, `/contacts` — resolved at module load from the existing route registry. No route key, path, ID, route object or carrier page changed.
- The city is **static display context**: visible `Москва`, programmatic `Текущий город: Москва`. There is **no city selector, no geolocation, no auto-detection, no persistence and no confirmation state**.
- Exactly one navigation landmark named **`Сервисная навигация`**.
- Below 64rem the city stays visible and the five links follow a single `Информация и помощь` disclosure, closed by default; at 64rem and above the links are inline and the disclosure button is hidden. One DOM instance serves both ranges, with no JavaScript viewport detection and no new breakpoint.
- The bar is **not sticky**. The current service destination carries `aria-current="page"` with a non-colour-only treatment.
- Root order: skip link → route announcement → pending announcement → Information Bar → transitional brand banner → `ScrollRestoration` → outlet. Skip link remains first focusable; exactly one banner, one `main#main-content` and one `h1` remain; the M1 title/focus/scroll/announcement lifecycle is unchanged.
- **No primary Header implementation**, no Catalog control, Search, Compare, Favorites, Cart, Account, Footer or Newsletter.
- No Shared UI API, dependency, lockfile, asset, brand, manifest, route, tooling or workflow change.
- Test suite: **791 tests across 44 files**, up from 746 in 41. Bundle: raw **419.75 KB** / gzip **125.66 KB**.
- Local checks pass, including `npm run check:full`. **Local E2E was not run** — the production-preview lifecycle belongs to CI or a user-owned preview.

### M4-03 CI failure and the M4-03A correction

CI for the M4-03 commit `71a0addfb8e461affd91d788fde493fce5acb765` — run **31083387582**, job **92557147682** — concluded **failure**. Vitest passed (791 in 44 files); Playwright reported **77 total, 65 passed, 12 failed, 0 flaky**, with every failure reproduced on the initial attempt and both retries.

All twelve failures were test defects, not runtime defects:

- one obsolete brand focus-order expectation, still asserting `skip link → BrandHomeLink` after M4-03 intentionally inserted the disclosure between them;
- ten invalid exact city locators — `getByText('Москва', { exact: true })` cannot match, because the city paragraph's full text is `Текущий город: Москва` by design;
- one unstable forced-colors focus origin, which reset focus after pointer activation and assumed sequential navigation would restart from the document beginning.

The independent audit additionally found that the service `NavLink` lacked `end` (so `/help/unknown` could mark `/help` current), that the public barrel re-exported internals no consumer needed, and that `artifacts/` was untracked but not excluded.

M4-03A corrects all of it without touching the Information Bar's visual or structural design:

- **exact `aria-current` matching** — `end` on each service `NavLink`; `/help`, `/help?source=bar` and `/help#section` are current, while `/help/unknown` and unrelated routes are not;
- **corrected test synchronization and selectors** — one city helper asserting the unique paragraph's full text `Текущий город: Москва`, a compact-viewport brand focus-order test proving `skip link → disclosure → brand link` by real `Tab` presses, and a forced-colors test that establishes its focus origin before opening the disclosure with `Enter` and reaches `Помощь` by keyboard;
- **narrowed public boundary** — `@/app/shell/information-bar` exports only `InformationBar`;
- **RTE-001 now locally excluded** through `.git/info/exclude`, verified by `git check-ignore`; the tracked `.gitignore` is unchanged and the screenshot remains local and uncommitted.

- **No visual, CSS, RootLayout, route, dependency, Shared UI, asset, tooling or workflow change.**
- Test suite: **803 tests across 44 files**. Bundle essentially unchanged at raw 419.76 KB / gzip 125.66 KB.
- M4-03A is **APPROVED AND CLOSED**: commit `54d9eb954fda1b582db49c1d3df217d8ea6723ca`, GitHub Actions run **31085424042**, job **92563626221**, conclusion **success** — Vitest 803 passed in 44 files, Playwright **78 passed, 0 failed, 0 flaky**. The independent technical audit approved it and the user confirmed the wide inline, compact closed and compact open visual states. M4-03 is closed through M4-03A.

## Milestone State Note — M4-04 Primary Header Core (2026-08-06)

### Stage identity

- Stage: **M4-04 — Primary Header core: Catalog entry and Global Search**.
- Baseline SHA: `54d9eb954fda1b582db49c1d3df217d8ea6723ca` (M4-03A closure commit).
- The resulting M4-04 commit SHA cannot be embedded inside its own commit; it is recorded in the untracked stage handoff.

### Added in M4-04

```
src/app/shell/site-header/
  header-core-config.ts           registry-derived destinations, canonical labels, query helpers
  GlobalSearchForm.tsx            named search form with validation and URL synchronization
  GlobalSearchForm.module.scss    search composition
  SiteHeader.tsx                  banner, brand, primary navigation, Catalog, Search
  SiteHeader.module.scss          Header surface and responsive composition
  index.ts                        the @/app/shell/site-header public boundary
tests/app/shell/
  header-core-config.test.ts             configuration and public-barrel contract
  global-search-form.test.tsx            search semantics, sync, submit, validation
  site-header.test.tsx                   landmarks, Catalog, canonical order, deferred actions
  site-header-runtime-mount.test.tsx     real application route-tree integration
tests/e2e/site-header.spec.ts            responsive, keyboard, Catalog, Search and axe evidence
```

### Modified in M4-04

```
src/app/shell/RootLayout.tsx                          transitional brand banner replaced by SiteHeader
src/app/shell/Shell.module.scss                       obsolete brand-slot rule removed
tests/app/shell/brand-runtime-mount.test.tsx          one M4-02A assertion rescoped for the Header navigation
docs/05-implementation/m4-canonical-shell-report.md   M4-03A closure and the M4-04 section
```

### State at report time

- The **primary `SiteHeader`** is application-shell owned and published from `@/app/shell/site-header`, which exports only `SiteHeader`.
- **The brand moved into the canonical Header.** The transitional brand banner is gone; `BrandHomeLink` is consumed unchanged through `@/app/shell/brand` and keeps its `GoodCall — на главную` name.
- **Catalog is a temporary route-safe entry** to `/catalog/laptops`, derived from the existing `catalog.category` route with `generatePath` and the schema-validated representative slug `laptops`. **`/catalog` remains unregistered** and still reaches the global catch-all; the current state does not leak to other category paths.
- One **primary navigation** named `Основная навигация`, alongside the Information Bar's separate `Сервисная навигация`.
- One **always-visible Search form** named `Поиск по каталогу`, with a persistently visible label, `type="search"`, `name="q"` and a `Найти` submit. It navigates to `/search?q=…` through Router history, trims the query, synchronises from the URL, and shows the local error `Введите поисковый запрос.` for an empty query without navigating.
- Canonical Header order is **Logo → Catalog → Search** in both DOM and focus order; no Compare, Favorites, Cart or Account action exists and no empty placeholder was added.
- **Compact uses a two-row composition** — identity row, then a full-width Search row — and medium, wide and expanded compose one row. No new breakpoint and no JavaScript viewport detection.
- The **Header is not sticky**, and **no Header icon set** was introduced; text controls are the M4-04 boundary.
- No route, registry, carrier, loader, Shared UI, Foundations, asset, dependency, lockfile, Playwright or workflow change.
- Test suite: **869 tests across 48 files**, up from 803 in 44. Bundle: raw **424.50 KB** / gzip **126.86 KB**.
- Local checks pass, including `npm run check:full`. **Local E2E was not run** — the production-preview lifecycle belongs to CI or a user-owned preview.
- **CI is pending at commit time**, and **user visual confirmation against RTE-001 and CMP-001 is pending**.
- **M4-05 is blocked** until M4-04 exact-SHA green CI, independent audit and user visual confirmation all close.

## Milestone State Note — M4-04A Compact Header Layout Correction (2026-08-07)

### M4-04 exact-SHA red CI

CI for the M4-04 commit `9cc65787d6cd41b513931fdebbb682c1eb16f9e3` — run **31088410761**, job **92573279593** — concluded **failure** at the `E2E tests` step. Vitest passed (869 in 48 files); Playwright reported **108 total, 99 passed, 8 failed, 1 flaky**. The `playwright-report` artifact is ID **8962434188**, 1 484 191 bytes, archive SHA-256 `a4e210bcf0c832eb833e20ac8e5e91959c3d7c498a49a35bc2da9839678cd08d`.

The eight blocking failures split into two classes, and there was a third, separate flake:

- **seven test-premise failures** — the expanded 1440px scenario and the 1023/1024/1025/1279/1280/1281px scenarios compared the top coordinate of the raw Search **input** with the top of Brand or Catalog. The 14px difference is the persistently visible Search label above the input; the Header row aligns the complete Search form block. All seven reproduced through both retries;
- **one compact runtime defect** — at 320px the Header composed **three** rows (Brand 61px, Catalog 113px, then Search) instead of the canonical two, because `.identity` permitted wrapping while the horizontal logo rendered at its default 180px;
- **one flaky focus-origin scenario** — the Information Bar compact keyboard test failed on its initial attempt and passed on retry, because `document.body.focus()` does not reliably reset Chromium's sequential focus-navigation starting point.

M4-04 was not accepted on that SHA and user visual confirmation was not performed.

### M4-04A corrective implementation state

- Baseline SHA `9cc65787d6cd41b513931fdebbb682c1eb16f9e3`; the resulting M4-04A commit SHA cannot be embedded inside its own commit and is recorded in the untracked stage handoff.
- **The compact first row now holds Brand and Catalog together.** `.identity` is `flex-wrap: nowrap`, and `SiteHeader` passes a Header-owned `brand-link` class to the existing `BrandHomeLink` through its existing `className` prop.
- **The compact horizontal logo renders at 120px and is restored to 180px at 48rem**, scoped entirely from `SiteHeader.module.scss`. `BrandHomeLink`, its stylesheet, its public API, its default sizing for other consumers and the brand SVGs are unchanged; the primary horizontal lockup is retained and never falls below 120px.
- **Search remains the full-width second row below 48rem** and shares one Header row at and above it. The visible Search label was neither hidden nor moved.
- **Complete Search-form geometry replaces raw input-top alignment** in the wide and expanded E2E evidence, with explicit non-null bounding-box checks instead of `?? 0` fallbacks. The 767/768/769px scenarios are retained and the viewport matrix was not widened.
- **A shared test-only focus sentinel replaces `document.body.focus()`** for the affected traversals: `tests/e2e/support/focus-origin.ts` mounts a `tabIndex = -1` sentinel before the application root, verifies it became the active element, keeps it mounted through the Tab sequence and removes it in `finally`. Migrated: the Information Bar compact keyboard and forced-colors traversals, the Header compact and wide keyboard traversals, and the brand document-start traversal. Runtime focus order is unchanged.
- Bounded serverless evidence in `tests/app/shell/site-header.test.tsx` guards the Header-owned brand class, compact 120px ownership, the non-wrapping identity row and the 48rem restoration, without a CSS parser and without claiming jsdom performs layout.
- No Search, route, registry, carrier, Information Bar runtime, Shared UI, Foundations, dependency, lockfile, asset, tooling, Playwright config or workflow change. No Header redesign and no M4-05 action.
- Test suite: **880 tests across 48 files**, up from 869. Bundle: raw **424.75 KB** / gzip **126.90 KB**.
- Local checks pass, including `npm run check:full`. **Local E2E was not run** — the production-preview lifecycle belongs to CI or a user-owned preview.
- **CI is pending at commit time**, and **user visual confirmation against RTE-001 and CMP-001 is pending**.
- This M4-04A gate statement is superseded by M4-04B. M4-05 is now unblocked by the approved M4-04B closure, while runtime M4-05 remains pending the M4-05-ICN asset gate.

## Milestone State Note — M4-04B Deterministic Keyboard Focus Origin (2026-08-07)

### M4-04A exact-SHA CI — green workflow, not acceptable

CI for the M4-04A commit `c82f54adb4438a3068ff5093570d99e50cdd6f90` — run **31136136192**, job **92735794125** — concluded **success** at workflow level, with every step green including `E2E tests`. The run was nonetheless **not acceptable**: Vitest passed **880 in 48 files**, but Playwright reported **108 total, 107 passed, 0 failed after retries, 1 flaky**, in a suite lasting roughly 41.0s. No failure artifact was uploaded, because the uploader is gated on `if: failure()` and the E2E step exited successfully.

The workflow was green only because Playwright's retry recovered the failing test. Playwright exits 0 when a test fails and then passes on retry, so a green workflow does not establish a zero flaky count, and the stage gate requires zero.

**Flaky scenario:** `tests/e2e/site-header.spec.ts` → `M4-04 primary Header core` → `compact keyboard order reaches Header controls after the Information Bar`. On its first attempt, after the sentinel was installed and the first `Tab` was pressed, the expected skip link `a[href="#main-content"]` was not focused; the retry passed.

**Root cause:** the M4-04A sentinel used `tabIndex = -1`, which makes an element programmatically focusable but keeps it **outside sequential Tab order**. Becoming `document.activeElement` — the property the helper actually asserted — is weaker than being a valid sequential-navigation origin, so the following `Tab` was not guaranteed to advance to the next element in document order.

The compact runtime correction and the geometry evidence were unaffected. M4-04A is **not accepted** and M4-04 is **not closed through it**.

### M4-04B corrective implementation state

- Baseline SHA `c82f54adb4438a3068ff5093570d99e50cdd6f90`; the resulting M4-04B commit SHA cannot be embedded inside its own commit and is recorded in the untracked stage handoff.
- **The sentinel now uses `tabIndex = 0`**, so it genuinely participates in sequential focus order and `Tab` deterministically advances to the next tabbable element in document order. It is inserted immediately before `#root`, verified through `nextElementSibling`.
- The sentinel is visually non-disruptive and layout-neutral — `position: fixed`, 1px × 1px, `opacity: 0`, `pointer-events: none`, no text — focused with `preventScroll: true`, with the scroll position asserted unchanged.
- Focus stability is verified before the traversal: `toBeFocused()`, then a bounded rendering turn of two nested `requestAnimationFrame` callbacks, then `toBeFocused()` again. No `waitForTimeout` and no arbitrary sleep.
- Cleanup removes any previous sentinel before installing a new one, runs in `finally`, tolerates a closed page, and asserts removal only when the traversal succeeded, so cleanup can never mask a traversal failure.
- **The helper remains test-only and centralized.** All five document-start traversals — the Header compact and wide keyboard tests, the Information Bar compact keyboard and forced-colors tests, and the brand shell traversal — share it, keep their approved sequences and keep pressing real `Tab` keys. No assertion was weakened and no traversal became a DOM-order-only check.
- **Runtime Header, Information Bar, brand and focus lifecycle are unchanged.** No runtime file changed at all; no spec file needed changing either, because the helper's public API is unchanged.
- No route, Shared UI, Foundations, asset, dependency, lockfile, tooling, Playwright config or workflow change. No timeout or retry change.
- Test suite unchanged: **880 Vitest tests across 48 files**, 108 Playwright scenarios. Bundle unchanged at raw **424.75 KB** / gzip **126.90 KB** — the change ships nothing.
- Local checks pass, including `npm run check:full`. **Local E2E was not run** — the production-preview lifecycle belongs to CI or a user-owned preview.
- **CI is pending at commit time**, and **user visual confirmation against RTE-001 and CMP-001 is pending**.
- M4-04B is **APPROVED AND CLOSED**: commit `d7b02e0169391177b6cd4641d598b8a10bdaf553`, GitHub Actions run **31138021965**, job **92741720296**, conclusion **success** — Vitest **880 passed in 48 files**, Playwright **108 passed, 0 failed, 0 flaky**, no retry marker. The independent technical audit approved it, and the user confirmed the visual result at **1440px**, **768px** and **320px**.
- M4-04A is **CLOSED THROUGH M4-04B**.
- M4-04 is **APPROVED AND CLOSED THROUGH M4-04A AND M4-04B**.
- M4-05 is unblocked, but runtime implementation has not started. The M4-05-ICN shell icon asset prerequisite is the current asset-only stage.

## Milestone State Note — M4-05-ICN Application-Owned Shell Icon Set (2026-08-07)

### Stage identity

- Stage: **M4-05-ICN — Application-owned shell icon set**.
- Baseline SHA: `d7b02e0169391177b6cd4641d598b8a10bdaf553` (M4-04B closure commit).
- The resulting M4-05-ICN commit SHA cannot be embedded inside its own commit and is recorded in the untracked stage handoff.

### Added in M4-05-ICN

```
src/assets/icons/shell/
  catalog.svg                      Catalog/category access source icon
  search.svg                       Search source icon
  comparison.svg                   Product comparison source icon
  favorites.svg                    Favorites/saved-items source icon
  cart.svg                         Cart source icon
  account.svg                      Guest Account/Auth source icon
docs/05-implementation/
  m4-shell-icon-asset-manifest.json
  m4-shell-icon-assets-report.md
tests/
  shell-icon-assets.test.ts
```

### Current icon inventory

Six application-owned shell SVG assets now exist under `src/assets/icons/shell/`: `catalog`, `search`, `comparison`, `favorites`, `cart` and `account`.

All six use `viewBox="0 0 24 24"`, intrinsic `24 × 24`, a shared `1.9` rounded outline stroke, transparent background and paint limited to `#000000` and `none`. They are monochrome mask-compatible sources; consuming components own color, labels, accessible names, route semantics, current-route state, counters and forced-colors behavior.

### Asset governance

- Manifest: `docs/05-implementation/m4-shell-icon-asset-manifest.json`.
- Report: `docs/05-implementation/m4-shell-icon-assets-report.md`.
- Source-level validation: `tests/shell-icon-assets.test.ts`.
- Local review artifact: `artifacts/m4-05/review/shell-icon-contact-sheet.png`, `2200 × 1500`, `142 827` bytes, SHA-256 `1c01b1d35849ebc798e5874d93c1331c65d23dcf8648d1989f1f1210b57d68ef`, regenerated from the actual SVG file bytes, ignored and uncommitted.

The manifest status remains `approvalStatus: awaiting-independent-asset-audit-and-user-visual-confirmation` and `integrationStatus: produced-not-integrated`.

### M4-05-ICN-A correction state

- M4-05-ICN exact-SHA CI succeeded for commit `cd971f954649c83415056db56386544bf4b2e274`: workflow run `31142675965`, job `92755640110`, Vitest **920 passed in 49 files**, shell icon asset suite **40 passed**, Playwright **108 passed**, **0 failed**, **0 flaky**, build **success**, workflow conclusion **success**.
- The technical asset contract was approved for the family, and Catalog, Search, Favorites, Cart and Account remain approved and byte-identical to the M4-05-ICN baseline.
- `comparison.svg` was corrected through **M4-05-ICN-A** because the prior two rounded panels with internal list marks read ambiguously as server racks, columns, devices or lists and was too close to Catalog at 16px and 20px.
- M4-05-ICN-A exact-SHA CI succeeded for commit `69c0eca78e91cd66acad7f031d756454bd90dea5`: workflow run `31144366072`, job `92760669561`, Vitest **921 passed in 49 files**, shell icon asset suite **41 passed**, Playwright **108 passed**, **0 failed**, **0 flaky**, build **success**, workflow conclusion **success**.
- The M4-05-ICN-A technical correction was valid, but the visual gate failed only for Comparison. The center-converging marker collapsed at 16px, read as a clasp at 20px, and merged into a diamond or bow-tie at 24px and 32px.

### M4-05-ICN-B correction state

- `comparison.svg` was corrected through **M4-05-ICN-B** by replacing the center-converging marker with Option A: two separated directional rows.
- The final Comparison metaphor keeps two simplified product/card entities, with an upper left-to-right row and a lower right-to-left row. Catalog remains a four-tile category grid, and the separated marker makes Comparison structurally distinct from Catalog without refresh, sync or circular-arrow semantics.
- Catalog, Search, Favorites, Cart and Account remain byte-identical to the M4-05-ICN baseline.
- `tests/shell-icon-assets.test.ts` preserves the prior source asset contract and now rejects the M4-05-ICN-A converging marker, the original list-column marks and circular-arrow path commands.
- CI is pending at commit time for M4-05-ICN-B. User visual confirmation is pending.

### State at report time

- No Header action runtime markup exists yet.
- No runtime source imports the shell icons.
- No route, Shared UI, dependency, lockfile, CSS, tooling or workflow change.
- No brand asset edit.
- The six icons are produced but not approved and not integrated.
- Runtime M4-05 remains blocked pending independent asset audit, exact-SHA CI and user visual confirmation of the regenerated contact sheet.

## Milestone State Note — M4-05 Header Route Actions (2026-08-07)

### Icon prerequisite closure

M4-05-ICN-B — commit `3737da32b4e420f18cdb7b71a54424875dcf3820`, run **31145480483**, job **92763895227** — concluded **success**: Vitest **921 passed in 49 files**, shell icon asset suite **41 passed**, Playwright **108 passed, 0 failed, 0 flaky**, build success. The full job log was independently inspected. The independent asset audit approved the set and the user confirmed the complete six-icon contact sheet.

M4-05-ICN-B is **APPROVED AND CLOSED**; M4-05-ICN-A is **CLOSED THROUGH M4-05-ICN-B**; M4-05-ICN is **APPROVED AND CLOSED**. That unblocked runtime M4-05.

### M4-05 implementation state

- Baseline SHA `3737da32b4e420f18cdb7b71a54424875dcf3820`; the resulting M4-05 commit SHA cannot be embedded inside its own commit and is recorded in the untracked stage handoff.
- **Four Header route actions** were added as navigation-only `NavLink` entries resolved from the existing route registry: `Сравнение` → `/comparison`, `Избранное` → `/favorites`, `Корзина` → `/cart`, `Войти` → `/auth`. No route was added, renamed or altered.
- **Guest `Войти` baseline.** The Account action is the guest authentication entry only — no avatar, profile name, initials, dropdown, chevron, logout or session state.
- **One user navigation landmark** named `Пользовательская навигация`, alongside the Information Bar's `Сервисная навигация`, the Header's `Основная навигация` and the `Поиск по каталогу` search landmark. The actions were not merged into the Information Bar.
- **Four runtime-integrated assets.** `comparison.svg`, `favorites.svg`, `cart.svg` and `account.svg` are `runtime-integrated`; `catalog.svg` and `search.svg` remain `approved-not-integrated`, because the Catalog control keeps its text label and Search keeps its visible label and text submit. All six SVG files are byte-identical to their approved identities.
- Icons are imported as Vite asset URLs only inside `src/app/shell/site-header/header-actions-config.ts` and rendered through a CSS mask on a decorative `aria-hidden` span at a **20px** box, with `background-color: currentcolor` and a `canvastext` fallback under forced colours. No SVG path geometry is inlined into TSX and no icon package was added.
- **Labels are visible at wide and expanded (≥ 64rem)** and visually hidden at medium and compact, where the actions are icon-first. The exact programmatic names are constant at every range, supplied by `aria-label` on the link.
- **Compact (< 48rem) uses a three-row Header** — identity/Catalog, full-width Search, then a four-equal-column action row. Medium uses two rows; wide and expanded use one row. Every action target is at least 44 × 44 CSS px.
- **No counters, badges, notification dots, cart total or domain state.** No count prop or global count owner exists; counters are omitted while no approved runtime owner provides a value.
- Exact `NavLink` `end` matching drives `aria-current="page"`; query and hash preserve it, and longer or unrelated paths do not inherit it. The current action is indicated by a border and weight rather than colour alone.
- The **Header remains non-sticky**, the public `@/app/shell/site-header` barrel still exports only `SiteHeader`, and route heading focus, title, scroll and announcement ownership remain with the existing M1 lifecycle.
- No route, registry, carrier, Shared UI, Foundations, dependency, lockfile, asset, tooling, Playwright config or workflow change.
- Test suite: **979 tests across 51 files**, up from 921 in 49. Bundle: raw **430.50 KB** / gzip **128.07 KB**.
- Local checks pass, including `npm run check:full`. **Local E2E was not run** — the production-preview lifecycle belongs to CI or a user-owned preview.
- **CI is pending at commit time**, and **user visual confirmation at expanded, wide, medium and compact widths is pending**.
- **M4-06 remains blocked** until M4-05 exact-SHA green CI, independent audit and user visual confirmation all close.

## Next Repository Modifications

The current implementation milestone is **M4**, whose scope must be taken from the approved architecture and UI/component/responsive contracts.

**M4-06 must not begin** until the M4-05 exact-SHA CI, independent audit and user visual confirmation at expanded, wide, medium and compact widths all close.
