# M4 Shell Icon Assets Report

## Status

**APPROVED AND CLOSED — FOUR ASSETS RUNTIME-INTEGRATED IN M4-05**

| Stage       | Status                         |
| ----------- | ------------------------------ |
| M4-05-ICN   | **APPROVED AND CLOSED**        |
| M4-05-ICN-A | **CLOSED THROUGH M4-05-ICN-B** |
| M4-05-ICN-B | **APPROVED AND CLOSED**        |

The M4-05-ICN stage produced the application-owned shell icon source set required before M4-05 Header route actions. M4-05-ICN-A corrected the product/entity structure and passed exact-SHA CI, but its center-converging marker remained visually insufficient. M4-05-ICN-B replaced that marker with separated directional rows while preserving the approved family contract and the other five SVG assets byte-for-byte.

### Closure evidence

| Item                     | Value                                       |
| ------------------------ | ------------------------------------------- |
| M4-05-ICN-B commit       | `3737da32b4e420f18cdb7b71a54424875dcf3820`  |
| Workflow run             | 31145480483                                 |
| Job                      | 92763895227                                 |
| Vitest                   | 921 passed in 49 files                      |
| Shell icon asset suite   | 41 passed                                   |
| Playwright               | 108 passed, 0 failed, 0 flaky               |
| Build                    | success                                     |
| Workflow conclusion      | success                                     |
| Independent asset audit  | **approved**                                |
| User visual confirmation | **approved** for the complete contact sheet |

The full job log was independently inspected.

### Runtime integration state

M4-05 integrates four of the six assets into the canonical Header user navigation. **No SVG byte changed** during integration.

| Asset      | Approval | Integration               |
| ---------- | -------- | ------------------------- |
| catalog    | approved | `approved-not-integrated` |
| search     | approved | `approved-not-integrated` |
| comparison | approved | `runtime-integrated`      |
| favorites  | approved | `runtime-integrated`      |
| cart       | approved | `runtime-integrated`      |
| account    | approved | `runtime-integrated`      |

Catalog and Search remain approved but deliberately not integrated: the M4-04 Catalog control keeps its text label and the Search form keeps its visible label and text submit, so neither was retrofitted with an icon.

The four integrated assets are consumed only through `src/app/shell/site-header/header-actions-config.ts`, which imports them as Vite asset URLs. Vite inlines each file as a `data:image/svg+xml` URI because all six are far below the inline threshold; the runtime applies them through a CSS mask on a decorative `aria-hidden` span at a 20px box, so colour follows `currentColor`. No SVG path geometry is copied into TSX, and the asset tests assert this directly.

Runtime integration CI for the M4-05 commit was pending at that commit's time; see the M4-05 section of `m4-canonical-shell-report.md`.

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
| comparison | `src/assets/icons/shell/comparison.svg` |   451 | `960541877f591f97d795f689c226fcf7e7607dc9cbb7a7aaf3e8cc5de3d4e61b` |
| favorites  | `src/assets/icons/shell/favorites.svg`  |   376 | `1df513b8e9292e0d4ac73d0e9b0c98340bc8e2306f9b1fe41ba924c8154c7493` |
| cart       | `src/assets/icons/shell/cart.svg`       |   385 | `a2dfe084f4c9e5484c208278ffc4f1cedbe110d622acaacf99691d7d57e7558a` |
| account    | `src/assets/icons/shell/account.svg`    |   314 | `e79c601fae31f7ff4b0d7fffb056858bf91a5e0a91177346bcf4c5ac1441d093` |

## Per-Icon Rationale

Catalog uses four rounded tiles to communicate structured category access without becoming a hamburger, bag or product card.

Search uses the canonical magnifying-glass metaphor with a circular lens and balanced diagonal handle, without embedding an input field.

Comparison uses two simplified product/card entities with two separated opposing directional rows, so the icon reads as alternatives being compared rather than server racks, list columns, refresh, sync, analytics or legal scales.

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

| Item              | Value                                                                                                                               |
| ----------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| Dimensions        | `2200 × 1500`                                                                                                                       |
| Bytes             | `142 827`                                                                                                                           |
| SHA-256           | `1c01b1d35849ebc798e5874d93c1331c65d23dcf8648d1989f1f1210b57d68ef`                                                                  |
| Generation method | Bounded foreground headless Playwright rasterization from the actual six production SVG file bytes loaded from disk, with no server |

The regenerated contact sheet is review evidence only. It is not a Header mockup and does not include counters, active-route state or approval claims. It includes the required light row, dark/brand row, 16px, 20px, 24px and 32px sizes, construction/safe-area evidence, a dedicated Catalog-vs-Comparison block at 16px, 20px, 24px and 32px, and a zoomed comparison-marker detail derived from the actual SVG.

## Asset Validation

`tests/shell-icon-assets.test.ts` validates the six source SVG files, the absence of unexpected shell SVGs, root geometry, structural SVG constraints, allowed paint, opacity, forbidden markup, manifest order, manifest byte identity, unapproved statuses, consuming-component accessibility ownership, no runtime source imports and no third-party icon dependency.

