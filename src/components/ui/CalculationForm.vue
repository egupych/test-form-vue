<script setup>
import { reactive, ref, computed, watch } from 'vue';
import BaseButton from '@/components/ui/BaseButton.vue';
import { useAuth } from '@/composables/useAuth.js';
import { useReferencesStore } from '@/stores/references.js'; // 1. ИМПОРТ ХРАНИЛИЩА РЕФЕРЕНСОВ

const MAX_FILES = 10;
const MAX_TOTAL_SIZE = 100 * 1024 * 1024; // 100 MB

const props = defineProps({
  promoCode: {
    type: String,
    default: ''
  }
});

const { user } = useAuth();
const referencesStore = useReferencesStore(); // 2. ИНИЦИАЛИЗАЦИЯ ХРАНИЛИЩА

const formData = reactive({ name: '', phone: '', email: '', company: '', task: '', promo: '' });
const errors = reactive({ name: '', phone: '', email: '', task: '' });
const isSubmitting = ref(false);
const message = ref('');
const messageType = ref('success');

const files = ref([]);

// Логика для превью загружаемых файлов при наведении
const hoveredFileUrl = ref(null);
const previewStyle = ref({});

const handleFileMouseEnter = (event, file) => {
  if (file.type.startsWith('image/')) {
    const rect = event.currentTarget.getBoundingClientRect();
    hoveredFileUrl.value = URL.createObjectURL(file);
    previewStyle.value = {
      top: `${rect.top}px`,
      left: `${rect.right + 15}px`,
    };
  }
};

const handleFileMouseLeave = () => {
  if (hoveredFileUrl.value) {
    URL.revokeObjectURL(hoveredFileUrl.value);
    hoveredFileUrl.value = null;
  }
};

// Вся остальная логика компонента (валидация, загрузка файлов и т.д.) остается без изменений
const handleFileUpload = (event) => {
  const target = event.target;
  if (target && target.files) {
    const newFiles = Array.from(target.files);

    if (files.value.length + newFiles.length > MAX_FILES) {
      showMessage(`Вы не можете загрузить больше ${MAX_FILES} файлов.`, 'error');
      target.value = '';
      return;
    }

    const currentSize = files.value.reduce((acc, file) => acc + file.size, 0);
    const newSize = newFiles.reduce((acc, file) => acc + file.size, 0);

    if (currentSize + newSize > MAX_TOTAL_SIZE) {
      showMessage(`Общий размер файлов не должен превышать 100 МБ.`, 'error');
      target.value = '';
      return;
    }
    
    files.value.push(...newFiles);
  }
  target.value = '';
};

const removeFile = (index) => {
  files.value.splice(index, 1);
};


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
    
    const data = new FormData();
    
    for (const key in formData) {
        data.append(key, formData[key]);
    }
    
    if (files.value.length > 0) {
        files.value.forEach(file => {
            data.append('files[]', file); // Используем files[] для массива
        });
    }

    // 3. ДОБАВЛЕНИЕ РЕФЕРЕНСОВ В ОТПРАВЛЯЕМЫЕ ДАННЫЕ
    if (referencesStore.items.length > 0) {
        referencesStore.items.forEach((refUrl) => {
            data.append('references[]', refUrl); // Используем references[] для массива
        });
    }

    try {
        const response = await fetch('/api/submit-form', {
            method: 'POST',
            body: data
        });

        const result = await response.json();
        if (!response.ok) throw new Error(result.message || 'Ошибка сервера');
        
        showMessage(result.message, 'success');
        Object.keys(formData).forEach(key => formData[key] = '');
        files.value = [];
        referencesStore.clearReferences(); // 4. ОЧИСТКА РЕФЕРЕНСОВ ПОСЛЕ ОТПРАВКИ
    } catch (error) {
        console.error('Ошибка отправки формы:', error);
        showMessage(error.message || 'Ошибка соединения с сервером. Проверьте консоль.', 'error');
    } finally {
        isSubmitting.value = false;
    }
};
</script>

