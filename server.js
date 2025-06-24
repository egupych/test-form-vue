const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');
const nodemailer = require('nodemailer');
const path = require('path');
const fs = require('fs').promises;

// --- Начало: Загрузка и проверка переменных окружения ---
// Загружаем переменные из .env файла
require('dotenv').config();

// Проверяем наличие всех необходимых переменных окружения для отправки почты.
// Если какой-либо из них нет, сервер не запустится и выведет ошибку в консоль.
const requiredEnv = ['EMAIL_HOST', 'EMAIL_PORT', 'EMAIL_SECURE', 'EMAIL_USER', 'EMAIL_PASS', 'EMAIL_RECEIVER'];
for (const envVar of requiredEnv) {
    if (!process.env[envVar]) {
        console.error(`\x1b[31mFATAL ERROR: Environment variable ${envVar} is not defined in your .env file.\x1b[0m`);
        process.exit(1); // Завершаем процесс, если переменная не найдена
    }
}
// --- Конец: Загрузка и проверка переменных окружения ---

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware для безопасности
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: [
                "'self'", 
                "'unsafe-inline'", 
                "'unsafe-eval'", 
                "https://unpkg.com", 
                "https://cdn.tailwindcss.com", 
                "https://www.gstatic.com",
                "https://apis.google.com"
            ],
            styleSrc: [
                "'self'", 
                "'unsafe-inline'", 
                "https://cdn.tailwindcss.com", 
                "https://fonts.googleapis.com"
            ],
            fontSrc: ["'self'", "data:", "https://fonts.gstatic.com"],
            imgSrc: ["'self'", "data:", "https://placehold.co"],
            connectSrc: [
                "'self'", 
                "https://generativelanguage.googleapis.com", 
                "https://identitytoolkit.googleapis.com",
                "https://securetoken.googleapis.com",
                "https://firestore.googleapis.com",
                "https://www.googleapis.com",
                // Добавляем хост вашего почтового сервера, если это необходимо
                // `https://${process.env.EMAIL_HOST}` 
            ],
            objectSrc: ["'none'"],
            upgradeInsecureRequests: [],
        }
    }
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

// Ограничение частоты запросов
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: 'Слишком много запросов с вашего IP, попробуйте повторить позже.'
});
app.use('/api/', limiter);

// Статические файлы
app.use(express.static(path.join(__dirname, 'public')));


// --- Начало: Настройка и проверка Nodemailer ---
// Создаем "транспортер" для отправки писем с конфигурацией из .env
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT, 10), // Убедимся, что порт - это число
    secure: process.env.EMAIL_SECURE === 'true', // true для порта 465, false для других
    auth: {
        user: process.env.EMAIL_USER, // Ваш email
        pass: process.env.EMAIL_PASS, // Ваш пароль или пароль приложения
    },
    // Добавляем таймаут для подключения, чтобы не ждать вечно
    connectionTimeout: 10000, // 10 секунд
});

// Проверяем соединение с SMTP сервером при старте приложения
console.log('Verifying Nodemailer connection to SMTP server...');
transporter.verify((error, success) => {
    if (error) {
        console.error('\x1b[31m--- Nodemailer Configuration Error ---');
        console.error('Failed to connect to SMTP server. Please check your .env file settings.');
        console.error(`Host: ${process.env.EMAIL_HOST}, Port: ${process.env.EMAIL_PORT}, Secure: ${process.env.EMAIL_SECURE}`);
        console.error('Error details:', error);
        console.error('-------------------------------------\x1b[0m');
    } else {
        console.log('\x1b[32m✅ Nodemailer is configured correctly. Server is ready to send emails.\x1b[0m');
    }
});
// --- Конец: Настройка и проверка Nodemailer ---


// Маршрут для получения конфигурации Firebase
app.get('/api/firebase-config', (req, res) => {
    const firebaseConfig = {
        apiKey: process.env.FIREBASE_API_KEY,
        authDomain: process.env.FIREBASE_AUTH_DOMAIN,
        projectId: process.env.FIREBASE_PROJECT_ID,
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.FIREBASE_APP_ID,
        measurementId: process.env.FIREBASE_MEASUREMENT_ID
    };
    res.json(firebaseConfig);
});

