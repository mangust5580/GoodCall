# M2B Brand Assets Implementation Report

## Status

IMPLEMENTED — AWAITING EXTERNAL AUDIT AND CI

This report documents tracked integration of the approved GoodCall logo asset family. It records local verification only. No approval or milestone closure is claimed.

## Approved Adapted Direction

The GoodCall symbol is an adapted abstract circular/G-shaped brand mark. This adapted direction was accepted as the canonical production direction during M2B production review. The asset family is approved for tracked integration.

Approved scope of the accepted direction:

- primary horizontal lockup
- primary symbol-only mark
- inverse family
- monochrome family
- outlined Manrope 800 wordmark

## Removal Of Fidelity Requirement

Exact pixel fidelity to FND-001 is no longer required. FND-001 remains historical provenance and design reference only; it is not the authority for production logo geometry. The tracked assets in `src/assets/brand/` are the production authority.

## Production Asset Family

Six approved SVG assets are tracked. Geometry, viewBox values and fills were copied byte-for-byte from the approved review package. No optimization, reformatting or metadata injection was applied.

| Asset                          | Role            | Variant    | viewBox          | Fill strategy |
| ------------------------------ | --------------- | ---------- | ---------------- | ------------- |
| goodcall-logo.svg              | horizontal logo | primary    | `0 0 666.664 84` | fixed brand   |
| goodcall-symbol.svg            | symbol-only     | primary    | `14 18 98 84`    | fixed brand   |
| goodcall-logo-inverse.svg      | horizontal logo | inverse    | `0 0 666.664 84` | fixed white   |
| goodcall-symbol-inverse.svg    | symbol-only     | inverse    | `14 18 98 84`    | fixed white   |
| goodcall-logo-monochrome.svg   | horizontal logo | monochrome | `0 0 666.664 84` | currentColor  |
| goodcall-symbol-monochrome.svg | symbol-only     | monochrome | `14 18 98 84`    | currentColor  |

Horizontal assets contain three paths and fifteen subpaths. Symbol-only assets contain two paths and three subpaths. Symbol geometry is identical across all six assets. Wordmark outline geometry is identical across all horizontal assets. Only the fill strategy differs between variants.

### Byte Identity Protection

The repository is configured with `core.autocrlf=true`. Without an explicit attribute, a checkout on Windows would rewrite the LF line ending in each asset to CRLF, changing the file bytes and breaking the approved SHA-256 identity that `tests/brand-assets.test.ts` enforces.

A single narrowly scoped rule in `.gitattributes` prevents this:

```
src/assets/brand/*.svg -text
```

Line-ending conversion is disabled for the brand assets only. No other path is affected. The stored git blobs hash to the approved SHA-256 values, so every platform checks out byte-identical assets.

## Exact Tracked Paths

```
src/assets/brand/goodcall-logo.svg
src/assets/brand/goodcall-symbol.svg
src/assets/brand/goodcall-logo-inverse.svg
src/assets/brand/goodcall-symbol-inverse.svg
src/assets/brand/goodcall-logo-monochrome.svg
src/assets/brand/goodcall-symbol-monochrome.svg
```

## Approved Colors And Token Names

Approved brand values:

- Symbol purple: `#8343FB`
- Wordmark navy: `#0A0F2C`
- Inverse: `#FFFFFF`
- Monochrome: `currentColor`

Tokens added in this milestone:

| Layer     | Name                 | Value     |
| --------- | -------------------- | --------- |
| Primitive | `$brand-primary`     | `#8343fb` |
| Primitive | `$brand-ink`         | `#0a0f2c` |
| Semantic  | `--gc-brand-primary` | `#8343fb` |
| Semantic  | `--gc-brand-ink`     | `#0a0f2c` |

The tokens document approved brand values for future component and design-system consumption. They are not applied to existing technical UI in this milestone.

Existing technical defaults are unchanged: `--gc-action`, `--gc-action-visited`, `--gc-focus-ring` and `--gc-text-primary` retain their M2A technical values. No palette scale, derived shade or component token was introduced.

The logo SVG files keep their fixed approved fills. Assets do not read the CSS custom properties.

## Outlined Wordmark Provenance

The wordmark was produced from the official Google Fonts Manrope variable font instantiated at weight 800, with `GOODCALL` glyphs emitted as outlines and `-0.025em` tracking applied between glyph origins. Font source and OFL license evidence are recorded in the approved review package.

## Absence Of Runtime Font Dependency

All six assets contain zero `<text>` elements. There is no embedded font, no font reference and no font-family dependency. Manrope is not registered as a runtime application font, is not preloaded, and is not part of the global font stack. The global font baseline remains the M2A system stack exposed through `--gc-font-family`.

