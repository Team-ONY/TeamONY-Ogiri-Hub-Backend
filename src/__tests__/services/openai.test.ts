import { generateImage } from '../../services/openai';

// OpenAIクライアントのモックを作成
const mockGenerate = jest.fn();
const mockOpenAIClient = {
  images: {
    generate: mockGenerate,
  },
};

// コンソールログとエラーのモック
const mockConsoleLog = jest.spyOn(console, 'log').mockImplementation(() => {});
const mockConsoleError = jest.spyOn(console, 'error').mockImplementation(() => {});

// OpenAIモジュールのモック
jest.mock('openai', () => {
  return {
    __esModule: true,
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

  afterAll(() => {
    mockConsoleLog.mockRestore();
    mockConsoleError.mockRestore();
  });

  it('画像URLを正常に生成できること', async () => {
    const result = await generateImage('テスト用プロンプト');
    expect(result).toBe('https://example.com/test.jpg');
    expect(mockGenerate).toHaveBeenCalledWith({
      model: 'dall-e-3',
      prompt: 'テスト用プロンプト',
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

  it('APIレート制限エラーの場合に適切なエラーメッセージを返すこと', async () => {
    const rateLimitError = new Error('Rate limit exceeded');
    Object.assign(rateLimitError, { status: 429 });
    mockGenerate.mockRejectedValue(rateLimitError);

    await expect(generateImage('テスト用プロンプト')).rejects.toThrow(
      'リクエストが多すぎます。しばらく待ってから再度お試しください。'
    );
  });

  it('APIサーバーエラーの場合に適切なエラーメッセージを返すこと', async () => {
    const serverError = new Error('Internal server error');
    Object.assign(serverError, { status: 500 });
    mockGenerate.mockRejectedValue(serverError);

    await expect(generateImage('テスト用プロンプト')).rejects.toThrow(
      'OpenAI APIでエラーが発生しました。しばらく待ってから再度お試しください。'
    );
  });
});
