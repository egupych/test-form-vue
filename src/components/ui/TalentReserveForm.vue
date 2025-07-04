<script setup>
import { ref, reactive, watch } from 'vue';
import BaseButton from '@/components/ui/BaseButton.vue';
import SectionHeader from '@/components/ui/SectionHeader.vue';

// --- [НОВОЕ] Определяем пропсы ---
// Компонент будет принимать извне название вакансии
const props = defineProps({
  initialPosition: {
    type: String,
    default: ''
  }
});

// --- Логика формы (полностью перенесена) ---
const MAX_FILES = 1;
const MAX_TOTAL_SIZE = 15 * 1024 * 1024; // 15 MB

const formData = reactive({
  desiredPosition: '',
  name: '',
  phone: '',
});
const files = ref([]);
const hoveredFileUrl = ref(null);
const previewStyle = ref({});

// --- [НОВОЕ] Отслеживаем изменения в пропсах ---
// Если снаружи изменится initialPosition (например, при клике на "Откликнуться"),
// мы обновим значение в поле формы.
watch(() => props.initialPosition, (newVal) => {
  formData.desiredPosition = newVal;
});

const handleFileUpload = (event) => {
  const target = event.target;
  if (target && target.files) {
    const newFiles = Array.from(target.files);
    if (files.value.length + newFiles.length > MAX_FILES) {
      alert(`Вы можете загрузить не более ${MAX_FILES} файла.`);
      target.value = '';
      return;
    }
    const currentSize = files.value.reduce((acc, file) => acc + file.size, 0);
    const newSize = newFiles.reduce((acc, file) => acc + file.size, 0);
    if (currentSize + newSize > MAX_TOTAL_SIZE) {
      alert(`Размер файла не должен превышать 15 МБ.`);
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
  if (!formData.name || !formData.phone) {
    alert('Пожалуйста, заполните имя и телефон.');
    return;
  }
  alert(`Спасибо за отклик, ${formData.name}! Мы свяжемся с вами.`);
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
                    <input type="text" placeholder="Ваше имя" required v-model.trim="formData.name">
                    <span class="input-border"></span>
                  </div>
                </div>
                <div class="form-group">
                  <div class="form-control">
                    <input type="tel" placeholder="Телефон" required v-model="formData.phone">
                    <span class="input-border"></span>
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
                    <button @click="removeFile(index)" class="remove-file-button">&times;</button>
                  </div>
                </div>
                <label for="file-upload" class="upload-button">
                  <svg xmlns="http://www.w3.org/2000/svg" class="upload-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                  <span class="upload-text">
                    {{ files.length > 0 ? 'Файл прикреплен' : 'Прикрепить резюме' }}
                  </span>
                </label>
                <input id="file-upload" type="file" class="hidden" @change="handleFileUpload" accept=".pdf,.doc,.docx,image/*">
                <p class="upload-caption">до 1 файла, не более 15 МБ</p>
                <BaseButton type="submit" class="mt-6 w-full">
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
.file-preview-window {
  position: fixed;
  z-index: 9999;
  width: 250px;
  height: auto;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
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
  margin-bottom: 12px;
  max-height: 125px;
  overflow-y: auto;
  padding-right: 4px;
}
.file-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  background-color: #f0f0f0;
  border-radius: 8px;
  margin-bottom: 8px;
}
.file-name {
  font-size: 14px;
  color: #131C26;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding-right: 8px;
}
.remove-file-button {
  background: none;
  border: none;
  color: #8F8F8F;
  cursor: pointer;
  font-size: 20px;
  line-height: 1;
  padding: 0 4px;
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
  padding: 16px;
  border: 2px dashed #E3E3E3;
  background-color: #F7F7F7;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: 'Gilroy-Semibold', sans-serif;
  color: #8F8F8F;
  border-radius: 16px;
}
.upload-button:hover {
  border-color: #F15F31;
  color: #F15F31;
  background-color: #fff;
}
.upload-icon {
  width: 24px;
  height: 24px;
  margin-right: 8px;
}
.upload-text {
  font-size: 16px;
}
.upload-caption {
  font-size: 12px;
  color: #8F8F8F;
  margin-top: 8px;
  text-align: center;
}
.form-wrapper {
  display: grid;
  grid-template-columns: 1fr;
  gap: 40px;
}

@media (min-width: 1024px) {
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
</style>