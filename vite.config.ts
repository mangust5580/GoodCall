import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

const BASE_PATH = '/GoodCall/';

export default defineConfig({
  base: BASE_PATH,
  plugins: [react()],
});
