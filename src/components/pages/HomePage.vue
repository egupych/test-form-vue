<script setup>
import { ref, reactive, computed } from 'vue';
import BaseButton from '@/components/ui/BaseButton.vue';

const formData = reactive({ name: '', phone: '', email: '', company: '', task: '', promo: '' });
const errors = reactive({ name: '', phone: '', email: '', task: '' });
const isSubmitting = ref(false);
const message = ref('');
const messageType = ref('success');

const isFormValid = computed(() => (
    formData.name && !errors.name && formData.phone && !errors.phone &&
    formData.email && !errors.email && formData.task && !errors.task
));

const showMessage = (msg, type = 'success') => {
    message.value = msg;
    messageType.value = type;
    setTimeout(() => { message.value = ''; }, 5000);
};

const validateEmail = (email) => /^[a-zA-Z0-9]([a-zA-Z0-9._-]*[a-zA-Z0-9])?@[a-zA-Z0-9]([a-zA-Z0-9.-]*[a-zA-Z0-9])?\.[a-zA-Z]{2,}$/.test(String(email).toLowerCase().trim());
const validatePhone = (phone) => {
    const cleanPhone = phone.replace(/[\s\-()]/g, '');
    return [ /^\+7[0-9]{10}$/, /^8[0-9]{10}$/, /^7[0-9]{10}$/, /^\+[1-9][0-9]{7,14}$/ ].some(pattern => pattern.test(cleanPhone));
};

