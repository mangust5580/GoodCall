import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { imagetools } from 'vite-imagetools';

const BASE_PATH = '/GoodCall/';

const PICTURE_FALLBACK_FORMAT: Readonly<Record<string, string>> = {
  png: 'png',
  jpg: 'jpeg',
  jpeg: 'jpeg',
};

function pictureDirectives(url: URL): URLSearchParams {
  if (!url.searchParams.has('picture')) {
    return new URLSearchParams();
  }

  const extension = url.pathname.split('.').pop()?.toLowerCase() ?? '';
  const fallbackFormat = PICTURE_FALLBACK_FORMAT[extension];

  if (fallbackFormat === undefined) {
    throw new Error(
      `Picture sources must be authored as PNG, JPG or JPEG; received "${url.pathname}".`,
    );
  }

  return new URLSearchParams({ as: 'picture', format: `avif;webp;${fallbackFormat}` });
}

export default defineConfig({
  base: BASE_PATH,
  plugins: [react(), imagetools({ defaultDirectives: pictureDirectives })],
});
