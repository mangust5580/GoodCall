import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

/**
 * Single source of truth for the deployment base path.
 *
 * GoodCall is published as the GitHub Pages *project* site for
 * mangust5580/GoodCall, so production assets resolve under `/GoodCall/`.
 * Application code must never repeat this literal: read `import.meta.env.BASE_URL`
 * instead (a future router derives its basename from that same value).
 */
const BASE_PATH = '/GoodCall/';

export default defineConfig({
  base: BASE_PATH,
  plugins: [react()],
});
