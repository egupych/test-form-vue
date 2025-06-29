import { createApp } from 'vue';
import App from './App.vue';
import router from './router'; 
import './assets/styles/main.css'; // <--- ИЗМЕНЕНИЕ: Путь к CSS файлу обновлен

const app = createApp(App);

app.use(router);

app.mount('#app');