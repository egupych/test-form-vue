import FooterSection from './FooterSection.js'; // Импорт футера

const ShopPage = {
    components: {
        FooterSection
    },
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

export default ShopPage;
