src/components/ui/ServicesGrid.vue -->

<script setup>
import { ref, computed } from 'vue';
import { useServicesStore } from '@/stores/services.js';
import { storeToRefs } from 'pinia';
import { useServiceImages } from '@/composables/useServiceImages.js';

const servicesStore = useServicesStore();
const { services } = storeToRefs(servicesStore);

const hoveredService = ref(null);
const hoveredCell = ref(null);
const hoveredLetter = ref(null);
const tableRef = ref(null);

const previewImageUrl = ref(null);
const previewImageDimensions = ref({ width: 0, height: 0 });
const isPreviewLoading = ref(false);

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

const handleMouseEnter = (service, event) => {
    hoveredLetter.value = null; 
    if (service && !service.isPlaceholder && !isPreviewLoading.value) {
        hoveredService.value = service;
        hoveredCell.value = event.target.closest('td');

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
    if (!hoveredCell.value || !tableRef.value || !previewImageDimensions.value.width) return {};

    const PREVIEW_BASE_WIDTH = 256;
    const BORDER_WIDTH = 1;
    const previewHeight = PREVIEW_BASE_WIDTH * previewImageDimensions.value.height / previewImageDimensions.value.width;
    
    const container = tableRef.value.parentElement;
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
</script>

<template>
  <div class="relative" @mouseleave="handleMouseLeaveComponent">

    <div
      class="alphabet-bar flex justify-center items-center gap-1 mb-4"
      @mouseleave="hoveredLetter = null"
    >
      <span
        v-for="letter in alphabet"
        :key="letter"
        class="alphabet-letter-wrapper"
        @mouseenter="handleLetterEnter(letter)"
      >
        <span class="alphabet-letter">
          {{ letter }}
        </span>
      </span>
    </div>

    <table ref="tableRef" class="w-full border-collapse">
      <tbody>
        <tr v-for="(row, rowIndex) in servicesGrid" :key="rowIndex">
          <td
            v-for="(service, colIndex) in row"
            :key="colIndex"
            class="border p-0 h-12 text-left"
            :class="{
              'is-highlighted': hoveredLetter && service.name && service.name.toUpperCase().startsWith(hoveredLetter)
            }"
            @mouseenter="handleMouseEnter(service, $event)"
            @mouseleave="resetPreview"
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
            </td>
        </tr>
      </tbody>
    </table>

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
td {
  border: 1px solid #E3E3E3;
  transition: background-color 0.2s, border-color 0.2s;
}

td .group:hover {
  background-color: #F15F31;
}

td.is-highlighted {
  background-color: #F15F31;
  border-color: #F15F31;
}
td.is-highlighted span {
  color: white;
}

.alphabet-bar {
  height: 60px;
}
.alphabet-letter-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px 12px;
  height: 100%;
  cursor: pointer;
}
.alphabet-letter {
  font-family: 'Gilroy-SemiBold', sans-serif;
  font-size: 14px;
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