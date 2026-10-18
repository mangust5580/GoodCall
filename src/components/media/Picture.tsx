import type { Picture as GeneratedPicture } from 'vite-imagetools';

export interface PictureSource {
  readonly sources: GeneratedPicture['sources'];
  readonly img: GeneratedPicture['img'] & { readonly srcset?: string };
}

export interface PictureProps {
  readonly source: PictureSource;
  readonly alt: string;
  readonly sizes: string;
  readonly className?: string;
  readonly loading?: 'eager' | 'lazy';
  readonly decoding?: 'async' | 'sync' | 'auto';
  readonly fetchPriority?: 'high' | 'low' | 'auto';
}

export function Picture({
  source,
  alt,
  sizes,
  className,
  loading = 'lazy',
  decoding = 'async',
  fetchPriority,
}: PictureProps) {
  return (
    <picture>
      {Object.entries(source.sources).map(([format, srcSet]) => (
        <source key={format} sizes={sizes} srcSet={srcSet} type={`image/${format}`} />
      ))}
      <img
        alt={alt}
        className={className}
        decoding={decoding}
        fetchPriority={fetchPriority}
        height={source.img.h}
        loading={loading}
        sizes={sizes}
        src={source.img.src}
        srcSet={source.img.srcset}
        width={source.img.w}
      />
    </picture>
  );
}
