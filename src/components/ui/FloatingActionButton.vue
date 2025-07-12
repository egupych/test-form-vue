<script setup>
import { ref } from 'vue';

// Состояние, которое отвечает за видимость кнопок
const isOpen = ref(false);

// Функция для переключения видимости
const toggleMenu = () => {
  isOpen.value = !isOpen.value;
};

// --- [ИЗМЕНЕНО] ---
// Пути ко всем иконкам теперь задаются здесь.

// Иконки для дочерних кнопок
const actions = ref([
  {
    label: 'Написать в WhatsApp',
    href: 'https://wa.me/77007257799',
    iconUrl: '@/assets/images/icons/whatsapp.svg',
    colorClass: 'bg-panda-green hover:bg-green-600'
  },
  {
    label: 'Позвонить нам',
    href: 'tel:+77007257799',
    iconUrl: '@/assets/images/icons/phone.svg',
    colorClass: 'bg-panda-black hover:bg-gray-800'
  }
]);

// Иконки для главной кнопки
const mainIconOpenUrl = '@/assets/images/icons/plus.svg';
const mainIconCloseUrl = '@/assets/images/icons/close.svg';

// Функция для динамического импорта иконок по пути
const getImageUrl = (path) => {
  return new URL(path, import.meta.url).href;
};
</script>

<template>
  <div class="fixed bottom-6 right-6 z-[999] flex flex-col items-center gap-3">
    
    <transition-group
      name="fab-list"
      tag="div"
      class="flex flex-col items-center gap-3"
    >
      <div 
        v-if="isOpen"
        v-for="(action, index) in actions"
        :key="action.label"
        class="relative flex items-center group"
      >
        <div class="fab-tooltip">
          <span>{{ action.label }}</span>
        </div>
        <a
          :href="action.href"
          target="_blank"
          rel="noopener noreferrer"
          :aria-label="action.label"
          :style="{ 'transition-delay': `${index * 50}ms` }"
          class="fab-item"
          :class="action.colorClass"
        >
          <img 
            :src="getImageUrl(action.iconUrl)" 
            alt="" 
            class="fab-icon" 
          />
        </a>
      </div>
    </transition-group>

    <div class="relative flex items-center group">
      <div class="fab-tooltip">
        <span>{{ isOpen ? 'Закрыть' : 'Связаться с нами' }}</span>
      </div>
      <button @click="toggleMenu" class="fab-main bg-panda-orange hover:bg-orange-600">
        <transition name="icon-fade" mode="out-in">
          <img
            v-if="isOpen"
            :src="getImageUrl(mainIconCloseUrl)"
            alt="Закрыть"
            key="close"
            class="w-7 h-7"
          />
          <img
            v-else
            :src="getImageUrl(mainIconOpenUrl)"
            alt="Открыть"
            key="open"
            class="w-7 h-7"
          />
        </transition>
      </button>
    </div>

  </div>
</template>

<style scoped>
/* Стили остаются без изменений, они универсальны */
.fab-item {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3.25rem;
  height: 3.25rem;
  border-radius: 9999px;
  transition: background-color 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  transform-origin: bottom;
}
.fab-icon {
    width: 1.5rem;
    height: 1.5rem;
}
.fab-main {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 4rem;
  height: 4rem;
  border-radius: 9999px;
  border: none;
  color: white;
  cursor: pointer;
  transition: background-color 0.3s ease;
}
.fab-tooltip {
  position: absolute;
  right: 100%;
  margin-right: 0.75rem;
  padding: 0.5rem 0.75rem;
  background-color: #F7F7F7;
  color: #131C26;
  border: 1px solid #E5E7EB;
  border-radius: 0.375rem;
  white-space: nowrap;
  font-family: 'Gilroy-SemiBold', sans-serif;
  font-size: 0.875rem;
  opacity: 0;
  transform: translateX(10px);
  pointer-events: none;
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.group:hover .fab-tooltip {
  opacity: 1;
  transform: translateX(0);
}
.fab-tooltip::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 100%;
  transform: translateY(-50%);
  border-style: solid;
  border-width: 6px;
  border-color: transparent transparent transparent #F7F7F7;
  filter: drop-shadow(1px 0 0 #E5E7EB);
}
.fab-list-enter-active,
.fab-list-leave-active {
  transition: all 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
.fab-list-enter-from,
.fab-list-leave-to {
  opacity: 0;
  transform: translateY(15px) scale(0.8);
}
.icon-fade-enter-active,
.icon-fade-leave-active {
  transition: opacity 0.2s ease, transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
.icon-fade-enter-from {
  opacity: 0;
  transform: rotate(-45deg) scale(0.5);
}
.icon-fade-leave-to {
  opacity: 0;
  transform: rotate(45deg) scale(0.5);
}
</style>