<script setup>
defineProps({
  // Массив текстовых сообщений для отображения в строке
  items: {
    type: Array,
    required: true,
  },
});
</script>

<template>
  <div class="running-line-container">
    <div class="running-line-content">
      <span v-for="(item, index) in items" :key="`item-${index}`" class="running-line-item">
        {{ item }}
      </span>

      <span v-for="(item, index) in items" :key="`item-copy-${index}`" class="running-line-item" aria-hidden="true">
        {{ item }}
      </span>
    </div>
  </div>
</template>

<style scoped>
.running-line-container {
  /* Основной контейнер с оранжевым фоном */
  background-color: theme('colors.panda-orange');
  color: theme('colors.panda-white');
  padding: 0.5rem 0; /* 8px */
  overflow: hidden; /* Обязательно, чтобы скрыть текст за пределами контейнера */
  display: flex;
  white-space: nowrap; /* Запрещаем перенос текста */
}

.running-line-content {
  /* Этот блок будет анимироваться */
  display: flex;
  /* Анимация: имя, продолжительность, тип (линейная), повторение (бесконечно) */
  animation: marquee 40s linear infinite;
}

.running-line-item {
  /* Стили для каждого отдельного элемента в строке */
  display: flex;
  align-items: center;
  font-size: 1rem; /* 16px */
  font-family: 'Gilroy-SemiBold', sans-serif;
  padding: 0 1.5rem; /* 24px */
  text-transform: uppercase;
}

.running-line-item::after {
  /* Создаем разделитель в виде точки */
  content: '•';
  margin-left: 3rem; /* 48px */
  display: block;
}

/* Анимация движения. Двигаем блок влево на 50% его ширины. */
/* Так как у нас две копии контента, это ровно одна полная прокрутка. */
@keyframes marquee {
  from {
    transform: translateX(0%);
  }
  to {
    transform: translateX(-50%);
  }
}
</style>