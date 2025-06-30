<script setup>
import { ref } from 'vue';

// Полный список услуг с данными для ссылок и изображений.
// В качестве изображения для предпросмотра используется временный заполнитель.
const allServices = [
  { id: 'badges', name: 'Бейджи', link: '/services/badges', previewImage: 'https://optim.tildacdn.com/tild6139-3965-4432-b839-393363343431/-/format/webp/2.jpg.webp' },
  { id: 'wobblers', name: 'Воблеры', link: '/services/wobblers', previewImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=1974&auto=format&fit=crop' },
  { id: 'envelopes', name: 'Конверты', link: '/services/envelopes', previewImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=1974&auto=format&fit=crop' },
  { id: 'stamps', name: 'Печати', link: '/services/stamps', previewImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=1974&auto=format&fit=crop' },
  { id: 'flyers', name: 'Флаера', link: '/services/flyers', previewImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=1974&auto=format&fit=crop' },
  { id: 'labels', name: 'Ярлыки', link: '/services/labels', previewImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=1974&auto=format&fit=crop' },
  { id: 'tickets', name: 'Билеты', link: '/services/tickets', previewImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=1974&auto=format&fit=crop' },
  { id: 'diplomas', name: 'Дипломы', link: '/services/diplomas', previewImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=1974&auto=format&fit=crop' },
  { id: 'leaflets', name: 'Листовки', link: '/services/leaflets', previewImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=1974&auto=format&fit=crop' },
  { id: 'posters', name: 'Плакаты', link: '/services/posters', previewImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=1974&auto=format&fit=crop' },
  { id: 'photobooks', name: 'Фотобуки', link: '/services/photobooks', previewImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=1974&auto=format&fit=crop' },
  { id: 'boxes', name: 'Ящики', link: '/services/boxes', previewImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=1974&auto=format&fit=crop' },
  { id: 'tags', name: 'Бирки', link: '/services/tags', previewImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=1974&auto=format&fit=crop' },
  { id: 'badges_2', name: 'Значки', link: '/services/badges_2', previewImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=1974&auto=format&fit=crop' },
  { id: 'menus', name: 'Меню', link: '/services/menus', previewImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=1974&auto=format&fit=crop' },
  { id: 'photoposters', name: 'Фотопостеры', link: '/services/photoposters', previewImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=1974&auto=format&fit=crop' },
  { id: 'tshirts', name: 'Футболки', link: '/services/tshirts', previewImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=1974&auto=format&fit=crop' },
  { id: 'forms', name: 'Бланки', link: '/services/forms', previewImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=1974&auto=format&fit=crop' },
  { id: 'instructions', name: 'Инструкции', link: '/services/instructions', previewImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=1974&auto=format&fit=crop' },
  { id: 'stickers', name: 'Наклейки', link: '/services/stickers', previewImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=1974&auto=format&fit=crop' },
  { id: 'presentations', name: 'Презентации', link: '/services/presentations', previewImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=1974&auto=format&fit=crop' },
  { id: 'canvases', name: 'Холсты', link: '/services/canvases', previewImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=1974&auto=format&fit=crop' },
  { id: 'hangers', name: 'Хэнгеры', link: '/services/hangers', previewImage: 'https://images.unsplash.com/photo-1562911791-c9a91f42d209?q=80&w=2070&auto=format&fit=crop' },
  { id: 'notebooks', name: 'Блокноты', link: '/services/notebooks', previewImage: 'https://images.unsplash.com/photo-1586282393202-74d1c9483863?q=80&w=1974&auto=format&fit=crop' },
  { id: 'calendars', name: 'Календари', link: '/services/calendars', previewImage: 'https://images.unsplash.com/photo-1542867657-162235e19759?q=80&w=1974&auto=format&fit=crop' },
  { id: 'postcards', name: 'Открытки', link: '/services/postcards', previewImage: 'https://optim.tildacdn.com/tild3530-3435-4535-b839-613166636163/-/format/webp/4.jpg.webp' },
  { id: 'invitations', name: 'Приглашения', link: '/services/invitations', previewImage: 'https://images.unsplash.com/photo-1533038590840-1cde6e668a91?q=80&w=1970&auto=format&fit=crop' },
  { id: 'certificates', name: 'Сертификаты', link: '/services/certificates', previewImage: 'https://images.unsplash.com/photo-1579969406231-7521c79c8646?q=80&w=1969&auto=format&fit=crop' },
  { id: 'price_tags', name: 'Ценники', link: '/services/price_tags', previewImage: 'https://images.unsplash.com/photo-1596701198433-40a2c3a51052?q=80&w=1974&auto=format&fit=crop' },
  { id: 'brochures', name: 'Брошюры', link: '/services/brochures', previewImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=1974&auto=format&fit=crop' },
  { id: 'paintings', name: 'Картины', link: '/services/paintings', previewImage: 'https://images.unsplash.com/photo-1547891654-e66ed711b934?q=80&w=2070&auto=format&fit=crop' },
  { id: 'packages', name: 'Пакеты', link: '/services/packages', previewImage: 'https://images.unsplash.com/photo-1576425345799-a1b74a3822d5?q=80&w=1974&auto=format&fit=crop' },
  { id: 'souvenirs', name: 'Сувениры', link: '/services/souvenirs', previewImage: 'https://images.unsplash.com/photo-1614028591873-e3386e8a4a2a?q=80&w=2070&auto=format&fit=crop' },
  { id: 'booklets', name: 'Буклеты', link: '/services/booklets', previewImage: 'https://images.unsplash.com/photo-1585749718443-41c3354b2344?q=80&w=2070&auto=format&fit=crop' },
  { id: 'catalogs', name: 'Каталоги', link: '/services/catalogs', previewImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=1974&auto=format&fit=crop' },
  { id: 'folders', name: 'Папки', link: '/services/folders', previewImage: 'https://images.unsplash.com/photo-1588665753194-874a1742479d?q=80&w=1974&auto=format&fit=crop' },
  { id: 'signs', name: 'Таблички', link: '/services/signs', previewImage: 'https://images.unsplash.com/photo-1562911791-c9a91f42d209?q=80&w=2070&auto=format&fit=crop' },
  { id: 'business_cards', name: 'Визитки', link: '/services/business_cards', previewImage: 'https://images.unsplash.com/photo-1556742502-ec7c0e2424d8?q=80&w=1974&auto=format&fit=crop' },
  { id: 'books', name: 'Книги', link: '/services/books', previewImage: 'https://images.unsplash.com/photo-1517842645767-c6f90415ad90?q=80&w=2070&auto=format&fit=crop' },
  { id: 'plakaty_2', name: 'Плакаты', link: '/services/plakaty_2', previewImage: 'https://images.unsplash.com/photo-1604933235339-3543b5e4f71a?q=80&w=1974&auto=format&fit=crop' },
  { id: 'stickers_2', name: 'Этикетки', link: '/services/stickers_2', previewImage: 'https://images.unsplash.com/photo-1620336224333-135b0210a6dd?q=80&w=2070&auto=format&fit=crop' },
];

// Структура таблицы, повторяющая макет из изображения. Пустые строки нужны для корректного отображения.
const gridLayout = [
    ['Бейджи', 'Воблеры', 'Конверты', 'Печати', 'Флаера', 'Ярлыки'],
    ['Билеты', 'Дипломы', 'Листовки', 'Плакаты', 'Фотобуки', 'Ящики'],
    ['Бирки', 'Значки', 'Меню', 'Фотопостеры', 'Футболки', ''],
    ['Бланки', 'Инструкции', 'Наклейки', 'Презентации', 'Штампы', ''],
    ['Блокноты', 'Календари', 'Открытки', 'Приглашения', 'Холсты', ''],
    ['Брошюры', 'Картины', 'Пакеты', 'Сертификаты', 'Хэнгеры', ''],
    ['Буклеты', 'Каталоги', 'Папки', 'Сувениры', 'Ценники', ''],
    ['Визитки', 'Книги', 'Плакаты', 'Таблички', 'Этикетки', '']
];

const hoveredService = ref(null);
const hoveredCell = ref(null);

// Функция для поиска полной информации об услуге по её названию
const getServiceByName = (name) => {
    if (!name) return null;
    return allServices.find(s => s.name === name);
};

const handleMouseEnter = (serviceName, event) => {
    const service = getServiceByName(serviceName);
    if (service) {
        hoveredService.value = service;
        hoveredCell.value = event.target.closest('td');
    }
};
</script>

<template>
  <div class="relative" @mouseleave="hoveredService = null; hoveredCell = null">
    <table class="w-full border-collapse overflow-hidden">
      <tbody>
        <tr v-for="(row, rowIndex) in gridLayout" :key="rowIndex">
          <td
            v-for="(serviceName, colIndex) in row"
            :key="colIndex"
            class="border p-3 h-12 text-left cursor-pointer transition-colors duration-200 ease-in-out"
            :class="{ 
              'bg-panda-black text-light-gray': hoveredService && hoveredService.name === serviceName, 
              'text-panda-black': !hoveredService || hoveredService.name !== serviceName,
              'border-gray': rowIndex < gridLayout.length -1 || colIndex < row.length -1,
              'hover:bg-panda-black hover:text-panda-white': serviceName
            }"
            @mouseenter="serviceName && handleMouseEnter(serviceName, $event)"
          >
            <span v-if="serviceName" class="font-semibold text-header-panda">{{ serviceName }}</span>
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
/* Обеспечиваем, чтобы у последней строки не было нижней границы */
tr:last-child td {
  border-bottom: none;
}
/* Обеспечиваем, чтобы у последней ячейки в строке не было правой границы */
td:last-child {
  border-right: none;
}
</style>