<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import BaseButton from '@/components/ui/BaseButton.vue';
import SectionHeader from '@/components/ui/SectionHeader.vue';
import ImageGrid from '@/components/ui/ImageGrid.vue'; // <-- ИМПОРТ

// Данные о проектах (пока что только для одной категории)
const projects = {
  catalogsAlbums: [
    {
      id: 1,
      title: 'Каталог «Лудэ-Каз»',
      description: 'Каталог в фирменных цветах с нотками современного искусства.',
      url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500',
      alt: 'Каталог «Лудэ-Каз»'
    },
    {
      id: 2,
      title: 'Каталог «Мир охоты»',
      description: 'Музейный фонд охотничьего центра г. Костанай.',
      url: 'https://images.unsplash.com/photo-1589998059171-988d887df646?w=500&h=700',
      alt: 'Каталог «Мир охоты»'
    },
    {
      id: 3,
      title: 'Проект 3',
      description: 'Описание проекта 3',
      url: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=500&h=600',
      alt: 'Проект 3'
    }
  ]
};

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

const currentProjects = computed(() => {
    return projects[activeCategory.value] || [];
});

const router = useRouter();
const handleImageClick = (image) => {
    // Здесь может быть логика перехода на детальную страницу проекта
    // router.push(`/project/${image.id}`);
    console.log('Image clicked:', image);
};

</script>

<template>
  <main class="py-10 md:py-25">
    <div class="max-w-6xl mx-auto">
        
        <SectionHeader class="gap-container">
          Наши работы
        </SectionHeader>
       
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
        
        <div v-if="currentProjects.length > 0">
             <ImageGrid :images="currentProjects" @image-click="handleImageClick" />
        </div>
        <div v-else class="text-center py-10 text-dark-gray text-xl">
          Примеров для этой категории пока нет.
        </div>
    </div>
  </main>
</template>