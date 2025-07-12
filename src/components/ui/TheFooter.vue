<script setup>
import { reactive } from 'vue';
import InteractiveMap from './InteractiveMap.vue';

const subscription = reactive({
  email: '',
  sphere: '',
  consent: false,
  isSubmitting: false,
  message: '',
  messageType: 'success'
});

const handleSubscription = async () => {
  subscription.message = '';
  if (!subscription.consent) {
    subscription.message = 'Пожалуйста, дайте согласие на рассылку.';
    subscription.messageType = 'error';
    return;
  }

  subscription.isSubmitting = true;
  try {
    const response = await fetch('/api/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: subscription.email, sphere: subscription.sphere })
    });
    const result = await response.json();

    subscription.message = result.message;
    if (!response.ok) {
      subscription.messageType = 'error';
    } else {
      subscription.messageType = 'success';
      subscription.email = '';
      subscription.sphere = '';
      subscription.consent = false;
    }

  } catch (error) {
    subscription.messageType = 'error';
    subscription.message = 'Ошибка сети. Попробуйте позже.';
    console.error('Ошибка подписки:', error);
  } finally {
    subscription.isSubmitting = false;
  }
};
</script>

<template>
  <footer class="text-light-gray bg-panda-black text-gray-400 font-medium">
    <div class="max-w-6xl mx-auto px-4 md:px-0 py-16">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-y-10 md:gap-x-8 items-end">
        
        <div class="flex flex-col">
          <div class="flex items-center space-x-3">
            <img src="@/assets/images/layout/red-panda-logo-white.svg" alt="Логотип Red Panda" class="h-15">
          </div>
          <div class="pt-6">
            <h3 class="text-light-gray text-body-panda">Подпишитесь на рассылку <br>о будущих акциях</h3>
          </div>
          <form class="space-y-4 max-w-sm mt-6" @submit.prevent="handleSubscription">
            <input
                v-model="subscription.email"
                type="email"
                placeholder="Ваш email-адрес"
                class="w-full px-4 py-2 bg-transparent border border-gray-600 rounded-lg text-light-gray placeholder-gray-500 focus:outline-none focus:border-panda-orange focus:ring-1 focus:ring-panda-orange"
                required
            >
            <input
                v-model="subscription.sphere"
                type="text"
                placeholder="Сфера вашего бизнеса"
                class="w-full px-4 py-2 bg-transparent border border-gray-600 rounded-lg text-light-gray placeholder-gray-500 focus:outline-none focus:border-panda-orange focus:ring-1 focus:ring-panda-orange"
            >
            <div class="flex items-start">
                <input
                  v-model="subscription.consent"
                  id="consent"
                  type="checkbox"
                  class="h-4 w-4 mt-1 bg-transparent rounded border-gray-500 text-panda-orange focus:ring-panda-orange focus:ring-offset-panda-black"
                >
                <label for="consent" class="ml-3 text-xs">
                  Согласие на информационную рассылку. Отписаться можно в любое время.
                </label>
            </div>
            <button
                type="submit"
                :disabled="subscription.isSubmitting"
                class="w-full bg-light-gray text-panda-black font-bold py-2 px-4 rounded-full transition-colors disabled:opacity-50 hover:bg-panda-orange hover:text-light-gray"
            >
                {{ subscription.isSubmitting ? 'Отправка...' : 'Подписаться' }}
            </button>
              <div v-if="subscription.message"
                :class="[subscription.messageType === 'success' ? 'text-panda-green' : 'text-red-500']"
                class="text-sm text-center pt-2">
                {{ subscription.message }}
            </div>
          </form>
        </div>

        <div class="flex flex-col items-center text-center space-y-4 lg:col-span-2">
          <div class="w-full h-80 rounded-2xl overflow-hidden">
              <InteractiveMap />
          </div>
          <div class="text-sm">
          <p>Астана, Шоссе Коргалжын, 6</p>
          <p>ПН-ПТ 10:00-18:00</p>
          </div>
        </div>
        
        <div class="flex flex-col items-start lg:items-end space-y-8 text-left lg:text-right">
          <div class="flex justify-end w-full space-x-8">
            <div class="text-center">
                <img src="@/assets/images/layout/QR-site.svg" alt="QR Code redpanda.kz" class="w-24 h-24 rounded-md p-1">
                <p class="text-md mt-1">redpanda.kz</p>
            </div>
            <div class="text-center">
                <img src="@/assets/images/layout/QR-instagram.svg" alt="QR Code redpandakz" class="w-24 h-24 rounded-md p-1">
                <p class="text-md mt-1">redpandakz</p>
            </div>
          </div>
          <div class="flex flex-col items-end gap-2">
            <a href="https://wa.me/77007257799" class="px-5 py-1.5 bg-gray-700 text-light-gray text-sm font-semibold border border-gray-600 rounded-full hover:bg-transparent hover:border-panda-orange hover:text-panda-orange transition-colors">Whatsapp</a>
            <a href="https://www.instagram.com/redpandakz/" class="px-5 py-1.5 bg-gray-700 text-light-gray text-sm font-semibold border border-gray-600 rounded-full hover:bg-transparent hover:border-panda-orange hover:text-panda-orange transition-colors">Instagram</a>
            <a href="https://2gis.kz/astana/firm/70000001067520759" class="px-5 py-1.5 bg-gray-700 text-light-gray text-sm font-semibold border border-gray-600 rounded-full hover:bg-transparent hover:border-panda-orange hover:text-panda-orange transition-colors">2GIS</a>
          </div>
          <div class="text-sm w-full">
            <p>+7 (700) 725-77-99</p>
            <p>infoprint@redpanda.kz</p>
            <p>TOO «RED PANDA» БИН 221240030264</p>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>