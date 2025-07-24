<script setup>
// Этот скрипт управляет логикой формы отклика на вакансию.
// Он выполняет следующие функции:
// - Принимает название вакансии через props.
// - Собирает данные из полей (имя, телефон).
// - Использует композибл useFormValidation для валидации полей.
// - Обрабатывает загрузку одного файла (резюме) с проверкой формата и размера.
// - Отправляет данные формы на бэкенд-сервер по адресу /api/submit-application.

import { ref, reactive, watch, computed } from 'vue';
import BaseButton from '@/components/ui/BaseButton.vue';
import { useNotificationStore } from '@/stores/notifications.js';
import { useFormValidation } from '@/composables/useFormValidation.js';



const emit = defineEmits(['close']); // Добавляем emit для закрытия попапа
const notificationStore = useNotificationStore();
const formStateStore = useFormStateStore();

const formData = formStateStore.vacancyForm;
const validationFields = ['name', 'phone'];
const { errors, validateField, validateForm, formatPhoneInput } =
  useFormValidation(formData, validationFields);
const files = ref([]);
const isSubmitting = ref(false);

const desiredPosition = ref(props.positionTitle);
watch(
  () => props.positionTitle,
  (newVal) => {
    desiredPosition.value = newVal;
    formStateStore.updateVacancyFormField('desiredPosition', newVal);
  },
  { immediate: true }
);

const isFormValid = computed(() => {
  const allFieldsFilled = validationFields.every((field) => !!formStateStore.vacancyForm[field]);
  const noErrors = validationFields.every((field) => !errors[field]);
  return allFieldsFilled && noErrors && files.value.length > 0;
});

const handleFileUpload = (event) => {
  const target = event.target;
  if (!target.files) return;
  const newFiles = Array.from(target.files);
  const MAX_FILES = 1;
  const MAX_TOTAL_SIZE = 15 * 1024 * 1024;
  if (newFiles.length > MAX_FILES) {
    notificationStore.showNotification(
      `Вы можете загрузить не более ${MAX_FILES} файла.`,
      'error'
    );
    target.value = '';
    return;
  }
  const totalSize = newFiles.reduce((acc, file) => acc + file.size, 0);
  if (totalSize > MAX_TOTAL_SIZE) {
    notificationStore.showNotification(
      `Размер файла не должен превышать 15 МБ.`,
      'error'
    );
    target.value = '';
    return;
  }
  files.value = newFiles;
  target.value = '';
};

const removeFile = (index) => {
  files.value.splice(index, 1);
};

