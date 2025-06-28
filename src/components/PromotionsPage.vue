<script setup>
import BaseButton from './BaseButton.vue';
</script>

<template>
  <main>
    <div class="main-container">
        <h1 class="font-bold text-panda-black text-h1-panda mb-4">Акции</h1>
        <p class="text-h5-panda text-dark-gray leading-relaxed mb-6">Ознакомьтесь с нашими текущими акциями и специальными предложениями!</p>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="bg-light-gray rounded-lg overflow-hidden p-6 text-center">
                <img src="https://placehold.co/400x250/F7F7F7/131C26?text=Скидка%20на%20первый%20заказ" alt="Скидка на первый заказ" class="w-full h-auto object-cover rounded-md mb-4">
                <h2 class="font-semibold text-panda-black text-h4-panda mb-2">Скидка 15% на первый заказ</h2>
                <p class="text-body-panda text-dark-gray mb-4">Для всех новых клиентов Red Panda.</p>
                <BaseButton to="/" variant="fill-orange">Воспользоваться</BaseButton>
            </div>
            <div class="bg-light-gray rounded-lg overflow-hidden p-6 text-center">
                <img src="https://placehold.co/400x250/F7F7F7/131C26?text=Скидка%20к%20школе" alt="Скидка к школе" class="w-full h-auto object-cover rounded-md mb-4">
                <h2 class="font-semibold text-panda-black text-h4-panda mb-2">Скидка 10% до 1 сентября</h2>
                <p class="text-body-panda text-dark-gray mb-4">Подготовьтесь к новому учебному году или сезону с выгодой!</p>
                <BaseButton to="/" variant="fill-black">Воспользоваться</BaseButton>
            </div>
        </div>
    </div>
  </main>
</template>