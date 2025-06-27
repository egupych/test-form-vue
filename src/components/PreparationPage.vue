<script setup>
import FooterSection from './FooterSection.vue';

// УДАЛЕНО: defineProps(['navigateTo']);
// Эта строка была удалена, так как навигация теперь управляется vue-router.
</script>

<template>
  <main>
    <div class="main-container">
        <h1 class="font-bold text-panda-black text-4xl mb-8">Подготовка к печати</h1>
        <h2 class="text-2xl font-semibold text-panda-black mb-4">ШАБЛОНЫ</h2>
        <div class="mb-12"><div class="flex flex-wrap gap-4 mb-6"><div class="flex flex-col items-center"><div class="w-20 h-28 bg-dark-gray rounded-sm flex items-center justify-center mb-2"><svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/></svg></div><div class="text-center"><div class="text-xs text-panda-orange mb-1">320x200 мм</div><button class="px-3 py-1 bg-panda-black text-white text-xs rounded">Скачать</button></div></div><div class="flex flex-col items-center"><div class="w-20 h-28 bg-dark-gray rounded-sm flex items-center justify-center mb-2"><svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/></svg></div><div class="text-center"><div class="text-xs text-panda-orange mb-1">250x350 мм</div><button class="px-3 py-1 bg-panda-black text-white text-xs rounded">Скачать</button></div></div></div></div>
        <h2 class="text-2xl font-semibold text-panda-black mb-4 mt-12">ТРЕБОВАНИЯ К МАКЕТАМ</h2>
        <div class="space-y-6"><div><h3 class="font-bold text-panda-black text-lg mb-2">Формат файла</h3><p class="text-dark-gray">Предпочтительный формат файла PDF. Также принимаются CDR, AI, PSD, EPS.</p></div><div><h3 class="font-bold text-panda-black text-lg mb-2">Цветовая модель</h3><p class="text-dark-gray">Все макеты должны быть в цветовой модели CMYK. Файлы в RGB будут конвертированы автоматически, что может привести к искажению цветов.</p></div><div><h3 class="font-bold text-panda-black text-lg mb-2">Шрифты</h3><p class="text-dark-gray">Все текстовые элементы должны быть переведены в кривые (curves/outlines).</p></div><div><h3 class="font-bold text-panda-black text-lg mb-2">Вылеты (Bleeds)</h3><p class="text-dark-gray">Для всей продукции, где есть элементы "навылет", необходимо добавить вылеты по 3-5 мм с каждой стороны.</p></div></div>
        <div class="text-center bg-light-gray rounded-lg p-12 my-12"><h3 class="text-2xl font-bold text-panda-black mb-4">Нет времени на подготовку файлов?</h3><p class="text-xl text-panda-black mb-6">Оперативно сделаем за Вас!</p>
            <!-- ИЗМЕНЕНО: <button> заменен на <router-link> -->
            <router-link to="/" class="px-8 py-3 bg-panda-orange text-white rounded-full text-lg hover:bg-orange-600 transition-colors">Заказать подготовку файлов</router-link>
        </div>
    </div>
    <FooterSection />
  </main>
</template>
