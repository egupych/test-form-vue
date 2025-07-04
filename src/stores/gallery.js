// egupych/test-form-vue/test-form-vue-a1d5eb87f79b53bf87c4dec2dc8f4255ccb321d7/src/stores/gallery.js
import { defineStore } from 'pinia';
import { ref } from 'vue';

// Создаем и экспортируем хранилище с названием 'gallery'
export const useGalleryStore = defineStore('gallery', () => {
  
  // Здесь мы будем хранить все наши проекты.
  // ref() делает этот массив "реактивным", то есть Vue будет следить за его изменениями.
  const items = ref([
    {
      id: 1,
      slug: 'ludekaz-catalog', // Уникальная строка для URL
      title: 'Каталог «Лудэ-Каз»',
      category: 'Каталоги и альбомы', // Категория для возможной фильтрации
      description: 'Каталог в фирменных цветах с нотками современного искусства.',
      image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500',
    },
    {
      id: 2,
      slug: 'mir-ohoty-catalog',
      title: 'Каталог «Мир охоты»',
      category: 'Каталоги и альбомы',
      description: 'Музейный фонд охотничьего центра г. Костанай.',
      image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500',
    },
    // Сюда в будущем можно будет добавлять другие проекты из портфолио
    {
      id: 3,
      slug: 'dostyk-lux-style',
      title: 'Фирменный стиль для гостиницы Dostyk Lux',
      category: 'Фирменный стиль',
      description: 'Современный стиль, с заботой о людях.',
      image: 'https://placehold.co/800x400/F7F7F7/131C26?text=Визитка%20Dostyk%20lux',
    }
  ]);

  // Возвращаем данные, чтобы другие компоненты могли их использовать
  return { items };
});