const {onRequest} = require("firebase-functions/v2/https");
const {setGlobalOptions} = require("firebase-functions/v2/options");
const admin = require("firebase-admin");
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const {body, validationResult} = require("express-validator");
const nodemailer = require("nodemailer");
const multer = require("multer");
const {promises: fsPromises} = require("fs");

// Инициализация Firebase Admin SDK
admin.initializeApp();
const db = admin.firestore();

// --- Конфигурация Multer для основной формы ---
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
const ALLOWED_MIMETYPES = [
    'image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf',
    'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'application/zip', 'application/x-rar-compressed', 'application/x-7z-compressed',
    'application/postscript', 'image/vnd.adobe.photoshop',
];

const mainFormUpload = multer({
    dest: '/tmp/',
    limits: {fileSize: MAX_FILE_SIZE},
    fileFilter: (req, file, cb) => {
        if (ALLOWED_MIMETYPES.includes(file.mimetype)) {
            cb(null, true);
        } else {
            req.fileValidationError = `Недопустимый тип файла для макета: ${file.originalname}.`;
            cb(null, false);
        }
    },
});

// --- Конфигурация Multer для резюме ---
const MAX_RESUME_SIZE = 15 * 1024 * 1024; // 15 MB
const ALLOWED_RESUME_MIMETYPES = [
    'application/pdf', 'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'image/jpeg', 'image/png',
];

const resumeUpload = multer({
    dest: '/tmp/',
    limits: {fileSize: MAX_RESUME_SIZE},
    fileFilter: (req, file, cb) => {
        if (ALLOWED_RESUME_MIMETYPES.includes(file.mimetype)) {
            cb(null, true);
        } else {
            req.fileValidationError = `Недопустимый тип файла для резюме: ${file.originalname}.`;
            cb(null, false);
        }
    },
});

const app = express();

// Инициализация Nodemailer с использованием секретов
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT, 10),
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

app.use(helmet());
app.use(express.json());

// CORS whitelist
const whitelist = ['https://redpanda.web.app', 'http://localhost:5173'];
const corsOptions = {
    origin: function(origin, callback) {
        if (!origin || whitelist.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
};
app.use(cors(corsOptions));

// Rate Limiter
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
});
app.use('/api/', limiter);

// --- Обработчик основной формы ---
app.post(
    '/api/submit-form',
    mainFormUpload.array('files', 10),
    (req, res, next) => {
        if (req.fileValidationError) return res.status(400).json({success: false, message: req.fileValidationError});
        next();
    },
    [
        body('name').trim().notEmpty().withMessage('Имя не может быть пустым'),
        body('phone').trim().notEmpty().withMessage('Телефон не может быть пустым'),
        body('email').trim().isEmail().withMessage('Некорректный email адрес'),
        body('task').trim().notEmpty().withMessage('Описание задачи не может быть пустым'),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            if (req.files) await Promise.all(req.files.map(file => fsPromises.unlink(file.path)));
            return res.status(400).json({success: false, message: 'Ошибка валидации', errors: errors.array()});
        }

        const {name, phone, email, company, task, promo} = req.body;
        const newSubmission = {
            name, phone, email, company: company || 'Не указана', task, promo: promo || 'Не указан',
            timestamp: admin.firestore.FieldValue.serverTimestamp(),
            ip: req.ip, userAgent: req.headers['user-agent'],
            fileNames: req.files && req.files.length > 0 ? req.files.map((f) => f.originalname) : ['Нет файлов'],
        };

        try {
            const mailOptions = {
                from: `"Форма с сайта RedPanda" <${process.env.EMAIL_USER}>`,
                to: process.env.EMAIL_RECEIVER,
                subject: `Новая заявка с сайта от ${name}`,
                html: `<p><strong>Имя:</strong> ${name}</p><p><strong>Телефон:</strong> ${phone}</p><p><strong>Email:</strong> ${email}</p><p><strong>Компания:</strong> ${newSubmission.company}</p><p><strong>Промокод:</strong> ${newSubmission.promo}</p><hr><h3>Задача:</h3><p>${task}</p>`,
                attachments: req.files ? req.files.map((file) => ({filename: file.originalname, path: file.path})) : [],
            };
            await db.collection('submissions').add(newSubmission);
            await transporter.sendMail(mailOptions);
            res.status(200).json({success: true, message: 'Заявка успешно отправлена!'});
        } catch (error) {
            console.error('ОШИБКА ПРИ ОБРАБОТКЕ ЗАЯВКИ:', error);
            res.status(500).json({success: false, message: 'Внутренняя ошибка сервера.'});
        } finally {
            if (req.files && req.files.length > 0) await Promise.all(req.files.map(file => fsPromises.unlink(file.path)));
        }
    }
);

