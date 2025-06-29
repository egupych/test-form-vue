<script setup>
import { ref, onMounted } from 'vue';
import { collection, getDocs } from 'firebase/firestore';
// --- ИЗМЕНЕНИЕ: Исправляем путь к firebase.js ---
import { db } from '../../firebase.js';

const newsList = ref([]);
const isLoading = ref(true);
const error = ref(null);

onMounted(async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "news"));
    const firestoreNews = [];
    querySnapshot.forEach((doc) => {
      firestoreNews.push({ id: doc.id, ...doc.data() });
    });
    newsList.value = firestoreNews;
  } catch (e) {
    console.error("Ошибка при загрузке новостей: ", e);
    error.value = "Не удалось загрузить новости. Попробуйте позже.";
  } finally {
    isLoading.value = false;
  }
});
</script>

<template>
  <main>
    <div class="main-container">
      <h1 class="font-bold text-panda-black text-4xl mb-4">Новости</h1>
      <p class="text-xl text-dark-gray leading-relaxed mb-6">Будьте в курсе последних событий и достижений нашей компании.</p>
      
      <div v-if="isLoading" class="text-center py-10">
        <p class="text-lg text-dark-gray">Загрузка новостей...</p>
      </div>

      <div v-else-if="error" class="text-center py-10 bg-red-100 text-red-700 p-4 rounded-lg">
        <p>{{ error }}</p>
      </div>
      
      <div v-else-if="newsList.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div v-for="newsItem in newsList" :key="newsItem.id" class="bg-light-gray rounded-lg overflow-hidden">
          <img 
            :src="newsItem.imageUrl" 
            :alt="newsItem.title" 
            class="w-full h-auto object-cover rounded-t-lg aspect-[16/9]"
            onerror="this.onerror=null;this.src='https://placehold.co/600x350/F7F7F7/131C26?text=Image+not+found';"
          >
          <div class="p-4">
            <p class="text-sm text-dark-gray mb-1">{{ newsItem.date }}</p>
            <h3 class="font-semibold text-panda-black text-xl mb-2">{{ newsItem.title }}</h3>
            <p class="text-md text-dark-gray">{{ newsItem.description }}</p>
          </div>
        </div>
      </div>

      <div v-else class="text-center py-10">
        <p class="text-lg text-dark-gray">Новостей пока нет.</p>
      </div>
    </div>
    
  </main>
</template>