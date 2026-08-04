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

## Next Repository Modifications

M0 is complete. Future milestones will add:

- M1: Route composition, data fetching, state management
- M2+: Business domain, authentication, UI components, styling
- Later: Design system, performance optimizations, analytics

No breaking changes to M0 configuration files are anticipated, but architecture zone dependencies may evolve as permitted by 04A-C contracts.
