import FooterSection from './FooterSection.js'; // Импорт футера

const PreparationPage = {
    components: {
        FooterSection
    },
    template: `
        <div class="main-container bg-panda-white pb-0">
            <!-- Заголовок с оранжевой линией -->
            <h2 class="section-title mb-8">ШАБЛОНЫ</h2>
            
            <!-- Пакеты -->
            <div class="mb-12">
                <div class="flex flex-wrap gap-4 mb-6">
                    <div class="flex flex-col items-center">
                        <div class="w-20 h-28 bg-dark-gray rounded-sm flex items-center justify-center mb-2">
                            <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
                            </svg>
                        </div>
                        <div class="text-center">
                            <div class="text-xs text-panda-orange mb-1">320x200 мм</div>
                            <button class="px-3 py-1 bg-panda-black text-white text-xs rounded">Скачать</button>
                        </div>
                    </div>
                    
                    <div class="flex flex-col items-center">
                        <div class="w-20 h-28 bg-dark-gray rounded-sm flex items-center justify-center mb-2">
                            <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
                            </svg>
                        </div>
                        <div class="text-center">
                            <div class="text-xs text-panda-orange mb-1">250x350 мм</div>
                            <button class="px-3 py-1 bg-panda-black text-white text-xs rounded">Скачать</button>
                        </div>
                    </div>
                    
                    <div class="flex flex-col items-center">
                        <div class="w-20 h-28 bg-dark-gray rounded-sm flex items-center justify-center mb-2">
                            <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
                            </svg>
                        </div>
                        <div class="text-center">
                            <div class="text-xs text-panda-orange mb-1">330x240 мм</div>
                            <button class="px-3 py-1 bg-gray text-panda-black text-xs rounded">Скачать</button>
                        </div>
                    </div>
                    
                    <div class="flex flex-col items-center">
                        <div class="w-20 h-28 bg-dark-gray rounded-sm flex items-center justify-center mb-2">
                            <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
                            </svg>
                        </div>
                        <div class="text-center">
                            <div class="text-xs text-panda-orange mb-1">400x600 мм</div>
                            <button class="px-3 py-1 bg-gray text-panda-black text-xs rounded">Скачать</button>
                        </div>
                    </div>
                    
                    <div class="flex flex-col items-center">
                        <div class="w-20 h-28 bg-dark-gray rounded-sm flex items-center justify-center mb-2">
                            <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
                            </svg>
                        </div>
                        <div class="text-center">
                            <div class="text-xs text-panda-orange mb-1">420x600 мм</div>
                            <button class="px-3 py-1 bg-gray text-panda-black text-xs rounded">Скачать</button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Размеры -->
            <h2 class="section-title mb-8">РАЗМЕРЫ</h2>
            <div class="flex flex-wrap gap-8 mb-12">
                <!-- Текстовая информация -->
                <div class="flex-1 min-w-64">
                    <h3 class="font-bold text-panda-black text-lg mb-4">Стандартные DIN-форматы</h3>
                    <div class="space-y-2 text-dark-gray">
                        <div><strong>A0</strong> - 841×1189 мм</div>
                        <div><strong>A1</strong> - 594×841 мм</div>
                        <div><strong>A2</strong> - 420×594 мм</div>
                        <div><strong>A3</strong> - 297×420 мм</div>
                        <div><strong>A4</strong> - 210×297 мм</div>
                        <div><strong>A5</strong> - 148×210 мм</div>
                        <div><strong>A6</strong> - 105×148 мм</div>
                    </div>
                    <div class="mt-4 space-y-1 text-dark-gray">
                        <div><strong>Визитка</strong> - 90×50 мм</div>
                        <div><strong>Евро-визитка</strong> - 85×55 мм</div>
                    </div>
                </div>
                
                <!-- Визуальная схема форматов -->
                <div class="flex-1 min-w-64">
                    <div class="relative bg-light-gray p-4 rounded-lg" style="height: 400px;">
                        <!-- A0 (самый большой) -->
                        <div class="absolute border-2 border-dark-gray" style="width: 80%; height: 90%; top: 5%; left: 10%;">
                            <span class="absolute bottom-2 right-2 font-bold text-2xl text-dark-gray">A0</span>
                        </div>
                        
                        <!-- A1 -->
                        <div class="absolute border-2 border-dark-gray" style="width: 40%; height: 90%; top: 5%; left: 10%;">
                            <span class="absolute bottom-2 right-2 font-bold text-xl text-dark-gray">A1</span>
                        </div>
                        
                        <!-- A2 -->
                        <div class="absolute border-2 border-dark-gray" style="width: 40%; height: 45%; top: 5%; left: 10%;">
                            <span class="absolute bottom-1 right-1 font-bold text-lg text-dark-gray">A2</span>
                        </div>
                        
                        <!-- A3 -->
                        <div class="absolute border-2 border-dark-gray" style="width: 20%; height: 45%; top: 5%; left: 10%;">
                            <span class="absolute bottom-1 right-1 font-bold text-sm text-dark-gray">A3</span>
                        </div>
                        
                        <!-- A4 -->
                        <div class="absolute border-2 border-dark-gray" style="width: 20%; height: 22.5%; top: 5%; left: 10%;">
                            <span class="absolute bottom-0 right-0 font-bold text-xs text-dark-gray">A4</span>
                        </div>
                        
                        <!-- A5 -->
                        <div class="absolute border-2 border-dark-gray" style="width: 10%; height: 22.5%; top: 5%; left: 10%;">
                            <span class="absolute bottom-0 right-0 font-bold text-xs text-dark-gray">A5</span>
                        </div>
                        
                        <!-- A6 -->
                        <div class="absolute border-2 border-dark-gray" style="width: 10%; height: 11.25%; top: 5%; left: 10%;">
                            <span class="absolute bottom-0 right-0 font-bold text-xs text-dark-gray">A6</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Графические элементы -->
            <h2 class="section-title mb-8">ГРАФИЧЕСКИЕ ЭЛЕМЕНТЫ</h2>
            <div class="mb-12">
                <div class="mb-6">
                    <h3 class="font-bold text-panda-black text-lg mb-2">Вектор - лучший выбор</h3>
                    <p class="text-dark-gray mb-4">
                        Для четкой печати на любых носителях и любых размеров желательно использовать логотипы, иконки, 
                        и другие элементы (кроме фотографий) в векторном формате.
                    </p>
                    <p class="text-dark-gray mb-4">
                        Векторные изображения строятся по математическим формулам, поэтому печатаются без искажений и потери качества.
                    </p>
                </div>
                
                <div class="flex gap-8 items-center">
                    <div class="text-center">
                        <div class="bg-light-gray p-8 rounded-lg mb-4">
                            <div class="text-6xl font-bold text-panda-black">RED<br>PANDA</div>
                            <div class="text-sm text-dark-gray mt-2">Векторное изображение (SVG)</div>
                        </div>
                    </div>
                    
                    <div class="text-center">
                        <div class="bg-light-gray p-8 rounded-lg mb-4">
                            <div class="text-6xl font-bold text-panda-black">RED<br>PANDA</div>
                            <div class="text-sm text-dark-gray mt-2">Растровое изображение (.JPG, .PNG, .TIFF, .PSD)</div>
                        </div>
                    </div>
                </div>
                
                <div class="mt-4">
                    <h4 class="font-bold text-panda-black mb-2">Эффекты</h4>
                    <p class="text-dark-gray">
                        Тени, прозрачность, перекрытие должны быть растеризованы;
                        фигуры, линии, символы, текст — в векторе без контуров.
                    </p>
                </div>
            </div>

            <!-- Шрифты -->
            <h2 class="section-title mb-8">ШРИФТЫ</h2>
            <div class="mb-12">
                <p class="text-dark-gray mb-4">
                    Шрифты необходимыми элементы в кривые.
                </p>
                <div class="flex gap-4">
                    <div class="bg-light-gray p-4 rounded">
                        <div class="text-sm text-dark-gray">Corel Draw • Ctrl + Q</div>
                    </div>
                    <div class="bg-light-gray p-4 rounded">
                        <div class="text-sm text-dark-gray">Illustrator • Ctrl + Shift + O</div>
                    </div>
                </div>
                <p class="text-dark-gray mt-4">
                    Файл со шрифтами сохранить отдельно для использования дизайна, 
                    если потребуется исправить или скорректировать после печати.
                </p>
            </div>

            <!-- Отступы -->
            <h2 class="section-title mb-8">ОТСТУПЫ</h2>
            <div class="mb-12">
                <p class="text-dark-gray mb-4">
                    Необходимо делать отступ создать отступы в 1 мм для загибов.
                </p>
                <p class="text-dark-gray mb-4">
                    Отступ содержимого (текстового, изобразительного) от края после должен составлять 50-100 мм, не меньше.
                </p>
                <div class="bg-light-gray p-6 rounded-lg">
                    <div class="w-64 h-40 bg-panda-orange rounded relative mx-auto">
                        <div class="absolute inset-2 border-2 border-dashed border-white"></div>
                        <div class="absolute inset-4 bg-white bg-opacity-20 rounded flex items-center justify-center">
                            <div class="text-white text-center">
                                <div class="text-2xl font-bold">А</div>
                                <div class="text-xs">ЛОГОТИП ДИСТРИБЪЮТОРА</div>
                            </div>
                        </div>
                        <div class="absolute -bottom-6 left-0 text-xs text-dark-gray">5 мм</div>
                    </div>
                    <p class="text-center text-dark-gray mt-4">
                        Отступ содержимого (логотип, изображений и дизайна) должен быть 
                        составлять не менее 5 мм.
                    </p>
                </div>
            </div>

            <!-- Цвета -->
            <h2 class="section-title mb-8">ЦВЕТА</h2>
            <div class="mb-12">
                <p class="text-dark-gray mb-4">
                    Обязательно отправляйте файлы на печать в цветовой модели CMYK.
                </p>
                <p class="text-dark-gray mb-4">
                    Если вы работаете в программе, где нет цветовой модели CMYK (Figma, Canva), при конвертации
                    вы можете получить другой оттенок после печати.
                </p>
                <p class="text-dark-gray mb-4">
                    В графических редакторах иногда цвета PANTONE.
                </p>
                <p class="text-dark-gray mb-4">
                    В процессе печати, они работают с изначально заданной цветовой RED Paper, Council, 
                    рекомендуется точно характеризовать оттенок для желаемого оттенка.
                </p>
                
                <div class="mt-6">
                    <h4 class="font-bold text-panda-black mb-2">Палитра CMYK</h4>
                    <div class="text-sm text-dark-gray">С: Стандарт</div>
                </div>
            </div>

            <!-- Формат файла -->
            <h2 class="section-title mb-8">ФОРМАТ ФАЙЛА</h2>
            <div class="mb-12">
                <p class="text-dark-gray mb-4">
                    Предпочтительный формат файла PDF. Также может использоваться 
                    документооборот в PDF, редактируемых можно в текстовом жанре, а для графических 
                    редактирования только в CDR.
                </p>
                <p class="text-dark-gray mb-4">
                    Если макет был разработан в онлайн-редакторах (Figma, Canva), 
                    рекомендуется также прикладывать ссылку для возможной корректировки.
                </p>
                
                <div class="flex gap-4 mt-6">
                    <div class="flex items-center gap-2">
                        <div class="w-8 h-8 bg-red-500 rounded flex items-center justify-center">
                            <span class="text-white text-xs font-bold">PDF</span>
                        </div>
                        <span class="text-dark-gray">PDF</span>
                    </div>
                    <div class="flex items-center gap-2">
                        <div class="w-8 h-8 bg-blue-500 rounded flex items-center justify-center">
                            <span class="text-white text-xs font-bold">CDR</span>
                        </div>
                        <span class="text-dark-gray">CorelDRAW</span>
                    </div>
                    <div class="flex items-center gap-2">
                        <div class="w-8 h-8 bg-orange-500 rounded flex items-center justify-center">
                            <span class="text-white text-xs font-bold">AI</span>
                        </div>
                        <span class="text-dark-gray">Illustrator</span>
                    </div>
                    <div class="flex items-center gap-2">
                        <div class="w-8 h-8 bg-purple-500 rounded flex items-center justify-center">
                            <span class="text-white text-xs font-bold">PSD</span>
                        </div>
                        <span class="text-dark-gray">Photoshop</span>
                    </div>
                    <div class="flex items-center gap-2">
                        <div class="w-8 h-8 bg-green-500 rounded flex items-center justify-center">
                            <span class="text-white text-xs font-bold">EPS</span>
                        </div>
                        <span class="text-dark-gray">EPS</span>
                    </div>
                </div>
            </div>

            <!-- Услуги подготовки -->
            <h2 class="section-title mb-8">УСЛУГИ ПОДГОТОВКИ</h2>
            <div class="text-center bg-light-gray rounded-lg p-12 mb-12">
                <div class="mb-6">
                    <svg class="w-16 h-16 mx-auto text-dark-gray mb-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M7,13H17V11H7"/>
                    </svg>
                </div>
                <h3 class="text-2xl font-bold text-panda-black mb-4">Нет времени на подготовку файлов?</h3>
                <p class="text-xl text-panda-black mb-6">Оперативно сделаем за Вас!</p>
                <button class="px-8 py-3 bg-panda-orange text-white rounded-full text-lg hover:bg-orange-600 transition-colors">
                    Заказать подготовку файлов
                </button>
            </div>
        </div>
        <FooterSection @navigateTo="$emit('navigateTo', $event)" />
    `
};

export default PreparationPage;