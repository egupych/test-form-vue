<script setup>
import { computed } from 'vue';

const props = defineProps({
  to: {
    type: String,
    default: null,
  },
  href: {
    type: String,
    default: null,
  },
  // ИЗМЕНЕНИЕ: Название варианта теперь в kebab-case.
  variant: {
    type: String,
    default: 'fill-orange', 
  },
});

const componentType = computed(() => {
  if (props.to) return 'router-link';
  if (props.href) return 'a';
  return 'button';
});

const baseClasses = 'px-5 py-2.5 rounded-full inline-block text-center transition-colors duration-200 ease-in-out cursor-pointer';

// ИЗМЕНЕНИЕ: Все названия вариантов теперь в kebab-case.
const variantClasses = computed(() => {
  switch (props.variant) {
    case 'stroke': 
      return 'bg-white text-panda-orange border-2 border-panda-orange hover:bg-panda-orange hover:text-white';
    
    case 'fill-black':
      return 'bg-panda-black text-white hover:bg-panda-orange';

    case 'stroke-white':
      return 'bg-white text-panda-black border border-gray-300 hover:bg-panda-orange hover:text-white hover:border-panda-orange';

    case 'fill':
      return 'bg-gray-200 text-dark-gray hover:bg-panda-orange hover:text-white';
      
    case 'fill-orange':
    default: 
      return 'bg-panda-orange text-white hover:bg-orange-600';
  }
});
</script>

<template>
  <component 
    :is="componentType"
    :to="to"
    :href="href"
    :class="[baseClasses, variantClasses, 'text-button-panda font-semibold']"
  >
    <slot></slot>
  </component>
</template>

<style scoped>
/* Все стили управляются через Tailwind */
</style>