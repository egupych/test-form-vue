<script setup>
// Этот скрипт управляет логикой страницы "Подготовка к печати".
// Вся логика предпросмотра реальных размеров теперь вынесена в единый
// инструмент, который открывается в модальном окне.

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

// --- Логика инструмента "Проверка размера" ---

const isSizeToolVisible = ref(false);
const toolStep = ref(1); // 1: калибровка, 2: предпросмотр
const userPxPerMm = ref(null);
const selectedFormatId = ref(null);

const creditCardWidthMm = 85.6;
const creditCardHeightMm = 53.98;
const initialCardWidthPx = (creditCardWidthMm / 25.4) * 96;
const calibrationWidthPx = ref(initialCardWidthPx);

const maxDimensionMm = 421;
const isFormatCalibratable = (format) => {
  if (!format || !format.dimensions) return false;
  const parts = format.dimensions.replace(' мм', '').split('×');
  if (parts.length < 2) return false;
  const width = Number(parts[0]);
  const height = Number(parts[1]);
  return width < maxDimensionMm && height < maxDimensionMm;
};

const availableFormats = computed(() => {
  const allFormats = [...dinFormats.value, ...cardFormats.value];
  return allFormats.filter(isFormatCalibratable);
});

const selectedFormatData = computed(() => {
  if (!selectedFormatId.value) return null;
  return availableFormats.value.find(f => f.name === selectedFormatId.value);
});

const previewBoxStyle = computed(() => {
  if (!selectedFormatData.value || !userPxPerMm.value) return {};
  const [width, height] = selectedFormatData.value.dimensions.replace(' мм', '').split('×');
  return {
    width: `${Number(width) * userPxPerMm.value}px`,
    height: `${Number(height) * userPxPerMm.value}px`,
  };
});

onMounted(() => {
  const savedPxPerMm = localStorage.getItem('screenPxPerMm');
  if (savedPxPerMm) {
    userPxPerMm.value = parseFloat(savedPxPerMm);
  }
});

const openSizeTool = () => {
  if (userPxPerMm.value) {
    toolStep.value = 2;
    if (availableFormats.value.length > 0) {
      selectedFormatId.value = availableFormats.value.find(f => f.name === 'A4')?.name || availableFormats.value[0].name;
    }
  } else {
    toolStep.value = 1;
    calibrationWidthPx.value = initialCardWidthPx;
  }
  isSizeToolVisible.value = true;
};

const closeSizeTool = () => {
  isSizeToolVisible.value = false;
};

const saveCalibration = () => {
  const calculatedPxPerMm = calibrationWidthPx.value / creditCardWidthMm;
  userPxPerMm.value = calculatedPxPerMm;
  localStorage.setItem('screenPxPerMm', calculatedPxPerMm.toString());
  toolStep.value = 2;
  if (availableFormats.value.length > 0) {
      selectedFormatId.value = availableFormats.value.find(f => f.name === 'A4')?.name || availableFormats.value[0].name;
  }
};
</script>

