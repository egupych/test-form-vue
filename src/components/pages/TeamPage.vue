<script setup>
import { ref } from 'vue';
import SectionHeader from '@/components/ui/SectionHeader.vue';
import VacancyApplicationForm from '@/components/ui/VacancyApplicationForm.vue';
import { useVacanciesStore } from '@/stores/vacancies.js';
// --- [НОВОЕ] Импортируем наш новый компонент слайдера ---
import HistorySlider from '@/components/ui/HistorySlider.vue';

// --- Изображения сотрудников ---
import andreyFedorovich from '@/assets/images/pages/TeamPage/Андрей Фёдорович.png';
import yana from '@/assets/images/pages/TeamPage/Яна.png';
import laura from '@/assets/images/pages/TeamPage/Лаура.png';
import alina from '@/assets/images/pages/TeamPage/Алина.png';
import dmitry from '@/assets/images/pages/TeamPage/Дмитрий.png';
import farida from '@/assets/images/pages/TeamPage/Фарида.png';
import kata from '@/assets/images/pages/TeamPage/катя.png';
import vlad from '@/assets/images/pages/TeamPage/влад.png';
import lina from '@/assets/images/pages/TeamPage/лина.png';
import ula from '@/assets/images/pages/TeamPage/юля.png';

// --- Структура отделов и сотрудники ---
const departments = ref([
  {
    name: 'Руководящий состав',
    employees: [
      { name: 'Андрей Фёдорович', role: 'CEO', image: andreyFedorovich },
      { name: 'Анжелика', role: 'Менеджер по персоналу', image: 'https://placehold.co/250x250/E3E3E3/131C26?text=Анжелика' },
      { name: 'Светлана', role: 'Руководитель отдела продаж', image: 'https://placehold.co/250x250/E3E3E3/131C26?text=Светлана' },
      { name: 'Асиля', role: 'Руководитель цеха', image: 'https://placehold.co/250x250/E3E3E3/131C26?text=Асиля' }
    ]
  },
  {
    name: 'Офис',
    employees: [
      { name: 'Никита', role: 'Офис-менеджер', image: 'https://placehold.co/250x250/E3E3E3/131C26?text=Никита' },
      { name: 'Яна', role: 'Помощник бухгалтера', image: yana },
    ]
  },
  {
    name: 'Отдел продаж',
    employees: [

      { name: 'Лаура', role: 'Старший менеджер', image: laura },
      { name: 'Алина', role: 'Старший менеджер', image: alina },
      { name: 'Инна', role: 'Менеджер', image: 'https://placehold.co/250x250/E3E3E3/131C26?text=Инна' },
      { name: 'Расул', role: 'Менеджер', image: 'https://placehold.co/250x250/E3E3E3/131C26?text=Расул' }
    ]
  },
  {
    name: 'Отдел дизайна',
    employees: [
      { name: 'Екатерина', role: 'Дизайнер', image: kata },
      { name: 'Анеля', role: 'Дизайнер', image: 'https://placehold.co/250x250/E3E3E3/131C26?text=Анеля' },
      { name: 'Дмитрий', role: 'Дизайнер', image: dmitry }
    ]
  },
  {
    name: 'Производство',
    employees: [
      { name: 'Фарида', role: 'Заведующая складом', image: farida },
      { name: 'Лина', role: 'Технолог', image: lina },
      { name: 'Владислав', role: 'Печатник', image: vlad },
      { name: 'Юля', role: 'Печатник', image: ula },
      { name: 'Карина', role: 'Печатник', image: 'https://placehold.co/250x250/E3E3E3/131C26?text=Карина' },
      { name: 'Артур', role: 'Печатник', image: 'https://placehold.co/250x250/E3E3E3/131C26?text=Артур' },
    ]
  }
]);

// --- Логика для вакансий и попапа ---
const vacanciesStore = useVacanciesStore();
const allVacancies = vacanciesStore.list;

const vacancyDepartmentMap = {
  'Печатник': 'Производство',
  'Офис-менеджер': 'Офис',
  'Дизайнер': 'Отдел дизайна',
  'Менеджер': 'Отдел продаж'
};

const getVacanciesForDepartment = (departmentName) => {
  return allVacancies.filter(vacancy => vacancyDepartmentMap[vacancy.title] === departmentName);
};

const isPopupOpen = ref(false);
const selectedVacancyTitle = ref('');

const openPopup = (vacancyTitle) => {
  selectedVacancyTitle.value = vacancyTitle;
  isPopupOpen.value = true;
};
const closePopup = () => {
  isPopupOpen.value = false;
};
</script>

