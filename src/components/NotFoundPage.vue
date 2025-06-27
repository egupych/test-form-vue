<script setup>
// ИЗМЕНЕНИЕ: Добавлен импорт нашего компонента кнопки
import BaseButton from './BaseButton.vue';
</script>

<template>
  <div class="flex flex-col items-center justify-center text-center px-4" style="height: calc(100vh - 200px);">
    <h1 class="font-bold text-panda-orange mb-4" style="font-size: 160px; line-height: 1;">404</h1>
    <h2 class="text-h3-panda font-semibold text-panda-black mb-2">Страница не найдена</h2>
    <p class="text-body-panda text-dark-gray mb-8 max-w-md">
      К сожалению, страница, которую вы ищете, не существует, была перемещена или удалена.
    </p>
    <BaseButton to="/">Вернуться на главную</BaseButton>
  </div>
</template>

<style scoped>
/* Стили не требуются */
</style>