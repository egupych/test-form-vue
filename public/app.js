// Импортируем необходимые функции из установленных пакетов Vue и Firebase
import { createApp, ref, computed, onMounted } from 'vue';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore'; 

// Импортируем компоненты страниц
import HomePage from './components/HomePage.js';
import GalleryPage from './components/GalleryPage.js';
import ProjectDetailPage from './components/ProjectDetailPage.js';
import ShopPage from './components/ShopPage.js';
import AboutPage from './components/AboutPage.js';
import TeamPage from './components/TeamPage.js';
import NewsPage from './components/NewsPage.js';
import VacanciesPage from './components/VacanciesPage.js';
import EquipmentPage from './components/EquipmentPage.js';
import PromotionsPage from './components/PromotionsPage.js';
import PreparationPage from './components/PreparationPage.js';
import FooterSection from './components/FooterSection.js'; // Футер остается отдельным файлом

// Переменные для инициализации Firebase. Их значения будут получены с сервера.
let firebaseApp, auth, db; // Объявляем переменные для экземпляров Firebase
const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id'; // Получаем appId из окружения

// Создаем и монтируем корневое Vue-приложение.
const app = createApp({
    setup() {
        const currentPage = ref('home');
        const userId = ref('Загрузка...');
        const isAuthReady = ref(false);
        const isAboutDropdownOpen = ref(false);

        // Функция для переключения выпадающего меню (для About)
        const toggleAboutDropdown = () => {
            isAboutDropdownOpen.value = !isAboutDropdownOpen.value;
        };

        const navigateTo = (page) => {
            currentPage.value = page;
            isAboutDropdownOpen.value = false; // Закрываем выпадающее меню при навигации
        };

        onMounted(async () => {
            try {
                const firebaseConfig = JSON.parse(typeof __firebase_config !== 'undefined' ? __firebase_config : '{}');

                if (firebaseConfig && firebaseConfig.apiKey) {
                    firebaseApp = initializeApp(firebaseConfig);
                    auth = getAuth(firebaseApp);
                    db = getFirestore(firebaseApp);

                    onAuthStateChanged(auth, async (user) => {
                        if (user) {
                            userId.value = user.uid;
                        } else {
                            if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
                                try {
                                    await signInWithCustomToken(auth, __initial_auth_token);
                                    userId.value = auth.currentUser.uid;
                                } catch (error) {
                                    console.error("Ошибка входа с пользовательским токеном:", error);
                                    try {
                                        await signInAnonymously(auth);
                                        userId.value = auth.currentUser.uid;
                                    } catch (anonError) {
                                        console.error("Ошибка анонимного входа:", anonError);
                                        userId.value = 'Ошибка авторизации';
                                    }
                                }
                            } else {
                                try {
                                    await signInAnonymously(auth);
                                    userId.value = auth.currentUser.uid;
                                } catch (anonError) {
                                    console.error("Ошибка анонимного входа:", anonError);
                                    userId.value = 'Ошибка авторизации';
                                }
                            }
                        }
                        isAuthReady.value = true;
                    });
                } else {
                    console.error("Firebase config не получен или некорректен.");
                    userId.value = 'Ошибка инициализации Firebase';
                    isAuthReady.value = true;
                }

            } catch (error) {
                console.error("Ошибка при получении или инициализации Firebase:", error);
                userId.value = 'Ошибка инициализации Firebase';
                isAuthReady.value = true;
            }
        });

        // Вычисляемое свойство для определения текущего компонента
        const currentComponent = computed(() => {
            switch (currentPage.value) {
                case 'home': return HomePage;
                case 'gallery': return GalleryPage; 
                case 'projectDetail': return ProjectDetailPage; 
                case 'shop': return ShopPage; 
                case 'about': return AboutPage; 
                case 'team': return TeamPage; 
                case 'news': return NewsPage; 
                case 'vacancies': return VacanciesPage; 
                case 'equipment': return EquipmentPage; 
                case 'promotions': return PromotionsPage; 
                case 'preparation': return PreparationPage; 
                default: return HomePage;
            }
        });

        return {
            currentPage,
            userId,
            isAuthReady,
            isAboutDropdownOpen, 
            navigateTo,
            toggleAboutDropdown, 
            currentComponent
        };
    }
});

// Регистрируем компоненты глобально
app.component('HomePage', HomePage);
app.component('GalleryPage', GalleryPage);
app.component('ProjectDetailPage', ProjectDetailPage);
app.component('ShopPage', ShopPage);
app.component('AboutPage', AboutPage);
app.component('TeamPage', TeamPage);
app.component('NewsPage', NewsPage); 
app.component('VacanciesPage', VacanciesPage); 
app.component('EquipmentPage', EquipmentPage); 
app.component('PromotionsPage', PromotionsPage);
app.component('PreparationPage', PreparationPage);
app.component('FooterSection', FooterSection); // Регистрируем компонент футера


// Монтируем Vue-приложение к элементу с id="app" в HTML.
if (typeof window !== 'undefined' && document) {
    app.mount('#app');
}
