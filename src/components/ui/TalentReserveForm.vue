<script setup>
import { ref, reactive, watch, computed } from 'vue';
import BaseButton from '@/components/ui/BaseButton.vue';
import SectionHeader from '@/components/ui/SectionHeader.vue';
import { useNotificationStore } from '@/stores/notifications.js';
import { useFormValidation } from '@/composables/useFormValidation.js';

const props = defineProps({
  initialPosition: {
    type: String,
    default: ''
  }
});

const notificationStore = useNotificationStore();

const formData = reactive({
  desiredPosition: '',
  name: '',
  phone: '',
});
const validationFields = ['name', 'phone'];
const { errors, validateField, validateForm, formatPhoneInput } = useFormValidation(formData, validationFields);
const files = ref([]);
const isSubmitting = ref(false);
const hoveredFileUrl = ref(null);
const previewStyle = ref({});

watch(() => props.initialPosition, (newVal) => {
  formData.desiredPosition = newVal;
});

// ИЗМЕНЕНИЕ: Добавлена проверка на наличие файла
const isFormValid = computed(() => {
    const allFieldsFilled = validationFields.every(field => !!formData[field]);
    const noErrors = validationFields.every(field => !errors[field]);
    return allFieldsFilled && noErrors && files.value.length > 0;
});

const handleFileUpload = (event) => {
  const target = event.target;
  if (target && target.files) {
    const newFiles = Array.from(target.files);
    const MAX_FILES = 1;
    const MAX_TOTAL_SIZE = 15 * 1024 * 1024;
    if (newFiles.length > MAX_FILES) {
      notificationStore.showNotification(`Вы можете загрузить не более ${MAX_FILES} файла.`, 'error');
      target.value = '';
      return;
    }
    const totalSize = newFiles.reduce((acc, file) => acc + file.size, 0);
    if (totalSize > MAX_TOTAL_SIZE) {
      notificationStore.showNotification(`Размер файла не должен превышать 15 МБ.`, 'error');
      target.value = '';
      return;
    }
    // Заменяем старый файл новым, а не добавляем
    files.value = newFiles;
  }
  target.value = '';
};

const removeFile = (index) => {
  files.value.splice(index, 1);
};

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

const submitApplication = () => {
  if (!validateForm(validationFields)) {
    notificationStore.showNotification('Пожалуйста, заполните имя и телефон.', 'error');
    return;
  }
  // ИЗМЕНЕНИЕ: Добавлена проверка на наличие файла при отправке
  if (files.value.length === 0) {
    notificationStore.showNotification('Пожалуйста, прикрепите ваше резюме.', 'error');
    return;
  }

  notificationStore.showNotification(`Спасибо за отклик, ${formData.name}! Мы свяжемся с вами.`, 'success');
  
  formData.desiredPosition = '';
  formData.name = '';
  formData.phone = '';
  files.value = [];
};
</script>

<template>
  <section class="talent-reserve-form">
    <SectionHeader class="gap-container">
        Кадровый резерв
    </SectionHeader>

    <div class="form-wrapper bg-white p-10 md:p-16 lg:p-25">
      <div class="form-info">
        <h3 class="text-h2-panda font-bold">Нет подходящей вакансии?</h3>
        <p class="text-h5-panda font-semibold">Оставьте заявку! Мы постоянно растём и ищем талантливых людей. Ваше резюме попадёт в нашу базу, и как только появится подходящая позиция, мы с вами свяжемся.</p>
        <ul class="space-y-4 pt-4">
            <li class="flex items-start gap-3">
                <svg class="w-6 h-6 text-panda-orange flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <span><b>Честная и быстрая оценка.</b> Мы рассмотрим ваше резюме в течение 3 рабочих дней.</span>
            </li>
            <li class="flex items-start gap-3">
                <svg class="w-6 h-6 text-panda-orange flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <span><b>Полная конфиденциальность.</b> Ваши данные будут доступны только HR-отделу.</span>
            </li>
            <li class="flex items-start gap-3">
                <svg class="w-6 h-6 text-panda-orange flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <span><b>Всегда на связи.</b> Мы обязательно дадим обратную связь, независимо от нашего решения.</span>
            </li>
        </ul>
      </div>
      <div class="form-body">
          <form @submit.prevent="submitApplication" novalidate class="flex flex-col h-full">
              <div class="flex flex-col gap-2">
                <div class="form-group">
                  <div class="form-control">
                    <input type="text" placeholder="Желаемая вакансия" v-model.trim="formData.desiredPosition">
                    <span class="input-border"></span>
                  </div>
                </div>
                <div class="form-group">
                  <div class="form-control">
                    <input type="text" placeholder="Ваше имя" required v-model.trim="formData.name" @input="validateField('name')">
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
              </div>

              <div class="mt-auto pt-8">
                <div v-if="files.length > 0" class="file-list">
                  <div 
                    v-for="(file, index) in files" 
                    :key="file.name + index" 
                    class="file-item"
                    @mouseenter="handleFileMouseEnter($event, file)"
                    @mouseleave="handleFileMouseLeave"
                  >
                    <span class="file-name">{{ file.name }}</span>
                    <button @click="removeFile(index)" class="remove-file-button">&times;</button>
                  </div>
                </div>
                <label for="talent-file-upload" class="upload-button">
                  <svg xmlns="http://www.w3.org/2000/svg" class="upload-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                  <span class="upload-text">
                    {{ files.length > 0 ? 'Файл прикреплен' : 'Прикрепить резюме' }}
                  </span>
                </label>
                <input id="talent-file-upload" type="file" class="hidden" @change="handleFileUpload" accept=".pdf,.doc,.docx,image/*">
                <p class="upload-caption">до 1 файла, не более 15 МБ</p>
                <BaseButton type="submit" :disabled="isSubmitting || !isFormValid" class="mt-6 w-full" variant="fill-black">
                  Отправить
                </BaseButton>
              </div>
          </form>
      </div>
    </div>
  </section>

  <Teleport to="body">
    <transition name="preview">
      <div v-if="hoveredFileUrl" class="file-preview-window" :style="previewStyle">
        <img :src="hoveredFileUrl" alt="Предпросмотр файла" class="file-preview-image">
      </div>
    </transition>
  </Teleport>
