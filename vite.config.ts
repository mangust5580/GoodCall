import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
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
    target: ['chrome111', 'edge111', 'firefox114', 'safari16.4', 'ios16.4'],
    sourcemap: false,
    outDir: 'dist',
    emptyOutDir: true,
  },
});
