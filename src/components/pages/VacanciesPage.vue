<script setup>
import { ref } from 'vue';
import BaseButton from '@/components/ui/BaseButton.vue';
import SectionHeader from '@/components/ui/SectionHeader.vue';
import TalentReserveForm from '@/components/ui/TalentReserveForm.vue';
import VacancyApplicationForm from '@/components/ui/VacancyApplicationForm.vue';
// 1. Импортируем наше новое хранилище
import { useVacanciesStore } from '@/stores/vacancies.js';

// 2. Получаем доступ к данным из хранилища
const vacanciesStore = useVacanciesStore();
const vacancies = vacanciesStore.list; // Используем список вакансий из Pinia

// Логика для управления всплывающим окном остается без изменений
const isPopupOpen = ref(false);
const selectedVacancyTitle = ref('');

const openPopup = (vacancyTitle) => {
  selectedVacancyTitle.value = vacancyTitle;
  isPopupOpen.value = true;
};

const closePopup = () => {
  isPopupOpen.value = false;
};
</script>

<template>
  <main class="py-10 md:py-25">
    <div class="max-w-6xl mx-auto">

      <section>
        <SectionHeader class="gap-container">
          Вакансии
        </SectionHeader>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            <div v-for="vacancy in vacancies" :key="vacancy.id" class="bg-white p-8 relative">
                <div class="flex justify-between items-start">
                    <h3 class="text-h4-panda font-bold text-gray-900 leading-tight">{{ vacancy.title }}</h3>
                    <div class="flex gap-2 ml-4">
                        <span v-for="tag in vacancy.tags" :key="tag" class="rounded-full py-2 px-4 text-sm font-medium text-dark-gray border whitespace-nowrap">{{ tag }}</span>
                    </div>
                </div>
                <div class=" text-body-panda mb-4">{{ vacancy.salary }}</div>
                <div class="mb-4">
                    <div class="text-panda-orange font-bold text-body-panda mb-1">Условия</div>
                    <div class="text-gray-800 text-body-panda leading-relaxed">{{ vacancy.conditions }}</div>
                </div>
                <div class="mb-4">
                    <div class="text-panda-orange font-bold text-body-panda mb-1">Обязанности</div>
                    <ol class="list-decimal list-inside text-gray-800 text-body-panda leading-relaxed space-y-1">
                        <li v-for="(resp, index) in vacancy.responsibilities" :key="index" class="pl-1" v-html="resp"></li>
                    </ol>
                </div>
                <BaseButton @click="openPopup(vacancy.title)" variant="fill-black">Откликнуться</BaseButton>
            </div>
        </div>
      </section>

      <div class="gap-page">
        <TalentReserveForm />
      </div>

    </div>

    <Teleport to="body">
      <transition name="popup">
        <div v-if="isPopupOpen" class="popup-overlay" @click.self="closePopup">
          <div class="popup-container">
            <button @click="closePopup" class="popup-close-button">&times;</button>
            <VacancyApplicationForm :position-title="selectedVacancyTitle" />
          </div>
        </div>
      </transition>
    </Teleport>
  </main>
</template>

<style scoped>
/* Стили остаются без изменений */
.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(19, 28, 38, 0.8);
  backdrop-filter: blur(5px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 1rem;
}
.popup-container {
  position: relative;
  background: white;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 1140px;
  transform: scale(1);
  transition: transform 0.3s ease;
  overflow-y: auto;
  max-height: 95vh;
}
.popup-container > :deep(.form-wrapper) {
  padding: 4rem !important;
}
@media (min-width: 1024px) {
  .popup-container > :deep(.form-wrapper) {
    padding: 6rem !important;
  }
}
.popup-close-button {
  position: absolute;
  top: 15px;
  right: 22px;
  background: none;
  border: none;
  font-size: 2.5rem;
  line-height: 1;
  color: #8F8F8F;
  cursor: pointer;
  transition: color 0.2s;
  z-index: 1001;
}
.popup-close-button:hover {
  color: #131C26;
}
.popup-enter-active, .popup-leave-active { transition: opacity 0.3s ease; }
.popup-enter-from, .popup-leave-to { opacity: 0; }
.popup-enter-active .popup-container, .popup-leave-active .popup-container { transition: all 0.3s ease; }
.popup-enter-from .popup-container, .popup-leave-to .popup-container { transform: scale(0.95); }
</style>