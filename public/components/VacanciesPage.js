import FooterSection from './FooterSection.js'; // Импорт футера

const VacanciesPage = {
    components: {
        FooterSection
    },
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

export default VacanciesPage;
