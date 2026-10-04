import type { PictureSource } from '../../../components/media';

import hero from './about-hero.webp';
import products from './about-products.webp';
import project from './about-project.webp';

export const ABOUT_MEDIA = {
  hero: {
    sources: { webp: hero },
    img: { src: hero, w: 1920, h: 643 },
  },
  products: {
    sources: { webp: products },
    img: { src: products, w: 1280, h: 731 },
  },
  project: {
    sources: { webp: project },
    img: { src: project, w: 1280, h: 563 },
  },
} satisfies Record<string, PictureSource>;
