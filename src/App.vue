<script setup>
import { useSmoothScroll } from '@/composables/useSmoothScroll.js';
import FloatingActionButton from '@/components/ui/FloatingActionButton.vue';
import TheHeader from '@/components/ui/TheHeader.vue';
import TheFooter from '@/components/ui/TheFooter.vue';
import TheNotification from '@/components/ui/TheNotification.vue';

useSmoothScroll();
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
  </div>
</template>

<style scoped>
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

/*
  Возвращаем тот самый стиль анимации, который тебе понравился.
  Продолжительность transition — 0.2s.
*/
.slide-left-enter-active,
.slide-left-leave-active,
.slide-right-enter-active,
.slide-right-leave-active {
  transition: transform 0.2s ease-in-out, opacity 0.2s ease-in-out;
}

/* Анимация "ВПЕРЁД" (slide-left) */
.slide-left-enter-from {
  opacity: 0;
  transform: translateX(2rem);
}
.slide-left-leave-to {
  opacity: 0;
  transform: translateX(-2rem);
}

/* Анимация "НАЗАД" (slide-right) */
.slide-right-enter-from {
  opacity: 0;
  transform: translateX(-2rem);
}
.slide-right-leave-to {
  opacity: 0;
  transform: translateX(2rem);
}
</style>