M4-05-ICN-B keeps a bounded source-level differentiation assertion: Catalog remains the four-tile grid with no path marker, while Comparison must contain exactly two product/card rectangles and two separated non-circular directional rows. The test rejects both the original list-column marks and the M4-05-ICN-A center-converging marker without claiming browser-independent proof of human semantic recognition.

## M4-05-ICN-A Correction

Baseline: `cd971f954649c83415056db56386544bf4b2e274`, the M4-05-ICN commit `feat(assets): add shell icon set`. The previous exact-SHA CI succeeded in workflow run `31142675965`, job `92755640110`: Vitest `920 passed in 49 files`, shell icon asset suite `40 passed`, Playwright `108 passed`, `0 failed`, `0 flaky`, build `success`, workflow conclusion `success`.

Blocking defect: the previous `comparison.svg` used two vertical rounded rectangles and three short horizontal marks inside each rectangle. At 16px and 20px it could read as server racks, columns, devices or lists, and it was too close to the structured panel semantics of `catalog.svg`.

Correction: only `src/assets/icons/shell/comparison.svg` changed among production icons. The final geometry uses two 5.5px-wide product/card rectangles at opposite sides of the 24px viewBox and one central bidirectional horizontal relation marker. Catalog remains four equal rounded tiles; Comparison now has two larger card silhouettes plus the visible relation marker, making the two assets distinguishable at 16px and 20px in the regenerated contact sheet.

Final corrected asset identity: `435` bytes, SHA-256 `b9ce0fae1f130e4d830805212e8d7005fba072d269b2fbff6ae3a3c907c28006`, element counts `svg=1`, `rect=2`, `path=1`, path count `1`, paint values `#000000` and `none`.

M4-05-ICN-A exact-SHA CI succeeded for commit `69c0eca78e91cd66acad7f031d756454bd90dea5`: workflow run `31144366072`, job `92760669561`, Vitest `921 passed in 49 files`, shell icon asset suite `41 passed`, Playwright `108 passed`, `0 failed`, `0 flaky`, build `success`, workflow conclusion `success`.

The technical correction was valid, but the visual gate failed only for Comparison. At 16px the relation marker nearly collapsed and the icon read primarily as two narrow panels. At 20px the marker read as a clasp or compact connector. At 24px and 32px the converging arrowheads merged into a diamond or bow-tie. The root cause was the center-converging arrowhead geometry, short shaft and optical overlap after rasterization.

## M4-05-ICN-B Correction

Baseline: `69c0eca78e91cd66acad7f031d756454bd90dea5`, the M4-05-ICN-A commit `fix(assets): clarify comparison icon`.

Selected marker option: Option A, two separated directional rows. The upper row points left-to-right and the lower row points right-to-left. The arrowheads sit at opposite row ends, so they no longer converge into one optical center.

Final geometry:

- Left product/card entity: `rect x="2.75" y="6.75" width="5.4" height="10.5" rx="1.4"`.
- Right product/card entity: `rect x="15.85" y="6.75" width="5.4" height="10.5" rx="1.4"`.
- Upper relation row: `M9.25 10.1h5.5m-1.35-1.3 1.35 1.3-1.35 1.3`.
- Lower relation row: `M14.75 13.9h-5.5m1.35-1.3-1.35 1.3 1.35 1.3`.

Small-size review from the regenerated actual-SVG contact sheet: at 16px the two-card silhouette remains present and the marker reads as separated horizontal directional detail rather than a dot or clasp; at 20px both directional rows are visible and distinct from the cards; at 24px and 32px there is no central diamond or bow-tie and the relation marker remains balanced against the cards.

Final corrected asset identity: `451` bytes, SHA-256 `960541877f591f97d795f689c226fcf7e7607dc9cbb7a7aaf3e8cc5de3d4e61b`, element counts `svg=1`, `rect=2`, `path=2`, path count `2`, paint values `#000000` and `none`.

The five approved SVGs remain byte-identical to the M4-05-ICN baseline. Runtime M4-05 has not started, no runtime source imports any shell icon, and the assets remain `produced-not-integrated`.

## Exact Changed Files

```
src/assets/icons/shell/comparison.svg
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

## CI Status

Pending at commit time for M4-05-ICN-B. Exact-SHA CI must pass before this correction can be considered an implementation candidate.

## Deviations

None from the asset scope. The repository does not contain tracked copies of the named canonical `03`, `04C` or `06` planning documents, so reconciliation was limited to the tracked M4 implementation report and repository-state document.

## Risks

The corrected comparison icon now uses separated directional rows, but still requires independent visual review at 16px and 20px to confirm the intended comparison reading.

Runtime M4-05 will still need to prove accessible names, visible label behavior, responsive action layout, current-route state, counters and forced-colors behavior without changing these source SVG semantics.

## Next Gate

Independent asset diff audit and user visual confirmation of the regenerated `artifacts/m4-05/review/shell-icon-contact-sheet.png`, plus exact-SHA green CI. Runtime M4-05 must not begin before those approvals.
