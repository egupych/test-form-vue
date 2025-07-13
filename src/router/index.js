// ---> src/router/index.js

import { createRouter, createWebHistory } from 'vue-router';
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
  { path: '/', name: 'Home', component: HomePage, meta: { title: 'Главная - Red Panda' } },
  { path: '/gallery', name: 'Gallery', component: GalleryPage, meta: { title: 'Портфолио - Red Panda' } },
  { path: '/promotions', name: 'Promotions', component: PromotionsPage, meta: { title: 'Акции - Red Panda' } },
  { path: '/equipment', name: 'Equipment', component: EquipmentPage, meta: { title: 'Оборудование - Red Panda' } },
  { path: '/team', name: 'Team', component: TeamPage, meta: { title: 'Наша команда - Red Panda' } },
  { path: '/vacancies', name: 'Vacancies', component: VacanciesPage, meta: { title: 'Вакансии - Red Panda' } },
  { path: '/news', name: 'News', component: NewsPage, meta: { title: 'Новости - Red Panda' } },
  { path: '/shop', name: 'Shop', component: ShopPage, meta: { title: 'Магазин - Red Panda' } },
  { path: '/preparation', name: 'Preparation', component: PreparationPage, meta: { title: 'Подготовка к печати - Red Panda' } },
  { path: '/auth', name: 'Auth', component: AuthPage, meta: { title: 'Вход - Red Panda' } },
  
  // !!! МАРШРУТ /services/:slug УДАЛЕН !!!
  
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFoundPage, meta: { title: 'Страница не найдена - Red Panda' } }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (to.hash) {
      // Плавная прокрутка к якорю
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({ el: to.hash, behavior: 'smooth', top: 100 }); // top: 100 - отступ для хедера
        }, 300); // Задержка для загрузки контента
      });
    } else if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 };
    }
  }
});

router.afterEach((to) => {
  document.title = to.meta.title || 'Red Panda';
});

export default router;