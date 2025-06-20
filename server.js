const express = require('express');
const cors = require('cors'); // Исправлено: bodyParser был ошибочно указан здесь
const bodyParser = require('body-parser');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');
const nodemailer = require('nodemailer');
const path = require('path');
const fs = require('fs').promises;
require('dotenv').config(); // Загружаем переменные из .env

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware для безопасности
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            // Разрешаем 'unsafe-eval' для Vue.js в режиме разработки
            // Разрешаем CDN для TailwindCSS, Unpkg (для Vue, Firebase) и Gstatic (для Firebase)
            scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https://unpkg.com", "https://cdn.tailwindcss.com", "https://www.gstatic.com"],
            // Разрешаем CDN для TailwindCSS и Google Fonts
            styleSrc: ["'self'", "'unsafe-inline'", "https://cdn.tailwindcss.com", "https://fonts.googleapis.com"],
            // Разрешаем загрузку шрифтов из data: URI и с Google Fonts
            fontSrc: ["'self'", "data:", "https://fonts.gstatic.com"],
            // Разрешаем изображения из data: URI и с placehold.co
            imgSrc: ["'self'", "data:", "https://placehold.co"],
            // Разрешаем подключения к API Firebase и Google API для генерации текста
            connectSrc: [
                "'self'",
                "https://generativelanguage.googleapis.com", // Для Gemini API
                "https://*.firebaseio.com",
                "https://*.googleapis.com",
                "https://securetoken.googleapis.com",
                "https://identitytoolkit.googleapis.com" // Важно для Firebase Auth
            ],
            objectSrc: ["'none'"], // Запрещаем плагины (Flash, Java и т.д.)
            upgradeInsecureRequests: [], // Просим браузеры обновлять HTTP-запросы до HTTPS
        },
    },
}));

// CORS настройки
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
}));

// Парсинг JSON и URL-encoded данных
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Раздача статических файлов из папки 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Rate limiting - ограничение количества запросов для предотвращения злоупотреблений
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 минут
    max: 5, // Максимум 5 запросов на IP за 15 минут
    message: {
        error: 'Слишком много запросов. Попробуйте позже.'
    },
    standardHeaders: true, // Добавляет заголовки X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset
    legacyHeaders: false, // Отключает заголовки X-RateLimit-Reset
});

// Применяем rate limiting только к маршруту отправки формы
app.use('/api/submit-form', limiter);

// Настройка Nodemailer для отправки email
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_SECURE === 'true', // secure: true для порта 465, secure: false для порта 587 (STARTTLS)
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// Проверка подключения к Email-серверу при запуске
transporter.verify((error, success) => {
    if (error) {
        console.error('📧 Ошибка подключения к Email:', error);
    } else {
        console.log('📧 Email настроен: ✅ Да');
    }
});

// Маршрут для отдачи конфигурации Firebase на фронтенд
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
    // Отфильтровываем пустые значения, чтобы не отправлять их на фронтенд
    const filteredConfig = Object.fromEntries(
        Object.entries(firebaseConfig).filter(([_, v]) => v != null && v !== '')
    );
    res.json(filteredConfig);
});

// Маршрут для обработки отправки формы
app.post(
    '/api/submit-form',
    [
        // Правила валидации полей формы
        body('name').trim().notEmpty().withMessage('Имя не может быть пустым').isLength({ min: 2 }).withMessage('Имя должно быть не менее 2 символов'),
        // ИСПРАВЛЕНИЕ: Сначала очищаем номер телефона, затем применяем более простое регулярное выражение
        body('phone')
            .trim()
            .notEmpty().withMessage('Телефон не может быть пустым')
            .customSanitizer(value => value.replace(/[\s\-\(\)]/g, '')) // Удаляем пробелы, дефисы, скобки
            .matches(/^\+?\d{10,15}$/).withMessage('Некорректный формат телефона'), // Теперь ожидаем 10-15 цифр после очистки
        body('email').trim().notEmpty().withMessage('Email не может быть пустым').isEmail().withMessage('Некорректный email адрес'),
        body('task').trim().notEmpty().withMessage('Задача не может быть пустой').isLength({ min: 10 }).withMessage('Задача должна быть не менее 10 символов'),
        body('company').trim(), // Поле "Компания" опционально
        body('promo').trim(), // Поле "Промокод" опционально
    ],
    async (req, res) => {
        const errors = validationResult(req); // Получаем результаты валидации
        if (!errors.isEmpty()) {
            // Если есть ошибки валидации, отправляем их на фронтенд
            return res.status(400).json({ success: false, message: 'Ошибки валидации', errors: errors.array() });
        }

        const formData = req.body; // Получаем данные формы из тела запроса
        const dataFile = path.join(__dirname, 'data', 'submissions.json'); // Путь к файлу для сохранения заявок

        try {
            // Создаем директорию 'data', если она не существует
            await fs.mkdir(path.dirname(dataFile), { recursive: true });

            let submissions = [];
            // Пытаемся прочитать существующие заявки
            try {
                const data = await fs.readFile(dataFile, 'utf8');
                submissions = JSON.parse(data); // Парсим JSON
            } catch (readError) {
                // Если файл не существует или пуст/некорректен, начинаем с пустого массива
                if (readError.code === 'ENOENT' || readError instanceof SyntaxError) {
                    submissions = [];
                } else {
                    throw readError; // Перебрасываем другие ошибки чтения файла
                }
            }

            // Добавляем новую заявку с отметкой времени
            const newSubmission = {
                ...formData,
                timestamp: new Date().toISOString()
            };
            submissions.push(newSubmission);

            // Записываем обновленный массив заявок обратно в файл
            await fs.writeFile(dataFile, JSON.stringify(submissions, null, 2), 'utf8');

            // Настраиваем параметры для отправки Email
            const mailOptions = {
                from: process.env.EMAIL_FROM, // От кого
                to: process.env.RECIPIENT_EMAIL, // Кому
                subject: 'Новая заявка с сайта "Расчет стоимости"', // Тема письма
                html: `
                    <h2>Новая заявка получена!</h2>
                    <p><b>Имя:</b> ${formData.name}</p>
                    <p><b>Телефон:</b> ${formData.phone}</p>
                    <p><b>Email:</b> ${formData.email}</p>
                    <p><b>Компания:</b> ${formData.company || 'Не указано'}</p>
                    <p><b>Задача:</b> ${formData.task}</p>
                    <p><b>Промокод:</b> ${formData.promo || 'Не указано'}</p>
                    <p><b>Время:</b> ${new Date().toLocaleString('ru-RU')}</p>
                `,
            };

            // Отправляем Email
            await transporter.sendMail(mailOptions);

            // Отправляем успешный ответ на фронтенд
            res.status(200).json({ success: true, message: 'Заявка успешно отправлена!' });

        } catch (error) {
            console.error('Ошибка при обработке формы:', error);
            res.status(500).json({ success: false, message: 'Ошибка сервера при отправке заявки.' });
        }
    }
);

// Маршрут для получения статистики (если будет использоваться)
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
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`🚀 Сервер запущен на порту ${PORT}`);
    console.log(`📂 Статические файлы: http://localhost:${PORT}`);
});
