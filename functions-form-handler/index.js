const functions = require("firebase-functions");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");
const Busboy = require("busboy");
const os = require("os");
const path = require("path");
const fs = require("fs");

// Инициализация Nodemailer (используйте переменные окружения или секреты)
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT, 10),
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

exports.submitForm = functions.https.onRequest((req, res) => {
    // Устанавливаем CORS заголовки для ответа
    res.set('Access-Control-Allow-Origin', 'https://redpanda-cca8e.web.app');
    res.set('Access-Control-Allow-Methods', 'POST');
    res.set('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        // Pre-flight запрос
        res.status(204).send('');
        return;
    }

    if (req.method !== 'POST') {
        res.status(405).send('Method Not Allowed');
        return;
    }

    const busboy = Busboy({ headers: req.headers });
    const tmpdir = os.tmpdir();

    const fields = {};
    const uploads = {};
    const fileWrites = [];

    busboy.on('field', (fieldname, val) => {
        fields[fieldname] = val;
    });

    busboy.on('file', (fieldname, file, { filename }) => {
        const filepath = path.join(tmpdir, filename);
        uploads[filename] = { filepath, fieldname };

        const writeStream = fs.createWriteStream(filepath);
        file.pipe(writeStream);

        const promise = new Promise((resolve, reject) => {
            file.on('end', () => {
                writeStream.end();
            });
            writeStream.on('finish', resolve);
            writeStream.on('error', reject);
        });
        fileWrites.push(promise);
    });

    busboy.on('finish', async () => {
        try {
            await Promise.all(fileWrites);

            const { name, phone, email, company, task, promo } = fields;

            // Валидация полей
            if (!name || !phone || !email || !task) {
                return res.status(400).json({ success: false, message: "Ошибка валидации: не все поля заполнены." });
            }

            const newSubmission = {
                name, phone, email, 
                company: company || 'Не указана',
                task, 
                promo: promo || 'Не указан',
                timestamp: admin.firestore.FieldValue.serverTimestamp(),
                ip: req.ip,
                userAgent: req.get('user-agent'),
                fileNames: Object.keys(uploads).length > 0 ? Object.keys(uploads) : ['Нет файлов'],
            };

            const attachments = Object.keys(uploads).map(filename => ({
                filename: filename,
                path: uploads[filename].filepath,
            }));

            const mailOptions = {
                from: `"Форма с сайта RedPanda" <${process.env.EMAIL_USER}>`,
                to: process.env.EMAIL_RECEIVER,
                subject: `Новая заявка с сайта от ${name}`,
                html: `<p><strong>Имя:</strong> ${name}</p><p><strong>Телефон:</strong> ${phone}</p><p><strong>Email:</strong> ${email}</p><p><strong>Компания:</strong> ${newSubmission.company}</p><p><strong>Промокод:</strong> ${newSubmission.promo}</p><hr><h3>Задача:</h3><p>${task}</p>`,
                attachments: attachments,
            };

            await admin.firestore().collection('submissions').add(newSubmission);
            await transporter.sendMail(mailOptions);

            res.status(200).json({ success: true, message: 'Заявка успешно отправлена!' });

        } catch (error) {
            console.error('ОШИБКА ПРИ ОБРАБОТКЕ ЗАЯВКИ:', error);
            res.status(500).json({ success: false, message: 'Внутренняя ошибка сервера.' });
        } finally {
            // Очистка временных файлов
            for (const filename in uploads) {
                fs.unlinkSync(uploads[filename].filepath);
            }
        }
    });

    busboy.end(req.rawBody);
});
