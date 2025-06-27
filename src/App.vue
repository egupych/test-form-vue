<script setup>
// Вся логика для навигации теперь находится в vue-router,
// поэтому <script setup> остается почти пустым.
// Это делает главный компонент очень чистым и простым.
</script>

<template>
  <div class="site-container">
    <header class="site-header">
      <!-- 
        Используем <router-link> для навигации.
        Атрибут `to` указывает путь, куда ведет ссылка.
      -->
      <router-link to="/" class="cursor-pointer">
        <img src="/src/images/red-panda-logo-black.svg" alt="Логотип Red Panda" class="h-10">
      </router-link>
      <nav>
        <ul class="flex items-center space-x-8">
          <li>
            <!-- 
              vue-router автоматически добавит класс 'router-link-active'
              к активной ссылке. Мы можем использовать это для стилизации.
              Наш старый класс 'nav-active' больше не нужен, но я оставил его
              в CSS для обратной совместимости, если вы захотите его использовать.
            -->
            <router-link to="/" class="nav-link">Главная</router-link>
          </li>
          <li class="relative dropdown">
            <!-- 
              Для выпадающего меню мы не используем <router-link>,
              так как сам заголовок "О нас" никуда не ведет.
            -->
            <div class="nav-link flex items-center cursor-default">
              О нас
              <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
            </div>
            <ul class="dropdown-menu">
              <!-- Ссылки внутри выпадающего меню -->
              <li><router-link to="/team" class="dropdown-item">Команда</router-link></li>
              <li><router-link to="/news" class="dropdown-item">Новости</router-link></li>
              <li><router-link to="/vacancies" class="dropdown-item">Вакансии</router-link></li>
              <li><router-link to="/equipment" class="dropdown-item">Оборудование</router-link></li>
            </ul>
          </li>
          <li><router-link to="/gallery" class="nav-link">Наши работы</router-link></li>
          <li><router-link to="/promotions" class="nav-link">Акции</router-link></li>
          <li><router-link to="/shop" class="nav-link">Магазин</router-link></li>
          <li><router-link to="/preparation" class="nav-link">Подготовка к печати</router-link></li>
        </ul>
      </nav>
    </header>

    <main>
      <!-- 
        Это "окно", в которое vue-router будет подставлять нужный компонент
        в зависимости от текущего URL в браузере.
      -->
      <router-view></router-view>
    </main>
  </div>
</template>

<style>
/* Добавляем стили для активной ссылки.
  vue-router автоматически добавляет эти классы.
  Вы можете настроить их в файле router/index.js при необходимости.
*/
.router-link-exact-active {
  color: #F15F31; /* nav-active color */
  font-weight: 600; /* делаем активную ссылку жирнее */
}

/* Стили для выпадающего меню.
  Они остаются такими же, как и были.
*/
.dropdown:hover .dropdown-menu {
  display: block;
}
.dropdown-menu {
  display: none;
  position: absolute;
  background-color: white;
  min-width: 160px;
  box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
  z-index: 1;
  border-radius: 8px;
  padding-top: 8px;
  padding-bottom: 8px;
}
.dropdown-item {
  color: black;
  padding: 12px 16px;
  text-decoration: none;
  display: block;
  text-align: left;
  width: 100%;
  background: none;
  border: none;
  cursor: pointer;
}
.dropdown-item:hover {
  background-color: #f1f1f1;
}
</style>
