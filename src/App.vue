<script setup>
import { ref } from 'vue';

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

const activeLink = ref(null);
const previewStyle = ref({});
const isPreviewVisible = ref(false);

let hideTimer = null;

const handleMouseEnter = (event, link) => {
  if (hideTimer) clearTimeout(hideTimer);

  if (link.preview) {
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
  <div class="site-container">
    <header class="site-header">
      <router-link to="/" class="cursor-pointer">
        <img src="/src/images/red-panda-logo-black.svg" alt="Логотип Red Panda" class="h-10">
      </router-link>
      <nav>
        <ul class="flex items-center space-x-8 text-button-panda">
          <li 
            v-for="link in navLinks" 
            :key="link.name"
            class="relative"
            :class="{ 'dropdown': link.isDropdown }"
            @mouseenter="handleMouseEnter($event, link)"
            @mouseleave="handleMouseLeave"
          >
            <router-link v-if="!link.isDropdown" :to="link.path">
              {{ link.name }}
            </router-link>
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

    <main class="main-content">
      <router-view />
    </main>

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
/* ... старые стили для шапки и меню остаются без изменений ... */
.site-container { display: flex; flex-direction: column; min-height: 100vh; background-color: #F7F7F7; }
.site-header { display: flex; justify-content: space-between; align-items: center; padding: 1rem 2rem; background-color: white; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05); position: sticky; top: 0; z-index: 10; }
.main-content { flex-grow: 1; }
nav a, .nav-item { position: relative; font-family: 'Gilroy-SemiBold', sans-serif; color: #131C26; text-decoration: none; cursor: pointer; padding: 8px 0; transition: color 0.2s ease-in-out; display: flex; align-items: center; }
nav a:hover, .dropdown:hover .nav-item { color: #F15F31; }
nav a::after { content: ''; position: absolute; bottom: 0; left: 0; width: 100%; height: 2px; background-color: #F15F31; transform: scaleX(0); transform-origin: center; transition: transform 0.3s ease-out; }
nav a:hover::after { transform: scaleX(1); }
nav a.router-link-exact-active { color: #F15F31; }
nav a.router-link-exact-active::after { transform: scaleX(1); }
.dropdown-menu { display: none; position: absolute; top: 100%; left: 0; background-color: white; min-width: 200px; box-shadow: 0 8px 16px rgba(0,0,0,0.1); z-index: 20; border-radius: 0 0 8px 8px; padding: 8px 0; margin-top: 2px; }
.dropdown:hover .dropdown-menu { display: block; }
.dropdown-item { color: black; padding: 12px 16px; text-decoration: none; display: block; text-align: left; width: 100%; background: none; border: none; cursor: pointer; transition: background-color 0.2s ease-in-out, color 0.2s ease-in-out; }
.dropdown-item:hover { background-color: #f1f1f1; color: #F15F31; }

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
  /* ИЗМЕНЕНИЕ: Добавляем плавность для анимации */
  transition: transform 0.5s ease-out;
}

/* ИЗМЕНЕНИЕ: Эффект "зума" и "панорамы" при наведении на ОКНО ПРЕВЬЮ */
.preview-window:hover .preview-image {
  transform: scale(1.1) translateY(-10px); /* Увеличиваем и немного сдвигаем вверх */
}

.preview-enter-active, .preview-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.preview-enter-from, .preview-leave-to {
  opacity: 0;
  transform: translateY(10px) scale(0.98);
}
</style>