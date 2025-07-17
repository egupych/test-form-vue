<script setup>
import { ref } from 'vue';
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

// --- ИЗМЕНЕНИЕ: Данные для форматов вынесены в script ---
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
// --- КОНЕЦ ИЗМЕНЕНИЯ ---

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
        <div class="grid grid-cols-2 md:grid-cols-3 gap-12 items-start">
          

            <div>
              <h3 class="font-semibold text-panda-black text-h5-panda mb-4">Стандартные DIN-форматы</h3>
              <div class="bg-white p-4 rounded-lg">
                <div v-for="(format, index) in dinFormats" :key="format.name" class="flex justify-between items-center py-3" :class="{ 'border-b border-light-gray': index < dinFormats.length - 1 }">
                  <div class="text-body-panda text-panda-black">
                    <span class="font-bold">{{ format.name }}</span>
                    <span v-if="format.note" class="text-dark-gray text-sm ml-2">{{ format.note }}</span>
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
</style>