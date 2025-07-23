// Код functions/index.js
// Финальная, стабильная версия на основе оригинального server.js для 1-го поколения Firebase Functions

const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const { body, validationResult } = require("express-validator");
const nodemailer = require("nodemailer");
const path = require("path");
const admin = require("firebase-admin");
const multer = require("multer");
const fs = require("fs");
const fetch = require("node-fetch");

const env = functions.config();

if (!admin.apps.length) {
  admin.initializeApp();
}

const app = express();
const db = admin.firestore();

app.set('trust proxy', 1);
app.use(express.json());
app.use(cors({ origin: true }));
app.use(helmet());

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
});
app.use(limiter);

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
    dest: '/tmp/',
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
    dest: '/tmp/',
    limits: { fileSize: MAX_RESUME_SIZE },
    fileFilter: (req, file, cb) => {
        if (ALLOWED_RESUME_MIMETYPES.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Недопустимый тип файла для резюме! Разрешены: .pdf, .doc, .docx, .jpg, .png'), false);
        }
    }
});

let transporter;
if (env.email && env.email.host) {
    transporter = nodemailer.createTransport({
        host: env.email.host,
        port: parseInt(env.email.port, 10),
        secure: env.email.secure === 'true',
        auth: { user: env.email.user, pass: env.email.pass },
    });
} else {
    console.error("ОШИБКА: Конфигурация Nodemailer не найдена.");
}

app.post('/api/submit-form', mainFormUpload.array('files', 10), [
    body('name').trim().notEmpty(), body('phone').trim().notEmpty(),
    body('email').trim().isEmail(), body('task').trim().notEmpty()
], async (req, res) => {
  try {
    if (!transporter) {
        throw new Error("Сервис почты не инициализирован.");
    }
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        if (req.files) req.files.forEach(file => fs.unlinkSync(file.path));
        return res.status(400).json({ success: false, message: 'Ошибка валидации' });
    }

    const { name, phone, email, company, task, promo } = req.body;
    const files = req.files;
    const references = Array.isArray(req.body.references) ? req.body.references : (req.body.references ? [req.body.references] : []);
    const mailOptions = { from: `"Форма с сайта RedPanda" <${env.email.user}>`, to: env.email.receiver, subject: `Новая заявка с сайта от ${name}`, attachments: [] };
    
    let referencesHtml = '';
    if (references && references.length > 0) {
        const baseUrl = env.app.base_url;
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
                    const buffer = await response.buffer();
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
        referencesHtml = `<hr><h3>Выбранные референсы:</h3><div style="display: flex; flex-wrap: wrap; gap: 10px;">${validAttachments.map(att => `<img src="cid:${att.cid}" alt="Референс" style="width: 100px; height: 100px; object-fit: cover; border-radius: 8px;">`).join('')}</div>`;
    }
    
    let filesHtml = '';
    if (files && files.length > 0) {
         filesHtml = `<hr><h3>Прикрепленные файлы (${files.length} шт.):</h3><ul>${files.map(file => {const decodedOriginalName = Buffer.from(file.originalname, 'latin1').toString('utf8');return `<li>${decodedOriginalName}</li>`;}).join('')}</ul>`;
        mailOptions.attachments.push(...files.map(file => ({ filename: Buffer.from(file.originalname, 'latin1').toString('utf8'), path: file.path })));
    }
    
    const newSubmission = { name, phone, email, company: company || 'Не указана', task, promo: promo || 'Не указан', timestamp: admin.firestore.FieldValue.serverTimestamp(), ip: req.ip, userAgent: req.headers['user-agent'], fileNames: files && files.length > 0 ? files.map(f => Buffer.from(f.originalname, 'latin1').toString('utf8')) : [], references: references || [] };

    mailOptions.html = `<div style="font-family: Arial, sans-serif; line-height: 1.6;"><h2>Новая заявка на расчёт стоимости</h2><p><strong>Имя:</strong> ${name}</p><p><strong>Телефон:</strong> ${phone}</p><p><strong>Email:</strong> ${email}</p><p><strong>Компания:</strong> ${newSubmission.company}</p><p><strong>Промокод:</strong> ${newSubmission.promo}</p><hr><h3>Задача:</h3><p>${task}</p>${filesHtml}${referencesHtml}</div>`;
    
    await transporter.sendMail(mailOptions);
    await db.collection('submissions').add(newSubmission);

    if (files && files.length > 0) files.forEach(file => fs.unlinkSync(file.path));
    res.status(200).json({ success: true, message: 'Заявка успешно отправлена!' });

  } catch (error) {
    console.error("КРИТИЧЕСКАЯ ОШИБКА в /api/submit-form:", error);
    if (req.files) req.files.forEach(file => fs.unlinkSync(file.path));
    res.status(500).json({ success: false, message: 'Произошла внутренняя ошибка сервера.' });
  }
});

