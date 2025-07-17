// ---> src/main.js

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './assets/styles/main.css'
import i18n from './i18n';

// 1. Импортируем наш store
import { useGalleryStore } from './stores/gallery';

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

app.mount('#app')
app.use(i18n);

// 2. Запускаем загрузку изображений
useGalleryStore(pinia).loadGalleryItems();