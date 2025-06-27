<script setup>
</script>

<template>
  <div class="site-container">
    <header class="site-header">
      <router-link to="/" class="cursor-pointer">
        <img src="/src/images/red-panda-logo-black.svg" alt="Логотип Red Panda" class="h-10">
      </router-link>
      <nav>
        <ul class="flex items-center space-x-8 text-header-panda font-semibold">
          <li><router-link to="/">Главная</router-link></li>
          <li class="relative dropdown">
            <div class="nav-item">
              О нас
              <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
            </div>
            <ul class="dropdown-menu">
              <li><router-link to="/team" class="dropdown-item">Команда</router-link></li>
              <li><router-link to="/news" class="dropdown-item">Новости</router-link></li>
              <li><router-link to="/vacancies" class="dropdown-item">Вакансии</router-link></li>
              <li><router-link to="/equipment" class="dropdown-item">Оборудование</router-link></li>
            </ul>
          </li>
          <li><router-link to="/gallery">Наши работы</router-link></li>
          <li><router-link to="/promotions">Акции</router-link></li>
          <li><router-link to="/shop">Магазин</router-link></li>
          <li><router-link to="/preparation">Подготовка к печати</router-link></li>
        </ul>
      </nav>
    </header>
    <main class="main-content">
      <router-view />
    </main>
  </div>
</template>

<style scoped>
.site-container { display: flex; flex-direction: column; min-height: 100vh; background-color: #F7F7F7; }
.site-header { display: flex; justify-content: space-between; align-items: center; padding: 1rem 2rem; background-color: white; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05); position: sticky; top: 0; z-index: 10; }
.main-content { flex-grow: 1; }
nav a, .nav-item { cursor: pointer; padding: 8px 0; transition: color 0.2s ease-in-out; display: flex; align-items: center; }
nav a:hover, .dropdown:hover .nav-item { color: #F15F31; }
nav a.router-link-exact-active { color: #F15F31; border-bottom: 2px solid #F15F31; }
.dropdown-menu { display: none; position: absolute; top: 100%; left: 0; background-color: white; min-width: 200px; box-shadow: 0 8px 16px rgba(0,0,0,0.1); z-index: 20; border-radius: 0 0 8px 8px; padding: 8px 0; margin-top: 2px; }
.dropdown:hover .dropdown-menu { display: block; }
.dropdown-item { color: black; padding: 12px 16px; text-decoration: none; display: block; text-align: left; width: 100%; background: none; border: none; cursor: pointer; transition: background-color 0.2s ease-in-out, color 0.2s ease-in-out; }
.dropdown-item:hover { background-color: #f1f1f1; color: #F15F31; }
</style>