import { vi } from 'vitest';



// Явно мокируем nodemailer
vi.doMock('nodemailer', () => {
  return {
    default: {
      createTransport: vi.fn(() => ({
        sendMail: vi.fn().mockResolvedValue(true),
        verify: vi.fn().mockImplementation((callback) => callback(null, true)),
      })),
    },
  };
});

// Устанавливаем NODE_ENV для тестовой среды
process.env.NODE_ENV = 'test';
