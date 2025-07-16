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

// Проверяем, находится ли изображение в референсах
const isLiked = computed(() => referencesStore.isInReferences(props.imageUrl));

// Создаем вычисляемые свойства для текста и title, чтобы они были динамическими
const buttonText = computed(() => isLiked.value ? 'Добавлено' : 'В референсы');
const buttonTitle = computed(() => isLiked.value ? 'Удалить из референсов' : 'Добавить в референсы');

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
      :title="buttonTitle"
    >
      <svg class="like-icon" viewBox="0 0 24 24">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
      </svg>
      <span class="like-text">{{ buttonText }}</span>
    </button>
  </div>
</template>

<style scoped>
.button-container {
    position: absolute;
    top: 0.75rem;
    right: 0.75rem;
}

.like-button {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 2.25rem;
  padding: 0.5rem;
  border-radius: 3.125rem; /* Закругление для формы "пилюли" */
  background-color: rgba(19, 28, 38, 0.2);
  backdrop-filter: blur(0.25rem);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.23, 1, 0.32, 1);
  overflow: hidden; /* Скрываем текст, который выходит за пределы */
}

.like-button:hover:not(.is-liked) {
    background-color: #F15F31;
}

/* Расширяем кнопку при наведении или в активном состоянии */
.like-button:hover,
.like-button.is-liked {
  padding: 0.5rem 1rem 0.5rem 0.75rem;
}

.like-icon {
  width: 1.25rem;
  height: 1.25rem;
  stroke: #f7f7f7;
  stroke-width: 2;
  fill: transparent;
  transition: all 0.3s ease;
  flex-shrink: 0; /* Запрещаем иконке сжиматься */
}

.like-text {
  color: white;
  font-size: 0.875rem;
  font-family: 'Gilroy-SemiBold', sans-serif;
  white-space: nowrap; /* Запрещаем перенос текста */
  margin-left: 0;
  max-width: 0;
  opacity: 0;
  transition: max-width 0.2s ease-out, opacity 0.15s ease-out, margin-left 0.2s ease-out;
}

/* Показываем текст при наведении или в активном состоянии */
.like-button:hover .like-text,
.like-button.is-liked .like-text {
  max-width: 12.5rem; /* Максимальная ширина, до которой "выезжает" текст */
  opacity: 1;
  margin-left: 0.5rem; /* Отступ между иконкой и текстом */
}

/* Стили для активного состояния "is-liked" */
.like-button.is-liked {
    background-color: #F15F31; /* Оставляем оранжевый фон */
}

.like-button.is-liked .like-icon {
  stroke: #f7f7f7;
  fill: #f7f7f7;
}
</style>