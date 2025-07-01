<script setup>
import BaseButton from '@/components/ui/BaseButton.vue';
import SectionHeader from '@/components/ui/SectionHeader.vue';

// Данные для шаблонов, взятые из PDF
const templates = [
  { name: 'Визитки', href: '#' },
  { name: 'Буклеты', href: '#' },
  { name: 'Конверты', href: '#' },
  { name: 'Коробки', href: '#' },
  { name: 'Дорхолдеры', href: '#' },
  { name: 'Календари', href: '#' },
];
</script>

<template>
  <main class="py-10 md:py-25">
    <div class="max-w-6xl mx-auto px-4">

      <section>
        <SectionHeader class="gap-container">Шаблоны</SectionHeader>
        <div class="flex flex-wrap justify-center gap-6">
          <div v-for="template in templates" :key="template.name" class="flex flex-col items-center group">
            <div class="w-24 h-32 bg-dark-gray rounded-lg flex items-center justify-center mb-3 transition-colors duration-300 group-hover:bg-panda-orange">
              <svg class="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
              </svg>
            </div>
            <div class="text-center">
              <div class="text-body-panda text-panda-black mb-2 h-10 flex items-center">{{ template.name }}</div>
              <BaseButton :href="template.href" variant="fill-black" class="!px-3 !py-1 !text-xs">Скачать</BaseButton>
            </div>
          </div>
        </div>
      </section>

      <section class="gap-page">
        <SectionHeader class="gap-container">Размеры</SectionHeader>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h3 class="font-bold text-panda-black text-h5-panda mb-4">Стандартные DIN-форматы</h3>
            <ul class="space-y-2 text-dark-gray text-body-panda">
              <li>A0 – 841x1189 мм</li>
              <li>A1 – 594x841 мм</li>
              <li>A2 – 420x594 мм</li>
              <li>A3 – 297x420 мм</li>
              <li>A4 – 210x297 мм (размер офисной бумаги)</li>
              <li>A5 – 148x210 мм</li>
              <li>A6 – 105x148 мм</li>
              <li>A7 – 105x74 мм</li>
              <li class="pt-4">Визитка – 90x50 мм</li>
              <li>Евро-визитка – 85x55 мм</li>
            </ul>
          </div>
          <div class="bg-light-gray rounded-2xl p-4">
            <img src="https://images.unsplash.com/photo-1619468129361-605ebea04b44?q=80&w=1280" alt="Схема форматов бумаги" class="rounded-lg object-cover">
          </div>
        </div>
      </section>
      
      <section class="gap-page">
        <SectionHeader class="gap-container">Требования к макетам</SectionHeader>
        <div class="space-y-10">

          <div>
            <h3 class="font-bold text-panda-black text-h5-panda mb-4">Формат файла</h3>
            <p class="text-dark-gray text-body-panda max-w-4xl">
              Макет желательно присылать в PDF. Если конвертации в PDF нет, допускается присылать макет в программах, где он был разработан (AI, CDR, PSD). Если макет был разработан в онлайн-редакторах (Figma, Canva), рекомендуется прикладывать ссылку для возможной корректировки.
            </p>
          </div>

          <div>
            <h3 class="font-bold text-panda-black text-h5-panda mb-4">Отступы</h3>
            <p class="text-dark-gray text-body-panda max-w-4xl">
              Необходимо во всех дизайн-макетах оставлять отступы с фоном по периметру по 3 мм для обреза. Например, если вы делаете визитку размером 90x50 мм, то размер с фоном составит 96x56 мм. Отступ содержимого (текста, изображений) от края реза должен составлять от 5 мм.
            </p>
          </div>
          
          <div>
            <h3 class="font-bold text-panda-black text-h5-panda mb-4">Цвета</h3>
            <p class="text-dark-gray text-body-panda max-w-4xl">
              Желательно отправлять файлы на печать в цветовой модели CMYK. Если вы работаете в программе, где нет цветовой модели CMYK, то старайтесь использовать цвета из палитры PANTONE. В таком случае, при работе в цветовой модели RGB (Figma, Canva), при использовании цветов PANTONE вы будете видеть макет почти таким же, каким он получится после печати.
            </p>
          </div>

          <div>
            <h3 class="font-bold text-panda-black text-h5-panda mb-4">Шрифты</h3>
            <p class="text-dark-gray text-body-panda max-w-4xl">
              Шрифты необходимо перевести в кривые.
              <br><b>Corel Draw:</b> Ctrl+Q | <b>Illustrator/Figma:</b> Ctrl+Shift+O.
              <br>Либо отправить шрифты нашему менеджеру, для избежания ситуаций, когда программа может поменять шрифт, если его нет в системе.
            </p>
          </div>
          
          <div>
            <h3 class="font-bold text-panda-black text-h5-panda mb-4">Графические элементы</h3>
            <div class="space-y-3 text-dark-gray text-body-panda max-w-4xl">
              <p><b>Вектор — лучший выбор.</b> Для четкой печати желательно использовать логотипы и иконки в векторном формате (SVG, AI, EPS, CDR). Векторные изображения печатаются без искажений и потери качества.</p>
              <p><b>1 мм при 300 DPI = 12 пикселей.</b> Если вы делаете дизайн в программе, которая выдает размер только в пикселях (Figma, Canva), то нужно учитывать, что для 1 мм физического размера (при качественной печати 300 DPI) необходимо 12 пикселей.</p>
            </div>
          </div>
          
          <div>
            <h3 class="font-bold text-panda-black text-h5-panda mb-4">Эффекты и прочее</h3>
            <div class="space-y-3 text-dark-gray text-body-panda max-w-4xl">
                <p>Тени, градиенты, прозрачность должны быть растрированы.</p>
                <p>Линии должны иметь видимую толщину, от 0.2 pt.</p>
                <p>В макете не должно быть лишних элементов, чтобы они случайно не оказались на печати.</p>
            </div>
          </div>

        </div>
      </section>

      <section class="text-center bg-light-gray rounded-3xl p-12 gap-page">
        <h3 class="text-h5-panda font-bold text-panda-black mb-4">Нет времени на подготовку файлов? <br>Оперативно сделаем за Вас!</h3>
        <BaseButton to="/" variant="fill-orange">Написать менеджеру</BaseButton>
      </section>

    </div>
  </main>
</template>

<style scoped>
/* Все стили управляются через Tailwind CSS */
</style>