import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue({
      template: {
        // Это необходимо, чтобы разрешить использование Vue без шага сборки
        // в окружении, где CSP может блокировать 'unsafe-eval'.
        compilerOptions: {
          isCustomElement: (tag) => tag.includes('-')
        }
      }
    })
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
