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

**Status: APPROVED AND CLOSED**

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

**Status: APPROVED AND CLOSED**

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

At that stage M3-05B's implementation was accepted **in design**, the corrective chain was not yet closed, M3-05C awaited its own independent audit and CI run, and the M3 browser review was still owed. M3-05B and M3-05C are now approved and closed; the corrective chain closed at M3-05H and the browser review is approved. See [M3-06](#m3-06--m3-closure-documentation-and-m4-unblocking).

## M3-05D — Bounded browser review harness

**Status: SUPERSEDED — CORRECTIVE CHAIN CLOSED BY M3-05H**

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

**Status: SUPERSEDED — CORRECTIVE CHAIN CLOSED BY M3-05H**

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

A `--self-test` mode exercises the status and baseline logic without starting a server or a browser. Provisional automated-only runs are labelled as such. **Implementing the harness is not passing the review**: at that stage the final review still had to be run bound to an approved SHA after independent audit and green CI. It was, at M3-05H — see [M3-06](#m3-06--m3-closure-documentation-and-m4-unblocking).

## M3-05F — Interactive diagnostics and review evidence coherence

**Status: SUPERSEDED — CORRECTIVE CHAIN CLOSED BY M3-05H**

The independent audit of M3-05E returned **CHANGES REQUIRED** with six findings plus an operational risk. The accepted architecture is unchanged; each correction closes a way the harness could report something the run did not prove.

### Final diagnostics re-aggregation

The diagnostics gate previously ran **before** the interactive phase, so console errors, page errors and failed requests produced by the sign-off window were collected and then never evaluated. Collection is now separated from evaluation: `aggregateDiagnostics()` gathers, `evaluateDiagnostics()` judges, and `recordDiagnosticsSection()` writes section M. The automated aggregate still decides whether the sign-off phase may start, but the **final** aggregation runs after the interactive phase completes or fails, before status resolution and before any file is written. The report carries both snapshots and an explicit `interactive diagnostics included` flag, which must be true for an interactive pass. Unexpected interactive diagnostics resolve to `FAILED`, not `PARTIAL` — the review got far enough to reveal a real defect.

### FAILED versus PARTIAL

One generic execution-error array conflated "the application is broken" with "the sign-off could not happen". Outcomes are now tracked in four separate buckets — `automatedExecutionErrors`, `signoffUnavailable`, `signoffInterrupted`, `signoffIncomplete` — classified at the point of failure rather than inferred afterwards. Automated, startup, diagnostics and cleanup defects and any manual `FAIL` resolve to `FAILED`; an unavailable headed browser, a missing TTY, stdin EOF, a `SIGINT` abort, incomplete answers or a post-answer screenshot failure resolve to `PARTIAL` unless a hard defect already forces `FAILED`.

### Terminal availability

The harness collects sign-off answers on its own stdin, so a non-interactive process could previously open a headed window nobody could answer. Default mode now checks `process.stdin.isTTY` and `process.stdout.isTTY` **before** launching anything headed. Without a TTY it records `signoffUnavailable`, prints the exact command to re-run in a visible project terminal, and resolves to `PARTIAL`. No in-page sign-off form was added and no product runtime was touched — the model remains terminal input plus a harness-owned window.

### Coherent viewport evidence

Section G could fail while a viewport row still read PASS. Every viewport now builds three state-local records — initial, invalid, success — each with its own `failures`, `geometry` and `visibility`. `resolveViewportStatus()` returns PASS only when all three failure lists are empty, and `responsiveSectionFailures()` derives the section's failures from the viewport records, so the two can no longer disagree. Invalid state records summary visibility, focus, viewport containment, both links, both field errors and form actions; success state records the single Home-owned status, its exact copy and the actions.

### Semantic overlap probes

Broad tag-pair scans (`span` vs `span`, `button` vs `button`, `label` vs `select`) were replaced by named probes over adjacent regions resolved from real markup — IDs, `data-testid`, `aria-describedby` for error paragraphs, and the labelled summary section. Probe sets are state-specific, and each record stores both rectangles, `overlapX`, `overlapY`, the tolerance and the verdict. Nested pairs are skipped, and the 1 px border-touch tolerance stays documented.

### Backward focus and obscuration

`Shift+Tab` previously passed on any non-null element. The harness now records the active element and its index before the keypress and requires the result to be the immediately previous recorded tab stop, or at minimum earlier in the recorded order. Viewport visibility uses a material threshold — at least 90 % of the focused element's area inside the viewport, recorded as a ratio — and obscuration samples five points instead of one, requiring at least four to resolve to the target. Hit-test ownership accepts the input, its associated label or a visual control inside that label, so a wrapping choice label is never mistaken for an obscurer.

### Scope-aware diagnostics allow-list

Allow-list entries now require `pattern`, a non-empty `reason`, an explicit `scopes` array and an explicit `kinds` array, and suppression matches all three dimensions. A malformed entry aborts the run before a server starts. The shipped list remains empty.

### Rejected variants

- **Treating pre-interactive diagnostics as final** — the exact gap that let sign-off-phase runtime errors escape the gate.
- **Classifying unavailable sign-off as application failure** — a missing terminal is not a defect in the product.
- **Marking a viewport PASS from geometry alone** — hides state-specific layout failures behind a clean overflow number.
- **Broad tag-pair overlap scans** — combinatorial false positives, and no evidence about the regions that actually matter.
- **Treating any non-null `Shift+Tab` target as proof** — focus staying put satisfies it.
- **Centre-point-only obscuration** — a partial overlay leaves the centre clear.
- **Pattern-only diagnostics allow-list** — one entry would silence a message across every scope and kind.
- **Launching a headed browser when stdin is not interactive** — opens a window nobody can answer and then blocks.

## M3-05G — Manual sign-off integrity and responsive evidence completion

**Status: SUPERSEDED — CORRECTIVE CHAIN CLOSED BY M3-05H**

The independent audit of M3-05F returned **CHANGES REQUIRED** with five findings — M3F-PARTIAL-02, M3F-MANUAL-01, M3F-RESPONSIVE-02, M3F-OVERLAP-02, M3F-MANUAL-02 — after CI run **30973880138** passed for SHA `402cb2e3b7a0d8dd4928587cb74efa3402f60a1d`. CI cannot see any of them: it never runs the harness. The accepted M3-05D architecture is unchanged again; every correction closes a way the harness could still describe a run more favourably than the run deserved.

### Complete sign-off environment boundary

Only `chromium.launch({ headless: false })` and `newContext()` were treated as sign-off availability. `interactiveContext.newPage()`, the interactive diagnostics sink and the first navigation sat outside that boundary, so a machine that could not open a review window produced an `automatedExecutionErrors` entry and a **FAILED** status — the application blamed for a missing environment.

All five pre-sign-off operations are now one boundary inside `createSignoffEnvironment()`: launch, context, page, diagnostics registration, initial page preparation. Any failure among them records `signoffUnavailable`, never `automatedExecutionErrors`, and resolves to **PARTIAL**. The function returns whatever it managed to own — browser, context, page — so `finally` still closes it; a cleanup failure is the only thing that can escalate the run to FAILED. A `signoffCollectionStarted` marker splits the lifecycle: failures before it are `signoffUnavailable`, failures after it are `signoffIncomplete` unless a signal already marked the run interrupted. Application diagnostics stay under the final diagnostics gate and can still produce FAILED.

### Incremental manual answer persistence

`runInteractiveSignoff()` built a local `answers` object and `results.manual` was assigned only after the last prompt returned. An EOF, `SIGINT` or `SIGTERM` at prompt five discarded four collected answers — including a recorded **FAIL**, which then degraded to PARTIAL.

The record is created in the main lifecycle scope by `createManualAnswerRecord()` and handed to the sign-off function, which no longer owns the only copy. Each accepted value is written into that shared record **before the next question is asked**, and fallback reasons are persisted the same way. `summariseManual()` operates on partial records and reports `answeredCount`, `answersComplete`, `failed`, `fallbackReasonsComplete` and `missingReasons` separately.

Precedence after an interruption: any persisted mandatory `FAIL` resolves to **FAILED**, ahead of `signoffInterrupted`, `signoffIncomplete` and a late `signoffUnavailable`. Persisted answers without a FAIL, but incomplete, resolve to **PARTIAL**. Cleanup and runtime hard failures keep their existing precedence.

### Fallback reason contract

`NOT AVAILABLE` for forced colors and `NOT TESTED` for a screen reader remain permitted, but neither can complete a sign-off unexplained. Two conditional fields — `forced colors reason` and `screen reader reason` — are prompted **only** when the corresponding answer is the fallback value, and never when it is PASS or FAIL. A reason must be a trimmed string of at least 3 characters that is not punctuation-only; the prompt repeats until it is. A fallback answer whose reason is missing or invalid makes the manual record incomplete and the run **PARTIAL**. General notes stay a separate field and are never accepted as justification.

### Per-viewport Error Summary link usability

The responsive matrix recorded `summaryLinks: <count>`, which proves DOM presence and nothing else. Both links are now inspected independently in the invalid state at every one of the six viewports, and each record stores `index`, `text`, `visible`, `boundingBox`, `visibleAreaRatio`, `unobscuredSampleCount`, `sampleCount`, `activationTarget` and `activationPassed` inside that viewport's invalid-state record.

A link passes only with `isVisible()`, a non-null bounding box of non-zero width and height, at least 90 % of its area inside the viewport after scrolling into view, and at least 4 of 5 unobscured sample points — the same geometry model the focus evidence uses, never centre-point-only. Activation is **keyboard** for both links: the link takes focus, `Enter` is pressed, and `document.activeElement` must be `#m3-demo-name` for the Name link and `#m3-demo-category` for the Category link. The invalid state is re-established between the two activations. Every failed check is appended to that viewport's invalid-state failure array, so a viewport cannot read PASS while a summary link is unusable.

### Explicit overlap probe statuses

A probe whose targets did not resolve was stored as `resolved: false, failed: false`: coverage silently shrank while the report still claimed no intersections. Every probe now resolves to exactly one status — `MEASURED_PASS`, `MEASURED_FAIL`, `UNRESOLVED` or `NOT_APPLICABLE`. Probes are `required: true` by default; the shipped set declares no optional probes.

A required probe with a missing left target, a missing right target, the same element on both sides, or an unexpected nesting is **UNRESOLVED**, carries the reason, is `failed: true` and appends a state-local failure through `overlapGeometryFailures()`. `NOT_APPLICABLE` is reachable only for a probe explicitly declared `required: false`, stores its reason and is excluded from measured totals. Measured records carry viewport, state, pair name, both identifiers, both rectangles, `overlapX`, `overlapY`, tolerance, status and verdict. The report prints declared, measured, measured pass, measured fail, unresolved and not-applicable counts, and the sentence _No material intersections detected._ is emitted only when measured failures and unresolved probes are both zero and every required probe was measured.

### Report contract

The manual section reports answers collected, answered count, complete, failed, both fallback reasons, fallback-reasons-complete and interrupted-after-answers, and its table has a dedicated `Reason/notes` column with explicit rows for `forced colors reason` and `screen reader reason`. Answers already collected are printed even when the sign-off ended early — a partial record no longer renders as six `NOT COLLECTED` rows. The final assessment lists every blocker to a full-pass claim: a missing fallback reason, any manual FAIL, incomplete answers, an unavailable sign-off environment, unresolved required overlap probes, or unusable responsive summary links.

### Rejected variants

- **Treating `newPage()` or diagnostics registration as automated application execution** — the exact split that turned an unopenable review window into a product failure.
- **Returning manual answers only after the final prompt** — one keystroke of interruption erases everything already answered.
- **Discarding a prior FAIL after an interruption** — the harness would report PARTIAL for a defect the user had already recorded.
- **Accepting fallback answers without justification** — `NOT AVAILABLE` and `NOT TESTED` would complete a sign-off while proving nothing.
- **Treating a summary-link count as usability evidence** — presence in the DOM is not visibility, containment or activation.
- **Treating unresolved overlap probes as successful** — coverage shrinks silently and the clean claim survives.
- **Claiming clean overlap coverage when required probes were not measured** — the report would describe probes that never ran.

### Verification and status

`--self-test` covers **73 scenarios** with no server and no browser, including every availability, persistence, fallback-reason, responsive-link and overlap-status scenario above. Two provisional automated-only runs passed on distinct dynamic ports with zero axe violations, zero diagnostics failures, 109 of 109 overlap probes measured and 12 of 12 responsive summary-link records usable. **No final interactive review was run and no browser review is claimed to have passed.**

## M3-05H — Optional evidence semantics, report consistency and subpixel geometry

**Status: APPROVED AND CLOSED**

The independent audit of M3-05G returned **CHANGES REQUIRED** with three findings — M3G-OPTIONAL-01, M3G-REPORT-01, M3G-OVERLAP-03. CI for the M3-05G commit `16191b52314a2bc7a23fd95c901b46297025f5d8` is **not independently verified**, and nothing here claims otherwise. The accepted architecture is unchanged; each correction removes a way the harness could still misreport a run it had actually completed correctly.

### Mandatory versus optional evidence

The harness collected general notes and `manual-final.png` inside the same failure path as the mandatory answers. An EOF at the `notes:` prompt, or a screenshot that could not be written, was recorded as `signoffIncomplete` — so a sign-off where the user had answered all six prompts and justified both fallbacks could still resolve to **PARTIAL**. Supporting evidence was being treated as a review defect.

Mandatory sign-off is now explicitly bounded: the six result prompts plus every required fallback reason. `signoff.mandatoryComplete` is set the moment that boundary is crossed, before any optional prompt runs. Two buckets replace the ambiguous one:

- `mandatorySignoffIncomplete` — only interruption or failure **before** mandatory completion, still PARTIAL;
- `optionalEvidenceWarnings` — notes not collected, screenshot not captured; recorded, reported, and never a blocker.

The notes prompt is wrapped in its own handler: EOF or a `SIGINT` abort during it records a warning, keeps every mandatory answer, and preserves full-pass eligibility. It never loops waiting for optional input. The screenshot is captured after mandatory completion and its path enters the evidence list only on success. A signal arriving after mandatory completion is a `WARNING`, not a partial reason; before it, it stays PARTIAL.

### One outcome model for status, exit code and report

`resolveFinalStatus()` decided the status while `renderReport()` built its own `fullPassBlockers` list from a different set of conditions. The two could disagree, and a FAILED or PARTIAL report could still print _No blocker to a full-pass claim remains in this run._

`evaluateOutcome()` is now the single source of truth. It returns `status`, `exitCode`, `reasons`, `blockingReasons`, `failureReasons`, `partialReasons` and `optionalWarnings`, where each reason is `{ code, severity, message }` and severity is `FAILURE`, `PARTIAL` or `WARNING`. `resolveFinalStatus()` is a thin wrapper over it. Status, exit code, the terminal summary, the report's Execution Outcome, the blocker list, the Final Assessment and `results.json` all read the same object; nothing recomputes blockers.

Precedence: any `FAILURE` reason → FAILED; otherwise any `PARTIAL` reason → PARTIAL; otherwise automated-only → AUTOMATED PASS — USER SIGN-OFF PENDING; otherwise → AUTOMATED + USER REVIEW PASSED. Warnings never move the status. `renderOutcomeNarrative()` derives the Final Assessment from the status alone, and the clean full-pass sentence is reachable only from `AUTOMATED + USER REVIEW PASSED` with an empty blocker list. An automated-only run says user sign-off remains pending instead.

### Subpixel overlap classification

`semanticOverlap()` applied `Math.round()` to `overlapX`/`overlapY` inside the page before `classifyOverlapFinding()` compared them against the 1 px tolerance. A real 1.2 px intersection rounded to 1, and `1 > 1` is false, so a material overlap was recorded as `MEASURED_PASS`.

The page now returns raw floating-point rectangles and raw overlaps. Classification uses `rawOverlapX > tolerance && rawOverlapY > tolerance` with no rounding anywhere before the comparison. `overlapX`/`overlapY` are two-decimal presentation values derived from the raw ones **after** classification, and rectangles are presented the same way. Both axes must exceed the tolerance for a material rectangle intersection. The report shows two decimals sourced from the raw values and claims no integer precision. Measured records store `rawOverlapX`, `rawOverlapY`, `overlapX`, `overlapY` and `tolerance` alongside the existing identifiers, rectangles and required flag.

Verified boundaries: 1.00 × 2.00 passes, 1.01 × 2.00 fails, 1.49 × 2.00 fails, 2.00 × 0.99 passes, 2.00 × 1.00 passes, 2.00 × 1.01 fails, a negative X overlap passes, 0 × 0 passes, and 1.0001 × 1.0001 fails even though its presentation value rounds to 1.00.

### Rejected variants

- **Treating optional notes as mandatory** — a blank line nobody typed would block a completed sign-off.
- **Treating a supporting screenshot failure as incomplete sign-off** — a disk error would be reported as a review defect.
- **Maintaining a separate report-only blocker list** — the exact split that let a failed run print a clean full-pass sentence.
- **Allowing clean full-pass wording in failed or partial reports** — the report would contradict its own status and exit code.
- **Rounding geometry before the tolerance comparison** — a 1.2 px intersection disappears at integer precision.
- **Storing only integer overlap evidence** — the stored numbers could not reproduce the verdict.

### Verification and status

`--self-test` covers **115 scenarios** with no server and no browser, including all optional-evidence, outcome-coherence and subpixel-boundary cases. Two provisional automated-only runs passed on distinct dynamic ports with zero blocking reasons, zero optional warnings, 109 of 109 overlap probes measured — 42 of them carrying genuinely fractional raw overlaps — and 12 of 12 responsive summary-link records usable. Those runs were provisional; the closure evidence below comes from the final interactive review.

### M3-05H closure evidence

| Item                             | Value                                              |
| -------------------------------- | -------------------------------------------------- |
| Approved implementation SHA      | `2f8e37932b31a96dacb0c9d90e8b221d3120abd4`         |
| Commit                           | `fix(test): reconcile M3 review outcomes`          |
| Independent code audit           | **APPROVED** — all three findings resolved         |
| GitHub Actions run / job         | 31069745421 / 92514999778                          |
| CI checked SHA                   | `2f8e37932b31a96dacb0c9d90e8b221d3120abd4`         |
| CI conclusion                    | **success**                                        |
| Unit/integration                 | **533 passed in 37 files**                         |
| Production-preview E2E           | **23 passed**                                      |
| Bundle                           | raw **407.10 KB** / gzip **122.19 KB**             |
| Final browser review             | **AUTOMATED + USER REVIEW PASSED**, exit 0         |
| Browser-review evidence class    | **FINAL-ELIGIBLE** — exact SHA, `main`, clean tree |
| Blocking reasons                 | **none**                                           |
| Independent browser-review audit | **APPROVED**                                       |

CI confirmed Dev bootstrap, TypeScript, ESLint, Stylelint, Prettier, the authored-comment check, unit/integration, build and build validation.

The review recorded one optional-evidence warning — `manual-final.png` could not be captured because the page had already closed. Under the M3-05H model that is explicitly optional supporting evidence: it produced a `WARNING`, not a blocker, and did not alter the status, the exit code or closure eligibility. Full result detail lives in the untracked review artifacts; it is not duplicated here.

## M3-06 — M3 closure documentation and M4 unblocking

**Status: IMPLEMENTED — AWAITING INDEPENDENT DOCUMENTATION AUDIT AND CI**

This stage is documentation-only. It records closure evidence that already exists; it changes no product runtime, test, package, tooling, workflow, policy or architecture contract. The commit cannot approve itself, so its own verification is still pending — that pending state does not reopen the approved M3 implementation evidence.

### Closure evidence

- M3-01 through M3-04 — **APPROVED AND CLOSED**.
- M3-05 — **APPROVED AND CLOSED**; M3-05A — **APPROVED AND CLOSED**; M3-05B and M3-05C — **APPROVED AND CLOSED**.
- M3-05D through M3-05G — **SUPERSEDED — CORRECTIVE CHAIN CLOSED BY M3-05H**. Each returned CHANGES REQUIRED at its own audit; none is retrospectively described as an individually approved implementation.
- M3-05H — **APPROVED AND CLOSED**, bound to SHA `2f8e37932b31a96dacb0c9d90e8b221d3120abd4` with CI run 31069745421 (job 92514999778, conclusion success).
- Final interactive browser review — **APPROVED**: `AUTOMATED + USER REVIEW PASSED`, exit 0, `FINAL-ELIGIBLE`, sections A–M 13/13 PASS, 6/6 viewports PASS in all three states, 109/109 overlap probes measured and passing, 12/12 responsive Error Summary links usable, 0 Axe violations, 0 final runtime diagnostics with interactive diagnostics included, 6/6 mandatory manual checks PASS, cleanup and port release passed, no user browser or profile touched, no blocking reasons.
- M3 implementation milestone — **APPROVED AND CLOSED**.

### Accepted decisions

- Closure is bound to the exact SHA `2f8e37932b31a96dacb0c9d90e8b221d3120abd4`; CI run 31069745421 verifies that same SHA.
- The final browser review ran on clean `main` with an exact-SHA match, so its evidence class is `FINAL-ELIGIBLE` rather than provisional.
- The `manual-final.png` capture failure is optional supporting evidence, not a defect, and does not affect closure eligibility.
- Browser-review artifacts stay untracked under `artifacts/`; they are local evidence and are not committed.
- M4 is the next permitted implementation milestone once this documentation-only commit passes CI and its restricted diff is independently confirmed.

### Rejected variants

- **Closing M3 from provisional automated-only evidence** — a provisional run is not bound to an approved SHA and carries no user sign-off.
- **Accepting a browser review from a dirty tree or a mismatched SHA** — the artefact reviewed would not be the artefact approved.
- **Treating `manual-final.png` as mandatory evidence** — a supporting screenshot failure would block a completed review, the exact defect M3-05H removed.
- **Committing the local browser-review artifacts** — evidence files are untracked by design and CI never produces them.
- **Starting M4 inside the closure-documentation stage** — closure and implementation are separate gates.
- **Rewriting the historical corrective outcomes as if they had individually passed audit** — M3-05D through M3-05G returned CHANGES REQUIRED, and that record stands.

### Remaining risks

These are factual, non-blocking limitations of what M3 covers. None is an M3 closure blocker.

- The browser review covers the current technical Shared UI verification surface, not canonical storefront visuals.
- Real forced-colors and screen-reader results were user assertions recorded in the manual sign-off; no automated check can substitute for them.
- Header, Footer, the canonical shell and runtime logo consumption remain M4 work.
- The six tracked brand SVGs remain unconsumed at runtime at M3 closure.

## Next Steps

M3 implementation is approved and closed.

After the M3-06 documentation-only commit passes CI and its restricted diff is independently confirmed, **M4 is the next permitted implementation milestone**. Its scope comes from the approved architecture and UI/component/responsive contracts; nothing in this stage authorises implementation changes or new scope.

## Deviations from Spec

None identified. All M0 requirements met.
