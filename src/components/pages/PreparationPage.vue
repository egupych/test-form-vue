<script setup>
import { ref } from 'vue';
import BaseButton from '@/components/ui/BaseButton.vue';
import SectionHeader from '@/components/ui/SectionHeader.vue';

const activeTab = ref('packages');

const templatesData = [
  { 
    id: 'packages', 
    name: 'Пакеты',
    items: [
      { name: '230 × 350 × 80 мм', img: 'https://images.unsplash.com/photo-1594495894542-a46cc73e081a?w=400', href: '#' },
      { name: '170 × 190 × 105 мм', img: 'https://images.unsplash.com/photo-1555529771-83d3dba3c69c?w=400', href: '#' },
      { name: '340 × 110 × 70 мм', img: 'https://images.unsplash.com/photo-1594495894542-a46cc73e081a?w=400&h=500', href: '#' },
      { name: '200 × 200 × 90 мм', img: 'https://images.unsplash.com/photo-1555529771-83d3dba3c69c?w=400&h=400', href: '#' },
      { name: '350 × 250 × 80 мм', img: 'https://images.unsplash.com/photo-1594495894542-a46cc73e081a?w=500&h=400', href: '#' },
    ]
  },
  { id: 'booklets', name: 'Буклеты', items: [] },
  { id: 'triplets', name: 'Триплеты', items: [] },
  { id: 'envelopes', name: 'Конверты', items: [] },
  { id: 'folders', name: 'Папки', items: [] },
  { id: 'boxes', name: 'Коробки', items: [] },
  { id: 'doorholders', name: 'Дорхолдеры', items: [] },
  { id: 'calendars', name: 'Календари', items: [] },
  { id: 'ribbons', name: 'Ленты', items: [] },
];
</script>

<template>
  <main class="py-10 md:py-25">
    <div class="max-w-6xl mx-auto">

      <section>
        <SectionHeader class="gap-container">Шаблоны</SectionHeader>
        
        <div class="flex flex-wrap gap-2 mb-10">
          <BaseButton
            v-for="tab in templatesData"
            :key="tab.id"
            @click="activeTab = tab.id"
            :variant="activeTab === tab.id ? 'fill-black' : 'gray'"
          >
            {{ tab.name }}
          </BaseButton>
        </div>

        <div v-for="tab in templatesData" :key="tab.id + '-content'">
          <div v-if="activeTab === tab.id">
            <div v-if="tab.items.length > 0" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              <div v-for="item in tab.items" :key="item.name" class="flex flex-col items-center group">
                <div class="bg-light-gray w-full rounded-lg flex items-center justify-center mb-3 p-4 aspect-[3/4]">
                  <img :src="item.img" :alt="item.name" class="max-h-full max-w-full object-contain">
                </div>
                <div class="text-center">
                  <div class="text-body-panda text-panda-black mb-2 h-10 flex items-center justify-center">{{ item.name }}</div>
                <div class="button" data-tooltip="Corel .CDR">
                  <div class="button-wrapper">
                  <div class="text">Скачать</div>
                      <span class="icon">
                      <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" width="2em" height="2em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15V3m0 12l-4-4m4 4l4-4M2 17l.621 2.485A2 2 0 0 0 4.561 21h14.878a2 2 0 0 0 1.94-1.515L22 17"></path></svg>
                      </span>
                  </div>
                </div>    
                </div>
              </div>
            </div>
            <div v-else class="text-center py-10 text-dark-gray text-xl">
              Шаблоны для категории «{{ tab.name }}» скоро появятся.
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
              <li>A0 – 841×1189 мм</li>
              <li>A1 – 594×841 мм</li>
              <li>A2 – 420×594 мм</li>
              <li>A3 – 297×420 мм</li>
              <li>A4 – 210×297 мм (размер офисной бумаги)</li>
              <li>A5 – 148×210 мм</li>
              <li>A6 – 105×148 мм</li>
              <li>A7 – 105×74 мм</li>
              <li class="pt-4">Визитка – 90x50 мм</li>
              <li>Евро-визитка – 85x55 мм</li>
            </ul>
          </div>
          <div class="bg-light-gray rounded-2xl p-4">
            <img src="/src/assets/images/pages/PreparationPage/formats.png" alt="Схема форматов бумаги" class="object-cover">
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
              Необходимо во всех дизайн-макетах оставлять отступы с фоном по периметру по 3 мм для обреза. Например, если вы делаете визитку размером 90x50 мм, то размер макета с вылетами должен быть 96x56 мм. Отступ содержимого (текста, изображений) от края реза должен составлять от 5 мм.
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