<script setup>
import { ref } from 'vue';
// 1. Импортируем useRoute для доступа к информации о текущем маршруте
import { useRoute } from 'vue-router';

// Массив с навигационными ссылками для шапки сайта
const navLinks = [
  { name: 'Главная', path: '/', preview: '/src/images/previews/preview-home.jpg' },
  {
    name: 'О нас',
    isDropdown: true,
    children: [
      { name: 'Команда', path: '/team' },
      { name: 'Новости', path: '/news' },
      { name: 'Вакансии', path: '/vacancies' },
      { name: 'Оборудование', path: '/equipment' },
    ]
  },
  { name: 'Наши работы', path: '/gallery', preview: '/src/images/previews/preview-gallery.jpg' },
  { name: 'Акции', path: '/promotions', preview: null },
  { name: 'Магазин', path: '/shop', preview: '/src/images/previews/preview-shop.jpg' },
  { name: 'Подготовка к печати', path: '/preparation', preview: null },
];

// 2. Получаем объект текущего маршрута
const route = useRoute();

// Логика для отображения превью при наведении на пункты меню
const activeLink = ref(null);
const previewStyle = ref({});
const isPreviewVisible = ref(false);
let hideTimer = null;

const handleMouseEnter = (event, link) => {
  if (hideTimer) clearTimeout(hideTimer);

  // 3. Добавляем проверку: превью показывается, только если есть картинка
  // и если путь ссылки не совпадает с текущим путем страницы.
  if (link.preview && route.path !== link.path) {
    const linkRect = event.currentTarget.getBoundingClientRect();
    const PREVIEW_WIDTH = 320;
    
    const left = linkRect.left + (linkRect.width / 2) - (PREVIEW_WIDTH / 2);
    const top = linkRect.bottom + 20;

    previewStyle.value = { top: `${top}px`, left: `${left}px` };
    activeLink.value = link;
    isPreviewVisible.value = true;
  } else {
    isPreviewVisible.value = false;
    activeLink.value = null;
  }
};

const handleMouseLeave = () => {
  hideTimer = setTimeout(() => {
    isPreviewVisible.value = false;
    activeLink.value = null;
  }, 300);
};

const onPreviewEnter = () => {
  if (hideTimer) clearTimeout(hideTimer);
};
</script>

