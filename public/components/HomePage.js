import { ref, reactive, computed } from 'vue';
import FooterSection from './FooterSection.js'; // Импорт футера

const HomePage = {
    components: {
        FooterSection // Регистрируем футер как дочерний компонент
    },
    setup() {
        const formData = reactive({
            name: '', phone: '', email: '', company: '', task: '', promo: ''
        });
        const errors = reactive({
            name: '', phone: '', email: '', task: ''
        });
        const isSubmitting = ref(false);
        const message = ref('');
        const messageType = ref('success');

        const isFormValid = computed(() => {
            return (
                formData.name !== '' && !errors.name &&
                formData.phone !== '' && !errors.phone &&
                formData.email !== '' && !errors.email &&
                formData.task !== '' && !errors.task
            );
        });

        const showMessage = (msg, type = 'success') => {
            message.value = msg;
            messageType.value = type;
            setTimeout(() => {
                message.value = '';
                messageType.value = 'success';
            }, 5000);
        };

        const validateEmail = (email) => {
            const re = /^[a-zA-Z0-9]([a-zA-Z0-9._-]*[a-zA-Z0-9])?@[a-zA-Z0-9]([a-zA-Z0-9.-]*[a-zA-Z0-9])?\.[a-zA-Z]{2,}$/;
            return re.test(String(email).toLowerCase().trim());
        };

        const validatePhone = (phone) => {
            const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
            const patterns = [
                /^\+7[0-9]{10}$/,
                /^8[0-9]{10}$/,
                /^7[0-9]{10}$/,
                /^\+[1-9][0-9]{7,14}$/
            ];
            return patterns.some(pattern => pattern.test(cleanPhone));
        };

        const formatPhoneInput = () => {
            let value = formData.phone.replace(/\D/g, '');

            if (value.length > 0) {
                if (value.startsWith('8')) {
                    value = '7' + value.slice(1);
                }

                if (value.startsWith('7')) {
                    value = '+7' + value.slice(1);
                } else if (!value.startsWith('+')) {
                    value = '+' + value;
                }

                if (value.startsWith('+7') && value.length > 2) {
                    const digits = value.slice(2);
                    if (digits.length <= 3) {
                        value = '+7 (' + digits;
                    } else if (digits.length <= 6) {
                        value = '+7 (' + digits.slice(0, 3) + ') ' + digits.slice(3);
                    } else if (digits.length <= 8) {
                        value = '+7 (' + digits.slice(0, 3) + ') ' + digits.slice(3, 6) + '-' + digits.slice(6);
                    } else {
                        value = '+7 (' + digits.slice(0, 3) + ') ' + digits.slice(3, 6) + '-' + digits.slice(6, 8) + '-' + digits.slice(8, 10);
                    }
                }
            }
            formData.phone = value;
            validateField('phone');
        };

        const validateField = (field) => {
            let isValid = true;
            errors[field] = '';

            const value = formData[field];

            switch (field) {
                case 'name':
                    if (value === '') { errors.name = 'Пожалуйста, введите ваше имя'; isValid = false; }
                    else if (value.length < 2) { errors.name = 'Имя должно содержать минимум 2 символа'; isValid = false; }
                    break;
                case 'phone':
                    if (value === '') { errors.phone = 'Пожалуйста, введите номер телефона'; isValid = false; }
                    else if (!validatePhone(value)) { errors.phone = 'Введите корректный номер телефона'; isValid = false; }
                    break;
                case 'email':
                    if (value === '') { errors.email = 'Пожалуйста, введите email адрес'; isValid = false; }
                    else if (!validateEmail(value)) { errors.email = 'Введите корректный email адрес'; isValid = false; }
                    break;
                case 'task':
                    if (value === '') { errors.task = 'Пожалуйста, опишите задачу'; isValid = false; }
                    else if (value.length < 10) { errors.task = 'Описание задачи должно содержать минимум 10 символов'; isValid = false; }
                    break;
            }
            return isValid;
        };

        const clearError = (field) => {
            if (errors[field]) { errors[field] = ''; }
        };

        const validateForm = () => {
            let allValid = true;
            ['name', 'phone', 'email', 'task'].forEach(field => {
                if (!validateField(field)) { allValid = false; }
            });
            return allValid;
        };

        const submitFormToServer = async (data) => {
            try {
                const response = await fetch('/api/submit-form', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
                const result = await response.json();
                if (response.ok && result.success) {
                    return { success: true, message: result.message };
                } else {
                    if (result.errors && Array.isArray(result.errors)) {
                        result.errors.forEach(error => {
                            if (errors.hasOwnProperty(error.path)) { errors[error.path] = error.msg; }
                        });
                    }
                    return { success: false, message: result.message || 'Ошибка отправки формы' };
                }
            } catch (error) {
                console.error('Ошибка сети:', error);
                return { success: false, message: 'Ошибка соединения с сервером. Проверьте интернет-подключение' };
            }
        };

        const handleSubmit = async () => {
            if (!validateForm()) {
                console.log('Форма содержит ошибки.');
                showMessage('Пожалуйста, исправьте ошибки в форме.', 'error');
                return;
            }

            isSubmitting.value = true;
            message.value = '';

            const result = await submitFormToServer(formData);

            if (result.success) {
                showMessage(result.message);
                formData.name = ''; formData.phone = ''; formData.email = '';
                formData.company = ''; formData.task = ''; formData.promo = '';
                Object.keys(errors).forEach(key => errors[key] = '');
            } else {
                showMessage(result.message, 'error');
            }
            isSubmitting.value = false;
        };

        return {
            formData, errors, isSubmitting, message, messageType, isFormValid,
            formatPhoneInput, validateField, clearError, handleSubmit
        };
    },
    template: `
        <div class="main-container bg-panda-white pb-0">
            <h1 class="font-bold text-panda-black text-4xl mb-4">Добро пожаловать!</h1>
            <p class="text-xl text-dark-gray leading-relaxed">
                Это главная страница вашего корпоративного сайта. Здесь вы можете рассказать о вашей компании,
                предоставить общую информацию и привлечь внимание посетителей.
            </p>
            <p class="text-xl text-dark-gray leading-relaxed mt-4">
                Используйте навигацию выше, чтобы перейти к различным разделам.
            </p>
            <div class="mt-8 p-6 bg-light-gray rounded-lg">
                <h3 class="font-semibold text-panda-black text-2xl mb-3">Наши преимущества:</h3>
                <ul class="list-disc list-inside text-dark-gray text-lg">
                    <li>Индивидуальный подход к каждому клиенту.</li>
                    <li>Высокое качество печати.</li>
                    <li>Быстрое выполнение заказов.</li>
                    <li>Гибкая система скидок.</li>
                </ul>
            </div>
        </div>

        <!-- Форма "Расчет стоимости" теперь на главной странице -->
        <div class="main-container bg-panda-white mt-8">
            <div class="form-wrapper">
                <div class="form-info">
                    <h1>Расчёт<br>стоимости</h1>
                    <p>С вами свяжется наш менеджер<br>в ближайшее время. Спасибо, что<br>обратились в наше печатное агентство!</p>
                </div>
                <div class="form-body">
                    <form @submit.prevent="handleSubmit" novalidate>
                        <div class="form-group">
                            <input type="text" id="name" name="name" placeholder="Ваше имя" required
                                v-model.trim="formData.name"
                                @blur="validateField('name')"
                                @input="clearError('name')"
                                :class="{ 'error': errors.name }">
                            <div class="error-message" :class="{ 'show': errors.name }">{{ errors.name }}</div>
                        </div>
                        <div class="form-group">
                            <input type="tel" id="phone" name="phone" placeholder="Телефон" required
                                v-model="formData.phone"
                                @input="formatPhoneInput"
                                @blur="validateField('phone')"
                                :class="{ 'error': errors.phone }">
                            <div class="error-message" :class="{ 'show': errors.phone }">{{ errors.phone }}</div>
                        </div>
                        <div class="form-group">
                            <input type="email" id="email" name="email" placeholder="@email" required
                                v-model.trim="formData.email"
                                @blur="validateField('email')"
                                @input="clearError('email')"
                                :class="{ 'error': errors.email }">
                            <div class="error-message" :class="{ 'show': errors.email }">{{ errors.email }}</div>
                        </div>
                        <div class="form-group">
                            <input type="text" id="company" name="company" placeholder="Компания"
                                v-model.trim="formData.company">
                            <div class="error-message"></div>
                        </div>
                        <div class="form-group">
                            <textarea id="task" name="task" placeholder="Опишите задачу" required
                                v-model.trim="formData.task"
                                @blur="validateField('task')"
                                @input="clearError('task')"
                                :class="{ 'error': errors.task }"></textarea>
                            <div class="error-message" :class="{ 'show': errors.task }">{{ errors.task }}</div>
                        </div>
                        <div class="form-group">
                            <input type="text" id="promo" name="promo" placeholder="Промокод"
                                v-model.trim="formData.promo">
                            <div class="error-message"></div>
                        </div>
                        <button type="submit" :disabled="isSubmitting || !isFormValid"
                            :class="{ 'opacity-60 cursor-not-allowed': isSubmitting || !isFormValid }">
                            {{ isSubmitting ? 'Отправляется...' : 'Отправить заявку' }}
                        </button>
                    </form>
                </div>
            </div>
            <div id="success-message" class="success-message" :class="{ 'show': message }"
                :style="{ backgroundColor: messageType === 'success' ? 'var(--panda-green)' : '#e74c3c' }">
                {{ message }}
            </div>
        </div>
        <FooterSection @navigateTo="$emit('navigateTo', $event)" />
    `
};

export default HomePage;
