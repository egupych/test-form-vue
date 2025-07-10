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
            <div v-if="imagePaths.length > 0" class="gallery-grid">
              <div 
                v-for="(image, index) in imagePaths" 
                :key="index" 
                class="gallery-item"
                @click="openPopup(image)"
                tabindex="0"
                @keydown.enter="openPopup(image)"
              >
                <div class="gallery-item-overlay"></div>
                <img :src="image" :alt="`${service.name} - пример ${index + 1}`" loading="lazy">
              </div>
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
          ref="popupOverlayRef"
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
  
  <script setup>
  import { computed, ref, watch, onUnmounted, nextTick } from 'vue';
  import { useServicesStore } from '@/stores/services';
  import { useServiceImages } from '@/composables/useServiceImages';
  import SectionHeader from '@/components/ui/SectionHeader.vue';
  import BaseButton from '@/components/ui/BaseButton.vue';
  
  const props = defineProps({
    slug: {
      type: String,
      required: true,
    },
  });
  
  const store = useServicesStore();
  const service = computed(() => store.findById(props.slug));
  const { imagePaths } = useServiceImages(props.slug);
  
  // --- Логика для попапа ---
  const isPopupOpen = ref(false);
  const popupImageUrl = ref('');
  const popupOverlayRef = ref(null);
  
  const openPopup = (imageUrl) => {
    popupImageUrl.value = imageUrl;
    isPopupOpen.value = true;
  };
  
  const closePopup = () => {
    isPopupOpen.value = false;
  };
  
  // Наблюдаем за состоянием попапа, чтобы сфокусироваться на нем
  watch(isPopupOpen, async (isOpen) => {
    if (isOpen) {
      await nextTick();
      popupOverlayRef.value?.focus();
    }
    // Логика блокировки скролла body удалена, чтобы скроллбар оставался
  });
  </script>
  
  <style scoped>
  .service-not-found {
    text-align: center;
    padding: 4rem 2rem;
  }
  
  /* --- Стили галереи --- */
  .gallery-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1rem;
  }
  
  .gallery-item {
    aspect-ratio: 4 / 3;
    overflow: hidden;
    background-color: #f0f0f0;
    cursor: pointer;
    position: relative;
  }
  
  .gallery-item-overlay {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #F15F31; /* Фирменный оранжевый */
    opacity: 0;
    transition: opacity 0.3s ease-in-out;
    z-index: 1;
    /* Эффект смешивания для оранжевого фильтра */
    mix-blend-mode: color;
  }
  
  .gallery-item:hover .gallery-item-overlay {
    opacity: 0.6;
  }
  
  .gallery-item img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    position: relative;
    z-index: 0;
  }
  
  .gallery-placeholder {
    text-align: center;
    padding: 4rem;
    background-color: #f7f7f7;
    color: #8F8F8F;
    font-size: 1.1rem;
  }
  
  /* --- СТИЛИ ДЛЯ ПОПАПА (ФИНАЛЬНЫЙ ВАРИАНТ) --- */
  .popup-overlay {
    position: fixed;
    inset: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(19, 28, 38, 0.8);
    backdrop-filter: blur(5px); /* Размытый фон */
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
    /* Размеры */
    max-width: 80vw;
    max-height: 80vh;
    /* Убираем фон и отступы */
    background: transparent;
    padding: 0;
  }
  
  .popup-image {
    display: block;
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
    /* Убираем тень, т.к. нет рамки */
    box-shadow: none;
  }
  
  .popup-close-button {
    position: absolute;
    top: -1.25rem;
    right: -1.25rem;
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
    z-index: 10;
  }
  
  .popup-close-button:hover {
    transform: scale(1.1);
    background-color: #f0f0f0;
  }
  
  /* Анимация появления/исчезновения */
  .popup-fade-enter-active,
  .popup-fade-leave-active {
    transition: opacity 0.3s ease;
  }
  
  .popup-fade-enter-from,
  .popup-fade-leave-to {
    opacity: 0;
  }
  </style>