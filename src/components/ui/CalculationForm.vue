<script setup>
// Этот скрипт управляет логикой формы для расчёта стоимости.
// Он включает в себя:
// - Сбор данных из полей ввода (имя, телефон, email и т.д.).
// - Валидацию полей с помощью композибл функции useFormValidation.
// - Обработку загрузки нескольких файлов с проверкой их количества и общего размера.
// - Предпросмотр изображений при наведении на имя файла.
// - Автоматическое заполнение полей данными авторизованного пользователя.
// - Отправку данных формы, включая файлы и выбранные референсы, на сервер.
// - ИСПОЛЬЗУЕТ ГЛОБАЛЬНОЕ ХРАНИЛИЩЕ ДЛЯ ФАЙЛОВ, ЧТОБЫ ОНИ НЕ ПРОПАДАЛИ.

import { reactive, ref, computed, watch } from 'vue';
import BaseButton from '@/components/ui/BaseButton.vue';
import { useAuth } from '@/composables/useAuth.js';
import { useReferencesStore } from '@/stores/references.js';
import { useNotificationStore } from '@/stores/notifications.js';
import { useFormValidation } from '@/composables/useFormValidation.js';
// --- ИЗМЕНЕНИЕ: Импортируем новое хранилище ---
import { useFormStateStore } from '@/stores/formState.js';

const props = defineProps({ promoCode: { type: String, default: '' } });
const { user } = useAuth();
const referencesStore = useReferencesStore();
const notificationStore = useNotificationStore();
// --- ИЗМЕНЕНИЕ: Инициализируем новое хранилище ---
const formStateStore = useFormStateStore();

const formData = reactive({
  name: '',
  phone: '',
  email: '',
  company: '',
  task: '',
  promo: '',
});
const validationFields = ['name', 'phone', 'email', 'task'];
const { errors, validateField, validateForm, formatPhoneInput } =
  useFormValidation(formData, validationFields);

const isSubmitting = ref(false);
const hoveredFileUrl = ref(null);
const previewStyle = ref({});

// --- ИЗМЕНЕНИЕ: Теперь `files` это computed-свойство, которое читает данные из хранилища ---
const files = computed(() => formStateStore.calculationFormFiles);

const handleFileMouseEnter = (event, file) => {
  if (file.type.startsWith('image/')) {
    const rect = event.currentTarget.getBoundingClientRect();
    hoveredFileUrl.value = URL.createObjectURL(file);
    previewStyle.value = { top: `${rect.top}px`, left: `${rect.right + 15}px` };
  }
};
const handleFileMouseLeave = () => {
  if (hoveredFileUrl.value) {
    URL.revokeObjectURL(hoveredFileUrl.value);
    hoveredFileUrl.value = null;
  }
};
const handleFileUpload = (event) => {
  const target = event.target;
  if (!target.files) return;
  const newFiles = Array.from(target.files);
  const MAX_FILES = 10;
  const MAX_TOTAL_SIZE = 100 * 1024 * 1024;
  if (files.value.length + newFiles.length > MAX_FILES) {
    notificationStore.showNotification(
      `Вы можете загрузить не более ${MAX_FILES} файлов.`,
      'error'
    );
    target.value = '';
    return;
  }
  const currentSize = files.value.reduce((acc, file) => acc + file.size, 0);
  const newSize = newFiles.reduce((acc, file) => acc + file.size, 0);
  if (currentSize + newSize > MAX_TOTAL_SIZE) {
    notificationStore.showNotification(
      `Общий размер файлов не должен превышать 100 МБ.`,
      'error'
    );
    target.value = '';
    return;
  }

  // --- ИЗМЕНЕНИЕ: Используем действие из хранилища для добавления файлов ---
  formStateStore.addCalculationFiles(newFiles);
  target.value = '';
};

const removeFile = (index) => {
  if (hoveredFileUrl.value) {
    URL.revokeObjectURL(hoveredFileUrl.value);
    hoveredFileUrl.value = null;
  }
  // --- ИЗМЕНЕНИЕ: Используем действие из хранилища для удаления файла ---
  formStateStore.removeCalculationFile(index);
};

watch(
  () => props.promoCode,
  (newPromo) => {
    if (newPromo) formData.promo = newPromo;
  },
  { immediate: true }
);
watch(
  user,
  (currentUser) => {
    if (currentUser) {
      if (!formData.name) formData.name = currentUser.displayName || '';
      if (!formData.email) formData.email = currentUser.email || '';
    }
  },
  { immediate: true }
);

