// Код server.js
// Этот файл настраивает и запускает бэкенд-сервер с помощью Express.
// Он обрабатывает API-запросы от Vue-приложения, такие как отправка форм и подписка на рассылку.
// Сервер использует multer для загрузки файлов, nodemailer для отправки писем и Firebase Admin SDK для работы с базой данных Firestore.
// Также включены базовые меры безопасности: helmet, CORS и ограничение частоты запросов.

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
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- Конфигурация Multer для основной формы ---
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
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
    'image/vnd.adobe.photoshop', // .psd
    'image/svg+xml' // .svg
];

const mainFormUpload = multer({
    dest: 'uploads/',
    limits: { fileSize: MAX_FILE_SIZE },
    fileFilter: (req, file, cb) => {
        const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx', '.zip', '.rar', '.7z', '.ai', '.eps', '.psd', '.svg', '.fig'];
        const fileExtension = path.extname(file.originalname).toLowerCase();

        if (ALLOWED_MIMETYPES.includes(file.mimetype) || allowedExtensions.includes(fileExtension)) {
            cb(null, true);
        } else {
            const allowedExtensionsString = '.jpg, .png, .pdf, .docx, .ai, .psd, .svg, .fig, .zip, .rar';
            return cb(new Error(`Недопустимый тип файла. Разрешены: ${allowedExtensionsString}`), false);
        }
    }
});

// --- Конфигурация Multer для резюме ---
const MAX_RESUME_SIZE = 15 * 1024 * 1024; // 15 MB
const ALLOWED_RESUME_MIMETYPES = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
    'image/jpeg', 'image/png'
];

const resumeUpload = multer({
    dest: 'uploads/',
    limits: { fileSize: MAX_RESUME_SIZE },
    fileFilter: (req, file, cb) => {
        if (ALLOWED_RESUME_MIMETYPES.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Недопустимый тип файла для резюме! Разрешены: .pdf, .doc, .docx, .jpg, .png'), false);
        }
    }
});

const requiredEnv = [
    'PORT', 'APP_BASE_URL', 'EMAIL_HOST', 'EMAIL_PORT', 'EMAIL_SECURE', 'EMAIL_USER', 'EMAIL_PASS', 'EMAIL_RECEIVER',
    'EMAIL_HR_RECEIVER', 'FIREBASE_PROJECT_ID', 'GOOGLE_APPLICATION_CREDENTIALS'
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

const whitelist = ['http://localhost:5173', 'https://redpanda.web.app/'];
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

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
});
app.use('/api/', limiter);

app.use(express.static(path.join(__dirname, 'dist')));

