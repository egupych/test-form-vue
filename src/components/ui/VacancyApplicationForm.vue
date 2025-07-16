<script setup>
import { ref, reactive, watch } from 'vue';
import BaseButton from '@/components/ui/BaseButton.vue';

// Компонент будет принимать извне название вакансии
const props = defineProps({
  positionTitle: {
    type: String,
    required: true // Делаем его обязательным
  }
});

// --- Логика формы ---
const MAX_FILES = 1;
const MAX_TOTAL_SIZE = 15 * 1024 * 1024; // 15 MB

const formData = reactive({
  name: '',
  phone: '',
});
const files = ref([]);
const isSubmitting = ref(false);

// Сразу устанавливаем значение вакансии при инициализации
const desiredPosition = ref(props.positionTitle);
watch(() => props.positionTitle, (newVal) => {
  desiredPosition.value = newVal;
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
    files.value = newFiles; // Заменяем, а не добавляем, т.к. файл один
  }
  target.value = '';
};

const removeFile = (index) => {
  files.value.splice(index, 1);
};


const handleSubmit = () => {
  if (!formData.name || !formData.phone) {
    alert('Пожалуйста, заполните имя и телефон.');
    return;
  }
  if (files.value.length === 0) {
    alert('Пожалуйста, прикрепите ваше резюме.');
    return;
  }
  
  isSubmitting.value = true;
  console.log({
    vacancy: desiredPosition.value,
    ...formData,
    resume: files.value[0]
  });

  // Имитация отправки
  setTimeout(() => {
    alert(`Спасибо за отклик на вакансию «${desiredPosition.value}», ${formData.name}! Мы свяжемся с вами.`);
    // Тут можно добавить событие, чтобы родительский компонент закрыл попап
    isSubmitting.value = false;
  }, 1500);
};
</script>

<template>
  <div class="form-wrapper bg-white p-10 md:p-16">
      <div class="form-info">
        <h3 class="text-h2-panda font-bold">Отклик на вакансию</h3>
        <p class="text-h5-panda font-semibold">
          Вы откликаетесь на вакансию <br>
          <span class="text-panda-orange">«{{ positionTitle }}»</span>
        </p>
        <p class="text-body-panda text-dark-gray mt-4">
          Пожалуйста, заполните поля справа и прикрепите резюме. Мы рассмотрим и свяжемся с вами.
        </p>
      </div>
      <div class="form-body">
          <form @submit.prevent="handleSubmit" novalidate class="flex flex-col h-full">
              <div class="flex flex-col gap-2">
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
                  >
                    <span class="file-name">{{ file.name }}</span>
                    <button @click="removeFile(index)" class="remove-file-button">&times;</button>
                  </div>
                </div>
                <label for="resume-upload" class="upload-button">
                  <svg xmlns="http://www.w3.org/2000/svg" class="upload-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                  <span class="upload-text">
                    {{ files.length > 0 ? 'Резюме прикреплено' : 'Прикрепить резюме' }}
                  </span>
                </label>
                <input id="resume-upload" type="file" class="hidden" @change="handleFileUpload" accept=".pdf,.doc,.docx">
                <p class="upload-caption">.pdf, .doc, .docx, не более 15 МБ</p>
                <BaseButton type="submit" :disabled="isSubmitting" class="mt-6 w-full">
                  <span v-if="!isSubmitting">Отправить отклик</span>
                  <span v-else>Отправка...</span>
                </BaseButton>
              </div>
          </form>
      </div>
    </div>
</template>

<style scoped>
/* Стили скопированы из TalentReserveForm для консистентности */
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
input:focus ~ .input-border {
  width: 100%;
}
</style>