<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import BaseButton from './BaseButton.vue';

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

// Computed-свойства для удобства
const currentImage = computed(() => props.images[currentIndex.value]);
const totalImages = computed(() => props.images.length);
const counterText = computed(() => `${currentIndex.value + 1} из ${totalImages.value}`);

// Функции навигации
const nextImage = () => {
  if (currentIndex.value < totalImages.value - 1) {
    currentIndex.value++;
  }
};

const prevImage = () => {
  if (currentIndex.value > 0) {
    currentIndex.value--;
  }
};

const close = () => {
  emit('close');
};

// Навигация с помощью клавиатуры
const handleKeydown = (e) => {
  if (e.key === 'ArrowRight') nextImage();
  if (e.key === 'ArrowLeft') prevImage();
  if (e.key === 'Escape') close();
};

onMounted(() => {
  window.addEventListener('keydown', handleKeydown);
  document.body.style.overflow = 'hidden'; // Блокируем прокрутку фона
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown);
  document.body.style.overflow = ''; // Возвращаем прокрутку
});
</script>

<template>
  <Teleport to="body">
    <transition name="viewer-fade">
      <div class="image-viewer-overlay" @click.self="close">
        <button class="close-button" @click="close" aria-label="Закрыть">&times;</button>
        
        <div class="viewer-content">
          <transition name="image-swap" mode="out-in">
            <div :key="currentImage.url || currentImage" class="image-container">
              <img :src="currentImage.url || currentImage" :alt="currentImage.alt || 'Просмотр изображения'" class="main-image">
            </div>
          </transition>

        </div>
        
        <div class="controls-footer">
          <button @click.stop="prevImage" :disabled="currentIndex === 0" class="footer-nav-button">назад</button>
          <span class="counter">{{ counterText }}</span>
          <button @click.stop="nextImage" :disabled="currentIndex === totalImages - 1" class="footer-nav-button">вперёд</button>
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
  background-color: rgba(19, 28, 38, 0.9);
  backdrop-filter: blur(8px);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 2000;
  padding: 1rem;
  box-sizing: border-box;
}

.viewer-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: calc(100% - 100px); /* Оставляем место для футера */
  max-width: 95vw;
  max-height: 85vh;
}

.image-container {
  flex-grow: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
}

.main-image {
  display: block;
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  border-radius: 8px;
  box-shadow: 0 10px 40px rgba(0,0,0,0.3);
}

.nav-button {
  flex-shrink: 0;
  background-color: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  margin: 0 1rem;
}
.nav-button:hover:not(:disabled) {
  background-color: rgba(255, 255, 255, 0.2);
  transform: scale(1.1);
}
.nav-button:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}
.nav-button.next svg {
  transform: rotate(180deg);
}

.close-button {
  position: absolute;
  top: 1rem;
  right: 1.5rem;
  background: none;
  border: none;
  color: #a0a0a0;
  font-size: 3rem;
  font-weight: 300;
  line-height: 1;
  cursor: pointer;
  transition: color 0.2s ease, transform 0.2s ease;
}
.close-button:hover {
  color: white;
  transform: scale(1.1);
}

.controls-footer {
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 1rem;
  background-color: rgba(19, 28, 38, 0.5);
  padding: 0.5rem 1rem;
  border-radius: 9999px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}
.counter {
  font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace;
  color: #e3e3e3;
  font-size: 1rem;
  min-width: 60px;
  text-align: center;
}

.footer-nav-button {
    padding: 0.25rem 1.25rem;
    border-radius: 9999px;
    background-color: transparent;
    border: 1px solid #8F8F8F;
    color: #8F8F8F;
    font-family: 'Gilroy-SemiBold', sans-serif;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.2s ease;
}
.footer-nav-button:hover:not(:disabled) {
    background-color: #f7f7f7;
    color: #131C26;
    border-color: #f7f7f7;
}
.footer-nav-button:disabled {
    opacity: 0.4;
    cursor: not-allowed;
}

/* Animations */
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
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.image-swap-enter-from {
  opacity: 0;
  transform: scale(0.98);
}
.image-swap-leave-to {
  opacity: 0;
  transform: scale(1.02);
}
</style>