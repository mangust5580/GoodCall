import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';
import { BUILD_CONFIG } from './build-config.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig(({ command, mode }) => {
  const base = BUILD_CONFIG.getBase(command, mode);

  return {
    base,
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      open: true,
    },
    build: {
      target: BUILD_CONFIG.browserTargets,
      sourcemap: false,
      outDir: 'dist',
      emptyOutDir: true,
    },
  };
});
