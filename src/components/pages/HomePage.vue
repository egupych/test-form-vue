<script setup>
import HeroSection from '@/components/ui/HeroSection.vue'; // <-- ДОБАВЛЕН ИМПОРТ
import SectionHeader from '@/components/ui/SectionHeader.vue';
import ServicesGrid from '@/components/ui/ServicesGrid.vue';
import CalculationForm from '@/components/ui/CalculationForm.vue';
import TrustedBy from '@/components/ui/TrustedBy.vue';
import ReviewsSection from '@/components/ui/ReviewsSection.vue'; 
</script>


<template>
  <HeroSection /> 

  <main class="py-10 md:py-25">
    <div class="max-w-6xl mx-auto px-4">
      
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
        <SectionHeader class="gap-container">
          ПОЧЕМУ ВАМ ПОНРАВИТСЯ С НАМИ РАБОТАТЬ
        </SectionHeader>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div class="space-y-3 bg-white p-6">
            <h3 class="text-h4-panda font-semibold text-panda-black">1. Персональный подход</h3>
            <p class="text-body-panda text-dark-gray">Мы рассчитываем стоимость индивидуально — с учётом ваших задач и пожеланий. Вы платите только за то, что действительно нужно, без лишних расходов.</p>
          </div>
          <div class="space-y-3 bg-white p-6">
            <h3 class="text-h4-panda font-semibold text-panda-black">2. Дизайн, готовый к печати</h3>
            <p class="text-body-panda text-dark-gray">Продумываем проект так, чтобы его можно было без проблем напечатать в любой типографии. Это экономит ваше время и делает процесс максимально удобным.</p>
          </div>
          <div class="space-y-3 bg-white p-6">
            <h3 class="text-h4-panda font-semibold text-panda-black">3. Современное оборудование</h3>
            <p class="text-body-panda text-dark-gray">Используем только проверенную технику европейских, американских и японских производителей — это гарантия стабильного качества и точности.</p>
          </div>
          <div class="space-y-3 bg-white p-6">
            <h3 class="text-h4-panda font-semibold text-panda-black">4. Качественные материалы</h3>
            <p class="text-body-panda text-dark-gray">Работаем с лучшими поставщиками: Mondi (Австрия), Kurz (Германия), GMP (Южная Корея), Fedrigoni (Италия). Результат — прочная, приятная на ощупь и эстетичная продукция.</p>
          </div>
          <div class="space-y-3 bg-white p-6">
            <h3 class="text-h4-panda font-semibold text-panda-black">5. Команда профессионалов</h3>
            <p class="text-body-panda text-dark-gray">Ваш проект будет в надёжных руках — над ним работает команда опытных специалистов, которые знают, как довести дело до идеального результата.</p>
          </div>
          <div class="space-y-3 bg-white p-6">
            <h3 class="text-h4-panda font-semibold text-panda-black">6. Удобный формат сотрудничества</h3>
            <p class="text-body-panda text-dark-gray">Мы предлагаем гибкие условия — вы сами выбираете, как вам удобнее работать с нами. Пакеты услуг, прозрачные этапы, чёткие сроки.</p>
          </div>
        </div>
      </section>

      <TrustedBy />

      <ReviewsSection class="gap-page" /> <section class="gap-page">
        <CalculationForm /> 
      </section>

    </div>
  </main>
</template>

<style scoped>
/* Стили не нужны */
</style>