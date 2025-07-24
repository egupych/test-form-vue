import { reactive } from 'vue';

/**
 * Composable для валидации форм.
 * @param {object} formData - Реактивный объект с данными формы.
 * @param {string[]} fieldsToValidate - Массив названий полей для инициализации ошибок.
 * @returns {object} - Функции и состояние для управления валидацией.
 */
export function useFormValidation(formData, fieldsToValidate = []) {
  const errors = reactive({});

  // Инициализируем все поля ошибок, чтобы Vue мог отслеживать их реактивность
  fieldsToValidate.forEach((field) => {
    errors[field] = '';
  });

  // Регулярное выражение для проверки корректности email
  const validateEmail = (email) =>
    /^[a-zA-Z0-9]([a-zA-Z0-9._-]*[a-zA-Z0-9])?@[a-zA-Z0-9]([a-zA-Z0-9.-]*[a-zA-Z0-9])?\.[a-zA-Z]{2,}$/.test(
      String(email).toLowerCase().trim()
    );

  // Проверка номера телефона по нескольким распространенным форматам
  const validatePhone = (phone) => {
    const cleanPhone = phone.replace(/[\s\-()]/g, '');
    return [
      /^\+7[0-9]{10}$/,
      /^8[0-9]{10}$/,
      /^7[0-9]{10}$/,
      /^\+[1-9][0-9]{7,14}$/,
    ].some((pattern) => pattern.test(cleanPhone));
  };

  // Валидация конкретного поля
  const validateField = (field) => {
    errors[field] = '';
    const value = formData[field];
    switch (field) {
      case 'name':
        if (!value) errors.name = 'Пожалуйста, введите ваше имя';
        else if (value.length < 2)
          errors.name = 'Имя должно содержать минимум 2 символа';
        break;
      case 'phone':
        if (!value) errors.phone = 'Пожалуйста, введите номер телефона';
        else if (!validatePhone(value))
          errors.phone = 'Введите корректный номер телефона';
        break;
      case 'email':
        if (!value) errors.email = 'Пожалуйста, введите email адрес';
        else if (!validateEmail(value))
          errors.email = 'Введите корректный email адрес';
        break;
      case 'task':
        if (!value) errors.task = 'Пожалуйста, опишите задачу';
        else if (value.length < 10)
          errors.task = 'Описание должно быть не менее 10 символов';
        break;
    }
    return !errors[field];
  };

  // Автоматическое форматирование номера телефона при вводе
  const formatPhoneInput = () => {
    let value = formData.phone.replace(/\D/g, '');
    if (value.length > 0) {
      if (value.startsWith('8')) value = '7' + value.slice(1);
      if (value.startsWith('7')) value = '+7' + value.slice(1);
      else if (!value.startsWith('+')) value = '+' + value;
      if (value.startsWith('+7') && value.length > 2) {
        const digits = value.slice(2);
        if (digits.length <= 3) value = `+7 (${digits}`;
        else if (digits.length <= 6)
          value = `+7 (${digits.slice(0, 3)}) ${digits.slice(3)}`;
        else if (digits.length <= 8)
          value = `+7 (${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
        else
          value = `+7 (${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 8)}-${digits.slice(8, 10)}`;
      }
    }
    formData.phone = value;
    validateField('phone');
  };

  // Проверка всей формы
  const validateForm = (fields) => {
    return fields.every((field) => validateField(field));
  };

  return {
    errors,
    validateField,
    validateForm,
    formatPhoneInput,
  };
}
