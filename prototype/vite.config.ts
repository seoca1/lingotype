import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/lingotype/', // GitHub Pages repository name
  test: {
    globals: true,
    environment: 'jsdom',
  },
});