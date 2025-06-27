// src/router/index.js

import { createRouter, createWebHistory } from 'vue-router';

// Импортируем все наши компоненты-страницы
import HomePage from '../components/HomePage.vue';
import GalleryPage from '../components/GalleryPage.vue';
import ProjectDetailPage from '../components/ProjectDetailPage.vue';
import ShopPage from '../components/ShopPage.vue';
import TeamPage from '../components/TeamPage.vue';
import NewsPage from '../components/NewsPage.vue';
import VacanciesPage from '../components/VacanciesPage.vue';
import EquipmentPage from '../components/EquipmentPage.vue';
import PromotionsPage from '../components/PromotionsPage.vue';
import PreparationPage from '../components/PreparationPage.vue';
import NotFoundPage from '../components/NotFoundPage.vue'; // <-- ИЗМЕНЕНИЕ: Импортируем новый компонент

// Определяем массив маршрутов.
// Каждый объект - это отдельная страница на сайте.
const routes = [
  {
    path: '/', // URL-адрес
    name: 'Home', // Имя маршрута (удобно для программной навигации)
    component: HomePage, // Компонент, который будет отображаться
  },
  {
    path: '/gallery',
    name: 'Gallery',
    component: GalleryPage,
  },
  {
    path: '/project-detail', // Этот маршрут можно будет улучшить, чтобы принимать ID проекта
    name: 'ProjectDetail',
    component: ProjectDetailPage,
  },
  {
    path: '/shop',
    name: 'Shop',
    component: ShopPage,
  },
  {
    path: '/team',
    name: 'Team',
    component: TeamPage,
  },
  {
    path: '/news',
    name: 'News',
    component: NewsPage,
  },
  {
    path: '/vacancies',
    name: 'Vacancies',
    component: VacanciesPage,
  },
  {
    path: '/equipment',
    name: 'Equipment',
    component: EquipmentPage,
  },
  {
    path: '/promotions',
    name: 'Promotions',
    component: PromotionsPage,
  },
  {
    path: '/preparation',
    name: 'Preparation',
    component: PreparationPage,
  },
  // --- ИЗМЕНЕНИЕ: Добавлен маршрут для страницы 404 ---
  // Он должен быть ПОСЛЕДНИМ в списке.
  // Он "ловит" все адреса, которые не совпали с маршрутами выше.
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFoundPage,
  },
];

// Создаем экземпляр роутера
const router = createRouter({
  // createWebHistory() включает "чистые" URL без символа #
  history: createWebHistory(),
  routes,
  // Эта функция будет прокручивать страницу наверх при каждом переходе
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 };
    }
  },
});

// Экспортируем роутер для использования в main.js
export default router;