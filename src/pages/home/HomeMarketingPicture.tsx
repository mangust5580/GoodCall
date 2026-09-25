import type { HomeMarketingAsset } from '../../assets/media/home/homeMarketingMedia';

interface HomeMarketingPictureProps {
  readonly asset: HomeMarketingAsset;
  readonly alt: string;
  readonly className: string;
  readonly sizes: string;
  readonly loading?: 'eager' | 'lazy';
  readonly fetchPriority?: 'high' | 'low' | 'auto';
}

export function HomeMarketingPicture({
  asset,
  alt,
  className,
  sizes,
  loading = 'lazy',
  fetchPriority,
}: HomeMarketingPictureProps) {
  return (
    <picture>
      {Object.entries(asset.mobile.sources).map(([format, srcSet]) => (
        <source
          key={`mobile-${format}`}
          media="(max-width: 560px)"
          sizes={sizes}
          srcSet={srcSet}
          type={`image/${format}`}
        />
      ))}
      {Object.entries(asset.desktop.sources).map(([format, srcSet]) => (
        <source key={`desktop-${format}`} sizes={sizes} srcSet={srcSet} type={`image/${format}`} />
      ))}
      <img
        alt={alt}
        className={className}
        decoding="async"
        fetchPriority={fetchPriority}
        height={asset.desktop.img.h}
        loading={loading}
        sizes={sizes}
        src={asset.desktop.img.src}
        width={asset.desktop.img.w}
      />
    </picture>
  );
}
