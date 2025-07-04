import { createApp } from 'vue';
import { createPinia } from 'pinia'; // [НОВОЕ] 1. Импортируем Pinia
import App from './App.vue';
import router from './router'; 
import './assets/styles/main.css';

const app = createApp(App);
const pinia = createPinia(); // [НОВОЕ] 2. Создаем экземпляр Pinia

app.use(router);
app.use(pinia); // [НОВОЕ] 3. Подключаем его к приложению

app.mount('#app');