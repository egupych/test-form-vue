<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useGalleryStore } from '@/stores/gallery.js';
import { useServicesStore } from '@/stores/services.js';
import SectionHeader from '@/components/ui/SectionHeader.vue';
import ImageGrid from '@/components/ui/ImageGrid.vue';
import ImageViewer from '@/components/ui/ImageViewer.vue';

// --- Инициализация хранилищ и роутера ---
const galleryStore = useGalleryStore();
const servicesStore = useServicesStore();
const route = useRoute();

// --- Подготовка данных ---
// Этот код остается без изменений, он нужен для отображения категорий на странице
const categoriesWithItems = computed(() => {
  return servicesStore.services.filter(service =>
    galleryStore.items[service.id] && galleryStore.items[service.id].length > 0
  );
});

// --- Логика для просмотра изображений ---
const isViewerOpen = ref(false);
const viewerImages = ref([]);
const viewerStartIndex = ref(0);

// Открывает просмотрщик, получая данные о кликнутом изображении
const openViewer = (payload) => {
  const clickedImage = payload.image;

  // [ИСПРАВЛЕНО] Создаем единый массив из всех работ всех категорий
  const allItems = Object.values(galleryStore.items).flat();

  if (allItems && allItems.length > 0) {
    // Передаем в просмотрщик этот общий массив
    viewerImages.value = allItems;
    
    // Находим индекс кликнутого изображения в этом общем массиве
    viewerStartIndex.value = allItems.findIndex(img => img.id === clickedImage.id);
    
    // Открываем просмотрщик
    isViewerOpen.value = true;
  }
};

// Закрывает просмотрщик
const closeViewer = () => {
  isViewerOpen.value = false;
};

// --- Прокрутка к якорю при загрузке страницы ---
// Этот код остается без изменений
onMounted(() => {
  const hash = route.hash.replace('#', '');
  if (hash) {
    setTimeout(() => {
      const element = document.getElementById(hash);
      if (element) {
        const headerOffset = 120;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.scrollY - headerOffset;
        window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
      }
    }, 500);
  }
});
</script>

<template>
  <div>
    <main class="py-10 md:py-25">
      <div class="max-w-6xl mx-auto px-4">
        <SectionHeader class="text-center justify-center text-h2-panda mb-6">Наше портфолио</SectionHeader>
        <p class="text-h5-panda text-dark-gray text-center max-w-3xl mx-auto mb-16">
          Здесь собраны примеры наших работ, чтобы вы могли оценить качество и разнообразие наших возможностей. Каждая категория — это отдельная история успеха.
        </p>

        <div v-if="categoriesWithItems.length > 0" class="space-y-16">
          <section
            v-for="category in categoriesWithItems"
            :key="`section-${category.id}`"
            :id="category.id"
            class="scroll-mt-28"
          >
            <SectionHeader class="mb-10">
              {{ category.title }}
            </SectionHeader>

            <ImageGrid
              :images="galleryStore.getItemsByCategoryId(category.id)"
              @image-click="openViewer"
            />
          </section>
        </div>

        <div v-else class="text-center py-10 text-dark-gray text-xl">
          <p v-if="galleryStore.loading">Загружаем портфолио...</p>
          <p v-else>Портфолио наполняется. Скоро здесь появятся примеры наших работ!</p>
        </div>
      </div>
    </main>

    <ImageViewer
      v-if="isViewerOpen"
      :images="viewerImages"
      :start-index="viewerStartIndex"
      @close="closeViewer"
    />
  </div>
</template>

<style scoped>
.scroll-mt-28 {
  scroll-margin-top: 7rem;
}
</style>