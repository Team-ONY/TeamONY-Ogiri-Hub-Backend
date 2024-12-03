import request from 'supertest';
import express from 'express';
import imageRouter from '../../routes/image';
import { generateImage } from '../../services/openai';

// コンソールエラーのモック化
const mockConsoleError = jest.spyOn(console, 'error').mockImplementation(() => {});

jest.mock('../../services/openai', () => ({
  generateImage: jest.fn(),
}));

const app = express();
app.use(express.json());
app.use('/api/image', imageRouter);

describe('Image Router', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    mockConsoleError.mockRestore();
  });

  it('正常に画像を生成できること', async () => {
    const mockUrl = 'https://example.com/test.jpg';
    (generateImage as jest.Mock).mockResolvedValue(mockUrl);

    const response = await request(app)
      .post('/api/image/generate')
      .send({ prompt: 'テスト用プロンプト' });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ imageUrl: mockUrl });
  });

  it('プロンプトが空の場合にエラーを返すこと', async () => {
    const response = await request(app).post('/api/image/generate').send({ prompt: '' });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
  });

  it('画像生成に失敗した場合に500エラーを返すこと', async () => {
    const mockError = new Error('画像生成エラー');
    (generateImage as jest.Mock).mockRejectedValue(mockError);

    const response = await request(app)
      .post('/api/image/generate')
      .send({ prompt: 'テスト用プロンプト' });

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: '画像生成に失敗しました' });
    expect(mockConsoleError).toHaveBeenCalledWith('画像生成エラー:', mockError);
  });
});
