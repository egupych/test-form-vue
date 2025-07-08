<script setup>
import { ref } from 'vue';
import BaseButton from '@/components/ui/BaseButton.vue';
import SectionHeader from '@/components/ui/SectionHeader.vue';
// [НОВОЕ] 1. Импортируем наш новый компонент формы
import TalentReserveForm from '@/components/ui/TalentReserveForm.vue';

// --- Данные для списка вакансий (остаются без изменений) ---
const vacancies = ref([
  {
    id: 1,
    title: 'Офис-менеджер',
    salary: 'от 250 000 тенге до вычета налогов',
    tags: ['Девушка', '20-35 лет'],
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
    tags: ['Мужчина', '20-40 лет'],
    conditions: 'Официальное трудоустройство. Рабочий день 09:00-18:00 (5/2).',
    // 👇 ВОТ ИЗМЕНЕНИЕ: добавлены теги <br> для переноса строк
    responsibilities: [
      'Знание CorelDRAW, Acrobat, Illustrator',
      'Работа на машинах (или похожих):<br>– Mimaki UJV100-160<br>– принтер сублимационный Epson L1800<br>– принтер Roland VersanCAMM VS-640i<br>– принтер планшетный УФ Roland VersanUV LEF-200<br>– гравировальная машина Roland Desktop EGX-350;',
      'Постпечатная обработка продукции.'
    ]
  }
]);

// --- [ИЗМЕНЕНИЕ] Упрощенная логика страницы ---
// Теперь нам нужна только одна переменная, чтобы передавать
// название вакансии в компонент формы.
const selectedPosition = ref('');

// Функция для скролла к форме и передачи ей названия вакансии.
const applyForPosition = (vacancyTitle) => {
  selectedPosition.value = vacancyTitle;
  const formElement = document.querySelector('.talent-reserve-form');
  if (formElement) {
    formElement.scrollIntoView({ behavior: 'smooth' });
  }
};
</script>

<template>
  <main class="py-10 md:py-25">
    <div class="max-w-6xl mx-auto">

      <section>
        <SectionHeader class="gap-container">
          Вакансии
        </SectionHeader>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            <div v-for="vacancy in vacancies" :key="vacancy.id" class="bg-white p-8 relative">
                <div class="flex justify-between items-start">
                    <h3 class="text-h4-panda font-bold text-gray-900 leading-tight">{{ vacancy.title }}</h3>
                    <div class="flex gap-2 ml-4">
                        <span v-for="tag in vacancy.tags" :key="tag" class="rounded-full py-2 px-4 text-sm font-medium text-dark-gray border whitespace-nowrap">{{ tag }}</span>
                    </div>
                </div>
                <div class=" text-body-panda mb-4">{{ vacancy.salary }}</div>
                <div class="mb-4">
                    <div class="text-panda-orange font-bold text-body-panda mb-1">Условия</div>
                    <div class="text-gray-800 text-body-panda leading-relaxed">{{ vacancy.conditions }}</div>
                </div>
                <div class="mb-4">
                    <div class="text-panda-orange font-bold text-body-panda mb-1">Обязанности</div>
                    <ol class="list-decimal list-inside text-gray-800 text-body-panda leading-relaxed space-y-1">
                        <li v-for="(resp, index) in vacancy.responsibilities" :key="index" class="pl-1" v-html="resp"></li>
                    </ol>
                </div>
                <BaseButton @click="applyForPosition(vacancy.title)" variant="fill-black">Откликнуться</BaseButton>
            </div>
        </div>
      </section>

      <div class="gap-page">
        <TalentReserveForm :initialPosition="selectedPosition" />
      </div>

    </div>
  </main>
</template>

<style scoped>
/* Стили для этой страницы больше не нужны */
</style>