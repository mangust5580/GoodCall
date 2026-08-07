# M4 Shell Icon Assets Report

## Status

IMPLEMENTED — AWAITING INDEPENDENT ASSET AUDIT, CI AND USER VISUAL CONFIRMATION

The M4-05-ICN stage produced the application-owned shell icon source set required before M4-05 Header route actions. The assets are not approved by this report and are not runtime-integrated.

## Baseline

| Item                             | Value                                        |
| -------------------------------- | -------------------------------------------- |
| Branch                           | `main`                                       |
| Required starting SHA            | `d7b02e0169391177b6cd4641d598b8a10bdaf553`   |
| Baseline commit                  | `fix(test): stabilize shell focus traversal` |
| `git rev-parse HEAD`             | matched before tracked changes               |
| `git rev-parse origin/main`      | matched before tracked changes               |
| `git diff` / `git diff --cached` | exit 0 before tracked changes                |

`AUDIT.md`, `artifacts/`, RTE-001 and CMP-001 were verified ignored through `.git/info/exclude`.

## Dependency Closure

M4-04B is approved and closed on commit `d7b02e0169391177b6cd4641d598b8a10bdaf553`, workflow run `31138021965`, job `92741720296`. The full job evidence records Vitest `880 passed in 48 files`, Playwright `108 passed`, `0 failed`, `0 flaky`, no retry marker and workflow conclusion `success`.

M4-04A is closed through M4-04B. M4-04 is approved and closed through M4-04A and M4-04B. M4-05 is unblocked, but runtime implementation remains pending this icon asset audit, exact-SHA CI and user visual confirmation.

## Source Evidence

RTE-001 was verified at `artifacts/m4-03/references/RTE-001.png`: `1920 × 3840`, `5 438 232` bytes, SHA-256 `cb943e0b5b525645ede341c53fb6bff7eca714a69b62c042db23d62feb7bdd64`.

CMP-001 was verified at `artifacts/m4-04/references/CMP-001.png`: `1920 × 3412`, `4 354 263` bytes, SHA-256 `127c41f4604135c8e6a89ae6614d5702a3b55a69bfb26ebfea4e4c15a5dfe772`.

CMP-001 inspection used the full-resolution Header and Navigation crop `x=282`, `y=218`, `width=1546`, `height=260`, covering the information bar, main Header action row and category navigation row. RTE-001 was inspected full-resolution for Header density, action hierarchy and the relationship between action icons and visible labels.

## Visual Direction

The selected family direction is a clean monochrome outline set with rounded line caps and joins, restrained detail, transparent backgrounds and no filled state containers. It follows the rounded, compact Header action evidence while normalizing the six roles into one optical system instead of copying screenshot-specific counters, cart totals, obsolete composition or brand-purple state pixels.

## Icon Inventory

| Asset      | Production path                         | Bytes | SHA-256                                                            |
| ---------- | --------------------------------------- | ----: | ------------------------------------------------------------------ |
| catalog    | `src/assets/icons/shell/catalog.svg`    |   449 | `d300da2ef73302ca9c56abde611bedf53daad2a03a345ef0ce4fa62e72f4edb2` |
| search     | `src/assets/icons/shell/search.svg`     |   281 | `9d83689fae2d84e027e9d52ef93787529d1f0851f8882ef2c14eeb70921cedd7` |
| comparison | `src/assets/icons/shell/comparison.svg` |   401 | `65391f1dd77f587554ff7b709249aa41052a9d559bd986b17030f907b1e16c35` |
| favorites  | `src/assets/icons/shell/favorites.svg`  |   376 | `1df513b8e9292e0d4ac73d0e9b0c98340bc8e2306f9b1fe41ba924c8154c7493` |
| cart       | `src/assets/icons/shell/cart.svg`       |   385 | `a2dfe084f4c9e5484c208278ffc4f1cedbe110d622acaacf99691d7d57e7558a` |
| account    | `src/assets/icons/shell/account.svg`    |   314 | `e79c601fae31f7ff4b0d7fffb056858bf91a5e0a91177346bcf4c5ac1441d093` |

## Per-Icon Rationale

Catalog uses four rounded tiles to communicate structured category access without becoming a hamburger, bag or product card.

Search uses the canonical magnifying-glass metaphor with a circular lens and balanced diagonal handle, without embedding an input field.

Comparison uses two side-by-side product panels with matching internal marks so the icon reads as alternatives being compared rather than refresh, sync, analytics or legal scales.

Favorites uses a neutral outline heart for saved items and deliberately avoids a filled active-state variant.

Cart uses an open cart body and two wheels, with no total, badge, counter, dot or price text.

Account uses a neutral head-and-shoulders outline that can support the later visible label `Войти` without avatar, initials, status dot or chevron.

## Shared Geometry Contract

All six SVGs use `viewBox="0 0 24 24"` with intrinsic `width="24"` and `height="24"`. The primary stroke is `1.9`, selected within the required `1.75–2` range to match the compact rounded action evidence while preserving 16px recognizability in the contact sheet. Stroke caps and joins are round across the set. Geometry stays inside the viewBox with consistent optical padding.

