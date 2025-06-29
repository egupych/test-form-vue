<template>
  <div class="flex items-center">
    <h2 class="font-semibold text-panda-orange text-[18px] leading-[130%] mr-4 whitespace-nowrap uppercase">
      <slot />
    </h2>
    <div class="flex-grow custom-dashed-line"></div>
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
     66.66% от 24px = 16px (длина штриха) */
  background-image: linear-gradient(to right, #F15F31 66.66%, transparent 0%);
  
  /* Общая ширина паттерна = 16px (штрих) + 8px (пробел) = 24px. Высота = 1px. */
  background-size: 24px 1px;

  /* Повторяем паттерн по горизонтали */
  background-repeat: repeat-x;
  
  /* Выравниваем линию по нижнему краю flex-контейнера */
  background-position: bottom;

  /* Задаем высоту самого блока, чтобы фон был виден */
  height: 1px; 
}
</style>