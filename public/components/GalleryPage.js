import { ref, reactive } from 'vue';
import FooterSection from './FooterSection.js'; // Импорт футера

const GalleryPage = {
    components: {
        FooterSection
    },
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

export default GalleryPage;
