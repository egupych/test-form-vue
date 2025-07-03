<script setup>
import { ref, nextTick } from 'vue';
import BaseButton from '@/components/ui/BaseButton.vue';
import CalculationForm from '@/components/ui/CalculationForm.vue';

// Состояние для попапа с формой расчета
const isCalcPopupVisible = ref(false);

// Состояние для попапа с видео
const isVideoPopupVisible = ref(false);
const popupVideo = ref(null); // Ссылка на HTML-элемент видео в попапе

const openCalcPopup = () => {
  isCalcPopupVisible.value = true;
};
const closeCalcPopup = () => {
  isCalcPopupVisible.value = false;
};

// Функции для управления видео-попапом
const openVideoPopup = () => {
  isVideoPopupVisible.value = true;
  // Ждем, пока VUE обновит DOM и видео появится на странице
  nextTick(() => {
    if (popupVideo.value) {
      popupVideo.value.currentTime = 0; // Сбрасываем видео на начало
      popupVideo.value.play(); // Запускаем проигрывание
    }
  });
};
const closeVideoPopup = () => {
  if (popupVideo.value) {
    popupVideo.value.pause(); // Ставим на паузу при закрытии
  }
  isVideoPopupVisible.value = false;
};
</script>

<template>
  <section class="relative w-full bg-light-gray overflow-hidden">
    <div class="max-w-6xl mx-auto px-4">
      <div class="relative w-full h-[50vh] md:h-[70vh]">
        
        <div class="absolute top-1/4 right-0 transform -translate-y-1/2 text-right z-20">
          <h2 class="text-h4-panda font-semibold text-panda-black">Современная полиграфия<br>для вашего бизнеса</h2>
          <p class="text-body-panda text-dark-gray mt-2 mb-6 ml-auto max-w-md">
              Введите ваш номер телефона, и мы свяжемся с вами для консультации и расчёта стоимости вашего заказа.
          </p>
          <BaseButton @click="openCalcPopup" variant="fill-orange">
            Рассчитать стоимость
          </BaseButton>
        </div>

        <div class="absolute bottom-0 left-0 w-52 h-52 md:w-56 md:h-56 z-10 flex items-center justify-center">
            
            <div class="absolute inset-0 pointer-events-none">
                 <svg class="w-full h-full overflow-visible transition-transform duration-500 ease-in-out group-hover:rotate-12">
                    <path id="curve" fill="transparent" d="M 183,67 A 78,78 0 0 1 183,141"></path>
                    <text class="text-sm font-semibold uppercase tracking-widest" fill="#131C26">
                        <textPath xlink:href="#curve" startOffset="50%" text-anchor="middle">немного о нас</textPath>
                    </text>
                </svg>
            </div>

            <div @click="openVideoPopup" class="relative group w-40 h-40 md:w-48 md:h-48 cursor-pointer">
                <video 
                class="rounded-full w-full h-full object-cover grayscale transition duration-500 group-hover:grayscale-0"
                src="@/assets/videos/hero-video.mp4" 
                autoplay 
                loop 
                muted 
                playsinline>
                </video>

                <div class="absolute inset-0 z-30 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div class="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm scale-90 group-hover:scale-100 transition-all duration-300 ease-in-out">
                        <svg class="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
                        </svg>
                    </div>
                </div>
            </div>
        </div>

        <div class="absolute inset-0 flex flex-col justify-center items-center pointer-events-none -z-0">
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
/* Стили для попапа с формой */
.popup-overlay {
  position: fixed; top: 0; left: 0; width: 100%; height: 100%;
  background-color: rgba(19, 28, 38, 0.8);
  backdrop-filter: blur(5px);
  display: flex; justify-content: center; align-items: center;
  z-index: 1000; padding: 1rem;
}
.popup-container {
  position: relative; background: white;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  width: 100%; max-width: 1140px;
  transform: scale(1); transition: transform 0.3s ease;
  overflow-y: auto; max-height: 95vh;
}
.popup-container > :deep(.form-wrapper) {
  padding: 4rem !important;
}
@media (min-width: 768px) {
  .popup-container > :deep(.form-wrapper) { padding: 7rem !important; }
}
.popup-close-button {
  position: absolute; top: 15px; right: 22px;
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

/* Стили для попапа с видео */
.video-container {
  width: 90%;
  max-width: 1280px;
  aspect-ratio: 16 / 9;
  position: relative;
  transition: transform 0.3s ease;
}
.video-close-button {
  color: #a0a0a0;
  top: -40px; 
  right: 0;
  transform: scale(1.2);
}
.video-close-button:hover {
  color: white;
}
video {
    outline: none;
}
</style>