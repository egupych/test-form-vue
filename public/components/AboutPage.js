import FooterSection from './FooterSection.js'; // Импорт футера

const AboutPage = {
    components: {
        FooterSection
    },
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

export default AboutPage;
