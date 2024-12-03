import { generateImage } from '../../services/openai';

// OpenAIクライアントのモックを作成
const mockGenerate = jest.fn();
const mockOpenAIClient = {
  images: {
    generate: mockGenerate,
  },
};

// OpenAIモジュールのモック
jest.mock('openai', () => {
  return {
    __esModule: true, // ESModuleとしてマークする
    default: function () {
      return mockOpenAIClient;
    },
  };
});

describe('OpenAI Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // デフォルトの成功レスポンスを設定
    mockGenerate.mockResolvedValue({
      data: [{ url: 'https://example.com/test.jpg' }],
    });
  });

  it('画像URLを正常に生成できること', async () => {
    const result = await generateImage('テスト用プロンプト');
    expect(result).toBe('https://example.com/test.jpg');
    expect(mockGenerate).toHaveBeenCalledWith({
      model: 'dall-e-3',
      prompt: expect.stringContaining('テスト用プロンプト'),
      n: 1,
      size: '1024x1024',
      quality: 'hd',
      style: 'natural',
    });
  });

  it('URLが存在しない場合にエラーをスローすること', async () => {
    mockGenerate.mockResolvedValue({
      data: [{ url: null }],
    });

    await expect(generateImage('テスト用プロンプト')).rejects.toThrow(
      '画像URLの生成に失敗しました'
    );
    expect(mockGenerate).toHaveBeenCalled();
  });
});
