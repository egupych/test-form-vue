// src/firebase.js

// Импортируем необходимые функции из пакета Firebase
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Конфигурация вашего Firebase проекта.
// Vite автоматически подставит сюда значения из вашего .env файла.
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Инициализируем приложение Firebase с нашей конфигурацией.
// Это "точка входа" для взаимодействия с сервисами Firebase.
const app = initializeApp(firebaseConfig);

// Получаем доступ к базе данных Firestore.
// Мы будем использовать эту переменную `db` в других компонентах для запроса данных.
const db = getFirestore(app);

// Экспортируем `db`, чтобы его можно было импортировать в любом компоненте.
export { db };