## Asset Roles

### Primary

`goodcall-logo.svg`, `goodcall-symbol.svg`. Fixed brand colors — symbol `#8343FB`, wordmark `#0A0F2C`. Intended for light surfaces.

### Inverse

`goodcall-logo-inverse.svg`, `goodcall-symbol-inverse.svg`. Fixed `#FFFFFF`. Intended for approved dark surfaces only.

### Monochrome

`goodcall-logo-monochrome.svg`, `goodcall-symbol-monochrome.svg`. `currentColor` fills. The consumer owns the resolved color and the contextual contrast review.

## Clear-Space Rule

Maintain at least `x` of clear space on every side of the logo, where `x` is the width of the central form of the symbol geometry. In the tracked symbol asset the central form is the inner path of the symbol. The rule applies to both horizontal and symbol-only assets.

## Minimum Sizes

- Horizontal logo: minimum rendered width 120px
- Symbol-only mark: minimum rendered size 16px

The symbol-only form is used only in constrained contexts where the horizontal lockup cannot meet its minimum width with readable wordmark.

## Prohibited Transformations

- no stretching, skewing or rotation
- no geometry edits and no edits to outlined glyphs
- no recoloring of primary assets
- no change to the symbol/wordmark gap or wordmark tracking
- no separation of symbol from wordmark outside symbol-only use
- no gradients or shadows
- no primary logo on insufficient-contrast dark surfaces
- no runtime recreation of the wordmark with live text

## Accessibility Ownership

- asset files are context-neutral and carry no `<title>` or `<desc>`
- no hardcoded accessible name exists in any asset
- the consuming component owns the accessible name
- a horizontal logo inside a home link receives exactly one accessible name from the consumer
- a decorative duplicate logo can be hidden from the accessibility tree
- symbol-only interactive use requires an explicit accessible name
- adjacent visible brand text must not produce duplicate spoken labels

## Runtime Consumption Boundary

The assets are tracked and approved but not consumed. This task implements no Header, no Footer and no shared logo component, and changes no route or existing technical UI.

Actual runtime usage belongs to the M4 canonical shell or another explicitly approved component milestone. Any future integration must select a context-appropriate primary, inverse or monochrome asset, and the minimum sizes and clear-space rule remain mandatory.

