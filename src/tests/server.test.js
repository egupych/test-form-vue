import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import { createApp } from '../../server.js'; // Импортируем функцию createApp

let app;
let mockAdmin;
let mockDb;
let mockTransporter;

beforeEach(() => {
  vi.resetAllMocks();

  // Настройка мока для Firestore
  const mockFirestoreInstance = {
    collection: vi.fn(() => ({
      add: vi.fn().mockResolvedValue(true),
      where: vi.fn(() => ({
        get: vi.fn().mockResolvedValue({ empty: true }),
      })),
    })),
  };

  // Мокируем admin.firestore как функцию, у которой есть свойство FieldValue
  const mockFirestore = vi.fn(() => mockFirestoreInstance);
  mockFirestore.FieldValue = {
    serverTimestamp: vi.fn(() => 'MOCKED_TIMESTAMP'),
  };

  mockAdmin = {
    initializeApp: vi.fn(),
    credential: {
      applicationDefault: vi.fn(),
    },
    firestore: mockFirestore, // Используем наш новый, более сложный мок
  };

  mockDb = mockAdmin.firestore();

  mockTransporter = {
    sendMail: vi.fn().mockResolvedValue(true),
    verify: vi.fn().mockResolvedValue(true),
  };

  // Создаем приложение с нашими моками
  app = createApp(mockAdmin, mockDb, mockTransporter);
});

describe('General API Endpoints', () => {
  it('should respond with 200 OK for the root endpoint', async () => {
    const response = await request(app).get('/');
    expect(response.statusCode).toBe(200);
  });
});

describe('POST /api/submit-form', () => {
  it('should return 200 OK for a valid submission', async () => {
    const response = await request(app)
      .post('/api/submit-form')
      .field('name', 'Тест Имя')
      .field('phone', '+79998887766')
      .field('email', 'test@example.com')
      .field('task', 'Это тестовое задание.');

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe('Заявка успешно отправлена!');
  });

  it('should return 400 for a submission with missing required fields', async () => {
    const response = await request(app)
      .post('/api/submit-form')
      .field('name', 'Тест Имя')
      .field('email', 'test@example.com')
      .field('task', 'Это тестовое задание.');

    expect(response.statusCode).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe('Ошибка валидации');
  });
});

describe('CORS Policy', () => {
  it('should allow requests from the whitelisted production domain', async () => {
    const response = await request(app)
      .post('/api/submit-form')
      .set('Origin', 'https://redpanda-cca8e.web.app')
      .field('name', 'CORS Test')
      .field('phone', '+71234567890')
      .field('email', 'cors@example.com')
      .field('task', 'Testing CORS');

    expect(response.statusCode).toBe(200);
    expect(response.headers['access-control-allow-origin']).toBe('https://redpanda-cca8e.web.app');
  });

  it('should block requests from a non-whitelisted domain', async () => {
    const response = await request(app)
      .post('/api/submit-form')
      .set('Origin', 'https://another-domain.com')
      .field('name', 'CORS Block Test')
      .field('phone', '+71234567890')
      .field('email', 'cors-blocked@example.com')
      .field('task', 'Testing CORS blocking');

    // Изменено: Ожидаем 400, так как наш обработчик ошибок возвращает именно его
    expect(response.statusCode).toBe(400);
    expect(response.body.message).toContain('Not allowed by CORS');
  });
});