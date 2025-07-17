<script setup>
// Этот скрипт управляет логикой страницы "Подготовка к печати".
// Он обрабатывает переключение вкладок, открытие попапа с формой,
// а также управляет процессом калибровки экрана и отображением
// точного реального размера визиток и DIN-форматов до А3 включительно.

import { ref, onMounted, computed } from 'vue';
import BaseButton from '@/components/ui/BaseButton.vue';
import SectionHeader from '@/components/ui/SectionHeader.vue';
import CalculationForm from '@/components/ui/CalculationForm.vue';

const activeTab = ref('packages');
const isPopupVisible = ref(false);

const openPopup = () => {
  isPopupVisible.value = true;
};
const closePopup = () => {
  isPopupVisible.value = false;
};

const templatesData = [
  {
    id: 'packages',
    name: 'Пакеты',
    items: [
      { name: '230 × 350 × 80 мм', href: '/templates/package-1.cdr' },
      { name: '170 × 190 × 105 мм', href: '/templates/package-2.cdr' },
      { name: '340 × 110 × 70 мм', href: '/templates/package-3.cdr' },
      { name: '200 × 200 × 90 мм', href: '/templates/package-4.cdr' },
      { name: '350 × 250 × 80 мм', href: '/templates/package-5.cdr' },
    ]
  },
  { id: 'booklets', name: 'Буклеты', items: [] },
  { id: 'triplets', name: 'Триплеты', items: [] },
  { id: 'envelopes', name: 'Конверты', items: [] },
  { id: 'folders', name: 'Папки', items: [] },
  { id: 'boxes', name: 'Коробки', items: [] },
  { id: 'doorholders', name: 'Дорхолдеры', items: [] },
  { id: 'calendars', name: 'Календари', items: [] },
  { id: 'ribbons', name: 'Ленты', items: [] },
];

const dinFormats = ref([
  { name: 'A0', dimensions: '841×1189 мм' },
  { name: 'A1', dimensions: '594×841 мм' },
  { name: 'A2', dimensions: '420×594 мм' },
  { name: 'SRA3', dimensions: '320×450 мм' },
  { name: 'A3', dimensions: '297×420 мм' },
  { name: 'A4', dimensions: '210×297 мм'},
  { name: 'A5', dimensions: '148×210 мм' },
  { name: 'A6', dimensions: '105×148 мм' },
  { name: 'A7', dimensions: '105×74 мм' },
]);

const cardFormats = ref([
    { name: 'Азиа-визитка', dimensions: '90×50 мм' },
    { name: 'Евро-визитка', dimensions: '85×55 мм' },
]);

// --- НАЧАЛО ИЗМЕНЕНИЯ: Общая логика калибровки и отображения ---

// Флаг, который определяет, доступен ли предпросмотр для формата (до А3)
const maxDimensionMm = 421; // A3 длинная сторона 420мм. Все что меньше - подходит.
const isFormatCalibratable = (format) => {
  if (!format || !format.dimensions) return false;
  const parts = format.dimensions.replace(' мм', '').split('×');
  if (parts.length < 2) return false;
  const width = Number(parts[0]);
  const height = Number(parts[1]);
  return width < maxDimensionMm && height < maxDimensionMm;
};


const isRealSizePopupVisible = ref(false);
const realSizePopupData = ref({ name: '', top: 0, left: 0 });
const currentFormatDimensions = ref({ width: 0, height: 0 });
let leaveTimeout;

// Данные для калибровки
const userPxPerMm = ref(null);
const isCalibrating = ref(false);
const creditCardWidthMm = 85.6; // Стандарт ширины ISO/IEC 7810 ID-1
const creditCardHeightMm = 53.98; // Стандарт высоты ISO/IEC 7810 ID-1
const initialCardWidthPx = (creditCardWidthMm / 25.4) * 96;
const calibrationWidthPx = ref(initialCardWidthPx);

// Вычисляемый стиль для макета предпросмотра, который использует данные калибровки
const calibratedFormatStyle = computed(() => {
  if (!userPxPerMm.value) return {};
  return {
    width: `${currentFormatDimensions.value.width * userPxPerMm.value}px`,
    height: `${currentFormatDimensions.value.height * userPxPerMm.value}px`,
  };
});

