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
      <div v-if="showForecast && processedForecast" class="dropdown-menu">
        <div 
          v-for="(day, index) in processedForecast" 
          :key="day.date" 
          class="forecast-item-wrapper"
          :class="{'expanded': expandedIndex === index}"
        >
          <div 
            class="forecast-day"
            :class="{'next-week-text': day.isNextWeek}"
            @click="toggleDetails(index)"
          >
            <div class="day-info">
              <span class="day-of-week">{{ day.dayOfWeek }}</span>
              <span class="day-number">{{ day.dayNumber }}</span>
            </div>
            <div class="temp-and-icon">
              <img :src="day.icon" alt="Иконка погоды" class="forecast-icon">
              <span class="max-temp">{{ day.maxTemp }}</span>
            </div>
          </div>
          
          <transition name="expand">
            <div v-if="expandedIndex === index" class="detailed-forecast">
              <div v-for="period in day.details" :key="period.name" class="time-period">
                <span class="period-name">{{ period.name }}</span>
                <img :src="period.icon" alt="Иконка погоды" class="period-icon">
                <span class="period-temp">{{ period.temp }}</span>
              </div>
            </div>
          </transition>

        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';

const weather = ref(null);
const error = ref(null);
const showForecast = ref(false);
const expandedIndex = ref(null);

const toggleDetails = (index) => {
  if (expandedIndex.value === index) {
    expandedIndex.value = null;
  } else {
    expandedIndex.value = index;
  }
};

const getModeWeatherCode = (codes) => {
  if (!codes || codes.length === 0) return 3;
  const counts = codes.reduce((acc, code) => {
    acc[code] = (acc[code] || 0) + 1;
    return acc;
  }, {});
  return +Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);
};

const processedForecast = computed(() => {
  if (!weather.value || !weather.value.daily || !weather.value.hourly) return null;

  const daily = weather.value.daily;
  const hourly = weather.value.hourly;

  return daily.time.slice(0, 7).map((date, index) => {
    const forecastDate = new Date(date);
    let dayText;
    let dayNum = forecastDate.getDate();

    if (index === 0) {
      dayText = 'Сегодня';
      dayNum = '';
    } else if (index === 1) {
      dayText = 'Завтра';
      dayNum = '';
    } else {
      dayText = forecastDate.toLocaleDateString('ru-RU', { weekday: 'short' });
    }
    
    const startIndex = index * 24;
    const hourlyTemps = hourly.temperature_2m.slice(startIndex, startIndex + 24);
    const hourlyCodes = hourly.weathercode.slice(startIndex, startIndex + 24);

    const details = [
      { name: 'Утро', start: 6, end: 12 },
      { name: 'День', start: 12, end: 18 },
      { name: 'Вечер', start: 18, end: 24 },
      { name: 'Ночь', start: 0, end: 6 },
    ].map(period => {
      const tempsInPeriod = hourlyTemps.slice(period.start, period.end);
      const codesInPeriod = hourlyCodes.slice(period.start, period.end);
      
      const avgTemp = Math.round(tempsInPeriod.reduce((a, b) => a + b, 0) / tempsInPeriod.length);
      const modeCode = getModeWeatherCode(codesInPeriod);

      return {
        name: period.name,
        temp: `${avgTemp}°`,
        icon: getWeatherIcon(modeCode)
      };
    });

    return {
      date: date,
      dayOfWeek: dayText,
      dayNumber: dayNum,
      icon: getWeatherIcon(daily.weathercode[index]),
      maxTemp: `${Math.round(daily.temperature_2m_max[index])}°`,
      isNextWeek: isNextWeek(date),
      details: details
    };
  });
});

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
      const response = await fetch('https://api.open-meteo.com/v1/forecast?latitude=51.18&longitude=71.45&current_weather=true&daily=weathercode,temperature_2m_max,temperature_2m_min&hourly=temperature_2m,weathercode&timezone=Asia/Almaty');
      if (!response.ok) throw new Error('Ошибка сети');
      weather.value = await response.json();
    } catch (e) {
      error.value = e.message;
      console.error("Не удалось получить данные о погоде:", e);
    }
  });
</script>

