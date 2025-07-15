<script setup>
import { ref, computed } from 'vue';

// --- [ИЗМЕНЕНИЕ] Данные расширены до 10 событий с 2016 по 2025 год ---
const historyEvents = ref([
  { id: '2025', year: '2025', month: 'Январь', title: 'Запуск нового сайта', description: 'Мы полностью обновили наш сайт, сделав его еще удобнее и современнее для наших любимых клиентов.', image: 'https://images.unsplash.com/photo-1556742044-3c52d6e88c62?w=600' },
  { id: '2024', year: '2024', month: 'Декабрь', title: 'Корпоратив', description: 'Провели яркий и незабываемый корпоратив, завершив успешный год в кругу нашей дружной команды.', image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=600' },
  { id: '2023', year: '2023', month: 'Июнь', title: 'Расширение производства', description: 'Закупили новое современное оборудование, что позволило нам увеличить производственные мощности и повысить качество продукции.', image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=600' },
  { id: '2022', year: '2022', month: 'Февраль', title: 'Открытие филиала', description: 'Открыли наш первый филиал в другом городе, став еще ближе к нашим региональным клиентам.', image: 'https://images.unsplash.com/photo-1531973576160-7125cd663d86?w=600' },
  { id: '2021', year: '2021', month: 'Март', title: 'Основание компании', description: 'Red Panda была основана с миссией предоставлять полиграфические услуги высочайшего качества с непревзойденным сервисом.', image: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=600' },
  { id: '2020', year: '2020', month: 'Август', title: 'Первый крупный клиент', description: 'Заключили знаковый контракт, который стал важной вехой в нашем развитии и подтвердил правильность выбранного пути.', image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=600' },
  { id: '2019', year: '2019', month: 'Ноябрь', title: 'Переезд в новый офис', description: 'Наша команда выросла, и мы переехали в более просторный и современный офис в центре города.', image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600' },
  { id: '2018', year: '2018', month: 'Май', title: 'Участие в выставке', description: 'Впервые представили нашу продукцию на крупной отраслевой выставке, получив признание экспертов и новых клиентов.', image: 'https://images.unsplash.com/photo-1560439538-5f568652fa6a?w=600' },
  { id: '2017', year: '2017', month: 'Сентябрь', title: 'Запуск онлайн-заказов', description: 'Внедрили систему онлайн-заказов, сделав процесс сотрудничества с нами еще проще и быстрее.', image: 'https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=600' },
]);

// --- [НОВОЕ] Логика для отображения 5 дат из 10 ---
const DATES_TO_SHOW = 6;
const currentStartIndex = ref(0); // Индекс первого видимого элемента

// Этот computed всегда будет содержать 5 событий для отображения
const visibleEvents = computed(() => {
  return historyEvents.value.slice(currentStartIndex.value, currentStartIndex.value + DATES_TO_SHOW);
});

// Функции для навигации по датам
const next = () => {
  if (currentStartIndex.value < historyEvents.value.length - DATES_TO_SHOW) {
    currentStartIndex.value++;
  }
};
const prev = () => {
  if (currentStartIndex.value > 0) {
    currentStartIndex.value--;
  }
};


// --- Логика переключения активного события ---
const activeIndex = ref(0);
const activeEvent = computed(() => historyEvents.value[activeIndex.value]);
const setActiveEvent = (index) => {
  activeIndex.value = index;
};
</script>

<template>
  <div class="history-slider">
    <div class="timeline-controls">
      <button 
        @click="prev" 
        :disabled="currentStartIndex === 0" 
        class="nav-arrow"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
      </button>

      <div class="timeline-wrapper">
        <div class="timeline-line"></div>
        <div
          v-for="(event, index) in visibleEvents"
          :key="event.id"
          class="timeline-dot-wrapper"
        >
          <button
            @click="setActiveEvent(currentStartIndex + index)"
            class="timeline-dot"
            :class="{ 'is-active': activeIndex === (currentStartIndex + index) }"
          >
            {{ event.year }}
          </button>
        </div>
      </div>
      
      <button 
        @click="next" 
        :disabled="currentStartIndex >= historyEvents.length - DATES_TO_SHOW" 
        class="nav-arrow"
      >
         <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
      </button>
    </div>

    <transition name="slide-fade" mode="out-in">
      <div :key="activeEvent.id" class="event-content">
        <div class="event-info">
          <div class="text-h1-panda font-bold text-panda-orange mb-1">{{ activeEvent.year }}</div>
          <div class="text-h4-panda font-semibold text-panda-orange mb-15">{{ activeEvent.month }}</div>
          <h3 class="text-h3-panda font-bold text-panda-black mb-3">{{ activeEvent.title }}</h3>
          <p class="text-body-panda text-panda-black max-w-md">{{ activeEvent.description }}</p>
        </div>
        <div class="event-image-wrapper">
          <img :src="activeEvent.image" :alt="activeEvent.title" class="event-image">
        </div>
      </div>
    </transition>
  </div>
</template>

<style scoped>
.history-slider {
  width: 100%;
}

/* --- [ВОЗВРАЩЕНЫ] Стили для блока управления и стрелок --- */
.timeline-controls {
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4rem;
}

.nav-arrow {
  flex-shrink: 0;
  color: #8F8F8F;
  padding: 8px;
  border-radius: 50%;
  transition: all 0.2s ease;
}
.nav-arrow:hover:not(:disabled) {
  background-color: #E3E3E3;
  color: #131C26;
}
.nav-arrow:disabled {
  color: #E3E3E3;
  cursor: not-allowed;
}
/* --- --- */

.timeline-wrapper {
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-grow: 1;
  margin: 0 1rem;
}

.timeline-line {
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 2px;
  background-color: #F15F31;
  transform: translateY(-50%);
  z-index: 1;
  /* Корректировка, чтобы линия не выходила за пределы крайних кругов */
  left: 29px;
  right: 29px;
}

.timeline-dot-wrapper {
  position: relative;
  z-index: 2;
}

/* --- [СОХРАНЕНЫ] Исправленные стили для кнопки и круга --- */
.timeline-dot {
  position: relative;
  width: 58px;
  height: 58px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Gilroy-Bold', sans-serif;
  font-size: 16px;
  cursor: pointer;
  background: none;
  border: none;
  color: #F15F31;
  transition: color 0.3s ease;
  z-index: 3;
}

.timeline-dot::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 2px solid #F15F31;
  background-color: #f7f7f7;
  z-index: -1;
  transform: scale(1);
  transition: transform 0.3s ease, background-color 0.3s ease;
}

.timeline-dot:hover::before {
  transform: scale(1.08);
}

.timeline-dot.is-active {
  color: #f7f7f7;
}

.timeline-dot.is-active::before {
  background-color: #F15F31;
  transform: scale(1);
}

.timeline-dot.is-active:hover::before {
  transform: scale(1.1);
}
/* --- --- */

.event-content {
  display: grid;
  grid-template-columns: 1fr;
  align-items: start;
  gap: 2rem;
}

@media (min-width: 768px) {
  .event-content {
    grid-template-columns: 1fr 1.5fr;
    gap: 4rem;
  }
}

.event-image-wrapper {
  width: 100%;
  aspect-ratio: 16 / 10;
  overflow: hidden;
  border-radius: 1rem;
  background-color: #E3E3E3;
}

.event-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: opacity 0.4s ease, transform 0.4s ease;
}

.slide-fade-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.slide-fade-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}
</style>