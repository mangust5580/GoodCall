import type { PictureSource } from '../../../components/media';

import iphone15ProHeroFront from './derived/product-details-iphone-15-pro-128-hero-front-gallery.png?w=160;240;320;480;640;960;1254&picture';
import iphone15ProRearCamera from './derived/product-details-iphone-15-pro-128-rear-camera-gallery.png?w=160;240;320;480;640;960;1254&picture';
import iphone15ProFrontRearPair from './derived/product-details-iphone-15-pro-128-front-rear-pair-gallery.png?w=160;240;320;480;640;960;1254&picture';
import galaxyS24HeroFront from './derived/product-details-galaxy-s24-128-hero-front-gallery.png?w=160;240;320;480;640;960;1254&picture';
import galaxyS24RearCamera from './derived/product-details-galaxy-s24-128-rear-camera-gallery.png?w=160;240;320;480;640;960;1254&picture';
import galaxyS24FrontRearPair from './derived/product-details-galaxy-s24-128-front-rear-pair-gallery.png?w=160;240;320;480;640;960;1254&picture';
import xiaomi14HeroFront from './derived/product-details-xiaomi-14-256-hero-front-gallery.png?w=160;240;320;480;640;960;1254&picture';
import xiaomi14RearCamera from './derived/product-details-xiaomi-14-256-rear-camera-gallery.png?w=160;240;320;480;640;960;1254&picture';
import xiaomi14FrontRearPair from './derived/product-details-xiaomi-14-256-front-rear-pair-gallery.png?w=160;240;320;480;640;960;1254&picture';
import pixel8HeroFront from './derived/product-details-pixel-8-128-hero-front-gallery.png?w=160;240;320;480;640;960;1254&picture';
import pixel8RearCamera from './derived/product-details-pixel-8-128-rear-camera-gallery.png?w=160;240;320;480;640;960;1254&picture';
import pixel8FrontRearPair from './derived/product-details-pixel-8-128-front-rear-pair-gallery.png?w=160;240;320;480;640;960;1254&picture';
import oneplus12HeroFront from './derived/product-details-oneplus-12-256-hero-front-gallery.png?w=160;240;320;480;640;960;1254&picture';
import oneplus12RearCamera from './derived/product-details-oneplus-12-256-rear-camera-gallery.png?w=160;240;320;480;640;960;1254&picture';
import oneplus12FrontRearPair from './derived/product-details-oneplus-12-256-front-rear-pair-gallery.png?w=160;240;320;480;640;960;1254&picture';

import reviewAvatarAnnaK from './reviews/review-avatar-anna-k.webp';
import reviewAvatarDmitryS from './reviews/review-avatar-dmitry-s.webp';
import reviewAvatarOlgaM from './reviews/review-avatar-olga-m.webp';
import blueCameraDetail from './derived/product-details-gallery-blue-camera-detail-gallery.png?w=160;240;320;480;640;960;1254&picture';
import blueFrontRearPair from './derived/product-details-gallery-blue-front-rear-pair-gallery.png?w=160;240;320;480;640;960;1254&picture';
import blueHeroFront from './derived/product-details-gallery-blue-hero-front-gallery.png?w=160;240;320;480;640;960;1254&picture';
import blueRearCamera from './derived/product-details-gallery-blue-rear-camera-gallery.png?w=160;240;320;480;640;960;1254&picture';
import blueSideProfile from './derived/product-details-gallery-blue-side-profile-gallery.png?w=160;240;320;480;640;960;1254&picture';
import cameraDetail from './derived/product-details-gallery-camera-detail-gallery.png?w=160;240;320;480;640;960;1254&picture';
import frontRearPair from './derived/product-details-gallery-front-rear-pair-gallery.png?w=160;240;320;480;640;960;1254&picture';
import heroFront from './derived/product-details-gallery-hero-front-gallery.png?w=160;240;320;480;640;960;1254&picture';
import pinkCameraDetail from './derived/product-details-gallery-pink-camera-detail-gallery.png?w=160;240;320;480;640;960;1254&picture';
import pinkFrontRearPair from './derived/product-details-gallery-pink-front-rear-pair-gallery.png?w=160;240;320;480;640;960;1254&picture';
import pinkHeroFront from './derived/product-details-gallery-pink-hero-front-gallery.png?w=160;240;320;480;640;960;1254&picture';
import pinkRearCamera from './derived/product-details-gallery-pink-rear-camera-gallery.png?w=160;240;320;480;640;960;1254&picture';
import pinkSideProfile from './derived/product-details-gallery-pink-side-profile-gallery.png?w=160;240;320;480;640;960;1254&picture';
import rearCamera from './derived/product-details-gallery-rear-camera-gallery.png?w=160;240;320;480;640;960;1254&picture';
import sideProfile from './derived/product-details-gallery-side-profile-gallery.png?w=160;240;320;480;640;960;1254&picture';
import appleWatchS9Black from './derived/product-details-gallery-apple-watch-s9-black-gallery.png?w=160;240;320;480;640;720&picture';
import descriptionEditorial from './derived/product-details-description-editorial-editorial.png?w=320;480;640;960;1280;1672&picture';
import warrantyTrust from './derived/product-details-warranty-trust-trust.png?w=320;480;640;960;1280;1536&picture';

export const PRODUCT_DETAILS_GALLERY_BY_COLOUR_MEDIA = {
  pink: {
    heroFront: pinkHeroFront,
    rearCamera: pinkRearCamera,
    sideProfile: pinkSideProfile,
    frontRearPair: pinkFrontRearPair,
    cameraDetail: pinkCameraDetail,
  },
  black: {
    heroFront,
    rearCamera,
    sideProfile,
    frontRearPair,
    cameraDetail,
  },
  blue: {
    heroFront: blueHeroFront,
    rearCamera: blueRearCamera,
    sideProfile: blueSideProfile,
    frontRearPair: blueFrontRearPair,
    cameraDetail: blueCameraDetail,
  },
} satisfies Record<string, Record<string, PictureSource>>;

export const PRODUCT_DETAILS_APPLE_WATCH_S9_MEDIA = appleWatchS9Black;

export const PRODUCT_DETAILS_GALLERY_BY_SLUG = {
  'iphone-15-pro-128': {
    heroFront: iphone15ProHeroFront,
    rearCamera: iphone15ProRearCamera,
    frontRearPair: iphone15ProFrontRearPair,
  },
  'galaxy-s24-128': {
    heroFront: galaxyS24HeroFront,
    rearCamera: galaxyS24RearCamera,
    frontRearPair: galaxyS24FrontRearPair,
  },
  'xiaomi-14-256': {
    heroFront: xiaomi14HeroFront,
    rearCamera: xiaomi14RearCamera,
    frontRearPair: xiaomi14FrontRearPair,
  },
  'pixel-8-128': {
    heroFront: pixel8HeroFront,
    rearCamera: pixel8RearCamera,
    frontRearPair: pixel8FrontRearPair,
  },
  'oneplus-12-256': {
    heroFront: oneplus12HeroFront,
    rearCamera: oneplus12RearCamera,
    frontRearPair: oneplus12FrontRearPair,
  },
} satisfies Record<string, Record<string, PictureSource>>;

export const PRODUCT_DETAILS_DESCRIPTION_MEDIA = descriptionEditorial;

export const PRODUCT_DETAILS_WARRANTY_MEDIA = warrantyTrust;

export const PRODUCT_DETAILS_REVIEW_AVATARS = {
  annaK: reviewAvatarAnnaK,
  dmitryS: reviewAvatarDmitryS,
  olgaM: reviewAvatarOlgaM,
} satisfies Record<string, string>;
