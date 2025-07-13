<script setup>
  import { computed, ref } from 'vue';
  import { useServicesStore } from '@/stores/services';
  import { useServiceImages } from '@/composables/useServiceImages';
  import SectionHeader from '@/components/ui/SectionHeader.vue';
  import BaseButton from '@/components/ui/BaseButton.vue';
  import ImageGrid from '@/components/ui/ImageGrid.vue'; // <-- ИМПОРТ
  
  const props = defineProps({
    slug: {
      type: String,
      required: true,
    },
  });
  
  const store = useServicesStore();
  const service = computed(() => store.findById(props.slug));
  const { imagePaths } = useServiceImages(props.slug);

  // Преобразуем массив строк в массив объектов для ImageGrid
  const imagesForGrid = computed(() => {
      return imagePaths.value.map(path => ({ url: path }));
  });
  
  // --- Логика для попапа просмотра изображения ---
  const isPopupOpen = ref(false);
  const popupImageUrl = ref('');
  
  const openPopup = (image) => {
    popupImageUrl.value = image.url; // <-- Получаем URL из объекта
    isPopupOpen.value = true;
  };
  
  const closePopup = () => {
    isPopupOpen.value = false;
  };
</script>

<template>
    <main class="py-10 md:py-25">
      <div class="max-w-6xl mx-auto">
        
        <section v-if="service">
          <SectionHeader class="gap-container">
            {{ service.title }}
          </SectionHeader>
  
          <p class="text-h5-panda text-dark-gray leading-relaxed text-center max-w-2xl mx-auto mb-10 md:mb-15">
            {{ service.description }}
          </p>
          
          <div class="service-gallery">
            <div v-if="imagesForGrid.length > 0">
              <ImageGrid :images="imagesForGrid" @image-click="openPopup" />
            </div>
            <div v-else class="gallery-placeholder">
              <p>Для этой услуги пока нет примеров работ. Но скоро они здесь появятся!</p>
            </div>
          </div>
        </section>
  
        <div v-else class="service-not-found">
          <SectionHeader>Ошибка</SectionHeader>
          <h1 class="text-h3-panda font-semibold text-panda-black mt-10">Услуга не найдена</h1>
          <p class="text-body-panda text-dark-gray mt-2 mb-8">К сожалению, мы не смогли найти информацию по вашему запросу.</p>
          <BaseButton to="/">Вернуться на главную</BaseButton>
        </div>
      </div>
    </main>
  
    <Teleport to="body">
      <Transition name="popup-fade">
        <div 
          v-if="isPopupOpen" 
          class="popup-overlay" 
          @click.self="closePopup" 
          @keydown.esc="closePopup"
          tabindex="-1"
        >
          <div class="popup-container">
            <img :src="popupImageUrl" alt="Полная версия изображения" class="popup-image">
            <button @click="closePopup" class="popup-close-button" aria-label="Закрыть изображение">
              &times;
            </button>
          </div>
        </div>
      </Transition>
    </Teleport>
</template>

<style scoped>
/* Стили из ServiceDetailPage.vue остаются, они отвечают за попап просмотра */
.service-not-found { text-align: center; padding: 4rem 2rem; }
.gallery-placeholder { text-align: center; padding: 4rem; background-color: #f7f7f7; color: #8F8F8F; font-size: 1.1rem; }
.popup-overlay { position: fixed; inset: 0; width: 100vw; height: 100vh; background-color: rgba(19, 28, 38, 0.8); backdrop-filter: blur(5px); display: flex; justify-content: center; align-items: center; z-index: 2000; padding: 2rem; box-sizing: border-box; outline: none; }
.popup-container { position: relative; display: flex; justify-content: center; align-items: center; max-width: 80vw; max-height: 80vh; background: transparent; padding: 0; }
.popup-image { display: block; max-width: 100%; max-height: 100%; object-fit: contain; box-shadow: none; }
.popup-close-button { position: absolute; top: -1.25rem; right: -1.25rem; width: 2.5rem; height: 2.5rem; background-color: white; border: none; border-radius: 50%; color: #131C26; font-size: 1.5rem; line-height: 2.5rem; text-align: center; cursor: pointer; transition: transform 0.2s ease, background-color 0.2s ease; box-shadow: 0 4px 15px rgba(0,0,0,0.2); z-index: 10; }
.popup-close-button:hover { transform: scale(1.1); background-color: #f0f0f0; }
.popup-fade-enter-active, .popup-fade-leave-active { transition: opacity 0.3s ease; }
.popup-fade-enter-from, .popup-fade-leave-to { opacity: 0; }
</style>