// Импортируем необходимые функции из установленных пакетов Vue и Firebase
import { createApp, ref, reactive, computed, onMounted } from 'vue';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, onSnapshot } from 'firebase/firestore'; 

// Переменные для инициализации Firebase. Их значения будут получены с сервера.
let firebaseApp, auth, db; // Объявляем переменные для экземпляров Firebase
const appId = 'default-app-id'; // При локальной разработке можно использовать любой ID, соответствующий projectId

// --- Компонент Футера (единый для всех страниц) ---
const FooterSection = {
    setup() {
        const isMapExpanded = ref(false);

        // SVG-код логотипа Red Panda - теперь не используется в футере, но оставим здесь на случай, если он понадобится для других элементов
        const redPandaLogoSvg = `
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="40" height="40" rx="8" fill="#FFFFFF"/>
                <path d="M20 6C14.477 6 10 10.477 10 16C10 21.523 14.477 26 20 26C25.523 26 30 21.523 30 16C30 10.477 25.523 6 20 6ZM20 23C15.582 23 12 19.418 12 15C12 10.582 15.582 7 20 7C24.418 7 28 10.582 28 15C28 19.418 24.418 23 20 23Z" fill="#F15F31"/>
                <path d="M20 12C17.79 12 16 13.79 16 16C16 18.21 17.79 20 20 20C22.21 20 24 18.21 24 16C24 13.79 22.21 12 20 12ZM20 18C18.895 18 18 17.105 18 16C18 14.895 18.895 14 20 14C21.105 14 22 14.895 22 16C22 17.105 21.105 18 20 18Z" fill="#131C26"/>
                <circle cx="17" cy="13" r="1" fill="#131C26"/>
                <circle cx="23" cy="13" r="1" fill="#131C26"/>
                <path d="M20 19.5C19.17 19.5 18.5 19.17 18.5 18.5C18.5 17.83 19.17 17.5 20 17.5C20.83 17.5 21.5 17.83 21.5 18.5C21.5 19.17 20.83 19.5 20 19.5Z" fill="#131C26"/>
                <path d="M15 20C15 20.55 15.45 21 16 21H24C24.55 21 25 20.55 25 20V20C25 19.45 24.55 19 24 19H16C15.45 19 15 19.45 15 20V20Z" fill="#131C26"/>
            </svg>
        `;

        const openLink = (url) => {
            window.open(url, '_blank');
        };

        return {
            isMapExpanded,
            redPandaLogoSvg, // Оставляем на случай, если понадобится в других местах
            openLink
        };
    },
    template: `
        <footer class="w-full bg-panda-black text-light-gray py-12 px-8 relative overflow-hidden">
            <!-- Карта (будет накладываться поверх содержимого при расширении) -->
            <div class="map-overlay"
                 :class="{ 'map-expanded': isMapExpanded }"
                 @mouseenter="isMapExpanded = true"
                 @mouseleave="isMapExpanded = false">
                <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2503.659614488975!2d71.4398188157545!3d51.15783397996503!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x424580e55b6a7a7b%3A0x6b8d9c5b2e5c6a1a!2z0YPQu9C40LLQtdGA0YHRgtGA0YPQvdC-0LLRgdC60LDRjyDRg9C90LDRh9C10YAg0JrQsNGA0L7QstCw0YHRgtGA0LDRjyDQsiwgNiwg0JDQstGC0LPRgNCw0LQsINCa0LDQvNC40YDQsCwg0JrQsNGA0L7QstCw0YHRgtGA0LDRjyDRgdGC0LDQuNC-0L3QsdGD0YDQsyAxMDAwMDYsINSa0LDQvNC40YDQsA!5e0!3m2!1sru!2skz!4v1701234567890!5m2=1sru!2skz"
                    class="rounded-[14px]"
                    style="border:0;"
                    allowfullscreen=""
                    loading="lazy"
                    referrerpolicy="no-referrer-when-downgrade"
                ></iframe>
            </div>

            <!-- Основное содержимое футера -->
            <div class="max-w-5xl mx-auto flex flex-col lg:flex-row justify-between items-start lg:items-stretch relative z-10">
                <!-- Левая колонка: Логотип, контакты, подписка -->
                <div class="flex flex-col items-start mb-8 lg:mb-0 lg:w-1/3">
                    <div class="flex items-center mb-4">
                        <!-- Здесь используется путь к SVG логотипу -->
                        <img src="/public/images/red-panda-logo-black.svg" alt="Логотип Red Panda" class="w-10 h-10 rounded-md mr-2">
                        <span class="font-semibold text-2xl text-panda-white">RED PANDA</span>
                    </div>
                    <p class="text-base font-medium leading-snug mb-2">+7 700 725-77-99</p>
                    <p class="text-base font-medium leading-snug mb-4">infoprint@redpanda.kz</p>
                    <p class="text-base font-medium leading-snug">Астана, Шоссе Коргалжын, 6</p>
                    <p class="text-base font-medium leading-snug">ПН-ПТ 10:00-18:00</p>

                    <h3 class="text-xl font-semibold mt-8 mb-4 text-panda-white">Подпишитесь на рассылку</h3>
                    <p class="text-base font-medium leading-snug mb-4">О будущих акциях</p>
                    <form class="flex flex-col gap-4 w-full">
                        <input type="email" placeholder="Ваш email-адрес" class="p-3 rounded-md bg-gray-800 text-light-gray border border-gray-700 focus:outline-none focus:border-panda-orange text-base font-medium leading-snug">
                        <label class="flex items-center text-sm text-light-gray">
                            <input type="checkbox" class="mr-2 rounded text-panda-orange focus:ring-panda-orange">
                            Вы соглашаетесь на информационную рассылку. Приостановить можно в любое время.
                        </label>
                        <button type="submit" class="w-full px-6 py-3 bg-panda-orange text-panda-white rounded-full text-base font-medium leading-tight hover:bg-orange-600 transition-colors">
                            Подписаться
                        </button>
                    </form>
                </div>

                <!-- Этот div служит для поддержания макета, освобождая место для карты -->
                <div class="lg:w-1/3 h-[210px] my-8 lg:my-0 flex-shrink-0">
                </div>

                <!-- Правая колонка: QR-коды, ссылки, контакты -->
                <div class="flex flex-col items-end text-right lg:w-1/3">
                    <div class="flex gap-4 mb-4">
                        <img src="https://placehold.co/100x100/131C26/FFFFFF?text=redpanda.kz" alt="QR Code redpanda.kz" class="w-24 h-24 rounded-md bg-panda-white p-2">
                        <img src="https://placehold.co/100x100/131C26/FFFFFF?text=redpandakz" alt="QR Code redpandakz" class="w-24 h-24 rounded-md bg-panda-white p-2">
                    </div>
                    <p class="text-base font-medium leading-snug mb-2">redpanda.kz</p>
                    <p class="text-base font-medium leading-snug mb-4">redpandakz</p>

                    <div class="flex gap-4 flex-wrap justify-end mb-6">
                        <button class="social-button" @click="openLink('https://wa.me/77007257799')">Whatsapp</button>
                        <button class="social-button" @click="openLink('https://instagram.com/redpandakz')">Instagram</button>
                        <button class="social-button" @click="openLink('https://2gis.kz/astana/firm/70000001032338243')">2GIS</button>
                    </div>
                    
                    <p class="text-base font-medium leading-snug mb-2">+7 700 725-77-99</p>
                    <p class="text-base font-medium leading-snug mb-4">infoprint@redpanda.kz</p>
                    <p class="text-base font-medium leading-snug mt-auto">TOO «RED PANDA» БИН 221240030264</p>
                </div>
            </div>
            <div class="border-t border-gray-700 mt-8 pt-8 text-center text-dark-gray text-sm font-medium leading-snug relative z-10">
                &copy; 2024 TOO «RED PANDA». Все права защищены.
            </div>
        </footer>
    `
};

