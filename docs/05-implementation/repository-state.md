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
playwright.config.ts            Chromium, /GoodCall/ preview base
postcss.config.mjs              Autoprefixer
prettier.config.mjs             2-space, single quotes, no semicolons (false)
stylelint.config.mjs            SCSS, selector nesting limits
eslint.config.js                Flat config, TypeScript, React hooks, a11y
index.html                      Root entry point, module type script
README.md                        Setup, scripts, architecture, Pages notes
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
    index.scss                  Imports foundations
    foundations/
      reset.scss                * reset, html, body, a, button, input
      typography.scss           h1-h6, p sizing
      color.scss                Light/dark color-scheme support, link colors
      accessibility.scss        Focus-visible, reduced-motion, forced-colors
    tools/                      (empty, placeholder for future mixins)
  mocks/
    index.ts                    MSW setupWorker (no handlers in M0)
```

### Testing (`tests/`)

```
tests/
  setup.ts                      Vitest globals, RTL cleanup, jest-dom
  smoke.test.tsx                4 tests: render, h1 role, main landmark, skip link
  e2e/
    bootstrap.spec.ts           Playwright: render, skip link, landmark, axe scan
  support/
    test-utils.tsx              Custom render with Providers, BrowserRouter
```

### Build & Deployment Scripts (`scripts/`)

```
scripts/
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

## Next Repository Modifications

M0 is complete. Future milestones will add:

- M1: Route composition, data fetching, state management
- M2+: Business domain, authentication, UI components, styling
- Later: Design system, performance optimizations, analytics

No breaking changes to M0 configuration files are anticipated, but architecture zone dependencies may evolve as permitted by 04A-C contracts.
