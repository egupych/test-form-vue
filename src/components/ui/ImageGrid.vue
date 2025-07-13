<script setup>
import LikeButton from './LikeButton.vue';

defineProps({
  images: {
    type: Array,
    required: true,
  },
});

const emit = defineEmits(['image-click']);

// ИЗМЕНЕНИЕ: Передаем не только изображение, но и его индекс
const handleImageClick = (image, index) => {
  emit('image-click', { image, index });
};
</script>

<template>
  <div class="image-grid">
    <div
      v-for="(image, index) in images"
      :key="index"
      class="grid-item"
      @click="handleImageClick(image, index)"
    >
      <img :src="image.url || image" :alt="image.alt || ''" class="grid-image" loading="lazy">
      <LikeButton :image-url="image.url || image" />
    </div>
  </div>
</template>

<style scoped>
.image-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 8px;
}
.grid-item {
  position: relative;
  cursor: pointer;
  overflow: hidden;
  background-color: #f0f0f0;
  aspect-ratio: 1 / 1;
}
.grid-image {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
  transition: transform 0.3s ease;
}
.grid-item .like-button {
  opacity: 0;
  transition: opacity 0.2s ease-in-out;
  pointer-events: none;
}
.grid-item:hover .like-button {
  opacity: 1;
  pointer-events: auto;
}
</style>