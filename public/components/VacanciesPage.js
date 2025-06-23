import { ref } from 'vue';

const FooterSection = {
    setup() {
        const isMapExpanded = ref(false);

        // SVG-код логотипа Red Panda
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

        // Данные для вакансий
        const vacancies = ref([
            {
                id: 1,
                title: 'Офис-менеджер',
                salary: 'от 350 000 до 900 000 до вычета налогов',
                tags: ['Девушка', 'Без опыта'],
                conditions: 'Официальное трудоустройство. Рабочий день 09:00-18:00 (5/2). СБ-ВС выходные',
                responsibilities: [
                    'Ответы на телефонные звонки;',
                    'Ведение деловой корреспонденции;',
                    'Логистика;',
                    'Административно-хозяйственная часть;',
                    'Выполнение поручений руководителя.'
                ]
            },
            {
                id: 2,
                title: 'Печатник',
                salary: 'от 350 000 до 900 000 до вычета налогов',
                tags: ['Мужчина', 'Опыт 1-3 года'],
                conditions: 'Официальное трудоустройство. Рабочий день 09:00-18:00 (5/2). СБ-ВС выходные',
                responsibilities: [
                    'Работа на машинах: Mimaki UJV100-160, принтер широкоформатный Mimaki CJV30-160, принтер Roland VersaCAMM VS-640i, принтер планшетный XR Roland VersaUV LEC-200, гравировальная машина Roland Desktop EGX-350;',
                    'Постпечатная обработка продукции.'
                ]
            }
        ]);

        // Данные формы
        const formData = ref({
            desiredPosition: '',
            name: '',
            phone: '',
            resume: null
        });

        const applyForPosition = (vacancyTitle) => {
            formData.value.desiredPosition = vacancyTitle;
            // Прокрутить к форме
            const formElement = document.querySelector('.talent-reserve-form');
            if (formElement) {
                formElement.scrollIntoView({ behavior: 'smooth' });
            }
        };

        const handleFileUpload = (event) => {
            const file = event.target.files[0];
            if (file) {
                formData.value.resume = file;
            }
        };

        const submitApplication = () => {
            // Здесь будет логика отправки формы
            alert('Спасибо за отклик! Мы свяжемся с вами в ближайшее время.');
            // Сброс формы
            formData.value = {
                desiredPosition: '',
                name: '',
                phone: '',
                resume: null
            };
        };

        return {
            isMapExpanded,
            redPandaLogoSvg,
            openLink,
            vacancies,
            formData,
            applyForPosition,
            handleFileUpload,
            submitApplication
        };
    },
    template: `
        <div class="w-full">
            <!-- Раздел вакансий -->
            <section class="w-full bg-white py-16 px-8">
                <div class="max-w-6xl mx-auto">
                    <!-- Заголовок вакансий -->
                    <div class="relative mb-12">
                        <h2 class="text-orange-500 text-sm font-bold tracking-widest uppercase relative inline-block">
                            ВАКАНСИИ
                            <div class="absolute top-1/2 left-full ml-6 w-full h-px bg-gradient-to-r from-orange-500 via-transparent to-transparent" 
                                 style="background-image: repeating-linear-gradient(to right, #f97316 0, #f97316 8px, transparent 8px, transparent 16px);"></div>
                        </h2>
                    </div>

                    <!-- Сетка вакансий -->
                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-16">
                        <div v-for="vacancy in vacancies" :key="vacancy.id" 
                             class="bg-gray-50 rounded-3xl p-8 relative">
                            
                            <!-- Заголовок с тегами -->
                            <div class="flex justify-between items-start mb-4">
                                <h3 class="text-2xl font-bold text-gray-900 leading-tight">{{ vacancy.title }}</h3>
                                <div class="flex gap-2 ml-4">
                                    <span v-for="tag in vacancy.tags" :key="tag"
                                          class="bg-white rounded-full px-4 py-2 text-sm font-medium text-gray-700 border border-gray-200 whitespace-nowrap">
                                        {{ tag }}
                                    </span>
                                </div>
                            </div>

                            <!-- Зарплата -->
                            <div class="text-gray-600 text-sm mb-6 font-medium">{{ vacancy.salary }}</div>

                            <!-- Условия -->
                            <div class="mb-6">
                                <div class="text-orange-500 font-bold text-base mb-3">Условия</div>
                                <div class="text-gray-800 text-sm leading-relaxed">{{ vacancy.conditions }}</div>
                            </div>

                            <!-- Обязанности -->
                            <div class="mb-8">
                                <div class="text-orange-500 font-bold text-base mb-3">Обязанности</div>
                                <ol class="list-decimal list-inside text-gray-800 text-sm leading-relaxed space-y-2">
                                    <li v-for="responsibility in vacancy.responsibilities" :key="responsibility" class="pl-1">
                                        {{ responsibility }}
                                    </li>
                                </ol>
                            </div>

                            <!-- Кнопка отклика -->
                            <button @click="applyForPosition(vacancy.title)"
                                    class="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-8 rounded-xl transition-all duration-200 hover:shadow-md">
                                Откликнуться
                            </button>
                        </div>
                    </div>

                    <!-- Кадровый резерв с формой -->
                    <div class="bg-white rounded-2xl p-8 talent-reserve-form">
                        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                            <!-- Левая часть: Кадровый резерв -->
                            <div>
                                <h2 class="text-4xl font-bold text-gray-900 mb-6 leading-tight">
                                    Кадровый<br>резерв
                                </h2>
                                <p class="text-gray-600 text-lg mb-2">
                                    Хотите работать у нас, но нет подходящей вакансии?
                                </p>
                                <p class="text-gray-600 text-lg">
                                    Оставьте заявку
                                </p>
                            </div>

                            <!-- Правая часть: Форма -->
                            <div>
                                <form @submit.prevent="submitApplication" class="space-y-6">
                                    <div>
                                        <input v-model="formData.desiredPosition"
                                               type="text" 
                                               placeholder="Желаемая вакансия" 
                                               class="w-full border-0 border-b border-gray-300 py-3 px-0 text-sm text-gray-900 placeholder-gray-500 bg-transparent focus:outline-none focus:border-orange-500 focus:ring-0"
                                               required>
                                    </div>
                                    <div>
                                        <input v-model="formData.name"
                                               type="text" 
                                               placeholder="Ваше имя" 
                                               class="w-full border-0 border-b border-gray-300 py-3 px-0 text-sm text-gray-900 placeholder-gray-500 bg-transparent focus:outline-none focus:border-orange-500 focus:ring-0"
                                               required>
                                    </div>
                                    <div>
                                        <input v-model="formData.phone"
                                               type="tel" 
                                               placeholder="Телефон" 
                                               class="w-full border-0 border-b border-gray-300 py-3 px-0 text-sm text-gray-900 placeholder-gray-500 bg-transparent focus:outline-none focus:border-orange-500 focus:ring-0"
                                               required>
                                    </div>
                                    <div>
                                        <label class="flex items-center gap-3 py-3 border-b border-gray-300 cursor-pointer text-gray-600 text-sm">
                                            <div class="w-5 h-5 bg-gray-300 rounded flex items-center justify-center text-xs">
                                                📎
                                            </div>
                                            <span>{{ formData.resume ? formData.resume.name : 'Приложите резюме или ссылку на него' }}</span>
                                            <input type="file" 
                                                   @change="handleFileUpload"
                                                   accept=".pdf,.doc,.docx" 
                                                   class="hidden">
                                        </label>
                                    </div>
                                    <button type="submit" 
                                            class="bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 px-8 rounded-full transition-colors">
                                        Отправить
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Оригинальный футер -->
            <footer class="w-full bg-panda-black text-light-gray py-12 px-8 relative overflow-hidden">
                <!-- Карта (будет накладываться поверх содержимого при расширении) -->
                <div class="map-overlay flex justify-center items-center"
                     :class="{ 'map-expanded': isMapExpanded }"
                     @mouseenter="isMapExpanded = true"
                     @mouseleave="isMapExpanded = false">
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2503.659614488975!2d71.4398188157545!3d51.15783397996503!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x424580e55b6a7a7b%3A0x6b8d9c5b2e5c6a1a!2z0YPQu9C40LLQtdGA0YHRgtGA0YPQvdC-0LLRgdC60LDRjyDRg9C90LDRh9C10YAg0JrQsNGA0L7QstCy0LDRgdGC0YDQsNGYNSwgNiwg0JDQstGC0LPRgNCw0LQsINCa0LDQvNC40YDQsCwg0JrQsNGA0L7QstCy0LDRgdGC0YDQsNGYNyAxMDAwMDYsINSa0LDQvNC40YDQsA!5e0!3m2!1sru!2skz!4v1701234567890!5m2=1sru!2skz"
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
                            <img src="/images/red-panda-logo-black.svg" alt="Логотип Red Panda" class="w-10 h-10 rounded-md mr-2">
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
                    <div class="lg:w-1/3 flex-grow h-64 lg:h-auto my-8 lg:my-0 order-first lg:order-none">
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
        </div>
    `
};

export default FooterSection;