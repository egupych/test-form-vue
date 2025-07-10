<script setup>
import { ref, computed } from 'vue';
import SectionHeader from '@/components/ui/SectionHeader.vue';

// --- ИЗМЕНЕНИЕ: Исправлен синтаксис с () на {} ---
const logoModules = import.meta.glob('@/assets/images/pages/HomePage/TrustedBy/*.{svg,png,jpg,jpeg}', { eager: true });

// Этот код обрабатывает найденные файлы и создает массив для отображения.
const allLogos = Object.entries(logoModules).map(([path, module], index) => {
  // Извлекаем имя файла из пути (например, 'bi-group.svg')
  const fileName = path.split('/').pop();
  // Создаем название из имени файла (например, 'BI Group')
  const name = fileName.split('.')[0]
    .replace(/[-_]/g, ' ') // Заменяем дефисы и подчеркивания на пробелы
    .replace(/\b\w/g, l => l.toUpperCase()); // Делаем первые буквы заглавными

  return {
    id: index + 1,
    name: name,
    src: module.default, // Прямой путь к изображению
  };
});


// Логика слайдера остается без изменений
const logosPerPage = 15;
const totalPages = computed(() => Math.ceil(allLogos.length / logosPerPage));
const currentPage = ref(1);

const paginatedLogos = computed(() => {
  const pages = [];
  if (allLogos.length === 0) return []; // Защита на случай, если логотипов еще нет
  for (let i = 0; i < allLogos.length; i += logosPerPage) {
    pages.push(allLogos.slice(i, i + logosPerPage));
  }
  return pages;
});

const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--;
};
const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++;
};
const sliderStyle = computed(() => ({
  transform: `translateX(-${(currentPage.value - 1) * 100}%)`,
}));
</script>

<template>
  <div>
    <div class="max-w-6xl mx-auto">
      <SectionHeader class="gap-container">
        НАМ ДОВЕРЯЮТ
      </SectionHeader>

      <div v-if="allLogos.length > 0" class="relative overflow-hidden">
        <div class="flex transition-transform duration-500 ease-in-out" :style="sliderStyle">
          <div
            v-for="(page, pageIndex) in paginatedLogos"
            :key="pageIndex"
            class="w-full flex-shrink-0"
          >
            <div class="grid grid-cols-3 md:grid-cols-5 gap-x-8 gap-y-12 items-center justify-items-center">
              <div v-for="logo in page" :key="logo.id" class="h-12 flex items-center justify-center logo-container">
                <img 
                  :src="logo.src" 
                  :alt="logo.name"
                  class="max-h-full w-auto object-contain filter grayscale opacity-60 hover:opacity-100 hover:grayscale-0 transition-all duration-300"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
       <div v-else class="text-center text-dark-gray py-10">
        Логотипы клиентов скоро появятся здесь.
      </div>
      
      <div v-if="totalPages > 1" class="flex justify-center items-center mt-12 gap-4">
        <button 
          @click="prevPage" 
          :disabled="currentPage === 1"
          class="px-5 py-1.5 bg-transparent text-dark-gray text-sm font-semibold border border-gray rounded-full hover:bg-gray disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          назад
        </button>
        <span class="text-sm text-dark-gray font-mono">{{ currentPage }} из {{ totalPages }}</span>
        <button 
          @click="nextPage"
          :disabled="currentPage === totalPages"
          class="px-5 py-1.5 bg-transparent text-dark-gray text-sm font-semibold border border-gray rounded-full hover:bg-gray disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          вперёд
        </button>
      </div>

    </div>
  </div>
</template>

<style scoped>
.logo-container {
  width: 160px;
}
</style>