// --- Обработчик для вакансий ---
app.post(
    '/api/submit-application',
    resumeUpload.single('resume'),
    (req, res, next) => {
        if (req.fileValidationError) return res.status(400).json({success: false, message: req.fileValidationError});
        next();
    },
    [
        body('name').trim().notEmpty().withMessage('Имя не может быть пустым'),
        body('phone').trim().notEmpty().withMessage('Телефон не может быть пустым'),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            if (req.file) await fsPromises.unlink(req.file.path);
            return res.status(400).json({success: false, message: 'Ошибка валидации', errors: errors.array()});
        }
        if (!req.file) return res.status(400).json({success: false, message: 'Файл резюме не был загружен.'});

        const {name, phone, desiredPosition} = req.body;
        const newApplication = {
            name, phone, desiredPosition: desiredPosition || 'Кадровый резерв',
            timestamp: admin.firestore.FieldValue.serverTimestamp(),
            ip: req.ip, userAgent: req.headers['user-agent'],
            resumeFileName: req.file.originalname,
        };

        try {
            const mailOptions = {
                from: `"Отклик на вакансию" <${process.env.EMAIL_USER}>`,
                to: process.env.HR_RECEIVER,
                subject: `Новый отклик: ${newApplication.desiredPosition} от ${name}`,
                html: `<p><strong>Кандидат:</strong> ${name}</p><p><strong>Телефон:</strong> ${phone}</p><p><strong>Желаемая должность:</strong> ${newApplication.desiredPosition}</p><p>Резюме прикреплено.</p>`,
                attachments: [{filename: req.file.originalname, path: req.file.path}],
            };
            await db.collection('applications').add(newApplication);
            await transporter.sendMail(mailOptions);
            res.status(200).json({success: true, message: `Спасибо за отклик, ${name}! Мы свяжемся с вами.`});
        } catch (error) {
            console.error('ОШИБКА ПРИ ОБРАБОТКЕ ОТКЛИКА:', error);
            res.status(500).json({success: false, message: 'Внутренняя ошибка сервера.'});
        } finally {
            if (req.file) await fsPromises.unlink(req.file.path);
        }
    }
);

// --- Обработчик подписки ---
app.post(
    '/api/subscribe',
    [body('email').trim().isEmail().withMessage('Некорректный email адрес.')],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({success: false, message: errors.array()[0].msg});

        const {email, sphere} = req.body;
        try {
            const snapshot = await db.collection('subscribers').where('email', '==', email).get();
            if (!snapshot.empty) return res.status(409).json({success: false, message: 'Вы уже подписаны на нашу рассылку!'});
            
            await db.collection('subscribers').add({email, sphere: sphere || 'Не указана', subscribedAt: admin.firestore.FieldValue.serverTimestamp()});
            res.status(200).json({success: true, message: 'Спасибо за подписку!'});
        } catch (error) {
            console.error('ОШИБКА ПРИ ПОДПИСКЕ:', error);
            res.status(500).json({success: false, message: 'Произошла ошибка. Попробуйте снова.'});
        }
    }
);

// --- Обработчик ошибок Multer ---
app.use((error, req, res, next) => {
    if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({success: false, message: 'Файл слишком большой.'});
        }
    } else if (error) {
        return res.status(400).json({success: false, message: error.message});
    }
    next(error);
});


// --- Настройки и экспорт функции 2-го поколения ---
setGlobalOptions({region: "us-central1", secrets: ["EMAIL_PASS", "EMAIL_HOST", "EMAIL_PORT", "EMAIL_SECURE", "EMAIL_USER", "EMAIL_RECEIVER", "HR_RECEIVER"]});
exports.api = onRequest(app);