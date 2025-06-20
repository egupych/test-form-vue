// Импортируем необходимые функции из установленных пакетов Vue и Firebase
import { createApp, ref, reactive, computed, onMounted } from 'vue';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, onSnapshot } from 'firebase/firestore'; 

// Переменные для инициализации Firebase. Их значения будут получены с сервера.
let firebaseApp, auth, db; // Объявляем переменные для экземпляров Firebase
const appId = 'default-app-id'; // При локальной разработке можно использовать любой ID, соответствующий projectId

// --- Компоненты страниц ---
// Все компоненты остаются без изменений.
// Компонент Домашней страницы
const HomePage = {
    template: `
        <div class="main-container rounded-lg shadow-lg">
            <h1 class="font-bold text-panda-black text-4xl mb-4">Добро пожаловать!</h1>
            <p class="text-xl text-dark-gray leading-relaxed">
                Это главная страница вашего корпоративного сайта. Здесь вы можете рассказать о вашей компании,
                предоставить общую информацию и привлечь внимание посетителей.
            </p>
            <p class="text-xl text-dark-gray leading-relaxed mt-4">
                Используйте навигацию выше, чтобы перейти к форме расчета стоимости, галерее или магазину.
            </p>
            <div class="mt-8 p-6 bg-light-gray rounded-lg">
                <h3 class="font-semibold text-panda-black text-2xl mb-3">Наши преимущества:</h3>
                <ul class="list-disc list-inside text-dark-gray text-lg">
                    <li>Индивидуальный подход к каждому клиенту.</li>
                    <li>Высокое качество печати.</li>
                    <li>Быстрое выполнение заказов.</li>
                    <li>Гибкая система скидок.</li>
                </ul>
            </div>
        </div>
    `
};

// Компонент Страницы Галереи
const GalleryPage = {
    setup() {
        // Логика для загрузки данных галереи из Firestore (если будет реализована)
        return {};
    },
    template: `
        <div class="main-container rounded-lg shadow-lg">
            <h1 class="font-bold text-panda-black text-4xl mb-4">Наша Галерея</h1>
            <p class="text-xl text-dark-gray leading-relaxed mb-6">
                Посмотрите на некоторые из наших прошлых работ. В будущем здесь будут динамически загружаться изображения из базы данных.
            </p>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div class="bg-gray-100 rounded-lg overflow-hidden shadow-md">
                    <img src="https://placehold.co/400x300/E3E3E3/8F8F8F?text=Работа%201" alt="Работа 1" class="w-full h-48 object-cover rounded-t-lg">
                    <div class="p-4">
                        <h3 class="font-semibold text-panda-black text-lg mb-1">Дизайн брошюры</h3>
                        <p class="text-sm text-dark-gray">Креативный подход к печати.</p>
                    </div>
                </div>
                <div class="bg-gray-100 rounded-lg overflow-hidden shadow-md">
                    <img src="https://placehold.co/400x300/E3E3E3/8F8F8F?text=Работа%202" alt="Работа 2" class="w-full h-48 object-cover rounded-t-lg">
                    <div class="p-4">
                        <h3 class="font-semibold text-panda-black text-lg mb-1">Визитки премиум</h3>
                        <p class="text-sm text-dark-gray">Элегантность в каждой детали.</p>
                    </div>
                </div>
                <div class="bg-gray-100 rounded-lg overflow-hidden shadow-md">
                    <img src="https://placehold.co/400x300/E3E3E3/8F8F8F?text=Работа%203" alt="Работа 3" class="w-full h-48 object-cover rounded-t-lg">
                    <div class="p-4">
                        <h3 class="font-semibold text-panda-black text-lg mb-1">Баннеры для событий</h3>
                        <p class="text-sm text-dark-gray">Привлекающие внимание решения.</p>
                    </div>
                </div>
            </div>
        </div>
    `
};

