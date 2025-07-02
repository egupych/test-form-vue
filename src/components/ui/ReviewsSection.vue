<script setup>
import { ref, computed } from 'vue';
import SectionHeader from '@/components/ui/SectionHeader.vue';

const reviews = ref([
 {
 id: 1,
 companyLogo: '/src/assets/images/pages/HomePage/TrustedBy/BI Group 1.svg',
 companyName: 'BI GROUP',
 text: 'Давно сотрудничаем с RED PANDA, всегда все выполняется в срок и качеством довольны. Отдельное спасибо Полине, несмотря на позднюю оплату и поздно отправленные макеты, визитки и брошюры готовы заранее. Каждый раз нам отправляли видео готовой продукции на обзор. Участвуем в Digital Bridge 2023, будем рады делиться контактами с клиентами, благодаря напечатанным визиткам. Упаковка напечатанных материалов очень милая, за это отдельное спасибо! Сервис на высоте.',
 author: 'Асхат Амаров',
 position: 'Руководитель департамента',
 photo: '/src/assets/images/pages/HomePage/Reviews/foto1.png' // Замените на реальный путь к фото
 },
 // Вы можете добавить больше отзывов сюда
 {
 id: 2,
 companyLogo: '/src/assets/images/pages/HomePage/TrustedBy/JFood.svg',
 companyName: 'BI GROUP 2',
 text: 'Текст второго отзыва для примера. Все очень понравилось, будем обращаться еще!',
 author: 'Иван Иванов',
 position: 'Менеджер',
 photo: '/src/assets/images/pages/HomePage/Reviews/foto1.png' // Временный заменитель фото
 }
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
 <div class="max-w-6xl mx-auto px-4">
 <SectionHeader class="gap-container">ОТЗЫВЫ</SectionHeader>

 <div class="reviews-slider relative overflow-hidden">
 <transition name="slide-fade" mode="out-in">
 <div :key="currentReview?.id" class="review-card flex flex-col items-center text-center">
 <img v-if="currentReview?.companyLogo" :src="currentReview.companyLogo" :alt="currentReview.companyName" class="max-h-16 object-contain mb-10">
 <p class="text-body-panda mb-6 px-6 md:px-16">
 «{{ currentReview?.text }}»
 </p>
 <img v-if="currentReview?.photo" :src="currentReview.photo" :alt="currentReview.author" class="w-40 h-40 rounded-full object-cover mb-3">
 <div class="font-semibold text-panda-black">
 <p class="text-h5-panda">{{ currentReview?.author }}</p>
 <p class="text-sm text-dark-gray">{{ currentReview?.position }}</p>
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
 <span class="text-sm text-dark-gray font-mono">{{ currentIndex + 1 }} из {{ totalReviews }}</span>
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
 min-height: 400px; /* Увеличим высоту под новую структуру */
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
 transform: translateX(50px);
}

.slide-fade-leave-to {
 opacity: 0;
 transform: translateX(-50px);
}


</style>