<style scoped>
  /* Общие стили виджета без изменений */
  .weather-widget { position: relative; }
  .widget-body { border: 1px solid #E3E3E3; padding: 4px 12px; border-radius: 9999px; background-color: white; }
  .nav-item { font-family: 'Gilroy-SemiBold', sans-serif; color: #131C26; cursor: pointer; display: flex; align-items: center; font-size: 16px; transition: color 0.2s ease-in-out; }
  .temperature { padding-left: 8px; padding-right: 2px; }
  .weather-icon-wrapper { width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; }
  .weather-icon { width: 100%; height: 100%; }
  
  /* Стили выпадающего меню */
  .dropdown-menu { 
    display: block; 
    position: absolute; 
    top: 100%; 
    left: 50%; 
    transform: translateX(-50%) translateY(0); 
    margin-top: 22px; 
    background-color:#F7F7F7; 
    min-width: 260px; 
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1); 
    z-index: 20; 
    border-radius: 8px; 
    /* ИЗМЕНЕНИЕ: Убираем горизонтальные отступы, оставляем только вертикальные */
    padding: 8px 0; 
  }
  .dropdown-menu::before { content: ''; position: absolute; top: -10px; left: 50%; transform: translateX(-50%); width: 0; height: 0; border-style: solid; border-width: 0 10px 10px 10px; border-color: transparent transparent #F7F7F7 transparent; filter: drop-shadow(0 -2px 2px rgba(0, 0, 0, 0.03)); }

  /* Стили для обертки и линии */
  .forecast-item-wrapper {
    position: relative;
    /* Убрали padding-bottom, теперь линия сама создает отступ */
  }
  
  .forecast-item-wrapper::after {
    content: '';
    position: absolute;
    bottom: -2px; /* Располагаем под элементом */
    /* ИЗМЕНЕНИЕ: Растягиваем на всю ширину */
    left: 0;
    right: 0;
    height: 2px;
    background-color: #F15F31;
    transform: scaleX(0);
    transition: transform 0.3s ease-out;
  }
  
  .forecast-item-wrapper:hover::after,
  .forecast-item-wrapper.expanded::after {
    transform: scaleX(1);
  }

  .forecast-day {
    display: grid;
    grid-template-columns: 1fr auto; 
    gap: 16px;
    align-items: center;
    /* ИЗМЕНЕНИЕ: Добавляем горизонтальные отступы сюда */
    padding: 10px 16px;
    cursor: pointer;
    position: relative;
    z-index: 2;
    font-family: 'Gilroy-SemiBold', sans-serif;
    font-size: 16px;
    color: #131C26;
    transition: background-color 0.2s ease;
  }
  
  /* Заливка теперь будет на всю ширину */
  .forecast-day:hover {
    background-color: #FFFFFF;
  }
  .forecast-item-wrapper.expanded .forecast-day {
     background-color: #FFFFFF;
  }

  .day-info { display: flex; align-items: baseline; gap: 8px; }
  .day-of-week { text-transform: capitalize; }
  
  .temp-and-icon { display: flex; align-items: center; gap: 12px; justify-content: flex-end; }
  .forecast-icon { width: 36px; height: 36px; }

  /* Стили для блока детализации */
  .detailed-forecast {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 8px;
    /* ИЗМЕНЕНИЕ: Добавляем горизонтальные отступы и сюда */
    padding: 8px 16px 12px;
    background-color: #FFFFFF; /* Фон как у ховера */
    position: relative;
    z-index: 1;
    overflow: hidden;
  }
  .time-period {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    font-family: 'Gilroy-Medium', sans-serif;
  }
  .period-name { font-size: 13px; color: #555; }
  .period-icon { width: 32px; height: 32px; }
  .period-temp { font-family: 'Gilroy-SemiBold', sans-serif; font-size: 15px; }

  /* Анимация раскрытия */
  .expand-enter-active { transition: all 0.3s ease-out; }
  .expand-leave-active { transition: all 0.25s ease-in; }
  .expand-enter-from,
  .expand-leave-to {
    opacity: 0;
    transform: translateY(-10px);
    max-height: 0;
    padding-top: 0;
    padding-bottom: 0;
    margin-top: 0;
  }
  .expand-enter-to,
  .expand-leave-from {
    max-height: 100px;
  }

  /* Остальные стили */
  .slide-down-enter-active, .slide-down-leave-active { transition: opacity 0.2s ease-out, transform 0.2s ease-out; }
  .slide-down-enter-from, .slide-down-leave-to { opacity: 0; transform: translateX(-50%) translateY(-10px); }
  .forecast-day.next-week-text { color: #8F8F8F; }
  .forecast-day.next-week-text .forecast-icon { filter: grayscale(100%); opacity: 0.8; }
</style>