// Компонент Страницы Магазина
const ShopPage = {
    setup() {
        // Логика для загрузки данных магазина из Firestore (если будет реализована)
        return {};
    },
    template: `
        <div class="main-container rounded-lg shadow-lg">
            <h1 class="font-bold text-panda-black text-4xl mb-4">Наш Магазин</h1>
            <p class="text-xl text-dark-gray leading-relaxed mb-6">
                Здесь вы найдете наши продукты и услуги. В будущем здесь будут динамически загружаться товары с ценами и возможностью добавления в корзину.
            </p>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div class="bg-gray-100 rounded-lg overflow-hidden shadow-md">
                    <img src="https://placehold.co/400x300/E3E3E3/8F8F8F?text=Товар%201" alt="Товар 1" class="w-full h-48 object-cover rounded-t-lg">
                    <div class="p-4">
                        <h3 class="font-semibold text-panda-black text-lg mb-1">Печать листовок</h3>
                        <p class="text-sm text-dark-gray">От 1000 шт.</p>
                        <p class="font-bold text-panda-orange mt-2">Цена: $50</p>
                        <button class="mt-3 px-4 py-2 bg-panda-orange text-panda-white rounded-full text-sm hover:bg-orange-600 transition-colors">В корзину</button>
                    </div>
                </div>
                <div class="bg-gray-100 rounded-lg overflow-hidden shadow-md">
                    <img src="https://placehold.co/400x300/E3E3E3/8F8F8F?text=Товар%202" alt="Товар 2" class="w-full h-48 object-cover rounded-t-lg">
                    <div class="p-4">
                        <h3 class="font-semibold text-panda-black text-lg mb-1">Дизайн логотипов</h3>
                        <p class="text-sm text-dark-gray">Разработка уникального стиля.</p>
                        <p class="font-bold text-panda-orange mt-2">Цена: $200</p>
                        <button class="mt-3 px-4 py-2 bg-panda-orange text-panda-white rounded-full text-sm hover:bg-orange-600 transition-colors">В корзину</button>
                    </div>
                </div>
                <div class="bg-gray-100 rounded-lg overflow-hidden shadow-md">
                    <img src="https://placehold.co/400x300/E3E3E3/8F8F8F?text=Товар%203" alt="Товар 3" class="w-full h-48 object-cover rounded-t-lg">
                    <div class="p-4">
                        <h3 class="font-semibold text-panda-black text-lg mb-1">Изготовление наклеек</h3>
                        <p class="text-sm text-dark-gray">Виниловые, бумажные и др.</p>
                        <p class="font-bold text-panda-orange mt-2">Цена: $30</p>
                        <button class="mt-3 px-4 py-2 bg-panda-orange text-panda-white rounded-full text-sm hover:bg-orange-600 transition-colors">В корзину</button>
                    </div>
                </div>
            </div>
        </div>
    `
};

