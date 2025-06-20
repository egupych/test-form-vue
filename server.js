const express = require('express');
const cors = require('cors');
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
            scriptSrc: [
                "'self'", 
                "'unsafe-inline'", 
                "'unsafe-eval'", 
                "https://unpkg.com", 
                "https://cdn.tailwindcss.com", 
                "https://www.gstatic.com", // Для Firebase SDK
                "https://apis.google.com" // Иногда требуется для Firebase Auth
            ],
            // Разрешаем CDN для TailwindCSS и Google Fonts
            styleSrc: [
                "'self'", 
                "'unsafe-inline'", 
                "https://cdn.tailwindcss.com", 
                "https://fonts.googleapis.com"
            ],
            // Разрешаем загрузку шрифтов из data: URI и с Google Fonts
            fontSrc: ["'self'", "data:", "https://fonts.gstatic.com"],
            // Разрешаем изображения из data: URI и с placehold.co
            imgSrc: ["'self'", "data:", "https://placehold.co"],
            // Разрешаем подключения к Firebase и другим API
            connectSrc: [
                "'self'", 
                "https://generativelanguage.googleapis.com", 
                "https://identitytoolkit.googleapis.com", // Firebase Auth
                "https://securetoken.googleapis.com",   // Firebase Auth
                "https://firestore.googleapis.com",      // Firestore
                "https://www.googleapis.com"             // Общие Google APIs
            ],
            objectSrc: ["'none'"], // Запрещаем <object>, <embed> и <applet>
            upgradeInsecureRequests: [], // Автоматически перенаправляет HTTP-запросы на HTTPS
        }
    }
}));

// Middleware для обработки JSON-запросов и URL-кодированных данных
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Разрешаем CORS для всех источников (на этапе разработки)
app.use(cors());

// Настройка ограничения частоты запросов для защиты от DDoS и brute-force атак
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 минут
    max: 100, // максимум 100 запросов с одного IP за 15 минут
    message: 'Слишком много запросов с вашего IP, попробуйте повторить позже.'
});
app.use('/api/', limiter); // Применяем ко всем API-маршрутам

// Статические файлы из папки public
app.use(express.static(path.join(__dirname, 'public')));

// Обработчик для получения конфигурации Firebase
app.get('/api/firebase-config', (req, res) => {
    // В реальном приложении эти данные должны храниться в переменных окружения и никогда не коммититься в Git!
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
        const timestamp = new Date().toISOString();
        const submissionData = { name, phone, email, company, task, promo, timestamp };

        try {
            // Сохранение заявки в локальный JSON-файл (для примера)
            const dataFile = path.join(__dirname, 'data', 'submissions.json');
            await fs.mkdir(path.dirname(dataFile), { recursive: true }); // Создать папку, если не существует

            let submissions = [];
            try {
                const existingData = await fs.readFile(dataFile, 'utf8');
                submissions = JSON.parse(existingData);
            } catch (readError) {
                if (readError.code !== 'ENOENT') { // Игнорировать ошибку "файл не найден"
                    throw readError;
                }
            }
            submissions.push(submissionData);
            await fs.writeFile(dataFile, JSON.stringify(submissions, null, 2), 'utf8');

            // Отправка письма на почту (пример)
            let transporter = nodemailer.createTransport({
                host: process.env.EMAIL_HOST,
                port: process.env.EMAIL_PORT,
                secure: process.env.EMAIL_SECURE === 'true', // true для 465, false для других портов
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS,
                },
            });

            await transporter.sendMail({
                from: `"Форма сайта" <${process.env.EMAIL_USER}>`,
                to: process.env.EMAIL_RECEIVER, // Куда отправлять письма
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

            res.status(200).json({ success: true, message: 'Заявка успешно отправлена!' });

        } catch (error) {
            console.error('Ошибка при обработке заявки:', error);
            res.status(500).json({ success: false, message: 'Произошла ошибка при отправке заявки. Попробуйте еще раз.' });
        }
    }
);

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
    console.log(`🚀 Сервер запущен на порту ${PORT}`);
});
