import FooterSection from './FooterSection.js'; // Импорт футера

const EquipmentPage = {
    components: {
        FooterSection
    },
    template: `
        <div class="min-h-screen">
            <!-- Equipment Grid -->
            <div class="max-w-7xl mx-auto px-6 py-16">
                <div>
                    
                    <!-- Roland VersaCAMM VS-640 -->
                    <div class="group grid grid-cols-1 lg:grid-cols-2 gap-16 items-start mb-16">
                        <div class="bg-gray-50 rounded-lg p-8 flex items-center justify-center">
                            <img src="/public/images/Roland VersaCAMM VS-640.png" 
                                 alt="Roland VersaCAMM VS-640" 
                                 class="w-full h-auto max-w-sm">
                        </div>
                        <div class="space-y-6">
                            <h2 class="text-2xl font-bold text-gray-900 transition-colors duration-300 group-hover:text-panda-orange">Roland VersaCAMM VS-640</h2>
                            
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-sm">
                                <div class="flex flex-col gap-y-4">
                                    <div class="group/item">
                                        <h3 class="font-semibold text-gray-900 mb-1 transition-colors duration-300 group-hover/item:text-panda-orange">Тип</h3>
                                        <p class="text-gray-600 transition-colors duration-300">Экосольвентный плоттер-печатник с функцией плоттерной резки</p>
                                    </div>
                                    <div class="group/item">
                                        <h3 class="font-semibold text-gray-900 mb-1 transition-colors duration-300 group-hover/item:text-panda-orange">Ширина печати</h3>
                                        <p class="text-gray-600 transition-colors duration-300">До 1615 мм</p>
                                    </div>
                                    <div class="group/item">
                                        <h3 class="font-semibold text-gray-900 mb-1 transition-colors duration-300 group-hover/item:text-panda-orange">Цветовая схема</h3>
                                        <p class="text-gray-600 transition-colors duration-300">CMYK + Light Cyan, Light Magenta, White, Metallic</p>
                                    </div>
                                </div>
                                <div class="flex flex-col gap-y-4">
                                    <div class="group/item">
                                        <h3 class="font-semibold text-gray-900 mb-1 transition-colors duration-300 group-hover/item:text-panda-orange">Чернила</h3>
                                        <p class="text-gray-600 transition-colors duration-300">Roland ECO-SOL MAX / MAX 2</p>
                                    </div>
                                    <div class="group/item">
                                        <h3 class="font-semibold text-gray-900 mb-1 transition-colors duration-300 group-hover/item:text-panda-orange">Разрешение печати</h3>
                                        <p class="text-gray-600 transition-colors duration-300">До 1440 DPI</p>
                                    </div>
                                    <div class="group/item">
                                        <h3 class="font-semibold text-gray-900 mb-1 transition-colors duration-300 group-hover/item:text-panda-orange">Применение</h3>
                                        <p class="text-gray-600 transition-colors duration-300">Наружная реклама, наклейки, стикеры, витрины, печать по ПВХ, баннеру и пр.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Разделитель -->
                    <hr class="border-t border-gray my-16" />

                    <!-- Roland VersaUV LEF-200 -->
                    <div class="group grid grid-cols-1 lg:grid-cols-2 gap-16 items-start mb-16">
                        <div class="bg-gray-50 rounded-lg p-8 flex items-center justify-center">
                            <img src="/public/images/Roland VersaUV LEF-200.png" 
                                 alt="Roland VersaUV LEF-200" 
                                 class="w-full h-auto max-w-sm">
                        </div>
                        <div class="space-y-6">
                            <h2 class="text-2xl font-bold text-gray-900 transition-colors duration-300 group-hover:text-panda-orange">Roland VersaUV LEF-200</h2>
                            
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-sm">
                                <div class="flex flex-col gap-y-4">
                                    <div class="group/item">
                                        <h3 class="font-semibold text-gray-900 mb-1 transition-colors duration-300 group-hover/item:text-panda-orange">Тип</h3>
                                        <p class="text-gray-600 transition-colors duration-300">УФ-принтер (ультрафиолетовая струйная печать)</p>
                                    </div>
                                    <div class="group/item">
                                        <h3 class="font-semibold text-gray-900 mb-1 transition-colors duration-300 group-hover/item:text-panda-orange">Область печати</h3>
                                        <p class="text-gray-600 transition-colors duration-300">508 х 330 мм. Высота до 100 мм</p>
                                    </div>
                                    <div class="group/item">
                                        <h3 class="font-semibold text-gray-900 mb-1 transition-colors duration-300 group-hover/item:text-panda-orange">Цветовая схема</h3>
                                        <p class="text-gray-600 transition-colors duration-300">CMYK + White + Gloss (лак)</p>
                                    </div>
                                </div>
                                <div class="flex flex-col gap-y-4">
                                    <div class="group/item">
                                        <h3 class="font-semibold text-gray-900 mb-1 transition-colors duration-300 group-hover/item:text-panda-orange">Чернила</h3>
                                        <p class="text-gray-600 transition-colors duration-300">Roland ECO-UV</p>
                                    </div>
                                    <div class="group/item">
                                        <h3 class="font-semibold text-gray-900 mb-1 transition-colors duration-300 group-hover/item:text-panda-orange">Разрешение печати</h3>
                                        <p class="text-gray-600 transition-colors duration-300">До 1440 DPI</p>
                                    </div>
                                    <div class="group/item">
                                        <h3 class="font-semibold text-gray-900 mb-1 transition-colors duration-300 group-hover/item:text-panda-orange">Применение</h3>
                                        <p class="text-gray-600 transition-colors duration-300">Печать на сувенирах, пластике, дереве, стекле, металле, коже и др.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Разделитель -->
                    <hr class="border-t border-gray my-16" />

                    <!-- Roland EGX-350 -->
                    <div class="group grid grid-cols-1 lg:grid-cols-2 gap-16 items-start mb-16">
                        <div class="bg-gray-50 rounded-lg p-8 flex items-center justify-center">
                            <img src="/public/images/Roland EGX-350.png" 
                                 alt="Roland EGX-350" 
                                 class="w-full h-auto max-w-sm">
                        </div>
                        <div class="space-y-6">
                            <h2 class="text-2xl font-bold text-gray-900 transition-colors duration-300 group-hover:text-panda-orange">Roland EGX-350</h2>
                            
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-sm">
                                <div class="flex flex-col gap-y-4">
                                    <div class="group/item">
                                        <h3 class="font-semibold text-gray-900 mb-1 transition-colors duration-300 group-hover/item:text-panda-orange">Тип</h3>
                                        <p class="text-gray-600 transition-colors duration-300">Настольный фрезерно-гравировальный станок (механическая гравировка)</p>
                                    </div>
                                    <div class="group/item">
                                        <h3 class="font-semibold text-gray-900 mb-1 transition-colors duration-300 group-hover/item:text-panda-orange">Область печати</h3>
                                        <p class="text-gray-600 transition-colors duration-300">305 х 230 мм. Высота до 40 мм</p>
                                    </div>
                                    <div class="group/item">
                                        <h3 class="font-semibold text-gray-900 mb-1 transition-colors duration-300 group-hover/item:text-panda-orange">Скорость</h3>
                                        <p class="text-gray-600 transition-colors duration-300">1200 мм/мин</p>
                                    </div>
                                </div>
                                <div class="flex flex-col gap-y-4">
                                    <div class="group/item">
                                        <h3 class="font-semibold text-gray-900 mb-1 transition-colors duration-300 group-hover/item:text-panda-orange">Совместимые материалы</h3>
                                        <p class="text-gray-600 transition-colors duration-300">Пластик, акрил, дерево, правопласт, мягкие металлы (алюминий, латунь)</p>
                                    </div>
                                    <div class="group/item">
                                        <h3 class="font-semibold text-gray-900 mb-1 transition-colors duration-300 group-hover/item:text-panda-orange">Применение</h3>
                                        <p class="text-gray-600 transition-colors duration-300">Таблички, бейджи, сувенирная продукция, штампы, панели</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Разделитель -->
                    <hr class="border-t border-gray my-16" />

                    <!-- Duplo DC-616 -->
                    <div class="group grid grid-cols-1 lg:grid-cols-2 gap-16 items-start mb-16">
                        <div class="bg-gray-50 rounded-lg p-8 flex items-center justify-center">
                            <img src="/public/images/Duplo DC-616.png" 
                                 alt="Duplo DC-616" 
                                 class="w-full h-auto max-w-sm">
                        </div>
                        <div class="space-y-6">
                            <h2 class="text-2xl font-bold text-gray-900 transition-colors duration-300 group-hover:text-panda-orange">Duplo DC-616</h2>
                            
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-sm">
                                <div class="flex flex-col gap-y-4">
                                    <div class="group/item">
                                        <h3 class="font-semibold text-gray-900 mb-1 transition-colors duration-300 group-hover/item:text-panda-orange">Тип</h3>
                                        <p class="text-gray-600 transition-colors duration-300">Слиттер / Каттер / Биговщик</p>
                                    </div>
                                    <div class="group/item">
                                        <h3 class="font-semibold text-gray-900 mb-1 transition-colors duration-300 group-hover/item:text-panda-orange">Область печати</h3>
                                        <p class="text-gray-600 transition-colors duration-300">200 х 450 мм</p>
                                    </div>
                                </div>
                                <div class="flex flex-col gap-y-4">
                                    <div class="group/item">
                                        <h3 class="font-semibold text-gray-900 mb-1 transition-colors duration-300 group-hover/item:text-panda-orange">Применение</h3>
                                        <p class="text-gray-600 transition-colors duration-300">Визитки (до 24 на лист), открытки, приглашения, буклеты, меню, обложки книг, почтовые рассылки и др.</p>
                                    </div>
                                    <div class="group/item">
                                        <h3 class="font-semibold text-gray-900 mb-1 transition-colors duration-300 group-hover/item:text-panda-orange">Скорость обработки</h3>
                                        <p class="text-gray-600 transition-colors duration-300">До 10 листов в минуту (А4, 2 реза, 1 биг)</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Разделитель -->
                    <hr class="border-t border-gray my-16" />

                    <!-- XEROX Versant 280 -->
                    <div class="group grid grid-cols-1 lg:grid-cols-2 gap-16 items-start mb-16">
                        <div class="bg-gray-50 rounded-lg p-8 flex items-center justify-center">
                            <img src="/public/images/XEROX Versant 280.png" 
                                 alt="XEROX Versant 280" 
                                 class="w-full h-auto max-w-sm">
                        </div>
                        <div class="space-y-6">
                            <h2 class="text-2xl font-bold text-gray-900 transition-colors duration-300 group-hover:text-panda-orange">XEROX Versant 280</h2>
                            
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-sm">
                                <div class="flex flex-col gap-y-4">
                                    <div class="group/item">
                                        <h3 class="font-semibold text-gray-900 mb-1 transition-colors duration-300 group-hover/item:text-panda-orange">Тип</h3>
                                        <p class="text-gray-600 transition-colors duration-300">Цветная цифровая печатная машина</p>
                                    </div>
                                    <div class="group/item">
                                        <h3 class="font-semibold text-gray-900 mb-1 transition-colors duration-300 group-hover/item:text-panda-orange">Скорость</h3>
                                        <p class="text-gray-600 transition-colors duration-300">До 50 стр./мин (А4)</p>
                                    </div>
                                    <div class="group/item">
                                        <h3 class="font-semibold text-gray-900 mb-1 transition-colors duration-300 group-hover/item:text-panda-orange">Область печати</h3>
                                        <p class="text-gray-600 transition-colors duration-300">От 98 х 140 мм до 550 х 660 мм</p>
                                    </div>
                                    <div class="group/item">
                                        <h3 class="font-semibold text-gray-900 mb-1 transition-colors duration-300 group-hover/item:text-panda-orange">Плотность бумаги</h3>
                                        <p class="text-gray-600 transition-colors duration-300">52-400 г/м²</p>
                                    </div>
                                </div>
                                <div class="flex flex-col gap-y-4">
                                    <div class="group/item">
                                        <h3 class="font-semibold text-gray-900 mb-1 transition-colors duration-300 group-hover/item:text-panda-orange">Поддерживаемые материалы</h3>
                                        <p class="text-gray-600 transition-colors duration-300">Офсетная и мелованная бумага, синтетика, полиэстер, наклейки, открытки, окна, табуляторы, магнитные носители, конверты и др.</p>
                                    </div>
                                    <div class="group/item">
                                        <h3 class="font-semibold text-gray-900 mb-1 transition-colors duration-300 group-hover/item:text-panda-orange">Разрешение печати</h3>
                                        <p class="text-gray-600 transition-colors duration-300">До 2400 DPI</p>
                                    </div>
                                    <div class="group/item">
                                        <h3 class="font-semibold text-gray-900 mb-1 transition-colors duration-300 group-hover/item:text-panda-orange">Специальные тонеры</h3>
                                        <p class="text-gray-600 transition-colors duration-300">С опцией Adaptive CMYK+ Kit: Vivid (золото, серебро, белый, прозрачный) и Fluorescent (флуоресцентные голубой, пурпурный, жёлтый)</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Разделитель -->
                    <hr class="border-t border-gray my-16" />

                    <!-- PFI Blade B3 -->
                    <div class="group grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
                        <div class="bg-gray-50 rounded-lg p-8 flex items-center justify-center">
                            <img src="/public/images/PFI Blade B3.png" 
                                 alt="PFI Blade B3" 
                                 class="w-full h-auto max-w-sm">
                        </div>
                        <div class="space-y-6">
                            <h2 class="text-2xl font-bold text-gray-900 transition-colors duration-300 group-hover:text-panda-orange">PFI Blade B3</h2>
                            
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-sm">
                                <div class="flex flex-col gap-y-4">
                                    <div class="group/item">
                                        <h3 class="font-semibold text-gray-900 mb-1 transition-colors duration-300 group-hover/item:text-panda-orange">Тип</h3>
                                        <p class="text-gray-600 transition-colors duration-300">Цифровой режущий стол с автоматической подачей листов</p>
                                    </div>
                                    <div class="group/item">
                                        <h3 class="font-semibold text-gray-900 mb-1 transition-colors duration-300 group-hover/item:text-panda-orange">Область обработки</h3>
                                        <p class="text-gray-600 transition-colors duration-300">600 х 400 мм</p>
                                    </div>
                                </div>
                                <div class="flex flex-col gap-y-4">
                                    <div class="group/item">
                                        <h3 class="font-semibold text-gray-900 mb-1 transition-colors duration-300 group-hover/item:text-panda-orange">Применение</h3>
                                        <p class="text-gray-600 transition-colors duration-300">Штамповка, kiss-cut, биговка, прототипирование упаковки, изготовление этикеток, открыток, приглашений, бирок и др.</p>
                                    </div>
                                    <div class="group/item">
                                        <h3 class="font-semibold text-gray-900 mb-1 transition-colors duration-300 group-hover/item:text-panda-orange">Скорость резки</h3>
                                        <p class="text-gray-600 transition-colors duration-300">До 800 мм/сек</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
        <FooterSection @navigateTo="$emit('navigateTo', $event)" />
    `
};

export default EquipmentPage;
