<script setup>
import { useNotificationStore } from '@/stores/notifications.js';
import BaseButton from '@/components/ui/BaseButton.vue'; // Импортируем кнопку для единообразия

const notificationStore = useNotificationStore();
</script>

<template>
  <Teleport to="body">
    <transition name="modal-fade">
      <div
        v-if="notificationStore.isVisible"
        class="notification-overlay"
        @click="notificationStore.hideNotification"
      >
        <div class="notification-modal" @click.stop>
          <div class="icon-wrapper" :class="notificationStore.type === 'success' ? 'icon-success' : 'icon-error'">
            <svg v-if="notificationStore.type === 'success'" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="h-10 w-10">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="h-10 w-10">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
          </div>

          <p class="message-text">{{ notificationStore.message }}</p>

          <BaseButton
            @click="notificationStore.hideNotification"
            variant="fill-black"
            class="mt-6 w-full"
          >
            Понятно
          </BaseButton>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<style scoped>
.notification-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(19, 28, 38, 0.5);
  backdrop-filter: blur(0.5rem);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  padding: 1rem;
}

.notification-modal {
  background-color: white;
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0 1rem 2rem rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 25rem; /* 400px */
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.icon-wrapper {
  margin-bottom: 1rem;
  width: 4rem; /* 64px */
  height: 4rem; /* 64px */
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.icon-success {
  background-color: #e8f5e9; /* Светло-зеленый фон */
  color: #4caf50; /* Зеленый цвет иконки */
}
.icon-error {
  background-color: #ffebee; /* Светло-красный фон */
  color: #f44336; /* Красный цвет иконки */
}

.message-text {
  font-size: 1.125rem; /* 18px */
  line-height: 1.5;
  color: #131C26;
  font-family: 'Gilroy-SemiBold', sans-serif;
}

/* Анимация появления/скрытия */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}
.modal-fade-enter-active .notification-modal,
.modal-fade-leave-active .notification-modal {
    transition: transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
.modal-fade-enter-from .notification-modal,
.modal-fade-leave-to .notification-modal {
    transform: scale(0.95);
}
</style>