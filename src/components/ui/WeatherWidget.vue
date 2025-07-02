<template>
    <div class="weather-widget dropdown" @mouseenter="showForecast = true" @mouseleave="showForecast = false">
      <div class="widget-body">
          <div v-if="weather" class="nav-item">
              <span class="temperature">{{ Math.round(weather.current_weather.temperature) }}°C</span>
              <div class="weather-icon-wrapper">
                <img :src="getWeatherIcon(weather.current_weather.weathercode)" alt="Иконка погоды" class="weather-icon">
              </div>
          </div>
          <div v-else-if="error" class="nav-item">Ошибка</div>
          <div v-else class="nav-item">...</div>
      </div>
  
      <transition name="slide-down">
          <div v-if="showForecast && weather" class="dropdown-menu">
             <div 
                v-for="(day, index) in weather.daily.time.slice(0, 7)" 
                :key="index" 
                class="forecast-day" 
                :class="{'next-week-text': isNextWeek(day)}"
                :style="{'--bg-icon': `url(${getWeatherIcon(weather.daily.weathercode[index])})`}"
              >
                <span class="day-info">
                  <span class="day-of-week">{{ new Date(day).toLocaleDateString('ru-RU', { weekday: 'short' }) }}</span>
                  <span class="day-number">{{ new Date(day).getDate() }}</span>
                </span>
                <img :src="getWeatherIcon(weather.daily.weathercode[index])" alt="Иконка погоды" class="forecast-icon">
                <span class="forecast-temp">
                  <span class="max-temp">{{ Math.round(weather.daily.temperature_2m_max[index]) }}</span>
                  <span class="min-temp">{{ Math.round(weather.daily.temperature_2m_min[index]) }}</span>
                </span>
              </div>
          </div>
      </transition>
    </div>
</template>
  
<script setup>
  import { ref, onMounted } from 'vue';
  
  const weather = ref(null);
  const error = ref(null);
  const showForecast = ref(false);
  
  const isNextWeek = (dateString) => {
    const forecastDate = new Date(dateString);
    forecastDate.setHours(0, 0, 0, 0);

    const now = new Date();
    now.setHours(0, 0, 0, 0);

    const dayOfWeek = now.getDay();
    const daysUntilSunday = (dayOfWeek === 0) ? 0 : 7 - dayOfWeek;

    const endOfWeek = new Date(now);
    endOfWeek.setDate(now.getDate() + daysUntilSunday);

    return forecastDate > endOfWeek;
  };
  
  const getWeatherIcon = (code) => {
    const base_url = 'https://www.amcharts.com/wp-content/themes/amcharts4/css/img/icons/weather/animated/';
    const icons = {
      clear: `${base_url}day.svg`,
      partlyCloudy: `${base_url}cloudy-day-1.svg`,
      cloudy: `${base_url}cloudy.svg`,
      rain: `${base_url}rainy-6.svg`,
      snow: `${base_url}snowy-6.svg`,
      thunder: `${base_url}thunder.svg`,
    };
  
    if ([0].includes(code)) return icons.clear;
    if ([1, 2].includes(code)) return icons.partlyCloudy;
    if ([3, 45, 48].includes(code)) return icons.cloudy;
    if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code)) return icons.rain;
    if ([71, 73, 75, 85, 86].includes(code)) return icons.snow;
    if ([95, 96, 99].includes(code)) return icons.thunder;
  
    return icons.cloudy;
  };
  
  onMounted(async () => {
    try {
      const response = await fetch('https://api.open-meteo.com/v1/forecast?latitude=51.18&longitude=71.45&current_weather=true&daily=weathercode,temperature_2m_max,temperature_2m_min&timezone=Asia/Almaty');
      if (!response.ok) throw new Error('Ошибка сети');
      weather.value = await response.json();
    } catch (e) {
      error.value = e.message;
      console.error("Не удалось получить данные о погоде:", e);
    }
  });
</script>
  
