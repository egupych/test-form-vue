<script setup>
import { useSmoothScroll } from '@/composables/useSmoothScroll.js';
import FloatingActionButton from '@/components/ui/FloatingActionButton.vue';
import TheHeader from '@/components/ui/TheHeader.vue';
import TheFooter from '@/components/ui/TheFooter.vue';
import TheNotification from '@/components/ui/TheNotification.vue';
import RunningTextLine from '@/components/ui/RunningTextLine.vue';

// --- НАЧАЛО ИЗМЕНЕНИЙ ---
import { useUiStore } from '@/stores/ui.js';
import CalculationForm from '@/components/ui/CalculationForm.vue';

// Инициализируем наше новое хранилище
const uiStore = useUiStore();
// --- КОНЕЦ ИЗМЕНЕНИЙ ---

useSmoothScroll();

const marqueeItems = [
  'По техническим причинам 29 июля мы работаем с 11:00',
  'По техническим причинам 29 июля мы работаем с 11:00',
  'По техническим причинам 29 июля мы работаем с 11:00'
];
</script>

<template>
  <div class="site-container">
    <TheHeader />
    <main class="main-content">
      <router-view v-slot="{ Component, route }">
        <transition :name="route.meta.transition || 'slide-left'" mode="out-in">
          <div :key="route.path" class="page-wrapper">
            <component :is="Component" />
          </div>
        </transition>
      </router-view>
    </main>
    <TheFooter />
    <TheNotification />
    <FloatingActionButton />

    <Teleport to="body">
      <transition name="popup">
        <div v-if="uiStore.isCalcFormVisible" class="popup-overlay" @click.self="uiStore.closeCalcForm()">
          <div class="popup-container">
            <button @click="uiStore.closeCalcForm()" class="popup-close-button">&times;</button>
            <CalculationForm />
          </div>
        </div>
      </transition>
    </Teleport>
    </div>
</template>

<style scoped>
/* Стили для .site-container, .main-content и анимаций остаются без изменений */
.site-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #F7F7F7;
  padding-top: 6rem;
}
.main-content {
  position: relative;
  flex-grow: 1;
  display: grid;
  overflow: hidden;
}
.page-wrapper {
  grid-area: 1 / 1;
  width: 100%;
}
.slide-left-enter-active,
.slide-left-leave-active,
.slide-right-enter-active,
.slide-right-leave-active {
  transition: transform 0.2s ease-in-out, opacity 0.2s ease-in-out;
}
.slide-left-enter-from { opacity: 0; transform: translateX(2rem); }
.slide-left-leave-to { opacity: 0; transform: translateX(-2rem); }
.slide-right-enter-from { opacity: 0; transform: translateX(-2rem); }
.slide-right-leave-to { opacity: 0; transform: translateX(2rem); }

/* --- НАЧАЛО ИЗМЕНЕНИЙ: Стили для попапа, перенесенные из HeroSection --- */
.popup-overlay {
  position: fixed; top: 0; left: 0; width: 100%; height: 100%;
  background-color: rgba(19, 28, 38, 0.8);
  backdrop-filter: blur(0.3125rem);
  display: flex; justify-content: center; align-items: center;
  z-index: 1000; padding: 1rem;
}
.popup-container {
  position: relative; background: white;
  box-shadow: 0 0.625rem 1.875rem rgba(0, 0, 0, 0.2);
  width: 100%; max-width: 71.25rem;
  transform: scale(1); transition: transform 0.3s ease;
  overflow-y: auto; max-height: 95vh;
}
.popup-container > :deep(.form-wrapper) {
  padding: 4rem !important;
}
@media (min-width: 48rem) {
  .popup-container > :deep(.form-wrapper) { padding: 7rem !important; }
}
.popup-close-button {
  position: absolute; top: 0.9375rem; right: 1.375rem;
  background: none; border: none; font-size: 2.5rem; line-height: 1;
  color: #8F8F8F; cursor: pointer; transition: color 0.2s;
  z-index: 1001;
}
.popup-close-button:hover { color: #131C26; }
.popup-enter-active, .popup-leave-active { transition: opacity 0.3s ease; }
.popup-enter-from, .popup-leave-to { opacity: 0; }
.popup-enter-active .popup-container, .popup-leave-active .popup-container {
    transition: all 0.3s ease;
}
.popup-enter-from .popup-container, .popup-leave-to .popup-container {
    transform: scale(0.95);
}
/* --- КОНЕЦ ИЗМЕНЕНИЙ --- */
</style>