<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '@/composables/useAuth.js';
import { auth } from '@/firebase.js';
import BaseButton from '@/components/ui/BaseButton.vue';

const { 
  authError, 
  signInWithGoogle, 
  sendSignInLink,
  isSignInWithEmailLink,
  signInWithEmailLink
} = useAuth();

const router = useRouter();

const email = ref('');
const isSubmitting = ref(false);
const linkSent = ref(false);

onMounted(async () => {
  if (isSignInWithEmailLink(auth, window.location.href)) {
    let storedEmail = window.localStorage.getItem('emailForSignIn');
    if (!storedEmail) {
      storedEmail = window.prompt('Пожалуйста, введите ваш email для завершения входа.');
    }
    
    if (storedEmail) {
      isSubmitting.value = true;
      try {
        await signInWithEmailLink(auth, storedEmail, window.location.href);
        window.localStorage.removeItem('emailForSignIn');
        router.push('/');
      } catch (error) {
        console.error("Ошибка при входе по ссылке:", error);
        authError.value = "Неверная или истекшая ссылка. Попробуйте снова.";
      } finally {
        isSubmitting.value = false;
      }
    }
  }
});

const handleSendLink = async () => {
    isSubmitting.value = true;
    authError.value = null;
    linkSent.value = false;
    
    const success = await sendSignInLink(email.value);
    
    if (success) {
        linkSent.value = true;
    }
    
    isSubmitting.value = false;
}

const handleGoogleSignIn = async () => {
    await signInWithGoogle();
    router.push('/');
}
</script>

<template>
  <main class="py-10 md:py-25">
    <div class="max-w-md mx-auto px-4">
      <div class="bg-white p-8 rounded-3xl shadow-lg">
        
        <h2 class="text-h3-panda font-bold text-center mb-2">Вход или регистрация</h2>
        <p class="text-center text-dark-gray mb-8">
            Введите ваш email, чтобы войти или создать аккаунт
        </p>

        <div v-if="linkSent" class="text-center p-4 bg-panda-green text-panda-white rounded-lg mb-6">
            <h3 class="font-bold">Ссылка отправлена!</h3>
            <p>Проверьте вашу почту <span class="font-semibold">{{ email }}</span> и перейдите по ссылке для завершения входа.</p>
        </div>
        
        <form v-else @submit.prevent="handleSendLink" class="space-y-6">
            <div class="relative form-control">
                <input 
                    type="email" 
                    id="email"
                    required 
                    v-model.trim="email"
                    class="
                        block w-full px-1 pb-2 pt-5 
                        text-base text-panda-black 
                        bg-transparent rounded-lg border-b border-gray 
                        appearance-none focus:outline-none focus:ring-0 
                        peer z-10
                    "
                    placeholder=" " 
                />
                <label 
                    for="email" 
                    class="
                        absolute text-base text-dark-gray 
                        duration-300 transform -translate-y-4 scale-75 top-4 z-0 
                        origin-[0] peer-placeholder-shown:scale-100 
                        peer-placeholder-shown:translate-y-0 
                        peer-focus:scale-75 peer-focus:-translate-y-4
                        peer-focus:text-panda-orange
                    "
                >
                    Email
                </label>
                <span 
                    class="
                        absolute bottom-0 left-0 h-0.5 bg-panda-orange 
                        w-0 transition-all duration-300 peer-focus:w-full
                    "
                ></span>
            </div>

            <div v-if="authError" class="text-panda-orange text-center text-sm">
                {{ authError }}
            </div>
            <BaseButton type="submit" :disabled="isSubmitting" class="w-full">
                <span v-if="!isSubmitting">Получить ссылку для входа</span>
                <span v-else>Отправка...</span>
            </BaseButton>
        </form>

        <div class="flex items-center my-6">
          <hr class="flex-grow border-t border-gray">
          <span class="mx-4 text-sm text-dark-gray">или</span>
          <hr class="flex-grow border-t border-gray">
        </div>

        <button @click="handleGoogleSignIn" class="w-full flex items-center justify-center gap-3 py-3 px-4 border border-gray rounded-full hover:bg-light-gray transition-colors">
            <img src="@/assets/images/pages/AuthPage/google-gradient-icon.svg" alt="Google" class="w-7 h-7">
            <span class="text-panda-black font-semibold text-sm">Войти через Google</span>
        </button>

      </div>
    </div>
  </main>
</template>

<style scoped>
/* Этот блок пуст, так как все стили теперь в классах Tailwind. */
</style>