// --- ИЗМЕНЕННАЯ ФУНКЦИЯ ОТПРАВКИ ---
const handleSubmit = async () => {
  if (!validateForm(validationFields) || files.value.length === 0) {
    notificationStore.showNotification(
      'Пожалуйста, заполните все поля и прикрепите резюме.',
      'error'
    );
    return;
  }

  isSubmitting.value = true;
  const data = new FormData();
  data.append('name', formStateStore.vacancyForm.name);
  data.append('phone', formStateStore.vacancyForm.phone);
  data.append('desiredPosition', desiredPosition.value);
  data.append('resume', files.value[0]); // Прикрепляем файл под именем 'resume'

  try {
    const response = await fetch('/api/submit-application', {
      method: 'POST',
      body: data,
    });
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Ошибка на стороне сервера.');
    }

    notificationStore.showNotification(result.message, 'success');
    // Очистка формы и закрытие окна
    formStateStore.clearVacancyForm();
    files.value = [];
    emit('close'); // Сигнал родительскому компоненту закрыть попап
  } catch (error) {
    console.error('Ошибка отправки отклика:', error);
    notificationStore.showNotification(
      error.message || 'Не удалось отправить отклик.',
      'error'
    );
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<template>
  <div class="form-wrapper bg-white p-4 md:p-16">
    <div class="form-info">
      <h3 class="text-h2-panda font-bold">Отклик на вакансию</h3>
      <p class="text-h5-panda font-semibold">
        Вы откликаетесь на вакансию <br />
        <span class="text-panda-orange">«{{ positionTitle }}»</span>
      </p>
      <p class="text-body-panda text-dark-gray mt-4">
        Пожалуйста, заполните поля справа и прикрепите резюме. Мы рассмотрим и
        свяжемся с вами.
      </p>
    </div>
    <div class="form-body">
      <form
        @submit.prevent="handleSubmit"
        novalidate
        class="flex flex-col h-full"
      >
        <div class="flex flex-col gap-2">
          <div class="form-group">
            <div class="relative">
              <input
                type="text"
                id="vacancyName"
                required
                v-model.trim="formStateStore.vacancyForm.name"
                @input="validateField('name')"
                class="form-input peer"
                :class="{ 'border-panda-orange': errors.name }"
                placeholder=" "
              />
              <label
                for="vacancyName"
                class="form-label"
                :class="{ '!text-panda-orange': errors.name }"
              >
                <span v-if="errors.name">{{ errors.name }}</span>
                <span v-else>Ваше имя</span>
              </label>
              <span
                class="input-border"
                :class="{ 'bg-panda-orange w-full': errors.name }"
              ></span>
            </div>
          </div>
          <div class="form-group">
            <div class="relative">
              <input
                type="tel"
                id="vacancyPhone"
                required
                v-model="formStateStore.vacancyForm.phone"
                @input="formatPhoneInput"
                class="form-input peer"
                :class="{ 'border-panda-orange': errors.phone }"
                placeholder=" "
              />
              <label
                for="vacancyPhone"
                class="form-label"
                :class="{ '!text-panda-orange': errors.phone }"
              >
                <span v-if="errors.phone">{{ errors.phone }}</span>
                <span v-else>Телефон</span>
              </label>
              <span
                class="input-border"
                :class="{ 'bg-panda-orange w-full': errors.phone }"
              ></span>
            </div>
          </div>
        </div>

        <div class="mt-auto pt-8">
          <div v-if="files.length > 0" class="file-list">
            <div
              v-for="(file, index) in files"
              :key="file.name + index"
              class="file-item"
            >
              <span class="file-name">{{ file.name }}</span>
              <button @click="removeFile(index)" class="remove-file-button">
                &times;
              </button>
            </div>
          </div>
          <label for="resume-upload" class="upload-button">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="upload-icon"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
              />
            </svg>
            <span class="upload-text">
              {{
                files.length > 0 ? 'Резюме прикреплено' : 'Прикрепить резюме'
              }}
            </span>
          </label>
          <input
            id="resume-upload"
            type="file"
            class="hidden"
            @change="handleFileUpload"
            accept=".pdf,.doc,.docx"
          />
          <p class="upload-caption">.pdf, .doc, .docx, не более 15 МБ</p>
          <BaseButton
            type="submit"
            :disabled="isSubmitting || !isFormValid"
            class="mt-6 w-full"
            variant="fill-orange"
          >
            <span v-if="!isSubmitting">Отправить отклик</span>
            <span v-else>Отправка...</span>
          </BaseButton>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
/* Стили остаются без изменений */
.form-input {
  @apply block w-full pb-1 pt-4 text-base text-panda-black bg-transparent border-b border-gray appearance-none focus:outline-none focus:ring-0 z-10;
}
.form-label {
  @apply pointer-events-none absolute text-base text-dark-gray duration-300 transform -translate-y-4 scale-75 top-4 z-0 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4;
}
.input-border {
  @apply absolute bottom-0 left-0 h-0.5 bg-panda-orange w-0 transition-all duration-300 peer-focus:w-full;
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
  color: #131c26;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding-right: 0.5rem;
}
.remove-file-button {
  background: none;
  border: none;
  color: #8f8f8f;
  cursor: pointer;
  font-size: 1.25rem;
  line-height: 1;
  padding: 0 0.25rem;
  transition: color 0.2s;
}
.remove-file-button:hover {
  color: #f15f31;
}
.upload-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 1rem;
  border: 0.125rem dashed #e3e3e3;
  background-color: #f7f7f7;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: 'Gilroy-SemiBold', sans-serif;
  color: #8f8f8f;
  border-radius: 1rem;
}
.upload-button:hover {
  border-color: #f15f31;
  color: #f15f31;
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
  color: #8f8f8f;
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
</style>
