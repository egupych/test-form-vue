<script setup>
import { ref } from 'vue';
import SectionHeader from '@/components/ui/SectionHeader.vue';

// Структура данных, сгруппированная по отделам
const departments = ref([
  {
    name: 'Офис',
    employees: [
      { name: 'Андрей Фёдорович', role: 'CEO', image: '/src/assets/images/pages/TeamPage/Андрей Фёдорович.png' },
      { name: 'Анжелика', role: 'Менеджер по персоналу', image: 'https://placehold.co/250x250/E3E3E3/131C26?text=Анжелика' },
      { name: 'Яна', role: 'Помощник бухгалтера', image: '/src/assets/images/pages/TeamPage/Яна.png' },
      { name: 'В поиске', role: 'Офис менеджер', hiring: true, vacancyUrl: '/vacancies' }
    ]
  },
  {
    name: 'Отдел продаж',
    employees: [
      { name: 'Светлана', role: 'Руководитель отдела', image: 'https://placehold.co/250x250/E3E3E3/131C26?text=Светлана' },
      { name: 'Лаура', role: 'Старший менеджер', image: '/src/assets/images/pages/TeamPage/Лаура.png' },
      { name: 'Инна', role: 'Менеджер', image: 'https://placehold.co/250x250/E3E3E3/131C26?text=Инна' },
      { name: 'Алина', role: 'Менеджер', image: '/src/assets/images/pages/TeamPage/Алина.png' }
    ]
  },
  {
    name: 'Отдел дизайна',
    employees: [
      { name: 'Екатерина', role: 'Дизайнер', image: 'https://placehold.co/250x250/E3E3E3/131C26?text=Екатерина' },
      { name: 'Анеля', role: 'Дизайнер', image: 'https://placehold.co/250x250/E3E3E3/131C26?text=Анеля' },
      { name: 'Дмитрий', role: 'Дизайнер', image: '/src/assets/images/pages/TeamPage/Дмитрий.png' }
    ]
  },
  {
    name: 'Производство',
    employees: [
      { name: 'Фарида', role: 'Заведующая складом', image: '/src/assets/images/pages/TeamPage/Фарида.png' },
      { name: 'Лина', role: 'Технолог', image: 'https://placehold.co/250x250/E3E3E3/131C26?text=Лина' },
      { name: 'Владислав', role: 'Печатник', image: 'https://placehold.co/250x250/E3E3E3/131C26?text=Владислав' },
      { name: 'Карина', role: 'Печатник', image: 'https://placehold.co/250x250/E3E3E3/131C26?text=Карина' },
      { name: 'В поиске', role: 'Начальник производства', hiring: true, vacancyUrl: '/vacancies' }
    ]
  }
]);
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
          >
            <div v-if="!employee.hiring" class="group">
              <div class="bg-light-gray overflow-hidden aspect-square flex items-center justify-center">
                <img :src="employee.image" :alt="employee.name" class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105">
              </div>
              <div class="pt-3">
                <h3 class="font-semibold text-panda-black text-lg">{{ employee.name }}</h3>
                <p class="text-sm text-dark-gray">{{ employee.role }}</p>
              </div>
            </div>

            <a
              v-else
              :href="employee.vacancyUrl"
              class="group block"
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
                <h3 class="font-semibold text-panda-black text-lg">{{ employee.name }}</h3>
                <p class="text-sm text-dark-gray">{{ employee.role }}</p>
              </div>
            </a>

          </div>
        </div>
      </section>

      <section class="gap-page">
        <SectionHeader class="gap-container">
          Наша история
        </SectionHeader>
        <div class="relative border-l-2 border-panda-orange pl-8 py-4">
            <div class="mb-8"><h3 class="font-semibold text-panda-black text-2xl">2024 Декабрь</h3><p class="text-lg text-dark-gray">Провели незабываемый корпоратив, завершивший успешный год.</p></div>
            <div class="mb-8"><h3 class="font-semibold text-panda-black text-2xl">2023 Июнь</h3><p class="text-lg text-dark-gray">Расширение производства, закупка нового оборудования.</p></div>
            <div class="mb-8"><h3 class="font-semibold text-panda-black text-2xl">2022 Февраль</h3><p class="text-lg text-dark-gray">Открытие первого филиала в другом городе.</p></div>
        </div>
      </section>

    </div>
  </main>
</template>

<style scoped>
.vacancy-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  aspect-ratio: 1 / 1;
  width: 100%;
  padding: 16px;
  
  /* Стили как у кнопки в форме */
  border: 2px dashed #E3E3E3;
  background-color: #F7F7F7;
  
  cursor: pointer;
  transition: all 0.3s ease;
}

.group:hover .vacancy-card {
  border-color: #F15F31; /* Оранжевый цвет */
  background-color: #F7F7F7; /* Белый фон при наведении */
}

.vacancy-card-icon {
  width: 40px;
  height: 40px;
  margin-bottom: 8px;
  
  color: #8F8F8F; /* Серый цвет иконки */
  transition: color 0.3s ease;
}

.group:hover .vacancy-card-icon {
  color: #F15F31; /* Оранжевый цвет иконки при наведении */
}

.vacancy-card-text {
  font-family: 'Gilroy-Semibold', sans-serif;
  font-size: 16px;

  color: #8F8F8F; /* Серый цвет текста */
  transition: color 0.3s ease;
}

.group:hover .vacancy-card-text {
  color: #F15F31; /* Оранжевый цвет текста при наведении */
}
</style>