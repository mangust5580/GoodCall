# Product content sources

Developer provenance for the local Product Details content registry
(`src/pages/product-details/content/`). This file is documentation only; it is
never rendered.

## Policy (B2)

- Specification values come from the manufacturer's official technical
  specification page first, then official press, support or compare pages.
  Independent specification databases are a cross-check only; a fact supported
  only by them is omitted.
- Only normalized factual values are copied (numbers with units, standard and
  component names). Descriptions, highlights and feature texts are original
  Russian copy grounded in the listed facts; manufacturer marketing prose is
  not copied.
- Values describe the configuration in the live product name (storage, RAM
  where the name carries it, colour). Static attributes repeat those name
  values; they are not selectable variants.
- Unverifiable or region-dependent values are omitted rather than guessed.
- No operational facts: no stock, delivery dates, SKU, bonuses, sales rank or
  review bodies.

All sources below were checked on 2026-10-03.

## Smartphones

| Slug                    | Sources                                                                                                                                                            | Notes                                                                                                                                                                              |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `iphone-15-128`         | <https://support.apple.com/en-us/111831>                                                                                                                           | Refresh rate, SIM layout (regional) and iOS version omitted; the accepted specimen's «60 Гц», «nano-SIM и eSIM» and «iOS 17» rows are not carried into production.                 |
| `iphone-15-pro-128`     | <https://support.apple.com/en-us/111829>                                                                                                                           | Qi wattage as listed on the page (7.5 W).                                                                                                                                          |
| `galaxy-s24-128`        | <https://www.samsung.com/uk/business/smartphones/galaxy-s/galaxy-s24-amber-yellow-128gb-sm-s921bzydeub/>, <https://www.samsung.com/us/support/answer/ANS10000756/> | Chipset name is region-dependent and not listed on the official page, so the CPU is described by cores and clock. IP rating and charging wattage omitted (not on the cited pages). |
| `galaxy-a55-128`        | <https://www.samsung.com/uk/smartphones/galaxy-a/galaxy-a55-5g-awesome-iceblue-128gb-sm-a556blbaeub/>                                                              | Charging wattage not listed; row says «Поддерживается».                                                                                                                            |
| `pixel-8-128`           | <https://store.google.com/us/product/pixel_8_specs>, <https://blog.google/products/pixel/google-pixel-8-pro/>                                                      | The Store specs page now redirects behind a consent wall; values were read from its indexed official content. NFC and unlock methods omitted.                                      |
| `xiaomi-14-256`         | <https://www.mi.com/global/product/xiaomi-14/specs>                                                                                                                | Telephoto described by focal length (its photo-mode resolution differs from total pixels).                                                                                         |
| `redmi-note-13-pro-256` | <https://www.mi.com/global/product/redmi-note-13-pro/specs>                                                                                                        | 4G model (name has no «5G»). RAM 8 GB from the official 8+256 configuration. The official colour list has no blue; the «Синий» attribute repeats the live catalogue name.          |
| `poco-f6-256`           | <https://www.mi.com/global/product/poco-f6/specs>                                                                                                                  | Global page lists 8+256 and 12+512; the 12/256 configuration follows the live name. IP rating omitted.                                                                             |
| `oneplus-12-256`        | <https://www.oneplus.com/us/12/specs>                                                                                                                              | «Сланец» repeats the live name; the official colour names differ by market.                                                                                                        |
| `realme-gt6-256`        | <https://www.realme.com/global/realme-gt-6/specs>                                                                                                                  | IP rating and fingerprint sensor type not listed; omitted.                                                                                                                         |
| `honor-magic6-lite-256` | <https://www.honor.com/uk/phones/honor-magic6-lite/spec/>                                                                                                          | Refresh rate from the official HONOR product summary. RAM is 8 GB physical (the page's «(8+8)» includes virtual RAM). NFC omitted (ambiguous on the page).                         |
| `nothing-phone-2a-256`  | <https://intl.nothing.tech/pages/phone-2a>                                                                                                                         | RAM 12 GB from the official 12+256 configuration. OS version omitted because the page shows the current update, not the launch version.                                            |
| `vivo-v30-256`          | <https://www.vivo.com/en/products/param/v30>                                                                                                                       | —                                                                                                                                                                                  |
| `oppo-reno-11-256`      | <https://www.oppo.com/en/smartphones/series-reno/reno11/specs/>                                                                                                    | Reno11 5G (CPH2599). RAM omitted: 8+256 and 12+256 both exist. Thickness for the green finish.                                                                                     |
| `infinix-zero-30-256`   | <https://www.infinixmobility.com/zero-30-5g>, <https://wap.infinixmobility.com/specs/zero-30-5g>                                                                   | RAM omitted: 8 and 12 GB variants share 256 GB. Bluetooth version omitted.                                                                                                         |
| `tecno-camon-30-256`    | <https://www.tecno-mobile.com/phones/tech-specs/techspecs/camon-30/>                                                                                               | 4G model. RAM omitted (8 and 12 GB variants). Weight not listed; thickness depends on the back finish.                                                                             |

## Smart watches

| Slug                      | Sources                                  | Notes                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| ------------------------- | ---------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `apple-watch-series-9-45` | <https://support.apple.com/en-us/111833> | Case material, weight and GPS/Cellular variant are not identifiable from the live name, so they are omitted. «Чёрный» repeats the live name (Apple: Midnight). Media: one local render (black Apple Watch case and sport band) cropped from the repository's own `src/assets/media/blog/blog-article-new-apple-watch-changes.png`; master `product-details-gallery-apple-watch-s9-black.png` in the Product Details media pipeline; no external image. |

## Headphones

| Slug                  | Sources                                                                            | Notes                         |
| --------------------- | ---------------------------------------------------------------------------------- | ----------------------------- |
| `airpods-pro-2-usb-c` | <https://support.apple.com/en-us/111834>, <https://support.apple.com/en-us/111851> | Talk time omitted (not read). |
