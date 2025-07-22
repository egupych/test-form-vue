<script setup>
// --- НАЧАЛО ОПИСАНИЯ КОДА ---
// Этот компонент представляет собой "главный экран" или "hero" секцию на главной странице.
// Он включает в себя большой текстовый логотип, призыв к действию (CTA) с кнопкой, открывающей
// попап с формой расчёта, и анимированный видео-элемент в виде круга, который при клике
// открывает видео в полноэкранном попапе. Компонент полностью адаптивен.
// --- КОНЕЦ ОПИСАНИЯ КОДА ---
import { ref, nextTick } from 'vue';
import BaseButton from '@/components/ui/BaseButton.vue';
import CalculationForm from '@/components/ui/CalculationForm.vue';

const isCalcPopupVisible = ref(false);
const isVideoPopupVisible = ref(false);
const popupVideo = ref(null);

const openCalcPopup = () => {
  isCalcPopupVisible.value = true;
};
const closeCalcPopup = () => {
  isCalcPopupVisible.value = false;
};

const openVideoPopup = () => {
  isVideoPopupVisible.value = true;
  nextTick(() => {
    if (popupVideo.value) {
      popupVideo.value.currentTime = 0;
      popupVideo.value.play();
    }
  });
};
const closeVideoPopup = () => {
  if (popupVideo.value) {
    popupVideo.value.pause();
  }
  isVideoPopupVisible.value = false;
};
</script>

<template>
  <section class="relative w-full bg-light-gray overflow-hidden">
    <div class="hero-container">
      <div class="hero-content-wrapper">
        <img
          src="@/assets/images/layout/red-panda-text-logo.svg"
          alt="RED PANDA"
          class="hero-text-logo"
        />

        <div class="hero-cta">
          <h2 class="text-h4-panda font-semibold text-panda-black">Современная полиграфия<br>для вашего бизнеса</h2>
          <p class="text-body-panda text-dark-gray mt-2 mb-4 max-w-md">
              Введите ваш номер телефона, и мы свяжемся с вами <br>для консультации и расчёта стоимости вашего заказа.
          </p>
          <BaseButton @click="openCalcPopup" variant="fill-orange">
            Рассчитать стоимость
          </BaseButton>
        </div>

        <div @click="openVideoPopup" class="hero-video-orb group">
            <video
              class="rounded-full w-full h-full object-cover grayscale transition duration-500 group-hover:grayscale-0"
              src="@/assets/videos/hero-video.mp4"
              autoplay loop muted playsinline>
            </video>
            <div class="absolute inset-0 z-30 flex items-center justify-center rounded-full bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div class="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center scale-90 group-hover:scale-100 transition-all duration-300 ease-in-out">
                    <svg class="w-8 h-8 text-white ml-1" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M8 5.14v14l11-7-11-7z"></path>
                    </svg>
                </div>
            </div>
        </div>
      </div>
    </div>

    <Teleport to="body">
      <transition name="popup">
        <div v-if="isCalcPopupVisible" class="popup-overlay" @click.self="closeCalcPopup">
          <div class="popup-container">
            <button @click="closeCalcPopup" class="popup-close-button">&times;</button>
            <CalculationForm />
          </div>
        </div>
      </transition>
    </Teleport>

    <Teleport to="body">
       <transition name="popup">
        <div v-if="isVideoPopupVisible" class="popup-overlay video-popup" @click.self="closeVideoPopup">
          <div class="video-container">
            <button @click="closeVideoPopup" class="popup-close-button video-close-button">&times;</button>
            <video
              ref="popupVideo"
              src="@/assets/videos/hero-video.mp4"
              controls
              class="w-full h-full rounded-lg"
            ></video>
          </div>
        </div>
      </transition>
    </Teleport>

  </section>
</template>

<style scoped>
/* Главный контейнер для центрирования всего блока */
.hero-container {
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: 6.5rem;
  padding-bottom: 1rem;
}

