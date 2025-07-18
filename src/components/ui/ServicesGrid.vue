<script setup>
import { ref, computed, onBeforeUpdate } from 'vue';
import { useServicesStore } from '@/stores/services.js';
import { storeToRefs } from 'pinia';
import { useServiceImages } from '@/composables/useServiceImages.js';

const servicesStore = useServicesStore();
const { services } = storeToRefs(servicesStore);

const hoveredService = ref(null);
const hoveredCell = ref(null);
const hoveredLetter = ref(null);
const gridContainerRef = ref(null);

const previewImageUrl = ref(null);
const previewImageDimensions = ref({ width: 0, height: 0 });
const isPreviewLoading = ref(false);

const alphabet = computed(() => {
  const firstLetters = services.value.map(s => s.name.charAt(0).toUpperCase());
  return [...new Set(firstLetters)].sort((a, b) => a.localeCompare(b, 'ru'));
});

const sortedServices = computed(() => {
    return [...services.value].sort((a, b) => a.name.localeCompare(b.name, 'ru'));
});

// --- ЛОГИКА ПРЕДПРОСМОТРА (без изменений) ---
const handleMouseEnter = (service, event) => {
    hoveredLetter.value = null;
    if (service && !service.isPlaceholder && !isPreviewLoading.value) {
        hoveredService.value = service;
        hoveredCell.value = event.target.closest('.service-cell');

        isPreviewLoading.value = true;
        const { lastImage } = useServiceImages(service.id);

        if (lastImage.value) {
            const img = new Image();
            img.onload = () => {
                previewImageDimensions.value = {
                    width: img.naturalWidth,
                    height: img.naturalHeight,
                };
                previewImageUrl.value = lastImage.value;
                isPreviewLoading.value = false;
            };
            img.onerror = () => {
                previewImageUrl.value = null;
                previewImageDimensions.value = { width: 0, height: 0 };
                isPreviewLoading.value = false;
            };
            img.src = lastImage.value;
        } else {
            previewImageUrl.value = null;
            previewImageDimensions.value = { width: 0, height: 0 };
            isPreviewLoading.value = false;
        }
    }
};

const resetPreview = () => {
    hoveredService.value = null;
    hoveredCell.value = null;
    previewImageUrl.value = null;
    previewImageDimensions.value = { width: 0, height: 0 };
}

const handleLetterEnter = (letter) => {
    hoveredLetter.value = letter;
    resetPreview();
};

const handleMouseLeaveComponent = () => {
    resetPreview();
    hoveredLetter.value = null;
};

const previewStyle = computed(() => {
    if (!hoveredCell.value || !gridContainerRef.value || !previewImageDimensions.value.width) return {};

    const PREVIEW_BASE_WIDTH = 256;
    const BORDER_WIDTH = 1;
    const previewHeight = PREVIEW_BASE_WIDTH * previewImageDimensions.value.height / previewImageDimensions.value.width;

    const container = gridContainerRef.value.parentElement;
    if (!container) return {};

    const containerRect = container.getBoundingClientRect();
    const cellRect = hoveredCell.value.getBoundingClientRect();

    const top = cellRect.top - containerRect.top;
    let left = cellRect.right - containerRect.left - BORDER_WIDTH;

    if (cellRect.right + PREVIEW_BASE_WIDTH > window.innerWidth) {
        left = cellRect.left - containerRect.left - PREVIEW_BASE_WIDTH + BORDER_WIDTH;
    }

    return {
        transform: `translate(${left}px, ${top}px)`,
        width: `${PREVIEW_BASE_WIDTH}px`,
        height: `${previewHeight}px`,
    };
});


// --- НОВАЯ ЛОГИКА ДЛЯ ПРОКРУТКИ ---

// Map для хранения ссылок на DOM-элементы первых ячеек для каждой буквы
const firstCellRefs = new Map();

/**
 * Эта функция вызывается для каждой ячейки при отрисовке компонента.
 * Она сохраняет в `firstCellRefs` ссылку только на первую встретившуюся ячейку для каждой буквы.
 * @param {object} service - Объект услуги.
 * @param {Element} el - DOM-элемент ячейки.
 */
const setCellRef = (service, el) => {
  if (service && el && service.name) {
    const firstLetter = service.name.charAt(0).toUpperCase();
    if (!firstCellRefs.has(firstLetter)) {
      firstCellRefs.set(firstLetter, el);
    }
  }
};

