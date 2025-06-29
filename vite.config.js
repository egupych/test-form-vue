// vite.config.js

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
// --- ИЗМЕНЕНИЕ: Импортируем 'fileURLToPath' и 'URL' ---
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
  plugins: [
    vue()
  ],
  resolve: {
    alias: {
      // --- ИЗМЕНЕНИЕ: Это правильный способ указать псевдоним в Vite ---
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
});