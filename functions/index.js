// Код functions/index.js
// Финальная, стабильная версия, написанная на нативном синтаксисе Firebase Functions

const functions = require("firebase-functions");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");
const Busboy = require("busboy");
const path = require("path");
const os = require("os");
const fs = require("fs");
const fetch = require("node-fetch");

// Инициализация Firebase
if (!admin.apps.length) {
  admin.initializeApp();
}
const db = admin.firestore();

// --- Настройки почты (читаются из конфигурации Firebase) ---
const env = functions.config();
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

// --- ФУНКЦИЯ 1: Обработка основной формы расчета ---
exports.submitForm = functions.region("europe-west1").https.onRequest(async (req, res) => {
    // Разрешаем запросы с вашего сайта
    res.set('Access-Control-Allow-Origin', 'https://redpanda.web.app');
    res.set('Access-Control-Allow-Methods', 'POST');
    res.set('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.status(204).send('');
        return;
    }

    if (req.method !== 'POST') {
        res.status(405).send('Method Not Allowed');
        return;
    }

    if (!transporter) {
        console.error("Сервис почты не инициализирован.");
        res.status(500).json({ success: false, message: "Ошибка конфигурации сервера." });
        return;
    }

    const busboy = Busboy({ headers: req.headers });
    const tmpdir = os.tmpdir();

    const fields = {};
    const uploads = {};
    const fileWrites = [];

    busboy.on('field', (fieldname, val) => {
        const key = fieldname.replace('[]', '');
        if (fieldname.endsWith('[]')) {
            if (!fields[key]) fields[key] = [];
            fields[key].push(val);
        } else {
            fields[key] = val;
        }
    });

    busboy.on('file', (fieldname, file, filenameInfo) => {
        const { filename } = filenameInfo;
        const filepath = path.join(tmpdir, filename);
        uploads[filename] = filepath;

        const writeStream = fs.createWriteStream(filepath);
        file.pipe(writeStream);

        const promise = new Promise((resolve, reject) => {
            file.on('end', () => writeStream.end());
            writeStream.on('finish', resolve);
            writeStream.on('error', reject);
        });
        fileWrites.push(promise);
    });

    busboy.on('finish', async () => {
        await Promise.all(fileWrites);

        try {
            const { name, phone, email, company, task, promo } = fields;
            const references = fields.references || [];
            const mailOptions = { from: `"Форма с сайта RedPanda" <${env.email.user}>`, to: env.email.receiver, subject: `Новая заявка с сайта от ${name}`, attachments: [] };

            let referencesHtml = '';
            if (references.length > 0) {
                const baseUrl = env.app.base_url;
                const referenceAttachments = await Promise.all(
                    references.map(async (url, index) => {
                        try {
                            const absoluteUrl = url.startsWith('http') ? url : `${baseUrl}${url}`;
                            const response = await fetch(absoluteUrl);
                            if (!response.ok) return null;
                            const buffer = await response.buffer();
                            const cid = `reference-${index}@redpanda.kz`;
                            return { filename: path.basename(url), content: buffer, cid };
                        } catch (_error) { /* eslint-disable-line no-unused-vars */ return null; }
                    })
                );
                const validAttachments = referenceAttachments.filter(Boolean);
                if(validAttachments.length > 0) mailOptions.attachments.push(...validAttachments);
                referencesHtml = `<hr><h3>Выбранные референсы:</h3><div style="display: flex; flex-wrap: wrap; gap: 10px;">${validAttachments.map(att => `<img src="cid:${att.cid}" alt="Референс" style="width: 100px; height: 100px; object-fit: cover;">`).join('')}</div>`;
            }
            
            let filesHtml = '';
            if (Object.keys(uploads).length > 0) {
                filesHtml = `<hr><h3>Прикрепленные файлы:</h3><ul>${Object.keys(uploads).map(filename => `<li>${filename}</li>`).join('')}</ul>`;
                for (const filename in uploads) {
                    mailOptions.attachments.push({ filename, path: uploads[filename] });
                }
            }
            
            const newSubmission = { name, phone, email, company: company || 'N/A', task, promo: promo || 'N/A', timestamp: admin.firestore.FieldValue.serverTimestamp(), fileNames: Object.keys(uploads), references };
            mailOptions.html = `<div style="font-family: Arial, sans-serif;"><h2>Новая заявка</h2><p><strong>Имя:</strong> ${name}</p><p><strong>Телефон:</strong> ${phone}</p><p><strong>Email:</strong> ${email}</p><p><strong>Компания:</strong> ${newSubmission.company}</p><p><strong>Промокод:</strong> ${newSubmission.promo}</p><hr><h3>Задача:</h3><p>${task}</p>${filesHtml}${referencesHtml}</div>`;
            
            await transporter.sendMail(mailOptions);
            await db.collection('submissions').add(newSubmission);

            res.status(200).json({ success: true, message: 'Заявка успешно отправлена!' });
        } catch (_error) {
            console.error("КРИТИЧЕСКАЯ ОШИБКА в submitForm:", _error);
            res.status(500).json({ success: false, message: 'Произошла внутренняя ошибка сервера.' });
        } finally {
            for (const filename in uploads) {
                fs.unlinkSync(uploads[filename]);
            }
        }
    });

    req.pipe(busboy);
});

