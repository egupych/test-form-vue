// Код functions/index.js
// Это главный файл для облачных функций Firebase.
// Он содержит всю логику вашего бэкенд-сервера, адаптированную для бессерверной среды.
// Здесь инициализируется Express-приложение, настраиваются все API-маршруты
// (для форм, подписок, вакансий), но вместо запуска через app.listen(),
// приложение экспортируется как облачная функция `api`.

import * as functions from "firebase-functions";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { body, validationResult } from "express-validator";
import nodemailer from "nodemailer";
import path from "path";
import admin from "firebase-admin";
import multer from "multer";
import fs from "fs";

// Инициализация Firebase Admin SDK
if (!admin.apps.length) {
  admin.initializeApp();
}

const app = express();
const db = admin.firestore();

// --- НАЧАЛО БЛОКА НАСТРОЕК (ПЕРЕНЕСЕНО ИЗ SERVER.JS) ---

function transliterate(text) {
    text = text.toLowerCase();
    const rus = "абвгдеёжзийклмнопрстуфхцчшщъыьэюя ".split("");
    const eng = "abvgdeejzijklmnoprstufhzcss'y'eua-".split("");
    let newText = "";
    for (let i = 0; i < text.length; i++) {
        let index = rus.indexOf(text[i]);
        if (index !== -1) {
            newText += eng[index];
        } else if ("1234567890abcdefghijklmnopqrstuvwxyz-".includes(text[i])) {
            newText += text[i];
        }
    }
    return newText.replace(/--+/g, '-').replace(/^-+|-+$/g, '');
}

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ALLOWED_MIMETYPES = [
    'image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf', 'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'application/zip', 'application/x-rar-compressed', 'application/x-7z-compressed',
    'application/postscript', 'image/vnd.adobe.photoshop', 'image/svg+xml'
];

const mainFormUpload = multer({
    dest: '/tmp/', // В Firebase Functions нужно использовать временную папку /tmp/
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

const MAX_RESUME_SIZE = 15 * 1024 * 1024;
const ALLOWED_RESUME_MIMETYPES = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/jpeg', 'image/png'];

const resumeUpload = multer({
    dest: '/tmp/', // Используем временную папку
    limits: { fileSize: MAX_RESUME_SIZE },
    fileFilter: (req, file, cb) => {
        if (ALLOWED_RESUME_MIMETYPES.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Недопустимый тип файла для резюме! Разрешены: .pdf, .doc, .docx, .jpg, .png'), false);
        }
    }
});

// Для Firebase Functions переменные окружения настраиваются по-другому, через `functions.config()`
// Но для локальной эмуляции оставим dotenv.
import 'dotenv/config';

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT, 10),
    secure: process.env.EMAIL_SECURE === 'true',
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
});

const whitelist = ['http://localhost:5173', 'https://redpanda.web.app', 'http://127.0.0.1:5173'];
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
};
app.use(cors(corsOptions));

app.use(helmet());

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
});
app.use(limiter);

// --- КОНЕЦ БЛОКА НАСТРОЕК ---


// --- МАРШРУТЫ API ---

app.post('/api/submit-form', mainFormUpload.array('files', 10), [
    body('name').trim().notEmpty(), body('phone').trim().notEmpty(),
    body('email').trim().isEmail(), body('task').trim().notEmpty()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        if (req.files) req.files.forEach(file => fs.unlinkSync(file.path));
        return res.status(400).json({ success: false, message: 'Ошибка валидации' });
    }

    const { name, phone, email, company, task, promo } = req.body;
    const files = req.files;
    const references = Array.isArray(req.body.references) ? req.body.references : (req.body.references ? [req.body.references] : []);
    const mailOptions = { from: `"Форма с сайта RedPanda" <${process.env.EMAIL_USER}>`, to: process.env.EMAIL_RECEIVER, subject: `Новая заявка с сайта от ${name}`, attachments: [] };
    
    let referencesHtml = '';
    if (references && references.length > 0) {
        const baseUrl = process.env.APP_BASE_URL;
        const referenceAttachments = await Promise.all(
            references.map(async (url, index) => {
                try {
                    const absoluteUrl = url.startsWith('http') ? url : `${baseUrl}${url}`;
                    const response = await fetch(absoluteUrl);
                    const contentType = response.headers.get('content-type');
                    if (!response.ok || !contentType || !contentType.startsWith('image')) {
                       console.error(`Не удалось скачать референс (не изображение): ${absoluteUrl}`);
                       return null;
                    }
                    const arrayBuffer = await response.arrayBuffer();
                    const buffer = Buffer.from(arrayBuffer);
                    const cid = `reference-${index}@redpanda.kz`;
                    return { filename: path.basename(url), content: buffer, contentType: contentType, cid: cid, };
                } catch (e) {
                    console.error(`Не удалось скачать референс: ${url}`, e);
                    return null;
                }
            })
        );
        const validAttachments = referenceAttachments.filter(Boolean);
        if(validAttachments.length > 0) mailOptions.attachments.push(...validAttachments);
        referencesHtml = `
            <hr><h3>Выбранные референсы:</h3><div style="display: flex; flex-wrap: wrap; gap: 10px;">
            ${validAttachments.map(att => `<img src="cid:${att.cid}" alt="Референс" style="width: 100px; height: 100px; object-fit: cover; border-radius: 8px;">`).join('')}
            </div>`;
    }
    
    let filesHtml = '';
    if (files && files.length > 0) {
         filesHtml = `<hr><h3>Прикрепленные файлы (${files.length} шт.):</h3><ul>
            ${files.map(file => {
                const decodedOriginalName = Buffer.from(file.originalname, 'latin1').toString('utf8');
                return `<li>${decodedOriginalName}</li>`;
             }).join('')}</ul>`;
        mailOptions.attachments.push(...files.map(file => ({
            filename: Buffer.from(file.originalname, 'latin1').toString('utf8'),
            path: file.path
        })));
    }
    
    const newSubmission = {
        name, phone, email, company: company || 'Не указана', task, promo: promo || 'Не указан',
        timestamp: admin.firestore.FieldValue.serverTimestamp(), ip: req.ip, userAgent: req.headers['user-agent'],
        fileNames: files && files.length > 0 ? files.map(f => Buffer.from(f.originalname, 'latin1').toString('utf8')) : [],
        references: references || []
    };

    try {
        mailOptions.html = `<div style="font-family: Arial, sans-serif; line-height: 1.6;"><h2>Новая заявка на расчёт стоимости</h2><p><strong>Имя:</strong> ${name}</p><p><strong>Телефон:</strong> ${phone}</p><p><strong>Email:</strong> ${email}</p><p><strong>Компания:</strong> ${newSubmission.company}</p><p><strong>Промокод:</strong> ${newSubmission.promo}</p><hr><h3>Задача:</h3><p>${task}</p>${filesHtml}${referencesHtml}</div>`;
        await transporter.sendMail(mailOptions);
        await db.collection('submissions').add(newSubmission);
        res.status(200).json({ success: true, message: 'Заявка успешно отправлена!' });
    } catch (error) {
        console.error('ОШИБКА ПРИ ОБРАБОТКЕ ЗАЯВКИ:', error);
        res.status(500).json({ success: false, message: 'Внутренняя ошибка сервера.' });
    } finally {
        if (files && files.length > 0) files.forEach(file => fs.unlinkSync(file.path));
    }
});

