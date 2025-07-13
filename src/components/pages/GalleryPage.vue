<script setup>
import { ref, computed, onMounted, nextTick } from 'vue';
import { useRoute } from 'vue-router';
import SectionHeader from '@/components/ui/SectionHeader.vue';
import LazyImageGrid from '@/components/ui/LazyImageGrid.vue';
import GallerySidebar from '@/components/ui/GallerySidebar.vue';
import { useGalleryStore } from '@/stores/gallery.js';
import { useServicesStore } from '@/stores/services.js';
import ImageViewer from '@/components/ui/ImageViewer.vue'; // 1. Импортируем новый компонент

const galleryStore = useGalleryStore();
const servicesStore = useServicesStore();
const route = useRoute();

const activeCategory = ref(null);
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
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        activeCategory.value = entry.target.id;
      }
    });
  }, { rootMargin: '-50% 0px -50% 0px', threshold: 0 });

  nextTick(() => {
    for (const id in sectionRefs.value) {
      if (sectionRefs.value[id]) {
        observer.observe(sectionRefs.value[id]);
      }
    }
  });

  const hash = route.hash.replace('#', '');
  if (hash) {
    setTimeout(() => {
        handleNavigation(hash)
    }, 500);
  }
});

// 2. Логика для управления новым компонентом просмотра
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
    <GallerySidebar 
      v-if="categoriesWithItems.length > 0"
      :categories="categoriesWithItems"
      :active-category="activeCategory"
      @navigate="handleNavigation"
    />
    
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
  scroll-margin-top: 100px; 
}
</style>