/* Относительный контейнер, к которому будут привязаны дочерние элементы */
.hero-content-wrapper {
  position: relative;
  width: 100%;
  max-width: 71.25rem; /* 1140px -> 71.25rem */
  aspect-ratio: 1140 / 423;
}

/* Фоновый логотип */
.hero-text-logo {
  width: 100%;
  height: 100%;
  object-fit: contain;
  pointer-events: none;
}

.hero-cta {
  position: absolute;
  top: 0;
  right: 0;
  z-index: 20;
  text-align: left;
}

/* Блок с видео */
.hero-video-orb {
  position: absolute;
  bottom: 0;
  left: 0;
  z-index: 20;
  width: 12rem;
  height: 12rem;
  cursor: pointer;
}

/* Адаптация для мобильных устройств */
@media (max-width: 48rem) { /* 768px -> 48rem */

  .hero-content-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    /* [ИЗМЕНЕНИЕ] Уменьшаем отступ между элементами до 1rem */
    gap: 1rem; 
    /* [КОНЕЦ ИЗМЕНЕНИЯ] */
    position: static;
    aspect-ratio: auto;
  }
  .hero-text-logo, .hero-cta, .hero-video-orb {
    position: static;
    width: auto;
    height: auto;
    margin: 0;
    padding: 0;
  }
  
  /* [ИЗМЕНЕНИЕ] Меняем порядок и центрируем элементы */
  .hero-text-logo { order: 1; width: 100%; }
  .hero-cta { order: 2; text-align: center; }
  .hero-cta p { margin-left: auto; margin-right: auto; }

  /* Скрываем видео-блок и центрируем лого */
  .hero-video-orb { order: 3; display: none; }
  /* [КОНЕЦ ИЗМЕНЕНИЯ] */
}


/* --- Стили для попапов (без изменений) --- */
.popup-overlay {
  position: fixed; top: 0; left: 0; width: 100%; height: 100%;
  background-color: rgba(19, 28, 38, 0.8);
  backdrop-filter: blur(0.3125rem); /* 5px -> 0.3125rem */
  display: flex; justify-content: center; align-items: center;
  z-index: 1000; padding: 1rem;
}
.popup-container {
  position: relative; background: white;
  box-shadow: 0 0.625rem 1.875rem rgba(0, 0, 0, 0.2); /* 10px 30px -> 0.625rem 1.875rem */
  width: 100%; max-width: 71.25rem; /* 1140px -> 71.25rem */
  transform: scale(1); transition: transform 0.3s ease;
  overflow-y: auto; max-height: 95vh;
}
.popup-container > :deep(.form-wrapper) {
  padding: 4rem !important;
}
@media (min-width: 48rem) { /* 768px -> 48rem */
  .popup-container > :deep(.form-wrapper) { padding: 7rem !important; }
}
.popup-close-button {
  position: absolute; top: 0.9375rem; right: 1.375rem; /* 15px -> 0.9375rem; 22px -> 1.375rem */
  background: none; border: none; font-size: 2.5rem; line-height: 1;
  color: #8F8F8F; cursor: pointer; transition: color 0.2s;
  z-index: 1001;
}
.popup-close-button:hover { color: #131C26; }
.popup-enter-active, .popup-leave-active { transition: opacity 0.3s ease; }
.popup-enter-from, .popup-leave-to { opacity: 0; }
.popup-enter-active .popup-container, .popup-leave-active .popup-container,
.popup-enter-active .video-container, .popup-leave-active .video-container {
    transition: all 0.3s ease;
}
.popup-enter-from .popup-container, .popup-leave-to .popup-container,
.popup-enter-from .video-container, .popup-leave-to .video-container {
    transform: scale(0.95);
}
.video-container {
  width: 90%; max-width: 80rem; /* 1280px -> 80rem */
  aspect-ratio: 16 / 9;
  position: relative; transition: transform 0.3s ease;
}
.video-close-button {
  color: #a0a0a0; top: -2.5rem; right: 0; transform: scale(1.2); /* -40px -> -2.5rem */
}
.video-close-button:hover { color: white; }
video { outline: none; }
</style>