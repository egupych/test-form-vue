<script setup>
import { ref, computed } from 'vue';

// --- ИЗМЕНЕНИЕ: Импортируем все локальные изображения ---
import bannerImg from '@/assets/images/pages/HomePage/ServicesGrid/баннер.webp';
import badgesImg from '@/assets/images/pages/HomePage/ServicesGrid/бейджи.jpg';
import signboardsImg from '@/assets/images/pages/HomePage/ServicesGrid/вывеска.webp';
import diplomaImg from '@/assets/images/pages/HomePage/ServicesGrid/диплом.webp';
import dorholderImg from '@/assets/images/pages/HomePage/ServicesGrid/дорхолдер.webp';
import capsImg from '@/assets/images/pages/HomePage/ServicesGrid/кепки.webp';
import boxesImg from '@/assets/images/pages/HomePage/ServicesGrid/коробки.webp';
import leafletImg from '@/assets/images/pages/HomePage/ServicesGrid/листовка.webp';
import medalsImg from '@/assets/images/pages/HomePage/ServicesGrid/медали.webp';
import photobookImg from '@/assets/images/pages/HomePage/ServicesGrid/фотобук.jpg';
import menuImg from '@/assets/images/pages/HomePage/ServicesGrid/меню.webp';
import navigationImg from '@/assets/images/pages/HomePage/ServicesGrid/навигация.webp';
import numbersImg from '@/assets/images/pages/HomePage/ServicesGrid/номерки.webp';
import tshirtsImg from '@/assets/images/pages/HomePage/ServicesGrid/футболка.webp';
import notebookImg from '@/assets/images/pages/HomePage/ServicesGrid/блокнот.jpg';
import certificateImg from '@/assets/images/pages/HomePage/ServicesGrid/сертификат.jpg';
import paintingsImg from '@/assets/images/pages/HomePage/ServicesGrid/картины.png';
import packagesImg from '@/assets/images/pages/HomePage/ServicesGrid/пакет.webp';
import foldersImg from '@/assets/images/pages/HomePage/ServicesGrid/папка.webp';
import rollapImg from '@/assets/images/pages/HomePage/ServicesGrid/ролап.jpg';
import souvenirsImg from '@/assets/images/pages/HomePage/ServicesGrid/бутылки.webp';
import bagsImg from '@/assets/images/pages/HomePage/ServicesGrid/сумки.webp';
import bookletImg from '@/assets/images/pages/HomePage/ServicesGrid/буклет.webp';
import cupsImg from '@/assets/images/pages/HomePage/ServicesGrid/стакан.webp';
import standsImg from '@/assets/images/pages/HomePage/ServicesGrid/стенд.jpg';
import stickersImg from '@/assets/images/pages/HomePage/ServicesGrid/стикеры.jpg';
import signsImg from '@/assets/images/pages/HomePage/ServicesGrid/тейбл тент.jpg'; 
import tripletImg from '@/assets/images/pages/HomePage/ServicesGrid/триплет.webp';
import businessCardsImg from '@/assets/images/pages/HomePage/ServicesGrid/визитки.webp';
import labelsImg from '@/assets/images/pages/HomePage/ServicesGrid/этикетки.webp';
import flagsImg from '@/assets/images/pages/HomePage/ServicesGrid/флаг.webp';

// --- ИСПРАВЛЕНИЕ: Объявляем константу для внешней ссылки ---
const postcardImg = 'https://optim.tildacdn.com/tild3530-3435-4535-b839-613166636163/-/format/webp/4.jpg.webp';


