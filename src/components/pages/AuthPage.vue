<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '@/composables/useAuth.js';
import BaseButton from '@/components/ui/BaseButton.vue';

const { user, authError, signInWithGoogle, signUpWithEmail, signInWithEmail } = useAuth();
const router = useRouter();

const isLoginView = ref(true);

const email = ref('');
const password = ref('');
const isSubmitting = ref(false);

const handleAuth = async () => {
  isSubmitting.value = true;
  authError.value = null;

  if (isLoginView.value) {
    await signInWithEmail(email.value, password.value);
  } else {
    await signUpWithEmail(email.value, password.value);
  }
  
  isSubmitting.value = false;

  if (user.value) {
    router.push('/');
  }
};

const handleGoogleSignIn = async () => {
    await signInWithGoogle();
    if (user.value) {
        router.push('/');
    }
}
</script>

<template>
  <main class="py-10 md:py-25">
    <div class="max-w-md mx-auto">
      <div class="bg-white p-8 rounded-3xl shadow-lg">
        <h2 class="text-h3-panda font-bold text-center mb-2">
          {{ isLoginView ? 'Вход в аккаунт' : 'Создание аккаунта' }}
        </h2>
        <p class="text-center text-dark-gray mb-8">
          {{ isLoginView ? 'Нет аккаунта?' : 'Уже есть аккаунт?' }}
          <button @click="isLoginView = !isLoginView" class="text-panda-orange font-semibold hover:underline">
            {{ isLoginView ? 'Зарегистрироваться' : 'Войти' }}
          </button>
        </p>
        
        <form @submit.prevent="handleAuth" class="space-y-6">
          <div class="form-group">
            <div class="form-control">
              <input type="email" placeholder="Email" required v-model.trim="email">
              <span class="input-border"></span>
            </div>
          </div>
          <div class="form-group">
            <div class="form-control">
              <input type="password" placeholder="Пароль" required v-model.trim="password" minlength="6">
              <span class="input-border"></span>
            </div>
          </div>

          <div v-if="authError" class="error-message text-center">
            {{ authError }}
          </div>

          <BaseButton type="submit" :disabled="isSubmitting" class="w-full">
            <div v-if="isSubmitting" class="flex items-center justify-center">
              <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Обработка...
            </div>
            <span v-else>{{ isLoginView ? 'Войти' : 'Создать аккаунт' }}</span>
          </BaseButton>
        </form>

        <div class="flex items-center my-6">
          <hr class="flex-grow border-t border-gray">
          <span class="mx-4 text-sm text-dark-gray">или</span>
          <hr class="flex-grow border-t border-gray">
        </div>

        <button @click="handleGoogleSignIn" class="w-full flex items-center justify-center gap-3 py-3 px-4 border border-gray rounded-full hover:bg-light-gray transition-colors">
            <img src="@/assets/images/pages/HomePage/TrustedBy/Rixos.svg" alt="Google" class="w-5 h-5">
            <span class="text-panda-black font-semibold text-sm">Войти через Google</span>
        </button>

      </div>
    </div>
  </main>
</template>

<style scoped>
/* Стили для полей ввода взяты из CalculationForm.vue для единообразия */
.form-group .error-message {
  color: #F15F31;
  font-size: 14px;
  margin-top: 4px;
}
input {
  font-family: 'Gilroy-Medium', sans-serif;
  font-size: 16px;
  width: 100%;
  border: none;
  border-bottom: 1px solid #E3E3E3;
  padding: 10px 4px;
  color: #131C26;
  background-color: transparent;
  transition: background-color 0.2s ease;
  position: relative;
  z-index: 1;
}
input::placeholder { color: #8F8F8F; }
input:focus { outline: none; }
input:hover {
  background-color: rgba(227, 227, 227, 0.2);
}
.form-control {
  position: relative;
}
.input-border {
  position: absolute;
  background: #F15F31;
  width: 0%;
  height: 2px;
  bottom: 0;
  left: 0;
  transition: width 0.3s ease-in-out;
  z-index: 2;
}
input:focus ~ .input-border {
  width: 100%;
}
</style>