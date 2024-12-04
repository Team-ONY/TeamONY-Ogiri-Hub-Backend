import OpenAI from 'openai';
import env from '../config/env';

const createOpenAIClient = () => {
  console.log('Using API key type:', env.OPENAI_API_KEY?.substring(0, 7));

  return new OpenAI({
    apiKey: env.OPENAI_API_KEY,
  });
};

export const generateImage = async (prompt: string): Promise<string> => {
  try {
    const openai = createOpenAIClient();

    // リクエスト前に少し待機
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const response = await openai.images.generate({
      model: 'dall-e-3',
      prompt: prompt,
      n: 1,
      size: '1024x1024',
      quality: 'hd',
      style: 'natural',
    });

    if (!response.data[0]?.url) {
      throw new Error('画像URLの生成に失敗しました');
    }

    // レスポンス後に少し待機
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return response.data[0].url;
  } catch (err) {
    const error = err as Error & {
      type?: string;
      status?: number;
    };

    // より詳細なエラーメッセージを追加
    console.error('OpenAI API Error Details:', {
      error,
      message: error.message,
      type: error.type,
      status: error.status,
    });

    // エラーメッセージをより具体的に
    if (error.status === 429) {
      throw new Error('リクエストが多すぎます。しばらく待ってから再度お試しください。');
    } else if (error.status === 500) {
      throw new Error('OpenAI APIでエラーが発生しました。しばらく待ってから再度お試しください。');
    }

    throw error;
  }
};
