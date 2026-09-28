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
import blogDetailCameraMacro from './blog-detail-camera-macro.png?w=400;800;1200;1600&picture';
import blogDetailSmartphone5g from './blog-detail-smartphone-5g.png?w=320;480;640;960;1200&picture';
import blogDetailTarget from './blog-detail-target.png?w=240;480;800&picture';
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

export const BLOG_DETAIL_MEDIA = {
  smartphone5g: blogDetailSmartphone5g,
  cameraMacro: blogDetailCameraMacro,
  target: blogDetailTarget,
} satisfies Record<string, PictureSource>;
