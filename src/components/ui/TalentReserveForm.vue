<script setup>
// Файл: TalentReserveForm.vue
// Этот скрипт предназначен для формы "Кадровый резерв".
// Его основные задачи:
// - Получение начальной желаемой должности через props.
// - Сбор данных от пользователя (должность, имя, телефон).
// - Валидация обязательных полей с помощью useFormValidation.
// - Загрузка файла резюме с предпросмотром для изображений.
// - Отправка данных на бэкенд-сервер по адресу /api/submit-application.

import { ref, reactive, watch, computed } from 'vue';
import BaseButton from '@/components/ui/BaseButton.vue';
import SectionHeader from '@/components/ui/SectionHeader.vue';
import { useNotificationStore } from '@/stores/notifications.js';
import { useFormValidation } from '@/composables/useFormValidation.js';

const props = defineProps({
  initialPosition: {
    type: String,
    default: '',
  },
});

const notificationStore = useNotificationStore();

const formData = reactive({
  desiredPosition: '',
  name: '',
  phone: '',
});
const validationFields = ['name', 'phone'];
const { errors, validateField, validateForm, formatPhoneInput } =
  useFormValidation(formData, validationFields);
const files = ref([]);
const isSubmitting = ref(false);
const hoveredFileUrl = ref(null);
const previewStyle = ref({});

watch(
  () => props.initialPosition,
  (newVal) => {
    formData.desiredPosition = newVal;
  },
  { immediate: true }
);

const isFormValid = computed(() => {
  const allFieldsFilled = validationFields.every((field) => !!formData[field]);
  const noErrors = validationFields.every((field) => !errors[field]);
  return allFieldsFilled && noErrors && files.value.length > 0;
});

const handleFileUpload = (event) => {
  const target = event.target;
  if (target && target.files) {
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
  }
  target.value = '';
};

const removeFile = (index) => {
  if (hoveredFileUrl.value) {
    URL.revokeObjectURL(hoveredFileUrl.value);
    hoveredFileUrl.value = null;
  }
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

// --- ИЗМЕНЕННАЯ ФУНКЦИЯ ОТПРАВКИ ---
const submitApplication = async () => {
  if (!validateForm(validationFields) || files.value.length === 0) {
    notificationStore.showNotification(
      'Пожалуйста, заполните имя, телефон и прикрепите резюме.',
      'error'
    );
    return;
  }

  isSubmitting.value = true;
  const data = new FormData();
  data.append('name', formData.name);
  data.append('phone', formData.phone);
  data.append('desiredPosition', formData.desiredPosition || 'Кадровый резерв');
  data.append('resume', files.value[0]);

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
    // Очистка формы
    formData.desiredPosition = '';
    formData.name = '';
    formData.phone = '';
    files.value = [];
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
  <section class="talent-reserve-form">
    <SectionHeader class="gap-container"> Кадровый резерв </SectionHeader>

    <div class="form-wrapper bg-white p-4 md:p-16">
      <div class="form-info">
        <h3 class="text-h2-panda font-bold">Нет подходящей вакансии?</h3>
        <p class="text-h5-panda font-semibold">
          Оставьте заявку! Мы постоянно растём и ищем талантливых людей. Ваше
          резюме попадёт в нашу базу, и как только появится подходящая позиция,
          мы с вами свяжемся.
        </p>
        <ul class="space-y-4 pt-4">
          <li class="flex items-start gap-3">
            <svg
              class="w-6 h-6 text-panda-orange flex-shrink-0 mt-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span
              ><b>Честная и быстрая оценка.</b> Мы рассмотрим ваше резюме в
              течение 3 рабочих дней.</span
            >
          </li>
          <li class="flex items-start gap-3">
            <svg
              class="w-6 h-6 text-panda-orange flex-shrink-0 mt-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span
              ><b>Полная конфиденциальность.</b> Ваши данные будут доступны
              только HR-отделу.</span
            >
          </li>
          <li class="flex items-start gap-3">
            <svg
              class="w-6 h-6 text-panda-orange flex-shrink-0 mt-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span
              ><b>Всегда на связи.</b> Мы обязательно дадим обратную связь,
              независимо от нашего решения.</span
            >
          </li>
        </ul>
      </div>
      <div class="form-body">
        <form
          @submit.prevent="submitApplication"
          novalidate
          class="flex flex-col h-full"
        >
          <div class="flex flex-col gap-2">
            <div class="form-group">
              <div class="relative">
                <input
                  type="text"
                  id="desiredPosition"
                  v-model.trim="formData.desiredPosition"
                  class="form-input peer"
                  placeholder=" "
                />
                <label for="desiredPosition" class="form-label"
                  >Желаемая вакансия</label
                >
                <span class="input-border"></span>
              </div>
            </div>
            <div class="form-group">
              <div class="relative">
                <input
                  type="text"
                  id="talentName"
                  required
                  v-model.trim="formData.name"
                  @input="validateField('name')"
                  class="form-input peer"
                  :class="{ 'border-panda-orange': errors.name }"
                  placeholder=" "
                />
                <label
                  for="talentName"
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
                  id="talentPhone"
                  required
                  v-model="formData.phone"
                  @input="formatPhoneInput"
                  class="form-input peer"
                  :class="{ 'border-panda-orange': errors.phone }"
                  placeholder=" "
                />
                <label
                  for="talentPhone"
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
                @mouseenter="handleFileMouseEnter($event, file)"
                @mouseleave="handleFileMouseLeave"
              >
                <span class="file-name">{{ file.name }}</span>
                <button @click="removeFile(index)" class="remove-file-button">
                  &times;
                </button>
              </div>
            </div>
            <label for="talent-file-upload" class="upload-button">
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
                {{ files.length > 0 ? 'Файл прикреплен' : 'Прикрепить резюме' }}
              </span>
            </label>
            <input
              id="talent-file-upload"
              type="file"
              class="hidden"
              @change="handleFileUpload"
              accept=".pdf,.doc,.docx,image/*"
            />
            <p class="upload-caption">до 1 файла, не более 15 МБ</p>
            <BaseButton
              type="submit"
              :disabled="isSubmitting || !isFormValid"
              class="mt-6 w-full"
              variant="fill-black"
            >
              Отправить
            </BaseButton>
          </div>
        </form>
      </div>
    </div>
  </section>

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
