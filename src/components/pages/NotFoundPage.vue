// Код для NotFoundPage.vue

<script setup>
import BaseButton from '@/components/ui/BaseButton.vue';
</script>

<template>
  <main class="py-10 md:py-25">
    <div class="max-w-6xl mx-auto">
      <div
        class="flex flex-col items-center justify-center text-center min-h-[calc(100vh-25rem)]"
      >
        <h1 class="font-bold text-panda-orange mb-4 text-[10rem] leading-none">
          404
        </h1>
        <h2 class="text-h3-panda font-semibold text-panda-black mb-2">
          Страница не найдена
        </h2>
        <p class="text-body-panda text-dark-gray mb-8 max-w-md">
          К сожалению, страница, которую вы ищете, не существует, была
          перемещена или удалена.
        </p>
        <BaseButton to="/">
          Вернуться на главную
        </BaseButton>
      </div>
    </div>
  </main>
</template>

<style scoped>
/* Стили не требуются */
</style>
