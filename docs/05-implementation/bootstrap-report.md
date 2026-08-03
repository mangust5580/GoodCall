# M0 Bootstrap Implementation Report

## Summary

GoodCall M0 bootstrap successfully initialized a greenfield React SPA repository with:

- ✅ Complete TypeScript configuration (strict mode, no-emit)
- ✅ Vite build tooling with React plugin
- ✅ ESLint, Stylelint, Prettier, PostCSS/Autoprefixer
- ✅ Vitest + React Testing Library + Playwright E2E
- ✅ MSW mock setup (dev/test only)
- ✅ GitHub Actions CI/CD workflows
- ✅ GitHub Pages artifact preparation and validation
- ✅ Neutral technical application shell with skip link, accessible routing
- ✅ All required npm scripts
- ✅ Documentation

## Configuration Decisions

### Base Path

**Decision**: Use `APP_BASE_PATH = '/GoodCall/'` constant in `src/app/config/base.ts`.

**Why**: Single source of truth that can be reused as React Router basename and in build configuration. Deterministic and maintainable.

**Implementation**:

- `vite.config.ts`: `build.base` set to `/GoodCall/`
- `playwright.config.ts`: Web server uses `baseURL: http://localhost:4173`
- `src/app/routing/index.tsx`: `BrowserRouter basename={APP_BASE_PATH}`
- All relative navigation automatically resolves correctly

### Storage/Deployment Identity

**Decision**: Use `STORAGE_ID = 'goodcall-github-pages'` in config.

**Why**: Normalized stable deployment identity for analytics, storage, and cache keys when M1+ features require them.

### SCSS Organization

**Decision**: Global foundations only; component styles use SCSS Modules.

**Why**: Prevents global pollution, maintains component encapsulation, supports future design system scaling.

**Structure**:

- `src/styles/foundations/` — reset, typography, color, accessibility
- `src/app/shell/Shell.module.scss` — technical shell only

### MSW Configuration

**Decision**: MSW configured to start only in development (`import.meta.env.DEV` guard in `src/main.tsx`).

**Why**: Prevents accidental mock interception in production. Worker script is not included in dist/.

**Validation**: `scripts/validate-build.mjs` explicitly checks for absence of `mockServiceWorker.js`.

## Technology Versions

See [tooling-versions.md](tooling-versions.md) for pinned dependency versions.

## Scope Adherence

### Implemented ✅

- `.nvmrc`, `.editorconfig`, `.gitignore`, `.env.example`
- TypeScript strict configuration with no-emit
- Vite with official React plugin, SCSS Modules, source maps disabled for build
- ESLint flat config with TypeScript, hooks, refresh, JSX a11y, type-aware
- Stylelint with SCSS config
- Prettier
- PostCSS with Autoprefixer
- Vitest with jsdom + React Testing Library setup
- Playwright with Chromium, accessibility scanning
- MSW for dev/test (not in production)
- Smoke tests: render, semantic, accessibility, navigation
- Build scripts: pages preparation, size reporting, validation
- CI workflow (push + PR)
- Deploy workflow (manual dispatch only)
- README with setup, scripts, architecture zones, Pages deployment notes
- Documentation: bootstrap report, repository state, tooling versions

### Explicitly Not Implemented ❌

- Business routes, domain fixtures, product data
- Header, Footer, information bar, product cards, raster styling
- Zustand, React Hook Form, Supabase client
- Asset extraction, logo/icon creation, font files
- Storybook, UI kit, Tailwind, CSS-in-JS
- Oxc, secondary toolchains
- PWA, service workers, offline queue
- Visual regression platform
- Numeric bundle budgets
- Weakened type/lint/test gates

## Test Coverage

### Vitest (Unit/Component Smoke)

- App renders without crashing
- Accessible h1 detected by role query
- Main landmark with stable ID
- Skip link exists and targets #main

### Playwright E2E

- Home page renders with bootstrap heading
- Skip link navigation works
- Main landmark visible
- Axe accessibility scan passes
- Base path `/GoodCall/` respected in URLs

### Build Validation

- Required files exist: index.html, 404.html, .nojekyll
- Forbidden files absent: mockServiceWorker.js
- No source maps in dist
- No development origins in HTML
- No duplicate `/GoodCall/GoodCall/` paths

## GitHub Pages Fallback

`dist/404.html` implements SPA fallback:

```javascript
// Preserves pathname, query, hash
const path = window.location.pathname.replace(/^\\/GoodCall/, '');
const search = window.location.search;
const hash = window.location.hash;
window.history.replaceState(...);
window.location.href = '/GoodCall/' + path.slice(1) + search + hash;
```

Tested by Playwright preview mode under `/GoodCall/`.

## Quality Gates

All scripts pass:

```bash
npm run typecheck    # ✓ No errors
npm run lint         # ✓ No errors
npm run lint:styles  # ✓ No errors
npm run format:check # ✓ Formatted
npm test             # ✓ All pass
npm run build        # ✓ Deterministic
npm run validate:build # ✓ All checks pass
npm run test:e2e     # ✓ All pass
npm run check:full   # ✓ Comprehensive
```

## CI/CD Workflows

### `.github/workflows/ci.yml`

Triggers: `push` to main, `pull_request` to main

Steps:

1. Checkout
2. Setup Node 24.x with npm cache
3. Install with `npm ci`
4. Install Playwright Chromium + deps
5. TypeCheck, Lint, Format check
6. Unit tests
7. Build for `/GoodCall/`
8. Validate build artifacts
9. Playwright smoke + axe scan
10. Upload test results on failure

### `.github/workflows/deploy-pages.yml`

Trigger: `workflow_dispatch` (manual only)

Steps:

1. Checkout
2. Setup Node 24.x
3. Install, build, validate
4. Prepare Pages artifacts
5. Upload to GitHub Pages
6. Deploy with official action

**Note**: No automatic deployment on push. Manual trigger only.

## Known Limitations

1. **Preview ≠ Pages Semantics**: Vite preview at http://localhost:4173 is not identical to GitHub Pages SPA fallback. Playwright tests are configured to use preview, but the fallback script in 404.html is the authoritative behavior.

2. **No Pages Settings Configuration**: Pages settings are not modified during this task. Manual configuration via GitHub UI may be required (though deployment workflow should handle this via artifact upload).

3. **Axe Scan Scope**: E2E axe scan covers only the bootstrap page. Full product accessibility audit deferred to when content is added.

4. **Bundle Analysis**: Size reporting is informational. No numeric budgets enforced in M0.

## Next Steps

M0 is complete. Next allowed step is **request review checkpoint R0**.

Do not proceed to M1 or later implementations without explicit approval.

## Deviations from Spec

None identified. All M0 requirements met.
