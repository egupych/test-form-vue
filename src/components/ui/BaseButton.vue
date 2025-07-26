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
  variant: {
    type: String,
    default: 'fill-black',
  },
  // ИЗМЕНЕНИЕ: Добавлено свойство disabled
  disabled: {
    type: Boolean,
    default: false,
  },
});

const componentType = computed(() => {
  if (props.to) return 'router-link';
  if (props.href) return 'a';
  return 'button';
});

const baseClasses =
  'px-5 py-2.5 rounded-full inline-flex items-center justify-center gap-0 text-center transition-colors duration-200 ease-in-out cursor-pointer';

const variantClasses = computed(() => {
  // ИЗМЕНЕНИЕ: Если кнопка отключена, применяем стили для неактивного состояния
  if (props.disabled) {
    return 'bg-gray text-dark-gray opacity-50 cursor-not-allowed';
  }
  switch (props.variant) {
    case 'stroke':
      return 'bg-white text-panda-orange border-2 border-panda-orange hover:bg-panda-orange hover:text-light-gray';
    case 'stroke-white':
      return 'bg-white text-panda-black border border-gray hover:bg-panda-orange hover:text-light-gray hover:border-panda-orange';
    case 'gray':
      return 'bg-gray text-dark-gray hover:bg-panda-orange hover:text-light-gray';
    case 'fill-orange':
      return 'bg-panda-orange text-light-gray hover:bg-panda-black';
    case 'fill-black':
    default:
      return 'bg-panda-black text-light-gray hover:bg-panda-orange';
  }
});
</script>

<template>
  <component
    :is="componentType"
    :to="to"
    :href="href"
    :disabled="disabled"
    :class="[baseClasses, variantClasses, 'text-button-panda font-semibold']"
  >
    <slot />
  </component>
</template>
