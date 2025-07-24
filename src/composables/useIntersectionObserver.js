// src/composables/useIntersectionObserver.js
import { ref, onMounted, onUnmounted } from 'vue';

/**
 * Отслеживает, когда элемент появляется в области видимости.
 * @param {ref} target - Ссылка на DOM-элемент (через template ref).
 * @param {object} options - Настройки для IntersectionObserver.
 * @returns {object} - Реактивная переменная isIntersecting.
 */
export function useIntersectionObserver(
  target,
  options = { root: null, rootMargin: '0rem', threshold: 0.1 }
) {
  const isIntersecting = ref(false);
  let observer = null;

  onMounted(() => {
    observer = new IntersectionObserver(([entry]) => {
      // Мы хотим запустить анимацию только один раз
      if (entry.isIntersecting) {
        isIntersecting.value = true;
        // После того как элемент стал видимым, прекращаем слежку
        observer.unobserve(target.value);
      }
    }, options);

    if (target.value) {
      observer.observe(target.value);
    }
  });

  onUnmounted(() => {
    if (observer) {
      observer.disconnect();
    }
  });

  return { isIntersecting };
}
