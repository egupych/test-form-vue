<script setup>
import BaseButton from '@/components/ui/BaseButton.vue';
</script>

<template>
  <main class="py-10 md:py-25"> <div class="max-w-6xl mx-auto px-4">
      
      <section>
        <h1 class="font-bold text-panda-black text-h1-panda mb-4">Фирменный стиль для гостиницы Dostyk Lux</h1>
        <p class="text-h5-panda text-dark-gray leading-relaxed mb-8">Современный стиль, с заботой о людях. Здесь представлены различные элементы разработанного фирменного стиля.</p>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="bg-light-gray rounded-lg overflow-hidden flex flex-col items-center">
                <img src="https://placehold.co/800x400/F7F7F7/131C26?text=Визитка%20Dostyk%20lux" alt="Визитка Dostyk lux" class="w-full h-auto object-cover">
                <div class="p-4 text-center">
                    <h3 class="font-semibold text-panda-black text-h5-panda mb-1">Визитная карточка</h3>
                    <p class="text-body-panda text-dark-gray">Современный дизайн с акцентом на бренд.</p>
                </div>
            </div>
            <div class="grid grid-cols-2 gap-4">
                <div class="bg-light-gray rounded-lg">
                    <img src="https://placehold.co/400x200/F7F7F7/131C26?text=Ключ" alt="Ключ" class="w-full h-auto object-cover">
                    <div class="p-2 text-center"><p class="text-small-panda text-dark-gray">Брелок для ключей</p></div>
                </div>
                <div class="bg-light-gray rounded-lg">
                    <img src="https://placehold.co/400x200/F7F7F7/131C26?text=Календарь" alt="Календарь" class="w-full h-auto object-cover">
                    <div class="p-2 text-center"><p class="text-small-panda text-dark-gray">Настольный календарь</p></div>
                </div>
                <div class="bg-light-gray rounded-lg">
                    <img src="https://placehold.co/400x200/F7F7F7/131C26?text=Меню" alt="Меню" class="w-full h-auto object-cover">
                    <div class="p-2 text-center"><p class="text-small-panda text-dark-gray">Дизайн меню</p></div>
                </div>
                <div class="bg-light-gray rounded-lg">
                    <img src="https://placehold.co/400x200/F7F7F7/131C26?text=Табличка" alt="Табличка" class="w-full h-auto object-cover">
                    <div class="p-2 text-center"><p class="text-small-panda text-dark-gray">Дверные таблички</p></div>
                </div>
            </div>
        </div>
      </section>

      <section class="gap-page">
        <h2 class="font-semibold text-panda-orange text-[18px] leading-[130%] gap-container">
            ДОПОЛНИТЕЛЬНЫЕ ЭЛЕМЕНТЫ СТИЛЯ
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <img src="https://placehold.co/600x400/F7F7F7/131C26?text=Рекламный%20макет" alt="Рекламный макет" class="w-full h-auto object-cover rounded-lg">
            <img src="https://placehold.co/600x400/F7F7F7/131C26?text=Набор%20фирменного%20стиля" alt="Набор фирменного стиля" class="w-full h-auto object-cover rounded-lg">
            <img src="https://placehold.co/600x400/F7F7F7/131C26?text=Пример%20вывески" alt="Пример вывески" class="w-full h-auto object-cover rounded-lg">
        </div>
        <BaseButton to="/gallery" variant="fill-black" class="mt-8">← Вернуться к нашим работам</BaseButton>
      </section>
    </div>
  </main>
</template>