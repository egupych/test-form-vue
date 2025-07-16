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
          v-for="(day, dayIndex) in processedForecast" 
          :key="day.date" 
          class="forecast-item-wrapper"
          :class="{'expanded': expandedIndex === dayIndex}"
        >
          <div 
            class="forecast-day"
            :class="{'next-week-text': day.isNextWeek}"
            @click="toggleDetails(dayIndex)"
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
            <div v-if="expandedIndex === dayIndex" class="detailed-forecast">
              <div class="time-periods-grid">
                <div 
                  v-for="period in day.details" 
                  :key="period.name" 
                  class="time-period"
                  @click="toggleHourlyDetails(dayIndex, period.name)"
                >
                  <span class="period-name">{{ period.name }}</span>
                  <img :src="period.icon" alt="Иконка погоды" class="period-icon">
                  <span class="period-temp">{{ period.temp }}</span>
                </div>
              </div>

              <transition name="expand-hourly">
                <div v-if="activePeriod.dayIndex === dayIndex && activePeriod.periodName" class="hourly-forecast">
                  <div 
                    v-for="hour in getActivePeriodHours(dayIndex)" 
                    :key="hour.time" 
                    class="hour-item"
                    :class="{ 'active-hour': hour.isActive }"
                  >
                    <span class="hour-time">{{ hour.time }}</span>
                    <img :src="hour.icon" :alt="hour.time" class="hour-icon">
                    <span class="hour-temp">{{ hour.temp }}</span>
                  </div>
                </div>
              </transition>
            </div>
          </transition>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';

const weather = ref(null);
const error = ref(null);
const showForecast = ref(false);
const expandedIndex = ref(0);
const activePeriod = ref({ dayIndex: 0, periodName: 'День' }); // Открываем "День" для "Сегодня" по умолчанию
let weatherInterval = null;

const fetchWeather = async () => {
  try {
    const response = await fetch('https://api.open-meteo.com/v1/forecast?latitude=51.18&longitude=71.45&current_weather=true&daily=weathercode,temperature_2m_max&hourly=temperature_2m,weathercode&timezone=Asia/Almaty');
    if (!response.ok) throw new Error('Ошибка сети');
    weather.value = await response.json();
  } catch (e) {
    error.value = e.message;
    console.error("Не удалось получить данные о погоде:", e);
  }
};

const toggleDetails = (index) => {
  if (expandedIndex.value === index) {
    expandedIndex.value = null;
  } else {
    expandedIndex.value = index;
    // При открытии нового дня по умолчанию показываем "День" или ничего
    activePeriod.value = { dayIndex: index, periodName: 'День' }; 
  }
};

const toggleHourlyDetails = (dayIndex, periodName) => {
  if (isActivePeriod(dayIndex, periodName)) {
    activePeriod.value = { dayIndex, periodName: null }; // Закрываем
  } else {
    activePeriod.value = { dayIndex, periodName }; // Открываем
  }
};

const isActivePeriod = (dayIndex, periodName) => {
  return activePeriod.value.dayIndex === dayIndex && activePeriod.value.periodName === periodName;
};

