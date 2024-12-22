import { describe, expect, it, beforeEach, jest } from '@jest/globals';
import { Hono } from 'hono';
import { imageRoutes } from '../../routes/image';
import { generateImage } from '../../services/openai';

// コンソールエラーのモック化
const mockConsoleError = jest.spyOn(console, 'error').mockImplementation(() => {});

jest.mock('../../services/openai', () => ({
  generateImage: jest.fn(),
}));

// モックの型を明示的に定義
const mockGenerateImage = generateImage as jest.MockedFunction<typeof generateImage>;

describe('Image Router', () => {
  let app: Hono;

  beforeEach(() => {
    jest.clearAllMocks();
    app = new Hono().route('/api/image', imageRoutes);
  });

  afterAll(() => {
    mockConsoleError.mockRestore();
  });

  it('正常に画像を生成できること', async () => {
    const mockUrl = 'https://example.com/test.jpg';
    mockGenerateImage.mockResolvedValue(mockUrl);

    const res = await app.request('/api/image/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt: 'テスト用プロンプト' }),
    });

    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ imageUrl: mockUrl });
  });

  it('プロンプトが空の場合にエラーを返すこと', async () => {
    const res = await app.request('/api/image/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt: '' }),
    });

    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body).toHaveProperty('error');
  });

  it('画像生成に失敗した場合に500エラーを返すこと', async () => {
    const mockError = new Error('画像生成エラー');
    mockGenerateImage.mockRejectedValue(mockError);

    const res = await app.request('/api/image/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt: 'テスト用プロンプト' }),
    });

    expect(res.status).toBe(500);
    expect(await res.json()).toEqual({ error: '画像生成に失敗しました' });
    expect(mockConsoleError).toHaveBeenCalledWith('画像生成エラー:', mockError);
  });
});
