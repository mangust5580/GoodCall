# M1 Application Composition and Routing Skeleton Report

## Summary

M1 establishes the application routing skeleton using React Router 7 Data Router, replaces the temporary bootstrap with representative lazy-loaded routes, and implements routing-owned lifecycle management for document titles, focus, scroll, and accessibility announcements.

## Implementation Overview

### Composition Root

A single explicit composition root manages:

- **src/app/bootstrap.tsx**: Application bootstrap function handling MSW startup and React root initialization.
- **src/app/App.tsx**: Root component composing providers and RouterProvider.
- **src/app/composition/create-query-client.ts**: Query Client factory.
- **src/app/composition/create-runtime.ts**: Data Router creation with route definitions.
- **src/app/providers/index.tsx**: AppProviders component composing QueryClientProvider.

### Public Configuration Validation

**File**: `src/app/config/public-config.ts`

- Validates `import.meta.env.BASE_URL` using Zod.
- Ensures base starts with `/`, is not external/protocol-relative, and has trailing slash normalization.
- Validates `VITE_DEPLOYMENT_ID` with default `'goodcall-github-pages'`.
- Production config does not accept secrets.

**Environment**:

- `.env.example` documents `VITE_DEPLOYMENT_ID` as the only required variable.

### Query Client Ownership

**Factory**: `src/app/composition/create-query-client.ts`

- Creates isolated Query Client instances per application runtime.
- Configured with `staleTime: 5 minutes` and `gcTime: 10 minutes`.
- Single instance created once at application initialization.
- Tests create isolated instances; no domain-specific global staleTime/gcTime policy.

### Data Router Creation

**File**: `src/app/composition/create-runtime.ts`

- Creates router instance once via `createBrowserRouter()`.
- `basename` sourced from validated `publicConfig.base`.
- Route objects replace JSX `<Routes>` and `<Route>` declarations.

### Runtime Route Registry

**File**: `src/app/routing/registry.ts`

- Explicit registry with route metadata: key, ID, path, access, title, lazy flag.
- Validation ensures:
  - Unique route keys and IDs.
  - App-relative paths without repository literal.
  - Catch-all route last in registry.
  - All representative routes present.
  - No Email Preview or deferred routes.

**Representative Routes**:

- `home` (`/`) — public, lazy.
- `catalog.category` (`/catalog/:categorySlug`) — public, lazy.
- `catalog.product` (`/products/:productSlug`) — public, lazy.
- `cart` (`/cart`) — public, lazy.
- `error.notFound` (`*`) — public, catch-all.

### Lazy Route Modules

**Directory Structure**:

```
src/routes/
├── home/
│   ├── HomePage.tsx
│   └── route.tsx
├── catalog/
│   ├── category-listing/
│   │   ├── CategoryListingPage.tsx
│   │   └── route.tsx
│   ├── product-details/
│   │   ├── ProductDetailsPage.tsx
│   │   └── route.tsx
│   └── CatalogRouteErrorBoundary.tsx
├── commerce/
│   └── cart/
│       ├── CartPage.tsx
│       └── route.tsx
└── error/
    └── not-found/
        ├── NotFoundPage.tsx
        └── route.tsx
```

**Route Entry Format**:
Each `route.tsx` exports `Component` and `handle`:

```tsx
export const Component = HomePage;
export const handle = { title: 'GoodCall' };
```

### Dynamic Param Validation

**File**: `src/app/routing/loaders.ts`

- Zod-owned schemas for `categorySlug` and `productSlug`.
- Loaders validate params and throw `404 Not Found` response on invalid input.
- Lowercase ASCII kebab-case with digits allowed.
- No network lookup in M1; valid syntax does not imply resource existence.

### Error Boundary Hierarchy

**Application Layer**: `src/app/shell/RootErrorBoundary.tsx`

- Catches render/loader failures above route level.
- Displays "Application error" with reload action.
- Production build does not expose error details.

**Catalog Family**: `src/routes/catalog/CatalogRouteErrorBoundary.tsx`

- Catches invalid/missing resource errors (404/invalid slug).
- Displays "Resource not found" with recovery link to Home.
- Distinguishes typed 404 from unexpected failure.

**Catch-all**: `src/routes/error/not-found/NotFoundPage.tsx`

- Application catch-all for unknown routes.
- Remains at attempted pathname (no redirect).
- Displays attempted pathname as diagnostic text.

### Document Title Lifecycle

- Route `handle.title` defines page title.
- Initial direct load sets title.
- Client pathname navigation updates title via React Router.
- Query-only navigation does not update title.
- Safe fallback title on route resolution failure.

**Titles**:

- Home: `GoodCall`
- Category: `Category — GoodCall`
- Product: `Product — GoodCall`
- Cart: `Cart — GoodCall`
- Catch-all: `Page not found — GoodCall`

### Focus and Scroll Lifecycle

**Focus**:

- Initial direct load does not steal focus.
- Client PUSH/REPLACE after route resolution focuses route h1.
- POP/back-forward does not force heading focus.
- Route error transitions focus to error heading.
- Query-only navigation preserves current focus.
- Focused heading excluded from normal Tab order (`tabIndex={-1}`).
- Focus manager uses stable `data-route-focus` attribute, no arbitrary timeout.

