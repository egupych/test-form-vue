<script setup>
import { ref, computed } from 'vue';
import SectionHeader from '@/components/ui/SectionHeader.vue';

// --- ИЗМЕНЕНИЕ: Импортируем изображения ---
import azam from '@/assets/images/pages/HomePage/TrustedBy/azam.svg';
import attech from '@/assets/images/pages/HomePage/TrustedBy/attech.svg';
import angus from '@/assets/images/pages/HomePage/TrustedBy/angus.svg';
// import photoAskhat from '@/assets/images/pages/HomePage/Reviews/foto1.png';

const reviews = ref([
  {
    id: 1,
    // --- ИЗМЕНЕНИЕ: Используем импортированные переменные ---
    companyLogo: attech,
    companyName: 'Attech',
    text: 'Компания Attech выражает Вам благодарность за быстрое и качественное обслуживание! Особая благодарность менеджеру Алине! Быстро и чётко отработали заказ! Работы были сделаны качественно и в срок!!! Успехов и процветания Вашей команде!',
    author: 'Алина Имашева',
    //  position: 'Руководитель департамента',
    //  photo: photoAskhat
  },
  {
    id: 2,
    // --- ИЗМЕНЕНИЕ: Используем импортированные переменные ---
    companyLogo: azam,
    companyName: 'AZAM-KC',
    text: 'Мы завод элеваторного оборудования AZAM. Работаем с ребятами много лет, никогда не подводили, даже, когда наши сроки "горели"! Вежливые менеджеры: Юлия, Андрей, Лаура, подскажут, сориентируют, всегда на связи! Печатаем журналы, брошюры, визитки, баннеры на выставку, растяжки, паспорты на наше оборудование, инструкции по эксплуатации. Благодарим команду за слаженную работу! Так держать, ребята!',
    author: 'AZAM-KC Zernosushilnoe oborudovanie',
    //  position: 'Руководитель департамента',
    //  photo: photoAskhat
  },
  {
    id: 3,
    // --- ИЗМЕНЕНИЕ: Используем импортированные переменные ---
    companyLogo: angus,
    companyName: 'Angus',
    text: 'Наша компания уже достаточно долгое время сотрудничает с полиграфией RED PANDA. Всегда все заказы выполняются очень быстро и качественно!!! Отдельная благодарность менеджеру Лауре за оперативную и качественную работу. Надеемся на долгое сотрудничество!!! Успехов и процветания вашей компании!!!',
    author: 'Республиканская палата Ангус Казахстана',
    //  position: 'Руководитель департамента',
    //  photo: photoAskhat
  },
]);

const currentIndex = ref(0);

const currentReview = computed(() => reviews.value?.[currentIndex.value]);
const totalReviews = computed(() => reviews.value?.length);

const prevReview = () => {
  if (currentIndex.value > 0) {
    currentIndex.value--;
  }
};

const nextReview = () => {
  if (currentIndex.value < totalReviews.value - 1) {
    currentIndex.value++;
  }
};
</script>

<template>
  <div class="">
    <div class="max-w-6xl mx-auto">
      <SectionHeader class="gap-container">ОТЗЫВЫ</SectionHeader>

      <div class="reviews-slider relative overflow-hidden">
        <transition name="slide-fade" mode="out-in">
          <div
            :key="currentReview?.id"
            class="review-card flex flex-col items-center text-center"
          >
            <img
              v-if="currentReview?.companyLogo"
              :src="currentReview.companyLogo"
              :alt="currentReview.companyName"
              class="max-h-16 object-contain mb-10"
            />
            <p class="text-body-panda mb-6 px-6 md:px-16 max-w-3xl">
              «{{ currentReview?.text }}»
            </p>
            <img
              v-if="currentReview?.photo"
              :src="currentReview.photo"
              :alt="currentReview.author"
              class="w-40 h-40 rounded-full object-cover mb-3"
            />
            <div class="font-semibold text-panda-black">
              <p class="text-h5-panda">{{ currentReview?.author }}</p>
              <p class="text-sm text-dark-gray">
                {{ currentReview?.position }}
              </p>
            </div>
          </div>
        </transition>
      </div>

      <div class="flex justify-center items-center mt-8 gap-4">
        <button
          @click="prevReview"
          :disabled="currentIndex === 0"
          class="px-5 py-1.5 bg-transparent text-dark-gray text-sm font-semibold border border-gray rounded-full hover:bg-gray disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          назад
        </button>
        <span class="text-sm text-dark-gray font-mono"
          >{{ currentIndex + 1 }} из {{ totalReviews }}</span
        >
        <button
          @click="nextReview"
          :disabled="currentIndex === totalReviews - 1"
          class="px-5 py-1.5 bg-transparent text-dark-gray text-sm font-semibold border border-gray rounded-full hover:bg-gray disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          вперёд
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.reviews-slider {
  min-height: 20rem; /* Увеличим высоту под новую структуру */
  display: flex;
  align-items: center; /* Вертикальное выравнивание по центру */
  justify-content: center; /* Горизонтальное выравнивание по центру, если нужно */
}

.review-card {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

/* Анимация для слайдера */
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.4s ease-out;
}

.slide-fade-enter-from {
  opacity: 0;
  transform: translateX(3.125rem);
}

.slide-fade-leave-to {
  opacity: 0;
  transform: translateX(-3.125rem);
}
</style>
