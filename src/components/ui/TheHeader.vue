<script setup>
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import BaseButton from '@/components/ui/BaseButton.vue';
import WeatherWidget from '@/components/ui/WeatherWidget.vue';
import { useAuth } from '@/composables/useAuth.js';
import PreviewWindow from '@/components/ui/PreviewWindow.vue'; // Импортируем новый компонент
import previewHome from '@/assets/images/app/previews/preview-home.jpg';
import previewGallery from '@/assets/images/app/previews/preview-gallery.jpg';
import previewShop from '@/assets/images/app/previews/preview-shop.jpg';

const { user, signOut } = useAuth();

const isMobileMenuOpen = ref(false);

const navLinks = [
  { name: 'Главная', path: '/', preview: previewHome },
  {
    name: 'О нас',
    isDropdown: true,
    id: 'about',
    children: [
      { name: 'Команда', path: '/team' },
      { name: 'Новости', path: '/news' },
      { name: 'Вакансии', path: '/vacancies' },
      { name: 'Оборудование', path: '/equipment' },
    ]
  },
  { name: 'Акции', path: '/promotions', preview: null },
  { name: 'Подготовка', path: '/preparation', preview: null },
  { name: 'Проекты', id: 'project-dev', path: '/gallery', preview: previewGallery, inDevelopment: true },
  { name: 'Магазин', id: 'shop-dev', path: '/shop', preview: previewShop, inDevelopment: true },
];

const route = useRoute();
const activeDropdown = ref(null);
let hideTimer = null;

const showDropdown = (id) => {
  if (hideTimer) {
    clearTimeout(hideTimer);
    hideTimer = null;
  }
  activeDropdown.value = id;
};

const hideDropdown = () => {
  hideTimer = setTimeout(() => {
    activeDropdown.value = null;
  }, 100);
};

const handleMobileLinkClick = () => {
  isMobileMenuOpen.value = false;
};