// Маршрут для обработки отправки формы
app.post(
    '/api/submit-form',
    [
        // Правила валидации
        body('name').trim().notEmpty().withMessage('Имя не может быть пустым').isLength({ min: 2 }).withMessage('Имя должно содержать минимум 2 символа'),
        body('phone').trim().notEmpty().withMessage('Телефон не может быть пустым').matches(/^\+?[0-9\s\-\(\)]{7,20}$/).withMessage('Некорректный формат телефона'),
        body('email').trim().isEmail().withMessage('Некорректный email адрес'),
        body('task').trim().notEmpty().withMessage('Описание задачи не может быть пустым').isLength({ min: 10 }).withMessage('Описание задачи должно содержать минимум 10 символов')
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, message: 'Ошибка валидации', errors: errors.array() });
        }

        const { name, phone, email, company, task, promo } = req.body;
        
        try {
            // --- Начало: Отправка письма ---
            console.log(`Attempting to send email to ${process.env.EMAIL_RECEIVER}...`);
            await transporter.sendMail({
                from: `"Форма сайта" <${process.env.EMAIL_USER}>`,
                to: process.env.EMAIL_RECEIVER,
                subject: 'Новая заявка с сайта',
                html: `
                    <h1>Новая заявка</h1>
                    <p><strong>Имя:</strong> ${name}</p>
                    <p><strong>Телефон:</strong> ${phone}</p>
                    <p><strong>Email:</strong> ${email}</p>
                    <p><strong>Компания:</strong> ${company || 'Не указана'}</p>
                    <p><strong>Задача:</strong> ${task}</p>
                    <p><strong>Промокод:</strong> ${promo || 'Не указан'}</p>
                    <p><strong>Время:</strong> ${new Date().toLocaleString()}</p>
                `,
            });
            console.log('Email sent successfully!');
            // --- Конец: Отправка письма ---

            // --- Начало: Сохранение в файл (опционально) ---
            // Если отправка письма прошла успешно, сохраняем заявку в файл.
            const dataFile = path.join(__dirname, 'data', 'submissions.json');
            await fs.mkdir(path.dirname(dataFile), { recursive: true });
            let submissions = [];
            try {
                const existingData = await fs.readFile(dataFile, 'utf8');
                submissions = JSON.parse(existingData);
            } catch (readError) {
                if (readError.code !== 'ENOENT') throw readError;
            }
            submissions.push({ name, phone, email, company, task, promo, timestamp: new Date().toISOString() });
            await fs.writeFile(dataFile, JSON.stringify(submissions, null, 2), 'utf8');
            console.log('Submission saved to file.');
            // --- Конец: Сохранение в файл ---

            res.status(200).json({ success: true, message: 'Заявка успешно отправлена!' });

        } catch (error) {
            // --- Начало: Улучшенная обработка ошибок Nodemailer ---
            console.error('\x1b[31mError processing form submission:\x1b[0m', error);
            let userMessage = 'Произошла ошибка при отправке заявки. Попробуйте еще раз.';

            // Предоставляем клиенту более конкретную информацию об ошибке
            if (error.code === 'EAUTH') {
                userMessage = 'Ошибка аутентификации с почтовым сервером. Проверьте правильность EMAIL_USER и EMAIL_PASS в .env файле.';
            } else if (error.code === 'ECONNRESET' || error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT') {
                userMessage = 'Не удалось подключиться к почтовому серверу. Проверьте правильность EMAIL_HOST и EMAIL_PORT.';
            } else if (error.command === 'CONN') {
                userMessage = 'Общая ошибка подключения к почтовому серверу.';
            }

            res.status(500).json({ success: false, message: userMessage, error: error.message });
            // --- Конец: Улучшенная обработка ошибок Nodemailer ---
        }
    }
);


// Остальные маршруты (stats, 404, etc.)
// ... (ваш существующий код для /api/stats и обработчиков ошибок)

// Маршрут для получения статистики заявок
app.get('/api/stats', async (req, res) => {
    try {
        const dataFile = path.join(__dirname, 'data', 'submissions.json');
        let submissions = [];
        try {
            const data = await fs.readFile(dataFile, 'utf8');
            submissions = JSON.parse(data);
        } catch (readError) {
            if (readError.code === 'ENOENT') {
                return res.json({ total: 0, today: 0, thisWeek: 0 });
            } else {
                throw readError;
            }
        }

        const stats = {
            total: submissions.length,
            today: submissions.filter(s => {
                const today = new Date().toDateString();
                const submissionDate = new Date(s.timestamp).toDateString();
                return today === submissionDate;
            }).length,
            thisWeek: submissions.filter(s => {
                const weekAgo = new Date();
                weekAgo.setDate(weekAgo.getDate() - 7);
                return new Date(s.timestamp) > weekAgo;
            }).length
        };

        res.json(stats);
    } catch (error) {
        res.status(500).json({ error: 'Ошибка получения статистики' });
    }
});

// Обработка 404 ошибок (страница не найдена)
app.use((req, res) => {
    res.status(404).json({ error: 'Страница не найдена' });
});

// Глобальный обработчик ошибок
app.use((error, req, res, next) => {
    console.error('Глобальная ошибка:', error);
    res.status(500).json({ error: 'Произошла внутренняя ошибка сервера.' });
});

app.listen(PORT, () => {
    console.log(`🚀 Server started on port ${PORT}`);
});
