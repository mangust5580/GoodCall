import type { PictureSource } from '../../../components/media';

import entertainmentDesktop from './derived/home-entertainment-streaming-desktop.png?w=720;1080;1440;1800&picture';
import entertainmentMobile from './derived/home-entertainment-streaming-mobile.png?w=320;480;640;720&picture';
import deviceEarbuds from './derived/home-device-earbuds-card.png?w=160;240;320;480;640&picture';
import deviceHeadphones from './derived/home-device-headphones-card.png?w=160;240;320;480;640&picture';
import deviceSmartphone from './derived/home-device-smartphone-card.png?w=160;240;320;480;640&picture';
import deviceWatch from './derived/home-device-watch-card.png?w=160;240;320;480;640&picture';
import heroDesktop from './derived/home-hero-main-promo-desktop.png?w=640;960;1280;1600&picture';
import heroMobile from './derived/home-hero-main-promo-mobile.png?w=320;480;640;720&picture';
import blackFridayDesktop from './derived/home-promo-black-friday-desktop.png?w=420;640;960;1200&picture';
import blackFridayMobile from './derived/home-promo-black-friday-mobile.png?w=320;480;640;720&picture';
import newArrivalsDesktop from './derived/home-promo-new-arrivals-desktop.png?w=420;640;960;1200&picture';
import newArrivalsMobile from './derived/home-promo-new-arrivals-mobile.png?w=320;480;640;720&picture';
import wearableDesktop from './derived/home-wearable-tech-desktop.png?w=360;540;720;900&picture';
import wearableMobile from './derived/home-wearable-tech-mobile.png?w=320;480;640;720&picture';

export interface HomeMarketingAsset {
  readonly desktop: PictureSource;
  readonly mobile: PictureSource;
}

export const HOME_MARKETING_MEDIA = {
  heroMainPromo: {
    desktop: heroDesktop,
    mobile: heroMobile,
  },
  newArrivals: {
    desktop: newArrivalsDesktop,
    mobile: newArrivalsMobile,
  },
  blackFriday: {
    desktop: blackFridayDesktop,
    mobile: blackFridayMobile,
  },
  wearableTech: {
    desktop: wearableDesktop,
    mobile: wearableMobile,
  },
  entertainmentStreaming: {
    desktop: entertainmentDesktop,
    mobile: entertainmentMobile,
  },
} satisfies Record<string, HomeMarketingAsset>;

export const HOME_DEVICE_MEDIA = {
  smartphone: deviceSmartphone,
  earbuds: deviceEarbuds,
  watch: deviceWatch,
  headphones: deviceHeadphones,
} satisfies Record<string, PictureSource>;
