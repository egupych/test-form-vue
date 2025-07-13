<script setup>
import { computed } from 'vue';
import { useReferencesStore } from '@/stores/references.js';

const props = defineProps({
  imageUrl: {
    type: String,
    required: true,
  },
});

const referencesStore = useReferencesStore();

const isLiked = computed(() => referencesStore.isInReferences(props.imageUrl));

const toggle = () => {
  referencesStore.toggleReference(props.imageUrl);
};
</script>

<template>
  <div class="button-container">
    <button
      @click.stop.prevent="toggle"
      class="like-button"
      :class="{ 'is-liked': isLiked }"
      title="Добавить в референсы"
    >
      <svg class="like-icon" viewBox="0 0 24 24">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
      </svg>
    </button>
  </div>
</template>

<style scoped>
/* Контейнер для позиционирования в углу изображения */
.button-container {
    position: absolute;
    top: 12px;
    right: 12px;
    /* Убираем opacity отсюда, будем управлять им из ImageGrid.vue */
}

/* Стили самой кнопки, как на вашем примере */
.like-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px; /* Размер контейнера */
  height: 36px;
  padding: 8px; /* Внутренний отступ для иконки */
  border-radius: 100%; /* Скругление, как в примере */
  background-color: rgba(19, 28, 38, 0.164); /* Полупрозрачный темный фон */
  backdrop-filter: blur(4px); /* Эффект размытия фона */
  border: 1px solid rgba(255, 255, 255, 0.1);
  cursor: pointer;
  transition: background-color 0.2s ease, transform 0.2s ease;
}

.like-button:hover {
    background-color: #F15F31;
    transform: scale(1.05);
}

.like-icon {
  width: 100%;
  height: 100%;
  stroke: #f7f7f7; /* Белая обводка */
  stroke-width: 2;
  fill: transparent; /* Прозрачная заливка по умолчанию */
  transition: all 0.2s ease;
}

/* Стили для "залайканного" состояния */
.like-button.is-liked .like-icon {
  stroke: #f7f7f7; /* Оранжевая обводка */
  fill: #f7f7f7;   /* Оранжевая заливка */
}
</style>