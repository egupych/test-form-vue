<script setup>
// --- ИЗМЕНЕНИЕ: Обновлен путь к компоненту BaseButton ---
import BaseButton from '../ui/BaseButton.vue';
</script>

<template>
  <main>
    <div class="main-container">
        <h1 class="font-bold text-panda-black text-h1-panda mb-4">Наш Магазин</h1>
        <p class="text-h5-panda text-dark-gray leading-relaxed mb-6">Здесь вы найдете наши продукты и услуги. В будущем здесь будут динамически загружаться товары с ценами и возможностью добавления в корзину.</p>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div class="bg-light-gray rounded-lg overflow-hidden">
                <img src="https://placehold.co/400x300/F7F7F7/131C26?text=Товар%201" alt="Товар 1" class="w-full h-48 object-cover rounded-t-lg">
                <div class="p-4">
                    <h3 class="font-semibold text-panda-black text-h5-panda mb-1">Печать листовок</h3>
                    <p class="text-small-panda text-dark-gray">От 1000 шт.</p>
                    <p class="font-bold text-panda-orange mt-2 text-body-panda">Цена: $50</p>
                    <BaseButton class="mt-3">В корзину</BaseButton>
                </div>
            </div>
            <div class="bg-light-gray rounded-lg overflow-hidden">
                <img src="https://placehold.co/400x300/F7F7F7/131C26?text=Товар%202" alt="Товар 2" class="w-full h-48 object-cover rounded-t-lg">
                <div class="p-4">
                    <h3 class="font-semibold text-panda-black text-h5-panda mb-1">Дизайн логотипов</h3>
                    <p class="text-small-panda text-dark-gray">Разработка уникального стиля.</p>
                    <p class="font-bold text-panda-orange mt-2 text-body-panda">Цена: $200</p>
                    <BaseButton class="mt-3">В корзину</BaseButton>
                </div>
            </div>
            <div class="bg-light-gray rounded-lg overflow-hidden">
                <img src="https://placehold.co/400x300/F7F7F7/131C26?text=Товар%203" alt="Товар 3" class="w-full h-48 object-cover rounded-t-lg">
                <div class="p-4">
                    <h3 class="font-semibold text-panda-black text-h5-panda mb-1">Изготовление наклеек</h3>
                    <p class="text-small-panda text-dark-gray">Виниловые, бумажные и др.</p>
                    <p class="font-bold text-panda-orange mt-2 text-body-panda">Цена: $30</p>
                    <BaseButton class="mt-3">В корзину</BaseButton>
                </div>
            </div>
        </div>
    </div>
  </main>
</template>