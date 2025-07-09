<script setup>
import { ref } from 'vue';
import HeroSection from '@/components/ui/HeroSection.vue';
import SectionHeader from '@/components/ui/SectionHeader.vue';
import ServicesGrid from '@/components/ui/ServicesGrid.vue';
import PageSearch from '@/components/ui/PageSearch.vue';
import CalculationForm from '@/components/ui/CalculationForm.vue';
import TrustedBy from '@/components/ui/TrustedBy.vue';
import ReviewsSection from '@/components/ui/ReviewsSection.vue';
import FaqAccordion from '@/components/ui/FaqAccordion.vue';
import FeedbackBlock from '@/components/ui/FeedbackBlock.vue';
import OrderStages from '@/components/ui/OrderStages.vue';
// --- [НОВОЕ] Импортируем наш хук ---
import { useIntersectionObserver } from '@/composables/useIntersectionObserver.js';

// --- [НОВОЕ] Выносим данные в массив для удобства ---
const benefits = ref([
  { title: '1. Персональный подход', text: 'Мы рассчитываем стоимость индивидуально — с учётом ваших задач и пожеланий. Вы платите только за то, что действительно нужно, без лишних расходов.' },
  { title: '2. Дизайн, готовый к печати', text: 'Продумываем проект так, чтобы его можно было без проблем напечатать в любой типографии. Это экономит ваше время и делает процесс максимально удобным.' },
  { title: '3. Современное оборудование', text: 'Используем только проверенную технику европейских, американских и японских производителей — это гарантия стабильного качества и точности.' },
  { title: '4. Качественные материалы', text: 'Работаем с лучшими поставщиками: Mondi (Австрия), Kurz (Германия), GMP (Южная Корея), Fedrigoni (Италия). Результат — прочная, приятная на ощупь и эстетичная продукция.' },
  { title: '5. Команда профессионалов', text: 'Ваш проект будет в надёжных руках — над ним работает команда опытных специалистов, которые знают, как довести дело до идеального результата.' },
  { title: '6. Удобный формат сотрудничества', text: 'Мы предлагаем гибкие условия — вы сами выбираете, как вам удобнее работать с нами. Пакеты услуг, прозрачные этапы, чёткие сроки.' }
]);

// --- [НОВОЕ] Логика для отслеживания видимости блока ---
const benefitsSectionRef = ref(null); // Ссылка на DOM-элемент секции
// Запускаем "наблюдатель", который вернет `true` в benefitsAreVisible, когда секция будет видна на 15%
const { isIntersecting: benefitsAreVisible } = useIntersectionObserver(benefitsSectionRef, { threshold: 0.15 });

</script>


<template>
  <HeroSection />

  <main class="py-10 md:py-25">
    <div class="max-w-6xl mx-auto">

      <section class="">
        <SectionHeader class="gap-container text-center">
            Все виды продукции от А до Я
        </SectionHeader>

        <p class="text-h5-panda text-dark-gray text-center max-w-3xl mx-auto mb-15">
          Мы — современное печатное агентство, которое предоставляет полный спектр полиграфических услуг. Наведите курсор на услугу в таблице ниже, чтобы увидеть краткий предпросмотр.
        </p>

        <ServicesGrid />

      </section>

      <section class="gap-page">
        <PageSearch />
      </section>

      <section class="gap-page" ref="benefitsSectionRef">
        <SectionHeader class="gap-container">
          ПОЧЕМУ ВАМ ПОНРАВИТСЯ С НАМИ РАБОТАТЬ
        </SectionHeader>
        
        <div 
          class="benefits-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          :class="{ 'is-visible': benefitsAreVisible }"
        >
          <div 
            v-for="(benefit, index) in benefits" 
            :key="benefit.title" 
            class="benefit-card space-y-3 bg-white p-6"
            :style="{ 'transition-delay': `${index * 100}ms` }"
          >
            <h3 class="text-h4-panda font-semibold text-panda-black">{{ benefit.title }}</h3>
            <p class="text-body-panda text-dark-gray">{{ benefit.text }}</p>
          </div>
        </div>
      </section>

      <section class="gap-page">
        <OrderStages />
      </section>

      <TrustedBy />

      <section class="gap-page">
        <ReviewsSection />
      </section>

      <section class="gap-page">
        <SectionHeader class="gap-container">
          Обратная связь
        </SectionHeader>
        <FeedbackBlock />
      </section>

      <section class="gap-page">
        <SectionHeader class="gap-container">
          Частые вопросы
        </SectionHeader>
        <FaqAccordion />
      </section>

      <section class="gap-page">
        <CalculationForm />
      </section>

    </div>
  </main>
</template>

<style scoped>
/* ВАРИАНТ 5: Энергичный "Выстрел" */
/* ВАРИАНТ 6: Размытие и проявление */
/* ВАРИАНТ 8: Откидывание сверху */
.benefits-grid {
  perspective: 1000px; /* Важно для создания 3D-сцены */
}

.benefit-card {
  opacity: 0;
  transform: rotateX(-90deg);
  transform-origin: top center; /* Точка вращения - верхний край */
  transition: opacity 0.6s ease-out, transform 0.6s cubic-bezier(0.215, 0.610, 0.355, 1);
}

.benefits-grid.is-visible .benefit-card {
  opacity: 1;
  transform: rotateX(0);
}
</style>