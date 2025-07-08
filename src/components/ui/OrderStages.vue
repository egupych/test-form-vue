<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import SectionHeader from '@/components/ui/SectionHeader.vue';

// Данные о стадиях заказа.
const stages = ref([
  { id: 1, title: 'Заявка', image: 'https://images.unsplash.com/photo-1556740758-90de374c12ad?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' },
  { id: 2, title: 'Расчёт стоимости', image: 'https://images.unsplash.com/photo-1554224155-1696413565d3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' },
  { id: 3, title: 'Оплата', image: 'https://images.unsplash.com/photo-1556740758-90de374c12ad?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' },
  { id: 4, title: 'Проверка макета', image: 'https://images.unsplash.com/photo-1558986518-86d341934938?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' },
  { id: 5, title: 'Допечатная подготовка', image: 'https://images.unsplash.com/photo-1556740758-90de374c12ad?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' },
  { id: 6, title: 'Согласование', image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' },
  { id: 7, title: 'Печать', image: 'https://images.unsplash.com/photo-1556740758-90de374c12ad?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' },
  { id: 8, title: 'Постпечатная обработка', image: 'https://images.unsplash.com/photo-1605334656910-096a52504892?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' },
  { id: 9, title: 'Контроль качества', image: 'https://images.unsplash.com/photo-1556740758-90de374c12ad?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' },
  { id: 10, title: 'Доставка/самовывоз', image: 'https://images.unsplash.com/photo-1586528116311-08dd4c424d87?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' },
]);

const activeIndex = ref(0);
const containerRef = ref(null);
let scrollListenerActive = false;

const listWrapperRef = ref(null);
const imageContainerRef = ref(null);

const activeImage = computed(() => {
  return stages.value[activeIndex.value]?.image || stages.value[0].image;
});

const setActiveStage = (index) => {
  activeIndex.value = index;
};

const onScroll = () => {
  if (!containerRef.value) return;
  const listContainer = containerRef.value.querySelector('.stages-list-container');
  if (!listContainer) return;
  const listRect = listContainer.getBoundingClientRect();
  const windowHeight = window.innerHeight;
  const activationPoint = windowHeight * 0.5;
  const scrollableHeight = listRect.height - windowHeight * 0.4;
  const progressPx = activationPoint - listRect.top;
  const progress = Math.max(0, Math.min(1, progressPx / scrollableHeight));
  const newIndex = Math.floor(progress * stages.value.length);
  activeIndex.value = Math.min(newIndex, stages.value.length - 1);
};

onMounted(() => {
  if (!containerRef.value) return;

  const scrollObserver = new IntersectionObserver((entries) => {
    const entry = entries[0];
    if (entry.isIntersecting) {
      if (!scrollListenerActive) {
        document.addEventListener('scroll', onScroll, { passive: true });
        scrollListenerActive = true;
      }
    } else {
      if (scrollListenerActive) {
        document.removeEventListener('scroll', onScroll);
        scrollListenerActive = false;
      }
    }
  });
  scrollObserver.observe(containerRef.value);

  let resizeObserver = null;
  if (listWrapperRef.value && imageContainerRef.value) {
    resizeObserver = new ResizeObserver(entries => {
      for (let entry of entries) {
        const newHeight = entry.contentRect.height;
        imageContainerRef.value.style.height = `${newHeight}px`;
      }
    });
    resizeObserver.observe(listWrapperRef.value);
  }

  onUnmounted(() => {
    scrollObserver.disconnect();
    if (resizeObserver) {
      resizeObserver.disconnect();
    }
    if (scrollListenerActive) {
      document.removeEventListener('scroll', onScroll);
    }
  });
});
</script>

<template>
  <div ref="containerRef" class="">
    <SectionHeader class="gap-container">
      Стадии жизненного цикла заказа
    </SectionHeader>
    
    <div class="grid grid-cols-1 lg:grid-cols-[261px_auto] lg:gap-x-8 items-start">
      
      <div class="lg:sticky top-32 mb-8 lg:mb-0">
        <h2 class="text-h2-panda font-bold text-panda-black">Стадии заказа</h2>
        <p class="text-h5-panda text-dark-gray mt-2">Постарались организовать всё быстро и удобно</p>
      </div>

      <div class="w-full">
         <div class="grid grid-cols-1 md:grid-cols-2">
            
            <div class="stages-list-container lg:h-[180vh] w-full">
              <div class="lg:sticky top-32">
                <div ref="listWrapperRef" class="bg-white">
                  <ul class="">
                    <li
                      v-for="(stage, index) in stages"
                      :key="stage.id"
                      @click="setActiveStage(index)"
                      class="transition-all duration-300 h-[51px] flex items-center px-4 cursor-pointer"
                      :class="[
                        'text-button-panda font-semibold',
                        activeIndex === index 
                          ? 'bg-panda-black text-white' 
                          : 'bg-white text-panda-black'
                      ]"
                    >
                      {{ index + 1 }}. {{ stage.title }}
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div class="lg:sticky top-32 mt-8 md:mt-0">
              <div ref="imageContainerRef" class="relative w-full h-full overflow-hidden">
                 <transition name="slide-up" mode="out-in">
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
</template>

<style scoped>
.slide-up-enter-active,
.slide-up-leave-active {
  transition: transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.slide-up-enter-from {
  transform: translateY(100%);
}

.slide-up-leave-to {
  transform: translateY(-100%);
}
</style>