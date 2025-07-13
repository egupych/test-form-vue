<script setup>
import LikeButton from './LikeButton.vue';

defineProps({
  images: {
    type: Array,
    required: true,
  },
});

const emit = defineEmits(['image-click']);

const handleImageClick = (image) => {
  emit('image-click', image);
};
</script>

<template>
  <div class="image-grid">
    <div
      v-for="(image, index) in images"
      :key="index"
      class="grid-item"
      @click="handleImageClick(image)"
    >
      <img :src="image.url || image" :alt="image.alt || ''" class="grid-image" loading="lazy">
      <LikeButton :image-url="image.url || image" />
    </div>
  </div>
</template>

<style scoped>
.image-grid {
  display: grid;
  /* Создаём адаптивную сетку. Количество колонок будет меняться в зависимости от ширины экрана. */
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 8px; /* Отступ между ячейками */
}

.grid-item {
  position: relative;
  cursor: pointer;
  overflow: hidden;
  background-color: #f0f0f0; /* Фон на время загрузки */

  /* КЛЮЧЕВОЕ ИЗМЕНЕНИЕ:
     Задаём всем ячейкам одинаковое соотношение сторон.
     Можете изменить на 1 / 1 для квадратных, 16 / 9 для широких и т.д. */
  aspect-ratio: 1 / 1;
}

.grid-image {
  width: 100%;
  height: 100%;
  display: block;
  /* ВТОРОЕ КЛЮЧЕВОЕ ИЗМЕНЕНИЕ:
     Изображение заполняет всю ячейку, сохраняя свои пропорции
     и обрезаясь, если это необходимо. */
  object-fit: cover;
  transition: transform 0.3s ease; /* Добавим небольшой эффект при наведении */
}


.grid-item .like-button {
  /* Стили для кнопки остаются прежними */
  opacity: 0;
  transition: opacity 0.2s ease-in-out;
  pointer-events: none;
}

.grid-item:hover .like-button {
  opacity: 1;
  pointer-events: auto;
}
</style>