<template>
  <main class="py-10 md:py-25">
    <div class="max-w-6xl mx-auto">

      <section>
        <SectionHeader class="gap-container">Шаблоны</SectionHeader>
        
        <div class="flex flex-wrap gap-2 mb-10">
          <BaseButton
            v-for="tab in templatesData"
            :key="tab.id"
            @click="activeTab = tab.id"
            :variant="activeTab === tab.id ? 'fill-black' : 'gray'"
          >
            {{ tab.name }}
          </BaseButton>
        </div>

        <div v-for="tab in templatesData" :key="tab.id + '-content'">
          <div v-if="activeTab === tab.id">
            <div v-if="tab.items.length > 0" class="grid grid-cols-3 md:grid-cols-3 lg:grid-cols-5 gap-6">
              
              <a 
                v-for="item in tab.items" 
                :key="item.name" 
                :href="item.href" 
                download
                class="flex flex-col items-center group text-center no-underline"
              >
                <div class="bg-light-gray w-full rounded-lg flex items-center justify-center p-4 mb-3 aspect-[3/4]">
                  <svg class="w-full h-full text-gray" viewBox="0 0 100 133" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 1H80L99 20V113L80 132H20L1 113V20L20 1Z" stroke="currentColor" stroke-width="2"/>
                    <path d="M1 20H20H99" stroke="currentColor" stroke-width="1" stroke-dasharray="4 4"/>
                    <path d="M20 1V20V132" stroke="currentColor" stroke-width="1" stroke-dasharray="4 4"/>
                    <path d="M80 1V20V132" stroke="currentColor" stroke-width="1" stroke-dasharray="4 4"/>
                  </svg>
                </div>
                
                <div class="text-body-panda text-panda-black mb-4">{{ item.name }}</div>      
                
                <div class="button mt-auto" data-tooltip="Corel .CDR">
                  <div class="button-wrapper">
                    <div class="text">Скачать</div>
                    <span class="icon">
                      <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" width="2em" height="2em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15V3m0 12l-4-4m4 4l4-4M2 17l.621 2.485A2 2 0 0 0 4.561 21h14.878a2 2 0 0 0 1.94-1.515L22 17"></path></svg>
                    </span>
                  </div>
                </div>
              </a>

            </div>
            <div v-else class="text-center py-10 text-dark-gray text-xl">
              Шаблоны для категории «{{ tab.name }}» скоро появятся.
            </div>
          </div>
        </div>
      </section>

      <section class="gap-page">
        <SectionHeader class="gap-container">Размеры</SectionHeader>

        <div class="calibration-prompt">
          <div class="calibration-prompt__info">
            <h4 class="calibration-prompt__title">Хотите увидеть реальный размер?</h4>
            <p class="calibration-prompt__text">
              Запустите наш инструмент проверки размера. Для точной работы может потребоваться быстрая калибровка экрана по банковской карте.
            </p>
          </div>
          <BaseButton @click="openSizeTool" variant="outline-gray">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2"><path d="M21.25 21.25L16.05 16.05M16.05 16.05C17.222 14.8779 18 13.2619 18 11.5C18 7.91015 15.0899 5 11.5 5C7.91015 5 5 7.91015 5 11.5C5 15.0899 7.91015 18 11.5 18C13.2619 18 14.8779 17.222 16.05 16.05Z"></path><path d="M11.5 8V15M8 11.5H15"></path></svg>
            Проверить реальный размер
          </BaseButton>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-3 gap-12 items-start mt-10">
            <div>
              <h3 class="font-semibold text-panda-black text-h5-panda mb-4">Стандартные DIN-форматы</h3>
              <div class="bg-white p-4 rounded-lg">
                <div v-for="(format, index) in dinFormats" :key="format.name" class="flex justify-between items-center py-3" :class="{ 'border-b border-light-gray': index < dinFormats.length - 1 }">
                  <div class="text-body-panda text-panda-black">
                    <span class="font-bold">{{ format.name }}</span>
                  </div>
                  <div class="font-mono text-dark-gray">{{ format.dimensions }}</div>
                </div>
              </div>
            </div>
            
            <div>
              <h3 class="font-semibold text-panda-black text-h5-panda mb-4">Визитки</h3>
               <div class="bg-white p-4 rounded-lg">
                <div v-for="(format, index) in cardFormats" :key="format.name" class="flex justify-between items-center py-3" :class="{ 'border-b border-light-gray': index < cardFormats.length - 1 }">
                  <div class="text-body-panda text-panda-black font-bold">{{ format.name }}</div>
                  <div class="font-mono text-dark-gray">{{ format.dimensions }}</div>
                </div>
              </div>
            </div>
        </div>
      </section>
      
      <section class="gap-page">
        <SectionHeader class="gap-container">Требования к макетам</SectionHeader>
        <div class="space-y-10">
          <div>
            <h3 class="font-semibold text-panda-black text-h5-panda mb-4">Формат файла</h3>
            <p class="text-dark-gray text-body-panda max-w-4xl">
              Макет желательно присылать в PDF. Если конвертации в PDF нет, допускается присылать макет в программах, где он был разработан (AI, CDR, PSD). Если макет был разработан в онлайн-редакторах (Figma, Canva), рекомендуется прикладывать ссылку для возможной корректировки.
            </p>
          </div>
          <div>
            <h3 class="font-semibold text-panda-black text-h5-panda mb-4">Отступы</h3>
            <p class="text-dark-gray text-body-panda max-w-4xl">
              Необходимо во всех дизайн-макетах оставлять отступы с фоном по периметру по 3 мм для обреза. Например, если вы делаете визитку размером 90x50 мм, то размер макета с вылетами должен быть 96x56 мм. Отступ содержимого (текста, изображений) от края реза должен составлять от 5 мм.
            </p>
          </div>
          <div>
            <h3 class="font-semibold text-panda-black text-h5-panda mb-4">Цвета</h3>
            <p class="text-dark-gray text-body-panda max-w-4xl">
              Желательно отправлять файлы на печать в цветовой модели CMYK. Если вы работаете в программе, где нет цветовой модели CMYK, то старайтесь использовать цвета из палитры PANTONE. В таком случае, при работе в цветовой модели RGB (Figma, Canva), при использовании цветов PANTONE вы будете видеть макет почти таким же, каким он получится после печати.
            </p>
          </div>
          <div>
            <h3 class="font-semibold text-panda-black text-h5-panda mb-4">Шрифты</h3>
            <p class="text-dark-gray text-body-panda max-w-4xl">
              Шрифты необходимо перевести в кривые.
              <br>Corel Draw: Ctrl+Q | Illustrator/Figma: Ctrl+Shift+O.
              <br>Либо отправить шрифты нашему менеджеру, для избежания ситуаций, когда программа может поменять шрифт, если его нет в системе.
            </p>
          </div>
          <div>
            <h3 class="font-semibold text-panda-black text-h5-panda mb-4">Графические элементы</h3>
            <div class="space-y-3 text-dark-gray text-body-panda max-w-4xl">
              <p>Вектор — лучший выбор. Для четкой печати желательно использовать логотипы и иконки в векторном формате (SVG, AI, EPS, CDR). Векторные изображения печатаются без искажений и потери качества.</p>
              <p>1 мм при 300 DPI = 12 пикселей. Если вы делаете дизайн в программе, которая выдает размер только в пикселях (Figma, Canva), то нужно учитывать, что для 1 мм физического размера (при качественной печати 300 DPI) необходимо 12 пикселей.</p>
            </div>
          </div>
          <div>
            <h3 class="font-semibold text-panda-black text-h5-panda mb-4">Эффекты и прочее</h3>
            <div class="space-y-3 text-dark-gray text-body-panda max-w-4xl">
                <p>Тени, градиенты, прозрачность должны быть растрированы.</p>
                <p>Линии должны иметь видимую толщину, от 0.2 pt.</p>
                <p>В макете не должно быть лишних элементов, чтобы они случайно не оказались на печати.</p>
            </div>
          </div>
        </div>
      </section>

      <div class="bg-light-gray rounded-2xl p-8 flex flex-col items-center justify-center text-center h-full mt-10 gap-page">
        <img src="@/assets/images/pages/PreparationPage/call.svg" alt="Иконка документа" class="w-20 h-20 mb-6">
        
        <p class="text-h5-panda font-semibold text-panda-black mb-6 max-w-sm leading-tight">
          Нет времени на подготовку файлов? <br>Оперативно сделаем за Вас!
        </p>
    
        <BaseButton 
          @click="openPopup" 
          variant="fill-black"
        >
          Написать менеджеру
        </BaseButton>
      </div>
    </div>
  </main>

  <Teleport to="body">
    <transition name="popup">
      <div v-if="isPopupVisible" class="popup-overlay" @click.self="closePopup">
        <div class="popup-container">
          <button @click="closePopup" class="popup-close-button">&times;</button>
          <CalculationForm />
        </div>
      </div>
    </transition>
  </Teleport>
  
  <Teleport to="body">
    <transition name="popup">
      <div v-if="isSizeToolVisible" class="popup-overlay" @click.self="closeSizeTool">
        <div class="popup-container !max-w-2xl">
            <button @click="closeSizeTool" class="popup-close-button">&times;</button>
            
            <div v-if="toolStep === 1" class="p-8 md:p-12 flex flex-col items-center gap-6 text-center">
              <h3 class="text-h4-panda font-semibold text-panda-black">Калибровка экрана</h3>
              <p class="text-dark-gray">Приложите банковскую карту к экрану и двигайте ползунок, пока оранжевый прямоугольник не совпадет с ее размером.</p>
              <div class="calibration-area">
                <div 
                  class="calibration-card"
                  :style="{ 
                    width: `${calibrationWidthPx}px`, 
                    height: `${(calibrationWidthPx / creditCardWidthMm) * creditCardHeightMm}px` 
                  }"
                ></div>
              </div>
              <input type="range" v-model="calibrationWidthPx" min="250" max="500" step="0.1" class="w-full">
              <div class="flex items-center gap-4 mt-4">
                <BaseButton @click="closeSizeTool" variant="gray">Отмена</BaseButton>
                <BaseButton @click="saveCalibration" variant="fill-black">Сохранить и продолжить</BaseButton>
              </div>
            </div>

            <div v-if="toolStep === 2" class="p-8 md:p-12 flex flex-col gap-6">
              <h3 class="text-h4-panda font-semibold text-panda-black text-center">Проверка реального размера</h3>
              <div class="flex flex-col sm:flex-row gap-4 items-center">
                <label for="format-select" class="font-semibold whitespace-nowrap">Выберите формат:</label>
                <select id="format-select" v-model="selectedFormatId" class="size-tool-select">
                  <option v-for="format in availableFormats" :key="format.name" :value="format.name">
                    {{ format.name }} ({{ format.dimensions }})
                  </option>
                </select>
              </div>

              <div class="size-tool-preview-area">
                <p v-if="!selectedFormatData" class="m-auto text-dark-gray">Выберите формат для предпросмотра</p>
                <div v-else class="preview-box" :style="previewBoxStyle"></div>
              </div>
              
              <div class="flex items-center justify-center gap-4 mt-4">
                  <BaseButton @click="toolStep = 1" variant="gray" size="sm">Откалибровать заново</BaseButton>
              </div>
            </div>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<style scoped>
