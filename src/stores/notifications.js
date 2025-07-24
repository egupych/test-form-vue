// src/stores/notifications.js

import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useNotificationStore = defineStore('notification', () => {
  // --- Состояние (State) ---
  const message = ref('');
  const type = ref('success'); // 'success' или 'error'
  const isVisible = ref(false);
  let timeoutId = null;

  // --- Действия (Actions) ---
  function showNotification(newMessage, newType = 'success', duration = 5000) {
    // Если уже есть уведомление, сначала сбрасываем таймер
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    message.value = newMessage;
    type.value = newType;
    isVisible.value = true;

    // Устанавливаем таймер на скрытие уведомления
    timeoutId = setTimeout(() => {
      hideNotification();
    }, duration);
  }

  function hideNotification() {
    isVisible.value = false;
    // Сбрасываем таймер на всякий случай
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
  }

  return {
    message,
    type,
    isVisible,
    showNotification,
    hideNotification,
  };
});