watch(isMobileMenuOpen, (isOpen) => {
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

const activePreviewLink = ref(null);
const previewStyle = ref({});
const isPreviewVisible = ref(false);
let hidePreviewTimer = null;

const handleMouseEnterPreview = (event, link) => {
  if (hidePreviewTimer) clearTimeout(hidePreviewTimer);
  if (link.preview && route.path !== link.path && !link.inDevelopment) {
    const linkRect = event.currentTarget.getBoundingClientRect();
    const PREVIEW_WIDTH = 320;
    const left = linkRect.left + (linkRect.width / 2) - (PREVIEW_WIDTH / 2);
    const top = linkRect.bottom + 22;
    previewStyle.value = { top: `${top}px`, left: `${left}px` };
    activePreviewLink.value = link;
    isPreviewVisible.value = true;
  } else {
    isPreviewVisible.value = false;
    activePreviewLink.value = null;
  }
};

const handleMouseLeavePreview = () => {
  hidePreviewTimer = setTimeout(() => {
    isPreviewVisible.value = false;
    activePreviewLink.value = null;
  }, 200);
};

const cancelHidePreviewTimer = () => {
  if (hidePreviewTimer) clearTimeout(hidePreviewTimer);
};
</script>

<template>
  <div>
    <header class="site-header">
      <div class="max-w-6xl mx-auto flex items-center justify-between w-full">
        <router-link to="/" class="cursor-pointer flex-none z-50">
          <img src="@/assets/images/layout/red-panda-logo-black.svg" alt="Логотип Red Panda" class="h-12 pr-2">
        </router-link>

        <nav class="mx-auto hidden md:block">
          <ul class="flex items-center space-x-8 text-header-panda">
             <li
              v-for="link in navLinks"
              :key="link.name"
              class="relative"
              :class="{ 'dropdown': link.isDropdown || link.inDevelopment }"
              @mouseenter="showDropdown(link.id); handleMouseEnterPreview($event, link)"
              @mouseleave="hideDropdown(); handleMouseLeavePreview()"
            >
              <div v-if="link.inDevelopment" class="nav-item-inactive">
                {{ link.name }}
              </div>
              <router-link v-else-if="!link.isDropdown" :to="link.path">
                {{ link.name }}
              </router-link>
              <div v-else class="nav-item">
                {{ link.name }}
                <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>

              <transition name="slide-down">
                <ul
                  v-if="link.isDropdown && activeDropdown === link.id"
                  class="dropdown-menu"
                  @mouseenter="showDropdown(link.id)"
                  @mouseleave="hideDropdown()"
                >
                  <li v-for="child in link.children" :key="child.name">
                    <router-link :to="child.path" class="dropdown-item">{{ child.name }}</router-link>
                  </li>
                </ul>
              </transition>

              <transition name="slide-down">
                <div
                  v-if="link.inDevelopment && activeDropdown === link.id"
                  class="dropdown-menu dev-dropdown"
                  @mouseenter="showDropdown(link.id)"
                  @mouseleave="hideDropdown()"
                >
                <svg width="21" height="19" viewBox="0 0 21 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M18.2596 8.55593L17.1396 6.34832L20.2705 5.04088L20.0391 7.547L18.2596 8.55593ZM17.4844 9.63659L11.8288 9.10204L4.2503 17.5414C2.3736 19.7953 -0.981776 16.7847 0.753765 14.7507L7.44601 8.01212L3.79212 4.03889L2.686 3.98104L1.23972 1.41244L2.76237 0.111938L5.05791 1.92847L4.96997 2.96748L8.58453 6.8551L10.1396 5.28848L12.007 0.556237L17.8963 0.137393L18.7455 1.64153L14.9019 3.60153L17.4844 9.63659ZM3.60005 14.9219C2.44303 13.9546 0.922691 15.6601 2.14914 16.6898C3.26683 17.6293 4.7432 15.8845 3.59774 14.9219H3.60005ZM13.9277 10.4905C13.9277 10.4905 16.6652 13.3044 18.255 14.8201C20.2173 16.6945 16.2672 20.0036 14.4414 18.0945C13.053 16.6528 10.2761 13.0035 10.2761 13.0035L12.324 10.5483L13.9277 10.4905Z" fill="#8F8F8F"/>
                </svg>
                  <span>Раздел в разработке</span>
                </div>
              </transition>
            </li>
          </ul>
        </nav>

        <div class="flex items-center flex-none gap-4">
          <div class="hidden md:flex items-center gap-4">
            <WeatherWidget />
            <BaseButton v-if="!user" to="/auth" variant="stroke">
              Войти
            </BaseButton>
            <div
              v-else
              class="relative dropdown"
              @mouseenter="showDropdown('user')"
              @mouseleave="hideDropdown()"
            >
              <div class="flex items-center gap-2 cursor-pointer nav-item">
                <img :src="user.photoURL" alt="User Avatar" class="w-8 h-8 rounded-full border-2 border-gray">
                <span class="font-semibold text-sm">{{ user.displayName }}</span>
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>

              <transition name="slide-down">
                  <ul
                    v-if="activeDropdown === 'user'"
                    class="dropdown-menu user-menu"
                    @mouseenter="showDropdown('user')"
                    @mouseleave="hideDropdown()"
                  >
                    <li>
                      <button @click="signOut" class="dropdown-item w-full">Выйти</button>
                    </li>
                  </ul>
              </transition>
            </div>
          </div>

          <button @click="isMobileMenuOpen = !isMobileMenuOpen" class="flex md:hidden z-50 burger-button" :class="{ 'is-active': isMobileMenuOpen }">
            <span class="line"></span>
            <span class="line"></span>
            <span class="line"></span>
          </button>
        </div>
      </div>
    </header>

    <Teleport to="body">
      <transition name="mobile-menu">
        <div v-if="isMobileMenuOpen" class="mobile-menu-container" @keydown.esc="isMobileMenuOpen = false">
          <div class="mobile-menu-backdrop" @click="isMobileMenuOpen = false"></div>
          <nav class="mobile-menu-panel">
            <div class="p-6 border-b border-gray">
                <h2 class="text-h5-panda font-bold">Меню</h2>
            </div>
            <ul class="flex-grow p-6 space-y-4 overflow-y-auto">
              <li v-for="link in navLinks" :key="`mobile-${link.name}`">
                <router-link
                  v-if="!link.isDropdown && !link.inDevelopment"
                  :to="link.path"
                  @click="handleMobileLinkClick"
                  class="mobile-menu-link"
                >
                  {{ link.name }}
                </router-link>
                <div v-else-if="link.inDevelopment" class="mobile-menu-link-inactive">
                  {{ link.name }}
                </div>
                <div v-else>
                  <span class="mobile-menu-category">{{ link.name }}</span>
                  <ul class="mt-2 space-y-2 pl-4">
                    <li v-for="child in link.children" :key="`mobile-child-${child.name}`">
                      <router-link :to="child.path" @click="handleMobileLinkClick" class="mobile-menu-sublink">
                        {{ child.name }}
                      </router-link>
                    </li>
                  </ul>
                </div>
              </li>
            </ul>
            <div class="p-6 mt-auto border-t border-gray">
              <BaseButton v-if="!user" to="/auth" variant="stroke" @click="handleMobileLinkClick" class="w-full">
                Войти
              </BaseButton>
              <div v-else class="text-center">
                <button @click="signOut(); handleMobileLinkClick()" class="w-full text-sm font-semibold text-dark-gray py-2 px-4 hover:text-panda-orange transition-colors">Выйти</button>
              </div>
            </div>
          </nav>
        </div>
      </transition>
    </Teleport>

    <PreviewWindow
      :isVisible="isPreviewVisible"
      :link="activePreviewLink"
      :style="previewStyle"
      @mouseenter="cancelHidePreviewTimer"
      @mouseleave="handleMouseLeavePreview"
    />

  </div>
</template>

<style scoped>
/* Стили для мобильного меню и прочего остаются без изменений */
.burger-button {
  width: 24px;
  height: 24px;
  flex-direction: column;
  justify-content: space-around;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
  z-index: 1050;
}
.burger-button .line {
  display: block;
  width: 100%;
  height: 3px;
  background-color: #131C26;
  border-radius: 3px;
  transition: all 0.3s ease-in-out;
}
.burger-button.is-active .line {
  background-color: #131C26;
}
.burger-button.is-active .line:nth-child(1) {
  transform: translateY(8.5px) rotate(45deg);
}
.burger-button.is-active .line:nth-child(2) {
  opacity: 0;
}
.burger-button.is-active .line:nth-child(3) {
  transform: translateY(-8.5px) rotate(-45deg);
}

.mobile-menu-container {
  position: fixed;
  inset: 0;
  z-index: 1040;
}

.mobile-menu-backdrop {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
}

.mobile-menu-panel {
  position: fixed;
  top: 0;
  right: 0;
  height: 100%;
  width: 100%;
  max-width: 20rem; /* 320px */
  background-color: white;
  box-shadow: -10px 0 30px rgba(0,0,0,0.1);
  display: flex;
  flex-direction: column;
}

.mobile-menu-enter-active .mobile-menu-backdrop,
.mobile-menu-leave-active .mobile-menu-backdrop {
    transition: opacity 0.3s ease;
}
.mobile-menu-enter-from .mobile-menu-backdrop,
.mobile-menu-leave-to .mobile-menu-backdrop {
    opacity: 0;
}

.mobile-menu-enter-active .mobile-menu-panel,
.mobile-menu-leave-active .mobile-menu-panel {
    transition: transform 0.3s ease-in-out;
}
.mobile-menu-enter-from .mobile-menu-panel,
.mobile-menu-leave-to .mobile-menu-panel {
    transform: translateX(100%);
}

.mobile-menu-link {
    @apply block text-body-panda font-semibold text-panda-black hover:text-panda-orange transition-colors py-2;
}
.router-link-exact-active.mobile-menu-link {
    @apply text-panda-orange;
}
.mobile-menu-link-inactive {
    @apply block text-body-panda font-semibold text-gray py-2 cursor-not-allowed;
}
.mobile-menu-category {
    @apply block text-body-panda font-bold text-panda-black py-2;
}
.mobile-menu-sublink {
    @apply block text-body-panda text-dark-gray hover:text-panda-orange transition-colors py-1;
}
.router-link-exact-active.mobile-menu-sublink {
    @apply text-panda-orange font-semibold;
}

/* === Стили хедера === */
.site-header {
  display: flex;
  align-items: center;
  padding: 1rem;
  background-color: #f7f7f7cc;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  backdrop-filter: blur(10px);
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
}

/* Стили навигации и выпадающих меню */
nav a, .nav-item {
  position: relative;
  font-family: 'Gilroy-SemiBold', sans-serif;
  color: #131C26;
  text-decoration: none;
  cursor: pointer;
  padding: 6px 0;
  transition: color 0.2s ease-in-out;
  display: flex;
  align-items: center;
  font-size: 16px;
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
.dropdown::after {
  content: '';
  position: absolute;
  display: block;
  top: 100%;
  left: 0;
  right: 0;
  height: 22px;
  background-color: transparent;
}
.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  margin-top: 22px;
  background-color:#F7F7F7;
  min-width: 200px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  z-index: 20;
  border-radius: 8px;
  padding: 8px 0;
}
.dropdown-menu::before {
  content: '';
  position: absolute;
  top: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 0 10px 10px 10px;
  border-color: transparent transparent #F7F7F7 transparent;
  filter: drop-shadow(0 -2px 2px rgba(0, 0, 0, 0.03));
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
.slide-down-enter-active,
.slide-down-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(-10px);
}
.user-menu.slide-down-enter-from,
.user-menu.slide-down-leave-to {
    transform: translateY(-10px);
}
.user-menu {
  left: auto !important;
  right: 0;
  transform: translateX(0) !important;
}
.user-menu::before {
  left: auto;
  right: 1rem;
  transform: translateX(0);
}
.nav-item-inactive {
  position: relative;
  font-family: 'Gilroy-SemiBold', sans-serif;
  color: #8F8F8F;
  cursor: pointer;
  padding: 6px 0;
  display: flex;
  align-items: center;
  font-size: 16px;
}
.nav-item-inactive::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: #8F8F8F;
  transform: scaleX(0);
  transform-origin: center;
  transition: transform 0.3s ease-out;
}
.nav-item-inactive:hover::after {
  transform: scaleX(1);
}
.dev-dropdown {
  padding: 12px 16px;
  color: #8F8F8F;
  font-family: 'Gilroy-SemiBold', sans-serif;
  font-size: 16px;
  text-align: center;
  white-space: nowrap;
  display: flex;
  align-items: center;
  gap: 8px;
}
</style>