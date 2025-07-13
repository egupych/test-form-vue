<script setup>
import { ref } from 'vue';
import { useIntersectionObserver } from '@/composables/useIntersectionObserver.js';
import ImageGrid from '@/components/ui/ImageGrid.vue';

defineProps({
  images: {
    type: Array,
    required: true,
  },
});

const emit = defineEmits(['image-click']);
const target = ref(null);

const { isIntersecting } = useIntersectionObserver(target, { rootMargin: '200px' });

// ИЗМЕНЕНИЕ: Просто пробрасываем объект события { image, index } наверх
const onImageClick = (eventPayload) => {
  emit('image-click', eventPayload);
};
</script>

<template>
  <div ref="target" class="lazy-grid-wrapper">
    <ImageGrid
      v-if="isIntersecting"
      :images="images"
      @image-click="onImageClick"
    />
  </div>
</template>

<style scoped>
.lazy-grid-wrapper {
  min-height: 400px;
}
</style>