// --- Компонент Домашней страницы (Теперь включает форму "Расчет стоимости") ---
const HomePage = {
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
        <div class="main-container bg-panda-white pb-0">
            <h1 class="font-bold text-panda-black text-4xl mb-4">Добро пожаловать!</h1>
            <p class="text-xl text-dark-gray leading-relaxed">
                Это главная страница вашего корпоративного сайта. Здесь вы можете рассказать о вашей компании,
                предоставить общую информацию и привлечь внимание посетителей.
            </p>
            <p class="text-xl text-dark-gray leading-relaxed mt-4">
                Используйте навигацию выше, чтобы перейти к различным разделам.
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

        <!-- Форма "Расчет стоимости" теперь на главной странице -->
        <div class="main-container bg-panda-white mt-8">
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
        <FooterSection @navigateTo="$emit('navigateTo', $event)" />
    `
};

// --- Компонент Страницы Галереи (Наши работы) ---
const GalleryPage = {
    props: ['navigateTo'], // Добавляем prop для функции navigateTo
    setup(props) {
        // Категории работ
        const categories = reactive([
            { id: 'badges', name: 'Бейджи и номерки' },
            { id: 'notebooks', name: 'Блокноты и тетради' },
            { id: 'businessCards', name: 'Визитки' },
            { id: 'outdoorAdvertising', name: 'Наружная реклама' },
            { id: 'calendarsPlanners', name: 'Календари и планеры' },
            { id: 'boxesPackaging', name: 'Коробки и Упаковка' },
            { id: 'bags', name: 'Пакеты' },
            { id: 'souvenirs', name: 'Сувенирная продукция' },
            { id: 'merchGifts', name: 'Мерч и подарки' },
            { id: 'catalogsAlbums', name: 'Каталоги и альбомы' },
            { id: 'stickersLabels', name: 'Наклейки и этикетки' },
            { id: 'certificatesInvitations', name: 'Сертификаты и пригласительные' },
            { id: 'corporateIdentity', name: 'Фирменный стиль' },
        ]);
        const activeCategory = ref('catalogsAlbums'); // Активная категория по умолчанию

        const viewProject = (projectId) => {
            props.navigateTo('projectDetail', { id: projectId });
        };

        return { viewProject, categories, activeCategory };
    },
    template: `
        <div class="main-container bg-panda-white pb-0">
            <h1 class="font-bold text-panda-black text-4xl mb-4">Наши работы</h1>
            <p class="text-xl text-dark-gray leading-relaxed mb-6">
                Примеры наших проектов. Нажмите "Смотреть", чтобы увидеть детали.
            </p>

            <!-- Категории работ -->
            <div class="flex flex-wrap gap-2 mb-10">
                <button v-for="category in categories" :key="category.id"
                    @click="activeCategory = category.id"
                    :class="{ 'bg-panda-orange text-panda-white': activeCategory === category.id, 'bg-gray-200 text-dark-gray': activeCategory !== category.id }"
                    class="px-4 py-2 rounded-full text-sm font-medium transition-colors hover:bg-panda-orange hover:text-panda-white">
                    {{ category.name }}
                </button>
            </div>

            <!-- Секция с проектами (динамическая, на основе активной категории) -->
            <!-- Сейчас показываем только примеры для "Каталоги и альбомы" и "Фирменный стиль" -->
            <div v-if="activeCategory === 'catalogsAlbums'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                <!-- Каталог «Лудэ-Каз» -->
                <div class="bg-light-gray rounded-lg overflow-hidden flex flex-col md:flex-row items-center p-6 gap-6">
                    <img src="https://placehold.co/250x200/F7F7F7/131C26?text=Каталог%20Лудэ-Каз" alt="Каталог Лудэ-Каз" class="w-full md:w-1/2 h-auto object-cover rounded-md">
                    <div class="flex flex-col justify-center p-0 md:p-4 text-center md:text-left">
                        <h3 class="font-semibold text-panda-black text-2xl mb-2">Каталог «Лудэ-Каз»</h3>
                        <p class="text-md text-dark-gray mb-4">Каталог в фирменных цветах с нотками современного искусства.</p>
                        <button @click="viewProject('ludekaz')" class="self-center md:self-start px-6 py-3 bg-panda-orange text-panda-white rounded-full text-lg hover:bg-orange-600 transition-colors">
                            Смотреть
                        </button>
                    </div>
                </div>
                <!-- Каталог «Мир охоты» -->
                <div class="bg-light-gray rounded-lg overflow-hidden flex flex-col md:flex-row items-center p-6 gap-6">
                    <img src="https://placehold.co/250x200/F7F7F7/131C26?text=Каталог%20Мир%20охоты" alt="Каталог Мир охоты" class="w-full md:w-1/2 h-auto object-cover rounded-md">
                    <div class="flex flex-col justify-center p-0 md:p-4 text-center md:text-left">
                        <h3 class="font-semibold text-panda-black text-2xl mb-2">Каталог «Мир охоты»</h3>
                        <p class="text-md text-dark-gray mb-4">Музейный фонд охотничьего центра г. Костанай.</p>
                        <button @click="viewProject('mirohota')" class="self-center md:self-start px-6 py-3 bg-panda-orange text-panda-white rounded-full text-lg hover:bg-orange-600 transition-colors">
                            Смотреть
                        </button>
                    </div>
                </div>
            </div>

            <div v-else-if="activeCategory === 'corporateIdentity'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                <!-- Пример фирменного стиля (похож на Dostyk Lux) -->
                <div class="bg-light-gray rounded-lg overflow-hidden flex flex-col md:flex-row items-center p-6 gap-6">
                    <img src="https://placehold.co/250x200/F7F7F7/131C26?text=Фирменный%20стиль%20Dostyk%20Lux" alt="Фирменный стиль Dostyk Lux" class="w-full md:w-1/2 h-auto object-cover rounded-md">
                    <div class="flex flex-col justify-center p-0 md:p-4 text-center md:text-left">
                        <h3 class="font-semibold text-panda-black text-2xl mb-2">Фирменный стиль Dostyk Lux</h3>
                        <p class="text-md text-dark-gray mb-4">Современный стиль, с заботой о людях.</p>
                        <button @click="viewProject('dostykLux')" class="self-center md:self-start px-6 py-3 bg-panda-orange text-panda-white rounded-full text-lg hover:bg-orange-600 transition-colors">
                            Смотреть
                        </button>
                    </div>
                </div>
                <!-- Добавьте другие примеры для фирменного стиля, если нужно -->
            </div>

            <div v-else class="text-center py-10 text-dark-gray text-xl">
                Примеров для этой категории пока нет.
            </div>
        </div>
        <FooterSection @navigateTo="$emit('navigateTo', $event)" />
    `
};

// --- Компонент Детальной Страницы Проекта (Фирменный стиль Dostyk Lux) ---
const ProjectDetailPage = {
    props: ['navigateTo'], 
    template: `
        <div class="main-container bg-panda-white pb-0">
            <h1 class="font-bold text-panda-black text-4xl mb-4">Фирменный стиль для гостиницы Dostyk Lux</h1>
            <p class="text-xl text-dark-gray leading-relaxed mb-6">
                Современный стиль, с заботой о людях. Здесь представлены различные элементы разработанного фирменного стиля.
            </p>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <!-- Большая визитка -->
                <div class="bg-light-gray rounded-lg overflow-hidden flex flex-col items-center">
                    <img src="https://placehold.co/800x400/F7F7F7/131C26?text=Визитка%20Dostyk%20lux" alt="Визитка Dostyk lux" class="w-full h-auto object-cover">
                    <div class="p-4 text-center">
                        <h3 class="font-semibold text-panda-black text-lg mb-1">Визитная карточка</h3>
                        <p class="text-sm text-dark-gray">Современный дизайн с акцентом на бренд.</p>
                    </div>
                </div>
                <!-- Другие элементы стиля -->
                <div class="grid grid-cols-2 gap-4">
                    <div class="bg-light-gray rounded-lg overflow-hidden flex flex-col items-center">
                        <img src="https://placehold.co/400x200/F7F7F7/131C26?text=Ключ%20Dostyk" alt="Ключ Dostyk" class="w-full h-auto object-cover">
                        <div class="p-2 text-center">
                            <p class="text-sm text-dark-gray">Брелок для ключей</p>
                        </div>
                    </div>
                    <div class="bg-light-gray rounded-lg overflow-hidden flex flex-col items-center">
                        <img src="https://placehold.co/400x200/F7F7F7/131C26?text=Календарь%202025" alt="Календарь 2025" class="w-full h-auto object-cover">
                        <div class="p-2 text-center">
                            <p class="text-sm text-dark-gray">Настольный календарь</p>
                        </div>
                    </div>
                    <div class="bg-light-gray rounded-lg overflow-hidden flex flex-col items-center">
                        <img src="https://placehold.co/400x200/F7F7F7/131C26?text=Меню%20ресторана" alt="Меню ресторана" class="w-full h-auto object-cover">
                        <div class="p-2 text-center">
                            <p class="text-sm text-dark-gray">Дизайн меню</p>
                        </div>
                    </div>
                    <div class="bg-light-gray rounded-lg overflow-hidden flex flex-col items-center">
                        <img src="https://placehold.co/400x200/F7F7F7/131C26?text=Дверная%20табличка" alt="Дверная табличка" class="w-full h-auto object-cover">
                        <div class="p-2 text-center">
                            <p class="text-sm text-dark-gray">Дверные таблички</p>
                        </div>
                    </div>
                </div>
            </div>
            
            <h2 class="font-bold text-panda-black text-3xl mb-4 mt-8">Дополнительные элементы стиля:</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <img src="https://placehold.co/600x400/F7F7F7/131C26?text=Рекламный%20макет" alt="Рекламный макет" class="w-full h-auto object-cover rounded-lg">
                <img src="https://placehold.co/600x400/F7F7F7/131C26?text=Набор%20фирменного%20стиля" alt="Набор фирменного стиля" class="w-full h-auto object-cover rounded-lg">
                <img src="https://placehold.co/600x400/F7F7F7/131C26?text=Пример%20вывески" alt="Пример вывески" class="w-full h-auto object-cover rounded-lg">
            </div>

            <button @click="navigateTo('gallery')" class="mt-8 px-6 py-3 bg-panda-orange text-panda-white rounded-full text-lg hover:bg-orange-600 transition-colors">
                ← Вернуться к нашим работам
            </button>
        </div>
        <FooterSection @navigateTo="$emit('navigateTo', $event)" />
    `
};

// --- Компонент Страницы Магазина ---
const ShopPage = {
    setup() {
        return {};
    },
    template: `
        <div class="main-container bg-panda-white pb-0">
            <h1 class="font-bold text-panda-black text-4xl mb-4">Наш Магазин</h1>
            <p class="text-xl text-dark-gray leading-relaxed mb-6">
                Здесь вы найдете наши продукты и услуги. В будущем здесь будут динамически загружаться товары с ценами и возможностью добавления в корзину.
            </p>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div class="bg-light-gray rounded-lg overflow-hidden">
                    <img src="https://placehold.co/400x300/F7F7F7/131C26?text=Товар%201" alt="Товар 1" class="w-full h-48 object-cover rounded-t-lg">
                    <div class="p-4">
                        <h3 class="font-semibold text-panda-black text-lg mb-1">Печать листовок</h3>
                        <p class="text-sm text-dark-gray">От 1000 шт.</p>
                        <p class="font-bold text-panda-orange mt-2">Цена: $50</p>
                        <button class="mt-3 px-4 py-2 bg-panda-orange text-panda-white rounded-full text-sm hover:bg-orange-600 transition-colors">В корзину</button>
                    </div>
                </div>
                <div class="bg-light-gray rounded-lg overflow-hidden">
                    <img src="https://placehold.co/400x300/F7F7F7/131C26?text=Товар%202" alt="Товар 2" class="w-full h-48 object-cover rounded-t-lg">
                    <div class="p-4">
                        <h3 class="font-semibold text-panda-black text-lg mb-1">Дизайн логотипов</h3>
                        <p class="text-sm text-dark-gray">Разработка уникального стиля.</p>
                        <p class="font-bold text-panda-orange mt-2">Цена: $200</p>
                        <button class="mt-3 px-4 py-2 bg-panda-orange text-panda-white rounded-full text-sm hover:bg-orange-600 transition-colors">В корзину</button>
                    </div>
                </div>
                <div class="bg-light-gray rounded-lg overflow-hidden">
                    <img src="https://placehold.co/400x300/F7F7F7/131C26?text=Товар%203" alt="Товар 3" class="w-full h-48 object-cover rounded-t-lg">
                    <div class="p-4">
                        <h3 class="font-semibold text-panda-black text-lg mb-1">Изготовление наклеек</h3>
                        <p class="text-sm text-dark-gray">Виниловые, бумажные и др.</p>
                        <p class="font-bold text-panda-orange mt-2">Цена: $30</p>
                        <button class="mt-3 px-4 py-2 bg-panda-orange text-panda-white rounded-full text-sm hover:bg-orange-600 transition-colors">В корзину</button>
                    </div>
                </div>
            </div>
        </div>
        <FooterSection @navigateTo="$emit('navigateTo', $event)" />
    `
};

// --- Компонент Страницы "О нас" (общая, если потребуется) ---
const AboutPage = {
    template: `
        <div class="main-container bg-panda-white pb-0">
            <h1 class="font-bold text-panda-black text-4xl mb-4">О нас</h1>
            <p class="text-xl text-dark-gray leading-relaxed">
                Это общая страница "О нас". Здесь будет общая информация о компании.
            </p>
            <p class="text-xl text-dark-gray leading-relaxed mt-4">
                Пожалуйста, выберите подраздел из выпадающего меню.
            </p>
        </div>
        <FooterSection @navigateTo="$emit('navigateTo', $event)" />
    `
};

// --- НОВЫЕ КОМПОНЕНТЫ ИЗ PDF ---

// Компонент Страницы "Команда"
const TeamPage = {
    template: `
        <div class="main-container bg-panda-white pb-0">
            <h1 class="font-bold text-panda-black text-4xl mb-4">Наша команда</h1>
            <p class="text-xl text-dark-gray leading-relaxed mb-6">
                Познакомьтесь с нашей профессиональной командой. Мы - лучшие!
            </p>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div class="bg-light-gray rounded-lg p-4 text-center">
                    <img src="https://placehold.co/150x150/F7F7F7/131C26?text=Андрей" alt="Андрей Федорович" class="rounded-full w-32 h-32 mx-auto mb-4 object-cover">
                    <h3 class="font-semibold text-panda-black text-xl mb-1">Андрей Федорович</h3>
                    <p class="text-sm text-dark-gray">Руководитель</p>
                </div>
                <div class="bg-light-gray rounded-lg p-4 text-center">
                    <img src="https://placehold.co/150x150/F7F7F7/131C26?text=Светлана" alt="Светлана" class="rounded-full w-32 h-32 mx-auto mb-4 object-cover">
                    <h3 class="font-semibold text-panda-black text-xl mb-1">Светлана</h3>
                    <p class="text-sm text-dark-gray">Менеджер по продажам</p>
                </div>
                <div class="bg-light-gray rounded-lg p-4 text-center">
                    <img src="https://placehold.co/150x150/F7F7F7/131C26?text=Лаура" alt="Лаура" class="rounded-full w-32 h-32 mx-auto mb-4 object-cover">
                    <h3 class="font-semibold text-panda-black text-xl mb-1">Лаура</h3>
                    <p class="text-sm text-dark-gray">Дизайнер</p>
                </div>
                 <div class="bg-light-gray rounded-lg p-4 text-center">
                    <img src="https://placehold.co/150x150/F7F7F7/131C26?text=Дмитрий" alt="Дмитрий" class="rounded-full w-32 h-32 mx-auto mb-4 object-cover">
                    <h3 class="font-semibold text-panda-black text-xl mb-1">Дмитрий</h3>
                    <p class="text-sm text-dark-gray">Печатник</p>
                </div>
            </div>

            <h2 class="font-bold text-panda-black text-3xl mb-4 mt-10">Наша история</h2>
            <div class="relative border-l-2 border-panda-orange pl-8 py-4">
                <div class="mb-8">
                    <h3 class="font-semibold text-panda-black text-2xl">2024 Декабрь</h3>
                    <p class="text-lg text-dark-gray">Провели незабываемый корпоратив, завершивший успешный год.</p>
                </div>
                <div class="mb-8">
                    <h3 class="font-semibold text-panda-black text-2xl">2023 Июнь</h3>
                    <p class="text-lg text-dark-gray">Расширение производства, закупка нового оборудования.</p>
                </div>
                <div class="mb-8">
                    <h3 class="font-semibold text-panda-black text-2xl">2022 Февраль</h3>
                    <p class="text-lg text-dark-gray">Открытие первого филиала в другом городе.</p>
                </div>
            </div>
        </div>
        <FooterSection @navigateTo="$emit('navigateTo', $event)" />
    `
};

// Компонент Страницы "Новости"
const NewsPage = {
    template: `
        <div class="main-container bg-panda-white pb-0">
            <h1 class="font-bold text-panda-black text-4xl mb-4">Новости</h1>
            <p class="text-xl text-dark-gray leading-relaxed mb-6">
                Будьте в курсе последних событий и достижений нашей компании.
            </p>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="bg-light-gray rounded-lg overflow-hidden">
                    <img src="https://placehold.co/600x350/F7F7F7/131C26?text=Выставка%20в%20Алматы" alt="Выставка в Алматы" class="w-full h-auto object-cover rounded-t-lg">
                    <div class="p-4">
                        <p class="text-sm text-dark-gray mb-1">28 мая 2025</p>
                        <h3 class="font-semibold text-panda-black text-xl mb-2">Побывали на крупнейшей азиатской выставке</h3>
                        <p class="text-md text-dark-gray">8-я международная выставка рекламы, полиграфии, технологий и материалов в Алматы.</p>
                    </div>
                </div>
                <div class="bg-light-gray rounded-lg overflow-hidden">
                    <img src="https://placehold.co/600x350/F7F7F7/131C26?text=Майский%20забег" alt="Майский забег BI Group" class="w-full h-auto object-cover rounded-t-lg">
                    <div class="p-4">
                        <p class="text-sm text-dark-gray mb-1">14 мая 2025</p>
                        <h3 class="font-semibold text-panda-black text-xl mb-2">Майский забег BI Group</h3>
                        <p class="text-md text-dark-gray">Поддерживаем здоровый дух. Бег - это не про скорость. Это про моменты, когда ты хотел сдаться, но сделал ещё один шаг.</p>
                    </div>
                </div>
                <div class="bg-light-gray rounded-lg overflow-hidden">
                    <img src="https://placehold.co/600x350/F7F7F7/131C26?text=Выставка%20в%20Берлине" alt="Выставка в Берлине FESPA 2025" class="w-full h-auto object-cover rounded-t-lg">
                    <div class="p-4">
                        <p class="text-sm text-dark-gray mb-1">07 мая 2025</p>
                        <h3 class="font-semibold text-panda-black text-xl mb-2">Мы посетили выставку в Берлине!</h3>
                        <p class="text-md text-dark-gray">Выставка печати FESPA 2025.</p>
                    </div>
                </div>
            </div>
        </div>
        <FooterSection @navigateTo="$emit('navigateTo', $event)" />
    `
};

// Компонент Страницы "Вакансии"
const VacanciesPage = {
    template: `
        <div class="main-container bg-panda-white pb-0">
            <h1 class="font-bold text-panda-black text-4xl mb-4">Вакансии</h1>
            <p class="text-xl text-dark-gray leading-relaxed mb-6">
                Присоединяйтесь к нашей команде! Откройте для себя возможности карьерного роста в Red Panda.
            </p>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                <!-- Офис-менеджер -->
                <div class="bg-light-gray rounded-lg p-6">
                    <h2 class="font-bold text-panda-black text-2xl mb-2">Офис-менеджер</h2>
                    <p class="text-lg text-dark-gray mb-4">От 350 000 до 900 000 ₸ до вычета налогов</p>
                    <h3 class="font-semibold text-panda-black text-xl mb-2">Условия:</h3>
                    <ul class="list-disc list-inside text-dark-gray text-base mb-4">
                        <li>Девушка</li>
                        <li>Без опыта</li>
                        <li>Официальное трудоустройство.</li>
                        <li>Рабочий день 09:00-18:00 (5/2) СБ-ВС выходные.</li>
                    </ul>
                    <h3 class="font-semibold text-panda-black text-xl mb-2">Обязанности:</h3>
                    <ul class="list-disc list-inside text-dark-gray text-base mb-4">
                        <li>Ответы на телефонные звонки.</li>
                        <li>Ведение деловой корреспонденции.</li>
                        <li>Логистика.</li>
                        <li>Административно-хозяйственная часть.</li>
                        <li>Выполнение поручений руководителя.</li>
                    </ul>
                    <button class="px-6 py-3 bg-panda-orange text-panda-white rounded-full text-lg hover:bg-orange-600 transition-colors">
                        Откликнуться
                    </button>
                </div>

                <!-- Печатник -->
                <div class="bg-light-gray rounded-lg p-6">
                    <h2 class="font-bold text-panda-black text-2xl mb-2">Печатник</h2>
                    <p class="text-lg text-dark-gray mb-4">От 350 000 до 900 000 ₸ до вычета налогов</p>
                    <h3 class="font-semibold text-panda-black text-xl mb-2">Условия:</h3>
                    <ul class="list-disc list-inside text-dark-gray text-base mb-4">
                        <li>Мужчина</li>
                        <li>Опыт 1-3 года</li>
                        <li>Официальное трудоустройство.</li>
                        <li>Рабочий день 09:00-18:00 (5/2), СБ-ВС выходные.</li>
                    </ul>
                    <h3 class="font-semibold text-panda-black text-xl mb-2">Обязанности:</h3>
                    <ul class="list-disc list-inside text-dark-gray text-base mb-4">
                        <li>Работа на машинах: Mimaki 0-160, принтер сублимационный Ербол 11800, принтер Roland VersanCAMM VS-6401, принтер планшетный VID Roland VersanUV VLEF-200, гравировальная машина Roland Desktop EGX-350.</li>
                        <li>Постпечатная обработка продукции.</li>
                    </ul>
                    <button class="px-6 py-3 bg-panda-orange text-panda-white rounded-full text-lg hover:bg-orange-600 transition-colors">
                        Откликнуться
                    </button>
                </div>
            </div>

            <!-- Кадровый резерв -->
            <div class="bg-light-gray rounded-lg p-8 text-center">
                <h2 class="font-bold text-panda-black text-3xl mb-4">Кадровый резерв</h2>
                <p class="text-xl text-dark-gray mb-6">
                    Хотите работать у нас, но нет подходящей вакансии? Оставьте заявку!
                </p>
                <form class="flex flex-col items-center gap-4">
                    <input type="text" placeholder="Желаемая вакансия" class="w-full max-w-md px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:border-panda-orange">
                    <input type="text" placeholder="Ваше имя" class="w-full max-w-md px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:border-panda-orange">
                    <input type="tel" placeholder="Телефон" class="w-full max-w-md px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:border-panda-orange">
                    <input type="email" placeholder="Email" class="w-full max-w-md px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:border-panda-orange">
                    <textarea placeholder="Приложите резюме или ссылку на него" class="w-full max-w-md px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:border-panda-orange h-32 resize-y"></textarea>
                    <button type="submit" class="px-8 py-3 bg-panda-orange text-panda-white rounded-full text-lg hover:bg-orange-600 transition-colors">
                        Отправить
                    </button>
                </form>
            </div>
        </div>
        <FooterSection @navigateTo="$emit('navigateTo', $event)" />
    `
};

// Компонент Страницы "Оборудование"
const EquipmentPage = {
    template: `
        <div class="main-container bg-panda-white pb-0">
            <h1 class="font-bold text-panda-black text-4xl mb-4">Наше оборудование</h1>
            <p class="text-xl text-dark-gray leading-relaxed mb-6">
                Мы используем только современное и высокоточное оборудование для достижения наилучших результатов печати.
            </p>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                <!-- Roland VersaCAMM VS-640 -->
                <div class="bg-light-gray rounded-lg p-6 flex flex-col items-center text-center">
                    <img src="https://placehold.co/400x250/F7F7F7/131C26?text=Roland%20VS-640" alt="Roland VersaCAMM VS-640" class="w-full h-auto object-cover rounded-md mb-4">
                    <h2 class="font-bold text-panda-black text-2xl mb-2">Roland VersaCAMM VS-640</h2>
                    <p class="text-lg text-dark-gray mb-4">Экосольвентный плоттер-печатник с функцией плоттерной резки</p>
                    <ul class="text-left text-dark-gray text-base space-y-1 w-full">
                        <li><strong>Ширина печати:</strong> До 1615 мм</li>
                        <li><strong>Цветовая схема:</strong> CMYK Light Cyan, Light Magenta, White, Metallic</li>
                        <li><strong>Чернила:</strong> Roland ECO-SOL MAX/MAX 2</li>
                        <li><strong>Разрешение печати:</strong> До 1440 DPI</li>
                        <li><strong>Применение:</strong> Наружная реклама, наклейки, стикеры, витрины, печать по ПВХ, баннеру и пр.</li>
                    </ul>
                </div>

                <!-- Roland VersaUV LEF-200 -->
                <div class="bg-light-gray rounded-lg p-6 flex flex-col items-center text-center">
                    <img src="https://placehold.co/400x250/F7F7F7/131C26?text=Roland%20LEF-200" alt="Roland VersaUV LEF-200" class="w-full h-auto object-cover rounded-md mb-4">
                    <h2 class="font-bold text-panda-black text-2xl mb-2">Roland VersaUV LEF-200</h2>
                    <p class="text-lg text-dark-gray mb-4">УФ-принтер (ультрафиолетовая струйная печать)</p>
                    <ul class="text-left text-dark-gray text-base space-y-1 w-full">
                        <li><strong>Область печати:</strong> 508 х 330 мм. Высота до 100 мм</li>
                        <li><strong>Цветовая схема:</strong> CMYK White Gloss (nox)</li>
                        <li><strong>Чернила:</strong> Roland ECO-UV</li>
                        <li><strong>Разрешение печати:</strong> До 1440 DPI</li>
                        <li><strong>Применение:</strong> Печать на сувенирах, пластике, дереве, стекле, металле, коже и др.</li>
                    </ul>
                </div>

                <!-- Roland EGX-350 -->
                <div class="bg-light-gray rounded-lg p-6 flex flex-col items-center text-center">
                    <img src="https://placehold.co/400x250/F7F7F7/131C26?text=Roland%20EGX-350" alt="Roland EGX-350" class="w-full h-auto object-cover rounded-md mb-4">
                    <h2 class="font-bold text-panda-black text-2xl mb-2">Roland EGX-350</h2>
                    <p class="text-lg text-dark-gray mb-4">Настольный фрезерно-гравировальный станок (механическая гравировка)</p>
                    <ul class="text-left text-dark-gray text-base space-y-1 w-full">
                        <li><strong>Область печати:</strong> 305 х 230 мм. Высота до 40 мм.</li>
                        <li><strong>Скорость:</strong> 1200 мм/мин</li>
                        <li><strong>Совместимые материалы:</strong> Пластик, акрил, дерево, правопласт, мягкие металлы (алюминий, латунь)</li>
                        <li><strong>Применение:</strong> Таблички, бейджи, сувенирная продукция, штампы, панели</li>
                    </ul>
                </div>

                <!-- Duplo DC-616 -->
                <div class="bg-light-gray rounded-lg p-6 flex flex-col items-center text-center">
                    <img src="https://placehold.co/400x250/F7F7F7/131C26?text=Duplo%20DC-616" alt="Duplo DC-616" class="w-full h-auto object-cover rounded-md mb-4">
                    <h2 class="font-bold text-panda-black text-2xl mb-2">Duplo DC-616</h2>
                    <p class="text-lg text-dark-gray mb-4">Слиттер/Каттер / Биговщик</p>
                    <ul class="text-left text-dark-gray text-base space-y-1 w-full">
                        <li><strong>Область печати:</strong> 200 х 450 мм</li>
                        <li><strong>Скорость обработки:</strong> До 10 листов в минуту (А4, 2 реза, 1 биг)</li>
                        <li><strong>Применение:</strong> Визитки (до 24 на лист), открытки, приглашения, буклеты, меню, обложки книг, почтовые рассылки и др.</li>
                    </ul>
                </div>

                <!-- XEROX Versant 280 -->
                <div class="bg-light-gray rounded-lg p-6 flex flex-col items-center text-center">
                    <img src="https://placehold.co/400x250/F7F7F7/131C26?text=Xerox%20Versant%20280" alt="Xerox Versant 280" class="w-full h-auto object-cover rounded-md mb-4">
                    <h2 class="font-bold text-panda-black text-2xl mb-2">XEROX Versant 280</h2>
                    <p class="text-lg text-dark-gray mb-4">Цветная цифровая печатная машина</p>
                    <ul class="text-left text-dark-gray text-base space-y-1 w-full">
                        <li><strong>Скорость:</strong> До 50 стр./мин (А4)</li>
                        <li><strong>Область печати:</strong> От 98 х 140 мм до 550 х 660 мм</li>
                        <li><strong>Плотность бумаги:</strong> 52-400 г/м²</li>
                        <li><strong>Поддерживаемые материалы:</strong> Офсетная и мелованная бумага, синтетика, полиэстер, наклейки, открытки, окна, табуляторы, магнитные носители, конверты и др.</li>
                        <li><strong>Разрешение печати:</strong> До 2400 DPI</li>
                        <li><strong>Специальные тонеры:</strong> С опцией Adaptive CMYK+ Kit: Vivid (золото, серебро, белый, прозрачный), Fluorescent (флуоресцентные голубой, пурпурный, жёлтый).</li>
                    </ul>
                </div>

                 <!-- PFI Blade B3 -->
                 <div class="bg-light-gray rounded-lg p-6 flex flex-col items-center text-center">
                    <img src="https://placehold.co/400x250/F7F7F7/131C26?text=PFI%20Blade%20B3" alt="PFI Blade B3" class="w-full h-auto object-cover rounded-md mb-4">
                    <h2 class="font-bold text-panda-black text-2xl mb-2">PFI Blade B3</h2>
                    <p class="text-lg text-dark-gray mb-4">Цифровой режущий стол с автоматической подачей листов</p>
                    <ul class="text-left text-dark-gray text-base space-y-1 w-full">
                        <li><strong>Область обработки:</strong> 600х400 мм</li>
                        <li><strong>Скорость резки:</strong> До 800 мм/сек</li>
                        <li><strong>Применение:</strong> Штамповка, kiss-cut, биговка, прототипирование упаковки, изготовление этикеток, открыток, приглашений, бирок и др.</li>
                    </ul>
                </div>
            </div>
        </div>
        <FooterSection @navigateTo="$emit('navigateTo', $event)" />
    `
};

// --- Компонент Страницы "Подготовка к печати" ---
const PreparationPage = {
    template: `
        <div class="main-container bg-panda-white pb-0">
            <h1 class="font-bold text-panda-black text-4xl mb-4">Подготовка к печати</h1>
            <p class="text-xl text-dark-gray leading-relaxed mb-6">
                Важно следовать нашим рекомендациям по подготовке файлов для печати, чтобы обеспечить наилучший результат.
            </p>

            <div class="space-y-8">
                <!-- Размеры -->
                <div class="bg-light-gray rounded-lg p-6">
                    <h2 class="font-bold text-panda-black text-2xl mb-4">Размеры</h2>
                    <ul class="list-disc list-inside text-dark-gray text-lg space-y-2">
                        <li><strong>Стандартные DIN-форматы:</strong>
                            <ul class="list-circle list-inside ml-4 text-base space-y-1">
                                <li>A6: 105 x 148 мм</li>
                                <li>A5: 148 x 210 мм</li>
                                <li>A4: 210 x 297 мм (размер офисной бумаги)</li>
                                <li>A3: 297 x 420 мм</li>
                                <li>A2: 420 x 594 мм</li>
                                <li>A1: 594 x 841 мм</li>
                                <li>A0: 841 x 1189 мм</li>
                            </ul>
                        </li>
                        <li><strong>Баннер:</strong> 90 x 30 мм</li>
                        <li><strong>Евро-визитка:</strong> 85 x 55 мм</li>
                    </ul>
                    <p class="text-md text-dark-gray mt-4">
                        Если вы делаете дизайн в программе, которая выдает размер только в пикселях (например, Figma),
                        учитывайте, что для качественной печати в 300 DPI необходимо 12 пикселей на 1 мм.
                        Например, для открытки формата A6 потребуется изображение разрешением 1260x1976 px.
                    </p>
                </div>

                <!-- Графические элементы -->
                <div class="bg-light-gray rounded-lg p-6">
                    <h2 class="font-bold text-panda-black text-2xl mb-4">Графические элементы</h2>
                    <p class="text-xl text-dark-gray leading-relaxed mb-4">
                        <strong class="text-panda-orange">Вектор - лучший выбор!</strong>
                        Для четкой печати на любых носителях и любых размеров желательно использовать логотипы, иконки
                        и другие элементы (кроме фотографий) в векторном формате.
                    </p>
                    <p class="text-md text-dark-gray mb-4">
                        Векторные изображения строятся по математическим формулам, поэтому печатаются без искажений и потери качества.
                    </p>
                    <div class="flex flex-col md:flex-row items-center justify-around gap-4 mt-6">
                        <img src="https://placehold.co/200x150/F7F7F7/131C26?text=Векторное%20изображение" alt="Векторное изображение" class="w-full md:w-1/2 lg:w-1/3 rounded-lg">
                        <img src="https://placehold.co/200x150/F7F7F7/131C26?text=Растровое%20изображение%0AJPG,PNG,TIFF" alt="Растровое изображение" class="w-full md:w-1/2 lg:w-1/3 rounded-lg">
                    </div>
                    <p class="text-md text-dark-gray mt-4">
                        **Растровые изображения** (JPG, JPEG, TIFF, PNG) подходят для фотографий.
                    </p>
                </div>

                <!-- Шрифты -->
                <div class="bg-light-gray rounded-lg p-6">
                    <h2 class="font-bold text-panda-black text-2xl mb-4">Шрифты</h2>
                    <p class="text-xl text-dark-gray leading-relaxed mb-4">
                        Шрифты необходимо перевести в кривые. Приложите файлы шрифтов нашему менеджеру,
                        чтобы избежать искажения при печати.
                    </p>
                </div>

                <!-- Отступы -->
                <div class="bg-light-gray rounded-lg p-6">
                    <h2 class="font-bold text-panda-black text-2xl mb-4">Отступы</h2>
                    <ul class="list-disc list-inside text-dark-gray text-lg space-y-2">
                        <li>Во всех макетах оставлять отступы с фоном по периметру по 2 мм для обрезки. Например,
                            если вы делаете визитку размером 90х50 мм, размер с фоном составит 94х54 мм.</li>
                        <li>Отступ содержимого (текста, изображений) от края реза должен составлять от 5 мм.</li>
                    </ul>
                </div>

                <!-- Цвета -->
                <div class="bg-light-gray rounded-lg p-6">
                    <h2 class="font-bold text-panda-black text-2xl mb-4">Цвета</h2>
                    <p class="text-xl text-dark-gray leading-relaxed mb-4">
                        Обязательно отправляйте файлы на печать в цветовой модели <strong class="text-panda-orange">CMYK</strong>.
                        Если вы работаете в программе, где нет цветовой модели CMYK (Figma, Canva), при конвертации
                        цветов вы можете получить другой оттенок после печати. Используйте палитру PANTONE, если это возможно.
                    </p>
                </div>

                <!-- Формат файла -->
                <div class="bg-light-gray rounded-lg p-6">
                    <h2 class="font-bold text-panda-black text-2xl mb-4">Формат файла</h2>
                    <p class="text-xl text-dark-gray leading-relaxed mb-4">
                        Макет желательно присылать в **PDF**. Если макет может искажаться при конвертации,
                        допускается формат **CDR** (CorelDRAW).
                    </p>
                    <p class="text-md text-dark-gray">
                        Если макет был разработан в онлайн-редакторах (Figma, Canva), рекомендуется также прикладывать ссылку для возможной корректировки.
                    </p>
                </div>

                 <!-- Услуги подготовки -->
                 <div class="bg-light-gray rounded-lg p-8 text-center">
                    <h2 class="font-bold text-panda-black text-3xl mb-4">Услуги подготовки</h2>
                    <p class="text-xl text-dark-gray mb-6">
                        Нет времени на подготовку файлов? Оперативно сделаем за Вас!
                    </p>
                    <button class="px-8 py-3 bg-panda-orange text-panda-white rounded-full text-lg hover:bg-orange-600 transition-colors">
                        Заказать подготовку
                    </button>
                </div>
            </div>
        </div>
        <FooterSection @navigateTo="$emit('navigateTo', $event)" />
    `
};

// --- Компонент Страницы "Акции" ---
const PromotionsPage = {
    template: `
        <div class="main-container bg-panda-white pb-0">
            <h1 class="font-bold text-panda-black text-4xl mb-4">Акции</h1>
            <p class="text-xl text-dark-gray leading-relaxed mb-6">
                Ознакомьтесь с нашими текущими акциями и специальными предложениями!
            </p>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Акция 1: Скидка 15% на первый заказ -->
                <div class="bg-light-gray rounded-lg overflow-hidden p-6 text-center">
                    <img src="https://placehold.co/400x250/F7F7F7/131C26?text=Скидка%20на%20первый%20заказ" alt="Скидка на первый заказ" class="w-full h-auto object-cover rounded-md mb-4">
                    <h2 class="font-bold text-panda-black text-2xl mb-2">Скидка 15% на первый заказ</h2>
                    <p class="text-lg text-dark-gray mb-4">Для всех новых клиентов Red Panda.</p>
                    <button class="px-6 py-3 bg-panda-orange text-panda-white rounded-full text-lg hover:bg-orange-600 transition-colors">
                        Подробнее
                    </button>
                </div>
                <!-- Акция 2: Скидка 10% до 1 сентября -->
                <div class="bg-light-gray rounded-lg overflow-hidden p-6 text-center">
                    <img src="https://placehold.co/400x250/F7F7F7/131C26?text=Скидка%20к%20школе" alt="Скидка к школе" class="w-full h-auto object-cover rounded-md mb-4">
                    <h2 class="font-bold text-panda-black text-2xl mb-2">Скидка 10% до 1 сентября</h2>
                    <p class="text-lg text-dark-gray mb-4">Подготовьтесь к новому учебному году или сезону с выгодой!</p>
                    <button class="px-6 py-3 bg-panda-orange text-panda-white rounded-full text-lg hover:bg-orange-600 transition-colors">
                        Подробнее
                    </button>
                </div>
            </div>
        </div>
        <FooterSection @navigateTo="$emit('navigateTo', $event)" />
    `
};


// --- Главное Vue приложение ---
// Создаем и монтируем корневое Vue-приложение.
const app = createApp({
    setup() {
        const currentPage = ref('home');
        const userId = ref('Загрузка...');
        const isAuthReady = ref(false);
        const isAboutDropdownOpen = ref(false); // НОВОЕ: для контроля выпадающего меню

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