app.post(
    '/api/submit-form',
    mainFormUpload.array('files', 10),
    [
        body('name').trim().notEmpty().withMessage('Имя не может быть пустым'),
        body('phone').trim().notEmpty().withMessage('Телефон не может быть пустым'),
        body('email').trim().isEmail().withMessage('Некорректный email адрес'),
        body('task').trim().notEmpty().withMessage('Описание задачи не может быть пустым')
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            if (req.files) {
                req.files.forEach(file => fs.unlinkSync(file.path));
            }
            return res.status(400).json({ success: false, message: 'Ошибка валидации', errors: errors.array() });
        }

        const { name, phone, email, company, task, promo } = req.body;
        const files = req.files;
        const references = Array.isArray(req.body.references) ? req.body.references : (req.body.references ? [req.body.references] : []);

        const mailOptions = {
            from: `"Форма с сайта RedPanda" <${process.env.EMAIL_USER}>`,
            to: process.env.EMAIL_RECEIVER,
            subject: `Новая заявка с сайта от ${name}`,
            attachments: []
        };
        
        // --- НАЧАЛО ИЗМЕНЕНИЙ: Полностью переработанная логика для референсов ---
        let referencesHtml = '';
        if (references && references.length > 0) {
            const baseUrl = process.env.APP_BASE_URL;
            
            const referenceAttachments = await Promise.all(
                references.map(async (url, index) => {
                    try {
                        const absoluteUrl = url.startsWith('http') ? url : `${baseUrl}${url}`;
                        const response = await fetch(absoluteUrl);
                        
                        // Проверяем, что ответ успешный и что это изображение
                        const contentType = response.headers.get('content-type');
                        if (!response.ok || !contentType || !contentType.startsWith('image')) {
                           console.error(`Не удалось скачать референс (не изображение): ${absoluteUrl}`);
                           return null;
                        }

                        const arrayBuffer = await response.arrayBuffer();
                        const buffer = Buffer.from(arrayBuffer);
                        const cid = `reference-${index}@redpanda.kz`;
                        
                        return {
                            filename: path.basename(url), // Добавляем имя файла
                            content: buffer,              // Отправляем как буфер
                            contentType: contentType,     // Указываем тип контента
                            cid: cid,                     // Указываем Content-ID
                        };
                    } catch (e) {
                        console.error(`Не удалось скачать референс: ${url}`, e);
                        return null;
                    }
                })
            );
            
            const validAttachments = referenceAttachments.filter(Boolean);
            if(validAttachments.length > 0) {
                mailOptions.attachments.push(...validAttachments);
            }

            referencesHtml = `
                <hr>
                <h3>Выбранные референсы:</h3>
                <div style="display: flex; flex-wrap: wrap; gap: 10px;">
                    ${validAttachments.map(att => `
                        <img src="cid:${att.cid}" alt="Референс" style="width: 100px; height: 100px; object-fit: cover; border-radius: 8px;">
                    `).join('')}
                </div>
            `;
        }
        
        let filesHtml = '';
        if (files && files.length > 0) {
             filesHtml = `
                <hr>
                <h3>Прикрепленные файлы (${files.length} шт.):</h3>
                <ul>
                    ${files.map(file => {
                        // --- ИЗМЕНЕНИЕ: Убираем транслитерацию, исправляем кодировку ---
                        const decodedOriginalName = Buffer.from(file.originalname, 'latin1').toString('utf8');
                        return `<li>${decodedOriginalName}</li>`;
                     }).join('')}
                </ul>
            `;
            
            mailOptions.attachments.push(...files.map(file => ({
                filename: Buffer.from(file.originalname, 'latin1').toString('utf8'), // Также исправляем имя в самом вложении
                path: file.path
            })));
        }
        // --- КОНЕЦ ИЗМЕНЕНИЙ ---
        
        const newSubmission = {
            name, phone, email,
            company: company || 'Не указана', task,
            promo: promo || 'Не указан',
            timestamp: admin.firestore.FieldValue.serverTimestamp(),
            ip: req.ip, userAgent: req.headers['user-agent'],
            fileNames: files && files.length > 0 ? files.map(f => Buffer.from(f.originalname, 'latin1').toString('utf8')) : [],
            references: references || []
        };

        try {
            mailOptions.html = `
                <div style="font-family: Arial, sans-serif; line-height: 1.6;">
                    <h2>Новая заявка на расчёт стоимости</h2>
                    <p><strong>Имя:</strong> ${name}</p>
                    <p><strong>Телефон:</strong> ${phone}</p>
                    <p><strong>Email:</strong> ${email}</p>
                    <p><strong>Компания:</strong> ${newSubmission.company}</p>
                    <p><strong>Промокод:</strong> ${newSubmission.promo}</p>
                    <hr>
                    <h3>Задача:</h3>
                    <p>${task}</p>
                    ${filesHtml}
                    ${referencesHtml}
                </div>
            `;
            
            await transporter.sendMail(mailOptions);
            await db.collection('submissions').add(newSubmission);

            res.status(200).json({ success: true, message: 'Заявка успешно отправлена!' });
        } catch (error) {
            console.error('ОШИБКА ПРИ ОБРАБОТКЕ ЗАЯВКИ:', error);
            res.status(500).json({ success: false, message: 'Внутренняя ошибка сервера.' });
        } finally {
            if (files && files.length > 0) {
                files.forEach(file => fs.unlinkSync(file.path));
            }
        }
    }
);

