<script setup>
import FooterSection from './FooterSection.vue';

// УДАЛЕНО: defineProps(['navigateTo']);
// Эта строка была удалена, так как навигация теперь управляется vue-router.
</script>

<template>
  <main>
    <div class="main-container">
        <h1 class="font-bold text-panda-black text-4xl mb-4">Акции</h1>
        <p class="text-xl text-dark-gray leading-relaxed mb-6">Ознакомьтесь с нашими текущими акциями и специальными предложениями!</p>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="bg-light-gray rounded-lg overflow-hidden p-6 text-center">
                <img src="https://placehold.co/400x250/F7F7F7/131C26?text=Скидка%20на%20первый%20заказ" alt="Скидка на первый заказ" class="w-full h-auto object-cover rounded-md mb-4">
                <h2 class="font-bold text-panda-black text-2xl mb-2">Скидка 15% на первый заказ</h2>
                <p class="text-lg text-dark-gray mb-4">Для всех новых клиентов Red Panda.</p>
                <!-- ИЗМЕНЕНО: <button> заменен на <router-link> -->
                <router-link to="/" class="px-6 py-3 bg-panda-orange text-panda-white rounded-full text-lg hover:bg-orange-600 transition-colors">Воспользоваться</router-link>
            </div>
            <div class="bg-light-gray rounded-lg overflow-hidden p-6 text-center">
                <img src="https://placehold.co/400x250/F7F7F7/131C26?text=Скидка%20к%20школе" alt="Скидка к школе" class="w-full h-auto object-cover rounded-md mb-4">
                <h2 class="font-bold text-panda-black text-2xl mb-2">Скидка 10% до 1 сентября</h2>
                <p class="text-lg text-dark-gray mb-4">Подготовьтесь к новому учебному году или сезону с выгодой!</p>
                <!-- ИЗМЕНЕНО: <button> заменен на <router-link> -->
                <router-link to="/" class="px-6 py-3 bg-panda-orange text-panda-white rounded-full text-lg hover:bg-orange-600 transition-colors">Воспользоваться</router-link>
            </div>
        </div>
    </div>
    <FooterSection />
  </main>
</template>