</template>

<style scoped>
/* Стили в этом файле полностью идентичны тем, что были ранее, и уже используют rem */
.file-preview-window {
  position: fixed;
  z-index: 9999;
  width: 15.625rem;
  height: auto;
  background-color: #fff;
  border-radius: 0.5rem;
  box-shadow: 0 0.625rem 1.875rem rgba(0, 0, 0, 0.2);
  pointer-events: none;
  overflow: hidden;
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

.file-list {
  margin-bottom: 0.75rem;
  max-height: 7.8125rem;
  overflow-y: auto;
  padding-right: 0.25rem;
}
.file-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 0.75rem;
  background-color: #f0f0f0;
  border-radius: 0.5rem;
  margin-bottom: 0.5rem;
}
.file-name {
  font-size: 0.875rem;
  color: #131C26;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding-right: 0.5rem;
}
.remove-file-button {
  background: none;
  border: none;
  color: #8F8F8F;
  cursor: pointer;
  font-size: 1.25rem;
  line-height: 1;
  padding: 0 0.25rem;
  transition: color 0.2s;
}
.remove-file-button:hover {
  color: #F15F31;
}
.upload-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 1rem;
  border: 0.125rem dashed #E3E3E3;
  background-color: #F7F7F7;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: 'Gilroy-SemiBold', sans-serif;
  color: #8F8F8F;
  border-radius: 1rem;
}
.upload-button:hover {
  border-color: #F15F31;
  color: #F15F31;
  background-color: #fff;
}
.upload-icon {
  width: 1.5rem;
  height: 1.5rem;
  margin-right: 0.5rem;
}
.upload-text {
  font-size: 1rem;
}
.upload-caption {
  font-size: 0.75rem;
  color: #8F8F8F;
  margin-top: 0.5rem;
  text-align: center;
}
.form-wrapper {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2.5rem;
}

@media (min-width: 64rem) {
  .form-wrapper {
    grid-template-columns: 1fr 1fr;
    gap: 3.75rem;
  }
}

.form-info {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}
.form-body {
  width: 100%;
}
.form-group .error-message {
  color: #F15F31;
  font-size: 0.75rem;
  margin-top: 0.25rem;
  min-height: 1.25rem;
}
input, textarea {
  font-family: 'Gilroy-Medium', sans-serif;
  font-size: 1rem;
  width: 100%;
  border: none;
  border-bottom: 0.0625rem solid #E3E3E3;
  padding: 0.625rem 0.25rem;
  color: #131C26;
  background-color: transparent;
  transition: background-color 0.2s ease;
  position: relative;
  z-index: 1;
}
input::placeholder, textarea::placeholder { color: #8F8F8F; }
input:focus, textarea:focus { outline: none; }
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
  height: 0.125rem;
  bottom: 0;
  left: 0;
  transition: width 0.3s ease-in-out;
  z-index: 2;
}
.form-control-textarea .input-border {
  bottom: 0.5rem;
}
input:focus ~ .input-border,
textarea:focus ~ .input-border {
  width: 100%;
}
</style>