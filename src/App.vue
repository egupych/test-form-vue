<script setup>
import { ref, reactive } from 'vue'; // --- ИЗМЕНЕНИЕ: Добавили reactive ---
import { useRoute } from 'vue-router';
import InteractiveMap from './components/ui/InteractiveMap.vue';
import BaseButton from '@/components/ui/BaseButton.vue';
import WeatherWidget from '@/components/ui/WeatherWidget.vue';
import { useAuth } from '@/composables/useAuth.js';
import { useSmoothScroll } from '@/composables/useSmoothScroll.js'; 
import previewHome from '@/assets/images/app/previews/preview-home.jpg';
import previewGallery from '@/assets/images/app/previews/preview-gallery.jpg';
import previewShop from '@/assets/images/app/previews/preview-shop.jpg';

useSmoothScroll();

const { user, signOut } = useAuth(); // --- ИЗМЕНЕНИЕ: Убрали signInWithGoogle, он не нужен здесь ---

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
  { name: 'Портфолио', path: '/gallery', preview: previewGallery },
  { name: 'Акции', path: '/promotions', preview: null },
  { name: 'Магазин', path: '/shop', preview: previewShop },
  { name: 'Подготовка', path: '/preparation', preview: null },
];

const route = useRoute();
const activeDropdown = ref(null);
let hideTimer = null;

const showDropdown = (id) => {
  if (hideTimer) clearTimeout(hideTimer);
  activeDropdown.value = id;
};

const hideDropdown = () => {
  hideTimer = setTimeout(() => {
    activeDropdown.value = null;
  }, 100);
};

const activePreviewLink = ref(null);
const previewStyle = ref({});
const isPreviewVisible = ref(false);
let hidePreviewTimer = null;

