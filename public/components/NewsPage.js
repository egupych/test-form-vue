import FooterSection from './FooterSection.js'; // Импорт футера

const NewsPage = {
    components: {
        FooterSection
    },
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

export default NewsPage;
