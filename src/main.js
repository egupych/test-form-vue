import { createApp } from 'vue';
import App from './App.vue';
import router from './router'; // ИМПОРТИРУЕМ наш новый роутер
import './main.css';

const app = createApp(App);

app.use(router); // ПОДКЛЮЧАЕМ роутер к приложению

app.mount('#app');
