<script setup>
import { ref } from 'vue';

// --- ДАННЫЕ ОБ УСЛУГАХ ---
// Я взял основные услуги из вашего PDF и подобрал похожие по стилю изображения-заполнители.
// Также добавил класс для каждого элемента, чтобы задать его размер и положение в сетке.
const services = ref([
  {
    id: 'digital-printing',
    title: 'Цифровая печать',
    description: 'Визитки, флаеры, каталоги',
    imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=1974&auto=format&fit=crop',
    gridClass: 'item-a'
  },
  {
    id: 'packaging',
    title: 'Упаковка',
    description: 'Коробки и стаканчики',
    imageUrl: 'https://images.unsplash.com/photo-1594495894542-a46cc73e081a?w=500',
    gridClass: 'item-b'
  },
  {
    id: 'laser-cutting',
    title: 'Лазерная резка',
    description: 'Акриловые таблички, награды',
    imageUrl: 'https://images.unsplash.com/photo-1611280338385-51b6a1b9a1b1?q=80&w=1974&auto=format&fit=crop',
    gridClass: 'item-c'
  },
  {
    id: 'merch',
    title: 'Мерч с DTF-печатью',
    description: 'Футболки, худи, кепки',
    imageUrl: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=1974&auto=format&fit=crop',
    gridClass: 'item-d'
  },
  {
    id: 'foil-stamping',
    title: 'Тиснение фольгой',
    description: 'Золото для особенных вещей',
    imageUrl: 'https://images.unsplash.com/photo-1604116432462-a3fad57a53c3?q=80&w=1974&auto=format&fit=crop',
    gridClass: 'item-e'
  },
  {
    id: 'hardcover',
    title: 'Твердый переплёт',
    description: 'Книги, дипломы, ежедневники',
    imageUrl: 'https://images.unsplash.com/photo-1517842645767-c6f90415ad90?q=80&w=2070&auto=format&fit=crop',
    gridClass: 'item-f'
  },
  {
    id: 'outdoor-adv',
    title: 'Наружная реклама',
    description: 'Баннеры, вывески, лайтбоксы',
    imageUrl: 'https://images.unsplash.com/photo-1534972195531-cdefb2e75de1?q=80&w=2070&auto=format&fit=crop',
    gridClass: 'item-g'
  }
]);
</script>

<template>
  <div class="services-image-grid">
    <div
      v-for="service in services"
      :key="service.id"
      class="grid-item"
      :class="service.gridClass"
    >
      <div class="image-container">
        <img :src="service.imageUrl" :alt="service.title" class="service-image" />
      </div>
      <div class="overlay"></div>
      <div class="content">
        <h3 class="title">{{ service.title }}</h3>
        <p class="description">{{ service.description }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.services-image-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(4, 200px); /* Высота ряда, можно настроить */
  gap: 1rem; /* Промежуток между блоками */
  grid-template-areas:
    "a a b c"
    "d e b c"
    "d f g g"
    "d f g g";
}

/* Привязка классов к областям сетки */
.item-a { grid-area: a; }
.item-b { grid-area: b; }
.item-c { grid-area: c; }
.item-d { grid-area: d; }
.item-e { grid-area: e; }
.item-f { grid-area: f; }
.item-g { grid-area: g; }

.grid-item {
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  color: white;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.grid-item:hover {
  transform: scale(1.03); /* Небольшое увеличение при наведении */
}

.image-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.service-image {
  width: 100%;
  height: 100%;
  object-fit: cover; /* Изображение заполняет блок, сохраняя пропорции */
  transition: transform 0.4s ease;
}

.grid-item:hover .service-image {
  transform: scale(1.1); /* Эффект "зума" картинки при наведении */
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.1));
  z-index: 1;
}

.content {
  position: relative;
  z-index: 2;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  height: 100%;
}

.title {
  font-size: 1.5rem;
  font-weight: 700;
  line-height: 1.2;
  margin-bottom: 0.5rem;
}

.description {
  font-size: 1rem;
  font-weight: 400;
  opacity: 0.9;
}

/* Адаптация для мобильных устройств */
@media (max-width: 768px) {
  .services-image-grid {
    grid-template-columns: 1fr;
    grid-template-rows: auto;
    grid-template-areas:
      "a"
      "b"
      "c"
      "d"
      "e"
      "f"
      "g";
  }
  .grid-item {
     height: 250px; /* Фиксированная высота для карточек на мобильных */
  }
}
</style>