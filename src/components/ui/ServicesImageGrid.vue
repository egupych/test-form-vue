<script setup>
import { ref } from 'vue';

// ДАННЫЕ (24 УСЛУГИ) ОСТАЮТСЯ БЕЗ ИЗМЕНЕНИЙ
const services = ref([
  // --- Большие блоки ---
  {
    id: 'digital-printing',
    title: 'Цифровая печать',
    description: 'Срочная и высококачественная печать визиток, флаеров, каталогов, буклетов, календарей, и многого другого',
    imageUrl: 'https://images.unsplash.com/photo-1593344484962-796b5a853247?q=80&w=2070&auto=format&fit=crop',
    style: 'grid-column: span 2; grid-row: span 2;'
  },
  {
    id: 'packaging',
    title: 'Упаковка',
    description: 'Изготовление коробок и бумажных стаканчиков с фирменным стилем',
    imageUrl: 'https://images.unsplash.com/photo-1565310891465-a8a29a2292f2?q=80&w=1974&auto=format&fit=crop',
    style: 'grid-row: span 2;'
  },
  {
    id: 'outdoor-adv',
    title: 'Наружная реклама',
    description: 'Баннеры, вывески, билборды, лайтбоксы',
    imageUrl: 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?q=80&w=1926&auto=format&fit=crop',
    style: 'grid-row: span 2;'
  },

  // --- Маленькие блоки (1x1) ---
  { id: 'laser-cutting', title: 'Лазерная резка', description: 'Акриловые таблички, награды', imageUrl: 'https://images.unsplash.com/photo-1611284446314-60a58ac07373?q=80&w=2069&auto=format&fit=crop' },
  { id: 'design', title: 'Дизайнерские услуги', description: 'Создадим продающий баннер, презентацию или полный брендбук — под любую задачу, быстро и со вкусом', imageUrl: 'https://images.unsplash.com/photo-1558655146-364adaf1fcc9?q=80&w=1974&auto=format&fit=crop' },
  { id: 'dtf-print', title: 'Мерч с DTF-печатью', description: 'Качественная печать на футболках, худи, кепках и фартуках', imageUrl: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=1974&auto=format&fit=crop' },
  { id: 'souvenirs', title: 'Сувениры', description: 'Презентабельные и полезные сувениры: ручки, блокноты, флешки, ', imageUrl: 'https://images.unsplash.com/photo-1579549356612-3bff123a85b6?q=80&w=2070&auto=format&fit=crop' },
  { id: 'gold-foil', title: 'Печать золотой краской', description: 'Для премиальной продукции', imageUrl: 'https://images.unsplash.com/photo-1604116432462-a3fad57a53c3?q=80&w=1974&auto=format&fit=crop' },
  { id: 'silver-foil', title: 'Печать серебром', description: 'Для премиальной продукции', imageUrl: 'https://images.unsplash.com/photo-1604116432462-a3fad57a53c3?q=80&w=1974&auto=format&fit=crop' },
  { id: 'white-print', title: 'Печать белым цветом', description: 'На темных материалах', imageUrl: 'https://images.unsplash.com/photo-1620988229043-424a106e2a77?q=80&w=1932&auto=format&fit=crop' },
  { id: 'uv-print', title: 'УФ-печать', description: 'На любых поверхностях', imageUrl: 'https://images.unsplash.com/photo-1611112469492-1d5755502c2e?q=80&w=1974&auto=format&fit=crop' },
  { id: 'embroidery', title: 'Вышивка', description: 'Вышивка на бейсболках, одежде, рюкзаках и многом другом', imageUrl: 'https://images.unsplash.com/photo-1507925921958-8a62f3d1a50d?q=80&w=2070&auto=format&fit=crop' },
  { id: 'laser-engraving', title: 'Лазерная гравировка', description: 'На металле, акриле и дереве', imageUrl: 'https://images.unsplash.com/photo-1517842645767-c6f90415ad90?q=80&w=2070&auto=format&fit=crop' },
  { id: 'interior-printing', title: 'Интерьерная печать', description: 'Эко-сольвентная печать с возможностью контурной резки', imageUrl: 'https://images.unsplash.com/photo-1596703221946-4a4b266a4f4c?q=80&w=1974&auto=format&fit=crop' },
  { id: 'varnishing', title: 'Лакирование', description: 'Для придания выборочного блеска', imageUrl: 'https://images.unsplash.com/photo-1599202861313-25586a1a2b4b?q=80&w=1974&auto=format&fit=crop' },
  { id: 'foil-stamping', title: 'Тиснение фольгой', description: 'Золотые элементы на бумажной поверхности', imageUrl: 'https://images.unsplash.com/photo-1596703221946-4a4b266a4f4c?q=80&w=1974&auto=format&fit=crop' },
  { id: 'lamination', title: 'Ламинация', description: 'Глянцевая или матовая, для защиты и придания особого внешнего вида', imageUrl: 'https://images.unsplash.com/photo-1611284446314-60a58ac07373?q=80&w=2069&auto=format&fit=crop' },
  { id: 'hardcover', title: 'Твердый переплёт', description: 'Твёрдая обложка для книг, дипломов', imageUrl: 'https://images.unsplash.com/photo-1611284446314-60a58ac07373?q=80&w=2069&auto=format&fit=crop' },
  { id: 'softcover', title: 'Мягкий переплёт', description: 'Термопереплёт', imageUrl: 'https://images.unsplash.com/photo-1611284446314-60a58ac07373?q=80&w=2069&auto=format&fit=crop' },
  { id: 'contour-cutting', title: 'Контурная резка', description: 'Вырезка сложных форм на плоттере', imageUrl: 'https://images.unsplash.com/photo-1611284446314-60a58ac07373?q=80&w=2069&auto=format&fit=crop' },
  { id: 'cutting1', title: 'Высечка', description: 'Вырубание бумаги до подложки', imageUrl: 'https://images.unsplash.com/photo-1611284446314-60a58ac07373?q=80&w=2069&auto=format&fit=crop' },
  { id: 'cutting2', title: 'Вырубка', description: 'Прорубание бумаги насквозь', imageUrl: 'https://images.unsplash.com/photo-1551263309-8f4981134241?q=80&w=2070&auto=format&fit=crop' },
  { id: 'brochuring', title: 'Брошюровка', description: 'На пружину, скрепку, винты, кольца', imageUrl: 'https://images.unsplash.com/photo-1541650393946-95561a21e42b?q=80&w=1974&auto=format&fit=crop' },
  { id: 'accessories', title: 'Фурнитура', description: 'Установка защитных и декоратиыных элементов', imageUrl: 'https://images.unsplash.com/photo-1541650393946-95561a21e42b?q=80&w=1974&auto=format&fit=crop' },
  { id: 'creasing', title: 'Биговка', description: 'Для аккуратных сгибов', imageUrl: 'https://images.unsplash.com/photo-1618512496248-61e838cf3f5a?q=80&w=1974&auto=format&fit=crop' },
  { id: 'perforation', title: 'Перфорация', description: 'Линии отрыва', imageUrl: 'https://images.unsplash.com/photo-1605334091173-89953a39e836?q=80&w=1964&auto-format&fit=crop' },
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
  background-color: #E3E3E3; /* panda-orange */
}

/* ИЗМЕНЕНИЕ: Удаляем стили, которые теперь задаются классами Tailwind */
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