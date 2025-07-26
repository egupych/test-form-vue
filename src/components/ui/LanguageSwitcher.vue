<script setup>
import { ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';

// Получаем доступ к функциям и состоянию i18n
const { locale, availableLocales } = useI18n();
const isDropdownOpen = ref(false);

// Функция для смены языка
const switchLanguage = (newLocale) => {
  locale.value = newLocale; // Меняем активный язык в i18n
  localStorage.setItem('user-language', newLocale); // Сохраняем выбор в localStorage
  isDropdownOpen.value = false; // Закрываем выпадающий список
};

// При загрузке компонента проверяем, есть ли сохраненный язык в localStorage
onMounted(() => {
  const savedLanguage = localStorage.getItem('user-language');
  if (savedLanguage && availableLocales.includes(savedLanguage)) {
    locale.value = savedLanguage;
  }
});

// Вычисляемое свойство для получения списка языков, которые не являются текущим
const otherLocales = availableLocales.filter((l) => l !== locale.value);
</script>

<template>
  <div class="relative">
    <button
      class="flex items-center justify-center w-10 h-10 rounded-full text-sm font-semibold transition-colors duration-200 ease-in-out text-header-panda hover:bg-gray"
      @click="isDropdownOpen = !isDropdownOpen"
    >
      {{ locale.toUpperCase() }}
    </button>

    <transition name="slide-down">
      <div
        v-if="isDropdownOpen"
        class="absolute top-full right-0 mt-2 w-24 bg-panda-white rounded-lg shadow-lg py-1 z-20"
      >
        <button
          v-for="otherLocale in otherLocales"
          :key="otherLocale"
          class="w-full text-left px-4 py-2 text-sm text-panda-black hover:bg-light-gray"
          @click="switchLanguage(otherLocale)"
        >
          {{ otherLocale.toUpperCase() }}
        </button>
      </div>
    </transition>
  </div>
</template>

<style scoped>
/* Стили для анимации выпадающего списка, похожие на те, что у вас уже есть */
.slide-down-enter-active,
.slide-down-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}

.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-0.625rem);
}
</style>
