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

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const upload = multer({ dest: 'uploads/' });

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
app.use(cors());

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
});
app.use('/api/', limiter);

app.use(express.static(path.join(__dirname, 'dist')));

app.post(
    '/api/submit-form',
    upload.single('file'), 
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
        const file = req.file;

        const newSubmission = { 
            name, phone, email, 
            company: company || 'Не указана', 
            task, 
            promo: promo || 'Не указан', 
            timestamp: admin.firestore.FieldValue.serverTimestamp(), 
            ip: req.ip, 
            userAgent: req.headers['user-agent'],
            fileName: file ? file.originalname : 'Нет файла'
        };
        
        try {
            const mailOptions = {
                from: `"Форма с сайта RedPanda" <${process.env.EMAIL_USER}>`,
                to: process.env.EMAIL_RECEIVER,
                subject: `Новая заявка с сайта от ${name}`,
                html: `<div style="font-family: Arial, sans-serif; line-height: 1.6;"><h2>Новая заявка на расчёт стоимости</h2><p><strong>Имя:</strong> ${name}</p><p><strong>Телефон:</strong> ${phone}</p><p><strong>Email:</strong> ${email}</p><p><strong>Компания:</strong> ${newSubmission.company}</p><p><strong>Промокод:</strong> ${newSubmission.promo}</p><hr><h3>Задача:</h3><p>${task}</p></div>`,
                attachments: []
            };

            if (file) {
                mailOptions.attachments.push({
                    filename: file.originalname,
                    path: file.path
                });
            }

            await transporter.sendMail(mailOptions);
            const docRef = await db.collection('submissions').add(newSubmission);
            
            res.status(200).json({ success: true, message: 'Заявка успешно отправлена!' });
        } catch (error) {
            console.error('ОШИБКА ПРИ ОБРАБОТКЕ ЗАЯВКИ:', error);
            res.status(500).json({ success: false, message: 'Внутренняя ошибка сервера.' });
        }
    }
);

// --- ИЗМЕНЕНИЕ: ENDPOINT ДЛЯ ПОДПИСКИ ---
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

        // --- ИЗМЕНЕНИЕ: Получаем новое поле из запроса ---
        const { email, sphere } = req.body;
        const subscribersRef = db.collection('subscribers');

        try {
            const snapshot = await subscribersRef.where('email', '==', email).get();
            if (!snapshot.empty) {
                return res.status(409).json({ success: false, message: 'Вы уже подписаны на нашу рассылку!' });
            }

            // --- ИЗМЕНЕНИЕ: Сохраняем новое поле в базу данных ---
            await subscribersRef.add({
                email: email,
                sphere: sphere || 'Не указана', // Если поле пустое, сохраняем заглушку
                subscribedAt: admin.firestore.FieldValue.serverTimestamp()
            });

            res.status(200).json({ success: true, message: 'Спасибо за подписку!' });
        } catch (error) {
            console.error('ОШИБКА ПРИ ПОДПИСКЕ:', error);
            res.status(500).json({ success: false, message: 'Произошла ошибка. Попробуйте снова.' });
        }
    }
);

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`\x1b[36m🚀 Сервер запущен на порту ${PORT}. Откройте сайт по адресу http://localhost:${PORT}\x1b[0m`);
});