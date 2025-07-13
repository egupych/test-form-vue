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
      class="grid-item-wrapper"
    >
      <div
        class="grid-item"
        @click="handleImageClick(image)"
      >
        <img :src="image.url || image" :alt="image.alt || ''" class="grid-image" loading="lazy">
        <LikeButton :image-url="image.url || image" />
      </div>
      <div v-if="image.title" class="image-info">
        <h3 class="font-semibold text-panda-black">{{ image.title }}</h3>
        <p v-if="image.description" class="text-dark-gray text-sm">{{ image.description }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.image-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 8px; /* Минимальный отступ между картинками */
}

/* Masonry layout для браузеров, которые его поддерживают */
@supports (grid-template-rows: masonry) {
  .image-grid {
    grid-template-rows: masonry;
    /* Убираем лишний margin, если masonry работает */
    .grid-item-wrapper {
        margin-bottom: 0;
    }
  }
}

.grid-item-wrapper {
  break-inside: avoid;
  /* Отступ для браузеров без поддержки masonry */
  margin-bottom: 8px;
}

.grid-item {
  position: relative;
  overflow: hidden;
  cursor: pointer;
  /* Убрали border-radius для острых углов */
  background-color: #f0f0f0; /* Цвет фона на время загрузки изображения */
}

.grid-image {
  width: 100%;
  height: auto;
  display: block;
  /* Убрали анимацию transform */
}

/* Кнопка будет появляться при наведении на весь блок .grid-item */
.grid-item .like-button {
    opacity: 0;
    transition: opacity 0.2s ease-in-out;
}
.grid-item:hover .like-button {
  opacity: 1;
}

.image-info {
    padding-top: 12px;
}
</style>