// Компонент Формы Контактов
const ContactFormPage = {
    setup() {
        const formData = reactive({
            name: '', phone: '', email: '', company: '', task: '', promo: ''
        });
        const errors = reactive({
            name: '', phone: '', email: '', task: ''
        });
        const isSubmitting = ref(false);
        const message = ref('');
        const messageType = ref('success');

        const isFormValid = computed(() => {
            return (
                formData.name !== '' && !errors.name &&
                formData.phone !== '' && !errors.phone &&
                formData.email !== '' && !errors.email &&
                formData.task !== '' && !errors.task
            );
        });

        const showMessage = (msg, type = 'success') => {
            message.value = msg;
            messageType.value = type;
            setTimeout(() => {
                message.value = '';
                messageType.value = 'success';
            }, 5000);
        };

        const validateEmail = (email) => {
            const re = /^[a-zA-Z0-9]([a-zA-Z0-9._-]*[a-zA-Z0-9])?@[a-zA-Z0-9]([a-zA-Z0-9.-]*[a-zA-Z0-9])?\.[a-zA-Z]{2,}$/;
            return re.test(String(email).toLowerCase().trim());
        };

        const validatePhone = (phone) => {
            const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
            const patterns = [
                /^\+7[0-9]{10}$/,
                /^8[0-9]{10}$/,
                /^7[0-9]{10}$/,
                /^\+[1-9][0-9]{7,14}$/
            ];
            return patterns.some(pattern => pattern.test(cleanPhone));
        };

        const formatPhoneInput = () => {
            let value = formData.phone.replace(/\D/g, '');

            if (value.length > 0) {
                if (value.startsWith('8')) {
                    value = '7' + value.slice(1);
                }

                if (value.startsWith('7')) {
                    value = '+7' + value.slice(1);
                } else if (!value.startsWith('+')) {
                    value = '+' + value;
                }

                if (value.startsWith('+7') && value.length > 2) {
                    const digits = value.slice(2);
                    if (digits.length <= 3) {
                        value = '+7 (' + digits;
                    } else if (digits.length <= 6) {
                        value = '+7 (' + digits.slice(0, 3) + ') ' + digits.slice(3);
                    } else if (digits.length <= 8) {
                        value = '+7 (' + digits.slice(0, 3) + ') ' + digits.slice(3, 6) + '-' + digits.slice(6);
                    } else {
                        value = '+7 (' + digits.slice(0, 3) + ') ' + digits.slice(3, 6) + '-' + digits.slice(6, 8) + '-' + digits.slice(8, 10);
                    }
                }
            }
            formData.phone = value;
            validateField('phone');
        };

        const validateField = (field) => {
            let isValid = true;
            errors[field] = '';

            const value = formData[field];

            switch (field) {
                case 'name':
                    if (value === '') { errors.name = 'Пожалуйста, введите ваше имя'; isValid = false; }
                    else if (value.length < 2) { errors.name = 'Имя должно содержать минимум 2 символа'; isValid = false; }
                    break;
                case 'phone':
                    if (value === '') { errors.phone = 'Пожалуйста, введите номер телефона'; isValid = false; }
                    else if (!validatePhone(value)) { errors.phone = 'Введите корректный номер телефона'; isValid = false; }
                    break;
                case 'email':
                    if (value === '') { errors.email = 'Пожалуйста, введите email адрес'; isValid = false; }
                    else if (!validateEmail(value)) { errors.email = 'Введите корректный email адрес'; isValid = false; }
                    break;
                case 'task':
                    if (value === '') { errors.task = 'Пожалуйста, опишите задачу'; isValid = false; }
                    else if (value.length < 10) { errors.task = 'Описание задачи должно содержать минимум 10 символов'; isValid = false; }
                    break;
            }
            return isValid;
        };

        const clearError = (field) => {
            if (errors[field]) { errors[field] = ''; }
        };

        const validateForm = () => {
            let allValid = true;
            ['name', 'phone', 'email', 'task'].forEach(field => {
                if (!validateField(field)) { allValid = false; }
            });
            return allValid;
        };

        const submitFormToServer = async (data) => {
            try {
                const response = await fetch('/api/submit-form', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
                const result = await response.json();
                if (response.ok && result.success) {
                    return { success: true, message: result.message };
                } else {
                    if (result.errors && Array.isArray(result.errors)) {
                        result.errors.forEach(error => {
                            if (errors.hasOwnProperty(error.path)) { errors[error.path] = error.msg; }
                        });
                    }
                    return { success: false, message: result.message || 'Ошибка отправки формы' };
                }
            } catch (error) {
                console.error('Ошибка сети:', error);
                return { success: false, message: 'Ошибка соединения с сервером. Проверьте интернет-подключение' };
            }
        };

        const handleSubmit = async () => {
            if (!validateForm()) {
                console.log('Форма содержит ошибки.');
                showMessage('Пожалуйста, исправьте ошибки в форме.', 'error');
                return;
            }

            isSubmitting.value = true;
            message.value = '';

            const result = await submitFormToServer(formData);

            if (result.success) {
                showMessage(result.message);
                formData.name = ''; formData.phone = ''; formData.email = '';
                formData.company = ''; formData.task = ''; formData.promo = '';
                Object.keys(errors).forEach(key => errors[key] = '');
            } else {
                showMessage(result.message, 'error');
            }
            isSubmitting.value = false;
        };

        return {
            formData, errors, isSubmitting, message, messageType, isFormValid,
            formatPhoneInput, validateField, clearError, handleSubmit
        };
    },
    template: `
        <div class="main-container rounded-lg shadow-lg">
            <div class="form-wrapper">
                <div class="form-info">
                    <h1>Расчёт<br>стоимости</h1>
                    <p>С вами свяжется наш менеджер<br>в ближайшее время. Спасибо, что<br>обратились в наше печатное агентство!</p>
                </div>
                <div class="form-body">
                    <form @submit.prevent="handleSubmit" novalidate>
                        <div class="form-group">
                            <input type="text" id="name" name="name" placeholder="Ваше имя" required
                                v-model.trim="formData.name"
                                @blur="validateField('name')"
                                @input="clearError('name')"
                                :class="{ 'error': errors.name }">
                            <div class="error-message" :class="{ 'show': errors.name }">{{ errors.name }}</div>
                        </div>
                        <div class="form-group">
                            <input type="tel" id="phone" name="phone" placeholder="Телефон" required
                                v-model="formData.phone"
                                @input="formatPhoneInput"
                                @blur="validateField('phone')"
                                :class="{ 'error': errors.phone }">
                            <div class="error-message" :class="{ 'show': errors.phone }">{{ errors.phone }}</div>
                        </div>
                        <div class="form-group">
                            <input type="email" id="email" name="email" placeholder="@email" required
                                v-model.trim="formData.email"
                                @blur="validateField('email')"
                                @input="clearError('email')"
                                :class="{ 'error': errors.email }">
                            <div class="error-message" :class="{ 'show': errors.email }">{{ errors.email }}</div>
                        </div>
                        <div class="form-group">
                            <input type="text" id="company" name="company" placeholder="Компания"
                                v-model.trim="formData.company">
                            <div class="error-message"></div>
                        </div>
                        <div class="form-group">
                            <textarea id="task" name="task" placeholder="Опишите задачу" required
                                v-model.trim="formData.task"
                                @blur="validateField('task')"
                                @input="clearError('task')"
                                :class="{ 'error': errors.task }"></textarea>
                            <div class="error-message" :class="{ 'show': errors.task }">{{ errors.task }}</div>
                        </div>
                        <div class="form-group">
                            <input type="text" id="promo" name="promo" placeholder="Промокод"
                                v-model.trim="formData.promo">
                            <div class="error-message"></div>
                        </div>
                        <button type="submit" :disabled="isSubmitting || !isFormValid"
                            :class="{ 'opacity-60 cursor-not-allowed': isSubmitting || !isFormValid }">
                            {{ isSubmitting ? 'Отправляется...' : 'Отправить заявку' }}
                        </button>
                    </form>
                </div>
            </div>
            <div id="success-message" class="success-message" :class="{ 'show': message }"
                :style="{ backgroundColor: messageType === 'success' ? 'var(--panda-green)' : '#e74c3c' }">
                {{ message }}
            </div>
        </div>
    `
};

// --- Главное Vue приложение ---
// Создаем и монтируем корневое Vue-приложение.
const app = createApp({
    setup() {
        const currentPage = ref('home');
        const userId = ref('Загрузка...');
        const isAuthReady = ref(false);

        const navigateTo = (page) => {
            currentPage.value = page;
        };

        onMounted(async () => {
            try {
                // Получаем конфигурацию Firebase с нашего бэкенд-сервера.
                const response = await fetch('/api/firebase-config');
                const config = await response.json();

                // Инициализируем Firebase только после успешного получения конфигурации.
                // Проверяем, что конфиг не пустой и содержит apiKey
                if (config && config.apiKey) {
                    firebaseApp = initializeApp(config);
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

        const currentComponent = computed(() => {
            switch (currentPage.value) {
                case 'home': return HomePage;
                case 'contact': return ContactFormPage;
                case 'gallery': return GalleryPage;
                case 'shop': return ShopPage;
                default: return HomePage;
            }
        });

        return {
            currentPage, userId, isAuthReady, navigateTo, currentComponent
        };
    }
});

// Регистрируем компоненты глобально
app.component('HomePage', HomePage);
app.component('ContactFormPage', ContactFormPage);
app.component('GalleryPage', GalleryPage);
app.component('ShopPage', ShopPage);

// Монтируем Vue-приложение к элементу с id="app" в HTML.
if (typeof window !== 'undefined' && document) {
    app.mount('#app');
}
