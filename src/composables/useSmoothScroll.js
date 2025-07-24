import { onMounted, onUnmounted } from 'vue';
import Lenis from '@studio-freight/lenis';

export function useSmoothScroll() {
  let lenis;

  onMounted(() => {
    lenis = new Lenis({
      // --- НОВЫЕ СБАЛАНСИРОВАННЫЕ НАСТРОЙКИ ---

      // `lerp` (коэффициент интерполяции) ~0.1 - это стандарт.
      // Он дает заметную плавность, но не слишком "тягучую".
      lerp: 0.1,

      // `duration` - оставляем стандартное значение,
      // так как `lerp` теперь главный параметр.
      duration: 1.2,

      // Убираем все кастомные `easing` функции,
      // чтобы Lenis использовал свой внутренний,
      // наиболее оптимизированный алгоритм.

      // --- КОНЕЦ НАСТРОЕК ---

      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);
  });

  onUnmounted(() => {
    if (lenis) {
      lenis.destroy();
    }
  });
}
