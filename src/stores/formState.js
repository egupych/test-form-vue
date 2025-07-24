import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useFormStateStore = defineStore('formState', () => {
  // Состояние: массив для хранения файлов формы расчёта
  const calculationFormFiles = ref([]);

  // Состояние для полей формы расчёта стоимости
  const calculationForm = ref({
    name: '',
    phone: '',
    email: '',
    company: '',
    task: '',
    promo: '',
  });

  // Состояние для полей формы отклика на вакансию
  const vacancyForm = ref({
    name: '',
    phone: '',
    desiredPosition: '',
  });

  // Действия для управления файлами формы расчёта
  function addCalculationFiles(newFiles) {
    calculationFormFiles.value.push(...newFiles);
  }

  function removeCalculationFile(index) {
    calculationFormFiles.value.splice(index, 1);
  }

  function clearCalculationFiles() {
    calculationFormFiles.value = [];
  }

  // Действия для управления полями формы расчёта стоимости
  function updateCalculationFormField(field, value) {
    calculationForm.value[field] = value;
  }

  function clearCalculationForm() {
    calculationForm.value = {
      name: '',
      phone: '',
      email: '',
      company: '',
      task: '',
      promo: '',
    };
  }

  // Действия для управления полями формы отклика на вакансию
  function updateVacancyFormField(field, value) {
    vacancyForm.value[field] = value;
  }

  function clearVacancyForm() {
    vacancyForm.value = {
      name: '',
      phone: '',
      desiredPosition: '',
    };
  }

  return {
    calculationFormFiles,
    calculationForm,
    vacancyForm,
    addCalculationFiles,
    removeCalculationFile,
    clearCalculationFiles,
    updateCalculationFormField,
    clearCalculationForm,
    updateVacancyFormField,
    clearVacancyForm,
  };
});