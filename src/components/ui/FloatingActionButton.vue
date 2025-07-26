<script setup>
import { ref } from 'vue';
import { useUiStore } from '@/stores/ui.js'; // <-- 1. ИМПОРТИРУЕМ ХРАНИЛИЩЕ

// --- Иконки (без изменений) ---
import whatsappIcon from '@/assets/images/layout/whatsapp.svg';
import mailIcon from '@/assets/images/layout/mail.svg';
import phoneIcon from '@/assets/images/layout/phone.svg';
import plusIcon from '@/assets/images/layout/plus.svg';
import closeIcon from '@/assets/images/layout/close.svg';
import calcIcon from '@/assets/images/layout/calc.svg'; // <-- 2. ИМПОРТИРУЕМ НОВУЮ ИКОНКУ

const uiStore = useUiStore(); // <-- 3. ИНИЦИАЛИЗИРУЕМ ХРАНИЛИЩЕ

const isOpen = ref(false);

const toggleMenu = () => {
  isOpen.value = !isOpen.value;
};

// --- 4. ДОБАВЛЯЕМ НОВУЮ КНОПКУ В МАССИВ ---
const actions = ref([
  {
    label: 'Рассчитать стоимость',
    action: () => {
      uiStore.openCalcForm();
      isOpen.value = false;
    }, // <-- Вызываем действие из хранилища
    iconUrl: calcIcon,
    colorClass: 'bg-panda-black',
  },
  {
    label: 'Написать в WhatsApp',
    href: 'https://wa.me/77007257799',
    iconUrl: whatsappIcon,
    colorClass: 'bg-panda-black',
  },
  {
    label: 'Написать на почту',
    href: 'mailto:infoprint@redpanda.kz',
    iconUrl: mailIcon,
    colorClass: 'bg-panda-black',
  },
  {
    label: 'Позвонить нам',
    href: 'tel:+77007257799',
    iconUrl: phoneIcon,
    colorClass: 'bg-panda-black',
  },
]);

const mainIconOpen = plusIcon;
const mainIconClose = closeIcon;
</script>

<template>
  <div class="fab-container">
    <transition-group
      name="fab-list"
      tag="div"
      class="flex flex-col items-center gap-2"
    >
      <div
        v-for="(action, index) in actions"
        v-show="isOpen"
        :key="action.label"
        class="relative flex items-center group"
      >
        <div class="fab-tooltip hidden md:block">
          <span>{{ action.label }}</span>
        </div>

        <a
          v-if="action.href"
          :href="action.href"
          target="_blank"
          rel="noopener noreferrer"
          :aria-label="action.label"
          :style="{ 'transition-delay': `${index * 50}ms` }"
          class="fab-item"
          :class="action.colorClass"
        >
          <img
            :src="action.iconUrl"
            alt=""
            class="fab-icon"
          >
        </a>

        <button
          v-else
          :aria-label="action.label"
          :style="{ 'transition-delay': `${index * 50}ms` }"
          class="fab-item"
          :class="action.colorClass"
          @click="action.action"
        >
          <img
            :src="action.iconUrl"
            alt=""
            class="fab-icon"
          >
        </button>
      </div>
    </transition-group>

    <div class="relative flex items-center group">
      <div class="fab-tooltip hidden md:block">
        <span>{{ isOpen ? 'Закрыть' : 'Связаться с нами' }}</span>
      </div>
      <button
        class="fab-main bg-panda-orange hover:bg-orange-600"
        @click="toggleMenu"
      >
        <transition
          name="icon-fade"
          mode="out-in"
        >
          <img
            v-if="isOpen"
            key="close"
            :src="mainIconClose"
            alt="Закрыть"
            class="fab-main-icon"
          >
          <img
            v-else
            key="open"
            :src="mainIconOpen"
            alt="Открыть"
            class="fab-main-icon"
          >
        </transition>
      </button>
    </div>
  </div>
</template>

<style scoped>
/* Стили остаются без изменений */
.fab-container {
  position: fixed;
  bottom: 1rem;
  right: 1rem;
  z-index: 999;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
}
@media (max-width: 768px) {
  .fab-container {
    bottom: 1.1rem;
    right: 1.1rem;
    gap: 0.825rem;
  }
  .fab-main {
    width: 3.3rem;
    height: 3.3rem;
  }
  .fab-item {
    width: 2.75rem;
    height: 2.75rem;
  }
  .fab-main-icon {
    width: 1.375rem;
    height: 1.375rem;
  }
  .fab-icon {
    width: 1.32rem;
    height: 1.32rem;
  }
}
.fab-item {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 9999px;
  transition: background-color 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  transform-origin: bottom;
  border: none;
  padding: 0;
  cursor: pointer;
}
.fab-icon {
  width: 1.2rem;
  height: 1.2rem;
}
.fab-main {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3rem;
  height: 3rem;
  border-radius: 9999px;
  border: none;
  color: white;
  cursor: pointer;
  transition: all 0.2s ease;
}
.fab-main-icon {
  width: 1.25rem;
  height: 1.25rem;
  transition: all 0.2s ease;
}
.fab-tooltip {
  position: absolute;
  right: 100%;
  margin-right: 0.75rem;
  padding: 0.5rem 0.75rem;
  background-color: #f7f7f7;
  color: #131c26;
  border: 0.0625rem solid #e5e7eb;
  border-radius: 0.375rem;
  white-space: nowrap;
  font-family: 'Gilroy-SemiBold', sans-serif;
  font-size: 0.875rem;
  opacity: 0;
  transform: translateX(0.625rem);
  pointer-events: none;
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
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
  border-width: 0.375rem;
  border-color: transparent transparent transparent #f7f7f7;
  filter: drop-shadow(1px 0 0 #e5e7eb);
}
.fab-list-enter-active,
.fab-list-leave-active {
  transition: all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
.fab-list-enter-from,
.fab-list-leave-to {
  opacity: 0;
  transform: translateY(0.9375rem) scale(0.8);
}
.icon-fade-enter-active,
.icon-fade-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
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
