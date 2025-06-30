<script setup>
import BaseButton from '@/components/ui/BaseButton.vue';
// --- ИЗМЕНЕНИЕ: Импортируем компонент заголовка ---
import SectionHeader from '@/components/ui/SectionHeader.vue';
</script>

<template>
  <main class="py-10 md:py-25"> <div class="max-w-6xl mx-auto px-4">
        
        <SectionHeader class="gap-container">
          Акции
        </SectionHeader>
        
        <p class="text-h5-panda text-dark-gray leading-relaxed text-center max-w-2xl mx-auto mb-10">Ознакомьтесь с нашими текущими акциями и специальными предложениями!</p>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="bg-light-gray rounded-lg overflow-hidden p-6 text-center">
                <img src="/src/assets/images/pages/PromotionsPage/cupon-new-client.svg" alt="Скидка на первый заказ" class="w-full h-auto object-cover rounded-md mb-4">
                <h2 class="font-semibold text-panda-black text-h4-panda mb-2">Скидка 15% на первый заказ</h2>
                <p class="text-body-panda text-dark-gray mb-4">Для всех новых клиентов Red Panda.</p>
                <BaseButton to="/" variant="fill-orange">Воспользоваться</BaseButton>
            </div>
            <div class="bg-light-gray rounded-lg overflow-hidden p-6 text-center">
                <img src="/src/assets/images/pages/PromotionsPage/cupom-back-to-school.svg" alt="Скидка к школе" class="w-full h-auto object-cover rounded-md mb-4">
                <h2 class="font-semibold text-panda-black text-h4-panda mb-2">Скидка 10% до 1 сентября</h2>
                <p class="text-body-panda text-dark-gray mb-4">Подготовьтесь к новому учебному году или сезону с выгодой!</p>
                <BaseButton to="/" variant="fill-black">Воспользоваться</BaseButton>
            </div>
        </div>
    </div>
  </main>
</template>