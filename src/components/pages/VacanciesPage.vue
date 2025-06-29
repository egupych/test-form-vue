<script setup>
import { ref } from 'vue';
// --- ИЗМЕНЕНИЕ: Обновлен путь к компоненту BaseButton ---
import BaseButton from '../ui/BaseButton.vue';

const vacancies = ref([
  { 
    id: 1, 
    title: 'Офис-менеджер', 
    salary: 'от 350 000 до 900 000 KZT', 
    tags: ['Девушка', 'Без опыта'], 
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
    salary: 'от 350 000 до 900 000 KZT', 
    tags: ['Мужчина', 'Опыт 1-3 года'], 
    conditions: 'Официальное трудоустройство. Рабочий день 09:00-18:00 (5/2).', 
    responsibilities: [
      'Работа на машинах: Mimaki, Roland, XEROX;', 
      'Постпечатная обработка продукции.'
    ] 
  }
]);

const formData = ref({ desiredPosition: '', name: '', phone: '', resume: null });

const applyForPosition = (vacancyTitle) => {
  formData.value.desiredPosition = vacancyTitle;
  const formElement = document.querySelector('.talent-reserve-form');
  if (formElement) {
    formElement.scrollIntoView({ behavior: 'smooth' });
  }
};

const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    formData.value.resume = file;
  }
};

const submitApplication = () => {
  alert(`Спасибо за отклик, ${formData.value.name}! Мы свяжемся с вами.`);
  formData.value = { desiredPosition: '', name: '', phone: '', resume: null };
};
</script>

<template>
  <main>
    <div class="main-container">
        <h1 class="font-bold text-panda-black text-h1-panda mb-8">Вакансии</h1>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-16">
            <div v-for="vacancy in vacancies" :key="vacancy.id" class="bg-gray-50 rounded-3xl p-8 relative">
                <div class="flex justify-between items-start mb-4">
                    <h3 class="text-h4-panda font-bold text-gray-900 leading-tight">{{ vacancy.title }}</h3>
                    <div class="flex gap-2 ml-4">
                        <span v-for="tag in vacancy.tags" :key="tag" class="bg-white rounded-full px-4 py-2 text-sm font-medium text-gray-700 border border-gray-200 whitespace-nowrap">{{ tag }}</span>
                    </div>
                </div>
                <div class="text-dark-gray text-small-panda mb-6 font-semibold">{{ vacancy.salary }}</div>
                <div class="mb-6">
                    <div class="text-panda-orange font-bold text-body-panda mb-3">Условия</div>
                    <div class="text-gray-800 text-body-panda leading-relaxed">{{ vacancy.conditions }}</div>
                </div>
                <div class="mb-8">
                    <div class="text-panda-orange font-bold text-body-panda mb-3">Обязанности</div>
                    <ol class="list-decimal list-inside text-gray-800 text-body-panda leading-relaxed space-y-2">
                        <li v-for="resp in vacancy.responsibilities" :key="resp" class="pl-1">{{ resp }}</li>
                    </ol>
                </div>
                <BaseButton @click="applyForPosition(vacancy.title)" variant="fill-black">Откликнуться</BaseButton>
            </div>
        </div>
        <div class="bg-white rounded-2xl p-8 talent-reserve-form mt-16">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                <div>
                    <h2 class="text-h2-panda font-bold text-gray-900 mb-6 leading-tight">Кадровый<br>резерв</h2>
                    <p class="text-h5-panda text-gray-600">Хотите работать у нас, но нет подходящей вакансии? Оставьте заявку!</p>
                </div>
                <div>
                    <form @submit.prevent="submitApplication" class="space-y-6">
                        <div><input v-model="formData.desiredPosition" type="text" placeholder="Желаемая вакансия" class="w-full border-0 border-b border-gray-300 py-3 px-0 text-body-panda text-gray-900 placeholder-gray-500 bg-transparent focus:outline-none focus:border-orange-500 focus:ring-0" required></div>
                        <div><input v-model="formData.name" type="text" placeholder="Ваше имя" class="w-full border-0 border-b border-gray-300 py-3 px-0 text-body-panda text-gray-900 placeholder-gray-500 bg-transparent focus:outline-none focus:border-orange-500 focus:ring-0" required></div>
                        <div><input v-model="formData.phone" type="tel" placeholder="Телефон" class="w-full border-0 border-b border-gray-300 py-3 px-0 text-body-panda text-gray-900 placeholder-gray-500 bg-transparent focus:outline-none focus:border-orange-500 focus:ring-0" required></div>
                        <div><label class="flex items-center gap-3 py-3 border-b border-gray-300 cursor-pointer text-gray-600 text-sm"><span class="text-2xl">📎</span><span>{{ formData.resume ? formData.resume.name : 'Приложите резюме или ссылку' }}</span><input type="file" @change="handleFileUpload" accept=".pdf,.doc,.docx" class="hidden"></label></div>
                        <BaseButton type="submit" variant="fill-black">Отправить</BaseButton>
                    </form>
                </div>
            </div>
        </div>
    </div>
  </main>
</template>