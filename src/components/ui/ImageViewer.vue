<script setup>
/* eslint-disable vue/require-toggle-inside-transition */
import { ref, computed, onMounted, onUnmounted } from 'vue';
import LikeButton from '@/components/ui/LikeButton.vue';

const props = defineProps({
  images: {
    type: Array,
    required: true,
  },
  startIndex: {
    type: Number,
    default: 0,
  },
});

const emit = defineEmits(['close']);

const currentIndex = ref(props.startIndex);

const prevImageObject = computed(() =>
  currentIndex.value > 0 ? props.images[currentIndex.value - 1] : null
);
const currentImage = computed(() => props.images[currentIndex.value]);
const nextImageObject = computed(() =>
  currentIndex.value < totalImages.value - 1
    ? props.images[currentIndex.value + 1]
    : null
);

const totalImages = computed(() => props.images.length);
const counterText = computed(
  () => `${currentIndex.value + 1} / ${totalImages.value}`
);

const goToNextImage = () => {
  if (currentIndex.value < totalImages.value - 1) {
    currentIndex.value++;
  }
};

const goToPrevImage = () => {
  if (currentIndex.value > 0) {
    currentIndex.value--;
  }
};

const close = () => {
  emit('close');
};

const handleKeydown = (e) => {
  if (e.key === 'ArrowRight') goToNextImage();
  if (e.key === 'ArrowLeft') goToPrevImage();
  if (e.key === 'Escape') close();
};

onMounted(() => {
  window.addEventListener('keydown', handleKeydown);
  document.body.style.overflow = 'hidden';
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown);
  document.body.style.overflow = '';
});
</script>

<template>
  <Teleport to="body">
    <transition name="viewer-fade">
      <div
        class="image-viewer-overlay"
        @click="close"
      >
        <div
          class="top-controls"
          @click.stop
        >
          <LikeButton
            :image-url="currentImage.url || currentImage"
            class="viewer-like-button"
          />
          <span class="counter top-counter">{{ counterText }}</span>
          <button
            class="close-button"
            aria-label="Закрыть"
            @click="close"
          >
            &times;
          </button>
        </div>

        <div
          class="viewer-wrapper"
          @click.stop
        >
          <div class="viewer-content">
            <div class="nav-container left">
              <transition name="side-image-fade">
                <img
                  v-if="prevImageObject"
                  :src="prevImageObject.url || prevImageObject"
                  alt="Предыдущее изображение"
                  class="side-image"
                  @click.stop="goToPrevImage"
                >
              </transition>
            </div>

            <div class="image-container">
              <transition
                v-if="currentImage"
                name="image-swap"
                mode="out-in"
              >
                <!-- eslint-disable-next-line vue/require-toggle-inside-transition -->
                <img
                  v-if="currentImage"
                  :key="currentImage.url || currentImage"
                  :src="currentImage.url || currentImage"
                  :alt="currentImage.alt || 'Просмотр изображения'"
                  class="main-image"
                >
              </transition>
            </div>

            <div class="nav-container right">
              <transition name="side-image-fade">
                <img
                  v-if="nextImageObject"
                  :src="nextImageObject.url || nextImageObject"
                  alt="Следующее изображение"
                  class="side-image"
                  @click.stop="goToNextImage"
                >
              </transition>
            </div>
          </div>

          <div class="controls-footer">
            <button
              :disabled="currentIndex === 0"
              class="footer-nav-button"
              @click.stop="goToPrevImage"
            >
              назад
            </button>
            <span class="category-title">{{ currentImage.categoryTitle }}</span>
            <button
              :disabled="currentIndex === totalImages - 1"
              class="footer-nav-button"
              @click.stop="goToNextImage"
            >
              вперёд
            </button>
          </div>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<style scoped>
.image-viewer-overlay {
  position: fixed;
  inset: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(19, 28, 38, 0.8);
  backdrop-filter: blur(0.5rem);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
  padding: 1rem;
  box-sizing: border-box;
}

.viewer-wrapper {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  position: relative;
}

/* --- [НОВЫЕ СТИЛИ] для верхней панели --- */
.top-controls {
  position: absolute;
  top: 1rem;
  right: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1.5rem;
  z-index: 10;
}

.viewer-like-button {
  position: static; /* Убираем absolute, т.к. теперь он во flex-контейнере */
}

.close-button {
  position: static; /* Убираем absolute, т.к. теперь он во flex-контейнере */
  color: #8f8f8f;
  font-size: 3rem;
  font-weight: 300;
  line-height: 1;
  cursor: pointer;
  transition:
    color 0.2s ease,
    transform 0.2s ease;
}
.close-button:hover {
  color: white;
  transform: scale(1.1);
}
.top-counter {
  font-family: 'Gilroy-SemiBold', sans-serif;
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.7);
  background-color: rgba(19, 28, 38, 0.5);
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  user-select: none; /* Чтобы текст не выделялся */
}
/* --- --- */

.viewer-content {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: calc(100% - 6.25rem);
  max-width: 95vw;
  max-height: 85vh;
  position: relative;
}

.image-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
}
@media (min-width: 48rem) {
  .image-container {
    max-width: calc(100% - 26rem);
  }
}

.main-image {
  display: block;
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  border-radius: 1rem;
  box-shadow: 0 0.625rem 2.5rem rgba(0, 0, 0, 0.3);
}

.nav-container {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  align-items: center;
  justify-content: center;
  width: 10rem;
  height: 10rem;
  z-index: 5;
  display: none;
}
@media (min-width: 48rem) {
  .nav-container {
    display: flex;
  }
}
.nav-container.left {
  left: 2rem;
}
.nav-container.right {
  right: 2rem;
}

.side-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 1rem;
  filter: grayscale(1) opacity(0.5);
  cursor: pointer;
  transition: all 0.3s ease-out;
}
.side-image:hover {
  filter: grayscale(0) opacity(1);
  transform: scale(1.04);
}

.controls-footer {
  position: absolute;
  bottom: 0rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 1rem;
  background-color: rgba(19, 28, 38, 0.5);
  padding: 0.5rem 0.5rem;
  border-radius: 9999px;
  backdrop-filter: blur(0.25rem);
}

/* --- [НОВЫЕ СТИЛИ] для заголовка категории --- */
.category-title {
  color: white;
  font-family: 'Gilroy-SemiBold', sans-serif;
  font-size: 1rem;
  text-align: center;
  padding: 0 1rem;
  white-space: nowrap;
}

.footer-nav-button {
  padding: 0.25rem 1.25rem;
  border-radius: 9999px;
  background-color: #ffffff12;
  color: #8f8f8f;
  font-family: 'Gilroy-SemiBold', sans-serif;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
}
.footer-nav-button:hover:not(:disabled) {
  background-color: #f7f7f7;
  color: #131c26;
  border-color: #f7f7f7;
}
.footer-nav-button:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

/* Анимации (без изменений) */
.viewer-fade-enter-active,
.viewer-fade-leave-active {
  transition: opacity 0.3s ease;
}
.viewer-fade-enter-from,
.viewer-fade-leave-to {
  opacity: 0;
}

.image-swap-enter-active,
.image-swap-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}
.image-swap-enter-from {
  opacity: 0;
  transform: scale(0.98);
}
.image-swap-leave-to {
  opacity: 0;
  transform: scale(1.02);
}

.side-image-fade-enter-active,
.side-image-fade-leave-active {
  transition: opacity 0.3s ease;
}
.side-image-fade-enter-from,
.side-image-fade-leave-to {
  opacity: 0;
}
</style>