<style scoped>
  .weather-widget {
    position: relative;
  }
  
  .widget-body {
    border: 1px solid #E3E3E3;
    padding: 4px 12px;
    border-radius: 9999px;
    background-color: white;
  }
  
  .nav-item {
    font-family: 'Gilroy-SemiBold', sans-serif;
    color: #131C26;
    cursor: pointer;
    display: flex;
    align-items: center;
    font-size: 16px;
    transition: color 0.2s ease-in-out;
  }
  
  .weather-widget:hover .nav-item {
    color: #F15F31;
  }
  
  .temperature {
      padding-left: 8px;
      padding-right: 2px;
  }
  
  .weather-icon-wrapper {
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .weather-icon {
    width: 100%;
    height: 100%;
  }
  
  .dropdown-menu {
    display: block;
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%) translateY(0);
    margin-top: 22px;
    background-color:#F7F7F7;
    min-width: 240px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
    z-index: 20;
    border-radius: 8px;
    padding: 8px;
  }
  .dropdown-menu::before {
    content: '';
    position: absolute;
    top: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 0;
    border-style: solid;
    border-width: 0 10px 10px 10px;
    border-color: transparent transparent #F7F7F7 transparent;
    filter: drop-shadow(0 -2px 2px rgba(0, 0, 0, 0.03));
  }
  
  .forecast-day {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    gap: 8px;
    align-items: center;
    padding: 8px;
    border-radius: 6px;
    transition: background-color 0.2s ease;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    z-index: 1;
  }

  .forecast-day > * {
    position: relative;
    z-index: 2;
  }
  
  .forecast-day:hover {
    background-color: #F7F7F7;
  }
  
  .day-info {
    display: flex;
    align-items: baseline;
    gap: 4px;
  }
  
  .day-of-week {
    text-transform: capitalize;
    font-family: 'Gilroy-SemiBold', sans-serif;
    font-size: 15px;
  }
  
  .day-number {
    font-size: 14px;
    color: #131C26;
  }
  
  .forecast-icon {
    width: 40px;
    height: 40px;
    justify-self: center;
  }

  .forecast-temp {
    font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace;
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }
  .max-temp {
    font-size: 16px;
    font-weight: 600;
    color: #131C26;
  }
  .min-temp {
    font-size: 15px;
    color: #8F8F8F;
    margin-left: 8px;
  }
  
  .slide-down-enter-active,
  .slide-down-leave-active {
    transition: opacity 0.2s ease-out, transform 0.2s ease-out;
  }
  
  .slide-down-enter-from,
  .slide-down-leave-to {
    opacity: 0;
    transform: translateX(-50%) translateY(-10px);
  }

  .forecast-day.next-week-text .day-of-week,
  .forecast-day.next-week-text .day-number,
  .forecast-day.next-week-text .max-temp {
    color: #8F8F8F;
  }

  .forecast-day.next-week-text .forecast-icon {
    filter: grayscale(100%);
    opacity: 0.8;
  }

  /* ДОБАВЛЕНО: Новый стиль для фоновой иконки */
  .forecast-day::before {
    content: '';
    position: absolute;
    top: -10%; /* Немного выходим за границы для лучшего вида */
    left: -10%;
    width: 120%;
    height: 120%;
    z-index: 1; /* Под контентом */

    /* Используем переменную, которую задали в :style */
    background-image: var(--bg-icon); 
    background-repeat: no-repeat;
    background-position: center;
    background-size: contain;

    /* Начальное состояние (скрыто) */
    opacity: 0;
    transform: scale(0.8);
    transition: opacity 0.3s ease-out, transform 0.3s ease-out;
  }
  
  /* При наведении на строку, показываем иконку */
  .forecast-day:hover::before {
    opacity: 0.07; /* Очень низкая прозрачность для тонкого эффекта */
    transform: scale(3);
    filter: grayscale(100%);
  }

  /* Для серых дней делаем иконку тоже серой */
  .forecast-day.next-week-text::before {
    filter: grayscale(100%);
  }

</style>