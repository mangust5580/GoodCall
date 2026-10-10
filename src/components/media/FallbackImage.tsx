import { useState } from 'react';
import type { ReactNode } from 'react';

interface FallbackImageSource {
  readonly src: string;
  readonly width: number;
  readonly height: number;
}

export interface FallbackImageProps {
  readonly image?: FallbackImageSource;
  readonly className?: string;
  readonly fallback: ReactNode;
}

export function FallbackImage({ image, className, fallback }: FallbackImageProps) {
  const [failedSrc, setFailedSrc] = useState<string>();

  if (image === undefined || failedSrc === image.src) {
    return fallback;
  }

  return (
    <img
      alt=""
      className={className}
      decoding="async"
      height={image.height}
      loading="lazy"
      onError={() => {
        setFailedSrc(image.src);
      }}
      src={image.src}
      width={image.width}
    />
  );
}