// Полный список услуг с данными для ссылок и изображений.
const allServices = [
  // --- ИЗМЕНЕНИЕ: Используем импортированные переменные ---
  { id: 'banners', name: 'Баннеры', link: '/services/banners', previewImage: bannerImg },
  { id: 'badges', name: 'Бейджи', link: '/services/badges', previewImage: badgesImg },
  { id: 'wobblers', name: 'Воблеры', link: '/services/wobblers', previewImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=1974&auto=format&fit=crop' },
  { id: 'signboards', name: 'Вывески', link: '/services/signboards', previewImage: signboardsImg },
  { id: 'envelopes', name: 'Конверты', link: '/services/envelopes', previewImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=1974&auto=format&fit=crop' },
  { id: 'stamps', name: 'Печати', link: '/services/stamps', previewImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=1974&auto=format&fit=crop' },
  { id: 'tickets', name: 'Билеты', link: '/services/tickets', previewImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=1974&auto=format&fit=crop' },
  { id: 'diplomas', name: 'Дипломы', link: '/services/diplomas', previewImage: diplomaImg },
  { id: 'dorholders', name: 'Дорхолдеры', link: '/services/dorholders', previewImage: dorholderImg },
  { id: 'baseball-caps', name: 'Бейсболки', link: '/services/baseball-caps', previewImage: capsImg },
  { id: 'boxes', name: 'Коробки', link: '/services/boxes', previewImage: boxesImg },
  { id: 'leaflets', name: 'Листовки', link: '/services/leaflets', previewImage: leafletImg },
  { id: 'medals', name: 'Медали', link: '/services/medals', previewImage: medalsImg },
  { id: 'posters', name: 'Плакаты', link: '/services/posters', previewImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=1974&auto=format&fit=crop' },
  { id: 'photobooks', name: 'Фотобуки', link: '/services/photobooks', previewImage: photobookImg },
  { id: 'tags', name: 'Бирки', link: '/services/tags', previewImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=1974&auto=format&fit=crop' },
  { id: 'badges_2', name: 'Значки', link: '/services/badges_2', previewImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=1974&auto=format&fit=crop' },
  { id: 'menus', name: 'Меню', link: '/services/menus', previewImage: menuImg },
  { id: 'navigation', name: 'Навигация', link: '/services/navigation', previewImage: navigationImg },
  { id: 'numbers', name: 'Номерки', link: '/services/numbers', previewImage: numbersImg },
  { id: 'photoposters', name: 'Фотопостеры', link: '/services/photoposters', previewImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=1974&auto=format&fit=crop' },
  { id: 'tshirts', name: 'Футболки', link: '/services/tshirts', previewImage: tshirtsImg },
  { id: 'forms', name: 'Бланки', link: '/services/forms', previewImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=1974&auto=format&fit=crop' },
  { id: 'instructions', name: 'Инструкции', link: '/services/instructions', previewImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=1974&auto=format&fit=crop' },
  { id: 'presentations', name: 'Презентации', link: '/services/presentations', previewImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=1974&auto=format&fit=crop' },
  { id: 'canvases', name: 'Холсты', link: '/services/canvases', previewImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=1974&auto=format&fit=crop' },
  { id: 'hangers', name: 'Хэнгеры', link: '/services/hangers', previewImage: 'https://images.unsplash.com/photo-1562911791-c9a91f42d209?q=80&w=2070&auto=format&fit=crop' },
  { id: 'notebooks', name: 'Блокноты', link: '/services/notebooks', previewImage: notebookImg },
  { id: 'calendars', name: 'Календари', link: '/services/calendars', previewImage: 'https://images.unsplash.com/photo-1542867657-162235e19759?q=80&w=1974&auto=format&fit=crop' },
  // --- ИСПРАВЛЕНИЕ: Теперь переменная postcardImg существует ---
  { id: 'postcards', name: 'Открытки', link: '/services/postcards', previewImage: postcardImg },
  { id: 'invitations', name: 'Приглашения', link: '/services/invitations', previewImage: 'https://images.unsplash.com/photo-1533038590840-1cde6e668a91?q=80&w=1970&auto=format&fit=crop' },
  { id: 'certificates', name: 'Сертификаты', link: '/services/certificates', previewImage: certificateImg },
  { id: 'price_tags', name: 'Ценники', link: '/services/price_tags', previewImage: 'https://images.unsplash.com/photo-1596701198433-40a2c3a51052?q=80&w=1974&auto=format&fit=crop' },
  { id: 'brochures', name: 'Брошюры', link: '/services/brochures', previewImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=1974&auto=format&fit=crop' },
  { id: 'paintings', name: 'Картины', link: '/services/paintings', previewImage: paintingsImg },
  { id: 'packages', name: 'Пакеты', link: '/services/packages', previewImage: packagesImg },
  { id: 'folders', name: 'Папки', link: '/services/folders', previewImage: foldersImg },
  { id: 'rollaps', name: 'Ролл-апы', link: '/services/rollaps', previewImage: rollapImg },
  { id: 'souvenirs', name: 'Сувениры', link: '/services/souvenirs', previewImage: souvenirsImg },
  { id: 'bags', name: 'Сумки', link: '/services/bags', previewImage: bagsImg },
  { id: 'booklets', name: 'Буклеты', link: '/services/booklets', previewImage: bookletImg },
  { id: 'catalogs', name: 'Каталоги', link: '/services/catalogs', previewImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=1974&auto=format&fit=crop' },
  { id: 'cups', name: 'Стаканчики', link: '/services/cups', previewImage: cupsImg },
  { id: 'stands', name: 'Стенды', link: '/services/stands', previewImage: standsImg },
  { id: 'stickers', name: 'Стикеры', link: '/services/stickers', previewImage: stickersImg },
  { id: 'signs', name: 'Таблички', link: '/services/signs', previewImage: signsImg },
  { id: 'triplets', name: 'Триплет', link: '/services/triplets', previewImage: tripletImg },
  { id: 'business_cards', name: 'Визитки', link: '/services/business_cards', previewImage: businessCardsImg },
  { id: 'books', name: 'Книги', link: '/services/books', previewImage: 'https://images.unsplash.com/photo-1517842645767-c6f90415ad90?q=80&w=2070&auto=format&fit=crop' },
  { id: 'stickers_2', name: 'Этикетки', link: '/services/stickers_2', previewImage: labelsImg },
  { id: 'flags', name: 'Флаги', link: '/services/flags', previewImage: flagsImg },
];

const hoveredService = ref(null);
const hoveredCell = ref(null);

// Динамически создаем сетку услуг
const servicesGrid = computed(() => {
    // Сортируем услуги по названию в алфавитном порядке
    const sortedServices = [...allServices].sort((a, b) => a.name.localeCompare(b.name, 'ru'));
    
    const grid = [];
    const cols = 6; // Задаем количество колонок
    
    // Распределяем услуги по ячейкам
    for (let i = 0; i < sortedServices.length; i += cols) {
        grid.push(sortedServices.slice(i, i + cols));
    }
    
    // Если последняя строка неполная, добиваем ее пустыми ячейками
    const lastRow = grid[grid.length - 1];
    if (lastRow && lastRow.length < cols) {
        while (lastRow.length < cols) {
            lastRow.push({ name: '', isPlaceholder: true }); // Используем объект-заглушку
        }
    }
    
    return grid;
});

// Функция для поиска полной информации об услуге по её названию
const getServiceByName = (name) => {
    if (!name) return null;
    return allServices.find(s => s.name === name);
};

const handleMouseEnter = (service, event) => {
    if (service && !service.isPlaceholder) {
        hoveredService.value = service;
        hoveredCell.value = event.target.closest('td');
    }
};
</script>

<template>
  <div class="relative" @mouseleave="hoveredService = null; hoveredCell = null">
    <table class="w-full border-collapse overflow-hidden">
      <tbody>
        <tr v-for="(row, rowIndex) in servicesGrid" :key="rowIndex">
          <td
            v-for="(service, colIndex) in row"
            :key="colIndex"
            class="border p-3 h-12 text-left cursor-pointer transition-colors duration-200 ease-in-out"
            :class="{ 
              'bg-panda-black text-light-gray': hoveredService && hoveredService.name === service.name, 
              'text-panda-black': !hoveredService || hoveredService.name !== service.name,
              'border-gray': rowIndex < servicesGrid.length -1 || colIndex < row.length -1,
              'hover:bg-panda-black hover:text-panda-white': service.name
            }"
            @mouseenter="handleMouseEnter(service, $event)"
          >
            <a v-if="!service.isPlaceholder" :href="getServiceByName(service.name)?.link" class="block w-full h-full">
              <span class="font-semibold text-header-panda">{{ service.name }}</span>
            </a>
          </td>
        </tr>
      </tbody>
    </table>

    <transition
      enter-active-class="transition-opacity duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="hoveredService && hoveredCell"
        class="absolute w-64 h-48 shadow-2xl pointer-events-none overflow-hidden z-10"
        :style="{ 
          top: hoveredCell.offsetTop + 'px',
          left: hoveredCell.offsetLeft + hoveredCell.offsetWidth + 'px'
        }"
      >
        <img 
          :src="hoveredService.previewImage" 
          :alt="hoveredService.name"
          class="w-full h-full object-cover"
        />
      </div>
    </transition>
  </div>
</template>

<style scoped>
td {
  border-color: #E3E3E3; /* 'gray' from tailwind config */
}
</style>