app.post('/api/submit-application', resumeUpload.single('resume'), [
    body('name').trim().notEmpty(), body('phone').trim().notEmpty()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) { if (req.file) fs.unlinkSync(req.file.path); return res.status(400).json({ success: false, message: 'Ошибка валидации' }); }
    if (!req.file) { return res.status(400).json({ success: false, message: 'Файл резюме не был загружен.' }); }
    
    const { name, phone, desiredPosition } = req.body;
    const resumeFile = req.file;
    const decodedOriginalName = Buffer.from(resumeFile.originalname, 'latin1').toString('utf8');
    const newApplication = {
        name, phone, desiredPosition: desiredPosition || 'Кадровый резерв',
        timestamp: admin.firestore.FieldValue.serverTimestamp(), ip: req.ip, userAgent: req.headers['user-agent'], 
        resumeFileName: decodedOriginalName,
    };
    try {
        const mailOptions = {
            from: `"Отклик на вакансию" <${process.env.EMAIL_USER}>`, to: process.env.EMAIL_HR_RECEIVER,
            subject: `Новый отклик: ${newApplication.desiredPosition} от ${name}`,
            html: `<div>...</div>`, // Содержимое письма как и раньше
            attachments: [{ filename: decodedOriginalName, path: resumeFile.path }]
        };
        mailOptions.html = `<div style="font-family: Arial, sans-serif; line-height: 1.6;"><h2>Новый отклик на вакансию</h2><p><strong>Кандидат:</strong> ${name}</p><p><strong>Телефон:</strong> ${phone}</p><p><strong>Желаемая должность:</strong> ${newApplication.desiredPosition}</p><hr><p>Резюме кандидата прикреплено к этому письму (файл: ${decodedOriginalName}).</p></div>`
        await transporter.sendMail(mailOptions);
        await db.collection('applications').add(newApplication);
        res.status(200).json({ success: true, message: `Спасибо за отклик, ${name}! Мы свяжемся с вами.` });
    } catch (error) {
        console.error('ОШИБКА ПРИ ОБРАБОТКЕ ОТКЛИКА:', error);
        res.status(500).json({ success: false, message: 'Внутренняя ошибка сервера.' });
    } finally {
        fs.unlinkSync(resumeFile.path);
    }
});

app.post('/api/subscribe', [ body('email').trim().isEmail() ], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) { return res.status(400).json({ success: false, message: 'Некорректный email' }); }
    const { email, sphere } = req.body;
    const subscribersRef = db.collection('subscribers');
    try {
        const snapshot = await subscribersRef.where('email', '==', email).get();
        if (!snapshot.empty) { return res.status(409).json({ success: false, message: 'Вы уже подписаны!' }); }
        await subscribersRef.add({ email, sphere: sphere || 'Не указана', subscribedAt: admin.firestore.FieldValue.serverTimestamp() });
        res.status(200).json({ success: true, message: 'Спасибо за подписку!' });
    } catch (error) {
        console.error('ОШИБКА ПРИ ПОДПИСКЕ:', error);
        res.status(500).json({ success: false, message: 'Произошла ошибка.' });
    }
});

app.use((error, req, res, next) => {
    if (error) {
        console.error(error);
        if (error instanceof multer.MulterError) {
            return res.status(400).json({ success: false, message: 'Ошибка загрузки файла: ' + error.message });
        }
        return res.status(400).json({ success: false, message: error.message });
    }
    next();
});

// Экспортируем Express-приложение как облачную функцию с именем 'api'
export const api = functions.region('europe-west1').https.onRequest(app);