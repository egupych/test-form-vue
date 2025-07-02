<script setup>
import { reactive, ref, computed, watch } from 'vue';
import BaseButton from '@/components/ui/BaseButton.vue';
import { useAuth } from '@/composables/useAuth.js';

const props = defineProps({
  promoCode: {
    type: String,
    default: ''
  }
});

const { user } = useAuth();

const formData = reactive({ name: '', phone: '', email: '', company: '', task: '', promo: '' });
const errors = reactive({ name: '', phone: '', email: '', task: '' });
const isSubmitting = ref(false);
const message = ref('');
const messageType = ref('success');

watch(() => props.promoCode, (newPromo) => {
  if (newPromo) {
    formData.promo = newPromo;
  }
}, { immediate: true });

watch(user, (currentUser) => {
  if (currentUser) {
    if (!formData.name) {
      formData.name = currentUser.displayName || '';
    }
    if (!formData.email) {
      formData.email = currentUser.email || '';
    }
  }
}, { immediate: true });

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
  <div class="form-wrapper bg-panda-white p-25">
    <div class="form-info">
      <h2 class="text-h2-panda font-bold">Расчёт<br>стоимости</h2>
      <p class="text-h5-panda font-semibold">С вами свяжется наш менеджер<br>в ближайшее время. Спасибо, что<br>обратились в наше печатное агентство!</p>
    </div>
    <div class="form-body">
      <form @submit.prevent="handleSubmit" novalidate class="flex flex-col gap-2">
        <div class="form-group">
          <div class="form-control">
            <input type="text" placeholder="Ваше имя" required v-model.trim="formData.name" @input="validateField('name')" >
            <span class="input-border"></span>
          </div>
          <div class="error-message" v-if="errors.name">{{ errors.name }}</div>
        </div>
        <div class="form-group">
          <div class="form-control">
            <input type="tel" placeholder="Телефон" required v-model="formData.phone" @input="formatPhoneInput">
            <span class="input-border"></span>
          </div>
          <div class="error-message" v-if="errors.phone">{{ errors.phone }}</div>
        </div>
        <div class="form-group">
          <div class="form-control">
            <input type="email" placeholder="@email" required v-model.trim="formData.email" @input="validateField('email')">
            <span class="input-border"></span>
          </div>
          <div class="error-message" v-if="errors.email">{{ errors.email }}</div>
        </div>
        <div class="form-group">
          <div class="form-control">
            <input type="text" placeholder="Компания" v-model.trim="formData.company">
            <span class="input-border"></span>
          </div>
        </div>
        <div class="form-group">
          <div class="form-control form-control-textarea">
            <textarea placeholder="Опишите задачу" required v-model.trim="formData.task" @input="validateField('task')"></textarea>
            <span class="input-border"></span>
          </div>
          <div class="error-message" v-if="errors.task">{{ errors.task }}</div>
        </div>
        <div class="form-group">
          <div class="form-control">
            <input type="text" placeholder="Промокод" v-model.trim="formData.promo">
            <span class="input-border"></span>
          </div>
        </div>
        
        <BaseButton type="submit" :disabled="isSubmitting || !isFormValid" class="mt-9">
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
       <div v-if="message" class="success-message mt-5" :class="[messageType === 'success' ? 'bg-panda-green' : 'bg-red-500']">{{ message }}</div>
    </div>
  </div>
</template>

<style scoped>
/* Изменяем стили .form-wrapper, чтобы он был более гибким */
.form-wrapper {
  display: grid;
  grid-template-columns: 1fr; /* По умолчанию одна колонка */
  gap: 40px; /* Уменьшаем отступ между колонками */
}

/* Для экранов шире 768px возвращаем две колонки */
@media (min-width: 768px) {
  .form-wrapper {
    grid-template-columns: 1fr 1fr;
    gap: 60px;
  }
}

.form-info {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.form-body {
  width: 100%;
}

.form-group .error-message {
  color: #F15F31;
  font-size: 12px;
  margin-top: 4px;
}

input, textarea {
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

input::placeholder, textarea::placeholder { color: #8F8F8F; }
input:focus, textarea:focus { outline: none; }

textarea {
  resize: vertical;
  min-height: 100px;
}

input:hover, textarea:hover {
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

.form-control-textarea .input-border {
  bottom: 8px;
}

input:focus ~ .input-border,
textarea:focus ~ .input-border {
  width: 100%;
}

.form-button { font-family: 'Gilroy-Semibold', sans-serif; padding: 12px 30px; color: #FFFFFF; background-color: #F15F31; border: none; border-radius: 9999px; cursor: pointer; transition: background-color 0.3s ease; min-width: 180px; font-size: 16px; }
.form-button:hover { background-color: #d9532a; }
.form-button:disabled { opacity: 0.5; cursor: not-allowed; }
.success-message { padding: 15px 20px; border-radius: 8px; color: #FFFFFF; text-align: center; }
</style>