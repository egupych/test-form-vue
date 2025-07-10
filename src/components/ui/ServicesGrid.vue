<script setup>
import { ref, computed } from 'vue';

// --- Импорт изображений и список услуг остаются без изменений ---
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
const postcardImg = 'https://optim.tildacdn.com/tild3530-3435-4535-b839-613166636163/-/format/webp/4.jpg.webp';

const allServices = [
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
const hoveredLetter = ref(null);

const alphabet = computed(() => {
  const firstLetters = allServices.map(s => s.name.charAt(0).toUpperCase());
  return [...new Set(firstLetters)].sort((a, b) => a.localeCompare(b, 'ru'));
});

const servicesGrid = computed(() => {
    const sortedServices = [...allServices].sort((a, b) => a.name.localeCompare(b.name, 'ru'));
    const numCols = 6;
    const numRows = Math.ceil(sortedServices.length / numCols);
    const grid = [];
    for (let i = 0; i < numRows; i++) {
        const newRow = [];
        for (let j = 0; j < numCols; j++) {
            const index = j * numRows + i;
            if (index < sortedServices.length) {
                newRow.push(sortedServices[index]);
            } else {
                newRow.push({ name: '', isPlaceholder: true });
            }
        }
        grid.push(newRow);
    }
    return grid;
});

const getServiceByName = (name) => {
    if (!name) return null;
    return allServices.find(s => s.name === name);
};

// --- [ИЗМЕНЕНИЕ 1] ---
// При наведении на ячейку сбрасываем подсветку от алфавита
const handleMouseEnter = (service, event) => {
    hoveredLetter.value = null; // Сбрасываем букву
    if (service && !service.isPlaceholder) {
        hoveredService.value = service;
        hoveredCell.value = event.target.closest('td');
    }
};

// --- [ИЗМЕНЕНИЕ 2] ---
// При наведении на букву сбрасываем подсветку ячейки
const handleLetterEnter = (letter) => {
    hoveredLetter.value = letter;
    hoveredService.value = null; // Сбрасываем сервис
    hoveredCell.value = null;
}
</script>

<template>
  <div class="relative" @mouseleave="hoveredService = null; hoveredCell = null; hoveredLetter = null">
    
    <div 
      class="alphabet-bar flex justify-center gap-1 mb-4"
      @mouseleave="hoveredLetter = null"
    >
      <span
        v-for="letter in alphabet"
        :key="letter"
        class="alphabet-letter"
        @mouseenter="handleLetterEnter(letter)"
      >
        {{ letter }}
      </span>
    </div>

    <table class="w-full border-collapse overflow-hidden">
      <tbody>
        <tr v-for="(row, rowIndex) in servicesGrid" :key="rowIndex">
          <td
            v-for="(service, colIndex) in row"
            :key="colIndex"
            class="border p-3 h-12 text-left cursor-pointer transition-all duration-300 ease-in-out"
            :class="{ 
              'bg-panda-black text-light-gray': hoveredService && hoveredService.name === service.name, 
              'text-panda-black': !hoveredService || hoveredService.name !== service.name,
              'border-gray': rowIndex < servicesGrid.length -1 || colIndex < row.length -1,
              'hover:bg-panda-black hover:text-panda-white': service.name,
              'is-highlighted': hoveredLetter && service.name && service.name.toUpperCase().startsWith(hoveredLetter)
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
  border-color: #E3E3E3;
}

.alphabet-letter {
  @apply font-semibold text-sm text-dark-gray px-3 py-1 cursor-pointer transition-colors duration-200;
}

.alphabet-letter:hover {
  @apply bg-panda-green text-white;
}

.is-highlighted {
  @apply bg-panda-green text-white;
}

.is-highlighted.hover\:bg-panda-black:hover {
    --tw-bg-opacity: 1;
    background-color: rgb(19 28 38 / var(--tw-bg-opacity));
}
.is-highlighted.hover\:text-panda-white:hover {
    --tw-text-opacity: 1;
    color: rgb(255 255 255 / var(--tw-text-opacity));
}
</style>