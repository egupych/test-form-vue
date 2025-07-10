<script setup>
import { reactive, ref } from 'vue';
import BaseButton from '@/components/ui/BaseButton.vue';

// --- Конфигурация ---
const MAX_PHOTO_SIZE = 5 * 1024 * 1024; // 5 MB для фото
const MAX_LOGO_SIZE = 2 * 1024 * 1024; // 2 MB для лого

// --- Данные формы ---
const formData = reactive({
  name: '',
  position: '',
  company: '',
  rating: 0,
  text: ''
});

const userPhoto = ref(null);
const companyLogo = ref(null);

// --- Состояния формы ---
const errors = reactive({ name: '', text: '', rating: '' });
const isSubmitting = ref(false);
const message = ref('');
const messageType = ref('success');

// --- Валидация ---
const validate = () => {
  Object.keys(errors).forEach(key => errors[key] = '');
  let isValid = true;

  if (!formData.name) {
    errors.name = 'Пожалуйста, представьтесь';
    isValid = false;
  }
  if (!formData.text || formData.text.length < 10) {
    errors.text = 'Отзыв должен содержать не менее 10 символов';
    isValid = false;
  }
  if (formData.rating === 0) {
    errors.rating = 'Пожалуйста, поставьте оценку';
    isValid = false;
  }
  return isValid;
};

// --- Обработка загрузки файлов ---
const handleFileUpload = (event, type) => {
  const file = event.target.files[0];
  if (!file) return;

  const maxSize = type === 'photo' ? MAX_PHOTO_SIZE : MAX_LOGO_SIZE;
  const errorMsg = `Размер файла не должен превышать ${maxSize / 1024 / 1024} МБ`;

  if (file.size > maxSize) {
    alert(errorMsg);
    event.target.value = '';
    return;
  }
  
  if (type === 'photo') {
    userPhoto.value = file;
  } else {
    companyLogo.value = file;
  }
};

// --- Отправка формы ---
const handleSubmit = async () => {
  if (!validate()) {
    return;
  }
  isSubmitting.value = true;

  const submissionData = new FormData();
  for (const key in formData) {
    submissionData.append(key, formData[key]);
  }
  if (userPhoto.value) {
    submissionData.append('userPhoto', userPhoto.value);
  }
  if (companyLogo.value) {
    submissionData.append('companyLogo', companyLogo.value);
  }

  // Логика отправки (будет добавлена на 3-м этапе)
  console.log('Отправка отзыва...', Object.fromEntries(submissionData));
  
  // Имитация ответа сервера
  setTimeout(() => {
    message.value = 'Спасибо за ваш отзыв!';
    messageType.value = 'success';
    isSubmitting.value = false;
    
    // Сброс формы
    Object.keys(formData).forEach(key => formData[key] = '');
    formData.rating = 0;
    userPhoto.value = null;
    companyLogo.value = null;
    // Сбрасываем значения в input для файлов
    const photoInput = document.getElementById('photo-upload');
    if (photoInput) photoInput.value = '';
    const logoInput = document.getElementById('logo-upload');
    if (logoInput) logoInput.value = '';

  }, 1000);
};
</script>

<template>
  <div class="form-wrapper bg-panda-white p-6 md:p-16 lg:p-25">
    <div class="form-info">
      <h2 class="text-h2-panda font-bold">Оставить<br>отзыв</h2>
      <p class="text-h5-panda font-semibold">Нам очень важно ваше мнение.<br>Поделитесь впечатлениями о работе с нами, это поможет нам стать лучше.</p>
    </div>
    <div class="form-body">
      <form @submit.prevent="handleSubmit" novalidate class="flex flex-col gap-2">
        
        <div class="form-group">
          <div class="form-control"><input type="text" placeholder="Ваше имя" required v-model.trim="formData.name"> <span class="input-border"></span></div>
          <div class="error-message" v-if="errors.name">{{ errors.name }}</div>
        </div>
        <div class="form-group">
          <div class="form-control"><input type="text" placeholder="Должность" v-model.trim="formData.position"> <span class="input-border"></span></div>
        </div>
        <div class="form-group">
          <div class="form-control"><input type="text" placeholder="Компания" v-model.trim="formData.company"> <span class="input-border"></span></div>
        </div>
        
        <div class="form-group mt-4">
          <label class="block text-sm font-semibold mb-2 text-dark-gray">Ваша оценка</label>
          <div class="flex items-center gap-1">
            <svg v-for="star in 5" :key="star" @click="formData.rating = star" class="w-8 h-8 cursor-pointer" :class="[star <= formData.rating ? 'text-yellow-400' : 'text-gray-300']" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
          </div>
          <div class="error-message" v-if="errors.rating">{{ errors.rating }}</div>
        </div>
        
        <div class="form-group mt-4">
          <div class="form-control form-control-textarea"><textarea placeholder="Ваш отзыв" required v-model.trim="formData.text"></textarea><span class="input-border"></span></div>
           <div class="error-message" v-if="errors.text">{{ errors.text }}</div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <div>
            <label for="photo-upload" class="upload-button-small">
              <span>{{ userPhoto ? 'Фото загружено' : 'Ваше фото' }}</span>
            </label>
            <input id="photo-upload" type="file" class="hidden" @change="handleFileUpload($event, 'photo')" accept="image/*">
          </div>
          <div>
            <label for="logo-upload" class="upload-button-small">
              <span>{{ companyLogo ? 'Логотип загружен' : 'Лого компании' }}</span>
            </label>
            <input id="logo-upload" type="file" class="hidden" @change="handleFileUpload($event, 'logo')" accept="image/*">
          </div>
        </div>
        
        <BaseButton type="submit" :disabled="isSubmitting" class="mt-8">
          Отправить отзыв
        </BaseButton>
      </form>
       <div v-if="message" class="success-message mt-5" :class="[messageType === 'success' ? 'bg-panda-green' : 'bg-red-500']">{{ message }}</div>
    </div>
  </div>
</template>

<style scoped>
.form-wrapper {
  display: grid;
  grid-template-columns: 1fr;
  gap: 40px;
}
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
  max-width: 450px;
}
.form-body {
  width: 100%;
}
.form-group .error-message {
  color: #F15F31;
  font-size: 12px;
  margin-top: 4px;
  min-height: 16px;
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
input::placeholder, textarea::placeholder {
  color: #8F8F8F;
}
input:focus, textarea:focus {
  outline: none;
}
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
  width: 0;
  height: 2px;
  bottom: 0;
  left: 0;
  transition: width 0.3s ease-in-out;
  z-index: 2;
}
.form-control-textarea .input-border {
    bottom: 8px;
}
input:focus ~ .input-border, textarea:focus ~ .input-border {
  width: 100%;
}
.success-message {
  padding: 15px 20px;
  border-radius: 8px;
  color: #FFFFFF;
  text-align: center;
}
.upload-button-small {
  display: block;
  width: 100%;
  padding: 10px;
  text-align: center;
  border: 1px solid #E3E3E3;
  background-color: #F7F7F7;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 14px;
  color: #8F8F8F;
}
.upload-button-small:hover {
  border-color: #F15F31;
  color: #F15F31;
  background-color: #fff;
}
</style>