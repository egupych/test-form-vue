<script setup>
import { ref } from 'vue';

// --- [Без изменений] ---
import whatsappIcon from '@/assets/images/layout/whatsapp.svg';
import mailIcon from '@/assets/images/layout/mail.svg';
import phoneIcon from '@/assets/images/layout/phone.svg';
import plusIcon from '@/assets/images/layout/plus.svg';
import closeIcon from '@/assets/images/layout/close.svg';

const isOpen = ref(false);

// --- [ИЗМЕНЕНО] ---
// 1. Добавлена переменная для хранения таймера
const closeTimer = ref(null);

// 2. Функция для открытия меню по наведению (для ПК)
// Она также отменяет запланированное закрытие
const openMenu = () => {
  if (closeTimer.value) {
    clearTimeout(closeTimer.value);
    closeTimer.value = null;
  }
  isOpen.value = true;
};

// 3. Функция для планирования закрытия меню с задержкой (для ПК)
const scheduleClose = () => {
  closeTimer.value = setTimeout(() => {
    isOpen.value = false;
  }, 500); // Задержка в 1000 мс (1 секунда)
};

// 4. Функция для переключения по клику (основной способ для мобильных)
const toggleMenu = () => {
  // Если меню открывается по клику, отменяем любой таймер закрытия
  if (!isOpen.value) {
    if (closeTimer.value) {
      clearTimeout(closeTimer.value);
      closeTimer.value = null;
    }
  }
  isOpen.value = !isOpen.value;
};


// --- [Без изменений] ---
const actions = ref([
  {
    label: 'Написать в WhatsApp',
    href: 'https://wa.me/77007257799',
    iconUrl: whatsappIcon,
    colorClass: 'bg-panda-black hover:bg-gray-800'
  },
  {
    label: 'Написать на почту',
    href: 'mailto:infoprint@redpanda.kz',
    iconUrl: mailIcon,
    colorClass: 'bg-panda-black hover:bg-gray-800'
  },
  {
    label: 'Позвонить нам',
    href: 'tel:+77007257799',
    iconUrl: phoneIcon,
    colorClass: 'bg-panda-black hover:bg-gray-800'
  }
]);

const mainIconOpen = plusIcon;
const mainIconClose = closeIcon;
</script>

<template>
  <div 
    @mouseenter="openMenu"
    @mouseleave="scheduleClose"
    class="fixed bottom-6 right-6 z-[999] flex flex-col items-center gap-3"
  >
    
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
            :src="action.iconUrl" 
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
            :src="mainIconClose"
            alt="Закрыть"
            key="close"
            class="fab-main-icon"
          />
          <img
            v-else
            :src="mainIconOpen"
            alt="Открыть"
            key="open"
            class="fab-main-icon"
          />
        </transition>
      </button>
    </div>

  </div>
</template>

<style scoped>
/* Стили для кнопок и иконок */
.fab-item {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 9999px;
  transition: background-color 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  transform-origin: bottom;
}
.fab-icon {
    width: 1.2rem;
    height: 1.2rem;
}
.fab-main {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3rem; /* 48px */
  height: 3rem; /* 48px */
  border-radius: 9999px;
  border: none;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease; /* Изменено на all для плавного изменения размера */
}
/* --- [ИЗМЕНЕНО] --- */
/* 8. Добавлены стили для иконки в главной кнопке */
.fab-main-icon {
  width: 1.25rem; /* 20px */
  height: 1.25rem; /* 20px */
  transition: all 0.3s ease;
}

/* Стили для всплывающей подсказки (tooltip) */
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

/* Анимации появления и скрытия */
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

/* --- [ИЗМЕНЕНО] --- */
/* 9. Медиа-запрос для увеличения кнопки на мобильных устройствах */
@media (max-width: 768px) {
  .fab-main {
    width: 3.75rem; /* 48px * 1.25 = 60px */
    height: 3.75rem; /* 48px * 1.25 = 60px */
  }
  .fab-main-icon {
    width: 1.5625rem; /* 20px * 1.25 = 25px */
    height: 1.5625rem; /* 20px * 1.25 = 25px */
  }
}
</style>