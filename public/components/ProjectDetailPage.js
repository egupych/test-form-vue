import FooterSection from './FooterSection.js'; // Импорт футера

const ProjectDetailPage = {
    components: {
        FooterSection
    },
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

export default ProjectDetailPage;