// Перед каждым обновлением компонента очищаем карту ссылок,
// чтобы она всегда была актуальной.
onBeforeUpdate(() => {
  firstCellRefs.clear();
});

/**
 * Функция плавной прокрутки к нужной ячейке.
 * @param {string} letter - Буква, к которой нужно прокрутить.
 */
const scrollToLetter = (letter) => {
  const targetElement = firstCellRefs.get(letter);
  if (targetElement) {
    // Высота шапки в rem (из App.vue) + небольшой дополнительный отступ.
    const headerHeightRem = 6; 
    const extraOffsetPx = 20; // 20px дополнительного отступа сверху

    // Переводим rem в пиксели
    const rootFontSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
    const headerOffset = (headerHeightRem * rootFontSize) + extraOffsetPx;

    // Вычисляем позицию элемента относительно верха страницы
    const elementPosition = targetElement.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.scrollY - headerOffset;

    // Выполняем плавную прокрутку
    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  }
};
</script>

<template>
  <div class="relative" @mouseleave="handleMouseLeaveComponent">

    <div
      class="alphabet-bar flex justify-center items-center flex-wrap gap-1 mb-4"
      @mouseleave="hoveredLetter = null"
    >
      <span
        v-for="letter in alphabet"
        :key="letter"
        class="alphabet-letter-wrapper"
        @mouseenter="handleLetterEnter(letter)"
        @click="scrollToLetter(letter)"
      >
        <span class="alphabet-letter">
          {{ letter }}
        </span>
      </span>
    </div>

    <div ref="gridContainerRef" class="services-grid-container">
        <div
            v-for="service in sortedServices"
            :key="service.id"
            class="service-cell"
            :class="{
              'is-highlighted': hoveredLetter && service.name && service.name.toUpperCase().startsWith(hoveredLetter)
            }"
            @mouseenter="handleMouseEnter(service, $event)"
            @mouseleave="resetPreview"
            :ref="el => setCellRef(service, el)"
        >
            <router-link
              v-if="!service.isPlaceholder"
              :to="{ path: '/gallery', hash: '#' + service.id }"
              class="block w-full h-full p-3 hover:bg-panda-orange group"
            >
              <span class="font-semibold text-header-panda text-panda-black group-hover:text-white">
                {{ service.name }}
              </span>
            </router-link>
        </div>
    </div>

    <transition
      enter-active-class="transition-opacity duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="previewImageUrl && previewImageDimensions.width"
        class="absolute top-0 left-0 shadow-2xl pointer-events-none overflow-hidden z-10"
        :style="previewStyle"
      >
        <img
          :src="previewImageUrl"
          :alt="hoveredService ? hoveredService.name : ''"
          class="w-full h-full object-cover"
        />
      </div>
    </transition>
  </div>
</template>

<style scoped>
.services-grid-container {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  border-left: 0.0625rem solid #E3E3E3;
  border-top: 0.0625rem solid #E3E3E3;
}

.service-cell {
  border-right: 0.0625rem solid #E3E3E3;
  border-bottom: 0.0625rem solid #E3E3E3;
  transition: background-color 0.2s, border-color 0.2s;
  height: 3rem; /* 48px */
  display: flex;
  align-items: center;
}

.service-cell .group:hover {
  background-color: #F15F31;
}

.service-cell.is-highlighted {
  background-color: #F15F31;
  border-color: #F15F31;
}
.service-cell.is-highlighted span {
  color: white;
}

@media (max-width: 75rem) {
  .services-grid-container {
    grid-template-columns: repeat(4, 1fr);
  }
}

@media (max-width: 48rem) {
  .services-grid-container {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 33.75rem) {
  .services-grid-container {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 26.25rem) {

  .service-cell {
      height: auto;
  }
}


.alphabet-bar {
  min-height: 3.75rem;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  justify-content: center;
}
.alphabet-letter-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.25rem 0.75rem;
  cursor: pointer;
}
.alphabet-letter {
  font-family: 'Gilroy-SemiBold', sans-serif;
  font-size: 0.875rem;
  color: #8F8F8F;
  transition: transform 0.2s ease-out, color 0.2s ease-out;
  display: block;
  z-index: 1;
}
.alphabet-letter-wrapper:hover .alphabet-letter {
  color: #F15F31;
  transform: scale(2.2);
  z-index: 2;
}
</style>