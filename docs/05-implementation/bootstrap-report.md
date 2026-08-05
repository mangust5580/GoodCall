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

**Decision**: Single source of truth in `build-config.mjs` for production base `/GoodCall/`.

**Why**: Centralized configuration prevents duplication and hardcoding across multiple files. Enables testing with parameterized base, runtime flexibility via `import.meta.env.BASE_URL`.

**Implementation**:

- `build-config.mjs`: Owns `production.base = '/GoodCall/'`, development `base = '/'`
- `vite.config.ts`: Imports `BUILD_CONFIG`, applies base during build/dev via `config.base`
- `playwright.config.ts`: Imports `BUILD_CONFIG`, computes preview `baseURL` dynamically
- `src/app/routing/index.tsx`: Uses `import.meta.env.BASE_URL` directly for `BrowserRouter basename`
- `src/app/fallback.ts`: Functions accept base as parameter, default to `import.meta.env.BASE_URL`
- `scripts/prepare-pages-artifact.mjs`: Exports `generateFallbackHTML()`, uses `BUILD_CONFIG` for production 404.html
- All CLI scripts import `BUILD_CONFIG` instead of duplicating base literals

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

**Decision**: MSW configured to start only in development (`import.meta.env.DEV` guard in `src/app/bootstrap.tsx`).

**Why**: Prevents accidental mock interception in production. Worker script is not included in dist/.

**Validation**: `scripts/validate-build.mjs` explicitly checks for absence of `mockServiceWorker.js`.