// При загрузке компонента проверяем, есть ли сохраненные данные калибровки
onMounted(() => {
  const savedPxPerMm = localStorage.getItem('screenPxPerMm');
  if (savedPxPerMm) {
    userPxPerMm.value = parseFloat(savedPxPerMm);
  }
});

// Универсальный обработчик наведения мыши на любой формат
const handleFormatMouseEnter = (format, event) => {
  if (!isFormatCalibratable(format)) return;
  if (!userPxPerMm.value) return; // Если не откалибровано, показываем только системную подсказку

  clearTimeout(leaveTimeout);
  const [width, height] = format.dimensions.replace(' мм', '').split('×');
  currentFormatDimensions.value = { width: Number(width), height: Number(height) };

  const rect = event.currentTarget.getBoundingClientRect();
  realSizePopupData.value = {
    name: format.name,
    top: rect.bottom + window.scrollY + 10,
    left: rect.left + window.scrollX,
  };
  isRealSizePopupVisible.value = true;
};

// Универсальный обработчик увода мыши с формата
const handleFormatMouseLeave = () => {
  leaveTimeout = setTimeout(() => {
    isRealSizePopupVisible.value = false;
  }, 100);
};

// Функции управления модальным окном калибровки
const startCalibration = () => {
  isRealSizePopupVisible.value = false;
  isCalibrating.value = true;
  calibrationWidthPx.value = initialCardWidthPx;
};

const saveCalibration = () => {
  const calculatedPxPerMm = calibrationWidthPx.value / creditCardWidthMm;
  userPxPerMm.value = calculatedPxPerMm;
  localStorage.setItem('screenPxPerMm', calculatedPxPerMm.toString());
  isCalibrating.value = false;
};

const cancelCalibration = () => {
  isCalibrating.value = false;
};
// --- КОНЕЦ ИЗМЕНЕНИЯ ---

</script>

