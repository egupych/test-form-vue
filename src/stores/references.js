import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useReferencesStore = defineStore('references', () => {
  // Состояние: массив для хранения URL-адресов избранных изображений
  const items = ref([]);

  // Геттер для проверки, находится ли изображение уже в референсах
  const isInReferences = computed(() => {
    return (imageUrl) => items.value.includes(imageUrl);
  });

  // Действие: добавить или удалить референс
  function toggleReference(imageUrl) {
    const index = items.value.indexOf(imageUrl);
    if (index === -1) {
      items.value.push(imageUrl);
    } else {
      items.value.splice(index, 1);
    }
  }
  
  // Действие: очистить все референсы
  function clearReferences() {
    items.value = [];
  }

  return { items, isInReferences, toggleReference, clearReferences };
});