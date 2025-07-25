import * as functions from 'firebase-functions';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { body, validationResult } from 'express-validator';
import nodemailer from 'nodemailer';
import admin from 'firebase-admin';
import multer from 'multer';
import { promises as fsPromises } from 'fs';
import path from 'path';

// Инициализация Firebase Admin SDK
admin.initializeApp();
const db = admin.firestore();

// --- Конфигурация Multer для основной формы ---
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
const ALLOWED_MIMETYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation', // .pptx
  'application/zip',
  'application/x-rar-compressed',
  'application/x-7z-compressed',
  'application/postscript', // .ai, .eps
  'image/vnd.adobe.photoshop', // .psd
];

// Multer будет использовать временную директорию Cloud Functions
const mainFormUpload = multer({
  dest: '/tmp/', // Используем временную директорию Cloud Functions
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter: (req, file, cb) => {
    let originalname = file.originalname;
    try {
      originalname = Buffer.from(file.originalname, 'latin1').toString('utf8');
    } catch (e) {
      console.error('Ошибка декодирования имени файла:', e);
    }
    console.log('Multer file object:', file);
    if (ALLOWED_MIMETYPES.includes(file.mimetype)) {
      cb(null, true);
    } else {
      req.fileValidationError = `Недопустимый тип файла для макета: ${originalname}.`;
      cb(null, false);
    }
  },
});

// --- НОВАЯ КОНФИГУРАЦИЯ MULTER ДЛЯ РЕЗЮМЕ ---
const MAX_RESUME_SIZE = 15 * 1024 * 1024; // 15 MB
const ALLOWED_RESUME_MIMETYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
  'image/jpeg',
  'image/png', // Также разрешим изображения для резюме
];

const resumeUpload = multer({
  dest: '/tmp/', // Используем временную директорию Cloud Functions
  limits: { fileSize: MAX_RESUME_SIZE },
  fileFilter: (req, file, cb) => {
    let originalname = file.originalname;
    try {
      originalname = Buffer.from(file.originalname, 'latin1').toString('utf8');
    } catch (e) {
      console.error('Ошибка декодирования имени файла:', e);
    }
    console.log('Multer file object:', file);
    if (ALLOWED_RESUME_MIMETYPES.includes(file.mimetype)) {
      cb(null, true);
    } else {
      req.fileValidationError = `Недопустимый тип файла для резюме: ${originalname}.`;
      cb(null, false);
    }
  },
});
// --- КОНЕЦ НОВОЙ КОНФИГУРАЦИИ ---

const app = express();

// Инициализация Nodemailer с использованием переменных окружения Cloud Functions
const transporter = nodemailer.createTransport({
  host: functions.config().email.host,
  port: parseInt(functions.config().email.port, 10),
  secure: functions.config().email.secure === 'true',
  auth: {
    user: functions.config().email.user,
    pass: process.env.EMAIL_PASS,
  },
});

app.use(express.json());
app.use(helmet());

// CORS whitelist для Firebase Hosting
const whitelist = ['https://redpanda.web.app', 'http://localhost:5173']; // Добавил https://redpanda.web.app
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
};
app.use(cors(corsOptions));

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
    if (req.fileValidationError) {
      return res.status(400).json({ success: false, message: req.fileValidationError });
    }
    next();
  },
  [
    body('name').trim().notEmpty().withMessage('Имя не может быть пустым'),
    body('phone').trim().notEmpty().withMessage('Телефон не может быть пустым'),
    body('email').trim().isEmail().withMessage('Некорректный email адрес'),
    body('task')
      .trim()
      .notEmpty()
      .withMessage('Описание задачи не может быть пустым'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      if (req.files) {
        await Promise.all(req.files.map(file => fsPromises.unlink(file.path)));
      }
      return res.status(400).json({
        success: false,
        message: 'Ошибка валидации',
        errors: errors.array(),
      });
    }

    const { name, phone, email, company, task, promo } = req.body;
    const files = req.files;

    const newSubmission = {
      name,
      phone,
      email,
      company: company || 'Не указана',
      task,
      promo: promo || 'Не указан',
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      ip: req.ip,
      userAgent: req.headers['user-agent'],
      fileNames:
        files && files.length > 0
          ? files.map((f) => f.originalname)
          : ['Нет файлов'],
    };

    try {
      const mailOptions = {
        from: `"Форма с сайта RedPanda" <${functions.config().email.user}>`,
        to: functions.config().email.receiver,
        subject: `Новая заявка с сайта от ${name}`,
        html: `<div style="font-family: Arial, sans-serif; line-height: 1.6;"><h2>Новая заявка на расчёт стоимости</h2><p><strong>Имя:</strong> ${name}</p><p><strong>Телефон:</strong> ${phone}</p><p><strong>Email:</strong> ${email}</p><p><strong>Компания:</strong> ${newSubmission.company}</p><p><strong>Промокод:</strong> ${newSubmission.promo}</p><hr><h3>Задача:</h3><p>${task}</p></div>`,
        attachments: [],
      };

      if (files && files.length > 0) {
        mailOptions.attachments = files.map((file) => ({
          filename: file.originalname,
          path: file.path,
        }));
      }

      await db.collection('submissions').add(newSubmission);
      await transporter.sendMail(mailOptions);

      res
        .status(200)
        .json({ success: true, message: 'Заявка успешно отправлена!' });
    } catch (error) {
      console.error('ОШИБКА ПРИ ОБРАБОТКЕ ЗАЯВКИ:', error);
      res
        .status(500)
        .json({ success: false, message: 'Внутренняя ошибка сервера.' });
    } finally {
      if (files && files.length > 0) {
        await Promise.all(files.map(file => fsPromises.unlink(file.path)));
      }
    }
  }
);

