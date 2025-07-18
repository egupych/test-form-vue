<script setup>
import { ref } from 'vue';
import BaseButton from '@/components/ui/BaseButton.vue';
import SectionHeader from '@/components/ui/SectionHeader.vue';
import CalculationForm from '@/components/ui/CalculationForm.vue';

// --- ИЗМЕНЕНИЕ: Импортируем изображения как модули ---
import cuponNewClient from '@/assets/images/pages/PromotionsPage/cupon-new-client.svg';
import cupomBackToSchool from '@/assets/images/pages/PromotionsPage/cupom-back-to-school.svg';

const promotions = ref([
  {
    id: 1,
    title: 'Скидка 10% на первый заказ',
    description: 'Для всех новых клиентов Red Panda.',
    // --- ИЗМЕНЕНИЕ: Используем импортированные переменные ---
    image: cuponNewClient,
    promo: 'NEW10',
    buttonVariant: 'fill-black',
  },
  {
    id: 2,
    title: 'Скидка 10% до 1 сентября',
    description: 'Подготовьтесь к новому учебному году или сезону с выгодой!',
    // --- ИЗМЕНЕНИЕ: Используем импортированные переменные ---
    image: cupomBackToSchool,
    promo: 'SCHOOL10',
    buttonVariant: 'fill-black',
  }
]);

const isPopupVisible = ref(false);
const activePromoCode = ref('');

const openPopup = (promoCode) => {
  activePromoCode.value = promoCode;
  isPopupVisible.value = true;
};

const closePopup = () => {
  isPopupVisible.value = false;
  activePromoCode.value = '';
};
</script>

<template>
  <main class="py-10 md:py-25">
    <div class="max-w-6xl mx-auto px-4">
        <SectionHeader class="gap-container">Акции</SectionHeader>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div v-for="promo in promotions" :key="promo.id" class="bg-light-gray overflow-hidden p-6 text-center">
                <img :src="promo.image" :alt="promo.title" class="w-full h-auto object-cover mb-4">
                <h2 class="font-semibold text-panda-black text-h4-panda mb-2">{{ promo.title }}</h2>
                <p class="text-body-panda text-dark-gray mb-4">{{ promo.description }}</p>
                <BaseButton @click="openPopup(promo.promo)" :variant="promo.buttonVariant">
                  Воспользоваться
                </BaseButton>
            </div>
        </div>
    </div>

    <Teleport to="body">
      <transition name="popup">
        <div v-if="isPopupVisible" class="popup-overlay" @click.self="closePopup">
          <div class="popup-container">
            <button @click="closePopup" class="popup-close-button">&times;</button>
            <CalculationForm :promo-code="activePromoCode" />
          </div>
        </div>
      </transition>
    </Teleport>
  </main>
</template>

<style scoped>
.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  /* --- ИЗМЕНЕНИЯ ЗДЕСЬ --- */
  background-color: rgba(19, 28, 38, 0.8); /* Цвет как на главной для единообразия */
  backdrop-filter: blur(0.3125rem);            /* 5px -> 0.3125rem. Эффект размытия фона */
  /* --- КОНЕЦ ИЗМЕНЕНИЙ --- */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 1rem; /* Добавим отступы для маленьких экранов */
}

.popup-container {
  position: relative;
  background: white;
  /* border-radius: 16px; - убрали скругление */
  box-shadow: 0 0.625rem 1.875rem rgba(0, 0, 0, 0.2); /* 10px 30px -> 0.625rem 1.875rem */
  width: 100%; /* Ширина будет зависеть от контента */
  max-width: 71.25rem; /* 1140px -> 71.25rem. Ограничим максимальную ширину */
  transform: scale(1);
  transition: transform 0.3s ease;
  overflow-y: auto; /* Добавим скролл на случай, если форма не помещается */
  max-height: 95vh; /* Ограничим высоту */
}

/* Убираем padding у формы, когда она внутри попапа */
.popup-container > :deep(.form-wrapper) {
  padding: 7rem !important; /* Используем important, чтобы перебить Tailwind классы */
}

.popup-close-button {
  position: absolute;
  top: 0.9375rem;  /* 15px -> 0.9375rem */
  right: 1.375rem; /* 22px -> 1.375rem */
  background: none;
  border: none;
  font-size: 2.5rem;
  line-height: 1;
  color: #8F8F8F;
  cursor: pointer;
  transition: color 0.2s;
  z-index: 1;
}

.popup-close-button:hover {
  color: #131C26;
}

.popup-enter-active,
.popup-leave-active {
  transition: opacity 0.3s ease;
}
.popup-enter-from,
.popup-leave-to {
  opacity: 0;
}
.popup-enter-active .popup-container,
.popup-leave-active .popup-container {
  transition: all 0.3s ease;
}
.popup-enter-from .popup-container,
.popup-leave-to .popup-container {
  transform: scale(0.95);
}
</style>