**Scroll**:

- Single router-level owner via React Router.
- POP restores saved scroll position.
- New pathname begins at top.
- Query-only navigation preserves scroll position.
- Hash navigation follows browser fragment semantics.

**Skip Link**:

- Root layout owns skip link targeting `#main-content`.
- Route page owns `<main id="main-content">`.
- Root layout does not create second main.

### Route Announcements

- Single visually hidden polite live region `#route-announcement`.
- Announces resolved page title only after client pathname transition.
- Initial document load does not duplicate h1 announcement.
- Query-only navigation is not announced.
- Navigation pending state separated from title announcement.

### MSW Startup Boundary

**File**: `src/app/bootstrap.tsx`

- MSW started only when `import.meta.env.DEV` is true.
- Dynamic import guards against production inclusion.
- Production build does not import or start worker.
- Test environment does not require browser worker.
- `mockServiceWorker.js` absent from `dist/`.

### Component Structure

**Root Layout**: `src/app/shell/RootLayout.tsx`

- Manages skip link, route announcement live region.
- Outlets route content via React Router `<Outlet />`.
- Does not create `<main>` (route owns main).
- Handles client navigation focus management.

**Representative Pages**:

- Each page has `<main id="main-content">`.
- Each page has exactly one canonical `<h1 tabIndex={-1} data-route-focus>`.
- Home has navigation links to three representative routes.
- Technical placeholders, no business fixtures or production styling.

### App Composition

**src/app/App.tsx**:

```tsx
export function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AppProviders>
        <RouterProvider router={router} />
      </AppProviders>
    </Suspense>
  );
}
```

**src/main.tsx**:

```tsx
import { bootstrap } from '@/app/bootstrap';
bootstrap();
```

### Main Entry Point

- `src/main.tsx` is a thin entry point.
- Calls `bootstrap()` function.
- No inline router, Query Client, MSW, or route definitions.
- No authored comments.

## Testing

### Unit/Integration Tests

- **Public Config**: valid/invalid base, deployment ID defaults/validation.
- **Query Client**: factory creates isolated clients.
- **Route Registry**: keys/IDs unique, representative routes present, catch-all last.
- **Routing Integration**: memory router tests for all representative routes, 404 behavior, title updates, focus management.

### Playwright E2E Tests

- Direct Home under `/GoodCall/`.
- Client navigation Home → Category.
- Title updates on navigation.
- Category h1 focused after client navigation.
- Direct nested Category and hard refresh.
- Direct Product and Cart routes.
- Unknown route renders 404 at attempted pathname.
- One main and one h1 per route.
- Back/Forward does not create duplicate landmarks.
- Axe scan on Home and 404: zero violations.
- No page errors, console errors, or required request failures.

## Styling

- Minimal adaptation of existing technical shell styles.
- Added `.sr-only` utility for visually hidden live region.
- Added visible focus styles for route headings and skip link.
- No design tokens extraction, brand colors, Header/Footer, or production assets.

## Code Comments Policy

- No authored comments in TS/TSX, SCSS, CSS, tests, YAML, or config files.
- `npm run check:comments` passes.

## Local Server Ownership

- Agents do not start/stop local servers.
- Users control local development lifecycle.
- CI Playwright webServer controlled by `process.env.CI`.

## Deviations and Blockers

None identified. All M1 requirements met.

## Deferred Work

- M2: Design system and canonical Header/Footer.
- M3: Business domain features.
- M4: Authentication and authorization.
- M5: Performance optimizations and build analysis.
- Chunk grouping: OQ-05-EVD-03 noted but decision deferred to M5 build analysis.

## Acceptance Criteria Met

- ✅ Approved M0 baseline preserved.
- ✅ Package/dependency set unchanged.
- ✅ Validated public config implemented.
- ✅ Query Client created in composition root.
- ✅ Data Router replaces declarative router.
- ✅ Router instance created once outside React render.
- ✅ Basename from validated build base.
- ✅ Explicit representative registry.
- ✅ Only approved M1 routes exist.
- ✅ Home, Category, Product, Cart lazy.
- ✅ Root and catalog-family error boundaries.
- ✅ Catch-all preserves attempted URL.
- ✅ Route-owned one-main/one-h1 contract.
- ✅ Document titles update.
- ✅ Client pathname focus works.
- ✅ POP does not force heading focus.
- ✅ Query-only navigation preserves focus/scroll.
- ✅ One scroll restoration owner.
- ✅ Route live region not duplicate initial load.
- ✅ Delayed loading announcement contract.
- ✅ MSW startup in bootstrap, production-safe.
- ✅ Unit/integration tests pass.
- ✅ Build/validation pass.
- ✅ Port 4173 free.
- ✅ Changes committed/pushed.
- ✅ CI run completed/success.
- ✅ Playwright routes and 404 pass.
- ✅ Axe Home/404 violations zero.
- ✅ Documentation synchronized.
- ✅ M2/M3/M4/M5 scope not started.

## Review Handoff

M1 is ready for external review. No approval is claimed.
