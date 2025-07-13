<script setup>
import { ref } from 'vue';

// --- ИЗМЕНЕНИЯ ---
// 1. Импортируем изображения как модули.
//    Предполагается, что изображения лежат в папке /src/assets/images/pages/HomePage/ServicesImageGrid/
//    Вы можете изменить путь, если ваши изображения находятся в другом месте.

import digitalPrinting from '@/assets/images/pages/HomePage/ServicesImageGrid/digital-printing.jpg';
import packaging from '@/assets/images/pages/HomePage/ServicesImageGrid/packaging.webp';
import outdoorAdv from '@/assets/images/pages/HomePage/ServicesImageGrid/outdoor-adv.webp';
import laserCutting from '@/assets/images/pages/HomePage/ServicesImageGrid/laser-cutting.jpg';
import design from '@/assets/images/pages/HomePage/ServicesImageGrid/design.jpg';
import dtfPrint from '@/assets/images/pages/HomePage/ServicesImageGrid/dtf-print.jpg';
import souvenirs from '@/assets/images/pages/HomePage/ServicesImageGrid/souvenirs.webp';
import goldFoil from '@/assets/images/pages/HomePage/ServicesImageGrid/gold-foil.jpg';
import silverFoil from '@/assets/images/pages/HomePage/ServicesImageGrid/gold-foil.jpg';
import whitePrint from '@/assets/images/pages/HomePage/ServicesImageGrid/gold-foil.jpg';
import uvPrint from '@/assets/images/pages/HomePage/ServicesImageGrid/uv-print.jpg';
import embroidery from '@/assets/images/pages/HomePage/ServicesImageGrid/gold-foil.jpg';
import laserEngraving from '@/assets/images/pages/HomePage/ServicesImageGrid/gold-foil.jpg';
import interiorPrinting from '@/assets/images/pages/HomePage/ServicesImageGrid/interior-printing.jpg';
import varnishing from '@/assets/images/pages/HomePage/ServicesImageGrid/varnishing.webp';
import foilStamping from '@/assets/images/pages/HomePage/ServicesImageGrid/foil-stamping.webp';
import lamination from '@/assets/images/pages/HomePage/ServicesImageGrid/lamination.jpg';
import hardcover from '@/assets/images/pages/HomePage/ServicesImageGrid/hardcover.jpg';
import softcover from '@/assets/images/pages/HomePage/ServicesImageGrid/softcover.jpg';
import contourCutting from '@/assets/images/pages/HomePage/ServicesImageGrid/contour-cutting.jpg';
import cutting1 from '@/assets/images/pages/HomePage/ServicesImageGrid/cutting1.jpg';
import cutting2 from '@/assets/images/pages/HomePage/ServicesImageGrid/cutting2.jpg';
import brochuring from '@/assets/images/pages/HomePage/ServicesImageGrid/brochuring.jpg';
import accessories from '@/assets/images/pages/HomePage/ServicesImageGrid/accessories.jpg';
import creasing from '@/assets/images/pages/HomePage/ServicesImageGrid/creasing.jpg';
import perforation from '@/assets/images/pages/HomePage/ServicesImageGrid/perforation.jpg';


