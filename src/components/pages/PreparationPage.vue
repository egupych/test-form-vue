<script setup>
import BaseButton from '@/components/ui/BaseButton.vue';
// --- ИЗМЕНЕНИЕ: Импортируем наш новый компонент заголовка ---
import SectionHeader from '@/components/ui/SectionHeader.vue';
</script>

<template>
  <main class="py-10 md:py-25">
    <div class="max-w-6xl mx-auto px-4">
        
        <section>
            <SectionHeader class="gap-container">Шаблоны</SectionHeader>
            
            <div class="flex flex-wrap gap-4">
                <div class="flex flex-col items-center">
                    <div class="w-20 h-28 bg-dark-gray rounded-sm flex items-center justify-center mb-2">
                        <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/></svg>
                    </div>
                    <div class="text-center">
                        <div class="text-xs text-panda-orange mb-1">320x200 мм</div>
                        <BaseButton href="#" variant="fill-black" class="!px-3 !py-1 !text-xs">Скачать</BaseButton>
                    </div>
                </div>
                <div class="flex flex-col items-center">
                    <div class="w-20 h-28 bg-dark-gray rounded-sm flex items-center justify-center mb-2">
                        <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/></svg>
                    </div>
                    <div class="text-center">
                        <div class="text-xs text-panda-orange mb-1">250x350 мм</div>
                        <BaseButton href="#" variant="fill-black" class="!px-3 !py-1 !text-xs">Скачать</BaseButton>
                    </div>
                </div>
            </div>
        </section>

        <section class="gap-page">
            <SectionHeader class="gap-container">Требования к макетам</SectionHeader>

            <div class="space-y-6 text-body-panda">
                <div>
                    <h3 class="font-bold text-panda-black text-h5-panda mb-2">Формат файла</h3>
                    <p class="text-dark-gray">Предпочтительный формат файла PDF. Также принимаются CDR, AI, PSD, EPS.</p>
                </div>
                <div>
                    <h3 class="font-bold text-panda-black text-h5-panda mb-2">Цветовая модель</h3>
                    <p class="text-dark-gray">Все макеты должны быть в цветовой модели CMYK. Файлы в RGB будут конвертированы автоматически, что может привести к искажению цветов.</p>
                </div>
                <div>
                    <h3 class="font-bold text-panda-black text-h5-panda mb-2">Шрифты</h3>
                    <p class="text-dark-gray">Все текстовые элементы должны быть переведены в кривые (curves/outlines).</p>
                </div>
                <div>
                    <h3 class="font-bold text-panda-black text-h5-panda mb-2">Вылеты (Bleeds)</h3>
                    <p class="text-dark-gray">Для всей продукции, где есть элементы "навылет", необходимо добавить вылеты по 3-5 мм с каждой стороны.</p>
                </div>
            </div>
        </section>

        <div class="text-center bg-light-gray rounded-lg p-12 gap-page">
            <h3 class="text-h3-panda font-bold text-panda-black mb-4">Нет времени на подготовку файлов?</h3>
            <p class="text-h5-panda text-panda-black mb-6">Оперативно сделаем за Вас!</p>
            <BaseButton to="/" variant="fill-orange">Заказать подготовку файлов</BaseButton>
        </div>
    </div>
  </main>
</template>