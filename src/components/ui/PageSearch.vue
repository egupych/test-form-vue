<script setup>
import { ref, watch, computed } from 'vue';
import { RouterLink } from 'vue-router';
import { useGalleryStore } from '@/stores/gallery.js';

const galleryStore = useGalleryStore();

const allPortfolioItems = computed(() => {
  return Object.values(galleryStore.items).flat();
});

const searchQuery = ref('');
const searchResults = ref([]);
const hasSearched = ref(false);

watch(searchQuery, (newQuery) => {
  hasSearched.value = true;
  const cleanedQuery = newQuery.trim().toLowerCase();

  if (cleanedQuery.length < 2) {
    searchResults.value = [];
    return;
  }

  searchResults.value = allPortfolioItems.value.filter((item) =>
    item.title.toLowerCase().includes(cleanedQuery)
  );
});

const shouldShowResults = computed(() => {
  return searchQuery.value.length > 0;
});

const noResultsFound = computed(() => {
  return (
    hasSearched.value &&
    searchQuery.value.length >= 2 &&
    searchResults.value.length === 0
  );
});
</script>

<template>
  <div class="search-wrapper">
    <form @submit.prevent class="search-container">
      <div class="search-input-wrapper">
        <svg
          class="search-icon"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
        <input
          type="text"
          v-model="searchQuery"
          placeholder="Поиск в портфолио..."
          class="search-input"
          autocomplete="off"
        />
      </div>
      <button type="button" class="search-button">Найти</button>
    </form>

    <transition name="fade">
      <div v-if="shouldShowResults" class="search-results-container">
        <ul v-if="searchResults.length > 0" class="search-results-list">
          <li v-for="item in searchResults" :key="item.id">
            <RouterLink
              :to="{ path: '/gallery', hash: '#' + item.category }"
              class="result-item"
            >
              <span class="result-item__title">{{ item.title }}</span>
              <span class="result-item__category">{{ item.category }}</span>
            </RouterLink>
          </li>
        </ul>
        <p v-else-if="noResultsFound" class="no-results-message">
          Ничего не найдено по запросу «{{ searchQuery }}»
        </p>
      </div>
    </transition>
  </div>
</template>

<style scoped>
/* Стили для этого компонента остаются без изменений */
.search-wrapper {
  position: relative;
  max-width: 38.75rem;
  margin: 0 auto;
}
.search-container {
  display: flex;
  width: 100%;
  border-radius: 9999px;
  background-color: #ffffff;
  border: 0.0625rem solid #e3e3e3;
  transition: box-shadow 0.2s ease-in-out;
  position: relative;
}
.search-container:focus-within {
  box-shadow: 0 0.25rem 0.9375rem rgba(0, 0, 0, 0.05);
  border-color: #d1d1d1;
}
.search-input-wrapper {
  flex-grow: 1;
  display: flex;
  align-items: center;
}
.search-icon {
  margin: 0 0.75rem 0 1.25rem;
  color: #8f8f8f;
}
.search-input {
  width: 100%;
  border: none;
  background: transparent;
  padding: 1rem 0;
  font-size: 1rem;
  color: #131c26;
  outline: none;
  font-family: 'Gilroy-Medium', sans-serif;
}
.search-input::placeholder {
  color: #8f8f8f;
}
.search-button {
  font-family: 'Gilroy-SemiBold', sans-serif;
  font-size: 1rem;
  border: none;
  background-color: #131c26;
  color: white;
  padding: 0 2rem;
  border-radius: 0 9999px 9999px 0;
  cursor: pointer;
  transition: background-color 0.2s;
}
.search-button:hover {
  background-color: #f15f31;
}
.search-results-container {
  position: absolute;
  top: calc(100% - 1.75rem);
  left: 0;
  right: 0;
  background-color: #fff;
  border: 0.0625rem solid #e3e3e3;
  border-top: none;
  box-shadow: 0 0.9375rem 1.25rem rgba(0, 0, 0, 0.07);
  border-radius: 0 0 1.5rem 1.5rem;
  padding: 2.25rem 0.25rem 0.5rem 0.25rem;
  z-index: 9;
}
.search-results-list {
  list-style: none;
  padding: 0;
  margin: 0;
  max-height: 25rem;
  overflow-y: auto;
}
.result-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1.25rem;
  text-decoration: none;
  color: #131c26;
  border-radius: 1.25rem;
  transition: background-color 0.2s ease-in-out;
}
.result-item:hover {
  background-color: #f7f7f7;
  color: #f15f31;
}
.result-item__title {
  font-family: 'Gilroy-SemiBold', sans-serif;
}
.result-item__category {
  font-size: 0.875rem;
  color: #8f8f8f;
}
.no-results-message {
  padding: 1rem 1.5rem;
  text-align: center;
  color: #8f8f8f;
}
.fade-enter-active,
.fade-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-0.625rem);
}
</style>