<template>
  <main class="py-10 md:py-25">
    <div class="max-w-6xl mx-auto">

      <section>
        <SectionHeader class="gap-container">Шаблоны</SectionHeader>
        <div class="flex flex-wrap gap-2 mb-10">
          </div>
        <div v-for="tab in templatesData" :key="tab.id + '-content'">
         </div>
      </section>

      <section class="gap-page">
        <SectionHeader class="gap-container">Размеры</SectionHeader>

        <div class="calibration-prompt">
          <div class="calibration-prompt__info">
            <h4 class="calibration-prompt__title">Хотите увидеть реальный размер?</h4>
            <p class="calibration-prompt__text">
              Для точного отображения форматов на вашем экране пройдите быструю калибровку.
              Это нужно сделать всего один раз.
            </p>
          </div>
          <BaseButton @click="startCalibration" variant="outline-gray">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path><path d="M12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12z"></path></svg>
            Откалибровать экран
          </BaseButton>
        </div>
        <div class="grid grid-cols-2 md:grid-cols-3 gap-12 items-start mt-10">
            <div>
              <h3 class="font-semibold text-panda-black text-h5-panda mb-4">Стандартные DIN-форматы</h3>
              <div class="bg-white p-4 rounded-lg">
                <div 
                  v-for="(format, index) in dinFormats" 
                  :key="format.name" 
                  class="format-row"
                  :class="{ 'format-row--interactive': isFormatCalibratable(format) }"
                  :title="!userPxPerMm && isFormatCalibratable(format) ? 'Откалибруйте экран, чтобы увидеть реальный размер' : ''"
                  @mouseenter="handleFormatMouseEnter(format, $event)"
                  @mouseleave="handleFormatMouseLeave"
                >
                  <div class="flex justify-between items-center py-3">
                    <div class="text-body-panda text-panda-black">
                      <span class="font-bold">{{ format.name }}</span>
                    </div>
                    <div class="font-mono text-dark-gray">{{ format.dimensions }}</div>
                  </div>
                   <div class="format-row__border" :class="{ 'format-row__border--full': index >= dinFormats.length - 1 }"></div>
                </div>
                </div>
            </div>
            
            <div>
              <h3 class="font-semibold text-panda-black text-h5-panda mb-4">Визитки</h3>
               <div class="bg-white p-4 rounded-lg">
                 <div 
                  v-for="(format, index) in cardFormats" 
                  :key="format.name" 
                  class="format-row format-row--interactive"
                  :title="!userPxPerMm ? 'Откалибруйте экран, чтобы увидеть реальный размер' : ''"
                  @mouseenter="handleFormatMouseEnter(format, $event)"
                  @mouseleave="handleFormatMouseLeave"
                >
                   <div class="flex justify-between items-center py-3">
                    <div class="text-body-panda text-panda-black font-bold">{{ format.name }}</div>
                    <div class="font-mono text-dark-gray">{{ format.dimensions }}</div>
                  </div>
                  <div class="format-row__border" :class="{ 'format-row__border--full': index >= cardFormats.length - 1 }"></div>
                </div>
                 </div>
            </div>
        </div>
      </section>
      
      <section class="gap-page">
        <SectionHeader class="gap-container">Требования к макетам</SectionHeader>
        </section>

      <div class="bg-light-gray rounded-2xl p-8 flex flex-col items-center justify-center text-center h-full mt-10 gap-page">
        </div>
    </div>
  </main>

  <Teleport to="body">
    <transition name="popup">
      <div v-if="isPopupVisible" class="popup-overlay" @click.self="closePopup">
        </div>
    </transition>
  </Teleport>
  
  <Teleport to="body">
    <transition name="real-size-popup-transition">
      <div
        v-if="isRealSizePopupVisible && userPxPerMm"
        class="real-size-popup"
        :style="{ top: `${realSizePopupData.top}px`, left: `${realSizePopupData.left}px` }"
        @mouseenter="clearTimeout(leaveTimeout)"
        @mouseleave="handleFormatMouseLeave"
      >
        <div class="real-size-popup__header">
          <div class="font-bold text-panda-black">{{ realSizePopupData.name }}</div>
        </div>
        <div 
          class="real-size-popup__box"
          :style="calibratedFormatStyle"
        ></div>
        <div class="real-size-popup__note">Размер показан 1 к 1</div>
      </div>
    </transition>
  </Teleport>
  <Teleport to="body">
    <transition name="popup">
      <div v-if="isCalibrating" class="popup-overlay">
        <div class="popup-container !max-w-lg text-center">
            <div class="p-8 md:p-12 flex flex-col items-center gap-6">
              <h3 class="text-h4-panda font-semibold text-panda-black">Калибровка экрана</h3>
              <p class="text-dark-gray">Приложите банковскую или любую другую пластиковую карту (ID) к экрану и двигайте ползунок, пока оранжевый прямоугольник не совпадет с ее размером.</p>
              
              <div class="calibration-area">
                <div 
                  class="calibration-card"
                  :style="{ 
                    width: `${calibrationWidthPx}px`, 
                    height: `${(calibrationWidthPx / creditCardWidthMm) * creditCardHeightMm}px` 
                  }"
                ></div>
              </div>
              
              <input 
                type="range" 
                v-model="calibrationWidthPx"
                min="250"
                max="500"
                step="0.1"
                class="w-full"
              >
              
              <div class="flex items-center gap-4 mt-4">
                <BaseButton @click="cancelCalibration" variant="gray">Отмена</BaseButton>
                <BaseButton @click="saveCalibration" variant="fill-black">Сохранить</BaseButton>
              </div>
            </div>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<style scoped>
