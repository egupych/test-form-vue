// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';

// --- ИЗМЕНЕНИЕ: Используем правильные относительные пути ---
import HomePage from '../components/pages/HomePage.vue';
import GalleryPage from '../components/pages/GalleryPage.vue';
import ProjectDetailPage from '../components/pages/ProjectDetailPage.vue';
import ShopPage from '../components/pages/ShopPage.vue';
import TeamPage from '../components/pages/TeamPage.vue';
import NewsPage from '../components/pages/NewsPage.vue';
import VacanciesPage from '../components/pages/VacanciesPage.vue';
import EquipmentPage from '../components/pages/EquipmentPage.vue';
import PromotionsPage from '../components/pages/PromotionsPage.vue';
import PreparationPage from '../components/pages/PreparationPage.vue';
import NotFoundPage from '../components/pages/NotFoundPage.vue';
import AuthPage from '../components/pages/AuthPage.vue'; // <-- ДОБАВЛЕН ИМПОРТ

const routes = [
  { path: '/', name: 'Home', component: HomePage },
  { path: '/auth', name: 'Auth', component: AuthPage }, // <-- ДОБАВЛЕН МАРШРУТ
  { path: '/gallery', name: 'Gallery', component: GalleryPage },
  { path: '/project-detail', name: 'ProjectDetail', component: ProjectDetailPage },
  { path: '/shop', name: 'Shop', component: ShopPage },
  { path: '/team', name: 'Team', component: TeamPage },
  { path: '/news', name: 'News', component: NewsPage },
  { path: '/vacancies', name: 'Vacancies', component: VacanciesPage },
  { path: '/equipment', name: 'Equipment', component: EquipmentPage },
  { path: '/promotions', name: 'Promotions', component: PromotionsPage },
  { path: '/preparation', name: 'Preparation', component: PreparationPage },
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFoundPage },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 };
    }
  },
});

export default router;