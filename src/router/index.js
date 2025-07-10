// src/router/index.js

import { createRouter, createWebHistory } from 'vue-router';
import { useServicesStore } from '@/stores/services.js'; // <-- Импортируем наше новое хранилище

// Импортируем компоненты страниц
import HomePage from '@/components/pages/HomePage.vue';
import GalleryPage from '@/components/pages/GalleryPage.vue';
import PromotionsPage from '@/components/pages/PromotionsPage.vue';
import EquipmentPage from '@/components/pages/EquipmentPage.vue';
import TeamPage from '@/components/pages/TeamPage.vue';
import VacanciesPage from '@/components/pages/VacanciesPage.vue';
import NewsPage from '@/components/pages/NewsPage.vue';
import ShopPage from '@/components/pages/ShopPage.vue';
import PreparationPage from '@/components/pages/PreparationPage.vue';
import AuthPage from '@/components/pages/AuthPage.vue';
import NotFoundPage from '@/components/pages/NotFoundPage.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomePage,
    meta: { title: 'Главная - Red Panda' }
  },
  {
    path: '/gallery',
    name: 'Gallery',
    component: GalleryPage,
    meta: { title: 'Портфолио - Red Panda' }
  },
  {
    path: '/promotions',
    name: 'Promotions',
    component: PromotionsPage,
    meta: { title: 'Акции - Red Panda' }
  },
  {
    path: '/equipment',
    name: 'Equipment',
    component: EquipmentPage,
    meta: { title: 'Оборудование - Red Panda' }
  },
  {
    path: '/team',
    name: 'Team',
    component: TeamPage,
    meta: { title: 'Наша команда - Red Panda' }
  },
  {
    path: '/vacancies',
    name: 'Vacancies',
    component: VacanciesPage,
    meta: { title: 'Вакансии - Red Panda' }
  },
  {
    path: '/news',
    name: 'News',
    component: NewsPage,
    meta: { title: 'Новости - Red Panda' }
  },
  {
    path: '/shop',
    name: 'Shop',
    component: ShopPage,
    meta: { title: 'Магазин - Red Panda' }
  },
  {
    path: '/preparation',
    name: 'Preparation',
    component: PreparationPage,
    meta: { title: 'Подготовка к печати - Red Panda' }
  },
  {
    path: '/auth',
    name: 'Auth',
    component: AuthPage,
    meta: { title: 'Вход - Red Panda' }
  },

  // 👇 НАШ НОВЫЙ ДИНАМИЧЕСКИЙ МАРШРУТ 👇
  {
    path: '/services/:slug', // :slug - это динамический параметр, который будет меняться
    name: 'ServiceDetail',
    // "Ленивая" загрузка: компонент загрузится, только когда пользователь зайдет на эту страницу
    component: () => import('@/components/pages/ServiceDetailPage.vue'),
    props: true, // Разрешаем передачу :slug в компонент как свойство (prop)
    meta: {
      // Функция для динамического создания заголовка страницы
      title: (to) => {
        const servicesStore = useServicesStore();
        // Находим услугу по 'slug' из URL
        const service = servicesStore.findById(to.params.slug);
        // Возвращаем ее заголовок или текст по умолчанию
        return service ? `${service.title} - Red Panda` : 'Услуга не найдена';
      }
    }
  },
  // 👆 КОНЕЦ НОВОГО МАРШРУТА 👆
  
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFoundPage,
    meta: { title: 'Страница не найдена - Red Panda' }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  // Прокрутка к верху страницы при каждом переходе
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 };
    }
  }
});

// 👇 НОВАЯ ЛОГИКА ОБНОВЛЕНИЯ ЗАГОЛОВКА 👇
// Этот код выполняется после каждого перехода на новую страницу
router.afterEach((to) => {
  // Проверяем, является ли заголовок функцией (как в нашем новом маршруте)
  if (typeof to.meta.title === 'function') {
    // Если да, вызываем эту функцию и устанавливаем результат как заголовок документа
    document.title = to.meta.title(to);
  } else {
    // Иначе, просто используем текстовый заголовок
    document.title = to.meta.title || 'Red Panda';
  }
});

export default router;