<template>
  <!-- Главный контейнер сайта -->
  <div class="site-container">
    <!-- Шапка сайта -->
    <header class="site-header">
      <router-link to="/" class="cursor-pointer">
        <img src="/src/images/red-panda-logo-black.svg" alt="Логотип Red Panda" class="h-10">
      </router-link>
      <nav>
        <ul class="flex items-center space-x-8 text-header-panda">
          <li
            v-for="link in navLinks"
            :key="link.name"
            class="relative"
            :class="{ 'dropdown': link.isDropdown }"
            @mouseenter="handleMouseEnter($event, link)"
            @mouseleave="handleMouseLeave"
          >
            <!-- Обычная ссылка -->
            <router-link v-if="!link.isDropdown" :to="link.path">
              {{ link.name }}
            </router-link>
            <!-- Выпадающее меню -->
            <div v-else class="nav-item">
              {{ link.name }}
              <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
            </div>
            <ul v-if="link.isDropdown" class="dropdown-menu">
              <li v-for="child in link.children" :key="child.name">
                <router-link :to="child.path" class="dropdown-item">{{ child.name }}</router-link>
              </li>
            </ul>
          </li>
        </ul>
      </nav>
    </header>

    <!-- Основной контент страницы (меняется в зависимости от URL) -->
    <main class="main-content">
      <router-view />
    </main>

    <!-- Код подвала -->
    <footer class="bg-panda-black text-gray-400 font-medium">
      <div class="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-10 md:gap-x-8">

          <div class="flex flex-col space-y-6">
            <div class="flex items-center space-x-3">
              <img src="/src/images/red-panda-logo-white.svg" alt="Логотип Red Panda" class="h-10">
            </div>
            <div class="pt-2">
              <h3 class="font-semibold text-white text-h5-panda">Подпишитесь на рассылку</h3>
              <p class="text-sm text-dark-gray">о будущих акциях</p>
            </div>
            <form class="space-y-4 max-w-sm" @submit.prevent>
              <input
                type="email"
                placeholder="Ваш email-адрес"
                class="w-full px-4 py-3 bg-transparent border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-panda-orange focus:ring-1 focus:ring-panda-orange"
              >
              <div class="flex items-start">
                <input id="consent" type="checkbox" class="h-4 w-4 mt-1 bg-transparent rounded border-gray-500 text-panda-orange focus:ring-panda-orange focus:ring-offset-panda-black">
                <label for="consent" class="ml-3 text-xs">
                  Вы соглашаетесь на информационную рассылку. Отписаться можно в любое время.
                </label>
              </div>
              <button
                type="submit"
                class="w-full bg-white text-panda-black font-bold py-3 px-4 rounded-full hover:bg-gray-200 transition-colors"
              >
                Подписаться
              </button>
            </form>
          </div>

          <div class="flex flex-col items-start md:items-center text-left md:text-center space-y-4">
            <div class="w-full max-w-sm h-48 rounded-lg overflow-hidden border border-gray-700">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2506.273103273479!2d71.4089980769351!3d51.12140683935391!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x424584343513481d%3A0x6a273b5e7838562b!2z0JrQvtGA0LPQsNC70LbQutC-0LTgaCBYeXlhLCBCYXNoa2lyc2tpaSAvIFNob3NzZSAySywgQXN0YW5hLCDQmtCw0LfQsNC20YHRgtCw0L0!5e0!3m2!1sen!2sus!4v1687853472000"
                class="w-full h-full border-0"
                allowfullscreen=""
                loading="lazy"
                referrerpolicy="no-referrer-when-downgrade">
              </iframe>
            </div>
            <div class="text-sm">
              <p>Астана, Шоссе Коргалжын, 6</p>
              <p>ПН-ПТ 10:00-18:00</p>
            </div>
          </div>

          <div class="flex flex-col items-start lg:items-end space-y-5 text-left lg:text-right">
            <div class="flex space-x-4">
              <div class="text-center">
                <img src="/src/images/QR-site.svg" alt="QR Code redpanda.kz" class="w-24 h-24 rounded-md p-1">
                <p class="text-xs mt-1">redpanda.kz</p>
              </div>
              <div class="text-center">
                <img src="/src/images/QR-instagram.svg" alt="QR Code redpandakz" class="w-24 h-24 rounded-md p-1">
                <p class="text-xs mt-1">redpandakz</p>
              </div>
            </div>
            <div class="flex flex-wrap justify-start lg:justify-end gap-2">
              <a href="#" class="px-5 py-1.5 bg-gray-700 text-white text-sm font-semibold rounded-full hover:bg-gray-600 transition-colors">Whatsapp</a>
              <a href="#" class="px-5 py-1.5 bg-gray-700 text-white text-sm font-semibold rounded-full hover:bg-gray-600 transition-colors">Instagram</a>
              <a href="#" class="px-5 py-1.5 bg-gray-700 text-white text-sm font-semibold rounded-full hover:bg-gray-600 transition-colors">2GIS</a>
            </div>
            <div class="text-sm">
              <p>+7 700 725-77-99</p>
              <p>infoprint@redpanda.kz</p>
            </div>
            <div class="text-xs">
              <p>TOO «RED PANDA» БИН 221240030264</p>
            </div>
          </div>

        </div>
        <div class="border-t border-gray-700 mt-12 pt-8 text-center text-gray-500 text-xs">
          © 2024 TOO «RED PANDA». Все права защищены.
        </div>
      </div>
    </footer>
    <!-- Конец кода подвала -->

    <!-- Окно для предпросмотра страниц при наведении -->
    <transition name="preview">
      <router-link
        v-if="isPreviewVisible && activeLink"
        :to="activeLink.path"
        class="preview-window"
        :style="previewStyle"
        @mouseenter="onPreviewEnter"
        @mouseleave="handleMouseLeave"
      >
        <img :src="activeLink.preview" alt="Page preview" class="preview-image">
      </router-link>
    </transition>
  </div>
</template>

<style scoped>
/* Стили для основного макета */
.site-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #F7F7F7;
}
.site-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  position: sticky;
  top: 0;
  z-index: 10;
}
.main-content {
  flex-grow: 1;
}

/* Стили для навигации */
nav a, .nav-item {
  position: relative;
  font-family: 'Gilroy-SemiBold', sans-serif;
  color: #131C26;
  text-decoration: none;
  cursor: pointer;
  padding: 8px 0;
  transition: color 0.2s ease-in-out;
  display: flex;
  align-items: center;
}
nav a:hover, .dropdown:hover .nav-item {
  color: #F15F31;
}
nav a::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: #F15F31;
  transform: scaleX(0);
  transform-origin: center;
  transition: transform 0.3s ease-out;
}
nav a:hover::after {
  transform: scaleX(1);
}
nav a.router-link-exact-active {
  color: #F15F31;
}
nav a.router-link-exact-active::after {
  transform: scaleX(1);
}

/* Стили для выпадающего меню */
.dropdown-menu {
  display: none;
  position: absolute;
  top: 100%;
  left: 0;
  background-color: white;
  min-width: 200px;
  box-shadow: 0 8px 16px rgba(0,0,0,0.1);
  z-index: 20;
  border-radius: 0 0 8px 8px;
  padding: 8px 0;
  margin-top: 2px;
}
.dropdown:hover .dropdown-menu {
  display: block;
}
.dropdown-item {
  color: black;
  padding: 12px 16px;
  text-decoration: none;
  display: block;
  text-align: left;
  width: 100%;
  background: none;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out, color 0.2s ease-in-out;
}
.dropdown-item:hover {
  background-color: #f1f1f1;
  color: #F15F31;
}

/* Стили для окна предпросмотра */
.preview-window {
  position: fixed;
  width: 320px;
  height: 240px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  z-index: 50;
  cursor: pointer;
}
.preview-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease-out;
}
.preview-window:hover .preview-image {
  transform: scale(1.1) translateY(-10px);
}
.preview-enter-active, .preview-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.preview-enter-from, .preview-leave-to {
  opacity: 0;
  transform: translateY(10px) scale(0.98);
}
</style>
