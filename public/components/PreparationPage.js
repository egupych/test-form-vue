import FooterSection from './FooterSection.js'; // Импорт футера

const PreparationPage = {
    components: {
        FooterSection
    },
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

export default PreparationPage;