// НОВАЯ ФУНКЦИЯ: Получение почасовых данных для активного периода
const getActivePeriodHours = (dayIndex) => {
  const periodName = activePeriod.value.periodName;
  if (!periodName || !processedForecast.value) return [];
  const day = processedForecast.value[dayIndex];
  const period = day.details.find(p => p.name === periodName);
  return period ? period.hourly : [];
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
  const currentTemp = Math.round(weather.value.current_weather.temperature);
  const currentHour = new Date(weather.value.current_weather.time).getHours();

  return daily.time.slice(0, 5).map((date, index) => {
    const forecastDate = new Date(date);
    let dayText;
    let dayNum = forecastDate.getDate();
    let maxTemp;

    if (index === 0) {
      dayText = 'Сегодня';
      dayNum = '';
      maxTemp = `${currentTemp}°`; 
    } else {
      dayText = (index === 1) ? 'Завтра' : forecastDate.toLocaleDateString('ru-RU', { weekday: 'short' });
      dayNum = (index === 1) ? '' : forecastDate.getDate();
      maxTemp = `${Math.round(daily.temperature_2m_max[index])}°`;
    }
    
    const startIndex = index * 24;
    const hourlyTimes = hourly.time.slice(startIndex, startIndex + 24);
    const hourlyTemps = hourly.temperature_2m.slice(startIndex, startIndex + 24);
    const hourlyCodes = hourly.weathercode.slice(startIndex, startIndex + 24);

    const details = [
      { name: 'Утро', start: 6, end: 12 },
      { name: 'День', start: 12, end: 18 },
      { name: 'Вечер', start: 18, end: 24 },
      { name: 'Ночь', start: 0, end: 6 },
    ].map(period => {
      const timesInPeriod = hourlyTimes.slice(period.start, period.end);
      const tempsInPeriod = hourlyTemps.slice(period.start, period.end);
      const codesInPeriod = hourlyCodes.slice(period.start, period.end);
      
      const avgTemp = tempsInPeriod.length > 0 ? Math.round(tempsInPeriod.reduce((a, b) => a + b, 0) / tempsInPeriod.length) : 0;
      const modeCode = getModeWeatherCode(codesInPeriod);
      
      const hourlyDetails = timesInPeriod.map((t, i) => {
        const hour = new Date(t).getHours();
        return {
          time: new Date(t).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
          temp: `${Math.round(tempsInPeriod[i])}°`,
          icon: getWeatherIcon(codesInPeriod[i]),
          // Добавляем флаг для активного часа только для "Сегодня"
          isActive: index === 0 && hour === currentHour,
        };
      });

      return { 
        name: period.name, 
        temp: `${avgTemp}°`, 
        icon: getWeatherIcon(modeCode),
        hourly: hourlyDetails
      };
    });

    return {
      date: date,
      dayOfWeek: dayText,
      dayNumber: dayNum,
      icon: getWeatherIcon(daily.weathercode[index]),
      maxTemp: maxTemp,
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
  await fetchWeather();
  weatherInterval = setInterval(fetchWeather, 600000);
});

onUnmounted(() => {
  clearInterval(weatherInterval);
});
</script>

<style scoped>
  .weather-widget { position: relative; }
  .widget-body { border: 0.0625rem solid #E3E3E3; padding: 0.25rem 0.75rem; border-radius: 9999px; background-color: white; }
  .nav-item { font-family: 'Gilroy-SemiBold', sans-serif; color: #131C26; cursor: pointer; display: flex; align-items: center; font-size: 1rem; transition: color 0.2s ease-in-out; }
  .temperature { padding-left: 0.5rem; padding-right: 0.125rem; }
  .weather-icon-wrapper { width: 2rem; height: 2rem; display: flex; align-items: center; justify-content: center; }
  .weather-icon { width: 100%; height: 100%; }
  
  .dropdown-menu { 
    display: block; position: absolute; top: 100%; left: 50%; transform: translateX(-50%) translateY(0); 
    margin-top: 1.375rem; background-color:#F7F7F7; min-width: 17.5rem;
    box-shadow: 0 0.625rem 1.5625rem rgba(0, 0, 0, 0.1); z-index: 20; border-radius: 0.5rem; padding: 0.5rem 0; 
  }
  .dropdown-menu::before { content: ''; position: absolute; top: -0.625rem; left: 50%; transform: translateX(-50%); width: 0; height: 0; border-style: solid; border-width: 0 0.625rem 0.625rem 0.625rem; border-color: transparent transparent #F7F7F7 transparent; filter: drop-shadow(0 -0.125rem 0.125rem rgba(0, 0, 0, 0.03)); }

  .forecast-item-wrapper { position: relative; }
  .forecast-item-wrapper::after { content: ''; position: absolute; bottom: -0.125rem; left: 0; right: 0; height: 0.125rem; background-color: #F15F31; transform: scaleX(0); transition: transform 0.3s ease-out; }
  .forecast-item-wrapper:hover::after,
  .forecast-item-wrapper.expanded::after { transform: scaleX(1); }

  .forecast-day { display: grid; grid-template-columns: 1fr auto; gap: 1rem; align-items: center; padding: 0.625rem 1rem; cursor: pointer; position: relative; z-index: 3; font-family: 'Gilroy-SemiBold', sans-serif; font-size: 1rem; color: #131C26; transition: background-color 0.2s ease; }
  .forecast-day:hover,
  .forecast-item-wrapper.expanded .forecast-day { background-color: #FFFFFF; }

  .day-info { display: flex; align-items: baseline; gap: 0.5rem; }
  .day-of-week { text-transform: capitalize; }
  .temp-and-icon { display: flex; align-items: center; gap: 0.75rem; justify-content: flex-end; }
  .forecast-icon { width: 2.25rem; height: 2.25rem; }

  /* --- ИЗМЕНЕНИЯ В СТИЛЯХ --- */
  .detailed-forecast { display: flex; flex-direction: column; gap: 0.5rem; padding: 0.5rem 0.75rem 0.75rem; background-color: #FFFFFF; position: relative; z-index: 2; }
  
  .time-periods-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 0.25rem; }
  .time-period { display: flex; flex-direction: column; align-items: center; gap: 0.25rem; padding: 0.25rem; border-radius: 0.25rem; cursor: pointer; transition: background-color 0.2s; }
  .time-period:hover { background-color: rgba(0,0,0,0.05); }
  .period-name { font-family: 'Gilroy-Medium', sans-serif; font-size: 0.8125rem; color: #555; }
  .period-icon { width: 2rem; height: 2rem; }
  .period-temp { font-family: 'Gilroy-SemiBold', sans-serif; font-size: 0.9375rem; }

  .hourly-forecast {
    background-color: rgba(0,0,0,0.02);
    padding: 0.5rem;
    border-radius: 0.375rem;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 0.5rem;
  }
  .hour-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.25rem;
    padding: 0.25rem;
    border-radius: 0.25rem;
    transition: background-color 0.2s;
  }
  .hour-time {
    font-family: 'Gilroy-Medium', sans-serif;
    font-size: 0.8125rem;
    color: #666;
  }
  .hour-icon {
    width: 1.75rem;
    height: 1.75rem;
  }
  .hour-temp {
    font-family: 'Gilroy-SemiBold', sans-serif;
    font-size: 0.875rem;
  }
  .hour-item.active-hour {
    background-color: rgba(241, 95, 49, 0.1); /* Легкий оранжевый фон */
    color: #F15F31;
  }
  .hour-item.active-hour .hour-time,
  .hour-item.active-hour .hour-temp {
    color: #D94D1A; /* Более темный оранжевый для текста */
  }
  
  /* --- Анимации --- */
  .expand-enter-active, .expand-leave-active { transition: all 0.3s ease-out; }
  .expand-enter-from, .expand-leave-to { opacity: 0; transform: translateY(-0.625rem); max-height: 0; padding-top: 0; padding-bottom: 0; }
  .expand-enter-to, .expand-leave-from { max-height: 31.25rem; }
  
  .expand-hourly-enter-active, .expand-hourly-leave-active { transition: all 0.3s ease-out; }
  .expand-hourly-enter-from, .expand-hourly-leave-to { opacity: 0; max-height: 0; padding: 0 0.5rem; margin-top: 0; }
  .expand-hourly-enter-to, .expand-hourly-leave-from { max-height: 18.75rem; }
  .detailed-forecast, .hourly-forecast { overflow: hidden; }

  .slide-down-enter-active, .slide-down-leave-active { transition: opacity 0.2s ease-out, transform 0.2s ease-out; }
  .slide-down-enter-from, .slide-down-leave-to { opacity: 0; transform: translateX(-50%) translateY(-0.625rem); }
  .forecast-day.next-week-text { color: #8F8F8F; }
  .forecast-day.next-week-text .forecast-icon { filter: grayscale(100%); opacity: 0.8; }
</style>