const formatPhoneInput = () => {
    let value = formData.phone.replace(/\D/g, '');
    if (value.length > 0) {
        if (value.startsWith('8')) value = '7' + value.slice(1);
        if (value.startsWith('7')) value = '+7' + value.slice(1);
        else if (!value.startsWith('+')) value = '+' + value;
        if (value.startsWith('+7') && value.length > 2) {
            const digits = value.slice(2);
            if (digits.length <= 3) value = `+7 (${digits}`;
            else if (digits.length <= 6) value = `+7 (${digits.slice(0, 3)}) ${digits.slice(3)}`;
            else if (digits.length <= 8) value = `+7 (${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
            else value = `+7 (${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 8)}-${digits.slice(8, 10)}`;
        }
    }
    formData.phone = value;
    validateField('phone');
};

const validateField = (field) => {
    errors[field] = '';
    const value = formData[field];
    switch (field) {
        case 'name':
            if (!value) errors.name = 'Пожалуйста, введите ваше имя';
            else if (value.length < 2) errors.name = 'Имя должно содержать минимум 2 символа';
            break;
        case 'phone':
            if (!value) errors.phone = 'Пожалуйста, введите номер телефона';
            else if (!validatePhone(value)) errors.phone = 'Введите корректный номер телефона';
            break;
        case 'email':
            if (!value) errors.email = 'Пожалуйста, введите email адрес';
            else if (!validateEmail(value)) errors.email = 'Введите корректный email адрес';
            break;
        case 'task':
            if (!value) errors.task = 'Пожалуйста, опишите задачу';
            else if (value.length < 10) errors.task = 'Описание должно быть не менее 10 символов';
            break;
    }
    return !errors[field];
};

const validateForm = () => ['name', 'phone', 'email', 'task'].every(validateField);

const handleSubmit = async () => {
    if (!validateForm()) {
        showMessage('Пожалуйста, исправьте ошибки в форме.', 'error');
        return;
    }
    isSubmitting.value = true;
    try {
        const response = await fetch('/api/submit-form', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });
        const result = await response.json();
        if (!response.ok) throw new Error(result.message || 'Ошибка сервера');
        showMessage(result.message, 'success');
        Object.keys(formData).forEach(key => formData[key] = '');
    } catch (error) {
        console.error('Ошибка отправки формы:', error);
        showMessage(error.message || 'Ошибка соединения с сервером. Проверьте консоль.', 'error');
    } finally {
        isSubmitting.value = false;
    }
};
</script>

<template>
    <main class="py-10 md:py-25">
      <div class="max-w-6xl mx-auto px-4">
        
        <section>
          <h1 class="text-h1-panda font-bold text-panda-black mb-4">Добро пожаловать в Red Panda!</h1>
          <p class="text-h5-panda text-dark-gray">Мы — современное печатное агентство, которое предоставляет полный спектр полиграфических услуг.</p>
          <div class="p-6 mt-8 bg-white rounded-lg">
              <h3 class="mb-3 text-h4-panda font-semibold text-panda-black">Наши преимущества:</h3>
              <ul class="space-y-2 text-body-panda list-disc list-inside text-dark-gray">
                  <li>Индивидуальный подход к каждому клиенту.</li>
                  <li>Высокое качество печати на современном оборудовании.</li>
                  <li>Быстрое выполнение заказов в установленные сроки.</li>
                  <li>Гибкая система скидок и специальные предложения.</li>
              </ul>
          </div>
        </section>

        <section class="gap-page">
          <div class="form-wrapper">
              <div class="form-info">
                  <h2 class="text-h2-panda font-bold">Расчёт<br>стоимости</h2>
                  <p class="text-h5-panda font-medium">С вами свяжется наш менеджер<br>в ближайшее время. Спасибо, что<br>обратились в наше печатное агентство!</p>
              </div>
              <div class="form-body">
                  <form @submit.prevent="handleSubmit" novalidate>
                      <div class="form-group"><input type="text" placeholder="Ваше имя" required v-model.trim="formData.name" @input="validateField('name')" :class="{ 'border-panda-orange': errors.name }"><div class="error-message" v-if="errors.name">{{ errors.name }}</div></div>
                      <div class="form-group"><input type="tel" placeholder="Телефон" required v-model="formData.phone" @input="formatPhoneInput" :class="{ 'border-panda-orange': errors.phone }"><div class="error-message" v-if="errors.phone">{{ errors.phone }}</div></div>
                      <div class="form-group"><input type="email" placeholder="@email" required v-model.trim="formData.email" @input="validateField('email')" :class="{ 'border-panda-orange': errors.email }"><div class="error-message" v-if="errors.email">{{ errors.email }}</div></div>
                      <div class="form-group"><input type="text" placeholder="Компания" v-model.trim="formData.company"></div>
                      <div class="form-group"><textarea placeholder="Опишите задачу" required v-model.trim="formData.task" @input="validateField('task')" :class="{ 'border-panda-orange': errors.task }"></textarea><div class="error-message" v-if="errors.task">{{ errors.task }}</div></div>
                      <div class="form-group"><input type="text" placeholder="Промокод" v-model.trim="formData.promo"></div>
                      
                      <BaseButton type="submit" :disabled="isSubmitting || !isFormValid">
                        <div v-if="isSubmitting" class="flex items-center justify-center">
                          <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Отправка...
                        </div>
                        <span v-else>Отправить заявку</span>
                      </BaseButton>
                  </form>
              </div>
          </div>
          <div v-if="message" class="success-message mt-5" :class="[messageType === 'success' ? 'bg-panda-green' : 'bg-red-500']">{{ message }}</div>
        </section>

      </div>
    </main>
</template>

<style scoped>
.form-wrapper { display: flex; justify-content: space-between; gap: 60px; align-items: flex-start; }
.form-info { display: flex; flex-direction: column; gap: 20px;}
.form-body { flex-basis: 50%; }
.form-group { margin-bottom: 20px; position: relative; }
input, textarea {font-family: 'Gilroy-Medium', sans-serif; font-size: 16px;}
input[type="text"], input[type="tel"], input[type="email"], textarea { width: 100%; border: none; border-bottom: 1px solid #E3E3E3; padding: 10px 0; color: #131C26; background-color: transparent; transition: border-color 0.3s ease; }
input::placeholder, textarea::placeholder { color: #8F8F8F; }
input:focus, textarea:focus { outline: none; border-bottom-color: #F15F31; }
textarea { resize: vertical; min-height: 100px; }
.form-group .error-message { color: #F15F31; font-size: 12px; position: absolute; bottom: -18px; left: 0; }
.form-button { font-family: 'Gilroy-Semibold', sans-serif; padding: 12px 30px; color: #FFFFFF; background-color: #F15F31; border: none; border-radius: 9999px; cursor: pointer; transition: background-color 0.3s ease; min-width: 180px; font-size: 16px; }
.form-button:hover { background-color: #d9532a; }
.form-button:disabled { opacity: 0.5; cursor: not-allowed; }
.success-message { padding: 15px 20px; border-radius: 8px; color: #FFFFFF; }
</style>