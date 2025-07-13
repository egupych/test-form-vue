// egupych/test-form-vue/test-form-vue-e89867af06c86f9f3bb70c52bd333eef7bd73db6/server.js

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { body, validationResult } from 'express-validator';
import nodemailer from 'nodemailer';
import path from 'path';
import admin from 'firebase-admin';
import { fileURLToPath } from 'url';
import 'dotenv/config';
import multer from 'multer';
import fs from 'fs'; // <-- ДОБАВЛЕНО: модуль для работы с файлами

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- ИЗМЕНЕНИЕ: Улучшенная конфигурация Multer ---
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB на один файл
const ALLOWED_MIMETYPES = [
    'image/jpeg', 'image/png', 'image/gif', 'image/webp',
    'application/pdf', 'application/msword', 
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation', // .pptx
    'application/zip', 'application/x-rar-compressed', 'application/x-7z-compressed',
    'application/postscript', // .ai, .eps
    'image/vnd.adobe.photoshop' // .psd
];

const upload = multer({
    dest: 'uploads/',
    limits: {
        fileSize: MAX_FILE_SIZE 
    },
    fileFilter: (req, file, cb) => {
        if (ALLOWED_MIMETYPES.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Недопустимый тип файла!'), false);
        }
    }
});
// --- КОНЕЦ ИЗМЕНЕНИЙ MULTER ---

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

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT, 10),
    secure: process.env.EMAIL_SECURE === 'true',
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
});

transporter.verify((error) => {
    if (error) {
        console.error('\x1b[31m--- Ошибка конфигурации Nodemailer ---', error);
    } else {
        console.log('\x1b[32m✅ Nodemailer готов к отправке писем.\x1b[0m');
    }
});

app.use(express.json());
app.use(helmet());

// --- ИЗМЕНЕНИЕ: Более строгая политика CORS для продакшена ---
const whitelist = ['http://localhost:5173', 'https://redpanda.web.app/']; // Замените на ваш домен
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}
app.use(cors(corsOptions));
// --- КОНЕЦ ИЗМЕНЕНИЙ CORS ---

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
});
app.use('/api/', limiter);

app.use(express.static(path.join(__dirname, 'dist')));

// --- ИЗМЕНЕНИЕ: Обработчик теперь для нескольких файлов ---
app.post(
    '/api/submit-form',
    upload.array('files', 10), // Принимаем до 10 файлов
    [
        body('name').trim().notEmpty().withMessage('Имя не может быть пустым'),
        body('phone').trim().notEmpty().withMessage('Телефон не может быть пустым'),
        body('email').trim().isEmail().withMessage('Некорректный email адрес'),
        body('task').trim().notEmpty().withMessage('Описание задачи не может быть пустым')
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            // Если есть ошибки валидации, удаляем загруженные файлы
            if (req.files) {
                req.files.forEach(file => fs.unlinkSync(file.path));
            }
            return res.status(400).json({ success: false, message: 'Ошибка валидации', errors: errors.array() });
        }

        const { name, phone, email, company, task, promo } = req.body;
        const files = req.files; // Теперь это массив

        const newSubmission = { 
            name, phone, email, 
            company: company || 'Не указана', 
            task, 
            promo: promo || 'Не указан', 
            timestamp: admin.firestore.FieldValue.serverTimestamp(), 
            ip: req.ip, 
            userAgent: req.headers['user-agent'],
            fileNames: files && files.length > 0 ? files.map(f => f.originalname) : ['Нет файлов']
        };
        
        try {
            const mailOptions = {
                from: `"Форма с сайта RedPanda" <${process.env.EMAIL_USER}>`,
                to: process.env.EMAIL_RECEIVER,
                subject: `Новая заявка с сайта от ${name}`,
                html: `<div style="font-family: Arial, sans-serif; line-height: 1.6;"><h2>Новая заявка на расчёт стоимости</h2><p><strong>Имя:</strong> ${name}</p><p><strong>Телефон:</strong> ${phone}</p><p><strong>Email:</strong> ${email}</p><p><strong>Компания:</strong> ${newSubmission.company}</p><p><strong>Промокод:</strong> ${newSubmission.promo}</p><hr><h3>Задача:</h3><p>${task}</p></div>`,
                attachments: []
            };

            if (files && files.length > 0) {
                mailOptions.attachments = files.map(file => ({
                    filename: file.originalname,
                    path: file.path
                }));
            }

            await transporter.sendMail(mailOptions);
            await db.collection('submissions').add(newSubmission);
            
            res.status(200).json({ success: true, message: 'Заявка успешно отправлена!' });
        } catch (error) {
            console.error('ОШИБКА ПРИ ОБРАБОТКЕ ЗАЯВКИ:', error);
            res.status(500).json({ success: false, message: 'Внутренняя ошибка сервера.' });
        } finally {
            // --- ИЗМЕНЕНИЕ: Удаляем файлы после отправки ---
            if (files && files.length > 0) {
                files.forEach(file => fs.unlinkSync(file.path));
            }
        }
    }
);

app.post(
    '/api/subscribe',
    [ 
        body('email').trim().isEmail().withMessage('Некорректный email адрес.')
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, message: errors.array()[0].msg });
        }

        const { email, sphere } = req.body;
        const subscribersRef = db.collection('subscribers');

        try {
            const snapshot = await subscribersRef.where('email', '==', email).get();
            if (!snapshot.empty) {
                return res.status(409).json({ success: false, message: 'Вы уже подписаны на нашу рассылку!' });
            }

            await subscribersRef.add({
                email: email,
                sphere: sphere || 'Не указана',
                subscribedAt: admin.firestore.FieldValue.serverTimestamp()
            });

            res.status(200).json({ success: true, message: 'Спасибо за подписку!' });
        } catch (error) {
            console.error('ОШИБКА ПРИ ПОДПИСКЕ:', error);
            res.status(500).json({ success: false, message: 'Произошла ошибка. Попробуйте снова.' });
        }
    }
);

// --- ИЗМЕНЕНИЕ: Обработчик ошибок Multer ---
app.use((error, req, res, next) => {
    if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ success: false, message: 'Файл слишком большой. Максимальный размер 10 МБ.' });
        }
    } else if (error) {
        return res.status(400).json({ success: false, message: error.message });
    }
    next();
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`\x1b[36m🚀 Сервер запущен на порту ${PORT}. Откройте сайт по адресу http://localhost:${PORT}\x1b[0m`);
});