/* ... ваши существующие стили ... */
.no-underline { text-decoration: none; }
.popup-overlay {
  position: fixed; top: 0; left: 0; width: 100%; height: 100%;
  background-color: rgba(19, 28, 38, 0.8);
  backdrop-filter: blur(0.3125rem);
  display: flex; justify-content: center; align-items: center;
  z-index: 1000; padding: 1rem;
}
.popup-container {
  position: relative; background: white;
  box-shadow: 0 0.625rem 1.875rem rgba(0, 0, 0, 0.2);
  width: 100%; max-width: 71.25rem;
  transform: scale(1); transition: transform 0.3s ease;
  overflow-y: auto; max-height: 95vh; border-radius: 1rem;
}
.popup-close-button {
  position: absolute; top: 0.9375rem; right: 1.375rem;
  background: none; border: none; font-size: 2.5rem; line-height: 1;
  color: #8F8F8F; cursor: pointer; transition: color 0.2s; z-index: 1001;
}
.popup-close-button:hover { color: #131C26; }
.popup-enter-active, .popup-leave-active { transition: opacity 0.3s ease, transform 0.3s ease; }
.popup-enter-from, .popup-leave-to { opacity: 0; transform: scale(0.95); }

/* --- НАЧАЛО ИЗМЕНЕНИЯ: Новые стили --- */
.calibration-prompt {
  background-color: #F7F7F7;
  border-radius: 1rem; /* 16px */
  padding: 1.5rem; /* 24px */
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1.5rem;
}
.calibration-prompt__title {
  font-size: 1.125rem; /* 18px */
  font-weight: 600;
  color: #131C26;
  margin-bottom: 0.25rem;
}
.calibration-prompt__text {
  font-size: 0.875rem; /* 14px */
  color: #8F8F8F;
  max-width: 25rem; /* 400px */
}

.format-row {
  position: relative;
}

.format-row__border {
  border-bottom: 1px solid #F7F7F7;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
}
.format-row__border--full {
  display: none; /* Скрываем бордер у последнего элемента */
}

.format-row--interactive {
  cursor: pointer;
  border-radius: 0.5rem; /* 8px */
  margin: -0.5rem -1rem;
  padding: 0.5rem 1rem;
  transition: background-color 0.2s ease;
}

.format-row--interactive:hover {
  background-color: #F7F7F7;
}

.real-size-popup {
  position: absolute;
  z-index: 1050;
  background-color: #ffffff;
  border: 1px solid #E3E3E3;
  border-radius: 0.75rem; /* 12px */
  padding: 1rem; /* 16px */
  box-shadow: 0 0.5rem 1.5rem rgba(0, 0, 0, 0.1);
  pointer-events: all;
  display: flex;
  flex-direction: column;
  gap: 0.75rem; /* 12px */
  min-width: 12.5rem; /* 200px */
  max-width: 90vw;
  max-height: 80vh;
  overflow: auto;
}
.real-size-popup__header { /* ... */ }
.real-size-popup__box {
  border: 2px dashed #F15F31;
  background-color: rgba(241, 95, 49, 0.05);
  transition: width 0.1s, height 0.1s;
}
.real-size-popup__note {
  font-size: 0.75rem; /* 12px */
  color: #8F8F8F;
  text-align: center;
  margin: 0 auto;
  line-height: 1.4;
}
.real-size-popup-transition-enter-active, .real-size-popup-transition-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.real-size-popup-transition-enter-from, .real-size-popup-transition-leave-to {
  opacity: 0;
  transform: translateY(0.625rem); /* 10px */
}
.calibration-area {
  width: 100%;
  padding: 2rem 0;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}
.calibration-card {
  border: 2px solid #F15F31;
  background-color: rgba(241, 95, 49, 0.1);
  border-radius: 0.5rem;
  transition: width 0.05s linear, height 0.05s linear;
}

input[type="range"] {
  -webkit-appearance: none; appearance: none;
  width: 100%; height: 0.5rem; /* 8px */
  background: #E3E3E3; border-radius: 0.3125rem; /* 5px */
  outline: none; opacity: 0.7; transition: opacity .2s;
}
input[type="range"]:hover { opacity: 1; }
input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none; appearance: none;
  width: 1.5rem; /* 24px */ height: 1.5rem; /* 24px */
  background: #F15F31; cursor: pointer; border-radius: 50%;
  border: 4px solid #fff; box-shadow: 0 0 5px rgba(0,0,0,0.2);
}
input[type="range"]::-moz-range-thumb {
  width: 1.5rem; /* 24px */ height: 1.5rem; /* 24px */
  background: #F15F31; cursor: pointer; border-radius: 50%;
  border: 4px solid #fff; box-shadow: 0 0 5px rgba(0,0,0,0.2);
}
/* --- КОНЕЦ ИЗМЕНЕНИЯ --- */

</style>