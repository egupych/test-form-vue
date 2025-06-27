<script setup>
// Для этой страницы скрипты не нужны, но <script setup> оставляем для единообразия
</script>

<template>
  <div class="flex flex-col items-center justify-center text-center px-4" style="height: calc(100vh - 200px);">
    <h1 class="text-8xl font-bold text-panda-orange mb-4">404</h1>
    <h2 class="text-3xl font-semibold text-panda-black mb-2">Страница не найдена</h2>
    <p class="text-lg text-dark-gray mb-8 max-w-md">
      К сожалению, страница, которую вы ищете, не существует, была перемещена или удалена.
    </p>
    <router-link
      to="/"
      class="px-8 py-3 bg-panda-orange text-white rounded-full text-lg font-semibold hover:bg-orange-600 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50"
    >
      Вернуться на главную
    </router-link>
  </div>
</template>

<style scoped>
/* Стили в этом блоке применяются только к этому компоненту */
</style>