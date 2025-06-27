import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    // Мы убрали ошибочную опцию из плагина vue()
    vue() 
  ],
  server: {
    // Настраиваем Vite для работы с вашим Node.js сервером
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
});