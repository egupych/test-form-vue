<template>
    <div class="grid grid-cols-1 gap-6">
  
      <div class="bg-light-gray rounded-2xl p-6 flex flex-col items-center justify-center text-center h-full">
        <img src="/src/assets/images/pages/HomePage/Отдел качества.svg" alt="Иконка документа" class="w-20 h-20 mb-6">
        
        <p class="text-h5-panda font-semibold text-panda-black mb-6 max-w-sm leading-tight">
          Если возникнут какие-либо проблемы <br>с заказом, свяжитесь с отделом качества
        </p>
  
        <BaseButton 
          href="https://wa.me/77007257799" 
          target="_blank" 
          variant="fill-black"
        >
          Связаться
        </BaseButton>
      </div>
  
      <div class="bg-light-gray rounded-2xl p-6 flex flex-col items-center justify-center text-center h-full">
        <img src="/src/assets/images/pages/HomePage/Отзыв.svg" alt="Иконка сертификата" class="w-20 h-20 mb-6">
        
        <p class="text-h5-panda font-semibold text-panda-black mb-6 max-w-sm leading-tight">
          Уже были нашим клиентом? <br>Будем рады, если оставите отзыв <br>о нашей работе
        </p>
        
        <BaseButton to="#">
          Оставить отзыв
        </BaseButton>
      </div>
  
    </div>
  </template>
  
  <script setup>
  import BaseButton from '@/components/ui/BaseButton.vue';
  </script>
  
  <style scoped>
  /* Стили не требуются */
  </style>