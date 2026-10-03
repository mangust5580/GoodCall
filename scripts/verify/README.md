# Verification harness

Repository-owned commit gates. They need Node 24 and a local Google Chrome, and
no extra dependencies. Set `GOODCALL_VERIFY_CHROME` if Chrome is not in a
standard location.

```
npm run verify                          # every suite
npm run verify -- checkout order        # selected suites
npm run verify -- --reference=<git-ref> # reference build for the pixel diff (default HEAD)
npm run verify -- --keep-artifacts      # keep dist/verify for inspection
```

The command exits non-zero unless every selected gate is green. A failure
listed under known baseline drift does not fail its gate.

## What the runner does

1. It builds the working tree into `dist/verify/app`. If `product-details` is
   selected, it also exports the reference ref with `git archive` and builds it
   into `dist/verify/reference-app`.
2. It serves each build on an ephemeral `127.0.0.1` port.
3. It runs each suite as a child process and parses its `RESULT passed/total`
   and `FAIL` lines. Logs go to `dist/verify/logs`.
4. It deletes `dist/verify` at the start of every run and again at the end,
   unless `--keep-artifacts` is passed. `dist/` is git-ignored. Chrome uses a
   throwaway profile in the OS temp directory, which is removed on close.

## Deterministic environment

Builds run in a Node child process with an explicit environment object, so no
shell semantics are involved:

- every inherited `VITE_*` variable is removed;
- `VITE_DADATA_TOKEN` is set to `''` (DaData unconfigured, manual address);
- the Supabase URL and key are set to mock values;
- Vite's `envDir` is an empty directory, so `.env`/`.env.local` are never read.

A build-time guard checks the resolved Vite env and aborts unless it reports
`DaData mode unconfigured, Supabase mode mock`. It prints modes only, never
values. Every Supabase and DaData request is intercepted in the browser, so
nothing reaches a backend.

## Suites

| Suite               | Owns                                                                                                                                                                                       | Historical label            |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------- |
| `content`           | Product Details content registry vs the catalog fixture (Vite SSR)                                                                                                                         | content verification        |
| `product-details`   | PDP pages, route states, cross-links, cart/favourites, reference mode, keyboard, responsive, and the frozen `?reference=product-details` pixel diff vs the reference build at 1440 and 390 | PDP harness, reference diff |
| `home-cart`         | Home popular products → shared cart                                                                                                                                                        | home-cart                   |
| `compare`           | Comparison page and catalog compare controls                                                                                                                                               | compare-recon               |
| `compare-store`     | `compareStore` persistence/recovery (Node, no browser)                                                                                                                                     | compare-store               |
| `search`            | Search results and cart integration                                                                                                                                                        | search-recon                |
| `cart`              | Cart page, badges, catalog add, fallback                                                                                                                                                   | cart-recon                  |
| `favorites`         | Favourites page and shell                                                                                                                                                                  | favorites-recon             |
| `checkout`          | Validation (including manual city/street/house), slot and payment focus, valid placement → `#/order-confirmation`, session order, cart line removal, shell count                           | checkout                    |
| `order`             | Order Confirmation. It seeds its own cart and places its own order; it does not depend on another suite.                                                                                   | order                       |
| `form-unconfigured` | Checkout field rules in manual-address (no DaData) mode. It asserts the city field is plain text.                                                                                          | form-unconfigured           |

`fixtures/catalog.json` is a static snapshot of the public demo catalog
(categories, products, home popular), served as the mocked Supabase response.

## Known baseline drift

- `favorites`: `shell: comparison specimen 3 unchanged` (pre-existing).
- Configured-DaData form checks and Search C are not part of these gates
  (pre-existing drift).
