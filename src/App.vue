<script setup>
import { useSmoothScroll } from '@/composables/useSmoothScroll.js';
import FloatingActionButton from '@/components/ui/FloatingActionButton.vue';
import TheHeader from '@/components/ui/TheHeader.vue';
import TheFooter from '@/components/ui/TheFooter.vue';
// 1. Импортируем компонент уведомлений
import TheNotification from '@/components/ui/TheNotification.vue';

useSmoothScroll();
</script>

<template>
  <div class="site-container">
    <TheHeader />

    <main class="main-content">
      <router-view />
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
  flex-grow: 1;
}
</style>