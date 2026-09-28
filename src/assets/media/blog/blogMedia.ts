import type { PictureSource } from '../../../components/media';

import bestSmartphonesUnder30000 from './blog-article-best-smartphones-under-30000.png?w=160;320;480;640;960;1280&picture';
import extendSmartphoneBatteryLife from './blog-article-extend-smartphone-battery-life.png?w=160;320;480;640;960;1280&picture';
import goodcallSpringSale from './blog-article-goodcall-spring-sale.png?w=160;320;480;640;960;1280&picture';
import howToChooseSmartphone2024 from './blog-article-how-to-choose-smartphone-2024.png?w=160;320;480;640;960;1280&picture';
import howToChooseWirelessEarbuds from './blog-article-how-to-choose-wireless-earbuds.png?w=160;320;480;640;960;1280&picture';
import iphoneVsSamsung2024 from './blog-article-iphone-vs-samsung-2024.png?w=160;320;480;640;960;1280&picture';
import macbookAirM3Review from './blog-article-macbook-air-m3-review.png?w=160;320;480;640;960;1280&picture';
import newAppleWatchChanges from './blog-article-new-apple-watch-changes.png?w=160;320;480;640;960;1280&picture';
import tabletForWorkAndStudy from './blog-article-tablet-for-work-and-study.png?w=160;320;480;640;960;1280&picture';
import blogHero from './blog-hero.png?w=480;800;1200;1600&picture';

export const BLOG_COVER_MEDIA = {
  iphoneVsSamsung2024,
  howToChooseWirelessEarbuds,
  bestSmartphonesUnder30000,
  newAppleWatchChanges,
  tabletForWorkAndStudy,
  extendSmartphoneBatteryLife,
  goodcallSpringSale,
  howToChooseSmartphone2024,
  macbookAirM3Review,
} satisfies Record<string, PictureSource>;

export const BLOG_HERO_MEDIA: PictureSource = blogHero;