const isFormValid = computed(() => {
  const allFieldsFilled = validationFields.every((field) => !!formData[field]);
  const noErrors = validationFields.every((field) => !errors[field]);
  return allFieldsFilled && noErrors;
});

const handleSubmit = async () => {
  if (!validateForm(validationFields)) {
    notificationStore.showNotification(
      'Пожалуйста, исправьте ошибки в форме.',
      'error'
    );
    return;
  }
  isSubmitting.value = true;
  const data = new FormData();
  for (const key in formData) {
    data.append(key, formData[key]);
  }

  if (files.value.length > 0) {
    files.value.forEach((file) => {
      data.append('files', file);
    });
  }
  if (referencesStore.items.length > 0) {
    referencesStore.items.forEach((refUrl) => {
      data.append('references', refUrl);
    });
  }

  try {
    const response = await fetch('/api/submit-form', {
      method: 'POST',
      body: data,
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Ошибка сервера');
    notificationStore.showNotification(result.message, 'success');
    Object.keys(formData).forEach((key) => (formData[key] = ''));
    // --- ИЗМЕНЕНИЕ: Очищаем файлы в хранилище ---
    formStateStore.clearCalculationFiles();
    referencesStore.clearReferences();
  } catch (error) {
    console.error('Ошибка отправки формы:', error);
    notificationStore.showNotification(
      error.message || 'Ошибка соединения с сервером.',
      'error'
    );
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<template>
  <div class="form-wrapper bg-panda-white p-4 md:p-16">
    <div class="form-info">
      <h2 class="text-h2-panda font-bold">Расчёт<br />стоимости</h2>
      <p class="text-h5-panda font-semibold">
        С вами свяжется наш менеджер<br />в ближайшее время. Спасибо, что<br />обратились
        в наше печатное агентство!
      </p>

      <div class="mt-auto pt-4">
        <div v-if="referencesStore.items.length > 0" class="references-section">
          <h3 class="section-title">Выбранные референсы</h3>
          <div class="references-list">
            <div
              v-for="refUrl in referencesStore.items"
              :key="refUrl"
              class="reference-item"
            >
              <img :src="refUrl" alt="Референс" class="reference-image" />
              <button
                @click="referencesStore.toggleReference(refUrl)"
                class="remove-reference-button"
                title="Убрать референс"
              >
                &times;
              </button>
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
              <button
                @click="removeFile(index)"
                class="remove-file-button"
                title="Удалить файл"
              >
                &times;
              </button>
            </div>
          </div>
        </div>

        <label for="file-upload" class="upload-button">
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
              files.length > 0
                ? `Добавить еще (${files.length} из 10)`
                : 'Прикрепить макет'
            }}
          </span>
        </label>
        <input
          id="file-upload"
          type="file"
          class="hidden"
          @change="handleFileUpload"
          multiple
        />
        <p class="upload-caption">до 10 файлов, не более 100 МБ</p>
      </div>
    </div>
    <div class="form-body">
      <form
        @submit.prevent="handleSubmit"
        novalidate
        class="flex flex-col gap-2"
      >
        <div class="form-group">
          <div class="relative">
            <input
              type="text"
              id="name"
              required
              v-model.trim="formData.name"
              @input="validateField('name')"
              class="form-input peer"
              :class="{ 'border-panda-orange': errors.name }"
              placeholder=" "
            />
            <label
              for="name"
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
              id="phone"
              required
              v-model="formData.phone"
              @input="formatPhoneInput"
              class="form-input peer"
              :class="{ 'border-panda-orange': errors.phone }"
              placeholder=" "
            />
            <label
              for="phone"
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

        <div class="form-group">
          <div class="relative">
            <input
              type="email"
              id="email"
              required
              v-model.trim="formData.email"
              @input="validateField('email')"
              class="form-input peer"
              :class="{ 'border-panda-orange': errors.email }"
              placeholder=" "
            />
            <label
              for="email"
              class="form-label"
              :class="{ '!text-panda-orange': errors.email }"
            >
              <span v-if="errors.email">{{ errors.email }}</span>
              <span v-else>Email</span>
            </label>
            <span
              class="input-border"
              :class="{ 'bg-panda-orange w-full': errors.email }"
            ></span>
          </div>
        </div>

        <div class="form-group">
          <div class="relative">
            <input
              type="text"
              id="company"
              v-model.trim="formData.company"
              class="form-input peer"
              placeholder=" "
            />
            <label for="company" class="form-label">Компания</label>
            <span class="input-border"></span>
          </div>
        </div>

        <div class="form-group">
          <div class="relative">
            <textarea
              id="task"
              required
              v-model.trim="formData.task"
              @input="validateField('task')"
              class="form-input peer min-h-[6.25rem] resize-y"
              :class="{ 'border-panda-orange': errors.task }"
              placeholder=" "
            ></textarea>
            <label
              for="task"
              class="form-label"
              :class="{ '!text-panda-orange': errors.task }"
            >
              <span v-if="errors.task">{{ errors.task }}</span>
              <span v-else>Опишите задачу</span>
            </label>
            <span
              class="input-border"
              :class="{ 'bg-panda-orange w-full': errors.task }"
            ></span>
          </div>
        </div>

        <div class="form-group">
          <div class="relative">
            <input
              type="text"
              id="promo"
              v-model.trim="formData.promo"
              class="form-input peer"
              placeholder=" "
            />
            <label for="promo" class="form-label">Промокод</label>
            <span class="input-border"></span>
          </div>
        </div>

        <BaseButton
          type="submit"
          :disabled="isSubmitting || !isFormValid"
          class="mt-4"
          variant="fill-orange"
        >
          <div v-if="isSubmitting" class="flex items-center justify-center">
            <svg
              class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              ></circle>
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Отправка...
          </div>
          <span v-else>Отправить заявку</span>
        </BaseButton>
      </form>
    </div>
  </div>

  <Teleport to="body">
    <transition name="preview">
      <div
        v-if="hoveredFileUrl"
        class="file-preview-window"
        :style="previewStyle"
      >
        <img
          :src="hoveredFileUrl"
          alt="Предпросмотр файла"
          class="file-preview-image"
        />
      </div>
    </transition>
  </Teleport>
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
  transform-origin: top left;
}
.file-preview-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
}
.preview-enter-active,
.preview-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}
.preview-enter-from,
.preview-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
.references-section,
.file-list-section {
  margin-bottom: 1.5rem;
}
.section-title {
  font-family: 'Gilroy-SemiBold', sans-serif;
  color: #131c26;
  margin-bottom: 0.75rem;
  font-size: 1rem;
}
.references-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(4.5rem, 1fr));
  gap: 0.5rem;
  max-height: 10.25rem;
  overflow-y: auto;
  padding: 0.5rem;
  background-color: #f7f7f7;
  border-radius: 0.75rem;
}
.reference-item {
  position: relative;
  aspect-ratio: 1 / 1;
  border-radius: 0.5rem;
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
  top: 0.25rem;
  right: 0.25rem;
  width: 1.25rem;
  height: 1.25rem;
  border-radius: 50%;
  background-color: rgba(19, 28, 38, 0.7);
  color: white;
  border: none;
  cursor: pointer;
  font-size: 0.875rem;
  line-height: 1.25rem;
  text-align: center;
  opacity: 0;
  transition: all 0.2s;
  backdrop-filter: blur(0.125rem);
}
.reference-item:hover .remove-reference-button {
  opacity: 1;
}
.remove-reference-button:hover {
  background-color: #f15f31;
  transform: scale(1.1);
}
.file-list {
  max-height: 7.8125rem;
  overflow-y: auto;
  padding-right: 0.5rem;
}
.file-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 0.75rem;
  background-color: #f7f7f7;
  border-radius: 0.5rem;
  margin-bottom: 0.5rem;
  transition: background-color 0.2s;
}
.file-item:hover {
  background-color: #e3e3e3;
}
.file-item:last-child {
  margin-bottom: 0;
}
.file-name {
  font-size: 0.875rem;
  color: #131c26;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding-right: 0.625rem;
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
  margin-left: 0.5rem;
  flex-shrink: 0;
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
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.upload-caption {
  font-size: 0.8125rem;
  color: #8f8f8f;
  margin-top: 0.5rem;
  text-align: center;
}
.form-wrapper {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2.5rem;
}
@media (min-width: 48rem) {
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
