import type { PictureSource } from '../../components/media';

const REMOTE_HERO_PATH =
  /^(products\/[a-z0-9-]+\/[a-z0-9-]+\/[a-z0-9-]+\/hero-v[1-9][0-9]*)-640\.png$/;
const REMOTE_HERO_WIDTHS = [320, 640, 1024] as const;
const REMOTE_HERO_FALLBACK_WIDTH = 640;

export function catalogRemotePicture(
  storagePath: string,
  publicUrl: (objectKey: string) => string,
): PictureSource | undefined {
  const baseKey = REMOTE_HERO_PATH.exec(storagePath)?.[1];

  if (baseKey === undefined) {
    return undefined;
  }

  const srcSet = (extension: string) =>
    REMOTE_HERO_WIDTHS.map(
      (width) => `${publicUrl(`${baseKey}-${String(width)}.${extension}`)} ${String(width)}w`,
    ).join(', ');

  return {
    sources: { avif: srcSet('avif'), webp: srcSet('webp') },
    img: {
      src: publicUrl(storagePath),
      srcset: srcSet('png'),
      w: REMOTE_HERO_FALLBACK_WIDTH,
      h: REMOTE_HERO_FALLBACK_WIDTH,
    },
  };
}
