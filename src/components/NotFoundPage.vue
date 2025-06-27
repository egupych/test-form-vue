<script setup>
</script>

<template>
  <div class="flex flex-col items-center justify-center text-center px-4" style="height: calc(100vh - 200px);">
    <h1 class="font-bold text-panda-orange mb-4" style="font-size: 160px; line-height: 1;">404</h1>
    <h2 class="text-h3-panda font-semibold text-panda-black mb-2">Страница не найдена</h2>
    <p class="text-body-panda text-dark-gray mb-8 max-w-md">
      К сожалению, страница, которую вы ищете, не существует, была перемещена или удалена.
    </p>
    <router-link
      to="/"
      class="px-8 py-3 bg-panda-orange text-white rounded-full text-button-panda font-semibold hover:bg-orange-600 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50"
    >
      Вернуться на главную
    </router-link>
  </div>
</template>

<style scoped>
</style>