**Superseded:** this section describes the state during M2B. Runtime consumption began in M4-02 — see the [M4-02 runtime integration addendum](#addendum--m4-02-runtime-integration-2026-08-06). The minimum sizes and the clear-space rule remain mandatory.

## Validation And Tests

Serverless contract test: `tests/brand-assets.test.ts` (50 assertions across the six assets).

Verified per asset:

- file exists at its tracked production path
- byte length matches the manifest
- SHA-256 matches the approved manifest hash
- content is readable UTF-8 SVG markup with the SVG namespace
- absence of `<text`, `<image`, `<foreignObject`, `<script`, `javascript:`, `data:` and authored comments
- absence of external `http://` and `https://` references and of any `href`
- viewBox matches the manifest
- path count and subpath count match the manifest
- approved fill strategy per variant
- primary brand colors are absent from inverse and monochrome assets
- monochrome assets hardcode no color value
- wordmark geometry is present only in horizontal assets

The test reads assets from disk and does not import them into the runtime bundle. It introduces no dependency.

## Tracked Manifest

`docs/05-implementation/m2-brand-asset-manifest.json`

Strict UTF-8 JSON without BOM, repository-formatted, with no absolute local paths. Every entry records `approvalStatus: approved` and `integrationStatus: tracked-not-yet-consumed`, plus provenance, geometry, fill strategy, accessibility ownership, intended surfaces, minimum size, clear space and production path.

## External Canonical Documentation Requiring Synchronization

No authoritative tracked copies of the canonical project documents exist in this repository. No duplicate copies were created. The following documents require synchronization outside the repository before M2B documentation closure:

- `03-global-canonical-decisions.md` — BRD-001: adapted canonical symbol, fidelity to FND-001 removed, six approved variants, approved colors, clear space, minimum sizes
- `03-canonical-name-registry.md` — canonical asset names for the six approved variants
- `03-regeneration-backlog.md` — no raster regeneration required; the production SVG task was completed outside the regeneration backlog
- `04A-open-questions.md` — OQ-AST-01 resolved
- `04B-open-questions.md` — OQ-C-AST-01 resolved; OQ-B-AST-06 logo portion resolved while icons and global fonts remain open
- `04B-architecture-contracts.md` — brand asset placement and token contract
- `04C-ui-component-responsive-contracts.md` — clear space, minimum sizes and responsive horizontal/symbol selection

FND-001 is recorded as historical provenance and reference only, not as the exact production-logo authority.

The absence of these copies does not block code integration. It does block final documentation closure outside the repository.

## Deferred Work

- shared logo component
- Header and Footer implementation
- runtime consumption in the application shell
- icon inventory and icon packaging strategy
- general application typography and font audit
- product and content media inventory
- responsive media derivative work
- preload evidence
- component-level brand tokens and contrast validation
- dark theme

## M2B Closure Conditions

M2B remains a closure candidate. Closure requires:

1. independent repository diff audit of the resulting commit
2. GitHub Actions CI success on `main`
3. external synchronization of the canonical project documents listed above

Asset design approval is not a blocker; the asset family is already approved.

## Next Milestone Boundary

M3 has not started. M4 owns the canonical shell and is the earliest milestone permitted to consume these assets at runtime, unless another component milestone is explicitly approved first.

## Addendum — M4-02 Runtime Integration (2026-08-06)

**This addendum records work performed during M4-02, not during M2B.** Everything above describes the M2B implementation, when the six approved assets were tracked and deliberately **not** consumed by any runtime component. That remained true for the whole of M2B and M3.

M4-02 is the first stage to consume them at runtime.

### What M4-02 integrated

- An application-owned component, `BrandHomeLink`, published from `src/app/shell/brand`. It is not a Shared UI primitive, not a route-domain component, and is not exported from `src/shared/ui`.
- **All six approved lockup/variant combinations** are reachable through a typed, exhaustive selection table: horizontal and symbol × primary, inverse and monochrome. Filenames are never derived by string concatenation; each asset is a distinct Vite module import.
- The **primary horizontal** asset is the current runtime baseline and the only variant mounted today.
- Inverse, monochrome and symbol variants are integrated and unit-tested but **not yet placed by a final consumer**. Placement inside the canonical Header and Footer remains later M4 work.

### Accessible-name ownership

The consuming component owns exactly one accessible name — `GoodCall — на главную` — declared on the link. The visual is decorative inside that link: images carry `alt=""`, the monochrome mask element carries `aria-hidden="true"`, no `<title>` is introduced, and no adjacent visible text duplicates the spoken name. The SVG files themselves still contain no accessible names, exactly as M2B specified.

### Monochrome currentColor strategy

Rendering the monochrome asset through an ordinary external `<img>` would have prevented inheritance and made the "consumer-owned `currentColor`" contract untrue in practice. Instead the monochrome variants render as a CSS mask over the immutable approved asset URL: `mask-image` references the Vite-imported asset and `background-color: currentcolor` supplies the visible colour. Asset bytes and geometry are unchanged, no replacement colour is hardcoded, no SVG paths are recreated inline, no `dangerouslySetInnerHTML` is used, and no dependency was added.

Primary and inverse variants render as imported `<img>` resources.

### Asset integrity

**All six SHA-256 values and byte sizes are unchanged**, and the existing hash, geometry and forbidden-markup assertions in `tests/brand-assets.test.ts` remain intact. Only the manifest `integrationStatus` assertion changed, from `tracked-not-yet-consumed` to `runtime-integrated`.

One build behaviour worth recording: Vite inlines assets below its 4 KB threshold, so the three symbol SVGs (726–736 bytes) are emitted as `data:` URIs while the three horizontal logos are emitted as files — byte-identical to source at 10208, 10208 and 10223 bytes. Inlining URL-encodes the markup and normalises attribute quoting; it changes no geometry, no fill and no viewBox. Tests verify the runtime asset against the approved source geometry rather than against a filename, so integrity is asserted in both forms.

### Manifest changes

Every entry now reports `integrationStatus: runtime-integrated`. The stale risk _"not yet consumed by any runtime component"_ was removed and replaced with _"placement inside the canonical Header and Footer remains later M4 work"_. Context-specific risks are preserved: inverse requires an approved dark surface, monochrome contrast belongs to the consumer, and symbol use remains restricted to constrained contexts. Approved hashes, byte sizes, geometry, viewBoxes, path counts, fill strategies, production paths and approval fields are untouched.

## See Also

- [M4 Canonical Application Shell Report](m4-canonical-shell-report.md)
- [M2B Brand Asset Manifest](m2-brand-asset-manifest.json)
- [M2A Foundations Report](m2-foundations-report.md)
- [M2A Asset Intake Handoff](m2-asset-intake.md)
- [Repository State](repository-state.md)