const services = ref([
  // --- Большие блоки ---
  {
    id: 'digital-printing',
    title: 'Цифровая печать',
    description: 'Срочная и высококачественная печать визиток, флаеров, каталогов, буклетов, календарей, и многого другого',
    imageUrl: digitalPrinting, // <-- 2. Используем импортированную переменную
    style: 'grid-column: span 2; grid-row: span 2;'
  },
  {
    id: 'packaging',
    title: 'Упаковка',
    description: 'Изготовление коробок и бумажных стаканчиков с фирменным стилем',
    imageUrl: packaging, // <-- 2. Используем импортированную переменную
    style: 'grid-row: span 2;'
  },
  {
    id: 'outdoor-adv',
    title: 'Наружная реклама',
    description: 'Баннеры, вывески, билборды, лайтбоксы',
    imageUrl: outdoorAdv, // <-- 2. Используем импортированную переменную
    style: 'grid-row: span 2;'
  },

  // --- Маленькие блоки (1x1) ---
  { id: 'laser-cutting', title: 'Лазерная резка', description: 'Акриловые таблички, награды', imageUrl: laserCutting },
  { id: 'design', title: 'Дизайнерские услуги', description: 'Создадим продающий баннер, презентацию или полный брендбук — под любую задачу, быстро и со вкусом', imageUrl: design },
  { id: 'dtf-print', title: 'Мерч с DTF-печатью', description: 'Качественная печать на футболках, худи, кепках и фартуках', imageUrl: dtfPrint },
  { id: 'souvenirs', title: 'Сувениры', description: 'Презентабельные и полезные сувениры: ручки, блокноты, флешки, ', imageUrl: souvenirs },
  { id: 'gold-foil', title: 'Печать золотой краской', description: 'Для премиальной продукции', imageUrl: goldFoil },
  { id: 'silver-foil', title: 'Печать серебром', description: 'Для премиальной продукции', imageUrl: silverFoil },
  { id: 'white-print', title: 'Печать белым цветом', description: 'На темных материалах', imageUrl: whitePrint },
  { id: 'uv-print', title: 'УФ-печать', description: 'На любых поверхностях', imageUrl: uvPrint },
  { id: 'embroidery', title: 'Вышивка', description: 'Вышивка на бейсболках, одежде, рюкзаках и многом другом', imageUrl: embroidery },
  { id: 'laser-engraving', title: 'Лазерная гравировка', description: 'На металле, акриле и дереве', imageUrl: laserEngraving },
  { id: 'interior-printing', title: 'Интерьерная печать', description: 'Эко-сольвентная печать с возможностью контурной резки', imageUrl: interiorPrinting },
  { id: 'varnishing', title: 'Лакирование', description: 'Для придания выборочного блеска', imageUrl: varnishing },
  { id: 'foil-stamping', title: 'Тиснение фольгой', description: 'Золотые элементы на бумажной поверхности', imageUrl: foilStamping },
  { id: 'lamination', title: 'Ламинация', description: 'Глянцевая или матовая, для защиты и придания особого внешнего вида', imageUrl: lamination },
  { id: 'hardcover', title: 'Твердый переплёт', description: 'Твёрдая обложка для книг, дипломов', imageUrl: hardcover },
  { id: 'softcover', title: 'Мягкий переплёт', description: 'Термопереплёт', imageUrl: softcover },
  { id: 'contour-cutting', title: 'Контурная резка', description: 'Вырезка сложных форм на плоттере', imageUrl: contourCutting },
  { id: 'cutting1', title: 'Высечка', description: 'Вырубание бумаги до подложки', imageUrl: cutting1 },
  { id: 'cutting2', title: 'Вырубка', description: 'Прорубание бумаги насквозь', imageUrl: cutting2 },
  { id: 'brochuring', title: 'Брошюровка', description: 'На пружину, скрепку, винты, кольца', imageUrl: brochuring },
  { id: 'accessories', title: 'Фурнитура', description: 'Установка защитных и декоратиыных элементов', imageUrl: accessories },
  { id: 'creasing', title: 'Биговка', description: 'Для аккуратных сгибов', imageUrl: creasing },
  { id: 'perforation', title: 'Перфорация', description: 'Линии отрыва', imageUrl: perforation },
]);
</script>

<template>
  <div class="services-image-grid">
    <div
      v-for="service in services"
      :key="service.id"
      class="grid-item group"
      :style="service.style"
    >
      <div class="text-content">
        <h3 class="title text-h5-panda font-semibold text-panda-black transition-colors duration-300">{{ service.title }}</h3>
        <p class="description text-body-panda text-dark-gray transition-colors duration-300 mt-1">{{ service.description }}</p>
      </div>
      <div class="image-wrapper">
        <img :src="service.imageUrl" :alt="service.title" class="service-image" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.services-image-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-auto-flow: dense;
  gap: 0;
  border-top: 1px solid #e5e7eb;
  border-left: 1px solid #e5e7eb;
}

.grid-item {
  aspect-ratio: 1 / 1;
  background-color: transparent;
  padding: 1.25rem;
  cursor: default;
  display: flex;
  flex-direction: column;
  transition: background-color 0.3s ease-out;
  border-right: 1px solid #e5e7eb;
  border-bottom: 1px solid #e5e7eb;
  min-width: 0;
  overflow: hidden;
}

.grid-item:hover {
  background-color: #E3E3E3; 
}

.text-content {
  margin-bottom: 1rem;
}

.image-wrapper {
  flex-grow: 1;
  overflow: hidden;
  border-radius: 0;
}
.service-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transform: scale(1);
}

@media (max-width: 1024px) {
  .services-image-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .grid-item {
    grid-column: auto !important;
    grid-row: auto !important;
  }
}

@media (max-width: 640px) {
  .services-image-grid {
    grid-template-columns: repeat(1, 1fr);
  }
}
</style>