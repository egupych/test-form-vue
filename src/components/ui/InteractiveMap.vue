<template>
  <div id="map" style="width: 100%; height: 31.25rem"></div>
</template>

<script setup>
import { onMounted } from 'vue';

onMounted(() => {
  // Проверяем, загрузился ли DG API
  if (window.DG) {
    // Инициализируем карту после загрузки API
    window.DG.then(function () {
      // Координаты из вашей ссылки
      const lat = 51.148757;
      const lon = 71.384275;

      // Создаем карту
      const map = window.DG.map('map', {
        center: [lat, lon],
        zoom: 16,
      });

      // Добавляем маркер на карту
      const marker = window.DG.marker([lat, lon]).addTo(map);

      // Добавляем всплывающее окно (popup) к маркеру
      marker.bindPopup(
        '<b>Название вашей компании</b><br>Дополнительная информация здесь.'
      );

      // Кнопки +/- и перемещение мышью включены по умолчанию
    });
  } else {
    console.error('2GIS API не загружено.');
  }
});
</script>

<style scoped>
#map {
  border-radius: 0.5rem;
}
</style>
