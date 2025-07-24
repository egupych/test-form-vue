<script setup>
import BaseButton from '@/components/ui/BaseButton.vue';
import SectionHeader from '@/components/ui/SectionHeader.vue';

// --- ИЗМЕНЕНИЕ: Импортируем изображения как модули ---
import calendarSiyanie from '@/assets/images/pages/ShopPage/calendar-siyanie.png';
import calendarPustina from '@/assets/images/pages/ShopPage/calendar-pustina.png';
import calendarModern from '@/assets/images/pages/ShopPage/calendar-modern.png';

const specialOffer = {
  title: 'Календари 2025',
  description: 'Дизайнерские календари будут делать каждый ваш день особенным!',
  products: [
    {
      id: 1,
      name: 'Сияние',
      price: '12 000',
      // --- ИЗМЕНЕНИЕ: Используем импортированные переменные ---
      image: calendarSiyanie,
    },
    {
      id: 2,
      name: 'Пустыня',
      price: '15 000',
      // --- ИЗМЕНЕНИЕ: Используем импортированные переменные ---
      image: calendarPustina,
    },
    {
      id: 3,
      name: 'Модерн',
      price: '10 000',
      // --- ИЗМЕНЕНИЕ: Используем импортированные переменные ---
      image: calendarModern,
    },
  ],
};
</script>

<template>
  <main class="py-10 md:py-25">
    <div class="max-w-6xl mx-auto">
      <section>
        <SectionHeader>Спецпредложения</SectionHeader>

        <div
          class="flex flex-col lg:flex-row items-start gap-y-10 gap-x-16 mt-10"
        >
          <div
            class="flex-none lg:w-1/3 space-y-6 text-center lg:text-left pt-8"
          >
            <h2 class="text-h3-panda font-semibold text-panda-black">
              {{ specialOffer.title }}
            </h2>
            <p class="text-body-panda text-panda-black">
              {{ specialOffer.description }}
            </p>
            <BaseButton to="/gallery" variant="fill-black"
              >Смотреть все</BaseButton
            >
          </div>

          <div class="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-6 items-start">
            <div
              v-for="product in specialOffer.products"
              :key="product.id"
              class="relative group cursor-pointer"
              style="padding-bottom: 2.5rem"
            >
              <div
                class="relative transition-transform duration-300 ease-out group-hover:-translate-y-5"
              >
                <div
                  class="text-center space-y-4 bg-light-gray rounded-2xl p-6"
                >
                  <img
                    :src="product.image"
                    :alt="product.name"
                    class="mx-auto h-48 object-contain"
                  />
                  <div class="">
                    <h3 class="text-h5-panda font-semibold text-panda-black">
                      {{ product.name }}
                    </h3>
                    <p class="text-body-panda font-bold text-panda-black mt-1">
                      {{ product.price }} ₸
                    </p>
                  </div>
                </div>

                <div
                  class="absolute top-full w-full pt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                >
                  <div class="bg-light-gray rounded-2xl h-4 relative">
                    <div
                      class="absolute -bottom-6 left-1/2 -translate-x-1/2 w-12 h-12 bg-panda-black text-white rounded-full flex items-center justify-center group-hover:bg-panda-orange transition-colors"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </main>
</template>
