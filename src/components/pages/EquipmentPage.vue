<script setup>
// --- ИЗМЕНЕНИЕ: Импортируем компонент заголовка ---
import SectionHeader from '@/components/ui/SectionHeader.vue';
</script>

<template>
  <main class="py-10 md:py-25 px-4 md:px-0">
    <div class="max-w-6xl mx-auto">
      <SectionHeader class="gap-container"> Наше Оборудование </SectionHeader>

      <section class="group grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        <div
          class="bg-light-gray rounded-lg p-8 flex items-center justify-center"
        >
          <img
            src="@/assets/images/pages/EquipmentPage/Roland VersaCAMM VS-640.png"
            alt="Экосольвентный плоттер Roland VersaCAMM VS-640"
            class="w-full h-auto max-w-sm"
            loading="lazy"
          />
        </div>
        <div class="space-y-6">
          <h2
            class="text-h3-panda font-bold text-panda-black transition-colors duration-300 group-hover:text-panda-orange"
          >
            Roland VersaCAMM VS-640
          </h2>
          <div
            class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-body-panda"
          >
            <div class="flex flex-col gap-y-4">
              <div>
                <h3 class="font-semibold text-panda-black mb-1">Тип</h3>
                <p class="text-panda-black">
                  Экосольвентный плоттер-печатник с функцией плоттерной резки
                </p>
              </div>
              <div>
                <h3 class="font-semibold text-panda-black mb-1">
                  Ширина печати
                </h3>
                <p class="text-panda-black">До 1615 мм</p>
              </div>
              <div>
                <h3 class="font-semibold text-panda-black mb-1">
                  Цветовая схема
                </h3>
                <p class="text-panda-black">
                  CMYK + Light Cyan, Light Magenta, White, Metallic
                </p>
              </div>
            </div>
            <div class="flex flex-col gap-y-4">
              <div>
                <h3 class="font-semibold text-panda-black mb-1">Чернила</h3>
                <p class="text-panda-black">Roland ECO-SOL MAX / MAX 2</p>
              </div>
              <div>
                <h3 class="font-semibold text-panda-black mb-1">
                  Разрешение печати
                </h3>
                <p class="text-panda-black">До 1440 DPI</p>
              </div>
              <div>
                <h3 class="font-semibold text-panda-black mb-1">Применение</h3>
                <p class="text-panda-black">
                  Наружная реклама, наклейки, стикеры, витрины, печать по ПВХ,
                  баннеру и пр.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <hr class="border-t border-gray my-16" />

      <section class="group grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        <div
          class="bg-light-gray rounded-lg p-8 flex items-center justify-center"
        >
          <img
            src="@/assets/images/pages/EquipmentPage/Roland VersaUV LEF-200.png"
            alt="УФ-принтер Roland VersaUV LEF-200"
            class="w-full h-auto max-w-sm"
            loading="lazy"
          />
        </div>
        <div class="space-y-6">
          <h2
            class="text-h3-panda font-bold text-panda-black transition-colors duration-300 group-hover:text-panda-orange"
          >
            Roland VersaUV LEF-200
          </h2>
          <div
            class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-body-panda"
          >
            <div class="flex flex-col gap-y-4">
              <div>
                <h3 class="font-semibold text-panda-black mb-1">Тип</h3>
                <p class="text-panda-black">
                  УФ-принтер (ультрафиолетовая струйная печать)
                </p>
              </div>
              <div>
                <h3 class="font-semibold text-panda-black mb-1">
                  Область печати
                </h3>
                <p class="text-panda-black">508 х 330 мм. Высота до 100 мм</p>
              </div>
              <div>
                <h3 class="font-semibold text-panda-black mb-1">
                  Цветовая схема
                </h3>
                <p class="text-panda-black">CMYK + White + Gloss (лак)</p>
              </div>
            </div>
            <div class="flex flex-col gap-y-4">
              <div>
                <h3 class="font-semibold text-panda-black mb-1">Чернила</h3>
                <p class="text-panda-black">Roland ECO-UV</p>
              </div>
              <div>
                <h3 class="font-semibold text-panda-black mb-1">
                  Разрешение печати
                </h3>
                <p class="text-panda-black">До 1440 DPI</p>
              </div>
              <div>
                <h3 class="font-semibold text-panda-black mb-1">Применение</h3>
                <p class="text-panda-black">
                  Печать на сувенирах, пластике, дереве, стекле, металле, коже и
                  др.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <hr class="border-t border-gray my-16" />

      <section class="group grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        <div
          class="bg-light-gray rounded-lg p-8 flex items-center justify-center"
        >
          <img
            src="@/assets/images/pages/EquipmentPage/Roland EGX-350.png"
            alt="Фрезерно-гравировальный станок Roland EGX-350"
            class="w-full h-auto max-w-sm"
            loading="lazy"
          />
        </div>
        <div class="space-y-6">
          <h2
            class="text-h3-panda font-bold text-panda-black transition-colors duration-300 group-hover:text-panda-orange"
          >
            Roland EGX-350
          </h2>
          <div
            class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-body-panda"
          >
            <div class="flex flex-col gap-y-4">
              <div>
                <h3 class="font-semibold text-panda-black mb-1">Тип</h3>
                <p class="text-panda-black">
                  Настольный фрезерно-гравировальный станок
                </p>
              </div>
              <div>
                <h3 class="font-semibold text-panda-black mb-1">
                  Область печати
                </h3>
                <p class="text-panda-black">305х230 мм, Высота до 40 мм</p>
              </div>
              <div>
                <h3 class="font-semibold text-panda-black mb-1">Скорость</h3>
                <p class="text-panda-black">1200 мм/мин</p>
              </div>
            </div>
            <div class="flex flex-col gap-y-4">
              <div>
                <h3 class="font-semibold text-panda-black mb-1">
                  Стандартные материалы
                </h3>
                <p class="text-panda-black">
                  Двухслойные пластики, акрил, дерево, латунь, алюминий
                </p>
              </div>
              <div>
                <h3 class="font-semibold text-panda-black mb-1">Применение</h3>
                <p class="text-panda-black">
                  Таблички, шильды, сувенирная продукция, штампы, клише
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <hr class="border-t border-gray my-16" />

      <section class="group grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        <div
          class="bg-light-gray rounded-lg p-8 flex items-center justify-center"
        >
          <img
            src="@/assets/images/pages/EquipmentPage/XEROX Versant 280.png"
            alt="Цифровая печатная машина XEROX Versant 280"
            class="w-full h-auto max-w-sm"
            loading="lazy"
          />
        </div>
        <div class="space-y-6">
          <h2
            class="text-h3-panda font-bold text-panda-black transition-colors duration-300 group-hover:text-panda-orange"
          >
            XEROX Versant 280
          </h2>
          <div
            class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-body-panda"
          >
            <div class="flex flex-col gap-y-4">
              <div>
                <h3 class="font-semibold text-panda-black mb-1">Тип</h3>
                <p class="text-panda-black">Цветная цифровая печатная машина</p>
              </div>
              <div>
                <h3 class="font-semibold text-panda-black mb-1">Скорость</h3>
                <p class="text-panda-black">До 80 стр./мин (А4)</p>
              </div>
              <div>
                <h3 class="font-semibold text-panda-black mb-1">
                  Плотность бумаги
                </h3>
                <p class="text-panda-black">52-400 г/м²</p>
              </div>
            </div>
            <div class="flex flex-col gap-y-4">
              <div>
                <h3 class="font-semibold text-panda-black mb-1">
                  Разрешение печати
                </h3>
                <p class="text-panda-black">2400 x 2400 DPI</p>
              </div>
              <div>
                <h3 class="font-semibold text-panda-black mb-1">
                  Специальные тонеры
                </h3>
                <p class="text-panda-black">
                  Золото, серебро, белый, прозрачный, флуоресцентные
                </p>
              </div>
              <div>
                <h3 class="font-semibold text-panda-black mb-1">Применение</h3>
                <p class="text-panda-black">
                  Высококачественная полиграфия, буклеты, брошюры, визитки.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <hr class="border-t border-gray my-16" />

      <section class="group grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        <div
          class="bg-light-gray rounded-lg p-8 flex items-center justify-center"
        >
          <img
            src="@/assets/images/pages/EquipmentPage/Duplo DC-616.png"
            alt="Автоматический биговщик Duplo DC-616"
            class="w-full h-auto max-w-sm"
            loading="lazy"
          />
        </div>
        <div class="space-y-6">
          <h2
            class="text-h3-panda font-bold text-panda-black transition-colors duration-300 group-hover:text-panda-orange"
          >
            Duplo DC-616
          </h2>
          <div
            class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-body-panda"
          >
            <div class="flex flex-col gap-y-4">
              <div>
                <h3 class="font-semibold text-panda-black mb-1">Тип</h3>
                <p class="text-panda-black">
                  Автоматический Слиттер / Каттер / Биговщик
                </p>
              </div>
              <div>
                <h3 class="font-semibold text-panda-black mb-1">
                  Скорость обработки
                </h3>
                <p class="text-panda-black">До 10 листов в минуту</p>
              </div>
            </div>
            <div class="flex flex-col gap-y-4">
              <div>
                <h3 class="font-semibold text-panda-black mb-1">Функции</h3>
                <p class="text-panda-black">
                  Продольная и поперечная резка, биговка
                </p>
              </div>
              <div>
                <h3 class="font-semibold text-panda-black mb-1">Применение</h3>
                <p class="text-panda-black">
                  Визитки, открытки, приглашения, буклеты, меню.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <hr class="border-t border-gray my-16" />

      <section class="group grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        <div
          class="bg-light-gray rounded-lg p-8 flex items-center justify-center"
        >
          <img
            src="@/assets/images/pages/EquipmentPage/PFI Blade B3.png"
            alt="Цифровой режущий стол PFI Blade B3"
            class="w-full h-auto max-w-sm"
            loading="lazy"
          />
        </div>
        <div class="space-y-6">
          <h2
            class="text-h3-panda font-bold text-panda-black transition-colors duration-300 group-hover:text-panda-orange"
          >
            PFI Blade B3
          </h2>
          <div
            class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-body-panda"
          >
            <div class="flex flex-col gap-y-4">
              <div>
                <h3 class="font-semibold text-panda-black mb-1">Тип</h3>
                <p class="text-panda-black">
                  Цифровой режущий стол с автоматической подачей листов
                </p>
              </div>
              <div>
                <h3 class="font-semibold text-panda-black mb-1">
                  Область обработки
                </h3>
                <p class="text-panda-black">340х480 мм</p>
              </div>
              <div>
                <h3 class="font-semibold text-panda-black mb-1">
                  Скорость резки
                </h3>
                <p class="text-panda-black">До 800 мм/сек</p>
              </div>
            </div>
            <div class="flex flex-col gap-y-4">
              <div>
                <h3 class="font-semibold text-panda-black mb-1">Применение</h3>
                <p class="text-panda-black">
                  Этикетки, kiss-cut, биговка, перфорация, изготовление
                  прототипов упаковки, открыток, приглашений, бирок и др.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </main>
</template>
