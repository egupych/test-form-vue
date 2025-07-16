<script setup>
import { useNotificationStore } from '@/stores/notifications.js';

const notificationStore = useNotificationStore();
</script>

<template>
  <Teleport to="body">
    <transition name="toast">
      <div
        v-if="notificationStore.isVisible"
        class="notification-toast"
        :class="notificationStore.type === 'success' ? 'bg-panda-green' : 'bg-red-500'"
      >
        <p>{{ notificationStore.message }}</p>
        <button @click="notificationStore.hideNotification()" class="close-button" aria-label="Закрыть">&times;</button>
      </div>
    </transition>
  </Teleport>
</template>

<style scoped>
.notification-toast {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  padding: 1rem 1.5rem;
  border-radius: 0.5rem;
  color: white;
  font-family: 'Gilroy-SemiBold', sans-serif;
  display: flex;
  align-items: center;
  gap: 1rem;
  z-index: 9999;
  box-shadow: 0 0.5rem 1.5rem rgba(0, 0, 0, 0.15);
}
.close-button {
  background: none;
  border: none;
  color: white;
  opacity: 0.7;
  font-size: 1.5rem;
  line-height: 1;
  cursor: pointer;
  transition: opacity 0.2s;
}
.close-button:hover {
  opacity: 1;
}

/* Анимация появления/скрытия */
.toast-enter-active,
.toast-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(1.25rem);
}
</style>