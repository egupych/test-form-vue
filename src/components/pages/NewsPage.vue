<template>
  <main class="py-10 md:py-25 px-4 md:px-0">
    <div class="max-w-6xl mx-auto">
      <article class="news-layout">
        <h1 class="news-title text-h2-panda font-bold text-panda-black">{{ news.title }}</h1>
        <p class="news-description text-body-panda text-dark-gray leading-relaxed">{{ news.description }}</p>
        <time :datetime="news.date" class="news-date block text-sm text-dark-gray uppercase font-semibold tracking-wider">
          {{ formatDate(news.date) }}
        </time>

        <aside class="fancy-gallery">
          <div
            v-for="(image, index) in visibleImages"
            :key="image.src + index"
            class="gallery-item group"
            :class="{
              'gallery-item-large': index === 0,
              'gallery-item-small': index > 0
            }"
            @click="openViewer(news.images, index)"
          >
            <img
              :src="image.src"
              :alt="image.alt"
              class="gallery-image"
              loading="lazy"
            >
            <div v-if="index === (MAX_VISIBLE_IMAGES - 1) && hiddenImagesCount > 0" class="overlay">
              <span class="text-h3-panda font-bold">+{{ hiddenImagesCount }}</span>
            </div>
          </div>
        </aside>
      </article>

      <ImageViewer
        v-if="isViewerOpen"
        :images="viewerImages"
        :start-index="viewerStartIndex"
        @close="closeViewer"
      />
    </div>
  </main>
</template>

<script setup>
import { ref, computed } from 'vue';
import ImageViewer from '@/components/ui/ImageViewer.vue';

const news = ref({
  title: 'Посетили крупнейшую азиатскую выставку',
  description: '8-я международная выставка рекламы, полиграфии, технологий и материалов в Алмате стала для нас источником вдохновения и новых идей. Мы изучили передовые технологии, наладили контакты с партнерами и готовы внедрять лучшие решения для наших клиентов.',
  date: '2025-05-28',
  images: [
    { src: 'src/assets/images/pages/NewsPage/3d458f95-8b5b-4965-9f9a-0297d373a34a.jpg', alt: 'Фото с выставки 1' },
    { src: 'src/assets/images/pages/NewsPage/c563329c-569c-4d0a-a308-8b0d1abc16fe.jpg', alt: 'Фото с выставки 2' },
    { src: 'src/assets/images/pages/NewsPage/image 211.png', alt: 'Фото с выставки 3' },
    { src: 'src/assets/images/pages/NewsPage/image 212.png', alt: 'Фото с выставки 4' },
    { src: 'src/assets/images/pages/NewsPage/image 211.png', alt: 'Фото с выставки 5' },
  ]
});

// --- ЛОГИКА ГАЛЕРЕИ ---
const MAX_VISIBLE_IMAGES = 3;

const visibleImages = computed(() => {
  return news.value.images.slice(0, MAX_VISIBLE_IMAGES);
});

const hiddenImagesCount = computed(() => {
  const totalImages = news.value.images.length;
  return totalImages > MAX_VISIBLE_IMAGES ? totalImages - MAX_VISIBLE_IMAGES : 0;
});


// --- ЛОГИКА ПРОСМОТРЩИКА ---
const isViewerOpen = ref(false);
const viewerImages = ref([]);
const viewerStartIndex = ref(0);

const formatDate = (dateString) => {
  const options = { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' };
  return new Date(dateString).toLocaleDateString('ru-RU', options);
};

const openViewer = (images, index) => {
  viewerImages.value = images.map(img => ({
      url: img.src,
      alt: img.alt,
      categoryTitle: formatDate(news.value.date)
  }));
  viewerStartIndex.value = index;
  isViewerOpen.value = true;
};

const closeViewer = () => {
  isViewerOpen.value = false;
};
</script>

<style scoped>
/*
  Основной контейнер-обертка.
  На мобильных устройствах элементы идут друг за другом (по умолчанию).
*/
.news-layout {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/*
  На десктопах (>768px) включаем магию CSS Grid Areas.
  Создаем сетку, где каждый элемент занимает свою именованную область.
*/
@media (min-width: 768px) {
  .news-layout {
    display: grid;
    /* Определяем колонки: текст, отступ 16px, галерея */
    grid-template-columns: 2fr 1rem 3fr;
    /* Определяем ряды: авто-высота для заголовка, растягиваемый для описания, авто для даты */
    grid-template-rows: auto 1fr auto;
    /* "Рисуем" нашу сетку */
    grid-template-areas:
      "title   . gallery"
      "desc    . gallery"
      "date    . gallery";
  }
}

/* Присваиваем каждому элементу его область в сетке */
.news-title { grid-area: title; }
.news-description { grid-area: desc; align-self: start; /* Выравниваем по верху ячейки */ }
.news-date { grid-area: date; align-self: end; /* Выравниваем по низу ячейки */ }
.fancy-gallery { grid-area: gallery; }

/*
  Стили для галереи изображений.
  Она сама является вложенной сеткой.
*/
.fancy-gallery {
  display: grid;
  gap: 0.5rem; /* 8px */
  grid-template-columns: 2fr 1fr;
}

.gallery-item {
  position: relative;
  overflow: hidden;
  border-radius: 0.5rem;
  background-color: theme('colors.light-gray'); /* Используем цвет из палитры */
  cursor: pointer;
}

.gallery-item-large {
  grid-row: span 2 / span 2;
  /* Высота и ширина будут авто, подстроятся под сетку */
}

.gallery-item-small {
  aspect-ratio: 1 / 1; /* Маленькие фото - всегда квадраты */
}

.gallery-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}

.gallery-item.group:hover .gallery-image {
  transform: scale(1.1);
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  /* ИЗМЕНЕНИЕ: Используем новый цвет из палитры Tailwind */
  background-color: theme('colors.panda-black-overlay'); 
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.3s ease;
  border-radius: 0.5rem;
}

.gallery-item:hover .overlay {
  /* При наведении можно сделать оверлей чуть темнее, если нужно */
  background-color: rgba(19, 28, 38, 0.65); 
}

.overlay + .gallery-image {
  transform: scale(1) !important;
}
</style>