const handleMouseEnterPreview = (event, link) => {
  if (hidePreviewTimer) clearTimeout(hidePreviewTimer);
  if (link.preview && route.path !== link.path) {
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

// --- НОВАЯ ЛОГИКА ДЛЯ ФОРМЫ ПОДПИСКИ ---
const subscription = reactive({
  email: '',
  consent: false,
  isSubmitting: false,
  message: '',
  messageType: 'success' // 'success' или 'error'
});

const handleSubscription = async () => {
  subscription.message = '';
  if (!subscription.consent) {
    subscription.message = 'Пожалуйста, дайте согласие на рассылку.';
    subscription.messageType = 'error';
    return;
  }
  
  subscription.isSubmitting = true;
  try {
    const response = await fetch('/api/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: subscription.email })
    });
    const result = await response.json();

    subscription.message = result.message;
    if (!response.ok) {
      subscription.messageType = 'error';
    } else {
      subscription.messageType = 'success';
      subscription.email = '';
      subscription.consent = false;
    }

  } catch (error) {
    subscription.messageType = 'error';
    subscription.message = 'Ошибка сети. Попробуйте позже.';
    console.error('Ошибка подписки:', error);
  } finally {
    subscription.isSubmitting = false;
  }
};

</script>

<template>
  <div class="site-container">
    <header class="site-header">
      <div class="max-w-6xl mx-auto flex items-center w-full">
        <router-link to="/" class="cursor-pointer flex-none">
          <img src="@/assets/images/layout/red-panda-logo-black.svg" alt="Логотип Red Panda" class="h-12 pr-2">
        </router-link>

        <nav class="mx-auto">
          <ul class="flex items-center space-x-8 text-header-panda">
            <li
              v-for="link in navLinks"
              :key="link.name"
              class="relative"
              :class="{ 'dropdown': link.isDropdown }"
              @mouseenter="handleMouseEnterPreview($event, link); if (link.isDropdown) showDropdown(link.id);"
              @mouseleave="handleMouseLeavePreview(); if (link.isDropdown) hideDropdown();"
            >
              <router-link v-if="!link.isDropdown" :to="link.path">
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
            </li>
          </ul>
        </nav>

        <div class="flex items-center flex-none gap-4">
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
      </div>
    </header>

    <main class="main-content">
      <router-view />
    </main>

    <footer class="text-light-gray bg-panda-black text-gray-400 font-medium">
        <div class="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-10 md:gap-x-8">
                <div class="flex flex-col space-y-6">
                    <div class="flex items-center space-x-3">
                      <img src="@/assets/images/layout/red-panda-logo-white.svg" alt="Логотип Red Panda" class="h-15">
                    </div>
                    <div class="pt-2">
                      <h3 class="font-semibold text-white text-h5-panda">Подпишитесь на рассылку</h3>
                      <p class="text-sm text-dark-gray">о будущих акциях</p>
                    </div>
                    <form class="space-y-4 max-w-sm" @submit.prevent="handleSubscription">
                      <input
                          v-model="subscription.email"
                          type="email"
                          placeholder="Ваш email-адрес"
                          class="w-full px-4 py-3 bg-transparent border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-panda-orange focus:ring-1 focus:ring-panda-orange"
                          required
                      >
                      <div class="flex items-start">
                          <input 
                            v-model="subscription.consent"
                            id="consent" 
                            type="checkbox" 
                            class="h-4 w-4 mt-1 bg-transparent rounded border-gray-500 text-panda-orange focus:ring-panda-orange focus:ring-offset-panda-black"
                          >
                          <label for="consent" class="ml-3 text-xs">
                            Вы соглашаетесь на информационную рассылку. Отписаться можно в любое время.
                          </label>
                      </div>
                      <button
                          type="submit"
                          :disabled="subscription.isSubmitting"
                          class="w-full bg-white text-panda-black font-bold py-3 px-4 rounded-full hover:bg-gray-200 transition-colors disabled:opacity-50"
                      >
                          {{ subscription.isSubmitting ? 'Отправка...' : 'Подписаться' }}
                      </button>
                       <div v-if="subscription.message" 
                          :class="[subscription.messageType === 'success' ? 'text-panda-green' : 'text-panda-orange']"
                          class="text-sm text-center pt-2">
                          {{ subscription.message }}
                      </div>
                    </form>
                </div>
                <div class="flex flex-col items-start md:items-center text-left md:text-center space-y-4">
                    <div class="w-full max-w-sm h-80 rounded-2xl overflow-hidden">
                        <InteractiveMap />
                    </div>
                    <div class="text-sm">
                    <p>Астана, Шоссе Коргалжын, 6</p>
                    <p>ПН-ПТ 10:00-18:00</p>
                    </div>
                </div>
                <div class="flex flex-col items-start lg:items-end space-y-5 text-left lg:text-right">
                    <div class="flex space-x-4">
                      <div class="text-center">
                          <img src="@/assets/images/layout/QR-site.svg" alt="QR Code redpanda.kz" class="w-24 h-24 rounded-md p-1">
                          <p class="text-md mt-1">redpanda.kz</p>
                      </div>
                      <div class="text-center">
                          <img src="@/assets/images/layout/QR-instagram.svg" alt="QR Code redpandakz" class="w-24 h-24 rounded-md p-1">
                          <p class="text-md mt-1">redpandakz</p>
                      </div>
                    </div>
                    <div class="flex flex-wrap justify-start lg:justify-end gap-2">
                      <a href="https://wa.me/77007257799" class="px-5 py-1.5 bg-gray-700 text-light-gray text-sm font-semibold border rounded-full hover:bg-gray-600 transition-colors">Whatsapp</a>
                      <a href="https://www.instagram.com/redpandakz/" class="px-5 py-1.5 bg-gray-700 text-light-gray text-sm font-semibold border rounded-full hover:bg-gray-600 transition-colors">Instagram</a>
                      <a href="https://2gis.kz/astana/firm/70000001067520759" class="px-5 py-1.5 bg-gray-700 text-light-gray text-sm font-semibold border rounded-full hover:bg-gray-600 transition-colors">2GIS</a>
                    </div>
                    <div class="text-sm">
                      <p>+7 (700) 725-77-99</p>
                      <p>infoprint@redpanda.kz</p>
                      <p>TOO «RED PANDA» БИН 221240030264</p>
                    </div>
                </div>
            </div>
        </div>
    </footer>
    
    <transition name="preview">
      <router-link
        v-if="isPreviewVisible && activePreviewLink"
        :to="activePreviewLink.path"
        class="preview-window"
        :style="previewStyle"
        @mouseenter="cancelHidePreviewTimer"
        @mouseleave="handleMouseLeavePreview"
      >
        <img :src="activePreviewLink.preview" alt="Page preview" class="preview-image">
      </router-link>
    </transition>
  </div>
</template>

<style scoped>
/* Все стили остаются прежними, здесь нет изменений */
.site-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #F7F7F7;
}
.site-header {
  display: flex;
  align-items: center;
  padding-top: 1rem;
  padding-bottom: 1.2rem;
  padding-left: 2rem;
  padding-right: 2rem;
  background-color: #f7f7f7cc;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  position: sticky;
  top: 0;
  z-index: 1000;
  backdrop-filter: blur(10px);
}
.main-content {
  flex-grow: 1;
}
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
.preview-window {
  position: fixed;
  width: 320px;
  height: 240px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  z-index: 50;
  cursor: pointer;
}
.preview-window::after {
  content: '';
  position: absolute;
  top: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 0 10px 10px 10px;
  border-color: transparent transparent white transparent;
  filter: drop-shadow(0 -2px 2px rgba(0, 0, 0, 0.03));
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
.preview-enter-active, .preview-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.preview-enter-from, .preview-leave-to {
  opacity: 0;
  transform: translateY(10px) scale(0.98);
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
</style>