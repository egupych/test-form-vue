<script setup>
import { ref } from 'vue';
import BaseButton from '@/components/ui/BaseButton.vue';
import SectionHeader from '@/components/ui/SectionHeader.vue';

// Определяем категории и активную категорию по умолчанию
const categories = ref([
  { id: 'badges', name: 'Бейджи и номерки' },
  { id: 'notebooks', name: 'Блокноты и тетради' },
  { id: 'businessCards', name: 'Визитки' },
  { id: 'outdoorAdvertising', name: 'Наружная реклама' },
  { id: 'calendarsPlanners', name: 'Календари и планеры' },
  { id: 'boxesPackaging', name: 'Коробки и Упаковка' },
  { id: 'bags', name: 'Пакеты' },
  { id: 'souvenirs', name: 'Сувенирная продукция' },
  { id: 'merchGifts', name: 'Мерч и подарки' },
  { id: 'catalogsAlbums', name: 'Каталоги и альбомы' },
  { id: 'stickersLabels', name: 'Наклейки и этикетки' },
  { id: 'certificatesInvitations', name: 'Сертификаты и пригласительные' },
  { id: 'corporateIdentity', name: 'Фирменный стиль' }
]);
const activeCategory = ref('catalogsAlbums');

// Данные о проектах (пока что только для одной категории)
const projects = {
  catalogsAlbums: [
    {
      id: 1,
      title: 'Каталог «Лудэ-Каз»',
      description: 'Каталог в фирменных цветах с нотками современного искусства.',
      image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500',
      link: '/project-detail'
    },
    {
      id: 2,
      title: 'Каталог «Мир охоты»',
      description: 'Музейный фонд охотничьего центра г. Костанай.',
      image: 'https://images.unsplash.com/photo-1517842645767-c6f90415ad90?w=500',
      link: '/project-detail'
    }
  ]
};
</script>

<template>
  <main class="py-10 md:py-25">
    <div class="max-w-6xl mx-auto">
        
        <SectionHeader class="gap-container">
          Наши работы
        </SectionHeader>

        <p class="text-h5-panda text-dark-gray leading-relaxed text-center max-w-2xl mx-auto mb-10">Примеры наших проектов. Нажмите "Смотреть", чтобы увидеть детали.</p>
        
        <div class="flex flex-wrap gap-2 mb-10">
            <BaseButton
              v-for="category in categories"
              :key="category.id"
              @click="activeCategory = category.id"
              :variant="activeCategory === category.id ? 'fill-black' : 'gray'"
            >
              {{ category.name }}
            </BaseButton>
        </div>
        
        <div v-if="projects[activeCategory] && projects[activeCategory].length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div v-for="project in projects[activeCategory]" :key="project.id" class="bg-light-gray rounded-lg overflow-hidden flex flex-col md:flex-row items-center p-6 gap-6">
                <img :src="project.image" :alt="project.title" class="w-full md:w-1/2 h-auto object-cover rounded-md aspect-[5/4]">
                <div class="flex flex-col justify-center items-center md:items-start p-0 md:p-4 text-center md:text-left">
                    <h3 class="font-semibold text-panda-black text-h4-panda mb-2">{{ project.title }}</h3>
                    <p class="text-body-panda text-dark-gray mb-4">{{ project.description }}</p>
                    <BaseButton :to="project.link" variant="fill-black">Смотреть</BaseButton>
                </div>
            </div>
        </div>
        <div v-else class="text-center py-10 text-dark-gray text-xl">
          Примеров для этой категории пока нет.
        </div>
    </div>
  </main>
</template>