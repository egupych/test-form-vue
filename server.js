// Импортируем все необходимые модули, используя синтаксис ES Modules
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { body, validationResult } from 'express-validator';
import nodemailer from 'nodemailer';
import path from 'path';
import admin from 'firebase-admin';
import { fileURLToPath } from 'url';

// Загружаем переменные окружения из файла .env
import 'dotenv/config';

// --- Важное изменение для ES Modules ---
// Получаем __dirname, так как он не доступен в ES-модулях по умолчанию
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Проверяем наличие всех необходимых переменных окружения.
const requiredEnv = [
    'PORT', 'EMAIL_HOST', 'EMAIL_PORT', 'EMAIL_SECURE', 'EMAIL_USER', 'EMAIL_PASS', 'EMAIL_RECEIVER',
    'FIREBASE_PROJECT_ID', 'GOOGLE_APPLICATION_CREDENTIALS'
];
for (const envVar of requiredEnv) {
    if (!process.env[envVar]) {
        console.error(`\x1b[31mКРИТИЧЕСКАЯ ОШИБКА: Переменная окружения ${envVar} не определена в файле .env.\x1b[0m`);
        process.exit(1);
    }
}

// Инициализация Firebase Admin SDK
try {
    admin.initializeApp({
        credential: admin.credential.applicationDefault(),
        projectId: process.env.FIREBASE_PROJECT_ID,
    });
    console.log('\x1b[32m✅ Firebase Admin SDK успешно инициализирован.\x1b[0m');
} catch (error) {
    console.error('\x1b[31m--- Ошибка инициализации Firebase Admin SDK ---', error);
    process.exit(1);
}
const db = admin.firestore();

const app = express();
const PORT = process.env.PORT;

// --- ИСПРАВЛЕНИЕ: Финальная, корректная политика безопасности ---
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: [
                "'self'",
                "https://cdn.tailwindcss.com",
                "https://unpkg.com",
                "'unsafe-inline'", // Разрешает встроенные скрипты (для tailwind.config)
                "'unsafe-eval'",   // Разрешает eval (необходимо для Vue в режиме разработки)
            ],
            styleSrc: ["'self'", "https://fonts.googleapis.com", "'unsafe-inline'"],
            fontSrc: ["'self'", "https://fonts.gstatic.com"],
            imgSrc: ["'self'", "data:", "https://placehold.co"],
            frameSrc: ["'self'", "https://www.google.com/"],
            connectSrc: ["'self'", "https://firestore.googleapis.com", `http://localhost:${PORT}`]
        },
    })
);

// Остальные Middleware
app.use(bodyParser.json());
app.use(cors());
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
});
app.use('/api/', limiter);

// Раздача статических файлов из папки 'dist'
app.use(express.static(path.join(__dirname, 'dist')));

// API Эндпоинт для обработки формы
app.post(
    '/api/submit-form',
    [
        body('name').trim().notEmpty().withMessage('Имя не может быть пустым'),
        body('phone').trim().notEmpty().withMessage('Телефон не может быть пустым'),
        body('email').trim().isEmail().withMessage('Некорректный email адрес'),
        body('task').trim().notEmpty().withMessage('Описание задачи не может быть пустым')
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, message: 'Ошибка валидации', errors: errors.array() });
        }

        const { name, phone, email, company, task, promo } = req.body;
        const newSubmission = { name, phone, email, company: company || 'Не указана', task, promo: promo || 'Не указан', timestamp: admin.firestore.FieldValue.serverTimestamp(), ip: req.ip, userAgent: req.headers['user-agent'] };

        // Настройка Nodemailer
        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: parseInt(process.env.EMAIL_PORT, 10),
            secure: process.env.EMAIL_SECURE === 'true',
            auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
        });

        transporter.verify((error) => {
            if (error) console.error('\x1b[31mОшибка конфигурации Nodemailer:\x1b[0m', error);
            else console.log('\x1b[32m✅ Nodemailer готов к отправке писем.\x1b[0m');
        });

        try {
            await transporter.sendMail({
                from: `"Форма с сайта RedPanda" <${process.env.EMAIL_USER}>`,
                to: process.env.EMAIL_RECEIVER,
                subject: `Новая заявка с сайта от ${name}`,
                html: `<div style="font-family: Arial, sans-serif; line-height: 1.6;"><h2>Новая заявка на расчёт стоимости</h2><p><strong>Имя:</strong> ${name}</p><p><strong>Телефон:</strong> ${phone}</p><p><strong>Email:</strong> ${email}</p><p><strong>Компания:</strong> ${newSubmission.company}</p><p><strong>Промокод:</strong> ${newSubmission.promo}</p><hr><h3>Задача:</h3><p>${task}</p></div>`,
            });
            console.log(`Письмо с заявкой от ${name} успешно отправлено.`);

            const docRef = await db.collection('submissions').add(newSubmission);
            console.log(`Заявка сохранена в Firestore с ID: ${docRef.id}`);
            
            res.status(200).json({ success: true, message: 'Заявка успешно отправлена!' });
        } catch (error) {
            console.error('\x1b[31m=====================================');
            console.error('      ОШИБКА ПРИ ОБРАБОТКЕ ЗАЯВКИ');
            console.error('=====================================\x1b[0m');
            console.error('Время:', new Date().toISOString());
            console.error('Полные детали ошибки:', error);
            res.status(500).json({ success: false, message: 'Внутренняя ошибка сервера. См. консоль сервера.' });
        }
    }
);

// Обработчик для SPA
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`\x1b[36m🚀 Сервер запущен на порту ${PORT}. Откройте сайт по адресу http://localhost:${PORT}\x1b[0m`);
});