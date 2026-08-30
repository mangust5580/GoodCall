# GoodCall

GoodCall is a visual-first React single-page application. The interface is built
from reviewed raster design references, one bounded milestone at a time, rather
than from a speculative architecture written up front.

The repository is currently at its bootstrap baseline: a minimal working
React + TypeScript + Vite app plus the linting, formatting, CI and deployment
setup that later milestones build on.

## Stack

- React 19 + TypeScript
- Vite 8 (`@vitejs/plugin-react`)
- SCSS via `sass-embedded`
- PostCSS: `postcss-pxtorem` + Autoprefixer
- ESLint 9 (flat config, type-aware), Stylelint 17, Prettier 3
- GitHub Actions → GitHub Pages

## Setup

Requires Node.js LTS and npm.

```bash
npm ci
npm run dev
```

## Scripts

| Script                 | Purpose                              |
| ---------------------- | ------------------------------------ |
| `npm run dev`          | Start the Vite dev server            |
| `npm run build`        | Typecheck, then build for production |
| `npm run preview`      | Serve the production build locally   |
| `npm run typecheck`    | TypeScript project check (`tsc -b`)  |
| `npm run lint`         | ESLint over the repository           |
| `npm run lint:styles`  | Stylelint over `src/**/*.scss`       |
| `npm run format`       | Rewrite files with Prettier          |
| `npm run format:check` | Verify formatting without writing    |

## Project structure

```
.github/workflows/   CI and GitHub Pages deployment
docs/                current-state.md — operational handoff
src/
  app/               application ownership (App, production router, routes)
  styles/            global.scss — shared styling entry
    helpers/         generic SCSS helpers (fluid, media mixins)
  main.tsx           React entry point
```

Directories are added when a milestone needs them. There are deliberately no
placeholder route families or speculative folders.

## Visual-first workflow

Each milestone starts from a reviewed raster reference, is implemented against
that evidence, and is then checked visually before the next milestone begins.

Order: Foundations → Components → Global Shell → Home → Catalog → Product Details
→ Cart → Checkout → Order Confirmation → remaining route families.

Design tokens are created in Foundations, from raster evidence. Foundations is
complete for the colour system it was given evidence for; typography, spacing,
radii and elevation are still deferred. See `docs/current-state.md`.

### px-first authoring

Design measurements are authored in `px`, matching what the rasters show. **Never
hand-write `rem` in SCSS** — `postcss.config.js` is the single boundary that
converts px to `rem` against a 16px root, and Stylelint rejects `rem` in source.

Intentional 1px hairlines stay 1px, media-query bounds stay px, and semantically
meaningful units (`%`, `dvh`/`vw`, container units, `fr`, `deg`, `ms`, unitless
values) are left exactly as authored.

### SCSS helpers

`src/styles/helpers/` is a small generic helper layer, used through its entry
point:

```scss
@use '../helpers' as h;

.thing {
  font-size: h.fluid(18, 14); // 18px wide-end, 14px narrow-end, across 320–1280

  @include h.media-up(768px) {
    padding: 32px;
  }
}
```

Fluid sizes are **unitless px numbers**; passing `18px` or `1rem` is a
compile-time error. It contains no design tokens — Foundations defines those from
raster evidence.

## GitHub Pages deployment

The app is published as the GitHub Pages **project site** for
`mangust5580/GoodCall`, so assets resolve under `/GoodCall/`.

That base path is declared once, in `vite.config.ts`. Application code reads
`import.meta.env.BASE_URL` instead of repeating the repository name.

`.github/workflows/deploy.yml` builds and publishes on every push to `main`.
Repository **Settings → Pages → Source** must be set to **GitHub Actions**.

Pages serves static files with no SPA rewrite, so production routing uses React
Router's `HashRouter`: the route lives in the fragment and direct entry and
refresh work without a `404.html` fallback. The live Catalog route is
<https://mangust5580.github.io/GoodCall/#/catalog/smartphones>. The router needs
no basename, because the base path stays in the URL path. Development reference
surfaces keep their own `?reference=` query addresses, starting at
`?reference=index`. See `docs/current-state.md` for the route inventory.

## Raster reference boundary

Design evidence lives outside this repository:

```
E:\Work\Frontend\Pictures\GoodCall-references
```

That archive is **read-only design evidence**. It is not copied wholesale into
the repository. A task reads the specific raster it names, and nothing more.

## Agent entry points

- [`AGENTS.md`](AGENTS.md) — canonical agent policy; wins on conflict.
- [`CLAUDE.md`](CLAUDE.md) — entry pointer for Claude Code.
- [`docs/current-state.md`](docs/current-state.md) — current operational handoff.
