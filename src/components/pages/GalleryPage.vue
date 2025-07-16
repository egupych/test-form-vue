<script setup>
import { ref, computed, onMounted, nextTick } from 'vue';
import { useRoute } from 'vue-router';
import SectionHeader from '@/components/ui/SectionHeader.vue';
import LazyImageGrid from '@/components/ui/LazyImageGrid.vue';
// import GallerySidebar from '@/components/ui/GallerySidebar.vue'; // --- УДАЛЕНО
import { useGalleryStore } from '@/stores/gallery.js';
import { useServicesStore } from '@/stores/services.js';
import ImageViewer from '@/components/ui/ImageViewer.vue';

const galleryStore = useGalleryStore();
const servicesStore = useServicesStore();
const route = useRoute();

// const activeCategory = ref(null); // --- УДАЛЕНО
const sectionRefs = ref({});

const categoriesWithItems = computed(() => {
  return servicesStore.services.filter(service => 
    galleryStore.items[service.id] && galleryStore.items[service.id].length > 0
  );
});

const handleNavigation = (categoryId) => {
  const element = document.getElementById(categoryId);
  if (element) {
    const headerOffset = 100;
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.scrollY - headerOffset;
    window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
  }
};

onMounted(() => {
  // --- УДАЛЕНО: Весь IntersectionObserver для боковой панели ---

  // Оставляем логику для прокрутки по хешу в URL
  const hash = route.hash.replace('#', '');
  if (hash) {
    setTimeout(() => {
        handleNavigation(hash)
    }, 500);
  }
});

const isViewerOpen = ref(false);
const viewerImages = ref([]);
const viewerStartIndex = ref(0);

const openViewer = ({ index, gallery }) => {
  viewerImages.value = gallery;
  viewerStartIndex.value = index;
  isViewerOpen.value = true;
};
const closeViewer = () => { isViewerOpen.value = false; };
</script>

<template>
  <div>
    <main class="py-10 md:py-25">
      <div class="max-w-6xl mx-auto px-4">
        <div v-if="categoriesWithItems.length > 0" class="space-y-16">
          <section
            v-for="category in categoriesWithItems"
            :key="`section-${category.id}`"
            :id="category.id"
            :ref="el => { if (el) sectionRefs[category.id] = el }"
            class="scroll-mt-24"
          >
            <SectionHeader class="mb-10">
              {{ category.title }}
            </SectionHeader>

            <LazyImageGrid
              :images="galleryStore.getItemsByCategoryId(category.id)"
              @image-click="openViewer({ index: $event.index, gallery: galleryStore.getItemsByCategoryId(category.id) })"
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
/* Удаляем старые стили для попапа, они больше не нужны */
.scroll-mt-24 { 
  scroll-margin-top: 6.25rem; /* 100px -> 6.25rem */
}
</style>