// --- НОВЫЙ ОБРАБОТЧИК ДЛЯ ВАКАНСИЙ ---
app.post(
  '/api/submit-application',
  resumeUpload.single('resume'), // Принимаем один файл с именем 'resume'
  (req, res, next) => {
    if (req.fileValidationError) {
      return res.status(400).json({ success: false, message: req.fileValidationError });
    }
    next();
  },
  [
    body('name').trim().notEmpty().withMessage('Имя не может быть пустым'),
    body('phone').trim().notEmpty().withMessage('Телефон не может быть пустым'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      if (req.file) {
        await fsPromises.unlink(req.file.path);
      }
      return res.status(400).json({
        success: false,
        message: 'Ошибка валидации',
        errors: errors.array(),
      });
    }

    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: 'Файл резюме не был загружен.' });
    }

    const { name, phone, desiredPosition } = req.body;
    const resumeFile = req.file;

    const newApplication = {
      name,
      phone,
      desiredPosition: desiredPosition || 'Кадровый резерв',
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      ip: req.ip,
      userAgent: req.headers['user-agent'],
      resumeFileName: resumeFile.originalname,
    };

    try {
      const mailOptions = {
        from: `"Отклик на вакансию" <${functions.config().email.user}>`,
        to: functions.config().email.hr_receiver,
        subject: `Новый отклик: ${newApplication.desiredPosition} от ${name}`,
        html: `<div style="font-family: Arial, sans-serif;">
                         <h2>Новый отклик на вакансию</h2>
                         <p><strong>Кандидат:</strong> ${name}</p>
                         <p><strong>Телефон:</strong> ${phone}</p>
                         <p><strong>Желаемая должность:</strong> ${newApplication.desiredPosition}</p>
                         <hr>
                         <p>Резюме кандидата прикреплено к этому письму.</p>
                       </div>`,
        attachments: [
          {
            filename: resumeFile.originalname,
            path: resumeFile.path,
          },
        ],
      };

      await db.collection('applications').add(newApplication);
      await transporter.sendMail(mailOptions);

      res.status(200).json({
        success: true,
        message: `Спасибо за отклик, ${name}! Мы свяжемся с вами.`,
      });
    } catch (error) {
      console.error('ОШИБКА ПРИ ОБРАБОТКЕ ОТКЛИКА:', error);
      res
        .status(500)
        .json({ success: false, message: 'Внутренняя ошибка сервера.' });
    } finally {
      await fsPromises.unlink(resumeFile.path); // Удаляем файл после отправки
    }
  }
);
// --- КОНЕЦ НОВОГО ОБРАБОТЧИКА ---

// --- Обработчик подписки ---
app.post(
  '/api/subscribe',
  [body('email').trim().isEmail().withMessage('Некорректный email адрес.')],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ success: false, message: errors.array()[0].msg });
    }

    const { email, sphere } = req.body;
    const subscribersRef = db.collection('subscribers');

    try {
      const snapshot = await subscribersRef.where('email', '==', email).get();
      if (!snapshot.empty) {
        return res.status(409).json({
          success: false,
          message: 'Вы уже подписаны на нашу рассылку!',
        });
      }

      await subscribersRef.add({
        email: email,
        sphere: sphere || 'Не указана',
        subscribedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      res.status(200).json({ success: true, message: 'Спасибо за подписку!' });
    } catch (error) {
      console.error('ОШИБКА ПРИ ПОДПИСКЕ:', error);
      res.status(500).json({
        success: false,
        message: 'Произошла ошибка. Попробуйте снова.',
      });
    }
  }
);

// --- Обработчик ошибок Multer ---
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res
        .status(400)
        .json({ success: false, message: 'Файл слишком большой.' });
    }
  } else if (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
  next();
});

// Экспортируем Express-приложение как HTTP-функцию
export const api = functions.runWith({ secrets: ["EMAIL_PASS"] }).https.onRequest(app);