**Corrected in M3-05B**: the worker asset itself was never generated, so development never actually started. See [BR-01](#br-01--development-msw-bootstrap-restoration-m3-05b).

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
npm run typecheck      # ✓ No errors
npm run lint           # ✓ No errors
npm run lint:styles    # ✓ No errors
npm run format:check   # ✓ Formatted
npm run check:comments # ✓ No authored comments
npm test               # ✓ All pass
npm run build          # ✓ Deterministic
npm run validate:build # ✓ All checks pass
npm run test:e2e       # ✓ All pass (with server running)
npm run verify:dev-bootstrap # ✓ Owns its dev server and headless browser, then releases both
npm run check:full     # ✓ Comprehensive
```

`check:full` is no longer serverless: it includes `verify:dev-bootstrap`, which starts a development server on a free loopback port and closes it again. That step never touches the developer's own server or browser.

### Comment Policy

Authored comments are prohibited in code. Enforced by `npm run check:comments`:

- No line comments (`// ...`)
- No block comments (`/* ... */`)
- No JSDoc (`/** ... */`)
- No suppression comments (`@ts-expect-error`, etc.)
- No commented-out code

Enforcement points:

- Local: `npm run check` and `npm run check:full`
- CI: Comment check step in GitHub Actions

Why: Comment drift causes confusion. Code intent should be clear from names, types, and structure. Non-obvious "why" goes in commit messages.

### Local Server Ownership

Users (developers) own local server lifecycle. Agents never start/stop local servers:

- `npm run dev` — User starts development server
- `npm run preview` — User starts preview server (required before local E2E tests)
- Local E2E: User must manually start preview server first

CI automation:

- E2E in CI is controlled by Playwright's conditional `webServer` configuration
- Server starts before tests, stops after tests complete
- Activated only when `process.env.CI` is true

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

## BR-01 — Development MSW bootstrap restoration (M3-05B)

**Status: IMPLEMENTED — AWAITING INDEPENDENT AUDIT AND CI**

### Symptom

`npm run dev` served HTTP 200 and the document title, but the application never rendered: `#root` stayed empty, no `main#main-content`, no `<h1>`, body text length 0. The user saw a blank white page with no explanation.

### Root cause

Four facts combined:

1. `src/app/bootstrap.tsx` awaited `startMSW()` **before** `ReactDOM.createRoot(...).render(...)`.
2. `src/main.tsx` called `bootstrap()` with no rejection handler.
3. The worker asset was **never generated** — there was no `public/` directory and no `mockServiceWorker.js` anywhere in the repository. M0 configured MSW startup and documented its production exclusion, but the file that startup depends on was never created.
4. `worker.start()` requested `/mockServiceWorker.js`; Vite's SPA fallback answered with `index.html` at `text/html`, so `navigator.serviceWorker.register()` rejected on MIME type.

The rejection propagated out of `bootstrap()` and the render call was never reached.

### Why production CI never detected it

`startMSW()` is gated by `import.meta.env.DEV`, which is false in a production build. Every automated gate — typecheck, lint, unit tests, build, build validation and all 23 Playwright E2E tests — runs against either jsdom or the production preview build. **Nothing in the pipeline loaded the development entry point**, so a completely broken `npm run dev` passed every gate for the entire M0–M3 history.

### Accepted design

**Dev-only public directory.** The generated worker is tracked at `dev-public/mockServiceWorker.js`. `BUILD_CONFIG.getPublicDir(command, isPreview)` is the single decision point:

| Vite mode          | `publicDir`  |
| ------------------ | ------------ |
| development server | `dev-public` |
| production build   | `false`      |
| production preview | `false`      |

The worker therefore cannot reach `dist/` by construction, and the existing build validator remains the authoritative backstop.

**Explicit worker URL.** `startMSW()` passes `serviceWorker.url = ${import.meta.env.BASE_URL}mockServiceWorker.js`, so the path follows the configured base instead of an implicit default. No host, port or filesystem path is hardcoded.

**Fail-closed startup.** A worker failure never renders the application as though mocks exist. There is no `.catch(() => undefined)` anywhere in the startup path. `src/main.tsx` attaches a rejection handler that calls `renderBootstrapFailure`.

**Visible fatal diagnostic.** `src/app/render-bootstrap-failure.ts` logs under the stable `[GoodCall bootstrap]` prefix and replaces the root with one `<main>` and one `<h1>` reading `GoodCall could not start`, plus a single sentence pointing at the console. It uses no Shared UI (which may itself be unavailable during a bootstrap failure), no CSS, no timers, no retry control, no routing and no raw error text or stack — the error goes to the console, never into the DOM.

**Dev-bootstrap Chromium gate.** `scripts/verify-dev-bootstrap.mjs` (`npm run verify:dev-bootstrap`) starts the dev server through the Vite Node API on an OS-selected free loopback port, asserts `/mockServiceWorker.js` returns JavaScript carrying the generated `PACKAGE_VERSION` and `INTEGRITY_CHECKSUM` markers, loads the page in an isolated headless Chromium, and requires a rendered root, exactly one `main#main-content`, exactly one `<h1>` containing `GoodCall Shared UI verification`, the visible technical notice, an absent failure diagnostic, a service-worker registration ending in `/mockServiceWorker.js`, and zero page errors, console errors, request failures and failed module requests. It owns its whole lifecycle in `try/finally`, closes the browser and the server, and verifies the port stops responding. It runs in `check:full` and as a dedicated CI step.

### Production exclusion evidence

`publicDir` is `false` for build and preview; `npm run validate:build` fails on any `dist` filename containing `mockServiceWorker`; `tests/validate-build.test.ts` keeps its `fails when MSW worker present` case; and a post-build scan of `dist` finds no worker file.

### Rejected variants

- **Preview-only browser review as a substitute for fixing dev** — would leave `npm run dev` broken for every developer and hide the defect behind the one environment that never exercises it.
- **Worker in the ordinary production `public/` directory** — ships the worker to GitHub Pages and lets a mock layer reach real users.
- **Copying the worker into `dist` and accepting it** — same exposure, and it would require weakening the build validator that already rejects it.
- **Silently continuing when MSW fails** (`worker.start().catch(() => undefined)`) — development would run against real network calls while appearing to be mocked, which is worse than a blank page.
- **Attaching automation to the user's browser** — the verifier must never control or terminate a developer's Chrome/Edge session.
- **Detached background server orchestration** — leaves orphaned servers and ports behind; the verifier runs one foreground process it fully owns.

## M3-05C — Agent policy, generated artifact and verifier lifecycle reconciliation

**Status: IMPLEMENTED — AWAITING INDEPENDENT AUDIT AND CI**

The independent audit of M3-05B returned **CHANGES REQUIRED** with four findings. None of them disputes the accepted design: the MSW worker, the `publicDir` contract, the explicit worker URL, the fail-closed startup and the runtime application are all unchanged by this pass.

### M3-POLICY-01 — policy contradiction

M3-05B added a verifier that starts a development server, and wired it into `check:full`, while `AGENTS.md` still said agents must never manage local servers and described `check:full` as serverless. The repository's canonical policy contradicted its own gate.

`AGENTS.md` now carries a **Bounded Verification Exception** covering exactly two invocations — `npm run verify:dev-bootstrap` and `npm run check:full`, which runs it indirectly. The exception is conditional: it holds only while the verifier remains a single foreground-owned Node process using the Vite Node API on a dynamically selected loopback port with `open: false`, driving an isolated headless Chromium with no existing profile and no attachment to the user's browser, cleaning up in `finally`, closing context, browser and server, verifying port release, and never killing by process name. If any constraint stops holding, the verifier leaves the exception and agents must not run it.

Everything else stays user-owned and prohibited: `npm run dev`, `npm run preview`, direct `vite`/`vite preview`, the local production-preview E2E lifecycle, long-lived servers, detached processes, fixed ports, reusing a user's server, and controlling or terminating the user's Chrome/Edge. The gate descriptions were corrected — `check` is serverless, `check:full` is not — and the CI description now matches the workflow, which runs dedicated steps rather than `check:full`.

`CLAUDE.md` needed no change: it already defers to `AGENTS.md` as canonical.

### M3-LINT-01 and M3-TOOLING-01 — generated artifact ownership

The generated worker carries its own `/* eslint-disable */` directive, which ESLint reported as an unused directive — one warning on every lint run. M3-05B also excluded the worker from Prettier through a negated CLI glob inside the npm scripts, so editors and the npm scripts disagreed about what was ignored.

Both are now **directory boundaries** on the generated artifact rather than edits to it:

- `eslint.config.js` ignores `dev-public/**`
- `.prettierignore` ignores `dev-public/`
- `package.json` is back to plain `prettier --write .` and `prettier --check .`

The worker is byte-identical, its generated directive is untouched, no lint rule was weakened for authored files, unused-directive reporting stays on globally, and `npm run lint` now reports **zero errors and zero warnings**.

### M3-LIFECYCLE-01 — independent cleanup

M3-05B's `finally` block closed the browser and then the server in one sequence, so a throw from the first close would have skipped the second and skipped port verification entirely. The Playwright context was also never closed explicitly.

The verifier now owns `context` in a variable visible to cleanup and runs each stage independently — close context, close browser, close server, verify the port — each in its own `try`/`catch`. A failure in one stage records a stable message and continues to the next. Cleanup failures join the final failure list only after every stage and the port check have run, so a cleanup problem can never hide an incomplete shutdown. The summary reports `contextClosed`, `browserClosed`, `serverClosed`, `portReleased` and a `cleanupErrors` array, and unknown thrown values are normalised through one local helper so nothing renders as `[object Object]`.

No force-kill fallback was added. The verifier still releases everything through APIs only.

### Status

M3-05B's implementation remains accepted **in design**, but the corrective chain is not closed: M3-05C awaits its own independent audit and CI run. The M3 browser review is still owed and has not been re-run.

## M3-05D — Bounded browser review harness

**Status: IMPLEMENTED — AWAITING INDEPENDENT AUDIT AND CI**

### Why a second policy exception was required

After M3-05C, `AGENTS.md` permitted agents exactly two server-bearing invocations: `npm run verify:dev-bootstrap` and `npm run check:full`. The mandatory M3 browser review needs a browser session that visits the running application, drives the form and routing flows, and — for zoom, real forced colors and screen-reader checks — puts a real window in front of the user. None of that fits the dev-bootstrap gate, and an ad-hoc review script would have been a policy violation.

Rather than loosen the general rule, `AGENTS.md` gains a second **named, conditional** exception for one repository-owned command, `npm run review:m3-browser`. It is milestone-review tooling: deliberately **not** in `check`, **not** in `check:full`, **not** a CI gate and **not** in any deployment workflow. `npm run dev`, `npm run preview` and local E2E stay user-owned.

### Lifecycle and browser-isolation contract

The harness owns everything it creates and releases all of it:

- one foreground Node process; server created through the Vite Node API on a dynamically selected loopback port with `open: false`; no CLI dev server, no detached process, no fixed port
- automated phase in headless Chromium; interactive sign-off phase in exactly one harness-owned headed Chromium window, launched only after the automated phase passes
- every context is fresh — no persistent context, no existing user profile, no remote-debugging attachment, no connection to a running Chrome/Edge
- cleanup in `finally` across six independent guarded stages: interactive context, interactive browser, automated context, automated browser, Vite server, then port verification. One failure cannot skip the rest
- cleanup errors are accumulated and **fail the command**; the port check always runs
- no process-name kill, no browser-image kill, no broad Node kill
- all evidence is written under the ignored `artifacts/` directory; no tracked documentation is touched by a run

### Automated versus manual coverage

Automated: runtime startup (including the MSW worker endpoint and service-worker registration), initial structure, keyboard and skip-link flow with focus-indicator evidence, counter silence, invalid-submit focus flow, single Home-owned success status, reset behaviour, a six-viewport responsive matrix, touch/coarse-pointer targets, forced-colors **emulation**, reduced motion, axe scans of four states, and routing regression including Back/Forward.

Not automatable, and never claimed by the harness: real browser zoom at 200 % and 400 %, real OS forced-colors mode, screen-reader announcement behaviour, and subjective readability. Those come only from the interactive sign-off phase, and the forced-colors automated result is labelled exactly `PASS — PLAYWRIGHT EMULATION`.

### Unchanged

No product runtime change. The MSW worker, the `publicDir` contract, the explicit worker URL, the fail-closed startup, `src/**`, `tests/**` and `scripts/verify-dev-bootstrap.mjs` are all untouched. Unit/integration totals stay at 533 in 37 files and the bundle is unchanged.

### Evidence status

Any browser-review evidence produced before the harness itself is independently audited is **provisional** and must be repeated after M3-05D is approved and CI is green for its exact SHA. Implementing the harness is not the same as passing the review.

## M3-05E — Browser review harness reliability and evidence integrity

**Status: IMPLEMENTED — AWAITING INDEPENDENT AUDIT AND CI**

The independent audit of M3-05D returned **CHANGES REQUIRED** with seven findings. The accepted M3-05D architecture is unchanged: the same repository-owned command, Vite Node API, dynamic loopback port, isolated Chromium, headed sign-off phase, untracked artifacts, and no product-runtime coupling. What changed is whether the harness can be trusted to tell the truth about a run.

### Status and exit code are one contract

Status resolution is now a single pure function fed by baseline eligibility, startup blockers, execution exceptions, automated failures, axe violations, diagnostics failures, manual answers, interruption, cleanup errors and port release. The exit code is derived from the final status through a fixed map — `AUTOMATED PASS — USER SIGN-OFF PENDING` and `AUTOMATED + USER REVIEW PASSED` exit 0; `FAILED` and `PARTIAL` exit 1. Nothing computes an exit code independently, so a report can no longer disagree with the process result, and success wording is never printed for a failed or partial run.

### Repository evidence integrity

The harness derives its own identity before starting anything: `git rev-parse HEAD`, `git branch --show-current` and `git status --porcelain --untracked-files=no`. There is no hardcoded SHA fallback and no reliance on `GITHUB_SHA`.

A run is bound to an approved baseline through the `GOODCALL_REVIEW_SHA` environment variable. Without it a run is legal but is stamped **PROVISIONAL** and can never be final-review evidence. A final interactive review requires the variable, an exact HEAD match, branch `main` and a clean tracked tree; any mismatch is rejected **before** Vite or Chromium starts. Node, Playwright and Chromium versions are read from the runtime and package metadata rather than written into the source.

### Interactive lifecycle and signals

The interactive browser, context and page are created in the main lifecycle scope and the page is handed to the sign-off function, which no longer owns context creation. `SIGINT` and `SIGTERM` set an interruption flag and abort the readline prompt instead of exiting the process, so cleanup always runs and an interrupted sign-off resolves to `PARTIAL`.

### Diagnostics are a gate, not a note

Page errors, console errors, request failures, HTTP ≥ 400 responses and failed critical resources — script, stylesheet, fetch/XHR, document and service worker — are collected from the automated, touch and interactive contexts and evaluated in a mandatory final section. Anything unexpected fails the review. The allow-list is empty and is structured to require an exact pattern, a reason and a scope for any future entry; blanket suppression of warnings, 4xx or request failures is not possible.

### Focus evidence

Representative controls are reached by **real** `Tab` traversal from a known document state, with the tab order recorded and DOM ordering asserted. `:focus-visible` is a prerequisite, not proof: a target passes only when a computed indicator is materially visible — an outline with non-zero width and a non-transparent colour, a real box-shadow, or a border/background change measured against the unfocused baseline. Focused targets are also checked for viewport visibility and for obscuration by another element via hit-testing. The same rule is applied under forced-colors emulation, where the `PASS — PLAYWRIGHT EMULATION` note is now conditional on that section having zero failures.

### Coverage corrections

Every viewport is measured in three states — initial, invalid and success — instead of initial only. Explicit bounding-box overlap detection replaces the implicit claim that no overflow means no overlap, skipping nested pairs and allowing a 1 px border-touch tolerance. Touch activation now covers `IconButton`, `Radio` and `Switch` alongside the existing targets. Reset verifies every control against the canonical defaults read from `HomePage.tsx`. Forced colors additionally checks `Badge`, `Counter`, `Status`, `InlineStatus` and `ErrorSummary` boundaries and proves checked/unchecked and on/off distinction by comparing rendered element screenshots. Axe evidence now stores impact, description, help URL, tags and every affected node with target, failure summary and a capped HTML excerpt.

### Policy wording

`AGENTS.md` referred to "the single bounded verifier" while two named exceptions existed. It now speaks of two bounded exceptions, links both, and states the distinction: `verify:dev-bootstrap` is a routine development gate, `review:m3-browser` is explicitly initiated milestone-review tooling. No additional server-bearing command is permitted.

### Rejected variants

- **Trusting the exit code independently of report status** — the exact split that let a failing run print a passing summary.
- **A hardcoded SHA fallback** — evidence would silently describe the wrong commit.
- **Accepting a dirty working tree for a final review** — the artefact reviewed would not be the artefact approved.
- **Implicit browser close as context cleanup** — leaves the context unclosed on any path where the browser close is skipped or fails.
- **Treating diagnostics as report-only evidence** — console and network errors would be recorded and then ignored.
- **Programmatic `locator.focus()` as keyboard evidence** — proves nothing about reachability, and in pointer modality it does not even produce `:focus-visible`.
- **Treating `:focus-visible` as a visible ring** — a matching selector is not a rendered indicator.
- **Claiming responsive validation from the initial state only** — the invalid and success states are exactly where wrapping and overlap fail.

### Verification and status

A `--self-test` mode exercises the status and baseline logic without starting a server or a browser. Provisional automated-only runs are labelled as such. **Implementing the harness is not passing the review**: the final review must be re-run bound to an approved SHA after independent audit and green CI.

## Next Steps

M0 is complete. Next allowed step is **request review checkpoint R0**.

Do not proceed to M1 or later implementations without explicit approval.

## Deviations from Spec

None identified. All M0 requirements met.
