import { defineStore } from 'pinia';
import { ref } from 'vue';

// Создаем хранилище с уникальным именем 'vacancies'
export const useVacanciesStore = defineStore('vacancies', () => {
  // state: Это данные, которые мы храним
  const list = ref([
    {
      id: 1,
      title: 'Офис-менеджер',
      salary: 'от 250 000 тенге до вычета налогов',
      tags: ['Опыт 1 год'],
      conditions: 'Официальное трудоустройство. Рабочий день 09:00-18:00 (5/2).',
      responsibilities: [
        'Ответы на телефонные звонки;',
        'Ведение деловой корреспонденции;',
        'Логистика;',
        'Административно-хозяйственная часть;',
        'Выполнение поручений руководителя.'
      ]
    },
    {
      id: 2,
      title: 'Печатник',
      salary: 'от 250 000 тенге до вычета налогов',
      tags: ['Опыт 2 года'],
      conditions: 'Официальное трудоустройство. Рабочий день 09:00-18:00 (5/2).',
      responsibilities: [
        'Знание CorelDRAW, Acrobat, Illustrator',
        'Работа на машинах (или похожих):<br>– Mimaki UJV100-160<br>– принтер сублимационный Epson L1800<br>– принтер Roland VersanCAMM VS-640i<br>– принтер планшетный УФ Roland VersanUV LEF-200<br>– гравировальная машина Roland Desktop EGX-350;',
        'Постпечатная обработка продукции.'
      ]
    }
    // Сюда можно добавлять новые вакансии в будущем
  ]);

  // getters: Это как computed-свойства для хранилища.
  // Например, можем легко получить количество активных вакансий.
  const activeVacanciesCount = ref(list.value.length);

  // actions: Функции для изменения состояния (пока не нужны, но основа заложена)

  return { list, activeVacanciesCount };
});