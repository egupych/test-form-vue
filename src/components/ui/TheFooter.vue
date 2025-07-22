<script setup>
// Секция script остается без изменений
import { reactive } from 'vue';
import InteractiveMap from './InteractiveMap.vue';
import { useFormValidation } from '@/composables/useFormValidation.js';

const subscription = reactive({
  email: '',
  sphere: '',
  consent: false,
  isSubmitting: false,
  message: '',
  messageType: 'success'
});

const { errors, validateField, validateForm } = useFormValidation(subscription, ['email']);

const handleSubscription = async () => {
  subscription.message = '';
  const isEmailValid = validateForm(['email']);

  if (!subscription.consent) {
    errors.consent = 'Пожалуйста, дайте согласие на рассылку.';
  } else {
    errors.consent = null;
  }

  if (!isEmailValid || !subscription.consent) {
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
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-y-10 md:gap-x-8 items-start">
        
        <div class="flex flex-col md:h-full">
          <div>
            <div class="hidden md:block">
              <div class="flex items-center space-x-3">
                <img src="@/assets/images/layout/red-panda-logo-white.svg" alt="Логотип Red Panda" class="h-15 mb-8">
              </div>
            </div>
            <div class="pt-6">
              <h3 class="text-light-gray text-body-panda">Подпишитесь на рассылку <br>о будущих акциях</h3>
            </div>
          </div>
          
          <form class="flex flex-col md:flex-grow gap-2 mt-1" @submit.prevent="handleSubscription" novalidate>
            <div>
              <div class="relative">
                  <input
                      v-model.trim="subscription.email"
                      @blur="validateField('email')"
                      type="email"
                      id="footer-email"
                      required
                      class="form-input peer"
                      :class="{'!border-panda-orange': errors.email}"
                      placeholder=" "
                  />
                  <label
                      for="footer-email"
                      class="form-label"
                      :class="{'!text-panda-orange': errors.email}"
                  >
                      <span v-if="errors.email">{{ errors.email }}</span>
                      <span v-else>Ваш email-адрес</span>
                  </label>
                  <span class="input-border" :class="{'bg-panda-orange w-full': errors.email}"></span>
              </div>

              <div class="relative mt-2">
                  <input
                      v-model.trim="subscription.sphere"
                      type="text"
                      id="footer-sphere"
                      class="form-input peer"
                      placeholder=" "
                  />
                  <label
                      for="footer-sphere"
                      class="form-label"
                  >
                      Сфера вашего бизнеса
                  </label>
                  <span class="input-border"></span>
              </div>
              
              <div>
                <label for="consent" class="relative flex items-start cursor-pointer text-xs group py-4">
                    <input
                      v-model="subscription.consent"
                      id="consent"
                      type="checkbox"
                      class="peer sr-only"
                    >
                    <span 
                        class="flex-shrink-0 w-4 h-4 border-2 rounded transition-colors"
                        :class="errors.consent ? 'border-panda-orange' : 'border-dark-gray peer-checked:bg-panda-orange peer-checked:border-panda-orange group-hover:border-gray-500'"
                    >
                        <svg class="w-full h-full text-light-gray transform scale-0 peer-checked:scale-100 transition-transform" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M2.5 7.5L5.5 10.5L11.5 3.5" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </span>
                    <span class="ml-2">
                        Согласие на информационную рассылку
                    </span>
                </label>
                <div v-if="errors.consent" class="text-panda-orange text-xs mt-1.5 pl-7">
                    {{ errors.consent }}
                </div>
              </div>
            </div>

            <div class="mt-6 md:mt-auto">
              <button
                  type="submit"
                  :disabled="subscription.isSubmitting"
                  class="w-full bg-light-gray text-panda-black font-bold py-2 px-4 rounded-full transition-colors disabled:opacity-50 hover:bg-panda-orange hover:text-light-gray"
              >
                  {{ subscription.isSubmitting ? 'Отправка...' : 'Подписаться' }}
              </button>
              <div v-if="subscription.message"
                :class="[subscription.messageType === 'success' ? 'text-panda-green' : 'text-panda-orange']"
                class="text-sm text-center pt-2">
                {{ subscription.message }}
              </div>
            </div>
          </form>
        </div>

        <div class="hidden md:flex flex-col items-center text-center space-y-4 lg:col-span-2">
          <div class="w-full h-80 rounded-2xl overflow-hidden">
              <InteractiveMap />
          </div>
          <div class="text-sm">
            <p>Астана, Шоссе Коргалжын, 6</p>
            <p>ПН-ПТ 10:00-18:00</p>
          </div>
        </div>
        
        <div class="flex flex-col items-start text-left space-y-8 md:mt-0 md:col-span-2 lg:col-span-1 lg:items-end lg:text-right">
          <div class="hidden md:flex justify-end w-full space-x-8">
            <div class="text-center">
                <img src="@/assets/images/layout/QR-instagram.svg" alt="QR Code redpandakz" class="w-28 h-28 rounded-md p-1">
                <p class="text-md mt-1">redpandakz</p>
            </div>
          </div>

          <div class="flex flex-row lg:flex-col gap-2 lg:gap-2 lg:items-end">
            <a href="https://wa.me/77007257799" class="px-5 py-1.5 text-center bg-gray-700 text-light-gray text-sm font-semibold border border-dark-gray rounded-full hover:bg-transparent hover:border-panda-orange hover:text-panda-orange transition-colors">Whatsapp</a>
            <a href="https://www.instagram.com/redpandakz/" class="px-5 py-1.5 text-center bg-gray-700 text-light-gray text-sm font-semibold border border-dark-gray rounded-full hover:bg-transparent hover:border-panda-orange hover:text-panda-orange transition-colors">Instagram</a>
            <a href="https://2gis.kz/astana/firm/70000001067520759" class="px-5 py-1.5 bg-gray-700 text-center text-light-gray text-sm font-semibold border border-dark-gray rounded-full hover:bg-transparent hover:border-panda-orange hover:text-panda-orange transition-colors">2GIS</a>
          </div>
          
          <div class="flex flex-col items-start lg:items-end gap-1 text-sm w-full">
            <a href="tel:+77007257799" class="hover:text-panda-orange transition-colors duration-200">
              +7 (700) 725-77-99
            </a>
            <a href="mailto:infoprint@redpanda.kz" class="hover:text-panda-orange transition-colors duration-200">
              infoprint@redpanda.kz
            </a>
            <p>TOO «RED PANDA» БИН 221240030264</p>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped>
/* Стили для полей ввода остаются без изменений */
.form-input {
  @apply block w-full pb-1 pt-4 text-light-gray bg-transparent border-b border-dark-gray appearance-none focus:outline-none focus:ring-0 z-10;
}
.form-label { 
  @apply pointer-events-none absolute text-base text-dark-gray duration-300 transform -translate-y-4 scale-75 top-4 z-0 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4;
}
.input-border {
  @apply absolute bottom-0 left-0 h-0.5 bg-panda-orange w-0 transition-all duration-300 peer-focus:w-full;
}
</style>