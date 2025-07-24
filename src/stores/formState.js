// Файл: src/stores/formState.js
// Описание: Это хранилище предназначено для сохранения состояния форм между
// переходами по страницам. Сейчас оно хранит файлы, прикрепленные к форме
// расчёта стоимости, чтобы они не пропадали при навигации по сайту.

import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useFormStateStore = defineStore('formState', () => {
  // Состояние: массив для хранения файлов формы расчёта
  const calculationFormFiles = ref([]);

  // Действия для управления файлами
  function addCalculationFiles(newFiles) {
    calculationFormFiles.value.push(...newFiles);
  }

  function removeCalculationFile(index) {
    calculationFormFiles.value.splice(index, 1);
  }

  function clearCalculationFiles() {
    calculationFormFiles.value = [];
  }

  return {
    calculationFormFiles,
    addCalculationFiles,
    removeCalculationFile,
    clearCalculationFiles,
  };
});