app.post(
    '/api/submit-application',
    resumeUpload.single('resume'),
    [
        body('name').trim().notEmpty().withMessage('Имя не может быть пустым'),
        body('phone').trim().notEmpty().withMessage('Телефон не может быть пустым'),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            if (req.file) { fs.unlinkSync(req.file.path); }
            return res.status(400).json({ success: false, message: 'Ошибка валидации', errors: errors.array() });
        }
        if (!req.file) { return res.status(400).json({ success: false, message: 'Файл резюме не был загружен.' }); }
        
        const { name, phone, desiredPosition } = req.body;
        const resumeFile = req.file;

        // --- ИЗМЕНЕНИЕ: Исправляем кодировку ---
        const decodedOriginalName = Buffer.from(resumeFile.originalname, 'latin1').toString('utf8');

        const newApplication = {
            name, phone, desiredPosition: desiredPosition || 'Кадровый резерв',
            timestamp: admin.firestore.FieldValue.serverTimestamp(),
            ip: req.ip, userAgent: req.headers['user-agent'], 
            resumeFileName: decodedOriginalName,
        };

        try {
            const mailOptions = {
                from: `"Отклик на вакансию" <${process.env.EMAIL_USER}>`,
                to: process.env.EMAIL_HR_RECEIVER,
                subject: `Новый отклик: ${newApplication.desiredPosition} от ${name}`,
                html: `<div style="font-family: Arial, sans-serif; line-height: 1.6;">
                         <h2>Новый отклик на вакансию</h2>
                         <p><strong>Кандидат:</strong> ${name}</p>
                         <p><strong>Телефон:</strong> ${phone}</p>
                         <p><strong>Желаемая должность:</strong> ${newApplication.desiredPosition}</p>
                         <hr><p>Резюме кандидата прикреплено к этому письму (файл: ${decodedOriginalName}).</p></div>`,
                attachments: [{ 
                    filename: decodedOriginalName,
                    path: resumeFile.path 
                }]
            };
            await transporter.sendMail(mailOptions);
            await db.collection('applications').add(newApplication);
            res.status(200).json({ success: true, message: `Спасибо за отклик, ${name}! Мы свяжемся с вами.` });
        } catch (error) {
            console.error('ОШИБКА ПРИ ОБРАБОТКЕ ОТКЛИКА:', error);
            res.status(500).json({ success: false, message: 'Внутренняя ошибка сервера.' });
        } finally {
            fs.unlinkSync(resumeFile.path);
        }
    }
);

app.post(
    '/api/subscribe',
    [ body('email').trim().isEmail().withMessage('Некорректный email адрес.') ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) { return res.status(400).json({ success: false, message: errors.array()[0].msg }); }
        const { email, sphere } = req.body;
        const subscribersRef = db.collection('subscribers');
        try {
            const snapshot = await subscribersRef.where('email', '==', email).get();
            if (!snapshot.empty) { return res.status(409).json({ success: false, message: 'Вы уже подписаны на нашу рассылку!' }); }
            await subscribersRef.add({ email: email, sphere: sphere || 'Не указана', subscribedAt: admin.firestore.FieldValue.serverTimestamp() });
            res.status(200).json({ success: true, message: 'Спасибо за подписку!' });
        } catch (error) {
            console.error('ОШИБКА ПРИ ПОДПИСКЕ:', error);
            res.status(500).json({ success: false, message: 'Произошла ошибка. Попробуйте снова.' });
        }
    }
);

app.use((error, req, res, next) => {
    if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ success: false, message: 'Файл слишком большой.' });
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