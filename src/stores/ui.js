// Файл: src/stores/ui.js
// Описание: Это хранилище управляет состоянием общих элементов
// пользовательского интерфейса, таких как глобальные модальные окна.

import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useUiStore = defineStore('ui', () => {
  // Состояние: видим ли мы попап с формой расчета
  const isCalcFormVisible = ref(false);

  // Действия для управления видимостью
  function openCalcForm() {
    isCalcFormVisible.value = true;
  }

  function closeCalcForm() {
    isCalcFormVisible.value = false;
  }

  return {
    isCalcFormVisible,
    openCalcForm,
    closeCalcForm,
  };
});
