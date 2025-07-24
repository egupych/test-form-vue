<script setup>
import LikeButton from './LikeButton.vue';

defineProps({
  images: {
    type: Array,
    required: true,
  },
});

const emit = defineEmits(['image-click']);

// Передаем не только изображение, но и его индекс
const handleImageClick = (image, index) => {
  emit('image-click', { image, index });
};
</script>

<template>
  <div class="grid grid-cols-2 md:grid-cols-3 gap-2">
    <div
      v-for="(image, index) in images"
      :key="index"
      class="grid-item group"
      @click="handleImageClick(image, index)"
    >
      <img
        :src="image.url || image"
        :alt="image.alt || ''"
        class="grid-image"
        loading="lazy"
      />
      <LikeButton :image-url="image.url || image" />
    </div>
  </div>
</template>

<style scoped>
.grid-item {
  position: relative;
  cursor: pointer;
  overflow: hidden;
  background-color: #f7f7f7;
  aspect-ratio: 1 / 1;
}
.grid-image {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
  transition: transform 0.3s ease;
}
.grid-item:hover .grid-image {
  transform: scale(1.05);
}
.like-button {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  opacity: 0;
  transition: opacity 0.2s ease-in-out;
  pointer-events: none;
}
.grid-item:hover .like-button {
  opacity: 1;
  pointer-events: auto;
}
</style>
