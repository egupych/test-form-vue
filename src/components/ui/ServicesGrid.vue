<script setup>
import { ref, computed } from 'vue';
import { useServicesStore } from '@/stores/services.js';
import { storeToRefs } from 'pinia';
// 👇 1. Импортируем наш новый "помощник"
import { useServiceImages } from '@/composables/useServiceImages.js';

const servicesStore = useServicesStore();
const { services } = storeToRefs(servicesStore);

const hoveredService = ref(null);
const hoveredCell = ref(null);
const hoveredLetter = ref(null);
const tableRef = ref(null);
// 👇 2. Создаем отдельную переменную для URL превью
const previewImageUrl = ref(null);

const alphabet = computed(() => {
  const firstLetters = services.value.map(s => s.name.charAt(0).toUpperCase());
  return [...new Set(firstLetters)].sort((a, b) => a.localeCompare(b, 'ru'));
});

const servicesGrid = computed(() => {
    const sortedServices = [...services.value].sort((a, b) => a.name.localeCompare(b.name, 'ru'));
    const numCols = 6;
    const numRows = Math.ceil(sortedServices.length / numCols);
    const grid = Array.from({ length: numRows }, () => Array(numCols).fill({ name: '', isPlaceholder: true }));

    sortedServices.forEach((service, index) => {
        const col = Math.floor(index / numRows);
        const row = index % numRows;
        if (grid[row]) {
            grid[row][col] = service;
        }
    });
    return grid;
});

// 👇 3. Обновляем функцию наведения мыши
const handleMouseEnter = (service, event) => {
    hoveredLetter.value = null;
    if (service && !service.isPlaceholder) {
        hoveredService.value = service;
        hoveredCell.value = event.target.closest('td');

        // Вызываем нашего "помощника" для услуги, на которую навели курсор
        const { lastImage } = useServiceImages(service.id);
        // Обновляем URL для превью. lastImage - это computed-свойство, поэтому нужно .value
        previewImageUrl.value = lastImage.value;
    }
};

const handleMouseLeave = () => {
    hoveredService.value = null;
    hoveredCell.value = null;
    hoveredLetter.value = null;
    // Сбрасываем URL превью
    previewImageUrl.value = null;
};

const handleLetterEnter = (letter) => {
    hoveredLetter.value = letter;
    hoveredService.value = null;
    hoveredCell.value = null;
    previewImageUrl.value = null;
}
</script>

<template>
  <div class="relative" @mouseleave="handleMouseLeave">

    <div
      class="alphabet-bar flex justify-center items-end gap-1 mb-4"
      @mouseleave="hoveredLetter = null"
    >
      <span
        v-for="letter in alphabet"
        :key="letter"
        class="alphabet-letter"
        @mouseenter="handleLetterEnter(letter)"
      >
        {{ letter }}
      </span>
    </div>

    <table ref="tableRef" class="w-full border-collapse overflow-hidden">
      <tbody>
        <tr v-for="(row, rowIndex) in servicesGrid" :key="rowIndex">
          <td
            v-for="(service, colIndex) in row"
            :key="colIndex"
            class="border p-0 h-12 text-left transition-all duration-300 ease-in-out"
            :class="{
              'bg-panda-black': hoveredService && hoveredService.name === service.name,
              'border-gray': rowIndex < servicesGrid.length -1 || colIndex < row.length -1,
              'is-highlighted': hoveredLetter && service.name && service.name.toUpperCase().startsWith(hoveredLetter)
            }"
            @mouseenter="handleMouseEnter(service, $event)"
          >
            <router-link
              v-if="!service.isPlaceholder"
              :to="{ name: 'ServiceDetail', params: { slug: service.id } }"
              class="block w-full h-full p-3 hover:bg-panda-black group"
            >
              <span class="font-semibold text-header-panda text-panda-black group-hover:text-white transition-colors duration-200">
                {{ service.name }}
              </span>
            </router-link>
          </td>
        </tr>
      </tbody>
    </table>

    <transition
      enter-active-class="transition-opacity duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-200 ease-in"
      leave-from-class="opacity-0"
      leave-to-class="opacity-0"
    >
      <div
        v-if="hoveredService && hoveredCell && previewImageUrl && tableRef"
        class="absolute w-64 h-48 shadow-2xl pointer-events-none overflow-hidden z-10"
        :style="{
          top: (tableRef.offsetTop + hoveredCell.offsetTop) + 'px',
          left: (hoveredCell.offsetLeft + hoveredCell.offsetWidth) + 'px'
        }"
      >
        <img
          :src="previewImageUrl"
          :alt="hoveredService.name"
          class="w-full h-full object-cover"
        />
      </div>
    </transition>
  </div>
</template>

<style scoped>
/* Стили остаются без изменений */
td {
  border-color: #E3E3E3;
}

.alphabet-bar {
  height: 60px;
}

.alphabet-letter {
  font-family: 'Gilroy-SemiBold', sans-serif;
  font-size: 14px;
  color: #8F8F8F;
  padding: 4px 12px;
  cursor: pointer;
  transition: font-size 0.2s ease-out, color 0.2s ease-out;
}

.alphabet-letter:hover {
  font-size: 42px;
  color: #F15F31;
}

.is-highlighted {
  background-color: #89C869;
}

.is-highlighted .group span {
  color: white !important;
}

.is-highlighted:hover {
  background-color: #131C26 !important;
}
</style>