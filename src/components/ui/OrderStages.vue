<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import SectionHeader from '@/components/ui/SectionHeader.vue';

// Данные о стадиях заказа. Изображения по-прежнему меняются.
const stages = ref([
  {
    id: 1,
    title: 'Заявка',
    image: '/src/assets/images/pages/HomePage/OrderStages/заявка.webp',
  },
  {
    id: 2,
    title: 'Расчёт стоимости',
    image:
      '/src/assets/images/pages/HomePage/OrderStages/расчёт стоимости.webp',
  },
  {
    id: 3,
    title: 'Оплата',
    image:
      'https://images.unsplash.com/photo-1556740758-90de374c12ad?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
  },
  {
    id: 4,
    title: 'Проверка макета',
    image:
      'https://images.unsplash.com/photo-1556740758-90de374c12ad?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
  },
  {
    id: 5,
    title: 'Допечатная подготовка',
    image:
      '/src/assets/images/pages/HomePage/OrderStages/подготовка к печати.webp',
  },
  {
    id: 6,
    title: 'Согласование',
    image:
      'https://images.unsplash.com/photo-1552664730-d307ca884978?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
  },
  {
    id: 7,
    title: 'Печать',
    image:
      'https://images.unsplash.com/photo-1556740758-90de374c12ad?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
  },
  {
    id: 8,
    title: 'Постпечатная обработка',
    image:
      'https://images.unsplash.com/photo-1556740758-90de374c12ad?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
  },
  {
    id: 9,
    title: 'Контроль качества',
    image:
      '/src/assets/images/pages/HomePage/OrderStages/9. Контроль качества.png',
  },
  {
    id: 10,
    title: 'Доставка/самовывоз',
    image:
      'https://images.unsplash.com/photo-1556740758-90de374c12ad?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
  },
]);

const activeIndex = ref(0);
const listWrapperRef = ref(null);
const imageContainerRef = ref(null);

const activeImage = computed(() => {
  return stages.value[activeIndex.value]?.image || stages.value[0].image;
});

const setActiveStage = (index) => {
  if (activeIndex.value === index) return;
  activeIndex.value = index;
};

// Синхронизация высоты
onMounted(() => {
  let resizeObserver = null;
  if (listWrapperRef.value && imageContainerRef.value) {
    resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const newHeight = entry.contentRect.height;
        imageContainerRef.value.style.height = `${newHeight}px`;
      }
    });
    resizeObserver.observe(listWrapperRef.value);
  }

  onUnmounted(() => {
    if (resizeObserver) {
      resizeObserver.disconnect();
    }
  });
});
</script>

<template>
  <div>
    <SectionHeader class="gap-container">
      Стадии жизненного цикла заказа
    </SectionHeader>

    <div>
      <div
        class="grid grid-cols-1 lg:grid-cols-[16.3125rem_auto] lg:gap-x-8 items-start"
      >
        <div>
          <h2 class="text-h2-panda font-bold text-panda-black">
            Стадии заказа
          </h2>
          <p class="text-h5-panda text-dark-gray mt-2">
            Быстро и удобно
          </p>
        </div>

        <div class="w-full mt-8 lg:mt-0">
          <div class="grid grid-cols-1 md:grid-cols-2">
            <div>
              <div
                ref="listWrapperRef"
                class="bg-white"
              >
                <ul>
                  <li
                    v-for="(stage, index) in stages"
                    :key="stage.id"
                    class="transition-all duration-300 h-[3.1875rem] flex items-center px-4 cursor-pointer"
                    :class="[
                      'text-button-panda font-semibold',
                      activeIndex === index
                        ? 'bg-panda-black text-white'
                        : 'bg-white text-panda-black',
                    ]"
                    @mouseenter="setActiveStage(index)"
                  >
                    {{ index + 1 }}. {{ stage.title }}
                  </li>
                </ul>
              </div>
            </div>

            <div class="mt-8 md:mt-0">
              <div
                ref="imageContainerRef"
                class="relative w-full h-full overflow-hidden"
              >
                <transition name="image-swap">
                  <img
                    :key="activeImage"
                    :src="activeImage"
                    alt="Этап заказа"
                    class="absolute inset-0 w-full h-full object-cover"
                  >
                </transition>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