<template>
  <main class="py-10 md:py-25">
    <div class="max-w-6xl mx-auto">

      <section class="mb-16">
        <SectionHeader class="gap-container">
          Наша команда
        </SectionHeader>
        <p class="text-h5-panda text-dark-gray leading-relaxed text-center max-w-4xl mx-auto">
            Разрешите представить нашу команду. Это те, кто всегда на связи, кто воплощает идеи в жизнь, кто следит за финансами и логистикой. А наши производственные волшебники, хоть и невидимы, каждый день творят чудеса, чтобы вы получали лучшее.
        </p>
      </section>

      <section v-for="department in departments" :key="department.name" class="mb-16">
        <h2 class="text-h4-panda font-bold text-panda-black mb-4">{{ department.name }}</h2>
        
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          
          <div 
            v-for="employee in department.employees" 
            :key="employee.name"
            class="group"
          >
            <div class="bg-light-gray overflow-hidden aspect-square flex items-center justify-center">
              <img :src="employee.image" :alt="employee.name" class="w-full h-full object-cover">
            </div>
            <div class="pt-3">
              <h3 class="font-semibold text-panda-black text-lg">{{ employee.name }}</h3>
              <p class="text-sm text-dark-gray">{{ employee.role }}</p>
            </div>
          </div>

          <div
            v-for="vacancy in getVacanciesForDepartment(department.name)"
            :key="vacancy.id"
            @click="openPopup(vacancy.title)"
            class="group block cursor-pointer"
          >
            <div class="vacancy-card">
               <div class="vacancy-card-icon-wrapper">
                  <svg xmlns="http://www.w3.org/2000/svg" class="vacancy-card-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
               </div>
               <p class="vacancy-card-text">Присоединяйтесь к нам</p>
            </div>
            <div class="pt-3">
              <h3 class="font-semibold text-panda-black text-lg">В поиске</h3>
              <p class="text-sm text-dark-gray">{{ vacancy.title }}</p>
            </div>
          </div>

        </div>
      </section>

      <section class="gap-page">
        <SectionHeader class="gap-container">
          Наша история
        </SectionHeader>
        <HistorySlider />
      </section>
      </div>

    <Teleport to="body">
      <transition name="popup">
        <div v-if="isPopupOpen" class="popup-overlay" @click.self="closePopup">
          <div class="popup-container">
            <button @click="closePopup" class="popup-close-button">&times;</button>
            <VacancyApplicationForm :position-title="selectedVacancyTitle" />
          </div>
        </div>
      </transition>
    </Teleport>
  </main>
</template>

<style scoped>
/* Стили в этом файле остаются без изменений */
.vacancy-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  aspect-ratio: 1 / 1;
  width: 100%;
  padding: 16px;
  border: 2px dashed #E3E3E3;
  background-color: #F7F7F7;
  transition: all 0.3s ease;
}

.group:hover .vacancy-card {
  border-color: #F15F31;
}

.vacancy-card-icon {
  width: 40px;
  height: 40px;
  margin-bottom: 8px;
  color: #8F8F8F;
  transition: color 0.3s ease;
}

.group:hover .vacancy-card-icon {
  color: #F15F31;
}

.vacancy-card-text {
  font-family: 'Gilroy-Semibold', sans-serif;
  font-size: 16px;
  color: #8F8F8F;
  transition: color 0.3s ease;
}

.group:hover .vacancy-card-text {
  color: #F15F31;
}

.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(19, 28, 38, 0.8);
  backdrop-filter: blur(5px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 1rem;
}

.popup-container {
  position: relative;
  background: white;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 1140px;
  transform: scale(1);
  transition: transform 0.3s ease;
  overflow-y: auto;
  max-height: 95vh;
}
.popup-container > :deep(.form-wrapper) {
  padding: 4rem !important;
}
@media (min-width: 1024px) {
  .popup-container > :deep(.form-wrapper) {
    padding: 6rem !important;
  }
}

.popup-close-button {
  position: absolute;
  top: 15px;
  right: 22px;
  background: none;
  border: none;
  font-size: 2.5rem;
  line-height: 1;
  color: #8F8F8F;
  cursor: pointer;
  transition: color 0.2s;
  z-index: 1001;
}

.popup-close-button:hover {
  color: #131C26;
}

.popup-enter-active,
.popup-leave-active {
  transition: opacity 0.3s ease;
}
.popup-enter-from,
.popup-leave-to {
  opacity: 0;
}
.popup-enter-active .popup-container,
.popup-leave-active .popup-container {
  transition: all 0.3s ease;
}
.popup-enter-from .popup-container,
.popup-leave-to .popup-container {
  transform: scale(0.95);
}
</style>