## SVG Technical Contract

The production files are standalone UTF-8 SVG sources with transparent backgrounds, no `<title>` or `<desc>`, no authored comments, no text, no raster embedding, no script, no style, no external references, no editor namespaces, no filters, no gradients, no patterns and no animations. Paint is limited to `#000000` and `none`; runtime color is intentionally not encoded in the external SVGs.

The icons are project-specific reconstructions based on semantic role and visual evidence. No third-party icon package, downloaded SVG, Font Awesome, Material Icons, Lucide, Heroicons or similar source was used.

## Accessibility Ownership

The SVG files are semantically decorative by themselves. The consuming React links will own accessible names, route semantics, current state, forced-colors behavior, counters and visible labels.

## Review Contact Sheet

Local ignored review artifact: `artifacts/m4-05/review/shell-icon-contact-sheet.png`.

| Item              | Value                                                                                                                                     |
| ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| Dimensions        | `1800 × 1100`                                                                                                                             |
| Bytes             | `58 676`                                                                                                                                  |
| SHA-256           | `9f582394ce6737763f82bb9482e640f32809f516f990c3af03488c0dc07aecf7`                                                                        |
| Generation method | PowerShell `System.Drawing` render of the same 24px geometry at 16, 20, 24 and 32px with light, brand-surface and construction-guide rows |

The contact sheet is review evidence only. It is not a Header mockup and does not include counters, active-route state or approval claims.

## Asset Validation

`tests/shell-icon-assets.test.ts` validates the six source SVG files, the absence of unexpected shell SVGs, root geometry, structural SVG constraints, allowed paint, opacity, forbidden markup, manifest order, manifest byte identity, unapproved statuses, consuming-component accessibility ownership, no runtime source imports and no third-party icon dependency.

## Exact Changed Files

```
src/assets/icons/shell/catalog.svg
src/assets/icons/shell/search.svg
src/assets/icons/shell/comparison.svg
src/assets/icons/shell/favorites.svg
src/assets/icons/shell/cart.svg
src/assets/icons/shell/account.svg
tests/shell-icon-assets.test.ts
docs/05-implementation/m4-shell-icon-asset-manifest.json
docs/05-implementation/m4-shell-icon-assets-report.md
docs/05-implementation/m4-canonical-shell-report.md
docs/05-implementation/repository-state.md
```

No runtime Header, Search, Catalog, route, Shared UI, CSS, dependency, lockfile, tooling or workflow file changed.

## Local Verification

| Command                                          | Result                                                                                                        |
| ------------------------------------------------ | ------------------------------------------------------------------------------------------------------------- |
| `npx vitest run tests/shell-icon-assets.test.ts` | PASS — **40 tests**                                                                                           |
| `npm run typecheck`                              | PASS                                                                                                          |
| `npm run lint`                                   | PASS                                                                                                          |
| `npm run lint:styles`                            | PASS                                                                                                          |
| `npm run format:check`                           | PASS                                                                                                          |
| `npm run check:comments`                         | PASS — no authored comments                                                                                   |
| `npm test`                                       | PASS — **920 tests in 49 files**                                                                              |
| `npm run build`                                  | PASS — 244 modules, bundle unchanged at raw **424.75 KB** / gzip **126.90 KB** because icons are not imported |
| `npm run validate:build`                         | PASS                                                                                                          |
| `npm run check:full`                             | PASS — includes bounded `verify:dev-bootstrap`, dynamic port `60064`, cleanup and port release verified       |
| `git diff --check`                               | PASS — no whitespace errors                                                                                   |
| deterministic asset inspection                   | PASS — viewBox, byte sizes, SHA-256, element counts, forbidden markup and allowed paint match the manifest    |
| ignore checks                                    | PASS — `AUDIT.md`, RTE-001, CMP-001 and contact sheet remain ignored                                          |

Non-blocking warnings observed during Vitest/check:full: the existing Vite native config-loader warning for `__dirname` in `vitest.config.ts`, jsdom `Window.scrollTo()` notices, and Vite's existing `HydrateFallback` console warning during the bounded bootstrap check.

## CI Status

Pending at commit time. Exact-SHA CI must pass before this stage can be considered an implementation candidate.

## Deviations

None from the asset scope. The repository does not contain tracked copies of the named canonical `03`, `04C` or `06` planning documents, so reconciliation was limited to the tracked M4 implementation report and repository-state document.

## Risks

Comparison relies on a two-panel metaphor and should receive explicit independent visual review at 16px and 20px.

Runtime M4-05 will still need to prove accessible names, visible label behavior, responsive action layout, current-route state, counters and forced-colors behavior without changing these source SVG semantics.

## Next Gate

Independent asset diff audit and user visual confirmation of `artifacts/m4-05/review/shell-icon-contact-sheet.png`, plus exact-SHA green CI. Runtime M4-05 must not begin before those approvals.
