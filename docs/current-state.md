# Current state

Operational handoff. This is not a history log.

## Repository

- Identity: `mangust5580/GoodCall`
- Default branch: `main`
- Current branch: `main`
- Deployment target: GitHub Pages project site (`/GoodCall/`)

## Current milestone

Repository bootstrap — complete.

No design-backed milestone has received visual PASS yet. Foundations has not
started.

## Implemented layers

- React + TypeScript + Vite SPA baseline.
- Entry point: `src/main.tsx`.
- Application ownership: `src/app/` (currently a single minimal `App` component).
- Global styling entry: `src/styles/global.scss`.

Nothing else exists yet. There is no design system, no component library, no
router, no data layer, and no feature architecture.

## Active tooling

| Concern         | Tool                                            |
| --------------- | ----------------------------------------------- |
| Build / dev     | Vite 8 + `@vitejs/plugin-react`                 |
| Language        | TypeScript 6 (`strict`), project references     |
| Styling         | SCSS via `sass-embedded`                        |
| CSS pipeline    | PostCSS: `postcss-pxtorem` then Autoprefixer    |
| JS/TS linting   | ESLint 9 flat config (type-aware)               |
| Style linting   | Stylelint 17 + `stylelint-config-standard-scss` |
| Formatting      | Prettier 3                                      |
| CI / deployment | GitHub Actions                                  |

### px → rem authoring boundary

`postcss.config.js` is the single conversion point.

- Root basis: 16px.
- `minPixelValue: 2` — intentional 1px hairlines stay 1px.
- Only `px` is matched, so `rem`, `em`, `%`, viewport and container units pass
  through untouched.

Verified in build output: `24px → 1.5rem`, `32px → 2rem`, `1px solid` unchanged.

### Base path

`vite.config.ts` holds the only copy of the `/GoodCall/` base path. Application
code reads `import.meta.env.BASE_URL`. A future router derives its basename from
that same value.

## Current visual status

Intentionally minimal. `App` renders a heading and one line of text purely to
prove the toolchain end to end. It is not a design target and has received no
visual review.

## Current routes

None. No router is installed.

## Current dependencies

Runtime: `react`, `react-dom`.

Dev: `vite`, `@vitejs/plugin-react`, `typescript`, `@types/react`,
`@types/react-dom`, `@types/node`, `sass-embedded`, `postcss`, `autoprefixer`,
`postcss-pxtorem`, `eslint`, `@eslint/js`, `typescript-eslint`, `globals`,
`eslint-plugin-react`, `eslint-plugin-react-hooks`, `eslint-plugin-react-refresh`,
`eslint-plugin-jsx-a11y`, `prettier`, `stylelint`, `stylelint-config-standard-scss`.

Nothing else is installed. In particular there is no router, no Supabase, no
data-fetching, state, form, schema, mocking, or E2E library.

## Scripts

```
npm run dev           # Vite dev server (user-owned; agents do not start it)
npm run build         # tsc -b && vite build
npm run preview       # preview the production build
npm run typecheck     # tsc -b
npm run lint          # eslint .
npm run lint:styles   # stylelint "src/**/*.scss"
npm run format        # prettier --write .
npm run format:check  # prettier --check .
```

CI runs install → typecheck → lint → lint:styles → format:check → build.

## Known deferred work

- ESLint is pinned to the 9.x line. ESLint 10 is current, but
  `eslint-plugin-jsx-a11y@6.10.2` and `eslint-plugin-react@7.37.5` declare peer
  support only through ESLint 9. Accessibility coverage was kept rather than
  forced with peer overrides. Revisit when those plugins ship ESLint 10 support.
- TypeScript is pinned to `~6.0.2`. TypeScript 7 is current, but
  `typescript-eslint@8.67` requires `<6.1.0`. Revisit when it supports 7.
- No `public/` directory exists. Add one only when a genuine stable public asset
  is needed.
- No favicon is declared yet.
- GitHub Pages must have its source set to "GitHub Actions" in repository
  settings before the deploy workflow can publish.

## Active open questions

None.

## Next approved step

**Foundations.** It is raster-driven and will use
`E:\Work\Frontend\Pictures\GoodCall-references\Foundations.png`, supplied with a
separate bounded task. Design tokens and Sass helpers are created there, from
raster evidence — not before.

## Normative repository docs

- `AGENTS.md` — canonical agent policy (wins on conflict).
- `CLAUDE.md` — entry pointer for Claude Code.
- `README.md` — developer setup and workflow.
- `docs/current-state.md` — this file.
