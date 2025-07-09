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
  {
    path: '/',
    name: 'Home',
    component: HomePage,
    meta: {
      title: 'Red Panda — Полиграфия и печатные услуги в Астане',
      description: 'Современное печатное агентство Red Panda в Астане. Полный спектр полиграфических услуг от визиток до наружной рекламы. Персональный подход и гарантия качества.'
    }
  },
  {
    path: '/auth',
    name: 'Auth',
    component: AuthPage,
    meta: {
      title: 'Вход или регистрация | Red Panda',
      description: 'Войдите в свой аккаунт или зарегистрируйтесь, чтобы получить доступ к истории заказов и специальным предложениям от Red Panda.'
    }
  },
  {
    path: '/gallery',
    name: 'Gallery',
    component: GalleryPage,
    meta: {
      title: 'Портфолио | Наши работы | Red Panda',
      description: 'Примеры наших работ: каталоги, упаковка, сувенирная продукция, фирменный стиль. Оцените качество и креативность наших проектов.'
    }
  },
  {
    path: '/project-detail',
    name: 'ProjectDetail',
    component: ProjectDetailPage,
    meta: {
      title: 'Пример проекта | Red Panda',
      description: 'Детальный разбор одного из наших кейсов. Посмотрите, как мы разрабатываем фирменный стиль и полиграфическую продукцию для наших клиентов.'
    }
  },
  {
    path: '/shop',
    name: 'Shop',
    component: ShopPage,
    meta: {
      title: 'Магазин | Готовая продукция | Red Panda',
      description: 'Ознакомьтесь с нашими спецпредложениями. Дизайнерские календари, блокноты и другая готовая продукция от нашего агентства.'
    }
  },
  {
    path: '/team',
    name: 'Team',
    component: TeamPage,
    meta: {
      title: 'Наша Команда | Red Panda',
      description: 'Познакомьтесь с профессионалами, которые стоят за качеством Red Panda. Наша история и ключевые специалисты.'
    }
  },
  {
    path: '/news',
    name: 'News',
    component: NewsPage,
    meta: {
      title: 'Новости компании | Red Panda',
      description: 'Будьте в курсе последних событий, достижений и новостей нашего печатного агентства. Актуальная информация от Red Panda.'
    }
  },
  {
    path: '/vacancies',
    name: 'Vacancies',
    component: VacanciesPage,
    meta: {
      title: 'Вакансии | Работа в Red Panda',
      description: 'Присоединяйтесь к команде Red Panda. Актуальные вакансии и кадровый резерв. Мы ищем талантливых специалистов.'
    }
  },
  {
    path: '/equipment',
    name: 'Equipment',
    component: EquipmentPage,
    meta: {
      title: 'Наше оборудование | Red Panda',
      description: 'Узнайте о нашем парке оборудования: XEROX, Roland, Duplo. Гарантия высокого качества печати и постпечатной обработки.'
    }
  },
  {
    path: '/promotions',
    name: 'Promotions',
    component: PromotionsPage,
    meta: {
      title: 'Акции и спецпредложения | Red Panda',
      description: 'Выгодные предложения и скидки на полиграфические услуги. Воспользуйтесь нашими акциями для новых и постоянных клиентов.'
    }
  },
  {
    path: '/preparation',
    name: 'Preparation',
    component: PreparationPage,
    meta: {
      title: 'Подготовка к печати | Red Panda',
      description: 'Требования к макетам, стандартные размеры бумаги и шаблоны для скачивания. Все, что нужно для правильной подготовки файлов к печати.'
    }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFoundPage,
    meta: {
      title: '404 — Страница не найдена | Red Panda',
      description: 'К сожалению, запрашиваемая страница не существует, была перемещена или удалена. Вернитесь на главную.'
    }
  },
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

// --- ЭТАП 1: ГЛАВНОЕ ИЗМЕНЕНИЕ ---
// Этот код будет выполняться перед каждым переходом на новую страницу
router.beforeEach((to, from, next) => {
  // Устанавливаем заголовок страницы из meta-данных маршрута
  document.title = to.meta.title || 'Red Panda — Полиграфия';

  // Ищем мета-тег description
  let descriptionTag = document.querySelector('meta[name="description"]');

  // Если его нет, создаем и добавляем в head
  if (!descriptionTag) {
    descriptionTag = document.createElement('meta');
    descriptionTag.setAttribute('name', 'description');
    document.head.appendChild(descriptionTag);
  }

  // Устанавливаем содержимое description из meta-данных
  descriptionTag.setAttribute('content', to.meta.description || 'Печатное агентство Red Panda. Все виды полиграфических услуг в Астане.');

  next();
});
// --- КОНЕЦ ГЛАВНОГО ИЗМЕНЕНИЯ ---

export default router;