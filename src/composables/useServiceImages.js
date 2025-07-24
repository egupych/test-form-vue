// src/composables/useServiceImages.js

import { computed } from 'vue';

// 1. Меняем путь для поиска на /src/assets/
// 2. Добавляем { eager: true } - это заставляет Vite немедленно загрузить информацию о файлах
const modules = import.meta.glob(
  '/src/assets/images/services/**/*.+(png|jpg|jpeg|webp|svg)',
  { eager: true }
);

export function useServiceImages(serviceId) {
  const imagePaths = computed(() => {
    const paths = [];
    for (const path in modules) {
      if (path.startsWith(`/src/assets/images/services/${serviceId}/`)) {
        // У файлов из src/assets конечный URL хранится в свойстве .default
        paths.push(modules[path].default);
      }
    }
    // Сортируем пути в алфавитном порядке, чтобы "последний" файл был предсказуем
    return paths.sort();
  });

  const lastImage = computed(() => {
    if (imagePaths.value.length > 0) {
      // Возвращаем последний элемент из отсортированного списка
      return imagePaths.value[imagePaths.value.length - 1];
    }
    return 'https://placehold.co/400x300/131C26/FFF?text=Red+Panda';
  });

  return {
    imagePaths,
    lastImage,
  };
}
