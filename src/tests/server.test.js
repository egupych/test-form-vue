import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import { createApp } from '../../server.js'; // Импортируем функцию createApp

let app; // Переменная для хранения экземпляра приложения
let mockAdmin; // Переменная для хранения замокированного admin
let mockDb; // Переменная для хранения замокированного db

beforeEach(() => {
  // Сбрасываем все моки перед каждым тестом
  vi.resetAllMocks();

  // Создаем замокированные объекты admin и db
  mockAdmin = {
    initializeApp: vi.fn(),
    credential: {
      applicationDefault: vi.fn(),
    },
    firestore: vi.fn(() => ({
      collection: vi.fn(() => ({
        add: vi.fn().mockResolvedValue(true),
        where: vi.fn(() => ({
          get: vi.fn().mockResolvedValue({ empty: true }),
        })),
      })),
      FieldValue: {
        serverTimestamp: vi.fn(() => 'MOCKED_TIMESTAMP'),
      },
    })),
  };

  mockDb = mockAdmin.firestore();

  app = createApp(mockAdmin, mockDb); // Передаем замокированные admin и db
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
      // Отсутствует телефон
      .field('email', 'test@example.com')
      .field('task', 'Это тестовое задание.');

    expect(response.statusCode).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe('Ошибка валидации');
  });
});
