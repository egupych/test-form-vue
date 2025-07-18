/*
  Файл: src/router/index.js
  Описание: Финальная, самая надёжная версия роутера.

  КАК РАБОТАЕТ:
  1. Мы по-прежнему используем `meta: { order: ... }` для определения порядка страниц.
  2. КЛЮЧЕВОЕ ИЗМЕНЕНИЕ: Мы добавили `router.beforeEach`. Это функция-перехватчик,
     которая срабатывает перед каждым переходом.
  3. Внутри неё мы сравниваем `order` уходящей и приходящей страниц.
  4. Результат (имя нужной анимации, 'slide-left' или 'slide-right') мы записываем
     прямо в `to.meta.transition`.
  5. Таким образом, компонент App.vue всегда будет получать уже готовое, правильное имя анимации.
*/
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
  { path: '/', name: 'Home', component: HomePage, meta: { title: 'Главная - Red Panda', order: 1 } },
  { path: '/gallery', name: 'Gallery', component: GalleryPage, meta: { title: 'Портфолио - Red Panda', order: 2 } },
  { path: '/promotions', name: 'Promotions', component: PromotionsPage, meta: { title: 'Акции - Red Panda', order: 3 } },
  { path: '/preparation', name: 'Preparation', component: PreparationPage, meta: { title: 'Подготовка к печати - Red Panda', order: 4 } },
  { path: '/shop', name: 'Shop', component: ShopPage, meta: { title: 'Магазин - Red Panda', order: 5 } },
  { path: '/team', name: 'Team', component: TeamPage, meta: { title: 'Наша команда - Red Panda', order: 6 } },
  { path: '/news', name: 'News', component: NewsPage, meta: { title: 'Новости - Red Panda', order: 7 } },
  { path: '/vacancies', name: 'Vacancies', component: VacanciesPage, meta: { title: 'Вакансии - Red Panda', order: 8 } },
  { path: '/equipment', name: 'Equipment', component: EquipmentPage, meta: { title: 'Оборудование - Red Panda', order: 9 } },
  { path: '/auth', name: 'Auth', component: AuthPage, meta: { title: 'Вход - Red Panda', order: 100 } },
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFoundPage, meta: { title: 'Страница не найдена - Red Panda', order: 101 } }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 }),
});

// --- ГЛАВНАЯ ЛОГИКА ОПРЕДЕЛЕНИЯ НАПРАВЛЕНИЯ ---
router.beforeEach((to, from) => {
  const toDepth = to.meta.order;
  const fromDepth = from.meta.order;

  // Если у предыдущей страницы нет order (например, первая загрузка),
  // то просто не задаём анимацию или ставим по умолчанию.
  if (fromDepth === undefined) {
    to.meta.transition = 'slide-left';
    return;
  }

  // Если `order` новой страницы больше - движемся "вперёд".
  // Записываем имя анимации прямо в мета-данные маршрута, на который переходим.
  to.meta.transition = toDepth > fromDepth ? 'slide-left' : 'slide-right';
});

router.afterEach((to) => {
  document.title = to.meta.title || 'Red Panda';
});

export default router;