
<script setup>
defineProps({
  categories: {
    type: Array,
    required: true,
  },
  activeCategory: {
    type: String,
    default: null,
  },
});

const emit = defineEmits(['navigate']);

const scrollToCategory = (categoryId) => {
  emit('navigate', categoryId);
};
</script>

<template>
  <aside class="fixed right-0 top-1/2 -translate-y-1/2 h-auto z-20 mr-4 hidden md:block">
    <nav>
      <ul class="flex flex-col items-end gap-3">
        <li
          v-for="category in categories"
          :key="category.id"
          class="relative group"
        >
          <a
            @click.prevent="scrollToCategory(category.id)"
            :href="`#${category.id}`"
            class="flex items-center gap-3 cursor-pointer"
            :aria-label="`Перейти к секции ${category.name}`"
          >
            <span
              class="text-sm font-semibold whitespace-nowrap transition-all duration-300 ease-in-out"
              :class="[
                activeCategory === category.id
                  ? 'text-panda-black opacity-100'
                  : 'text-dark-gray opacity-20 group-hover:opacity-100' 
                  // ↑↑↑ Меняем opacity-0 на opacity-20 для видимости по умолчанию ↑↑↑
              ]"
            >
              {{ category.name }}
            </span>
            <span
              class="block w-2 h-2 rounded-full transition-all duration-300 ease-in-out flex-shrink-0"
              :class="[
                activeCategory === category.id
                  ? 'bg-panda-orange scale-150'
                  : 'bg-gray'
              ]"
            ></span>
          </a>
        </li>
      </ul>
    </nav>
  </aside>
</template>