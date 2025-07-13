<script setup>
  import { computed, ref } from 'vue';
  import { useServicesStore } from '@/stores/services';
  import { useServiceImages } from '@/composables/useServiceImages';
  import SectionHeader from '@/components/ui/SectionHeader.vue';
  import BaseButton from '@/components/ui/BaseButton.vue';
  import ImageGrid from '@/components/ui/ImageGrid.vue';
  import ImageViewer from '@/components/ui/ImageViewer.vue'; // 1. Импортируем новый компонент
  
  const props = defineProps({
    slug: {
      type: String,
      required: true,
    },
  });
  
  const store = useServicesStore();
  const service = computed(() => store.findById(props.slug));
  const { imagePaths } = useServiceImages(props.slug);

  const imagesForGrid = computed(() => {
      return imagePaths.value.map(path => ({ url: path }));
  });
  
  // 2. Логика для управления новым компонентом просмотра
  const isViewerOpen = ref(false);
  const viewerStartIndex = ref(0);
  
  const openViewer = ({ index }) => {
    viewerStartIndex.value = index;
    isViewerOpen.value = true;
  };
  
  const closeViewer = () => {
    isViewerOpen.value = false;
  };
</script>

<template>
    <main class="py-10 md:py-25">
      <div class="max-w-6xl mx-auto">
        
        <section v-if="service">
          <SectionHeader class="gap-container">
            {{ service.title }}
          </SectionHeader>
  
          <p class="text-h5-panda text-dark-gray leading-relaxed text-center max-w-2xl mx-auto mb-10 md:mb-15">
            {{ service.description }}
          </p>
          
          <div class="service-gallery">
            <div v-if="imagesForGrid.length > 0">
              <ImageGrid :images="imagesForGrid" @image-click="openViewer" />
            </div>
            <div v-else class="gallery-placeholder">
              <p>Для этой услуги пока нет примеров работ. Но скоро они здесь появятся!</p>
            </div>
          </div>
        </section>
  
        <div v-else class="service-not-found">
          <SectionHeader>Ошибка</SectionHeader>
          <h1 class="text-h3-panda font-semibold text-panda-black mt-10">Услуга не найдена</h1>
          <p class="text-body-panda text-dark-gray mt-2 mb-8">К сожалению, мы не смогли найти информацию по вашему запросу.</p>
          <BaseButton to="/">Вернуться на главную</BaseButton>
        </div>
      </div>
    </main>
  
    <ImageViewer
      v-if="isViewerOpen"
      :images="imagesForGrid"
      :start-index="viewerStartIndex"
      @close="closeViewer"
    />
</template>

<style scoped>
/* Удаляем стили для старого попапа, так как они теперь в ImageViewer.vue */
.service-not-found { text-align: center; padding: 4rem 2rem; }
.gallery-placeholder { text-align: center; padding: 4rem; background-color: #f7f7f7; color: #8F8F8F; font-size: 1.1rem; }
</style>