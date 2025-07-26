<script setup>
import { ref } from 'vue';

const activeIndex = ref(null);

// Данные для аккордеона, взятые из предоставленного изображения
const faqs = [
  {
    question: 'Сколько стоит?',
    answer:
      'Прайс-листа у нас нет. Каждый заказ просчитывается индивидуально, согласно Вашему запросу.',
  },
  {
    question: 'Какие полиграфические услуги у Вас можно заказать?',
    answer:
      'Мы предоставляем весь спектр полиграфических услуг. Ведь мы прекрасно понимаем насколько важно для нашего клиента его время и качество получаемых услуг.',
  },
  {
    question: 'Сколько времени длится заказ?',
    answer:
      'Это зависит от типа и сложности заказа. В среднем на производства мы закладываем от 3-х рабочих дней. Естественно в наших же интересах и в интересах клиента выдать заказ раньше. Но в первую очередь мы придерживаемся качеству выпускаемой продукции.',
  },
  {
    question: 'Работаете ли с файлами клиента?',
    answer:
      'Конечно. Мы работаем со многими компаниями, у которых в штате есть собственные дизайнеры. Однако нужно понимать, что рисовать дизайн, чтобы выглядело красиво и рисовать дизайн для дальнейшего производства это две разные вещи. И здесь мы предоставляем помощь нашим клиентам в этом вопросе.',
  },
];

/**
 * Переключает активный элемент аккордеона.
 * Если элемент уже открыт, он закроется.
 * @param {number} index - Индекс элемента, по которому кликнули.
 */
const toggleAccordion = (index) => {
  activeIndex.value = activeIndex.value === index ? null : index;
};
</script>

<template>
  <div class="max-w-4xl mx-auto space-y-3">
    <div
      v-for="(faq, index) in faqs"
      :key="index"
      class="bg-white"
    >
      <button
        class="w-full flex justify-between items-center p-6 text-left focus:outline-none"
        :aria-expanded="activeIndex === index"
        @click="toggleAccordion(index)"
      >
        <span class="text-h5-panda font-semibold text-panda-black">{{
          faq.question
        }}</span>

        <div
          class="w-7 h-7 flex items-center justify-center flex-shrink-0 relative"
        >
          <div class="w-5 h-0.5 bg-gray rounded-full" />

          <div
            class="w-5 h-0.5 bg-gray rounded-full absolute transition-transform duration-300 ease-in-out"
            :class="{
              'rotate-90': activeIndex !== index,
              'rotate-0': activeIndex === index,
            }"
            style="transform-origin: center"
          />
        </div>
      </button>

      <div
        class="grid transition-all duration-500 ease-in-out"
        :class="activeIndex === index ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'"
      >
        <div class="overflow-hidden">
          <p class="text-body-panda text-dark-gray px-6 pb-6">
            {{ faq.answer }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Стили не требуются, вся логика в классах Tailwind CSS */
</style>