.no-underline {
  text-decoration: none;
}
.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(19, 28, 38, 0.8);
  backdrop-filter: blur(0.3125rem); /* 5px -> 0.3125rem */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 1rem;
}

.popup-container {
  position: relative;
  background: white;
  box-shadow: 0 0.625rem 1.875rem rgba(0, 0, 0, 0.2); /* 10px 30px -> 0.625rem 1.875rem */
  width: 100%;
  max-width: 71.25rem; /* 1140px -> 71.25rem */
  transform: scale(1);
  transition: transform 0.3s ease;
  overflow-y: auto;
  max-height: 95vh;
  border-radius: 1rem; /* 16px */
}

.popup-container > :deep(.form-wrapper) {
  padding: 4rem !important;
}

@media (min-width: 768px) {
  .popup-container > :deep(.form-wrapper) {
    padding: 7rem !important;
  }
}

.popup-close-button {
  position: absolute;
  top: 0.9375rem; /* 15px -> 0.9375rem */
  right: 1.375rem; /* 22px -> 1.375rem */
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
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.popup-enter-from,
.popup-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

.button {
  --width: 6.25rem; /* 100px -> 6.25rem */
  --height: 2.1875rem; /* 35px -> 2.1875rem */
  --tooltip-height: 2.1875rem; /* 35px -> 2.1875rem */
  --tooltip-width: 5.625rem; /* 90px -> 5.625rem */
  --gap-between-tooltip-to-button: 0.75rem; /* 12px -> 0.75rem */
  --button-color: #131C26;
  --tooltip-color: #E3E3E3;
  width: var(--width);
  height: var(--height);
  background: var(--button-color);
  position: relative;
  text-align: center;
  border-radius: 2rem;
  font-family: 'Gilroy-SemiBold', sans-serif;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.group:hover .button {
  background: #F15F31;
}

.button::before {
  position: absolute;
  content: attr(data-tooltip);
  width: var(--tooltip-width);
  height: var(--tooltip-height);
  background-color: var(--tooltip-color);
  font-size: 0.9rem;
  color: #111;
  border-radius: .25em;
  line-height: var(--tooltip-height);
  top: calc(100% + var(--gap-between-tooltip-to-button));
  left: calc(50% - var(--tooltip-width) / 2);
  opacity: 0;
  visibility: hidden;
  transform: translateY(0.5rem); /* 8px -> 0.5rem */
  transition: all 0.25s ease;
  pointer-events: none;
}

.text {
  display: flex;
  align-items: center;
  justify-content: center;
}

.button-wrapper,.text,.icon {
  overflow: hidden;
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  color: #F7F7F7;
}

.text {
  top: 0
}

.text,.icon {
  transition: top 0.5s;
}

.icon {
  color: #F7F7F7;
  top: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon svg {
  width: 1.5rem; /* 24px -> 1.5rem */
  height: 1.5rem; /* 24px -> 1.5rem */
}

.group:hover .button .text {
  top: -100%;
}

.group:hover .button .icon {
  top: 0;
}

.group:hover .button:before {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

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

.size-tool-select {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #E3E3E3;
  border-radius: 0.5rem;
  background-color: #fff;
  font-size: 1rem;
  cursor: pointer;
  transition: border-color 0.2s;
}
.size-tool-select:focus {
  outline: none;
  border-color: #F15F31;
}

.size-tool-preview-area {
  margin-top: 1rem;
  width: 100%;
  min-height: 25rem; /* 400px */
  background-color: #F7F7F7;
  border-radius: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: auto;
  padding: 2rem;
}

.preview-box {
  border: 2px dashed #F15F31;
  background-color: rgba(241, 95, 49, 0.05);
  flex-shrink: 0; /* Чтобы блок не сжимался, если не помещается */
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
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  height: 0.5rem; /* 8px */
  background: #E3E3E3;
  border-radius: 0.3125rem; /* 5px */
  outline: none;
  opacity: 0.7;
  transition: opacity .2s;
}

input[type="range"]:hover {
  opacity: 1;
}

input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 1.5rem; /* 24px */
  height: 1.5rem; /* 24px */
  background: #F15F31;
  cursor: pointer;
  border-radius: 50%;
  border: 4px solid #fff;
  box-shadow: 0 0 5px rgba(0,0,0,0.2);
}

input[type="range"]::-moz-range-thumb {
  width: 1.5rem; /* 24px */
  height: 1.5rem; /* 24px */
  background: #F15F31;
  cursor: pointer;
  border-radius: 50%;
  border: 4px solid #fff;
  box-shadow: 0 0 5px rgba(0,0,0,0.2);
}
</style>