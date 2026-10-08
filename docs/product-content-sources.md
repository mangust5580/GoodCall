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

## Laptops

Checked on 2026-10-08. Listing facts (`src/pages/catalog/laptops/laptopFacts.ts`)
and the Product Details rows for diagonal, processor, RAM, SSD, graphics, OS
and colour are the same values; the `content` verify suite asserts that parity.
Processor cores, threads and maximum clock follow the cited manufacturer page
or the processor vendor's own product page (intel.com, amd.com). Battery
capacity, memory type, panel and port details are omitted wherever the
configuration varies or the official page does not state them.

| Slug                         | Sources                                                                                                                                                               | Notes                                                                                                                                                                                     |
| ---------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `macbook-air-13-m3-256`      | <https://support.apple.com/en-us/118551>                                                                                                                              | Base 256 GB configuration with the 8-core GPU. «Полночь» = Midnight.                                                                                                                      |
| `macbook-pro-14-m3-512`      | <https://support.apple.com/en-us/117735>                                                                                                                              | M3 (8-core CPU, 10-core GPU) column only. Battery 69.6 Wh; 70 W adapter. «Серый космос» = Space Gray.                                                                                     |
| `asus-vivobook-15-i5-512`    | <https://www.asus.com/ca-en/laptops/for-home/vivobook/asus-vivobook-15-x1504/techspec/>                                                                               | X1504VA. Iris Xe applies with dual-channel memory (16 GB). Port list and Wi-Fi omitted (vary by configuration). Full HD per the ASUS store X1504VA listings. «Серебристый» = Cool Silver. |
| `asus-tuf-f15-rtx3050`       | <https://www.asus.com/us/laptops/for-gaming/tuf-gaming/asus-tuf-gaming-f15-2022/techspec/>                                                                            | FX507ZC4 (ASUS store SKU FX507ZC4-I516512G0W). Ports, 56 Wh battery and 2.2 kg weight from the techspec page. «Серый» = Mecha Gray.                                                       |
| `lenovo-ideapad-slim-5-14`   | <https://psref.lenovo.com/syspool/Sys/PDF/IdeaPad/IdeaPad_Slim_5_14ABR8/IdeaPad_Slim_5_14ABR8_Spec.pdf>                                                               | 14ABR8. Battery omitted (47 Wh and 56.6 Wh both exist). WUXGA IPS 300-nit panel. «Серый» = Cloud Grey.                                                                                    |
| `lenovo-legion-5-16-rtx4060` | <https://psref.lenovo.com/syspool/Sys/PDF/Legion/Legion_Slim_5_16APH8/Legion_Slim_5_16APH8_Spec.pdf>                                                                  | Legion Slim 5 16APH8: the live name says «Legion Slim 5 16»; the slug is an unchanged opaque id. Weight «менее 2,4 кг» as stated. «Серый» = Storm Grey.                                   |
| `hp-15-i5-512`               | <https://support.hp.com/lv-en/document/ish_7737544-7737589-16>                                                                                                        | HP Laptop 15-fd0000 (15t-fd000). GPU model omitted: Intel UHD or Iris Xe depends on the memory layout. Memory type omitted. «Серебристый» = Natural Silver.                               |
| `hp-victus-16-rtx4050`       | <https://support.hp.com/us-en/document/ish_8115552-8115596-16>                                                                                                        | 16-s0000. Weight «от 2,33 кг» for the RTX 4050 configuration. Panel type and memory type omitted. «Синий» = Performance Blue.                                                             |
| `acer-aspire-5-i5-512`       | <https://store.acer.com/en-us/aspire-5-laptop-a515-58m-54lg>                                                                                                          | A515-58M-54LG. Battery capacity not stated on the page; omitted. Weight 3.97 lb ≈ 1.8 kg. «Серый» = Steel Gray.                                                                           |
| `acer-swift-go-14-ultra5`    | <https://store.acer.com/en-us/swift-go-14-laptop-sfg14-72-51aq>, <https://news.acer.com/acer-debuts-ai-ready-swift-go-14-laptop-with-new-intel-core-ultra-processors> | SFG14-72. Panel resolution omitted (IPS and OLED variants share the SKU family); 16:10 is common to both. «Серебристый» = Silver.                                                         |
| `msi-katana-17-rtx4060`      | <https://www.msi.com/Laptop/Katana-17-B13VX/Specification>                                                                                                            | B13VFK (RTX 4060). Ports, DDR5-5200, 53.5 Wh and 2.6 kg from the specification page.                                                                                                      |
| `huawei-matebook-d16-i5`     | <https://consumer.huawei.com/en/laptops/matebook-d-16-2024/specs/>                                                                                                    | 2024 model. Battery omitted (56 Wh and 70 Wh variants); weight «около 1,7 кг» covers 1.68–1.72 kg. «Серый космос» = Space Gray.                                                           |
