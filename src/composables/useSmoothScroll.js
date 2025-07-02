import { onMounted, onUnmounted } from 'vue';
import Lenis from '@studio-freight/lenis';

export function useSmoothScroll() {
  let lenis;

  onMounted(() => {
    // Возвращаем первоначальные настройки
    lenis = new Lenis({
      duration: 1.3, // Скорость анимации (чем больше, тем медленнее)
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Функция для плавности
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    });

    // Функция, которая будет вызываться на каждом кадре анимации
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    // Запускаем анимацию
    requestAnimationFrame(raf);
  });

  onUnmounted(() => {
    // Уничтожаем экземпляр Lenis при уходе со страницы, чтобы избежать утечек памяти
    if (lenis) {
      lenis.destroy();
    }
  });
}