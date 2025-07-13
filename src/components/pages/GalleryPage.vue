src/pages/GalleryPage.vue -->

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue';
import { useRoute } from 'vue-router';
import SectionHeader from '@/components/ui/SectionHeader.vue';
import LazyImageGrid from '@/components/ui/LazyImageGrid.vue';
import GallerySidebar from '@/components/ui/GallerySidebar.vue';
import { useGalleryStore } from '@/stores/gallery.js';
import { useServicesStore } from '@/stores/services.js';

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

const isPopupOpen = ref(false);
const popupImageUrl = ref('');
const openPopup = (image) => {
  popupImageUrl.value = image.url;
  isPopupOpen.value = true;
};
const closePopup = () => { isPopupOpen.value = false; };
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
              @image-click="openPopup"
            />
          </section>
        </div>

        <div v-else class="text-center py-10 text-dark-gray text-xl">
          <p v-if="galleryStore.loading">Загружаем портфолио...</p>
          <p v-else>Портфолио наполняется. Скоро здесь появятся примеры наших работ!</p>
        </div>
      </div>
    </main>

    <Teleport to="body">
      <Transition name="popup-fade">
        <div v-if="isPopupOpen" class="popup-overlay" @click.self="closePopup" @keydown.esc="closePopup" tabindex="-1">
          <div class="popup-container">
            <img :src="popupImageUrl" alt="Полная версия изображения" class="popup-image">
            <button @click="closePopup" class="popup-close-button" aria-label="Закрыть изображение">&times;</button>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
.scroll-mt-24 { 
  scroll-margin-top: 100px; 
}
.popup-overlay { 
  position: fixed; 
  inset: 0; 
  width: 100vw; 
  height: 100vh; 
  background-color: rgba(19, 28, 38, 0.8); 
  backdrop-filter: blur(5px); 
  display: flex; 
  justify-content: center; 
  align-items: center; 
  z-index: 2000; 
  padding: 2rem; 
  box-sizing: border-box; 
  outline: none; 
}
.popup-container { 
  position: relative; 
  display: flex; 
  justify-content: center; 
  align-items: center; 
  max-width: 90vw; 
  max-height: 90vh; 
}
.popup-image { 
  display: block; 
  max-width: 100%; 
  max-height: 100%; 
  object-fit: contain; 
  border-radius: 8px; 
}
.popup-close-button { 
  position: absolute; 
  top: -1rem; 
  right: -1rem; 
  width: 2.5rem; 
  height: 2.5rem; 
  background-color: white; 
  border: none; 
  border-radius: 50%; 
  color: #131C26; 
  font-size: 1.5rem; 
  line-height: 2.5rem; 
  text-align: center; 
  cursor: pointer; 
  transition: transform 0.2s ease, background-color 0.2s ease; 
  box-shadow: 0 4px 15px rgba(0,0,0,0.2); 
}
.popup-close-button:hover { 
  transform: scale(1.1); 
  background-color: #f0f0f0; 
}
.popup-fade-enter-active, .popup-fade-leave-active { 
  transition: opacity 0.3s ease; 
}
.popup-fade-enter-from, .popup-fade-leave-to { 
  opacity: 0; 
}
</style>