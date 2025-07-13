// ---> src/stores/gallery.js

import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useGalleryStore = defineStore('gallery', () => {
  const items = ref({});
  const loading = ref(true);

  const loadGalleryItems = async () => {
    loading.value = true;
    
    // Структура полностью соответствует твоим папкам.
    const imageCategories = {
      bannery: import.meta.glob('@/assets/images/services/bannery/*.{jpg,jpeg,png,svg,webp}'),
      bejdzhi: import.meta.glob('@/assets/images/services/bejdzhi/*.{jpg,jpeg,png,svg,webp}'),
      bilety: import.meta.glob('@/assets/images/services/bilety/*.{jpg,jpeg,png,svg,webp}'),
      birki: import.meta.glob('@/assets/images/services/birki/*.{jpg,jpeg,png,svg,webp}'),
      blanki: import.meta.glob('@/assets/images/services/blanki/*.{jpg,jpeg,png,svg,webp}'),
      bloknoty: import.meta.glob('@/assets/images/services/bloknoty/*.{jpg,jpeg,png,svg,webp}'),
      broshyury: import.meta.glob('@/assets/images/services/broshyury/*.{jpg,jpeg,png,svg,webp}'),
      buklety: import.meta.glob('@/assets/images/services/buklety/*.{jpg,jpeg,png,svg,webp}'),
      butilki: import.meta.glob('@/assets/images/services/butilki/*.{jpg,jpeg,png,svg,webp}'),
      diplomy: import.meta.glob('@/assets/images/services/diplomy/*.{jpg,jpeg,png,svg,webp}'),
      etiketki: import.meta.glob('@/assets/images/services/etiketki/*.{jpg,jpeg,png,svg,webp}'),
      flagi: import.meta.glob('@/assets/images/services/flagi/*.{jpg,jpeg,png,svg,webp}'),
      fotobuki: import.meta.glob('@/assets/images/services/fotobuki/*.{jpg,jpeg,png,svg,webp}'),
      kalendari: import.meta.glob('@/assets/images/services/kalendari/*.{jpg,jpeg,png,svg,webp}'),
      kartiny: import.meta.glob('@/assets/images/services/kartiny/*.{jpg,jpeg,png,svg,webp}'),
      katalogi: import.meta.glob('@/assets/images/services/katalogi/*.{jpg,jpeg,png,svg,webp}'),
      khengery: import.meta.glob('@/assets/images/services/khengery/*.{jpg,jpeg,png,svg,webp}'),
      knigi: import.meta.glob('@/assets/images/services/knigi/*.{jpg,jpeg,png,svg,webp}'),
      konverty: import.meta.glob('@/assets/images/services/konverty/*.{jpg,jpeg,png,svg,webp}'),
      korobki: import.meta.glob('@/assets/images/services/korobki/*.{jpg,jpeg,png,svg,webp}'),
      listovki: import.meta.glob('@/assets/images/services/listovki/*.{jpg,jpeg,png,svg,webp}'),
      medali: import.meta.glob('@/assets/images/services/medali/*.{jpg,jpeg,png,svg,webp}'),
      menyu: import.meta.glob('@/assets/images/services/menyu/*.{jpg,jpeg,png,svg,webp}'),
      merch: import.meta.glob('@/assets/images/services/merch/*.{jpg,jpeg,png,svg,webp}'),
      navigaciya: import.meta.glob('@/assets/images/services/navigaciya/*.{jpg,jpeg,png,svg,webp}'),
      nomerki: import.meta.glob('@/assets/images/services/nomerki/*.{jpg,jpeg,png,svg,webp}'),
      otkrytki: import.meta.glob('@/assets/images/services/otkrytki/*.{jpg,jpeg,png,svg,webp}'),
      pakety: import.meta.glob('@/assets/images/services/pakety/*.{jpg,jpeg,png,svg,webp}'),
      papki: import.meta.glob('@/assets/images/services/papki/*.{jpg,jpeg,png,svg,webp}'),
      pechati: import.meta.glob('@/assets/images/services/pechati/*.{jpg,jpeg,png,svg,webp}'),
      plakaty: import.meta.glob('@/assets/images/services/plakaty/*.{jpg,jpeg,png,svg,webp}'),
      prezentacii: import.meta.glob('@/assets/images/services/prezentacii/*.{jpg,jpeg,png,svg,webp}'),
    };

    const loadedItems = {};
    for (const categoryId in imageCategories) {
      const imageModules = imageCategories[categoryId];
      const categoryImages = [];
      let itemCounter = 1;

      for (const path in imageModules) {
        const imageUrlModule = await imageModules[path]();
        categoryImages.push({
          id: `${categoryId}-${itemCounter++}`,
          url: imageUrlModule.default,
          title: `Работа по категории «${categoryId}»`,
          category: categoryId,
        });
      }

      if (categoryImages.length > 0) {
        loadedItems[categoryId] = categoryImages;
      }
    }

    items.value = loadedItems;
    loading.value = false;
  };

  const getItemsByCategoryId = (categoryId) => {
    return items.value[categoryId] || [];
  };

  return { 
    items, 
    loading, 
    getItemsByCategoryId, 
    loadGalleryItems 
  };
});