app.post('/api/submit-application', resumeUpload.single('resume'), [ body('name').trim().notEmpty(), body('phone').trim().notEmpty() ], async (req, res) => {
    try {
        if (!transporter) { throw new Error("Сервис почты не инициализирован."); }
        const errors = validationResult(req);
        if (!errors.isEmpty()) { if (req.file) fs.unlinkSync(req.file.path); return res.status(400).json({ success: false, message: 'Ошибка валидации' }); }
        if (!req.file) { return res.status(400).json({ success: false, message: 'Файл резюме не был загружен.' }); }
        const { name, phone, desiredPosition } = req.body;
        const resumeFile = req.file;
        const decodedOriginalName = Buffer.from(resumeFile.originalname, 'latin1').toString('utf8');
        const newApplication = { name, phone, desiredPosition: desiredPosition || 'Кадровый резерв', timestamp: admin.firestore.FieldValue.serverTimestamp(), ip: req.ip, userAgent: req.headers['user-agent'], resumeFileName: decodedOriginalName, };
        const mailOptions = { from: `"Отклик на вакансию" <${env.email.user}>`, to: env.email.hr_receiver, subject: `Новый отклик: ${newApplication.desiredPosition} от ${name}`, html: `<div style="font-family: Arial, sans-serif; line-height: 1.6;"><h2>Новый отклик на вакансию</h2><p><strong>Кандидат:</strong> ${name}</p><p><strong>Телефон:</strong> ${phone}</p><p><strong>Желаемая должность:</strong> ${newApplication.desiredPosition}</p><hr><p>Резюме кандидата прикреплено (файл: ${decodedOriginalName}).</p></div>`, attachments: [{ filename: decodedOriginalName, path: resumeFile.path }] };
        await transporter.sendMail(mailOptions);
        await db.collection('applications').add(newApplication);
        fs.unlinkSync(resumeFile.path);
        res.status(200).json({ success: true, message: `Спасибо за отклик, ${name}! Мы свяжемся с вами.` });
    } catch (error) {
        console.error("КРИТИЧЕСКАЯ ОШИБКА в /api/submit-application:", error);
        if (req.file) fs.unlinkSync(req.file.path);
        res.status(500).json({ success: false, message: 'Внутренняя ошибка сервера.' });
    }
});

app.post('/api/subscribe', [ 
    body('email').trim().isEmail() 
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) { return res.status(400).json({ success: false, message: 'Некорректный email' }); }
        const { email, sphere } = req.body;
        const subscribersRef = db.collection('subscribers');
        const snapshot = await subscribersRef.where('email', '==', email).get();
        if (!snapshot.empty) { return res.status(409).json({ success: false, message: 'Вы уже подписаны!' }); }
        await subscribersRef.add({ email, sphere: sphere || 'Не указана', subscribedAt: admin.firestore.FieldValue.serverTimestamp() });
        res.status(200).json({ success: true, message: 'Спасибо за подписку!' });
    } catch (error) {
        console.error("КРИТИЧЕСКАЯ ОШИБКА в /api/subscribe:", error);
        res.status(500).json({ success: false, message: 'Произошла ошибка.' });
    }
});

app.use((error, req, res, next) => {
    if (error) {
        console.error("ОШИБКА MIDDLEWARE:", error);
        if (error instanceof multer.MulterError) {
            return res.status(400).json({ success: false, message: 'Ошибка загрузки файла: ' + error.message });
        }
        return res.status(400).json({ success: false, message: error.message });
    }
    next();
});

exports.api = functions.region('europe-west1').https.onRequest(app);