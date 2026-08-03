# M2A Asset Intake Handoff

## Available Evidence

### Canonical References

- **FND-001**: Partial foundation reference (normative design planning document)
- **Logo**: Circular purple symbol + uppercase GOODCALL text (canonical role established; production SVG absent)

### Current Limitations

- Exact SVG source for primary logo unavailable
- Font family/licensing status pending audit
- Production icon inventory not documented
- Runtime raster media assets not inventoried

## Deferred to Codex Asset Task

### Primary Assets

- [ ] Primary horizontal logo SVG (h/w ratio, viewBox, clear space, minimum size)
- [ ] Symbol-only logo SVG variant
- [ ] Inverse/monochrome variants (subject to design validation)

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

- [ ] Logo sizing rules across viewports
- [ ] Asset crop/fit policy for responsive image containers
- [ ] Quality/format metadata (PNG, WEBP, AVIF, quality levels)
- [ ] Lazy-loading and srcset strategy

## Intake Manifest Requirements

For future asset handoff to design system, require canonical metadata:

```
Asset ID:              gc-logo-horizontal-primary
Source Design File:    FND-001 (reference) or Figma ID
Source Filename:       goodcall-logo-h.svg
Provenance:            Canonical brand reference
Semantic Role:         Site identity / header brand mark
Dimensions/ViewBox:    [360x120] or equiv.
Format:                SVG (scalable vector)
Alt Text Ownership:    Semantic (page heading provides context)
Crop/Fit Policy:       Preserve aspect ratio, no letterbox
Responsive Metadata:   [mobile: 48px width, tablet: 80px width, desktop: 120px width]
Review Status:         Pending design review
```

## Next Steps

1. **Codex Task Initiation**: Collect canonical logo SVG from brand source
2. **Icon Audit**: Inventory and classify all product icons
3. **Typography Audit**: Confirm font licensing and performance targets
4. **Media Audit**: Catalog product photography and marketing assets
5. **Responsive Strategy**: Define sizing rules across breakpoints
6. **Accessibility Verification**: Validate alt-text ownership and semantic roles

No production assets are created in M2A. This document establishes intake protocol only.
