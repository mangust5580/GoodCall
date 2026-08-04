# M2A Asset Intake Handoff

## Available Evidence

### Canonical References

- **FND-001**: Historical provenance and design reference only (not the exact production-logo authority)
- **Logo**: Adapted abstract circular/G-shaped symbol + outlined uppercase GOODCALL wordmark. Production SVG family delivered and tracked in M2B — see [m2-brand-assets-report.md](./m2-brand-assets-report.md)

### Current Limitations

- Font family/licensing status pending audit (application typography; the logo wordmark is outlined and carries no runtime font dependency)
- Production icon inventory not documented
- Runtime raster media assets not inventoried

## Deferred to Codex Asset Task

### Primary Assets

- [x] Primary horizontal logo SVG (h/w ratio, viewBox, clear space, minimum size)
- [x] Symbol-only logo SVG variant
- [x] Inverse/monochrome variants (subject to design validation)

Completed in M2B. Tracked production paths:

```
src/assets/brand/goodcall-logo.svg
src/assets/brand/goodcall-symbol.svg
src/assets/brand/goodcall-logo-inverse.svg
src/assets/brand/goodcall-symbol-inverse.svg
src/assets/brand/goodcall-logo-monochrome.svg
src/assets/brand/goodcall-symbol-monochrome.svg
```

Approved colors: symbol `#8343FB`, wordmark `#0A0F2C`, inverse `#FFFFFF`, monochrome `currentColor`.

Clear space: at least `x` on every side, where `x` is the width of the central form of the symbol geometry.

Minimum sizes: horizontal logo 120px width; symbol-only mark 16px.

Accessibility ownership: asset files are context-neutral with no hardcoded `<title>`. The consuming component owns the accessible name, decorative duplicates can be hidden from the accessibility tree, symbol-only interactive use requires an explicit accessible name, and adjacent visible brand text must not create duplicate spoken labels.

Assets are tracked and approved but not yet consumed by any runtime component. Full contract: [m2-brand-assets-report.md](./m2-brand-assets-report.md) and [m2-brand-asset-manifest.json](./m2-brand-asset-manifest.json).

### Icon System

- [ ] Icon inventory definition (count, naming convention, grid size)
- [ ] Icon packaging strategy (sprite, individual, icon font decision)
- [ ] Accessibility metadata per icon (decorative vs. semantic, alt-text ownership)

### Typography

- [ ] Font file audit (licensing status, self-hosted vs. CDN)
- [ ] System font stack fallback strategy (currently using generic system stack)
- [ ] Brand font selection (if different from system stack)

### Media Assets

- [ ] Product photography inventory audit
- [ ] Editorial content images (hero, supporting, promotional)
- [ ] Raster fallback/shadow assets (if required for older clients)

### Responsive Derivatives

- [ ] Logo sizing rules across viewports (beyond the approved minimum sizes)
- [ ] Asset crop/fit policy for responsive image containers
- [ ] Quality/format metadata (PNG, WEBP, AVIF, quality levels)
- [ ] Lazy-loading and srcset strategy

## Intake Manifest Requirements

For future asset handoff to design system, require canonical metadata:

**Required Fields**:

- Asset ID (canonical identifier)
- Source Design File (design system reference or Figma ID)
- Source Filename (original file name)
- Provenance (source/origin)
- Semantic Role (functional use)
- Dimensions/ViewBox (if applicable)
- Format (SVG, PNG, etc.)
- Alt Text Ownership (decorative vs. semantic)
- Crop/Fit Policy (sizing constraints)
- Responsive Metadata (viewport-specific derivatives)
- Review Status (approval tracking)

## Next Steps

1. **Icon Audit**: Inventory and classify all product icons
2. **Typography Audit**: Confirm font licensing and performance targets for application typography
3. **Media Audit**: Catalog product photography and marketing assets
4. **Responsive Strategy**: Define sizing rules across breakpoints
5. **Accessibility Verification**: Validate alt-text ownership and semantic roles for remaining asset classes

No production assets were created in M2A; this document established the intake protocol. The logo asset family was delivered and tracked in M2B. Icon inventory, general application typography and font audit, product and content media inventory, responsive media derivative work, and preload evidence remain open.

Outlined logo wordmark glyphs do not approve Manrope as the global UI font. The application font baseline remains the system stack.
