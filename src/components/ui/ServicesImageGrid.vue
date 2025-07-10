<script setup>
import { ref } from 'vue';

// ДАННЫЕ (24 УСЛУГИ) ОСТАЮТСЯ БЕЗ ИЗМЕНЕНИЙ
const services = ref([
  // --- Большие блоки ---
  {
    id: 'digital-printing',
    title: 'Цифровая печать',
    description: 'Визитки, флаеры, каталоги',
    imageUrl: 'https://images.unsplash.com/photo-1593344484962-796b5a853247?q=80&w=2070&auto=format&fit=crop',
    style: 'grid-column: span 2; grid-row: span 2;'
  },
  {
    id: 'packaging',
    title: 'Упаковка',
    description: 'Коробки и стаканчики',
    imageUrl: 'https://images.unsplash.com/photo-1565310891465-a8a29a2292f2?q=80&w=1974&auto=format&fit=crop',
    style: 'grid-row: span 2;'
  },
  {
    id: 'outdoor-adv',
    title: 'Наружная реклама',
    description: 'Баннеры, вывески, билборды',
    imageUrl: 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?q=80&w=1926&auto=format&fit=crop',
    style: 'grid-row: span 2;'
  },
  {
    id: 'slim-lightboxes',
    title: 'Слим-лайтбоксы',
    description: 'Тонкие световые панели',
    imageUrl: 'https://images.unsplash.com/photo-1596783823533-22872323f5b7?q=80&w=1974&auto=format&fit=crop',
    style: 'grid-column: span 2; grid-row: span 2;'
  },
  // --- Маленькие блоки (1x1) ---
  { id: 'dtf-print', title: 'Мерч с DTF-печатью', description: 'Футболки, худи, кепки', imageUrl: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=1974&auto=format&fit=crop' },
  { id: 'souvenirs', title: 'Сувениры', description: 'Брендированные подарки', imageUrl: 'https://images.unsplash.com/photo-1579549356612-3bff123a85b6?q=80&w=2070&auto=format&fit=crop' },
  { id: 'gold-foil', title: 'Печать золотой краской', description: 'Для премиальной продукции', imageUrl: 'https://images.unsplash.com/photo-1604116432462-a3fad57a53c3?q=80&w=1974&auto=format&fit=crop' },
  { id: 'laser-engraving', title: 'Лазерная гравировка', description: 'На металле и дереве', imageUrl: 'https://images.unsplash.com/photo-1517842645767-c6f90415ad90?q=80&w=2070&auto=format&fit=crop' },
  { id: 'white-print', title: 'Печать белым цветом', description: 'На темных материалах', imageUrl: 'https://images.unsplash.com/photo-1620988229043-424a106e2a77?q=80&w=1932&auto=format&fit=crop' },
  { id: 'uv-print', title: 'УФ-печать', description: 'На любых поверхностях', imageUrl: 'https://images.unsplash.com/photo-1611112469492-1d5755502c2e?q=80&w=1974&auto=format&fit=crop' },
  { id: 'foil-stamping', title: 'Тиснение фольгой', description: 'Золото и серебро на бумаге', imageUrl: 'https://images.unsplash.com/photo-1596703221946-4a4b266a4f4c?q=80&w=1974&auto=format&fit=crop' },
  { id: 'laser-cutting', title: 'Лазерная резка', description: 'Акриловые таблички, награды', imageUrl: 'https://images.unsplash.com/photo-1611284446314-60a58ac07373?q=80&w=2069&auto=format&fit=crop' },
  { id: 'varnishing', title: 'Лакирование', description: 'Глянцевое и матовое', imageUrl: 'https://images.unsplash.com/photo-1599202861313-25586a1a2b4b?q=80&w=1974&auto=format&fit=crop' },
  { id: 'plotter-cutting', title: 'Плоттерная резка', description: 'Фигурная резка пленки', imageUrl: 'https://images.unsplash.com/photo-1543285989-18c5340441ac?q=80&w=2081&auto=format&fit=crop' },
  { id: 'die-cutting', title: 'Вырубка', description: 'Нестандартные формы', imageUrl: 'https://images.unsplash.com/photo-1551263309-8f4981134241?q=80&w=2070&auto=format&fit=crop' },
  { id: 'brochuring', title: 'Брошюровка', description: 'На пружину или скобу', imageUrl: 'https://images.unsplash.com/photo-1541650393946-95561a21e42b?q=80&w=1974&auto=format&fit=crop' },
  { id: 'stickers', title: 'Стикеры', description: 'Любой формы и размера', imageUrl: 'https://images.unsplash.com/photo-1620321023313-a4b3734199c1?q=80&w=1995&auto=format&fit=crop' },
  { id: 'perforation', title: 'Перфорация', description: 'Линии отрыва', imageUrl: 'https://images.unsplash.com/photo-1605334091173-89953a39e836?q=80&w=1964&auto-format&fit=crop' },
  { id: 'creasing', title: 'Биговка', description: 'Линии сгиба', imageUrl: 'https://images.unsplash.com/photo-1618512496248-61e838cf3f5a?q=80&w=1974&auto=format&fit=crop' },
  { id: 'rounding', title: 'Скругление углов', description: 'Для визиток и флаеров', imageUrl: 'https://images.unsplash.com/photo-1599691456285-159c90479b18?q=80&w=2070&auto=format&fit=crop' },
  { id: 'lamination', title: 'Кашировка', description: 'Склейка материалов', imageUrl: 'https://images.unsplash.com/photo-1627992936338-e6b3c9a1a8c1?q=80&w=1974&auto=format&fit=crop' },
  { id: 'design', title: 'Дизайн', description: 'Разработка макетов', imageUrl: 'https://images.unsplash.com/photo-1558655146-364adaf1fcc9?q=80&w=1974&auto=format&fit=crop' },
  { id: 'folding', title: 'Фальцовка', description: 'Сгибы для буклетов', imageUrl: 'https://images.unsplash.com/photo-1588421399343-268e25505b38?q=80&w=1974&auto=format&fit=crop' },
  { id: 'numbering', title: 'Нумерация', description: 'Для билетов и бланков', imageUrl: 'https://images.unsplash.com/photo-1507925921958-8a62f3d1a50d?q=80&w=2070&auto=format&fit=crop' }
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
        <h3 class="title text-h5-panda font-semibold text-panda-black group-hover:text-white transition-colors duration-300">{{ service.title }}</h3>
        <p class="description text-body-panda text-dark-gray group-hover:text-white transition-colors duration-300 mt-1">{{ service.description }}</p>
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
  background-color: #F97316; /* panda-orange */
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