<template>
  <div class="flex items-center">
    <h2
      class="font-semibold text-panda-orange text-[1.125rem] leading-[130%] mr-4 whitespace-nowrap uppercase"
    >
      <slot />
    </h2>
    <div class="flex-grow custom-dashed-line" />
  </div>
</template>

<script setup>
// Скрипты не нужны
</script>

<style scoped>
/* ИЗМЕНЕНИЕ: Стили для создания кастомной пунктирной линии */
.custom-dashed-line {
  /* Создаем повторяющийся фон с помощью градиента.
     Это самый надежный способ сделать пунктир с точными размерами.
     66.66% от 1.5rem = 1rem (длина штриха) */
  background-image: linear-gradient(to right, #f15f31 66.66%, transparent 0%);

  /* Общая ширина паттерна = 1rem (штрих) + 0.5rem (пробел) = 1.5rem. Высота = 0.0625rem. */
  background-size: 1.5rem 0.0625rem;

  /* Повторяем паттерн по горизонтали */
  background-repeat: repeat-x;

  /* Выравниваем линию по нижнему краю flex-контейнера */
  background-position: bottom;

  /* Задаем высоту самого блока, чтобы фон был виден */
  height: 0.0625rem;
}
</style>
