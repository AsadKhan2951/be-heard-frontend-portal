import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Tailwind runs through PostCSS (see postcss.config.js), not the Vite plugin.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    // In local dev, proxy API calls to the backend so the app can use
    // relative "/api" paths (same as production behind the Vercel proxy).
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true
      }
    }
  }
});
