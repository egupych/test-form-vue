import FooterSection from './FooterSection.js'; // Импорт футера

const EquipmentPage = {
    components: {
        FooterSection
    },
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

export default EquipmentPage;