<template>
  <div class="form-wrapper bg-panda-white p-6 md:p-25">
    <div class="form-info">
      <h2 class="text-h2-panda font-bold">Расчёт<br>стоимости</h2>
      <p class="text-h5-panda font-semibold">С вами свяжется наш менеджер<br>в ближайшее время. Спасибо, что<br>обратились в наше печатное агентство!</p>
      
      <div class="mt-auto pt-4">
        <div v-if="referencesStore.items.length > 0" class="references-section">
            <h3 class="section-title">Выбранные референсы</h3>
            <div class="references-list">
                <div v-for="refUrl in referencesStore.items" :key="refUrl" class="reference-item">
                    <img :src="refUrl" alt="Референс" class="reference-image">
                    <button @click="referencesStore.toggleReference(refUrl)" class="remove-reference-button" title="Убрать референс">&times;</button>
                </div>
            </div>
        </div>

        <div v-if="files.length > 0" class="file-list-section">
            <h3 class="section-title">Прикрепленные файлы</h3>
            <div class="file-list">
              <div 
                v-for="(file, index) in files" 
                :key="file.name + index" 
                class="file-item"
                @mouseenter="handleFileMouseEnter($event, file)"
                @mouseleave="handleFileMouseLeave"
              >
                <span class="file-name">{{ file.name }}</span>
                <button @click="removeFile(index)" class="remove-file-button" title="Удалить файл">&times;</button>
              </div>
            </div>
        </div>

        <label for="file-upload" class="upload-button">
          <svg xmlns="http://www.w3.org/2000/svg" class="upload-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
          </svg>
          <span class="upload-text">
            {{ files.length > 0 ? `Добавить еще (${files.length} из ${MAX_FILES})` : 'Прикрепить макет' }}
          </span>
        </label>
        <input id="file-upload" type="file" class="hidden" @change="handleFileUpload" multiple>
        <p class="upload-caption">до 10 файлов, не более 100 МБ</p>
      </div>
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
  
  <Teleport to="body">
    <transition name="preview">
      <div v-if="hoveredFileUrl" class="file-preview-window" :style="previewStyle">
        <img :src="hoveredFileUrl" alt="Предпросмотр файла" class="file-preview-image">
      </div>
    </transition>
  </Teleport>
</template>

<style scoped>
/* Стили для превью файлов */
.file-preview-window {
  position: fixed;
  z-index: 9999;
  width: 15.625rem; /* 250px -> 15.625rem */
  height: auto;
  background-color: #fff;
  border-radius: 0.5rem; /* 8px -> 0.5rem */
  box-shadow: 0 0.625rem 1.875rem rgba(0, 0, 0, 0.2); /* 10px 30px -> 0.625rem 1.875rem */
  pointer-events: none;
  overflow: hidden;
  transform-origin: top left;
}
.file-preview-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
}
.preview-enter-active,
.preview-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.preview-enter-from,
.preview-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

/* Общие стили для секций референсов и файлов */
.references-section, .file-list-section {
    margin-bottom: 1.5rem; /* 24px -> 1.5rem */
}
.section-title {
    font-family: 'Gilroy-Semibold', sans-serif;
    color: #131C26;
    margin-bottom: 0.75rem; /* 12px -> 0.75rem */
    font-size: 1rem; /* 16px -> 1rem */
}

/* Стили для списка референсов */
.references-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(4.5rem, 1fr)); /* 72px -> 4.5rem */
    gap: 0.5rem; /* 8px -> 0.5rem */
    max-height: 10.25rem; /* 164px -> 10.25rem (2 ряда по 72px + отступ 8px) */
    overflow-y: auto;
    padding: 0.5rem; /* 8px -> 0.5rem */
    background-color: #f7f7f7;
    border-radius: 0.75rem; /* 12px -> 0.75rem */
}
.reference-item {
    position: relative;
    aspect-ratio: 1 / 1;
    border-radius: 0.5rem; /* 8px -> 0.5rem */
    overflow: hidden;
    background-color: #e3e3e3;
}
.reference-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
}
.remove-reference-button {
    position: absolute;
    top: 0.25rem; /* 4px -> 0.25rem */
    right: 0.25rem; /* 4px -> 0.25rem */
    width: 1.25rem; /* 20px -> 1.25rem */
    height: 1.25rem; /* 20px -> 1.25rem */
    border-radius: 50%;
    background-color: rgba(19, 28, 38, 0.7);
    color: white;
    border: none;
    cursor: pointer;
    font-size: 0.875rem; /* 14px -> 0.875rem */
    line-height: 1.25rem; /* 20px -> 1.25rem */
    text-align: center;
    opacity: 0;
    transition: all 0.2s;
    backdrop-filter: blur(0.125rem); /* 2px -> 0.125rem */
}
.reference-item:hover .remove-reference-button {
    opacity: 1;
}
.remove-reference-button:hover {
    background-color: #F15F31;
    transform: scale(1.1);
}

