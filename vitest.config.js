import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true, // Использовать глобальные переменные (describe, it, expect) без импорта
    environment: 'node', // Указать, что тесты будут запускаться в среде Node.js
    include: ['src/tests/**/*.test.js'], // Указать, где искать тестовые файлы
    setupFiles: ['src/tests/setup.js'], // Файл для начальной настройки (если понадобится)
  },
});