// --- ФУНКЦИЯ 2: Обработка формы вакансий ---
exports.submitApplication = functions.region("europe-west1").https.onRequest(async (req, res) => {
    res.set('Access-Control-Allow-Origin', 'https://redpanda.web.app');
    res.set('Access-Control-Allow-Methods', 'POST');
    res.set('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.status(204).send('');
        return;
    }

    if (!transporter) {
        console.error("Сервис почты не инициализирован.");
        res.status(500).json({ success: false, message: "Ошибка конфигурации сервера." });
        return;
    }

    const busboy = Busboy({ headers: req.headers });
    const tmpdir = os.tmpdir();
    const fields = {};
    let uploadFile = null;
    const fileWrites = [];

    busboy.on('field', (fieldname, val) => {
        fields[fieldname] = val;
    });

    busboy.on('file', (fieldname, file, filenameInfo) => {
        const { filename } = filenameInfo;
        const filepath = path.join(tmpdir, filename);
        uploadFile = { filepath, filename };

        const writeStream = fs.createWriteStream(filepath);
        file.pipe(writeStream);

        const promise = new Promise((resolve, reject) => {
            file.on('end', () => writeStream.end());
            writeStream.on('finish', resolve);
            writeStream.on('error', reject);
        });
        fileWrites.push(promise);
    });

    busboy.on('finish', async () => {
        await Promise.all(fileWrites);

        if (!uploadFile) {
            res.status(400).json({ success: false, message: "Файл резюме не был загружен." });
            return;
        }

        try {
            const { name, phone, desiredPosition } = fields;
            const newApplication = { name, phone, desiredPosition: desiredPosition || 'Кадровый резерв', timestamp: admin.firestore.FieldValue.serverTimestamp(), resumeFileName: uploadFile.filename };
            
            const mailOptions = { from: `"Отклик на вакансию" <${env.email.user}>`, to: env.email.hr_receiver, subject: `Новый отклик: ${newApplication.desiredPosition} от ${name}`, html: `<div>...</div>`, attachments: [{ filename: uploadFile.filename, path: uploadFile.filepath }] };
            mailOptions.html = `<div style="font-family: Arial, sans-serif;"><h2>Новый отклик на вакансию</h2><p><strong>Кандидат:</strong> ${name}</p><p><strong>Телефон:</strong> ${phone}</p><p><strong>Желаемая должность:</strong> ${newApplication.desiredPosition}</p><hr><p>Резюме прикреплено.</p></div>`;

            await transporter.sendMail(mailOptions);
            await db.collection('applications').add(newApplication);

            res.status(200).json({ success: true, message: `Спасибо за отклик, ${name}!` });
        } catch (_error) {
            console.error("КРИТИЧЕСКАЯ ОШИБКА в submitApplication:", _error);
            res.status(500).json({ success: false, message: 'Внутренняя ошибка сервера.' });
        } finally {
            if (uploadFile) {
                fs.unlinkSync(uploadFile.filepath);
            }
        }
    });

    req.pipe(busboy);
});

// --- ФУНКЦИЯ 3: Обработка подписки на рассылку ---
exports.subscribe = functions.region("europe-west1").https.onCall(async (data) => {
    const { email, sphere } = data;
    if (!email) {
        throw new functions.https.HttpsError('invalid-argument', 'Email обязателен.');
    }
    
    try {
        const subscribersRef = db.collection('subscribers');
        const snapshot = await subscribersRef.where('email', '==', email).get();
        if (!snapshot.empty) {
            throw new functions.https.HttpsError('already-exists', 'Вы уже подписаны!');
        }
        await subscribersRef.add({ email, sphere: sphere || 'Не указана', subscribedAt: admin.firestore.FieldValue.serverTimestamp() });
        return { success: true, message: 'Спасибо за подписку!' };
    } catch (_error) {
        console.error("КРИТИЧЕСКАЯ ОШИБКА в subscribe:", _error);
        throw new functions.https.HttpsError('internal', 'Произошла ошибка на сервере.');
    }
});