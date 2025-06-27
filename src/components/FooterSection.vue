<script setup>
// Скрипты для этой версии футера не требуются
</script>

<template>
  <footer class="bg-panda-black text-gray-400 font-medium">
    <div class="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-10 md:gap-x-8">

        <div class="flex flex-col space-y-6">
          <div class="flex items-center space-x-3">
            <img src="/src/images/red-panda-logo-white.svg" alt="Логотип Red Panda" class="h-30 w-30 flex-shrink-0">
          </div>
          <div class="pt-2">
            <h3 class="font-semibold text-white">Подпишитесь на рассылку</h3>
            <p class="text-sm">о будущих акциях</p>
          </div>
          <form class="space-y-4 max-w-sm">
            <input 
              type="email" 
              placeholder="Ваш email-адрес"
              class="w-full px-4 py-3 bg-transparent border border-gray-600 rounded-md text-white placeholder-gray-500 focus:outline-none focus:border-panda-orange focus:ring-1 focus:ring-panda-orange"
            >
            <div class="flex items-start">
              <input id="consent" type="checkbox" class="h-4 w-4 mt-1 bg-transparent rounded border-gray-500 text-panda-orange focus:ring-panda-orange focus:ring-offset-panda-black">
              <label for="consent" class="ml-3 text-xs">
                Вы соглашаетесь на информационную рассылку. Отписаться можно в любое время.
              </label>
            </div>
            <button 
              type="submit"
              class="w-full bg-white text-panda-black font-bold py-3 px-4 rounded-md hover:bg-gray-200 transition-colors"
            >
              Подписаться
            </button>
          </form>
        </div>

        <div class="flex flex-col items-start md:items-center text-left md:text-center space-y-4">
          <div class="w-full max-w-sm h-48 rounded-lg overflow-hidden border border-gray-700">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2506.273103273479!2d71.4089980769351!3d51.12140683935391!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x424584343513481d%3A0x6a273b5e7838562b!2z0JrQvtGA0LPQsNC70LbQutC-0LTgaCBYeXlhLCBCYXNoa2lyc2tpaSAvIFNob3NzZSAySywgQXN0YW5hLCDQmtCw0LfQsNC20YHRgtCw0L0!5e0!3m2!1sen!2sus!4v1687853472000"
              class="w-full h-full border-0"
              allowfullscreen="" 
              loading="lazy" 
              referrerpolicy="no-referrer-when-downgrade">
            </iframe>
          </div>
          <div class="text-sm">
            <p>Астана, Шоссе Коргалжын, 6</p>
            <p>ПН-ПТ 10:00-18:00</p>
          </div>
        </div>

        <div class="flex flex-col items-start lg:items-end space-y-5 text-left lg:text-right">
          <div class="flex space-x-4">
            <div class="text-center">
              <img src="/src/images/QR-site.svg" alt="QR Code redpanda.kz" class="w-24 h-24 rounded-md p-1">
              <p class="text-xs mt-1">redpanda.kz</p>
            </div>
            <div class="text-center">
              <img src="/src/images/QR-instagram.svg" alt="QR Code redpandakz" class="w-24 h-24 rounded-md p-1">
              <p class="text-xs mt-1">redpandakz</p>
            </div>
          </div>
          <div class="flex flex-wrap justify-start lg:justify-end gap-2">
            <a href="#" class="px-5 py-1.5 bg-gray-700 text-white text-sm font-semibold rounded-full hover:bg-gray-600 transition-colors">Whatsapp</a>
            <a href="#" class="px-5 py-1.5 bg-gray-700 text-white text-sm font-semibold rounded-full hover:bg-gray-600 transition-colors">Instagram</a>
            <a href="#" class="px-5 py-1.5 bg-gray-700 text-white text-sm font-semibold rounded-full hover:bg-gray-600 transition-colors">2GIS</a>
          </div>
          <div class="text-sm">
            <p>+7 700 725-77-99</p>
            <p>infoprint@redpanda.kz</p>
          </div>
          <div class="text-xs">
            <p>TOO «RED PANDA» БИН 221240030264</p>
          </div>
        </div>
        
      </div>
      <div class="border-t border-gray-700 mt-12 pt-8 text-center text-gray-500 text-xs">
        © 2024 TOO «RED PANDA». Все права защищены.
      </div>
    </div>
  </footer>
</template>

<style scoped>
/* Все стили теперь управляются через Tailwind, этот блок пуст */
</style>