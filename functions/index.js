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

// Инициализация Firebase Admin SDK
admin.initializeApp();
const db = admin.firestore();

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

// CORS whitelist
const whitelist = ['https://redpanda.web.app', 'http://localhost:5173', 'https://redpanda-cca8e.web.app'];
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

// --- Обработчик подписки ---
app.post(
    '/api/subscribe',
    express.json(), // Добавляем express.json() только для этого маршрута
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

const upload = multer({ storage: multer.memoryStorage() });

// --- Обработчик отправки заявки на вакансию ---
app.post(
    '/api/submit-application',
    upload.single('resume'), // 'resume' - это имя поля для файла в форме
    [
        body('name').trim().notEmpty().withMessage('Имя обязательно.'),
        body('email').trim().isEmail().withMessage('Некорректный email адрес.'),
        body('phone').trim().notEmpty().withMessage('Телефон обязателен.'),
        body('message').trim().optional().isLength({ max: 1000 }).withMessage('Сообщение слишком длинное.'),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, message: errors.array()[0].msg });
        }

        const { name, email, phone, message } = req.body;
        const resumeFile = req.file; // Это будет содержать загруженный файл

        if (!resumeFile) {
            return res.status(400).json({ success: false, message: 'Резюме обязательно.' });
        }

        try {
            // 1. Сохранение в Firestore
            const applicationData = {
                name,
                email,
                phone,
                message: message || '',
                resumeFileName: resumeFile.originalname,
                submittedAt: admin.firestore.FieldValue.serverTimestamp(),
            };
            await db.collection('applications').add(applicationData);

            // 2. Отправка email
            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: process.env.EMAIL_RECEIVER, // Предполагается, что это получатель для заявок
                subject: `Новая заявка на вакансию от ${name}`,
                html: `
                    <p><strong>Имя:</strong> ${name}</p>
                    <p><strong>Email:</strong> ${email}</p>
                    <p><strong>Телефон:</strong> ${phone}</p>
                    <p><strong>Сообщение:</strong> ${message || 'Нет сообщения'}</p>
                `,
                attachments: [
                    {
                        filename: resumeFile.originalname,
                        content: resumeFile.buffer, // Multer сохраняет буфер в memoryStorage
                        contentType: resumeFile.mimetype,
                    },
                ],
            };

            await transporter.sendMail(mailOptions);

            res.status(200).json({ success: true, message: 'Заявка успешно отправлена!' });

        } catch (error) {
            console.error('ОШИБКА ПРИ ОТПРАВКЕ ЗАЯВКИ:', error);
            res.status(500).json({ success: false, message: 'Произошла ошибка при отправке заявки. Попробуйте снова.' });
        }
    }
);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// --- Настройки и экспорт функции 2-го поколения ---
setGlobalOptions({region: "us-central1", secrets: ["EMAIL_PASS", "EMAIL_HOST", "EMAIL_PORT", "EMAIL_SECURE", "EMAIL_USER", "EMAIL_RECEIVER", "HR_RECEIVER"]});
exports.api = onRequest(app);