/* Стили для списка файлов */
.file-list {
  max-height: 7.8125rem; /* 125px -> 7.8125rem */
  overflow-y: auto;
  padding-right: 0.5rem; /* 8px -> 0.5rem. Место для скроллбара */
}
.file-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 0.75rem; /* 8px 12px -> 0.5rem 0.75rem */
  background-color: #f7f7f7;
  border-radius: 0.5rem; /* 8px -> 0.5rem */
  margin-bottom: 0.5rem; /* 8px -> 0.5rem */
  transition: background-color 0.2s;
}
.file-item:hover {
    background-color: #e3e3e3;
}
.file-item:last-child {
  margin-bottom: 0;
}
.file-name {
  font-size: 0.875rem; /* 14px -> 0.875rem */
  color: #131C26;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding-right: 0.625rem; /* 10px -> 0.625rem */
}
.remove-file-button {
  background: none;
  border: none;
  color: #8F8F8F;
  cursor: pointer;
  font-size: 1.25rem; /* 20px -> 1.25rem */
  line-height: 1;
  padding: 0 0.25rem; /* 0 4px -> 0 0.25rem */
  transition: color 0.2s;
  margin-left: 0.5rem; /* 8px -> 0.5rem */
  flex-shrink: 0;
}
.remove-file-button:hover {
  color: #F15F31;
}

/* Стили кнопки загрузки */
.upload-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 1rem; /* 16px -> 1rem */
  border: 0.125rem dashed #E3E3E3; /* 2px -> 0.125rem */
  background-color: #F7F7F7;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: 'Gilroy-Semibold', sans-serif;
  color: #8F8F8F;
  border-radius: 1rem; /* 16px -> 1rem */
}
.upload-button:hover {
  border-color: #F15F31;
  color: #F15F31;
  background-color: #fff;
}
.upload-icon {
  width: 1.5rem; /* 24px -> 1.5rem */
  height: 1.5rem; /* 24px -> 1.5rem */
  margin-right: 0.5rem; /* 8px -> 0.5rem */
}
.upload-text {
  font-size: 1rem; /* 16px -> 1rem */
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.upload-caption {
  font-size: 0.75rem; /* 12px -> 0.75rem */
  color: #8F8F8F;
  margin-top: 0.5rem; /* 8px -> 0.5rem */
  text-align: center;
}

/* Общие стили формы */
.form-wrapper {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2.5rem; /* 40px -> 2.5rem */
}

@media (min-width: 768px) {
  .form-wrapper {
    grid-template-columns: 1fr 1fr;
    gap: 3.75rem; /* 60px -> 3.75rem */
  }
}

.form-info {
  display: flex;
  flex-direction: column;
  gap: 1.25rem; /* 20px -> 1.25rem */
  max-width: 28.125rem; /* 450px -> 28.125rem */
}
.form-body {
  width: 100%;
}
.form-group .error-message {
  color: #F15F31;
  font-size: 0.75rem; /* 12px -> 0.75rem */
  margin-top: 0.25rem; /* 4px -> 0.25rem */
  padding-left: 0.25rem; /* 4px -> 0.25rem */
}
input, textarea {
  font-family: 'Gilroy-Medium', sans-serif;
  font-size: 1rem; /* 16px -> 1rem */
  width: 100%;
  border: none;
  border-bottom: 0.0625rem solid #E3E3E3; /* 1px -> 0.0625rem */
  padding: 0.625rem 0.25rem; /* 10px 4px -> 0.625rem 0.25rem */
  color: #131C26;
  background-color: transparent;
  transition: background-color 0.2s ease, border-color 0.3s ease;
  position: relative;
  z-index: 1;
}
input::placeholder, textarea::placeholder { color: #8F8F8F; }
input:focus, textarea:focus { outline: none; }
textarea {
  resize: vertical;
  min-height: 6.25rem; /* 100px -> 6.25rem */
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
  height: 0.125rem; /* 2px -> 0.125rem */
  bottom: 0;
  left: 0;
  transition: width 0.3s ease-in-out;
  z-index: 2;
}
.form-control-textarea .input-border {
  bottom: 0;
}
input:focus ~ .input-border,
textarea:focus ~ .input-border {
  width: 100%;
}
.success-message { padding: 0.9375rem 1.25rem; border-radius: 0.5rem; color: #FFFFFF; text-align: center; } /* 15px 20px -> 0.9375rem 1.25rem; 8px -> 0.5rem */
</style>